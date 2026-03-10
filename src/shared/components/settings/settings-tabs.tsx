'use client';

import { useState } from 'react';
import { cn } from '@/shared/lib/utils';

export type SettingsTab = 'general' | 'publishing' | 'integrations' | 'api' | 'billing';

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const tabs: { id: SettingsTab; label: string; description: string }[] = [
    {
      id: 'general',
      label: 'General',
      description: 'Profile, timezone, preferences',
    },
    {
      id: 'publishing',
      label: 'Publishing',
      description: 'Auto-publish, schedule, filters',
    },
    {
      id: 'integrations',
      label: 'Integrations',
      description: 'Slack, Discord, email',
    },
    {
      id: 'api',
      label: 'API Keys',
      description: 'Manage API access',
    },
    {
      id: 'billing',
      label: 'Billing',
      description: 'Plan, payment, invoices',
    },
  ];

  return (
    <div className="border-b border-line">
      <div className="flex gap-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex flex-col gap-1 pb-3 text-left transition-colors border-b-2 min-w-fit',
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-foreground hover:border-line'
            )}
          >
            <span className="font-medium text-sm">{tab.label}</span>
            <span className="text-xs text-muted">{tab.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
