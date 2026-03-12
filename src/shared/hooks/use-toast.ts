'use client';

import { toast as sonnerToast } from 'sonner';

/**
 * Drop-in replacement for the old custom ToastContext-based hook.
 * Same API surface (`success`, `error`, `info`, `warning`, `toast`),
 * now powered by Sonner under the hood.
 */
export function useToast() {
  return {
    toast: ({ type, message, description }: { type: string; message: string; description?: string }) => {
      const fn = type === 'success' ? sonnerToast.success
        : type === 'error' ? sonnerToast.error
        : type === 'warning' ? sonnerToast.warning
        : sonnerToast.info;
      fn(message, { description });
    },
    success: (message: string, description?: string) => {
      sonnerToast.success(message, { description });
    },
    error: (message: string, description?: string) => {
      sonnerToast.error(message, { description });
    },
    info: (message: string, description?: string) => {
      sonnerToast.info(message, { description });
    },
    warning: (message: string, description?: string) => {
      sonnerToast.warning(message, { description });
    },
    dismiss: (id?: string | number) => {
      sonnerToast.dismiss(id);
    },
  };
}
