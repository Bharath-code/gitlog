import { LoadingState } from '@/shared/components/common/skeleton';

export default function RootLoading() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background absolute inset-0 z-50">
      <LoadingState message="Warming up the engines..." className="scale-150" />
    </div>
  );
}
