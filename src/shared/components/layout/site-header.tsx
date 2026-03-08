import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { GitMerge, LogOut } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { SignOutButton } from '@clerk/nextjs';

export async function SiteHeader() {
  const user = await currentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent-glow/20">
              <GitMerge className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">GitLog</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-1 text-sm">
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-2 text-muted hover:bg-surface hover:text-foreground transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/drafts"
              className="rounded-md px-3 py-2 text-muted hover:bg-surface hover:text-foreground transition-colors"
            >
              Drafts
            </Link>
            <Link
              href="/dashboard/published"
              className="rounded-md px-3 py-2 text-muted hover:bg-surface hover:text-foreground transition-colors"
            >
              Published
            </Link>
            <Link
              href="/dashboard/settings"
              className="rounded-md px-3 py-2 text-muted hover:bg-surface hover:text-foreground transition-colors"
            >
              Settings
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {user && (
              <SignOutButton>
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </SignOutButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
