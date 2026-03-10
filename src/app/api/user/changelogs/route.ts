import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Get all repos for this user
    const keys = await kv.keys(`repo:${username}:*`);
    const repos: Array<{ name: string; entryCount: number }> = [];

    for (const key of keys) {
      const repo = await kv.get<any>(key);
      if (repo) {
        // Count published entries for this repo
        const entryKeys = await kv.keys(`entry:*:${repo.name}:*`);
        let entryCount = 0;

        for (const entryKey of entryKeys) {
          const entry = await kv.get<any>(entryKey);
          if (entry && entry.status === 'published') {
            entryCount++;
          }
        }

        if (entryCount > 0) {
          repos.push({
            name: repo.name.split('/')[1] || repo.name,
            entryCount,
          });
        }
      }
    }

    // Sort by entry count
    repos.sort((a, b) => b.entryCount - a.entryCount);

    return NextResponse.json({ repos });
  } catch (error) {
    console.error('Error fetching user repos:', error);
    return NextResponse.json({ error: 'Failed to fetch repos' }, { status: 500 });
  }
}
