'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ExternalLink, GitPullRequest, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { UpvoteButton } from '@/shared/components/analytics/upvote-button';

interface RoadmapItem {
  id: string;
  issueId: number;
  title: string;
  body: string;
  status: 'planned' | 'in-progress' | 'completed';
  upvotes: number;
  labels: string[];
  githubIssueUrl: string;
  linkedEntryId?: string;
}

interface RoadmapCardsProps {
  items: RoadmapItem[];
  onStatusChange?: (issueId: number, status: string) => void;
}

export function RoadmapCards({ items, onStatusChange }: RoadmapCardsProps) {
  const [filter, setFilter] = useState<'all' | 'planned' | 'in-progress' | 'completed'>('all');

  const filteredItems = filter === 'all' ? items : items.filter((item) => item.status === filter);

  const groupedItems = {
    planned: filteredItems.filter((item) => item.status === 'planned'),
    'in-progress': filteredItems.filter((item) => item.status === 'in-progress'),
    completed: filteredItems.filter((item) => item.status === 'completed'),
  };

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'planned', label: 'Planned' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' },
        ].map((f) => (
          <Button
            key={f.value}
            onClick={() => setFilter(f.value as any)}
            variant={filter === f.value ? 'primary' : 'outline'}
            size="sm"
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Columns */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Planned */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Planned</h3>
            <Badge variant="outline">{groupedItems.planned.length}</Badge>
          </div>
          {groupedItems.planned.map((item) => (
            <RoadmapCard key={item.id} item={item} />
          ))}
        </div>

        {/* In Progress */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GitPullRequest className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold">In Progress</h3>
            <Badge variant="outline">{groupedItems['in-progress'].length}</Badge>
          </div>
          {groupedItems['in-progress'].map((item) => (
            <RoadmapCard key={item.id} item={item} />
          ))}
        </div>

        {/* Completed */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Completed</h3>
            <Badge variant="outline">{groupedItems.completed.length}</Badge>
          </div>
          {groupedItems.completed.map((item) => (
            <RoadmapCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RoadmapCard({ item }: { item: RoadmapItem }) {
  const statusColors = {
    planned: 'border-blue-500/20 bg-blue-500/5',
    'in-progress': 'border-amber-500/20 bg-amber-500/5',
    completed: 'border-green-500/20 bg-green-500/5',
  };

  return (
    <Card className={cn('p-4 border-2 transition-all hover:shadow-md', statusColors[item.status])}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm line-clamp-2">{item.title}</h4>
          <a
            href={item.githubIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent flex-shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Labels */}
        {item.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.labels.slice(0, 3).map((label) => (
              <Badge key={label} variant="outline" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>
        )}

        {/* Description */}
        {item.body && <p className="text-xs text-muted line-clamp-3">{item.body}</p>}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-line">
          <UpvoteButton entryId={item.id} initialVotes={item.upvotes} />
          <div className="flex items-center gap-1 text-xs text-muted">
            <TrendingUp className="h-3 w-3" />
            <span>#{item.issueId}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
