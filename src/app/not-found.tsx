"use client";

import Link from 'next/link';
import { GitMerge, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent-glow/20">
            <GitMerge className="h-8 w-8 text-white" />
          </div>
        </div>

        <h1 className="text-6xl font-bold mb-3">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
        <p className="text-muted mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2 bg-accent hover:bg-accent/90">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>

          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
