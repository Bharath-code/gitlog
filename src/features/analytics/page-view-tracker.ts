import { kv } from '@vercel/kv';

export interface PageView {
  entryId: string;
  date: string; // YYYY-MM-DD
  views: number;
  uniqueVisitors: number;
  visitorIds: string[];
}

export async function trackPageView(
  entryId: string,
  visitorId: string
): Promise<{ success: boolean }> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const viewKey = `analytics:views:${entryId}:${today}`;
    
    // Get existing views
    const existing = await kv.get<PageView>(viewKey) || {
      entryId,
      date: today,
      views: 0,
      uniqueVisitors: 0,
      visitorIds: [],
    };

    // Increment views
    existing.views++;

    // Track unique visitor
    if (!existing.visitorIds.includes(visitorId)) {
      existing.visitorIds.push(visitorId);
      existing.uniqueVisitors = existing.visitorIds.length;
    }

    // Save to KV
    await kv.set(viewKey, existing);

    // Also track total views for entry
    const totalKey = `analytics:total:${entryId}`;
    await kv.hincrby(totalKey, 'views', 1);
    if (!existing.visitorIds.includes(visitorId)) {
      await kv.hincrby(totalKey, 'uniqueVisitors', 1);
    }

    return { success: true };
  } catch (error) {
    console.error('Error tracking page view:', error);
    return { success: false };
  }
}

export async function getPageViews(
  entryId: string,
  days: number = 30
): Promise<PageView[]> {
  try {
    const views: PageView[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const viewKey = `analytics:views:${entryId}:${dateStr}`;
      const view = await kv.get<PageView>(viewKey);
      
      if (view) {
        views.push(view);
      } else {
        views.push({
          entryId,
          date: dateStr,
          views: 0,
          uniqueVisitors: 0,
          visitorIds: [],
        });
      }
    }

    return views;
  } catch (error) {
    console.error('Error getting page views:', error);
    return [];
  }
}

export async function getTotalViews(entryId: string): Promise<{ views: number; uniqueVisitors: number }> {
  try {
    const totalKey = `analytics:total:${entryId}`;
    const total = await kv.hgetall(totalKey);
    
    return {
      views: Number(total?.views || 0),
      uniqueVisitors: Number(total?.uniqueVisitors || 0),
    };
  } catch (error) {
    console.error('Error getting total views:', error);
    return { views: 0, uniqueVisitors: 0 };
  }
}

export async function getAllEntriesViews(
  userId: string,
  repoId: string
): Promise<Array<{ entryId: string; views: number; uniqueVisitors: number }>> {
  try {
    // Get all entries for this user/repo
    const keys = await kv.keys(`entry:${userId}:${repoId}:*`);
    const entriesViews = [];

    for (const key of keys) {
      const entry = await kv.get<any>(key);
      if (entry) {
        const total = await getTotalViews(entry.id);
        entriesViews.push({
          entryId: entry.id,
          title: entry.title,
          views: total.views,
          uniqueVisitors: total.uniqueVisitors,
        });
      }
    }

    // Sort by views descending
    entriesViews.sort((a, b) => b.views - a.views);

    return entriesViews;
  } catch (error) {
    console.error('Error getting all entries views:', error);
    return [];
  }
}
