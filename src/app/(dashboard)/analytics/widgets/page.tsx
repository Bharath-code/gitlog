'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { SectionHeading } from '@/shared/components/ui/section-heading';
import { 
  BarChart3, 
  TrendingUp, 
  MousePointerClick, 
  Eye, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { cn } from '@/shared/lib/utils';

interface WidgetAnalytics {
  widgetId: string;
  repoId: string;
  repoName: string;
  impressions: number;
  clicks: number;
  ctr: number;
  createdAt: string;
  lastActiveAt: string;
}

interface DailyStats {
  date: string;
  impressions: number;
  clicks: number;
}

export default function WidgetAnalyticsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [widgets, setWidgets] = useState<WidgetAnalytics[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [copiedWidgetId, setCopiedWidgetId] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      // For now, use mock data
      const mockData: WidgetAnalytics[] = [
        {
          widgetId: 'widget_abc123',
          repoId: 'repo1',
          repoName: 'my-awesome-project',
          impressions: 1234,
          clicks: 156,
          ctr: 12.6,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastActiveAt: new Date().toISOString(),
        },
        {
          widgetId: 'widget_xyz789',
          repoId: 'repo2',
          repoName: 'another-project',
          impressions: 856,
          clicks: 89,
          ctr: 10.4,
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          lastActiveAt: new Date().toISOString(),
        },
      ];
      setWidgets(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load widget analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyWidgetId = async (widgetId: string) => {
    await navigator.clipboard.writeText(widgetId);
    setCopiedWidgetId(widgetId);
    toast.success('Widget ID copied!');
    setTimeout(() => setCopiedWidgetId(null), 2000);
  };

  const totalImpressions = widgets.reduce((sum, w) => sum + w.impressions, 0);
  const totalClicks = widgets.reduce((sum, w) => sum + w.clicks, 0);
  const averageCTR = widgets.length > 0 
    ? (widgets.reduce((sum, w) => sum + w.ctr, 0) / widgets.length).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <SectionHeading title="Widget Analytics" />
          <p className="text-muted mt-2">
            Track impressions, clicks, and engagement for your widgets
          </p>
        </div>
        <Badge variant="accent">Phase 2</Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted">Total Widgets</p>
              <p className="text-3xl font-bold">{widgets.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted">Total Impressions</p>
              <p className="text-3xl font-bold">{totalImpressions.toLocaleString()}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue/10">
              <Eye className="h-6 w-6 text-blue" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm text-success">
            <ArrowUpRight className="h-4 w-4" />
            <span>+12.5% from last period</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted">Total Clicks</p>
              <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green/10">
              <MousePointerClick className="h-6 w-6 text-green" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm text-success">
            <ArrowUpRight className="h-4 w-4" />
            <span>+8.3% from last period</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted">Average CTR</p>
              <p className="text-3xl font-bold">{averageCTR}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple/10">
              <TrendingUp className="h-6 w-6 text-purple" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm text-muted">
            <span>Click-through rate</span>
          </div>
        </Card>
      </div>

      {/* Time Period Filter */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted" />
            <span className="text-sm font-medium">Time Period:</span>
          </div>
          <div className="flex gap-2">
            {[
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
              { value: 'all', label: 'All time' },
            ].map((period) => (
              <Button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value as any)}
                variant={selectedPeriod === period.value ? 'primary' : 'outline'}
                size="sm"
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Widgets List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Widget Performance</h2>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {widgets.length === 0 ? (
          <div className="text-center text-muted py-12">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No widgets found</p>
            <p className="text-sm mt-1">Generate a widget to start tracking analytics</p>
          </div>
        ) : (
          <div className="space-y-4">
            {widgets.map((widget, index) => (
              <WidgetRow
                key={widget.widgetId}
                widget={widget}
                rank={index + 1}
                onCopyWidgetId={() => handleCopyWidgetId(widget.widgetId)}
                copied={copiedWidgetId === widget.widgetId}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Top Performing Widgets */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Top Performing Widgets</h2>
          <p className="text-sm text-muted mt-1">
            Ranked by click-through rate
          </p>
        </div>

        <div className="space-y-4">
          {widgets
            .sort((a, b) => b.ctr - a.ctr)
            .slice(0, 3)
            .map((widget, index) => (
              <div
                key={widget.widgetId}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-lg border',
                  index === 0 ? 'bg-accent/10 border-accent/20' : 'bg-surface-highlight border-line'
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full font-bold',
                  index === 0 ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
                )}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{widget.repoName}</p>
                  <p className="text-sm text-muted">
                    {widget.impressions.toLocaleString()} impressions • {widget.clicks.toLocaleString()} clicks
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-accent">{widget.ctr}%</p>
                  <p className="text-xs text-muted">CTR</p>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue/10 flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-blue" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Tips to Improve Widget Performance</h3>
            <ul className="text-sm text-muted space-y-1">
              <li>• Place widgets in high-visibility areas (bottom-right performs best)</li>
              <li>• Use contrasting colors to make your widget stand out</li>
              <li>• Keep entries concise and engaging</li>
              <li>• Update changelog regularly to keep widget fresh</li>
              <li>• Enable category badges to help users quickly scan updates</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Widget Row Component
function WidgetRow({
  widget,
  rank,
  onCopyWidgetId,
  copied,
}: {
  widget: WidgetAnalytics;
  rank: number;
  onCopyWidgetId: () => void;
  copied: boolean;
}) {
  return (
    <div className="p-4 rounded-lg border border-line bg-surface-highlight">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 font-bold text-accent">
            #{rank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{widget.repoName}</h3>
              <Button
                onClick={onCopyWidgetId}
                variant="ghost"
                size="sm"
                className="h-6 px-2"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted mt-1">
              Widget ID: <code className="text-xs bg-surface px-2 py-0.5 rounded">{widget.widgetId}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-sm text-muted">Impressions</p>
            <p className="text-xl font-semibold">{widget.impressions.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">Clicks</p>
            <p className="text-xl font-semibold">{widget.clicks.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">CTR</p>
            <p className={cn(
              'text-xl font-bold',
              widget.ctr >= 15 ? 'text-success' : widget.ctr >= 10 ? 'text-accent' : 'text-muted'
            )}>
              {widget.ctr}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">Last Active</p>
            <p className="text-sm font-medium">
              {new Date(widget.lastActiveAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted mb-1">
          <span>Engagement Rate</span>
          <span>{widget.ctr}%</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-500',
              widget.ctr >= 15 ? 'bg-success' : widget.ctr >= 10 ? 'bg-accent' : 'bg-muted'
            )}
            style={{ width: `${Math.min(widget.ctr, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
