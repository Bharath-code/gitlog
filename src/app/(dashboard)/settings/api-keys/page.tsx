'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { SectionHeading } from '@/shared/components/ui/section-heading';
import { useToast } from '@/shared/hooks/use-toast';
import { Key, Plus, Trash2, Copy, Check, Eye, EyeOff } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  permissions: {
    read: boolean;
    write: boolean;
  };
}

export default function ApiKeysPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      const res = await fetch('/api/public/v1/keys');
      const data = await res.json();
      setKeys(data.keys || []);
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const createKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    try {
      const res = await fetch('/api/public/v1/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      });

      const data = await res.json();

      if (data.key) {
        setCreatedKey(data.key);
        setKeys([...keys, data.apiKey]);
        setNewKeyName('');
        setShowNewKey(false);
        toast.success('API key created! Store it securely - it won\'t be shown again.');
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
    }
  };

  const revokeKey = async (keyId: string) => {
    if (!confirm('Are you sure? This API key will stop working immediately.')) {
      return;
    }

    try {
      const res = await fetch(`/api/public/v1/keys/${keyId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setKeys(keys.filter(k => k.id !== keyId));
        toast.success('API key revoked');
      }
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast.error('Failed to revoke API key');
    }
  };

  const copyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <SectionHeading title="API Keys" />
        <p className="text-muted mt-2">
          Create API keys to access GitLog programmatically
        </p>
      </div>

      {/* Create New Key */}
      {!createdKey && !showNewKey ? (
        <Card className="p-6">
          <Button onClick={() => setShowNewKey(true)} className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-2" />
            Create New API Key
          </Button>
        </Card>
      ) : createdKey ? (
        <Card className="p-6 border-accent/50 bg-accent/5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-success flex items-center gap-2">
                <Check className="h-5 w-5" />
                API Key Created Successfully
              </h3>
              <p className="text-muted mt-2">
                ⚠️ Store this key securely. It will not be shown again!
              </p>
              <div className="mt-4 p-4 rounded-lg bg-surface-highlight border border-line font-mono text-sm break-all">
                {createdKey}
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => copyKey(createdKey)} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={() => setCreatedKey(null)} variant="outline" size="sm">
                  I've Saved It
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">API Key Name</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production App, CI/CD Pipeline"
                className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createKey} className="bg-accent hover:bg-accent/90">
                Create Key
              </Button>
              <Button onClick={() => setShowNewKey(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Existing Keys */}
      {keys.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your API Keys</h3>
          {keys.map((key) => (
            <Card key={key.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted" />
                    <span className="font-medium">{key.name}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted font-mono">
                    {key.keyPrefix}••••••••••••
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-muted">
                    <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                    {key.lastUsedAt && (
                      <span>Last used: {new Date(key.lastUsedAt).toLocaleDateString()}</span>
                    )}
                    {key.expiresAt && (
                      <span>Expires: {new Date(key.expiresAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="mt-2 flex gap-2">
                    {key.permissions.read && (
                      <span className="inline-flex items-center rounded-md bg-success/10 px-2 py-1 text-xs text-success">
                        Read
                      </span>
                    )}
                    {key.permissions.write && (
                      <span className="inline-flex items-center rounded-md bg-accent/10 px-2 py-1 text-xs text-accent">
                        Write
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => revokeKey(key.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Revoke
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* API Documentation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">API Documentation</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Authentication</h4>
            <p className="text-muted">
              Include your API key in the Authorization header:
            </p>
            <pre className="mt-2 p-3 rounded-lg bg-surface-highlight border border-line font-mono text-xs overflow-x-auto">
              Authorization: Bearer YOUR_API_KEY
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Endpoints</h4>
            <ul className="space-y-2 text-muted">
              <li>
                <code className="text-accent">GET /api/public/v1/changelog</code>
                <br />
                Get published changelog entries
              </li>
              <li>
                <code className="text-accent">GET /api/public/v1/keys</code>
                <br />
                List your API keys
              </li>
              <li>
                <code className="text-accent">POST /api/public/v1/keys</code>
                <br />
                Create a new API key
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Example Request</h4>
            <pre className="p-3 rounded-lg bg-surface-highlight border border-line font-mono text-xs overflow-x-auto">
{`curl -X GET https://gitlog.app/api/public/v1/changelog \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
}
