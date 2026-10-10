// Port di src/components/programmazione/AIConsoleBox.jsx (convertito da scripts/port/codemod.mjs).
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from '@/ui/motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Brain, Instagram, Star, RefreshCw, Gem, TrendingUp, TrendingDown, Minus, Search, X, Check, Sparkles, Clock, Crown } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/ui/use-toast';
import WhatsAppIcon from '@/web/components/shared/WhatsAppIcon';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { formatContactTime } from '@/legacy/utils/relativeTime';
import { rankingColor } from '@/legacy/utils/clientRanking';
import { useMarkClientContacted } from '@/web/hooks/useMarkClientContacted';
import SelectCheckbox from '@/web/components/client/SelectCheckbox';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import { useBulkSelection } from '@/web/lib/bulkSelectionContext';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { A, HtmlInput, HtmlOption, HtmlSelect, Table, Tbody, Td, Th, Thead, Tr } from '@/ui/elements';

const CAT_META = {
  nuovo:          { label: 'Nuovo',          color: '#34d399' },
  leader:         { label: 'Leader',         color: '#fbbf24' },
  inattivo:       { label: 'Inattivo',       color: '#94a3b8' },
  da_recuperare:  { label: 'Da recuperare',   color: '#ef4444' },
  top:            { label: 'Top',            color: '#facc15' },
  da_ricontattare:{ label: 'Da ricontattare', color: '#38bdf8' },
  stabile:        { label: 'Stabile',        color: '#a78bfa' },
};

const TREND_META = {
  up:     { icon: TrendingUp,   color: '#34d399', label: 'Su' },
  down:   { icon: TrendingDown, color: '#ef4444', label: 'Giu' },
  stable: { icon: Minus,        color: '#94a3b8', label: 'Stab' },
};

function TrendCell({ trend }) {
  const m = TREND_META[trend] || TREND_META.stable;
  const Icon = m.icon;
  return (
    <Span className="inline-flex items-center gap-0.5 text-[11px] font-semibold" style={{ color: m.color }}>
      <Icon className="w-3 h-3" />{m.label}
    </Span>
  );
}

function RecPill({ r, contactedAt, onCardClick, onContacted, markContacted, selectMode, isSel }) {
  const meta = CAT_META[r.categoria] || CAT_META.stabile;
  return (
    <Btn
      onClick={(e) => onCardClick(e, r)}
      className={`rounded-xl border p-3 space-y-2 active:bg-secondary/40 transition-colors cursor-pointer ${isSel ? 'border-violet-500' : 'border-border bg-secondary/20'}`}
      style={isSel ? { backgroundColor: 'rgba(139, 92, 246, 0.15)' } : undefined}>
      <Div className="flex items-center gap-1.5">
        {selectMode && <SelectCheckbox selected={isSel} />}
        <ClientAvatar client={{ photo_url: r.photo_url, name: r.name }} initials={(r.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()} size="sm" loading="eager" />
        {r.is_leader && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
        <P className="font-medium text-sm text-foreground truncate flex-1 min-w-0">{r.name}</P>
        {r.rating > 0 && (
          <Span className={`inline-flex items-center gap-0.5 text-xs font-bold shrink-0 ${rankingColor(r.rating)}`}>
            <Gem className="w-3 h-3" />{r.rating.toFixed(1)}
          </Span>
        )}
      </Div>
      <Div className="flex flex-wrap items-center gap-1.5">
        <Span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0"
          style={{ background: `${meta.color}1a`, color: meta.color }}>
          {meta.label}
        </Span>
        <Span className="text-[10px] text-muted-foreground">P{r.priorita}</Span>
        <Span className="text-[10px] text-muted-foreground/50">·</Span>
        <TrendCell trend={r.trend} />
        <Span className="text-[10px] text-muted-foreground/50">·</Span>
        <Span className="text-[10px] text-muted-foreground truncate min-w-0">{r.zona}</Span>
        <Span className="text-[10px] text-muted-foreground ml-auto whitespace-nowrap">{r.presenze_totali} pres.</Span>
      </Div>
      {(r.descrizione || r.perche_ora || r.approccio || contactedAt) && (
        <Div className="space-y-0.5">
          {r.descrizione && <P className="text-[11px] text-foreground/80 leading-snug">{r.descrizione}</P>}
          {r.perche_ora && (
            <P className="text-[11px] text-violet-300/90 leading-snug">
              <Span className="font-semibold">Perché ora: </Span>{r.perche_ora}
            </P>
          )}
          {r.approccio && (
            <P className="text-[10px] text-muted-foreground leading-snug">
              <Span className="font-semibold text-muted-foreground/90">Approccio: </Span>{r.approccio}
            </P>
          )}
          {contactedAt && (
            <P className="text-[10px] text-emerald-400">Sentito {formatContactTime(contactedAt)}</P>
          )}
        </Div>
      )}
      <Div className="flex items-center gap-2 pt-0.5">
        {r.phone && (
          <A
            href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '')}`}
            target="_blank" rel="noreferrer"
            onClick={(e) => { e.stopPropagation(); onContacted(m => ({ ...m, [r.client_id]: new Date().toISOString() })); markContacted(r.client_id); }}
            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 active:bg-emerald-500/20 transition-colors"
            accessibilityLabel="Contatta su WhatsApp"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
          </A>
        )}
        {r.instagram && (
          <A
            href={`https://instagram.com/${r.instagram.replace('@', '')}`}
            target="_blank" rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 active:bg-pink-500/20 transition-colors"
            accessibilityLabel="Instagram"
          >
            <Instagram className="w-3.5 h-3.5" />
          </A>
        )}
      </Div>
    </Btn>
  );
}

export default function AIConsoleBox({ clients, onContact, onDetail, promoterId: promoterIdProp }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { toast } = useToast();
  const promoterId = promoterIdProp || user?.promoter_id;
  const markContacted = useMarkClientContacted();
  const [justContacted, setJustContacted] = useState({});
  const [catFilter, setCatFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [recalculating, setRecalculating] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [sortMode, setSortMode] = useState('intelligent');
  const boxRef = useRef(null);
  // Riferimento mutabile al prevComputedAt per la subscription realtime:
  // permette di rilevare l'update del record AISuggestion anche dopo che
  // il polling è scaduto (la funzione backend può impiegare fino a 5 min).
  const prevComputedAtRef = useRef(null);

  const SORT_MODES = [
    { key: 'intelligent', label: 'Ordine intelligente', icon: Brain },
    { key: 'rating', label: 'Rating', icon: Gem },
    { key: 'nuovi', label: 'Nuovi clienti', icon: Sparkles },
    { key: 'recenza', label: 'Recenza', icon: Clock },
    { key: 'leader', label: 'Leader', icon: Crown },
  ];
  const bulk = useBulkSelection();
  const selectMode = bulk?.selectMode;
  const selectedIds = bulk?.selectedIds;
  const toggleSelect = bulk?.toggleSelect;
  const isSel = (id) => !!selectedIds?.has(id);

  const { data: rec, isLoading } = useQuery({
    queryKey: ['aiSuggestion', promoterId],
    // Usa il backend function (asServiceRole) invece della query SDK diretta:
    // l'RLS su AISuggestion usa {{user.data.promoter_id}} che non risolve per i
    // promoter non-admin, bloccando la lettura. Il backend function bypassa l'RLS
    // ma restituisce solo il record del promoter autenticato (sicurezza garantita lato server).
    queryFn: async () => {
      const res = await base44.functions.invoke('getMyAIAnalysis', { promoter_id: promoterId });
      return res?.data?.records || [];
    },
    enabled: !!promoterId,
    staleTime: 5 * 60000,
    gcTime: 60 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const summary = rec?.[0]?.summary || '';
  const recommendations = useMemo(() => {
    const base = rec?.[0]?.recommendations || [];
    // Merge live dei dati cliente (zona, leader, contatti) sulle raccomandazioni
    // pre-calcolate: le modifiche al profilo si riflettono subito senza ricalcolare l'AI.
    const clientsMap = {};
    (clients || []).forEach(c => { clientsMap[c.id] = c; });
    const merged = base.map(r => {
      const live = clientsMap[r.client_id];
      if (!live) return r;
      return {
        ...r,
        zona: live.residenza_key ? String(live.residenza_key).replace(/_/g, ' ') : (r.zona || 'N/D'),
        is_leader: !!live.is_leader,
        phone: live.phone || r.phone || '',
        instagram: live.instagram || r.instagram || '',
        photo_url: live.photo_url || '',
      };
    });
    const sorted = [...merged];
    if (sortMode === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortMode === 'nuovi') {
      sorted.sort((a, b) => {
        const aNew = a.categoria === 'nuovo' || (a.presenze_totali || 0) <= 3;
        const bNew = b.categoria === 'nuovo' || (b.presenze_totali || 0) <= 3;
        if (aNew !== bNew) return bNew - aNew;
        return (b.presenze_ultimo_mese || 0) - (a.presenze_ultimo_mese || 0);
      });
    } else if (sortMode === 'recenza') {
      sorted.sort((a, b) => (b.presenze_ultimo_mese || 0) - (a.presenze_ultimo_mese || 0) || (b.rating || 0) - (a.rating || 0));
    } else if (sortMode === 'leader') {
      sorted.sort((a, b) => (Number(b.is_leader) - Number(a.is_leader)) || (b.rating || 0) - (a.rating || 0));
    } else {
      // 'intelligent' — logica originale: weekend per giorno, settimana con boost nuovi
      const dow = new Date().getDay();
      const dayKey = dow === 5 ? 'g_v' : dow === 6 ? 'g_s' : dow === 0 ? 'g_d' : null;
      if (dayKey) {
        sorted.sort((a, b) => (b[dayKey] || 0) - (a[dayKey] || 0) || (b.rating || 0) - (a.rating || 0));
      } else {
        sorted.sort((a, b) => {
          const aPromising = (a.categoria === 'nuovo' || (a.presenze_totali || 0) <= 3) && (a.presenze_ultimo_mese || 0) >= 1 && a.trend !== 'down';
          const bPromising = (b.categoria === 'nuovo' || (b.presenze_totali || 0) <= 3) && (b.presenze_ultimo_mese || 0) >= 1 && b.trend !== 'down';
          const aScore = (a.rating || 0) + (aPromising ? 3 : 0);
          const bScore = (b.rating || 0) + (bPromising ? 3 : 0);
          return bScore - aScore;
        });
      }
    }
    return sorted;
  }, [rec, clients, sortMode]);
  const computedAt = rec?.[0]?.computed_at;

  // Subscription realtime: quando la funzione backend aggiorna il record
  // AISuggestion (create/update), la UI si aggiorna istantaneamente — anche
  // se il polling è già scaduto. Questo risolve il caso in cui la funzione
  // impiega più di 120s (le chiamate LLM per promoter con molti clienti
  // possono richiedere 2-3 min): prima l'utente vedeva lo spinner fermarsi
  // senza aggiornamento, e l'analisi appariva solo al refresh manuale.
  useEffect(() => {
    if (!promoterId) return;
    const unsubscribe = base44.entities.AISuggestion.subscribe((event) => {
      const data = event?.data;
      if (!data || data.promoter_id !== promoterId) return;
      if (event.type !== 'update' && event.type !== 'create') return;
      // Aggiorna solo se c'è un nuovo computed_at (evita loop con l'update
      // della query stessa che scriveremmo via setQueryData).
      const newComputedAt = data.computed_at;
      if (prevComputedAtRef.current && newComputedAt && newComputedAt !== prevComputedAtRef.current) {
        prevComputedAtRef.current = newComputedAt;
        qc.invalidateQueries({ queryKey: ['aiSuggestion', promoterId] });
        setRecalculating(false);
        setJustUpdated(true);
        setTimeout(() => setJustUpdated(false), 2500);
      }
    });
    return unsubscribe;
  }, [promoterId, qc]);

  const cats = useMemo(() => {
    const set = new Set();
    recommendations.forEach(r => { if (r.categoria) set.add(r.categoria); });
    return ['all', ...Array.from(set)];
  }, [recommendations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recommendations.filter(r => {
      if (catFilter !== 'all' && r.categoria !== catFilter) return false;
      if (q && !r.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [recommendations, catFilter, search]);

  const visible = expanded ? filtered : filtered.slice(0, 50);

  const handleRefresh = async () => {
    if (!promoterId || recalculating) return;
    setRecalculating(true);
    setJustUpdated(false);
    const prevComputedAt = computedAt;
    prevComputedAtRef.current = prevComputedAt;
    // La funzione backend è sincrona (elabora tutte le chiamate LLM e poi
    // risponde). Fire-and-forget: non attendiamo la risposta HTTP (potrebbe
    // impiegare fino a 5 min) ma facciamo polling + subscription realtime.
    // Se la funzione fallisce immediatamente (401/500), mostriamo un toast.
    base44.functions.invoke('computeAISuggestions', { promoter_id: promoterId }).catch((err) => {
      // Errore immediato (non timeout): la funzione non è partita o ha
      // ritornato un errore HTTP prima che il polling partisse.
      setRecalculating(false);
      const errData = err?.data || err?.response?.data || err;
      if (errData?.error === 'rate_limited') {
        toast({
          title: 'Analisi non disponibile',
          description: errData?.message || 'Hai già ricalcolato. Riprova più tardi.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Analisi non disponibile',
          description: 'Si è verificato un errore. Riprova tra qualche secondo.',
          variant: 'destructive',
        });
      }
    });
    const startedAt = Date.now();
    const POLL_INTERVAL = 3000;
    const POLL_TIMEOUT = 300000; // 5 min — matching il limite massimo della funzione
    const tick = async () => {
      try {
        const freshRes = await base44.functions.invoke('getMyAIAnalysis', { promoter_id: promoterId });
        const fresh = freshRes?.data?.records || [];
        const newComputedAt = fresh?.[0]?.computed_at;
        if (newComputedAt && newComputedAt !== prevComputedAt) {
          prevComputedAtRef.current = newComputedAt;
          qc.setQueryData(['aiSuggestion', promoterId], fresh);
          setRecalculating(false);
          setJustUpdated(true);
          setTimeout(() => setJustUpdated(false), 2500);
          return;
        }
      } catch (e) { /* retry al prossimo tick */ }
      if (Date.now() - startedAt > POLL_TIMEOUT) {
        // Timeout: la funzione potrebbe essere ancora in corso sul backend
        // (le chiamate LLM per promoter con molti clienti possono richiedere
        // fino a 5 min). La subscription realtime aggiornerà la UI appena
        // il record sarà pronto. Avvisiamo l'utente invece di lasciarlo
        // nel dubbio.
        qc.invalidateQueries({ queryKey: ['aiSuggestion', promoterId] });
        setRecalculating(false);
        toast({
          title: 'Analisi in elaborazione',
          description: 'L\'analisi sta richiedendo più del solito. La vedrai apparire automaticamente quando sarà pronta.',
        });
        return;
      }
      setTimeout(tick, POLL_INTERVAL);
    };
    setTimeout(tick, 3000);
  };

  const onCardClick = (e, r) => {
    const clientObj = { id: r.client_id, name: r.name };
    if (selectMode) { toggleSelect?.(clientObj); return; }
    if (e?.ctrlKey || e?.metaKey) { e.preventDefault(); toggleSelect?.(clientObj); return; }
    onDetail?.(clientObj);
  };

  if (isLoading) {
    return (
      <Div className="relative overflow-hidden rounded-2xl border border-violet-500/15 bg-card p-4"
        style={{ boxShadow: '0 4px 24px -6px rgba(167,139,250,0.12)' }}>
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
        <Div className="flex items-center justify-between mb-3">
          <Div className="flex items-center gap-2">
            <Div className="p-1.5 rounded-lg" style={{ background: '#a78bfa1a' }}>
              <Brain className="w-4 h-4" style={{ color: '#a78bfa' }} />
            </Div>
            <Div className="h-3 w-40 rounded vibra-skeleton" />
          </Div>
          <Div className="h-6 w-24 rounded-lg vibra-skeleton" />
        </Div>
        <Div className="h-3 w-3/4 rounded mb-3 vibra-skeleton" />
        <Div className="space-y-2">
          {[0, 1, 2, 3].map(i => <Div key={i} className="h-10 w-full rounded-lg vibra-skeleton" />)}
        </Div>
      </Div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.045 }}
    >
      <Div
        ref={boxRef}
        className="relative overflow-hidden rounded-2xl border border-violet-500/15 bg-card p-4 space-y-3"
        style={{ boxShadow: '0 4px 24px -6px rgba(167,139,250,0.12)' }}
      >
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />

        {/* Header */}
        <Div className="flex items-center justify-between">
          <SectionHeader icon={Brain} title="Analisi Intelligente" color="#a78bfa" />
          <Div className="flex items-center gap-2">
            {recalculating ? (
              <Span className="text-[11px] text-violet-300">Aggiornamento in corso…</Span>
            ) : justUpdated ? (
              <Span className="text-[11px] text-emerald-300">Aggiornato adesso</Span>
            ) : computedAt ? (
              <Span className="text-[11px] text-muted-foreground">
                Aggiornato {formatContactTime(computedAt)}
              </Span>
            ) : null}
            <Btn
              button
              onClick={handleRefresh}
              disabled={recalculating || !promoterId}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-50 ${
                justUpdated
                  ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                  : 'border-violet-500/30 text-violet-300 bg-violet-500/10 hover:bg-violet-500/20'
              }`}>
              {justUpdated
                ? <Check className="w-3 h-3" />
                : <RefreshCw className={`w-3 h-3 ${recalculating ? 'animate-spin' : ''}`} />}
              {justUpdated ? 'Aggiornato' : recalculating ? 'Analizzo…' : 'Ricalcola'}
            </Btn>
          </Div>
        </Div>

        {!recommendations.length ? (
          <Div className="text-center py-10 text-sm text-muted-foreground">
            <Brain className="w-8 h-8 mx-auto mb-2 text-violet-400/60" />
            <P>L'Analisi Intelligente del tuo parco clienti non è ancora pronta.</P>
            <P className="text-xs mt-1">Premi «Ricalcola» per generare i ragionamenti sui tuoi clienti.</P>
          </Div>
        ) : (
          <>
            {/* Sintesi AI */}
            {summary && (
              <Div className="rounded-xl bg-violet-500/5 border border-violet-500/15 px-3 py-2.5">
                <P className="text-[10px] font-semibold uppercase tracking-wider text-violet-300 mb-1">Sintesi del parco paganti</P>
                <P className="text-xs text-foreground/90 leading-relaxed">{summary}</P>
              </Div>
            )}

            {/* Ordinamento */}
            <Div className="flex items-center gap-1.5 flex-wrap">
              <Span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 shrink-0">Ordina</Span>
              {SORT_MODES.map(({ key, label, icon: SortIcon }) => (
                <Btn
                  button
                  key={key}
                  onClick={() => setSortMode(key)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    sortMode === key
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                      : 'bg-secondary/50 text-muted-foreground border border-border/40 hover:bg-secondary hover:text-foreground'
                  }`}>
                  <SortIcon className="w-3 h-3" />{label}
                </Btn>
              ))}
            </Div>

            {/* Filtri */}
            <Div className="flex flex-wrap items-center gap-2">
              <Div className="relative flex-1 min-w-[140px] max-w-[220px]">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <HtmlInput
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cerca cliente…"
                  className="w-full pl-7 pr-7 py-1.5 text-xs rounded-lg bg-secondary/40 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/40"
                />
                {search && (
                  <Btn
                    button
                    onClick={() => setSearch('')}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-3 h-3" />
                  </Btn>
                )}
              </Div>
              {cats.length > 2 && (
                <HtmlSelect
                  value={catFilter}
                  onChange={e => setCatFilter(e.target.value)}
                  className="text-xs rounded-lg bg-secondary/40 border border-border text-foreground px-2 py-1.5 focus:outline-none focus:border-violet-500/40"
                >
                  {cats.map(c => <HtmlOption key={c} value={c}>{c === 'all' ? 'Tutte le categorie' : (CAT_META[c]?.label || c)}</HtmlOption>)}
                </HtmlSelect>
              )}
              <Span className="text-[11px] text-muted-foreground ml-auto">{filtered.length} clienti</Span>
            </Div>

            {/* Lista mobile — pillole verticali */}
            <Div className="sm:hidden space-y-2">
              {visible.map(r => (
                <RecPill
                  key={r.client_id}
                  r={r}
                  contactedAt={justContacted[r.client_id]}
                  onCardClick={onCardClick}
                  onContacted={setJustContacted}
                  markContacted={markContacted}
                  selectMode={selectMode}
                  isSel={isSel(r.client_id)}
                />
              ))}
              {visible.length === 0 && (
                <P className="text-center text-xs text-muted-foreground py-6">Nessun cliente per questi filtri.</P>
              )}
            </Div>

            {/* Tabella desktop */}
            <Div className="hidden sm:block overflow-x-auto client-table-scrollbar -mx-1 px-1">
              <Table className="w-full text-sm min-w-[820px] border-collapse">
                <Thead>
                  <Tr className="border-b border-white/[0.06] text-left">
                    <Th className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sticky left-0 bg-card">Cliente</Th>
                    <Th className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Rating</Th>
                    <Th className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Presenze</Th>
                    <Th className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Trend</Th>
                    <Th className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Categoria</Th>
                    <Th className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Consigli e commenti</Th>
                    <Th className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Azioni</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {visible.map(r => {
                    const meta = CAT_META[r.categoria] || CAT_META.stabile;
                    const contactedAt = justContacted[r.client_id];
                    return (
                      <Tr
                        key={r.client_id}
                        onClick={(e) => onCardClick(e, r)}
                        className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer align-top ${isSel(r.client_id) ? 'bg-violet-500/10' : ''}`}>
                        <Td className="px-2 py-2 sticky left-0 bg-card">
                          <Div className="flex items-center gap-1.5">
                            {selectMode && <SelectCheckbox selected={isSel(r.client_id)} />}
                            <ClientAvatar client={{ photo_url: r.photo_url, name: r.name }} initials={(r.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()} size="sm" loading="eager" />
                            {r.is_leader && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                            <Div className="min-w-0">
                              <P className="font-medium text-foreground leading-tight truncate max-w-[160px]">{r.name}</P>
                              <P className="text-[10px] text-muted-foreground leading-tight">{r.zona}</P>
                            </Div>
                          </Div>
                        </Td>
                        <Td className="px-2 py-2 text-right">
                          {r.rating > 0 ? (
                            <Span className={`inline-flex items-center gap-0.5 text-xs font-bold ${rankingColor(r.rating)}`}>
                              <Gem className="w-3 h-3" />{r.rating.toFixed(1)}
                            </Span>
                          ) : <Span className="text-muted-foreground">–</Span>}
                        </Td>
                        <Td className="px-2 py-2 text-right">
                          <Span className="text-xs font-semibold text-foreground">{r.presenze_totali}</Span>
                          <Span className="text-[10px] text-muted-foreground block leading-tight">ult.mese {r.presenze_ultimo_mese}</Span>
                        </Td>
                        <Td className="px-2 py-2 text-center"><TrendCell trend={r.trend} /></Td>
                        <Td className="px-2 py-2">
                          <Span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                            style={{ background: `${meta.color}1a`, color: meta.color }}>
                            {meta.label}
                          </Span>
                          <Span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">P{r.priorita}</Span>
                        </Td>
                        <Td className="px-2 py-2 max-w-[340px]">
                          {r.descrizione && <P className="text-[11px] text-foreground/80 leading-snug">{r.descrizione}</P>}
                          {r.perche_ora && (
                            <P className="text-[11px] text-violet-300/90 leading-snug mt-0.5">
                              <Span className="font-semibold">Perché ora: </Span>{r.perche_ora}
                            </P>
                          )}
                          {r.approccio && (
                            <P className="text-[10px] text-muted-foreground leading-snug mt-0.5">
                              <Span className="font-semibold text-muted-foreground/90">Approccio: </Span>{r.approccio}
                            </P>
                          )}
                          {contactedAt && (
                            <P className="text-[10px] text-emerald-400 mt-0.5">Sentito {formatContactTime(contactedAt)}</P>
                          )}
                        </Td>
                        <Td className="px-2 py-2">
                          <Div className="flex items-center justify-end gap-1">
                            {r.phone && (
                              <A
                                href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank" rel="noreferrer"
                                onClick={(e) => { e.stopPropagation(); setJustContacted(m => ({ ...m, [r.client_id]: new Date().toISOString() })); markContacted(r.client_id); }}
                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                accessibilityLabel="Contatta su WhatsApp"
                              >
                                <WhatsAppIcon className="w-3.5 h-3.5" />
                              </A>
                            )}
                            {r.instagram && (
                              <A
                                href={`https://instagram.com/${r.instagram.replace('@', '')}`}
                                target="_blank" rel="noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition-colors"
                                accessibilityLabel="Instagram"
                              >
                                <Instagram className="w-3.5 h-3.5" />
                              </A>
                            )}
                          </Div>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Div>
            {filtered.length > 50 && (
              <Div className="flex justify-center pt-1">
                <Btn
                  button
                  onClick={() => {
                    if (expanded) { setExpanded(false); boxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
                    else setExpanded(true);
                  }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-violet-500/30 text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 transition-colors">
                  {expanded ? 'Mostra meno' : `Mostra tutti (${filtered.length})`}
                </Btn>
              </Div>
            )}
          </>
        )}
      </Div>
      {expanded && filtered.length > 50 && (
        <Div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center pt-2 sm:sticky sm:bottom-2 sm:z-30">
          <Btn
            button
            onClick={() => {
    setExpanded(false);
    webWindow.scrollTo({
      top: boxRef.current.offsetTop - 100,
      behavior: 'smooth'
    });
  }}
            className="text-xs font-semibold px-4 py-2 rounded-full border border-violet-400/40 text-violet-100 bg-violet-600/50 backdrop-blur-md hover:bg-violet-600/70 transition-colors shadow-lg">
            ↑ Comprimi
          </Btn>
        </Div>
      )}
    </motion.div>
  );
}