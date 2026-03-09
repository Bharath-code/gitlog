import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ExternalLink, Lock, Globe } from 'lucide-react';

export default function APIDocsPage() {
  const endpoints = [
    {
      category: 'GitHub',
      endpoints: [
        {
          method: 'GET',
          path: '/api/github/repos',
          auth: 'User',
          description: 'Get list of user\'s GitHub repositories',
          response: '{ repos: Array<{id, name, private, html_url}> }',
        },
        {
          method: 'POST',
          path: '/api/github/sync',
          auth: 'Webhook',
          description: 'Receive GitHub webhook events for merged PRs',
          response: '{ success: boolean }',
        },
        {
          method: 'POST',
          path: '/api/github/sync/manual',
          auth: 'User',
          description: 'Manually sync recent merged PRs',
          response: '{ synced: number }',
        },
      ],
    },
    {
      category: 'Entries',
      endpoints: [
        {
          method: 'GET',
          path: '/api/drafts',
          auth: 'User',
          description: 'Get all draft entries',
          response: '{ drafts: Array<Entry> }',
        },
        {
          method: 'GET',
          path: '/api/entries/published',
          auth: 'User',
          description: 'Get all published entries',
          response: '{ entries: Array<Entry> }',
        },
        {
          method: 'POST',
          path: '/api/entries/publish',
          auth: 'User',
          description: 'Publish a draft entry',
          response: '{ success: boolean }',
        },
        {
          method: 'POST',
          path: '/api/entries/unpublish',
          auth: 'User',
          description: 'Unpublish an entry (revert to draft)',
          response: '{ success: boolean }',
        },
      ],
    },
    {
      category: 'AI',
      endpoints: [
        {
          method: 'POST',
          path: '/api/ai/rewrite',
          auth: 'User',
          description: 'Generate AI rewrite of a draft entry',
          body: '{ entryId: string, tone?: "casual" | "professional" | "technical" | "exciting" }',
          response: '{ aiRewrite: string }',
        },
      ],
    },
    {
      category: 'User',
      endpoints: [
        {
          method: 'GET',
          path: '/api/user/plan',
          auth: 'User',
          description: 'Get user\'s current plan (free/pro)',
          response: '{ plan: "free" | "pro" }',
        },
        {
          method: 'GET',
          path: '/api/user/repos',
          auth: 'User',
          description: 'Get user\'s connected repositories',
          response: '{ repos: Array<Repo> }',
        },
      ],
    },
    {
      category: 'Payment',
      endpoints: [
        {
          method: 'POST',
          path: '/api/payment/checkout',
          auth: 'User',
          description: 'Create DodoPayment checkout session',
          body: '{ plan: "pro" }',
          response: '{ url: string }',
        },
        {
          method: 'POST',
          path: '/api/payment/webhook',
          auth: 'Webhook',
          description: 'Receive DodoPayment webhook events',
          response: '{ received: boolean }',
        },
      ],
    },
  ];

  const methodColors: Record<string, string> = {
    GET: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    POST: 'bg-success/10 text-success border-success/20',
    PUT: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    DELETE: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Badge>Developers</Badge>
          <h1 className="text-4xl font-bold">API Documentation</h1>
          <p className="text-lg text-muted">
            Integrate GitLog with your existing tools and workflows.
          </p>
        </div>

        {/* Overview */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <div className="space-y-4 text-muted">
            <p>
              The GitLog API allows you to programmatically manage your changelog entries,
              sync repositories, and integrate with your existing workflows.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-surface-highlight">
                <div className="text-2xl font-bold text-foreground">12</div>
                <div className="text-sm">API Endpoints</div>
              </div>
              <div className="p-4 rounded-lg bg-surface-highlight">
                <div className="text-2xl font-bold text-foreground">REST</div>
                <div className="text-sm">Architecture</div>
              </div>
              <div className="p-4 rounded-lg bg-surface-highlight">
                <div className="text-2xl font-bold text-foreground">JSON</div>
                <div className="text-sm">Response Format</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Authentication */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <div className="space-y-4 text-muted">
            <p>
              Most API endpoints require authentication. User-authenticated endpoints 
              require an active Clerk session. Webhook endpoints are authenticated via 
              signature verification.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-highlight">
                <Lock className="h-5 w-5 text-accent" />
                <div>
                  <div className="font-semibold text-foreground">User Auth</div>
                  <div className="text-sm">Clerk session required</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-highlight">
                <Globe className="h-5 w-5 text-muted" />
                <div>
                  <div className="font-semibold text-foreground">Webhook</div>
                  <div className="text-sm">Signature verification</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Endpoints */}
        {endpoints.map((category, idx) => (
          <Card key={idx} className="p-6">
            <h2 className="text-2xl font-semibold mb-6">{category.category} API</h2>
            <div className="space-y-4">
              {category.endpoints.map((endpoint, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-line bg-surface space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={methodColors[endpoint.method]}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono text-accent">{endpoint.path}</code>
                    <Badge variant={endpoint.auth === 'User' ? 'default' : 'secondary'}>
                      {endpoint.auth === 'User' ? (
                        <Lock className="h-3 w-3 mr-1" />
                      ) : (
                        <Globe className="h-3 w-3 mr-1" />
                      )}
                      {endpoint.auth}
                    </Badge>
                  </div>
                  
                  <p className="text-muted">{endpoint.description}</p>
                  
                  {endpoint.body && (
                    <div>
                      <div className="text-sm font-semibold mb-1">Request Body:</div>
                      <pre className="text-xs font-mono p-3 rounded-lg bg-surface-dark overflow-x-auto">
                        {endpoint.body}
                      </pre>
                    </div>
                  )}
                  
                  <div>
                    <div className="text-sm font-semibold mb-1">Response:</div>
                    <pre className="text-xs font-mono p-3 rounded-lg bg-surface-dark overflow-x-auto">
                      {endpoint.response}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* Rate Limits */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
          <div className="space-y-4 text-muted">
            <p>
              API requests are rate limited to ensure fair usage:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>100 requests per minute per user</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>AI rewrite: 50 per month (free plan), unlimited (Pro)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Entries: 50 per month (free plan), unlimited (Pro)</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Support */}
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-muted mb-6">
            Have questions about the API? We're here to help.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="mailto:hello@gitlog.app"
              className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90"
            >
              Email Us
            </a>
            <a
              href="https://github.com/gitlogapp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-line px-6 py-3 text-sm font-semibold hover:bg-surface-highlight"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              GitHub
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
