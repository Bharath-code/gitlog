'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Check, X, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const plans = {
  free: {
    name: 'Free',
    priceINR: 0,
    priceUSD: 0,
    features: [
      '50 entries per month',
      '1 connected repository',
      '50 AI rewrites per month',
      'Public changelog page',
      'GitLog branding',
    ],
    limitations: [
      'No priority support',
      'No custom domains',
      'No analytics',
    ],
  },
  pro: {
    name: 'Pro',
    priceINR: 499,
    priceUSD: 19,
    features: [
      'Unlimited entries',
      'Unlimited repositories',
      'Unlimited AI rewrites',
      'Public changelog page',
      'Remove GitLog branding',
      'Priority support',
      'Early access to new features',
    ],
    popular: true,
  },
};

export default function UpgradePage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to DodoPayment checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Choose Your Plan</h1>
            <p className="text-muted mt-1">
              Upgrade to unlock unlimited changelogs and premium features
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free Plan */}
          <Card className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold">{plans.free.name}</h3>
                <Badge variant="secondary">Current</Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">₹{plans.free.priceINR}</span>
                <span className="text-muted">/month</span>
              </div>
              <p className="text-sm text-muted mt-2">
                or ${plans.free.priceUSD}/month for international users
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">What's included:</h4>
              <ul className="space-y-2">
                {plans.free.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted">Limitations:</h4>
              <ul className="space-y-2">
                {plans.free.limitations.map((limitation, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <X className="h-4 w-4 text-muted mt-0.5 flex-shrink-0" />
                    <span className="text-muted">{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button className="w-full" variant="outline" disabled>
              Current Plan
            </Button>
          </Card>

          {/* Pro Plan */}
          <Card className="p-6 space-y-6 relative border-accent/50 shadow-lg shadow-accent-glow/10">
            {plans.pro.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-accent text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold">{plans.pro.name}</h3>
                <Badge className="bg-accent/10 text-accent">Recommended</Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">₹{plans.pro.priceINR}</span>
                <span className="text-muted">/month</span>
              </div>
              <p className="text-sm text-muted mt-2">
                or ${plans.pro.priceUSD}/month for international users
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Everything in Free, plus:</h4>
              <ul className="space-y-2">
                {plans.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              className="w-full bg-accent hover:bg-accent/90"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </>
              )}
            </Button>

            <p className="text-xs text-muted text-center">
              Secure checkout powered by DodoPayment
              <br />
              Accepts all cards + UPI
            </p>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-1">
                How does pricing work for international users?
              </h4>
              <p className="text-sm text-muted">
                Indian users pay ₹499/month while international users pay $19/month.
                DodoPayment automatically detects your location and shows the appropriate currency.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">
                Can I cancel anytime?
              </h4>
              <p className="text-sm text-muted">
                Yes! You can cancel your subscription anytime from your dashboard.
                You'll continue to have Pro access until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">
                What payment methods are accepted?
              </h4>
              <p className="text-sm text-muted">
                We accept all major credit/debit cards (Visa, Mastercard, Amex) and UPI for Indian users.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">
                Is there a free trial?
              </h4>
              <p className="text-sm text-muted">
                Yes! We offer a 14-day free trial for new Pro users. No credit card required to start.
              </p>
            </div>
          </div>
        </Card>

        {/* Trust Signals */}
        <div className="text-center text-sm text-muted">
          <p>✓ Secure checkout with 256-bit encryption</p>
          <p>✓ Trusted by 500+ founders</p>
          <p>✓ 30-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
}
