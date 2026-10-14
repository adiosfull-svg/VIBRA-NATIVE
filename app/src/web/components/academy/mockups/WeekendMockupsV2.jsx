// Port di src/components/academy/mockups/WeekendMockupsV2.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Crown, Star, Trophy, Table2, TrendingDown, TrendingUp, MessageCircle, Instagram, Search, Calendar, CalendarDays, Target, Sparkles, Car, Brain, RefreshCw, Gem, Plus, GripVertical } from '@/ui/icons.generated';
import { Callout, Frame, Avatar, DualFrame, MiniTabBar } from './shared';

import { Div, P, Span } from '@/ui/html';
import { Circle, Svg } from '@/ui/elements';

const WK_TABS = [
  { key: 'inviti', label: 'Inviti', icon: <Calendar className="w-2.5 h-2.5" /> },
  { key: 'ricontattare', label: 'Ricont.', icon: <MessageCircle className="w-2.5 h-2.5" /> },
  { key: 'semina', label: 'Semina', icon: <Instagram className="w-2.5 h-2.5" /> },
  { key: 'target', label: 'Target', icon: <Target className="w-2.5 h-2.5" /> },
  { key: 'leader', label: 'Leader', icon: <Crown className="w-2.5 h-2.5" /> },
  { key: 'tabelle', label: 'Tabelle', icon: <Table2 className="w-2.5 h-2.5" /> },
];

// ── 1. INVITI ──────────────────────────────────────────────
function InvitiContent({ desktop }) {
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Weekend</Span>
        <Span className="text-[8px] text-muted-foreground">Set 2026</Span>
      </Div>
      <MiniTabBar tabs={WK_TABS} active="inviti" />
      {/* Prospetto inviti */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2">
        <Callout n={1} className="-top-1 left-2" />
        <Div className="text-[9px] font-semibold text-foreground mb-1.5">Prospetto Inviti</Div>
        <Div className={desktop ? 'grid grid-cols-3 gap-1.5' : 'space-y-1.5'}>
          {[
            { date: 'Ven 19 Set', venue: 'Ammare', clients: [['LE', 'from-purple-400/60 to-purple-400/20', 'L. Esposito', 'VIP, tavolo front'], ['GR', 'from-pink-400/60 to-pink-400/20', 'G. Russo', '']] },
            { date: 'Sab 20 Set', venue: 'Frontemare', clients: [['MF', 'from-amber-400/60 to-amber-400/20', 'M. Ferrara', ''], ['AB', 'from-blue-400/60 to-blue-400/20', 'A. Bruno', 'Guidatore'], ['SC', 'from-green-400/50 to-green-400/10', 'S. Costa', 'Nuovo']] },
            { date: 'Dom 21 Set', venue: 'Vibes', clients: [['LB', 'from-pink-400/60 to-pink-400/20', 'L. Bianchi', '']] },
          ].map((s, i) => (
            <Div key={i} className="rounded-md bg-secondary/20 p-1.5">
              <Div className="flex items-center gap-1 mb-1">
                <Span className="text-[7px] font-semibold text-primary bg-primary/10 px-1 py-0.5 rounded">{s.date}</Span>
                <Span className="text-[7px] text-muted-foreground truncate">{s.venue}</Span>
              </Div>
              {s.clients.map((c, j) => (
                <Div key={j} className="flex items-center gap-1 py-0.5">
                  <Avatar initials={c[0]} grad={c[1]} size="w-4 h-4" text="text-[5px]" />
                  <Span className="text-[7px] text-foreground/80 truncate flex-1">{c[2]}</Span>
                  {c[3] && <Span className="text-[5px] text-muted-foreground truncate">{c[3]}</Span>}
                </Div>
              ))}
              <Div className="text-[6px] text-primary text-center mt-1 border-t border-border/40 pt-0.5">Converti presenze</Div>
            </Div>
          ))}
        </Div>
      </Div>
      {/* Semina Instagram */}
      <Div className="relative rounded-lg border border-pink-500/20 bg-card p-2 mb-2">
        <Callout n={2} className="-top-1 left-2" />
        <Div className="flex items-center justify-between mb-1">
          <Div className="flex items-center gap-1"><Instagram className="w-2.5 h-2.5 text-pink-400" /><Span className="text-[9px] font-semibold text-foreground">Semina IG</Span></Div>
          <Span className="text-[7px] text-muted-foreground bg-secondary/40 px-1 rounded-full">12</Span>
        </Div>
        <Div className={desktop ? 'grid grid-cols-4 gap-1' : 'flex gap-1 overflow-hidden'}>
          {[['@chiara.dmn', 'nuovo'], ['@lucia_99', 'contattato'], ['@marta_v', 'interessato'], ['@franco22', 'nuovo']].map((s, i) => (
            <Div key={i} className="shrink-0 rounded bg-secondary/30 p-1 text-center">
              <Div className="w-5 h-5 rounded-full bg-pink-400/30 mx-auto mb-0.5" />
              <Div className="text-[6px] font-semibold text-foreground truncate">{s[0]}</Div>
              <Div className={"text-[5px] px-0.5 rounded inline-block " + (s[1] === 'nuovo' ? 'text-gray-400 bg-gray-400/10' : s[1] === 'contattato' ? 'text-blue-400 bg-blue-400/10' : 'text-green-400 bg-green-400/10')}>{s[1]}</Div>
            </Div>
          ))}
        </Div>
      </Div>
      {/* Console AI */}
      <Div className="relative rounded-lg border border-violet-500/20 bg-card p-2" style={{ boxShadow: '0 2px 12px -4px rgba(167,139,250,0.15)' }}>
        <Callout n={3} className="-top-1 left-2" />
        <Div className="flex items-center gap-1 mb-1">
          <Div className="p-0.5 rounded bg-violet-500/15"><Brain className="w-2.5 h-2.5 text-violet-400" /></Div>
          <Span className="text-[9px] font-semibold text-violet-300">Analisi Intelligente</Span>
          <Div className="ml-auto flex items-center gap-0.5 text-[7px] text-violet-300 bg-violet-500/10 px-1 rounded"><RefreshCw className="w-2 h-2" />Ricalcola</Div>
        </Div>
        <P className="text-[7px] text-foreground/80 leading-snug mb-1.5">42 clienti attivi, 6 leader, 3 in calo. Zone forti: Vomero, Posillipo. Sabato punta sul Frontemare col gruppo Vomero.</P>
        <Div className="rounded border border-border bg-secondary/20 p-1.5 space-y-0.5">
          <Div className="flex items-center gap-1">
            <Star className="w-2 h-2 text-amber-400 fill-amber-400" />
            <Span className="text-[7px] font-medium text-foreground flex-1 truncate">L. Esposito</Span>
            <Span className="text-[6px] text-amber-400 font-bold">8.5</Span>
          </Div>
          <P className="text-[5px] text-violet-300/90 leading-snug">Perché ora: Sabato si va al Frontemare, il suo locale forte.</P>
        </Div>
      </Div>
    </>
  );
}
export function WeekendInvitiV2() {
  return <DualFrame url="Weekend · Inviti" mobile={<Frame url="Weekend · Inviti" tall><InvitiContent /></Frame>} desktop={<Frame url="Weekend · Inviti" tall desktop><InvitiContent desktop /></Frame>} />;
}

// ── 2. DA RICONTATTARE ──────────────────────────────────────
function RicontattareContent({ desktop }) {
  const suggestions = [
    { i: 'LE', g: 'from-purple-400/60 to-purple-400/20', n: 'L. Esposito', r: 'Non viene da 3 sett, era habitué', s: '87', t: 'up' },
    { i: 'MF', g: 'from-amber-400/60 to-amber-400/20', n: 'M. Ferrara', r: 'Top pagante, richiama per VIP', s: '82', t: 'stable' },
    { i: 'AR', g: 'from-red-400/50 to-red-400/10', n: 'A. Rizzo', r: 'In calo -42%, abita al Vomero', s: '71', t: 'down' },
  ];
  const recontact = [
    { i: 'GR', g: 'from-pink-400/60 to-pink-400/20', n: 'Giorgia Russo', d: 'Ultimo contatto: 12 ago · 21 presenze', t: 'up', urgent: false },
    { i: 'AB', g: 'from-blue-400/60 to-blue-400/20', n: 'Antonio Bruno', d: '60 giorni · 12 presenze', t: 'down', urgent: true },
    { i: 'LB', g: 'from-pink-400/60 to-pink-400/20', n: 'Lucia Bianchi', d: '45 giorni · 22 presenze', t: 'stable', urgent: false },
  ];
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Weekend</Span>
      </Div>
      <MiniTabBar tabs={WK_TABS} active="ricontattare" />
      <Div className={desktop ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
        {/* Suggerimenti */}
        <Div className="relative rounded-lg bg-card border border-primary/20 p-2">
          <Callout n={1} className="-top-1 left-2" />
          <Div className="flex items-center gap-1 mb-1.5"><Sparkles className="w-2.5 h-2.5 text-primary" /><Span className="text-[9px] font-semibold text-foreground">Suggerimenti Settimanali</Span></Div>
          <Div className="space-y-1">
            {suggestions.map((s, i) => (
              <Div key={i} className="flex items-center gap-1.5 rounded bg-secondary/20 p-1.5">
                <Avatar initials={s.i} grad={s.g} size="w-5 h-5" text="text-[6px]" />
                <Div className="flex-1 min-w-0">
                  <Div className="text-[7px] font-semibold text-foreground truncate">{s.n}</Div>
                  <Div className="text-[5px] text-muted-foreground truncate">{s.r}</Div>
                </Div>
                <Span className="text-[6px] font-bold text-primary">{s.s}</Span>
                <Div className="flex gap-0.5">
                  <MessageCircle className="w-2.5 h-2.5 text-green-400" />
                  <Instagram className="w-2.5 h-2.5 text-pink-400" />
                </Div>
              </Div>
            ))}
          </Div>
        </Div>
        {/* Da Ricontattare */}
        <Div className="relative rounded-lg bg-card border border-border p-2">
          <Callout n={2} className="-top-1 left-2" />
          <Div className="flex items-center gap-1 mb-1.5"><MessageCircle className="w-2.5 h-2.5 text-primary" /><Span className="text-[9px] font-semibold text-foreground">Da Ricontattare</Span></Div>
          <Div className="space-y-1">
            {recontact.map((r, i) => (
              <Div key={i} className={"flex items-center gap-1.5 rounded bg-secondary/20 p-1.5 " + (r.urgent ? 'border border-red-500/30' : '')}>
                <Avatar initials={r.i} grad={r.g} size="w-5 h-5" text="text-[6px]" />
                <Div className="flex-1 min-w-0">
                  <Div className="text-[7px] font-semibold text-foreground truncate flex items-center gap-0.5">{r.n}{r.urgent && <Span className="w-1.5 h-1.5 rounded-full bg-red-400" />}</Div>
                  <Div className="text-[5px] text-muted-foreground truncate">{r.d}</Div>
                </Div>
                {r.t === 'up' ? <TrendingUp className="w-2.5 h-2.5 text-green-400" /> : r.t === 'down' ? <TrendingDown className="w-2.5 h-2.5 text-red-400" /> : <Span className="text-[5px] text-muted-foreground">—</Span>}
                <MessageCircle className="w-2.5 h-2.5 text-green-400" />
              </Div>
            ))}
          </Div>
        </Div>
      </Div>
    </>
  );
}
export function WeekendRicontattareV2() {
  return <DualFrame url="Weekend · Da Ricontattare" mobile={<Frame url="Weekend · Da Ricontattare" tall><RicontattareContent /></Frame>} desktop={<Frame url="Weekend · Da Ricontattare" tall desktop><RicontattareContent desktop /></Frame>} />;
}

// ── 3. SEMINA ──────────────────────────────────────────────
function SeminaContent({ desktop }) {
  const cards = [
    { i: 'CD', n: 'chiara.dmn', p: 'ig', s: 'nuovo', a: '22 · Posillipo', r: 2, off: false },
    { i: 'L9', n: 'lucia_99', p: 'ig', s: 'contattato', a: '19 · Vomero', r: 3, off: false },
    { i: 'MV', n: 'marta_v', p: 'ig', s: 'interessato', a: '24 · Bagnoli', r: 2, off: false },
    { i: 'F2', n: 'franco22', p: 'tt', s: 'nuovo', a: '27 · Pozzuoli', r: 1, off: false },
    { i: 'GR', n: 'giulia.r', p: 'ig', s: 'convertito', a: '21 · Vomero', r: 3, off: false },
    { i: 'AB', n: 'anto.b', p: 'tt', s: 'nuovo', a: '25 · Scampia', r: 1, off: true },
  ];
  const statusColor = { nuovo: 'text-gray-400 bg-gray-400/10', contattato: 'text-blue-400 bg-blue-400/10', interessato: 'text-green-400 bg-green-400/10', convertito: 'text-purple-400 bg-purple-400/10' };
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Weekend</Span>
      </Div>
      <MiniTabBar tabs={WK_TABS} active="semina" />
      {/* Search + sort */}
      <Div className="relative flex items-center gap-1 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex items-center gap-1 rounded bg-card border border-border px-1.5 py-1 flex-1"><Search className="w-2.5 h-2.5 text-muted-foreground" /><Span className="text-[7px] text-muted-foreground">Cerca semina...</Span></Div>
        <Div className="rounded bg-card border border-border px-1.5 py-1 text-[7px] text-muted-foreground">Recenti</Div>
        <Div className="rounded bg-pink-500/10 border border-pink-500/30 px-1.5 py-1 text-[7px] text-pink-400 flex items-center gap-0.5"><Plus className="w-2 h-2" />Aggiungi</Div>
      </Div>
      {/* Attive */}
      <Div className="text-[8px] font-semibold text-muted-foreground mb-1">Attive · 5</Div>
      <Div className={desktop ? 'grid grid-cols-3 gap-1.5' : 'grid grid-cols-2 gap-1.5'}>
        {cards.filter(c => !c.off).map((c, i) => (
          <Div key={i} className="relative rounded-lg bg-card border border-pink-500/15 p-1.5">
            <Callout n={i === 0 ? 2 : undefined} className={i === 0 ? '-top-1 -left-1' : 'hidden'} />
            <Div className="flex items-center gap-1 mb-1">
              <Div className={"w-6 h-6 rounded-full " + (c.p === 'ig' ? 'bg-gradient-to-br from-pink-400/40 to-amber-400/20' : 'bg-black border border-pink-400/30')} />
              <Div className="flex-1 min-w-0">
                <Div className="text-[7px] font-semibold text-foreground truncate">{c.n}</Div>
                <Div className="text-[5px] text-muted-foreground">{c.a}</Div>
              </Div>
              <GripVertical className="w-2.5 h-2.5 text-muted-foreground/40" />
            </Div>
            <Div className="flex items-center justify-between">
              <Span className={"text-[5px] px-1 rounded " + statusColor[c.s]}>{c.s}</Span>
              <Div className="flex gap-0.5">{[1, 2, 3].map(d => <Div key={d} className={"w-1 h-1 rounded-full " + (d <= c.r ? 'bg-pink-400' : 'bg-secondary/40')} />)}</Div>
            </Div>
            <Div className="text-[5px] text-muted-foreground mt-0.5 italic truncate">Note: da richiamare venerdì</Div>
          </Div>
        ))}
      </Div>
      {/* Spente */}
      <Div className="text-[8px] font-semibold text-muted-foreground mt-2 mb-1">Spente · 1</Div>
      <Div className={desktop ? 'grid grid-cols-3 gap-1.5' : 'grid grid-cols-2 gap-1.5'}>
        {cards.filter(c => c.off).map((c, i) => (
          <Div key={i} className="rounded-lg bg-card border border-border p-1.5 opacity-40">
            <Div className="flex items-center gap-1">
              <Div className="w-5 h-5 rounded-full bg-gray-400/20" />
              <Div className="flex-1 min-w-0"><Div className="text-[7px] font-semibold text-muted-foreground truncate">{c.n}</Div></Div>
              <Span className="text-[5px] text-muted-foreground">spenta</Span>
            </Div>
          </Div>
        ))}
      </Div>
    </>
  );
}
export function WeekendSeminaV2() {
  return <DualFrame url="Weekend · Semina" mobile={<Frame url="Weekend · Semina" tall><SeminaContent /></Frame>} desktop={<Frame url="Weekend · Semina" tall desktop><SeminaContent desktop /></Frame>} />;
}

// ── 4. TARGET ─────────────────────────────────────────────
function TargetContent({ desktop }) {
  const venues = [
    { n: 'Ammare', active: true, count: 42, confirmed: 18 },
    { n: 'Frontemare', active: false, count: 35, confirmed: 12 },
    { n: 'Vibes', active: false, count: 28, confirmed: 8 },
  ];
  const clients = [
    { i: 'LE', g: 'from-purple-400/60 to-purple-400/20', n: 'L. Esposito', freq: 7, total: 10, last: 'Sab 13 Set', leader: true, driver: false },
    { i: 'MF', g: 'from-amber-400/60 to-amber-400/20', n: 'M. Ferrara', freq: 5, total: 8, last: 'Ven 12 Set', leader: false, driver: true },
    { i: 'GR', g: 'from-pink-400/60 to-pink-400/20', n: 'G. Russo', freq: 3, total: 6, last: 'Dom 7 Set', leader: false, driver: false },
    { i: 'AB', g: 'from-blue-400/60 to-blue-400/20', n: 'A. Bruno', freq: 4, total: 7, last: 'Sab 6 Set', leader: false, driver: false },
  ];
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Weekend</Span>
      </Div>
      <MiniTabBar tabs={WK_TABS} active="target" />
      {/* Venue chips */}
      <Div className="relative flex gap-1 mb-2 overflow-hidden">
        <Callout n={1} className="-top-1 -left-1" />
        {venues.map((v, i) => (
          <Div key={i} className={"shrink-0 flex items-center gap-1 px-1.5 py-1 rounded-full text-[7px] " + (v.active ? "bg-primary text-primary-foreground font-semibold" : "bg-card border border-border text-muted-foreground")}>
            <Div className="w-2 h-2 rounded-full bg-purple-400/50" />{v.n}
          </Div>
        ))}
      </Div>
      {/* Venue header */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2">
        <Callout n={2} className="-top-1 left-2" />
        <Div className="flex items-center justify-between">
          <Span className="text-[9px] font-semibold text-foreground">Ammare Frontemare</Span>
          <Span className="text-[7px] text-muted-foreground">42 target · 18 confermati</Span>
        </Div>
      </Div>
      {/* Client list */}
      <Div className="space-y-1">
        {clients.map((c, i) => (
          <Div key={i} className="relative flex items-center gap-1.5 rounded bg-card border border-border p-1.5">
            {i === 0 && <Callout n={3} className="-top-1 -left-1" />}
            <Avatar initials={c.i} grad={c.g} size="w-5 h-5" text="text-[6px]" />
            <Div className="flex-1 min-w-0">
              <Div className="text-[7px] font-semibold text-foreground truncate flex items-center gap-0.5">
                {c.n}
                {c.leader && <Star className="w-2 h-2 text-amber-400 fill-amber-400" />}
                {c.driver && <Car className="w-2 h-2 text-sky-400" />}
              </Div>
              <Div className="text-[5px] text-muted-foreground">Ultima: {c.last}</Div>
            </Div>
            {/* Progress bar */}
            <Div className="w-8">
              <Div className="h-1 rounded-full bg-secondary/40 overflow-hidden"><Div className="h-full bg-primary rounded-full" style={{ width: (c.freq / c.total * 100) + '%' }} /></Div>
              <Div className="text-[5px] text-muted-foreground text-center mt-0.5">{c.freq}/{c.total}</Div>
            </Div>
            <Div className="text-[6px] text-primary bg-primary/10 px-1 py-0.5 rounded font-semibold">Invita</Div>
          </Div>
        ))}
      </Div>
      {/* Summary */}
      <Div className="relative flex items-center justify-center gap-2 mt-2 rounded-lg bg-secondary/20 p-2">
        <Callout n={4} className="-top-1 right-2" />
        <Div className="relative w-7 h-7">
          <Svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28"><Circle cx="14" cy="14" r="11" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" /><Circle cx="14" cy="14" r="11" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="69" strokeDashoffset="29" /></Svg>
          <Span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold text-primary">43%</Span>
        </Div>
        <Span className="text-[7px] text-muted-foreground">Target raggiungibile: 18/42</Span>
      </Div>
    </>
  );
}
export function WeekendTargetV2() {
  return <DualFrame url="Weekend · Target" mobile={<Frame url="Weekend · Target" tall><TargetContent /></Frame>} desktop={<Frame url="Weekend · Target" tall desktop><TargetContent desktop /></Frame>} />;
}

// ── 5. LEADER ──────────────────────────────────────────────
function LeaderContent({ desktop }) {
  const leaders = [
    { i: 'LE', g: 'from-purple-400/60 to-purple-400/20', n: 'Antonio D.', brought: 12, pres: 34, last: 'Sab 13 Set · Ammare', star: 'oro', top: true },
    { i: 'MF', g: 'from-amber-400/60 to-amber-400/20', n: 'Marco Ferrara', brought: 8, pres: 31, last: 'Ven 12 Set · Ammare', star: 'oro', top: false },
    { i: 'GR', g: 'from-pink-400/60 to-pink-400/20', n: 'Giorgia Russo', brought: 5, pres: 18, last: 'Sab 6 Set · Frontemare', star: 'argento', top: false },
  ];
  const starColor = { oro: 'text-amber-400 fill-amber-400', argento: 'text-gray-300 fill-gray-300', bronzo: 'text-amber-700 fill-amber-700' };
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Weekend</Span>
      </Div>
      <MiniTabBar tabs={WK_TABS} active="leader" />
      <Div className="relative rounded-lg border border-amber-500/20 bg-card p-2 mb-2" style={{ borderTop: '2px solid rgba(245,158,11,0.4)' }}>
        <Callout n={1} className="-top-1 left-2" />
        <Div className="flex items-center justify-between mb-1.5">
          <Div className="flex items-center gap-1"><Crown className="w-3 h-3 text-amber-400" /><Span className="text-[9px] font-bold text-foreground">Leader del Weekend</Span></Div>
          <Span className="text-[7px] text-muted-foreground bg-secondary/40 px-1.5 rounded-full">8 leader</Span>
        </Div>
      </Div>
      <Div className={desktop ? 'grid grid-cols-2 gap-1.5' : 'space-y-1.5'}>
        {leaders.map((l, i) => (
          <Div key={i} className={"relative rounded-lg bg-card border p-2 " + (l.top ? 'border-amber-500/40' : 'border-border')} style={l.top ? { boxShadow: '0 0 12px -2px rgba(245,158,11,0.15)' } : {}}>
            {i === 0 && <Callout n={2} className="-top-1 -left-1" />}
            <Div className="flex items-center gap-1.5 mb-1">
              <Div className="relative">
                <Avatar initials={l.i} grad={l.g} size="w-7 h-7" text="text-[7px]" />
                <Star className={"w-2.5 h-2.5 absolute -top-0.5 -right-0.5 " + starColor[l.star]} />
              </Div>
              <Div className="flex-1 min-w-0">
                <Div className="text-[8px] font-semibold text-foreground truncate flex items-center gap-0.5">{l.n}<Span className="text-[5px] text-amber-400 bg-amber-400/10 px-1 rounded">LEADER</Span></Div>
                <Div className="text-[5px] text-muted-foreground">Portate: {l.brought} · Presenze: {l.pres}</Div>
              </Div>
            </Div>
            <Div className="text-[5px] text-muted-foreground mb-1">Ultima: {l.last}</Div>
            <Div className="flex items-center gap-0.5">
              <Div className="flex -space-x-1">{[0, 1, 2].map(j => <Div key={j} className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400/40 to-purple-400/10 border border-background" />)}</Div>
              <Span className="text-[5px] text-muted-foreground ml-1">+{l.brought - 3}</Span>
              <Div className="ml-auto flex gap-0.5">
                <MessageCircle className="w-2.5 h-2.5 text-green-400" />
                <Instagram className="w-2.5 h-2.5 text-pink-400" />
              </Div>
            </Div>
          </Div>
        ))}
      </Div>
    </>
  );
}
export function WeekendLeaderV2() {
  return <DualFrame url="Weekend · Leader" mobile={<Frame url="Weekend · Leader" tall><LeaderContent /></Frame>} desktop={<Frame url="Weekend · Leader" tall desktop><LeaderContent desktop /></Frame>} />;
}

// ── 6. TABELLE ─────────────────────────────────────────────
function TabelleContent({ desktop }) {
  const boards = [
    { title: 'Nuovi Clienti', icon: '✨', color: 'purple', items: [['SC', 'from-green-400/50 to-green-400/10', 'Sara Costa', '2 pres.'], ['DV', 'from-green-400/50 to-green-400/10', 'Diego Vitale', '1 pres.']] },
    { title: 'Top Paganti', icon: '🏆', color: 'amber', items: [['LE', 'from-purple-400/60 to-purple-400/20', 'L. Esposito', '€4,820'], ['MF', 'from-amber-400/60 to-amber-400/20', 'M. Ferrara', '€5,540']] },
    { title: 'Leader Inattivi', icon: '⭐', color: 'orange', items: [['AB', 'from-blue-400/60 to-blue-400/20', 'A. Bruno', '6 sett.']] },
    { title: 'Clienti in Calo', icon: '📉', color: 'red', items: [['MF', 'from-amber-400/60 to-amber-400/20', 'M. Ferrara', '-45%'], ['LB', 'from-pink-400/60 to-pink-400/20', 'L. Bianchi', '-35%']] },
  ];
  const borderColor = { purple: 'rgba(167,139,250,0.3)', amber: 'rgba(250,204,21,0.3)', orange: 'rgba(245,158,11,0.3)', red: 'rgba(239,68,68,0.3)' };
  const textColor = { purple: 'text-purple-400', amber: 'text-amber-400', orange: 'text-orange-400', red: 'text-red-400' };
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Weekend</Span>
      </Div>
      <MiniTabBar tabs={WK_TABS} active="tabelle" />
      <Div className="relative grid grid-cols-2 gap-1.5">
        <Callout n={1} className="-top-1 -left-1" />
        {boards.map((b, i) => (
          <Div key={i} className="relative rounded-lg bg-card border border-border p-1.5" style={{ borderTop: `2px solid ${borderColor[b.color]}` }}>
            <Callout n={i + 2} className="-top-1 -left-1" />
            <Div className={"text-[8px] font-bold mb-1 " + textColor[b.color]}>{b.icon} {b.title}</Div>
            <Div className="space-y-0.5">
              {b.items.map((it, j) => (
                <Div key={j} className="flex items-center gap-1">
                  <Avatar initials={it[0]} grad={it[1]} size="w-3.5 h-3.5" text="text-[5px]" />
                  <Span className="text-[6px] text-foreground/70 truncate flex-1">{it[2]}</Span>
                  <Span className="text-[5px] text-muted-foreground">{it[3]}</Span>
                </Div>
              ))}
            </Div>
          </Div>
        ))}
      </Div>
    </>
  );
}
export function WeekendTabelleV2() {
  return <DualFrame url="Weekend · Tabelle" mobile={<Frame url="Weekend · Tabelle" tall><TabelleContent /></Frame>} desktop={<Frame url="Weekend · Tabelle" tall desktop><TabelleContent desktop /></Frame>} />;
}