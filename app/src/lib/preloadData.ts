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
export function preloadQueriesFor(role?: string, promoterId?: string | null): Preload[] {
  const admin = role === 'admin' || role === 'super4';
  // Download (web/pages/Download.jsx, tutti i ruoli): come prefetchDeferredData dell'originale
  const common: Preload[] = [
    { queryKey: ['download-items'], queryFn: () => base44.entities.DownloadItem.list(), staleTime: 5 * 60000 },
  ];
  // Messaggi (non admin, con un promoter): chat ignorate e profilo Instagram, stesse queryFn e staleTime
  // della pagina (InstagramDMsTab, InstagramProfileCard). L'admin senza promoter usa list(): non qui.
  if (!admin) {
    if (!promoterId) return common;
    return [
      ...common,
      { queryKey: ['ignored-ig-chats', promoterId], queryFn: () => base44.entities.IgnoredInstagramChat.filter({ promoter_id: promoterId }), staleTime: 60000 },
      { queryKey: ['promoter', promoterId], queryFn: () => base44.entities.Promoter.get(promoterId), staleTime: 60000 },
    ];
  }
  return [
    ...common,
    // Locali (web/pages/Locali.jsx): stessa queryFn della pagina (ordinati per sort_order)
    { queryKey: ['venues'], queryFn: () => base44.entities.Venue.list('sort_order'), staleTime: 10 * 60000, gcTime: 15 * 60000 },
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
let done: Promise<void> = Promise.resolve();

/** Avvia il precaricamento (una volta per sessione): una query alla volta, a app ferma. */
export function preloadPageData(role?: string, promoterId?: string | null): Promise<void> {
  if (started) return done;
  started = true;
  const list = preloadQueriesFor(role, promoterId);
  let i = 0;
  done = new Promise<void>((resolve) => {
    const next = () => {
      const q = list[i++];
      if (!q) { resolve(); return; }
      InteractionManager.runAfterInteractions(() => {
        queryClient.prefetchQuery(q as never).catch(() => {}).finally(() => setTimeout(next, PRELOAD_DATA_GAP_MS));
      });
    };
    next();
  });
  return done;
}

/** Fine del precaricamento dei dati (subito se non è partito). */
export function pageDataPreloaded(): Promise<void> {
  return done;
}
