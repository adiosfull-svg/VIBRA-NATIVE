// Port di src/lib/heavyComponentsPreload.js (convertito da scripts/port/codemod.mjs).
import { win as webWindow } from '@/web/shims/dom';
// Pre-caricamento a schermo libero dei moduli pesanti usati nei tab e nei
// overlay annidati (grafici Recharts, mappe Leaflet, export html2canvas,
// grafici uplot, overlay VibraSearch). Questi chunk si caricano al primo
// mount del componente che li usa; precaricarli a idle elimina il lag del
// primo render e il flash dello skeleton.

let started = false;

export function preloadHeavyComponents() {
  if (started) return;
  started = true;

  const run = () => {
    // Recharts — grafici dashboard, promoter, report, eventi
    import('@/ui/recharts').catch(() => {});
    // Leaflet — mappe clienti, promoter, copertura Napoli
    import('react-leaflet').catch(() => {});
    import('leaflet.markercluster').catch(() => {});
    // uplot — grafici performance promoter (leggeri, touch-zoom)
    import('uplot').catch(() => {});
    // html2canvas e jspdf rimossi dal preload globale: sono ~300KB combinati
    // caricati su ogni pagina ma usati solo per share card (ClientSerateMenu)
    // e export PDF (ReportBuilder), entrambe azioni utente. I componenti li
    // lazy-importano già on-demand al trigger. Precaricarli a idle sprecava
    // banda su pagine che non li usano mai (es. Weekend).
    // react-markdown — render output AI (RicercaAI, VibraGPT)
    import('react-markdown').catch(() => {});
    // @hello-pangea/dnd — drag&drop note, promoter
    import('@hello-pangea/dnd').catch(() => {});
    // Shell di VibraSearch: resa lazy in AppLayout, precarichiamola a idle
    // così al primo Cmd/Ctrl+K o "F" il chunk è già in cache (zero lag).
    import('@/web/components/shared/VibraSearch').catch(() => {});
    // Overlay annidati di VibraSearch: precaricati a idle (non solo
    // all'apertura della ricerca) così il primo tap su un cliente non
    // attende lo scaricamento del chunk ClientDetailDialog.
    import('@/web/components/client/ClientDetailDialog').catch(() => {});
    import('@/web/components/client/LeadersList').catch(() => {});
    import('@/web/components/ilmiovibra/PiantinaFullscreen').catch(() => {});
    import('@/web/components/event/EventPromoterChart').catch(() => {});
    // Componenti pesanti usati dentro pagine lazy: precaricarli a idle
    // elimina il lag al primo mount del tab/overlay.
    import('@/web/components/ai/AIResultRenderer').catch(() => {});
    import('@/web/components/ai/ChatStrategica').catch(() => {});
    import('@/web/components/report/ReportBuilder').catch(() => {});
    import('@/web/components/client/ClientFamilyTree').catch(() => {});
  };

  if ('requestIdleCallback' in window) {
    webWindow.requestIdleCallback(run, { timeout: 4000 });
  } else {
    setTimeout(run, 1200);
  }
}