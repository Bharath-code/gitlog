import { NextRequest, NextResponse } from 'next/server';
import { trackPageView } from '@/features/analytics/page-view-tracker';
import { trackVisitor, generateVisitorId, getVisitorIdFromCookie } from '@/features/analytics/visitor-tracker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entryId } = body;

    if (!entryId) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    // Get or generate visitor ID
    const cookieHeader = request.headers.get('cookie');
    let visitorId = getVisitorIdFromCookie(cookieHeader);
    
    if (!visitorId) {
      const userAgent = request.headers.get('user-agent') || '';
      const ip = request.headers.get('x-forwarded-for') || '';
      visitorId = generateVisitorId(userAgent, ip);
    }

    // Track page view
    await trackPageView(entryId, visitorId);
    
    // Track visitor
    await trackVisitor(visitorId, entryId);

    // Create response with visitor cookie
    const response = NextResponse.json({ success: true });
    
    // Set visitor ID cookie (expires in 1 year)
    response.cookies.set('visitor_id', visitorId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}
