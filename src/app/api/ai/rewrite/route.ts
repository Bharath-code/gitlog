import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { rewritePR } from '@/shared/lib/ai/gemini';
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

    // Check plan and usage limits
    const plan = await kv.get<'free' | 'pro'>(`user:${user.id}:plan`) || 'free';
    
    if (plan === 'free') {
      const month = new Date().toISOString().slice(0, 7);
      const usage = await kv.get<{ aiRewrites: number }>(`usage:${user.id}:${month}`) || { aiRewrites: 0 };
      
      if (usage.aiRewrites >= pricing.free.aiRewritesPerMonth) {
        return NextResponse.json(
          { error: `Free plan limit reached (${pricing.free.aiRewritesPerMonth} rewrites/month). Upgrade to Pro for unlimited.` },
          { status: 403 }
        );
      }
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

    // Generate rewrite
    const aiRewrite = await rewritePR({
      title: entry.title,
      body: entry.body,
      labels: entry.labels || [],
    });

    // Update entry with rewrite
    await kv.hset(entryId, { aiRewrite });

    // Increment usage
    const month = new Date().toISOString().slice(0, 7);
    const usageKey = `usage:${user.id}:${month}`;
    const currentUsage = await kv.get<{ aiRewrites: number }>(usageKey) || { aiRewrites: 0 };
    await kv.set(usageKey, { aiRewrites: currentUsage.aiRewrites + 1 });

    return NextResponse.json({ aiRewrite });
  } catch (error) {
    console.error('AI rewrite error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI rewrite' },
      { status: 500 }
    );
  }
}
