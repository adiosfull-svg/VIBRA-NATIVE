// Port di src/lib/prefetchCoreData.js (convertito da scripts/port/codemod.mjs).
import { queryClientInstance } from '@/web/lib/query-client';
import { base44 } from '@/lib/base44';
import { fetchAll, fetchTeamAttendances, teamAttendancesKey } from '@/web/lib/safeData';
import { STALE_FULL_TABLE, GC_FULL_TABLE } from '@/web/lib/query-client';
import { fetchProgrammazionePlan } from '@/web/hooks/useProgrammazionePlan';
import { preloadHeavyComponents } from '@/web/lib/heavyComponentsPreload';


import { win as webWindow } from '@/web/shims/dom';


// Precarica in background i dataset più pesanti e condivisi tra le pagine
// (Dashboard, Clienti, Promoter...) così quando l'utente naviga la cache
// è già calda e le pagine si aprono istantaneamente.

let deferredPrefetched = false;

// Sfalsamento 80ms: bilancia avvio veloce e picco di concorrenza contenuto
// per evitare 429 rate-limit quando il prefetch si somma alle query della
// pagina. 12 query × 80ms = ~960ms totali.
function runParallel(tasks, stagger = 80) {
  return Promise.allSettled(tasks.map((task, i) =>
    new Promise(resolve => setTimeout(resolve, i * stagger)).then(() => task().catch(() => {}))
  ));
}

// Dati critici per la prima schermata (Dashboard / Il Mio Vibra).
// Devono essere pronti SUBITO, non a idle: la homepage li usa al mount.
export function prefetchCriticalData(user, promoterId, pathname = webWindow.location.pathname) {
  if (!user) return;
  const prefetch = (queryKey, queryFn) => queryClientInstance.prefetchQuery({ queryKey, queryFn });
  const dashboard = pathname === '/dashboard' || (pathname === '/' && ['admin', 'super4'].includes(user.role));
  const personal = pathname === '/il-mio-vibra' || (pathname === '/' && !dashboard);
  const clients = pathname === '/clienti';
  const weekend = pathname === '/programmazione';
  const semine = pathname === '/semine';
  const tasks = [
    () => prefetch(['all-app-settings'], () => base44.entities.AppSettings.list()),
  ];
  // Su Il Mio Vibra, fatturato / serate fatturate / tavoli di "I miei progressi" dipendono da
  // promoters + events + attendances. Li facciamo partire PER PRIMI e INSIEME (stesse queryKey,
  // stesse queryFn: cambia solo l'ordine di partenza). Prima erano in coda dopo settings e
  // achievements con 80ms di stagger l'uno: le presenze (la richiesta più pesante) partivano per
  // ultime e all'apertura del tab i totali comparivano con un attimo di ritardo.
  // Stessa logica sulla Dashboard: classifica = promoters + events + attendances-all.
  const urgent = (fn) => { if (personal || dashboard) fn.urgent = true; return fn; };
  if (dashboard || personal || clients || weekend) {
    tasks.push(urgent(() => prefetch(['promoters'], () => base44.entities.Promoter.list())));
    tasks.push(urgent(() => prefetch(['events'], () => base44.entities.Event.list('-date', 5000))));
  }
  if (personal) {
    // Il tab "I miei progressi" (default di Il Mio Vibra) calcola rank e Record Card dalle achievements:
    // prima venivano precaricate solo a idle, quindi aprendo subito il tab arrivavano dopo e la card
    // compariva/si ricalcolava in ritardo. Stessa queryFn e staleTime del prefetch deferito.
    tasks.push(() => queryClientInstance.prefetchQuery({
      queryKey: ['achievements'],
      queryFn: () => base44.entities.Achievement.filter({ is_active: true }),
      staleTime: 10 * 60000,
    }));
  }
  if (dashboard) tasks.push(() => prefetch(['clients-dashboard-by-rating'], () => base44.entities.Client.list('-cum_rating', 50)));
  if (dashboard) {
    // La Classifica (tab "Di sempre") somma le presenze di TUTTI i promoter: la Dashboard le scarica
    // da ['attendances-all'], ma prima partivano solo al mount della pagina (classifica vuota fino
    // all'arrivo). Stessa queryKey, stessa queryFn e stessi staleTime/gcTime della Dashboard.
    tasks.push(urgent(() => queryClientInstance.prefetchQuery({
      queryKey: ['attendances-all'],
      queryFn: () => fetchAll(base44.entities.EventAttendance, {}, { sort: '-created_date' }),
      staleTime: STALE_FULL_TABLE,
      gcTime: GC_FULL_TABLE,
    })));
  }
  if (promoterId && (personal || clients || weekend)) {
    tasks.push(urgent(() => prefetch(['attendances', promoterId], () => base44.entities.EventAttendance.filter({ promoter_id: promoterId }, '-created_date', 5000))));
  }
  if (promoterId && (clients || weekend)) {
    tasks.push(() => prefetch(['clients', promoterId], () => base44.entities.Client.filter({ promoter_id: promoterId })));
  }
  if (promoterId && (weekend || semine)) {
    tasks.push(() => prefetch(['semine', promoterId], () => base44.entities.Semina.filter({ promoter_id: promoterId })));
  }
  if (promoterId && weekend) {
    tasks.push(() => prefetch(['programmazione-plan', promoterId], () => fetchProgrammazionePlan(promoterId)));
    // Prefetch AI analysis: la fetch getMyAIAnalysis impiega ~2s e blocca il
    // LCP (sezione "Analisi Intelligente"). Precaricarla qui la avvia prima
    // che il componente monti, così al render la cache è già calda.
    tasks.push(() => prefetch(['aiSuggestion', promoterId], async () => {
      const res = await base44.functions.invoke('getMyAIAnalysis', { promoter_id: promoterId });
      return res?.data?.records || [];
    }));
  }
  // Solo su Il Mio Vibra: i dati urgenti partono tutti insieme, il resto in coda come prima.
  const first = tasks.filter(t => t.urgent);
  if (first.length > 0) {
    return Promise.allSettled([
      runParallel(first, 0),
      runParallel(tasks.filter(t => !t.urgent)),
    ]);
  }
  return runParallel(tasks);
}

// Dati deferiti: non servono alla prima schermata, precaricali a idle
// per scaldare la cache prima che l'utente navighi nelle sezioni secondarie.
export function prefetchDeferredData() {
  if (deferredPrefetched) return;
  deferredPrefetched = true;

  runParallel([
    () => queryClientInstance.prefetchQuery({
      queryKey: ['seasonDividers'],
      queryFn: () => base44.entities.SeasonDivider.list(),
    }),
    () => queryClientInstance.prefetchQuery({
      queryKey: ['achievements'],
      // STESSO queryFn di AchievementsTab/RankCard/MieiProgressi (solo attivi):
      // con list() la cache veniva popolata anche con gli achievement inattivi,
      // falsando PR points, soglie dinamiche e rank finché non scadeva lo staleTime.
      queryFn: () => base44.entities.Achievement.filter({ is_active: true }),
      staleTime: 10 * 60000,
    }),
    () => queryClientInstance.prefetchQuery({
      queryKey: ['promoter-achievements'],
      queryFn: () => base44.entities.PromoterAchievement.list(),
    }),
    () => queryClientInstance.prefetchQuery({
      queryKey: ['promoter-ranks'],
      queryFn: () => base44.entities.PromoterRank.list(),
    }),
    // Rotte secondarie: scaldiamo la cache prima che l'utente ci navighi
    () => queryClientInstance.prefetchQuery({
      queryKey: ['venues'],
      queryFn: () => base44.entities.Venue.list(),
    }),
    () => queryClientInstance.prefetchQuery({
      queryKey: ['download-items'],
      queryFn: () => base44.entities.DownloadItem.list(),
    }),
    () => queryClientInstance.prefetchQuery({
      queryKey: ['audit-logs'],
      queryFn: () => base44.entities.AuditLog.list('-timestamp', 200),
    }),
    () => queryClientInstance.prefetchQuery({
      queryKey: ['credit-usage'],
      queryFn: () => base44.entities.CreditUsageLog.list('-created_date', 200),
    }),

  ], 200);

  // Pre-carica i chunk pesanti (Recharts, Leaflet, html2canvas, overlay
  // VibraSearch) a schermo libero, così il primo render non attende lo
  // scaricamento dei moduli.
  preloadHeavyComponents();
}

// Compatibilità: chiama entrambi (critico subito, deferito a idle).
export function prefetchCoreData() {
  prefetchCriticalData();
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => prefetchDeferredData(), { timeout: 3000 });
  } else {
    setTimeout(prefetchDeferredData, 1000);
  }
}

// Precarica TUTTO ciò che serve al calcolo del rank nel tab Achievement
// (stesse queryKey / queryFn / staleTime dei componenti AchievementsTab e RankCard).
// Se la cache è già fresca, prefetchQuery non rifà la richiesta.
// Chiamata da Il Mio Vibra a idle e al primo tocco sul tab, così quando il tab
// si apre i dati ci sono già e il rank è corretto al primo frame.
export function prefetchAchievementsData(promoterId) {
  const pf = (queryKey, queryFn, staleTime) =>
    queryClientInstance.prefetchQuery({ queryKey, queryFn, staleTime });

  const tasks = [
    () => pf(['achievements'], () => base44.entities.Achievement.filter({ is_active: true }), 10 * 60000),
    () => pf(['events'], () => base44.entities.Event.list('-date', 5000), 5 * 60000),
    () => pf(['clients-all'], () => fetchAll(base44.entities.Client, {}, { sort: '-created_date' }), STALE_FULL_TABLE),
    () => pf(['attendances-all'], () => fetchAll(base44.entities.EventAttendance, {}, { sort: '-created_date' }), STALE_FULL_TABLE),
  ];
  if (promoterId) {
    tasks.push(() => pf(['promoter-rank', promoterId], () => base44.entities.PromoterRank.filter({ promoter_id: promoterId }), Infinity));
    tasks.push(() => pf(['promoter-rank-history', promoterId], () => base44.entities.PromoterRank.filter({ promoter_id: promoterId }), Infinity));
  }
  return runParallel(tasks, 60);
}

// Precarica ciò che serve al tab "Il Mio Team": promoter, eventi e le presenze dei membri del team
// (una richiesta per membro, in parallelo, riusando le cache ['attendances', id]). Stesse chiavi e
// staleTime di IlMioTeam: all'apertura del tab i dati sono già pronti. Chiamata al primo tocco sul tab.
export async function prefetchTeamData(promoterId) {
  if (!promoterId) return;
  try {
    const promoters = await queryClientInstance.ensureQueryData({
      queryKey: ['promoters'], queryFn: () => base44.entities.Promoter.list(), staleTime: 15 * 60000,
    });
    queryClientInstance.prefetchQuery({
      queryKey: ['events'], queryFn: () => base44.entities.Event.list('-date', 5000), staleTime: 15 * 60000,
    });
    const ids = [
      promoterId,
      ...promoters.filter(p => p.referente_id === promoterId && p.id !== promoterId && p.ruolo !== 'ragazza_immagine').map(p => p.id),
    ];
    await queryClientInstance.prefetchQuery({
      queryKey: teamAttendancesKey(ids),
      queryFn: () => fetchTeamAttendances(queryClientInstance, base44.entities.EventAttendance, ids),
      staleTime: 15 * 60000,
    });
  } catch { /* il tab scarica da solo ciò che manca */ }
}