import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getUserRepos } from '@/shared/lib/github/client';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get GitHub token from Clerk
    const githubToken = await kv.get<string>(`user:${user.id}:github_token`);
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub account not connected' }, 
        { status: 400 }
      );
    }

    const repos = await getUserRepos(githubToken);
    return NextResponse.json({ repos });
  } catch (error) {
    console.error('Error fetching repos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
