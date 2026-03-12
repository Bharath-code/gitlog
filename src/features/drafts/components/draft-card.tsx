'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Sparkles, Edit, Check, Eye, MoreHorizontal, Loader2 } from 'lucide-react';
import { cn, timeAgo } from '@/shared/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/hooks/use-toast';

interface DraftCardProps {
  draft: {
    id: string;
    title: string;
    category: string;
    mergedAt: string;
    aiRewrite?: string | null;
    repoId?: string;
  };
}

export function DraftCard({ draft }: DraftCardProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [rewriting, setRewriting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [aiRewrite, setAiRewrite] = useState(draft.aiRewrite);

  const handleRewrite = async () => {
    setRewriting(true);
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: draft.id }),
      });

      if (!res.ok) throw new Error('Failed to rewrite');

      const data = await res.json();
      setAiRewrite(data.aiRewrite);
      success('AI rewrite generated');
    } catch (err) {
      console.error('Rewrite error:', err);
      error('Failed to generate AI rewrite');
    } finally {
      setRewriting(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch('/api/entries/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: draft.id }),
      });

      if (!res.ok) throw new Error('Failed to publish');

      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff6b35', '#22c55e', '#3b82f6'],
      });

      success('Published — your users can see this now');

      setTimeout(() => {
        router.refresh();
      }, 600);
    } catch (err) {
      console.error('Publish error:', err);
      error('Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Card
      className={cn(
        'group p-4 transition-colors',
        'border-line bg-surface hover:border-line-strong'
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant={draft.category === 'New' ? 'default' : 'secondary'}>
              {draft.category}
            </Badge>
            <h3 className="font-medium text-sm truncate">{draft.title}</h3>
          </div>

          {aiRewrite ? (
            <p className="text-muted text-xs leading-relaxed line-clamp-2">{aiRewrite}</p>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Sparkles className="h-3 w-3" />
              <span>No AI rewrite yet</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-muted">
            <span>{timeAgo(draft.mergedAt)}</span>
            {draft.repoId && <span className="truncate">{draft.repoId}</span>}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={publishing}
            className="gap-1.5"
          >
            {publishing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span className="hidden sm:inline">Publishing...</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Publish</span>
              </>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleRewrite} disabled={rewriting}>
                <Sparkles className={cn('h-4 w-4 mr-2', rewriting && 'animate-spin')} />
                {rewriting ? 'Rewriting...' : 'AI Rewrite'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/drafts/${draft.id}`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
