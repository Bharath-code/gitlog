import { AlertCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

interface ErrorConfig {
  code: string;
  title: string;
  message: string;
  cause?: string;
  solution: string[];
  docsLink?: string;
  retryable?: boolean;
}

const errorConfigs: Record<string, ErrorConfig> = {
  // GitHub Errors
  GITHUB_WEBHOOK_FAILED: {
    code: 'GITHUB_WEBHOOK_FAILED',
    title: 'GitHub Webhook Failed',
    message: 'Unable to receive events from GitHub',
    cause: 'Your webhook URL might be unreachable or the secret is incorrect',
    solution: [
      'Verify your webhook URL is publicly accessible',
      'Check that the webhook secret matches in both GitHub and GitLog',
      'Review GitHub webhook delivery logs for errors',
      'Ensure your server is not blocking GitHub IPs',
    ],
    docsLink: '/docs/github-setup#troubleshooting',
    retryable: true,
  },

  GITHUB_SYNC_TIMEOUT: {
    code: 'GITHUB_SYNC_TIMEOUT',
    title: 'Repository Sync Timed Out',
    message: 'Syncing your repository took too long',
    cause: 'Large repository with many PRs or network issues',
    solution: [
      'Try syncing again - the issue may be temporary',
      'For large repositories, use manual sync in batches',
      'Check your internet connection',
      'Contact support if the issue persists',
    ],
    docsLink: '/docs/troubleshooting#sync-timeout',
    retryable: true,
  },

  GITHUB_REPO_NOT_FOUND: {
    code: 'GITHUB_REPO_NOT_FOUND',
    title: 'Repository Not Found',
    message: "We couldn't access the specified repository",
    cause: 'The repository may have been deleted or permissions changed',
    solution: [
      'Verify the repository still exists on GitHub',
      'Check that you still have access to the repository',
      'Re-connect your GitHub account in settings',
      'Ensure the repository is not archived',
    ],
    docsLink: '/docs/github-setup',
    retryable: false,
  },

  // AI Errors
  AI_RATE_LIMIT: {
    code: 'AI_RATE_LIMIT',
    title: 'AI Rewrite Limit Reached',
    message: "You've used all your AI rewrites for this month",
    cause: `Free plan includes 50 AI rewrites per month`,
    solution: [
      'Upgrade to Pro for unlimited AI rewrites',
      'Write the changelog entry manually for now',
      'Your limit will reset at the start of next billing cycle',
      'Consider using AI rewrites only for important entries',
    ],
    docsLink: '/docs/billing',
    retryable: false,
  },

  AI_SERVICE_UNAVAILABLE: {
    code: 'AI_SERVICE_UNAVAILABLE',
    title: 'AI Service Temporarily Unavailable',
    message: 'Our AI service is experiencing issues',
    cause: 'The AI provider is temporarily down or overloaded',
    solution: [
      'Wait a few moments and try again',
      'Write the changelog entry manually for now',
      'Check our status page for service updates',
      "We're working to resolve this quickly",
    ],
    docsLink: '/status',
    retryable: true,
  },

  // Payment Errors
  PAYMENT_FAILED: {
    code: 'PAYMENT_FAILED',
    title: 'Payment Failed',
    message: 'Unable to process your payment',
    cause: 'Your card was declined or there was a processing error',
    solution: [
      'Check that your card details are correct',
      'Verify your card has sufficient funds',
      'Try a different payment method',
      'Contact your bank if the issue persists',
    ],
    docsLink: '/docs/billing',
    retryable: true,
  },

  // General Errors
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    title: 'Network Error',
    message: 'Unable to connect to our servers',
    cause: 'Your internet connection may be unstable or our servers are unreachable',
    solution: [
      'Check your internet connection',
      'Try refreshing the page',
      'Disable any VPN or proxy temporarily',
      'Try again in a few moments',
    ],
    docsLink: '/docs/troubleshooting',
    retryable: true,
  },

  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    title: 'Authentication Required',
    message: 'You need to sign in to perform this action',
    cause: 'Your session may have expired',
    solution: [
      'Sign in again to continue',
      'Clear your browser cache and cookies',
      'Make sure cookies are enabled in your browser',
      'Contact support if you continue to have issues',
    ],
    docsLink: '/docs/authentication',
    retryable: false,
  },

  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    title: 'Too Many Requests',
    message: "You've made too many requests. Please slow down.",
    cause: 'Rate limit is 100 requests per minute',
    solution: [
      'Wait a few moments before trying again',
      'Avoid rapid repeated actions',
      'If using the API, implement exponential backoff',
      'Contact support if you need higher limits',
    ],
    docsLink: '/docs/api#rate-limits',
    retryable: true,
  },

  // Fallback
  UNKNOWN_ERROR: {
    code: 'UNKNOWN_ERROR',
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred',
    cause: "We're not sure what caused this",
    solution: [
      'Try refreshing the page',
      'Try again in a few moments',
      'Check our status page for known issues',
      'Contact support if the issue persists',
    ],
    docsLink: '/docs/troubleshooting',
    retryable: true,
  },
};

interface ErrorDisplayProps {
  error: Error & { code?: string };
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({ error, onRetry, className }: ErrorDisplayProps) {
  // Get error config or use fallback
  const config = errorConfigs[error.code || 'UNKNOWN_ERROR'] || errorConfigs.UNKNOWN_ERROR;

  // Determine icon and color based on error type
  const getIcon = () => {
    if (error.code?.includes('RATE_LIMIT')) {
      return { Icon: AlertTriangle, color: 'text-amber-500' };
    }
    if (error.code?.includes('UNAUTHORIZED')) {
      return { Icon: Info, color: 'text-blue-500' };
    }
    if (error.code?.includes('FAILED') || error.code?.includes('ERROR')) {
      return { Icon: XCircle, color: 'text-red-500' };
    }
    return { Icon: AlertCircle, color: 'text-red-500' };
  };

  const { Icon, color } = getIcon();

  return (
    <Card className={cn('p-6 border-red-500/20 bg-red-500/5', className)}>
      <div className="flex items-start gap-4">
        <Icon className={cn('h-6 w-6 flex-shrink-0', color)} />

        <div className="flex-1 space-y-3">
          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">{config.title}</h3>
            <p className="text-sm text-muted mt-1">{config.message}</p>
          </div>

          {/* Cause */}
          {config.cause && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm font-medium text-amber-500 mb-1">Why this happened:</p>
              <p className="text-sm text-muted">{config.cause}</p>
            </div>
          )}

          {/* Solution */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">How to fix:</p>
            <ol className="space-y-1">
              {config.solution.map((step, index) => (
                <li key={index} className="text-sm text-muted flex items-start gap-2">
                  <span className="text-accent font-mono">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {config.retryable && onRetry && (
              <Button onClick={onRetry} size="sm" className="bg-accent hover:bg-accent/90">
                Try Again
              </Button>
            )}

            {config.docsLink && (
              <a
                href={config.docsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline inline-flex items-center gap-1"
              >
                View Documentation →
              </a>
            )}
          </div>

          {/* Error Code (for support) */}
          <div className="pt-3 border-t border-line">
            <p className="text-xs text-muted font-mono">
              Error Code: {config.code}
              {error.message !== config.message && ` — ${error.message}`}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Helper function to get user-friendly error from any error
export function getUserFriendlyError(error: any): Error & { code?: string } {
  // If it's already a formatted error, return it
  if (error.code && errorConfigs[error.code]) {
    return error;
  }

  // Map common error messages to our error codes
  const message = error?.message?.toLowerCase() || '';

  if (message.includes('network') || message.includes('fetch')) {
    return { ...error, code: 'NETWORK_ERROR', message: error.message };
  }

  if (message.includes('unauthorized') || message.includes('authentication')) {
    return { ...error, code: 'UNAUTHORIZED', message: error.message };
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return { ...error, code: 'RATE_LIMIT_EXCEEDED', message: error.message };
  }

  if (message.includes('webhook')) {
    return { ...error, code: 'GITHUB_WEBHOOK_FAILED', message: error.message };
  }

  if (message.includes('timeout')) {
    return { ...error, code: 'GITHUB_SYNC_TIMEOUT', message: error.message };
  }

  if (message.includes('ai') || message.includes('gemini')) {
    if (message.includes('limit') || message.includes('quota')) {
      return { ...error, code: 'AI_RATE_LIMIT', message: error.message };
    }
    return { ...error, code: 'AI_SERVICE_UNAVAILABLE', message: error.message };
  }

  if (message.includes('payment') || message.includes('card')) {
    return { ...error, code: 'PAYMENT_FAILED', message: error.message };
  }

  // Fallback to unknown error
  return {
    ...error,
    code: 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred',
  };
}
