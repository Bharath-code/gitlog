'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { SectionHeading } from '@/shared/components/ui/section-heading';
import { CreditCard, Building2, Calendar, Download, ExternalLink, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';

interface Usage {
  entriesPublished: number;
  aiRewrites: number;
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  url?: string;
}

export default function BillingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<'free' | 'pro'>('free');
  const [usage, setUsage] = useState<Usage>({ entriesPublished: 0, aiRewrites: 0 });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dodoCustomerId, setDodoCustomerId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [planRes, usageRes, customerRes] = await Promise.all([
          fetch('/api/user/plan'),
          fetch('/api/user/usage'),
          fetch('/api/user/dodo-customer'),
        ]);

        const planData = await planRes.json();
        const usageData = await usageRes.json();
        const customerData = await customerRes.json();

        setPlan(planData.plan || 'free');
        setUsage(usageData.usage || { entriesPublished: 0, aiRewrites: 0 });
        setDodoCustomerId(customerData.customerId || null);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleManageSubscription = () => {
    // Redirect to DodoPayment customer portal
    // In production, you'd get this URL from your backend
    const portalUrl = `https://app.dodopayment.com/customer/${dodoCustomerId}`;
    window.open(portalUrl, '_blank');
  };

  const handleUpgrade = () => {
    router.push('/upgrade');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-surface-highlight rounded animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-surface rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const limits = {
    free: { entries: 50, aiRewrites: 50, repos: 1 },
    pro: { entries: Infinity, aiRewrites: Infinity, repos: Infinity },
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <SectionHeading title="Billing & Subscription" />
            <p className="text-muted mt-1">Manage your plan, usage, and payment details</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Current Plan */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <CreditCard className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Current Plan</h2>
                <p className="text-sm text-muted">
                  {plan === 'free' ? 'Free tier' : 'Pro subscription'}
                </p>
              </div>
            </div>
            <Badge className={cn('text-sm px-3 py-1', plan === 'pro' && 'bg-accent text-white')}>
              {plan === 'free' ? 'Free' : 'Pro'}
            </Badge>
          </div>

          <div className="space-y-4">
            {plan === 'free' ? (
              <div className="p-4 rounded-lg bg-surface-highlight">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold mb-1">Free Plan</p>
                    <p className="text-sm text-muted">50 entries/month • 1 repo • 50 AI rewrites</p>
                  </div>
                  <Button onClick={handleUpgrade} className="bg-accent hover:bg-accent/90">
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold mb-1">Pro Plan</p>
                    <p className="text-sm text-muted">
                      Unlimited entries • Unlimited repos • Unlimited AI rewrites
                    </p>
                  </div>
                  <Button onClick={handleManageSubscription} variant="outline">
                    Manage Subscription
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Current Month Usage */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue/10">
              <Building2 className="h-6 w-6 text-blue" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Usage This Month</h2>
              <p className="text-sm text-muted">{month}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Entries */}
            <div className="p-4 rounded-lg border border-line bg-surface-highlight">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted">Entries</span>
                <span className="text-xs text-muted">
                  {plan === 'free' ? `/${limits.free.entries}` : '/∞'}
                </span>
              </div>
              <p className="text-2xl font-bold">{usage.entriesPublished}</p>
              {plan === 'free' && (
                <div className="mt-2 h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue transition-all duration-500"
                    style={{
                      width: `${Math.min((usage.entriesPublished / limits.free.entries) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* AI Rewrites */}
            <div className="p-4 rounded-lg border border-line bg-surface-highlight">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted">AI Rewrites</span>
                <span className="text-xs text-muted">
                  {plan === 'free' ? `/${limits.free.aiRewrites}` : '/∞'}
                </span>
              </div>
              <p className="text-2xl font-bold">{usage.aiRewrites}</p>
              {plan === 'free' && (
                <div className="mt-2 h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple transition-all duration-500"
                    style={{
                      width: `${Math.min((usage.aiRewrites / limits.free.aiRewrites) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Repos */}
            <div className="p-4 rounded-lg border border-line bg-surface-highlight">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted">Repos</span>
                <span className="text-xs text-muted">
                  {plan === 'free' ? `/${limits.free.repos}` : '/∞'}
                </span>
              </div>
              <p className="text-2xl font-bold">1</p>
              {plan === 'free' && (
                <div className="mt-2 h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green transition-all duration-500"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </div>
          </div>

          {plan === 'free' && (
            <div className="mt-6 flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                <p className="text-sm text-accent font-medium">
                  Approaching limits? Upgrade to Pro for unlimited usage
                </p>
              </div>
              <Button onClick={handleUpgrade} size="sm" className="bg-accent hover:bg-accent/90">
                Upgrade Now
              </Button>
            </div>
          )}
        </Card>

        {/* Payment Method */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green/10">
                <CreditCard className="h-6 w-6 text-green" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Payment Method</h2>
                <p className="text-sm text-muted">
                  Manage your payment details securely via DodoPayment
                </p>
              </div>
            </div>
          </div>

          {plan === 'pro' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-line bg-surface">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">DodoPayment</p>
                    <p className="text-sm text-muted">Secure payment processing</p>
                  </div>
                  <Button onClick={handleManageSubscription} variant="outline">
                    Manage Payment Method
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted">
                Your payment information is securely stored and processed by DodoPayment. We never
                store your credit card details on our servers.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-surface-highlight">
              <p className="text-muted mb-3">No payment method required for Free plan</p>
              <Button onClick={handleUpgrade} className="bg-accent hover:bg-accent/90">
                Upgrade to Pro
              </Button>
            </div>
          )}
        </Card>

        {/* Invoices */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple/10">
                <Download className="h-6 w-6 text-purple" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Invoices</h2>
                <p className="text-sm text-muted">Download your payment invoices</p>
              </div>
            </div>
            {plan === 'pro' && (
              <Button onClick={handleManageSubscription} variant="outline" size="sm">
                View All Invoices
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {plan === 'pro' ? (
            invoices.length > 0 ? (
              <div className="space-y-2">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-line bg-surface"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-highlight">
                        <Calendar className="h-5 w-5 text-muted" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {new Date(invoice.date).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-muted">
                          {invoice.currency === 'INR' ? '₹' : '$'}
                          {invoice.amount / 100}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={invoice.status === 'paid' ? 'success' : 'secondary'}>
                        {invoice.status}
                      </Badge>
                      {invoice.url && (
                        <a href={invoice.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted">
                <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No invoices yet</p>
                <p className="text-sm mt-1">Your first invoice will appear after payment</p>
              </div>
            )
          ) : (
            <div className="text-center py-8 text-muted">
              <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Free plan</p>
              <p className="text-sm mt-1">Upgrade to Pro to see invoices</p>
            </div>
          )}
        </Card>

        {/* Need Help */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
          <div className="space-y-3 text-sm text-muted">
            <p>
              For billing inquiries, subscription management, or refund requests, please contact our
              support team:
            </p>
            <div className="flex gap-4">
              <a href="mailto:billing@gitlog.app" className="text-accent hover:underline">
                billing@gitlog.app
              </a>
              <span>•</span>
              <a href="mailto:support@gitlog.app" className="text-accent hover:underline">
                support@gitlog.app
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
