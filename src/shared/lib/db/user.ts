import { kv } from '@vercel/kv';
import { config } from '@/shared/config';

// User configuration
export interface UserConfig {
  id: string;
  email: string;
  plan: 'free' | 'pro';
  dodoCustomerId?: string;
  githubToken?: string;
  createdAt: string;
  location?: 'in' | 'intl';
}

export async function getUserConfig(userId: string): Promise<UserConfig | null> {
  return await kv.get<UserConfig>(`user:${userId}`);
}

export async function setUserConfig(userId: string, config: Partial<UserConfig>): Promise<void> {
  const existing = await getUserConfig(userId);
  await kv.set(`user:${userId}`, {
    ...existing,
    ...config,
    id: userId,
  } as UserConfig);
}

export async function getUserPlan(userId: string): Promise<'free' | 'pro'> {
  const user = await getUserConfig(userId);
  return user?.plan || 'free';
}

export async function upgradeToPro(userId: string, dodoCustomerId?: string): Promise<void> {
  await setUserConfig(userId, { plan: 'pro', dodoCustomerId });
}

export async function downgradeToFree(userId: string): Promise<void> {
  await setUserConfig(userId, { plan: 'free' });
}
