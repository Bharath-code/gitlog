import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { generateVisitorId, getVisitorIdFromCookie } from '@/features/analytics/visitor-tracker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entryId } = body;

    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    // Get or generate visitor ID
    const cookieHeader = request.headers.get('cookie');
    let visitorId = getVisitorIdFromCookie(cookieHeader || undefined);

    if (!visitorId) {
      const userAgent = request.headers.get('user-agent') || '';
      const ip = request.headers.get('x-forwarded-for') || '';
      visitorId = generateVisitorId(userAgent, ip);
    }

    // Check if already voted
    const voteKey = `analytics:upvotes:${entryId}:voters`;
    const hasVoted = await kv.sismember(voteKey, visitorId);

    if (hasVoted) {
      return NextResponse.json({ error: 'Already voted' }, { status: 400 });
    }

    // Increment upvote count
    const upvoteKey = `analytics:upvotes:${entryId}`;
    await kv.incr(upvoteKey);

    // Add voter to set
    await kv.sadd(voteKey, visitorId);

    // Get new vote count
    const votes = (await kv.get<number>(upvoteKey)) || 0;

    // Create response with visitor cookie
    const response = NextResponse.json({
      success: true,
      votes,
    });

    // Set visitor ID cookie (expires in 1 year)
    response.cookies.set('visitor_id', visitorId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Error handling upvote:', error);
    return NextResponse.json({ error: 'Failed to process upvote' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('entryId');

    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    // Get upvote count
    const upvoteKey = `analytics:upvotes:${entryId}`;
    const votes = (await kv.get<number>(upvoteKey)) || 0;

    return NextResponse.json({
      success: true,
      votes,
    });
  } catch (error) {
    console.error('Error getting upvotes:', error);
    return NextResponse.json({ error: 'Failed to get upvotes' }, { status: 500 });
  }
}
