import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getPublishedEntries } from '@/shared/lib/db/entry';

// GET /api/entries/published - Get published entries
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entries = await getPublishedEntries(user.id, 100);
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Fetch published error:', error);
    return NextResponse.json({ error: 'Failed to fetch published entries' }, { status: 500 });
  }
}
