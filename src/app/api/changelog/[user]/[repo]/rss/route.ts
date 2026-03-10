import { NextRequest, NextResponse } from 'next/server';
import { getPublishedEntriesByRepo } from '@/shared/lib/db/entry';
import { siteConfig } from '@/shared/config/site';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user: string; repo: string }> }
) {
  try {
    const { user, repo } = await params;
    const entries = await getPublishedEntriesByRepo(`${user}/${repo}`);

    if (entries.length === 0) {
      return NextResponse.json({ error: 'No entries found' }, { status: 404 });
    }

    const repoName = repo.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const changelogUrl = `${siteConfig.url}/changelog/${user}/${repo}`;

    // Generate RSS feed
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${repoName} Changelog</title>
    <link>${changelogUrl}</link>
    <description>Latest updates and changelog for ${repoName}. Stay up to date with new features, bug fixes, and improvements.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${changelogUrl}/rss" rel="self" type="application/rss+xml"/>
    <generator>GitLog</generator>
    ${entries
      .map(
        (entry) => `
    <item>
      <title><![CDATA[${entry.title}]]></title>
      <link>${changelogUrl}#${entry.id}</link>
      <guid isPermaLink="false">${entry.id}</guid>
      <pubDate>${new Date(entry.publishedAt || entry.mergedAt).toUTCString()}</pubDate>
      <description><![CDATA[${entry.aiRewrite || entry.body || entry.title}]]></description>
      <category>${entry.category}</category>
    </item>
    `
      )
      .join('')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return NextResponse.json({ error: 'Failed to generate RSS feed' }, { status: 500 });
  }
}
