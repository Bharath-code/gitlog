import { SubscribeForm } from '@/shared/components/email/subscribe-form';
import { Card } from '@/shared/components/ui/card';
import { Mail, Check } from 'lucide-react';

export default function SubscribePage({
  params,
}: {
  params: Promise<{
    user: string;
    repo: string;
  }>;
}) {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Mail className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold">Subscribe to Updates</h1>
          <p className="text-muted">
            Get notified when new features are released
          </p>
        </div>

        {/* Subscribe Form */}
        <Card className="p-6">
          <SubscribeForm repoId={`${params.then(p => p.user)}/${params.then(p => p.repo)}`} />
        </Card>

        {/* Benefits */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">What you'll receive:</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted">
                Email notifications for new releases
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted">
                Monthly digest of all updates
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted">
                Early access to major features
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted">
                No spam, unsubscribe anytime
              </span>
            </li>
          </ul>
        </Card>

        {/* Privacy Note */}
        <p className="text-center text-xs text-muted">
          We respect your privacy. Your email will only be used for project updates.
        </p>
      </div>
    </div>
  );
}
