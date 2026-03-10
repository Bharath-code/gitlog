import { kv } from '@vercel/kv';
import crypto from 'crypto';

export interface Visitor {
  id: string;
  fingerprint: string;
  firstVisit: string;
  lastVisit: string;
  pageViews: number;
  entries: string[];
}

export function generateVisitorId(userAgent?: string, ip?: string): string {
  // Generate a unique visitor ID based on fingerprint
  const fingerprint = `${userAgent || ''}-${ip || ''}-${Date.now()}-${Math.random()}`;
  return crypto.createHash('sha256').update(fingerprint).digest('hex').substring(0, 32);
}

export function getVisitorIdFromCookie(cookie?: string): string | null {
  if (!cookie) return null;

  // Parse visitor_id from cookie
  const match = cookie.match(/visitor_id=([^;]+)/);
  return match ? match[1] : null;
}

export async function trackVisitor(
  visitorId: string,
  entryId: string
): Promise<{ success: boolean }> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const visitorKey = `analytics:visitor:${visitorId}`;

    // Get existing visitor data
    const existing = await kv.get<Visitor>(visitorKey);

    if (existing) {
      // Update existing visitor
      existing.lastVisit = today;
      existing.pageViews++;
      if (!existing.entries.includes(entryId)) {
        existing.entries.push(entryId);
      }
      await kv.set(visitorKey, existing);
    } else {
      // Create new visitor
      const visitor: Visitor = {
        id: visitorId,
        fingerprint: visitorId,
        firstVisit: today,
        lastVisit: today,
        pageViews: 1,
        entries: [entryId],
      };
      await kv.set(visitorKey, visitor);
    }

    return { success: true };
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return { success: false };
  }
}

export async function getVisitorStats(
  entryId: string,
  days: number = 30
): Promise<{
  totalVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  averagePageViews: number;
}> {
  try {
    const today = new Date();
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Get all visitors who viewed this entry
    const keys = await kv.keys('analytics:visitor:*');
    let totalVisitors = 0;
    let newVisitors = 0;
    let returningVisitors = 0;
    let totalPageViews = 0;

    for (const key of keys) {
      const visitor = await kv.get<Visitor>(key);
      if (visitor && visitor.entries.includes(entryId)) {
        totalVisitors++;
        totalPageViews += visitor.pageViews;

        const firstVisit = new Date(visitor.firstVisit);
        if (firstVisit >= cutoffDate) {
          newVisitors++;
        } else {
          returningVisitors++;
        }
      }
    }

    return {
      totalVisitors,
      newVisitors,
      returningVisitors,
      averagePageViews: totalVisitors > 0 ? totalPageViews / totalVisitors : 0,
    };
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    return {
      totalVisitors: 0,
      newVisitors: 0,
      returningVisitors: 0,
      averagePageViews: 0,
    };
  }
}

export async function getUniqueVisitorsCount(entryId: string, days: number = 30): Promise<number> {
  try {
    const stats = await getVisitorStats(entryId, days);
    return stats.totalVisitors;
  } catch (error) {
    console.error('Error getting unique visitors count:', error);
    return 0;
  }
}
