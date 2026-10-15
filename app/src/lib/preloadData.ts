// Dati delle pagine dello stack precaricati dopo l'avvio (docs/REGOLE-PRESTAZIONI.md §2), come fa
// l'originale con prefetchCriticalData/prefetchDeferredData (AppLayout): STESSE queryKey e queryFn
// delle pagine, così la prima apertura trova la cache calda e non aspetta la rete (Serate aspettava
// i separatori di stagione ~1 s, Promoter 4 richieste). Una richiesta alla volta, a app ferma, mentre si
// precaricano le tab (lib/preloadRoutes.ts). Le tab caricano già i propri dati.
//
// QUANDO SI CONVERTE UNA PAGINA dello stack che si apre spesso: aggiungere qui le sue query (piccole:
// ogni tabella precaricata resta in memoria), con la stessa chiave e la stessa queryFn della pagina.
import { InteractionManager } from 'react-native';
import { base44 } from './base44';
import { queryClient } from './queryClient';

type Preload = { queryKey: readonly unknown[]; queryFn: () => Promise<unknown>; staleTime?: number; gcTime?: number };

/** Query da precaricare per ruolo. */
export function preloadQueriesFor(role?: string): Preload[] {
  const admin = role === 'admin' || role === 'super4';
  if (!admin) return [];
  return [
    // Serate (web/pages/Serate.jsx)
    { queryKey: ['seasonDividers'], queryFn: () => base44.entities.SeasonDivider.list(), staleTime: 10 * 60000, gcTime: 15 * 60000 },
    // Promoter (web/pages/Promoter.jsx); achievements come il prefetch deferito dell'originale (solo attivi:
    // con list() la cache conterrebbe anche gli inattivi e falserebbe punti e rank in Il Mio Vibra)
    { queryKey: ['clients'], queryFn: () => base44.entities.Client.list(), staleTime: 10 * 60000, gcTime: 15 * 60000 },
    { queryKey: ['achievements'], queryFn: () => base44.entities.Achievement.filter({ is_active: true }), staleTime: 10 * 60000 },
    { queryKey: ['promoter-achievements'], queryFn: () => base44.entities.PromoterAchievement.list(), staleTime: 10 * 60000 },
    { queryKey: ['promoter-ranks'], queryFn: () => base44.entities.PromoterRank.list(), staleTime: 10 * 60000 },
  ];
}

const PRELOAD_DATA_GAP_MS = 150;
let started = false;

/** Avvia il precaricamento (una volta per sessione): una query alla volta, a app ferma. */
export function preloadPageData(role?: string) {
  if (started) return;
  started = true;
  const list = preloadQueriesFor(role);
  let i = 0;
  const next = () => {
    const q = list[i++];
    if (!q) return;
    InteractionManager.runAfterInteractions(() => {
      queryClient.prefetchQuery(q as never).catch(() => {}).finally(() => setTimeout(next, PRELOAD_DATA_GAP_MS));
    });
  };
  next();
}
