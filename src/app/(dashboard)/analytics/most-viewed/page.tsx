'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { SectionHeading } from '@/shared/components/ui/section-heading';
import { BarChart3, TrendingUp, Eye, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface EntryViews {
  entryId: string;
  title: string;
  views: number;
  uniqueVisitors: number;
  trend?: number;
}

export default function MostViewedPage() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<EntryViews[]>([]);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadEntries();
  }, [period]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockData: EntryViews[] = [
        {
          entryId: '1',
          title: 'Added dark mode toggle',
          views: 1234,
          uniqueVisitors: 856,
          trend: 12.5,
        },
        {
          entryId: '2',
          title: 'Fixed login issue on mobile',
          views: 987,
          uniqueVisitors: 654,
          trend: 8.3,
        },
        {
          entryId: '3',
          title: 'Improved performance by 40%',
          views: 756,
          uniqueVisitors: 523,
          trend: -5.2,
        },
        {
          entryId: '4',
          title: 'New dashboard design',
          views: 654,
          uniqueVisitors: 432,
          trend: 15.7,
        },
        {
          entryId: '5',
          title: 'Added export functionality',
          views: 543,
          uniqueVisitors: 321,
          trend: 3.2,
        },
      ];
      setEntries(mockData);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <SectionHeading title="Most Viewed Entries" />
          <p className="text-muted mt-2">
            See which changelog entries are getting the most attention
          </p>
        </div>
        <Badge variant="accent">Phase 2</Badge>
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
            ].map((p) => (
              <Button
                key={p.value}
                onClick={() => setPeriod(p.value as any)}
                variant={period === p.value ? 'primary' : 'outline'}
                size="sm"
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Top Entries */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <h2 className="text-xl font-semibold">Top 10 Most Viewed</h2>
        </div>

        <div className="space-y-4">
          {entries.slice(0, 10).map((entry, index) => (
            <EntryRow key={entry.entryId} entry={entry} rank={index + 1} />
          ))}
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue/10 flex-shrink-0">
            <BarChart3 className="h-5 w-5 text-blue" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Insights</h3>
            <ul className="text-sm text-muted space-y-1">
              <li>• Dark mode announcement got 25% more views than average</li>
              <li>• Bug fixes tend to get more views than improvements</li>
              <li>• Posts with images get 40% more engagement</li>
              <li>• Tuesday and Wednesday are the best days to publish</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Entry Row Component
function EntryRow({ entry, rank }: { entry: EntryViews; rank: number }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-line hover:bg-surface-highlight transition-colors">
      {/* Rank */}
      <div className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full font-bold',
        rank === 1 ? 'bg-yellow-500/10 text-yellow-500' :
        rank === 2 ? 'bg-gray-400/10 text-gray-400' :
        rank === 3 ? 'bg-amber-600/10 text-amber-600' :
        'bg-muted/10 text-muted-foreground'
      )}>
        {rank}
      </div>

      {/* Entry Info */}
      <div className="flex-1">
        <h3 className="font-medium text-sm">{entry.title}</h3>
        <div className="flex items-center gap-4 mt-1 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {entry.views.toLocaleString()} views
          </span>
          <span>{entry.uniqueVisitors.toLocaleString()} unique</span>
        </div>
      </div>

      {/* Trend */}
      {entry.trend && (
        <div className={cn(
          'flex items-center gap-1 text-sm font-medium',
          entry.trend > 0 ? 'text-success' : 'text-red-500'
        )}>
          {entry.trend > 0 ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          {Math.abs(entry.trend)}%
        </div>
      )}
    </div>
  );
}
