'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Fragment } from 'react';

const labelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  drafts: 'Drafts',
  published: 'Published',
  settings: 'Settings',
  analytics: 'Analytics',
  billing: 'Billing',
  onboarding: 'Onboarding',
  releases: 'Releases',
  roadmap: 'Roadmap',
  social: 'Social Posts',
  widget: 'Widget',
  email: 'Email',
  upgrade: 'Upgrade',
  search: 'Search',
  'api-keys': 'API Keys',
  'most-viewed': 'Most Viewed',
  widgets: 'Widgets',
  notifications: 'Notifications',
  publishing: 'Publishing',
  payment: 'Payment',
  success: 'Success',
  cancel: 'Cancelled',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Don't render on root dashboard — it IS the root
  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const label = labelMap[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const isLast = i === segments.length - 1;

    return { href, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        href="/dashboard"
        className="text-muted hover:text-foreground transition-colors"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {crumbs.map((crumb) => (
        <Fragment key={crumb.href}>
          <ChevronRight className="h-3 w-3 text-muted/50 flex-shrink-0" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground truncate" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted hover:text-foreground transition-colors truncate"
            >
              {crumb.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
