import { Octokit } from 'octokit';
import { kv } from '@vercel/kv';

const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_WEBHOOK_SECRET;

export interface RoadmapIssue {
  id: string;
  userId: string;
  repoId: string;
  issueId: number;
  title: string;
  body: string;
  status: 'planned' | 'in-progress' | 'completed';
  upvotes: number;
  voterIds: string[];
  githubIssueUrl: string;
  labels: string[];
  linkedEntryId?: string;
  createdAt: string;
  updatedAt: string;
}

export async function syncGitHubIssues(
  userId: string,
  repoId: string,
  owner: string,
  repo: string
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    if (!githubToken) {
      throw new Error('GitHub token not configured');
    }

    const octokit = new Octokit({ auth: githubToken });

    // Fetch issues with roadmap or enhancement labels
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      labels: 'roadmap,enhancement',
      sort: 'created',
      direction: 'desc',
    });

    let count = 0;

    for (const issue of issues) {
      // Skip pull requests
      if ('pull_request' in issue) continue;

      const roadmapItem: RoadmapIssue = {
        id: `roadmap_${issue.id}`,
        userId,
        repoId,
        issueId: issue.number,
        title: issue.title,
        body: issue.body || '',
        status: 'planned',
        upvotes: 0,
        voterIds: [],
        githubIssueUrl: issue.html_url,
        labels: issue.labels.map((l) => 
          typeof l === 'string' ? l : l.name
        ).filter(Boolean),
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
      };

      // Save to KV
      await kv.set(`roadmap:${userId}:${repoId}:${issue.number}`, roadmapItem);
      count++;
    }

    return { success: true, count };
  } catch (error) {
    console.error('Error syncing GitHub issues:', error);
    return { 
      success: false, 
      count: 0, 
      error: error instanceof Error ? error.message : 'Failed to sync' 
    };
  }
}

export async function getRoadmapItems(
  userId: string,
  repoId: string
): Promise<RoadmapItem[]> {
  try {
    const keys = await kv.keys(`roadmap:${userId}:${repoId}:*`);
    const items: RoadmapIssue[] = [];

    for (const key of keys) {
      const item = await kv.get<RoadmapIssue>(key);
      if (item) {
        items.push(item);
      }
    }

    // Sort by upvotes descending
    items.sort((a, b) => b.upvotes - a.upvotes);

    return items;
  } catch (error) {
    console.error('Error getting roadmap items:', error);
    return [];
  }
}

export async function updateRoadmapItemStatus(
  userId: string,
  repoId: string,
  issueId: number,
  status: 'planned' | 'in-progress' | 'completed'
): Promise<{ success: boolean; error?: string }> {
  try {
    const key = `roadmap:${userId}:${repoId}:${issueId}`;
    const item = await kv.get<RoadmapIssue>(key);

    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    item.status = status;
    item.updatedAt = new Date().toISOString();

    await kv.set(key, item);

    return { success: true };
  } catch (error) {
    console.error('Error updating roadmap item:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

export async function linkRoadmapToChangelog(
  userId: string,
  repoId: string,
  issueId: number,
  entryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const key = `roadmap:${userId}:${repoId}:${issueId}`;
    const item = await kv.get<RoadmapIssue>(key);

    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    item.linkedEntryId = entryId;
    item.status = 'completed';
    item.updatedAt = new Date().toISOString();

    await kv.set(key, item);

    return { success: true };
  } catch (error) {
    console.error('Error linking roadmap to changelog:', error);
    return { success: false, error: 'Failed to link' };
  }
}
