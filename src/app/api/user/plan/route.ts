import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// GET /api/user/plan - Get user's current plan
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plan = await kv.get<'free' | 'pro'>(`user:${user.id}:plan`) || 'free';
    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Fetch plan error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan' },
      { status: 500 }
    );
  }
}
