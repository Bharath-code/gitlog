'use client';

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { NotFoundIllustration } from '@/shared/components/common/illustrations';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.05)_0%,transparent_50%)] pointer-events-none" />
      <div className="max-w-md w-full text-center relative z-10 animate-slide-up-fade">
        <div className="mb-8 flex justify-center">
          <div className="w-64 h-64 relative">
            <NotFoundIllustration />
          </div>
        </div>

        <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-3xl font-semibold mb-6">Lost in space?</h2>
        <p className="text-muted mb-10 text-lg">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't
          exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="gap-2 bg-gradient-to-r from-accent to-accent-secondary hover:shadow-lg hover:shadow-accent-glow/40 transition-all hover:-translate-y-1 w-full sm:w-auto text-white">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2 hover:-translate-y-1 transition-all w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
