import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  createNotification,
  getUserNotifications,
  deleteNotification,
} from '@/features/notifications/notification-manager';

/**
 * GET /api/notifications
 * Get all notification integrations
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await getUserNotifications(userId);

    // Don't expose webhook URLs
    const safeNotifications = notifications.map(n => ({
      id: n.id,
      type: n.type,
      isActive: n.isActive,
      events: n.events,
      createdAt: n.createdAt,
      webhookUrlMasked: `${n.webhookUrl.substring(0, 8)}...${n.webhookUrl.substring(n.webhookUrl.length - 8)}`,
    }));

    return NextResponse.json({ notifications: safeNotifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Create a new notification integration
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, webhookUrl, repoId, events } = body;

    if (!type || !['slack', 'discord'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be "slack" or "discord"' },
        { status: 400 }
      );
    }

    if (!webhookUrl) {
      return NextResponse.json({ error: 'Webhook URL is required' }, { status: 400 });
    }

    // Validate webhook URL format
    try {
      new URL(webhookUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid webhook URL format' },
        { status: 400 }
      );
    }

    const notification = await createNotification({
      userId,
      repoId,
      type: type as 'slack' | 'discord',
      webhookUrl,
      events,
    });

    return NextResponse.json({
      success: true,
      notification: {
        id: notification.id,
        type: notification.type,
        events: notification.events,
        createdAt: notification.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/[id]
 * Delete a notification integration
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await deleteNotification(userId, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
