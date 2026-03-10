import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { kv } from '@vercel/kv';
import { getUserConfig, setUserConfig } from '@/shared/lib/db/user';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userConfig = await getUserConfig(userId);

    return NextResponse.json({
      settings: {
        autoPublish: userConfig?.autoPublish || false,
        publishSchedule: userConfig?.publishSchedule || 'immediate',
        scheduleDay: userConfig?.scheduleDay || 5,
        filterLabels: userConfig?.filterLabels || {
          exclude: ['chore', 'test', 'refactor'],
          include: [],
        },
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { autoPublish, publishSchedule, scheduleDay, filterLabels } = body;

    // Get existing config
    const existingConfig = await getUserConfig(userId);

    // Update with new settings
    await setUserConfig(userId, {
      autoPublish: autoPublish ?? existingConfig?.autoPublish ?? false,
      publishSchedule: publishSchedule ?? existingConfig?.publishSchedule ?? 'immediate',
      scheduleDay: scheduleDay ?? existingConfig?.scheduleDay ?? 5,
      filterLabels: filterLabels ?? existingConfig?.filterLabels ?? {
        exclude: ['chore', 'test', 'refactor'],
        include: [],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
