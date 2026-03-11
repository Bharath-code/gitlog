import { SignUp } from '@clerk/nextjs';
import { GitMerge, Github } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent-glow/20">
            <GitMerge className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-muted">Start auto-generating changelogs in seconds</p>
        </div>

        {/* GitHub OAuth Callout */}
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 flex-shrink-0">
              <Github className="h-5 w-5 text-accent" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm">Sign up with GitHub</h3>
              <p className="text-xs text-muted mt-1">
                GitHub sign-up is required to access your repositories and auto-generate changelogs
                from PRs.
              </p>
            </div>
          </div>
        </div>

        <SignUp
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
              socialButtonsBlockButtonArrow: 'text-foreground',
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/onboarding"
          signInFallbackRedirectUrl="/onboarding"
        />
      </div>
    </div>
  );
}
