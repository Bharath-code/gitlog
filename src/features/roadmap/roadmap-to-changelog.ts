import { kv } from '@vercel/kv';
import { sendEmail } from '@/lib/resend';
import { ReleaseEmailTemplate } from '@/features/email/templates/release-email';
import { render } from '@react-email/render';
import { getRepoSubscribers } from '@/features/email/subscription-manager';

export async function moveRoadmapToChangelog(
  userId: string,
  repoId: string,
  issueId: number,
  entryData: {
    title: string;
    body: string;
    category: 'New' | 'Fixed' | 'Improved' | 'Other';
    prUrl: string;
  }
): Promise<{ success: boolean; entryId?: string; error?: string }> {
  try {
    // Create changelog entry
    const entryId = `entry_${Date.now()}`;
    const entry = {
      id: entryId,
      userId,
      repoId,
      prId: issueId,
      title: entryData.title,
      body: entryData.body,
      category: entryData.category,
      status: 'published' as const,
      mergedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      prUrl: entryData.prUrl,
      author: 'GitLog',
      labels: ['roadmap', 'completed'],
    };

    // Save to KV
    await kv.set(`entry:${userId}:${repoId}:${issueId}`, entry);

    // Update roadmap item
    const roadmapKey = `roadmap:${userId}:${repoId}:${issueId}`;
    const roadmapItem = await kv.get<any>(roadmapKey);

    if (roadmapItem) {
      roadmapItem.status = 'completed';
      roadmapItem.linkedEntryId = entryId;
      roadmapItem.updatedAt = new Date().toISOString();
      await kv.set(roadmapKey, roadmapItem);
    }

    // Notify subscribers (optional)
    await notifySubscribers(userId, repoId, entry);

    return { success: true, entryId };
  } catch (error) {
    console.error('Error moving roadmap to changelog:', error);
    return { success: false, error: 'Failed to move to changelog' };
  }
}

async function notifySubscribers(userId: string, repoId: string, entry: any) {
  try {
    // Get subscribers
    const subscribers = await getRepoSubscribers(repoId);

    if (subscribers.length === 0) return;

    // Generate email
    const viewOnlineLink = `${process.env.NEXT_PUBLIC_APP_URL}/changelog/${userId}/${repoId}`;
    const unsubscribeLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/unsubscribe?repoId=${repoId}`;

    const emailHtml = await render(
      ReleaseEmailTemplate({
        repoName: repoId.split('/').pop() || 'Product',
        entries: [entry],
        publishedAt: new Date().toISOString(),
        viewOnlineLink,
        unsubscribeLink,
      })
    );

    // Send to all subscribers
    for (const email of subscribers) {
      try {
        await sendEmail({
          to: email,
          subject: `🎉 Roadmap Complete: ${entry.title}`,
          html: emailHtml,
        });
      } catch (error) {
        console.error(`Failed to send to ${email}:`, error);
      }
    }
  } catch (error) {
    console.error('Error notifying subscribers:', error);
    // Don't throw - this is optional
  }
}

export async function autoSyncClosedIssues(
  userId: string,
  repoId: string,
  owner: string,
  repo: string,
  closedIssueId: number
): Promise<{ success: boolean; moved: boolean }> {
  try {
    // Check if this issue is in roadmap
    const roadmapKey = `roadmap:${userId}:${repoId}:${closedIssueId}`;
    const roadmapItem = await kv.get<any>(roadmapKey);

    if (!roadmapItem) {
      return { success: true, moved: false }; // Not a roadmap item
    }

    // If status is not already completed, move to changelog
    if (roadmapItem.status !== 'completed') {
      await moveRoadmapToChangelog(userId, repoId, closedIssueId, {
        title: roadmapItem.title,
        body: roadmapItem.body,
        category: 'New', // Default category
        prUrl: roadmapItem.githubIssueUrl,
      });

      return { success: true, moved: true };
    }

    return { success: true, moved: false };
  } catch (error) {
    console.error('Error auto-syncing closed issues:', error);
    return { success: false, moved: false };
  }
}
