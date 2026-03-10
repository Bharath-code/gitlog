import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'border-accent bg-accent px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent-glow/20 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent-glow/30',
        secondary:
          'border-line bg-surface-highlight px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-elevated',
        outline:
          'border-line bg-transparent px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-highlight',
        ghost:
          'border-transparent bg-transparent px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-highlight',
        destructive:
          'border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/20',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
  )
);

Button.displayName = 'Button';

export { Button, buttonVariants };
