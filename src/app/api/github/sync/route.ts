import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/shared/lib/github/webhook';
import { handleMergedPR } from '@/features/drafts/lib/sync';

interface PullRequestPayload {
  action: string;
  number: number;
  pull_request: {
    id: number;
    title: string;
    body: string | null;
    merged: boolean;
    merged_at: string | null;
    html_url: string;
    user: {
      login: string;
    } | null;
    labels: Array<{
      name: string;
    } | string>;
    base: {
      repo: {
        full_name: string;
        owner: {
          login: string;
        };
      };
    };
    head: {
      sha: string;
    };
  };
  repository: {
    full_name: string;
    owner: {
      login: string;
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('x-hub-signature-256') || '';
    const event = req.headers.get('x-github-event');

    // Verify webhook signature
    if (process.env.GITHUB_WEBHOOK_SECRET) {
      const isValid = await verifyWebhookSignature(payload, signature);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Only handle pull_request events
    if (event !== 'pull_request') {
      console.log('Skipping non-PR event:', event);
      return NextResponse.json({ skipped: 'Not a PR event' });
    }

    const data: PullRequestPayload = JSON.parse(payload);

    // Only handle closed (merged) PRs
    if (data.action !== 'closed' || !data.pull_request.merged) {
      console.log('Skipping non-merged PR:', data.pull_request.html_url);
      return NextResponse.json({ skipped: 'Not a merged PR' });
    }

    // Process the merged PR
    await handleMergedPR(data);

    console.log('Successfully processed PR:', data.pull_request.html_url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for GitHub webhook validation
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
