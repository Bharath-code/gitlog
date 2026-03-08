import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { kv } from '@vercel/kv';
import { getDrafts } from '@/shared/lib/db/entry';
import { DraftCard } from '@/features/drafts/components/draft-card';
import { UsageCard } from '@/features/dashboard/components/usage-card';
import { EmptyState } from '@/features/dashboard/components/empty-state';
import { SyncButton } from '@/features/dashboard/components/sync-button';

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  // Fetch recent drafts
  const drafts = await getDrafts(user.id, 10);
  
  // Fetch usage
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const usage = await kv.get<{ entriesPublished: number; aiRewrites: number }>(
    `usage:${user.id}:${month}`
  ) || { entriesPublished: 0, aiRewrites: 0 };

  const plan = await kv.get<'free' | 'pro'>(`user:${user.id}:plan`) || 'free';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.firstName || user.emailAddresses[0].emailAddress.split('@')[0]}!
          </h1>
          <p className="text-muted mt-1">
            Manage your changelog drafts and published entries
          </p>
        </div>
        <SyncButton />
      </div>

      <UsageCard
        plan={plan}
        usage={usage}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Drafts</h2>
          {drafts.length > 0 && (
            <a
              href="/dashboard/drafts"
              className="text-sm text-accent hover:underline"
            >
              View all →
            </a>
          )}
        </div>

        {drafts.length === 0 ? (
          <EmptyState
            title="No drafts yet"
            description="Merge a PR on GitHub and it will appear here as a draft within 30 seconds."
            action={
              <a
                href="/dashboard/settings"
                className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90"
              >
                Connect Repository
              </a>
            }
          />
        ) : (
          <div className="grid gap-4">
            {drafts.slice(0, 5).map((draft) => (
              <DraftCard key={draft.id} draft={draft} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
