/**
 * Human-friendly error messages
 * Replace robotic error messages with helpful, friendly ones
 */

export interface ErrorMessage {
  title: string;
  message: string;
  suggestion?: string;
}

export function getFriendlyError(error: any): ErrorMessage {
  const message = error?.message || '';
  const code = error?.code || '';

  // Network errors
  if (message.includes('fetch') || message.includes('network')) {
    return {
      title: 'Connection Issue',
      message: "We couldn't reach our servers. Please check your internet connection.",
      suggestion: 'If this persists, email us at hello@gitlog.app',
    };
  }

  // Authentication errors
  if (message.includes('unauthorized') || message.includes('authenticated')) {
    return {
      title: 'Session Expired',
      message: 'Please sign in again to continue.',
      suggestion: 'This happens for security after 24 hours',
    };
  }

  // GitHub API errors
  if (message.includes('GitHub') || code.includes('GITHUB')) {
    return {
      title: 'GitHub Connection Issue',
      message: "We couldn't connect to GitHub. Your token might have expired.",
      suggestion: 'Try reconnecting your GitHub account in settings',
    };
  }

  // AI rewrite errors
  if (message.includes('rewrite') || message.includes('AI')) {
    return {
      title: 'AI is Having Trouble',
      message: 'This usually happens when PR descriptions are very short.',
      suggestion: 'Try again, or write it manually',
    };
  }

  // Publish errors
  if (message.includes('publish')) {
    return {
      title: "Couldn't Publish",
      message: 'Something went wrong while publishing.',
      suggestion: 'Try again in a few seconds',
    };
  }

  // Rate limit errors
  if (message.includes('rate limit') || message.includes('429')) {
    return {
      title: 'Too Many Requests',
      message: "You've made a lot of requests. Please wait a moment.",
      suggestion: 'Try again in 30 seconds',
    };
  }

  // Not found errors
  if (message.includes('not found') || code.includes('404')) {
    return {
      title: 'Not Found',
      message: "We couldn't find what you're looking for.",
      suggestion: 'It might have been moved or deleted',
    };
  }

  // Permission errors
  if (message.includes('permission') || message.includes('forbidden') || code.includes('403')) {
    return {
      title: 'Access Denied',
      message: "You don't have permission to do this.",
      suggestion: 'Check with your team admin',
    };
  }

  // Server errors
  if (message.includes('500') || message.includes('server')) {
    return {
      title: 'Our Bad',
      message: 'Something went wrong on our end.',
      suggestion: "We're on it! Try again in a minute",
    };
  }

  // Default error
  return {
    title: 'Oops! Something Went Wrong',
    message: error?.message || "We're not sure what happened.",
    suggestion: 'Try again, or contact support if this persists',
  };
}

/**
 * Get friendly message for specific actions
 */
export function getActionErrorMessage(action: string, error?: any): ErrorMessage {
  const baseError = getFriendlyError(error);

  switch (action) {
    case 'connect-github':
      return {
        title: "Couldn't Connect to GitHub",
        message: 'This usually means your GitHub token expired.',
        suggestion: 'Try reconnecting in settings',
      };

    case 'create-widget':
      return {
        title: "Couldn't Create Widget",
        message: 'Something went wrong while creating your widget.',
        suggestion: 'Try again in a moment',
      };

    case 'send-email':
      return {
        title: "Couldn't Send Email",
        message: "We couldn't send the email right now.",
        suggestion: 'Try again or contact support',
      };

    case 'sync-repo':
      return {
        title: "Couldn't Sync Repository",
        message: "We couldn't fetch your latest PRs.",
        suggestion: 'Make sure your GitHub connection is active',
      };

    default:
      return baseError;
  }
}
