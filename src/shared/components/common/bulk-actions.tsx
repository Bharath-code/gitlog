'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Check, X, Trash2, ExternalLink, Edit } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/shared/lib/utils';

interface Entry {
  id: string;
  title: string;
  category: string;
  mergedAt: string;
  publishedAt?: string;
  aiRewrite?: string | null;
  repoId?: string;
  status: 'draft' | 'published';
}

interface BulkActionsProps {
  entries: Entry[];
  onBulkPublish?: (ids: string[]) => Promise<void>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
}

export function BulkActions({ entries, onBulkPublish, onBulkDelete }: BulkActionsProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);

  const selectedEntries = entries.filter(e => selectedIds.has(e.id));
  const draftSelected = selectedEntries.filter(e => e.status === 'draft');
  const publishedSelected = selectedEntries.filter(e => e.status === 'published');

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === entries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(entries.map(e => e.id)));
    }
  };

  const handleBulkPublish = async () => {
    if (!onBulkPublish || draftSelected.length === 0) return;
    
    if (!confirm(`Publish ${draftSelected.length} selected draft${draftSelected.length !== 1 ? 's' : ''}?`)) {
      return;
    }

    setProcessing(true);
    try {
      await onBulkPublish(draftSelected.map(e => e.id));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Bulk publish error:', error);
      alert('Failed to publish some entries. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedEntries.length === 0) return;
    
    if (!confirm(`Delete ${selectedEntries.length} selected entrie${selectedEntries.length !== 1 ? 's' : ''}? This action cannot be undone.`)) {
      return;
    }

    setProcessing(true);
    try {
      await onBulkDelete(selectedEntries.map(e => e.id));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Failed to delete some entries. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <Card className="p-4 sticky top-4 z-10 bg-surface/95 backdrop-blur border-accent/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="accent">
                {selectedIds.size} selected
              </Badge>
              <span className="text-sm text-muted">
                {draftSelected.length} draft{draftSelected.length !== 1 ? 's' : ''}, {publishedSelected.length} published
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {draftSelected.length > 0 && onBulkPublish && (
                <Button
                  size="sm"
                  onClick={handleBulkPublish}
                  disabled={processing}
                  className="bg-accent hover:bg-accent/90"
                >
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Publish {draftSelected.length}
                </Button>
              )}
              
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={processing}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedIds(new Set())}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Entries List with Checkboxes */}
      <div className="space-y-3">
        {entries.map((entry) => (
          <Card
            key={entry.id}
            className={`p-4 transition-all ${
              selectedIds.has(entry.id)
                ? 'border-accent bg-accent/5'
                : 'hover:border-accent/50'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={selectedIds.has(entry.id)}
                  onChange={() => toggleSelect(entry.id)}
                  className="h-4 w-4 rounded border-line text-accent focus:ring-accent"
                />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge>{entry.category}</Badge>
                  <Badge variant={entry.status === 'published' ? 'success' : 'secondary'}>
                    {entry.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                  <Link
                    href={`/drafts/${entry.id}`}
                    className="font-semibold hover:text-accent transition-colors"
                  >
                    {entry.title}
                  </Link>
                </div>
                
                {entry.aiRewrite ? (
                  <p className="text-muted text-sm line-clamp-2">
                    {entry.aiRewrite}
                  </p>
                ) : (
                  <p className="text-sm text-muted">No AI rewrite yet</p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span>{formatDate(entry.publishedAt || entry.mergedAt)}</span>
                  {entry.repoId && (
                    <span className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      {entry.repoId}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Link href={`/drafts/${entry.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                </Link>
                
                {entry.status === 'draft' ? (
                  <Button size="sm" className="bg-accent hover:bg-accent/90">
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Publish
                  </Button>
                ) : (
                  <a
                    href={`/changelog/${entry.repoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Select All Bar */}
      {entries.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-lg border border-line bg-surface">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.size === entries.length}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-line text-accent focus:ring-accent"
            />
            <span className="text-sm font-medium">
              Select all {entries.length} entrie{entries.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="text-sm text-muted">
            {selectedIds.size} selected
          </div>
        </div>
      )}
    </div>
  );
}
