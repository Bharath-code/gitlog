import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getDrafts } from '@/shared/lib/db/entry';

// GET /api/drafts - Get all drafts
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const drafts = await getDrafts(user.id, 100);
    return NextResponse.json({ drafts });
  } catch (error) {
    console.error('Fetch drafts error:', error);
    return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 });
  }
}
