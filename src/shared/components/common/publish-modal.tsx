'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Check, X, Calendar, Users, GitMerge } from 'lucide-react';

interface PublishModalProps {
  draft: {
    title: string;
    category: string;
    aiRewrite?: string | null;
    repoId?: string;
  } | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PublishModal({ draft, isOpen, onConfirm, onCancel }: PublishModalProps) {
  const [publishing, setPublishing] = useState(false);

  const handleConfirm = async () => {
    setPublishing(true);
    try {
      await onConfirm();
    } finally {
      setPublishing(false);
    }
  };

  if (!isOpen || !draft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 bg-surface border-line shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <GitMerge className="h-6 w-6 text-accent" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center mb-2">Publish this entry?</h3>

        {/* Preview */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Badge>{draft.category}</Badge>
          </div>

          <p className="font-semibold text-center">{draft.title}</p>

          {draft.aiRewrite && (
            <p className="text-sm text-muted text-center">
              {draft.aiRewrite.slice(0, 100)}
              {draft.aiRewrite.length > 100 ? '...' : ''}
            </p>
          )}

          <div className="flex items-center justify-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Will appear on public changelog
            </span>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-6 rounded-lg bg-surface-highlight p-3">
          <p className="text-xs text-muted">
            ✨ This entry will be visible on your public changelog page immediately. You can
            unpublish it later if needed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} disabled={publishing} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={publishing}
            className="flex-1 bg-accent hover:bg-accent/90"
          >
            <Check className="h-4 w-4 mr-2" />
            {publishing ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
