'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Download, FileText, Code } from 'lucide-react';

interface ExportOptions {
  format: 'markdown' | 'json';
  entries: 'all' | 'published' | 'drafts';
  groupBy: 'month' | 'category' | 'none';
}

interface ExportProps {
  drafts?: any[];
  published?: any[];
}

export function ExportChangelog({ drafts = [], published = [] }: ExportProps) {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'markdown',
    entries: 'published',
    groupBy: 'month',
  });
  const [exporting, setExporting] = useState(false);

  const generateMarkdown = () => {
    const entriesToExport =
      options.entries === 'published'
        ? published
        : options.entries === 'drafts'
          ? drafts
          : [...published, ...drafts];

    let markdown = '# Changelog\n\n';
    markdown += `Generated on ${new Date().toLocaleDateString()}\n\n`;

    if (options.groupBy === 'month') {
      const grouped = entriesToExport.reduce(
        (acc, entry) => {
          const month = new Date(entry.publishedAt || entry.mergedAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          });
          if (!acc[month]) acc[month] = [];
          acc[month].push(entry);
          return acc;
        },
        {} as Record<string, any[]>
      );

      Object.entries(grouped).forEach(([month, entries]) => {
        markdown += `## ${month}\n\n`;
        (entries as any[]).forEach((entry) => {
          markdown += `### ${entry.title}\n\n`;
          markdown += `- **Category:** ${entry.category}\n`;
          markdown += `- **Date:** ${new Date(entry.publishedAt || entry.mergedAt).toLocaleDateString()}\n`;
          if (entry.aiRewrite) {
            markdown += `\n${entry.aiRewrite}\n\n`;
          }
          markdown += `---\n\n`;
        });
      });
    } else {
      entriesToExport.forEach((entry) => {
        markdown += `### ${entry.title}\n\n`;
        markdown += `- **Category:** ${entry.category}\n`;
        markdown += `- **Date:** ${new Date(entry.publishedAt || entry.mergedAt).toLocaleDateString()}\n`;
        if (entry.aiRewrite) {
          markdown += `\n${entry.aiRewrite}\n\n`;
        }
        markdown += `---\n\n`;
      });
    }

    return markdown;
  };

  const generateJSON = () => {
    const entriesToExport =
      options.entries === 'published'
        ? published
        : options.entries === 'drafts'
          ? drafts
          : [...published, ...drafts];

    return JSON.stringify(
      {
        generated: new Date().toISOString(),
        options,
        count: entriesToExport.length,
        entries: entriesToExport,
      },
      null,
      2
    );
  };

  const handleExport = () => {
    setExporting(true);

    const content = options.format === 'markdown' ? generateMarkdown() : generateJSON();
    const extension = options.format === 'markdown' ? 'md' : 'json';
    const mimeType = options.format === 'markdown' ? 'text/markdown' : 'application/json';

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `changelog-${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExporting(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
          <Download className="h-5 w-5 text-accent" />
        </div>
        <h2 className="text-2xl font-semibold">Export Changelog</h2>
      </div>

      <div className="space-y-4">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Format</label>
          <div className="flex gap-2">
            <Button
              variant={
                (options.format === 'markdown' ? 'primary' : 'outline') as 'primary' | 'outline'
              }
              size="sm"
              onClick={() => setOptions({ ...options, format: 'markdown' })}
              className={options.format === 'markdown' ? 'bg-accent' : ''}
            >
              <FileText className="h-4 w-4 mr-2" />
              Markdown
            </Button>
            <Button
              variant={(options.format === 'json' ? 'primary' : 'outline') as 'primary' | 'outline'}
              size="sm"
              onClick={() => setOptions({ ...options, format: 'json' })}
              className={options.format === 'json' ? 'bg-accent' : ''}
            >
              <Code className="h-4 w-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>

        {/* Entries Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Entries to Export</label>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={
                (options.entries === 'published' ? 'primary' : 'outline') as 'primary' | 'outline'
              }
              size="sm"
              onClick={() => setOptions({ ...options, entries: 'published' })}
              className={options.entries === 'published' ? 'bg-accent' : ''}
            >
              Published ({published.length})
            </Button>
            <Button
              variant={
                (options.entries === 'drafts' ? 'primary' : 'outline') as 'primary' | 'outline'
              }
              size="sm"
              onClick={() => setOptions({ ...options, entries: 'drafts' })}
              className={options.entries === 'drafts' ? 'bg-accent' : ''}
            >
              Drafts ({drafts.length})
            </Button>
            <Button
              variant={(options.entries === 'all' ? 'primary' : 'outline') as 'primary' | 'outline'}
              size="sm"
              onClick={() => setOptions({ ...options, entries: 'all' })}
              className={options.entries === 'all' ? 'bg-accent' : ''}
            >
              All ({published.length + drafts.length})
            </Button>
          </div>
        </div>

        {/* Group By */}
        {options.entries !== 'drafts' && (
          <div>
            <label className="block text-sm font-medium mb-2">Group By</label>
            <div className="flex gap-2">
              <Button
                variant={
                  (options.groupBy === 'month' ? 'primary' : 'outline') as 'primary' | 'outline'
                }
                size="sm"
                onClick={() => setOptions({ ...options, groupBy: 'month' })}
                className={options.groupBy === 'month' ? 'bg-accent' : ''}
              >
                Month
              </Button>
              <Button
                variant={
                  (options.groupBy === 'none' ? 'primary' : 'outline') as 'primary' | 'outline'
                }
                size="sm"
                onClick={() => setOptions({ ...options, groupBy: 'none' })}
                className={options.groupBy === 'none' ? 'bg-accent' : ''}
              >
                None
              </Button>
            </div>
          </div>
        )}

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={exporting || (options.entries === 'published' && published.length === 0)}
          className="w-full bg-accent hover:bg-accent/90"
          size="lg"
        >
          <Download className="h-4 w-4 mr-2" />
          {exporting ? 'Generating...' : `Export ${options.format.toUpperCase()}`}
        </Button>

        {options.entries === 'published' && published.length === 0 && (
          <p className="text-sm text-muted text-center">No published entries to export</p>
        )}
      </div>
    </Card>
  );
}
