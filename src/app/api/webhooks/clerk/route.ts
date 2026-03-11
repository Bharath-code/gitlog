import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { kv } from '@vercel/kv';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET not configured');
    return new Response('Webhook secret not configured', { status: 400 });
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing Svix headers');
    return new Response('Error occurred -- no Svix headers', { status: 400 });
  }

  // Get body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Create Svix payload
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Verify payload
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', { status: 400 });
  }

  const eventType = evt.type;

  // Handle OAuth account linked event (when user connects GitHub)
  // @ts-expect-error - Clerk webhook event types may vary
  if (eventType === 'user.oauthAccountLinked') {
    // @ts-expect-error - Clerk webhook event types are complex and may contain oauth_account
    const { user_id, oauth_account } = evt.data;

    // Check if this is a GitHub account
    if (oauth_account.provider === 'oauth_github') {
      console.log(`GitHub OAuth linked for user ${user_id}`);

      // Store the OAuth token if available
      // Note: Clerk doesn't expose the raw token in webhooks
      // We'll need to get it from the user's session later
      await kv.set(`user:${user_id}:github_connected`, true);
      await kv.set(`user:${user_id}:github_provider`, oauth_account.provider);
    }
  }

  // Handle user created event
  if (eventType === 'user.created') {
    const { id, email_addresses, primary_email_address_id } = evt.data;

    const primaryEmail = email_addresses.find(
      (email) => email.id === primary_email_address_id
    )?.email_address;

    console.log(`User created: ${id}, email: ${primaryEmail}`);

    // Initialize user in KV
    await kv.set(`user:${id}`, {
      id,
      email: primaryEmail,
      plan: 'free',
      createdAt: new Date().toISOString(),
    });

    // Initialize usage tracking
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    await kv.set(`usage:${id}:${currentMonth}`, {
      entriesPublished: 0,
      aiRewrites: 0,
    });
  }

  return new Response('Webhook processed', { status: 200 });
}
