// Port di src/components/academy/mockups/IlMioVibraTabMockups.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Euro, TrendingUp, TrendingDown, Users, NotebookPen, Trophy, Swords, Calculator, Crown, Star, Calendar, Award, Target, Megaphone, BarChart3, ChevronDown, Map as MapIcon, Wine, FileText, X } from '@/ui/icons.generated';
import { Callout, Frame, Avatar } from './shared';

import { Div, Span } from '@/ui/html';
import { Defs, Polyline, Stop, Svg, SvgLinearGradient } from '@/ui/elements';

const IMV_TABS = [
  { key: 'guadagni', label: 'Guadagni', icon: <Euro className="w-2.5 h-2.5" /> },
  { key: 'guadagni-dettagli', label: 'Dettagli', icon: <BarChart3 className="w-2.5 h-2.5" /> },
  { key: 'serate', label: 'Serate', icon: <Calendar className="w-2.5 h-2.5" /> },
  { key: 'progressi', label: 'Progressi', icon: <TrendingUp className="w-2.5 h-2.5" /> },
  { key: 'team', label: 'Team', icon: <Users className="w-2.5 h-2.5" /> },
  { key: 'note', label: 'Note', icon: <NotebookPen className="w-2.5 h-2.5" /> },
  { key: 'achievements', label: 'Ach.', icon: <Trophy className="w-2.5 h-2.5" /> },
  { key: 'vibravs', label: 'VS', icon: <Swords className="w-2.5 h-2.5" /> },
];

function ImvTabBar({ active }) {
  return (
    <Div className="flex gap-0.5 bg-secondary/30 p-0.5 rounded-lg my-2 overflow-x-auto no-scrollbar">
      {IMV_TABS.map(t => (
        <Div key={t.key} className={"flex items-center justify-center gap-0.5 py-1 px-1.5 rounded-md shrink-0 " + (t.key === active ? "bg-card text-[8px] font-semibold" : "text-muted-foreground text-[8px]")}>
          {t.icon}{t.label}
        </Div>
      ))}
    </Div>
  );
}

// ── IL MIO VIBRA · GUADAGNI ──────────────────────────────────
export function IlMioVibraGuadagniMockup() {
  return (
    <Frame url="Il Mio Vibra · Guadagni" tall>
      <Div className="flex items-center justify-between mb-1">
        <Span className="text-sm font-bold text-foreground">Il Mio Vibra</Span>
        <Trophy className="w-4 h-4 text-primary" />
      </Div>
      <ImvTabBar active="guadagni" />
      {/* Total card */}
      <Div className="relative rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-2.5 mb-2">
        <Callout n={1} className="-top-1 left-3" />
        <Div className="text-[9px] text-muted-foreground mb-0.5">Guadagni totali</Div>
        <Div className="text-[18px] font-bold text-primary">€18.450</Div>
        <Div className="text-[8px] text-green-400 flex items-center gap-0.5 mt-0.5"><TrendingUp className="w-2.5 h-2.5" />+12% vs mese scorso</Div>
      </Div>
      {/* Detail per serata */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2">
        <Callout n={2} className="-top-1 left-3" />
        <Div className="text-[9px] font-semibold text-muted-foreground mb-1.5">Dettaglio serate</Div>
        <Div className="space-y-1.5">
          <Div className="flex items-center gap-1.5 text-[8px]"><Div className="w-3 h-3 rounded bg-blue-400/30 shrink-0" /><Span className="text-foreground/80 flex-1">Ammare · 18 Lug</Span><Span className="text-muted-foreground">15%</Span><Span className="font-bold text-green-400">€480</Span></Div>
          <Div className="flex items-center gap-1.5 text-[8px]"><Div className="w-3 h-3 rounded bg-amber-400/30 shrink-0" /><Span className="text-foreground/80 flex-1">Borgo · 19 Lug</Span><Span className="text-muted-foreground">12%</Span><Span className="font-bold text-green-400">€672</Span></Div>
          <Div className="flex items-center gap-1.5 text-[8px]"><Div className="w-3 h-3 rounded bg-purple-400/30 shrink-0" /><Span className="text-foreground/80 flex-1">Vibe · 20 Lug</Span><Span className="text-muted-foreground">10%</Span><Span className="font-bold text-green-400">€210</Span></Div>
        </Div>
      </Div>
      {/* Month filter */}
      <Div className="relative flex items-center gap-1.5">
        <Callout n={3} className="-top-1.5 -left-1.5" />
        <Span className="text-[9px] text-muted-foreground">Mese:</Span>
        <Div className="px-2 py-0.5 rounded-lg bg-secondary/40 border border-border text-[9px]">Lug 2026 ▾</Div>
      </Div>
    </Frame>
  );
}

// ── IL MIO VIBRA · PROGRESSI ─────────────────────────────────
export function IlMioVibraProgressiMockup() {
  return (
    <Frame url="Il Mio Vibra · Progressi" tall>
      <Div className="flex items-center justify-between mb-1">
        <Span className="text-sm font-bold text-foreground">Il Mio Vibra</Span>
        <Trophy className="w-4 h-4 text-primary" />
      </Div>
      <ImvTabBar active="progressi" />
      {/* KPI grid */}
      <Div className="relative grid grid-cols-2 gap-1.5 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="rounded-lg bg-card border border-border p-2"><Div className="text-[7px] text-muted-foreground uppercase mb-0.5">Clienti</Div><Div className="text-[14px] font-bold text-green-400">86</Div></Div>
        <Div className="rounded-lg bg-card border border-border p-2"><Div className="text-[7px] text-muted-foreground uppercase mb-0.5">Presenze</Div><Div className="text-[14px] font-bold text-primary">312</Div></Div>
        <Div className="rounded-lg bg-card border border-border p-2"><Div className="text-[7px] text-muted-foreground uppercase mb-0.5">Fatturato</Div><Div className="text-[14px] font-bold text-amber-400">€42.300</Div></Div>
        <Div className="rounded-lg bg-card border border-border p-2"><Div className="text-[7px] text-muted-foreground uppercase mb-0.5">Guadagni</Div><Div className="text-[14px] font-bold text-green-400">€18.450</Div></Div>
      </Div>
      {/* Rank card */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2">
        <Callout n={2} className="-top-1 left-3" />
        <Div className="flex items-center gap-2">
          <Div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/30 to-amber-500/5 flex items-center justify-center"><Crown className="w-4 h-4 text-amber-400" /></Div>
          <Div className="flex-1">
            <Div className="text-[10px] font-bold text-foreground">Rango: Argento II</Div>
            <Div className="text-[8px] text-muted-foreground">Prossimo: Oro I (mancano €7.700)</Div>
          </Div>
        </Div>
        <Div className="mt-1.5 h-1.5 bg-secondary rounded-full"><Div className="h-1.5 rounded-full bg-amber-400" style={{ width: '65%' }} /></Div>
      </Div>
      {/* Goals */}
      <Div className="relative rounded-lg bg-card border border-border p-2">
        <Callout n={3} className="-top-1 left-3" />
        <Div className="flex items-center gap-1 mb-1.5"><Target className="w-3 h-3 text-primary" /><Span className="text-[9px] font-semibold text-foreground">I Miei Obiettivi</Span></Div>
        <Div className="space-y-1.5">
          <Div><Div className="flex justify-between text-[8px] mb-0.5"><Span className="text-foreground/70">Fatturato mensile</Span><Span className="text-amber-400">€28K / €35K</Span></Div><Div className="h-1 bg-secondary rounded-full"><Div className="h-1 rounded-full bg-primary" style={{ width: '80%' }} /></Div></Div>
          <Div><Div className="flex justify-between text-[8px] mb-0.5"><Span className="text-foreground/70">Tavoli chiusi</Span><Span className="text-amber-400">96 / 120</Span></Div><Div className="h-1 bg-secondary rounded-full"><Div className="h-1 rounded-full bg-green-400" style={{ width: '80%' }} /></Div></Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── IL MIO VIBRA · TEAM ──────────────────────────────────────
export function IlMioVibraTeamMockup() {
  return (
    <Frame url="Il Mio Vibra · Team" tall>
      <Div className="flex items-center justify-between mb-1">
        <Span className="text-sm font-bold text-foreground">Il Mio Vibra</Span>
        <Trophy className="w-4 h-4 text-primary" />
      </Div>
      <ImvTabBar active="team" />
      {/* Team summary */}
      <Div className="relative rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 p-2.5 mb-2">
        <Callout n={1} className="-top-1 left-3" />
        <Div className="text-[9px] text-muted-foreground mb-1">Il Mio Team · 5 promoter</Div>
        <Div className="grid grid-cols-3 gap-1.5 text-center">
          <Div><Div className="text-[12px] font-bold text-primary">€58.200</Div><Div className="text-[7px] text-muted-foreground">Fatturato</Div></Div>
          <Div><Div className="text-[12px] font-bold text-green-400">186</Div><Div className="text-[7px] text-muted-foreground">Tavoli</Div></Div>
          <Div><Div className="text-[12px] font-bold text-amber-400">214</Div><Div className="text-[7px] text-muted-foreground">Clienti</Div></Div>
        </Div>
      </Div>
      {/* Membri */}
      <Div className="space-y-1.5">
        <Div className="relative flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Callout n={2} className="-top-1 -left-1" />
          <Avatar initials="GD" grad="from-amber-400/60 to-amber-400/20" />
          <Div className="flex-1 min-w-0">
            <Div className="text-[10px] font-semibold text-foreground truncate">Giulia D'Amato</Div>
            <Div className="text-[8px] text-muted-foreground">Capogruppo · 3 PR sotto</Div>
          </Div>
          <Div className="text-right"><Div className="text-[10px] font-bold text-primary">€22.100</Div><Div className="text-[7px] text-muted-foreground">fatturato</Div></Div>
        </Div>
        <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Avatar initials="MR" grad="from-purple-400/60 to-purple-400/20" />
          <Div className="flex-1 min-w-0">
            <Div className="text-[10px] font-semibold text-foreground truncate">Marco Rossi</Div>
            <Div className="text-[8px] text-muted-foreground">PR · Posillipo</Div>
          </Div>
          <Div className="text-right"><Div className="text-[10px] font-bold text-primary">€28.400</Div><Div className="text-[7px] text-muted-foreground">fatturato</Div></Div>
        </Div>
        <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Avatar initials="AM" grad="from-blue-400/60 to-blue-400/20" />
          <Div className="flex-1 min-w-0">
            <Div className="text-[10px] font-semibold text-foreground truncate">Antonio M.</Div>
            <Div className="text-[8px] text-muted-foreground">PR · Vomero</Div>
          </Div>
          <Div className="text-right"><Div className="text-[10px] font-bold text-primary">€19.800</Div><Div className="text-[7px] text-muted-foreground">fatturato</Div></Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── IL MIO VIBRA · NOTE ──────────────────────────────────────
export function IlMioVibraNoteMockup() {
  return (
    <Frame url="Il Mio Vibra · Note" tall>
      <Div className="flex items-center justify-between mb-1">
        <Span className="text-sm font-bold text-foreground">Il Mio Vibra</Span>
        <Trophy className="w-4 h-4 text-primary" />
      </Div>
      <ImvTabBar active="note" />
      {/* Pinned note */}
      <Div className="relative rounded-lg bg-amber-500/10 border border-amber-500/30 p-2.5 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex items-start gap-1.5">
          <Span className="text-sm">📌</Span>
          <Div className="flex-1">
            <Div className="text-[10px] font-bold text-foreground">Lista VIP Ammare</Div>
            <Div className="text-[8px] text-muted-foreground mt-0.5">Luca, Marco, Giorgia — tavolo front ogni venerdì. Prenotare entro giovedì.</Div>
          </Div>
        </Div>
      </Div>
      {/* Other notes */}
      <Div className="space-y-1.5">
        <Div className="relative rounded-lg bg-card border border-border p-2.5" style={{ borderLeft: '3px solid #8b5cf6' }}>
          <Callout n={2} className="-top-1 -left-1" />
          <Div className="text-[10px] font-bold text-foreground">Idee per sabato</Div>
          <Div className="text-[8px] text-muted-foreground mt-0.5">Chiamare Antonio per il compleanno — porta 8 amici.</Div>
        </Div>
        <Div className="rounded-lg bg-card border border-border p-2.5" style={{ borderLeft: '3px solid #4ade80' }}>
          <Div className="text-[10px] font-bold text-foreground">Clienti da recuperare</Div>
          <Div className="text-[8px] text-muted-foreground mt-0.5">Sara non viene da 3 settimane. Offrire ingresso omaggio.</Div>
        </Div>
        <Div className="rounded-lg bg-card border border-border p-2.5" style={{ borderLeft: '3px solid #facc15' }}>
          <Div className="text-[10px] font-bold text-foreground">Promemessa Borgo</Div>
          <Div className="text-[8px] text-muted-foreground mt-0.5">Portare 2 clienti nuovi per il tavolo VIP.</Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── IL MIO VIBRA · ACHIEVEMENTS ──────────────────────────────
export function IlMioVibraAchievementsMockup() {
  return (
    <Frame url="Il Mio Vibra · Achievement" tall>
      <Div className="flex items-center justify-between mb-1">
        <Span className="text-sm font-bold text-foreground">Il Mio Vibra</Span>
        <Trophy className="w-4 h-4 text-primary" />
      </Div>
      <ImvTabBar active="achievements" />
      {/* Summary */}
      <Div className="relative rounded-lg bg-card border border-border p-2.5 mb-2">
        <Callout n={1} className="-top-1 left-3" />
        <Div className="flex items-center justify-between">
          <Div className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-400" /><Span className="text-[10px] font-bold text-foreground">12 / 48</Span><Span className="text-[8px] text-muted-foreground">sbloccati</Span></Div>
          <Div className="h-1.5 w-16 bg-secondary rounded-full"><Div className="h-1.5 rounded-full bg-amber-400" style={{ width: '25%' }} /></Div>
        </Div>
      </Div>
      {/* Rarity summary */}
      <Div className="relative grid grid-cols-3 gap-1 mb-2">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="rounded-lg bg-amber-700/15 border border-amber-700/30 p-1.5 text-center"><Div className="text-[8px] text-amber-600">Bronzo</Div><Div className="text-[10px] font-bold text-amber-600">5/8</Div></Div>
        <Div className="rounded-lg bg-gray-400/15 border border-gray-400/30 p-1.5 text-center"><Div className="text-[8px] text-gray-300">Argento</Div><Div className="text-[10px] font-bold text-gray-300">4/12</Div></Div>
        <Div className="rounded-lg bg-amber-400/15 border border-amber-400/30 p-1.5 text-center"><Div className="text-[8px] text-amber-400">Oro</Div><Div className="text-[10px] font-bold text-amber-400">3/10</Div></Div>
      </Div>
      {/* Badge grid */}
      <Div className="relative grid grid-cols-4 gap-1.5">
        <Callout n={3} className="-top-1 -left-1" />
        <Div className="aspect-square rounded-lg bg-amber-700/15 border border-amber-700/30 flex items-center justify-center text-lg">🏅</Div>
        <Div className="aspect-square rounded-lg bg-amber-700/15 border border-amber-700/30 flex items-center justify-center text-lg">💰</Div>
        <Div className="aspect-square rounded-lg bg-gray-400/15 border border-gray-400/30 flex items-center justify-center text-lg">💎</Div>
        <Div className="aspect-square rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-lg">🤝</Div>
        <Div className="aspect-square rounded-lg bg-secondary/30 border border-border flex items-center justify-center text-lg opacity-30">👑</Div>
        <Div className="aspect-square rounded-lg bg-secondary/30 border border-border flex items-center justify-center text-lg opacity-30">🔥</Div>
        <Div className="aspect-square rounded-lg bg-secondary/30 border border-border flex items-center justify-center text-lg opacity-30">⭐</Div>
        <Div className="aspect-square rounded-lg bg-secondary/30 border border-border flex items-center justify-center text-lg opacity-30">🏆</Div>
      </Div>
    </Frame>
  );
}

// ── IL MIO VIBRA · VIBRA VS ──────────────────────────────────
export function IlMioVibraVibraVSMockup() {
  return (
    <Frame url="Il Mio Vibra · Vibra VS" tall>
      <Div className="flex items-center justify-between mb-1">
        <Span className="text-sm font-bold text-foreground">Il Mio Vibra</Span>
        <Trophy className="w-4 h-4 text-primary" />
      </Div>
      <ImvTabBar active="vibravs" />
      {/* Active challenge */}
      <Div className="relative rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 p-2.5 mb-2">
        <Callout n={1} className="-top-1 left-3" />
        <Div className="flex items-center gap-1.5 mb-1"><Swords className="w-4 h-4 text-purple-400" /><Span className="text-[10px] font-bold text-foreground">Chi porta più tavoli?</Span></Div>
        <Div className="text-[8px] text-muted-foreground mb-1.5">Fino al 31 Lug · Premio: Cena per 2</Div>
        <Div className="space-y-1">
          <Div className="flex items-center gap-1.5"><Span className="text-[8px] font-bold text-amber-400 w-4">1°</Span><Avatar initials="MR" grad="from-purple-400/60 to-purple-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/80 flex-1">Marco Rossi</Span><Span className="text-[9px] font-bold text-green-400">42 tav.</Span></Div>
          <Div className="flex items-center gap-1.5"><Span className="text-[8px] font-bold text-muted-foreground w-4">2°</Span><Avatar initials="GD" grad="from-amber-400/60 to-amber-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/80 flex-1">Giulia D'Amato</Span><Span className="text-[9px] font-bold text-green-400">38 tav.</Span></Div>
          <Div className="flex items-center gap-1.5"><Span className="text-[8px] font-bold text-muted-foreground w-4">3°</Span><Avatar initials="AM" grad="from-blue-400/60 to-blue-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/80 flex-1">Antonio M.</Span><Span className="text-[9px] font-bold text-green-400">31 tav.</Span></Div>
        </Div>
      </Div>
      {/* Win stats */}
      <Div className="relative grid grid-cols-3 gap-1.5 mb-2">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center"><Div className="text-[12px] font-bold text-green-400">3</Div><Div className="text-[7px] text-muted-foreground">Vittorie sett.</Div></Div>
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center"><Div className="text-[12px] font-bold text-amber-400">🔥2</Div><Div className="text-[7px] text-muted-foreground">Striscia</Div></Div>
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center"><Div className="text-[12px] font-bold text-primary">1</Div><Div className="text-[7px] text-muted-foreground">Vittoria mese</Div></Div>
      </Div>
    </Frame>
  );
}

// ── IL MIO VIBRA · ACCORDI ───────────────────────────────────
export function IlMioVibraAccordiMockup() {
  return (
    <Frame url="Il Mio Vibra · Accordi" tall>
      <Div className="flex items-center justify-between mb-1">
        <Span className="text-sm font-bold text-foreground">Il Mio Vibra</Span>
        <Trophy className="w-4 h-4 text-primary" />
      </Div>
      <ImvTabBar active="team" />
      {/* Accordi per locale */}
      <Div className="relative rounded-lg bg-card border border-border p-2.5 mb-2">
        <Callout n={1} className="-top-1 left-3" />
        <Div className="flex items-center gap-1 mb-2"><Megaphone className="w-3 h-3 text-primary" /><Span className="text-[10px] font-bold text-foreground">I Miei Accordi</Span></Div>
        <Div className="space-y-2">
          <Div>
            <Div className="flex items-center justify-between text-[9px] mb-1"><Span className="flex items-center gap-1"><Div className="w-4 h-4 rounded bg-blue-400/30" /><Span className="text-foreground/80">Ammare</Span></Span><Span className="font-bold text-primary">15%</Span></Div>
            <Div className="h-1.5 bg-secondary rounded-full"><Div className="h-1.5 rounded-full bg-blue-400" style={{ width: '15%' }} /></Div>
          </Div>
          <Div>
            <Div className="flex items-center justify-between text-[9px] mb-1"><Span className="flex items-center gap-1"><Div className="w-4 h-4 rounded bg-amber-400/30" /><Span className="text-foreground/80">Borgo Antico</Span></Span><Span className="font-bold text-primary">12%</Span></Div>
            <Div className="h-1.5 bg-secondary rounded-full"><Div className="h-1.5 rounded-full bg-amber-400" style={{ width: '12%' }} /></Div>
          </Div>
          <Div>
            <Div className="flex items-center justify-between text-[9px] mb-1"><Span className="flex items-center gap-1"><Div className="w-4 h-4 rounded bg-purple-400/30" /><Span className="text-foreground/80">Vibe Club</Span></Span><Span className="font-bold text-primary">10%</Span></Div>
            <Div className="h-1.5 bg-secondary rounded-full"><Div className="h-1.5 rounded-full bg-purple-400" style={{ width: '10%' }} /></Div>
          </Div>
        </Div>
      </Div>
      {/* Calcolatrice */}
      <Div className="relative rounded-lg bg-card border border-border p-2.5">
        <Callout n={2} className="-top-1 left-3" />
        <Div className="flex items-center gap-1 mb-1.5"><Calculator className="w-3 h-3 text-primary" /><Span className="text-[9px] font-bold text-foreground">Calcolatrice</Span></Div>
        <Div className="flex items-center gap-1.5 text-[9px]"><Span className="text-muted-foreground">Fatturato:</Span><Span className="font-bold text-foreground px-1.5 py-0.5 rounded bg-secondary/40">€5.000</Span></Div>
        <Div className="flex items-center gap-1.5 text-[9px] mt-1"><Span className="text-muted-foreground">Locale:</Span><Span className="font-bold text-foreground px-1.5 py-0.5 rounded bg-secondary/40">Ammare 15%</Span></Div>
        <Div className="mt-2 pt-2 border-t border-border text-[10px] font-bold text-green-400">→ Guadagno: €750</Div>
      </Div>
    </Frame>
  );
}

// ── IL MIO VIBRA · GUADAGNI DETTAGLIATI ───────────────────────
export function IlMioVibraGuadagniDettagliMockup() {
  return (
    <Frame url="Il Mio Vibra · Guadagni Dettagliati" tall>
      <Div className="flex items-center justify-between mb-1">
        <Span className="text-sm font-bold text-foreground">Il Mio Vibra</Span>
        <Trophy className="w-4 h-4 text-primary" />
      </Div>
      <ImvTabBar active="guadagni-dettagli" />
      {/* Timeline guadagni mensili */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2">
        <Callout n={1} className="-top-1 left-3" />
        <Div className="flex items-center gap-1 mb-1.5"><TrendingUp className="w-3 h-3 text-primary" /><Span className="text-[9px] font-semibold text-muted-foreground">Timeline Guadagni Mensili</Span></Div>
        <Svg viewBox="0 0 160 50" className="w-full h-12">
          <Defs><SvgLinearGradient id="imvgd" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#a78bfa" /><Stop offset="1" stopColor="#a78bfa" stopOpacity="0" /></SvgLinearGradient></Defs>
          <Polyline points="0,38 22,30 44,34 66,22 88,18 110,26 132,10 160,14 160,50 0,50" fill="url(#imvgd)" opacity="0.25" />
          <Polyline points="0,38 22,30 44,34 66,22 88,18 110,26 132,10 160,14" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
        </Svg>
        <Div className="flex justify-between text-[7px] text-muted-foreground mt-0.5"><Span>Gen</Span><Span>Feb</Span><Span>Mar</Span><Span>Apr</Span><Span>Mag</Span><Span>Giu</Span><Span>Lug</Span><Span>Ago</Span></Div>
      </Div>
      {/* Statistiche avanzate */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2 space-y-1.5">
        <Callout n={2} className="-top-1 left-3" />
        <Div className="flex items-center gap-1 mb-1"><Trophy className="w-3 h-3 text-amber-400" /><Span className="text-[9px] font-bold text-foreground">Statistiche Avanzate</Span></Div>
        <Div className="grid grid-cols-2 gap-1.5">
          <Div className="rounded-lg bg-secondary/20 p-1.5"><Div className="text-[7px] text-muted-foreground">🏆 Serata migliore</Div><Div className="text-[10px] font-bold text-amber-400">€1.240</Div><Div className="text-[7px] text-muted-foreground">Borgo · 19 Lug</Div></Div>
          <Div className="rounded-lg bg-secondary/20 p-1.5"><Div className="text-[7px] text-muted-foreground">📅 Mese migliore</Div><Div className="text-[10px] font-bold text-emerald-400">€6.180</Div><Div className="text-[7px] text-muted-foreground">Luglio 2026</Div></Div>
        </Div>
        <Div className="rounded-lg bg-secondary/20 p-1.5">
          <Div className="text-[7px] text-muted-foreground mb-1">Guadagno medio per giorno</Div>
          <Div className="grid grid-cols-4 gap-1 text-center">
            <Div><Div className="text-[8px] text-muted-foreground">Ven</Div><Div className="text-[9px] font-bold text-blue-400">€420</Div></Div>
            <Div><Div className="text-[8px] text-muted-foreground">Sab</Div><Div className="text-[9px] font-bold text-violet-400">€580</Div></Div>
            <Div><Div className="text-[8px] text-muted-foreground">Dom</Div><Div className="text-[9px] font-bold text-amber-400">€310</Div></Div>
            <Div><Div className="text-[8px] text-muted-foreground">⭐Extra</Div><Div className="text-[9px] font-bold text-pink-400">€490</Div></Div>
          </Div>
        </Div>
      </Div>
      {/* Mesi espandibili */}
      <Div className="relative rounded-lg bg-card border border-border overflow-hidden">
        <Callout n={3} className="-top-1 left-3" />
        <Div className="flex items-center justify-between px-2 py-1.5">
          <Span className="text-[10px] font-semibold text-foreground">Lug 26</Span>
          <Div className="flex items-center gap-2 text-[8px] text-muted-foreground"><Span>8 serate</Span><Span className="font-bold text-primary">€6.180</Span></Div>
          <ChevronDown className="w-3 h-3 text-muted-foreground rotate-180" />
        </Div>
        <Div className="border-t border-border px-2 py-2 bg-secondary/10 space-y-1">
          <Div className="grid grid-cols-3 gap-1 text-[8px]">
            <Div className="rounded bg-secondary/50 p-1.5"><Div className="text-muted-foreground">% Guadagno</Div><Div className="font-bold text-primary">€4.120</Div></Div>
            <Div className="rounded bg-secondary/50 p-1.5"><Div className="text-muted-foreground">Extra</Div><Div className="font-bold text-blue-400">€2.060</Div></Div>
            <Div className="rounded bg-secondary/50 p-1.5"><Div className="text-muted-foreground">Totale</Div><Div className="font-bold text-green-400">€6.180</Div></Div>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── IL MIO VIBRA · LE MIE SERATE ──────────────────────────────
export function IlMioVibraSerateMockup() {
  const cols = '1fr 56px 40px 44px 24px';
  return (
    <Frame url="Il Mio Vibra · Le Mie Serate" tall>
      <Div className="flex items-center justify-between mb-1">
        <Span className="text-sm font-bold text-foreground">Il Mio Vibra</Span>
        <Trophy className="w-4 h-4 text-primary" />
      </Div>
      <ImvTabBar active="serate" />
      {/* Header tabella */}
      <Div className="grid text-[8px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-1" style={{ gridTemplateColumns: cols }}>
        <Span>Serata</Span><Span className="text-right">Fatturato</Span><Span className="text-right">Tav.</Span><Span className="text-right">Locale</Span><Span></Span>
      </Div>
      <Div className="space-y-1.5">
        <Div className="relative rounded-lg bg-card border border-border p-2">
          <Callout n={1} className="-top-1 -left-1" />
          <Div className="grid items-center gap-1.5" style={{ gridTemplateColumns: cols }}>
            <Div className="flex items-center gap-1.5 min-w-0">
              <Div className="w-5 h-5 rounded bg-blue-400/30 flex items-center justify-center text-[7px] font-bold text-blue-400 shrink-0">AM</Div>
              <Div className="min-w-0"><Div className="text-[10px] font-semibold text-foreground truncate">Ammare Frontemare</Div><Div className="text-[8px] text-muted-foreground">18 Lug · Ven</Div></Div>
            </Div>
            <Div className="text-right"><Div className="text-[10px] font-bold text-primary">€3.200</Div></Div>
            <Div className="text-right"><Div className="text-[10px] font-bold text-muted-foreground">2</Div></Div>
            <Div className="text-right"><Div className="text-[8px] text-muted-foreground truncate">Ammare</Div></Div>
            <Div className="flex items-center justify-center"><NotebookPen className="w-3.5 h-3.5 text-muted-foreground" /></Div>
          </Div>
        </Div>
        <Div className="relative rounded-lg bg-card border border-border p-2">
          <Callout n={2} className="-top-1 -left-1" />
          <Div className="grid items-center gap-1.5" style={{ gridTemplateColumns: cols }}>
            <Div className="flex items-center gap-1.5 min-w-0">
              <Div className="w-5 h-5 rounded bg-amber-400/30 flex items-center justify-center text-[7px] font-bold text-amber-400 shrink-0">BO</Div>
              <Div className="min-w-0"><Div className="text-[10px] font-semibold text-foreground truncate">Borgo Antico</Div><Div className="text-[8px] text-muted-foreground">19 Lug · Sab</Div></Div>
            </Div>
            <Div className="text-right"><Div className="text-[10px] font-bold text-primary">€5.600</Div></Div>
            <Div className="text-right"><Div className="text-[10px] font-bold text-muted-foreground">4</Div></Div>
            <Div className="text-right"><Div className="text-[8px] text-muted-foreground truncate">Borgo</Div></Div>
            <Div className="flex items-center justify-center"><NotebookPen className="w-3.5 h-3.5 text-primary" /></Div>
          </Div>
          {/* Note espansa */}
          <Div className="border-t border-border mt-2 pt-2 space-y-1">
            <Div className="flex items-center gap-1 text-[8px] text-muted-foreground uppercase"><NotebookPen className="w-2.5 h-2.5" /> I miei appunti per questa serata</Div>
            <Div className="rounded-lg bg-secondary/30 border border-border px-2 py-1.5 text-[8px] text-foreground/70 font-mono">Lista VIP, tavolo front, 8 persone...</Div>
          </Div>
        </Div>
        <Div className="rounded-lg bg-card border border-border p-2">
          <Div className="grid items-center gap-1.5" style={{ gridTemplateColumns: cols }}>
            <Div className="flex items-center gap-1.5 min-w-0">
              <Div className="w-5 h-5 rounded bg-purple-400/30 flex items-center justify-center text-[7px] font-bold text-purple-400 shrink-0">VI</Div>
              <Div className="min-w-0"><Div className="text-[10px] font-semibold text-foreground truncate">Vibe Club</Div><Div className="text-[8px] text-muted-foreground">20 Lug · Dom</Div></Div>
            </Div>
            <Div className="text-right"><Div className="text-[10px] font-bold text-primary">€2.100</Div></Div>
            <Div className="text-right"><Div className="text-[10px] font-bold text-muted-foreground">1</Div></Div>
            <Div className="text-right"><Div className="text-[8px] text-muted-foreground truncate">Vibe</Div></Div>
            <Div className="flex items-center justify-center"><NotebookPen className="w-3.5 h-3.5 text-muted-foreground" /></Div>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── IL MIO VIBRA · CALCOLATRICE ───────────────────────────────
export function IlMioVibraCalcolatriceMockup() {
  const keys = ['C','%', '÷','×', '7','8','9','−', '4','5','6','+', '1','2','3','='];
  return (
    <Frame url="Il Mio Vibra · Calcolatrice" tall>
      <Div className="flex items-center justify-between mb-1">
        <Span className="text-sm font-bold text-foreground">Il Mio Vibra</Span>
        <Trophy className="w-4 h-4 text-primary" />
      </Div>
      <Div className="flex justify-end mb-2">
        <Div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-primary/30 bg-primary/10 text-primary text-[9px] font-semibold"><Calculator className="w-3 h-3" />Calcolatrice</Div>
      </Div>
      {/* Pannello calcolatrice flottante */}
      <Div className="relative rounded-xl bg-card border border-border overflow-hidden">
        <Callout n={1} className="-top-1 left-3" />
        <Div className="px-2 py-1.5 border-b border-border bg-secondary/30 flex items-center justify-between">
          <Span className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">Calcolatrice</Span>
          <X className="w-3 h-3 text-muted-foreground" />
        </Div>
        <Div className="bg-secondary/50 px-3 py-2 text-right">
          <Div className="text-[16px] font-bold text-primary">0</Div>
        </Div>
        <Div className="p-2 grid grid-cols-4 gap-1">
          {keys.map((k, i) => (
            <Div key={i} className={
              k === '=' ? 'py-1.5 rounded-md text-center text-[10px] font-bold bg-green-500/20 text-green-400 flex items-center justify-center'
              : ['÷','×','−','+'].includes(k) ? 'py-1.5 rounded-md text-center text-[10px] font-medium bg-primary/20 text-primary flex items-center justify-center'
              : k === 'C' ? 'py-1.5 rounded-md text-center text-[10px] font-medium bg-destructive/20 text-destructive flex items-center justify-center'
              : 'py-1.5 rounded-md text-center text-[10px] font-medium bg-secondary flex items-center justify-center'
            }>{k}</Div>
          ))}
        </Div>
      </Div>
      <Div className="relative mt-2 flex items-start gap-1.5 rounded-lg bg-amber-500/5 border border-amber-500/15 px-2 py-1.5">
        <Callout n={2} className="-top-1 -left-1" />
        <Span className="text-[8px] text-amber-300/90 leading-relaxed">Una volta aperta, la calcolatrice resta attiva come finestra flottante finché non la chiudi tu. Puoi trascinarla e ridimensionarla.</Span>
      </Div>
    </Frame>
  );
}

// ── IL MIO VIBRA · MATERIALE LOCALI ───────────────────────────
export function IlMioVibraMaterialeLocaliMockup() {
  return (
    <Frame url="Il Mio Vibra · Materiale Locali" tall>
      <Div className="flex items-center justify-between mb-1">
        <Span className="text-sm font-bold text-foreground">Il Mio Vibra</Span>
        <Trophy className="w-4 h-4 text-primary" />
      </Div>
      <Div className="flex items-center gap-1.5 mb-2"><MapIcon className="w-3.5 h-3.5 text-emerald-400" /><Span className="text-[10px] font-bold text-foreground">Materiale Locali</Span></Div>
      {/* Riga collassata */}
      <Div className="relative rounded-lg bg-card border border-border mb-1.5">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex items-center justify-between px-2 py-2">
          <Span className="text-[10px] font-medium text-foreground">Mantra</Span>
          <Div className="flex items-center gap-1.5">
            <MapIcon className="w-3 h-3 text-emerald-400" />
            <Wine className="w-3 h-3 text-purple-400" />
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </Div>
        </Div>
      </Div>
      {/* Riga espansa */}
      <Div className="relative rounded-lg bg-card border border-border">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="flex items-center justify-between px-2 py-2 border-b border-border">
          <Span className="text-[10px] font-medium text-foreground">Ammare Frontemare</Span>
          <Div className="flex items-center gap-1.5">
            <MapIcon className="w-3 h-3 text-emerald-400" />
            <Wine className="w-3 h-3 text-purple-400" />
            <FileText className="w-3 h-3 text-orange-400" />
            <ChevronDown className="w-3 h-3 text-muted-foreground rotate-180" />
          </Div>
        </Div>
        <Div className="px-2 py-2 space-y-2">
          <Div>
            <Div className="flex items-center justify-between mb-1">
              <Span className="text-[9px] font-semibold text-emerald-400 flex items-center gap-1"><MapIcon className="w-2.5 h-2.5" /> Piantina</Span>
              <Span className="text-[9px] text-primary">Espandi</Span>
            </Div>
            <Div className="h-16 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-border flex items-center justify-center text-[8px] text-muted-foreground">🖼️ piantina tavoli</Div>
          </Div>
          <Div className="grid grid-cols-2 gap-1.5">
            <Div className="rounded-lg bg-secondary/30 p-1.5">
              <Div className="text-[8px] font-semibold text-purple-400 flex items-center gap-1 mb-1"><Wine className="w-2.5 h-2.5" /> Listino</Div>
              <Div className="text-[7px] text-muted-foreground leading-relaxed">Bottiglia €200{'\n'}Magnum €400{'\n'}Cocktail €25</Div>
            </Div>
            <Div className="rounded-lg bg-secondary/30 p-1.5">
              <Div className="text-[8px] font-semibold text-orange-400 flex items-center gap-1 mb-1"><FileText className="w-2.5 h-2.5" /> Formule</Div>
              <Div className="text-[7px] text-muted-foreground leading-relaxed">Min consumo €300{'\n'}Tavolo front +€100</Div>
            </Div>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}