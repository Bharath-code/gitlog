'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { X, Eye, Edit, ExternalLink, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PreviewModalProps {
  draft: {
    id: string;
    title: string;
    body: string;
    aiRewrite?: string | null;
    category: string;
    labels: string[];
  };
  onClose: () => void;
  onPublish: () => void;
  onEdit: () => void;
}

export function PreviewModal({ draft, onClose, onPublish, onEdit }: PreviewModalProps) {
  const [view, setView] = useState<'draft' | 'public'>('draft');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-3xl max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-line">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Preview</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('draft')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  view === 'draft'
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted hover:bg-surface-highlight'
                )}
              >
                <Edit className="h-3.5 w-3.5 inline mr-1" />
                Draft View
              </button>
              <button
                onClick={() => setView('public')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  view === 'public'
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted hover:bg-surface-highlight'
                )}
              >
                <Eye className="h-3.5 w-3.5 inline mr-1" />
                Public View
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted hover:bg-surface-highlight hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {view === 'draft' ? (
            /* Draft View (with AI rewrite) */
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={draft.category === 'New' ? 'default' : 'secondary'}>
                    {draft.category}
                  </Badge>
                  <span className="text-sm text-muted">{draft.labels.length} labels</span>
                </div>
                <h3 className="text-2xl font-bold">{draft.title}</h3>
              </div>

              {draft.aiRewrite ? (
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-accent uppercase">AI Rewrite</span>
                  </div>
                  <p className="text-muted leading-relaxed">{draft.aiRewrite}</p>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <p className="text-sm text-amber-600">
                    ⚠️ No AI rewrite yet. Click "Rewrite" to generate.
                  </p>
                </div>
              )}

              <div className="p-4 rounded-lg bg-surface-highlight border border-line">
                <h4 className="font-semibold mb-2 text-sm">Original PR Description:</h4>
                <p className="text-muted text-sm leading-relaxed whitespace-pre-wrap">
                  {draft.body || 'No description provided'}
                </p>
              </div>
            </div>
          ) : (
            /* Public View (how users will see it) */
            <div className="space-y-4">
              <div className="p-6 rounded-xl border border-line bg-surface">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={draft.category === 'New' ? 'default' : 'secondary'}>
                    {draft.category}
                  </Badge>
                  <span className="text-xs text-muted">Just now</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{draft.title}</h3>
                <p className="text-muted leading-relaxed">{draft.aiRewrite || draft.title}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-muted">
                <span>Powered by GitLog</span>
                <a href="#" className="flex items-center gap-1 text-accent hover:underline">
                  View on GitHub
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-line bg-surface-highlight">
          <p className="text-sm text-muted">
            {view === 'public' ? 'This is how users will see it' : 'Review before publishing'}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={onPublish} className="bg-accent hover:bg-accent/90">
              <Check className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
