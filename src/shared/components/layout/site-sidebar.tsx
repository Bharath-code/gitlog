'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
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
  Menu,
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

interface SidebarNavProps {
  pathname: string;
  showMore: boolean;
  setShowMore: (v: boolean) => void;
  onNavigate?: () => void;
}

function SidebarNav({ pathname, showMore, setShowMore, onNavigate }: SidebarNavProps) {
  return (
    <>
      {/* Search / Command Palette Trigger */}
      <div className="p-4 border-b border-line">
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
            window.dispatchEvent(event);
            onNavigate?.();
          }}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg border border-line bg-surface-highlight',
            'px-3 py-2 text-sm text-muted hover:border-accent/50 hover:text-foreground transition-colors'
          )}
          aria-label="Open search (⌘K)"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-1 rounded border border-line bg-surface px-1.5 py-0.5 text-xs">
            <Command className="h-3 w-3" />K
          </kbd>
        </button>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 space-y-1 p-4" aria-label="Main navigation">
        {primaryNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:bg-surface-highlight hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
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
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-surface-highlight hover:text-foreground transition-colors"
          aria-expanded={showMore}
        >
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4" />
            More
          </div>
          <ChevronDown className={cn('h-4 w-4 transition-transform', showMore && 'rotate-180')} />
        </button>

        {showMore && (
          <div className="mt-1 space-y-1">
            {secondaryNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors pl-10',
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted hover:bg-surface-highlight hover:text-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
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
          <Link href="/settings" onClick={onNavigate} className="text-muted hover:text-foreground">
            <Settings className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="space-y-2">
          <Link
            href="/onboarding"
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-md border border-dashed border-line px-3 py-2 text-sm text-muted hover:border-accent/50 hover:text-foreground transition-colors"
          >
            <GitMerge className="h-3.5 w-3.5" />
            <span>Connect a repo</span>
          </Link>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="border-t border-line p-4">
        <div className="rounded-lg bg-gradient-to-br from-accent/10 to-purple/10 border border-line p-3">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold">Upgrade to Pro</span>
          </div>
          <p className="mb-3 text-xs text-muted">
            Unlimited entries, AI rewrites, and connected repos.
          </p>
          <Link
            href="/upgrade"
            onClick={onNavigate}
            className="flex w-full items-center justify-center rounded-md bg-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent/90"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </>
  );
}

// ── Desktop Sidebar ──
export function SiteSidebar() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-line bg-surface lg:flex lg:flex-col h-full">
      <SidebarNav pathname={pathname} showMore={showMore} setShowMore={setShowMore} />
    </aside>
  );
}

// ── Mobile Sidebar (Sheet drawer) ──
export function MobileSidebar() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-muted hover:bg-surface-highlight hover:text-foreground transition-colors lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-surface border-r border-line p-0">
        <SheetHeader className="px-4 pt-4 pb-0">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
              <GitMerge className="h-4 w-4 text-white" />
            </div>
            GitLog
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-[calc(100%-3.5rem)]">
          <SidebarNav
            pathname={pathname}
            showMore={showMore}
            setShowMore={setShowMore}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
