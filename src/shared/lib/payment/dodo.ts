/**
 * DodoPayment API Helper
 *
 * Since @dodopayment/node is not published on npm,
 * we'll use their REST API directly.
 *
 * Docs: https://docs.dodopayment.com
 */

const DODO_API_BASE = 'https://api.dodopayment.com';
const DODO_API_KEY = process.env.DODOPAYMENT_API_KEY;

interface CreateCheckoutSessionParams {
  customerId: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

interface CreateCheckoutSessionResponse {
  id: string;
  url: string;
  status: string;
}

export async function createCheckoutSession({
  customerId,
  planId,
  successUrl,
  cancelUrl,
  metadata,
}: CreateCheckoutSessionParams): Promise<CreateCheckoutSessionResponse> {
  const response = await fetch(`${DODO_API_BASE}/v1/checkouts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${DODO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer_id: customerId,
      plan_id: planId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  return response.json();
}

export async function createCustomer(params: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}) {
  const response = await fetch(`${DODO_API_BASE}/v1/customers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${DODO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create customer');
  }

  return response.json();
}

export async function getCustomer(customerId: string) {
  const response = await fetch(`${DODO_API_BASE}/v1/customers/${customerId}`, {
    headers: {
      Authorization: `Bearer ${DODO_API_KEY}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
  // DodoPayment webhook signature verification
  // This is a simplified version - implement based on their docs
  const expectedSignature = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(payload + DODO_API_KEY)
  );

  const hexSignature = Array.from(new Uint8Array(expectedSignature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return signature === `sha256=${hexSignature}`;
}

export interface WebhookEvent {
  type: string;
  data: {
    id: string;
    customer_id: string;
    subscription_id?: string;
    plan_id?: string;
    status?: string;
    metadata?: Record<string, string>;
  };
}

export const WebhookEventType = {
  PAYMENT_SUCCESS: 'payment.success',
  PAYMENT_FAILED: 'payment.failed',
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_RENEWED: 'subscription.renewed',
  SUBSCRIPTION_CANCELLED: 'subscription.cancelled',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
} as const;
