// Port di src/hooks/useAllVenueLogos.jsx (stessa API: { logoMap, getVenueLogo }).
// PORT: un solo osservatore della query per tutta l'app. L'originale faceva una useQuery per ogni
// chiamata: sul telefono ogni riga di Serate, ogni card delle semine e ogni pulsante dei locali creava
// il suo osservatore react-query (~0,5 ms e memoria ciascuno, decine per pagina) per leggere la stessa
// tabella di impostazioni. Qui i dati arrivano dalla cache con useSyncExternalStore (costo nullo per
// consumatore) e la mappa dei loghi si calcola una volta per ogni versione dei dati.
import { useEffect, useSyncExternalStore } from 'react';
import { base44 } from '@/lib/base44';
import { queryClient } from '@/lib/queryClient';

// Chiave evento nel DB → chiave canonica salvata in AppSettings
const VENUE_ALIASES = {
  'Ammare Frontemare': 'Frontemare',
  'Extra / Festivi': '__festivo__',
  'Extra - Festivi': '__festivo__',
};

const QUERY_KEY = ['all-app-settings'];
// Mai stale: una volta caricati, i loghi non vengono mai rifetchati in sessione → niente flash quando
// le card/serate si rimontano. gcTime infinito: senza osservatori react-query butterebbe via i dati.
const OPTIONS = {
  queryKey: QUERY_KEY,
  queryFn: () => base44.entities.AppSettings.list(),
  staleTime: Infinity,
  gcTime: Infinity,
};

function buildResult(settings) {
  const logoMap = {};
  (settings || []).forEach(s => {
    if (s.key?.startsWith('venue_logo_') && !s.key?.startsWith('venue_logo_zoom_')) {
      const venueKey = s.key.replace('venue_logo_', '');
      logoMap[venueKey] = s.value || '';
    }
  });
  const getVenueLogo = (venueKey) => {
    const resolvedKey = VENUE_ALIASES[venueKey] || venueKey;
    return { logoUrl: logoMap[resolvedKey] || '', zoom: 1 };
  };
  return { logoMap, getVenueLogo };
}

let lastSettings = undefined;
let lastResult = buildResult([]);
function getSnapshot() {
  const settings = queryClient.getQueryData(QUERY_KEY);
  if (settings !== lastSettings) {
    lastSettings = settings;
    lastResult = buildResult(settings);
  }
  return lastResult;
}

const listeners = new Set();
let unsubscribeCache = null;
function subscribe(listener) {
  listeners.add(listener);
  if (!unsubscribeCache) {
    unsubscribeCache = queryClient.getQueryCache().subscribe((event) => {
      if (event.query?.queryKey?.[0] === QUERY_KEY[0]) listeners.forEach(fn => fn());
    });
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && unsubscribeCache) { unsubscribeCache(); unsubscribeCache = null; }
  };
}

let requested = false;
function ensureLoaded() {
  // una volta per sessione (poi la cache è "mai stale"); se la cache è vuota (gc, logout) riparte
  if (requested && queryClient.getQueryData(QUERY_KEY) !== undefined) return;
  requested = true;
  queryClient.prefetchQuery(OPTIONS).catch(() => { requested = false; });
}

export function useAllVenueLogos() {
  const result = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(() => { ensureLoaded(); }, []);
  return result;
}
