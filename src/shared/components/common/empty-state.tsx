'use client';

import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { FileText, Calendar, Users, BarChart3, Widget2, Map, Share2, Mail } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('p-12 text-center', className)}>
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-highlight">
          {icon || <FileText className="h-8 w-8 text-muted" />}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold">{title}</h3>

        {/* Description */}
        <p className="max-w-md text-muted">{description}</p>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex gap-3 mt-4">
            {action && (
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link href={action.href} onClick={action.onClick}>
                  {action.label}
                </Link>
              </Button>
            )}
            {secondaryAction && (
              <Button asChild variant="outline">
                <Link href={secondaryAction.href} onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Pre-built empty states for common scenarios
 */

export function NoDraftsEmpty() {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8 text-muted" />}
      title="No drafts yet"
      description="Merge a PR on GitHub and it'll appear here within 30 seconds. Your first draft is just a merge away!"
      action={{
        label: 'Connect GitHub',
        href: '/dashboard/settings',
      }}
      secondaryAction={{
        label: 'How to Connect',
        href: '/docs/github-setup',
      }}
    />
  );
}

export function NoPublishedEmpty() {
  return (
    <EmptyState
      icon={<Calendar className="h-8 w-8 text-muted" />}
      title="Nothing published yet"
      description="You have drafts ready to publish. Share your updates with the world!"
      action={{
        label: 'View Drafts',
        href: '/dashboard/drafts',
      }}
    />
  );
}

export function NoAnalyticsEmpty() {
  return (
    <EmptyState
      icon={<BarChart3 className="h-8 w-8 text-muted" />}
      title="Not enough data yet"
      description="Analytics will appear here after you get 10 views. Share your changelog to start tracking!"
      action={{
        label: 'Share Changelog',
        href: '/dashboard/published',
      }}
    />
  );
}

export function NoWidgetsEmpty() {
  return (
    <EmptyState
      icon={<Widget2 className="h-8 w-8 text-muted" />}
      title="No widgets yet"
      description="Add a 'What's New' widget to your website in 1 line of code. Your users will love it!"
      action={{
        label: 'Create Widget',
        href: '/dashboard/widget',
      }}
    />
  );
}

export function NoRoadmapEmpty() {
  return (
    <EmptyState
      icon={<Map className="h-8 w-8 text-muted" />}
      title="No roadmap items"
      description="Sync GitHub Issues to create a public roadmap. Let users vote on what you build next!"
      action={{
        label: 'Sync Issues',
        href: '/dashboard/roadmap',
      }}
    />
  );
}

export function NoSocialPostsEmpty() {
  return (
    <EmptyState
      icon={<Share2 className="h-8 w-8 text-muted" />}
      title="No social posts yet"
      description="Select a draft to auto-generate Twitter threads and LinkedIn posts. Save hours of writing!"
      action={{
        label: 'View Drafts',
        href: '/dashboard/drafts',
      }}
    />
  );
}

export function NoEmailSubscribersEmpty() {
  return (
    <EmptyState
      icon={<Mail className="h-8 w-8 text-muted" />}
      title="No subscribers yet"
      description="Share your subscription link to start building your email list. First subscriber is just a share away!"
      action={{
        label: 'Get Subscription Link',
        href: '/dashboard/settings',
      }}
    />
  );
}

export function SearchNoResultsEmpty({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8 text-muted" />}
      title={`No results for "${query}"`}
      description="Try a different search term or clear your filters."
      action={{
        label: 'Clear Search',
        href: '/dashboard',
      }}
    />
  );
}
