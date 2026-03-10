'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Search as SearchIcon, Filter, FileText } from 'lucide-react';
import Link from 'next/link';
import { DashboardSearch } from '@/shared/components/common/search';

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

export default function SearchPage() {
  const [drafts, setDrafts] = useState<Entry[]>([]);
  const [published, setPublished] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [draftsRes, publishedRes] = await Promise.all([
          fetch('/api/drafts'),
          fetch('/api/entries/published'),
        ]);

        const draftsData = await draftsRes.json();
        const publishedData = await publishedRes.json();

        setDrafts(draftsData.drafts || []);
        setPublished(publishedData.entries || []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
            <h1 className="text-3xl font-bold">Search</h1>
            <p className="text-muted mt-1">Search across all your drafts and published entries</p>
          </div>

          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">{drafts.length}</div>
            <div className="text-sm text-muted">Drafts</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">{published.length}</div>
            <div className="text-sm text-muted">Published</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">{drafts.length + published.length}</div>
            <div className="text-sm text-muted">Total Entries</div>
          </Card>
        </div>

        {/* Search Component */}
        <DashboardSearch drafts={drafts} published={published} />

        {/* Empty State */}
        {drafts.length === 0 && published.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No entries yet</h3>
            <p className="text-muted mt-2">
              Connect a repository and merge your first PR to get started
            </p>
            <Link href="/dashboard/settings">
              <Button className="mt-4 bg-accent hover:bg-accent/90">Connect Repository</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
