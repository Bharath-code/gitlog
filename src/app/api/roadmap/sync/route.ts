import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { syncGitHubIssues, getRoadmapItems, updateRoadmapItemStatus } from '@/features/roadmap/issues-sync';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { repoId, owner, repo, action, issueId, status } = body;

    if (!repoId) {
      return NextResponse.json(
        { error: 'Repository ID is required' },
        { status: 400 }
      );
    }

    // Sync GitHub issues
    if (action === 'sync') {
      if (!owner || !repo) {
        return NextResponse.json(
          { error: 'Owner and repo are required for sync' },
          { status: 400 }
        );
      }

      const result = await syncGitHubIssues(userId, repoId, owner, repo);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Synced ${result.count} issues`,
        count: result.count,
      });
    }

    // Update item status
    if (action === 'updateStatus' && issueId && status) {
      const result = await updateRoadmapItemStatus(
        userId,
        repoId,
        issueId,
        status
      );

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error handling roadmap request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const repoId = searchParams.get('repoId');

    if (!repoId) {
      return NextResponse.json(
        { error: 'Repository ID is required' },
        { status: 400 }
      );
    }

    const items = await getRoadmapItems(userId, repoId);

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error('Error getting roadmap items:', error);
    return NextResponse.json(
      { error: 'Failed to get roadmap items' },
      { status: 500 }
    );
  }
}
