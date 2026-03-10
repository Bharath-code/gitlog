import { kv } from '@vercel/kv';
import { categorizePR } from './categorization';

interface PullRequestPayload {
  pull_request: {
    id: number;
    title: string;
    body: string | null;
    merged: boolean;
    merged_at: string | null;
    html_url: string;
    user: {
      login: string;
    } | null;
    labels: Array<
      | {
          name: string;
        }
      | string
    >;
    base: {
      repo: {
        full_name: string;
        owner: {
          login: string;
        };
      };
    };
    head: {
      sha: string;
    };
  };
  repository: {
    full_name: string;
    owner: {
      login: string;
    };
  };
}

export async function handleMergedPR(data: PullRequestPayload) {
  const pr = data.pull_request;
  const repoName = data.repository.full_name;

  // Find all users connected to this repo
  const userConnections = await findUsersForRepo(repoName);

  if (userConnections.length === 0) {
    console.log('No users connected to repo:', repoName);
    return;
  }

  // Process for each connected user
  for (const userId of userConnections) {
    await processPRForUser(userId, repoName, pr);
  }
}

async function findUsersForRepo(repoName: string): Promise<string[]> {
  // Find all users who have this repo connected
  const pattern = `repo:${repoName}:users:*`;
  const keys = await kv.keys(pattern);

  const users: string[] = [];
  for (const key of keys) {
    // Extract userId from key: repo:owner/repo:users:userId
    const parts = key.split(':');
    const userId = parts[parts.length - 1];
    if (userId) {
      users.push(userId);
    }
  }

  return users;
}

async function processPRForUser(
  userId: string,
  repoName: string,
  pr: PullRequestPayload['pull_request']
) {
  // Categorize PR based on labels
  const category = categorizePR(pr.labels);

  // Create entry ID
  const entryId = `entry:${userId}:${repoName}:${pr.id}`;

  // Check if entry already exists
  const existing = await kv.get<any>(entryId);
  if (existing) {
    console.log('Entry already exists:', entryId);
    return;
  }

  // Create draft entry
  const entry = {
    id: entryId,
    userId,
    repoId: repoName,
    prId: pr.id,
    title: pr.title,
    body: pr.body || '',
    category,
    status: 'draft' as const,
    mergedAt: pr.merged_at || new Date().toISOString(),
    publishedAt: undefined,
    prUrl: pr.html_url,
    author: pr.user?.login || 'unknown',
    aiRewrite: null,
    labels: pr.labels.map((l) => (typeof l === 'string' ? l : l.name)),
    createdAt: new Date().toISOString(),
  };

  // Store entry
  await kv.set(entryId, entry);

  // Add to user's draft index
  const draftIndexKey = `user:${userId}:drafts`;
  await kv.lpush(draftIndexKey, entryId);
  await kv.expire(draftIndexKey, 2592000); // 30 days TTL

  // Increment monthly usage
  await incrementMonthlyUsage(userId, 'entriesPublished');

  console.log('Created draft entry:', entryId);
}

async function incrementMonthlyUsage(userId: string, type: 'entriesPublished' | 'aiRewrites') {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const key = `usage:${userId}:${month}`;

  const current = (await kv.get<{ entriesPublished: number; aiRewrites: number }>(key)) || {
    entriesPublished: 0,
    aiRewrites: 0,
  };

  await kv.set(key, {
    ...current,
    [type]: current[type] + 1,
  });
}

export async function syncManualPRs(userId: string, repoName: string, githubToken: string) {
  // This will be called from the manual sync button
  // Fetch recent merged PRs from GitHub
  const [owner, repo] = repoName.split('/');

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&per_page=50`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const prs = await response.json();
    const mergedPRs = prs.filter((pr: any) => pr.merged_at !== null);

    let synced = 0;
    for (const pr of mergedPRs) {
      // Check if already exists
      const entryId = `entry:${userId}:${repoName}:${pr.id}`;
      const exists = await kv.get(entryId);

      if (!exists) {
        await processPRForUser(userId, repoName, {
          id: pr.id,
          title: pr.title,
          body: pr.body,
          merged: true,
          merged_at: pr.merged_at,
          html_url: pr.html_url,
          user: { login: pr.user?.login || 'unknown' },
          labels: pr.labels || [],
          base: { repo: { full_name: repoName, owner: { login: owner } } },
          head: { sha: pr.head.sha },
        });
        synced++;
      }
    }

    return { synced };
  } catch (error) {
    console.error('Manual sync error:', error);
    throw error;
  }
}
