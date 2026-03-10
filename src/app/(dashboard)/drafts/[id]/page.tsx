'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ArrowLeft, Sparkles, Save, Check, Trash2, ExternalLink, Copy } from 'lucide-react';
import Link from 'next/link';

interface Draft {
  id: string;
  title: string;
  body: string;
  category: string;
  aiRewrite?: string | null;
  mergedAt: string;
  prUrl: string;
  author: string;
  labels: string[];
}

export default function DraftDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [aiRewrite, setAiRewrite] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('New');

  useEffect(() => {
    async function fetchDraft() {
      try {
        const res = await fetch(`/api/drafts/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch draft');
        const data = await res.json();
        setDraft(data);
        setTitle(data.title);
        setCategory(data.category);
        setAiRewrite(data.aiRewrite || '');
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchDraft();
    }
  }, [params.id]);

  const handleRewrite = async () => {
    setRewriting(true);
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: draft?.id }),
      });

      if (!res.ok) throw new Error('Failed to rewrite');

      const data = await res.json();
      setAiRewrite(data.aiRewrite);
    } catch (error) {
      console.error('Rewrite error:', error);
      alert('Failed to generate AI rewrite');
    } finally {
      setRewriting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/drafts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          aiRewrite,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      alert('Draft saved successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm('Publish this entry? It will appear on your public changelog.')) {
      return;
    }

    try {
      const res = await fetch('/api/entries/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: draft?.id }),
      });

      if (!res.ok) throw new Error('Failed to publish');

      alert('Published successfully!');
      router.push('/dashboard/published');
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish');
    }
  };

  const handleDiscard = async () => {
    if (!confirm('Discard this draft? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/drafts/${params.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to discard');

      router.push('/dashboard');
    } catch (error) {
      console.error('Discard error:', error);
      alert('Failed to discard draft');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiRewrite);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 w-32 bg-surface-highlight rounded animate-pulse" />
          <div className="h-64 bg-surface rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Draft not found</h2>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Badge>{category}</Badge>
            <span className="text-sm text-muted">
              Merged {new Date(draft.mergedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <Card className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Enter title..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="New">New</option>
              <option value="Fixed">Fixed</option>
              <option value="Improved">Improved</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* AI Rewrite */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">AI Rewrite</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!aiRewrite}>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
                <Button variant="secondary" size="sm" onClick={handleRewrite} disabled={rewriting}>
                  <Sparkles className={`h-3.5 w-3.5 mr-1 ${rewriting && 'animate-spin'}`} />
                  {rewriting ? 'Writing...' : 'Regenerate'}
                </Button>
              </div>
            </div>

            {aiRewrite ? (
              <textarea
                value={aiRewrite}
                onChange={(e) => setAiRewrite(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                placeholder="AI rewrite will appear here..."
              />
            ) : (
              <div className="rounded-lg border border-line bg-surface p-4 text-center text-muted">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Click "Regenerate" to create an AI-powered rewrite</p>
              </div>
            )}
          </div>

          {/* Original PR */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Original PR</label>
              <a
                href={draft.prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View on GitHub
              </a>
            </div>
            <div className="rounded-lg border border-line bg-surface p-4">
              <p className="text-sm text-muted whitespace-pre-wrap">
                {draft.body || 'No description provided'}
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <Button variant="destructive" onClick={handleDiscard}>
            <Trash2 className="h-4 w-4 mr-2" />
            Discard
          </Button>

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>

            <Button onClick={handlePublish} className="bg-accent hover:bg-accent/90">
              <Check className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
