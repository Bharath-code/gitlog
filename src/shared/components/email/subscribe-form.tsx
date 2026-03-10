'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/hooks/use-toast';

interface SubscribeFormProps {
  repoId: string;
  repoName?: string;
}

export function SubscribeForm({ repoId, repoName }: SubscribeFormProps) {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          repoId,
          action: 'subscribe',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSubscribed(true);
      toast.success(data.message || 'Please check your email to confirm');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500">
        <p className="font-medium">✓ Please check your email to confirm subscription</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold mb-2">
          Get email updates from {repoName || 'this project'}
        </h3>
        <p className="text-xs text-muted mb-3">
          Be the first to know when new features are released. No spam, unsubscribe anytime.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={loading}
          className="flex-1 px-3 py-2 rounded-md border border-line bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <Button type="submit" disabled={loading} size="sm" className="bg-accent hover:bg-accent/90">
          {loading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>

      <p className="text-xs text-muted">
        By subscribing, you agree to receive email updates from {repoName || 'this project'}.
      </p>
    </form>
  );
}
