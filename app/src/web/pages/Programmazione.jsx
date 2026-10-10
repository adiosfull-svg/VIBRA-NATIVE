// Port di src/pages/Programmazione.jsx (convertito da scripts/port/codemod.mjs).
import { invalidateFullTables } from '@/web/lib/query-client';
import React, { useMemo, useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from '@/ui/motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { differenceInDays, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Sparkles, Trophy, Star, TrendingDown, CalendarDays, Table2, Instagram, Plus, Search, Crown, Target, MessageCircle } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useAuth } from '@/lib/auth';
import PageTitle from '@/web/components/shared/PageTitle';
import SectionHeader from '@/web/components/shared/SectionHeader';
import EmptyState from '@/web/components/shared/EmptyState';
import { buildClientStatsMap, buildEnrichedClients, buildClientBadgesMap, buildNuoviClientiBoard } from '@/legacy/utils/clientPrecomputed';
import { preloadImages } from '@/legacy/utils/imageCache';
import ClientDetailDialog from '@/web/components/client/ClientDetailDialog';
import ClientSerateMenu from '@/web/components/programmazione/ClientSerateMenu';
import CaptureSeminaDialog from '@/web/components/programmazione/CaptureSeminaDialog';
import EditSeminaDialog from '@/web/components/programmazione/EditSeminaDialog';
import SeminaAgenda from '@/web/components/programmazione/SeminaAgenda';
import SeminaPasteMenu from '@/web/components/programmazione/SeminaPasteMenu';
import SeminaCard from '@/web/components/programmazione/SeminaCard';
import BulkActions from '@/web/components/client/BulkActions';
import { BulkSelectionProvider } from '@/web/lib/bulkSelectionContext';
// Tab components: lazy-loaded (code splitting) — il JS si scarica solo al primo click sul tab
const RecontactList = React.lazy(() => import('@/web/components/programmazione/RecontactList'));
const ClientBoardSection = React.lazy(() => import('@/web/components/programmazione/ClientBoardSection'));
const ClientGrowthLeague = React.lazy(() => import('@/web/components/programmazione/ClientGrowthLeague'));
const ProgrammazionePlanner = React.lazy(() => import('@/web/components/programmazione/ProgrammazionePlanner'));
const WeeklySuggestionBox = React.lazy(() => import('@/web/components/programmazione/WeeklySuggestionBox'));
const AIConsoleBox = React.lazy(() => import('@/web/components/programmazione/AIConsoleBox'));
const LeaderTab = React.lazy(() => import('@/web/components/programmazione/LeaderTab'));
const TargetLocaleTab = React.lazy(() => import('@/web/components/programmazione/TargetLocaleTab'));
// Preload idle: dopo il primo render della pagina, scarica in background i
// chunk dei tab non ancora visitati. L'utente non vede lag al primo cambio tab.
const _programmazionePreload = () => {
  Promise.all([
    import('@/web/components/programmazione/RecontactList'),
    import('@/web/components/programmazione/ClientBoardSection'),
    import('@/web/components/programmazione/ClientGrowthLeague'),
    import('@/web/components/programmazione/ProgrammazionePlanner'),
    import('@/web/components/programmazione/WeeklySuggestionBox'),
    import('@/web/components/programmazione/AIConsoleBox'),
    import('@/web/components/programmazione/LeaderTab'),
    import('@/web/components/programmazione/TargetLocaleTab'),
  ]).catch(() => {});
};
import ContactRemindersBox from '@/web/components/programmazione/ContactRemindersBox';
import ContactReminderDialog from '@/web/components/client/ContactReminderDialog';
import ScrollToTopButton from '@/web/components/shared/ScrollToTopButton';
import { useProgrammazionePlan } from '@/web/hooks/useProgrammazionePlan';
import { useViewAsPromoter } from '@/lib/viewAs';
import { useUpcomingSerate } from '@/web/hooks/useUpcomingSerate';
import { useSerateFittizie } from '@/web/hooks/useSerateFittizie';
import { useStickySentinel } from '@/web/hooks/useStickySentinel';
import { useStickyTabScroll } from '@/web/hooks/useStickyTabScroll';
import { stickyGlassStyle } from '@/legacy/utils/stickyGlass';
import { useStickyTabFlash } from '@/web/hooks/useStickyTabFlash';
import { useSetStickyHeader } from '@/web/lib/stickyHeaderContext';
import { makeTapHandlers } from '@/web/lib/tapHandlers';
import { useBackTab } from '@/web/hooks/useBackTab';
import { useOverlay } from '@/web/lib/overlayStackContext';
import { useDragScroll } from '@/web/hooks/useDragScroll';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

const TABS = [
  { key: 'inviti', label: 'Inviti', icon: CalendarDays },
  { key: 'ricontattare', label: 'Da ricontattare', icon: MessageCircle },
  { key: 'semina', label: 'Semina', icon: Instagram },
  { key: 'target', label: 'Target', icon: Target },
  { key: 'leader', label: 'Leader', icon: Crown },
  { key: 'tabelle', label: 'Tabelle', icon: Table2 },
];

const FALLBACK = { visits: 0, fri: 0, sat: 0, sun: 0, extra: 0, totalSpent: 0, avgSpent: 0, attendances: [] };

export default function Programmazione() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [detailClient, setDetailClient] = useState(null);
  const [activeTab, setActiveTab] = useState(() => webWindow.history.state?._tab || 'inviti');
  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureInitial, setCaptureInitial] = useState({ url: '', name: '' });
  const [editSemina, setEditSemina] = useState(null);
  const [reminderClient, setReminderClient] = useState(null);

  const isAdmin = user?.role === 'admin';
  const { effectivePromoterId: promoterId } = useViewAsPromoter();

  // ── Sticky tab bar (identico alle altre sezioni, es. Clienti) ──
  const tabsScrollRef = useRef(null);
  const scrollRef = useRef(null);
  const activeButtonRef = useRef(null);
  const [sentinelRef, stuck] = useStickySentinel();
  const sentinelNodeRef = useRef(null);
  const lastTabTouchRef = useRef(0);
  useStickyTabFlash(tabsScrollRef);

  // Preload idle dei chunk dei tab non ancora visitati: parte dopo il primo
  // paint, in background, senza bloccare il render. Al primo cambio tab il
  // chunk è già in cache → zero skeleton/flash.
  useEffect(() => {
    const ric = webWindow.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
    const tid = ric(_programmazionePreload);
    return () => { if (webWindow.cancelIdleCallback) webWindow.cancelIdleCallback(tid); else clearTimeout(tid); };
  }, []);

  const [tabelleSearch, setTabelleSearch] = useState('');
  const [tabelleSearchOpen, setTabelleSearchOpen] = useState(false);
  const tabelleSentinelRef = useRef(null);
  const [tabelleStuck, setTabelleStuck] = useState(false);
  const [recontactSearch, setRecontactSearch] = useState('');
  const [recontactSearchOpen, setRecontactSearchOpen] = useState(false);
  const recontactSentinelRef = useRef(null);
  const [recontactStuck, setRecontactStuck] = useState(false);
  useEffect(() => {
    // rAF-throttle: 3 letture di layout (gl/tabelle/recontact) per scroll
    // vengono coalescite in un singolo frame → scroll fluido senza reflow a ogni tick.
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const bar = tabsScrollRef.current;
        if (!bar) { setTabelleStuck(false); setRecontactStuck(false); return; }
        const barBottom = bar.getBoundingClientRect().bottom + 1;
        const ts = tabelleSentinelRef.current;
        setTabelleStuck(ts ? ts.getBoundingClientRect().bottom <= barBottom : false);
        const rs = recontactSentinelRef.current;
        setRecontactStuck(rs ? rs.getBoundingClientRect().bottom <= barBottom : false);
      });
    };
    check();
    webWindow.addEventListener('scroll', check, { passive: true });
    webWindow.addEventListener('resize', check);
    const t1 = setTimeout(check, 300);
    const t2 = setTimeout(check, 800);
    return () => {
      cancelAnimationFrame(raf);
      webWindow.removeEventListener('scroll', check);
      webWindow.removeEventListener('resize', check);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeTab]);
  const setStuckHeader = useSetStickyHeader();
  useEffect(() => { setStuckHeader(stuck); }, [stuck, setStuckHeader]);
  useEffect(() => () => setStuckHeader(false), [setStuckHeader]);

  // Deep-link "fast-capture": ?semina_ig=<url>&semina_name=<nome> apre il dialog precompilato
  useEffect(() => {
    const p = new URLSearchParams(webWindow.location.search);
    const igUrl = p.get('semina_ig') || p.get('lead_ig');
    const igName = p.get('semina_name') || p.get('lead_name');
    if (igUrl || igName) {
      setCaptureInitial({ url: igUrl || '', name: igName || '' });
      setCaptureOpen(true);
      const u = new URL(webWindow.location.href);
      u.searchParams.delete('semina_ig');
      u.searchParams.delete('semina_name');
      u.searchParams.delete('lead_ig');
      u.searchParams.delete('lead_name');
      const qs = u.searchParams.toString();
      webWindow.history.replaceState({}, '', u.pathname + (qs ? `?${qs}` : ''));
    }
  }, []);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients', promoterId],
    queryFn: () => isAdmin && !promoterId
      ? base44.entities.Client.list()
      : base44.entities.Client.filter({ promoter_id: promoterId }),
    enabled: !!user,
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // attendances: caricato solo quando serve (tab Target o detail dialog aperto).
  // Evita il download di migliaia di record di presenze al primo caricamento.
  const { data: attendances = [] } = useQuery({
    queryKey: ['attendances', promoterId],
    queryFn: () => base44.entities.EventAttendance.filter({ promoter_id: promoterId }, '-created_date', 5000),
    enabled: !!user && (activeTab === 'target' || !!detailClient),
    staleTime: 5 * 60000,
    gcTime: 10 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // events: caricato in parallelo con clients (serve subito per il tab Inviti).
  // Non più gated su clients.length > 0: elimina il waterfall di caricamento.
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    enabled: !!user,
    staleTime: 5 * 60000,
    gcTime: 10 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { data: semine = [] } = useQuery({
    queryKey: ['semine', promoterId],
    queryFn: () => isAdmin && !promoterId
      ? base44.entities.Semina.list()
      : base44.entities.Semina.filter({ promoter_id: promoterId }),
    enabled: !!user,
    staleTime: 2 * 60000,
    gcTime: 10 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['client-groups', promoterId],
    queryFn: () => isAdmin && !promoterId
      ? base44.entities.ClientGroup.list()
      : base44.entities.ClientGroup.filter({ promoter_id: promoterId }),
    enabled: !!user,
    staleTime: 5 * 60000,
    gcTime: 10 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { upcomingDates, metaForDate } = useUpcomingSerate();
  const serateFittizie = useSerateFittizie();

  // ── Statistiche pre-calcolate dal backend (campi cum_* sui record Client) ──
  const clientStatsMap = useMemo(() => buildClientStatsMap(clients), [clients]);

  // Preload foto semine: usa la cache in memoria condivisa (imageCache) con
  // concorrenza limitata (max 4 decode simultanei). Le URL già decodificate
  // vengono saltate — niente re-decode al cambio tab. Prima lanciava 50+
  // decode simultanei al mount → memory pressure su mobile.
  useEffect(() => {
    preloadImages(semine.map(s => s.photo_url).filter(Boolean));
  }, [semine]);

  const getStats = (id) => clientStatsMap[id] ?? FALLBACK;
  // Badges: calcolati solo quando il detail dialog è aperto (evita O(n) a ogni mount)
  const clientBadges = useMemo(() => detailClient ? buildClientBadgesMap(clients) : {}, [clients, detailClient]);
  // Enriched: calcolato solo per i tab che lo usano (Tabelle, Growth). Sul tab Inviti
  // (default) restituisce [] istantaneamente — zero calcolo al primo caricamento.
  const enriched = useMemo(() => {
    if (activeTab !== 'tabelle') return [];
    return buildEnrichedClients(clients);
  }, [clients, activeTab]);

  const boards = useMemo(() => {
    if (activeTab !== 'tabelle') return { nuovi: [], topPaganti: [], leaders: [], inCalo: [] };
    // Nuovi: ultimi 30 clienti registrati (created_date desc). Logica unificata
    // con la bacheca "Nuovi Clienti" di Clienti (tab Tabelle) — stesso helper.
    const nuovi = buildNuoviClientiBoard(enriched, 30);
    // isNuovo usato ancora per escludere i nuovi dalla bacheca "in calo"
    const isNuovo = (e) => e.client?.created_date && differenceInDays(today, new Date(e.client.created_date)) <= 30;
    const today = new Date();

    const topPaganti = [...enriched].filter(e => e.ranking !== null).sort((a, b) => (b.ranking ?? 0) - (a.ranking ?? 0)).slice(0, 30);

    const leaders = enriched.filter(e => e.client.is_leader).sort((a, b) => (b.daysAgo ?? -1) - (a.daysAgo ?? -1)).slice(0, 30);

    const inCalo = enriched.filter(e => e.trendFull.status === 'down' && e.visits >= 3 && !isNuovo(e)).sort((a, b) => (a.pctChange ?? 0) - (b.pctChange ?? 0)).slice(0, 30);

    return { nuovi, topPaganti, leaders, inCalo };
  }, [enriched, activeTab]);

  const tabelleQ = tabelleSearch.trim().toLowerCase();
  const filteredBoards = useMemo(() => {
    if (!tabelleQ) return boards;
    const f = (rows) => rows.filter(r => r.client?.name?.toLowerCase().includes(tabelleQ));
    return { nuovi: f(boards.nuovi), topPaganti: f(boards.topPaganti), leaders: f(boards.leaders), inCalo: f(boards.inCalo) };
  }, [boards, tabelleQ]);

  const handleContact = async (clientId) => {
    await base44.entities.Client.update(clientId, { last_contacted_at: new Date().toISOString() });
    qc.invalidateQueries({ queryKey: ['clients', promoterId] });
  };

  const handleClientToggle = async (client, patch) => {
    await base44.entities.Client.update(client.id, patch);
    qc.invalidateQueries({ queryKey: ['clients', promoterId] });
  };

  const handleDeleteSemina = async (seminaId) => {
    await base44.entities.Semina.delete(seminaId);
    qc.invalidateQueries({ queryKey: ['semine', promoterId] });
  };

  const handlePasteSeminaPhoto = async (seminaId, url) => {
    // Ottimistico: aggiorna la cache immediatamente (foto visibile al volo)
    qc.setQueriesData({ queryKey: ['semine', promoterId] }, (old) => {
      if (!Array.isArray(old)) return old;
      return old.map(s => s.id === seminaId ? { ...s, photo_url: url } : s);
    });
    try {
      await base44.entities.Semina.update(seminaId, { photo_url: url });
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    } catch (e) {
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    }
  };

  const handlePasteClientPhoto = async (clientId, url) => {
    qc.setQueriesData({ queryKey: ['clients', promoterId] }, (old) => {
      if (!Array.isArray(old)) return old;
      return old.map(c => c.id === clientId ? { ...c, photo_url: url } : c);
    });
    try {
      await base44.entities.Client.update(clientId, { photo_url: url });
      qc.invalidateQueries({ queryKey: ['clients', promoterId] });
    } catch (e) {
      qc.invalidateQueries({ queryKey: ['clients', promoterId] });
    }
  };

  const handleMarkSeminaContacted = async (semina) => {
    const now = new Date().toISOString();
    qc.setQueriesData({ queryKey: ['semine', promoterId] }, (old) => {
      if (!Array.isArray(old)) return old;
      return old.map(s => s.id === semina.id ? { ...s, last_contacted_at: now } : s);
    });
    try {
      await base44.entities.Semina.update(semina.id, { last_contacted_at: now });
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    } catch {
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    }
  };

  const handleToggleSeminaOff = async (semina) => {
    const newOff = !semina.is_off;
    qc.setQueriesData({ queryKey: ['semine', promoterId] }, (old) => {
      if (!Array.isArray(old)) return old;
      return old.map(s => s.id === semina.id ? { ...s, is_off: newOff } : s);
    });
    try {
      await base44.entities.Semina.update(semina.id, { is_off: newOff });
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    } catch {
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    }
  };

  // Riordina le semine via drag & drop: aggiorna display_order con optimistic update
  const handleReorderSemina = async (reorderedIds) => {
    qc.setQueryData(['semine', promoterId], (old = []) => {
      const map = new Map(old.map(s => [s.id, s]));
      return reorderedIds.map((id, index) => {
        const s = map.get(id);
        return s ? { ...s, display_order: index } : null;
      }).filter(Boolean);
    });
    try {
      await base44.entities.Semina.bulkUpdate(
        reorderedIds.map((id, index) => ({ id, display_order: index }))
      );
    } catch (err) {
      console.error('Reorder semine failed:', err);
    }
    qc.invalidateQueries({ queryKey: ['semine', promoterId] });
  };

  const handleAddToGroup = async (group, client) => {
    const ids = group.client_ids || [];
    if (ids.includes(client.id)) return;
    await base44.entities.ClientGroup.update(group.id, { client_ids: [...ids, client.id] });
    qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
  };

  const handleRemoveFromGroup = async (group, client) => {
    const ids = group.client_ids || [];
    if (!ids.includes(client.id)) return;
    await base44.entities.ClientGroup.update(group.id, { client_ids: ids.filter(id => id !== client.id) });
    qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
  };

  const handleCreateGroup = async (name, client) => {
    if (!name?.trim() || !promoterId) return;
    await base44.entities.ClientGroup.create({ promoter_id: promoterId, name: name.trim(), client_ids: [client.id] });
    qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
  };

  // Risolve sempre il cliente completo dal parco clienti caricato: i caller che
  // passano un oggetto minimale (es. AIConsoleBox con solo {id, name}) ottengono
  // così il record con tutti i campi (residenza, guidatore, leader, contatti,
  // fonte) così il detail dialog mostra la sezione superiore correttamente.
  const onDetail = (client) => {
    if (client?.id) {
      const full = clients.find(c => c.id === client.id);
      setDetailClient(full || client);
    } else {
      setDetailClient(client);
    }
  };

  const { plan, addToPlan, removeFromPlan, updateNote } = useProgrammazionePlan(promoterId);

  // Drag-to-scroll del box Semine (identico al box Suggerimenti Settimana)
  const semineDrag = useDragScroll();

  // Merge delle serate fittizie (condivise tra tutti i promoter) con le serate
  // standard (Ven/Sab/Dom). Le serate fittizie sono record dell'entità SerataFittizia:
  // non sono Event reali, esistono solo nel prospetto inviti. Quando un promoter
  // ne crea una, diventa disponibile per tutti i promoter nel menu contestuale.
  // Non filtriamo per data: una serata fittizia può avere la stessa data di una
  // serata standard (es. "ferra" il venerdì) e deve comunque apparire come voce
  // separata nella lista.
  const mergedUpcomingDates = useMemo(() => {
    const custom = serateFittizie
      .map(s => {
        let dateObj;
        try { dateObj = new Date(s.date + 'T00:00:00'); } catch { dateObj = new Date(NaN); }
        return {
          id: s.id,
          dateStr: s.date,
          dow: null,
          dayLabel: s.name,
          venueName: null,
          logoUrl: '',
          dateObj,
        };
      })
      .filter(d => !isNaN(d.dateObj.getTime()));
    return [...custom, ...upcomingDates].sort((a, b) => a.dateObj - b.dateObj);
  }, [upcomingDates, serateFittizie]);

  const handleAddToPlan = (client, dateItem) => {
    if (!dateItem) return;
    let subtitle;
    try { subtitle = format(dateItem.dateObj, 'd MMM yyyy', { locale: it }); } catch { subtitle = dateItem.dateStr; }
    if (dateItem.venueName) subtitle += ` · ${dateItem.venueName}`;
    else if (dateItem.dow === null) subtitle += ' · Extra';
    addToPlan(dateItem.dateStr, { title: `${dateItem.dayLabel}${dateItem.venueName ? ' · ' + dateItem.venueName : ''}`, subtitle }, client);
  };
  const handleRemoveFromPlan = (client, dateStr) => removeFromPlan(dateStr, client.id);
  const handleAddCustom = async (client, name, dateStr) => {
    // Crea la serata fittizia condivisa (visibile a tutti i promoter) se non esiste già
    const exists = serateFittizie.some(s => s.name === name && s.date === dateStr);
    if (!exists) {
      // Optimistic: aggiunge subito alla cache così appare nel menu senza attendere il refetch
      qc.setQueryData(['serate-fittizie'], (old = []) => [...old, { id: 'opt-' + Date.now(), name, date: dateStr }]);
      try { await base44.entities.SerataFittizia.create({ name, date: dateStr }); } catch {}
      qc.invalidateQueries({ queryKey: ['serate-fittizie'] });
    }
    let subtitle = dateStr;
    try { subtitle = format(new Date(dateStr + 'T00:00:00'), 'd MMM yyyy', { locale: it }) + ' · Extra'; } catch {}
    addToPlan(dateStr, { title: name, subtitle }, client);
  };
  const handleDeleteFittizia = async (id) => {
    if (!id) return;
    qc.setQueryData(['serate-fittizie'], (old = []) => old.filter(s => s.id !== id));
    try { await base44.entities.SerataFittizia.delete(id); } catch {}
    qc.invalidateQueries({ queryKey: ['serate-fittizie'] });
  };

  // ── Selezione multipla clienti ──
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const selectMode = selectedIds.size > 0;
  const toggleSelect = useCallback((client) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      const id = client?.id || client;
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);
  const selectedClients = useMemo(() => clients.filter(c => selectedIds.has(c.id)), [clients, selectedIds]);
  const selectAll = useCallback(() => setSelectedIds(new Set(clients.map(c => c.id))), [clients]);

  // Azzera la selezione al cambio tab
  useEffect(() => { clearSelection(); }, [activeTab, clearSelection]);

  // Tasto back: torna al tab precedente; chiudi selezione multipla
  useBackTab(activeTab, setActiveTab, 'inviti');
  useOverlay(selectMode, clearSelection);

  // Sync tab dalla bottom nav (es. tap "Semine" mentre si è già su /programmazione)
  useEffect(() => {
    const handler = (e) => setActiveTab(e.detail);
    webWindow.addEventListener('vibra:set-programmazione-tab', handler);
    return () => webWindow.removeEventListener('vibra:set-programmazione-tab', handler);
  }, []);

  const handleBulkAddToGroup = async (group, clientsList) => {
    const ids = new Set(group.client_ids || []);
    clientsList.forEach(c => ids.add(c.id));
    await base44.entities.ClientGroup.update(group.id, { client_ids: Array.from(ids) });
    qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
    clearSelection();
  };
  const handleBulkCreateGroup = async (name, clientsList) => {
    if (!name?.trim() || !promoterId) return;
    await base44.entities.ClientGroup.create({ promoter_id: promoterId, name: name.trim(), client_ids: clientsList.map(c => c.id) });
    qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
    clearSelection();
  };
  const handleBulkSetReminders = async (clientsList, datetime) => {
    if (!promoterId || !datetime) return;
    await base44.entities.ContactReminder.bulkCreate(
      clientsList.map(c => ({ promoter_id: promoterId, client_id: c.id, client_name: c.name, reminder_datetime: datetime }))
    );
    qc.invalidateQueries({ queryKey: ['contact-reminders', promoterId] });
    clearSelection();
  };
  const handleBulkAddToSerata = (dateItem, clientsList) => {
    let subtitle;
    try { subtitle = format(dateItem.dateObj, 'd MMM yyyy', { locale: it }); } catch { subtitle = dateItem.dateStr; }
    if (dateItem.venueName) subtitle += ` · ${dateItem.venueName}`;
    else if (dateItem.dow === null) subtitle += ' · Extra';
    clientsList.forEach(c => addToPlan(dateItem.dateStr, { title: `${dateItem.dayLabel}${dateItem.venueName ? ' · ' + dateItem.venueName : ''}`, subtitle }, c));
    clearSelection();
  };

  const bulkValue = {
    selectedIds, selectMode, toggleSelect, clearSelection, selectAll, selectedClients,
    totalFiltered: clients.length, allClients: clients,
    groups, upcomingDates: mergedUpcomingDates,
    onBulkAddToGroup: handleBulkAddToGroup,
    onBulkCreateGroup: handleBulkCreateGroup,
    onBulkSetReminders: handleBulkSetReminders,
    onBulkAddToSerata: handleBulkAddToSerata,
  };

  // Logica standardizzata di scroll al cambio tab (vedi useStickyTabScroll).
  const { scrollToTab } = useStickyTabScroll(stuck, tabsScrollRef);

  const handleTabClick = (key) => {
    setActiveTab(key);
    scrollToTab();
  };

  // Centra il tab attivo nella barra (scorrimento fluido, come in Clienti).
  const scrollToActiveTab = useCallback(() => {
    if (scrollRef.current && activeButtonRef.current) {
      const container = scrollRef.current;
      const btn = activeButtonRef.current;
      container.scrollTo({ left: btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(scrollToActiveTab, 50);
    return () => clearTimeout(t);
  }, [activeTab, scrollToActiveTab]);

  const searchConfig = activeTab === 'tabelle'
      ? { stuck: tabelleStuck, search: tabelleSearch, setSearch: setTabelleSearch, open: tabelleSearchOpen, setOpen: setTabelleSearchOpen }
      : activeTab === 'ricontattare'
        ? { stuck: recontactStuck, search: recontactSearch, setSearch: setRecontactSearch, open: recontactSearchOpen, setOpen: setRecontactSearchOpen }
        : null;

  if (!user) {
    return (
      <Div className="flex items-center justify-center h-64">
        <Div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </Div>
    );
  }

  if (!isLoading && clients.length === 0) {
    return (
      <Div className="space-y-3 pb-8">
        <PageTitle title="Weekend" />
        <EmptyState icon={Sparkles} title="Nessun cliente" description="Aggiungi i clienti dal tab Clienti per iniziare a pianificare chi invitare." />
      </Div>
    );
  }

  const _content = (
    <Div className="space-y-4 pb-10">
      <PageTitle title="Weekend" />
      <Div className="dash-fade-up flex items-center gap-2">
        <P className="text-sm text-muted-foreground">Organizza qui il prossimo weekend. Analizza e scegli chi, come e quando invitarlo.</P>
      </Div>
      <ContactRemindersBox promoterId={promoterId} />

      {/* Sentinel + Sticky tab bar (identico a Clienti) */}
      <Div
        ref={(node) => { sentinelRef(node); sentinelNodeRef.current = node; }}
        style={{ height: 1, marginTop: 0, padding: 0, border: 'none' }} />
      <Div
        ref={tabsScrollRef}
        className={`dash-fade-up group sticky top-[env(safe-area-inset-top)] z-20 overflow-hidden pt-4 pb-1.5 -mx-4 px-4 border-b ${stuck ? 'border-border is-stuck' : 'border-transparent'}`}
        style={{ marginTop: 0, pointerEvents: detailClient ? 'none' : 'auto' }}
      >
        <Div
          className="sticky-glass absolute inset-0"
          style={{
            ...stickyGlassStyle(stuck),
            transition: 'backdrop-filter 0.2s ease, -webkit-backdrop-filter 0.2s ease, background-color 0.2s ease'
          }} />
        <Div className="relative flex items-center gap-2">
          <Div ref={scrollRef} className="relative overflow-x-auto overflow-y-hidden flex-1 min-w-0" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x', overscrollBehaviorX: 'contain' }}>
            <Div className="relative flex gap-1 bg-secondary/30 p-1 rounded-xl w-max min-w-full">
              {TABS.map(({ key, label, icon: TabIcon }) => (
                <Btn
                  button
                  key={key}
                  ref={activeTab === key ? activeButtonRef : null}
                  {...makeTapHandlers(lastTabTouchRef, () => handleTabClick(key))}
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
          {searchConfig && (
            <AnimatePresence>
              {searchConfig.stuck && (
                <motion.button
                  key={activeTab + '-search-btn'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => searchConfig.setOpen(v => !v)}
                  className={`shrink-0 p-2 rounded-lg border transition-colors ${searchConfig.open ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
                  title="Cerca"
                >
                  <Search className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </Div>
        {searchConfig && (
          <AnimatePresence>
            {searchConfig.stuck && searchConfig.open && (
              <Div key={activeTab + '-search-input'} className="relative overflow-hidden">
                <Div className="relative pt-1.5">
                  <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <HtmlInput
                    value={searchConfig.search}
                    onChange={e => searchConfig.setSearch(e.target.value)}
                    placeholder="Cerca cliente..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-secondary/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </Div>
              </Div>
            )}
          </AnimatePresence>
        )}
      </Div>

      <Suspense fallback={<Div className="flex items-center justify-center min-h-[calc(100vh-220px)]"><Div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></Div>}>
      {isLoading ? (
        <Div className="flex items-center justify-center min-h-[calc(100vh-220px)]"><Div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></Div>
      ) : (
      <>
      {activeTab === 'inviti' && <>
        {/* Prospetto centrale — programmazione inviti */}
        <Div className="dash-fade-up">
          <ProgrammazionePlanner
            plan={plan}
            onRemove={removeFromPlan}
            onNoteChange={updateNote}
            clients={clients}
            events={events}
            promoterId={promoterId}
            onDetail={onDetail}
            semine={semine}
            onEditSemina={setEditSemina}
            onConverted={() => {
              qc.invalidateQueries({ queryKey: ['attendances', promoterId] });
              invalidateFullTables(qc);
              qc.invalidateQueries({ queryKey: ['events'] });
              qc.invalidateQueries({ queryKey: ['clients', promoterId] });
            }}
          />
        </Div>

        {/* Semina Instagram — anteprime compatte (agenda completa nel tab Semina) */}
        <Div className="dash-fade-up">
          <SeminaPasteMenu promoterId={promoterId} onOpenCapture={() => { setCaptureInitial({ url: '', name: '' }); setCaptureOpen(true); }}>
          <Div className="relative overflow-hidden rounded-2xl border border-pink-500/15 bg-card p-3 sm:p-4" style={{ boxShadow: '0 4px 24px -6px rgba(236,72,153,0.10)' }}>
            <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50" style={{ background: 'linear-gradient(90deg, transparent, #ec4899, transparent)' }} />
            <Div className="flex items-center justify-between mb-4">
              <SectionHeader icon={Instagram} title="Semine" color="#ec4899" />
              <Div className="flex items-center gap-2">
                <Span className="text-[11px] font-semibold text-muted-foreground px-2 py-0.5 rounded-full bg-secondary/40">{semine.filter(s => !s.is_off).length}</Span>
                <Btn
                  button
                  onClick={() => handleTabClick('semina')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-pink-500/30 text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 transition-colors">
                  Vedi tutte
                </Btn>
              </Div>
            </Div>
            {semine.length === 0 ? (
              <P className="text-xs text-muted-foreground text-center py-4">Tieni premuto (mobile) o tasto destro (desktop) per incollare un contatto IG/TikTok.</P>
            ) : (
              <Div ref={semineDrag.ref} {...semineDrag.handlers} className="flex gap-2 overflow-x-auto pb-3 no-scrollbar cursor-grab active:cursor-grabbing select-none">
                {semine.filter(s => !s.is_off).map((s) => (
                  <SeminaCard key={s.id} semina={s} compact onDelete={handleDeleteSemina} onEdit={setEditSemina} />
                ))}
              </Div>
            )}
          </Div>
          </SeminaPasteMenu>
        </Div>

        {/* Console AI — analisi intelligente del parco clienti con commenti LLM */}
        <Div className="dash-fade-up">
          <AIConsoleBox clients={clients} onContact={handleContact} onDetail={onDetail} promoterId={promoterId} />
        </Div>

        <ScrollToTopButton />
      </>}

      {activeTab === 'ricontattare' && <>
        {/* Suggerimenti settimanali pre-calcolati */}
        <Div className="dash-fade-up">
          <WeeklySuggestionBox onContact={handleContact} onDetail={onDetail} />
        </Div>

        {/* Da Ricontattare */}
        <Div
          ref={recontactSentinelRef}
          style={{ height: 1, marginTop: 0, padding: 0, border: 'none' }} />
        <Div className="dash-fade-up">
          <RecontactList clients={clients} clientStatsMap={clientStatsMap} events={events} onContact={handleContact} onDetail={onDetail} search={recontactSearch} onSearchChange={setRecontactSearch} />
        </Div>

        <ScrollToTopButton />
      </>}

      {activeTab === 'semina' && (
        <Div className="dash-fade-up">
          <SeminaPasteMenu promoterId={promoterId} onOpenCapture={() => { setCaptureInitial({ url: '', name: '' }); setCaptureOpen(true); }}>
            <SeminaAgenda
              semine={semine}
              promoterId={promoterId}
              plan={plan}
              onOpenCapture={() => { setCaptureInitial({ url: '', name: '' }); setCaptureOpen(true); }}
              onEditSemina={setEditSemina}
              onDeleteSemina={handleDeleteSemina}
              onReorder={handleReorderSemina}
            />
          </SeminaPasteMenu>
        </Div>
      )}

      {activeTab === 'leader' && (
        <Div className="dash-fade-up min-h-[calc(100dvh-7.5rem)]">
          <LeaderTab clients={clients} events={events} onClientClick={onDetail} />
        </Div>
      )}

      {activeTab === 'target' && (
        <Div className="dash-fade-up min-h-[calc(100dvh-7.5rem)]">
          <TargetLocaleTab
            clients={clients}
            upcomingDates={upcomingDates}
            attendances={attendances}
            events={events}
            onContact={handleContact}
            onDetail={onDetail}
          />
        </Div>
      )}

      {activeTab === 'tabelle' && <>
        <Div
          ref={tabelleSentinelRef}
          style={{ height: 1, marginTop: 0, padding: 0, border: 'none' }} />
        {/* Bacheche FUT */}
        <Div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[calc(100dvh-7.5rem)]">
          <Div className="dash-fade-up">
            <ClientBoardSection title="Nuovi Clienti" icon={Sparkles} accentColor="#a78bfa" items={filteredBoards.nuovi} onContact={handleContact} onDetail={onDetail} emptyText="Nessun cliente registrato" />
          </Div>
          <Div className="dash-fade-up">
            <ClientBoardSection title="Top Paganti" icon={Trophy} accentColor="#facc15" items={filteredBoards.topPaganti} onContact={handleContact} onDetail={onDetail} emptyText="Nessun dato sufficiente" />
          </Div>
          <Div className="dash-fade-up">
            <ClientBoardSection title="Leader Inattivi" icon={Star} accentColor="#f59e0b" items={filteredBoards.leaders} onContact={handleContact} onDetail={onDetail} emptyText="Nessun leader registrato" />
          </Div>
          <Div className="dash-fade-up">
            <ClientBoardSection title="Clienti in Calo" icon={TrendingDown} accentColor="#ef4444" items={filteredBoards.inCalo} onContact={handleContact} onDetail={onDetail} emptyText="Nessun cliente in calo rilevato" />
          </Div>
        </Div>
      </>}
      </>
      )}
      </Suspense>

      <ClientDetailDialog
        open={!!detailClient}
        onOpenChange={v => { if (!v) setDetailClient(null); }}
        client={detailClient}
        attendances={attendances}
        events={events}
        badges={detailClient ? (clientBadges[detailClient.id] || []) : []}
        allClients={clients}
        onClientUpdated={setDetailClient}
      />

      <CaptureSeminaDialog
        open={captureOpen}
        onOpenChange={setCaptureOpen}
        promoterId={promoterId}
        initial={captureInitial}
      />

      <EditSeminaDialog
        open={!!editSemina}
        onOpenChange={(v) => { if (!v) setEditSemina(null); }}
        semina={editSemina}
        promoterId={promoterId}
      />

      <ContactReminderDialog
        client={reminderClient}
        promoterId={promoterId}
        open={!!reminderClient}
        onOpenChange={(v) => { if (!v) setReminderClient(null); }}
      />

      <ClientSerateMenu
        upcomingDates={mergedUpcomingDates}
        onAdd={handleAddToPlan}
        onRemove={handleRemoveFromPlan}
        plan={plan}
        onAddCustom={handleAddCustom}
        onDeleteFittizia={user?.role === 'admin' ? handleDeleteFittizia : undefined}
        getClient={(id) => clients.find(c => c.id === id)}
        onToggleLeader={(c) => handleClientToggle(c, { is_leader: !c.is_leader, leader_since: !c.is_leader ? new Date().toISOString() : null })}
        onToggleDriver={(c) => handleClientToggle(c, { is_driver: !c.is_driver })}
        onMarkContacted={(c) => handleContact(c.id)}
        onSetReminder={(c) => setReminderClient(c)}
        onToggleSeminaOff={handleToggleSeminaOff}
        onMarkSeminaContacted={handleMarkSeminaContacted}
        groups={groups}
        onAddToGroup={handleAddToGroup}
        onRemoveFromGroup={handleRemoveFromGroup}
        onCreateGroup={handleCreateGroup}
        selectMode={selectMode}
        onLongPressSelect={toggleSelect}
        onPasteSeminaPhoto={handlePasteSeminaPhoto}
        onPasteClientPhoto={handlePasteClientPhoto}
      />
      <BulkActions />
    </Div>
  );
  return <BulkSelectionProvider value={bulkValue}>{_content}</BulkSelectionProvider>;
}