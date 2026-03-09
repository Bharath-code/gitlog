'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Trash2, Plus, ExternalLink, CreditCard, GitMerge } from 'lucide-react';
import Link from 'next/link';

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
        setRepos(repos.filter(r => r.id !== repoId));
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

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
            <p className="text-muted mt-1">Manage your account and repositories</p>
          </div>
          
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Connected Repositories */}
        <Card className="p-6">
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
            <div className="text-center py-8 text-muted">
              <GitMerge className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No repositories connected</p>
              <p className="text-sm mt-1">Connect your first repository to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-line bg-surface"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <GitMerge className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{repo.name}</span>
                        {repo.private && (
                          <Badge variant="secondary">Private</Badge>
                        )}
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
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Account Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={user?.emailAddresses[0]?.emailAddress || ''}
                readOnly
                className="w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-foreground"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">GitHub Account</label>
              <div className="flex items-center justify-between p-3 rounded-lg border border-line bg-surface">
                <span className="text-foreground">Connected</span>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Billing */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted" />
              <h2 className="text-xl font-semibold">Billing & Subscription</h2>
            </div>
            
            <Badge className={plan === 'pro' ? 'bg-accent text-white' : ''}>
              {plan === 'free' ? 'Free' : 'Pro'}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-surface-highlight">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Current Plan: {plan === 'free' ? 'Free' : 'Pro'}</p>
                  <p className="text-sm text-muted mt-1">
                    {plan === 'free' ? '50 entries/month, 1 repo' : 'Unlimited everything'}
                  </p>
                </div>
                
                {plan === 'free' ? (
                  <Link href="/upgrade">
                    <Button className="bg-accent hover:bg-accent/90">
                      Upgrade to Pro
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline">
                    Manage Subscription
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
