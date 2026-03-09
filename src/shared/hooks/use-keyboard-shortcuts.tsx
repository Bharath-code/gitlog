'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

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
  { keys: ['Cmd', 'K'], description: 'Search', category: 'actions' },
  { keys: ['N'], description: 'New Draft (manual)', category: 'actions' },
  { keys: ['P'], description: 'Publish Selected', category: 'actions' },
  { keys: ['D'], description: 'Delete Selected', category: 'actions' },
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

  // Track if input is focused (don't trigger shortcuts when typing)
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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (isInputFocused && e.key !== 'Escape') {
      return;
    }

    // Handle G + [key] navigation
    if (waitingForSecondKey) {
      setWaitingForSecondKey(false);
      
      switch (e.key.toLowerCase()) {
        case 'd':
          e.preventDefault();
          router.push('/dashboard/drafts');
          break;
        case 'p':
          e.preventDefault();
          router.push('/dashboard/published');
          break;
        case 's':
          e.preventDefault();
          router.push('/dashboard/settings');
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
      // Trigger search - you can implement this based on your search component
      const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
      return;
    }

    // ?: Show shortcuts
    if (e.key === '?' && !isInputFocused) {
      e.preventDefault();
      setShowShortcuts(prev => !prev);
      return;
    }

    // Esc: Close modals
    if (e.key === 'Escape') {
      e.preventDefault();
      setShowShortcuts(false);
      // Close any open modals
      const closeButtons = document.querySelectorAll('[data-state="open"]');
      closeButtons.forEach(btn => (btn as HTMLElement).click());
      return;
    }

    // G: Start navigation sequence
    if (e.key.toLowerCase() === 'g' && !isInputFocused) {
      e.preventDefault();
      setWaitingForSecondKey(true);
      // Reset after 1 second if no second key pressed
      setTimeout(() => setWaitingForSecondKey(false), 1000);
      return;
    }

    // Single key shortcuts (only when not waiting for second key)
    if (!waitingForSecondKey && !isInputFocused) {
      switch (e.key.toLowerCase()) {
        case 'n':
          // New draft - implement based on your app
          e.preventDefault();
          console.log('New draft shortcut triggered');
          break;
        case 'p':
          // Publish selected - implement based on your app
          e.preventDefault();
          console.log('Publish selected shortcut triggered');
          break;
        case 'd':
          // Delete selected - implement based on your app
          e.preventDefault();
          console.log('Delete selected shortcut triggered');
          break;
        case 'r':
          // AI rewrite - implement based on your app
          e.preventDefault();
          console.log('AI rewrite shortcut triggered');
          break;
      }
    }
  }, [waitingForSecondKey, isInputFocused, router]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    showShortcuts,
    setShowShortcuts,
    shortcuts,
  };
}

// Modal component to display shortcuts
export function KeyboardShortcutsModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const categories = {
    navigation: 'Navigation',
    actions: 'Actions',
    general: 'General',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-line bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-line">
          <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-highlight transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {Object.entries(categories).map(([category, label]) => {
            const categoryShortcuts = shortcuts.filter(s => s.category === category);
            
            return (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
                  {label}
                </h3>
                <div className="grid gap-2 md:grid-cols-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight"
                    >
                      <span className="text-sm text-foreground">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <kbd
                            key={keyIndex}
                            className="px-2 py-1 text-xs font-mono rounded-md bg-background border border-line shadow-sm min-w-[28px] text-center"
                          >
                            {key === 'Cmd' ? '⌘' : key === 'Ctrl' ? '⌃' : key === 'Esc' ? '⎋' : key}
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

        {/* Footer */}
        <div className="p-4 border-t border-line bg-surface-highlight rounded-b-xl">
          <p className="text-xs text-muted text-center">
            Press <kbd className="px-2 py-1 text-xs font-mono rounded-md bg-background border border-line">?</kbd> to toggle this help
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrapper component to add keyboard shortcuts to any page
export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const { showShortcuts, setShowShortcuts } = useKeyboardShortcuts();

  return (
    <>
      {children}
      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </>
  );
}
