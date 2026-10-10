// Port di src/components/ilmiovibra/MieiGuadagniSerate.jsx (convertito da scripts/port/codemod.mjs).
import { invalidateFullTables } from '@/web/lib/query-client';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion } from '@/ui/motion';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { Euro, ChevronUp, NotebookPen, Check, Search, X } from '@/ui/icons.generated';
import { calcTables } from '@/legacy/utils/tables';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import { getDow, validDayKey } from '@/legacy/utils/dateUtils';



import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput, HtmlTextarea, Img } from '@/ui/elements';



const DOW_LABEL = { 5: 'Venerdì', 6: 'Sabato', 0: 'Domenica' };

// Array vuoto a identità STABILE (con `= []` ogni render ne crea uno nuovo e invalida tutti i useMemo).
const EMPTY_ARR = [];

// Abbreviazioni dei mesi ricavate da date-fns (stessa fonte di format(..., 'MMM', { locale: it })).
const MON_IT = Array.from({ length: 12 }, (_, i) => format(new Date(2000, i, 1), 'MMM', { locale: it }));

// Equivale a format(parseISO(d), 'd MMM yy', { locale: it }) per le date-giorno 'YYYY-MM-DD' (il caso
// reale), senza il costo di parseISO+format per ogni riga. Altri formati: percorso originale.
function fmtDayMonYY(dateStr) {
  const k = validDayKey(dateStr);
  if (!k) return format(parseISO(dateStr), 'd MMM yy', { locale: it });
  return `${+k.slice(8, 10)} ${MON_IT[+k.slice(5, 7) - 1]} ${k.slice(2, 4)}`;
}

// Mostra le righe a blocchi: le prime subito, il resto DOPO le animazioni di ingresso (che restano
// quelle originali). I blocchi RADDOPPIANO (24 → 72 → 144 → 288 → 576...): ogni passo ri-renderizza anche le
// righe già presenti, quindi con un passo fisso il lavoro totale crescerebbe in modo quadratico;
// raddoppiando bastano ~5 passi anche con 1000+ righe. Prima venivano renderizzate TUTTE insieme
// (centinaia di righe con input, loghi e note) nel primo render del tab.
function useProgressiveCount(total, initial = 24, step = 48, startDelay = 520) {
  const ssr = typeof window === 'undefined';
  const [count, setCount] = useState(ssr ? Infinity : initial);
  useEffect(() => {
    if (ssr || count >= total) return;
    if (count <= initial) {
      const t = setTimeout(() => setCount(c => c + Math.max(step, c)), startDelay);
      return () => clearTimeout(t);
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => setCount(c => c + Math.max(step, c))); });
    return () => { cancelAnimationFrame(raf1); if (raf2) cancelAnimationFrame(raf2); };
  }, [count, total, ssr, initial, step, startDelay]);
  return count;
}

export default function MieiGuadagniSerate({ promoterId, tab, isFounder = false, userRole = null }) {
  const [editing, setEditing] = useState({});
  const [savedFeedback, setSavedFeedback] = useState({});
  const [expandedNotes, setExpandedNotes] = useState({});
  const [noteTexts, setNoteTexts] = useState({});
  const [savingNote, setSavingNote] = useState({});
  const [search, setSearch] = useState('');
  const saveTimers = useRef({});
  const qc = useQueryClient();

  const { data: events = EMPTY_ARR } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { data: attendances = EMPTY_ARR } = useQuery({
    queryKey: ['attendances', promoterId],
    queryFn: () => base44.entities.EventAttendance.filter({ promoter_id: promoterId }, '-created_date', 5000),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { data: promoters = EMPTY_ARR } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 20 * 60000,
    gcTime: 25 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Loghi venue (stessa fonte della sezione Locali)
  const { getVenueLogo: getVenueLogoFromDB } = useAllVenueLogos();

  // Aggiorna SOLO le presenze di questo promoter. Prima `refetchQueries(['attendances'])` rifaceva il
  // download di OGNI cache che inizia con 'attendances' (anche quelle dei membri del team, ora condivise
  // con il tab "Il Mio Team") a ogni salvataggio (autosave ogni 800ms): richieste inutili.
  const refreshMyAttendances = async () => {
    await qc.refetchQueries({ queryKey: ['attendances', promoterId] });
    qc.invalidateQueries({ queryKey: ['team-attendances'] });
    // Tabella completa (Achievement/rank, Vibra VS...): solo marcata stale, nessun download ora
    invalidateFullTables(qc);
  };

  const updateAttendanceMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EventAttendance.update(id, data),
    onSuccess: async (_data, variables) => {
      await refreshMyAttendances();
      // Mostra feedback "salvato" per 2 secondi
      setSavedFeedback(prev => ({ ...prev, [variables.id]: true }));
      setTimeout(() => setSavedFeedback(prev => ({ ...prev, [variables.id]: false })), 2000);
    },
  });

  // Autosave con debounce 800ms al blur o dopo stop digitazione
  const scheduleAutoSave = (att, field, value) => {
    const key = `${att.id}-${field}`;
    if (saveTimers.current[key]) clearTimeout(saveTimers.current[key]);
    saveTimers.current[key] = setTimeout(async () => {
      const currentEditing = { ...editing[att.id] };
      const pct = field === 'pct' ? Number(value) : (currentEditing?.pct !== undefined ? Number(currentEditing.pct) : (att.guadagno_pct || 0));
      const fuori = field === 'fuori' ? Number(value) : (currentEditing?.fuori !== undefined ? Number(currentEditing.fuori) : (att.guadagno_fuori_mano || 0));

      if (att._isVirtual) {
        // Crea un record reale al posto del virtuale
        const newAtt = await base44.entities.EventAttendance.create({
          event_id: att.event_id,
          promoter_id: promoterId,
          revenue: 0,
          guadagno_pct: pct,
          guadagno_fuori_mano: fuori,
          present: true,
        });
        await refreshMyAttendances();
        setSavedFeedback(prev => ({ ...prev, [att.id]: true }));
        setTimeout(() => setSavedFeedback(prev => ({ ...prev, [att.id]: false })), 2000);
      } else {
        updateAttendanceMut.mutate({ id: att.id, data: { guadagno_pct: pct, guadagno_fuori_mano: fuori } });
      }
    }, 800);
  };

  const toggleNote = (attId, currentNote) => {
    setExpandedNotes(prev => {
      const isOpen = prev[attId];
      if (!isOpen && noteTexts[attId] === undefined) {
        setNoteTexts(pt => ({ ...pt, [attId]: currentNote || '' }));
      }
      return { ...prev, [attId]: !isOpen };
    });
  };

  const noteTimers = useRef({});

  const saveNote = async (att) => {
    setSavingNote(prev => ({ ...prev, [att.id]: true }));
    await base44.entities.EventAttendance.update(att.id, { notes: noteTexts[att.id] || '' });
    await refreshMyAttendances();
    setSavingNote(prev => ({ ...prev, [att.id]: false }));
  };

  const handleNoteChange = (attId, value, att) => {
    setNoteTexts(pt => ({ ...pt, [attId]: value }));
    if (noteTimers.current[attId]) clearTimeout(noteTimers.current[attId]);
    setSavingNote(prev => ({ ...prev, [attId]: true }));
    noteTimers.current[attId] = setTimeout(async () => {
      await base44.entities.EventAttendance.update(attId, { notes: value });
      await refreshMyAttendances();
      setSavingNote(prev => ({ ...prev, [attId]: false }));
    }, 800);
  };

  // Ruoli "leader" che devono vedere le serate dei loro PR anche con revenue=0
  const isLeaderRole = isFounder || userRole === 'admin' || userRole === 'super4' || userRole === 'capogruppo';

  // PR diretti sotto questo promoter
  const myPrIds = useMemo(
    () => promoters.filter(p => p.referente_id === promoterId).map(p => p.id),
    [promoters, promoterId]
  );

  // Mappa event_id → fatturato totale PR (solo per leader)
  const prRevenueByEvent = useMemo(() => {
    if (!isLeaderRole) return {};
    const map = {};
    attendances.forEach(a => {
      if (!a.client_id && myPrIds.includes(a.promoter_id) && (a.revenue || 0) > 0) {
        map[a.event_id] = (map[a.event_id] || 0) + (a.revenue || 0);
      }
    });
    return map;
  }, [attendances, myPrIds, isLeaderRole]);

  // Lookup O(1) eventi
  const eventsById = useMemo(() => new Map(events.map(e => [e.id, e])), [events]);

  // Record reali di questo promoter (escludendo presenze cliente)
  const myRealAttendances = useMemo(
    () => attendances.filter(a => a.promoter_id === promoterId && !a.client_id),
    [attendances, promoterId]
  );

  // Set degli event_id già coperti da un record reale
  const myRealEventIds = useMemo(
    () => new Set(myRealAttendances.map(a => a.event_id)),
    [myRealAttendances]
  );

  // Per i leader: serate dove i PR hanno fatturato ma il leader NON ha un record → creo record virtuale (read-only, id fittizio)
  const virtualAttendances = useMemo(() => {
    if (!isLeaderRole) return [];
    return Object.keys(prRevenueByEvent)
      .filter(eventId => !myRealEventIds.has(eventId))
      .map(eventId => ({
        id: `virtual-${eventId}`,
        event_id: eventId,
        promoter_id: promoterId,
        revenue: 0,
        guadagno_pct: 0,
        guadagno_fuori_mano: 0,
        present: false,
        client_id: null,
        notes: null,
        _isVirtual: true,
      }));
  }, [isLeaderRole, prRevenueByEvent, myRealEventIds, promoterId]);

  // Unione: record reali filtrati + record virtuali
  // Deduplica per event_id: se esistono due record reali per la stessa serata,
  // tiene solo quello con dati effettivi (revenue > 0 o guadagno > 0)
  const myAttendances = useMemo(() => {
    const real = myRealAttendances.filter(a => {
      const hasMyRevenue = (a.revenue || 0) > 0;
      const hasMyGuadagno = (a.guadagno_pct || 0) > 0 || (a.guadagno_fuori_mano || 0) > 0;
      const hasPrRevenue = isLeaderRole && !!prRevenueByEvent[a.event_id];
      return hasMyRevenue || hasMyGuadagno || hasPrRevenue;
    });

    // Deduplica per event_id: preferisce il record con dati (revenue o guadagno)
    const byEvent = {};
    real.forEach(a => {
      if (!byEvent[a.event_id]) {
        byEvent[a.event_id] = a;
      } else {
        const existing = byEvent[a.event_id];
        const existingHasData = (existing.revenue || 0) > 0 || (existing.guadagno_pct || 0) > 0 || (existing.guadagno_fuori_mano || 0) > 0;
        const newHasData = (a.revenue || 0) > 0 || (a.guadagno_pct || 0) > 0 || (a.guadagno_fuori_mano || 0) > 0;
        if (newHasData && !existingHasData) {
          byEvent[a.event_id] = a;
        }
      }
    });

    return [...Object.values(byEvent), ...virtualAttendances];
  }, [myRealAttendances, virtualAttendances, isLeaderRole, prRevenueByEvent]);

  // Abbinamento att+evento ordinato per data (memoizzato, lookup O(1))
  const enriched = useMemo(() => {
    return myAttendances
      .map(a => {
        const ev = eventsById.get(a.event_id);
        if (!ev) return null;
        const dateLabel = ev.date ? fmtDayMonYY(ev.date) : '';
        return { att: a, ev, dateLabel };
      })
      .filter(Boolean)
      .sort((a, b) => (b.ev.date || '').localeCompare(a.ev.date || ''));
  }, [myAttendances, eventsById]);

  const q = search.trim().toLowerCase();
  // La stringa di ricerca (due format() di date-fns per riga) si costruisce SOLO quando si cerca.
  const hasQuery = q !== '';
  const searchIndex = useMemo(() => {
    if (!hasQuery) return null;
    return enriched.map(({ ev }) => `${ev.name || ''} ${ev.venue || ''} ${ev.date ? format(parseISO(ev.date), 'd MMM yyyy MMMM yyyy', { locale: it }) : ''}`.toLowerCase());
  }, [enriched, hasQuery]);
  const filtered = useMemo(() => {
    if (!q) return enriched;
    return enriched.filter((_, i) => searchIndex[i].includes(q));
  }, [enriched, q, searchIndex]);
  const shownCount = useProgressiveCount(filtered.length);
  const rowsToRender = q ? filtered : (shownCount >= filtered.length ? filtered : filtered.slice(0, shownCount));

  const getDisplayValue = (att, field) => {
    const dbValue = field === 'pct' ? (att.guadagno_pct ?? '') : (att.guadagno_fuori_mano ?? '');
    if (editing[att.id] && editing[att.id][field] !== undefined) {
      return editing[att.id][field];
    }
    return dbValue;
  };

  const handleInputChange = (att, field, value) => {
    setEditing(prev => ({
      ...prev,
      [att.id]: { ...prev[att.id], [field]: value },
    }));
    scheduleAutoSave(att, field, value);
  };

  // Alla focus: se il valore è 0, lo azzera così digitando non si appende allo 0
  const handleInputFocus = (att, field, currentDisplayValue) => {
    const num = parseFloat(currentDisplayValue);
    if (num === 0) {
      setEditing(prev => ({
        ...prev,
        [att.id]: { ...prev[att.id], [field]: '' },
      }));
    }
  };

  // Al blur: se il campo è vuoto, ripristina il valore DB
  const handleInputBlur = (att, field, dbValue) => {
    const current = editing[att.id]?.[field];
    if (current === undefined || current === '') {
      setEditing(prev => {
        const updated = { ...prev };
        if (updated[att.id]) {
          const { [field]: _, ...rest } = updated[att.id];
          updated[att.id] = Object.keys(rest).length > 0 ? rest : undefined;
        }
        return updated;
      });
    }
  };

  const calcGuadagno = (att) => {
    const pctRaw = getDisplayValue(att, 'pct');
    const fuoriRaw = getDisplayValue(att, 'fuori');
    const pct = parseFloat(pctRaw) || 0;
    const fuori = parseFloat(fuoriRaw) || 0;
    if (isFounder) {
      return pct + fuori;
    } else {
      const base = (pct / 100) * (att.revenue || 0);
      return base + fuori;
    }
  };

  // Fatturato TOTALE della serata (da event.total_revenue) — lookup O(1)
  const getEventTotalRevenue = (eventId) => eventsById.get(eventId)?.total_revenue || 0;

  const totalGuadagno = filtered.reduce(
    (s, { att }) => s + calcGuadagno(att),
    0
  );

  const totalPrometerRevenue = useMemo(() => filtered.reduce((s, { att }) => s + (att.revenue || 0), 0), [filtered]);

  // Per "Le mie serate", mostro solo il fatturato senza calcoli
  const onlySerate = tab === 'serate';
  // Solo admin/super4 vedono il fatturato totale della serata
  const canSeeTotalRevenue = userRole === 'admin' || userRole === 'super4';

  const getVenueLogo = (venueKey) => {
    if (!venueKey) return null;
    // Usa la stessa fonte della sezione Locali (DB + localStorage)
    const logo = getVenueLogoFromDB(venueKey);
    if (!logo.logoUrl) return null;
    return { url: logo.logoUrl, zoom: logo.zoom };
  };

  return (
    <Div className="space-y-5">
      {/* Search box */}
      {enriched.length > 0 && (
        <Div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <HtmlInput
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca per nome, locale, mese..."
            className="w-full bg-secondary/40 border border-border rounded-lg pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {search && (
            <Btn
              button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </Btn>
          )}
        </Div>
      )}

      {/* Totale summary */}
      {filtered.length > 0 && !onlySerate && (
        <Div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4 group"
            style={{ boxShadow: '0 4px 24px -6px rgba(167,139,250,0.15)' }}
          >
            <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
              style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
            <Div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -translate-y-8 translate-x-8"
              style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }} />
            <P className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Fatturato mio</P>
            <P className="text-xl font-bold text-primary">€{totalPrometerRevenue.toLocaleString('it-IT')}</P>
            <P className="text-xs text-muted-foreground mt-0.5">{filtered.length} serate</P>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4 group"
            style={{ boxShadow: '0 4px 24px -6px rgba(74,222,128,0.12)' }}
          >
            <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
              style={{ background: 'linear-gradient(90deg, transparent, #4ade80, transparent)' }} />
            <Div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -translate-y-8 translate-x-8"
              style={{ background: 'radial-gradient(circle, #4ade80, transparent 70%)' }} />
            <P className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Guadagno totale</P>
            <P className="text-xl font-bold text-green-400">€{totalGuadagno.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</P>
            <P className="text-xs text-muted-foreground mt-0.5">su percentuale + extra</P>
          </motion.div>
        </Div>
      )}

      {enriched.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-8 text-center"
        >
          <Euro className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <P className="text-sm text-muted-foreground">Nessuna serata trovata.</P>
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl border border-white/[0.06] bg-card p-6 text-center"
        >
          <P className="text-sm text-muted-foreground">Nessuna serata trovata per "{search}".</P>
        </motion.div>
      ) : (
        /* Scroll orizzontale per contenere tutte le colonne su mobile */
        <Div className="w-full">
          <Div className="space-y-2">
            {/* Header */}
             {!onlySerate ? (
               <Div className="grid text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-1"
                 style={{ gridTemplateColumns: canSeeTotalRevenue ? '1fr 52px 52px 52px 52px 52px' : '1fr 52px 52px 52px 52px' }}>
                 <Span>Serata</Span>
                 {canSeeTotalRevenue && <Span className="text-right">Tot.</Span>}
                 <Span className="text-right">Mio</Span>
                 <Span className="text-center">{isFounder ? 'Guad.' : '%'}</Span>
                 <Span className="text-center">Extra</Span>
                 <Span className="text-right">Guad.</Span>
               </Div>
            ) : (
              <Div className="grid text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-1"
                style={{ gridTemplateColumns: '1fr 64px 48px 48px 28px' }}>
                <Span>Serata</Span>
                <Span className="text-right">Fatturato</Span>
                <Span className="text-right">Tavoli</Span>
                <Span className="text-right">Locale</Span>
                <Span></Span>
              </Div>
            )}

            {rowsToRender.map(({ att, ev, dateLabel }) => {
              const revenue = att.revenue || 0;
              const dow = getDow(ev.date);
              const tables = calcTables(revenue, dow, ev.table_threshold);
              const guadagno = calcGuadagno(att);
              const pct = getDisplayValue(att, 'pct');
              const fuoriMano = getDisplayValue(att, 'fuori');
              const hasPct = (parseFloat(pct) || 0) > 0;
              const hasFuori = (parseFloat(fuoriMano) || 0) > 0;
              const isEditing = !!editing[att.id];

              if (onlySerate) {
                if (att._isVirtual) return null; // Le serate virtuali non hanno note, nascondo nel tab serate
                const logo = getVenueLogo(ev.venue);
                const isNoteOpen = !!expandedNotes[att.id];
                const noteVal = noteTexts[att.id] !== undefined ? noteTexts[att.id] : (att.notes || '');
                return (
                  <Div key={att.id} className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06]" style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.3)' }}>
                    <Btn
                      className="px-3 py-2.5 grid items-center gap-2 cursor-pointer active:bg-secondary/20"
                      style={{ gridTemplateColumns: '1fr 64px 48px 48px 28px' }}
                      onClick={() => toggleNote(att.id, att.notes)}
                    >
                      <Div className="min-w-0 flex items-center gap-1.5">
                        {logo && (
                          <Div style={{ width: 22, height: 22, overflow: 'hidden', flexShrink: 0 }} className="rounded flex items-center justify-center">
                            <Img src={logo.url} alt={ev.venue} style={{ width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${logo.zoom})`, transformOrigin: 'center' }} />
                          </Div>
                        )}
                        <Div className="min-w-0">
                          <P className="font-semibold text-xs truncate leading-tight">{ev.name}</P>
                          <P className="text-[10px] text-muted-foreground leading-tight">
                            {dateLabel}
                          </P>
                        </Div>
                      </Div>
                      <Div className="text-right">
                        <P className="text-xs font-bold text-primary">€{revenue.toLocaleString('it-IT')}</P>
                      </Div>
                      <Div className="text-right">
                        <P className="text-xs font-bold text-muted-foreground">{tables}</P>
                        <P className="text-[9px] text-muted-foreground">tavoli</P>
                      </Div>
                      <Div className="text-right">
                        <P className="text-[10px] text-muted-foreground truncate">{ev.venue || '—'}</P>
                      </Div>
                      <Div className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${isNoteOpen ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}>
                        {isNoteOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <NotebookPen className="w-3.5 h-3.5" />}
                      </Div>
                    </Btn>
                    {isNoteOpen && (
                      <Div className="border-t border-white/[0.06] px-3 py-3 space-y-2">
                        <P className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1">
                          <NotebookPen className="w-3 h-3" /> I miei appunti per questa serata
                        </P>
                        <HtmlTextarea
                          value={noteVal}
                          onClick={e => e.stopPropagation()}
                          onChange={e => handleNoteChange(att.id, e.target.value, att)}
                          placeholder="Lista clienti, aneddoti, note personali sulla serata..."
                          rows={12}
                          className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <Div className="flex justify-end items-center gap-2">
                          {savingNote[att.id] && (
                            <Span className="text-[10px] text-muted-foreground">Salvataggio...</Span>
                          )}
                          {!savingNote[att.id] && noteTexts[att.id] !== undefined && (
                            <Span className="text-[10px] text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> Salvato</Span>
                          )}
                        </Div>
                      </Div>
                    )}
                  </Div>
                );
              }

              // Tab "guadagni"
              const logo = getVenueLogo(ev.venue);
              const isVirtual = !!att._isVirtual;
              const prTotForEvent = prRevenueByEvent[ev.id] || 0;
              return (
                <Div
                   key={att.id}
                   className={`relative overflow-hidden rounded-2xl px-3 py-2.5 grid items-center gap-1.5 ${isVirtual ? 'border border-primary/30 bg-primary/5' : 'bg-card border border-white/[0.06]'}`}
                     style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.3)', gridTemplateColumns: canSeeTotalRevenue ? '1fr 52px 52px 52px 52px 52px' : '1fr 52px 52px 52px 52px' }}
                 >
                  <Div className="min-w-0 flex items-center gap-1.5">
                    {logo && (
                      <Div style={{ width: 22, height: 22, overflow: 'hidden', flexShrink: 0 }} className="rounded flex items-center justify-center">
                        <Img src={logo.url} alt={ev.venue} style={{ width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${logo.zoom})`, transformOrigin: 'center' }} />
                      </Div>
                    )}
                    <Div className="min-w-0">
                      <P className="font-semibold text-xs truncate leading-tight">{ev.name}</P>
                      <P className="text-[10px] text-muted-foreground leading-tight">
                        {ev.date ? format(parseISO(ev.date), 'd MMM yy', { locale: it }) : ''}
                        {isVirtual && <Span className="ml-1 text-primary/70">PR: €{prTotForEvent.toLocaleString('it-IT')}</Span>}
                      </P>
                    </Div>
                  </Div>

                  {/* Fatturato Totale - solo admin/super4 */}
                  {canSeeTotalRevenue && (
                    <Div className="text-right">
                      <P className="text-xs font-bold text-muted-foreground">€{getEventTotalRevenue(ev.id).toLocaleString('it-IT')}</P>
                    </Div>
                  )}

                  {/* Mio Fatturato */}
                  <Div className="text-right">
                    {isVirtual
                      ? <P className="text-xs font-bold text-muted-foreground/50">€0</P>
                      : <P className="text-xs font-bold text-primary">€{revenue.toLocaleString('it-IT')}</P>
                    }
                  </Div>

                  {/* % / Guadagno input */}
                  <Div className="flex items-center">
                    <HtmlInput
                      type="number"
                      min="0"
                      max={isFounder ? undefined : 100}
                      step="0.01"
                      placeholder="0"
                      value={pct}
                      onFocus={() => handleInputFocus(att, 'pct', pct)}
                      onBlur={() => handleInputBlur(att, 'pct', att.guadagno_pct ?? 0)}
                      onChange={e => handleInputChange(att, 'pct', e.target.value)}
                      className="w-full bg-secondary/40 border border-border rounded px-1 py-1 text-[11px] text-center focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </Div>

                  {/* Fuori mano input */}
                  <Div className="flex items-center">
                    <HtmlInput
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={fuoriMano}
                      onFocus={() => handleInputFocus(att, 'fuori', fuoriMano)}
                      onBlur={() => handleInputBlur(att, 'fuori', att.guadagno_fuori_mano ?? 0)}
                      onChange={e => handleInputChange(att, 'fuori', e.target.value)}
                      className="w-full bg-secondary/40 border border-border rounded px-1 py-1 text-[11px] text-center focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </Div>

                  {/* Guadagno finale */}
                  <Div className="text-right">
                    {(hasPct || hasFuori) ? (
                      <Div className="flex items-center justify-end gap-1">
                        {savedFeedback[att.id] && <Check className="w-3 h-3 text-green-400 shrink-0" />}
                        <P className="text-xs font-bold text-green-400">€{guadagno.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</P>
                      </Div>
                    ) : (
                      <P className="text-xs text-muted-foreground">—</P>
                    )}
                  </Div>
                </Div>
              );
            })}
          </Div>
        </Div>
      )}

    </Div>
  );
}