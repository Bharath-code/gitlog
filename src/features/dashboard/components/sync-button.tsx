'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function SyncButton() {
  const [syncing, setSyncing] = useState(false);

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
      
      // Show success and reload
      alert(data.message || 'Sync completed!');
      window.location.reload();
    } catch (error) {
      console.error('Sync error:', error);
      alert('Failed to sync. Please make sure you have connected a repository.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Button 
      onClick={handleSync} 
      disabled={syncing}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
      {syncing ? 'Syncing...' : 'Sync Now'}
    </Button>
  );
}
