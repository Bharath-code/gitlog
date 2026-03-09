'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-xs font-medium text-white bg-surface-dark border border-line rounded-lg shadow-lg whitespace-nowrap animate-in fade-in zoom-in duration-200',
            positionClasses[side],
            className
          )}
        >
          {content}
          
          {/* Arrow */}
          {side === 'top' && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-surface-dark" />
          )}
          {side === 'bottom' && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-surface-dark" />
          )}
          {side === 'left' && (
            <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-4 border-transparent border-l-surface-dark" />
          )}
          {side === 'right' && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-r-surface-dark" />
          )}
        </div>
      )}
    </div>
  );
}
