'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface WidgetConfig {
  id: string;
  colors: {
    primary: string;
    background: string;
    text: string;
  };
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size: 'small' | 'medium' | 'large';
  options: {
    showDate: boolean;
    showCategory: boolean;
    showNewBadge: boolean;
  };
}

interface ChangelogEntry {
  id: string;
  title: string;
  aiRewrite?: string;
  category: 'New' | 'Fixed' | 'Improved' | 'Other';
  mergedAt: string;
  prUrl: string;
}

interface EmbeddableWidgetProps {
  widgetId: string;
  apiUrl?: string;
}

export function EmbeddableWidget({ widgetId, apiUrl = '/api/widget' }: EmbeddableWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWidgetData() {
      try {
        const response = await fetch(`${apiUrl}/${widgetId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load widget');
        }

        const data = await response.json();
        setConfig(data.config);
        setEntries(data.entries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchWidgetData();
  }, [widgetId, apiUrl]);

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-surface-elevated border border-line rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <span className="text-sm text-muted">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return null; // Fail silently for widgets
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const sizeClasses = {
    small: 'w-64',
    medium: 'w-80',
    large: 'w-96',
  };

  const categoryColors = {
    New: 'bg-success/10 text-success border-success/20',
    Fixed: 'bg-blue/10 text-blue border-blue/20',
    Improved: 'bg-amber/10 text-amber border-amber/20',
    Other: 'bg-muted/10 text-muted border-muted/20',
  };

  return (
    <div className={cn('fixed z-50', positionClasses[config.position])}>
      {/* Widget Container */}
      <div className={cn('bg-surface-elevated border border-line shadow-2xl rounded-lg overflow-hidden', sizeClasses[config.size])}>
        
        {/* Widget Header */}
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer border-b border-line"
          style={{ backgroundColor: config.colors.background }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: config.colors.primary }} />
            <span className="font-semibold text-sm" style={{ color: config.colors.text }}>
              What's New
            </span>
            {config.options.showNewBadge && entries.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-white">
                {entries.length}
              </span>
            )}
          </div>
          <button className="text-muted hover:text-foreground transition-colors">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Widget Content */}
        {isOpen && (
          <div className="max-h-96 overflow-y-auto">
            {entries.length === 0 ? (
              <div className="p-4 text-center text-muted text-sm">
                No recent updates
              </div>
            ) : (
              <div className="divide-y divide-line">
                {entries.map((entry) => (
                  <a
                    key={entry.id}
                    href={entry.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 hover:bg-surface-highlight transition-colors"
                    onClick={() => {
                      // Track click
                      fetch(`${apiUrl}/track`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ widgetId, action: 'click', entryId: entry.id }),
                      }).catch(() => {});
                    }}
                  >
                    <div className="space-y-2">
                      {/* Category Badge */}
                      {config.options.showCategory && (
                        <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-medium border', categoryColors[entry.category])}>
                          {entry.category}
                        </span>
                      )}

                      {/* Title */}
                      <h4 className="text-sm font-medium text-foreground line-clamp-2">
                        {entry.aiRewrite || entry.title}
                      </h4>

                      {/* Date */}
                      {config.options.showDate && (
                        <p className="text-xs text-muted">
                          {new Date(entry.mergedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      )}

                      {/* View Link */}
                      <div className="flex items-center gap-1 text-xs text-accent hover:underline">
                        <span>View details</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="p-3 border-t border-line bg-surface-highlight">
              <a
                href={`https://gitlog.app/changelog/${config.userId}/${config.repoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs text-muted hover:text-accent transition-colors"
              >
                <span>View all updates</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Powered by GitLog Badge */}
      <div className="mt-2 text-center">
        <a
          href="https://gitlog.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted hover:text-accent transition-colors"
        >
          Powered by GitLog
        </a>
      </div>
    </div>
  );
}
