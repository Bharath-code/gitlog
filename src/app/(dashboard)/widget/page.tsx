'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { SectionHeading } from '@/shared/components/ui/section-heading';
import { Copy, Code, Check, Sparkles, ExternalLink } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { WidgetCustomizer } from '@/shared/components/widgets/widget-customizer';

export default function WidgetPage() {
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [repoId] = useState('default-repo'); // In production, get from connected repos
  const toast = useToast();

  const generateWidgetId = async () => {
    setLoading(true);
    try {
      // In production, you would get the actual repoId from connected repos
      const repoId = 'default-repo'; // Replace with actual repo selection
      
      const response = await fetch('/api/widget/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate widget');
      }

      const data = await response.json();
      setWidgetId(data.widgetId);
      toast.success('Widget generated successfully!');
    } catch (error) {
      console.error('Error generating widget:', error);
      toast.error('Failed to generate widget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scriptSnippet = widgetId
    ? `<script src="https://gitlog.app/widget.js" data-widget-id="${widgetId}" async></script>`
    : '';

  const handleCopy = async () => {
    if (!scriptSnippet) return;
    
    await navigator.clipboard.writeText(scriptSnippet);
    setCopied(true);
    toast.success('Script copied to clipboard!');
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <SectionHeading title="Embeddable Widget" />
          <p className="text-muted mt-2">
            Add a "What's New" widget to your website. Shows your latest changelog entries.
          </p>
        </div>
        <Badge variant="accent">Phase 2</Badge>
      </div>

      {/* Generate Widget */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-xl font-semibold">Generate Widget Script</h2>
          </div>

          <p className="text-muted">
            Create a unique widget ID for your repository. This ID will be used in the embed script.
          </p>

          {!widgetId ? (
            <Button onClick={generateWidgetId} disabled={loading} className="bg-accent hover:bg-accent/90">
              {loading ? 'Generating...' : 'Generate Widget ID'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-surface-highlight border border-line">
                <p className="text-sm text-muted mb-2">Your Widget ID:</p>
                <code className="text-accent font-mono">{widgetId}</code>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Script Snippet */}
      {widgetId && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Code className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-xl font-semibold">Embed Script</h2>
              </div>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <p className="text-muted">
              Add this script to your website's HTML, right before the closing <code>&lt;/body&gt;</code> tag.
            </p>

            <div className="p-4 rounded-lg bg-surface-highlight border border-line overflow-x-auto">
              <pre className="text-sm font-mono text-foreground">
                {scriptSnippet}
              </pre>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-blue/10 border border-blue/20">
              <h3 className="font-semibold text-blue mb-2">🧪 Test the Widget</h3>
              <p className="text-sm text-muted mb-3">
                Want to see how the widget looks before embedding on your site?
              </p>
              <a 
                href="/widget-test.html" 
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
              >
                Open test page
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </Card>
      )}

      {/* Preview */}
      {widgetId && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <ExternalLink className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold">Preview</h2>
            </div>

            <p className="text-muted">
              See how the widget will look on your website.
            </p>

            <div className="p-8 rounded-lg bg-surface-highlight border border-line flex items-center justify-center min-h-[200px]">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  What's New
                </div>
                <p className="text-sm text-muted">
                  Widget preview will appear here once deployed
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Customization */}
      {widgetId && (
        <WidgetCustomizer widgetId={widgetId} repoId={repoId} />
      )}

      {/* Next Steps */}
      {widgetId && (
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Next Steps</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border border-line bg-surface">
                <h3 className="font-semibold mb-2">📊 View Analytics</h3>
                <p className="text-sm text-muted mb-3">
                  Track impressions and clicks from your widget.
                </p>
                <a href="/analytics/widgets">
                  <Button variant="outline" size="sm" className="w-full">
                    View Analytics
                  </Button>
                </a>
              </div>
              <div className="p-4 rounded-lg border border-line bg-surface">
                <h3 className="font-semibold mb-2">📚 Documentation</h3>
                <p className="text-sm text-muted mb-3">
                  Learn more about widget integration and advanced usage.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Docs
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
