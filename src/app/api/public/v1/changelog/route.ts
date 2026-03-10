import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { validateApiKey } from '@/features/api/api-key-manager';

/**
 * GET /api/public/v1/changelog
 * Get published changelog entries
 *
 * Query params:
 * - limit: number (default: 50, max: 100)
 * - offset: number (default: 0)
 * - category: string (optional filter)
 */
export async function GET(request: NextRequest) {
  try {
    // Validate API key from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required (Bearer YOUR_API_KEY)' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.substring(7);
    const validatedKey = await validateApiKey(apiKey);

    if (!validatedKey) {
      return NextResponse.json({ error: 'Invalid or expired API key' }, { status: 401 });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');

    // Get entries for this user
    const entryKeys = await kv.keys(`entry:${validatedKey.userId}:*`);
    const entries = await Promise.all(entryKeys.map((key) => kv.get<any>(key)));

    // Filter published entries
    let publishedEntries = entries.filter((e) => e && e.status === 'published');

    // Filter by category if specified
    if (category) {
      publishedEntries = publishedEntries.filter((e) => e.category === category);
    }

    // Sort by published date
    publishedEntries.sort(
      (a, b) =>
        new Date(b.publishedAt || b.mergedAt).getTime() -
        new Date(a.publishedAt || a.mergedAt).getTime()
    );

    // Paginate
    const paginatedEntries = publishedEntries.slice(offset, offset + limit);

    // Format for public API (remove sensitive data)
    const safeEntries = paginatedEntries.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.aiRewrite || e.body,
      category: e.category,
      publishedAt: e.publishedAt,
      mergedAt: e.mergedAt,
      prUrl: e.prUrl,
      labels: e.labels || [],
    }));

    return NextResponse.json({
      entries: safeEntries,
      pagination: {
        limit,
        offset,
        total: publishedEntries.length,
        hasMore: offset + limit < publishedEntries.length,
      },
    });
  } catch (error) {
    console.error('Error fetching changelog entries:', error);
    return NextResponse.json({ error: 'Failed to fetch changelog entries' }, { status: 500 });
  }
}
