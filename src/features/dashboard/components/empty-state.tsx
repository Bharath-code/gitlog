import { Card } from '@/shared/components/ui/card';
import { GitMerge } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-highlight">
        {icon || <GitMerge className="h-6 w-6 text-muted" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}
