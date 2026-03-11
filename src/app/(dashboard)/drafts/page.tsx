'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { FileText, Search, Filter, Edit, Check } from 'lucide-react';
import Link from 'next/link';
import { BulkActions } from '@/shared/components/common/bulk-actions';

interface Draft {
  id: string;
  title: string;
  category: string;
  mergedAt: string;
  aiRewrite?: string | null;
  repoId?: string;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'with-rewrite' | 'without-rewrite'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchDrafts() {
      try {
        const res = await fetch('/api/drafts');
        const data = await res.json();
        setDrafts(data.drafts || []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDrafts();
  }, []);

  const handleBulkPublish = async (ids: string[]) => {
    try {
      const results = await Promise.all(
        ids.map((id) =>
          fetch('/api/entries/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entryId: id }),
          })
        )
      );

      // Remove published drafts from list
      setDrafts(drafts.filter((d) => !ids.includes(d.id)));
    } catch (error) {
      console.error('Bulk publish error:', error);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const results = await Promise.all(
        ids.map((id) =>
          fetch(`/api/drafts/${id}`, {
            method: 'DELETE',
          })
        )
      );

      // Remove deleted drafts from list
      setDrafts(drafts.filter((d) => !ids.includes(d.id)));
    } catch (error) {
      console.error('Bulk delete error:', error);
    }
  };

  const filteredDrafts = drafts.filter((draft) => {
    const matchesSearch = draft.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'with-rewrite' && draft.aiRewrite) ||
      (filter === 'without-rewrite' && !draft.aiRewrite);

    return matchesSearch && matchesFilter;
  });

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
            <h1 className="text-3xl font-bold">Drafts</h1>
            <p className="text-muted mt-1">
              Review and edit your changelog drafts before publishing
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

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search drafts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="all">All Drafts</option>
                <option value="with-rewrite">With AI Rewrite</option>
                <option value="without-rewrite">Without AI Rewrite</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Bulk Actions */}
        {drafts.length > 0 && (
          <BulkActions
            entries={drafts.map((d) => ({ ...d, status: 'draft' as const }))}
            onBulkPublish={handleBulkPublish}
            onBulkDelete={handleBulkDelete}
          />
        )}

        {/* Stats */}
        {drafts.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold">{drafts.length}</div>
              <div className="text-sm text-muted">Total Drafts</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-success">
                {drafts.filter((d) => d.aiRewrite).length}
              </div>
              <div className="text-sm text-muted">With AI Rewrite</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-muted">
                {drafts.filter((d) => !d.aiRewrite).length}
              </div>
              <div className="text-sm text-muted">Needs Rewrite</div>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {drafts.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No drafts yet</h3>
            <p className="text-muted mt-2">
              Merge a PR on GitHub and it will appear here as a draft within 30 seconds.
            </p>
            <Link
              href="/settings"
              className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 mt-4"
            >
              Connect Repository
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
