// Stesse opzioni di src/lib/query-client.js dell'app web.
import { QueryClient } from '@tanstack/react-query';

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
