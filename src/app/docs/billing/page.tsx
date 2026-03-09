import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Check, X, CreditCard, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge>Billing</Badge>
          <h1 className="text-4xl font-bold">Plans & Pricing</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Simple, transparent pricing for teams of all sizes.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free Plan */}
          <Card className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold">Free</h3>
                <Badge variant="secondary">Current</Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">₹0</span>
                <span className="text-muted">/month</span>
              </div>
              <p className="text-sm text-muted mt-2">
                or $0/month for international users
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">What's included:</h4>
              <ul className="space-y-2">
                {[
                  '50 entries per month',
                  '1 connected repository',
                  '50 AI rewrites per month',
                  'Public changelog page',
                  'GitLog branding',
                ].map((feature, i) => (
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
                {[
                  'No priority support',
                  'No custom domains',
                  'No analytics',
                ].map((limitation, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <X className="h-4 w-4 text-muted mt-0.5 flex-shrink-0" />
                    <span className="text-muted">{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/dashboard">
              <Button className="w-full" variant="outline" disabled>
                Current Plan
              </Button>
            </Link>
          </Card>

          {/* Pro Plan */}
          <Card className="p-6 space-y-6 relative border-accent/50 shadow-lg shadow-accent-glow/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-accent text-white">
                <Zap className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold">Pro</h3>
                <Badge className="bg-accent/10 text-accent">Recommended</Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">₹499</span>
                <span className="text-muted">/month</span>
              </div>
              <p className="text-sm text-muted mt-2">
                or $19/month for international users
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Everything in Free, plus:</h4>
              <ul className="space-y-2">
                {[
                  'Unlimited entries',
                  'Unlimited repositories',
                  'Unlimited AI rewrites',
                  'Remove GitLog branding',
                  'Priority support',
                  'Early access to new features',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/upgrade">
              <Button className="w-full bg-accent hover:bg-accent/90">
                Upgrade to Pro
              </Button>
            </Link>

            <p className="text-xs text-muted text-center">
              Secure checkout powered by DodoPayment
              <br />
              Accepts all cards + UPI
            </p>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <CreditCard className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-2xl font-semibold">Payment Methods</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-surface-highlight">
              <h3 className="font-semibold mb-2">For Indian Users</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>• UPI (GPay, PhonePe, Paytm, etc.)</li>
                <li>• All Indian debit/credit cards</li>
                <li>• Net banking</li>
                <li>• Wallets</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-surface-highlight">
              <h3 className="font-semibold mb-2">For International Users</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>• Visa</li>
                <li>• Mastercard</li>
                <li>• American Express</li>
                <li>• All major international cards</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-2xl font-semibold">Security & Privacy</h2>
          </div>

          <div className="space-y-4 text-muted">
            <p>
              We take security seriously. All payments are processed securely by DodoPayment,
              a PCI DSS compliant payment processor.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <span>256-bit SSL encryption for all transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <span>We never store your card details</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <span>PCI DSS Level 1 compliant payment processor</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <span>3D Secure authentication for all card payments</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* FAQ */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">
                How does pricing work for international users?
              </h3>
              <p className="text-muted">
                Indian users pay ₹499/month while international users pay $19/month.
                DodoPayment automatically detects your location and shows the appropriate currency.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-muted">
                Yes! You can cancel your subscription anytime from your dashboard.
                You'll continue to have Pro access until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                What payment methods are accepted?
              </h3>
              <p className="text-muted">
                We accept all major credit/debit cards (Visa, Mastercard, Amex) and UPI for Indian users.
                Payments are processed securely by DodoPayment.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Is there a free trial?
              </h3>
              <p className="text-muted">
                Yes! We offer a 14-day free trial for new Pro users. No credit card required to start.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Do you offer discounts for open source?
              </h3>
              <p className="text-muted">
                Yes! Popular open source projects (100+ stars) get Pro for free.
                Email us at{' '}
                <a href="mailto:hello@gitlog.app" className="text-accent hover:underline">
                  hello@gitlog.app
                </a>{' '}
                with your repo link.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                What happens if I hit the free plan limit?
              </h3>
              <p className="text-muted">
                You'll see an upgrade prompt. Your existing entries stay published, but you can't
                publish new entries until you upgrade to Pro or the next month begins (limits reset monthly).
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-muted">
                Yes! We offer a 14-day money-back guarantee. If you're not satisfied,
                email us within 14 days of purchase for a full refund.
              </p>
            </div>
          </div>
        </Card>

        {/* Contact */}
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted mb-6">
            We're here to help! Contact us and we'll respond as soon as possible.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="mailto:hello@gitlog.app"
              className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90"
            >
              Email Us
            </a>
            <a
              href="https://twitter.com/gitlogapp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-line px-6 py-3 text-sm font-semibold hover:bg-surface-highlight"
            >
              Twitter
            </a>
            <a
              href="https://github.com/gitlogapp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-line px-6 py-3 text-sm font-semibold hover:bg-surface-highlight"
            >
              GitHub
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
