import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

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

interface ChangelogEntry {
  id: string;
  title: string;
  aiRewrite?: string;
  category: 'New' | 'Fixed' | 'Improved' | 'Other';
  mergedAt: Date;
  prUrl: string;
}

// Allow CORS for widget embedding
const ALLOWED_ORIGINS = ['*']; // In production, restrict this

function getCorsHeaders(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  return NextResponse.json({}, {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ widgetId: string }> }
) {
  const { widgetId } = await params;
  const origin = request.headers.get('origin');

  try {
    // Find widget config by widgetId
    // In production, you'd query by widgetId directly
    // For now, we'll iterate (not ideal but works for demo)
    const keys = await kv.keys('widget:*');
    let widgetConfig: WidgetConfig | null = null;

    for (const key of keys) {
      const config = await kv.get<WidgetConfig>(key);
      if (config && config.id === widgetId) {
        widgetConfig = config;
        break;
      }
    }

    if (!widgetConfig) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { 
          status: 404,
          headers: getCorsHeaders(origin),
        }
      );
    }

    // Get latest changelog entries for this repo
    const entries = await getChangelogEntries(widgetConfig.userId, widgetConfig.repoId);

    // Track impression
    await kv.incr(`widget:impressions:${widgetId}`);
    await kv.hincrby(`widget:${widgetConfig.userId}:${widgetConfig.repoId}`, 'impressions', 1);

    return NextResponse.json(
      {
        success: true,
        config: widgetConfig,
        entries: entries.slice(0, 5), // Return latest 5 entries
      },
      {
        headers: getCorsHeaders(origin),
      }
    );
  } catch (error) {
    console.error('Error fetching widget data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widget data' },
      { 
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );
  }
}

async function getChangelogEntries(userId: string, repoId: string): Promise<ChangelogEntry[]> {
  try {
    // Get published entries for this repo
    const keys = await kv.keys(`entry:${userId}:${repoId}:*`);
    const entries: ChangelogEntry[] = [];

    for (const key of keys) {
      const entry = await kv.get<ChangelogEntry>(key);
      if (entry && entry.status === 'published') {
        entries.push(entry);
      }
    }

    // Sort by mergedAt descending
    entries.sort((a, b) => new Date(b.mergedAt).getTime() - new Date(a.mergedAt).getTime());

    return entries;
  } catch (error) {
    console.error('Error fetching changelog entries:', error);
    return [];
  }
}
