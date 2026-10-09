// API di `sonner` (toast.success/error/...) sopra il sistema di toast dell'app.
import { toast as base } from './use-toast';

type Opts = { description?: string; duration?: number };
function make(variant: 'default' | 'destructive') {
  return (message: string, opts: Opts = {}) => base({ title: message, description: opts.description, duration: opts.duration, variant });
}
export const toast = Object.assign(make('default'), {
  success: make('default'), info: make('default'), message: make('default'), warning: make('default'),
  error: make('destructive'), loading: make('default'), dismiss: () => {},
});
