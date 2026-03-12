'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';

export function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const { success, error } = useToast();

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/github/sync/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Sync failed');
      }

      success(data.message || 'Sync completed');
      window.location.reload();
    } catch (err) {
      console.error('Sync error:', err);
      error('Failed to sync. Make sure you have a connected repository.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Button onClick={handleSync} disabled={syncing} variant="outline" size="sm" className="gap-2">
      <RefreshCw className={cn('h-4 w-4', syncing && 'animate-spin')} />
      {syncing ? 'Syncing...' : 'Sync Now'}
    </Button>
  );
}
