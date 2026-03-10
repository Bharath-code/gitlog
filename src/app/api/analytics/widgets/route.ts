import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { auth } from '@clerk/nextjs/server';

interface WidgetAnalytics {
  widgetId: string;
  repoId: string;
  repoName: string;
  impressions: number;
  clicks: number;
  ctr: number;
  createdAt: string;
  lastActiveAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    // Get all widgets for this user
    const keys = await kv.keys(`widget:${userId}:*`);
    const widgets: WidgetAnalytics[] = [];

    for (const key of keys) {
      const config = await kv.get<any>(key);
      if (config) {
        // Get impressions and clicks from separate keys
        const impressions = (await kv.get<number>(`widget:impressions:${config.id}`)) || 0;
        const clicks = (await kv.get<number>(`widget:clicks:${config.id}`)) || 0;

        // Calculate CTR
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

        widgets.push({
          widgetId: config.id,
          repoId: config.repoId,
          repoName: config.repoId.split('/').pop() || config.repoId,
          impressions,
          clicks,
          ctr: Math.round(ctr * 10) / 10, // Round to 1 decimal
          createdAt: config.createdAt,
          lastActiveAt: config.updatedAt,
        });
      }
    }

    // Sort by impressions (most popular first)
    widgets.sort((a, b) => b.impressions - a.impressions);

    return NextResponse.json({
      success: true,
      widgets,
      period,
    });
  } catch (error) {
    console.error('Error fetching widget analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch widget analytics' }, { status: 500 });
  }
}

// Get daily stats for a specific widget
async function getDailyStats(widgetId: string, period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const stats: Array<{ date: string; impressions: number; clicks: number }> = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Get stats for this date (in production, you'd store daily stats)
    const impressions = (await kv.get<number>(`widget:impressions:${widgetId}:${dateStr}`)) || 0;
    const clicks = (await kv.get<number>(`widget:clicks:${widgetId}:${dateStr}`)) || 0;

    stats.push({
      date: dateStr,
      impressions,
      clicks,
    });
  }

  return stats;
}
