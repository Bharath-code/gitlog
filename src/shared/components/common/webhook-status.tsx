'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Tooltip } from '@/shared/components/common/tooltip';
import { cn } from '@/shared/lib/utils';
import { formatDistance } from 'date-fns';

interface WebhookDelivery {
  id: string;
  delivered_at: string;
  status: string;
  status_code?: number;
  event: string;
  duration?: number;
}

interface WebhookStatus {
  status: 'active' | 'inactive' | 'error' | 'pending';
  lastDelivery?: Date;
  lastSuccess?: Date;
  failureCount: number;
  recentDeliveries: WebhookDelivery[];
  errorMessage?: string;
}

interface WebhookStatusBadgeProps {
  repoName: string;
  className?: string;
}

export function WebhookStatusBadge({ repoName, className }: WebhookStatusBadgeProps) {
  const [status, setStatus] = useState<WebhookStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    async function fetchWebhookStatus() {
      try {
        const res = await fetch(`/api/github/webhook/status?repo=${encodeURIComponent(repoName)}`);
        if (!res.ok) throw new Error('Failed to fetch webhook status');
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        console.error('Webhook status error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWebhookStatus();
    // Poll every 30 seconds for updates
    const interval = setInterval(fetchWebhookStatus, 30000);
    return () => clearInterval(interval);
  }, [repoName]);

  if (loading || !status) {
    return (
      <Badge variant="secondary" className={className}>
        <Clock className="h-3 w-3 mr-1 animate-pulse" />
        Checking...
      </Badge>
    );
  }

  const renderStatus = () => {
    switch (status.status) {
      case 'active':
        return (
          <Tooltip content={
            <div className="space-y-1">
              <p className="font-semibold">Webhook Active</p>
              <p className="text-xs">Last delivery: {formatDistance(status.lastDelivery || new Date(), new Date())} ago</p>
              {status.lastSuccess && (
                <p className="text-xs">Last success: {formatDistance(status.lastSuccess, new Date())} ago</p>
              )}
            </div>
          }>
            <Badge className="bg-success/10 text-success border-success/20 cursor-help">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </Tooltip>
        );
      
      case 'error':
        return (
          <Tooltip content={
            <div className="space-y-2">
              <p className="font-semibold text-red-500">Webhook Failed</p>
              <p className="text-xs">{status.errorMessage}</p>
              <p className="text-xs">Failures: {status.failureCount}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fetch(`/api/github/webhook/test?repo=${encodeURIComponent(repoName)}`, { method: 'POST' })}
                className="w-full mt-2"
              >
                Test Connection
              </Button>
            </div>
          }>
            <Badge className="bg-red-500/10 text-red-500 border-red-500/20 cursor-help">
              <XCircle className="h-3 w-3 mr-1" />
              Failed ({status.failureCount})
            </Badge>
          </Tooltip>
        );
      
      case 'inactive':
        return (
          <Tooltip content={
            <div className="space-y-2">
              <p className="font-semibold">No Recent Deliveries</p>
              <p className="text-xs">No webhook deliveries in the last 24 hours</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fetch(`/api/github/sync/manual`, { 
                  method: 'POST',
                  body: JSON.stringify({ repo: repoName })
                })}
                className="w-full mt-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Trigger Test
              </Button>
            </div>
          }>
            <Badge variant="secondary" className="cursor-help">
              <AlertCircle className="h-3 w-3 mr-1" />
              Inactive
            </Badge>
          </Tooltip>
        );
      
      default:
        return (
          <Badge variant="secondary" className={className}>
            <Clock className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {renderStatus()}
      
      {/* Recent Deliveries Dropdown */}
      {status.recentDeliveries.length > 0 && (
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="h-6 px-2 text-xs"
          >
            {status.recentDeliveries.length} recent
          </Button>
          
          {showDetails && (
            <div className="absolute right-0 top-full mt-1 w-80 rounded-lg border border-line bg-surface shadow-lg z-50">
              <div className="p-3 border-b border-line">
                <h4 className="font-semibold text-sm">Recent Deliveries</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {status.recentDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="p-3 border-b border-line last:border-0 hover:bg-surface-highlight"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant={delivery.status === 'success' ? 'success' : 'secondary'} className="text-xs">
                        {delivery.status}
                      </Badge>
                      <span className="text-xs text-muted">
                        {formatDistance(new Date(delivery.delivered_at), new Date())} ago
                      </span>
                    </div>
                    <div className="text-xs text-muted">
                      <span className="font-mono">{delivery.event}</span>
                      {delivery.status_code && (
                        <span className="ml-2">HTTP {delivery.status_code}</span>
                      )}
                      {delivery.duration && (
                        <span className="ml-2">{delivery.duration}ms</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Simple status badge for when you don't need live updates
export function SimpleWebhookStatus({ status }: { status: 'active' | 'error' | 'inactive' }) {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    case 'error':
      return (
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
          <XCircle className="h-3 w-3 mr-1" />
          Error
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          <AlertCircle className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
      );
  }
}
