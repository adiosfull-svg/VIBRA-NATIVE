// Stesse opzioni di src/lib/query-client.js dell'app web.
import { QueryClient, focusManager } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';
import { diagQueries } from './testDiag';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 429 || error?.message?.includes('Rate limit')) return false;
        return failureCount < 1;
      },
      refetchOnReconnect: false,
    },
  },
});

// Sul telefono il "focus della finestra" è il ritorno dell'app in primo piano (sul web React Query
// usa già visibilitychange). Vale solo per le query con refetchOnWindowFocus: true, come nell'originale
// (notifiche, Serate): l'app ricontrolla quando si torna dentro, quando la connessione realtime era chiusa.
if (Platform.OS !== 'web') {
  focusManager.setEventListener((handleFocus) => {
    const sub = AppState.addEventListener('change', (state) => handleFocus(state === 'active'));
    return () => sub.remove();
  });
}

// diagnostica dell'emulatore: chiavi delle query avviate
diagQueries(queryClient.getQueryCache());
