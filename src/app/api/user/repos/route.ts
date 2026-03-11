import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { getConnectedRepos } from '@/shared/lib/db/repo';

/**
 * Get user's connected repositories
 */
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const repos = await getConnectedRepos(user.id);

    return NextResponse.json({ repos });
  } catch (error) {
    console.error('Error fetching connected repos:', error);
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}
