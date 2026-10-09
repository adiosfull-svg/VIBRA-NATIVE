// Port di src/pages/Clienti.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - window.history
//  - window.addEventListener
//  - window.removeEventListener
//  - window.innerWidth
//  - document.addEventListener
//  - document.removeEventListener
import { invalidateFullTables } from '@/web/lib/query-client';
import React, { useState, useRef, useEffect, useMemo, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from '@/ui/motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { preloadImages } from '@/legacy/utils/imageCache';
import PageTitle from '@/web/components/shared/PageTitle';
import { base44 } from '@/lib/base44';
import { useAuth } from '@/lib/auth';
import { useViewAsPromoter } from '@/lib/viewAs';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Plus, Search, Users, Trash2, BarChart2, Upload, RotateCcw, X, Link2, Wallet, GitBranch, Filter, MapPin, AlertCircle, ChevronDown, UserPlus, CalendarPlus, Table2, Trophy } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import SortPills from '@/web/components/shared/SortPills';
import { useStickySentinel } from '@/web/hooks/useStickySentinel';
import { useStickyTabScroll } from '@/web/hooks/useStickyTabScroll';
import { stickyGlassStyle } from '@/legacy/utils/stickyGlass';
import { useStickyTabFlash } from '@/web/hooks/useStickyTabFlash';
import { useSetStickyHeader } from '@/web/lib/stickyHeaderContext';
import { makeTapHandlers } from '@/web/lib/tapHandlers';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/menu';
import ContactReminderDialog from '@/web/components/client/ContactReminderDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/menu';

import { useNavigate, useLocation } from '@/web/router';
import EmptyState from '@/web/components/shared/EmptyState';
import ClientFormDialog from '@/web/components/client/ClientFormDialog';
import ImportaClientiDialog from '@/web/components/client/ImportaClientiDialog';
import ParcoPaganti from '@/web/components/client/ParcoPaganti';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/ui/dialog';
import EditAttendanceDialog from '@/web/components/client/EditAttendanceDialog';
import AttendanceHubDialog from '@/web/components/client/AttendanceHubDialog';
import ClientDetailDialog from '@/web/components/client/ClientDetailDialog';
import ClientRowCard from '@/web/components/client/ClientRowCard';
import VirtualizedClientList from '@/web/components/client/VirtualizedClientList';
import ClientStatsBar from '@/web/components/client/ClientStatsBar';
import ClientFamilyTree from '@/web/components/client/ClientFamilyTree';
import ClientScrollSearch from '@/web/components/client/ClientScrollSearch';
const ClientiAnalytics = React.lazy(() => import('@/web/pages/ClientiAnalytics'));
import ClientMap from '@/web/components/client/ClientMap';
import ClientGroupsView from '@/web/components/client/ClientGroupsView';
import ClientTabelleTab from '@/web/components/client/ClientTabelleTab';

import { buildClientStatsMap, buildClientBadgesMap, buildEnrichedClients } from '@/legacy/utils/clientPrecomputed';
import { computeClientRanking } from '@/legacy/utils/clientRanking';
import DesktopClientTable from '@/web/components/client/DesktopClientTable';
import ClientGrowthLeague from '@/web/components/programmazione/ClientGrowthLeague';
import ClientSerateMenu from '@/web/components/programmazione/ClientSerateMenu';
import ScrollToTopButton from '@/web/components/shared/ScrollToTopButton';
import BulkActions from '@/web/components/client/BulkActions';
import { BulkSelectionProvider, useBulkSelection } from '@/web/lib/bulkSelectionContext';
import { useProgrammazionePlan } from '@/web/hooks/useProgrammazionePlan';
import { useUpcomingSerate } from '@/web/hooks/useUpcomingSerate';
import { useSerateFittizie } from '@/web/hooks/useSerateFittizie';
import { useBackTab } from '@/web/hooks/useBackTab';
import { useOverlay } from '@/web/lib/overlayStackContext';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

const MISSING_FILTERS = [
  { key: 'no_phone', label: 'Senza Tel.', check: (c) => !c.phone },
  { key: 'no_instagram', label: 'Senza IG', check: (c) => !c.instagram },
  { key: 'no_location', label: 'Senza Zona', check: (c) => !c.residenza_key }
];

const TABS = [
  { key: 'clienti', label: 'Clienti', icon: Users },
  { key: 'gruppi', label: 'Gruppi', icon: Link2 },
  { key: 'parco', label: 'Parco Paganti', icon: Wallet },
  { key: 'albero', label: 'Albero', icon: GitBranch },
  { key: 'tabelle', label: 'Tabelle', icon: Table2 },
  { key: 'growth', label: 'Growth', icon: Trophy },
  { key: 'analitica', label: 'Analitica', icon: BarChart2 },
  { key: 'mappa', label: 'Mappa', icon: MapPin }
];

export default function Clienti() {
  const { user } = useAuth();
  const { effectivePromoterId: promoterId } = useViewAsPromoter();
  const navigate = useNavigate();
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deletedClient, setDeletedClient] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editAttendance, setEditAttendance] = useState(null);
  const [addPresenceClient, setAddPresenceClient] = useState(null);
  const [detailClient, setDetailClient] = useState(null);
  const [detailOpenedFromRecontact, setDetailOpenedFromRecontact] = useState(false);
  const [detailOpenedFromLeaders, setDetailOpenedFromLeaders] = useState(false);
  const detailCloseRef = useRef(null);

  // Deep linking operativo: target cliente/presenza da aprire appena i dati sono pronti
  const [pendingClient, setPendingClient] = useState(null);
  const [pendingPresence, setPendingPresence] = useState(null);
  const [sortBy, setSortBy] = useState('visits');
  const [missingFilter, setMissingFilter] = useState(null);
  const [missingFilterPopoverOpen, setMissingFilterPopoverOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => window.history.state?._tab || 'clienti');
  const [rootClientId, setRootClientId] = useState('all');
  const [attendanceHubOpen, setAttendanceHubOpen] = useState(false);
  const [reminderClient, setReminderClient] = useState(null);
  const qc = useQueryClient();
  const [glSearch, setGlSearch] = useState('');
  const [glSearchOpen, setGlSearchOpen] = useState(false);
  const [scrollToClientId, setScrollToClientId] = useState(null);
  const [highlightClientId, setHighlightClientId] = useState(null);
  const highlightTimerRef = useRef(null);

  // Quando l'utente seleziona un cliente dalla ricerca flottante, scrolla alla
  // riga E attiva il flash viola di evidenziazione per 2.5s.
  const handleScrollToClient = useCallback((id) => {
    setScrollToClientId(id);
    setHighlightClientId(id);
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(() => setHighlightClientId(null), 2500);
  }, []);

  useEffect(() => () => {
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
  }, []);

  const { upcomingDates } = useUpcomingSerate();
  const serateFittizie = useSerateFittizie();
  const { addToPlan } = useProgrammazionePlan(promoterId);

  const mergedUpcomingDates = useMemo(() => {
    const custom = serateFittizie
      .map((s) => {
        let dateObj;
        try {
          dateObj = new Date(s.date + 'T00:00:00');
        } catch {
          dateObj = new Date(NaN);
        }
        return {
          id: s.id,
          dateStr: s.date,
          dow: null,
          dayLabel: s.name,
          venueName: null,
          logoUrl: '',
          dateObj
        };
      })
      .filter((d) => !isNaN(d.dateObj.getTime()));

    return [...custom, ...upcomingDates].sort((a, b) => a.dateObj - b.dateObj);
  }, [upcomingDates, serateFittizie]);

  const handleProgAdd = (client, dateItem) => {
    if (!dateItem) return;
    let subtitle;
    try {
      subtitle = format(dateItem.dateObj, 'd MMM yyyy', { locale: it });
    } catch {
      subtitle = dateItem.dateStr;
    }
    if (dateItem.venueName) subtitle += ` · ${dateItem.venueName}`;
    else if (dateItem.dow === null) subtitle += ' · Extra';

    addToPlan(
      dateItem.dateStr,
      {
        title: `${dateItem.dayLabel}${dateItem.venueName ? ' · ' + dateItem.venueName : ''}`,
        subtitle
      },
      client
    );
  };

  const handleProgAddCustom = async (client, name, dateStr) => {
    const exists = serateFittizie.some((s) => s.name === name && s.date === dateStr);

    if (!exists) {
      qc.setQueryData(
        ['serate-fittizie'],
        (old = []) => [...old, { id: 'opt-' + Date.now(), name, date: dateStr }]
      );

      try {
        await base44.entities.SerataFittizia.create({ name, date: dateStr });
      } catch {}

      qc.invalidateQueries({ queryKey: ['serate-fittizie'] });
    }

    let subtitle = dateStr;

    try {
      subtitle = format(
        new Date(dateStr + 'T00:00:00'),
        'd MMM yyyy',
        { locale: it }
      ) + ' · Extra';
    } catch {}

    addToPlan(dateStr, { title: name, subtitle }, client);
  };

  const handleDeleteFittizia = async (id) => {
    if (!id) return;

    qc.setQueryData(
      ['serate-fittizie'],
      (old = []) => old.filter((s) => s.id !== id)
    );

    try {
      await base44.entities.SerataFittizia.delete(id);
    } catch {}

    qc.invalidateQueries({ queryKey: ['serate-fittizie'] });
  };

  const handleAddToGroup = async (group, client) => {
    const ids = group.client_ids || [];
    if (ids.includes(client.id)) return;

    // Optimistic: aggiorna la cache subito
    const prev = qc.getQueryData(['client-groups', promoterId]);
    qc.setQueryData(['client-groups', promoterId], (old = []) =>
      old.map(g => g.id === group.id ? { ...g, client_ids: [...ids, client.id] } : g)
    );
    try {
      await base44.entities.ClientGroup.update(group.id, { client_ids: [...ids, client.id] });
    } catch {
      qc.setQueryData(['client-groups', promoterId], prev);
      return;
    }
    qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
  };

  const handleRemoveFromGroup = async (group, client) => {
    const ids = group.client_ids || [];
    if (!ids.includes(client.id)) return;

    // Optimistic: aggiorna la cache subito
    const prev = qc.getQueryData(['client-groups', promoterId]);
    qc.setQueryData(['client-groups', promoterId], (old = []) =>
      old.map(g => g.id === group.id ? { ...g, client_ids: ids.filter(id => id !== client.id) } : g)
    );
    try {
      await base44.entities.ClientGroup.update(group.id, { client_ids: ids.filter(id => id !== client.id) });
    } catch {
      qc.setQueryData(['client-groups', promoterId], prev);
      return;
    }
    qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
  };

  const handleCreateGroup = async (name, client) => {
    if (!name?.trim() || !promoterId) return;

    await base44.entities.ClientGroup.create({
      promoter_id: promoterId,
      name: name.trim(),
      client_ids: [client.id]
    });

    qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
  };

  const handlePasteClientPhoto = async (clientId, url) => {
    // Ottimistico: aggiorna la cache immediatamente (foto visibile al volo)
    qc.setQueriesData(
      { queryKey: ['clients', promoterId] },
      (old) => {
        if (!Array.isArray(old)) return old;

        return old.map((c) =>
          c.id === clientId
            ? { ...c, photo_url: url }
            : c
        );
      }
    );

    try {
      await base44.entities.Client.update(clientId, { photo_url: url });
      qc.invalidateQueries({ queryKey: ['clients', promoterId] });
    } catch (e) {
      qc.invalidateQueries({ queryKey: ['clients', promoterId] });
    }
  };

  // ── Azioni massive (selezione multipla) ──
  const handleBulkAddToGroup = async (group, clientsList) => {
    const ids = new Set(group.client_ids || []);
    clientsList.forEach((c) => ids.add(c.id));

    // Optimistic
    const prev = qc.getQueryData(['client-groups', promoterId]);
    qc.setQueryData(['client-groups', promoterId], (old = []) =>
      old.map(g => g.id === group.id ? { ...g, client_ids: Array.from(ids) } : g)
    );
    try {
      await base44.entities.ClientGroup.update(group.id, { client_ids: Array.from(ids) });
    } catch {
      qc.setQueryData(['client-groups', promoterId], prev);
      return;
    }
    qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
    clearSelection();
  };

  const handleBulkCreateGroup = async (name, clientsList) => {
    if (!name?.trim() || !promoterId) return;

    // Optimistic: aggiungi il gruppo con ID temporaneo
    const tempId = 'opt-' + Date.now();
    const tempGroup = { id: tempId, promoter_id: promoterId, name: name.trim(), client_ids: clientsList.map(c => c.id) };
    const prev = qc.getQueryData(['client-groups', promoterId]);
    qc.setQueryData(['client-groups', promoterId], (old = []) => [...old, tempGroup]);
    try {
      await base44.entities.ClientGroup.create({
        promoter_id: promoterId, name: name.trim(), client_ids: clientsList.map(c => c.id)
      });
    } catch {
      qc.setQueryData(['client-groups', promoterId], prev);
      return;
    }
    qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
    clearSelection();
  };

  const handleBulkSetReminders = async (clientsList, datetime) => {
    if (!promoterId || !datetime) return;

    await base44.entities.ContactReminder.bulkCreate(
      clientsList.map((c) => ({
        promoter_id: promoterId,
        client_id: c.id,
        client_name: c.name,
        reminder_datetime: datetime
      }))
    );

    qc.invalidateQueries({ queryKey: ['contact-reminders', promoterId] });
    clearSelection();
  };

  const handleBulkAddToSerata = (dateItem, clientsList) => {
    let subtitle;

    try {
      subtitle = format(
        dateItem.dateObj,
        'd MMM yyyy',
        { locale: it }
      );
    } catch {
      subtitle = dateItem.dateStr;
    }

    if (dateItem.venueName) subtitle += ` · ${dateItem.venueName}`;
    else if (dateItem.dow === null) subtitle += ' · Extra';

    clientsList.forEach((c) =>
      addToPlan(
        dateItem.dateStr,
        {
          title: `${dateItem.dayLabel}${dateItem.venueName ? ' · ' + dateItem.venueName : ''}`,
          subtitle
        },
        c
      )
    );

    clearSelection();
  };

  const tabsScrollRef = useRef(null);
  const scrollRef = useRef(null);
  const activeButtonRef = useRef(null);
  const [sentinelRef, stuck] = useStickySentinel();
  const sentinelNodeRef = useRef(null);
  const lastTabTouchRef = useRef(0);

  useStickyTabFlash(tabsScrollRef);

  const setStuckHeader = useSetStickyHeader();

  useEffect(() => {
    setStuckHeader(stuck);
  }, [stuck, setStuckHeader]);

  useEffect(() => () => setStuckHeader(false), [setStuckHeader]);

  const [clientiSearchOpen, setClientiSearchOpen] = useState(false);
  const clientiSearchSentinelRef = useRef(null);
  const [clientiSearchStuck, setClientiSearchStuck] = useState(false);

  useEffect(() => {
    const s = clientiSearchSentinelRef.current;
    const bar = tabsScrollRef.current;
    if (!s || !bar) {
      setClientiSearchStuck(false);
      return;
    }

    let offset = bar.getBoundingClientRect().bottom;

    const onIntersect = (entries) => {
      const entry = entries[0];
      setClientiSearchStuck(!entry.isIntersecting && entry.boundingClientRect.top < offset);
    };

    let io = new IntersectionObserver(onIntersect, { rootMargin: `-${offset}px 0px 0px 0px`, threshold: 0 });
    io.observe(s);

    const onResize = () => {
      offset = bar.getBoundingClientRect().bottom;
      io.disconnect();
      io = new IntersectionObserver(onIntersect, { rootMargin: `-${offset}px 0px 0px 0px`, threshold: 0 });
      io.observe(s);
    };
    window.addEventListener('resize', onResize);

    const t = setTimeout(onResize, 300);

    return () => {
      io.disconnect();
      window.removeEventListener('resize', onResize);
      clearTimeout(t);
    };
  }, [activeTab]);

  // Soglia sticky: calcolata al volo in handleTabClick dal sentinella
  // (posizione fissa nel documento), così non dipende da un ref catturato
  // in un effect con timing fragile durante il loading gate.

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1
  });

  const { data: clients = [], isLoading, isFetching: isFetchingClients } = useQuery({
    queryKey: ['clients', promoterId],
    queryFn: () => base44.entities.Client.filter({ promoter_id: promoterId }),
    enabled: !!user,
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1
  });

  // Preload immediato delle foto clienti: avvia la decodifica non appena i
  // dati sono disponibili (senza attendere l'idle callback del preloader globale),
  // così al primo avvio le immagini sono già in cache quando le card renderizzano.
  useEffect(() => {
    const urls = clients.map(c => c.photo_url).filter(Boolean);
    if (urls.length) preloadImages(urls);
  }, [clients]);

  // ── Selezione multipla clienti ──
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const selectMode = selectedIds.size > 0;

  const toggleSelect = useCallback((client) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(client.id)) next.delete(client.id);
      else next.add(client.id);

      return next;
    });
  }, []);

  const clearSelection = useCallback(
    () => setSelectedIds(new Set()),
    []
  );

  const selectedClients = useMemo(
    () => clients.filter((c) => selectedIds.has(c.id)),
    [clients, selectedIds]
  );

  // Tasto back: torna al tab precedente; chiudi selezione multipla
  useBackTab(activeTab, setActiveTab, 'clienti');
  useOverlay(selectMode, clearSelection);

  // Desktop: click esterno sul corpo annulla selezione multipla.
  // Ignora i drag (mousedown → mousemove → mouseup): l'utente che trascina il
  // mouse non intende annullare la selezione, solo chi fa un click pulito.
  useEffect(() => {
    if (!selectMode) return;

    let downPos = null;

    const onMouseDown = (e) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const handler = (e) => {
      if (window.innerWidth < 640) return;

      // Se il mouse si è spostato tra mousedown e click, è un drag: non annullare
      if (downPos) {
        const dx = Math.abs(e.clientX - downPos.x);
        const dy = Math.abs(e.clientY - downPos.y);

        downPos = null;

        if (dx > 5 || dy > 5) return;
      }

      if (e.target.closest('[data-client-id]')) return;
      if (e.target.closest('[data-bulk-actions]')) return;
      if (e.target.closest('[data-radix-dialog-content]')) return;
      if (e.target.closest('[data-radix-popper-content-wrapper]')) return;

      clearSelection();
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('click', handler);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('click', handler);
    };
  }, [selectMode, clearSelection]);

  const myPromoter = promoterId
    ? promoters.find((p) => p.id === promoterId) ?? null
    : null;

  const { data: attendances = [] } = useQuery({
    queryKey: ['attendances', promoterId],
    queryFn: () => base44.entities.EventAttendance.filter({ promoter_id: promoterId }, '-created_date', 5000),
    enabled:
      (
        activeTab === 'clienti' ||
        activeTab === 'albero' ||
        activeTab === 'mappa' ||
        activeTab === 'tabelle'
      ) &&
      clients.length > 0,
    staleTime: 5 * 60000,
    gcTime: 10 * 60000,
    refetchOnWindowFocus: false,
    retry: 1
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    enabled:
      (
        activeTab === 'clienti' ||
        activeTab === 'albero' ||
        activeTab === 'mappa' ||
        activeTab === 'tabelle'
      ) &&
      clients.length > 0,
    staleTime: 5 * 60000,
    gcTime: 10 * 60000,
    refetchOnWindowFocus: false,
    retry: 1
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['client-groups', promoterId],
    queryFn: () => base44.entities.ClientGroup.filter({ promoter_id: promoterId }),
    enabled: !!user,
    staleTime: 5 * 60000,
    gcTime: 10 * 60000,
    refetchOnWindowFocus: false,
    retry: 1
  });

  const retryDelay = (attempt) =>
    Math.min(1000 * Math.pow(2, attempt), 10000);

  const createMut = useMutation({
    mutationFn: (d) => base44.entities.Client.create(d),
    onMutate: async (data) => {
      // Optimistic: aggiungi il cliente con ID temporaneo
      await qc.cancelQueries({ queryKey: ['clients', promoterId] });
      const prev = qc.getQueryData(['clients', promoterId]);
      const tempClient = { ...data, id: 'opt-' + Date.now(), created_date: new Date().toISOString(), updated_date: new Date().toISOString() };
      qc.setQueryData(['clients', promoterId], (old) => Array.isArray(old) ? [...old, tempClient] : old);
      return { prev };
    },
    onError: (err, _d, ctx) => {
      if (ctx?.prev) qc.setQueryData(['clients', promoterId], ctx.prev);
      console.error('Errore creazione client:', err);
      alert('Errore nel salvataggio del cliente: ' + (err?.message || 'Errore sconosciuto'));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients', promoterId] });
      setDialogOpen(false);
      setEditing(null);
    },
    retry: 1
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Client.update(id, data),
    onMutate: async ({ id, data }) => {
      // Optimistic: patcha il cliente nella cache subito
      await qc.cancelQueries({ queryKey: ['clients', promoterId] });
      const prev = qc.getQueryData(['clients', promoterId]);
      qc.setQueryData(['clients', promoterId], (old) => Array.isArray(old) ? old.map(c => c.id === id ? { ...c, ...data } : c) : old);
      return { prev };
    },
    onError: (_e, _d, ctx) => {
      if (ctx?.prev) qc.setQueryData(['clients', promoterId], ctx.prev);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients', promoterId] });
      setDialogOpen(false);
      setEditing(null);
    },
    retry: 1
  });

  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.Client.delete(id),
    onMutate: async (id) => {
      // Optimistic: rimuovi il cliente dalla cache subito
      await qc.cancelQueries({ queryKey: ['clients', promoterId] });
      const prev = qc.getQueryData(['clients', promoterId]);
      const deleted = prev?.find(c => c.id === id);
      qc.setQueryData(['clients', promoterId], (old) => Array.isArray(old) ? old.filter(c => c.id !== id) : old);
      return { prev, deleted };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['clients', promoterId], ctx.prev);
    },
    onSuccess: (_data, _id, ctx) => {
      qc.invalidateQueries({ queryKey: ['clients', promoterId] });
      setDeleteId(null);
      if (ctx?.deleted) setDeletedClient(ctx.deleted);
    },
    retry: 1
  });

  const handleUndo = async () => {
    if (!deletedClient) return;

    const {
      promoter_id,
      name,
      phone,
      instagram,
      notes,
      new_people_brought,
      is_leader
    } = deletedClient;

    await base44.entities.Client.create({
      promoter_id,
      name,
      phone,
      instagram,
      notes,
      new_people_brought,
      is_leader
    });

    qc.invalidateQueries({ queryKey: ['clients', promoterId] });
    setDeletedClient(null);
  };

  const handleSave = (form) => {
    if (editing) {
      updateMut.mutate({
        id: editing.id,
        data: form
      });
    } else {
      createMut.mutate({
        ...form,
        promoter_id: promoterId
      });
    }
  };

  const handleContact = async (clientId) => {
    const now = new Date().toISOString();
    // Optimistic: aggiorna subito la cache (UI istantanea)
    qc.setQueryData(['clients', promoterId], (old) => {
      if (!Array.isArray(old)) return old;
      return old.map(c => c.id === clientId ? { ...c, last_contacted_at: now } : c);
    });
    try {
      await base44.entities.Client.update(clientId, { last_contacted_at: now });
    } catch {
      // Rollback su errore
      qc.invalidateQueries({ queryKey: ['clients', promoterId] });
      return;
    }
    qc.invalidateQueries({ queryKey: ['clients', promoterId] });
  };

  const handleToggleClientField = async (client, patch) => {
    // Optimistic: aggiorna subito la cache (toggle istantaneo)
    qc.setQueryData(['clients', promoterId], (old) => {
      if (!Array.isArray(old)) return old;
      return old.map(c => c.id === client.id ? { ...c, ...patch } : c);
    });
    try {
      await base44.entities.Client.update(client.id, patch);
    } catch {
      // Rollback su errore
      qc.setQueryData(['clients', promoterId], (old) => {
        if (!Array.isArray(old)) return old;
        return old.map(c => c.id === client.id ? { ...client } : c);
      });
      return;
    }
    qc.invalidateQueries({ queryKey: ['clients', promoterId] });
  };

  // ── Statistiche pre-calcolate dal backend (campi cum_* sui record Client) ──
  // I calcoli pesanti (raggruppamento presenze, conteggi giorno per giorno)
  // sono già fatti dal backend. Le presenze restano solo per il detail dialog.
  const clientStatsMap = useMemo(() => {
    const map = buildClientStatsMap(clients);

    const eventsById = Object.fromEntries(
      events.map((e) => [e.id, e])
    );

    // Override live dalle presenze reali: aggiorna istantaneamente visite/spesa
    // senza aspettare il ricalcolo backend (cum_*), che arriva in background.
    if (attendances.length > 0) {
      const attByClient = {};

      for (const a of attendances) {
        if (!a.client_id) continue;
        (attByClient[a.client_id] ||= []).push(a);
      }

      for (const id of Object.keys(map)) {
        const atts = attByClient[id];
        if (!atts) continue;

        let visits = 0,
          totalSpent = 0,
          fri = 0,
          sat = 0,
          sun = 0,
          extra = 0;

        for (const a of atts) {
          visits++;

          const ev = eventsById[a.event_id];
          if (!ev) continue;

          totalSpent += a.revenue || 0;

          if (ev.is_extra) {
            extra++;
            continue;
          }

          if (!ev.date) continue;

          const [y, m, d] = ev.date.split('-').map(Number);
          const dow = new Date(y, m - 1, d).getDay();

          if (dow === 5) fri++;
          else if (dow === 6) sat++;
          else if (dow === 0) sun++;
        }

        map[id] = {
          ...map[id],
          visits,
          totalSpent: Math.round(totalSpent),
          avgSpent: visits > 0
            ? Math.round(totalSpent / visits)
            : 0,
          fri,
          sat,
          sun,
          extra,
          attendances: atts
        };
      }
    }

    // Rating live: ricalcola il punteggio 1-10 dai dati presenze aggiornati,
    // senza aspettare il ricalcolo backend (cum_rating). Per i clienti con
    // presenze live usa computeClientRanking; per gli altri (nessuna presenza
    // nell'array attuale) ricade sul cum_rating pre-calcolato.
    const clientsById = Object.fromEntries(clients.map((c) => [c.id, c]));
    for (const id of Object.keys(map)) {
      const client = clientsById[id];
      if (!client) continue;
      const stats = map[id];
      if (stats.attendances && stats.attendances.length > 0) {
        map[id].rating = computeClientRanking(client, stats, events, eventsById);
      } else {
        map[id].rating = stats.visits > 0 ? (client.cum_rating || 0) : null;
      }
    }

    return map;
  }, [clients, attendances, events]);

  const enriched = useMemo(() => {
    if (activeTab !== 'growth') return [];
    return buildEnrichedClients(clients);
  }, [clients, activeTab]);

  const getClientStats = (id) =>
    clientStatsMap[id] ?? {
      visits: 0,
      fri: 0,
      sat: 0,
      sun: 0,
      extra: 0,
      totalSpent: 0,
      avgSpent: 0,
      attendances: [],
      rating: null
    };

  // Radici dell'albero per il selettore
  const treeRoots = useMemo(() => {
    const byId = Object.fromEntries(
      clients.map((c) => [c.id, c])
    );

    const hasChildren = new Set();
    const hasParent = new Set();

    clients.forEach((c) => {
      if (
        c.referred_by_client_id &&
        byId[c.referred_by_client_id]
      ) {
        hasChildren.add(c.referred_by_client_id);
        hasParent.add(c.id);
      }
    });

    return clients
      .filter((c) => hasChildren.has(c.id))
      .sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      );
  }, [clients]);

  // Clienti filtrati per radice selezionata (solo per albero)
  const treeClients = useMemo(() => {
    if (rootClientId === 'all') return clients;

    const byId = Object.fromEntries(
      clients.map((c) => [c.id, c])
    );

    // Raccogli il sottoalbero: radice + tutti i discendenti
    const included = new Set();
    const stack = [rootClientId];

    while (stack.length) {
      const id = stack.pop();
      included.add(id);

      clients
        .filter((c) => c.referred_by_client_id === id)
        .forEach((c) => stack.push(c.id));
    }

    return clients.filter((c) => included.has(c.id));
  }, [clients, rootClientId]);

  // Centra il tab attivo nella barra
  const scrollToActiveTab = useCallback(() => {
    if (scrollRef.current && activeButtonRef.current) {
      const container = scrollRef.current;
      const btn = activeButtonRef.current;

      container.scrollTo({
        left:
          btn.offsetLeft -
          container.offsetWidth / 2 +
          btn.offsetWidth / 2,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(scrollToActiveTab, 50);
    return () => clearTimeout(t);
  }, [activeTab, scrollToActiveTab]);

  // Logica standardizzata di scroll al cambio tab (vedi useStickyTabScroll).
  const { scrollToTab } = useStickyTabScroll(
    stuck,
    tabsScrollRef
  );

  const handleTabClick = (key) => {
    setActiveTab(key);
    scrollToTab();
  };

  const getPromoterName = (id) =>
    promoters.find((p) => p.id === id)?.name || '-';

  // Auto-focus sulla barra di ricerca
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  const refocusSearch = () => {
    setTimeout(() => {
      searchRef.current?.focus({ preventScroll: true });
    }, 80);
  };

  // Rileva se siamo su desktop (larghezza >= 640px)
  const isDesktop = () => window.innerWidth >= 640;

  // Focus iniziale quando la lista è pronta (solo desktop)
  useEffect(() => {
    if (
      activeTab === 'clienti' &&
      clients.length > 0 &&
      isDesktop()
    ) {
      refocusSearch();
    }
  }, [activeTab, clients.length]);

  // Re-focus dopo chiusura dialogs (solo desktop)
  useEffect(() => {
    if (!addPresenceClient && isDesktop()) refocusSearch();
  }, [addPresenceClient]);

  useEffect(() => {
    if (!editAttendance && isDesktop()) refocusSearch();
  }, [editAttendance]);

  useEffect(() => {
    if (!dialogOpen && isDesktop()) refocusSearch();
  }, [dialogOpen]);

  useEffect(() => {
    if (!importOpen && isDesktop()) refocusSearch();
  }, [importOpen]);

  useEffect(() => {
    if (!detailClient && isDesktop()) refocusSearch();
  }, [detailClient]);

  useEffect(() => {
    if (!missingFilterPopoverOpen && isDesktop()) refocusSearch();
  }, [missingFilterPopoverOpen]);

  // ── Back button Android: ogni dialog si registra nello stack overlay globale
  // (OverlayStackContext). Niente stack locale parallelo: causava doppi popstate
  // che chiudevano hub + detail insieme. AttendanceHubDialog e ClientDetailDialog
  // usano già useOverlay internamente, quindi qui registriamo solo i dialog Radix
  // che non si autoregistrano.
  const [leadersDialogOpen, setLeadersDialogOpen] = useState(false);

  useOverlay(dialogOpen, () => setDialogOpen(false));
  useOverlay(importOpen, () => setImportOpen(false));
  useOverlay(!!editAttendance, () => setEditAttendance(null));
  useOverlay(!!addPresenceClient, () => setAddPresenceClient(null));
  useOverlay(!!deleteId, () => setDeleteId(null));
  useOverlay(leadersDialogOpen, () => setLeadersDialogOpen(false));

  // Re-focus dopo qualsiasi click sulla pagina
  // (solo desktop, esclusi i dialog aperti)
  const anyDialogOpen =
    dialogOpen ||
    importOpen ||
    !!editAttendance ||
    !!addPresenceClient ||
    !!detailClient ||
    !!deleteId ||
    attendanceHubOpen ||
    missingFilterPopoverOpen;

  // Overlay custom full-screen (z-9999) che coprono la sticky bar (z-20).
  // I dialog Radix hanno l'overlay a z-10 (sotto la sticky) quindi non la coprono.
  // Usato per fade morbido della sticky bar all'apertura/chiusura.
  // Dettaglio cliente e hub Aggiungi Presenze sono ora popup centrati: la sticky
  // bar resta incollata e visibile (solo scurita dall'overlay), mai sparisce.
  // L'overlay copre la barra, quindi basta disattivarne i tocchi.
  const popupOverlayOpen = !!detailClient || attendanceHubOpen;

  const handlePageClick = () => {
    if (!anyDialogOpen && isDesktop()) refocusSearch();
  };

  // Memoizzati: ricalcolati solo quando cambiano clienti/statistiche,
  // non ad ogni render
  const clientBadges = useMemo(
    () => buildClientBadgesMap(clients),
    [clients]
  );

  const filtered = useMemo(() => {
    const activeMissingCheck =
      MISSING_FILTERS.find(
        (f) => f.key === missingFilter
      )?.check;

    return clients
      .filter(
        (c) =>
          c.name
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          c.instagram
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase())
      )
      .filter(
        (c) =>
          !activeMissingCheck ||
          activeMissingCheck(c)
      )
      .sort((a, b) => {
        if (sortBy === 'alpha') {
          return (a.name || '').localeCompare(b.name || '');
        }

        if (sortBy === 'visits') {
          return (
            getClientStats(b.id).visits -
            getClientStats(a.id).visits
          );
        }

        if (sortBy === 'spent') {
          return (
            getClientStats(b.id).totalSpent -
            getClientStats(a.id).totalSpent
          );
        }

        if (sortBy === 'newpeople') {
          return (
            (b.new_people_brought || 0) -
            (a.new_people_brought || 0)
          );
        }

        if (sortBy === 'rating') {
          return (
            (getClientStats(b.id).rating || 0) -
            (getClientStats(a.id).rating || 0)
          );
        }

        return 0;
      });
  }, [
    clients,
    debouncedSearch,
    sortBy,
    missingFilter,
    clientStatsMap,
    events
  ]);

  // TUTTI i clienti ordinati come la lista
  // (senza filtri ricerca/dati mancanti).
  // Passato a ClientSerateMenu così la posizione nella card di condivisione usa
  // lo STESSO ordinamento della lista clienti (visits/rating/spesa/ecc), non solo
  // cum_rating. Senza questo la card mostrerebbe sempre il rank per rating anche
  // quando la lista è ordinata per presenze → mismatch.
  const sortedAllClients = useMemo(() => {
    return [...clients].sort((a, b) => {
      if (sortBy === 'alpha') {
        return (a.name || '').localeCompare(b.name || '');
      }

      if (sortBy === 'visits') {
        return (
          getClientStats(b.id).visits -
          getClientStats(a.id).visits
        );
      }

      if (sortBy === 'spent') {
        return (
          getClientStats(b.id).totalSpent -
          getClientStats(a.id).totalSpent
        );
      }

      if (sortBy === 'newpeople') {
        return (
          (b.new_people_brought || 0) -
          (a.new_people_brought || 0)
        );
      }

      if (sortBy === 'rating') {
        return (
          (getClientStats(b.id).rating || 0) -
          (getClientStats(a.id).rating || 0)
        );
      }

      return 0;
    });
  }, [clients, sortBy, clientStatsMap, events]);

  const selectAll = useCallback(
    () => setSelectedIds(
      new Set(filtered.map((c) => c.id))
    ),
    [filtered]
  );

  // Context value per la selezione multipla
  // (letto da BulkActions e liste)
  const bulkValue = {
    selectedIds,
    selectMode,
    toggleSelect,
    clearSelection,
    selectAll,
    selectedClients,
    totalFiltered: filtered.length,
    allClients: clients,
    groups,
    upcomingDates: mergedUpcomingDates,
    onBulkAddToGroup: handleBulkAddToGroup,
    onBulkCreateGroup: handleBulkCreateGroup,
    onBulkSetReminders: handleBulkSetReminders,
    onBulkAddToSerata: handleBulkAddToSerata,
    clientStatsMap,
    clientBadges
  };

  // Scrolla per portare la barra di ricerca in vista su iOS
  // (la tastiera la coprirebbe)
  useEffect(() => {
    if (!debouncedSearch || !searchRef.current) return;

    // Su iOS scrollIntoView con block:'center' porta il campo al centro,
    // così i primi risultati restano visibili sopra la tastiera
    setTimeout(() => {
      searchRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 150);
  }, [debouncedSearch]);


  // Debounce ricerca: aggiorna debouncedSearch 200ms
  // dopo che l'utente smette di digitare
  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(search),
      200
    );

    return () => clearTimeout(t);
  }, [search]);

  // Azzera la selezione multipla al cambio tab o ricerca/ordinamento
  useEffect(() => {
    clearSelection();
  }, [activeTab, debouncedSearch, sortBy]);

  // Deep linking operativo: ?recontact=1 (dialog ricontatti),
  // ?client=ID (detail), ?presence=ID (aggiungi presenza).
  // I target cliente/presenza vengono aperti appena la lista clienti
  // è disponibile (vedi effetti sotto).
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const cId = params.get('client');

    if (cId) {
      setPendingClient(cId);
      navigate('/clienti', { replace: true });
    }

    const pId = params.get('presence');

    if (pId) {
      setPendingPresence(pId);
      navigate('/clienti', { replace: true });
    }
  }, [location.search]);

  useEffect(() => {
    if (!pendingClient || clients.length === 0) return;

    const c = clients.find(
      (x) => x.id === pendingClient
    );

    if (c) setDetailClient(c);

    setPendingClient(null);
  }, [pendingClient, clients]);

  useEffect(() => {
    if (!pendingPresence || clients.length === 0) return;

    const c = clients.find(
      (x) => x.id === pendingPresence
    );

    if (c) {
      const stats = getClientStats(c.id);

      setAddPresenceClient({
        client: c,
        attendances: stats.attendances
      });
    }

    setPendingPresence(null);
  }, [pendingPresence, clients]);

  if (!user) {
    return (
      <Div className="flex items-center justify-center h-64">
        <Div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </Div>
    );
  }

  const _content =
    <Btn
      className="space-y-3 pb-8"
      onClick={handlePageClick}
    >
      {/* Banner Annulla eliminazione */}
      {deletedClient &&
        <Div className="dash-fade-up flex items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3"
          style={{ boxShadow: '0 0 20px rgba(251,191,36,0.1)' }}
        >
            <Div className="flex items-center gap-2 text-sm">
              <Trash2 className="w-4 h-4 text-amber-400 shrink-0" />

              <Span>
                <Span className="font-semibold text-amber-300">
                  {deletedClient.name}
                </Span>{' '}
                eliminato.
              </Span>
            </Div>

            <Div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 h-7 text-xs gap-1.5"
                onClick={handleUndo}
              >
                <RotateCcw className="w-3 h-3" />
                Annulla
              </Button>

              <Btn
                onClick={() => setDeletedClient(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Btn>
            </Div>
        </Div>
      }

      {/* Header */}
      <PageTitle title="Clienti" />

      {/* Tab bar */}
      <Div
        ref={(node) => {
          sentinelRef(node);
          sentinelNodeRef.current = node;
        }}
        style={{
          height: 1,
          marginTop: 0,
          padding: 0,
          border: 'none'
        }} />

      <Div
        ref={tabsScrollRef}
        className={`dash-fade-up group sticky top-[env(safe-area-inset-top)] z-20 overflow-hidden pt-4 pb-1.5 -mx-4 px-4 border-b ${
          stuck ? 'border-border is-stuck' : 'border-transparent'
        }`}
        style={{
          marginTop: 0,
          pointerEvents: popupOverlayOpen ? 'none' : 'auto'
        }}
      >
        <Div
          className="sticky-glass absolute inset-0"
          style={{
            ...stickyGlassStyle(stuck),
            transition:
              'backdrop-filter 0.2s ease, -webkit-backdrop-filter 0.2s ease, background-color 0.2s ease'
          }} />

        {/* MODIFICA: il corpo della sticky bar ora entra/esce
            con una transizione morbida di opacity + posizione + scala */}
        <Div
          className="sticky-bar-body relative flex items-center gap-2"
          style={{
            transition:
              'opacity 220ms ease, transform 220ms ease',
            opacity: stuck ? 1 : 0.92,
            transform: stuck
              ? 'translateY(0) scale(1)'
              : 'translateY(-3px) scale(0.995)',
            transformOrigin: 'top center'
          }}
        >
          <Div
            ref={scrollRef}
            className="relative overflow-x-auto overflow-y-hidden flex-1 min-w-0"
            style={{
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x',
              overscrollBehaviorX: 'contain'
            }}
          >
            <Div className="relative flex gap-1 bg-secondary/30 p-1 rounded-xl w-max min-w-full">
              {TABS.map(
                ({
                  key,
                  label,
                  icon: TabIcon
                }) =>
                  <Btn
                    key={key}
                    ref={
                      activeTab === key
                        ? activeButtonRef
                        : null
                    }
                    {...makeTapHandlers(
                      lastTabTouchRef,
                      () => handleTabClick(key)
                    )}
                    className={`cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === key
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    {label}
                  </Btn>
              )}
            </Div>
          </Div>

          <AnimatePresence>
            {clientiSearchStuck &&
              activeTab === 'clienti' &&
              <motion.button
                key="clienti-search-btn"
                initial={{
                  opacity: 0,
                  scale: 0.8
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8
                }}
                transition={{
                  duration: 0.25
                }}
                onClick={() =>
                  setClientiSearchOpen((v) => !v)
                }
                className={`shrink-0 p-2 rounded-lg border transition-colors ${
                  clientiSearchOpen
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
                title="Cerca cliente"
              >
                <Search className="w-4 h-4" />
              </motion.button>
            }
          </AnimatePresence>
        </Div>

        {clientiSearchStuck &&
          activeTab === 'clienti' &&
          clientiSearchOpen &&
          <Div className="relative overflow-hidden">
            <Div className="relative pt-1.5">
              <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />

              <HtmlInput
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Cerca cliente..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-secondary/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </Div>
          </Div>
        }
      </Div>

      {activeTab === 'gruppi' &&
        <Div className="dash-fade-up min-h-[calc(100dvh-7.5rem)]">
          <ClientGroupsView />
        </Div>
      }

      {activeTab === 'parco' &&
        <Div className="dash-fade-up min-h-[calc(100dvh-7.5rem)]">
          <ParcoPaganti promoterId={user?.id} />
        </Div>
      }

      {activeTab === 'analitica' &&
        <Div className="dash-fade-up min-h-[calc(100dvh-7.5rem)]">
          <Suspense fallback={<Div className="flex items-center justify-center h-64"><Div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></Div>}>
            <ClientiAnalytics />
          </Suspense>
        </Div>
      }

      {activeTab === 'mappa' &&
        <Div className="dash-fade-up min-h-[calc(100dvh-7.5rem)]">
          <ClientMap
            clients={clients}
            clientStatsMap={clientStatsMap}
            events={events}
            onClientClick={(clientId) => {
              const client = clients.find(
                (c) => c.id === clientId
              );

              if (client) setDetailClient(client);
            }}
          />
        </Div>
      }

      {activeTab === 'albero' &&
        <Div className="dash-fade-up min-h-[calc(100dvh-7.5rem)] md:-mx-4 lg:-mx-8 xl:-mx-16">
          {treeRoots.length > 0 &&
            <Div className="flex items-center gap-2 md:px-4 lg:px-8 xl:px-16">
              <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />

              <Select
                value={rootClientId}
                onValueChange={setRootClientId}
              >
                <SelectTrigger className="h-8 text-xs w-full max-w-[260px] bg-card">
                  <SelectValue placeholder="Seleziona radice..." />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">
                    Tutte le radici
                  </SelectItem>

                  {treeRoots.map((c) =>
                    <SelectItem
                      key={c.id}
                      value={c.id}
                    >
                      {c.name}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

              {rootClientId !== 'all' &&
                <Btn
                  onClick={() =>
                    setRootClientId('all')
                  }
                  className="text-[10px] text-primary hover:underline whitespace-nowrap"
                >
                  Mostra tutte
                </Btn>
              }
            </Div>
          }

          <ClientFamilyTree
            clients={treeClients}
            attendances={attendances}
            events={events}
            onClientClick={(c) =>
              setDetailClient(c)
            }
          />
        </Div>
      }

      {activeTab === 'tabelle' &&
        <Div className="dash-fade-up min-h-[calc(100dvh-7.5rem)]">
          <ClientTabelleTab
            clients={clients}
            clientStatsMap={clientStatsMap}
            events={events}
            clientBadges={clientBadges}
            onContact={handleContact}
            onDetail={(c) =>
              setDetailClient(c)
            }
          />
        </Div>
      }

      {activeTab === 'growth' &&
        <Div className="dash-fade-up min-h-[calc(100dvh-7.5rem)]">
          <ClientGrowthLeague
            rows={enriched}
            onContact={handleContact}
            onDetail={(c) =>
              setDetailClient(c)
            }
            search={glSearch}
            onSearchChange={setGlSearch}
            searchOpen={glSearchOpen}
            onToggleSearch={() =>
              setGlSearchOpen((v) => !v)
            }
          />
        </Div>
      }

      {activeTab === 'clienti' &&
        <>
          <Div className="dash-fade-up flex items-center gap-2">
            <Button
              variant="outline"
              {...makeTapHandlers(
                lastTabTouchRef,
                () => setImportOpen(true)
              )}
              title="Importa più clienti"
              className="flex-1 h-8 text-[10px] px-1.5 gap-1 justify-center"
            >
              <Upload className="w-3.5 h-3.5 shrink-0" />
              <Span className="truncate">
                Importa più clienti
              </Span>
            </Button>

            <Button
              disabled={selectMode}
              {...makeTapHandlers(
                lastTabTouchRef,
                () => {
                  if (!selectMode) {
                    setAttendanceHubOpen(true);
                  }
                }
              )}
              title="Aggiungi presenze"
              className="flex-1 h-8 text-[10px] px-1.5 gap-1 justify-center bg-[#551a8e]"
            >
              <CalendarPlus className="w-3.5 h-3.5 shrink-0" />
              <Span className="truncate">
                Aggiungi presenze
              </Span>
            </Button>

            <Button
              variant="outline"
              {...makeTapHandlers(
                lastTabTouchRef,
                () => {
                  setEditing(null);
                  setDialogOpen(true);
                }
              )}
              title="Aggiungi singolo cliente"
              className="flex-1 h-8 text-[10px] px-1.5 gap-1 justify-center"
            >
              <UserPlus className="w-3.5 h-3.5 shrink-0" />
              <Span className="truncate">
                Singolo cliente
              </Span>
            </Button>
          </Div>

          {isLoading ? (
            <Div className="flex items-center justify-center min-h-[calc(100dvh-12rem)]"><Div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></Div>
          ) : clients.length === 0 ?
            <EmptyState
              icon={Users}
              title="Nessun cliente"
              description="Aggiungi i clienti per tracciare la loro frequenza di partecipazione."
              onAction={() => setDialogOpen(true)}
              actionLabel="Aggiungi Cliente"
            />
            :
            <>
              <Div className="dash-fade-up">
                <ClientStatsBar
                  clients={clients}
                  attendances={attendances}
                  events={events}
                  onNavigateToAlbero={(clientId) => {
                    setActiveTab('albero');
                    setRootClientId(clientId);
                  }}
                  onClientClick={(c) => {
                    setDetailOpenedFromLeaders(true);
                    setDetailClient(c);
                  }}
                  leadersOpen={leadersDialogOpen}
                  onLeadersOpenChange={setLeadersDialogOpen}
                />
              </Div>

              <Div
                ref={clientiSearchSentinelRef}
                style={{
                  height: 1,
                  marginTop: 0,
                  padding: 0,
                  border: 'none'
                }} />

              {/* Cerca + Ordina */}
              <Div className="dash-fade-up flex flex-wrap items-center gap-2">
                <Div className="relative flex-1 min-w-[160px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                  <Input
                    ref={searchRef}
                    placeholder="Cerca cliente..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' &&
                        filtered.length > 0
                      ) {
                        const c = filtered[0];
                        const stats =
                          getClientStats(c.id);

                        setSearch('');

                        setAddPresenceClient({
                          client: c,
                          attendances:
                            stats.attendances
                        });
                      }
                    }}
                    className="pl-9 h-8 text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </Div>

                <Div className="flex items-center gap-1 flex-wrap">
                  <SortPills
                    label="Ordina:"
                    options={[
                      {
                        key: 'alpha',
                        label: 'A–Z'
                      },
                      {
                        key: 'visits',
                        label: 'Pres.'
                      },
                      {
                        key: 'spent',
                        label: 'Spesa'
                      },
                      {
                        key: 'newpeople',
                        label: 'Nuove'
                      },
                      {
                        key: 'rating',
                        label: 'Rating'
                      }
                    ]}
                    value={sortBy}
                    onChange={setSortBy}
                  />

                  <Popover
                    open={missingFilterPopoverOpen}
                    onOpenChange={
                      setMissingFilterPopoverOpen
                    }
                  >
                    <PopoverTrigger asChild>
                      <Btn
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        className={`relative flex items-center justify-center h-[26px] w-[26px] rounded-lg border transition-all duration-200 ${
                          missingFilter
                            ? 'border-red-400 bg-red-400/10 text-red-400'
                            : 'border-border text-muted-foreground hover:text-foreground'
                        }`}
                        accessibilityLabel="Dati mancanti"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />

                        {missingFilter &&
                          <Span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-400" />
                        }
                      </Btn>
                    </PopoverTrigger>

                    <PopoverContent
                      align="end"
                      className="w-48 p-1.5"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >
                      <P className="text-[10px] text-muted-foreground px-1.5 py-1">
                        Dati mancanti
                      </P>

                      {MISSING_FILTERS.map(
                        ({ key, label }) =>
                          <Btn
                            key={key}
                            onClick={() =>
                              setMissingFilter(
                                (prev) =>
                                  prev === key
                                    ? null
                                    : key
                              )
                            }
                            className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors ${
                              missingFilter === key
                                ? 'bg-red-400/10 text-red-400'
                                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                            }`}
                          >
                            {label}
                          </Btn>
                      )}
                    </PopoverContent>
                  </Popover>
                </Div>
              </Div>

              <Div
                ref={resultsRef}
                className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card"
                style={{ boxShadow: '0 4px 32px -8px rgba(167,139,250,0.06)' }}
              >
                <Div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-40"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, #a78bfa, transparent)'
                  }}
                />

                <Div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40">
                  <SectionHeader
                    icon={Users}
                    title="Lista Clienti"
                    color="#a78bfa"
                  />

                  <Span className="text-[11px] text-muted-foreground">
                    {filtered.length} di {clients.length}
                  </Span>
                </Div>

                {/* MOBILE: lista virtualizzata (window-based) per scroll a 60fps anche con
                    centinaia di clienti. Renderizza solo gli item nel viewport della pagina. */}
                <VirtualizedClientList
                  clients={filtered}
                  getClientStats={getClientStats}
                  clientBadges={clientBadges}
                  events={events}
                  attendances={attendances}
                  handlers={{
                    onDetail: (cl) =>
                      setDetailClient(cl),

                    onAddPresence: (cl, att) =>
                      setAddPresenceClient({
                        client: cl,
                        attendances: att
                      }),

                    onEditAttendance: (cl, att) =>
                      setEditAttendance({
                        client: cl,
                        attendances: att
                      }),

                    onEdit: (cl) => {
                      setEditing(cl);
                      setDialogOpen(true);
                    },

                    onDelete: (id) => {
                      setDeletedClient(null);
                      setDeleteId(id);
                    },

                    onSetReminder: (cl) =>
                      setReminderClient(cl)
                  }}
                  selectMode={selectMode}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                  scrollToClientId={scrollToClientId}
                  onScrolled={() =>
                    setScrollToClientId(null)
                  }
                  highlightClientId={highlightClientId}
                />

                {/* DESKTOP */}
                <Div key={debouncedSearch + sortBy} className="dash-fade-up hidden sm:block">
                  <DesktopClientTable
                    clients={filtered}
                    clientStatsMap={clientStatsMap}
                    clientBadges={clientBadges}
                    events={events}
                    attendances={attendances}
                    allClients={clients}
                    onDetail={setDetailClient}
                    onAddPresence={(c, s) =>
                      setAddPresenceClient({
                        client: c,
                        attendances: s.attendances
                      })
                    }
                    onEditAttendance={(c, s) =>
                      setEditAttendance({
                        client: c,
                        attendances: s.attendances
                      })
                    }
                    onEdit={(c) => {
                      setEditing(c);
                      setDialogOpen(true);
                    }}
                    onDelete={(id) => {
                      setDeletedClient(null);
                      setDeleteId(id);
                    }}
                    selectMode={selectMode}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                    scrollToClientId={scrollToClientId}
                    onScrolled={() =>
                      setScrollToClientId(null)
                    }
                    highlightClientId={highlightClientId}
                  />
                </Div>


              </Div>
            </>
          }

          <ScrollToTopButton />

          <ClientScrollSearch
            clients={clients}
            onScrollToClient={handleScrollToClient}
          />
        </>
      }

      <ContactReminderDialog
        client={reminderClient}
        promoterId={promoterId}
        open={!!reminderClient}
        onOpenChange={(v) => {
          if (!v) setReminderClient(null);
        }}
      />

      <AttendanceHubDialog
        open={attendanceHubOpen}
        onOpenChange={setAttendanceHubOpen}
        events={events}
        clients={clients}
        attendances={attendances}
        promoterId={promoterId}
        onClientDetail={(c) =>
          setDetailClient(c)
        }
        onSaved={() => {
          qc.refetchQueries({
            queryKey: ['attendances', promoterId]
          });

          qc.invalidateQueries({
            queryKey: ['clients', promoterId]
          });
          // Tabelle complete (Achievement/rank, Vibra VS...): stale al prossimo mount
          invalidateFullTables(qc);
        }}
      />

      <ClientFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={editing}
        onSave={handleSave}
        isLoading={
          createMut.isPending ||
          updateMut.isPending
        }
        clients={clients}
      />

      <ImportaClientiDialog
        open={importOpen}
        onOpenChange={setImportOpen}
      />

      <EditAttendanceDialog
        open={!!editAttendance}
        onOpenChange={(v) => {
          if (!v) setEditAttendance(null);
        }}
        client={editAttendance?.client}
        attendances={
          editAttendance?.attendances || []
        }
        events={events}
        promoters={promoters}
        promoterId={promoterId}
        clients={clients}
        onSaved={() => {
          qc.refetchQueries({
            queryKey: ['attendances', promoterId]
          });

          qc.invalidateQueries({
            queryKey: ['clients', promoterId]
          });
          // Tabelle complete (Achievement/rank, Vibra VS...): stale al prossimo mount
          invalidateFullTables(qc);
        }}
      />

      <EditAttendanceDialog
        open={!!addPresenceClient}
        onOpenChange={(v) => {
          if (!v) setAddPresenceClient(null);
        }}
        client={addPresenceClient?.client}
        attendances={
          addPresenceClient?.attendances || []
        }
        events={events}
        promoters={promoters}
        defaultAddMode={true}
        promoterId={promoterId}
        clients={clients}
        onSaved={() => {
          qc.refetchQueries({
            queryKey: ['attendances', promoterId]
          });

          qc.invalidateQueries({
            queryKey: ['clients', promoterId]
          });
          // Tabelle complete (Achievement/rank, Vibra VS...): stale al prossimo mount
          invalidateFullTables(qc);
        }}
      />

      {!!detailClient &&
        <ClientDetailDialog
          open={!!detailClient}
          onOpenChange={(v) => {
            if (!v) {
              setDetailClient(null);
              setDetailOpenedFromRecontact(false);
              setDetailOpenedFromLeaders(false);
            }
          }}
          client={detailClient}
          attendances={attendances}
          events={events}
          badges={
            detailClient
              ? clientBadges[detailClient.id] || []
              : []
          }
          allClients={clients}
          groups={groups}
          onClientDetail={(c) => setDetailClient(c)}
          onClientUpdated={(updated) =>
            setDetailClient(updated)
          }
          embeddedInDialog
          closeRef={detailCloseRef}
          onBack={
            detailOpenedFromRecontact ||
            detailOpenedFromLeaders
              ? () => {
                  detailCloseRef.current?.();
                }
              : null
          }
        />
      }

      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Eliminare questo cliente?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Il cliente verrà eliminato. Potrai annullare
              l'azione dopo la conferma.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Annulla
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() =>
                deleteMut.mutate(deleteId)
              }
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ClientSerateMenu
        upcomingDates={mergedUpcomingDates}
        onAdd={handleProgAdd}
        onAddCustom={handleProgAddCustom}
        onDeleteFittizia={
          user?.role === 'admin'
            ? handleDeleteFittizia
            : undefined
        }
        getClient={(id) =>
          clients.find((c) => c.id === id)
        }
        onToggleLeader={(c) =>
          handleToggleClientField(c, {
            is_leader: !c.is_leader,
            leader_since: !c.is_leader
              ? new Date().toISOString()
              : null
          })
        }
        onToggleDriver={(c) =>
          handleToggleClientField(c, {
            is_driver: !c.is_driver
          })
        }
        onMarkContacted={(c) =>
          handleContact(c.id)
        }
        groups={groups}
        onAddToGroup={handleAddToGroup}
        onRemoveFromGroup={handleRemoveFromGroup}
        onCreateGroup={handleCreateGroup}
        selectMode={selectMode}
        onLongPressSelect={toggleSelect}
        onPasteClientPhoto={handlePasteClientPhoto}
        allClients={sortedAllClients}
      />

      <BulkActions />
    </Btn>;

  return (
    <BulkSelectionProvider value={bulkValue}>
      {_content}
    </BulkSelectionProvider>
  );
}