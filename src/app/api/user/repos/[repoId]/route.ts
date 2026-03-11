import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { disconnectRepo } from '@/shared/lib/db/repo';

/**
 * Disconnect a repository
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ repoId: string }> }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { repoId } = await params;

    await disconnectRepo(user.id, repoId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting repo:', error);
    return NextResponse.json({ error: 'Failed to disconnect repository' }, { status: 500 });
  }
}
