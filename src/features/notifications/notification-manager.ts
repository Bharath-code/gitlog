import { kv } from '@vercel/kv';

export interface NotificationConfig {
  id: string;
  userId: string;
  repoId?: string;
  type: 'slack' | 'discord';
  webhookUrl: string;
  isActive: boolean;
  events: {
    onPublish: boolean;
    onScheduled: boolean;
    onRelease: boolean;
  };
  createdAt: string;
}

/**
 * Create notification integration
 */
export async function createNotification(config: {
  userId: string;
  repoId?: string;
  type: 'slack' | 'discord';
  webhookUrl: string;
  events?: {
    onPublish: boolean;
    onScheduled: boolean;
    onRelease: boolean;
  };
}): Promise<NotificationConfig> {
  const notification: NotificationConfig = {
    id: `notification:${config.userId}:${Date.now()}`,
    userId: config.userId,
    repoId: config.repoId,
    type: config.type,
    webhookUrl: config.webhookUrl,
    isActive: true,
    events: {
      onPublish: true,
      onScheduled: config.events?.onScheduled || false,
      onRelease: config.events?.onRelease || false,
    },
    createdAt: new Date().toISOString(),
  };

  await kv.set(notification.id, notification);
  await kv.sadd(`user:${config.userId}:notifications`, notification.id);

  return notification;
}

/**
 * Get all notifications for a user
 */
export async function getUserNotifications(userId: string): Promise<NotificationConfig[]> {
  const notificationIds = await kv.smembers(`user:${userId}:notifications`);
  const notifications = await Promise.all(
    notificationIds.map(id => kv.get<NotificationConfig>(id))
  );
  return notifications.filter((n): n is NotificationConfig => n !== null && n.isActive);
}

/**
 * Delete notification
 */
export async function deleteNotification(userId: string, notificationId: string): Promise<void> {
  const notification = await kv.get<NotificationConfig>(notificationId);
  if (!notification || notification.userId !== userId) {
    throw new Error('Notification not found');
  }

  notification.isActive = false;
  await kv.set(notificationId, notification);
  await kv.srem(`user:${userId}:notifications`, notificationId);
}

/**
 * Send Slack message
 */
export async function sendSlackMessage(webhookUrl: string, message: {
  title: string;
  text: string;
  entries?: Array<{ title: string; category: string }>;
  changelogUrl?: string;
}): Promise<boolean> {
  try {
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: message.title,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message.text,
        },
      },
    ];

    if (message.entries && message.entries.length > 0) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Recent Updates:*\n' + message.entries.map(e => `• ${e.title} (${e.category})`).join('\n'),
        },
      });
    }

    if (message.changelogUrl) {
      blocks.push({
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Changelog',
              emoji: true,
            },
            url: message.changelogUrl,
          },
        ],
      });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending Slack message:', error);
    return false;
  }
}

/**
 * Send Discord message
 */
export async function sendDiscordMessage(webhookUrl: string, message: {
  title: string;
  text: string;
  entries?: Array<{ title: string; category: string }>;
  changelogUrl?: string;
}): Promise<boolean> {
  try {
    const embeds = [
      {
        title: message.title,
        description: message.text,
        color: 0xff6b35, // GitLog orange
        fields: [] as Array<{ name: string; value: string; inline: boolean }>,
      },
    ];

    if (message.entries && message.entries.length > 0) {
      embeds[0].fields = message.entries.map(e => ({
        name: e.category,
        value: e.title,
        inline: false,
      }));
    }

    if (message.changelogUrl) {
      embeds[0].footer = {
        text: 'View Changelog',
      };
      embeds[0].url = message.changelogUrl;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending Discord message:', error);
    return false;
  }
}

/**
 * Send notification when entries are published
 */
export async function notifyOnPublish(
  userId: string,
  entries: Array<{ title: string; category: string }>,
  changelogUrl: string
): Promise<void> {
  const notifications = await getUserNotifications(userId);

  const message = {
    title: '🚀 New Changelog Entries Published',
    text: `${entries.length} new entr${entries.length === 1 ? 'y' : 'ies'} published to your changelog.`,
    entries,
    changelogUrl,
  };

  for (const notification of notifications) {
    if (!notification.events.onPublish) continue;

    if (notification.type === 'slack') {
      await sendSlackMessage(notification.webhookUrl, message);
    } else if (notification.type === 'discord') {
      await sendDiscordMessage(notification.webhookUrl, message);
    }
  }
}

/**
 * Send notification for scheduled publish
 */
export async function notifyOnScheduled(
  userId: string,
  count: number,
  schedule: string,
  changelogUrl: string
): Promise<void> {
  const notifications = await getUserNotifications(userId);

  const message = {
    title: '⏰ Scheduled Publish Complete',
    text: `Successfully published ${count} entries on schedule (${schedule}).`,
    changelogUrl,
  };

  for (const notification of notifications) {
    if (!notification.events.onScheduled) continue;

    if (notification.type === 'slack') {
      await sendSlackMessage(notification.webhookUrl, message);
    } else if (notification.type === 'discord') {
      await sendDiscordMessage(notification.webhookUrl, message);
    }
  }
}

/**
 * Send notification for release
 */
export async function notifyOnRelease(
  userId: string,
  version: string,
  entries: Array<{ title: string; category: string }>,
  changelogUrl: string
): Promise<void> {
  const notifications = await getUserNotifications(userId);

  const message = {
    title: `🏷️ Release ${version} Published`,
    text: `New release with ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} is now live.`,
    entries,
    changelogUrl,
  };

  for (const notification of notifications) {
    if (!notification.events.onRelease) continue;

    if (notification.type === 'slack') {
      await sendSlackMessage(notification.webhookUrl, message);
    } else if (notification.type === 'discord') {
      await sendDiscordMessage(notification.webhookUrl, message);
    }
  }
}
