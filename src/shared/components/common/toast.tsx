'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { X, Check, AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContextType {
  toast: (toast: Omit<Toast, 'id'>) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export { ToastContext };
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ type, message, description }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message, description }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const success = useCallback(
    (message: string, description?: string) => {
      toast({ type: 'success', message, description });
    },
    [toast]
  );

  const error = useCallback(
    (message: string, description?: string) => {
      toast({ type: 'error', message, description });
    },
    [toast]
  );

  const info = useCallback(
    (message: string, description?: string) => {
      toast({ type: 'info', message, description });
    },
    [toast]
  );

  const warning = useCallback(
    (message: string, description?: string) => {
      toast({ type: 'warning', message, description });
    },
    [toast]
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const icons = {
    success: Check,
    error: AlertCircle,
    info: AlertCircle,
    warning: AlertTriangle,
  };

  const colors = {
    success: 'bg-success/10 border-success/20 text-success',
    error: 'bg-red-500/10 border-red-500/20 text-red-500',
    info: 'bg-blue/10 border-blue/20 text-blue',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 shadow-lg min-w-80 max-w-md animate-in slide-in-from-right',
        colors[toast.type]
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-sm">{toast.message}</p>
        {toast.description && <p className="text-xs mt-1 opacity-80">{toast.description}</p>}
      </div>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
