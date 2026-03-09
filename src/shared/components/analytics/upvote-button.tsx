'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';

interface UpvoteButtonProps {
  entryId: string;
  initialVotes?: number;
}

export function UpvoteButton({ entryId, initialVotes = 0 }: UpvoteButtonProps) {
  const toast = useToast();
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user has already voted
    const votedEntries = localStorage.getItem('voted_entries');
    if (votedEntries) {
      const entries = JSON.parse(votedEntries);
      setHasVoted(entries.includes(entryId));
    }
  }, [entryId]);

  const handleUpvote = async () => {
    if (hasVoted) {
      toast.info('You\'ve already upvoted this entry');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analytics/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId }),
      });

      if (!response.ok) {
        throw new Error('Failed to upvote');
      }

      const data = await response.json();
      
      setVotes(data.votes);
      setHasVoted(true);
      
      // Save to localStorage
      const votedEntries = JSON.parse(localStorage.getItem('voted_entries') || '[]');
      votedEntries.push(entryId);
      localStorage.setItem('voted_entries', JSON.stringify(votedEntries));
      
      toast.success('Thanks for your feedback!');
    } catch (error) {
      console.error('Error upvoting:', error);
      toast.error('Failed to upvote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpvote}
      disabled={hasVoted || loading}
      variant="outline"
      size="sm"
      className={cn(
        'gap-2 transition-all',
        hasVoted && 'bg-accent/10 border-accent text-accent'
      )}
    >
      <ThumbsUp className={cn('h-4 w-4', hasVoted && 'fill-current')} />
      <span>{votes}</span>
      <span className="text-xs text-muted">
        {hasVoted ? 'Upvoted' : 'Upvote'}
      </span>
    </Button>
  );
}
