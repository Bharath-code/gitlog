'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Check, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PublishingSettings {
  autoPublish: boolean;
  schedule: 'immediate' | 'weekly' | 'monthly';
  scheduleDay: number;
  filterLabels: {
    exclude: string;
    include: string;
  };
}

export function PublishingSettingsTab() {
  const [settings, setSettings] = useState<PublishingSettings>({
    autoPublish: false,
    schedule: 'immediate',
    scheduleDay: 5, // Friday
    filterLabels: {
      exclude: 'chore, test, refactor',
      include: '',
    },
  });

  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Auto-save on changes
  useEffect(() => {
    const timer = setTimeout(() => {
      // In production, save to API here
      console.log('Auto-saving settings:', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);

    setHasChanges(true);
    return () => clearTimeout(timer);
  }, [settings]);

  const handleRestoreDefaults = () => {
    setSettings({
      autoPublish: false,
      schedule: 'immediate',
      scheduleDay: 5,
      filterLabels: {
        exclude: 'chore, test, refactor',
        include: '',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Save Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Publishing Settings</h2>
          <p className="text-sm text-muted mt-1">
            Control how and when your changelog entries are published
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-sm text-success">
              <Check className="h-4 w-4" />
              Saved
            </span>
          )}
          {hasChanges && !saved && <span className="text-sm text-muted">Saving...</span>}
          <Button variant="outline" size="sm" onClick={handleRestoreDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restore Defaults
          </Button>
        </div>
      </div>

      {/* Auto-Publish Toggle */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Auto-Publish</h3>
              <Badge variant="success" className="text-xs">
                Recommended
              </Badge>
            </div>
            <p className="text-sm text-muted">
              Automatically publish changelog entries when PRs are merged. Saves 5+ hours per week.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoPublish}
              onChange={(e) => setSettings({ ...settings, autoPublish: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-highlight peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>
        {settings.autoPublish && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-600">
              ⚠️ When enabled, all merged PRs will be published automatically without review.
            </p>
          </div>
        )}
      </Card>

      {/* Schedule Settings */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Publishing Schedule</h3>
        <div className="space-y-4">
          {[
            { value: 'immediate', label: 'Immediate', desc: 'Publish as soon as PR is merged' },
            { value: 'weekly', label: 'Weekly', desc: 'Publish all drafts every week' },
            { value: 'monthly', label: 'Monthly', desc: 'Publish all drafts every month' },
          ].map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors',
                settings.schedule === option.value
                  ? 'border-accent bg-accent/5'
                  : 'border-line hover:border-accent/50'
              )}
            >
              <input
                type="radio"
                name="schedule"
                value={option.value}
                checked={settings.schedule === option.value}
                onChange={(e) => setSettings({ ...settings, schedule: e.target.value as any })}
                className="mt-1 h-4 w-4 text-accent"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{option.label}</span>
                  {option.value === 'weekly' && (
                    <Badge variant="default" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted mt-1">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {settings.schedule !== 'immediate' && (
          <div className="mt-4 p-4 rounded-lg bg-surface-highlight border border-line">
            <label className="block text-sm font-medium mb-2">
              {settings.schedule === 'weekly' ? 'Day of Week' : 'Day of Month'}
            </label>
            <select
              value={settings.scheduleDay}
              onChange={(e) => setSettings({ ...settings, scheduleDay: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm"
            >
              {settings.schedule === 'weekly' ? (
                <>
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                  <option value={0}>Sunday</option>
                </>
              ) : (
                Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                    {day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of each month
                  </option>
                ))
              )}
            </select>
          </div>
        )}
      </Card>

      {/* Filter Settings */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">PR Filtering</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Exclude Labels (comma-separated)
            </label>
            <input
              type="text"
              value={settings.filterLabels.exclude}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  filterLabels: { ...settings.filterLabels, exclude: e.target.value },
                })
              }
              placeholder="chore, test, refactor"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm"
            />
            <p className="text-xs text-muted mt-1">
              PRs with these labels will be excluded from the changelog
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Include Only Labels (optional)</label>
            <input
              type="text"
              value={settings.filterLabels.include}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  filterLabels: { ...settings.filterLabels, include: e.target.value },
                })
              }
              placeholder="feat, fix, docs"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm"
            />
            <p className="text-xs text-muted mt-1">
              Leave empty to include all PRs (except excluded)
            </p>
          </div>

          <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
            <p className="text-xs text-accent font-medium">
              💡 Pro tip: Exclude "chore" and "test" to keep your changelog clean and user-focused.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
