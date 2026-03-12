import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { GitMerge, LogOut } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { SignOutButton } from '@clerk/nextjs';
import { MobileSidebar } from './site-sidebar';

export async function SiteHeader() {
  const user = await currentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger — triggers Sheet drawer */}
          <MobileSidebar />

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
              <GitMerge className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold">GitLog</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted sm:inline">
                {user.firstName || user.emailAddresses?.[0]?.emailAddress}
              </span>
              <SignOutButton>
                <Button variant="ghost" size="icon" aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </SignOutButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
