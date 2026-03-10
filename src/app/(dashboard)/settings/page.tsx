'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Trash2, Plus, ExternalLink, CreditCard, GitMerge, Search } from 'lucide-react';
import Link from 'next/link';
import { SettingsTabs, SettingsTab } from '@/shared/components/settings/settings-tabs';
import { PublishingSettingsTab } from '@/shared/components/settings/publishing-settings';

interface Repo {
  id: string;
  name: string;
  private: boolean;
  connectedAt: string;
}

export default function SettingsPage() {
  const { user } = useUser();
  const [plan, setPlan] = useState<'free' | 'pro'>('free');
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [planRes, reposRes] = await Promise.all([
          fetch('/api/user/plan'),
          fetch('/api/user/repos'),
        ]);

        const planData = await planRes.json();
        const reposData = await reposRes.json();

        setPlan(planData.plan || 'free');
        setRepos(reposData.repos || []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDisconnect = async (repoId: string) => {
    if (!confirm('Disconnect this repository?')) return;

    try {
      const res = await fetch(`/api/user/repos/${repoId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setRepos(repos.filter((r) => r.id !== repoId));
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-surface-highlight rounded animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-surface rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted mt-1">Manage your account, publishing, and integrations</p>
          </div>

          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Tabs */}
        <Card className="p-0 overflow-hidden">
          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* Search Repos */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-line bg-surface pl-10 pr-4 py-2 text-sm"
                  />
                </div>

                {/* Connected Repositories */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Connected Repositories</h2>
                    <Link href="/onboarding">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Connect New
                      </Button>
                    </Link>
                  </div>

                  {repos.length === 0 ? (
                    <Card className="p-12 text-center">
                      <GitMerge className="h-12 w-12 mx-auto text-muted mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold">No repositories connected</h3>
                      <p className="text-muted mt-2">
                        Connect your first repository to get started
                      </p>
                      <Link href="/onboarding">
                        <Button className="mt-4">Connect Repository</Button>
                      </Link>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {filteredRepos.map((repo) => (
                        <Card key={repo.id} className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                              <GitMerge className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{repo.name}</span>
                                {repo.private && <Badge variant="secondary">Private</Badge>}
                              </div>
                              <span className="text-sm text-muted">
                                Connected {new Date(repo.connectedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect(repo.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Disconnect
                          </Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Account Settings */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Account</h2>
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          value={user?.emailAddresses[0]?.emailAddress || ''}
                          readOnly
                          className="w-full rounded-lg border border-line bg-surface-highlight px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Plan</label>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-surface-highlight border border-line">
                          <div>
                            <span className="font-semibold capitalize">{plan}</span>
                            <span className="text-sm text-muted ml-2">
                              {plan === 'free' ? '50 entries/month' : 'Unlimited everything'}
                            </span>
                          </div>
                          {plan === 'free' && (
                            <Link href="/dashboard/upgrade">
                              <Button size="sm">Upgrade to Pro</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'publishing' && <PublishingSettingsTab />}

            {activeTab === 'integrations' && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold">Integrations Coming Soon</h3>
                <p className="text-muted mt-2">
                  Slack, Discord, and email integrations are on the way!
                </p>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold">API Keys</h3>
                <p className="text-muted mt-2">Manage your API keys and access tokens</p>
                <Link href="/dashboard/settings/api-keys">
                  <Button className="mt-4">Manage API Keys</Button>
                </Link>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold">Billing & Subscription</h3>
                <p className="text-muted mt-2">Manage your subscription and payment methods</p>
                <Link href="/dashboard/billing">
                  <Button className="mt-4">Manage Billing</Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
