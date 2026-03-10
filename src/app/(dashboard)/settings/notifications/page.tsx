'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { SectionHeading } from '@/shared/components/ui/section-heading';
import { useToast } from '@/shared/hooks/use-toast';
import { Bell, Slack, Trash2, Plus } from 'lucide-react';

interface Notification {
  id: string;
  type: 'slack' | 'discord';
  isActive: boolean;
  events: {
    onPublish: boolean;
    onScheduled: boolean;
    onRelease: boolean;
  };
  createdAt: string;
  webhookUrlMasked: string;
}

export default function NotificationsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    type: 'slack' as 'slack' | 'discord',
    webhookUrl: '',
    onPublish: true,
    onScheduled: false,
    onRelease: false,
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = async () => {
    if (!newNotification.webhookUrl.trim()) {
      toast.error('Please enter a webhook URL');
      return;
    }

    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newNotification.type,
          webhookUrl: newNotification.webhookUrl,
          events: {
            onPublish: newNotification.onPublish,
            onScheduled: newNotification.onScheduled,
            onRelease: newNotification.onRelease,
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        loadNotifications();
        setShowAddForm(false);
        setNewNotification({
          type: 'slack',
          webhookUrl: '',
          onPublish: true,
          onScheduled: false,
          onRelease: false,
        });
        toast.success('Notification added successfully');
      }
    } catch (error) {
      console.error('Error adding notification:', error);
      toast.error('Failed to add notification');
    }
  };

  const deleteNotification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setNotifications(notifications.filter(n => n.id !== id));
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
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
        <SectionHeading title="Notifications" />
        <p className="text-muted mt-2">
          Get notified in Slack or Discord when changelog entries are published
        </p>
      </div>

      {/* Add Notification */}
      {!showAddForm ? (
        <Card className="p-6">
          <Button onClick={() => setShowAddForm(true)} className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Notification
          </Button>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Platform</label>
              <div className="mt-2 flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={newNotification.type === 'slack'}
                    onChange={(e) => setNewNotification({ ...newNotification, type: 'slack' })}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="flex items-center gap-2">
                    <Slack className="h-4 w-4" />
                    Slack
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={newNotification.type === 'discord'}
                    onChange={(e) => setNewNotification({ ...newNotification, type: 'discord' })}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Discord
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Webhook URL
              </label>
              <input
                type="url"
                value={newNotification.webhookUrl}
                onChange={(e) => setNewNotification({ ...newNotification, webhookUrl: e.target.value })}
                placeholder={newNotification.type === 'slack' 
                  ? 'https://hooks.slack.com/services/...'
                  : 'https://discord.com/api/webhooks/...'
                }
                className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2"
              />
              <p className="text-xs text-muted mt-1">
                Get your webhook URL from your {newNotification.type} workspace settings
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Notify When</label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newNotification.onPublish}
                    onChange={(e) => setNewNotification({ ...newNotification, onPublish: e.target.checked })}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="text-sm">Entries are published</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newNotification.onScheduled}
                    onChange={(e) => setNewNotification({ ...newNotification, onScheduled: e.target.checked })}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="text-sm">Scheduled publish completes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newNotification.onRelease}
                    onChange={(e) => setNewNotification({ ...newNotification, onRelease: e.target.checked })}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="text-sm">New release is published</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addNotification} className="bg-accent hover:bg-accent/90">
                Add Notification
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Existing Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Notifications</h3>
          {notifications.map((notification) => (
            <Card key={notification.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {notification.type === 'slack' ? (
                      <Slack className="h-5 w-5 text-purple" />
                    ) : (
                      <Bell className="h-5 w-5 text-accent" />
                    )}
                    <span className="font-medium capitalize">{notification.type}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted font-mono">
                    {notification.webhookUrlMasked}
                  </div>
                  <div className="mt-2 flex gap-2">
                    {notification.events.onPublish && (
                      <span className="inline-flex items-center rounded-md bg-success/10 px-2 py-1 text-xs text-success">
                        On Publish
                      </span>
                    )}
                    {notification.events.onScheduled && (
                      <span className="inline-flex items-center rounded-md bg-blue/10 px-2 py-1 text-xs text-blue">
                        On Scheduled
                      </span>
                    )}
                    {notification.events.onRelease && (
                      <span className="inline-flex items-center rounded-md bg-accent/10 px-2 py-1 text-xs text-accent">
                        On Release
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => deleteNotification(notification.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Help Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">How to Get Your Webhook URL</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Slack className="h-4 w-4" />
              Slack
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-muted">
              <li>Go to your Slack workspace</li>
              <li>Navigate to the channel where you want notifications</li>
              <li>Click "Apps" → "Add an app"</li>
              <li>Search for "Incoming Webhooks"</li>
              <li>Click "Add to Slack" and select your channel</li>
              <li>Copy the Webhook URL</li>
            </ol>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Discord
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-muted">
              <li>Go to your Discord server</li>
              <li>Click the gear icon next to your channel</li>
              <li>Go to "Integrations" → "Webhooks"</li>
              <li>Click "New Webhook"</li>
              <li>Give it a name and select the channel</li>
              <li>Copy the Webhook URL</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
}
