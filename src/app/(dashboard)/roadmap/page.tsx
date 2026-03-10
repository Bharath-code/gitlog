'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { SectionHeading } from '@/shared/components/ui/section-heading';
import { RoadmapCards } from '@/features/roadmap/roadmap-cards';
import { Github, RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

interface RoadmapItem {
  id: string;
  issueId: number;
  title: string;
  body: string;
  status: 'planned' | 'in-progress' | 'completed';
  upvotes: number;
  labels: string[];
  githubIssueUrl: string;
}

export default function RoadmapPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [items, setItems] = useState<RoadmapItem[]>([]);

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockData: RoadmapItem[] = [
        {
          id: '1',
          issueId: 101,
          title: 'Add dark mode support',
          body: 'Users have been requesting dark mode for a better nighttime experience.',
          status: 'in-progress',
          upvotes: 45,
          labels: ['enhancement', 'ui'],
          githubIssueUrl: 'https://github.com/user/repo/issues/101',
        },
        {
          id: '2',
          issueId: 102,
          title: 'Improve mobile performance',
          body: 'Optimize rendering on mobile devices for smoother scrolling.',
          status: 'planned',
          upvotes: 32,
          labels: ['performance', 'mobile'],
          githubIssueUrl: 'https://github.com/user/repo/issues/102',
        },
        {
          id: '3',
          issueId: 103,
          title: 'Add export functionality',
          body: 'Allow users to export their data in multiple formats.',
          status: 'completed',
          upvotes: 28,
          labels: ['feature'],
          githubIssueUrl: 'https://github.com/user/repo/issues/103',
        },
      ];
      setItems(mockData);
    } catch (error) {
      console.error('Error loading roadmap:', error);
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      // In production, call the API with actual repo info
      toast.success('Synced with GitHub Issues!');
      loadRoadmap();
    } catch (error) {
      console.error('Error syncing:', error);
      toast.error('Failed to sync with GitHub');
    } finally {
      setSyncing(false);
    }
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
          <SectionHeading title="Product Roadmap" />
          <p className="text-muted mt-2">
            Track upcoming features and improvements from GitHub Issues
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default">Phase 2</Badge>
          <Button
            onClick={handleSync}
            disabled={syncing}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {syncing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Github className="h-4 w-4" />
                Sync Issues
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue/10 flex-shrink-0">
            <ExternalLink className="h-5 w-5 text-blue" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Public Roadmap</h3>
            <p className="text-sm text-muted">
              Share your roadmap with users at:{' '}
              <code className="bg-surface px-2 py-0.5 rounded text-accent">
                /roadmap/your-username/your-repo
              </code>
            </p>
            <p className="text-sm text-muted">Users can upvote features they want to see most.</p>
          </div>
        </div>
      </Card>

      {/* Roadmap Cards */}
      <Card className="p-6">
        <RoadmapCards items={items} />
      </Card>
    </div>
  );
}
