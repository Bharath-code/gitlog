'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  FileText,
  CheckCircle,
  LayoutDashboard,
  Settings,
  BarChart3,
  Globe,
  Map,
  Share2,
  Mail,
  X,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const commands = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, shortcut: ['G', 'D'] },
  { label: 'Drafts', href: '/drafts', icon: FileText, shortcut: ['G', 'F'] },
  { label: 'Published', href: '/published', icon: CheckCircle, shortcut: ['G', 'P'] },
  { label: 'Settings', href: '/settings', icon: Settings, shortcut: [','] },
  { label: 'Analytics', href: '/analytics/widgets', icon: BarChart3 },
  { label: 'Widget', href: '/widget', icon: Globe },
  { label: 'Roadmap', href: '/roadmap', icon: Map },
  { label: 'Social Posts', href: '/social', icon: Share2 },
  { label: 'Email', href: '/email', icon: Mail },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Toggle with Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Run command
  const runCommand = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      className={cn(
        'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity',
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className="fixed left-[50%] top-[20%] z-50 w-full max-w-xl translate-x-[-50%] rounded-xl border border-line bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center border-b border-line px-4 py-3">
          <Command.Input
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
          />
          <button
            onClick={() => setOpen(false)}
            className="rounded p-1 text-muted hover:bg-surface-highlight hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Command List */}
        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigation">
            {commands.map((command) => (
              <Command.Item
                key={command.href}
                value={command.label}
                onSelect={() => runCommand(command.href)}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2 text-sm',
                  'hover:bg-accent/10 hover:text-accent cursor-pointer'
                )}
              >
                <div className="flex items-center gap-3">
                  <command.icon className="h-4 w-4" />
                  {command.label}
                </div>
                {command.shortcut && (
                  <div className="flex items-center gap-1">
                    {command.shortcut.map((key, i) => (
                      <kbd
                        key={i}
                        className="rounded border border-line bg-surface px-1.5 py-0.5 text-xs text-muted"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                )}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        {/* Footer */}
        <div className="border-t border-line px-4 py-2">
          <p className="text-xs text-muted">
            <span className="font-medium">Pro tip:</span> Press{' '}
            <kbd className="rounded border border-line bg-surface px-1 py-0.5 text-xs">Cmd+K</kbd>{' '}
            to toggle
          </p>
        </div>
      </div>
    </Command.Dialog>
  );
}
