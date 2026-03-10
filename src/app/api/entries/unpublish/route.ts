import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { unpublishEntry } from '@/shared/lib/db/entry';

// POST /api/entries/unpublish - Unpublish an entry (revert to draft)
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { entryId } = await req.json();

    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID required' }, { status: 400 });
    }

    await unpublishEntry(entryId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unpublish error:', error);
    return NextResponse.json({ error: 'Failed to unpublish entry' }, { status: 500 });
  }
}
