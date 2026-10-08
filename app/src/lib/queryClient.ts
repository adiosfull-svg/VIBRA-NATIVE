import { QueryClient } from '@tanstack/react-query';

// Stessi default "morbidi" dell'app web: i dati cambiano poco durante la sessione.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,
      gcTime: 30 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
