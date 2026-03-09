'use client';

import { getPublishedEntriesByRepo } from '@/shared/lib/db/entry';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { GitMerge, Calendar, User, ExternalLink, Star, GitFork, MapPin, Link as LinkIcon, Building, Twitter, Linkedin, Copy, Check, Rss, Sparkles } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { formatDate } from '@/shared/lib/utils';
import { ChangelogJsonLd, BreadcrumbJsonLd } from '@/shared/components/common/json-ld';
import { siteConfig } from '@/shared/config/site';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';

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

interface GitHubRepoDetails {
  name: string;
  description: string;
  stars: number;
  forks: number;
  avatar: string;
  url: string;
  userUrl: string;
  company?: string | null;
  blog?: string | null;
  location?: string | null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const repoName = params.repo.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const changelogUrl = `${siteConfig.url}/changelog/${params.username}/${params.repo}`;
  
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
    other: {
      'link': [
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: `${repoName} Changelog RSS`,
          href: `${changelogUrl}/rss`,
        },
      ],
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

// Client component for GitHub repo details
function GitHubRepoHeader({ 
  username, 
  repo,
  entries 
}: { 
  username: string; 
  repo: string;
  entries: ChangelogEntry[];
}) {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<GitHubRepoDetails | null>(null);
  const [copied, setCopied] = useState(false);
  const [userRepos, setUserRepos] = useState<Array<{ name: string; entryCount: number }>>([]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out the changelog for ${repo} - Latest updates and improvements`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  // Fetch user's other changelogs
  useEffect(() => {
    async function fetchUserRepos() {
      try {
        const res = await fetch(`/api/user/changelogs?username=${username}`);
        const data = await res.json();
        setUserRepos(data.repos?.filter((r: any) => r.name !== repo) || []);
      } catch (error) {
        console.error('Error fetching user repos:', error);
      }
    }

    fetchUserRepos();
  }, [username, repo]);

  useEffect(() => {
    async function fetchRepoDetails() {
      try {
        const res = await fetch('/api/github/repo-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, repo }),
        });

        const data = await res.json();
        setDetails(data);
      } catch (error) {
        console.error('Error fetching repo details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRepoDetails();
  }, [username, repo]);

  const repoName = repo.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (loading) {
    return (
      <header className="border-b border-line bg-surface/50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-line bg-surface/50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <a
            href={details?.userUrl || `https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <img
              src={details?.avatar || `https://github.com/${username}.png`}
              alt={username}
              className="h-16 w-16 rounded-full hover:opacity-80 transition-opacity"
            />
          </a>

          {/* Repo Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">
                {repoName} Changelog
              </h1>
              <Badge variant="outline">{entries.length} entries</Badge>
            </div>

            {/* Description */}
            {details?.description && details.description !== 'No description' && (
              <p className="text-muted mb-3">{details.description}</p>
            )}

            {/* Meta Links */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <a
                href={details?.userUrl || `https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-muted hover:text-accent transition-colors"
              >
                <User className="h-4 w-4" />
                @{username}
              </a>
              
              <a
                href={details?.url || `https://github.com/${username}/${repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-muted hover:text-accent transition-colors"
              >
                <GitMerge className="h-4 w-4" />
                {repo}
              </a>

              {details && details.stars > 0 && (
                <a
                  href={`${details.url}/stargazers`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-muted hover:text-accent transition-colors"
                >
                  <Star className="h-4 w-4" />
                  {details.stars.toLocaleString()}
                </a>
              )}

              {details && details.forks > 0 && (
                <a
                  href={`${details.url}/forks`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-muted hover:text-accent transition-colors"
                >
                  <GitFork className="h-4 w-4" />
                  {details.forks.toLocaleString()}
                </a>
              )}

              {details?.company && (
                <span className="flex items-center gap-1 text-muted">
                  <Building className="h-4 w-4" />
                  {details.company}
                </span>
              )}

              {details?.location && (
                <span className="flex items-center gap-1 text-muted">
                  <MapPin className="h-4 w-4" />
                  {details.location}
                </span>
              )}

              {details?.blog && (
                <a
                  href={details.blog.startsWith('http') ? details.blog : `https://${details.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-muted hover:text-accent transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                  Blog
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="border-t border-line bg-surface/30">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-muted">Share:</span>
              
              {/* Twitter */}
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-twitter/10 hover:border-twitter/50 transition-colors group"
                title="Share on Twitter"
              >
                <Twitter className="h-4 w-4 text-muted group-hover:text-twitter transition-colors" />
                <span className="text-xs font-medium text-muted group-hover:text-twitter">Tweet</span>
              </a>
              
              {/* LinkedIn */}
              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-linkedin/10 hover:border-linkedin/50 transition-colors group"
                title="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4 text-muted group-hover:text-linkedin transition-colors" />
                <span className="text-xs font-medium text-muted group-hover:text-linkedin">Share</span>
              </a>
              
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-surface-highlight transition-colors group"
                title="Copy link"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4 text-muted group-hover:text-foreground transition-colors" />
                )}
                <span className="text-xs font-medium text-muted group-hover:text-foreground">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>

              {/* RSS Feed */}
              <a
                href={`/api/changelog/${username}/${repo}/rss`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-orange-500/10 hover:border-orange-500/50 transition-colors group"
                title="Subscribe to RSS feed"
              >
                <Rss className="h-4 w-4 text-muted group-hover:text-orange-500 transition-colors" />
                <span className="text-xs font-medium text-muted group-hover:text-orange-500">RSS</span>
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  }
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

      {/* More from this User */}
      {userRepos.length > 0 && (
        <section className="border-t border-line bg-surface/30">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-xl font-semibold mb-4">
              More from @{username}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {userRepos.map((repoItem) => (
                <Link
                  key={repoItem.name}
                  href={`/changelog/${username}/${repoItem.name}`}
                  className="p-4 rounded-lg border border-line bg-surface hover:border-accent/50 hover:bg-surface-highlight transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium group-hover:text-accent transition-colors">
                        {repoItem.name}
                      </h3>
                      <p className="text-sm text-muted mt-1">
                        {repoItem.entryCount} update{repoItem.entryCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted group-hover:text-accent transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent/90 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent-glow/20 transition-all hover:shadow-xl hover:shadow-accent-glow/30 hover:scale-105"
              >
                <Sparkles className="h-4 w-4" />
                Create your changelog
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
