'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { SectionHeading } from '@/shared/components/ui/section-heading';
import { Twitter, Linkedin, Sparkles, Copy, Check, RefreshCw, Clock } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { TwitterPostPreview } from '@/shared/components/social/twitter-preview';
import { LinkedInPostPreview } from '@/shared/components/social/linkedin-preview';

interface ChangelogEntry {
  id: string;
  title: string;
  aiRewrite?: string;
  category: string;
  mergedAt: string;
}

interface TwitterDraft {
  tweets: string[];
  hashtags: string[];
  tone: string;
}

interface LinkedInDraft {
  post: string;
  hashtags: string[];
  cta: string;
}

export default function SocialPostsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<'twitter' | 'linkedin' | null>(null);
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [twitterDraft, setTwitterDraft] = useState<TwitterDraft | null>(null);
  const [linkedinDraft, setLinkedInDraft] = useState<LinkedInDraft | null>(null);
  const [selectedTone, setSelectedTone] = useState<'professional' | 'casual' | 'exciting'>(
    'professional'
  );
  const [copied, setCopied] = useState<'twitter' | 'linkedin' | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    if (selectedEntry) {
      loadDrafts(selectedEntry);
    }
  }, [selectedEntry]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      // Mock data for now
      const mockEntries: ChangelogEntry[] = [
        {
          id: '1',
          title: 'Added dark mode toggle',
          aiRewrite:
            'Users can now switch between light and dark themes with a single click. The preference is saved automatically and persists across sessions.',
          category: 'New',
          mergedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Fixed login issue on mobile',
          aiRewrite:
            'Resolved authentication problems that prevented mobile users from logging in. All mobile users can now access their accounts seamlessly.',
          category: 'Fixed',
          mergedAt: new Date().toISOString(),
        },
      ];
      setEntries(mockEntries);
      if (mockEntries.length > 0) {
        setSelectedEntry(mockEntries[0].id);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
      toast.error('Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  const loadDrafts = async (entryId: string) => {
    try {
      const response = await fetch(`/api/social/generate?entryId=${entryId}`);
      if (response.ok) {
        const data = await response.json();
        setTwitterDraft(data.twitter);
        setLinkedInDraft(data.linkedin);
      }
    } catch (error) {
      console.error('Error loading drafts:', error);
    }
  };

  const generateDraft = async (platform: 'twitter' | 'linkedin') => {
    if (!selectedEntry) return;

    setGenerating(platform);
    try {
      const entry = entries.find((e) => e.id === selectedEntry);
      if (!entry) return;

      const response = await fetch('/api/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryId: selectedEntry,
          title: entry.title,
          description: entry.aiRewrite || entry.title,
          category: entry.category,
          platform,
          tone: platform === 'twitter' ? selectedTone : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate');
      }

      const data = await response.json();

      if (platform === 'twitter') {
        setTwitterDraft(data.data);
        toast.success('Twitter thread generated!');
      } else {
        setLinkedInDraft(data.data);
        toast.success('LinkedIn post generated!');
      }
    } catch (error) {
      console.error('Error generating draft:', error);
      toast.error(`Failed to generate ${platform} post`);
    } finally {
      setGenerating(null);
    }
  };

  const handleCopy = async (text: string, platform: 'twitter' | 'linkedin') => {
    await navigator.clipboard.writeText(text);
    setCopied(platform);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <SectionHeading title="Social Post Drafts" />
          <p className="text-muted mt-2">
            Auto-generate Twitter threads and LinkedIn posts for your changelogs
          </p>
        </div>
        <Badge variant="default">Phase 2</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Entries List */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Select Entry</h2>
          <div className="space-y-2">
            {entries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedEntry(entry.id)}
                className={
                  selectedEntry === entry.id
                    ? 'w-full p-3 rounded-lg bg-accent/10 border border-accent text-left'
                    : 'w-full p-3 rounded-lg border border-line hover:border-accent/50 text-left'
                }
              >
                <p className="font-medium text-sm truncate">{entry.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {entry.category}
                  </Badge>
                  <span className="text-xs text-muted">
                    {new Date(entry.mergedAt).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Twitter Generator */}
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold">Twitter Thread</h2>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value as any)}
                className="px-3 py-1.5 rounded-md border border-line bg-surface text-sm"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="exciting">Exciting</option>
              </select>
              <Button
                onClick={() => generateDraft('twitter')}
                disabled={generating === 'twitter'}
                size="sm"
                className="gap-2"
              >
                {generating === 'twitter' ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          {twitterDraft ? (
            <div className="space-y-4">
              <TwitterPostPreview tweets={twitterDraft.tweets} hashtags={twitterDraft.hashtags} />
              <div className="flex justify-end">
                <Button
                  onClick={() => handleCopy(twitterDraft.tweets.join('\n\n'), 'twitter')}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {copied === 'twitter' ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Thread
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted py-12">
              <Twitter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Click "Generate" to create a Twitter thread</p>
            </div>
          )}
        </Card>

        {/* LinkedIn Generator */}
        <Card className="p-4 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Linkedin className="h-5 w-5 text-blue-700" />
              <h2 className="font-semibold">LinkedIn Post</h2>
            </div>
            <Button
              onClick={() => generateDraft('linkedin')}
              disabled={generating === 'linkedin'}
              size="sm"
              className="gap-2"
            >
              {generating === 'linkedin' ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>

          {linkedinDraft ? (
            <div className="space-y-4">
              <LinkedInPostPreview post={linkedinDraft.post} hashtags={linkedinDraft.hashtags} />
              <div className="flex justify-end">
                <Button
                  onClick={() => handleCopy(linkedinDraft.post, 'linkedin')}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {copied === 'linkedin' ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted py-12">
              <Linkedin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Click "Generate" to create a LinkedIn post</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
