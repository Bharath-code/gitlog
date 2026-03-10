'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  Settings,
  GitMerge,
  Sparkles,
  Globe,
  Share2,
  Mail,
  BarChart3,
  Map,
  ChevronDown,
  Command,
  Search,
} from 'lucide-react';

// Primary navigation (always visible)
const primaryNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, shortcut: 'G D' },
  { label: 'Drafts', href: '/drafts', icon: FileText, shortcut: 'G F' },
  { label: 'Published', href: '/published', icon: CheckCircle, shortcut: 'G P' },
  { label: 'Settings', href: '/settings', icon: Settings, shortcut: ',' },
];

// Secondary navigation (in "More" dropdown)
const secondaryNavItems = [
  { label: 'Analytics', href: '/analytics/widgets', icon: BarChart3 },
  { label: 'Widget', href: '/widget', icon: Globe },
  { label: 'Roadmap', href: '/roadmap', icon: Map },
  { label: 'Social Posts', href: '/social', icon: Share2 },
  { label: 'Email', href: '/email', icon: Mail },
];

export function SiteSidebar() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-line bg-surface lg:block">
      <div className="flex h-full flex-col">
        {/* Search / Command Palette Trigger */}
        <div className="p-4 border-b border-line">
          <button
            onClick={() => {
              // Will trigger command palette
              const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
              window.dispatchEvent(event);
            }}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg border border-line bg-surface-highlight',
              'px-3 py-2 text-sm text-muted hover:border-accent/50 hover:text-foreground transition-colors'
            )}
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="hidden lg:inline-flex items-center gap-1 rounded border border-line bg-surface px-1.5 py-0.5 text-xs">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {primaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted hover:bg-surface-highlight hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
                {item.shortcut && (
                  <kbd className="hidden lg:inline-flex items-center rounded border border-line bg-surface px-1.5 py-0.5 text-xs text-muted group-hover:text-foreground">
                    {item.shortcut}
                  </kbd>
                )}
              </Link>
            );
          })}
        </nav>

        {/* More Dropdown */}
        <div className="border-t border-line p-2">
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface-highlight hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4" />
              More
            </div>
            <ChevronDown className={cn('h-4 w-4 transition-transform', showMore && 'rotate-180')} />
          </button>

          {showMore && (
            <div className="mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {secondaryNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors pl-10',
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-muted hover:bg-surface-highlight hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Connected Repos */}
        <div className="border-t border-line p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              Connected Repos
            </span>
            <Link href="/dashboard/settings" className="text-muted hover:text-foreground">
              <Settings className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-md bg-surface-highlight px-3 py-2">
              <GitMerge className="h-3.5 w-3.5 text-muted" />
              <span className="text-sm text-muted">No repos connected</span>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="border-t border-line p-4">
          <div className="rounded-lg bg-gradient-to-br from-accent/20 to-purple/20 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold">Upgrade to Pro</span>
            </div>
            <p className="mb-3 text-xs text-muted">
              Unlimited entries, remove branding, priority support
            </p>
            <Link
              href="/dashboard/upgrade"
              className="flex w-full items-center justify-center rounded-md bg-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent/90"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
