import { kv } from '@vercel/kv';

export type EntryCategory = 'New' | 'Fixed' | 'Improved' | 'Other';
export type EntryStatus = 'draft' | 'published';

export interface ChangelogEntry {
  id: string;
  userId: string;
  repoId: string;
  prId: number;
  title: string;
  body: string;
  category: EntryCategory;
  status: EntryStatus;
  mergedAt: string;
  publishedAt?: string;
  prUrl: string;
  author: string;
  aiRewrite?: string | null;
  labels: string[];
}

export async function getDrafts(userId: string, limit = 20): Promise<ChangelogEntry[]> {
  const keys = await kv.keys(`entry:${userId}:*`);
  const entries = await Promise.all(
    keys.map(key => kv.get<ChangelogEntry>(key))
  );
  
  return entries
    .filter((e): e is ChangelogEntry => e !== null && e.status === 'draft')
    .sort((a, b) => new Date(b.mergedAt).getTime() - new Date(a.mergedAt).getTime())
    .slice(0, limit);
}

export async function getPublishedEntries(userId: string, limit = 50): Promise<ChangelogEntry[]> {
  const keys = await kv.keys(`entry:${userId}:*`);
  const entries = await Promise.all(
    keys.map(key => kv.get<ChangelogEntry>(key))
  );
  
  return entries
    .filter((e): e is ChangelogEntry => e !== null && e.status === 'published')
    .sort((a, b) => new Date(b.publishedAt || b.mergedAt).getTime() - new Date(a.publishedAt || a.mergedAt).getTime())
    .slice(0, limit);
}

export async function getEntry(entryId: string): Promise<ChangelogEntry | null> {
  return await kv.get<ChangelogEntry>(entryId);
}

export async function createEntry(entry: ChangelogEntry): Promise<void> {
  await kv.set(entry.id, entry);
}

export async function updateEntry(entryId: string, updates: Partial<ChangelogEntry>): Promise<void> {
  const existing = await getEntry(entryId);
  if (!existing) throw new Error('Entry not found');
  
  await kv.set(entryId, { ...existing, ...updates });
}

export async function publishEntry(entryId: string): Promise<void> {
  await updateEntry(entryId, {
    status: 'published',
    publishedAt: new Date().toISOString(),
  });
}

export async function unpublishEntry(entryId: string): Promise<void> {
  await updateEntry(entryId, {
    status: 'draft',
    publishedAt: undefined,
  });
}

export async function deleteEntry(entryId: string): Promise<void> {
  await kv.del(entryId);
}

export async function getEntriesByRepo(repoId: string): Promise<ChangelogEntry[]> {
  // This requires scanning - in production use better indexing
  const keys = await kv.keys(`entry:*:${repoId}:*`);
  const entries = await Promise.all(
    keys.map(key => kv.get<ChangelogEntry>(key))
  );
  
  return entries
    .filter((e): e is ChangelogEntry => e !== null)
    .sort((a, b) => new Date(b.publishedAt || b.mergedAt).getTime() - new Date(a.publishedAt || a.mergedAt).getTime());
}
