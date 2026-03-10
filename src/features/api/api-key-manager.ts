import { kv } from '@vercel/kv';
import crypto from 'crypto';

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string; // Hashed
  keyPrefix: string; // First 8 chars for identification
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  isActive: boolean;
  permissions: {
    read: boolean;
    write: boolean;
  };
}

export interface ApiKeyCreateInput {
  userId: string;
  name: string;
  expiresAt?: string;
  permissions?: {
    read: boolean;
    write: boolean;
  };
}

/**
 * Generate a new API key
 */
export function generateApiKey(): { key: string; keyPrefix: string } {
  const key = `gitlog_${crypto.randomBytes(32).toString('hex')}`;
  const keyPrefix = key.substring(0, 14);
  return { key, keyPrefix };
}

/**
 * Hash API key for storage
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Create a new API key
 */
export async function createApiKey(input: ApiKeyCreateInput): Promise<{ apiKey: ApiKey; rawKey: string }> {
  const { key, keyPrefix } = generateApiKey();
  const hashedKey = hashApiKey(key);

  const apiKey: ApiKey = {
    id: `apikey:${input.userId}:${Date.now()}`,
    userId: input.userId,
    name: input.name,
    key: hashedKey,
    keyPrefix,
    createdAt: new Date().toISOString(),
    expiresAt: input.expiresAt,
    isActive: true,
    permissions: {
      read: true,
      write: input.permissions?.write || false,
    },
  };

  await kv.set(apiKey.id, apiKey);

  // Index by user
  await kv.sadd(`user:${input.userId}:apikeys`, apiKey.id);

  return { apiKey, rawKey: key };
}

/**
 * Get all API keys for a user
 */
export async function getUserApiKeys(userId: string): Promise<ApiKey[]> {
  const keyIds = await kv.smembers(`user:${userId}:apikeys`);
  const keys = await Promise.all(keyIds.map(id => kv.get<ApiKey>(id)));
  return keys.filter((k): k is ApiKey => k !== null && k.isActive);
}

/**
 * Validate API key
 */
export async function validateApiKey(rawKey: string): Promise<ApiKey | null> {
  const hashedKey = hashApiKey(rawKey);
  
  // We need to search through all keys - in production, use a different indexing strategy
  const allKeyPattern = `apikey:*:*`;
  const keys = await kv.keys(allKeyPattern);
  
  for (const key of keys) {
    const apiKey = await kv.get<ApiKey>(key);
    if (apiKey && apiKey.key === hashedKey && apiKey.isActive) {
      // Check expiration
      if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
        return null;
      }
      
      // Update last used
      apiKey.lastUsedAt = new Date().toISOString();
      await kv.set(key, apiKey);
      
      return apiKey;
    }
  }
  
  return null;
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(userId: string, keyId: string): Promise<void> {
  const key = await kv.get<ApiKey>(keyId);
  if (!key || key.userId !== userId) {
    throw new Error('API key not found');
  }

  key.isActive = false;
  await kv.set(keyId, key);
  await kv.srem(`user:${userId}:apikeys`, keyId);
}

/**
 * Check API key permissions
 */
export function hasPermission(apiKey: ApiKey, permission: 'read' | 'write'): boolean {
  if (!apiKey.isActive) {
    return false;
  }
  
  if (permission === 'read') {
    return apiKey.permissions.read;
  }
  
  if (permission === 'write') {
    return apiKey.permissions.write;
  }
  
  return false;
}
