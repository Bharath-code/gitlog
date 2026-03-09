'use client';

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
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Drafts', href: '/drafts', icon: FileText },
  { label: 'Published', href: '/published', icon: CheckCircle },
  { label: 'Social Posts', href: '/social', icon: Share2 },
  { label: 'Roadmap', href: '/roadmap', icon: Map },
  { label: 'Analytics', href: '/analytics/widgets', icon: BarChart3 },
  { label: 'Widget', href: '/widget', icon: Globe },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function SiteSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-line bg-surface lg:block">
      <div className="flex h-full flex-col">
        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
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
        </nav>

        {/* Connected Repos */}
        <div className="border-t border-line p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              Connected Repos
            </span>
            <Link
              href="/dashboard/settings"
              className="text-muted hover:text-foreground"
            >
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
