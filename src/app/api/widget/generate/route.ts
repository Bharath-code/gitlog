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

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { repoId } = body;

    if (!repoId) {
      return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 });
    }

    // Generate unique widget ID
    const widgetId = `widget_${Math.random().toString(36).substring(2, 15)}`;

    // Create default widget config
    const widgetConfig: WidgetConfig = {
      id: widgetId,
      userId,
      repoId,
      colors: {
        primary: '#ff6b35',
        background: '#1a1a1d',
        text: '#fafafa',
      },
      position: 'bottom-right',
      size: 'medium',
      options: {
        showDate: true,
        showCategory: true,
        showNewBadge: true,
      },
      impressions: 0,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Vercel KV
    await kv.set(`widget:${userId}:${repoId}`, widgetConfig);

    return NextResponse.json({
      success: true,
      widgetId,
      config: widgetConfig,
    });
  } catch (error) {
    console.error('Error generating widget:', error);
    return NextResponse.json({ error: 'Failed to generate widget' }, { status: 500 });
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
      return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 });
    }

    // Get widget config from Vercel KV
    const widgetConfig = await kv.get<WidgetConfig>(`widget:${userId}:${repoId}`);

    if (!widgetConfig) {
      return NextResponse.json({ error: 'Widget not found for this repository' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      config: widgetConfig,
    });
  } catch (error) {
    console.error('Error getting widget:', error);
    return NextResponse.json({ error: 'Failed to get widget config' }, { status: 500 });
  }
}
