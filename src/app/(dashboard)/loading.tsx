import { SkeletonPage } from '@/shared/components/common/skeleton';

export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 animate-slide-up-fade">
      <SkeletonPage />
    </div>
  );
}
