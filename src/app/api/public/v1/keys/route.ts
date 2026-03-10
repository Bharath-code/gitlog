import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { createApiKey, getUserApiKeys, revokeApiKey, validateApiKey } from '@/features/api/api-key-manager';

/**
 * GET /api/public/v1/keys
 * List all API keys for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // For now, use Clerk auth - in production, also support API key auth
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const keys = await getUserApiKeys(userId);

    // Don't return the hashed key, just the prefix and metadata
    const safeKeys = keys.map(k => ({
      id: k.id,
      name: k.name,
      keyPrefix: k.keyPrefix,
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
      expiresAt: k.expiresAt,
      permissions: k.permissions,
    }));

    return NextResponse.json({ keys: safeKeys });
  } catch (error) {
    console.error('Error listing API keys:', error);
    return NextResponse.json(
      { error: 'Failed to list API keys' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/public/v1/keys
 * Create a new API key
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, expiresAt, permissions } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { apiKey, rawKey } = await createApiKey({
      userId,
      name,
      expiresAt,
      permissions,
    });

    return NextResponse.json({
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        keyPrefix: apiKey.keyPrefix,
        createdAt: apiKey.createdAt,
        expiresAt: apiKey.expiresAt,
        permissions: apiKey.permissions,
      },
      key: rawKey, // Only shown once!
      warning: 'Store this key securely. It will not be shown again.',
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/public/v1/keys/[keyId]
 * Revoke an API key
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ keyId: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { keyId } = await params;

    await revokeApiKey(userId, keyId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error revoking API key:', error);
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}
