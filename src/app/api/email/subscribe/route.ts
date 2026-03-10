import { NextRequest, NextResponse } from 'next/server';
import {
  subscribeToDigest,
  confirmSubscription,
  unsubscribeFromDigest,
} from '@/features/email/subscription-manager';
import { sendEmail } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, repoId, action } = body;

    if (!email || !repoId) {
      return NextResponse.json({ error: 'Email and repoId are required' }, { status: 400 });
    }

    if (action === 'subscribe') {
      const result = await subscribeToDigest(email, repoId);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      // Send confirmation email
      const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/confirm?email=${encodeURIComponent(email)}&repoId=${repoId}&token=${result.token}`;

      await sendEmail({
        to: email,
        subject: 'Confirm your subscription to GitLog updates',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Confirm Your Subscription</h2>
            <p>Click the link below to confirm your subscription to updates:</p>
            <a href="${confirmLink}" style="display: inline-block; padding: 12px 24px; background: #ff6b35; color: white; text-decoration: none; border-radius: 8px;">
              Confirm Subscription
            </a>
            <p style="margin-top: 20px; color: #666; font-size: 14px;">
              Or copy and paste this link into your browser:<br>
              ${confirmLink}
            </p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: 'Please check your email to confirm subscription',
      });
    }

    if (action === 'unsubscribe') {
      const result = await unsubscribeFromDigest(email, repoId);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'Successfully unsubscribed',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling subscription:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const repoId = searchParams.get('repoId');
    const token = searchParams.get('token');

    if (!email || !repoId || !token) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const result = await confirmSubscription(email, repoId, token);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/changelog/${repoId}/subscribed?success=true`, request.url)
    );
  } catch (error) {
    console.error('Error confirming subscription:', error);
    return NextResponse.json({ error: 'Failed to confirm subscription' }, { status: 500 });
  }
}
