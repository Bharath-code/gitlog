import { SignIn } from '@clerk/nextjs';
import { GitMerge } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent-glow/20">
            <GitMerge className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to GitLog</h1>
          <p className="mt-2 text-muted">Auto-generate changelogs from your GitHub PRs</p>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-surface border border-line shadow-xl',
              headerTitle: 'text-foreground',
              headerSubtitle: 'text-muted',
              socialButtonsBlockButton:
                'bg-surface-highlight hover:bg-surface-elevated border-line',
              socialButtonsBlockButtonText: 'text-foreground',
              dividerLine: 'bg-line',
              dividerText: 'text-muted',
              formFieldLabel: 'text-foreground',
              formFieldInput: 'bg-surface-highlight border-line text-foreground',
              formButtonPrimary: 'bg-accent hover:bg-accent/90',
              footerActionLink: 'text-accent hover:text-accent/90',
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/onboarding"
          signUpFallbackRedirectUrl="/onboarding"
        />

        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <div className="text-sm font-semibold text-foreground">10s</div>
            <div className="text-xs text-muted">Setup time</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-foreground">Free</div>
            <div className="text-xs text-muted">No credit card</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-foreground">OSS</div>
            <div className="text-xs text-muted">Free for open source</div>
          </div>
        </div>
      </div>
    </div>
  );
}
