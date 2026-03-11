'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { GitMerge, Search, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';
import confetti from 'canvas-confetti';
import { OnboardingIllustration } from '@/shared/components/common/illustrations';
import { GitLogIcon } from '@/shared/components/common/icons';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  has_issues: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const toast = useToast();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  // Fetch GitHub repos on mount
  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch('/api/github/repos');
        if (!res.ok) {
          const data = await res.json();
          
          // If GitHub not connected or needs OAuth, redirect to OAuth flow
          if (res.status === 400 && data.needsOAuth) {
            // Show a brief message before redirecting
            setTimeout(() => {
              window.location.href = '/api/github/oauth/start';
            }, 1000);
            return;
          }
          
          throw new Error(data.error || data.message || 'Failed to fetch repos');
        }
        const data = await res.json();
        setRepos(data.repos);
        setStep(2); // Repos loaded, ready to select
      } catch (err) {
        console.error('Fetch repos error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load repositories');
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  const handleConnect = async (repo: GitHubRepo) => {
    setConnecting(repo.full_name);
    setError('');

    try {
      // Save repo connection to KV
      const res = await fetch('/api/github/repos/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoId: repo.id.toString(),
          name: repo.full_name,
          private: repo.private,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to connect repository');
      }

      // Celebrate! 🎉
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff6b35', '#22c55e', '#3b82f6', '#f59e0b'],
      });

      toast.success(`${repo.name} connected! You're all set! 🎉`);

      // Redirect to dashboard with celebration flag
      setTimeout(() => {
        router.push('/dashboard?onboarding=complete&connected=true');
      }, 800);
    } catch (err) {
      console.error('Connect error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect repository');
      toast.error('Failed to connect. Please try again.');
    } finally {
      setConnecting(null);
    }
  };

  const filteredRepos = repos.filter((repo) =>
    repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in</h1>
          <p className="text-muted mt-2">You need to be signed in to connect repositories.</p>
          <Button className="mt-4" onClick={() => router.push('/sign-in')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-3xl pt-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted">Step {step} of 2</span>
            <span className="text-sm text-muted">
              {step === 1 ? 'Loading your repos...' : 'Select a repository'}
            </span>
          </div>
          <div className="w-full bg-surface-highlight rounded-full h-2 overflow-hidden">
            <div
              className="bg-accent h-full transition-all duration-500 ease-out"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center">
            {loading ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent-glow/20">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            ) : error ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                <div className="h-8 w-8 text-red-500">!</div>
              </div>
            ) : (
              <OnboardingIllustration />
            )}
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {loading
              ? 'Setting Up Your Account...'
              : error
              ? 'Connection Required'
              : 'Connect Your Repository'}
          </h1>
          <p className="text-muted mt-2 max-w-md mx-auto">
            {loading
              ? 'Fetching your GitHub repositories...'
              : error
              ? 'Redirecting to GitHub OAuth...'
              : 'Select a repository to start auto-generating changelogs from merged PRs.'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {/* Repo List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-surface animate-pulse" />
            ))}
          </div>
        ) : filteredRepos.length === 0 ? (
          <Card className="p-12 text-center animate-slide-up-fade">
            <GitLogIcon className="mx-auto h-16 w-16 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No repositories found</h3>
            <p className="text-muted mt-2">
              {searchQuery
                ? 'No repositories match your search. Try a different query.'
                : "You don't have any repositories yet. Create one on GitHub!"}
            </p>
            {!searchQuery && (
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => window.open('https://github.com/new', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Create Repository
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredRepos.slice(0, 10).map((repo, index) => (
              <Card
                key={repo.id}
                className={cn(
                  'p-4 transition-all hover:border-accent/50 hover:shadow-lg animate-slide-up-fade',
                  connecting === repo.full_name && 'opacity-50'
                )}
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg',
                        repo.private ? 'bg-amber-500/10' : 'bg-accent/10'
                      )}
                    >
                      <GitMerge
                        className={cn('h-5 w-5', repo.private ? 'text-amber-500' : 'text-accent')}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{repo.full_name}</span>
                        {repo.private && (
                          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
                            Private
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted mt-1">
                        <span className="flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Has issues enabled
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleConnect(repo)}
                    disabled={connecting === repo.full_name}
                    className="bg-accent hover:bg-accent/90"
                  >
                    {connecting === repo.full_name ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <GitMerge className="h-4 w-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}

            {filteredRepos.length > 10 && (
              <p className="text-center text-sm text-muted pt-4">
                Showing 10 of {filteredRepos.length} repositories. Use search to find more.
              </p>
            )}
          </div>
        )}

        {/* Info Box */}
        <Card className="mt-8 p-5 bg-gradient-to-br from-surface-highlight to-surface border-line">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 flex-shrink-0">
              <Check className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold text-base">
                You're 1 click away from automated changelogs! 🚀
              </h4>
              <p className="text-sm text-muted mt-2 mb-3">After connecting, here's what happens:</p>
              <ul className="text-sm text-muted space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>We'll create a webhook in your repository (takes 2 seconds)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>Merged PRs automatically appear as drafts within 30 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>AI rewrites them into user-friendly changelog entries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>You review and publish with one click</span>
                </li>
              </ul>
              <div className="mt-4 p-3 rounded-lg bg-accent/5 border border-accent/10">
                <p className="text-xs text-accent font-medium">⏱️ Total setup time: ~30 seconds</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
