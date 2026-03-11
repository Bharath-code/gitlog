import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

/**
 * Get GitHub connection status for current user
 */
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const githubConnected = await kv.get<boolean>(`user:${user.id}:github_connected`);
    const githubInfo = await kv.get<{ username: string; avatar: string; connectedAt: string }>(
      `user:${user.id}:github_info`
    );

    return NextResponse.json({
      connected: !!githubConnected,
      info: githubInfo || null,
    });
  } catch (error) {
    console.error('Error fetching GitHub status:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub status' }, { status: 500 });
  }
}
