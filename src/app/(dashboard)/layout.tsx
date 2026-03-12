import { SiteHeader } from '@/shared/components/layout/site-header';
import { SiteSidebar } from '@/shared/components/layout/site-sidebar';
import { Breadcrumbs } from '@/shared/components/layout/breadcrumbs';
import { KeyboardShortcutsProvider } from '@/shared/hooks/use-keyboard-shortcuts';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardShortcutsProvider>
      <div className="flex min-h-screen bg-background">
        <SiteSidebar />
        <div className="flex flex-1 flex-col">
          <SiteHeader />
          <div className="px-4 pt-4 sm:px-6 lg:px-8">
            <Breadcrumbs />
          </div>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </KeyboardShortcutsProvider>
  );
}

