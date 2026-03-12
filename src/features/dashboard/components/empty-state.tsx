import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { GitMerge, FileText, CheckCircle, Inbox, Search, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'drafts' | 'published' | 'search' | 'connect';
}

const variantIcons: Record<string, React.ReactNode> = {
  default: <Inbox className="h-6 w-6 text-muted" />,
  drafts: <FileText className="h-6 w-6 text-accent" />,
  published: <CheckCircle className="h-6 w-6 text-success" />,
  search: <Search className="h-6 w-6 text-blue" />,
  connect: <GitMerge className="h-6 w-6 text-purple" />,
};

const variantRing: Record<string, string> = {
  default: 'bg-surface-highlight',
  drafts: 'bg-accent/10',
  published: 'bg-success/10',
  search: 'bg-blue/10',
  connect: 'bg-purple/10',
};

export function EmptyState({
  title,
  description,
  action,
  icon,
  variant = 'default',
}: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-line">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${variantRing[variant]}`}
      >
        {icon || variantIcons[variant]}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}

// ── Pre-built empty states for common pages ──

export function EmptyDrafts() {
  return (
    <EmptyState
      variant="drafts"
      title="No drafts yet"
      description="Drafts appear here when you sync merged pull requests from GitHub. Connect a repo to get started."
      action={
        <Link href="/onboarding">
          <Button size="sm" className="gap-2">
            <LinkIcon className="h-3.5 w-3.5" />
            Connect a repository
          </Button>
        </Link>
      }
    />
  );
}

export function EmptyPublished() {
  return (
    <EmptyState
      variant="published"
      title="Nothing published yet"
      description="Published changelog entries appear here. Head to Drafts to review and publish your first entry."
      action={
        <Link href="/drafts">
          <Button size="sm" variant="outline" className="gap-2">
            <FileText className="h-3.5 w-3.5" />
            View drafts
          </Button>
        </Link>
      }
    />
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      variant="search"
      title={`No results for "${query}"`}
      description="Try a different search term, or check that your entries have been synced."
    />
  );
}
