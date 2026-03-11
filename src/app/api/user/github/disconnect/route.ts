import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

/**
 * Disconnect GitHub account
 */
export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Remove GitHub tokens and info
    await kv.del(`user:${user.id}:github_token`);
    await kv.del(`user:${user.id}:github_connected`);
    await kv.del(`user:${user.id}:github_info`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting GitHub:', error);
    return NextResponse.json({ error: 'Failed to disconnect GitHub' }, { status: 500 });
  }
}
