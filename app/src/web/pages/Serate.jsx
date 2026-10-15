// Port di src/pages/Serate.jsx (convertito da scripts/port/codemod.mjs).
import { attendancesAllOptions } from '@/web/lib/attendanceQueries';
import React, { useState, useEffect, useMemo, useRef, Suspense, useCallback, memo } from 'react';
import { motion, AnimatePresence } from '@/ui/motion';
import { useNavigate } from '@/web/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePullToRefresh } from '@/web/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/web/components/shared/PullToRefreshIndicator';
import PageTitle from '@/web/components/shared/PageTitle';
import { base44 } from '@/lib/base44';
import { Button } from '@/ui/button';
import { Plus, CalendarDays, Pencil, Trash2, ChevronDown, ChevronUp, GitCompare, LayoutGrid, Square, Search } from '@/ui/icons.generated';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import EmptyState from '@/web/components/shared/EmptyState';
import SortPills from '@/web/components/shared/SortPills';
const EventFormDialog = React.lazy(() => import('@/web/components/event/EventFormDialog'));
const EventPromoterChart = React.lazy(() => import('@/web/components/event/EventPromoterChart'));
const EventCompareDialog = React.lazy(() => import('@/web/components/serate/EventCompareDialog'));
import EventCard from '@/web/components/serate/EventCard';
import { useProgressiveList } from '@/web/hooks/useProgressiveList';

// PORT: riga della lista in memo: le closure per EventCard si rifanno solo quando cambia la sua serata
const NO_ATTENDANCES = [];
const SerataRow = memo(function SerataRow({ event, attendances, promoters, layout, isExpanded, onToggle, onEditEvent, onDeleteEvent }) {
  return (
    <Div className="serate-card-row">
      <EventCard
        event={event}
        attendances={attendances}
        promoters={promoters}
        layout={layout}
        isExpanded={isExpanded}
        onToggleExpand={(expanded) => onToggle(event.id, expanded)}
        onEdit={() => onEditEvent(event)}
        onDelete={() => onDeleteEvent(event.id)}
        showDivider={false}
        dividerLabel=""
        dividerColor=""
        dividerControls={null}
      />
    </Div>
  );
});
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/ui/dialog';
import { calcTables } from '@/legacy/utils/tables';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import { makeTapHandlers } from '@/web/lib/tapHandlers';
import { toast } from '@/ui/use-toast';
import { triggerStatsRecompute, refetchEventTables, writeThroughAttendances } from '@/web/lib/eventSync';

import { doc as webDocument, storage as webStorage, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, H, P, Span } from '@/ui/html';
import { HtmlInput, HtmlLabel, Img } from '@/ui/elements';

// PORT: vero dalla prima volta che `open` è vero (poi resta montato: chiusura e riapertura come prima)
function useMountedOnce(open) {
  const mounted = useRef(false);
  if (open) mounted.current = true;
  return mounted.current;
}

const DOW_LABELS = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

function venueToTile(v) {
  return {
    key: v.name,
    label: v.is_extra ? 'Extra' : (DOW_LABELS[v.day_of_week] ?? 'Extra'),
    sublabel: v.season_label || '',
    hex: v.color_hex || '#a78bfa',
  };
}

function getDowFromDate(dateStr) {
  if (!dateStr) return -1;
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

function VenueLogo({ venueKey, size = 48 }) {
  const { getVenueLogo } = useAllVenueLogos();
  const { logoUrl } = getVenueLogo(venueKey);
  if (!logoUrl) return null;
  return (
    <Div style={{ width: size, height: size, overflow: 'hidden', flexShrink: 0 }} className="rounded flex items-center justify-center">
      <Img src={logoUrl} alt={venueKey} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </Div>
  );
}

function VenueFilterButton({ venueKey, label, sublabel, hex, isActive, hasFilter, totalCount, filteredCount, tapHandlers }) {
  const { getVenueLogo } = useAllVenueLogos();
  const { logoUrl } = getVenueLogo(venueKey);
  return (
    <Btn
      button
      {...tapHandlers}
      style={isActive ? { borderColor: hex } : {}}
      className={`rounded-xl bg-card border p-2.5 text-center transition-all duration-200 hover:opacity-80 flex-shrink-0 min-w-[90px] sm:min-w-0 ${isActive ? 'bg-white/5' : 'border-border'}`}>
      {logoUrl ? (
        <Div className="flex justify-center mb-1.5">
          <Div style={{ width: 40, height: 40 }} className="rounded flex items-center justify-center overflow-hidden">
            <Img src={logoUrl} alt={venueKey} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Div>
        </Div>
      ) : (
        <Div className="flex items-center justify-center gap-1 mb-1">
          <Div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: hex }} />
          <P className="text-[10px] font-medium uppercase tracking-wider" style={{ color: hex }}>{label}</P>
        </Div>
      )}
      <P className="font-bold text-xs leading-tight">{venueKey}</P>
      {hasFilter ? (
        <P className="text-[10px] text-muted-foreground mt-0.5">
          {sublabel} · <Span className="text-primary font-semibold">{filteredCount}</Span>
          <Span className="opacity-50">/{totalCount}</Span>
        </P>
      ) : (
        <P className="text-[10px] text-muted-foreground mt-0.5">{sublabel} · {totalCount}</P>
      )}
    </Btn>
  );
}

export default function Serate() {
   const [eventDialogOpen, setEventDialogOpen] = useState(false);
   const [editingEvent, setEditingEvent] = useState(null);
   const [expandedEvent, setExpandedEvent] = useState(null);
   const [deleteId, setDeleteId] = useState(null);
   const [venueFilter, setVenueFilter] = useState(null);
   const [compareOpen, setCompareOpen] = useState(false);
   const [layout, setLayout] = useState(() => {
     return webStorage.getItem('serateLayout') || 'rect';
   });
   const [seasonDividerOpen, setSeasonDividerOpen] = useState(false);
   const [dividerLabel, setDividerLabel] = useState('');
   const [dividerColor, setDividerColor] = useState('#ef4444');
   const [dividerStartDate, setDividerStartDate] = useState('');
   const [dividerEndDate, setDividerEndDate] = useState('');
   const [editDividerOpen, setEditDividerOpen] = useState(false);
   const [editingDividerId, setEditingDividerId] = useState(null);
   const [progettiConclusiOpen, setProgettiConclusiOpen] = useState(false);
   const [undoStack, setUndoStack] = useState([]);
   const [dateRange, setDateRange] = useState({ from: '', to: '' });
   const [yearFilter, setYearFilter] = useState(null);
   const [searchQuery, setSearchQuery] = useState('');
   const formMounted = useMountedOnce(eventDialogOpen);
   const compareMounted = useMountedOnce(compareOpen);
   const qc = useQueryClient();
   const navigate = useNavigate();
   const lastTouchRef = useRef(0);

   useEffect(() => {
     webStorage.setItem('serateLayout', layout);
   }, [layout]);

   // Auto-scroll al tile espanso: centra la serata appena aperta così i
   // risultati (lista promoter) sono immediatamente visibili a schermo.
   // Su desktop la posizioniamo un po' più in basso (centrata) invece che
   // attaccata al top, così l'header del tile resta comodo e il contenuto
   // espanso è subito leggibile. Su mobile resta allineata in cima.
   useEffect(() => {
     if (!expandedEvent) return;
     const el = webDocument.querySelector(`[data-event-id="${expandedEvent}"]`);
     if (!el) return;
     const t = setTimeout(() => {
       const isDesktop = webWindow.innerWidth >= 1024;
       el.scrollIntoView({ behavior: 'smooth', block: isDesktop ? 'center' : 'start' });
     }, 120);
     return () => clearTimeout(t);
   }, [expandedEvent]);

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const { data: attendances = [] } = useQuery({
    ...attendancesAllOptions(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  // Locali da Impostazioni: separa attivi e conclusi tramite is_active.
  // La tabella Serate si aggiorna da sola quando un locale cambia stato.
  const { data: venuesRaw = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list('sort_order'),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
  });

  // I tile vengono unicamente dall'entità Venue (Impostazioni → Gestione Locali),
  // ordinati per sort_order. Il tile "Festivi/Extra" non è più hardcoded: è un
  // locale con is_extra=true. Le serate il cui venue non corrisponde a nessun
  // locale noto finiscono nel primo locale is_extra attivo (se esiste), altrimenti
  // restano non categorizzate (visibili solo senza filtro).
  const { activeVenues, concludedVenues, knownVenueKeys, extraFallbackKey } = useMemo(() => {
    const active = [];
    const concluded = [];
    const keys = new Set();
    let extraKey = null;
    for (const v of venuesRaw) {
      keys.add(v.name);
      const tile = venueToTile(v);
      if (v.is_active === false) {
        concluded.push(tile);
      } else {
        active.push(tile);
        if (v.is_extra && !extraKey) extraKey = v.name;
      }
    }
    return { activeVenues: active, concludedVenues: concluded, knownVenueKeys: keys, extraFallbackKey: extraKey };
  }, [venuesRaw]);

  const getVenueFilterKey = (event) => {
    if (event.venue && knownVenueKeys.has(event.venue)) return event.venue;
    return extraFallbackKey || null;
  };

  // Pre-raggruppa le presenze per event_id (una sola passata O(n)) invece di
  // filtrare l'intero array dentro ogni EventCard ad ogni render.
  const attendancesByEvent = useMemo(() => {
    const map = {};
    for (const a of attendances) {
      if (!a.event_id) continue;
      if (!map[a.event_id]) map[a.event_id] = [];
      map[a.event_id].push(a);
    }
    return map;
  }, [attendances]);

  const { data: seasonDividersDB = [] } = useQuery({
    queryKey: ['seasonDividers'],
    queryFn: () => base44.entities.SeasonDivider.list(),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const createEventMut = useMutation({ mutationFn: d => base44.entities.Event.create(d) });
  const updateEventMut = useMutation({ mutationFn: ({ id, data }) => base44.entities.Event.update(id, data) });

  const deleteEventMut = useMutation({
    mutationFn: async (id) => {
      const eventToDelete = events.find(e => e.id === id);
      const eventAttendances = attendances.filter(a => a.event_id === id);
      setUndoStack(prev => [...prev, { type: 'delete', event: eventToDelete, attendances: eventAttendances }]);
      // Rimozione immediata dalla cache: la serata sparisce dalla lista all'istante.
      qc.setQueryData(['events'], (old = []) => old.filter(e => e.id !== id));
      qc.setQueryData(['attendances-all'], (old = []) => old.filter(a => a.event_id !== id));
      setDeleteId(null);
      // Prima le presenze, poi la serata: se una delle due fallisce → onError
      // ripristina la cache e non restano mai presenze orfane (che falsavano i totali).
      await base44.entities.EventAttendance.deleteMany({ event_id: id });
      await base44.entities.Event.delete(id);
    },
    onError: (_err, id) => {
      // Rollback: ripristina serata e presenze in cache (la delete è fallita)
      const eventToDelete = events.find(e => e.id === id);
      const eventAttendances = attendances.filter(a => a.event_id === id);
      if (eventToDelete) {
        qc.setQueryData(['events'], (old = []) => [eventToDelete, ...old.filter(e => e.id !== id)]);
      }
      if (eventAttendances.length > 0) {
        qc.setQueryData(['attendances-all'], (old = []) => [...old, ...eventAttendances]);
      }
      setUndoStack(prev => prev.filter(a => a.type !== 'delete' || a.event?.id !== id));
      toast({ title: 'Eliminazione fallita', description: 'Riprova tra qualche secondo.', variant: 'destructive' });
    },
    onSuccess: () => {
      // Refetch immediato (disaccoppiato dal ricalcolo 15s) + ricalcolo in background
      refetchEventTables(qc);
      triggerStatsRecompute(qc);
    },
  });

  const addDividerMut = useMutation({
    mutationFn: (data) => base44.entities.SeasonDivider.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seasonDividers'] }),
  });

  const updateDividerMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SeasonDivider.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seasonDividers'] }),
  });

  const deleteDividerMut = useMutation({
    mutationFn: (id) => base44.entities.SeasonDivider.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seasonDividers'] }),
  });

  // Le liste attendances in cache possono essere leggermente stale (es. cancellate da
  // un'altra automazione/tab): se l'update/delete punta a un ID già rimosso, la entity
  // API risponde "not found". Ignoriamo questo caso specifico: lo stato desiderato
  // (record assente/aggiornato) è comunque già raggiunto, quindi il salvataggio non
  // deve fallire per questo.
  const isNotFoundError = (err) => /not found/i.test(err?.message || '');
  const safeDeleteAttendance = (id) =>
    base44.entities.EventAttendance.delete(id).catch(err => { if (!isNotFoundError(err)) throw err; });
  const safeUpdateAttendance = (id, data) =>
    base44.entities.EventAttendance.update(id, data).catch(err => { if (!isNotFoundError(err)) throw err; });

  const handleSaveEvent = async (form, promoterRevenues, removedPresences = [], exPrItems = []) => {
    const isEditing = !!editingEvent;
    const editingId = editingEvent?.id;
    let eventId;

    if (isEditing) {
      const oldEvent = JSON.parse(JSON.stringify(editingEvent));
      setUndoStack(prev => [...prev, { type: 'update', event: oldEvent }]);
      eventId = editingId;
      // Optimistic update: la serata si aggiorna nella lista all'istante
      qc.setQueryData(['events'], (old = []) => old.map(e => e.id === eventId ? { ...e, ...form } : e));
    }
    // Chiudi subito il dialog: la serata è già visibile (edit) o appare non appena il server la crea (new).
    setEventDialogOpen(false);
    setEditingEvent(null);

    if (isEditing) {
      // Update server in background (non blocca la UI); rollback su errore
      updateEventMut.mutateAsync({ id: eventId, data: form }).catch(() => {
        qc.setQueryData(['events'], (old = []) => old.map(e => e.id === eventId ? editingEvent : e));
        toast({ title: 'Aggiornamento fallito', description: 'Riprova tra qualche secondo.', variant: 'destructive' });
      });
    } else {
      try {
        const created = await createEventMut.mutateAsync(form);
        eventId = created.id;
        // Solo dopo la create riuscita la serata entra in cache: niente fantasmi
        qc.setQueryData(['events'], (old = []) => [created, ...old]);
      } catch (err) {
        toast({ title: 'Creazione fallita', description: 'Riprova tra qualche secondo.', variant: 'destructive' });
        return;
      }
    }

    // Fresh server query: la cache React Query (attendances) può essere stale
    // (staleTime 10min, refetchOnMount false), causando create duplicati.
    const freshAttsRes = await base44.entities.EventAttendance.filter(
      { event_id: eventId },
      { fields: ['id', 'promoter_id', 'client_id', 'revenue', 'notes'] }
    );
    const freshAtts = freshAttsRes.items || freshAttsRes;
    const existingPromoterAtts = freshAtts.filter(a => a.promoter_id && !a.client_id);
    const ops = [];
    const createOps = [];
    const updatedAtts = [];
    const deletedIds = [];
    for (const [pid, data] of Object.entries(promoterRevenues)) {
      const numRev = typeof data === 'number' ? Number(data) : Number(data.revenue);
      const existing = existingPromoterAtts.find(a => a.promoter_id === pid);
      if (!numRev || numRev <= 0) {
        if (existing) { ops.push(safeDeleteAttendance(existing.id)); deletedIds.push(existing.id); }
        continue;
      }
      if (existing) {
        ops.push(safeUpdateAttendance(existing.id, { revenue: numRev }));
        updatedAtts.push({ id: existing.id, revenue: numRev });
      } else {
        createOps.push(base44.entities.EventAttendance.create({ event_id: eventId, promoter_id: pid, revenue: numRev }));
      }
    }
    for (const pid of removedPresences) {
      const att = existingPromoterAtts.find(a => a.promoter_id === pid);
      if (att) { ops.push(safeDeleteAttendance(att.id)); deletedIds.push(att.id); }
    }
    const [createdAtts] = await Promise.all([Promise.all(createOps), Promise.all(ops)]);
    // Server ok → cache aggiornata subito (Il Mio Vibra istantaneo come il resto dell'app)
    writeThroughAttendances(qc, { created: createdAtts, updated: updatedAtts, deletedIds });

    const existingExPrAtts = freshAtts.filter(a => !a.promoter_id && a.notes && a.notes.startsWith('__ex_pr__'));
    const exPrOps = [];
    for (const item of exPrItems) {
      const noteValue = `__ex_pr__:${item.name || ''}`;
      if (item.id) {
        exPrOps.push(safeUpdateAttendance(item.id, { revenue: Number(item.revenue) || 0, notes: noteValue }));
      } else {
        exPrOps.push(base44.entities.EventAttendance.create({ event_id: eventId, revenue: Number(item.revenue) || 0, present: true, notes: noteValue }));
      }
    }
    const keptIds = exPrItems.filter(i => i.id).map(i => i.id);
    for (const att of existingExPrAtts) {
      if (!keptIds.includes(att.id)) exPrOps.push(safeDeleteAttendance(att.id));
    }
    await Promise.all(exPrOps);

    // Refetch immediato (disaccoppiato dal ricalcolo 15s): riconcilia cache con DB
    refetchEventTables(qc);
    // Ricalcolo statistiche in background (debounce 15s + scrittura), refetch promoter al termine
    triggerStatsRecompute(qc);
  };

  // Memoizzati: evitano di ri-ordinare/filtrare l'intero elenco serate ad ogni render
  // (es. ogni battitura nella ricerca, apertura dialog, ecc.)
  const sortedEvents = useMemo(() => [...events].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date) - new Date(a.date);
  }), [events]);

  const dateFilteredEvents = useMemo(() => sortedEvents.filter(e => {
    if (!e.date) return true;
    if (yearFilter && !e.date.startsWith(String(yearFilter))) return false;
    if (dateRange.from && e.date < dateRange.from) return false;
    if (dateRange.to && e.date > dateRange.to) return false;
    return true;
  }), [sortedEvents, yearFilter, dateRange.from, dateRange.to]);

  const DOW_NAMES = { venerdì: 5, venerdi: 5, sabato: 6, domenica: 0, lunedì: 1, lunedi: 1, martedì: 2, martedi: 2, mercoledì: 3, mercoledi: 3, giovedì: 4, giovedi: 4 };

  const venueFiltered = useMemo(
    () => venueFilter ? dateFilteredEvents.filter(e => getVenueFilterKey(e) === venueFilter) : dateFilteredEvents,
    [dateFilteredEvents, venueFilter]
  );

  // Conteggi per bottone locale: calcolati una sola volta per tutti i bottoni invece che
  // ripetere due .filter() sull'intero elenco eventi per ciascuno dei 13 bottoni ad ogni render.
  const venueCounts = useMemo(() => {
    const counts = {};
    [...activeVenues, ...concludedVenues].forEach(({ key }) => { counts[key] = { total: 0, filtered: 0 }; });
    sortedEvents.forEach(e => {
      const k = getVenueFilterKey(e);
      if (counts[k]) counts[k].total++;
    });
    dateFilteredEvents.forEach(e => {
      const k = getVenueFilterKey(e);
      if (counts[k]) counts[k].filtered++;
    });
    return counts;
  }, [sortedEvents, dateFilteredEvents, activeVenues, concludedVenues, knownVenueKeys]);

  const dateToSearchStrings = (dateStr) => {
    if (!dateStr) return [];
    try {
      const d = parseISO(dateStr);
      return [
        format(d, 'd MMM yyyy', { locale: it }).toLowerCase(),
        format(d, 'd MMMM yyyy', { locale: it }).toLowerCase(),
        format(d, 'dd/MM/yyyy', { locale: it }),
        format(d, 'MMM yyyy', { locale: it }).toLowerCase(),
        format(d, 'MMMM yyyy', { locale: it }).toLowerCase(),
        format(d, 'd MMM', { locale: it }).toLowerCase(),
        format(d, 'd MMMM', { locale: it }).toLowerCase(),
      ];
    } catch { return []; }
  };

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return venueFiltered;
    const q = searchQuery.trim().toLowerCase();
    const dowNum = DOW_NAMES[q];
    return venueFiltered.filter(e => {
      if (dowNum !== undefined) return getDowFromDate(e.date) === dowNum;
      const dateStrings = dateToSearchStrings(e.date);
      if (dateStrings.some(s => s.includes(q))) return true;
      return (
        e.name?.toLowerCase().includes(q) ||
        e.notes?.toLowerCase().includes(q) ||
        e.venue?.toLowerCase().includes(q) ||
        e.physical_location?.toLowerCase().includes(q)
      );
    });
  }, [venueFiltered, searchQuery]);
  // PORT: lista lunga → montaggio progressivo; callback stabili per le righe in memo
  const { count: shownEvents, sentinelRef: eventsSentinelRef } = useProgressiveList(filteredEvents.length);
  const toggleExpanded = useCallback((id, expanded) => setExpandedEvent(expanded ? id : null), []);
  const openEditEvent = useCallback((ev) => { setEditingEvent(ev); setEventDialogOpen(true); }, []);

  const handleAddDivider = () => {
    let targetEventId = null;
    if (dividerStartDate && dividerEndDate) {
      const inRange = sortedEvents.filter(e => e.date && e.date >= dividerStartDate && e.date <= dividerEndDate);
      if (inRange.length > 0) targetEventId = inRange[0].id;
    } else if (filteredEvents.length > 0) {
      targetEventId = filteredEvents[0].id;
    }
    if (!targetEventId) { setSeasonDividerOpen(false); return; }
    addDividerMut.mutate({ eventId: targetEventId, label: dividerLabel, color: dividerColor });
    setDividerLabel('');
    setDividerColor('#ef4444');
    setDividerStartDate('');
    setDividerEndDate('');
    setSeasonDividerOpen(false);
  };

  const handleRemoveDivider = (dividerId) => deleteDividerMut.mutate(dividerId);

  const handleMoveDivider = (dividerId, direction) => {
    const divider = seasonDividersDB.find(d => d.id === dividerId);
    if (!divider) return;
    const currentIdx = filteredEvents.findIndex(e => e.id === divider.eventId);
    const newIdx = Math.max(0, Math.min(filteredEvents.length - 1, currentIdx + direction));
    updateDividerMut.mutate({ id: dividerId, data: { eventId: filteredEvents[newIdx].id } });
  };

  const handleSaveEditDivider = (dividerId, label, color) => {
    updateDividerMut.mutate({ id: dividerId, data: { label, color } });
    setEditDividerOpen(false);
    setEditingDividerId(null);
  };

  const handleUndo = async () => {
    if (undoStack.length === 0) return;
    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    try {
      if (lastAction.type === 'delete') {
        await base44.entities.Event.create(lastAction.event);
        const newEvent = (await qc.refetchQueries({ queryKey: ['events'] })).queryResults[0]?.state?.data || [];
        const createdEvent = newEvent.find(e => e.date === lastAction.event.date && e.name === lastAction.event.name);
        if (createdEvent) {
          await Promise.all(lastAction.attendances.map(att =>
            base44.entities.EventAttendance.create({ event_id: createdEvent.id, promoter_id: att.promoter_id, client_id: att.client_id, revenue: att.revenue, table_number: att.table_number, notes: att.notes })
          ));
        }
      } else if (lastAction.type === 'update') {
        const currentEvent = events.find(e => e.id === lastAction.event.id);
        if (currentEvent) await base44.entities.Event.update(lastAction.event.id, lastAction.event);
      }
      await qc.refetchQueries({ queryKey: ['events'] });
      await qc.refetchQueries({ queryKey: ['attendances-all'] });
    } catch (err) {
      console.error('Errore durante undo:', err);
      toast({ title: 'Annullamento fallito', description: 'Riprova tra qualche secondo.', variant: 'destructive' });
      refetchEventTables(qc);
    }
    triggerStatsRecompute(qc);
  };

  const handleRefresh = () => Promise.all([
    qc.refetchQueries({ queryKey: ['events'] }),
    qc.refetchQueries({ queryKey: ['attendances-all'] }),
    qc.refetchQueries({ queryKey: ['promoters'] }),
  ]);
  const { isRefreshing, pullProgress } = usePullToRefresh(handleRefresh);

  return (
    <Div className="space-y-5 pb-8">
      <PullToRefreshIndicator isRefreshing={isRefreshing} pullProgress={pullProgress} />
      <PageTitle title="Serate" />

      {/* ── Toolbar principale ── */}
      <Div
        className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card px-4 py-3"
        style={{ boxShadow: '0 4px 32px -8px rgba(167,139,250,0.08)' }}
      >
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
        <Div className="flex items-start justify-between gap-3 flex-wrap">
          <P className="text-sm text-muted-foreground pt-0.5">
            Totale: <Span className="font-semibold text-foreground">{sortedEvents.length}</Span> serate
            {(yearFilter || dateRange.from || dateRange.to || venueFilter || searchQuery) && (
              <Span className="ml-2 text-primary font-semibold">/ {filteredEvents.length} mostrate</Span>
            )}
          </P>
          <Div className="flex flex-wrap gap-2">
            {undoStack.length > 0 && (
              <Button variant="outline" size="sm" {...makeTapHandlers(lastTouchRef, handleUndo)} className="border-amber-500/30 hover:bg-amber-500/10">
                ↶ ({undoStack.length})
              </Button>
            )}
            <Button variant="outline" size="sm" {...makeTapHandlers(lastTouchRef, () => setSeasonDividerOpen(true))}>
              <Plus className="w-4 h-4" /><Span className="hidden sm:inline ml-1">Separatore</Span>
            </Button>
            <Button variant="outline" size="sm" {...makeTapHandlers(lastTouchRef, () => navigate('/importa-serata'))}>
              <Plus className="w-4 h-4" /><Span className="hidden sm:inline ml-1">Importa</Span>
            </Button>
            <Button variant="outline" size="sm" {...makeTapHandlers(lastTouchRef, () => setCompareOpen(true))}>
              <GitCompare className="w-4 h-4" /><Span className="hidden sm:inline ml-1">Confronta</Span>
            </Button>
            <Button size="sm" {...makeTapHandlers(lastTouchRef, () => { setEditingEvent(null); setEventDialogOpen(true); })}>
              <Plus className="w-4 h-4" /><Span className="hidden sm:inline ml-1">Nuova Serata</Span>
            </Button>
          </Div>
        </Div>
      </Div>

      {/* ── Filtri: Anno + Layout + Periodo ── */}
      <Div
        className="dash-fade-up space-y-3"
      >
        <SortPills
          label="Anno:"
          options={[null, 2023, 2024, 2025, 2026].map(y => ({ key: y ?? 'all', label: y ?? 'Tutti' }))}
          value={yearFilter ?? 'all'}
          onChange={(k) => setYearFilter(k === 'all' ? null : k)}
        />

        <Div className="flex flex-wrap items-center gap-3">
          <SortPills
            label="Visualizzazione:"
            options={[
              { key: 'rect', label: 'Rettangolare' },
              { key: 'grid', label: 'Quadrati' },
              { key: 'mini', label: 'Mini' },
            ]}
            value={layout}
            onChange={setLayout}
          />

          <Div className="flex flex-wrap items-center gap-2 bg-card border border-white/[0.06] rounded-xl px-3 py-1.5 w-full lg:w-auto lg:ml-auto">
            <Span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider whitespace-nowrap">Periodo:</Span>
            <HtmlInput
              type="date"
              value={dateRange.from}
              onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))}
              className="bg-transparent text-xs border-0 outline-none text-foreground flex-1 min-w-[100px] cursor-pointer accent-primary"
              style={{ colorScheme: 'dark' }}
              accessibilityLabel="Da"
            />
            <Span className="text-muted-foreground text-xs">→</Span>
            <HtmlInput
              type="date"
              value={dateRange.to}
              onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))}
              className="bg-transparent text-xs border-0 outline-none text-foreground flex-1 min-w-[100px] cursor-pointer accent-primary"
              style={{ colorScheme: 'dark' }}
              accessibilityLabel="A"
            />
            {(dateRange.from || dateRange.to) && (
              <Btn
                button
                onClick={() => setDateRange({ from: '', to: '' })}
                className="text-[10px] text-muted-foreground hover:text-destructive"
                accessibilityLabel="Rimuovi filtro">✕</Btn>
            )}
            {(dateRange.from || dateRange.to) && (
              <Span className="text-[10px] font-bold text-primary whitespace-nowrap">{dateFilteredEvents.length} serate</Span>
            )}
          </Div>
        </Div>
      </Div>

      {/* ── Ricerca ── */}
      <Div
        className="dash-fade-up relative max-w-md"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <HtmlInput
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Cerca per nome, nota, locale o giorno (es. sabato)..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/[0.06] bg-card text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground transition-all"
        />
        {searchQuery && (
          <Btn
            button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive text-xs">✕</Btn>
        )}
      </Div>

      {/* ── Filtri locali ── */}
      <Div
        className="dash-fade-up overflow-x-auto -mx-4 px-4"
      >
        <Div className="flex gap-2 w-max sm:grid sm:w-auto sm:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
          {activeVenues.map(({ key, label, sublabel, hex }) => {
            const isActive = venueFilter === key;
            const totalCount = venueCounts[key]?.total || 0;
            const filteredCount = venueCounts[key]?.filtered || 0;
            const hasFilter = yearFilter || dateRange.from || dateRange.to;
            return (
              <VenueFilterButton
                key={key}
                venueKey={key}
                label={label}
                sublabel={sublabel}
                hex={hex}
                isActive={isActive}
                hasFilter={hasFilter}
                totalCount={totalCount}
                filteredCount={filteredCount}
                tapHandlers={makeTapHandlers(lastTouchRef, () => setVenueFilter(isActive ? null : key))}
              />
            );
          })}
        </Div>
      </Div>

      {/* ── Progetti conclusi ── */}
      <Div
        className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/40"
      >
        <Btn
          button
          {...makeTapHandlers(lastTouchRef, () => setProgettiConclusiOpen(o => !o))}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/20 transition-all duration-200">
          <Span className="flex items-center gap-2">
            <Span className="text-[10px] uppercase tracking-wider font-semibold">Progetti conclusi</Span>
            <Span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-md">{concludedVenues.length} locali</Span>
          </Span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${progettiConclusiOpen ? 'rotate-180' : ''}`} />
        </Btn>
        <AnimatePresence>
          {progettiConclusiOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <Div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-3 border-t border-white/[0.06]">
                {concludedVenues.map(({ key, label, sublabel, hex }) => {
                  const isActive = venueFilter === key;
                  const totalCount = venueCounts[key]?.total || 0;
                  const filteredCount = venueCounts[key]?.filtered || 0;
                  const hasFilter = yearFilter || dateRange.from || dateRange.to;
                  return (
                    <VenueFilterButton
                      key={key}
                      venueKey={key}
                      label={label}
                      sublabel={sublabel}
                      hex={hex}
                      isActive={isActive}
                      hasFilter={hasFilter}
                      totalCount={totalCount}
                      filteredCount={filteredCount}
                      tapHandlers={makeTapHandlers(lastTouchRef, () => setVenueFilter(isActive ? null : key))}
                    />
                  );
                })}
              </Div>
            </motion.div>
          )}
        </AnimatePresence>
      </Div>

      {/* ── Lista serate ── */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nessuna serata"
          description="Registra la prima serata per iniziare a tracciare il fatturato."
          onAction={() => setEventDialogOpen(true)}
          actionLabel="Aggiungi Serata"
        />
      ) : (
        <Div
          className={`dash-fade-up ${layout === 'mini' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2' : layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' : 'space-y-3'}`}
        >
          {/* PORT: montaggio progressivo (hooks/useProgressiveList): prime 20 serate, le altre a blocchi */}
          {filteredEvents.slice(0, shownEvents).map((event) => {
            const isExpanded = expandedEvent === event.id;
            const eventDividers = !venueFilter ? seasonDividersDB.filter(d => d.eventId === event.id) : [];
            return (
              <React.Fragment key={event.id}>
                {eventDividers.map(divider => {
                  const currentIdx = filteredEvents.findIndex(e => e.id === divider.eventId);
                  const dividerControls = (
                    <>
                      <Btn
                        button
                        onClick={() => handleMoveDivider(divider.id, -10)}
                        className="text-[10px] px-1.5 py-0.5 rounded text-muted-foreground hover:bg-secondary/50"
                        disabled={currentIdx <= 0}
                        accessibilityLabel="Su di 10">↑↑</Btn>
                      <Btn
                        button
                        onClick={() => handleMoveDivider(divider.id, -1)}
                        className="text-[10px] px-1.5 py-0.5 rounded text-muted-foreground hover:bg-secondary/50"
                        disabled={currentIdx <= 0}
                        accessibilityLabel="Su">↑</Btn>
                      <Btn
                        button
                        onClick={() => handleMoveDivider(divider.id, 1)}
                        className="text-[10px] px-1.5 py-0.5 rounded text-muted-foreground hover:bg-secondary/50"
                        disabled={currentIdx >= filteredEvents.length - 1}
                        accessibilityLabel="Giù">↓</Btn>
                      <Btn
                        button
                        onClick={() => handleMoveDivider(divider.id, 10)}
                        className="text-[10px] px-1.5 py-0.5 rounded text-muted-foreground hover:bg-secondary/50"
                        disabled={currentIdx >= filteredEvents.length - 1}
                        accessibilityLabel="Giù di 10">↓↓</Btn>
                      <Btn
                        button
                        onClick={() => { setEditingDividerId(divider.id); setDividerLabel(divider.label); setDividerColor(divider.color); setEditDividerOpen(true); }}
                        className="text-[10px] px-1.5 py-0.5 rounded text-muted-foreground hover:bg-secondary/50"
                        accessibilityLabel="Modifica">✎</Btn>
                      <Btn
                        button
                        onClick={() => handleRemoveDivider(divider.id)}
                        className="text-[10px] px-1.5 py-0.5 rounded text-destructive hover:bg-destructive/20"
                        accessibilityLabel="Elimina">✕</Btn>
                    </>
                  );
                  return (
                    <EventCard
                      key={`divider-${divider.id}`}
                      event={event}
                      attendances={attendancesByEvent[event.id] || []}
                      promoters={promoters}
                      layout={layout}
                      isExpanded={false}
                      onToggleExpand={() => {}}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      showDivider={true}
                      dividerLabel={divider.label}
                      dividerColor={divider.color}
                      dividerControls={dividerControls}
                      dividerOnly={true}
                    />
                  );
                })}
                {/* PORT: riga in memo con callback stabili (aprire una card non ridisegna le altre) */}
                <SerataRow
                  event={event}
                  attendances={attendancesByEvent[event.id] || NO_ATTENDANCES}
                  promoters={promoters}
                  layout={layout}
                  isExpanded={isExpanded}
                  onToggle={toggleExpanded}
                  onEditEvent={openEditEvent}
                  onDeleteEvent={setDeleteId}
                />
              </React.Fragment>
            );
          })}
        </Div>
      )}
      {shownEvents < filteredEvents.length && <Div ref={eventsSentinelRef} />}

      {/* PORT: dialog montati dalla prima apertura (chiusi caricavano comunque modulo, form e query) */}
      {formMounted && <Suspense fallback={null}><EventFormDialog open={eventDialogOpen} onOpenChange={setEventDialogOpen} event={editingEvent} onSave={handleSaveEvent} /></Suspense>}
      {compareMounted && <Suspense fallback={null}><EventCompareDialog open={compareOpen} onOpenChange={setCompareOpen} events={events} attendances={attendances} promoters={promoters} /></Suspense>}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare questa serata?</AlertDialogTitle>
            <AlertDialogDescription>Questa azione non può essere annullata.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteEventMut.mutate(deleteId)}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Season divider dialog */}
      {seasonDividerOpen && (
        <Div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <Div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-lg">
            <H className="font-semibold text-lg mb-4">Inserisci Separatore Stagione</H>
            <Div className="space-y-4">
              <Div>
                <HtmlLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Etichetta</HtmlLabel>
                <HtmlInput type="text" value={dividerLabel} onChange={e => setDividerLabel(e.target.value)} placeholder="Es. Fine stagione estiva" className="w-full px-3 py-2 rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              </Div>
              <Div>
                <HtmlLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Colore</HtmlLabel>
                <Div className="flex gap-2">
                  {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'].map(color => (
                    <Btn
                      button
                      key={color}
                      onClick={() => setDividerColor(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${dividerColor === color ? 'border-foreground' : 'border-border'}`}
                      style={{ background: color }} />
                  ))}
                </Div>
              </Div>
              <Div>
                <HtmlLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Periodo (opzionale)</HtmlLabel>
                <Div className="flex gap-2 items-center">
                  <HtmlInput type="date" value={dividerStartDate} onChange={e => setDividerStartDate(e.target.value)} className="flex-1 px-2 py-1.5 rounded-md border border-input bg-transparent text-xs" placeholder="Da" />
                  <Span className="text-xs text-muted-foreground">→</Span>
                  <HtmlInput type="date" value={dividerEndDate} onChange={e => setDividerEndDate(e.target.value)} className="flex-1 px-2 py-1.5 rounded-md border border-input bg-transparent text-xs" placeholder="A" />
                </Div>
                <P className="text-[10px] text-muted-foreground mt-1">Scegli il periodo: il separatore comparirà prima della prima serata in questo range</P>
              </Div>
              <Div className="flex gap-2 justify-end pt-2">
                <Btn
                  button
                  onClick={() => { setSeasonDividerOpen(false); setDividerStartDate(''); setDividerEndDate(''); }}
                  className="px-4 py-2 rounded-md border border-input text-sm font-medium hover:bg-accent">Annulla</Btn>
                <Btn
                  button
                  onClick={handleAddDivider}
                  disabled={!dividerLabel}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">Aggiungi</Btn>
              </Div>
            </Div>
          </Div>
        </Div>
      )}

      {/* Edit divider dialog */}
      {editDividerOpen && (
        <Div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <Div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-lg">
            <H className="font-semibold text-lg mb-4">Modifica Separatore</H>
            <Div className="space-y-4">
              <Div>
                <HtmlLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Etichetta</HtmlLabel>
                <HtmlInput type="text" value={dividerLabel} onChange={e => setDividerLabel(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              </Div>
              <Div>
                <HtmlLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Colore</HtmlLabel>
                <Div className="flex gap-2">
                  {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'].map(color => (
                    <Btn
                      button
                      key={color}
                      onClick={() => setDividerColor(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${dividerColor === color ? 'border-foreground' : 'border-border'}`}
                      style={{ background: color }} />
                  ))}
                </Div>
              </Div>
              <Div className="flex gap-2 justify-end pt-2">
                <Btn
                  button
                  onClick={() => { setEditDividerOpen(false); setEditingDividerId(null); }}
                  className="px-4 py-2 rounded-md border border-input text-sm font-medium hover:bg-accent">Annulla</Btn>
                <Btn
                  button
                  onClick={() => handleSaveEditDivider(editingDividerId, dividerLabel, dividerColor)}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">Salva</Btn>
              </Div>
            </Div>
          </Div>
        </Div>
      )}
    </Div>
  );
}