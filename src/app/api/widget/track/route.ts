import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { widgetId, action, entryId } = body;

    if (!widgetId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Track impression or click
    if (action === 'impression') {
      await kv.incr(`widget:impressions:${widgetId}`);

      // Also increment in widget config
      const keys = await kv.keys('widget:*');
      for (const key of keys) {
        const config = await kv.get<any>(key);
        if (config && config.id === widgetId) {
          await kv.hincrby(key, 'impressions', 1);
          break;
        }
      }
    } else if (action === 'click') {
      await kv.incr(`widget:clicks:${widgetId}`);

      // Also increment in widget config
      const keys = await kv.keys('widget:*');
      for (const key of keys) {
        const config = await kv.get<any>(key);
        if (config && config.id === widgetId) {
          await kv.hincrby(key, 'clicks', 1);
          break;
        }
      }

      // Track entry-specific click
      if (entryId) {
        await kv.incr(`widget:entry:${widgetId}:${entryId}:clicks`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking widget event:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
