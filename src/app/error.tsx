'use client';

import Link from 'next/link';
import { GitMerge, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/20">
            <GitMerge className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-3">500</h1>
        <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
        <p className="text-muted mb-8">
          We encountered an error while loading this page. Please try again.
        </p>
        
        {error.message && (
          <div className="mb-6 p-4 rounded-lg bg-surface border border-line text-left">
            <code className="text-xs text-muted">{error.message}</code>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="gap-2 bg-accent hover:bg-accent/90">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
