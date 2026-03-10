import { kv } from '@vercel/kv';
import crypto from 'crypto';

export interface EmailSubscriber {
  email: string;
  repoId: string;
  subscribedAt: string;
  confirmed: boolean;
  confirmToken: string;
  preferences: {
    digest: boolean;
    majorReleases: boolean;
    allUpdates: boolean;
  };
}

export async function subscribeToDigest(
  email: string,
  repoId: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    // Check if already subscribed
    const existing = await getSubscriber(email, repoId);
    if (existing && existing.confirmed) {
      return { success: false, error: 'Already subscribed' };
    }

    // Generate confirmation token
    const confirmToken = crypto.randomBytes(32).toString('hex');

    const subscriber: EmailSubscriber = {
      email,
      repoId,
      subscribedAt: new Date().toISOString(),
      confirmed: false,
      confirmToken,
      preferences: {
        digest: true,
        majorReleases: true,
        allUpdates: false,
      },
    };

    // Save to KV
    await kv.set(`subscriber:${repoId}:${email}`, subscriber);

    // Add to repo's subscriber list
    await kv.sadd(`subscribers:${repoId}`, email);

    return { success: true, token: confirmToken };
  } catch (error) {
    console.error('Error subscribing:', error);
    return { success: false, error: 'Failed to subscribe' };
  }
}

export async function confirmSubscription(
  email: string,
  repoId: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const subscriber = await getSubscriber(email, repoId);

    if (!subscriber) {
      return { success: false, error: 'Subscription not found' };
    }

    if (subscriber.confirmToken !== token) {
      return { success: false, error: 'Invalid confirmation token' };
    }

    // Update confirmation status
    subscriber.confirmed = true;
    subscriber.confirmToken = '';
    await kv.set(`subscriber:${repoId}:${email}`, subscriber);

    return { success: true };
  } catch (error) {
    console.error('Error confirming subscription:', error);
    return { success: false, error: 'Failed to confirm' };
  }
}

export async function unsubscribeFromDigest(
  email: string,
  repoId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await kv.del(`subscriber:${repoId}:${email}`);
    await kv.srem(`subscribers:${repoId}`, email);

    return { success: true };
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return { success: false, error: 'Failed to unsubscribe' };
  }
}

export async function getSubscriber(
  email: string,
  repoId: string
): Promise<EmailSubscriber | null> {
  try {
    const subscriber = await kv.get<EmailSubscriber>(`subscriber:${repoId}:${email}`);
    return subscriber || null;
  } catch (error) {
    console.error('Error getting subscriber:', error);
    return null;
  }
}

export async function getRepoSubscribers(repoId: string): Promise<string[]> {
  try {
    const subscribers = await kv.smembers(`subscribers:${repoId}`);
    return subscribers || [];
  } catch (error) {
    console.error('Error getting repo subscribers:', error);
    return [];
  }
}

export async function getSubscriberCount(repoId: string): Promise<number> {
  try {
    const subscribers = await kv.smembers(`subscribers:${repoId}`);
    return subscribers?.length || 0;
  } catch (error) {
    console.error('Error getting subscriber count:', error);
    return 0;
  }
}

export async function updateSubscriberPreferences(
  email: string,
  repoId: string,
  preferences: Partial<EmailSubscriber['preferences']>
): Promise<{ success: boolean; error?: string }> {
  try {
    const subscriber = await getSubscriber(email, repoId);

    if (!subscriber) {
      return { success: false, error: 'Subscription not found' };
    }

    subscriber.preferences = {
      ...subscriber.preferences,
      ...preferences,
    };

    await kv.set(`subscriber:${repoId}:${email}`, subscriber);
    return { success: true };
  } catch (error) {
    console.error('Error updating preferences:', error);
    return { success: false, error: 'Failed to update preferences' };
  }
}
