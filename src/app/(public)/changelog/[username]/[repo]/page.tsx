import { getPublishedEntriesByRepo } from '@/shared/lib/db/entry';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { GitMerge, Calendar, User, ExternalLink } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { formatDate } from '@/shared/lib/utils';
import { ChangelogJsonLd, BreadcrumbJsonLd } from '@/shared/components/common/json-ld';
import { siteConfig } from '@/shared/config/site';

interface PageProps {
  params: { username: string; repo: string };
}

interface ChangelogEntry {
  id: string;
  title: string;
  aiRewrite?: string | null;
  category: string;
  publishedAt: string;
  prUrl: string;
  author: string;
  labels: string[];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const repoName = params.repo.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `What's New in ${repoName} | GitLog`,
    description: `Latest updates and changelog for ${repoName}. Stay up to date with new features, bug fixes, and improvements.`,
    openGraph: {
      title: `What's New in ${repoName}`,
      description: `Latest updates and changelog for ${repoName}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `What's New in ${repoName}`,
      description: `Latest updates and changelog for ${repoName}`,
    },
  };
}

async function getPublishedEntries(username: string, repo: string) {
  const repoSlug = `${username}/${repo}`;
  return await getPublishedEntriesByRepo(repoSlug);
}

function groupByMonth(entries: ChangelogEntry[]) {
  return entries.reduce((acc, entry) => {
    const date = new Date(entry.publishedAt || entry.mergedAt);
    const month = date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    
    if (!acc[month]) {
      acc[month] = [];
    }
    
    acc[month].push(entry);
    return acc;
  }, {} as Record<string, ChangelogEntry[]>);
}

function getCategoryBadge(category: string) {
  const colors: Record<string, string> = {
    New: 'bg-accent/10 text-accent border-accent/20',
    Fixed: 'bg-success/10 text-success border-success/20',
    Improved: 'bg-blue/10 text-blue border-blue/20',
    Other: 'bg-muted/10 text-muted border-muted/20',
  };
  
  return colors[category] || colors.Other;
}

export default async function ChangelogPage({ params }: PageProps) {
  const entries = await getPublishedEntries(params.username, params.repo);
  
  if (entries.length === 0) {
    notFound();
  }

  const grouped = groupByMonth(entries);
  const repoName = params.repo.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const changelogUrl = `${siteConfig.url}/changelog/${params.username}/${params.repo}`;

  // Prepare data for JSON-LD
  const jsonLdEntries = entries.map(entry => ({
    title: entry.title,
    description: entry.aiRewrite || entry.title,
    datePublished: entry.publishedAt || entry.mergedAt,
    url: `${changelogUrl}#${entry.id}`,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <ChangelogJsonLd repoName={repoName} entries={jsonLdEntries} />
      <BreadcrumbJsonLd items={[
        { position: 1, name: 'GitLog', item: siteConfig.url },
        { position: 2, name: 'Changelog', item: changelogUrl },
      ]} />

      {/* Header */}
      <header className="border-b border-line bg-surface/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent-glow/20">
              <GitMerge className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Changelog for {repoName}
              </h1>
              <p className="text-muted">
                Stay updated with the latest improvements
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {entries.length} update{entries.length !== 1 ? 's' : ''}
            </span>
            <span>•</span>
            <span>
              First update: {formatDate(entries[entries.length - 1].publishedAt || entries[entries.length - 1].mergedAt)}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {Object.entries(grouped).map(([month, monthEntries]) => (
          <section key={month} className="mb-12">
            <div className="sticky top-4 z-10 mb-6">
              <h2 className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold border border-line shadow-sm">
                <Calendar className="h-4 w-4 text-muted" />
                {month}
              </h2>
            </div>
            
            <div className="space-y-6">
              {monthEntries.map((entry) => (
                <article
                  key={entry.id}
                  className="group relative rounded-xl border border-line bg-surface p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent-glow/5"
                >
                  {/* Category Badge */}
                  <div className="mb-4">
                    <Badge className={getCategoryBadge(entry.category)}>
                      {entry.category}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                    {entry.title}
                  </h3>

                  {/* Description */}
                  {entry.aiRewrite ? (
                    <p className="text-muted leading-relaxed mb-4">
                      {entry.aiRewrite}
                    </p>
                  ) : (
                    <p className="text-muted leading-relaxed mb-4">
                      {entry.title}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-muted flex-wrap">
                    <time className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(entry.publishedAt || entry.mergedAt)}
                    </time>
                    
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      @{entry.author}
                    </span>

                    {entry.labels.length > 0 && (
                      <div className="flex items-center gap-1">
                        {entry.labels.slice(0, 3).map((label, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-surface-highlight px-2 py-0.5 text-[10px]"
                          >
                            {label}
                          </span>
                        ))}
                        {entry.labels.length > 3 && (
                          <span className="text-[10px]">
                            +{entry.labels.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <a
                      href={entry.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-1 text-accent hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View PR
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-surface/50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>Powered by</span>
              <a
                href="https://gitlog.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-semibold text-accent hover:underline"
              >
                <GitMerge className="h-4 w-4" />
                GitLog
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={`/changelog/${params.username}/${params.repo}/subscribe`}
                className="text-sm text-muted hover:text-accent transition-colors"
              >
                📧 Subscribe to updates
              </Link>
              <a
                href="https://gitlog.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
              >
                <GitMerge className="h-4 w-4" />
                Create your changelog
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
