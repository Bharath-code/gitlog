'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { RoadmapCards } from '@/features/roadmap/roadmap-cards';
import { TrendingUp, Users } from 'lucide-react';

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

export default function PublicRoadmapPage({
  params,
}: {
  params: Promise<{
    user: string;
    repo: string;
  }>;
}) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<RoadmapItem[]>([]);

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    setLoading(true);
    try {
      // Mock data - in production, fetch from API
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
        {
          id: '4',
          issueId: 104,
          title: 'API rate limiting',
          body: 'Implement rate limiting to prevent abuse and ensure fair usage.',
          status: 'planned',
          upvotes: 15,
          labels: ['backend', 'security'],
          githubIssueUrl: 'https://github.com/user/repo/issues/104',
        },
      ];
      setItems(mockData);
    } catch (error) {
      console.error('Error loading roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  const totalUpvotes = items.reduce((sum, item) => sum + item.upvotes, 0);
  const topFeature = items.length > 0 ? items.reduce((prev, current) =>
    current.upvotes > prev.upvotes ? current : prev
  ) : null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Product Roadmap</span>
          </div>
          <h1 className="text-4xl font-bold">Help Shape Our Product</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Upvote features you'd like to see. We prioritize based on community feedback.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-accent">{items.length}</div>
            <div className="text-sm text-muted mt-1">Features Planned</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-accent">{totalUpvotes}</div>
            <div className="text-sm text-muted mt-1">Community Votes</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-accent">
              {items.filter(i => i.status === 'completed').length}
            </div>
            <div className="text-sm text-muted mt-1">Features Shipped</div>
          </Card>
        </div>

        {/* Top Feature */}
        {topFeature && (
          <Card className="p-6 bg-accent/5 border-accent/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-bold text-sm">
                🏆
              </div>
              <h2 className="font-semibold">Most Requested Feature</h2>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{topFeature.title}</h3>
              <p className="text-muted">{topFeature.body}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-accent">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">{topFeature.upvotes} upvotes</span>
                </div>
                <div className="flex items-center gap-1 text-muted">
                  <Users className="h-4 w-4" />
                  <span>Community priority</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Roadmap */}
        <Card className="p-6">
          <RoadmapCards items={items} />
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted">
          <p>Want to suggest a feature?</p>
          <a
            href={`https://github.com/${params.then(p => p.user)}/${params.then(p => p.repo)}/issues/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Create an issue on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
