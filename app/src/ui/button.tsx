// Port di src/components/ui/button.jsx: stesse varianti e classi.
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from './cn';
import { Btn } from './html';
import { IconClassContext } from './icon';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all active:scale-[0.97] disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm',
        outline: 'border border-input bg-transparent shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm',
        ghost: '',
        link: 'text-primary',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export type ButtonProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  title?: string;
  type?: string;
};

export function Button({ className, variant, size, title, type: _type, ...props }: ButtonProps) {
  return (
    // [&_svg]:size-4 [&_svg]:shrink-0 → dimensione di default delle icone figlie
    <IconClassContext.Provider value="size-4 shrink-0">
      <Btn className={cn(buttonVariants({ variant, size }), className)} accessibilityLabel={props.accessibilityLabel ?? title} {...props} />
    </IconClassContext.Provider>
  );
}
