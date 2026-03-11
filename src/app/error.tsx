'use client';

import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ErrorIllustration } from '@/shared/components/common/illustrations';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_50%)] pointer-events-none" />
      <div className="max-w-md w-full text-center relative z-10 animate-slide-up-fade">
        <div className="mb-8 flex justify-center">
          <div className="w-56 h-56 relative">
            <ErrorIllustration />
          </div>
        </div>

        <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          500
        </h1>
        <h2 className="text-3xl font-semibold mb-6">System malfunction</h2>
        <p className="text-muted mb-8 text-lg">
          We encountered an error while loading this page. Our gears are a bit jammed.
        </p>

        {error.message && (
          <div className="mb-8 p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-red-500/20 text-left shadow-lg">
            <code className="text-sm text-red-400 font-mono break-words">{error.message}</code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-1 w-full sm:w-auto text-white border-0"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="gap-2 hover:-translate-y-1 transition-all w-full sm:w-auto"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
