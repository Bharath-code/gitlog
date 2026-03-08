import { kv } from '@vercel/kv';

export interface ConnectedRepo {
  id: string;
  userId: string;
  githubRepoId: number;
  name: string; // "owner/repo"
  slug: string; // url-safe version
  isPrivate: boolean;
  connectedAt: string;
  webhookId?: number;
}

export async function getConnectedRepos(userId: string): Promise<ConnectedRepo[]> {
  const keys = await kv.keys(`repo:${userId}:*`);
  if (keys.length === 0) return [];
  
  const repos = await Promise.all(
    keys.map(key => kv.get<ConnectedRepo>(key))
  );
  
  return repos.filter((repo): repo is ConnectedRepo => repo !== null);
}

export async function connectRepo(repo: ConnectedRepo): Promise<void> {
  await kv.set(`repo:${repo.userId}:${repo.id}`, repo);
  await kv.set(`repo:${repo.name}:users:${repo.userId}`, true);
}

export async function disconnectRepo(userId: string, repoId: string): Promise<void> {
  const repo = await kv.get<ConnectedRepo>(`repo:${userId}:${repoId}`);
  if (repo) {
    await kv.del(`repo:${userId}:${repoId}`);
    await kv.del(`repo:${repo.name}:users:${userId}`);
  }
}

export async function getRepoBySlug(repoSlug: string): Promise<ConnectedRepo | null> {
  // This requires an index - for now we'll search through user connections
  // In production, you'd maintain a separate index
  const keys = await kv.keys(`repo:*:users:*`);
  for (const key of keys) {
    const parts = key.split(':');
    const userId = parts[1];
    const exists = await kv.get(`repo:${repoSlug}:users:${userId}`);
    if (exists) {
      const repos = await getConnectedRepos(userId);
      const repo = repos.find(r => r.name === repoSlug);
      if (repo) return repo;
    }
  }
  return null;
}
