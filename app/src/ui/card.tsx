// Port di src/components/ui/card.jsx.
import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import { cn } from './cn';
import { Div } from './html';

type P = ViewProps & { className?: string; children?: ReactNode };

export const Card = ({ className, ...p }: P) => <Div className={cn('rounded-xl border border-border bg-card text-card-foreground shadow', className)} {...p} />;
export const CardHeader = ({ className, ...p }: P) => <Div className={cn('flex flex-col space-y-1.5 p-6', className)} {...p} />;
export const CardTitle = ({ className, ...p }: P) => <Div className={cn('font-semibold leading-none tracking-tight', className)} {...p} />;
export const CardDescription = ({ className, ...p }: P) => <Div className={cn('text-sm text-muted-foreground', className)} {...p} />;
export const CardContent = ({ className, ...p }: P) => <Div className={cn('p-6 pt-0', className)} {...p} />;
export const CardFooter = ({ className, ...p }: P) => <Div className={cn('flex items-center p-6 pt-0', className)} {...p} />;
