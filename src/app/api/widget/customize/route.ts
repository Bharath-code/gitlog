import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { auth } from '@clerk/nextjs/server';

interface WidgetConfig {
  id: string;
  userId: string;
  repoId: string;
  colors: {
    primary: string;
    background: string;
    text: string;
  };
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size: 'small' | 'medium' | 'large';
  options: {
    showDate: boolean;
    showCategory: boolean;
    showNewBadge: boolean;
  };
  impressions: number;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { widgetId, repoId, config } = body;

    if (!widgetId || !repoId || !config) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get existing widget config
    const existingConfig = await kv.get<WidgetConfig>(`widget:${userId}:${repoId}`);

    if (!existingConfig) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    // Update config with new values
    const updatedConfig: WidgetConfig = {
      ...existingConfig,
      colors: config.colors,
      position: config.position,
      size: config.size,
      options: config.options,
      updatedAt: new Date(),
    };

    // Save to Vercel KV
    await kv.set(`widget:${userId}:${repoId}`, updatedConfig);

    return NextResponse.json({
      success: true,
      config: updatedConfig,
    });
  } catch (error) {
    console.error('Error updating widget config:', error);
    return NextResponse.json(
      { error: 'Failed to update widget config' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const repoId = searchParams.get('repoId');

    if (!repoId) {
      return NextResponse.json(
        { error: 'Repository ID is required' },
        { status: 400 }
      );
    }

    // Get widget config from Vercel KV
    const widgetConfig = await kv.get<WidgetConfig>(`widget:${userId}:${repoId}`);

    if (!widgetConfig) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      config: widgetConfig,
    });
  } catch (error) {
    console.error('Error getting widget config:', error);
    return NextResponse.json(
      { error: 'Failed to get widget config' },
      { status: 500 }
    );
  }
}
