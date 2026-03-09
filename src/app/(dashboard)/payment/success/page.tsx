'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    // Verify the session (in production, you'd validate with DodoPayment)
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Here you would verify the session with your backend
      // For now, we'll just simulate processing
      setTimeout(() => {
        setProcessing(false);
      }, 2000);
    } else {
      setProcessing(false);
    }
  }, [searchParams]);

  if (processing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent mx-auto" />
          <h2 className="text-xl font-bold">Processing your payment...</h2>
          <p className="text-muted">Please wait while we confirm your subscription.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <Check className="h-8 w-8 text-success" />
          </div>
        </div>

        {/* Success Message */}
        <div>
          <h1 className="text-3xl font-bold">Welcome to Pro! 🎉</h1>
          <p className="text-muted mt-2">
            Your subscription has been activated. You now have access to all Pro features.
          </p>
        </div>

        {/* What's Included */}
        <div className="text-left space-y-2 bg-surface p-4 rounded-lg">
          <h3 className="font-semibold text-sm">Your Pro features:</h3>
          <ul className="space-y-1 text-sm text-muted">
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-success" />
              Unlimited changelog entries
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-success" />
              Unlimited repositories
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-success" />
              Unlimited AI rewrites
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-success" />
              Remove GitLog branding
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-success" />
              Priority support
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/dashboard">
            <Button className="w-full bg-accent hover:bg-accent/90">
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          
          <Link href="/dashboard/settings">
            <Button variant="outline" className="w-full">
              Manage Subscription
            </Button>
          </Link>
        </div>

        {/* Receipt Info */}
        <p className="text-xs text-muted">
          A confirmation email has been sent to your registered email address.
          <br />
          Need help? Contact us at hello@gitlog.app
        </p>
      </Card>
    </div>
  );
}
