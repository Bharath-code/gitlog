'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ExternalLink, Undo, FileText, Search } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/shared/lib/utils';
import { BulkActions } from '@/shared/components/common/bulk-actions';
import { Tooltip } from '@/shared/components/common/tooltip';
import { Info } from 'lucide-react';
import { ExportChangelog } from '@/shared/components/common/export-changelog';

interface PublishedEntry {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  aiRewrite?: string | null;
  repoId?: string;
}

export default function PublishedPage() {
  const [entries, setEntries] = useState<PublishedEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch('/api/entries/published');
        const data = await res.json();
        setEntries(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEntries();
  }, []);

  const handleUnpublish = async (entryId: string) => {
    if (!confirm('Unpublish this entry? It will revert to draft.')) return;
    
    try {
      const res = await fetch('/api/entries/unpublish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId }),
      });
      
      if (res.ok) {
        setEntries(entries.filter(e => e.id !== entryId));
      }
    } catch (error) {
      console.error('Unpublish error:', error);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (!confirm(`Delete ${ids.length} selected entrie${ids.length !== 1 ? 's' : ''}? This action cannot be undone.`)) return;
    
    try {
      await Promise.all(
        ids.map(id =>
          fetch('/api/entries/unpublish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entryId: id }),
          })
        )
      );
      setEntries(entries.filter(e => !ids.includes(e.id)));
    } catch (error) {
      console.error('Bulk delete error:', error);
    }
  };

  // Group by month
  const grouped = entries.reduce((acc, entry) => {
    const month = new Date(entry.publishedAt).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    
    if (!acc[month]) {
      acc[month] = [];
    }
    
    acc[month].push(entry);
    return acc;
  }, {} as Record<string, PublishedEntry[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-surface-highlight rounded animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-surface rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Published Entries</h1>
            <p className="text-muted mt-1 flex items-center gap-2">
              Manage your published changelog entries
              <Tooltip content="Published entries are visible on your public changelog page. You can unpublish them to revert to draft status.">
                <Info className="h-4 w-4 text-muted cursor-help" />
              </Tooltip>
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link href="/search">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {entries.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted mb-4" />
            <h3 className="text-lg font-semibold">No published entries yet</h3>
            <p className="text-muted mt-2">
              Publish your first draft to see it here
            </p>
            <Link href="/dashboard">
              <Button className="mt-4 bg-accent hover:bg-accent/90">
                Go to Dashboard
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Bulk Actions */}
            {entries.length > 0 && (
              <BulkActions
                entries={entries.map(e => ({ ...e, status: 'published' as const }))}
                onBulkDelete={handleBulkDelete}
              />
            )}

            {Object.entries(grouped).map(([month, monthEntries]) => (
              <div key={month}>
                <h2 className="text-2xl font-semibold mb-4 sticky top-4 bg-background py-2">
                  {month}
                </h2>
                
                <div className="space-y-3">
                  {monthEntries.map((entry) => (
                    <Card key={entry.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge>{entry.category}</Badge>
                            <h3 className="font-semibold">{entry.title}</h3>
                          </div>
                          
                          {entry.aiRewrite ? (
                            <p className="text-muted text-sm">
                              {entry.aiRewrite}
                            </p>
                          ) : (
                            <p className="text-muted text-sm">{entry.title}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-muted">
                            <span>Published {formatDate(entry.publishedAt)}</span>
                            {entry.repoId && (
                              <span className="flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                {entry.repoId}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {entry.repoId && (
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
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnpublish(entry.id)}
                          >
                            <Undo className="h-3.5 w-3.5 mr-1" />
                            Unpublish
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">{entries.length}</div>
            <div className="text-sm text-muted">Total Published</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">
              {Object.keys(grouped).length}
            </div>
            <div className="text-sm text-muted">Months Active</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">
              {entries.filter(e => e.aiRewrite).length}
            </div>
            <div className="text-sm text-muted">With AI Rewrite</div>
          </Card>
        </div>

        {/* Export */}
        <ExportChangelog drafts={[]} published={entries} />
      </div>
    </div>
  );
}
