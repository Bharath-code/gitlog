'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { SectionHeading } from '@/shared/components/ui/section-heading';
import { useToast } from '@/shared/hooks/use-toast';
import { Package, Plus, ExternalLink, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

interface Release {
  id: string;
  version: string;
  title?: string;
  description?: string;
  entryIds: string[];
  publishedAt: string;
  isPublished: boolean;
  highlights?: string[];
}

export default function ReleasesPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [releases, setReleases] = useState<Release[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadReleases();
  }, []);

  const loadReleases = async () => {
    try {
      const res = await fetch('/api/releases');
      const data = await res.json();
      setReleases(data.releases || []);
    } catch (error) {
      console.error('Error loading releases:', error);
    } finally {
      setLoading(false);
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
      <div className="flex items-center justify-between">
        <div>
          <SectionHeading title="Releases" />
          <p className="text-muted mt-2">
            Group changelog entries into versioned releases
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Release
        </Button>
      </div>

      {releases.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-muted mb-4" />
          <h3 className="text-xl font-semibold mb-2">No releases yet</h3>
          <p className="text-muted mb-4">
            Create your first versioned release to group changelog entries
          </p>
          <Button onClick={() => setShowCreateModal(true)} className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Release
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {releases.map((release) => (
            <Card key={release.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={release.isPublished ? 'bg-success' : 'bg-muted'}>
                      {release.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    <h3 className="text-2xl font-bold font-mono">{release.version}</h3>
                    {release.title && (
                      <span className="text-lg text-muted">— {release.title}</span>
                    )}
                  </div>

                  {release.description && (
                    <p className="text-muted mb-4">{release.description}</p>
                  )}

                  {release.highlights && release.highlights.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Highlights:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted">
                        {release.highlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(release.publishedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {release.entryIds.length} entries
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link href={`/releases/${release.version}`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  {!release.isPublished && (
                    <Button
                      onClick={() => publishRelease(release.id)}
                      size="sm"
                      className="bg-accent hover:bg-accent/90"
                    >
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Release Modal would go here */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Release</h2>
            <p className="text-muted mb-4">
              Release grouping is coming in Phase 3. This is a placeholder for the full implementation.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Close
              </Button>
              <Button className="bg-accent hover:bg-accent/90">
                Create Release (Coming Soon)
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
