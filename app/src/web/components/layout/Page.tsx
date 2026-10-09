// Struttura di pagina di AppLayout.jsx: intestazione in linea + contenuto "main-content p-4"
// (pt 0.5rem) + spazio in fondo per la barra di navigazione (4.5rem + safe area).
import { forwardRef, type ReactNode } from 'react';
import { RefreshControl, ScrollView, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../../../ui/cn';
import { Div } from '../../../ui/html';
import { THEME } from '../../../ui/palette.generated';
import AppHeader from './AppHeader';

type Props = Omit<ScrollViewProps, 'children'> & {
  children?: ReactNode;
  title?: string;
  className?: string;
  onRefresh?: () => Promise<unknown> | void;
  refreshing?: boolean;
};

const Page = forwardRef<ScrollView, Props>(({ children, title, className, onRefresh, refreshing = false, ...props }, ref) => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      ref={ref}
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 72 + insets.bottom }}
      keyboardShouldPersistTaps="handled"
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME['accent-foreground']} /> : undefined}
      {...props}
    >
      <AppHeader title={title} />
      <Div className={cn('p-4 pt-2', className)}>{children}</Div>
    </ScrollView>
  );
});
Page.displayName = 'Page';
export default Page;
