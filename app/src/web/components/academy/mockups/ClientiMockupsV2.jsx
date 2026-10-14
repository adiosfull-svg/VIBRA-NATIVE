// Port di src/components/academy/mockups/ClientiMockupsV2.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Search, Users, Star, TrendingUp, TrendingDown, MessageCircle, Instagram, Plus, Upload, CalendarPlus, UserPlus, Wallet, GitBranch, MapPin, BarChart2, Table2, Trophy, Link2, AlertCircle, ChevronDown, Filter, Save, Award, Zap } from '@/ui/icons.generated';
import { Callout, Frame, Avatar, DualFrame, MiniTabBar } from './shared';

import { Div, Span } from '@/ui/html';
import { Circle, Path, Svg } from '@/ui/elements';

const CL_TABS = [
  { key: 'clienti', label: 'Clienti', icon: <Users className="w-2.5 h-2.5" /> },
  { key: 'gruppi', label: 'Gruppi', icon: <Link2 className="w-2.5 h-2.5" /> },
  { key: 'parco', label: 'Parco', icon: <Wallet className="w-2.5 h-2.5" /> },
  { key: 'albero', label: 'Albero', icon: <GitBranch className="w-2.5 h-2.5" /> },
  { key: 'tabelle', label: 'Tabelle', icon: <Table2 className="w-2.5 h-2.5" /> },
  { key: 'growth', label: 'Growth', icon: <Trophy className="w-2.5 h-2.5" /> },
  { key: 'analitica', label: 'Analitica', icon: <BarChart2 className="w-2.5 h-2.5" /> },
  { key: 'mappa', label: 'Mappa', icon: <MapPin className="w-2.5 h-2.5" /> },
];

// ── 1. LISTA CLIENTI ───────────────────────────────────────
function ListaContent({ desktop }) {
  const clients = [
    { i: 'LE', g: 'from-purple-400/60 to-purple-400/20', n: 'Giulia Russo', ig: '@giulia.r', v: 21, sp: '€1,840', r: '8.7', t: 'up', leader: true },
    { i: 'MF', g: 'from-amber-400/60 to-amber-400/20', n: 'Marco Ferrara', ig: '@marco.f', v: 31, sp: '€5,540', r: '7.8', t: 'down', leader: true },
    { i: 'GR', g: 'from-pink-400/60 to-pink-400/20', n: 'Giorgia Russo', ig: '@gio.russo', v: 18, sp: '€2,970', r: '6.2', t: 'stable', leader: false },
    { i: 'SC', g: 'from-green-400/50 to-green-400/10', n: 'Sara Costa', ig: '@sara.c', v: 2, sp: '€180', r: '5.0', t: 'up', leader: false },
    { i: 'AB', g: 'from-blue-400/60 to-blue-400/20', n: 'Antonio Bruno', ig: '@anto.b', v: 12, sp: '€1,704', r: '5.1', t: 'down', leader: false },
  ];
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Clienti</Span>
        <Plus className="w-3.5 h-3.5 text-primary" />
      </Div>
      <MiniTabBar tabs={CL_TABS} active="clienti" />
      {/* Action buttons */}
      <Div className="relative flex gap-1 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex-1 flex items-center gap-0.5 rounded border border-border bg-card px-1 py-1 text-[7px] text-muted-foreground justify-center"><Upload className="w-2.5 h-2.5" />Importa</Div>
        <Div className="flex-1 flex items-center gap-0.5 rounded bg-primary text-primary-foreground px-1 py-1 text-[7px] font-medium justify-center"><CalendarPlus className="w-2.5 h-2.5" />Presenze</Div>
        <Div className="flex-1 flex items-center gap-0.5 rounded border border-border bg-card px-1 py-1 text-[7px] text-muted-foreground justify-center"><UserPlus className="w-2.5 h-2.5" />Singolo</Div>
      </Div>
      {/* Stats bar */}
      <Div className="relative grid grid-cols-3 gap-1 mb-2">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="rounded bg-card border border-border p-1 text-center"><Div className="text-[10px] font-bold text-primary">128</Div><Div className="text-[5px] text-muted-foreground">Clienti</Div></Div>
        <Div className="rounded bg-card border border-border p-1 text-center"><Div className="text-[10px] font-bold text-green-400">1,432</Div><Div className="text-[5px] text-muted-foreground">Presenze</Div></Div>
        <Div className="rounded bg-card border border-border p-1 text-center"><Div className="text-[10px] font-bold text-amber-400">8</Div><Div className="text-[5px] text-muted-foreground">Leader</Div></Div>
      </Div>
      {/* Search + sort */}
      <Div className="relative flex items-center gap-1 mb-2">
        <Callout n={3} className="-top-1 -left-1" />
        <Div className="flex items-center gap-1 rounded bg-card border border-border px-1.5 py-1 flex-1"><Search className="w-2.5 h-2.5 text-muted-foreground" /><Span className="text-[7px] text-muted-foreground">Cerca cliente...</Span></Div>
        <Div className="flex gap-0.5">
          <Div className="rounded-full bg-primary/15 text-primary text-[6px] font-semibold px-1.5 py-0.5 border border-primary/30">Pres.</Div>
          <Div className="rounded-full bg-secondary/40 text-muted-foreground text-[6px] px-1.5 py-0.5">Spesa</Div>
          <Div className="relative rounded-full bg-secondary/40 text-muted-foreground text-[6px] px-1.5 py-0.5 flex items-center"><AlertCircle className="w-2 h-2" /><Span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-400" /></Div>
        </Div>
      </Div>
      {/* Lista / Tabella */}
      <Div className="relative rounded-lg bg-card border border-border overflow-hidden">
        <Callout n={4} className="-top-1 left-2" />
        <Div className="flex items-center justify-between px-2 py-1 border-b border-border/40">
          <Span className="text-[8px] font-semibold text-purple-400">Lista Clienti</Span>
          <Span className="text-[6px] text-muted-foreground">50 di 128</Span>
        </Div>
        {desktop ? (
          <Div>
            <Div className="flex items-center gap-1 px-1.5 py-1 border-b border-border bg-secondary/20 text-[5px] font-semibold text-muted-foreground uppercase">
              <Span className="w-3" /><Span className="flex-1">Cliente</Span><Span className="w-8 text-center">IG</Span><Span className="w-6 text-center">Pres.</Span><Span className="w-10 text-center">Spesa</Span><Span className="w-6 text-center">Rating</Span><Span className="w-5 text-center">Trend</Span>
            </Div>
            {clients.map((c, i) => (
              <Div key={i} className="flex items-center gap-1 px-1.5 py-1 border-b border-border/30 text-[6px]">
                <Div className="w-3 h-3 rounded border border-border" />
                <Avatar initials={c.i} grad={c.g} size="w-4 h-4" text="text-[5px]" />
                <Span className="flex-1 text-foreground/80 truncate flex items-center gap-0.5">{c.n}{c.leader && <Star className="w-2 h-2 text-amber-400 fill-amber-400" />}</Span>
                <Span className="w-8 text-center text-muted-foreground truncate">{c.ig}</Span>
                <Span className="w-6 text-center text-green-400">{c.v}</Span>
                <Span className="w-10 text-center text-amber-400">{c.sp}</Span>
                <Span className="w-6 text-center font-bold text-amber-400">{c.r}</Span>
                <Span className="w-5 text-center">{c.t === 'up' ? <TrendingUp className="w-2 h-2 text-green-400 inline" /> : c.t === 'down' ? <TrendingDown className="w-2 h-2 text-red-400 inline" /> : <Span className="text-muted-foreground">—</Span>}</Span>
              </Div>
            ))}
          </Div>
        ) : (
          <Div className="divide-y divide-border/30">
            {clients.slice(0, 4).map((c, i) => (
              <Div key={i} className="flex items-center gap-1.5 p-1.5">
                <Avatar initials={c.i} grad={c.g} size="w-6 h-6" text="text-[6px]" />
                <Div className="flex-1 min-w-0">
                  <Div className="text-[7px] font-semibold text-foreground truncate flex items-center gap-0.5">{c.n}{c.leader && <Star className="w-2 h-2 text-amber-400 fill-amber-400" />}</Div>
                  <Div className="text-[5px] text-muted-foreground">{c.ig} · {c.v} pres · {c.sp}</Div>
                </Div>
                <Span className="text-[7px] font-bold text-amber-400">{c.r}</Span>
                {c.t === 'up' ? <TrendingUp className="w-2.5 h-2.5 text-green-400" /> : c.t === 'down' ? <TrendingDown className="w-2.5 h-2.5 text-red-400" /> : null}
              </Div>
            ))}
          </Div>
        )}
      </Div>
    </>
  );
}
export function ClientiListaV2() {
  return <DualFrame url="Clienti · Lista" mobile={<Frame url="Clienti · Lista" tall><ListaContent /></Frame>} desktop={<Frame url="Clienti · Lista" tall desktop><ListaContent desktop /></Frame>} />;
}

// ── 2. GRUPPI ──────────────────────────────────────────────
function GruppiContent({ desktop }) {
  const groups = [
    { n: 'Amici Posillipo', c: 8, color: '#a78bfa', members: ['LE', 'MF', 'GR', 'AB'] },
    { n: 'Ragazze Vomero', c: 5, color: '#4ade80', members: ['SC', 'LB', 'GR'] },
    { n: 'Compleanno Antonio', c: 12, color: '#facc15', members: ['AM', 'LE', 'MF'] },
    { n: 'Universitari Federico', c: 6, color: '#38bdf8', members: ['DV', 'SC', 'AB'] },
  ];
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Clienti</Span>
        <Plus className="w-3.5 h-3.5 text-primary" />
      </Div>
      <MiniTabBar tabs={CL_TABS} active="gruppi" />
      <Div className="relative mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex items-center gap-1 rounded-lg border border-dashed border-border text-[8px] text-muted-foreground px-2 py-1.5 justify-center"><Plus className="w-2.5 h-2.5" />Crea nuovo gruppo</Div>
      </Div>
      <Div className={desktop ? 'grid grid-cols-2 gap-1.5' : 'space-y-1.5'}>
        {groups.map((g, i) => (
          <Div key={i} className="relative rounded-lg bg-card border border-border p-2" style={{ borderLeft: `3px solid ${g.color}` }}>
            {i === 0 && <Callout n={2} className="-top-1 -left-1" />}
            <Div className="flex items-center justify-between mb-1">
              <Div className="flex items-center gap-1"><Users className="w-2.5 h-2.5" style={{ color: g.color }} /><Span className="text-[8px] font-bold text-foreground">{g.n}</Span></Div>
              <Span className="text-[6px] text-muted-foreground bg-secondary/40 px-1 rounded-full">{g.c} clienti</Span>
            </Div>
            <Div className="flex -space-x-1">
              {g.members.map((m, j) => <Avatar key={j} initials={m} grad="from-purple-400/60 to-purple-400/20" size="w-4 h-4" text="text-[5px]" />)}
              {g.c > g.members.length && <Div className="w-4 h-4 rounded-full bg-secondary border border-background flex items-center justify-center text-[5px] text-muted-foreground">+{g.c - g.members.length}</Div>}
            </Div>
          </Div>
        ))}
      </Div>
    </>
  );
}
export function ClientiGruppiV2() {
  return <DualFrame url="Clienti · Gruppi" mobile={<Frame url="Clienti · Gruppi" tall><GruppiContent /></Frame>} desktop={<Frame url="Clienti · Gruppi" tall desktop><GruppiContent desktop /></Frame>} />;
}

// ── 3. PARCO PAGANTI ───────────────────────────────────────
function ParcoContent({ desktop }) {
  const rows = [
    { r: 1, i: 'LE', n: 'L. Esposito', venues: ['Ammare', 'Frontemare'], sp: '€4,820', tw: 12 },
    { r: 2, i: 'MF', n: 'M. Ferrara', venues: ['Frontemare'], sp: '€5,540', tw: 14 },
    { r: 3, i: 'GR', n: 'G. Russo', venues: ['Ammare', 'Vibes'], sp: '€3,950', tw: 9 },
    { r: 4, i: 'AB', n: 'A. Bruno', venues: ['Frontemare'], sp: '€1,704', tw: 5 },
  ];
  const medal = ['🥇', '🥈', '🥉'];
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Clienti</Span>
        <Plus className="w-3.5 h-3.5 text-primary" />
      </Div>
      <MiniTabBar tabs={CL_TABS} active="parco" />
      {/* KPI */}
      <Div className="relative grid grid-cols-3 gap-1 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="rounded bg-card border border-border p-1.5 text-center"><Div className="text-[10px] font-bold text-primary">€48K</Div><Div className="text-[5px] text-muted-foreground">Fatturato</Div></Div>
        <Div className="rounded bg-card border border-border p-1.5 text-center"><Div className="text-[10px] font-bold text-green-400">142</Div><Div className="text-[5px] text-muted-foreground">Tavoli</Div></Div>
        <Div className="rounded bg-card border border-border p-1.5 text-center"><Div className="text-[10px] font-bold text-amber-400">€340</Div><Div className="text-[5px] text-muted-foreground">Media</Div></Div>
      </Div>
      {/* List */}
      <Div className="relative rounded-lg bg-card border border-border p-2">
        <Callout n={2} className="-top-1 left-2" />
        <Div className="flex items-center justify-between mb-1.5">
          <Div className="flex items-center gap-1"><Wallet className="w-2.5 h-2.5 text-primary" /><Span className="text-[8px] font-bold text-foreground">Parco Paganti</Span></Div>
          <Span className="flex items-center gap-0.5 bg-primary text-primary-foreground text-[6px] font-semibold px-1 py-0.5 rounded"><Save className="w-2 h-2" />Salva</Span>
        </Div>
        <Div className="space-y-1">
          {rows.map((r, i) => (
            <Div key={i} className="flex items-center gap-1.5 rounded bg-secondary/20 p-1.5">
              {i < 3 ? <Span className="text-[8px]">{medal[i]}</Span> : <Span className="text-[6px] text-muted-foreground w-3 text-center">{r.r}</Span>}
              <Avatar initials={r.i} grad="from-purple-400/60 to-purple-400/20" size="w-5 h-5" text="text-[5px]" />
              <Div className="flex-1 min-w-0">
                <Div className="text-[7px] font-semibold text-foreground truncate">{r.n}</Div>
                <Div className="flex gap-0.5">{r.venues.map((v, j) => <Span key={j} className="text-[4px] text-muted-foreground bg-secondary/40 px-0.5 rounded">{v}</Span>)}</Div>
              </Div>
              <Div className="text-right"><Div className="text-[7px] font-bold text-amber-400">{r.sp}</Div><Div className="text-[5px] text-muted-foreground">{r.tw} tav.</Div></Div>
            </Div>
          ))}
        </Div>
      </Div>
    </>
  );
}
export function ClientiParcoV2() {
  return <DualFrame url="Clienti · Parco Paganti" mobile={<Frame url="Clienti · Parco Paganti" tall><ParcoContent /></Frame>} desktop={<Frame url="Clienti · Parco Paganti" tall desktop><ParcoContent desktop /></Frame>} />;
}

// ── 4. ALBERO ─────────────────────────────────────────────
function AlberoContent({ desktop }) {
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Clienti</Span>
        <Plus className="w-3.5 h-3.5 text-primary" />
      </Div>
      <MiniTabBar tabs={CL_TABS} active="albero" />
      {/* Root selector */}
      <Div className="relative flex items-center gap-1 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Filter className="w-2.5 h-2.5 text-muted-foreground" />
        <Div className="flex items-center justify-between rounded bg-card border border-border px-1.5 py-1 text-[7px] text-foreground flex-1"><Span>Tutte le radici</Span><ChevronDown className="w-2.5 h-2.5 text-muted-foreground" /></Div>
      </Div>
      {/* Tree */}
      <Div className="relative rounded-lg bg-card border border-border p-2" style={{ minHeight: '160px' }}>
        <Callout n={2} className="-top-1 left-2" />
        <Div className="flex items-center gap-1 mb-2"><GitBranch className="w-2.5 h-2.5 text-primary" /><Span className="text-[7px] font-semibold text-muted-foreground">Albero referenze</Span></Div>
        {/* Root */}
        <Div className="flex justify-center mb-1">
          <Div className="flex items-center gap-1 px-1.5 py-1 rounded-lg bg-primary/15 border border-primary/30">
            <Avatar initials="AD" grad="from-amber-400/60 to-amber-400/20" size="w-4 h-4" text="text-[5px]" />
            <Span className="text-[7px] font-semibold text-foreground">Antonio D.</Span>
            <Star className="w-2 h-2 text-amber-400 fill-amber-400" />
          </Div>
        </Div>
        <Div className="text-[5px] text-muted-foreground text-center mb-1">12 portate · 34 presenze</Div>
        {/* Lines */}
        <Svg className="w-full h-4" viewBox="0 0 200 16" preserveAspectRatio="none">
          <Path d="M100 0 L100 8 M30 8 L170 8 M30 8 L30 16 M100 8 L100 16 M170 8 L170 16" stroke="#444" strokeWidth="0.8" fill="none" />
        </Svg>
        {/* Children */}
        <Div className={desktop ? 'flex justify-around gap-1' : 'flex justify-around gap-0.5'}>
          {[['MF', 'from-amber-400/60 to-amber-400/20', 'Marco', '8 portate'], ['GR', 'from-pink-400/60 to-pink-400/20', 'Giorgia', '5 portate'], ['SC', 'from-green-400/50 to-green-400/10', 'Sara', '3 portate']].map((c, i) => (
            <Div key={i} className="flex flex-col items-center">
              <Div className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-secondary/40 border border-border">
                <Avatar initials={c[0]} grad={c[1]} size="w-3.5 h-3.5" text="text-[5px]" />
                <Span className="text-[6px] text-foreground/80">{c[2]}</Span>
              </Div>
              <Span className="text-[4px] text-muted-foreground mt-0.5">{c[3]}</Span>
            </Div>
          ))}
        </Div>
      </Div>
    </>
  );
}
export function ClientiAlberoV2() {
  return <DualFrame url="Clienti · Albero" mobile={<Frame url="Clienti · Albero" tall><AlberoContent /></Frame>} desktop={<Frame url="Clienti · Albero" tall desktop><AlberoContent desktop /></Frame>} />;
}

// ── 5. TABELLE ─────────────────────────────────────────────
function TabelleContent({ desktop }) {
  const tables = [
    { title: 'Classifica Presenze', items: [['LE', 'from-purple-400/60 to-purple-400/20', 'L. Esposito', '24'], ['MF', 'from-amber-400/60 to-amber-400/20', 'M. Ferrara', '31'], ['GR', 'from-pink-400/60 to-pink-400/20', 'G. Russo', '18']] },
    { title: 'Classifica Spesa', items: [['MF', 'from-amber-400/60 to-amber-400/20', 'M. Ferrara', '€5,540'], ['LE', 'from-purple-400/60 to-purple-400/20', 'L. Esposito', '€4,820'], ['GR', 'from-pink-400/60 to-pink-400/20', 'G. Russo', '€2,970']] },
    { title: 'Classifica Rating', items: [['LE', 'from-purple-400/60 to-purple-400/20', 'L. Esposito', '8.7'], ['MF', 'from-amber-400/60 to-amber-400/20', 'M. Ferrara', '7.8'], ['LB', 'from-pink-400/60 to-pink-400/20', 'L. Bianchi', '7.1']] },
  ];
  const badges = ['🏆', '🏅', '💰'];
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Clienti</Span>
        <Plus className="w-3.5 h-3.5 text-primary" />
      </Div>
      <MiniTabBar tabs={CL_TABS} active="tabelle" />
      {/* Toggle */}
      <Div className="relative flex gap-0.5 bg-secondary/30 p-0.5 rounded-lg mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex-1 text-center py-0.5 rounded bg-card text-[7px] font-semibold">Presenze</Div>
        <Div className="flex-1 text-center py-0.5 rounded text-muted-foreground text-[7px]">Spesa</Div>
        <Div className="flex-1 text-center py-0.5 rounded text-muted-foreground text-[7px]">Rating</Div>
      </Div>
      <Div className={desktop ? 'grid grid-cols-3 gap-1.5' : 'space-y-1.5'}>
        {tables.map((t, i) => (
          <Div key={i} className="relative rounded-lg bg-card border border-purple-500/20 p-1.5" style={{ borderTop: '2px solid rgba(167,139,250,0.3)' }}>
            {i === 0 && <Callout n={2} className="-top-1 -left-1" />}
            <Div className="text-[7px] font-bold text-purple-400 mb-1">{t.title}</Div>
            <Div className="space-y-0.5">
              {t.items.map((it, j) => (
                <Div key={j} className="flex items-center gap-1">
                  <Span className="text-[6px] w-2">{j < 3 ? badges[j] : j + 1}</Span>
                  <Avatar initials={it[0]} grad={it[1]} size="w-3.5 h-3.5" text="text-[5px]" />
                  <Span className="text-[6px] text-foreground/80 truncate flex-1">{it[2]}</Span>
                  <Span className="text-[6px] font-bold text-amber-400">{it[3]}</Span>
                </Div>
              ))}
            </Div>
          </Div>
        ))}
      </Div>
    </>
  );
}
export function ClientiTabelleV2() {
  return <DualFrame url="Clienti · Tabelle" mobile={<Frame url="Clienti · Tabelle" tall><TabelleContent /></Frame>} desktop={<Frame url="Clienti · Tabelle" tall desktop><TabelleContent desktop /></Frame>} />;
}

// ── 6. GROWTH ──────────────────────────────────────────────
function GrowthContent({ desktop }) {
  const rows = [
    { i: 'LE', g: 'from-purple-400/60 to-purple-400/20', n: 'L. Esposito', r: 8.5, v: 24, sp: '€4,820', avg: '€201', freq: 72, ciclo: 4.2, t: 'up', pct: '+18%' },
    { i: 'MF', g: 'from-amber-400/60 to-amber-400/20', n: 'M. Ferrara', r: 7.8, v: 31, sp: '€5,540', avg: '€178', freq: 85, ciclo: 5.1, t: 'down', pct: '-12%' },
    { i: 'GR', g: 'from-pink-400/60 to-pink-400/20', n: 'G. Russo', r: 6.2, v: 18, sp: '€2,970', avg: '€165', freq: 54, ciclo: 3.3, t: 'stable', pct: '+5%' },
  ];
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Clienti</Span>
        <Trophy className="w-3.5 h-3.5 text-amber-400" />
      </Div>
      <MiniTabBar tabs={CL_TABS} active="growth" />
      <Div className="relative flex items-center gap-1.5 rounded bg-card border border-border px-1.5 py-1 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Search className="w-2.5 h-2.5 text-muted-foreground" />
        <Span className="text-[7px] text-muted-foreground">Cerca cliente...</Span>
      </Div>
      <Div className="relative rounded-lg bg-card border border-border overflow-hidden">
        <Callout n={2} className="-top-1 right-1" />
        <Div className="flex items-center gap-1 px-1.5 py-1 border-b border-border bg-secondary/20 text-[5px] font-semibold text-muted-foreground uppercase">
          <Span className="w-3">#</Span><Span className="flex-1">Cliente</Span><Span className="w-6 text-center">Rating</Span><Span className="w-5 text-center">Pres.</Span><Span className="w-8 text-center">Spesa</Span><Span className="w-6 text-center">Freq%</Span><Span className="w-6 text-center">Trend</Span>
        </Div>
        <Div className="divide-y divide-border/30">
          {rows.map((r, i) => (
            <Div key={i} className="flex items-center gap-1 px-1.5 py-1 text-[6px]">
              <Span className="w-3 text-center">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</Span>
              <Avatar initials={r.i} grad={r.g} size="w-4 h-4" text="text-[5px]" />
              <Span className="flex-1 text-foreground/80 truncate">{r.n}</Span>
              <Div className="w-6 flex items-center gap-0.5"><Span className="font-bold text-amber-400">{r.r}</Span><Div className="h-1 w-3 bg-secondary/40 rounded-full overflow-hidden"><Div className="h-full bg-amber-400 rounded-full" style={{ width: (r.r * 10) + '%' }} /></Div></Div>
              <Span className="w-5 text-center text-green-400">{r.v}</Span>
              <Span className="w-8 text-center text-amber-400">{r.sp}</Span>
              <Div className="w-6 text-center"><Div className="h-1 bg-secondary/40 rounded-full overflow-hidden mb-0.5"><Div className="h-full bg-primary rounded-full" style={{ width: r.freq + '%' }} /></Div><Span className="text-muted-foreground">{r.freq}%</Span></Div>
              <Span className="w-6 text-center">{r.t === 'up' ? <TrendingUp className="w-2 h-2 text-green-400 inline" /> : r.t === 'down' ? <TrendingDown className="w-2 h-2 text-red-400 inline" /> : <Span className="text-muted-foreground">—</Span>}</Span>
            </Div>
          ))}
        </Div>
      </Div>
      <Div className="text-[5px] text-muted-foreground mt-1.5 text-center">Freq = presenze / serate disponibili · Ciclo = durata media cicli</Div>
    </>
  );
}
export function ClientiGrowthV2() {
  return <DualFrame url="Clienti · Growth" mobile={<Frame url="Clienti · Growth" tall><GrowthContent /></Frame>} desktop={<Frame url="Clienti · Growth" tall desktop><GrowthContent desktop /></Frame>} />;
}

// ── 7. ANALITICA ───────────────────────────────────────────
function AnaliticaContent({ desktop }) {
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Clienti</Span>
        <BarChart2 className="w-3.5 h-3.5 text-primary" />
      </Div>
      <MiniTabBar tabs={CL_TABS} active="analitica" />
      {/* KPI */}
      <Div className="relative grid grid-cols-3 gap-1 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="rounded bg-card border border-border p-1.5 text-center"><Div className="text-[11px] font-bold text-primary">128</Div><Div className="text-[5px] text-muted-foreground">Clienti</Div></Div>
        <Div className="rounded bg-card border border-border p-1.5 text-center"><Div className="text-[11px] font-bold text-green-400">1,432</Div><Div className="text-[5px] text-muted-foreground">Presenze</Div></Div>
        <Div className="rounded bg-card border border-border p-1.5 text-center"><Div className="text-[11px] font-bold text-amber-400">€676</Div><Div className="text-[5px] text-muted-foreground">Media</Div></Div>
      </Div>
      <Div className={desktop ? 'grid grid-cols-2 gap-1.5' : 'space-y-1.5'}>
        {/* Spesa nel tempo */}
        <Div className="relative rounded-lg bg-card border border-border p-2">
          <Callout n={2} className="-top-1 left-2" />
          <Div className="text-[7px] font-semibold text-muted-foreground mb-1">Spesa nel tempo</Div>
          <Div className="flex items-end gap-0.5 h-10">
            {[30, 45, 40, 60, 55, 75].map((h, i) => <Div key={i} className="flex-1 bg-primary/40 rounded-t" style={{ height: h + '%' }} />)}
          </Div>
          <Div className="flex justify-between text-[4px] text-muted-foreground mt-0.5"><Span>Mag</Span><Span>Giu</Span><Span>Lug</Span><Span>Ago</Span><Span>Set</Span></Div>
        </Div>
        {/* Presenze per giorno */}
        <Div className="relative rounded-lg bg-card border border-border p-2">
          <Callout n={3} className="-top-1 left-2" />
          <Div className="text-[7px] font-semibold text-muted-foreground mb-1">Presenze per giorno</Div>
          <Div className="flex items-end gap-1 h-10">
            {[['Ven', 60, 'bg-blue-400/50'], ['Sab', 85, 'bg-amber-400/50'], ['Dom', 35, 'bg-purple-400/50'], ['Extra', 20, 'bg-pink-400/50']].map((b, i) => (
              <Div key={i} className="flex-1 flex flex-col items-center"><Div className={"w-2 " + b[2] + " rounded-t"} style={{ height: b[1] + '%' }} /><Span className="text-[4px] text-muted-foreground mt-0.5">{b[0]}</Span></Div>
            ))}
          </Div>
        </Div>
        {/* Locali preferiti */}
        <Div className="relative rounded-lg bg-card border border-border p-2">
          <Callout n={4} className="-top-1 left-2" />
          <Div className="text-[7px] font-semibold text-muted-foreground mb-1">Locali preferiti</Div>
          <Div className="space-y-1">
            {[['Ammare', 42, 'bg-blue-400'], ['Frontemare', 31, 'bg-amber-400'], ['Vibes', 18, 'bg-purple-400']].map((v, i) => (
              <Div key={i} className="flex items-center gap-1 text-[6px]"><Div className={"w-1.5 h-1.5 rounded " + v[2]} /><Span className="text-foreground/80 flex-1">{v[0]}</Span><Div className="w-8 h-1 bg-secondary/40 rounded-full overflow-hidden"><Div className={"h-full " + v[2] + " rounded-full"} style={{ width: v[1] + '%' }} /></Div><Span className="text-muted-foreground w-5 text-right">{v[1]}%</Span></Div>
            ))}
          </Div>
        </Div>
        {/* Rating distribution */}
        <Div className="relative rounded-lg bg-card border border-border p-2">
          <Callout n={5} className="-top-1 left-2" />
          <Div className="text-[7px] font-semibold text-muted-foreground mb-1">Distribuzione Rating</Div>
          <Div className="flex items-center justify-center gap-2">
            <Div className="relative w-12 h-12">
              <Svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <Circle cx="24" cy="24" r="18" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
                <Circle cx="24" cy="24" r="18" fill="none" stroke="#a78bfa" strokeWidth="6" strokeDasharray="45 113" />
                <Circle cx="24" cy="24" r="18" fill="none" stroke="#fbbf24" strokeWidth="6" strokeDasharray="34 113" strokeDashoffset="-45" />
                <Circle cx="24" cy="24" r="18" fill="none" stroke="#ef4444" strokeWidth="6" strokeDasharray="23 113" strokeDashoffset="-79" />
              </Svg>
            </Div>
            <Div className="space-y-0.5 text-[5px]">
              <Div className="flex items-center gap-1"><Div className="w-1.5 h-1.5 rounded bg-purple-400" />7-10 · 40%</Div>
              <Div className="flex items-center gap-1"><Div className="w-1.5 h-1.5 rounded bg-amber-400" />4-6 · 30%</Div>
              <Div className="flex items-center gap-1"><Div className="w-1.5 h-1.5 rounded bg-red-400" />1-3 · 20%</Div>
            </Div>
          </Div>
        </Div>
      </Div>
    </>
  );
}
export function ClientiAnaliticaV2() {
  return <DualFrame url="Clienti · Analitica" mobile={<Frame url="Clienti · Analitica" tall><AnaliticaContent /></Frame>} desktop={<Frame url="Clienti · Analitica" tall desktop><AnaliticaContent desktop /></Frame>} />;
}

// ── 8. MAPPA ───────────────────────────────────────────────
function MappaContent({ desktop }) {
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Clienti</Span>
        <MapPin className="w-3.5 h-3.5 text-primary" />
      </Div>
      <MiniTabBar tabs={CL_TABS} active="mappa" />
      <Div className="relative rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-border overflow-hidden" style={{ minHeight: desktop ? '200px' : '160px' }}>
        <Callout n={1} className="top-1 left-1" />
        {/* Faux streets */}
        <Svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 180" preserveAspectRatio="none">
          <Path d="M0 60 L200 60 M0 120 L200 120 M60 0 L60 180 M140 0 L140 180" stroke="#666" strokeWidth="1" fill="none" />
          <Path d="M0 30 L200 30 M0 90 L200 90 M0 150 L200 150 M30 0 L30 180 M100 0 L100 180 M170 0 L170 180" stroke="#444" strokeWidth="0.5" fill="none" />
        </Svg>
        {/* Clusters */}
        <Div className="absolute" style={{ top: '25%', left: '20%' }}><Div className="w-7 h-7 rounded-full bg-primary/80 border-2 border-background flex items-center justify-center text-[8px] font-bold text-primary-foreground">12</Div></Div>
        <Div className="absolute" style={{ top: '45%', left: '55%' }}><Div className="w-5 h-5 rounded-full bg-primary/60 border-2 border-background flex items-center justify-center text-[6px] font-bold text-primary-foreground">5</Div></Div>
        {/* Single markers */}
        <Div className="absolute" style={{ top: '55%', left: '35%' }}><Div className="w-3 h-3 rounded-full bg-purple-400 border-2 border-background" /></Div>
        <Div className="absolute" style={{ top: '65%', left: '70%' }}><Div className="relative w-4 h-4 rounded-full bg-amber-400 border-2 border-background flex items-center justify-center"><Star className="w-2 h-2 text-amber-900 fill-amber-900" /></Div></Div>
        <Div className="absolute" style={{ top: '75%', left: '25%' }}><Div className="w-3 h-3 rounded-full bg-pink-400 border-2 border-background" /></Div>
        {/* Tooltip */}
        <Div className="absolute top-2 right-2 rounded-lg bg-card border border-border p-1.5 shadow-lg">
          <Callout n={2} className="-top-1 -right-1" />
          <Div className="flex items-center gap-1"><Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" size="w-4 h-4" text="text-[5px]" /><Div><Div className="text-[6px] font-semibold text-foreground">Giulia R.</Div><Div className="text-[4px] text-muted-foreground">Vomero · 14 pres.</Div></Div></Div>
        </Div>
        {/* Zoom controls */}
        <Div className="absolute top-2 left-2 flex flex-col gap-0.5">
          <Div className="w-4 h-4 rounded bg-card border border-border flex items-center justify-center text-[8px] text-foreground">+</Div>
          <Div className="w-4 h-4 rounded bg-card border border-border flex items-center justify-center text-[8px] text-foreground">−</Div>
        </Div>
      </Div>
      {/* Bottom bar */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mt-2">
        <Callout n={3} className="-top-1 left-2" />
        <Div className="text-[7px] font-semibold text-muted-foreground mb-1">Zone</Div>
        <Div className="space-y-0.5">
          {[['Vomero', 18, '#a78bfa'], ['Posillipo', 12, '#fbbf24'], ['Bagnoli', 9, '#4ade80'], ['Fuorigrotta', 7, '#38bdf8']].map((z, i) => (
            <Div key={i} className="flex items-center gap-1 text-[6px]">
              <Div className="w-1.5 h-1.5 rounded-full" style={{ background: z[2] }} />
              <Span className="text-foreground/80 flex-1">{z[0]}</Span>
              <Div className="w-10 h-1 bg-secondary/40 rounded-full overflow-hidden"><Div className="h-full rounded-full" style={{ width: (z[1] / 18 * 100) + '%', background: z[2] }} /></Div>
              <Span className="text-muted-foreground w-4 text-right">{z[1]}</Span>
            </Div>
          ))}
        </Div>
      </Div>
    </>
  );
}
export function ClientiMappaV2() {
  return <DualFrame url="Clienti · Mappa" mobile={<Frame url="Clienti · Mappa" tall><MappaContent /></Frame>} desktop={<Frame url="Clienti · Mappa" tall desktop><MappaContent desktop /></Frame>} />;
}