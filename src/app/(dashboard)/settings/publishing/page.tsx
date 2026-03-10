'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { SectionHeading } from '@/shared/components/ui/section-heading';
import { useToast } from '@/shared/hooks/use-toast';
import { Settings, Clock, Filter, Zap } from 'lucide-react';

export default function PublishingSettingsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    autoPublish: false,
    publishSchedule: 'immediate' as 'immediate' | 'weekly' | 'monthly',
    scheduleDay: 5, // Friday by default
    filterLabels: {
      exclude: ['chore', 'test', 'refactor'],
      include: ['feat', 'fix', 'docs'],
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/user/settings');
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to save settings');

      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
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
        <SectionHeading title="Publishing Settings" />
        <p className="text-muted mt-2">Control how and when your changelog entries are published</p>
      </div>

      {/* Auto-Publish Toggle */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
            <Zap className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Auto-Publish</h2>
            <p className="text-sm text-muted mt-1">
              Automatically publish changelog entries when PRs are merged
            </p>
            <div className="mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoPublish}
                  onChange={(e) => setSettings({ ...settings, autoPublish: e.target.checked })}
                  className="w-5 h-5 rounded border-line accent-accent"
                />
                <span className="text-sm font-medium">Enable auto-publish</span>
              </label>
              {settings.autoPublish && (
                <p className="text-xs text-muted mt-2 ml-8">
                  ⚠️ All merged PRs will be published immediately without review
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Publishing Schedule */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue/10">
            <Clock className="h-6 w-6 text-blue" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Publishing Schedule</h2>
            <p className="text-sm text-muted mt-1">Choose when to publish your changelog entries</p>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="schedule"
                  checked={settings.publishSchedule === 'immediate'}
                  onChange={() => setSettings({ ...settings, publishSchedule: 'immediate' })}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm font-medium">Immediate (per-PR)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="schedule"
                  checked={settings.publishSchedule === 'weekly'}
                  onChange={() => setSettings({ ...settings, publishSchedule: 'weekly' })}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm font-medium">Weekly digest</span>
              </label>
              {settings.publishSchedule === 'weekly' && (
                <div className="ml-7 mt-2">
                  <select
                    value={settings.scheduleDay}
                    onChange={(e) =>
                      setSettings({ ...settings, scheduleDay: parseInt(e.target.value) })
                    }
                    className="text-sm rounded-md border border-line bg-surface px-3 py-2"
                  >
                    <option value={1}>Monday</option>
                    <option value={2}>Tuesday</option>
                    <option value={3}>Wednesday</option>
                    <option value={4}>Thursday</option>
                    <option value={5}>Friday</option>
                    <option value={6}>Saturday</option>
                    <option value={0}>Sunday</option>
                  </select>
                </div>
              )}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="schedule"
                  checked={settings.publishSchedule === 'monthly'}
                  onChange={() => setSettings({ ...settings, publishSchedule: 'monthly' })}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm font-medium">Monthly digest</span>
              </label>
              {settings.publishSchedule === 'monthly' && (
                <div className="ml-7 mt-2">
                  <select
                    value={settings.scheduleDay}
                    onChange={(e) =>
                      setSettings({ ...settings, scheduleDay: parseInt(e.target.value) })
                    }
                    className="text-sm rounded-md border border-line bg-surface px-3 py-2"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                        {day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of each
                        month
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* PR Filtering */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple/10">
            <Filter className="h-6 w-6 text-purple" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">PR Filtering</h2>
            <p className="text-sm text-muted mt-1">Control which PRs appear in your changelog</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Exclude labels (comma-separated)</label>
                <input
                  type="text"
                  value={settings.filterLabels.exclude.join(', ')}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      filterLabels: {
                        ...settings.filterLabels,
                        exclude: e.target.value.split(',').map((s) => s.trim()),
                      },
                    })
                  }
                  className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
                  placeholder="chore, test, refactor"
                />
                <p className="text-xs text-muted mt-1">
                  PRs with these labels will be excluded from changelog
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Include only these labels (optional)</label>
                <input
                  type="text"
                  value={settings.filterLabels.include.join(', ')}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      filterLabels: {
                        ...settings.filterLabels,
                        include: e.target.value.split(',').map((s) => s.trim()),
                      },
                    })
                  }
                  className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
                  placeholder="feat, fix, docs"
                />
                <p className="text-xs text-muted mt-1">
                  Leave empty to include all (except excluded)
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Release Grouping */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green/10">
            <Settings className="h-6 w-6 text-green" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Release Grouping (Coming Soon)</h2>
            <p className="text-sm text-muted mt-1">
              Group multiple PRs into versioned releases (v1.0.0, v1.1.0, etc.)
            </p>
            <div className="mt-4 p-4 rounded-lg bg-surface-highlight border border-line">
              <p className="text-sm text-muted">
                This feature will be available in Phase 3. You'll be able to:
              </p>
              <ul className="text-sm text-muted mt-2 space-y-1 ml-4 list-disc">
                <li>Create versioned releases (v1.0.0, v1.1.0, etc.)</li>
                <li>Group multiple PRs under one release</li>
                <li>Add release notes and highlights</li>
                <li>Schedule release dates</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving} className="bg-accent hover:bg-accent/90">
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
