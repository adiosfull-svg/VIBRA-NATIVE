// Port di src/components/ui/badge.jsx.
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from './cn';
import { Div } from './html';

export const badgeVariants = cva('inline-flex items-center self-start rounded-md border px-2.5 py-0.5 text-xs font-semibold', {
  variants: {
    variant: {
      default: 'border-transparent bg-primary text-primary-foreground shadow',
      secondary: 'border-transparent bg-secondary text-secondary-foreground',
      destructive: 'border-transparent bg-destructive text-destructive-foreground shadow',
      outline: 'border-border text-foreground',
    },
  },
  defaultVariants: { variant: 'default' },
});

export function Badge({ className, variant, ...props }: VariantProps<typeof badgeVariants> & { className?: string; children?: ReactNode }) {
  return <Div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
