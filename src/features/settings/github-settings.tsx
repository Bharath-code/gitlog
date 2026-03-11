'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  Github,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

interface ConnectedRepo {
  id: string;
  name: string;
  slug: string;
  isPrivate: boolean;
  connectedAt: string;
}

interface GitHubInfo {
  username: string;
  avatar: string;
  connectedAt: string;
}

export default function GitHubSettings() {
  const { user } = useUser();
  const toast = useToast();
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubInfo, setGithubInfo] = useState<GitHubInfo | null>(null);
  const [connectedRepos, setConnectedRepos] = useState<ConnectedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchGitHubStatus();
  }, []);

  async function fetchGitHubStatus() {
    try {
      const [githubRes, reposRes] = await Promise.all([
        fetch('/api/user/github/status'),
        fetch('/api/user/repos'),
      ]);

      if (githubRes.ok) {
        const data = await githubRes.json();
        setGithubConnected(data.connected);
        if (data.info) {
          setGithubInfo(data.info);
        }
      }

      if (reposRes.ok) {
        const data = await reposRes.json();
        setConnectedRepos(data.repos || []);
      }
    } catch (error) {
      console.error('Error fetching GitHub status:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleConnectGitHub() {
    try {
      // Redirect to GitHub OAuth
      const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
      const redirectUri = `${window.location.origin}/api/github/oauth/callback`;
      const scope = 'repo,user:email,read:user';

      const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

      window.location.href = githubOAuthUrl;
    } catch (error) {
      console.error('Error connecting GitHub:', error);
      toast.error('Failed to connect GitHub');
    }
  }

  async function handleDisconnectGitHub() {
    try {
      const res = await fetch('/api/user/github/disconnect', { method: 'POST' });

      if (res.ok) {
        setGithubConnected(false);
        setGithubInfo(null);
        toast.success('GitHub disconnected');
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (error) {
      toast.error('Failed to disconnect GitHub');
    }
  }

  async function handleSyncRepos() {
    setSyncing(true);
    try {
      const res = await fetch('/api/github/sync/manual', { method: 'POST' });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Synced ${data.synced || 0} repositories`);
        fetchGitHubStatus();
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      toast.error('Failed to sync repositories');
    } finally {
      setSyncing(false);
    }
  }

  async function handleDisconnectRepo(repoId: string, repoName: string) {
    try {
      const res = await fetch(`/api/user/repos/${repoId}`, { method: 'DELETE' });

      if (res.ok) {
        setConnectedRepos((prev) => prev.filter((r) => r.id !== repoId));
        toast.success(`Disconnected ${repoName}`);
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (error) {
      toast.error(`Failed to disconnect ${repoName}`);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 rounded-lg bg-surface animate-pulse" />
        <div className="h-32 rounded-lg bg-surface animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* GitHub Connection Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Github className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">GitHub Account</h3>
              <p className="text-sm text-muted mt-1">
                {githubConnected
                  ? `Connected as @${githubInfo?.username}`
                  : 'Connect your GitHub account to access repositories'}
              </p>

              {githubConnected && githubInfo && (
                <div className="flex items-center gap-2 mt-3 text-xs text-success">
                  <CheckCircle className="h-3 w-3" />
                  <span>
                    Connected since {new Date(githubInfo.connectedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {githubConnected ? (
            <Button
              variant="outline"
              onClick={handleDisconnectGitHub}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          ) : (
            <Button onClick={handleConnectGitHub} className="bg-accent hover:bg-accent/90">
              <Github className="h-4 w-4 mr-2" />
              Connect GitHub
            </Button>
          )}
        </div>
      </Card>

      {/* Repositories Card */}
      {githubConnected && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Connected Repositories</h3>
              <p className="text-sm text-muted">
                {connectedRepos.length} repository{connectedRepos.length !== 1 ? 'ies' : 'y'}{' '}
                connected
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSyncRepos} disabled={syncing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Repos'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = '/onboarding')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add More
              </Button>
            </div>
          </div>

          {connectedRepos.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted mb-4" />
              <h4 className="text-sm font-semibold">No repositories connected</h4>
              <p className="text-sm text-muted mt-2">
                Connect your first repository to start generating changelogs
              </p>
              <Button className="mt-4" onClick={() => (window.location.href = '/onboarding')}>
                <Plus className="h-4 w-4 mr-2" />
                Connect Repository
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {connectedRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-line bg-surface-highlight"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${repo.isPrivate ? 'bg-amber-500/10' : 'bg-accent/10'}`}
                    >
                      <Github
                        className={`h-5 w-5 ${repo.isPrivate ? 'text-amber-500' : 'text-accent'}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{repo.name}</span>
                        {repo.isPrivate && (
                          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
                            Private
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        Connected {new Date(repo.connectedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://github.com/${repo.name}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisconnectRepo(repo.id, repo.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
