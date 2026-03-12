'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';

interface Shortcut {
  keys: string[];
  description: string;
  category: 'navigation' | 'actions' | 'general';
  action?: () => void;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ['G', 'D'], description: 'Go to Drafts', category: 'navigation' },
  { keys: ['G', 'P'], description: 'Go to Published', category: 'navigation' },
  { keys: ['G', 'S'], description: 'Go to Settings', category: 'navigation' },
  { keys: ['G', 'H'], description: 'Go to Dashboard', category: 'navigation' },

  // Actions
  { keys: ['⌘', 'K'], description: 'Search', category: 'actions' },
  { keys: ['N'], description: 'New Draft (manual)', category: 'actions' },
  { keys: ['R'], description: 'AI Rewrite', category: 'actions' },

  // General
  { keys: ['?'], description: 'Show Shortcuts', category: 'general' },
  { keys: ['Esc'], description: 'Close Modal / Cancel', category: 'general' },
];

export function useKeyboardShortcuts() {
  const router = useRouter();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [waitingForSecondKey, setWaitingForSecondKey] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const handleFocusIn = () => {
      const activeElement = document.activeElement;
      setIsInputFocused(
        activeElement?.tagName === 'INPUT' ||
          activeElement?.tagName === 'TEXTAREA' ||
          activeElement?.tagName === 'SELECT' ||
          activeElement?.getAttribute('contenteditable') === 'true'
      );
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isInputFocused && e.key !== 'Escape') return;

      // Handle G + [key] navigation
      if (waitingForSecondKey) {
        setWaitingForSecondKey(false);

        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            router.push('/drafts');
            break;
          case 'p':
            e.preventDefault();
            router.push('/published');
            break;
          case 's':
            e.preventDefault();
            router.push('/settings');
            break;
          case 'h':
            e.preventDefault();
            router.push('/dashboard');
            break;
        }
        return;
      }

      // Cmd/Ctrl + K: Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[type="text"][placeholder*="Search"]'
        ) as HTMLInputElement;
        if (searchInput) searchInput.focus();
        return;
      }

      // ?: Show shortcuts
      if (e.key === '?' && !isInputFocused) {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
        return;
      }

      // G: Start navigation sequence
      if (e.key.toLowerCase() === 'g' && !isInputFocused) {
        e.preventDefault();
        setWaitingForSecondKey(true);
        setTimeout(() => setWaitingForSecondKey(false), 1000);
        return;
      }
    },
    [waitingForSecondKey, isInputFocused, router]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { showShortcuts, setShowShortcuts, shortcuts };
}

// ── Shortcuts Dialog ──
export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const categories = {
    navigation: 'Navigation',
    actions: 'Actions',
    general: 'General',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-surface border-line">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription className="text-muted">
            Navigate faster with these shortcuts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 max-h-[50vh] overflow-y-auto py-2">
          {Object.entries(categories).map(([category, label]) => {
            const items = shortcuts.filter((s) => s.category === category);
            return (
              <div key={category}>
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  {label}
                </h3>
                <div className="space-y-1.5">
                  {items.map((shortcut, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-3 rounded-md bg-surface-highlight"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, ki) => (
                          <kbd
                            key={ki}
                            className="px-1.5 py-0.5 text-[11px] font-mono rounded border border-line bg-background shadow-sm min-w-[24px] text-center"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-line text-center">
          <p className="text-xs text-muted">
            Press{' '}
            <kbd className="px-1.5 py-0.5 text-[11px] font-mono rounded border border-line bg-background">
              ?
            </kbd>{' '}
            to toggle
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Provider wrapper
export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const { showShortcuts, setShowShortcuts } = useKeyboardShortcuts();

  return (
    <>
      {children}
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  );
}

