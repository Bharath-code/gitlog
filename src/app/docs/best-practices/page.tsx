import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Check, X, Sparkles, FileText, Users } from 'lucide-react';

export default function BestPracticesPage() {
  const tips = [
    {
      icon: FileText,
      title: 'Write for your users',
      description: 'Focus on what changed for the user, not the technical implementation details.',
      do: 'Added dark mode toggle in settings',
      dont: 'Implemented dark: classes with localStorage persistence',
    },
    {
      icon: Sparkles,
      title: 'Keep it concise',
      description: "2-3 sentences maximum. Users scan changelogs, they don't read them.",
      do: 'Users can now switch between light and dark themes with one click.',
      dont: "We've added a comprehensive theming system that allows users to toggle...",
    },
    {
      icon: Check,
      title: 'Use active voice',
      description: 'Active voice is clearer and more engaging than passive voice.',
      do: 'Added weekly digest controls',
      dont: 'Weekly digest controls were added',
    },
    {
      icon: Users,
      title: 'Highlight user benefits',
      description: 'Explain why the change matters to users, not just what changed.',
      do: 'Preferences save automatically and persist across sessions.',
      dont: 'Settings are now stored in the database.',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge>Guide</Badge>
          <h1 className="text-4xl font-bold">Changelog Best Practices</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Tips for writing changelogs that users actually read and appreciate.
          </p>
        </div>

        {/* Writing Tips */}
        <div className="space-y-6">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 flex-shrink-0">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold">{tip.title}</h3>
                    <p className="text-muted">{tip.description}</p>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="h-4 w-4 text-success" />
                          <span className="text-sm font-semibold text-success">Do</span>
                        </div>
                        <p className="text-sm">{tip.do}</p>
                      </div>

                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <X className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-semibold text-red-500">Don't</span>
                        </div>
                        <p className="text-sm">{tip.dont}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Frequency */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">How Often Should You Update?</h2>
          <div className="space-y-4">
            <p className="text-muted">
              The best changelog is a consistent changelog. Here are our recommendations:
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-surface-highlight">
                <h3 className="font-semibold mb-2">Weekly</h3>
                <p className="text-sm text-muted">
                  Ideal for actively developed products. Keeps users informed without overwhelming
                  them.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-surface-highlight">
                <h3 className="font-semibold mb-2">Bi-weekly</h3>
                <p className="text-sm text-muted">
                  Good balance for most products. Batch smaller updates together.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-surface-highlight">
                <h3 className="font-semibold mb-2">Monthly</h3>
                <p className="text-sm text-muted">
                  Minimum frequency. Users may forget what you shipped last month.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Categories */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Use Clear Categories</h2>
          <p className="text-muted mb-6">
            Categories help users quickly scan for changes that matter to them.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-line bg-surface">
              <Badge className="bg-accent/10 text-accent">New</Badge>
              <div>
                <p className="font-semibold">New Features</p>
                <p className="text-sm text-muted">Major new functionality that users will notice</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-line bg-surface">
              <Badge className="bg-success/10 text-success">Fixed</Badge>
              <div>
                <p className="font-semibold">Bug Fixes</p>
                <p className="text-sm text-muted">Issues that were resolved</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-line bg-surface">
              <Badge className="bg-blue/10 text-blue">Improved</Badge>
              <div>
                <p className="font-semibold">Improvements</p>
                <p className="text-sm text-muted">Enhancements to existing features</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-line bg-surface">
              <Badge>Other</Badge>
              <div>
                <p className="font-semibold">Other</p>
                <p className="text-sm text-muted">Changes that don't fit other categories</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Examples */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Good Changelog Examples</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-surface-highlight">
              <h3 className="font-semibold mb-2">🎉 New: Added weekly digest controls</h3>
              <p className="text-sm text-muted">
                Users can now choose to receive email digests daily, weekly, or pause them entirely.
                Settings are saved automatically and apply to all future emails.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-highlight">
              <h3 className="font-semibold mb-2">🐛 Fixed: Email digest not sending</h3>
              <p className="text-sm text-muted">
                Fixed a bug where users with daily digest preferences weren't receiving emails. All
                pending digests have been sent.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-highlight">
              <h3 className="font-semibold mb-2">⚡ Improved: Faster dashboard loading</h3>
              <p className="text-sm text-muted">
                Dashboard now loads 50% faster thanks to optimized database queries and caching.
              </p>
            </div>
          </div>
        </Card>

        {/* Final Tips */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Final Tips</h2>
          <ul className="space-y-3 text-muted">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <span>Include links to relevant documentation or GitHub issues when appropriate</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <span>Credit contributors by mentioning their GitHub username</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <span>Use emojis sparingly to add personality (but don't overdo it)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <span>Group related changes together under a single entry</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <span>Be honest about breaking changes and provide migration steps</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <span>Update consistently - even small updates matter</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
