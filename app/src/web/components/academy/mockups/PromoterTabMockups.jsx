// Port di src/components/academy/mockups/PromoterTabMockups.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Users, BarChart3, MapPin, Target, FileText, TrendingUp, TrendingDown, Plus, Search } from '@/ui/icons.generated';
import { Callout, Frame, Avatar } from './shared';

import { Btn, Div, Span } from '@/ui/html';
import { Path, Polyline, Svg } from '@/ui/elements';

const PROMOTER_TABS = [
  { key: 'team', label: 'Team' },
  { key: 'compare', label: 'Confronta' },
  { key: 'growth', label: 'Growth' },
  { key: 'expr', label: 'Ex-PR' },
  { key: 'report', label: 'Report' },
  { key: 'obiettivi', label: 'Obiettivi' },
  { key: 'mappa', label: 'Mappa' },
];

function PromoterTabBar({ active }) {
  return (
    <Div className="flex gap-0.5 bg-secondary/30 p-0.5 rounded-lg mb-2 overflow-x-auto no-scrollbar">
      {PROMOTER_TABS.map(t => (
        <Div key={t.key} className={"py-1 px-2 rounded-md shrink-0 " + (t.key === active ? "bg-card text-[8px] font-semibold" : "text-muted-foreground text-[8px]")}>{t.label}</Div>
      ))}
    </Div>
  );
}

// ── PROMOTER · TAB CONFRONTA ─────────────────────────────────
export function PromoterCompareMockup() {
  return (
    <Frame url="Promoter · Confronta" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Promoter</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <PromoterTabBar active="compare" />
      </Div>
      {/* Compare selectors */}
      <Div className="relative flex items-center gap-2 mb-2">
        <Callout n={2} className="-top-1.5 -left-1.5" />
        <Div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/40 border border-border text-[9px]"><Avatar initials="MR" grad="from-purple-400/60 to-purple-400/20" size="w-4 h-4" text="text-[6px]" />Marco Rossi</Div>
        <Span className="text-[9px] text-muted-foreground">vs</Span>
        <Div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/40 border border-border text-[9px]"><Avatar initials="GD" grad="from-amber-400/60 to-amber-400/20" size="w-4 h-4" text="text-[6px]" />Giulia D.</Div>
      </Div>
      {/* Line chart */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2">
        <Callout n={3} className="-top-1 left-3" />
        <Div className="text-[9px] font-semibold text-muted-foreground mb-1">Fatturato mensile a confronto</Div>
        <Div className="relative h-16">
          <Svg className="w-full h-full" viewBox="0 0 200 64">
            <Polyline points="0,40 33,30 66,35 100,20 133,25 166,15 200,18" fill="none" stroke="#a78bfa" strokeWidth="2" />
            <Polyline points="0,50 33,45 66,38 100,40 133,30 166,35 200,28" fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="4 2" />
          </Svg>
        </Div>
      </Div>
      {/* Bar chart */}
      <Div className="relative rounded-lg bg-card border border-border p-2">
        <Callout n={4} className="-top-1 left-3" />
        <Div className="text-[9px] font-semibold text-muted-foreground mb-1">Tavoli chiusi per mese</Div>
        <Div className="flex items-end gap-1 h-12">
          {[40,60,55,80,65,45,70].map((h,i) => <Div key={i} className="flex-1 flex flex-col gap-px"><Div className="bg-purple-400/60 rounded-t" style={{ height: h * 0.6 + '%' }} /><Div className="bg-amber-400/60" style={{ height: h * 0.3 + '%' }} /></Div>)}
        </Div>
      </Div>
    </Frame>
  );
}

// ── PROMOTER · TAB GROWTH LEAGUE ─────────────────────────────
export function PromoterGrowthMockup() {
  return (
    <Frame url="Promoter · Growth" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Promoter</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <PromoterTabBar active="growth" />
      </Div>
      {/* Search */}
      <Div className="relative mb-2">
        <Callout n={2} className="-top-1.5 -left-1.5" />
        <Div className="flex items-center gap-1.5 rounded-lg bg-card border border-border px-2 py-1.5">
          <Search className="w-3 h-3 text-muted-foreground" />
          <Span className="text-[10px] text-muted-foreground">Cerca promoter...</Span>
        </Div>
      </Div>
      {/* League table */}
      <Div className="relative rounded-lg bg-card border border-border overflow-hidden">
        <Callout n={3} className="-top-1 -right-1" />
        <Div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-secondary/30 text-[7px] font-semibold text-muted-foreground uppercase">
          <Span className="w-4">#</Span>
          <Span className="flex-1">Promoter</Span>
          <Span className="w-10 text-center">Fatt.</Span>
          <Span className="w-8 text-center">Tav.</Span>
          <Span className="w-8 text-center">Cresc.</Span>
        </Div>
        <Div className="divide-y divide-border/40">
          <Div className="flex items-center gap-1 px-2 py-1.5 text-[8px]"><Span className="w-4 text-amber-400 font-bold">1</Span><Avatar initials="MR" grad="from-purple-400/60 to-purple-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="flex-1 text-foreground/80 truncate">Marco Rossi</Span><Span className="w-10 text-center text-primary">€28.4K</Span><Span className="w-8 text-center text-green-400">96</Span><Span className="w-8 text-center text-green-400">+15%</Span></Div>
          <Div className="flex items-center gap-1 px-2 py-1.5 text-[8px]"><Span className="w-4 text-muted-foreground font-bold">2</Span><Avatar initials="GD" grad="from-amber-400/60 to-amber-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="flex-1 text-foreground/80 truncate">Giulia D'Amato</Span><Span className="w-10 text-center text-primary">€22.1K</Span><Span className="w-8 text-center text-green-400">74</Span><Span className="w-8 text-center text-green-400">+8%</Span></Div>
          <Div className="flex items-center gap-1 px-2 py-1.5 text-[8px]"><Span className="w-4 text-muted-foreground font-bold">3</Span><Avatar initials="AM" grad="from-blue-400/60 to-blue-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="flex-1 text-foreground/80 truncate">Antonio M.</Span><Span className="w-10 text-center text-primary">€19.8K</Span><Span className="w-8 text-center text-green-400">62</Span><Span className="w-8 text-center text-red-400">-3%</Span></Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── PROMOTER · TAB EX-PR ──────────────────────────────────────
export function PromoterExprMockup() {
  return (
    <Frame url="Promoter · Ex-PR" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Promoter</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <PromoterTabBar active="expr" />
      </Div>
      {/* Ex-PR summary */}
      <Div className="relative rounded-lg bg-card border border-border p-2.5 mb-2">
        <Callout n={2} className="-top-1 left-3" />
        <Div className="flex items-center gap-1.5 mb-2"><Users className="w-3.5 h-3.5 text-primary" /><Span className="text-[10px] font-bold text-foreground">Ex-PR · 3 promoter</Span></Div>
        <Div className="grid grid-cols-3 gap-1 text-center">
          <Div><Div className="text-[12px] font-bold text-primary">€15.200</Div><Div className="text-[7px] text-muted-foreground">Fatturato</Div></Div>
          <Div><Div className="text-[12px] font-bold text-green-400">48</Div><Div className="text-[7px] text-muted-foreground">Tavoli</Div></Div>
          <Div><Div className="text-[12px] font-bold text-amber-400">62</Div><Div className="text-[7px] text-muted-foreground">Clienti</Div></Div>
        </Div>
      </Div>
      {/* Ex-PR list */}
      <Div className="space-y-1.5">
        <Div className="relative flex items-center gap-2 rounded-lg bg-card border border-border p-2 opacity-70">
          <Callout n={3} className="-top-1 -left-1" />
          <Avatar initials="LF" grad="from-gray-400/60 to-gray-400/20" />
          <Div className="flex-1 min-w-0">
            <Div className="text-[10px] font-semibold text-foreground truncate">Luca Ferrari</Div>
            <Div className="text-[8px] text-muted-foreground">Inattivo da 3 mesi</Div>
          </Div>
          <Span className="text-[8px] text-muted-foreground bg-secondary/40 px-1.5 py-0.5 rounded">€5.200</Span>
        </Div>
        <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2 opacity-70">
          <Avatar initials="SR" grad="from-gray-400/60 to-gray-400/20" />
          <Div className="flex-1 min-w-0">
            <Div className="text-[10px] font-semibold text-foreground truncate">Sara Romano</Div>
            <Div className="text-[8px] text-muted-foreground">Inattivo da 6 mesi</Div>
          </Div>
          <Span className="text-[8px] text-muted-foreground bg-secondary/40 px-1.5 py-0.5 rounded">€6.800</Span>
        </Div>
      </Div>
    </Frame>
  );
}

// ── PROMOTER · TAB OBIETTIVI ──────────────────────────────────
export function PromoterObiettiviMockup() {
  return (
    <Frame url="Promoter · Obiettivi" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Promoter</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <PromoterTabBar active="obiettivi" />
      </Div>
      {/* Add goal button */}
      <Div className="relative mb-2">
        <Callout n={2} className="-top-1.5 -left-1.5" />
        <Btn
          button
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-semibold w-full justify-center"><Plus className="w-3 h-3" />Aggiungi Obiettivo</Btn>
      </Div>
      {/* Goal cards */}
      <Div className="space-y-1.5">
        <Div className="relative rounded-lg bg-card border border-border p-2.5">
          <Callout n={3} className="-top-1 -left-1" />
          <Div className="flex items-center gap-1.5 mb-1.5"><Target className="w-3 h-3 text-primary" /><Span className="text-[10px] font-bold text-foreground">Fatturato mensile</Span></Div>
          <Div className="flex justify-between text-[9px] mb-1"><Span className="text-muted-foreground">Lug 2026</Span><Span className="font-bold text-primary">€28.400 / €35.000</Span></Div>
          <Div className="h-2 bg-secondary rounded-full"><Div className="h-2 rounded-full bg-primary" style={{ width: '81%' }} /></Div>
          <Div className="text-[8px] text-green-400 mt-1">81% completato</Div>
        </Div>
        <Div className="rounded-lg bg-card border border-border p-2.5">
          <Div className="flex items-center gap-1.5 mb-1.5"><Target className="w-3 h-3 text-green-400" /><Span className="text-[10px] font-bold text-foreground">Tavoli chiusi</Span></Div>
          <Div className="flex justify-between text-[9px] mb-1"><Span className="text-muted-foreground">Lug 2026</Span><Span className="font-bold text-green-400">96 / 120</Span></Div>
          <Div className="h-2 bg-secondary rounded-full"><Div className="h-2 rounded-full bg-green-400" style={{ width: '80%' }} /></Div>
          <Div className="text-[8px] text-green-400 mt-1">80% Completato</Div>
        </Div>
        <Div className="relative rounded-lg bg-card border border-border p-2.5">
          <Callout n={4} className="-top-1 -left-1" />
          <Div className="flex items-center gap-1.5 mb-1.5"><Target className="w-3 h-3 text-amber-400" /><Span className="text-[10px] font-bold text-foreground">Clienti Instagram</Span></Div>
          <Div className="flex justify-between text-[9px] mb-1"><Span className="text-muted-foreground">Trimestrale</Span><Span className="font-bold text-amber-400">15 / 25</Span></Div>
          <Div className="h-2 bg-secondary rounded-full"><Div className="h-2 rounded-full bg-amber-400" style={{ width: '60%' }} /></Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── PROMOTER · TAB MAPPA ──────────────────────────────────────
export function PromoterMappaMockup() {
  return (
    <Frame url="Promoter · Mappa" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Promoter</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <PromoterTabBar active="mappa" />
      </Div>
      {/* Coverage map */}
      <Div className="relative rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-border overflow-hidden" style={{ minHeight: '180px' }}>
        <Callout n={2} className="top-1.5 left-1.5" />
        {/* Faux Napoli coastline */}
        <Svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 180">
          <Path d="M40 180 L40 100 Q50 80 70 75 L100 70 Q130 65 150 80 L170 100 L170 180 Z" fill="#1e3a5f" opacity="0.5" />
          <Path d="M0 60 L200 60 M0 120 L200 120 M60 0 L60 180 M140 0 L140 180" stroke="#666" strokeWidth="0.5" fill="none" />
        </Svg>
        {/* Promoter markers */}
        <Div className="absolute" style={{ top: '35%', left: '30%' }}>
          <Div className="relative"><Div className="w-5 h-5 rounded-full bg-purple-400 border-2 border-background flex items-center justify-center text-[7px] font-bold">MR</Div><Div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] text-foreground/80 whitespace-nowrap bg-background/80 px-1 rounded">Posillipo</Div></Div>
        </Div>
        <Div className="absolute" style={{ top: '45%', left: '55%' }}>
          <Div className="relative"><Div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-background flex items-center justify-center text-[7px] font-bold">GD</Div><Div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] text-foreground/80 whitespace-nowrap bg-background/80 px-1 rounded">Vomero</Div></Div>
        </Div>
        <Div className="absolute" style={{ top: '65%', left: '40%' }}>
          <Div className="relative"><Div className="w-5 h-5 rounded-full bg-blue-400 border-2 border-background flex items-center justify-center text-[7px] font-bold">AM</Div><Div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] text-foreground/80 whitespace-nowrap bg-background/80 px-1 rounded">Scampia</Div></Div>
        </Div>
        {/* Coverage legend */}
        <Div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur p-1.5">
          <Callout n={3} className="-top-2 right-1.5" />
          <Div className="flex items-center gap-1.5 text-[8px]">
            <MapPin className="w-3 h-3 text-primary" /><Span className="text-muted-foreground">3 zone coperte</Span>
            <Span className="ml-auto text-muted-foreground">Densità: Alta</Span>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── PROMOTER · TAB TEAM (main) ───────────────────────────────
export function PromoterTeamMockup() {
  return (
    <Frame url="Promoter · Team" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Promoter</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <PromoterTabBar active="team" />
      </Div>
      {/* Sort pills */}
      <Div className="relative flex gap-1 mb-2">
        <Callout n={2} className="-top-1.5 -left-1.5" />
        <Div className="px-2 py-0.5 rounded-full bg-card border border-border text-[8px] font-semibold">Ordine</Div>
        <Div className="px-2 py-0.5 rounded-full bg-secondary/40 border border-border text-[8px] text-muted-foreground">A-Z</Div>
        <Div className="px-2 py-0.5 rounded-full bg-secondary/40 border border-border text-[8px] text-muted-foreground">Libero</Div>
      </Div>
      {/* Promoter cards */}
      <Div className="space-y-1.5">
        <Div className="relative flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Callout n={3} className="-top-1 -left-1" />
          <Avatar initials="MR" grad="from-purple-400/60 to-purple-400/20" />
          <Div className="flex-1 min-w-0">
            <Div className="text-[10px] font-semibold text-foreground truncate">Marco Rossi</Div>
            <Div className="text-[8px] text-muted-foreground">PR · Posillipo · Attivo</Div>
          </Div>
          <Div className="text-right"><Div className="text-[9px] font-bold text-primary">€28.4K</Div><Div className="text-[7px] text-muted-foreground">96 tav.</Div></Div>
        </Div>
        <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Avatar initials="GD" grad="from-amber-400/60 to-amber-400/20" />
          <Div className="flex-1 min-w-0">
            <Div className="text-[10px] font-semibold text-foreground truncate">Giulia D'Amato</Div>
            <Div className="text-[8px] text-muted-foreground">Capogruppo · Vomero · Attivo</Div>
          </Div>
          <Div className="text-right"><Div className="text-[9px] font-bold text-primary">€22.1K</Div><Div className="text-[7px] text-muted-foreground">74 tav.</Div></Div>
        </Div>
        <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Avatar initials="AM" grad="from-blue-400/60 to-blue-400/20" />
          <Div className="flex-1 min-w-0">
            <Div className="text-[10px] font-semibold text-foreground truncate">Antonio M.</Div>
            <Div className="text-[8px] text-muted-foreground">PR · Scampia · Attivo</Div>
          </Div>
          <Div className="text-right"><Div className="text-[9px] font-bold text-primary">€19.8K</Div><Div className="text-[7px] text-muted-foreground">62 tav.</Div></Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── PROMOTER · TAB REPORT ─────────────────────────────────────
export function PromoterReportMockup() {
  return (
    <Frame url="Promoter · Report" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Promoter</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <PromoterTabBar active="report" />
      </Div>
      {/* Month selector */}
      <Div className="relative flex items-center gap-1.5 mb-2">
        <Callout n={2} className="-top-1.5 -left-1.5" />
        <Span className="text-[9px] text-muted-foreground">Mese:</Span>
        <Div className="px-2 py-0.5 rounded-lg bg-secondary/40 border border-border text-[9px]">Lug 2026 ▾</Div>
      </Div>
      {/* Monthly summary */}
      <Div className="relative rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 p-2.5 mb-2">
        <Callout n={3} className="-top-1 left-3" />
        <Div className="flex items-center gap-1 mb-1"><FileText className="w-3 h-3 text-primary" /><Span className="text-[10px] font-bold text-foreground">Report Mensile</Span></Div>
        <Div className="grid grid-cols-3 gap-1 text-center">
          <Div><Div className="text-[12px] font-bold text-primary">€70.3K</Div><Div className="text-[7px] text-muted-foreground">Fatturato</Div></Div>
          <Div><Div className="text-[12px] font-bold text-green-400">232</Div><Div className="text-[7px] text-muted-foreground">Tavoli</Div></Div>
          <Div><Div className="text-[12px] font-bold text-amber-400">412</Div><Div className="text-[7px] text-muted-foreground">Presenze</Div></Div>
        </Div>
      </Div>
      {/* Per-promoter breakdown */}
      <Div className="relative rounded-lg bg-card border border-border p-2">
        <Callout n={4} className="-top-1 left-3" />
        <Div className="text-[9px] font-semibold text-muted-foreground mb-1.5">Per promoter</Div>
        <Div className="space-y-1">
          <Div className="flex items-center gap-1.5 text-[8px]"><Avatar initials="MR" grad="from-purple-400/60 to-purple-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-foreground/80 flex-1">Marco Rossi</Span><Span className="font-bold text-primary">€28.4K</Span></Div>
          <Div className="flex items-center gap-1.5 text-[8px]"><Avatar initials="GD" grad="from-amber-400/60 to-amber-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-foreground/80 flex-1">Giulia D.</Span><Span className="font-bold text-primary">€22.1K</Span></Div>
          <Div className="flex items-center gap-1.5 text-[8px]"><Avatar initials="AM" grad="from-blue-400/60 to-blue-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-foreground/80 flex-1">Antonio M.</Span><Span className="font-bold text-primary">€19.8K</Span></Div>
        </Div>
      </Div>
    </Frame>
  );
}