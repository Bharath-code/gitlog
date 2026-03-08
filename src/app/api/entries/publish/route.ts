import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { publishEntry } from '@/shared/lib/db/entry';
import { pricing } from '@/shared/config';

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

    // Fetch entry
    const entry = await kv.get<any>(entryId);
    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Verify ownership
    if (entry.userId !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Check plan limits
    const plan = await kv.get<'free' | 'pro'>(`user:${user.id}:plan`) || 'free';
    
    if (plan === 'free') {
      const month = new Date().toISOString().slice(0, 7);
      const usage = await kv.get<{ entriesPublished: number }>(`usage:${user.id}:${month}`) || { entriesPublished: 0 };
      
      if (usage.entriesPublished >= pricing.free.entriesPerMonth) {
        return NextResponse.json(
          { 
            error: `Free plan limit reached (${pricing.free.entriesPerMonth} entries/month)`,
            upgrade: true,
          },
          { status: 403 }
        );
      }
      
      // Increment usage
      await kv.set(`usage:${user.id}:${month}`, { 
        entriesPublished: usage.entriesPublished + 1 
      });
    }

    // Publish the entry
    await publishEntry(entryId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: 'Failed to publish entry' },
      { status: 500 }
    );
  }
}
