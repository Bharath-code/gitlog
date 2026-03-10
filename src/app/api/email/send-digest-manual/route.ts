import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { kv } from '@vercel/kv';
import { sendEmail } from '@/lib/resend';
import { ReleaseEmailTemplate } from '@/features/email/templates/release-email';
import { render } from '@react-email/render';
import { getRepoSubscribers } from '@/features/email/subscription-manager';

/**
 * Manual Email Digest Trigger
 * Allows users to send digest emails to subscribers on-demand
 */

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { repoId, entryIds, sendToSubscribers } = body;

    if (!repoId || !entryIds || !sendToSubscribers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch entries
    const entries = [];
    for (const entryId of entryIds) {
      const entry = await kv.get<any>(entryId);
      if (entry && entry.status === 'published') {
        entries.push(entry);
      }
    }

    if (entries.length === 0) {
      return NextResponse.json(
        { error: 'No published entries found' },
        { status: 400 }
      );
    }

    // Get repo name
    const repo = await kv.get<any>(`repo:${userId}:${repoId}`);
    const repoName = repo?.name?.split('/')[1] || repoId;

    // Get subscribers
    const subscribers = await getRepoSubscribers(repoId);

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No subscribers to notify',
        sentCount: 0,
      });
    }

    // Generate email HTML
    const changelogUrl = `${process.env.NEXT_PUBLIC_APP_URL}/changelog/${userId}/${repoId}`;
    const emailHtml = render(
      ReleaseEmailTemplate({
        repoName,
        entries: entries.map(e => ({
          id: e.id,
          title: e.title,
          aiRewrite: e.aiRewrite || e.body,
          category: e.category,
          mergedAt: e.mergedAt,
          prUrl: e.prUrl,
        })),
        publishedAt: new Date().toISOString(),
        viewOnlineLink: changelogUrl,
        unsubscribeLink: `${process.env.NEXT_PUBLIC_APP_URL}/api/email/unsubscribe?repoId=${repoId}`,
      })
    );

    // Send to all subscribers
    let sentCount = 0;
    let failedCount = 0;

    for (const subscriber of subscribers) {
      try {
        await sendEmail({
          to: subscriber,
          subject: `🚀 ${entries.length} New Update${entries.length > 1 ? 's' : ''} from ${repoName}`,
          html: emailHtml,
        });
        sentCount++;
      } catch (error) {
        console.error(`Failed to send to ${subscriber}:`, error);
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      sentCount,
      failedCount,
      totalSubscribers: subscribers.length,
    });
  } catch (error) {
    console.error('Error sending digest:', error);
    return NextResponse.json(
      { error: 'Failed to send digest email' },
      { status: 500 }
    );
  }
}
