import { Card } from '@/shared/components/ui/card';
import { pricing } from '@/shared/config';
import { cn } from '@/shared/lib/utils';

interface UsageCardProps {
  plan: 'free' | 'pro';
  usage: {
    entriesPublished: number;
    aiRewrites: number;
  };
}

export function UsageCard({ plan, usage }: UsageCardProps) {
  const limits = pricing[plan];
  const entriesRemaining =
    limits.entriesPerMonth === Infinity
      ? Infinity
      : limits.entriesPerMonth - usage.entriesPublished;

  const entriesPercent =
    limits.entriesPerMonth === Infinity
      ? 0
      : Math.min((usage.entriesPublished / limits.entriesPerMonth) * 100, 100);

  return (
    <Card className="p-4 bg-gradient-to-br from-surface to-surface-elevated border-line">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted">Current Plan:</span>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide',
                plan === 'pro' ? 'bg-accent/20 text-accent' : 'bg-muted/20 text-muted'
              )}
            >
              {plan === 'free' ? 'Free' : 'Pro'}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted">Entries this month</span>
                <span className="font-medium">
                  {usage.entriesPublished} /{' '}
                  {limits.entriesPerMonth === Infinity ? '∞' : limits.entriesPerMonth}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-highlight overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    entriesPercent > 80 ? 'bg-accent' : 'bg-accent/60'
                  )}
                  style={{ width: `${entriesPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted">
              <span>
                {entriesRemaining === Infinity
                  ? 'Unlimited entries'
                  : `${entriesRemaining} entries remaining`}
              </span>
              <span>•</span>
              <span>{usage.aiRewrites} AI rewrites used</span>
            </div>
          </div>
        </div>

        {plan === 'free' && entriesRemaining < 10 && (
          <a
            href="/dashboard/upgrade"
            className="flex-shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            Upgrade to Pro
          </a>
        )}
      </div>
    </Card>
  );
}
