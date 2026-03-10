import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Check, GitMerge, Sparkles, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

export default function GettingStartedPage() {
  const steps = [
    {
      number: '01',
      title: 'Sign up with GitHub',
      description: 'Connect your GitHub account in seconds. No credit card required.',
      icon: GitMerge,
    },
    {
      number: '02',
      title: 'Connect your repository',
      description: 'Select the repository you want to auto-generate changelogs for.',
      icon: Check,
    },
    {
      number: '03',
      title: 'Merge a PR',
      description: 'When you merge a PR, GitLog automatically creates a draft changelog entry.',
      icon: Sparkles,
    },
    {
      number: '04',
      title: 'Review and publish',
      description: 'Review the AI-generated draft, edit if needed, and publish with one click.',
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge>Quick Start</Badge>
          <h1 className="text-4xl font-bold">Getting Started with GitLog</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Start auto-generating changelogs from your GitHub PRs in less than 5 minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 flex-shrink-0">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-muted">Step {step.number}</span>
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted">{step.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted mb-6">
            Create your free account and start auto-generating changelogs today.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/sign-in">
              <Button className="bg-accent hover:bg-accent/90">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">
                Go to Dashboard
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Next Steps */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/docs/github-setup">
            <Card className="p-6 hover:border-accent/50 transition-colors cursor-pointer">
              <h3 className="font-semibold mb-2">GitHub Setup Guide →</h3>
              <p className="text-sm text-muted">
                Learn how to configure webhooks and optimize your GitHub integration
              </p>
            </Card>
          </Link>
          <Link href="/docs/best-practices">
            <Card className="p-6 hover:border-accent/50 transition-colors cursor-pointer">
              <h3 className="font-semibold mb-2">Best Practices →</h3>
              <p className="text-sm text-muted">
                Tips for writing changelogs that users actually read
              </p>
            </Card>
          </Link>
          <Link href="/docs/billing">
            <Card className="p-6 hover:border-accent/50 transition-colors cursor-pointer">
              <h3 className="font-semibold mb-2">Billing & Plans →</h3>
              <p className="text-sm text-muted">
                Understand our pricing, payment methods, and FAQs
              </p>
            </Card>
          </Link>
          <Link href="/docs/api">
            <Card className="p-6 hover:border-accent/50 transition-colors cursor-pointer">
              <h3 className="font-semibold mb-2">API Reference →</h3>
              <p className="text-sm text-muted">
                Integrate GitLog with your existing tools and workflows
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
