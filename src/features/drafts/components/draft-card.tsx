'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Sparkles, Edit, Check, Trash, ExternalLink } from 'lucide-react';
import { cn, timeAgo } from '@/shared/lib/utils';
import { useRouter } from 'next/navigation';

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
  const [rewriting, setRewriting] = useState(false);
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
    } catch (error) {
      console.error('Rewrite error:', error);
      alert('Failed to generate AI rewrite. Please try again.');
    } finally {
      setRewriting(false);
    }
  };

  const handlePublish = async () => {
    try {
      const res = await fetch('/api/entries/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: draft.id }),
      });
      
      if (!res.ok) throw new Error('Failed to publish');
      
      router.refresh();
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish. Please try again.');
    }
  };

  return (
    <Card className={cn(
      'group p-4 transition-all duration-300 hover-lift',
      'border-line bg-surface hover:border-accent/50 hover:shadow-lg hover:shadow-accent-glow/5'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={draft.category === 'New' ? 'default' : 'secondary'}>
              {draft.category}
            </Badge>
            <h3 className="font-semibold text-lg">{draft.title}</h3>
          </div>
          
          {aiRewrite ? (
            <p className="text-muted text-sm leading-relaxed">
              {aiRewrite}
            </p>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI rewrite not generated yet</span>
            </div>
          )}
          
          <div className="flex items-center gap-4 text-xs text-muted">
            <span>{timeAgo(draft.mergedAt)}</span>
            {draft.repoId && (
              <span className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                {draft.repoId}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRewrite}
            disabled={rewriting}
            className="gap-1"
          >
            <Sparkles className={cn("h-3.5 w-3.5", rewriting && "animate-spin")} />
            {rewriting ? 'Writing...' : 'Rewrite'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => router.push(`/dashboard/drafts/${draft.id}`)}
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
          
          <Button
            size="sm"
            className="gap-1 bg-accent hover:bg-accent/90"
            onClick={handlePublish}
          >
            <Check className="h-3.5 w-3.5" />
            Publish
          </Button>
        </div>
      </div>
    </Card>
  );
}
