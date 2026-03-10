import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { kv } from '@vercel/kv';
import { generateTwitterThread } from '@/features/social/twitter-thread-generator';
import { generateLinkedInPost } from '@/features/social/linkedin-post-generator';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { entryId, title, description, category, platform, tone } = body;

    if (!entryId || !title || !platform) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let generatedContent;

    if (platform === 'twitter') {
      generatedContent = await generateTwitterThread(
        title,
        description || '',
        category || 'Other',
        tone || 'professional'
      );
    } else if (platform === 'linkedin') {
      generatedContent = await generateLinkedInPost(title, description || '', category || 'Other');
    } else {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    // Save to KV
    const socialKey = `social:${userId}:${entryId}:${platform}`;
    await kv.set(socialKey, {
      id: `${platform}_${Date.now()}`,
      entryId,
      userId,
      platform,
      ...generatedContent,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: generatedContent,
    });
  } catch (error) {
    console.error('Error generating social post:', error);
    return NextResponse.json({ error: 'Failed to generate social post' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('entryId');

    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    // Get Twitter draft
    const twitterKey = `social:${userId}:${entryId}:twitter`;
    const twitterDraft = await kv.get(twitterKey);

    // Get LinkedIn draft
    const linkedinKey = `social:${userId}:${entryId}:linkedin`;
    const linkedinDraft = await kv.get(linkedinKey);

    return NextResponse.json({
      success: true,
      twitter: twitterDraft,
      linkedin: linkedinDraft,
    });
  } catch (error) {
    console.error('Error fetching social posts:', error);
    return NextResponse.json({ error: 'Failed to fetch social posts' }, { status: 500 });
  }
}
