import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { createCheckoutSession, createCustomer } from '@/shared/lib/payment/dodo';
import { siteConfig } from '@/shared/config/site';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await req.json();
    
    if (!plan || !['pro'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Get or create DodoPayment customer
    let dodoCustomerId = await kv.get<string>(`user:${user.id}:dodo_customer_id`);
    
    if (!dodoCustomerId) {
      // Create new customer
      const customer = await createCustomer({
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
        metadata: {
          userId: user.id,
        },
      });
      
      dodoCustomerId = customer.id;
      await kv.set(`user:${user.id}:dodo_customer_id`, dodoCustomerId);
    }

    // Determine plan ID based on user location (India vs International)
    // In production, you'd detect this from user's IP or billing address
    const planId = process.env.DODOPAYMENT_PRO_PLAN_ID_IN || 
                   process.env.DODOPAYMENT_PRO_PLAN_ID;
    
    if (!planId) {
      throw new Error('DODOPAYMENT_PRO_PLAN_ID not configured');
    }

    // Create checkout session
    const baseUrl = siteConfig.url;
    const session = await createCheckoutSession({
      customerId: dodoCustomerId,
      planId,
      successUrl: `${baseUrl}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/dashboard/payment/cancel`,
      metadata: {
        userId: user.id,
        plan: 'pro',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
