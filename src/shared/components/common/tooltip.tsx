'use client';

import { ReactNode } from 'react';
import {
  Tooltip as RadixTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

/**
 * Drop-in replacement for the old hand-rolled tooltip.
 * Same API (content, children, side), now backed by Radix Tooltip
 * with keyboard support and accessibility built in.
 */
export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <RadixTooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </RadixTooltip>
    </TooltipProvider>
  );
}
