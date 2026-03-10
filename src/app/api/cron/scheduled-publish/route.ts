import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { publishEntry } from '@/shared/lib/db/entry';
import { sendEmail } from '@/lib/resend';
import { ReleaseEmailTemplate } from '@/features/email/templates/release-email';
import { render } from '@react-email/render';

/**
 * Scheduled Publishing Cron Job
 * Runs daily at 9:00 AM UTC
 *
 * Vercel Cron Configuration:
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/scheduled-publish",
 *     "schedule": "0 9 * * *"
 *   }]
 * }
 */

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0-6 (Sunday-Saturday)
    const dayOfMonth = today.getDate(); // 1-31

    console.log(`Running scheduled publish cron: ${today.toISOString()}`);

    // Get all users with scheduled publishing
    const userKeys = await kv.keys('user:*');
    let publishedCount = 0;
    let emailCount = 0;

    for (const key of userKeys) {
      try {
        const user = await kv.get<any>(key);
        if (!user || !user.publishSchedule || user.publishSchedule === 'immediate') {
          continue;
        }

        const userId = user.id;
        const shouldPublish = shouldPublishToday(
          user.publishSchedule,
          user.scheduleDay,
          dayOfWeek,
          dayOfMonth
        );

        if (!shouldPublish) {
          continue;
        }

        // Get all drafts for this user
        const draftKeys = await kv.keys(`entry:${userId}:*:draft`);
        if (draftKeys.length === 0) {
          continue;
        }

        // Publish all drafts
        const entries = [];
        for (const draftKey of draftKeys) {
          const entry = await kv.get<any>(draftKey);
          if (entry) {
            await publishEntry(entry.id);
            entries.push(entry);
            publishedCount++;
          }
        }

        console.log(`Published ${entries.length} entries for user ${userId}`);

        // Send email digest if user has subscribers
        if (entries.length > 0 && user.email) {
          await sendEmailDigest(userId, user.email, entries);
          emailCount++;
        }
      } catch (error) {
        console.error(`Error processing user ${key}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      published: publishedCount,
      emailsSent: emailCount,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Failed to run scheduled publish' }, { status: 500 });
  }
}

function shouldPublishToday(
  schedule: 'weekly' | 'monthly',
  scheduleDay: number,
  dayOfWeek: number,
  dayOfMonth: number
): boolean {
  if (schedule === 'weekly') {
    return dayOfWeek === scheduleDay;
  }

  if (schedule === 'monthly') {
    // Handle end-of-month cases (e.g., 31st in a 30-day month)
    return (
      dayOfMonth === scheduleDay ||
      (dayOfMonth > scheduleDay && dayOfMonth === new Date().getDate())
    );
  }

  return false;
}

async function sendEmailDigest(userId: string, userEmail: string, entries: any[]) {
  try {
    // Get repo name from first entry
    const repoName = entries[0].repoId?.split('/')[1] || 'Your Product';
    const changelogUrl = `${process.env.NEXT_PUBLIC_APP_URL}/changelog/${userEmail}/${entries[0].repoId}`;

    const emailHtml = await render(
      ReleaseEmailTemplate({
        repoName,
        entries: entries.map((e) => ({
          id: e.id,
          title: e.title,
          aiRewrite: e.aiRewrite || e.body,
          category: e.category,
          mergedAt: e.mergedAt,
          prUrl: e.prUrl,
        })),
        publishedAt: new Date().toISOString(),
        viewOnlineLink: changelogUrl,
        unsubscribeLink: `${process.env.NEXT_PUBLIC_APP_URL}/api/email/unsubscribe?userId=${userId}`,
      })
    );

    await sendEmail({
      to: userEmail,
      subject: `🚀 ${entries.length} New Updates from ${repoName}`,
      html: emailHtml,
    });

    console.log(`Sent email digest to ${userEmail} with ${entries.length} entries`);
  } catch (error) {
    console.error('Error sending email digest:', error);
  }
}

// GET endpoint for manual testing
export async function GET(request: NextRequest) {
  // In production, only allow with proper auth
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Use POST with auth' }, { status: 403 });
  }

  // In development, run the cron manually
  return POST(request);
}
