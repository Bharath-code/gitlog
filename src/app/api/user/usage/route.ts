import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    const usage = await kv.get<{ entriesPublished: number; aiRewrites: number }>(
      `usage:${user.id}:${month}`
    ) || { entriesPublished: 0, aiRewrites: 0 };

    return NextResponse.json({ usage });
  } catch (error) {
    console.error('Usage fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage' },
      { status: 500 }
    );
  }
}
