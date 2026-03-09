import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { verifyWebhookSignature, WebhookEvent, WebhookEventType } from '@/shared/lib/payment/dodo';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('dodo-signature') || '';

    // Verify webhook signature
    if (process.env.DODOPAYMENT_WEBHOOK_SECRET) {
      const isValid = await verifyWebhookSignature(
        payload,
        signature
      );
      
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    const event: WebhookEvent = JSON.parse(payload);

    // Handle different event types
    switch (event.type) {
      case WebhookEventType.PAYMENT_SUCCESS:
      case WebhookEventType.SUBSCRIPTION_CREATED:
        await handleSubscriptionSuccess(event);
        break;

      case WebhookEventType.SUBSCRIPTION_RENEWED:
        await handleSubscriptionRenewal(event);
        break;

      case WebhookEventType.SUBSCRIPTION_CANCELLED:
      case WebhookEventType.SUBSCRIPTION_UPDATED:
        await handleSubscriptionCancelled(event);
        break;

      case WebhookEventType.PAYMENT_FAILED:
        await handlePaymentFailed(event);
        break;

      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionSuccess(event: WebhookEvent) {
  const userId = event.data.metadata?.userId;
  
  if (!userId) {
    console.error('No userId in webhook metadata');
    return;
  }

  // Upgrade user to Pro
  await kv.set(`user:${userId}:plan`, 'pro');
  await kv.set(`user:${userId}:dodo_subscription_id`, event.data.subscription_id);
  
  console.log(`Upgraded user ${userId} to Pro plan`);
}

async function handleSubscriptionRenewal(event: WebhookEvent) {
  const userId = event.data.metadata?.userId;
  
  if (!userId) {
    console.error('No userId in webhook metadata');
    return;
  }

  // Ensure user stays on Pro plan
  await kv.set(`user:${userId}:plan`, 'pro');
  
  console.log(`Renewed Pro subscription for user ${userId}`);
}

async function handleSubscriptionCancelled(event: WebhookEvent) {
  const userId = event.data.metadata?.userId;
  
  if (!userId) {
    console.error('No userId in webhook metadata');
    return;
  }

  // Downgrade user to Free at end of billing period
  // For now, we'll downgrade immediately
  await kv.set(`user:${userId}:plan`, 'free');
  await kv.del(`user:${userId}:dodo_subscription_id`);
  
  console.log(`Downgraded user ${userId} to Free plan`);
}

async function handlePaymentFailed(event: WebhookEvent) {
  const userId = event.data.metadata?.userId;
  
  if (!userId) {
    console.error('No userId in webhook metadata');
    return;
  }

  // Log failed payment for follow-up
  await kv.lpush(`payments:failed`, {
    userId,
    timestamp: new Date().toISOString(),
    eventId: event.data.id,
  });
  
  console.log(`Payment failed for user ${userId}`);
}

// Handle OPTIONS for webhook validation
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
