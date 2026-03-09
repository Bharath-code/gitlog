'use client';

import { useContext } from 'react';
import { ToastContext } from '@/shared/components/common/toast';

export function useToast() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}
