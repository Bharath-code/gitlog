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

    const { entryIds } = await req.json();

    if (!entryIds || !Array.isArray(entryIds)) {
      return NextResponse.json({ error: 'entryIds array required' }, { status: 400 });
    }

    // Check plan limits
    const month = new Date().toISOString().slice(0, 7);
    const usage = (await kv.get<{ entriesPublished: number }>(`usage:${user.id}:${month}`)) || {
      entriesPublished: 0,
    };
    const plan = (await kv.get<'free' | 'pro'>(`user:${user.id}:plan`)) || 'free';
    const limit = pricing[plan].entriesPerMonth;

    // Check if batch would exceed limit
    if (plan === 'free' && usage.entriesPublished + entryIds.length > limit) {
      return NextResponse.json(
        {
          error: `Batch would exceed free plan limit (${limit} entries/month). Current: ${usage.entriesPublished}, Attempting: ${entryIds.length}`,
          upgrade: true,
        },
        { status: 403 }
      );
    }

    // Publish each entry
    const results = [];
    for (const id of entryIds) {
      try {
        const entry = await kv.get<any>(id);
        if (!entry) {
          results.push({ id, success: false, error: 'Entry not found' });
          continue;
        }

        if (entry.userId !== user.id) {
          results.push({ id, success: false, error: 'Not authorized' });
          continue;
        }

        await publishEntry(id);
        results.push({ id, success: true });
      } catch (error) {
        results.push({ id, success: false, error: 'Failed to publish' });
      }
    }

    // Update usage
    const successfulPublishes = results.filter((r) => r.success).length;
    if (successfulPublishes > 0) {
      await kv.set(`usage:${user.id}:${month}`, {
        entriesPublished: usage.entriesPublished + successfulPublishes,
      });
    }

    return NextResponse.json({
      results,
      published: successfulPublishes,
      failed: entryIds.length - successfulPublishes,
    });
  } catch (error) {
    console.error('Batch publish error:', error);
    return NextResponse.json({ error: 'Failed to publish entries' }, { status: 500 });
  }
}
