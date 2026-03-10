'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { SectionHeading } from '@/shared/components/ui/section-heading';
import { Sparkles, Save, RotateCcw, Check, Palette, Move, Maximize, Eye } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { cn } from '@/shared/lib/utils';

interface WidgetConfig {
  id: string;
  colors: {
    primary: string;
    background: string;
    text: string;
  };
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size: 'small' | 'medium' | 'large';
  options: {
    showDate: boolean;
    showCategory: boolean;
    showNewBadge: boolean;
  };
}

interface WidgetCustomizerProps {
  widgetId: string | null;
  repoId?: string;
}

const colorPresets = [
  { name: 'GitLog', primary: '#ff6b35', background: '#1a1a1d', text: '#fafafa' },
  { name: 'Ocean', primary: '#0ea5e9', background: '#0c4a6e', text: '#f0f9ff' },
  { name: 'Forest', primary: '#22c55e', background: '#14532d', text: '#f0fdf4' },
  { name: 'Sunset', primary: '#f59e0b', background: '#451a03', text: '#fffbeb' },
  { name: 'Purple', primary: '#a855f7', background: '#3b0764', text: '#faf5ff' },
  { name: 'Rose', primary: '#ec4899', background: '#500724', text: '#fdf2f8' },
];

const positionOptions = [
  { value: 'bottom-right', label: 'Bottom Right', icon: '↘️' },
  { value: 'bottom-left', label: 'Bottom Left', icon: '↙️' },
  { value: 'top-right', label: 'Top Right', icon: '↗️' },
  { value: 'top-left', label: 'Top Left', icon: '↖️' },
] as const;

const sizeOptions = [
  { value: 'small', label: 'Small', width: '16rem' },
  { value: 'medium', label: 'Medium', width: '20rem' },
  { value: 'large', label: 'Large', width: '24rem' },
] as const;

export function WidgetCustomizer({ widgetId, repoId }: WidgetCustomizerProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<WidgetConfig | null>(null);

  // Default config
  const defaultConfig: WidgetConfig = {
    id: widgetId || '',
    colors: {
      primary: '#ff6b35',
      background: '#1a1a1d',
      text: '#fafafa',
    },
    position: 'bottom-right',
    size: 'medium',
    options: {
      showDate: true,
      showCategory: true,
      showNewBadge: true,
    },
  };

  // Load existing config when widgetId changes
  useEffect(() => {
    if (widgetId) {
      loadConfig();
    }
  }, [widgetId]);

  const loadConfig = async () => {
    if (!widgetId || !repoId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/widget/generate?repoId=${repoId}`);
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config || defaultConfig);
      } else {
        setConfig(defaultConfig);
      }
    } catch (error) {
      console.error('Error loading config:', error);
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config || !repoId) return;

    setSaving(true);
    try {
      const response = await fetch('/api/widget/customize', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetId,
          repoId,
          config,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save config');
      }

      toast.success('Widget customization saved!');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save customization');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setConfig(defaultConfig);
    toast.info('Reset to default settings');
  };

  const updateColors = (primary: string, background: string, text: string) => {
    if (!config) return;
    setConfig({
      ...config,
      colors: { primary, background, text },
    });
  };

  const updatePosition = (position: WidgetConfig['position']) => {
    if (!config) return;
    setConfig({
      ...config,
      position,
    });
  };

  const updateSize = (size: WidgetConfig['size']) => {
    if (!config) return;
    setConfig({
      ...config,
      size,
    });
  };

  const toggleOption = (option: keyof WidgetConfig['options']) => {
    if (!config) return;
    setConfig({
      ...config,
      options: {
        ...config.options,
        [option]: !config.options[option],
      },
    });
  };

  if (!widgetId) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted py-8">
          <p>Generate a widget first to customize it</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Palette className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Customize Widget</h2>
            <p className="text-sm text-muted">Make it match your brand</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={resetToDefaults} variant="outline" size="sm" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={saveConfig}
            disabled={saving}
            className="bg-accent hover:bg-accent/90 gap-2"
            size="sm"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customization Options */}
        <div className="space-y-6">
          {/* Color Presets */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-4 w-4 text-accent" />
              <h3 className="font-semibold">Color Presets</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => updateColors(preset.primary, preset.background, preset.text)}
                  className={cn(
                    'p-3 rounded-lg border transition-all text-left',
                    config?.colors.primary === preset.primary
                      ? 'border-accent bg-accent/10'
                      : 'border-line hover:border-accent/50'
                  )}
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.primary }} />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.background }}
                    />
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.text }} />
                  </div>
                  <p className="text-xs font-medium">{preset.name}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Custom Colors */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-accent" />
              <h3 className="font-semibold">Custom Colors</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted mb-1 block">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config?.colors.primary || '#ff6b35'}
                    onChange={(e) =>
                      updateColors(
                        e.target.value,
                        config?.colors.background || '#1a1a1d',
                        config?.colors.text || '#fafafa'
                      )
                    }
                    className="w-10 h-10 rounded border border-line cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config?.colors.primary || '#ff6b35'}
                    onChange={(e) =>
                      updateColors(
                        e.target.value,
                        config?.colors.background || '#1a1a1d',
                        config?.colors.text || '#fafafa'
                      )
                    }
                    className="flex-1 px-3 py-2 rounded-md border border-line bg-surface font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted mb-1 block">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config?.colors.background || '#1a1a1d'}
                    onChange={(e) =>
                      updateColors(
                        config?.colors.primary || '#ff6b35',
                        e.target.value,
                        config?.colors.text || '#fafafa'
                      )
                    }
                    className="w-10 h-10 rounded border border-line cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config?.colors.background || '#1a1a1d'}
                    onChange={(e) =>
                      updateColors(
                        config?.colors.primary || '#ff6b35',
                        e.target.value,
                        config?.colors.text || '#fafafa'
                      )
                    }
                    className="flex-1 px-3 py-2 rounded-md border border-line bg-surface font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted mb-1 block">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config?.colors.text || '#fafafa'}
                    onChange={(e) =>
                      updateColors(
                        config?.colors.primary || '#ff6b35',
                        config?.colors.background || '#1a1a1d',
                        e.target.value
                      )
                    }
                    className="w-10 h-10 rounded border border-line cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config?.colors.text || '#fafafa'}
                    onChange={(e) =>
                      updateColors(
                        config?.colors.primary || '#ff6b35',
                        config?.colors.background || '#1a1a1d',
                        e.target.value
                      )
                    }
                    className="flex-1 px-3 py-2 rounded-md border border-line bg-surface font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Position */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Move className="h-4 w-4 text-accent" />
              <h3 className="font-semibold">Position</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {positionOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updatePosition(option.value)}
                  className={cn(
                    'p-3 rounded-lg border transition-all',
                    config?.position === option.value
                      ? 'border-accent bg-accent/10'
                      : 'border-line hover:border-accent/50'
                  )}
                >
                  <span className="text-lg mb-1 block">{option.icon}</span>
                  <p className="text-xs font-medium">{option.label}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Size */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Maximize className="h-4 w-4 text-accent" />
              <h3 className="font-semibold">Size</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSize(option.value)}
                  className={cn(
                    'p-3 rounded-lg border transition-all text-center',
                    config?.size === option.value
                      ? 'border-accent bg-accent/10'
                      : 'border-line hover:border-accent/50'
                  )}
                >
                  <p className="text-sm font-medium mb-1">{option.label}</p>
                  <p className="text-xs text-muted">{option.width}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Display Options */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-accent" />
              <h3 className="font-semibold">Display Options</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Show Dates</span>
                <input
                  type="checkbox"
                  checked={config?.options.showDate}
                  onChange={() => toggleOption('showDate')}
                  className="w-4 h-4 rounded border-line"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Show Category Badges</span>
                <input
                  type="checkbox"
                  checked={config?.options.showCategory}
                  onChange={() => toggleOption('showCategory')}
                  className="w-4 h-4 rounded border-line"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Show "New" Badge</span>
                <input
                  type="checkbox"
                  checked={config?.options.showNewBadge}
                  onChange={() => toggleOption('showNewBadge')}
                  className="w-4 h-4 rounded border-line"
                />
              </label>
            </div>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-4 w-4 text-accent" />
            <h3 className="font-semibold">Live Preview</h3>
          </div>

          <div className="sticky top-4">
            <Card className="p-6">
              <div className="text-sm text-muted mb-4">This is how your widget will look:</div>

              {/* Preview Container */}
              <div className="relative h-[400px] rounded-lg border border-line bg-surface overflow-hidden">
                {/* Preview Widget */}
                <WidgetPreview config={config} />
              </div>

              {/* Preview Info */}
              <div className="mt-4 p-3 rounded-lg bg-surface-highlight border border-line">
                <h4 className="text-sm font-semibold mb-2">Preview Notes:</h4>
                <ul className="text-xs text-muted space-y-1">
                  <li>• Click the header to expand/collapse</li>
                  <li>• Entries are clickable</li>
                  <li>• "Powered by GitLog" branding included</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview Component
function WidgetPreview({ config }: { config: WidgetConfig | null }) {
  if (!config) return null;

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const sizeClasses = {
    small: 'w-64',
    medium: 'w-80',
    large: 'w-96',
  };

  const sampleEntries = [
    {
      id: '1',
      title: 'Added dark mode toggle',
      category: 'New' as const,
      mergedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Fixed login issue on mobile',
      category: 'Fixed' as const,
      mergedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Improved performance',
      category: 'Improved' as const,
      mergedAt: new Date().toISOString(),
    },
  ];

  const categoryColors = {
    New: 'bg-success/10 text-success border-success/20',
    Fixed: 'bg-blue/10 text-blue border-blue/20',
    Improved: 'bg-amber/10 text-amber border-amber/20',
    Other: 'bg-muted/10 text-muted border-muted/20',
  };

  return (
    <div className={cn('absolute p-4', positionClasses[config.position])}>
      <div
        className={cn('rounded-lg border shadow-2xl overflow-hidden', sizeClasses[config.size])}
        style={{
          backgroundColor: config.colors.background,
          borderColor: 'rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer border-b"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.06)',
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: config.colors.primary }} />
            <span className="font-semibold text-sm" style={{ color: config.colors.text }}>
              What's New
            </span>
            {config.options.showNewBadge && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: config.colors.primary,
                  color: '#fff',
                }}
              >
                3
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-h-64 overflow-y-auto">
          {sampleEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 border-b last:border-0"
              style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
            >
              <div className="space-y-2">
                {config.options.showCategory && (
                  <span
                    className={cn(
                      'inline-block px-2 py-0.5 rounded text-xs font-medium border',
                      categoryColors[entry.category]
                    )}
                  >
                    {entry.category}
                  </span>
                )}

                <h4 className="text-sm font-medium" style={{ color: config.colors.text }}>
                  {entry.title}
                </h4>

                {config.options.showDate && (
                  <p className="text-xs" style={{ color: config.colors.text, opacity: 0.5 }}>
                    {new Date(entry.mergedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}

                <div
                  className="flex items-center gap-1 text-xs"
                  style={{ color: config.colors.primary }}
                >
                  <span>View details</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="p-3 border-t text-center text-xs"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.06)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            color: config.colors.text,
            opacity: 0.5,
          }}
        >
          View all updates →
        </div>

        {/* Powered by */}
        <div className="p-2 text-center">
          <span className="text-xs" style={{ color: config.colors.text, opacity: 0.4 }}>
            Powered by GitLog
          </span>
        </div>
      </div>
    </div>
  );
}
