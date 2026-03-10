import { kv } from '@vercel/kv';

export interface Release {
  id: string;
  userId: string;
  repoId: string;
  version: string; // e.g., "v1.2.0"
  title?: string;
  description?: string;
  entryIds: string[];
  publishedAt: string;
  isPublished: boolean;
  highlights?: string[];
  migrationGuide?: string;
}

/**
 * Create a new release grouping
 */
export async function createRelease(data: {
  userId: string;
  repoId: string;
  version: string;
  title?: string;
  description?: string;
  entryIds: string[];
  highlights?: string[];
  migrationGuide?: string;
}): Promise<Release> {
  const release: Release = {
    id: `release:${data.userId}:${data.repoId}:${data.version}`,
    userId: data.userId,
    repoId: data.repoId,
    version: data.version,
    title: data.title,
    description: data.description,
    entryIds: data.entryIds,
    publishedAt: new Date().toISOString(),
    isPublished: false,
    highlights: data.highlights,
    migrationGuide: data.migrationGuide,
  };

  await kv.set(release.id, release);

  // Link entries to release
  for (const entryId of data.entryIds) {
    await kv.hset(entryId, { releaseId: release.id });
  }

  return release;
}

/**
 * Get all releases for a repo
 */
export async function getReleases(userId: string, repoId: string): Promise<Release[]> {
  const keys = await kv.keys(`release:${userId}:${repoId}:*`);
  const releases = await Promise.all(keys.map((key) => kv.get<Release>(key)));
  return releases.filter((r): r is Release => r !== null);
}

/**
 * Publish a release
 */
export async function publishRelease(releaseId: string): Promise<void> {
  const release = await kv.get<Release>(releaseId);
  if (!release) {
    throw new Error('Release not found');
  }

  release.isPublished = true;
  release.publishedAt = new Date().toISOString();
  await kv.set(releaseId, release);

  // Publish all entries in the release
  for (const entryId of release.entryIds) {
    const entry = await kv.get<any>(entryId);
    if (entry) {
      entry.status = 'published';
      entry.publishedAt = release.publishedAt;
      entry.releaseId = release.id;
      await kv.set(entryId, entry);
    }
  }
}

/**
 * Add entries to an existing release
 */
export async function addEntriesToRelease(releaseId: string, entryIds: string[]): Promise<void> {
  const release = await kv.get<Release>(releaseId);
  if (!release) {
    throw new Error('Release not found');
  }

  release.entryIds = [...new Set([...release.entryIds, ...entryIds])];
  await kv.set(releaseId, release);

  // Link entries to release
  for (const entryId of entryIds) {
    await kv.hset(entryId, { releaseId: release.id });
  }
}

/**
 * Parse semantic version string
 */
export function parseVersion(
  version: string
): { major: number; minor: number; patch: number } | null {
  const match = version.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return null;
  }

  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3]),
  };
}

/**
 * Get next version based on change type
 */
export function getNextVersion(
  currentVersion: string,
  changeType: 'major' | 'minor' | 'patch'
): string {
  const current = parseVersion(currentVersion);
  if (!current) {
    return 'v1.0.0';
  }

  let { major, minor, patch } = current;

  switch (changeType) {
    case 'major':
      major++;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor++;
      patch = 0;
      break;
    case 'patch':
      patch++;
      break;
  }

  return `v${major}.${minor}.${patch}`;
}

/**
 * Auto-suggest version based on entries
 */
export function suggestVersion(entries: any[]): string {
  const hasBreaking = entries.some(
    (e) => e.labels?.includes('breaking') || e.labels?.includes('breaking-change')
  );

  const hasFeatures = entries.some(
    (e) => e.category === 'New' || e.labels?.includes('feat') || e.labels?.includes('feature')
  );

  if (hasBreaking) {
    return getNextVersion('v1.0.0', 'major');
  }

  if (hasFeatures) {
    return getNextVersion('v1.0.0', 'minor');
  }

  return getNextVersion('v1.0.0', 'patch');
}
