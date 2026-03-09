import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { syncManualPRs } from '@/features/drafts/lib/sync';
import { getConnectedRepos } from '@/shared/lib/db/repo';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { repoId } = await req.json();
    
    // Get GitHub token
    const githubToken = await kv.get<string>(`user:${user.id}:github_token`);
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub account not connected. Please sign in with GitHub.' },
        { status: 400 }
      );
    }

    // Get connected repos
    const repos = await getConnectedRepos(user.id);
    
    if (repos.length === 0) {
      return NextResponse.json(
        { error: 'No repositories connected. Please connect a repository first.' },
        { status: 400 }
      );
    }

    // Sync specific repo or all repos
    let totalSynced = 0;
    const reposToSync = repoId 
      ? repos.filter(r => r.id === repoId)
      : repos;

    for (const repo of reposToSync) {
      const result = await syncManualPRs(user.id, repo.name, githubToken);
      totalSynced += result.synced;
    }

    return NextResponse.json({ 
      success: true, 
      synced: totalSynced,
      message: `Successfully synced ${totalSynced} merged PR${totalSynced !== 1 ? 's' : ''}`
    });
  } catch (error) {
    console.error('Manual sync error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sync repositories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
