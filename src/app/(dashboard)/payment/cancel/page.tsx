'use client';

import Link from 'next/link';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { X, ArrowLeft } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        {/* Cancel Icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/10">
            <X className="h-8 w-8 text-muted" />
          </div>
        </div>

        {/* Message */}
        <div>
          <h1 className="text-2xl font-bold">Checkout Cancelled</h1>
          <p className="text-muted mt-2">
            No worries! You haven't been charged. Your account remains on the Free plan.
          </p>
        </div>

        {/* Still on Free Plan */}
        <div className="text-left space-y-2 bg-surface p-4 rounded-lg">
          <h3 className="font-semibold text-sm">Your Free plan includes:</h3>
          <ul className="space-y-1 text-sm text-muted">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              50 changelog entries per month
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              1 connected repository
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              50 AI rewrites per month
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Public changelog page
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <Link href="/upgrade">
            <Button className="w-full bg-accent hover:bg-accent/90">
              Try Again
            </Button>
          </Link>
        </div>

        {/* Questions */}
        <div className="text-xs text-muted space-y-2">
          <p>Have questions about Pro?</p>
          <p>
            Contact us at{' '}
            <a href="mailto:hello@gitlog.app" className="text-accent hover:underline">
              hello@gitlog.app
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
