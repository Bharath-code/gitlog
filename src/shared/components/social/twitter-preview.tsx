'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';

interface TwitterPostPreviewProps {
  tweets: string[];
  hashtags: string[];
  authorName?: string;
  authorHandle?: string;
  authorImage?: string;
}

export function TwitterPostPreview({
  tweets,
  hashtags,
  authorName = 'Your Company',
  authorHandle = '@yourcompany',
  authorImage = '🏢',
}: TwitterPostPreviewProps) {
  const [expanded, setExpanded] = useState(false);

  const formatTweet = (text: string) => {
    // Add hashtags to last tweet
    if (hashtags.length > 0) {
      return `${text}\n\n${hashtags.join(' ')}`;
    }
    return text;
  };

  const getCharCount = (text: string) => {
    const withHashtags = formatTweet(text);
    return withHashtags.length;
  };

  return (
    <div className="space-y-4">
      {tweets.map((tweet, index) => {
        const charCount = getCharCount(tweet);
        const isLastTweet = index === tweets.length - 1;

        return (
          <Card key={index} className="p-4">
            <div className="flex gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-lg">
                  {authorImage}
                </div>
              </div>

              {/* Tweet Content */}
              <div className="flex-1 space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{authorName}</span>
                    <span className="text-muted text-sm">{authorHandle}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <span>{charCount}</span>
                    <span>/</span>
                    <span className={charCount > 280 ? 'text-red-500' : 'text-muted'}>280</span>
                  </div>
                </div>

                {/* Tweet Text */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {formatTweet(tweet)}
                </div>

                {/* Thread Indicator */}
                {!isLastTweet && (
                  <div className="flex items-center gap-2 text-muted text-xs">
                    <div className="h-4 w-px bg-line" />
                    <span>Show this thread</span>
                  </div>
                )}

                {/* Engagement Metrics (Mock) */}
                <div className="flex items-center justify-between pt-2 border-t border-line">
                  <div className="flex items-center gap-4 text-muted text-xs">
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{Math.floor(Math.random() * 50)}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                      <Repeat2 className="h-3.5 w-3.5" />
                      <span>{Math.floor(Math.random() * 30)}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <Heart className="h-3.5 w-3.5" />
                      <span>{Math.floor(Math.random() * 100)}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <Share className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Character Count Warning */}
      {tweets.some(tweet => getCharCount(tweet) > 280) && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          ⚠️ Some tweets exceed 280 characters. Please edit to shorten.
        </div>
      )}
    </div>
  );
}
