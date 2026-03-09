'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Search as SearchIcon, Filter, Edit, Check, ExternalLink } from 'lucide-react';
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

interface SearchResultsProps {
  entries: Entry[];
  query: string;
}

export function SearchResults({ entries, query }: SearchResultsProps) {
  if (entries.length === 0) {
    return (
      <Card className="p-12 text-center">
        <SearchIcon className="h-12 w-12 mx-auto text-muted mb-4 opacity-50" />
        <h3 className="text-lg font-semibold">No results found</h3>
        <p className="text-muted mt-2">
          No entries match &quot;{query}&quot;
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <Card key={entry.id} className="p-4 hover:border-accent/50 transition-colors">
          <div className="flex items-start justify-between gap-4">
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
  );
}

interface DashboardSearchProps {
  drafts: Entry[];
  published: Entry[];
}

export function DashboardSearch({ drafts, published }: DashboardSearchProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'drafts' | 'published'>('all');

  const allEntries = useMemo(() => {
    return [
      ...drafts.map(d => ({ ...d, status: 'draft' as const })),
      ...published.map(p => ({ ...p, status: 'published' as const })),
    ];
  }, [drafts, published]);

  const filteredEntries = useMemo(() => {
    return allEntries.filter(entry => {
      const matchesQuery = query === '' || 
        entry.title.toLowerCase().includes(query.toLowerCase()) ||
        entry.aiRewrite?.toLowerCase().includes(query.toLowerCase()) ||
        entry.category.toLowerCase().includes(query.toLowerCase());
      
      const matchesFilter = filter === 'all' ||
        (filter === 'drafts' && entry.status === 'draft') ||
        (filter === 'published' && entry.status === 'published');
      
      return matchesQuery && matchesFilter;
    });
  }, [allEntries, query, filter]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search entries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Entries</option>
            <option value="drafts">Drafts Only</option>
            <option value="published">Published Only</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {query || filter !== 'all' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              Found {filteredEntries.length} result{filteredEntries.length !== 1 ? 's' : ''}
              {query && (
                <span> for &quot;{query}&quot;</span>
              )}
            </p>
            
            {(query || filter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setFilter('all');
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
          
          <SearchResults entries={filteredEntries} query={query} />
        </div>
      ) : null}
    </div>
  );
}
