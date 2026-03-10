import { SiteHeader } from '@/shared/components/layout/site-header';
import { SiteSidebar } from '@/shared/components/layout/site-sidebar';
import { KeyboardShortcutsProvider } from '@/shared/hooks/use-keyboard-shortcuts';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardShortcutsProvider>
      <div className="flex min-h-screen bg-background">
        <SiteSidebar />
        <div className="flex flex-1 flex-col">
          <SiteHeader />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </KeyboardShortcutsProvider>
  );
}
