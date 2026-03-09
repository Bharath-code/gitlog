import Link from 'next/link';
import { GitMerge, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export default function ChangelogNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent-glow/20">
            <GitMerge className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-3">No changelog yet</h1>
        <p className="text-muted mb-8">
          This repository hasn't published any changelog entries yet. Check back soon for updates!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <Link href="https://gitlog.app" target="_blank" rel="noopener noreferrer">
            <Button className="gap-2 bg-accent hover:bg-accent/90">
              <ExternalLink className="h-4 w-4" />
              Create Your Changelog
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 pt-8 border-t border-line">
          <p className="text-sm text-muted">
            Want to auto-generate changelogs from GitHub PRs?
          </p>
          <a
            href="https://gitlog.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline text-sm font-semibold"
          >
            Get started with GitLog →
          </a>
        </div>
      </div>
    </div>
  );
}
