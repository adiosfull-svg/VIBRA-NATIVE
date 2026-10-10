// Port di src/components/ilmiovibra/MieiProgressi.jsx (convertito da scripts/port/codemod.mjs).
import { STALE_FULL_TABLE, GC_FULL_TABLE } from '@/web/lib/query-client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { fetchByPromoter, fetchAll } from '@/web/lib/safeData';
import { format, parseISO, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';
import { calcTables } from '@/legacy/utils/tables';
import { computePromoterAggregates } from '@/legacy/utils/promoterAggregates';
import { TrendingUp, Star, ChevronDown, Trophy, LayoutGrid, Calendar, Target } from '@/ui/icons.generated';
import { computePromoterStats, computeAutoUnlocked, RARITY_COLORS, RARITY_ORDER, RARITY_LABELS, RARITY_BADGE } from '@/legacy/utils/achievementLogic';
import { useVenueLogo } from '@/web/hooks/useVenueLogo';
import CachedImage from '@/web/components/shared/CachedImage';
import { useVibraLogo } from '@/web/hooks/useVibraLogo';
import UPlotLineChart from '@/web/components/promoter/UPlotLineChart';
import UPlotBarChart from '@/web/components/promoter/UPlotBarChart';
import ChartFullscreen, { FullscreenButton } from '@/web/components/charts/ChartFullscreen';
import SectionHeader from '@/web/components/shared/SectionHeader';
import SerateHeatmap from '@/web/components/promoter/SerateHeatmap';
import TablesStreakHeatmap from '@/web/components/promoter/TablesStreakHeatmap';
import PromoterRecordCard from '@/web/components/ilmiovibra/PromoterRecordCard';
import { computePromoterRecords, computePromoterRank } from '@/legacy/utils/promoterRecords';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlOption, HtmlSelect, Table, Tbody, Td, Th, Thead, Tr } from '@/ui/elements';

// Stagioni: stesse date esatte usate in PromoterSeasonStats (10 ottobre – 9 ottobre)
const SEASONS = [
  { key: '2022/2023', label: '2022/2023', dateFrom: '2022-10-10', dateTo: '2023-10-09' },
  { key: '2023/2024', label: '2023/2024', dateFrom: '2023-10-10', dateTo: '2024-10-09' },
  { key: '2024/2025', label: '2024/2025', dateFrom: '2024-10-10', dateTo: '2025-10-09' },
  { key: '2025/2026', label: '2025/2026', dateFrom: '2025-10-10', dateTo: '2026-10-09' },
];

const LOGO_KEY_ALIASES = { 'Ammare Frontemare': 'Frontemare' };

function VenueLogo({ venueKey }) {
  const key = LOGO_KEY_ALIASES[venueKey] || venueKey || '__festivo__';
  const { logoUrl } = useVenueLogo(key);
  const VENUE_HEX = {
    'Frontemare': '#60a5fa', 'Nemesi Club Type': '#818cf8', 'Mantra': '#fb923c',
    'Hi.Club Brass': '#4ade80', 'Toma': '#fbbf24', 'Superstar Pineta': '#f472b6',
    'Paprika Scilla': '#38bdf8', 'Estasi Scilla': '#7dd3fc', 'Fantasya Living': '#a5b4fc',
    'Loonatica Maison del Mare': '#ea580c', 'Kolossal Brass': '#86efac',
    'Chapeau Club Type': '#c084fc',
  };
  const hex = venueKey ? (VENUE_HEX[venueKey] || '#888') : '#ef4444';
  if (!logoUrl) return <Span className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: hex + '60' }} />;
  return (
    <Div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0 bg-card">
      <CachedImage src={logoUrl} alt="" className="w-full h-full object-contain" />
    </Div>
  );
}

// Tabella chiusura tavoli per locale (come PromoterCard → ClosedTablesCard)
const VENUE_ROWS = [
  { label: 'Frontemare',                sublabel: 'Ven. Estate',  venueKey: 'Ammare Frontemare',         isExtra: false },
  { label: 'Paprika Scilla',            sublabel: 'Ven. Estate',  venueKey: 'Paprika Scilla',            isExtra: false },
  { label: 'Estasi Scilla',             sublabel: 'Ven. Estate',  venueKey: 'Estasi Scilla',             isExtra: false },
  { label: 'Nemesi Club Type',          sublabel: 'Ven. Inverno', venueKey: 'Nemesi Club Type',          isExtra: false },
  { label: 'Fantasya Living',           sublabel: 'Ven. Inverno', venueKey: 'Fantasya Living',           isExtra: false },
  { label: 'Mantra',                    sublabel: 'Sab. Estate',  venueKey: 'Mantra',                    isExtra: false },
  { label: 'Loonatica Maison del Mare', sublabel: 'Sab. Estate',  venueKey: 'Loonatica Maison del Mare', isExtra: false },
  { label: 'Hi.Club Brass',             sublabel: 'Sab. Inverno', venueKey: 'Hi.Club Brass',             isExtra: false },
  { label: 'Kolossal Brass',            sublabel: 'Sab. Inverno', venueKey: 'Kolossal Brass',            isExtra: false },
  { label: 'Toma',                      sublabel: 'Dom. Estate',  venueKey: 'Toma',                      isExtra: false },
  { label: 'Superstar Pineta',          sublabel: 'Dom. Inverno', venueKey: 'Superstar Pineta',          isExtra: false },
  { label: 'Chapeau Club Type',         sublabel: 'Dom. Inverno', venueKey: 'Chapeau Club Type',         isExtra: false },
  { label: 'Extra/Festivi',             sublabel: 'Speciali',     venueKey: null,                        isExtra: true  },
];

// Gagliardetti rarity: livelli progressivi in base a quanti achievement hai sbloccato in quella fascia
const RARITY_TIERS = [
  { pct: 100, label: 'Completo', stars: 3 },
  { pct: 66,  label: 'Avanzato', stars: 2 },
  { pct: 33,  label: 'In corso', stars: 1 },
];

function RarityBadge({ rarity, total, unlocked }) {
  const colors = RARITY_COLORS[rarity];
  const badge = RARITY_BADGE[rarity];
  const pct = total > 0 ? Math.round((unlocked / total) * 100) : 0;
  const tier = RARITY_TIERS.find(t => pct >= t.pct) || null;
  const isComplete = pct >= 100;

  return (
    <Div className={`relative rounded-xl border p-2 sm:p-3 flex flex-col items-center gap-1.5 transition-all ${
      isComplete
        ? `${colors.bg} ${colors.border} shadow-lg`
        : pct > 0
          ? `bg-secondary/15 ${colors.border} opacity-80`
          : 'bg-secondary/10 border-border/30 opacity-40 grayscale'
    }`}>
      {/* Gagliardetto */}
      <Div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl border-2 transition-all ${
        isComplete ? `bg-gradient-to-br ${badge.gradient} ${colors.border} shadow-md` : `bg-secondary/20 ${colors.border}`
      }`}>
        {isComplete
          ? <Span className="drop-shadow-lg">{badge.emoji}</Span>
          : <Span className="text-2xl opacity-40">🔒</Span>
        }
      </Div>

      {/* Stelle */}
      {tier && (
        <Div className="flex gap-0.5">
          {[1, 2, 3].map(s => (
            <Span key={s} className={`text-[10px] ${s <= tier.stars ? 'opacity-100' : 'opacity-20'}`}>⭐</Span>
          ))}
        </Div>
      )}

      <Div className="text-center">
        <P className={`text-[11px] font-bold leading-tight ${isComplete ? colors.text : 'text-muted-foreground'}`}>
          {badge.label}
        </P>
        <P className="text-[9px] text-muted-foreground mt-0.5">{unlocked}/{total}</P>
      </Div>

      {/* Progress ring mini */}
      <Div className="w-full bg-secondary/40 rounded-full h-1">
        <Div
          className={`h-1 rounded-full transition-all ${isComplete ? 'bg-gradient-to-r from-yellow-400 to-primary' : `bg-gradient-to-r ${badge.gradient}`}`}
          style={{ width: `${pct}%` }}
        />
      </Div>
    </Div>
  );
}

function AchievementsBacheca({ promoter, isActive, clients = EMPTY_ARR, attendances = EMPTY_ARR, events = EMPTY_ARR, promoters = EMPTY_ARR }) {
  const { logoDataUrl: vibraLogoUrl } = useVibraLogo();

  // Snapshot pre-calcolato dal backend (caricamento istantaneo, niente flash).
  // Quando presente, la bacheca si renderizza a costo zero senza fetch né calcoli.
  const cached = promoter?.cum_ach_by_rarity;
  const hasCache = cached && typeof cached === 'object' && promoter?.cum_ach_total != null;

  const { data: achievements = EMPTY_ARR } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.filter({ is_active: true }),
    enabled: isActive && !hasCache,
    staleTime: 10 * 60000,
    refetchOnWindowFocus: false,
  });

  const stats = useMemo(() => {
    if (hasCache || !promoter) return {};
    return computePromoterStats(promoter, clients, attendances, events, promoters);
  }, [hasCache, promoter, clients, attendances, events, promoters]);

  const autoUnlocked = useMemo(
    () => hasCache ? null : computeAutoUnlocked(achievements, stats),
    [hasCache, achievements, stats]
  );

  // Raggruppa per rarità (ordine crescente per la bacheca: bronzo→leggenda)
  const rarityStats = useMemo(() => {
    if (hasCache) return cached;
    const out = {};
    [...RARITY_ORDER].reverse().forEach(r => {
      const all = achievements.filter(a => (a.rarity || 'bronzo') === r);
      const done = all.filter(a => autoUnlocked.has(a.id)).length;
      if (all.length > 0) out[r] = { total: all.length, unlocked: done };
    });
    return out;
  }, [hasCache, cached, achievements, autoUnlocked]);

  const totalUnlocked = hasCache ? (promoter.cum_ach_unlocked || 0) : achievements.filter(a => autoUnlocked.has(a.id)).length;
  const totalCount = hasCache ? (promoter.cum_ach_total || 0) : achievements.length;
  if (!hasCache && achievements.length === 0) return null;

  return (
    <Div
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4 space-y-4"
      style={{ boxShadow: '0 4px 24px -6px rgba(251,191,36,0.08)' }}
    >
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
        style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }} />
      <Div className="flex items-center justify-between">
        <Div className="flex items-center gap-2">
          <SectionHeader icon={Trophy} title="Bacheca Riconoscimenti" color="#fbbf24" />
          {vibraLogoUrl && (
            <CachedImage src={vibraLogoUrl} alt="Vibra" className="h-9 object-contain opacity-90" />
          )}
        </Div>
        <Span className="text-xs font-bold text-primary">{totalUnlocked}/{totalCount}</Span>
      </Div>

      <Div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {[...RARITY_ORDER].reverse().map(rarity => {
          const rs = rarityStats[rarity];
          if (!rs || !rs.total) return null;
          return (
            <RarityBadge
              key={rarity}
              rarity={rarity}
              total={rs.total}
              unlocked={rs.unlocked}
            />
          );
        })}
      </Div>

      <P className="text-[10px] text-muted-foreground text-center italic">
        Completa tutti gli achievement di ogni fascia per ricevere un premio 🎖️
      </P>
    </Div>
  );
}

// ── Helper: parsing data veloce (evita parseISO ripetuto) ──
function dowFromDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

// Array vuoto a identità STABILE per i default dei useQuery/props. Con `= []` ogni render crea un
// array nuovo mentre i dati non ci sono (query disabilitata o in caricamento): tutti gli useMemo che
// lo hanno tra le dipendenze (record, rank, grafici) si ricalcolavano a OGNI render, anche solo per
// un cambio di select. Con una costante restano memoizzati.
const EMPTY_ARR = [];
const ZERO_BUCKET = Object.freeze({ revenue: 0, presences: 0, tables: 0 });
const ZERO_VENUE = Object.freeze({ presenti: 0, myRev: 0, myTav: 0 });

// 'YYYY-MM-DD' normalizzato (stesso giorno locale che darebbe parseISO). Per le date solo-giorno
// (il caso reale) è un semplice controllo di lunghezza: niente parseISO/isWithinInterval per riga.
function dayKeyOf(date) {
  if (typeof date === 'string' && date.length === 10) return date;
  try { return format(parseISO(date), 'yyyy-MM-dd'); } catch { return null; }
}

// Monta i blocchi pesanti (grafici uPlot, heatmap) a stadi, UNO per volta e solo DOPO le animazioni
// di ingresso della pagina (che restano esattamente quelle originali: tab 0,35s + card record 0,45s).
// Prima si montavano tutti al primo render: un unico task lungo che ritardava l'avvio dell'animazione
// e la faceva scattare. Il primo stadio parte a `startDelay` ms dal mount, i successivi un frame dopo l'altro.
// Lato server (test) monta tutto.
function useStagedMount(total, startDelay = 520) {
  const ssr = typeof window === 'undefined';
  const [stage, setStage] = useState(ssr ? total : 0);
  useEffect(() => {
    if (ssr || stage >= total) return;
    if (stage === 0) {
      const t = setTimeout(() => setStage(1), startDelay);
      return () => clearTimeout(t);
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => setStage((x) => x + 1)); });
    return () => { cancelAnimationFrame(raf1); if (raf2) cancelAnimationFrame(raf2); };
  }, [stage, total, ssr, startDelay]);
  return stage;
}

// Segnaposto STATICI (nessuna animazione): la pagina non introduce effetti nuovi, i grafici compaiono al loro posto.
function ChartPlaceholder({ height }) {
  return <Div className="rounded-lg bg-secondary/10" style={{ height }} />;
}

export default function MieiProgressi({ user, promoter, promoters = EMPTY_ARR, isActive = true }) {
  const [monthRange, setMonthRange] = useState(6);
  const [topEventsExpanded, setTopEventsExpanded] = useState(false);
  const [showTopEvents, setShowTopEvents] = useState(5);
  const [serateRange, setSerateRange] = useState(20);
  const [showVenueTable, setShowVenueTable] = useState(false);
  const [showSeasons, setShowSeasons] = useState(false);
  const serataFsRef = useRef(null);
  const monthlyFsRef = useRef(null);
  const dowTavoliFsRef = useRef(null);
  const dowFattFsRef = useRef(null);

  const { data: events = EMPTY_ARR } = useQuery({ queryKey: ['events'], queryFn: () => base44.entities.Event.list('-date', 5000), enabled: isActive, staleTime: 15 * 60000, gcTime: 20 * 60000, refetchOnWindowFocus: false, retry: 0 });
  // Senza snapshot serve la tabella COMPLETA: usa ['attendances-all'] (stessa chiave e stesso
  // fetcher di Achievement/Vibra VS), NON ['attendances'] che le altre pagine popolano con
  // list(...,5000) troncato: stessa chiave con dati diversi = risultati dipendenti da chi carica prima.
  const hasAchievementSnapshot = !!promoter?.cum_ach_by_rarity && typeof promoter.cum_ach_by_rarity === 'object' && promoter.cum_ach_total != null;
  const { data: attendances = EMPTY_ARR } = useQuery({ queryKey: hasAchievementSnapshot ? ['attendances', promoter?.id] : ['attendances-all'], queryFn: () => hasAchievementSnapshot ? fetchByPromoter(base44.entities.EventAttendance, promoter.id, { sort: '-created_date' }) : fetchAll(base44.entities.EventAttendance, {}, { sort: '-created_date' }), enabled: isActive && !!promoter?.id, staleTime: hasAchievementSnapshot ? 15 * 60000 : STALE_FULL_TABLE, gcTime: hasAchievementSnapshot ? 20 * 60000 : GC_FULL_TABLE, refetchOnWindowFocus: false, retry: 0 });
  const { data: allClients = EMPTY_ARR } = useQuery({ queryKey: ['clients-all'], staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE, queryFn: () => fetchAll(base44.entities.Client, {}, { sort: '-created_date' }), enabled: isActive && !hasAchievementSnapshot,refetchOnWindowFocus: false, retry: 0 });
  const { data: achievements = EMPTY_ARR } = useQuery({ queryKey: ['achievements'], queryFn: () => base44.entities.Achievement.filter({ is_active: true }), enabled: isActive && !!promoter?.id, staleTime: 10 * 60000, refetchOnWindowFocus: false, retry: 0 });

  // Lookup O(1) eventi (usato anche da record/rank/heatmap)
  const eventsById = useMemo(() => new Map(events.map(e => [e.id, e])), [events]);

  // Aggregazione condivisa: stessi numeri di classifica, card e Miei Progressi
  // (filtro anti-orfane + deduplica per event_id + soglia tavoli dell'evento).
  const agg = useMemo(
    () => computePromoterAggregates(promoter?.id, attendances, events),
    [promoter?.id, attendances, events]
  );
  const myAtts = agg.myAtts;

  // ── Card Record promoter: record + rank (sotto la Bacheca Riconoscimenti) ──
  const promoterRecords = useMemo(
    () => computePromoterRecords(promoter, myAtts, events, allClients),
    [promoter, myAtts, events, allClients]
  );
  const promoterRank = useMemo(
    () => computePromoterRank(promoter, achievements, allClients, attendances, events, promoters),
    [promoter, achievements, allClients, attendances, events, promoters]
  );

  // rows, totals, monthAgg: alias dell'aggregato condiviso (un solo passaggio)
  const rows = agg.rows;
  const totals = { totalRevenue: agg.totalRevenue, totalPresences: agg.totalPresences, totalTables: agg.totalTables };
  const monthAgg = agg.monthAgg;

  const now = useMemo(() => new Date(), []);

  // Andamento mensile
  const monthlyData = useMemo(() => {
    return Array.from({ length: monthRange }, (_, i) => {
      const base = subMonths(now, monthRange - 1 - i);
      const label = format(base, 'MMM yy', { locale: it });
      const b = monthAgg.get(format(base, 'yyyy-MM')) || ZERO_BUCKET;
      return { label, revenue: b.revenue, presences: b.presences, tables: b.tables };
    });
  }, [monthAgg, monthRange, now]);

  // Serata per serata: ordina le righe UNA volta per giorno, formatta solo le ultime N
  const rowsByDay = useMemo(
    () => rows.slice().sort((x, y) => ((x.day || '') < (y.day || '') ? -1 : (x.day || '') > (y.day || '') ? 1 : 0)),
    [rows]
  );
  const serateData = useMemo(() => rowsByDay.slice(-serateRange).map(r => ({
    date: r.date,
    label: format(parseISO(r.date), 'dd/MM', { locale: it }),
    nome: r.ev.name,
    revenue: r.revenue,
    tavoli: Math.round(r.tables * 10) / 10,
  })), [rowsByDay, serateRange]);

  const avgRevenue = serateData.length > 0 ? Math.round(serateData.reduce((s, x) => s + x.revenue, 0) / serateData.length) : 0;

  // Top serate: dall'aggregato condiviso (già ordinate per fatturato desc)
  const topEventsAll = agg.topEventsAll;
  const topEvents = topEventsAll.slice(0, showTopEvents);

  // Mese corrente
  const thisMonth = useMemo(() => {
    const b = monthAgg.get(format(now, 'yyyy-MM')) || ZERO_BUCKET;
    return { revenue: b.revenue, presences: b.presences };
  }, [monthAgg, now]);

  // Chiusura tavoli per locale: dall'aggregato condiviso
  const venueStats = agg.venueStats;

  // Confronto stagioni: dall'aggregato condiviso
  const seasons = agg.seasons;

  // Performance per giorno settimana: dall'aggregato condiviso
  const dowData = agg.dowData;

  // Serie single-series per uPlot
  const seriesRevenueMonthly = useMemo(() => [{ key: 'revenue', name: 'Fatturato', color: '#8b5cf6' }], []);
  const seriesSerata = useMemo(() => [{ key: 'revenue', name: 'Fatturato', color: 'hsl(200 70% 50%)' }], []);
  const seriesTavoli = useMemo(() => [{ key: 'tavoli', name: 'Tavoli', color: 'hsl(200 70% 50%)' }], []);
  const seriesFatturato = useMemo(() => [{ key: 'fatturato', name: 'Fatturato', color: 'hsl(275 60% 55%)' }], []);

  const xLabelsMonthly = useMemo(() => monthlyData.map(m => m.label), [monthlyData]);
  const xLabelsSerata = useMemo(() => serateData.map(s => s.label), [serateData]);
  const xLabelsDow = useMemo(() => dowData.map(d => d.day), [dowData]);

  const fmt = (v) => `€${Number(v).toLocaleString('it-IT')}`;

  // Stadi di montaggio dei blocchi pesanti, UNO per volta (ogni grafico uPlot costa decine di ms):
  // 1 = serata per serata, 2 = andamento mensile, 3 = tavoli per giorno, 4 = fatturato per giorno, 5 = heatmap
  const stage = useStagedMount(5);

  if (!promoter || !promoter.id) {
    return (
      <Div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-8 text-center">
        <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <P className="text-sm text-muted-foreground">Nessun profilo promoter collegato.</P>
      </Div>
    );
  }

  return (
    <Div className="space-y-5">
      {promoter.promoter_from && (
        <Div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <Span className="text-[11px] text-muted-foreground">Promoter dal <Span className="font-semibold text-foreground">{format(parseISO(promoter.promoter_from), 'd MMM yyyy', { locale: it })}</Span></Span>
        </Div>
      )}

      {/* Stat cards */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Fatturato Totale', value: `€${totals.totalRevenue.toLocaleString('it-IT')}`, color: 'text-primary', accent: '#a78bfa' },
          { label: 'Serate fatturate', value: totals.totalPresences, color: 'text-green-400', accent: '#4ade80' },
          { label: 'Tavoli Totali', value: Math.round(totals.totalTables * 10) / 10, color: 'text-blue-400', accent: '#60a5fa' },
          { label: 'Questo Mese', value: `€${thisMonth.revenue.toLocaleString('it-IT')}`, sub: `${thisMonth.presences} serate`, color: 'text-foreground', accent: '#a78bfa' },
        ].map(({ label, value, sub, color, accent }, i) => (
          <Div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4"
            style={{ boxShadow: `0 4px 20px -6px ${accent}22` }}
          >
            <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</P>
            <P className={`text-xl font-bold ${color}`}>{value}</P>
            {sub && <P className="text-[10px] text-muted-foreground mt-0.5">{sub}</P>}
          </Div>
        ))}
      </Div>

      {/* Bacheca Achievement sbloccati */}
      <AchievementsBacheca promoter={promoter} isActive={isActive} clients={allClients} attendances={attendances} events={events} promoters={promoters} />

      {/* Card Record promoter — capolavoro grafico con tutti i record, condivisibile (long-press / clic destro) */}
      <PromoterRecordCard promoter={promoter} records={promoterRecords} rank={promoterRank} />

      {/* Obiettivi */}
      <Div
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4 space-y-3"
        style={{ boxShadow: '0 4px 24px -6px rgba(167,139,250,0.08)' }}
      >
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
        <SectionHeader icon={Target} title="I Miei Obiettivi" color="#a78bfa" />
        {(!promoter.goals || promoter.goals.length === 0) ? (
          <P className="text-sm text-muted-foreground py-2">Il tuo referente non ti ha dato obiettivi da raggiungere al momento.</P>
        ) : (
          promoter.goals.map((goal, i) => {
            let current = 0;
            for (const r of rows) {
              if (r.date < goal.date_from || r.date > goal.date_to) continue;
              current += goal.type === 'fatturato' ? r.revenue : r.tables;
            }
            const pct = goal.target > 0 ? Math.min(100, Math.round((current / goal.target) * 100)) : 0;
            const done = pct >= 100;
            return (
              <Div key={i} className="space-y-1.5">
                <Div className="flex items-center justify-between text-sm">
                  <Span className="font-medium">{goal.label || `Obiettivo ${goal.type}`}</Span>
                  <Span className={done ? 'text-green-400 font-bold' : 'text-muted-foreground'}>
                    {goal.type === 'fatturato' ? `€${current.toLocaleString('it-IT')} / €${goal.target.toLocaleString('it-IT')}` : `${Math.round(current * 10) / 10} / ${goal.target} tavoli`}
                  </Span>
                </Div>
                <Div className="w-full bg-secondary rounded-full h-2">
                  <Div className={`h-2 rounded-full transition-all ${done ? 'bg-green-500' : pct >= 75 ? 'bg-primary' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500/70'}`} style={{ width: `${pct}%` }} />
                </Div>
                <P className="text-[10px] text-muted-foreground text-right">{pct}% Completato</P>
              </Div>
            );
          })
        )}
      </Div>

      {/* Andamento serata per serata (uPlot) */}
      {serateData.length > 0 && (
        <Div
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4 space-y-3"
          style={{ boxShadow: '0 4px 24px -6px rgba(96,165,250,0.08)' }}
        >
          <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
            style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }} />
          <Div className="flex items-center justify-between">
            <SectionHeader icon={TrendingUp} title="Andamento Serata per Serata" color="#60a5fa" />
            <Div className="flex items-center gap-2">
              <FullscreenButton onClick={() => serataFsRef.current?.open()} />
              <HtmlSelect value={serateRange} onChange={e => setSerateRange(Number(e.target.value))} className="text-xs px-2 py-1 rounded border border-border bg-secondary">
                {[10, 20, 30, 50].map(n => <HtmlOption key={n} value={n}>Ultime {n}</HtmlOption>)}
              </HtmlSelect>
            </Div>
          </Div>
          {stage < 1 ? <ChartPlaceholder height={200} /> : (
          <ChartFullscreen ref={serataFsRef} title="Andamento Serata per Serata" scrollable={false} icon={TrendingUp} accentColor="#60a5fa" rotateOnMobile externalTrigger>
            <UPlotLineChart
              data={serateData}
              series={seriesSerata}
              xLabels={xLabelsSerata}
              valueFormatter={fmt}
              height={200}
            />
          </ChartFullscreen>
          )}
          <Div className="text-[10px] text-muted-foreground px-1">Media: €{avgRevenue.toLocaleString('it-IT')}</Div>
        </Div>
      )}

      {/* Top serate */}
      {topEvents.length > 0 && (
        <Div
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card"
          style={{ boxShadow: '0 4px 24px -6px rgba(251,191,36,0.08)' }}
        >
          <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
            style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }} />
          <Btn
            button
            onClick={() => setTopEventsExpanded(!topEventsExpanded)}
            className="w-full flex items-center justify-between text-sm font-semibold px-4 py-3 hover:bg-secondary/20 transition-colors">
            <SectionHeader icon={Star} title={`Top ${Math.min(showTopEvents, topEventsAll.length)} Serate`} color="#fbbf24" />
            <ChevronDown className={`w-4 h-4 transition-transform ${topEventsExpanded ? 'rotate-180' : ''}`} />
          </Btn>
          {topEventsExpanded && (
            <Div className="space-y-2 px-4 pb-4">
              {topEvents.map((item, i) => (
                <Div key={item.att.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 text-sm">
                  <Span className="font-bold text-amber-400 w-6">{i + 1}</Span>
                  <Div className="flex-1 min-w-0">
                    <P className="font-semibold truncate">{item.ev.name}</P>
                    <P className="text-[10px] text-muted-foreground">{format(parseISO(item.ev.date), 'd MMM yyyy', { locale: it })}</P>
                  </Div>
                  <P className="font-bold text-primary">€{(item.att.revenue || 0).toLocaleString('it-IT')}</P>
                </Div>
              ))}
              {topEventsAll.length > 5 && showTopEvents === 5 && (
                <Btn
                  button
                  onClick={() => setShowTopEvents(10)}
                  className="w-full py-2 text-xs text-primary hover:bg-secondary/20 rounded-lg transition-colors">Mostra top 10</Btn>
              )}
              {showTopEvents === 10 && topEventsAll.length > 10 && (
                <Btn
                  button
                  onClick={() => setShowTopEvents(5)}
                  className="w-full py-2 text-xs text-muted-foreground hover:bg-secondary/20 rounded-lg transition-colors">Riduci a top 5</Btn>
              )}
            </Div>
          )}
        </Div>
      )}

      {/* Grafico andamento mensile (uPlot) */}
      <Div
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4 space-y-3"
        style={{ boxShadow: '0 4px 24px -6px rgba(139,92,246,0.10)' }}
      >
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)' }} />
        <Div className="flex items-center justify-between">
          <SectionHeader icon={TrendingUp} title={`Andamento Ultimi ${monthRange} Mesi`} color="#8b5cf6" />
          <Div className="flex items-center gap-2">
            <FullscreenButton onClick={() => monthlyFsRef.current?.open()} />
            <HtmlSelect value={monthRange} onChange={e => setMonthRange(Number(e.target.value))} className="text-xs px-2 py-1 rounded border border-border bg-secondary">
              {[3, 6, 12, 24].map(m => <HtmlOption key={m} value={m}>{m} mesi</HtmlOption>)}
            </HtmlSelect>
          </Div>
        </Div>
        {stage < 2 ? <ChartPlaceholder height={170} /> : (
        <ChartFullscreen ref={monthlyFsRef} title={`Andamento Ultimi ${monthRange} Mesi`} scrollable={false} icon={TrendingUp} accentColor="#8b5cf6" rotateOnMobile externalTrigger>
          <UPlotLineChart
            data={monthlyData}
            series={seriesRevenueMonthly}
            xLabels={xLabelsMonthly}
            valueFormatter={fmt}
            height={170}
          />
        </ChartFullscreen>
        )}
      </Div>

      {/* Tabella mensile */}
      <Div
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card"
        style={{ boxShadow: '0 4px 20px -6px rgba(0,0,0,0.3)' }}
      >
        <Div className="px-4 py-3 border-b border-white/[0.06]">
          <SectionHeader icon={Calendar} title="Dettaglio per Mese" color="#a78bfa" />
        </Div>
        <Table className="w-full text-sm">
          <Thead>
            <Tr className="border-b border-white/[0.06]">
              <Th className="text-left px-4 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">Mese</Th>
              <Th className="text-right px-4 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">Fatturato</Th>
              <Th className="text-right px-4 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">Presenze</Th>
              <Th className="text-right px-4 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">Tavoli</Th>
            </Tr>
          </Thead>
          <Tbody>
            {[...monthlyData].reverse().map((row, i) => (
              <Tr key={i} className="border-b border-white/[0.04] hover:bg-secondary/20">
                <Td className="px-4 py-2.5 font-medium capitalize">{row.label}</Td>
                <Td className="px-4 py-2.5 text-right font-semibold text-primary">€{row.revenue.toLocaleString('it-IT')}</Td>
                <Td className="px-4 py-2.5 text-right text-muted-foreground">{row.presences}</Td>
                <Td className="px-4 py-2.5 text-right text-muted-foreground">{Math.round(row.tables * 10) / 10}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Div>

      {/* Performance per giorno settimana (uPlot) */}
      <Div
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4 space-y-4"
        style={{ boxShadow: '0 4px 24px -6px rgba(96,165,250,0.08)' }}
      >
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }} />
        <SectionHeader icon={Calendar} title="Performance per Giorno Settimana" color="#60a5fa" />
        <Div>
          <Div className="flex items-center justify-between mb-2">
            <P className="text-xs text-muted-foreground">Tavoli</P>
            <FullscreenButton onClick={() => dowTavoliFsRef.current?.open()} />
          </Div>
          {stage < 3 ? <ChartPlaceholder height={150} /> : (
          <ChartFullscreen ref={dowTavoliFsRef} title="Tavoli per Giorno Settimana" scrollable={false} icon={Calendar} accentColor="#60a5fa" rotateOnMobile externalTrigger>
            <UPlotBarChart
              data={dowData}
              series={seriesTavoli}
              xLabels={xLabelsDow}
              valueFormatter={v => Number(v).toFixed(1)}
              height={150}
            />
          </ChartFullscreen>
          )}
        </Div>
        <Div>
          <Div className="flex items-center justify-between mb-2">
            <P className="text-xs text-muted-foreground">Fatturato (€)</P>
            <FullscreenButton onClick={() => dowFattFsRef.current?.open()} />
          </Div>
          {stage < 4 ? <ChartPlaceholder height={150} /> : (
          <ChartFullscreen ref={dowFattFsRef} title="Fatturato per Giorno Settimana" scrollable={false} icon={Calendar} accentColor="#60a5fa" rotateOnMobile externalTrigger>
            <UPlotBarChart
              data={dowData}
              series={seriesFatturato}
              xLabels={xLabelsDow}
              valueFormatter={fmt}
              height={150}
            />
          </ChartFullscreen>
          )}
        </Div>
      </Div>

      {/* Heatmap Serate e Tavoli */}
      {myAtts.length > 0 && events.length > 0 && (stage < 5 ? (
        <Div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartPlaceholder height={180} />
          <ChartPlaceholder height={180} />
        </Div>
      ) : (
        <Div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SerateHeatmap attendances={myAtts} events={events} promoterFrom={promoter.promoter_from} />
          <TablesStreakHeatmap attendances={myAtts} events={events} promoterFrom={promoter.promoter_from} />
        </Div>
      ))}

      {/* Chiusura tavoli per locale */}
      {venueStats.length > 0 && (
        <Div
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card"
          style={{ boxShadow: '0 4px 20px -6px rgba(96,165,250,0.08)' }}
        >
          <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-40"
            style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }} />
          <Btn
            button
            onClick={() => setShowVenueTable(!showVenueTable)}
            className="w-full flex items-center justify-between text-sm font-semibold px-4 py-3 hover:bg-secondary/20 transition-colors">
            <SectionHeader icon={LayoutGrid} title="Performance per Locale" color="#60a5fa" />
            <ChevronDown className={`w-4 h-4 transition-transform ${showVenueTable ? 'rotate-180' : ''}`} />
          </Btn>
          {showVenueTable && (
            <Div className="overflow-x-auto px-4 pb-4">
              <Table className="w-full text-sm min-w-[340px]">
                <Thead>
                  <Tr className="border-b border-white/[0.06]">
                    <Th className="text-left px-2 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">Locale</Th>
                    <Th className="text-center px-2 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">Presenze</Th>
                    <Th className="text-right px-2 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">Fatturato</Th>
                    <Th className="text-right px-2 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">Tavoli</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {venueStats.map((r, i) => (
                    <Tr key={i} className={`border-b border-white/[0.04] ${r.presenti === 0 ? 'opacity-40' : 'hover:bg-secondary/20'} transition-colors`}>
                      <Td className="px-2 py-2.5">
                        <Div className="flex items-center gap-1.5">
                          <VenueLogo venueKey={r.venueKey} />
                          <Div>
                            <P className="text-xs font-medium">{r.label}</P>
                            <P className="text-[9px] text-muted-foreground">{r.sublabel}</P>
                          </Div>
                        </Div>
                      </Td>
                      <Td className="text-center px-2 py-2.5 text-xs font-semibold text-primary">{r.presenti}/{r.totalVenueEvents}</Td>
                      <Td className="text-right px-2 py-2.5 text-xs font-semibold">€{r.myRev.toLocaleString('it-IT')}</Td>
                      <Td className="text-right px-2 py-2.5 text-xs text-muted-foreground">{Math.round(r.myTav * 10) / 10}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Div>
          )}
        </Div>
      )}

      {/* Confronto stagioni */}
      {seasons.length > 0 && (
        <Div
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card"
          style={{ boxShadow: '0 4px 20px -6px rgba(251,191,36,0.08)' }}
        >
          <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-40"
            style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }} />
          <Btn
            button
            onClick={() => setShowSeasons(!showSeasons)}
            className="w-full flex items-center justify-between text-sm font-semibold px-4 py-3 hover:bg-secondary/20 transition-colors">
            <SectionHeader icon={Trophy} title="Confronto Stagioni" color="#fbbf24" />
            <ChevronDown className={`w-4 h-4 transition-transform ${showSeasons ? 'rotate-180' : ''}`} />
          </Btn>
          {showSeasons && (
            <Div className="overflow-x-auto px-4 pb-4">
              <Table className="w-full text-sm min-w-[300px]">
                <Thead>
                  <Tr className="border-b border-border">
                    <Th className="text-left px-2 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">Stagione</Th>
                    <Th className="text-right px-2 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">Fatturato</Th>
                    <Th className="text-right px-2 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">Tavoli</Th>
                    <Th className="text-right px-2 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">Presenze</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[...seasons].reverse().map(([season, data], i) => (
                    <Tr key={i} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <Td className="px-2 py-2.5 font-semibold text-xs">{season}</Td>
                      <Td className="text-right px-2 py-2.5 text-xs font-bold text-primary">€{data.rev.toLocaleString('it-IT')}</Td>
                      <Td className="text-right px-2 py-2.5 text-xs text-muted-foreground">{Math.round(data.tables * 10) / 10}</Td>
                      <Td className="text-right px-2 py-2.5 text-xs text-muted-foreground">{data.presenze}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}