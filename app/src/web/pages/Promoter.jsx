// Port di src/pages/Promoter.jsx (convertito da scripts/port/codemod.mjs).
import PageWindowList from '@/web/components/shared/PageWindowList';
import { STALE_FULL_TABLE, GC_FULL_TABLE } from '@/web/lib/query-client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePullToRefresh } from '@/web/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/web/components/shared/PullToRefreshIndicator';
import PageTitle from '@/web/components/shared/PageTitle';
import { base44 } from '@/lib/base44';
import { fetchAll } from '@/web/lib/safeData';
import { Button } from '@/ui/button';
import { Plus, UserCheck, ArrowUpAZ, Clock, Move, Check, X, Sparkles, MapPin, Users, BarChart3, TrendingUp, UserX, FileText, Target } from '@/ui/icons.generated';
import EmptyState from '@/web/components/shared/EmptyState';
import PromoterFormDialog from '@/web/components/promoter/PromoterFormDialog';
import PromoterCard from '@/web/components/promoter/PromoterCard';
import { useMountedOnce } from '@/web/hooks/useMountedOnce';
import PromoterCardMobile from '@/web/components/promoter/PromoterCardMobile';
import { useIsMobile } from '@/web/hooks/use-mobile';
import { stickyGlassStyle } from '@/legacy/utils/stickyGlass';
import { useStickyTabFlash } from '@/web/hooks/useStickyTabFlash';
import { DragDropContext, Droppable, Draggable } from '@/web/shims/dnd';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/menu';
import PromoterCompareCharts from '@/web/components/promoter/PromoterCompareCharts';
import PromoterGrowthLeague from '@/web/components/promoter/PromoterGrowthLeague';
import ExPrTab from '@/web/components/promoter/ExPrTab';
import NapoliCoverageMap from '@/web/components/promoter/NapoliCoverageMap';
import ReportisticaMensile from '@/web/components/promoter/ReportisticaMensile';
import PromoterGoalsDialog from '@/web/components/promoter/PromoterGoalsDialog';
import ObiettiviTab from '@/web/components/promoter/ObiettiviTab';
import { useRoleAccess } from '@/lib/useRoleAccess';
import { useStickySentinel } from '@/web/hooks/useStickySentinel';
import { useStickyTabScroll } from '@/web/hooks/useStickyTabScroll';
import { useSetStickyHeader } from '@/web/lib/stickyHeaderContext';
import { makeTapHandlers } from '@/web/lib/tapHandlers';
import SortPills from '@/web/components/shared/SortPills';
import { useBackTab } from '@/web/hooks/useBackTab';

import { storage as webStorage, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, Span } from '@/ui/html';

const keyOfPromoter = (p) => p.id;
// PORT: default stabili (un `= []` nuovo a ogni render invalidava il memo delle card durante il caricamento)
const EMPTY = [];

const SORT_MODES = [
  { key: 'added', label: 'Ordine aggiunta', Icon: Clock },
  { key: 'alpha', label: 'Alfabetico', Icon: ArrowUpAZ },
  { key: 'manual', label: 'Spostamento libero', Icon: Move },
];

const STORAGE_KEY = 'promoter_manual_order';

export default function Promoter() {
  const { user, isAdmin, isSuper4 } = useRoleAccess();
  const isMobile = useIsMobile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [goalsPromoter, setGoalsPromoter] = useState(null);
  // PORT: dialog montati alla prima apertura
  const formMounted = useMountedOnce(dialogOpen);
  const goalsMounted = useMountedOnce(!!goalsPromoter);
  const [sortMode, setSortMode] = useState('manual');
  const [manualOrder, setManualOrder] = useState(() => {
    try { return JSON.parse(webStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  });
  const [pendingOrder, setPendingOrder] = useState(null); // ordine in attesa di conferma
  const qc = useQueryClient();
  const tabsRef = useRef(null);
  const scrollRef = useRef(null);
  const lastTabTouchRef = useRef(0);
  const [sentinelRef, stuck] = useStickySentinel();
  useStickyTabFlash(tabsRef);
  const [activeTab, setActiveTab] = useState(() => {
    const tab = new URLSearchParams(webWindow.location.search).get('tab');
    return ['team', 'compare', 'growth', 'expr', 'report', 'obiettivi', 'mappa'].includes(tab) ? tab : 'team';
  });

  // Centra il tab attivo nella barra di navigazione (come Il Mio Vibra)
  const scrollToActiveTab = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const active = container.querySelector('[data-state="active"]');
    if (!active) return;
    const containerWidth = container.offsetWidth;
    const btnLeft = active.offsetLeft;
    const btnWidth = active.offsetWidth;
    container.scrollTo({ left: btnLeft - containerWidth / 2 + btnWidth / 2, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const t = setTimeout(scrollToActiveTab, 0);
    return () => clearTimeout(t);
  }, [activeTab, scrollToActiveTab]);

  useEffect(() => {
    const t = setTimeout(scrollToActiveTab, 100);
    return () => clearTimeout(t);
  }, [scrollToActiveTab]);

  // Sincronizza lo stato "stuck" della sticky bar con il contesto app
  // per nascondere burger/notifiche sull'header mobile quando la sticky è attiva
  const setStuckHeader = useSetStickyHeader();
  useEffect(() => { setStuckHeader(stuck); }, [stuck, setStuckHeader]);
  useEffect(() => () => setStuckHeader(false), [setStuckHeader]);

  // Logica standardizzata di scroll al cambio tab (vedi useStickyTabScroll).
  const { scrollToTab } = useStickyTabScroll(stuck, tabsRef);

  const handleTabChange = (v) => {
    setActiveTab(v);
    scrollToTab();
  };

  // Tasto back: torna al tab precedente
  useBackTab(activeTab, setActiveTab, 'team');

  const { data: promoters = EMPTY } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 30 * 60000,
    gcTime: 45 * 60000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0,
  });

  const { data: attendances = EMPTY } = useQuery({
    queryKey: ['attendances-all'], staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE,
    queryFn: () => fetchAll(base44.entities.EventAttendance, {}, { sort: '-created_date' }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0,
  });

  const { data: events = EMPTY } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    staleTime: 30 * 60000,
    gcTime: 45 * 60000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0,
  });

  // mappa degli eventi una volta per tutte le card (PromoterCardMobile)
  const eventsMap = useMemo(() => new Map(events.map(e => [e.id, e])), [events]);
  // PORT: presenze per promoter (stesso ordine dell'elenco completo: conta per i pareggi della deduplica):
  // ogni card mobile scorreva tutte le presenze
  const attsByPromoter = useMemo(() => {
    const m = new Map();
    for (const a of attendances) {
      let list = m.get(a.promoter_id);
      if (!list) { list = []; m.set(a.promoter_id, list); }
      list.push(a);
    }
    return m;
  }, [attendances]);

  const { data: clients = EMPTY } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
    staleTime: 30 * 60000,
    gcTime: 45 * 60000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0,
  });

  const { data: achievements = EMPTY } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.list(),
    staleTime: 30 * 60000,
    gcTime: 45 * 60000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0,
  });

  const { data: promoterAchievements = EMPTY } = useQuery({
    queryKey: ['promoter-achievements'],
    queryFn: () => base44.entities.PromoterAchievement.list(),
    staleTime: 30 * 60000,
    gcTime: 45 * 60000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0,
  });

  const { data: promoterRanks = EMPTY } = useQuery({
    queryKey: ['promoter-ranks'],
    queryFn: () => base44.entities.PromoterRank.list(),
    staleTime: 30 * 60000,
    gcTime: 45 * 60000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0,
  });

  const createMut = useMutation({
    mutationFn: d => base44.entities.Promoter.create(d),
    onMutate: async (newData) => {
      await qc.cancelQueries({ queryKey: ['promoters'] });
      const prev = qc.getQueryData(['promoters']);
      qc.setQueryData(['promoters'], old => [...(old || []), { ...newData, id: '__optimistic__' }]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => { qc.setQueryData(['promoters'], ctx.prev); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['promoters'] }); setDialogOpen(false); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Promoter.update(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ['promoters'] });
      const prev = qc.getQueryData(['promoters']);
      qc.setQueryData(['promoters'], old => (old || []).map(p => p.id === id ? { ...p, ...data } : p));
      return { prev };
    },
    onError: (_err, _vars, ctx) => { qc.setQueryData(['promoters'], ctx.prev); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['promoters'] }); setDialogOpen(false); setEditing(null); },
  });

  const updateFollowersMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Promoter.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['promoters'] }),
  });

  const handleUpdateFollowers = async (promoterId, data) => {
    await updateFollowersMut.mutateAsync({ id: promoterId, data });
  };

  const handleSave = (form) => {
    if (editing) updateMut.mutate({ id: editing.id, data: form });
    else createMut.mutate(form);
  };

  // Super4 può assegnare obiettivi solo ai propri referenti
  const canManageGoals = (promoter) => {
    if (isAdmin) return true;
    if (isSuper4 && user?.promoter_id) {
      return promoter.referente_id === user.promoter_id;
    }
    return false;
  };

  // Separa ragazze immagine dagli altri promoter
  const mainPromoters = promoters.filter(p => p.ruolo !== 'ragazza_immagine');
  const ragazzeImmagine = promoters.filter(p => p.ruolo === 'ragazza_immagine');

  // Separa promoter attivi da inattivi (solo tra i main, non ragazze immagine)
  const activePromoters = mainPromoters.filter(p => p.status !== 'inattivo');
  const inactivePromoters = mainPromoters.filter(p => p.status === 'inattivo');

  // Calcola lista ordinata (solo promoter attivi — gli inattivi vanno in sezione separata)
  const getSortedPromoters = () => {
    if (sortMode === 'alpha') return [...activePromoters].sort((a, b) => a.name.localeCompare(b.name));
    if (sortMode === 'manual') {
      const activeOrder = pendingOrder || manualOrder;
      const ordered = activeOrder.map(id => activePromoters.find(p => p.id === id)).filter(Boolean);
      const rest = activePromoters.filter(p => !activeOrder.includes(p.id));
      return [...ordered, ...rest];
    }
    return activePromoters;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const sorted = getSortedPromoters();
    const items = Array.from(sorted);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setPendingOrder(items.map(p => p.id));
  };

  const confirmOrder = () => {
    if (!pendingOrder) return;
    setManualOrder(pendingOrder);
    webStorage.setItem(STORAGE_KEY, JSON.stringify(pendingOrder));
    setPendingOrder(null);
  };

  const cancelPendingOrder = () => setPendingOrder(null);

  const sortedPromoters = getSortedPromoters();

  const handleRefresh = async () => {
    await qc.refetchQueries({ queryKey: ['promoters'] });
    await new Promise(r => setTimeout(r, 600));
    await qc.refetchQueries({ queryKey: ['attendances-all'] });
    await new Promise(r => setTimeout(r, 600));
    await qc.refetchQueries({ queryKey: ['events'] });
  };
  const { isRefreshing, pullProgress } = usePullToRefresh(handleRefresh);

  return (
    <Div className="space-y-5 pb-8">
      <PullToRefreshIndicator isRefreshing={isRefreshing} pullProgress={pullProgress} />
      <PageTitle title="Promoter" />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-5" style={{ marginTop: 0 }}>
        {/* Tab bar */}
        <Div
          ref={sentinelRef}
          style={{ height: 1, marginTop: 0, padding: 0, border: 'none' }} />
        <Div
          ref={tabsRef}
          className={`dash-fade-up group sticky top-[env(safe-area-inset-top)] z-20 overflow-hidden pt-4 pb-1.5 -mx-4 px-4 border-b ${stuck ? 'border-border is-stuck' : 'border-transparent'}`}
          style={{ marginTop: 0 }}
        >
          <Div className="sticky-glass absolute inset-0" style={stickyGlassStyle(stuck)} />
          <Div ref={scrollRef} className="relative overflow-x-auto overflow-y-hidden" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x', overscrollBehaviorX: 'contain' }}>
          <TabsList className={`relative flex justify-start gap-1 bg-secondary/30 p-1 rounded-xl w-max min-w-full h-auto`}>
            <TabsTrigger value="team" {...makeTapHandlers(lastTabTouchRef, () => handleTabChange('team'))} className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <Users className="w-3.5 h-3.5 flex-shrink-0" />Team
            </TabsTrigger>
            <TabsTrigger value="compare" {...makeTapHandlers(lastTabTouchRef, () => handleTabChange('compare'))} className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <BarChart3 className="w-3.5 h-3.5 flex-shrink-0" />Confronto
            </TabsTrigger>
            <TabsTrigger value="growth" {...makeTapHandlers(lastTabTouchRef, () => handleTabChange('growth'))} className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />Growth
            </TabsTrigger>
            <TabsTrigger value="expr" {...makeTapHandlers(lastTabTouchRef, () => handleTabChange('expr'))} className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <UserX className="w-3.5 h-3.5 flex-shrink-0" />Ex PR
            </TabsTrigger>
            <TabsTrigger value="report" {...makeTapHandlers(lastTabTouchRef, () => handleTabChange('report'))} className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />Report
            </TabsTrigger>
            <TabsTrigger value="obiettivi" {...makeTapHandlers(lastTabTouchRef, () => handleTabChange('obiettivi'))} className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <Target className="w-3.5 h-3.5 flex-shrink-0" />Obiettivi
            </TabsTrigger>
            <TabsTrigger value="mappa" {...makeTapHandlers(lastTabTouchRef, () => handleTabChange('mappa'))} className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />Mappa
            </TabsTrigger>
          </TabsList>
          </Div>
        </Div>

        {/* Wrapper contenuto — parte sotto la barra */}
        <Div
          className="dash-fade-up relative rounded-2xl border border-white/[0.06] bg-card"
          style={{ boxShadow: '0 4px 32px -8px rgba(167,139,250,0.08)' }}
        >
          {/* Accent line */}
          <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
            style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />

          <Div className="p-4">
            <TabsContent value="report">
              {/* PORT: contenuto costruito solo con la tab attiva (anche il JSX di una tab nascosta caricava i moduli, ~100 KB) */}
              {activeTab === 'report' && <>
              <Div className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/40 p-4">
                <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
                  style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
                <ReportisticaMensile
                  promoters={promoters}
                  attendances={attendances}
                  events={events}
                />
              </Div>
              </>}
            </TabsContent>

            <TabsContent value="obiettivi">
              {/* PORT: contenuto costruito solo con la tab attiva (anche il JSX di una tab nascosta caricava i moduli, ~100 KB) */}
              {activeTab === 'obiettivi' && <>
              <Div className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/40 p-4 min-h-[calc(100dvh-7.5rem)]">
                <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
                  style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
                <ObiettiviTab
                  promoters={promoters}
                  attendances={attendances}
                  events={events}
                  clients={clients}
                  achievements={achievements}
                  promoterAchievements={promoterAchievements}
                  promoterRanks={promoterRanks}
                />
              </Div>
              </>}
            </TabsContent>

            <TabsContent value="growth">
              {/* PORT: contenuto costruito solo con la tab attiva (anche il JSX di una tab nascosta caricava i moduli, ~100 KB) */}
              {activeTab === 'growth' && <>
              <Div className="dash-fade-up">
                <PromoterGrowthLeague
                  promoters={promoters}
                  attendances={attendances}
                  events={events}
                />
              </Div>
              </>}
            </TabsContent>

            <TabsContent value="compare">
              {/* PORT: contenuto costruito solo con la tab attiva (anche il JSX di una tab nascosta caricava i moduli, ~100 KB) */}
              {activeTab === 'compare' && <>
              <Div className="dash-fade-up">
                <PromoterCompareCharts
                  promoters={mainPromoters}
                  allAttendances={attendances}
                  events={events}
                />
              </Div>
              </>}
            </TabsContent>

            <TabsContent value="expr">
              {/* PORT: contenuto costruito solo con la tab attiva (anche il JSX di una tab nascosta caricava i moduli, ~100 KB) */}
              {activeTab === 'expr' && <>
              <Div className="dash-fade-up">
                <ExPrTab
                  attendances={attendances}
                  events={events}
                />
              </Div>
              </>}
            </TabsContent>

            <TabsContent value="mappa">
              {/* PORT: contenuto costruito solo con la tab attiva (anche il JSX di una tab nascosta caricava i moduli, ~100 KB) */}
              {activeTab === 'mappa' && <>
              <Div className="dash-fade-up min-h-[calc(100dvh-7.5rem)]">
                {promoters.length > 0 ? (
                  <Div className="relative overflow-hidden rounded-2xl border border-white/[0.06]"
                    style={{ boxShadow: '0 4px 32px -8px rgba(96,165,250,0.08)' }}>
                    <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-40"
                      style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }} />
                    <NapoliCoverageMap promoters={promoters} />
                  </Div>
                ) : (
                  <EmptyState
                    icon={MapPin}
                    title="Nessun promoter"
                    description="Aggiungi i membri del team per visualizzare la copertura territoriale."
                  />
                )}
              </Div>
              </>}
            </TabsContent>

            <TabsContent value="team">
              {/* Ordinamento */}
              {promoters.length > 0 && (
                <Div className="dash-fade-up mb-5 flex items-center gap-2">
                  <SortPills
                    label="Ordina:"
                    scrollable
                    className="flex-1 min-w-0 -mx-1 px-1"
                    options={SORT_MODES.map(({ key, label, Icon }) => ({ key, label, icon: Icon }))}
                    value={sortMode}
                    onChange={setSortMode}
                  >
                    {sortMode === 'manual' && !pendingOrder && (
                      <Span className="text-[10px] text-muted-foreground italic shrink-0 ml-1">Trascina per riordinare</Span>
                    )}
                  </SortPills>
                  {isAdmin && (
                    <Btn
                      button
                      onClick={() => { setEditing(null); setDialogOpen(true); }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary text-primary-foreground shadow-sm shadow-primary/30 shrink-0">
                      <Plus className="w-3 h-3" />
                      Aggiungi promoter
                    </Btn>
                  )}
                </Div>
              )}

              {/* Banner conferma ordine */}
              {pendingOrder && sortMode === 'manual' && (
                <Div className="dash-fade-up flex items-center justify-between rounded-xl bg-primary/10 border border-primary/30 px-4 py-3 mb-4"
                  style={{ boxShadow: '0 0 20px rgba(167,139,250,0.12)' }}>
                  <Span className="text-sm font-medium">Hai spostato le card — vuoi salvare il nuovo ordine?</Span>
                  <Div className="flex gap-2">
                    <Button size="sm" onClick={confirmOrder}>
                      <Check className="w-3.5 h-3.5 mr-1.5" />Conferma
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelPendingOrder}>
                      <X className="w-3.5 h-3.5 mr-1.5" />Annulla
                    </Button>
                  </Div>
                </Div>
              )}

              {mainPromoters.length === 0 && ragazzeImmagine.length === 0 ? (
                <EmptyState
                  icon={UserCheck}
                  title="Nessun promoter"
                  description="Aggiungi i membri del tuo team per iniziare a monitorare le performance."
                />
              ) : sortMode === 'manual' ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="promoters">
                    {(provided) => (
                      <Div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      >
                        {sortedPromoters.map((p, index) => (
                          <Draggable key={p.id} draggableId={p.id} index={index}>
                            {(drag, snapshot) => (
                              <Div
                                ref={drag.innerRef}
                                {...drag.draggableProps}
                                style={drag.draggableProps.style}
                                className={`relative transition-shadow duration-200 promoter-card-row ${snapshot.isDragging ? 'z-50 shadow-2xl opacity-90 scale-[1.02]' : 'dash-fade-up'}`}
                              >
                                {isMobile ? (
                                  <PromoterCardMobile
                                    promoter={p}
                                    attendances={attsByPromoter.get(p.id) ?? EMPTY}
                                    events={events}
                                    eventsMap={eventsMap}
                                    clients={clients}
                                    achievements={achievements}
                                    promoterAchievements={promoterAchievements}
                                    promoterRanks={promoterRanks}
                                    onEdit={() => { setEditing(p); setDialogOpen(true); }}
                                    onGoals={canManageGoals(p) ? () => setGoalsPromoter(p) : undefined}
                                    dragHandleProps={drag.dragHandleProps}
                                  />
                                ) : (
                                  <PromoterCard
                                    promoter={p}
                                    attendances={attendances}
                                    events={events}
                                    clients={clients}
                                    achievements={achievements}
                                    promoterAchievements={promoterAchievements}
                                    promoterRanks={promoterRanks}
                                    onEdit={() => { setEditing(p); setDialogOpen(true); }}
                                    onGoals={canManageGoals(p) ? () => setGoalsPromoter(p) : undefined}
                                    onUpdateFollowers={handleUpdateFollowers}
                                    dragHandleProps={drag.dragHandleProps}
                                  />
                                )}
                              </Div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                isMobile ? (
                  // PORT: sul telefono (una colonna) card virtualizzate sullo scroll della pagina
                  // (PageWindowList): ogni PromoterCardMobile ha foto, aggregati e grafico; le card che
                  // arrivano scorrendo non rifanno dash-fade-up. REGOLE-PRESTAZIONI §3
                  <PageWindowList items={sortedPromoters} keyOf={keyOfPromoter} estimate={220} gap={16} overscan={3}
                    renderItem={(p, index, entering) => (
                      <Div key={p.id} className={`${entering ? 'dash-fade-up ' : ''}promoter-card-row`} style={entering ? { animationDelay: `${Math.min(index * 0.04, 0.5)}s` } : undefined}>
                        <PromoterCardMobile
                          promoter={p}
                          attendances={attsByPromoter.get(p.id) ?? EMPTY}
                          events={events}
                          eventsMap={eventsMap}
                          clients={clients}
                          achievements={achievements}
                          promoterAchievements={promoterAchievements}
                          promoterRanks={promoterRanks}
                          onEdit={() => { setEditing(p); setDialogOpen(true); }}
                          onGoals={canManageGoals(p) ? () => setGoalsPromoter(p) : undefined}
                        />
                      </Div>
                    )} />
                ) : (
                <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedPromoters.map((p, index) => (
                    <Div key={p.id} className="dash-fade-up promoter-card-row" style={{ animationDelay: `${Math.min(index * 0.04, 0.5)}s` }}>
                      {isMobile ? (
                        <PromoterCardMobile
                          promoter={p}
                          attendances={attsByPromoter.get(p.id) ?? EMPTY}
                          events={events}
                          eventsMap={eventsMap}
                          clients={clients}
                          achievements={achievements}
                          promoterAchievements={promoterAchievements}
                          promoterRanks={promoterRanks}
                          onEdit={() => { setEditing(p); setDialogOpen(true); }}
                          onGoals={canManageGoals(p) ? () => setGoalsPromoter(p) : undefined}
                        />
                      ) : (
                        <PromoterCard
                          promoter={p}
                          attendances={attendances}
                          events={events}
                          clients={clients}
                          achievements={achievements}
                          promoterAchievements={promoterAchievements}
                          promoterRanks={promoterRanks}
                          onEdit={() => { setEditing(p); setDialogOpen(true); }}
                          onGoals={canManageGoals(p) ? () => setGoalsPromoter(p) : undefined}
                          onUpdateFollowers={handleUpdateFollowers}
                        />
                      )}
                    </Div>
                  ))}
                </Div>
                )
              )}

              {/* Sezione PR Inattivi */}
              {inactivePromoters.length > 0 && (
                <Div className="dash-fade-up mt-8 space-y-4">
                  <Div className="flex items-center gap-3">
                    <Div className="h-px flex-1 bg-amber-500/20" />
                    <Div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5"
                      style={{ boxShadow: '0 0 16px rgba(245,158,11,0.1)' }}>
                      <UserX className="w-3.5 h-3.5 text-amber-400" />
                      <Span className="text-xs font-semibold text-amber-400">PR Inattivi</Span>
                    </Div>
                    <Div className="h-px flex-1 bg-amber-500/20" />
                  </Div>
                  <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inactivePromoters.map((p, index) => (
                      <Div key={p.id} className="dash-fade-up promoter-card-row opacity-60" style={{ animationDelay: `${Math.min(0.25 + index * 0.05, 0.6)}s` }}>
                        {isMobile ? (
                          <PromoterCardMobile
                            promoter={p}
                            attendances={attsByPromoter.get(p.id) ?? EMPTY}
                            events={events}
                            eventsMap={eventsMap}
                            clients={clients}
                            achievements={achievements}
                            promoterAchievements={promoterAchievements}
                            promoterRanks={promoterRanks}
                            onEdit={() => { setEditing(p); setDialogOpen(true); }}
                            onGoals={canManageGoals(p) ? () => setGoalsPromoter(p) : undefined}
                          />
                        ) : (
                          <PromoterCard
                            promoter={p}
                            attendances={attendances}
                            events={events}
                            clients={clients}
                            achievements={achievements}
                            promoterAchievements={promoterAchievements}
                            promoterRanks={promoterRanks}
                            onEdit={() => { setEditing(p); setDialogOpen(true); }}
                            onGoals={canManageGoals(p) ? () => setGoalsPromoter(p) : undefined}
                            onUpdateFollowers={handleUpdateFollowers}
                          />
                        )}
                      </Div>
                    ))}
                  </Div>
                </Div>
              )}

              {/* Sezione Ragazze Immagine */}
              {ragazzeImmagine.length > 0 && (
                <Div className="dash-fade-up mt-8 space-y-4">
                  <Div className="flex items-center gap-3">
                    <Div className="h-px flex-1 bg-pink-500/20" />
                    <Div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/5"
                      style={{ boxShadow: '0 0 16px rgba(244,114,182,0.1)' }}>
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      <Span className="text-xs font-semibold text-pink-400">Ragazze Immagine</Span>
                    </Div>
                    <Div className="h-px flex-1 bg-pink-500/20" />
                  </Div>
                  <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ragazzeImmagine.map((p, index) => (
                      <Div key={p.id} className="dash-fade-up promoter-card-row" style={{ animationDelay: `${Math.min(0.25 + index * 0.05, 0.6)}s` }}>
                        {isMobile ? (
                          <PromoterCardMobile
                            promoter={p}
                            attendances={attsByPromoter.get(p.id) ?? EMPTY}
                            events={events}
                            eventsMap={eventsMap}
                            clients={clients}
                            achievements={achievements}
                            promoterAchievements={promoterAchievements}
                            promoterRanks={promoterRanks}
                            onEdit={() => { setEditing(p); setDialogOpen(true); }}
                            onGoals={canManageGoals(p) ? () => setGoalsPromoter(p) : undefined}
                          />
                        ) : (
                          <PromoterCard
                            promoter={p}
                            attendances={attendances}
                            events={events}
                            clients={clients}
                            achievements={achievements}
                            promoterAchievements={promoterAchievements}
                            promoterRanks={promoterRanks}
                            onEdit={() => { setEditing(p); setDialogOpen(true); }}
                            onGoals={canManageGoals(p) ? () => setGoalsPromoter(p) : undefined}
                            onUpdateFollowers={handleUpdateFollowers}
                          />
                        )}
                      </Div>
                    ))}
                  </Div>
                </Div>
              )}
            </TabsContent>
          </Div>
        </Div>
      </Tabs>

      {formMounted && <PromoterFormDialog open={dialogOpen} onOpenChange={setDialogOpen} promoter={editing} onSave={handleSave} />}
      {goalsMounted && <PromoterGoalsDialog open={!!goalsPromoter} onOpenChange={o => !o && setGoalsPromoter(null)} promoter={goalsPromoter} />}
    </Div>
  );
}