import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { generateVisitorId, getVisitorIdFromCookie } from '@/features/analytics/visitor-tracker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roadmapId } = body;

    if (!roadmapId) {
      return NextResponse.json({ error: 'Roadmap item ID is required' }, { status: 400 });
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
    const voteKey = `roadmap:upvotes:${roadmapId}:voters`;
    const hasVoted = await kv.sismember(voteKey, visitorId);

    if (hasVoted) {
      return NextResponse.json({ error: 'Already upvoted this item' }, { status: 400 });
    }

    // Increment upvote count
    const upvoteKey = `roadmap:upvotes:${roadmapId}`;
    await kv.incr(upvoteKey);

    // Add voter to set
    await kv.sadd(voteKey, visitorId);

    // Update the roadmap item
    const roadmapKey = roadmapId; // Full key from client
    const item = await kv.get<any>(roadmapKey);

    if (item) {
      item.upvotes = (item.upvotes || 0) + 1;
      await kv.set(roadmapKey, item);
    }

    // Get new vote count
    const votes = (await kv.get<number>(upvoteKey)) || 0;

    // Create response with visitor cookie
    const response = NextResponse.json({
      success: true,
      votes: item?.upvotes || votes,
    });

    // Set visitor ID cookie (expires in 1 year)
    response.cookies.set('visitor_id', visitorId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Error handling roadmap upvote:', error);
    return NextResponse.json({ error: 'Failed to process upvote' }, { status: 500 });
  }
}
