// Port di src/pages/IlMioVibra.jsx (convertito da scripts/port/codemod.mjs).
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useSearchParams } from '@/web/router';
import PageTitle from '@/web/components/shared/PageTitle';
import { base44 } from '@/lib/base44';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Euro, CalendarDays, TrendingUp, Handshake, Calculator, NotebookPen, Users, Lock, Swords, Trophy, Megaphone } from '@/ui/icons.generated';
import { Button } from '@/ui/button';
import { useRoleAccess } from '@/lib/useRoleAccess';
import { useStickySentinel } from '@/web/hooks/useStickySentinel';
import { useStickyTabScroll } from '@/web/hooks/useStickyTabScroll';
import { stickyGlassStyle } from '@/legacy/utils/stickyGlass';
import { useStickyTabFlash } from '@/web/hooks/useStickyTabFlash';
import { useSetStickyHeader } from '@/web/lib/stickyHeaderContext';
import { makeTapHandlers } from '@/web/lib/tapHandlers';
import { useAuth } from '@/lib/auth';
import { useViewAsPromoter } from '@/lib/viewAs';
import { prefetchAchievementsData, prefetchTeamData } from '@/web/lib/prefetchCoreData';
import MieiProgressi from '@/web/components/ilmiovibra/MieiProgressi';
const MieiGuadagniSerate = React.lazy(() => import('@/web/components/ilmiovibra/MieiGuadagniSerate'));
const GuadagniDettagliatiNuovo = React.lazy(() => import('@/web/components/ilmiovibra/GuadagniDettagliatiNuovo'));
const IlMioTeam = React.lazy(() => import('@/web/components/ilmiovibra/IlMioTeam'));
const MieNote = React.lazy(() => import('@/web/components/ilmiovibra/MieNote'));
const VibraVS = React.lazy(() => import('@/web/components/ilmiovibra/VibraVS'));
const AchievementsTab = React.lazy(() => import('@/web/components/ilmiovibra/AchievementsTab'));
// Preload idle: dopo il primo render della pagina, scarica in background i
// chunk dei tab non ancora visitati. L'utente non vede lag al primo cambio tab.
const _ilmiovibraPreload = () => {
  Promise.all([
    import('@/web/components/ilmiovibra/MieiGuadagniSerate'),
    import('@/web/components/ilmiovibra/GuadagniDettagliatiNuovo'),
    import('@/web/components/ilmiovibra/IlMioTeam'),
    import('@/web/components/ilmiovibra/MieNote'),
    import('@/web/components/ilmiovibra/VibraVS'),
    import('@/web/components/ilmiovibra/AchievementsTab'),
  ]).catch(() => {});
};
import { useCalcolatrice } from '@/web/lib/calcolatriceContext';
import CachedImage from '@/web/components/shared/CachedImage';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, H, P, Span } from '@/ui/html';

const TABS = [
  { key: 'guadagni', label: 'I Miei Guadagni', icon: Euro },
  { key: 'guadagni-dettagli', label: 'Guadagni Dettagliati', icon: TrendingUp },
  { key: 'serate', label: 'Le Mie Serate', icon: CalendarDays },
  { key: 'progressi', label: 'I Miei Progressi', icon: TrendingUp },
  { key: 'accordi', label: 'Il Mio Team', icon: Users },
  { key: 'note', label: 'Le Mie Note', icon: NotebookPen },
  { key: 'achievements', label: 'Achievement', icon: Trophy },
  { key: 'vibravs', label: 'Vibra VS', icon: Swords },
];

export default function IlMioVibra() {
  const { canAccessIlMioVibra } = useRoleAccess();
  const { user } = useAuth();
  const { effectivePromoterId } = useViewAsPromoter();

  // Carica tutti i settings. Niente refetchInterval: il polling ogni 60s
  // causava traffico continuo su mobile. staleTime 5min (default globale) basta.
  const { data: allSettings = [] } = useQuery({
    queryKey: ['all-app-settings'],
    queryFn: () => base44.entities.AppSettings.list(),
    staleTime: 5 * 60000,
  });
  const globalAnnouncement = allSettings.find(s => s.key === 'global_announcement')?.value || '';
  const prAnnouncement = effectivePromoterId
    ? allSettings.find(s => s.key === `announcement_pr_${effectivePromoterId}`)?.value || ''
    : '';
  const { open: showCalcoli, toggle: toggleCalcoli } = useCalcolatrice();
  const tabsScrollRef = useRef(null);
  const scrollRef = useRef(null);
  const activeButtonRef = useRef(null);
  const lastTabTouchRef = useRef(0);
  const [sentinelRef, stuck] = useStickySentinel();
  useStickyTabFlash(tabsScrollRef);
  const setStuckHeader = useSetStickyHeader();
  useEffect(() => { setStuckHeader(stuck); }, [stuck, setStuckHeader]);
  useEffect(() => () => setStuckHeader(false), [setStuckHeader]);

  // Preload idle dei chunk dei tab non ancora visitati: parte dopo il primo
  // paint, in background, senza bloccare il render. Al primo cambio tab il
  // chunk è già in cache → zero skeleton/flash.
  useEffect(() => {
    const ric = webWindow.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
    const tid = ric(_ilmiovibraPreload);
    return () => { if (webWindow.cancelIdleCallback) webWindow.cancelIdleCallback(tid); else clearTimeout(tid); };
  }, []);

  // NB: i DATI del tab Achievement (clienti/presenze di tutta la tabella) NON si
  // precaricano a idle: sono scansioni complete e si pagherebbero anche senza mai
  // aprire il tab (rischio 429). Il prefetch parte solo al pointerdown sul tab.

  // Logica standardizzata di scroll al cambio tab (vedi useStickyTabScroll).
  const { scrollToTab } = useStickyTabScroll(stuck, tabsScrollRef);

  // Sincronizza tab con query string (?tab=...) per sidebar
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'progressi';
  const highlightAchievement = searchParams.get('achievement');
  const scrollTrigger = location.search;

  const setActiveTab = (key) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', key);
    next.delete('achievement');
    setSearchParams(next);
    scrollToTab();
  };





  // Centra il tab attivo nella barra di navigazione
  const scrollToActiveTab = useCallback(() => {
    if (scrollRef.current && activeButtonRef.current) {
      const container = scrollRef.current;
      const btn = activeButtonRef.current;
      const containerWidth = container.offsetWidth;
      const btnLeft = btn.offsetLeft;
      const btnWidth = btn.offsetWidth;
      container.scrollTo({ left: btnLeft - containerWidth / 2 + btnWidth / 2, behavior: 'smooth' });
    }
  }, [activeTab]);

  useEffect(() => {
    const t = setTimeout(scrollToActiveTab, 0);
    return () => clearTimeout(t);
  }, [activeTab]);

  // Ri-centra anche quando user viene caricato — usa 100ms per dare tempo al layout mobile
  useEffect(() => {
    if (user) {
      const t = setTimeout(scrollToActiveTab, 100);
      return () => clearTimeout(t);
    }
  }, [user]);



  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    enabled: !!user,
    staleTime: 2 * 60000,
    gcTime: 25 * 60000,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  // Trova il promoter corrispondente al promoter_id effettivo (proprio o "visualizza come")
  const myPromoter = effectivePromoterId ? promoters.find(p => p.id === effectivePromoterId) || null : null;

  // ── Prefetch dati dei tab "pesanti" ──
  // achievements, attendances, events, venue-logos-all sono già precaricati da
  // prefetchCriticalData/prefetchDeferredData (AppLayout): non duplicarli.
  // Qui precarichiamo solo i dataset UNICI di Il Mio Vibra non coperti dal prefetch
  // globale, e deferiamo la query pesante (2000 clienti) a idle per non competere
  // con il caricamento della prima schermata.
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!user) return;
    // Dataset leggeri: prefetch immediato
    queryClient.prefetchQuery({
      queryKey: ['venues'],
      queryFn: () => base44.entities.Venue.list('sort_order'),
      staleTime: 10 * 60000,
    });
    // The achievements component loads its own data when activated.
  }, [user?.id, queryClient]);

  if (!canAccessIlMioVibra()) {
    return (
      <Div className="min-h-screen flex items-center justify-center p-4">
        <Div className="rounded-xl bg-card border border-border p-8 text-center space-y-4 max-w-md">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
          <H className="text-xl font-bold">Accesso Limitato</H>
          <P className="text-sm text-muted-foreground">
            Il tuo ruolo non è sufficiente per accedere a questa sezione.
          </P>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="space-y-5 pb-8">
      <PageTitle title="Il Mio Vibra" />

      {/* Avvisi globali e specifici */}
      {globalAnnouncement && (
        <Div className="dash-fade-up flex items-start gap-2.5 rounded-xl bg-amber-900/20 border border-amber-700/30 px-4 py-3"
          style={{ boxShadow: '0 0 20px rgba(217,119,6,0.10)' }}>
          <Megaphone className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <P className="text-sm text-amber-200">{globalAnnouncement}</P>
        </Div>
      )}
      {prAnnouncement && effectivePromoterId && (
        <Div className="dash-fade-up flex items-start gap-2.5 rounded-xl bg-blue-900/20 border border-blue-700/30 px-4 py-3"
          style={{ boxShadow: '0 0 20px rgba(59,130,246,0.10)' }}>
          <Megaphone className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
          <P className="text-sm text-blue-200">{prAnnouncement}</P>
        </Div>
      )}

      {/* Tabs sticky — figlio diretto della pagina, così resta fisso durante tutto lo scroll */}
      <Div
        ref={sentinelRef}
        style={{ height: 1, marginTop: 0, padding: 0, border: 'none' }} />
      <Div
        ref={tabsScrollRef}
        className={`dash-fade-up group sticky top-[env(safe-area-inset-top)] z-20 overflow-hidden pt-4 pb-1.5 -mx-4 px-4 border-b ${stuck ? 'border-border is-stuck' : 'border-transparent'}`}
        style={{ marginTop: 0 }}
      >
        <Div className="sticky-glass absolute inset-0" style={stickyGlassStyle(stuck)} />
        <Div ref={scrollRef} className="relative overflow-x-auto overflow-y-hidden" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x', overscrollBehaviorX: 'contain' }}>
        <Div className={`relative flex gap-1 bg-secondary/30 p-1 rounded-xl w-max min-w-full`}>
          {TABS.map(({ key, label, icon: TabIcon }) => (
            <Btn
              button
              key={key}
              ref={activeTab === key ? activeButtonRef : null}
              {...makeTapHandlers(lastTabTouchRef, () => setActiveTab(key))}
              onPointerDown={key === 'achievements' || key === 'vibravs' ? () => prefetchAchievementsData(effectivePromoterId) : key === 'accordi' ? () => prefetchTeamData(effectivePromoterId) : undefined}
              className={`cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}>
              <TabIcon className="w-3.5 h-3.5 flex-shrink-0" />
              {label}
            </Btn>
          ))}
        </Div>
        </Div>
      </Div>

      <Div
        className="dash-fade-up flex flex-wrap items-center justify-between gap-2"
      >
        {/* Header utente (a sinistra) */}
        {user && (
          <Div className="flex items-center gap-3">
            {myPromoter && (
              <Div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5"
                style={{ boxShadow: '0 0 12px rgba(167,139,250,0.08)' }}>
                <Div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                  {myPromoter.photo_url
                    ? <CachedImage src={myPromoter.photo_url} alt={myPromoter.name} className="w-full h-full object-cover" />
                    : myPromoter.name?.charAt(0)?.toUpperCase()
                  }
                </Div>
                <Span className="text-sm font-semibold text-primary">{myPromoter.name}</Span>
              </Div>
            )}
          </Div>
        )}

        {/* Bottone calcolatrice (a destra) */}
        <Button variant="outline" size="sm" onClick={toggleCalcoli} className="flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          Calcolatrice
        </Button>
      </Div>

      {/* Loading */}
      {!user && (
        <Div className="flex items-center justify-center h-32">
          <Div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </Div>
      )}

      {/* Contenuto tab */}
      {!myPromoter && user && (
        <Div
          className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-8 text-center space-y-3"
          style={{ boxShadow: '0 4px 32px -8px rgba(167,139,250,0.06)' }}
        >
          <Euro className="w-8 h-8 text-muted-foreground mx-auto" />
          <P className="font-semibold">Profilo promoter non trovato</P>
          <P className="text-sm text-muted-foreground max-w-sm mx-auto">Nessun promoter associato al tuo profilo.</P>
        </Div>
      )}

      {myPromoter && (
        <React.Suspense fallback={<Div className="h-64 flex items-center justify-center"><Span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" accessibilityLabel="Caricamento sezione" /></Div>}>
          {activeTab === 'guadagni' && (
            <Div className="dash-fade-up">
              <MieiGuadagniSerate promoterId={myPromoter.id} tab="guadagni" isFounder={true} userRole={user?.role} />
            </Div>
          )}

          {activeTab === 'guadagni-dettagli' && (
            <Div className="dash-fade-up">
              <GuadagniDettagliatiNuovo promoter={myPromoter} />
            </Div>
          )}

          {activeTab === 'serate' && (
            <Div className="dash-fade-up">
              <MieiGuadagniSerate promoterId={myPromoter.id} tab="serate" isFounder={true} />
            </Div>
          )}

          {activeTab === 'progressi' && (
            <Div className="dash-fade-up">
              <MieiProgressi user={user} promoter={myPromoter} promoters={promoters} isActive={activeTab === 'progressi'} />
            </Div>
          )}

          {activeTab === 'accordi' && (
            <Div className="dash-fade-up">
              <IlMioTeam promoter={myPromoter} isActive={activeTab === 'accordi'} />
            </Div>
          )}

          {activeTab === 'note' && (
            <Div className="dash-fade-up min-h-[calc(100dvh-7.5rem)]">
              <MieNote user={user} promoter={myPromoter} />
            </Div>
          )}

          {activeTab === 'achievements' && (
            <Div className="tab-fade-in">
              <AchievementsTab promoter={myPromoter} isActive={true} isVisible={true} promoters={promoters} highlightId={highlightAchievement} scrollTrigger={scrollTrigger} />
            </Div>
          )}

          {activeTab === 'vibravs' && (
            <Div className="dash-fade-up">
              <VibraVS myPromoter={myPromoter} />
            </Div>
          )}
        </React.Suspense>
      )}
    </Div>
  );
}