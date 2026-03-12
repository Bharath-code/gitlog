import { cn } from '@/shared/lib/utils';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-surface-highlight',
        className
      )}
      {...props}
    />
  );
}

// ── Preset skeletons ──

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-3 w-full max-w-[280px]" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <SkeletonList count={4} />
    </div>
  );
}
