import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { GitMerge, Settings, ExternalLink, AlertCircle } from 'lucide-react';

export default function GitHubSetupPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge>Setup Guide</Badge>
          <h1 className="text-4xl font-bold">GitHub Integration Setup</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Configure your GitHub repository for automatic changelog generation.
          </p>
        </div>

        {/* Webhook Setup */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Settings className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-2xl font-semibold">Setting Up Webhooks</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold">Step 1: Go to Repository Settings</h3>
              <p className="text-muted">
                Navigate to your GitHub repository → Settings → Webhooks → Add webhook
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Step 2: Configure Payload URL</h3>
              <div className="p-4 rounded-lg bg-surface-highlight font-mono text-sm break-all">
                https://gitlog.app/api/github/sync
              </div>
              <p className="text-muted text-sm">
                This is where GitHub will send webhook events when PRs are merged.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Step 3: Set Content Type</h3>
              <div className="p-4 rounded-lg bg-surface-highlight">
                <p className="font-mono text-sm">Content type: application/json</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Step 4: Add Secret</h3>
              <p className="text-muted">
                Use the webhook secret from your GitLog dashboard settings. This ensures only
                legitimate webhooks from GitHub are processed.
              </p>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-500">
                  Keep your webhook secret secure. Never share it publicly or commit it to version
                  control.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Step 5: Select Events</h3>
              <div className="p-4 rounded-lg bg-surface-highlight">
                <p className="font-mono text-sm">☑️ Pull requests</p>
              </div>
              <p className="text-muted text-sm">
                This ensures GitLog is notified when PRs are merged.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Step 6: Save and Test</h3>
              <p className="text-muted">
                Click "Add webhook" to save. GitHub will send a test ping to verify the webhook is
                working. You should see a green checkmark if successful.
              </p>
            </div>
          </div>
        </Card>

        {/* Label Best Practices */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">PR Label Best Practices</h2>

          <p className="text-muted mb-6">
            GitLog uses GitHub labels to automatically categorize your changelog entries. Here are
            the recommended labels to use:
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-line bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-accent/10 text-accent">feat</Badge>
                <span className="font-semibold">Feature PRs</span>
              </div>
              <p className="text-sm text-muted">
                Use for new features. Will be categorized as <strong>"New"</strong> in changelog.
                Examples: <code className="bg-surface-highlight px-1 rounded">feat</code>,{' '}
                <code className="bg-surface-highlight px-1 rounded">feature</code>,{' '}
                <code className="bg-surface-highlight px-1 rounded">enhancement</code>
              </p>
            </div>

            <div className="p-4 rounded-lg border border-line bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-success/10 text-success">fix</Badge>
                <span className="font-semibold">Bug Fix PRs</span>
              </div>
              <p className="text-sm text-muted">
                Use for bug fixes. Will be categorized as <strong>"Fixed"</strong> in changelog.
                Examples: <code className="bg-surface-highlight px-1 rounded">fix</code>,{' '}
                <code className="bg-surface-highlight px-1 rounded">bug</code>,{' '}
                <code className="bg-surface-highlight px-1 rounded">bugfix</code>,{' '}
                <code className="bg-surface-highlight px-1 rounded">hotfix</code>
              </p>
            </div>

            <div className="p-4 rounded-lg border border-line bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue/10 text-blue">chore</Badge>
                <span className="font-semibold">Maintenance PRs</span>
              </div>
              <p className="text-sm text-muted">
                Use for refactors, improvements, maintenance. Will be categorized as{' '}
                <strong>"Improved"</strong> in changelog. Examples:{' '}
                <code className="bg-surface-highlight px-1 rounded">chore</code>,{' '}
                <code className="bg-surface-highlight px-1 rounded">refactor</code>,{' '}
                <code className="bg-surface-highlight px-1 rounded">perf</code>,{' '}
                <code className="bg-surface-highlight px-1 rounded">style</code>
              </p>
            </div>
          </div>
        </Card>

        {/* Troubleshooting */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Troubleshooting</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Webhook not firing?</h3>
              <ul className="text-sm text-muted space-y-2 list-disc list-inside">
                <li>Check that the Payload URL is correct (must be HTTPS)</li>
                <li>Verify the secret matches in both GitHub and GitLog</li>
                <li>
                  Check GitHub's webhook delivery logs for errors (Settings → Webhooks → Recent
                  Deliveries)
                </li>
                <li>Make sure your firewall isn't blocking GitHub's webhook requests</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">PRs not syncing?</h3>
              <ul className="text-sm text-muted space-y-2 list-disc list-inside">
                <li>Make sure the PR was actually merged (not just closed)</li>
                <li>Click "Sync Now" in your dashboard to manually sync recent PRs</li>
                <li>Check that your repository is still connected in settings</li>
                <li>Verify the webhook is active (green checkmark in GitHub)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Wrong category assigned?</h3>
              <ul className="text-sm text-muted space-y-2 list-disc list-inside">
                <li>Check that you're using the correct labels (feat, fix, chore, etc.)</li>
                <li>You can manually change the category in the draft editor</li>
                <li>If no matching label is found, entries are categorized as "Other"</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                Still need help?
              </h3>
              <p className="text-sm text-muted">
                Contact us at{' '}
                <a href="mailto:hello@gitlog.app" className="text-accent hover:underline">
                  hello@gitlog.app
                </a>{' '}
                or open an issue on{' '}
                <a
                  href="https://github.com/gitlogapp/gitlog"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
