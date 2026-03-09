'use client';

import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { ThumbsUp, MessageSquare, Repeat, Send } from 'lucide-react';

interface LinkedInPostPreviewProps {
  post: string;
  hashtags: string[];
  authorName?: string;
  authorTitle?: string;
  authorImage?: string;
}

export function LinkedInPostPreview({
  post,
  hashtags,
  authorName = 'Your Company',
  authorTitle = 'Official Page',
  authorImage = '🏢',
}: LinkedInPostPreviewProps) {
  const charCount = post.length;
  const optimalRange = { min: 1000, max: 1300 };
  
  const getLengthStatus = () => {
    if (charCount < optimalRange.min) return 'too-short';
    if (charCount > optimalRange.max) return 'too-long';
    return 'good';
  };

  const lengthStatus = getLengthStatus();

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-xl">
            {authorImage}
          </div>
        </div>

        {/* Post Content */}
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{authorName}</span>
              <span className="text-xs text-muted">• {authorTitle}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
              <span>Just now</span>
              <span>•</span>
              <span>🌐</span>
            </div>
          </div>

          {/* Post Text */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {post}
            {hashtags.length > 0 && (
              <div className="mt-3 text-blue-600">
                {hashtags.join(' ')}
              </div>
            )}
          </div>

          {/* Character Count */}
          <div className="flex items-center justify-between pt-3 border-t border-line">
            <div className="flex items-center gap-2 text-xs">
              <span className={cn(
                'font-medium',
                lengthStatus === 'good' ? 'text-green-500' :
                lengthStatus === 'too-short' ? 'text-amber-500' : 'text-red-500'
              )}>
                {charCount} characters
              </span>
              <span className="text-muted">
                (optimal: {optimalRange.min}-{optimalRange.max})
              </span>
            </div>
            {lengthStatus === 'good' && (
              <span className="text-xs text-green-500">✓ Perfect length</span>
            )}
            {lengthStatus === 'too-short' && (
              <span className="text-xs text-amber-500">
                Add {optimalRange.min - charCount} more characters
              </span>
            )}
            {lengthStatus === 'too-long' && (
              <span className="text-xs text-red-500">
                Remove {charCount - optimalRange.max} characters
              </span>
            )}
          </div>

          {/* Engagement Metrics (Mock) */}
          <div className="flex items-center justify-between pt-3 border-t border-line">
            <div className="flex items-center gap-4 text-muted text-xs">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Comment</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <Repeat className="h-3.5 w-3.5" />
                <span>Repost</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
