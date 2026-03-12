'use client';

import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

export type SettingsTab = 'general' | 'publishing' | 'integrations' | 'api' | 'billing';

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const tabs: { id: SettingsTab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'publishing', label: 'Publishing' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'api', label: 'API Keys' },
  { id: 'billing', label: 'Billing' },
];

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="border-b border-line">
      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as SettingsTab)}>
        <TabsList className="h-auto bg-transparent rounded-none border-0 p-0 gap-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground transition-colors"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
