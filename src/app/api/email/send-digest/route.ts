import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { kv } from '@vercel/kv';
import { sendEmail } from '@/lib/resend';
import { getRepoSubscribers } from '@/features/email/subscription-manager';
import { ReleaseEmailTemplate } from '@/features/email/templates/release-email';
import { render } from '@react-email/render';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { repoId, entries, repoName } = body;

    if (!repoId || !entries || !repoName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get subscribers for this repo
    const subscribers = await getRepoSubscribers(repoId);
    
    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No subscribers to notify',
        sentCount: 0,
      });
    }

    // Generate email HTML
    const viewOnlineLink = `${process.env.NEXT_PUBLIC_APP_URL}/changelog/${userId}/${repoId}`;
    const unsubscribeLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/unsubscribe?repoId=${repoId}`;

    const emailHtml = render(
      ReleaseEmailTemplate({
        repoName,
        entries,
        publishedAt: new Date().toISOString(),
        viewOnlineLink,
        unsubscribeLink,
      })
    );

    // Send emails to all subscribers
    const results = [];
    for (const subscriber of subscribers) {
      try {
        await sendEmail({
          to: subscriber,
          subject: `🚀 New updates from ${repoName}`,
          html: emailHtml,
        });
        results.push({ email: subscriber, success: true });
      } catch (error) {
        console.error(`Failed to send to ${subscriber}:`, error);
        results.push({ email: subscriber, success: false });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${successCount} subscribers`,
      sentCount: successCount,
      totalCount: subscribers.length,
    });
  } catch (error) {
    console.error('Error sending digest email:', error);
    return NextResponse.json(
      { error: 'Failed to send digest emails' },
      { status: 500 }
    );
  }
}
