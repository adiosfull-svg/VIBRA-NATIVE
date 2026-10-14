// Port di src/components/academy/ScreenMockups.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import {
  Search, Plus, Bell, Star, TrendingUp, TrendingDown, Calendar, MapPin,
  Instagram, MessageCircle, ChevronRight, Sparkles, Crown, Table2,
  Send, Users, BookOpen, LayoutGrid, Settings, Trophy, FileBarChart,
  ShieldCheck, BrainCircuit, Download, Calculator, Award, Zap, ArrowUpRight
} from '@/ui/icons.generated';
import { Callout, Frame } from './mockups/shared';

// Re-export per retrocompatibilità
export { Callout, Frame };

// ── DASHBOARD ──────────────────────────────────────────────
function DashboardMockup() {
  const bars = [40,65,50,90,55,35,70,80,45,60,75,50,85];
  return (
    <Frame url="Dashboard" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Dashboard</Span>
        <Span className="text-[10px] text-muted-foreground">Lug 2026</Span>
      </Div>
      {/* KPI cards */}
      <Div className="relative grid grid-cols-3 gap-1.5 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center">
          <Div className="text-[7px] text-muted-foreground uppercase mb-0.5">Fatturato</Div>
          <Div className="text-[11px] font-bold text-primary">€142.300</Div>
        </Div>
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center">
          <Div className="text-[7px] text-muted-foreground uppercase mb-0.5">Attivi</Div>
          <Div className="text-[11px] font-bold text-green-400 flex items-center justify-center gap-0.5">12 <ArrowUpRight className="w-2.5 h-2.5" /></Div>
        </Div>
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center">
          <Div className="text-[7px] text-muted-foreground uppercase mb-0.5">Clienti</Div>
          <Div className="text-[11px] font-bold text-foreground">847</Div>
        </Div>
      </Div>
      {/* Month picker + chart */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2">
        <Callout n={2} className="-top-1 left-3" />
        <Div className="flex items-center justify-between mb-1.5">
          <Span className="text-[10px] font-semibold text-foreground">Fatturato · Lug 2026</Span>
          <Div className="h-3 w-3 rounded border border-border bg-secondary/40" />
        </Div>
        <Callout n={3} className="bottom-1 -right-1" />
        <Div className="flex items-end gap-1 h-12">
          {bars.map((h,i) => <Div key={i} className="flex-1 bg-primary/50 rounded-t" style={{height: h + '%'}} />)}
        </Div>
      </Div>
      {/* Top promoters */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2">
        <Callout n={4} className="-top-1 left-3" />
        <Div className="text-[10px] font-semibold text-foreground mb-1.5">Top Promoters</Div>
        <Div className="space-y-1.5">
          <Div className="flex items-center gap-1.5"><Div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400/60 to-purple-400/20" /><Span className="text-[9px] text-foreground/80 flex-1">Marco Rossi</Span><Span className="text-[9px] font-bold text-green-400">€28.400</Span></Div>
          <Div className="flex items-center gap-1.5"><Div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400/60 to-amber-400/20" /><Span className="text-[9px] text-foreground/80 flex-1">Giulia D'Amato</Span><Span className="text-[9px] font-bold text-green-400">€22.100</Span></Div>
          <Div className="flex items-center gap-1.5"><Div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400/60 to-blue-400/20" /><Span className="text-[9px] text-foreground/80 flex-1">Antonio M.</Span><Span className="text-[9px] font-bold text-green-400">€19.800</Span></Div>
        </Div>
      </Div>
      {/* Top clienti */}
      <Div className="relative rounded-lg bg-card border border-border p-2">
        <Callout n={5} className="-top-1 left-3" />
        <Div className="text-[10px] font-semibold text-foreground mb-1.5">Top Clienti</Div>
        <Div className="space-y-1.5">
          <Div className="flex items-center gap-1.5"><Div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400/60 to-amber-400/20" /><Span className="text-[9px] text-foreground/80 flex-1">L. Esposito</Span><Span className="text-[9px] font-bold text-amber-400">€4.820</Span></Div>
          <Div className="flex items-center gap-1.5"><Div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-400/60 to-pink-400/20" /><Span className="text-[9px] text-foreground/80 flex-1">G. Russo</Span><Span className="text-[9px] font-bold text-amber-400">€3.950</Span></Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── PROMOTER ───────────────────────────────────────────────
function PromoterMockup() {
  return (
    <Frame url="Promoter" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Promoter</Span>
        <Div className="relative">
          <Callout n={1} className="-top-2 -right-2" />
          <Btn
            button
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-semibold"><Plus className="w-3 h-3" />Aggiungi</Btn>
        </Div>
      </Div>
      {/* Tab bar */}
      <Div className="flex gap-0.5 bg-secondary/30 p-0.5 rounded-lg mb-2 overflow-x-auto no-scrollbar">
        <Div className="py-1 px-2 rounded-md shrink-0 bg-card text-[8px] font-semibold">Team</Div>
        <Div className="py-1 px-2 rounded-md shrink-0 text-muted-foreground text-[8px]">Confronta</Div>
        <Div className="py-1 px-2 rounded-md shrink-0 text-muted-foreground text-[8px]">Growth</Div>
        <Div className="py-1 px-2 rounded-md shrink-0 text-muted-foreground text-[8px]">Ex-PR</Div>
        <Div className="py-1 px-2 rounded-md shrink-0 text-muted-foreground text-[8px]">Obiettivi</Div>
        <Div className="py-1 px-2 rounded-md shrink-0 text-muted-foreground text-[8px]">Mappa</Div>
      </Div>
      {/* Search */}
      <Div className="relative flex items-center gap-1.5 rounded-lg bg-card border border-border px-2 py-1.5 mb-2">
        <Search className="w-3 h-3 text-muted-foreground" />
        <Span className="text-[10px] text-muted-foreground">Cerca promoter...</Span>
      </Div>
      {/* Promoter cards */}
      <Div className="space-y-1.5 mb-2">
        <Div className="relative flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Callout n={2} className="-top-1 -left-1" />
          <Div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/60 to-purple-400/20 shrink-0 flex items-center justify-center text-[8px] font-bold text-foreground">MR</Div>
          <Div className="flex-1 min-w-0">
            <Div className="text-[10px] font-semibold text-foreground truncate">Marco Rossi</Div>
            <Div className="text-[8px] text-muted-foreground">PR · Posillipo · Attivo</Div>
            <Div className="flex gap-1 mt-1"><MessageCircle className="w-3 h-3 text-green-400" /><Instagram className="w-3 h-3 text-pink-400" /></Div>
          </Div>
          <Div className="text-right shrink-0"><Div className="text-[9px] font-bold text-primary">€28.4K</Div><Div className="text-[7px] text-muted-foreground">96 tav.</Div></Div>
        </Div>
        <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400/60 to-amber-400/20 shrink-0 flex items-center justify-center text-[8px] font-bold text-foreground">GD</Div>
          <Div className="flex-1 min-w-0">
            <Div className="text-[10px] font-semibold text-foreground truncate">Giulia D'Amato</Div>
            <Div className="text-[8px] text-muted-foreground">Capogruppo · Vomero · Attivo</Div>
          </Div>
          <Div className="text-right shrink-0"><Div className="text-[9px] font-bold text-primary">€22.1K</Div><Div className="text-[7px] text-muted-foreground">74 tav.</Div></Div>
        </Div>
      </Div>
      {/* Context menu (long-press) */}
      <Div className="relative rounded-lg bg-card border border-primary/40 p-2 shadow-xl mb-2">
        <Callout n={3} className="-top-1 -right-1" />
        <Div className="text-[8px] font-semibold text-primary mb-1.5">Menu rapido</Div>
        <Div className="space-y-1.5">
          <Div className="flex items-center gap-1.5 text-[9px] text-foreground/80"><MessageCircle className="w-3 h-3 text-green-400" />WhatsApp</Div>
          <Div className="flex items-center gap-1.5 text-[9px] text-foreground/80"><Instagram className="w-3 h-3 text-pink-400" />@marco_rossi</Div>
          <Div className="flex items-center gap-1.5 text-[9px] text-foreground/80"><MapPin className="w-3 h-3 text-blue-400" />Posillipo, Napoli</Div>
        </Div>
      </Div>
      {/* Stats cumulative */}
      <Div className="relative rounded-lg bg-card border border-border p-2">
        <Callout n={4} className="-top-1 left-3" />
        <Div className="text-[8px] font-semibold text-muted-foreground mb-1.5">Statistiche cumulative</Div>
        <Div className="grid grid-cols-3 gap-1 text-center">
          <Div><Div className="text-[11px] font-bold text-primary">€42.300</Div><Div className="text-[7px] text-muted-foreground">Fatturato</Div></Div>
          <Div><Div className="text-[11px] font-bold text-green-400">124</Div><Div className="text-[7px] text-muted-foreground">Tavoli</Div></Div>
          <Div><Div className="text-[11px] font-bold text-amber-400">86</Div><Div className="text-[7px] text-muted-foreground">Clienti</Div></Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── CLIENTI LIST ────────────────────────────────────────────
function ClientiListMockup() {
  return (
    <Frame url="Clienti" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Clienti</Span>
        <Div className="relative">
          <Callout n={5} className="-top-2 -right-2" />
          <Btn
            button
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-semibold"><Plus className="w-3 h-3" /></Btn>
        </Div>
      </Div>
      {/* Search */}
      <Div className="relative mb-2">
        <Callout n={1} className="-top-1.5 -left-1.5" />
        <Div className="flex items-center gap-1.5 rounded-lg bg-card border border-border px-2 py-1.5">
          <Search className="w-3 h-3 text-muted-foreground" />
          <Span className="text-[10px] text-muted-foreground">Cerca cliente...</Span>
        </Div>
      </Div>
      {/* Sort pills */}
      <Div className="relative flex gap-1 mb-2">
        <Callout n={2} className="-top-1.5 -left-1.5" />
        <Div className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[9px] font-semibold border border-primary/30">Punteggio</Div>
        <Div className="px-2 py-0.5 rounded-full bg-secondary/40 text-muted-foreground text-[9px]">Presenze</Div>
        <Div className="px-2 py-0.5 rounded-full bg-secondary/40 text-muted-foreground text-[9px]">Spesa</Div>
      </Div>
      {/* Tabs */}
      <Div className="relative flex gap-1 bg-secondary/30 p-0.5 rounded-lg mb-2">
        <Callout n={3} className="-top-1 -left-1" />
        <Div className="flex-1 text-center py-1 rounded-md bg-card text-[9px] font-semibold">Lista</Div>
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]">Tabelle</Div>
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]">Mappa</Div>
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]">Gruppi</Div>
      </Div>
      {/* Client cards */}
      <Div className="space-y-1.5">
        <Div className="relative flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Callout n={4} className="-top-1 -left-1" />
          <Div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400/60 to-purple-400/20 shrink-0 flex items-center justify-center text-[8px] font-bold">LE</Div>
          <Div className="flex-1 min-w-0">
            <Div className="text-[10px] font-semibold text-foreground truncate">Luca Esposito</Div>
            <Div className="flex gap-1 mt-0.5"><Span className="text-[8px] text-green-400">24 pres.</Span><Span className="text-[8px] text-amber-400">€201 med.</Span></Div>
          </Div>
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <Span className="text-[10px] font-bold text-amber-400">8.5</Span>
        </Div>
        <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400/60 to-pink-400/20 shrink-0 flex items-center justify-center text-[8px] font-bold">GR</Div>
          <Div className="flex-1 min-w-0">
            <Div className="text-[10px] font-semibold text-foreground truncate">Giorgia Russo</Div>
            <Div className="flex gap-1 mt-0.5"><Span className="text-[8px] text-green-400">18 pres.</Span><Span className="text-[8px] text-amber-400">€165 med.</Span></Div>
          </Div>
          <Span className="text-[10px] font-bold text-muted-foreground">6.2</Span>
        </Div>
        <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400/60 to-amber-400/20 shrink-0 flex items-center justify-center text-[8px] font-bold">MF</Div>
          <Div className="flex-1 min-w-0">
            <Div className="text-[10px] font-semibold text-foreground truncate">Marco Ferrara</Div>
            <Div className="flex gap-1 mt-0.5"><Span className="text-[8px] text-green-400">31 pres.</Span><Span className="text-[8px] text-amber-400">€178 med.</Span></Div>
          </Div>
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <Span className="text-[10px] font-bold text-amber-400">7.8</Span>
        </Div>
      </Div>
    </Frame>
  );
}

// ── CLIENTI DETAIL ──────────────────────────────────────────
function ClientiDetailMockup() {
  const bars = [30,45,40,60,55,75,50,65,80,70,85,95];
  return (
    <Frame url="Scheda Cliente" tall>
      {/* Header */}
      <Div className="relative flex items-center gap-2 mb-2 pb-2 border-b border-border">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400/60 to-purple-400/20 flex items-center justify-center text-[10px] font-bold">LE</Div>
        <Div className="flex-1 min-w-0"><Span className="text-[11px] font-bold text-foreground">Luca Esposito</Span></Div>
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <Div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold"><Sparkles className="w-3 h-3" />8.5</Div>
        <Div className="flex items-center text-green-400"><TrendingUp className="w-3 h-3" /></Div>
      </Div>
      {/* Modifica rapida contatti */}
      <Div className="relative flex flex-wrap gap-1 mb-2">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="px-1.5 py-0.5 rounded border border-border bg-secondary/40 text-[8px] text-muted-foreground flex items-center gap-0.5"><MessageCircle className="w-2.5 h-2.5" />333 1234567</Div>
        <Div className="px-1.5 py-0.5 rounded border border-border bg-secondary/40 text-[8px] text-muted-foreground flex items-center gap-0.5"><Instagram className="w-2.5 h-2.5" />@luca.esp</Div>
        <Div className="px-1.5 py-0.5 rounded border border-border bg-secondary/40 text-[8px] text-muted-foreground flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />Vomero</Div>
        <Div className="px-1.5 py-0.5 rounded border border-blue-500/40 bg-blue-500/10 text-[8px] text-blue-300">🚗 Guidatore</Div>
      </Div>
      {/* Badge */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2">
        <Callout n={3} className="-top-1 left-3" />
        <Div className="text-[9px] font-semibold text-muted-foreground mb-1">Riconoscimenti</Div>
        <Div className="flex gap-1 flex-wrap">
          <Div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-[8px]">🏅 Fedeltà</Div>
          <Div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-[8px]">💰 Rendita</Div>
          <Div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-[8px]">💎 Spender</Div>
        </Div>
      </Div>
      {/* KPI */}
      <Div className="relative grid grid-cols-3 gap-1.5 mb-2">
        <Callout n={4} className="-top-1 -left-1" />
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center"><Div className="text-[12px] font-bold text-green-400">24</Div><Div className="text-[7px] text-muted-foreground">Presenze</Div></Div>
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center"><Div className="text-[12px] font-bold text-primary">€4.820</Div><Div className="text-[7px] text-muted-foreground">Spesa tot.</Div></Div>
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center"><Div className="text-[12px] font-bold text-foreground">€201</Div><Div className="text-[7px] text-muted-foreground">Media</Div></Div>
      </Div>
      {/* Chart */}
      <Div className="relative rounded-lg bg-card border border-border p-2">
        <Callout n={5} className="-top-1 right-3" />
        <Div className="text-[9px] font-semibold text-muted-foreground mb-1">Andamento Spesa (12 mesi)</Div>
        <Div className="flex items-end gap-0.5 h-10">
          {bars.map((h,i) => <Div key={i} className="flex-1 bg-primary/40 rounded-t" style={{height: h + '%'}} />)}
        </Div>
      </Div>
    </Frame>
  );
}

// ── WEEKEND / PROGRAMMAZIONE ────────────────────────────────
// Ordine: Tab → Prospetto → Semina → Suggerimenti → Da Ricontattare
function WeekendMockup() {
  return (
    <Frame url="Weekend" tall>
      <Span className="text-sm font-bold text-foreground">Weekend</Span>
      {/* Tab bar */}
      <Div className="relative flex gap-1 bg-secondary/30 p-0.5 rounded-lg my-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-card text-[9px] font-semibold"><Calendar className="w-3 h-3" />Inviti</Div>
        <Div className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md text-muted-foreground text-[9px]"><Crown className="w-3 h-3" />Leader</Div>
        <Div className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md text-muted-foreground text-[9px]"><Table2 className="w-3 h-3" />Tab.</Div>
        <Div className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md text-muted-foreground text-[9px]"><Trophy className="w-3 h-3" />Growth</Div>
      </Div>
      {/* Prospetto inviti */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2">
        <Callout n={2} className="-top-1 left-3" />
        <Div className="text-[10px] font-semibold text-foreground mb-1.5">Prospetto Inviti</Div>
        <Div className="space-y-1.5">
          <Div className="flex items-center gap-1.5">
            <Span className="text-[8px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">Ven 18 Lug</Span>
            <Span className="text-[8px] text-muted-foreground">Ammare</Span>
          </Div>
          <Div className="flex items-center gap-1.5 pl-2"><Div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400/60 to-purple-400/20" /><Span className="text-[8px] text-foreground/80 flex-1">L. Esposito</Span><Span className="text-[7px] text-muted-foreground">VIP, tavolo front</Span></Div>
          <Div className="flex items-center gap-1.5 pl-2"><Div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-400/60 to-pink-400/20" /><Span className="text-[8px] text-foreground/80 flex-1">G. Russo</Span></Div>
          <Div className="flex items-center gap-1.5">
            <Span className="text-[8px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">Sab 19 Lug</Span>
            <Span className="text-[8px] text-muted-foreground">Borgo Antico</Span>
          </Div>
          <Div className="flex items-center gap-1.5 pl-2"><Div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400/60 to-amber-400/20" /><Span className="text-[8px] text-foreground/80 flex-1">M. Ferrara</Span></Div>
        </Div>
      </Div>
      {/* Semina Instagram */}
      <Div className="relative rounded-lg border border-pink-500/20 bg-card p-2 mb-2">
        <Callout n={3} className="-top-1 left-3" />
        <Div className="flex items-center justify-between mb-1">
          <Div className="flex items-center gap-1"><Instagram className="w-3 h-3 text-pink-400" /><Span className="text-[10px] font-semibold text-foreground">Semina Instagram</Span></Div>
          <Span className="text-[8px] text-muted-foreground bg-secondary/40 px-1.5 py-0.5 rounded-full">3</Span>
        </Div>
        <Div className="flex gap-1.5 overflow-hidden">
          <Div className="shrink-0 w-14 rounded-lg bg-secondary/40 p-1.5"><Div className="w-5 h-5 rounded-full bg-pink-400/30 mb-1" /><Div className="text-[7px] font-semibold text-foreground truncate">@giulia_92</Div><Div className="text-[6px] text-muted-foreground">2 giorni fa</Div></Div>
          <Div className="shrink-0 w-14 rounded-lg bg-secondary/40 p-1.5"><Div className="w-5 h-5 rounded-full bg-pink-400/30 mb-1" /><Div className="text-[7px] font-semibold text-foreground truncate">@marco.nap</Div><Div className="text-[6px] text-muted-foreground">5 giorni fa</Div></Div>
          <Div className="shrink-0 w-14 rounded-lg bg-secondary/40 p-1.5"><Div className="w-5 h-5 rounded-full bg-pink-400/30 mb-1" /><Div className="text-[7px] font-semibold text-foreground truncate">@lucia_v</Div><Div className="text-[6px] text-muted-foreground">1 sett.</Div></Div>
        </Div>
      </Div>
      {/* Suggerimenti settimanali */}
      <Div className="relative rounded-lg bg-card border border-primary/20 p-2 mb-2">
        <Callout n={4} className="-top-1 left-3" />
        <Div className="flex items-center gap-1 mb-1.5"><Sparkles className="w-3 h-3 text-primary" /><Span className="text-[10px] font-semibold text-foreground">Suggerimenti Weekend</Span></Div>
        <Div className="flex gap-1.5 overflow-hidden">
          <Div className="shrink-0 w-16 rounded-lg bg-secondary/40 p-1.5">
            <Div className="flex items-center gap-1 mb-0.5"><Div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400/60 to-purple-400/20" /><Span className="text-[7px] font-semibold text-foreground truncate">L. Esposito</Span></Div>
            <Span className="text-[6px] text-green-400 bg-green-400/10 px-1 rounded">Top</Span>
          </Div>
          <Div className="shrink-0 w-16 rounded-lg bg-secondary/40 p-1.5">
            <Div className="flex items-center gap-1 mb-0.5"><Div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400/60 to-amber-400/20" /><Span className="text-[7px] font-semibold text-foreground truncate">M. Ferrara</Span></Div>
            <Span className="text-[6px] text-blue-400 bg-blue-400/10 px-1 rounded">Da tempo</Span>
          </Div>
          <Div className="shrink-0 w-16 rounded-lg bg-secondary/40 p-1.5">
            <Div className="flex items-center gap-1 mb-0.5"><Div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-400/60 to-pink-400/20" /><Span className="text-[7px] font-semibold text-foreground truncate">G. Russo</Span></Div>
            <Span className="text-[6px] text-amber-400 bg-amber-400/10 px-1 rounded">Ricont.</Span>
          </Div>
        </Div>
      </Div>
      {/* Da Ricontattare */}
      <Div className="relative rounded-lg bg-card border border-border p-2">
        <Callout n={5} className="-top-1 left-3" />
        <Div className="text-[10px] font-semibold text-foreground mb-1">Da Ricontattare</Div>
        <Div className="flex items-center gap-1.5"><Div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400/40 to-red-400/10" /><Span className="text-[8px] text-foreground/80 flex-1">A. Rizzo</Span><Span className="text-[7px] text-muted-foreground">60 giorni</Span></Div>
      </Div>
    </Frame>
  );
}

// ── SERATE ──────────────────────────────────────────────────
function SerateMockup() {
  return (
    <Frame url="Serate">
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Serate</Span>
        <Div className="flex gap-1">
          <Div className="relative"><Callout n={2} className="-top-2 -right-2" /><Btn
            button
            className="px-2 py-1 rounded-lg bg-secondary/60 text-[9px] font-semibold border border-border">Batch</Btn></Div>
          <Div className="relative"><Callout n={1} className="-top-2 -right-2" /><Btn
            button
            className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[9px] font-semibold"><Plus className="w-2.5 h-2.5" />Nuova</Btn></Div>
        </Div>
      </Div>
      {/* Event cards */}
      <Div className="space-y-1.5">
        <Div className="relative rounded-lg bg-card border border-border p-2">
          <Callout n={3} className="-top-1 -left-1" />
          <Callout n={4} className="-top-1 -right-1" />
          <Div className="flex items-center gap-2">
            <Div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400/30 to-blue-400/5 shrink-0 flex items-center justify-center"><Calendar className="w-3.5 h-3.5 text-blue-400" /></Div>
            <Div className="flex-1 min-w-0">
              <Div className="text-[10px] font-semibold text-foreground truncate">Ammare Frontemare</Div>
              <Div className="text-[8px] text-muted-foreground">Ven 18 Lug · €3.200</Div>
            </Div>
            <Span className="text-[8px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">8 tavoli</Span>
          </Div>
        </Div>
        <Div className="rounded-lg bg-card border border-border p-2">
          <Div className="flex items-center gap-2">
            <Div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400/30 to-amber-400/5 shrink-0 flex items-center justify-center"><Calendar className="w-3.5 h-3.5 text-amber-400" /></Div>
            <Div className="flex-1 min-w-0">
              <Div className="text-[10px] font-semibold text-foreground truncate">Borgo Antico</Div>
              <Div className="text-[8px] text-muted-foreground">Sab 19 Lug · €5.600</Div>
            </Div>
            <Span className="text-[8px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">14 tavoli</Span>
          </Div>
        </Div>
        <Div className="rounded-lg bg-card border border-border p-2">
          <Div className="flex items-center gap-2">
            <Div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-400/30 to-purple-400/5 shrink-0 flex items-center justify-center"><Calendar className="w-3.5 h-3.5 text-purple-400" /></Div>
            <Div className="flex-1 min-w-0">
              <Div className="text-[10px] font-semibold text-foreground truncate">Vibe Club</Div>
              <Div className="text-[8px] text-muted-foreground">Dom 20 Lug · €2.100</Div>
            </Div>
            <Span className="text-[8px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">5 tavoli</Span>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── LOCALI ──────────────────────────────────────────────────
function LocaliMockup() {
  const bars = [50,70,45,80,60,90,55];
  return (
    <Frame url="Locali">
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Locali</Span>
        <Div className="relative"><Callout n={1} className="-top-2 -right-2" /><Btn
          button
          className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[9px] font-semibold"><Plus className="w-2.5 h-2.5" />Aggiungi</Btn></Div>
      </Div>
      <Div className="grid grid-cols-2 gap-1.5 mb-2">
        <Div className="relative rounded-lg bg-card border border-border p-2">
          <Callout n={2} className="-top-1 -left-1" />
          <Div className="h-10 rounded-lg bg-gradient-to-br from-blue-400/25 to-blue-400/5 mb-1.5 flex items-center justify-center"><Span className="text-[8px] font-bold text-blue-400/60">AMMARE</Span></Div>
          <Div className="text-[10px] font-semibold text-foreground">Ammare</Div>
          <Div className="text-[8px] text-muted-foreground">Ven · soglia 300€</Div>
          <Div className="flex gap-1 mt-1"><Span className="text-[7px] text-green-400">€38.200</Span><Span className="text-[7px] text-muted-foreground">· 96 tavoli</Span></Div>
        </Div>
        <Div className="rounded-lg bg-card border border-border p-2">
          <Div className="h-10 rounded-lg bg-gradient-to-br from-amber-400/25 to-amber-400/5 mb-1.5 flex items-center justify-center"><Span className="text-[8px] font-bold text-amber-400/60">BORGO</Span></Div>
          <Div className="text-[10px] font-semibold text-foreground">Borgo Antico</Div>
          <Div className="text-[8px] text-muted-foreground">Sab · soglia 360€</Div>
          <Div className="flex gap-1 mt-1"><Span className="text-[7px] text-green-400">€52.400</Span><Span className="text-[7px] text-muted-foreground">· 142 tav.</Span></Div>
        </Div>
      </Div>
      <Div className="relative rounded-lg bg-card border border-border p-2">
        <Callout n={3} className="-top-1 left-3" />
        <Div className="text-[9px] font-semibold text-muted-foreground mb-1">Fatturato mensile · Ammare</Div>
        <Div className="flex items-end gap-1 h-10">
          {bars.map((h,i) => <Div key={i} className="flex-1 bg-blue-400/40 rounded-t" style={{height: h + '%'}} />)}
        </Div>
        <Div className="flex justify-between text-[7px] text-muted-foreground mt-0.5"><Span>Gen</Span><Span>Feb</Span><Span>Mar</Span><Span>Apr</Span><Span>Mag</Span><Span>Giu</Span><Span>Lug</Span></Div>
      </Div>
    </Frame>
  );
}

// ── IL MIO VIBRA ───────────────────────────────────────────
function IlMioVibraMockup() {
  return (
    <Frame url="Il Mio Vibra" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Il Mio Vibra</Span>
        <Div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center"><Trophy className="w-4 h-4 text-primary" /></Div>
      </Div>
      {/* Tab bar */}
      <Div className="relative flex gap-0.5 bg-secondary/30 p-0.5 rounded-lg mb-2 overflow-x-auto no-scrollbar">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex items-center justify-center gap-0.5 py-1 px-1.5 rounded-md bg-card text-[8px] font-semibold shrink-0"><Trophy className="w-2.5 h-2.5" />Guadagni</Div>
        <Div className="flex items-center justify-center py-1 px-1.5 rounded-md text-muted-foreground text-[8px] shrink-0">Progressi</Div>
        <Div className="flex items-center justify-center py-1 px-1.5 rounded-md text-muted-foreground text-[8px] shrink-0">Team</Div>
        <Div className="flex items-center justify-center py-1 px-1.5 rounded-md text-muted-foreground text-[8px] shrink-0">Note</Div>
        <Div className="flex items-center justify-center gap-0.5 py-1 px-1.5 rounded-md text-muted-foreground text-[8px] shrink-0"><Award className="w-2.5 h-2.5" />Ach.</Div>
        <Div className="flex items-center justify-center py-1 px-1.5 rounded-md text-muted-foreground text-[8px] shrink-0">VS</Div>
      </Div>
      {/* Total guadagni card */}
      <Div className="relative rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-2 mb-2">
        <Callout n={2} className="-top-1 left-3" />
        <Div className="text-[9px] text-muted-foreground mb-0.5">Guadagni totali</Div>
        <Div className="text-[16px] font-bold text-primary">€18.450</Div>
        <Div className="text-[8px] text-green-400 flex items-center gap-0.5 mt-0.5"><TrendingUp className="w-2.5 h-2.5" />+12% vs mese scorso</Div>
      </Div>
      {/* Detail serata */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2">
        <Callout n={3} className="-top-1 left-3" />
        <Div className="text-[9px] font-semibold text-muted-foreground mb-1.5">Dettaglio serate</Div>
        <Div className="space-y-1.5">
          <Div className="flex items-center gap-1.5 text-[8px]"><Div className="w-3 h-3 rounded bg-blue-400/30" /><Span className="text-foreground/80 flex-1">Ammare · 18 Lug</Span><Span className="text-muted-foreground">15%</Span><Span className="font-bold text-green-400">€480</Span></Div>
          <Div className="flex items-center gap-1.5 text-[8px]"><Div className="w-3 h-3 rounded bg-amber-400/30" /><Span className="text-foreground/80 flex-1">Borgo · 19 Lug</Span><Span className="text-muted-foreground">12%</Span><Span className="font-bold text-green-400">€672</Span></Div>
          <Div className="flex items-center gap-1.5 text-[8px]"><Div className="w-3 h-3 rounded bg-purple-400/30" /><Span className="text-foreground/80 flex-1">Vibe · 20 Lug</Span><Span className="text-muted-foreground">10%</Span><Span className="font-bold text-green-400">€210</Span></Div>
        </Div>
      </Div>
      {/* Calcolatrice */}
      <Div className="relative rounded-lg bg-card border border-border p-2">
        <Callout n={4} className="-top-1 left-3" />
        <Div className="flex items-center gap-1 mb-1"><Calculator className="w-3 h-3 text-primary" /><Span className="text-[9px] font-semibold text-foreground">Calcolatrice</Span></Div>
        <Div className="flex items-center gap-1.5 text-[8px]"><Span className="text-muted-foreground">Fatturato:</Span><Span className="font-bold text-foreground">€5.000</Span><Span className="text-muted-foreground ml-2">→</Span><Span className="font-bold text-green-400">€600</Span></Div>
      </Div>
    </Frame>
  );
}

// ── VIBRA GPT ──────────────────────────────────────────────
function VibraGPTMockup() {
  return (
    <Frame url="Vibra GPT" tall>
      <Div className="flex items-center justify-between mb-2">
        <Div className="flex items-center gap-1.5">
          <Div className="relative w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
            <Callout n={4} className="-top-1 -left-1" />
            <BrainCircuit className="w-4 h-4 text-primary" />
          </Div>
          <Span className="text-[11px] font-bold text-foreground">Vibra GPT</Span>
        </Div>
        <Div className="relative">
          <Callout n={1} className="-top-2 -right-2" />
          <Div className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg bg-secondary/40 border border-border text-[8px]"><Zap className="w-2.5 h-2.5 text-primary" />Standard</Div>
        </Div>
      </Div>
      {/* User message */}
      <Div className="flex justify-end mb-2">
        <Div className="rounded-2xl rounded-tr-sm bg-primary text-primary-foreground p-2 max-w-[80%]">
          <Span className="text-[9px] leading-relaxed">Chi sono i miei clienti in calo?</Span>
        </Div>
      </Div>
      {/* AI message */}
      <Div className="relative mb-2">
        <Callout n={3} className="-top-1 -left-1" />
        <Div className="rounded-2xl rounded-tl-sm bg-card border border-border p-2 ml-5">
          <Div className="text-[9px] text-foreground/80 leading-relaxed">
            Ho trovato <Span className="font-bold text-red-400">3 clienti in calo</Span> negli ultimi 30 giorni:
          </Div>
          <Div className="mt-1.5 space-y-1 text-[8px] text-foreground/70">
            <Div className="flex items-center gap-1"><TrendingDown className="w-2.5 h-2.5 text-red-400" />Marco Ferrara <Span className="text-red-400">-42%</Span></Div>
            <Div className="flex items-center gap-1"><TrendingDown className="w-2.5 h-2.5 text-red-400" />Lucia Bianchi <Span className="text-red-400">-35%</Span></Div>
            <Div className="flex items-center gap-1"><TrendingDown className="w-2.5 h-2.5 text-red-400" />Antonio Rizzo <Span className="text-red-400">-28%</Span></Div>
          </Div>
        </Div>
      </Div>
      {/* Input */}
      <Div className="absolute bottom-3 left-3 right-3">
        <Div className="relative flex items-center gap-1.5 rounded-xl bg-card border border-border px-2 py-1.5">
          <Callout n={2} className="-top-2 -left-1" />
          <Span className="text-[9px] text-muted-foreground flex-1">Scrivi una domanda...</Span>
          <Div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center"><Send className="w-3 h-3 text-primary-foreground" /></Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── NOTIFICHE ──────────────────────────────────────────────
function NotificheMockup() {
  return (
    <Frame url="Notifiche">
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Notifiche</Span>
        <Div className="relative">
          <Callout n={1} className="-top-2 -right-2" />
          <Div className="relative">
            <Bell className="w-4 h-4 text-foreground/60" />
            <Div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 text-[7px] text-white flex items-center justify-center font-bold">3</Div>
          </Div>
        </Div>
      </Div>
      {/* Notifications list */}
      <Div className="space-y-1.5">
        <Div className="relative flex items-start gap-1.5 rounded-lg bg-card border border-border p-2">
          <Callout n={2} className="-top-1 -left-1" />
          <Div className="w-5 h-5 rounded-full bg-amber-400/20 shrink-0 flex items-center justify-center"><Trophy className="w-3 h-3 text-amber-400" /></Div>
          <Div className="flex-1 min-w-0"><Div className="text-[9px] font-semibold text-foreground truncate">🏆 Top 10 Clienti sbloccato</Div><Div className="text-[8px] text-muted-foreground">2 ore fa</Div></Div>
        </Div>
        <Div className="flex items-start gap-1.5 rounded-lg bg-card border border-border p-2">
          <Div className="w-5 h-5 rounded-full bg-green-400/20 shrink-0 flex items-center justify-center"><Calendar className="w-3 h-3 text-green-400" /></Div>
          <Div className="flex-1 min-w-0"><Div className="text-[9px] font-semibold text-foreground truncate">📅 Nuova serata: Ammare 18 Lug</Div><Div className="text-[8px] text-muted-foreground">5 ore fa</Div></Div>
        </Div>
        <Div className="flex items-start gap-1.5 rounded-lg bg-card border border-border p-2">
          <Div className="w-5 h-5 rounded-full bg-primary/20 shrink-0 flex items-center justify-center"><Zap className="w-3 h-3 text-primary" /></Div>
          <Div className="flex-1 min-w-0"><Div className="text-[9px] font-semibold text-foreground truncate">⚡ Vibra VS: sei in testa!</Div><Div className="text-[8px] text-muted-foreground">1 giorno fa</Div></Div>
        </Div>
      </Div>
      {/* Push toggle */}
      <Div className="relative flex items-center justify-between mt-2 rounded-lg bg-card border border-border p-2">
        <Callout n={3} className="-top-1 left-3" />
        <Span className="text-[9px] font-semibold text-foreground">Notifiche Push</Span>
        <Div className="w-7 h-3.5 rounded-full bg-primary p-0.5"><Div className="w-2.5 h-2.5 rounded-full bg-primary-foreground ml-auto" /></Div>
      </Div>
    </Frame>
  );
}

// ── MOBILE FAST-SCROLL (drag thumb) ─────────────────────────
function MobileFastScrollMockup() {
  const rows = [
    ['LE','Luca Esposito','24 pres · €201 med','8.5',true],
    ['GR','Giorgia Russo','18 pres · €165 med','6.2',false],
    ['MF','Marco Ferrara','31 pres · €178 med','7.8',true],
    ['AB','Antonio Bruno','12 pres · €142 med','5.1',false],
    ['SC','Sara Costa','3 pres · €90 med','3.2',false],
    ['DV','Diego Vitale','5 pres · €120 med','4.0',false],
    ['LB','Lucia Bianchi','22 pres · €188 med','7.1',true],
    ['AR','Antonio Rizzo','8 pres · €110 med','4.2',false],
  ];
  return (
    <Frame url="Clienti · Fast-Scroll" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Clienti</Span>
        <Div className="w-7 h-7 rounded-lg bg-primary/15" />
      </Div>
      {/* Lista con thumb dragabile a destra */}
      <Div className="relative pr-4">
        <Callout n={1} className="top-6 -right-1" />
        <Div className="space-y-1.5">
          {rows.map(([i,n,s,r,l]) => (
            <Div key={i} className="flex items-center gap-2 rounded-lg bg-card border border-border p-1.5">
              <Div className={`w-6 h-6 rounded-full bg-gradient-to-br ${l?'from-purple-400/60 to-purple-400/20':'from-pink-400/60 to-pink-400/20'} shrink-0 flex items-center justify-center text-[7px] font-bold`}>{i}</Div>
              <Div className="flex-1 min-w-0"><Div className="text-[9px] font-semibold text-foreground truncate">{n}</Div><Div className="text-[7px] text-muted-foreground">{s}</Div></Div>
              <Span className={`text-[9px] font-bold ${l?'text-amber-400':'text-muted-foreground'}`}>{r}</Span>
            </Div>
          ))}
        </Div>
        {/* Thumb dragabile */}
        <Div className="absolute right-0 top-4 bottom-4 w-1.5 rounded-full bg-secondary/60" />
        <Div className="absolute right-0 top-8 w-1.5 h-9 rounded-full bg-primary shadow-lg" />
      </Div>
      <P className="text-[8px] text-muted-foreground mt-2 text-center">Trascina il cursore a destra per scorrere velocemente</P>
    </Frame>
  );
}

// ── GENERIC ────────────────────────────────────────────────
function GenericMockup() {
  return (
    <Frame url="Vibra">
      <Div className="flex items-center justify-between mb-3">
        <Span className="text-sm font-bold text-foreground">Vibra</Span>
        <Div className="w-7 h-7 rounded-lg bg-primary/15" />
      </Div>
      <Div className="relative space-y-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="rounded-lg bg-card border border-border p-2">
          <Div className="text-[10px] font-semibold text-foreground mb-1">Sezione 1</Div>
          <Div className="text-[9px] text-muted-foreground">Contenuto e materiali caricati dall'admin.</Div>
        </Div>
        <Div className="rounded-lg bg-card border border-border p-2">
          <Div className="text-[10px] font-semibold text-foreground mb-1">Sezione 2</Div>
          <Div className="text-[9px] text-muted-foreground">Dettagli e impostazioni.</Div>
        </Div>
        <Div className="relative rounded-lg bg-card border border-border p-2">
          <Callout n={2} className="-top-1 -right-1" />
          <Div className="text-[10px] font-semibold text-foreground mb-1">Elemento 3</Div>
          <Div className="text-[9px] text-muted-foreground">Azioni disponibili.</Div>
        </Div>
      </Div>
    </Frame>
  );
}

// Import mockup tab-specifici (uno per ogni tab delle sezioni multi-tab)
import {
  WeekendLeaderMockup, WeekendTabelleMockup, WeekendGrowthMockup,
  WeekendContextMenuDatesMockup, WeekendContextMenuActionsMockup,
  WeekendAIConsoleMockup
} from './mockups/WeekendTabMockups';
import {
  IlMioVibraGuadagniMockup, IlMioVibraProgressiMockup, IlMioVibraTeamMockup,
  IlMioVibraNoteMockup, IlMioVibraAchievementsMockup, IlMioVibraVibraVSMockup,
  IlMioVibraAccordiMockup,
  IlMioVibraGuadagniDettagliMockup, IlMioVibraSerateMockup,
  IlMioVibraCalcolatriceMockup, IlMioVibraMaterialeLocaliMockup
} from './mockups/IlMioVibraTabMockups';
import {
  ClientiTabelleMockup, ClientiMappaMockup, ClientiGruppiMockup,
  ClientiListaMockup, ClientiParcoMockup, ClientiAlberoMockup, ClientiAnaliticaMockup,
  ClientiPresenzeMockup, ClientiImportaMockup, ClientiNuovoMockup
} from './mockups/ClientiTabMockups';
import {
  WeekendInvitiV2, WeekendRicontattareV2, WeekendSeminaV2, WeekendTargetV2,
  WeekendLeaderV2, WeekendTabelleV2
} from './mockups/WeekendMockupsV2';
import {
  ClientiListaV2, ClientiGruppiV2, ClientiParcoV2, ClientiAlberoV2,
  ClientiTabelleV2, ClientiGrowthV2, ClientiAnaliticaV2, ClientiMappaV2
} from './mockups/ClientiMockupsV2';
import {
  SemineListaV2, SemineLongPressV2, SeminePasteSeminaV2, SeminePastePhotoV2,
  SemineCatturaV2, SemineModificaV2, SemineDragV2, SemineSpenteV2, SemineFlipV2
} from './mockups/SemineMockupsV2';
import {
  MessaggiListaV2, MessaggiChatV2, MessaggiMenuV2
} from './mockups/MessaggiMockups';
import {
  PromoterCompareMockup, PromoterGrowthMockup, PromoterExprMockup,
  PromoterObiettiviMockup, PromoterMappaMockup, PromoterTeamMockup, PromoterReportMockup
} from './mockups/PromoterTabMockups';
import {
  MenuBurgerMockup, MenuSidebarMockup, MenuBottomNavMockup, MenuProfileMockup
} from './mockups/MenuTabMockups';
import {
  BenvenutoCosaMockup, BenvenutoGuidaMockup,
  RicercaApriMockup, RicercaCosaMockup, RicercaClientiMockup,
  RicercaSerateMockup, RicercaMaterialeMockup, RicercaSezioniMockup
} from './mockups/AcademyTabMockups';

import { Btn, Div, P, Span } from '@/ui/html';

const MOCKUPS = {
  dashboard: DashboardMockup,
  promoter: PromoterMockup,
  'clienti-list': ClientiListMockup,
  'clienti-detail': ClientiDetailMockup,
  'clienti-lista': ClientiListaMockup,
  'clienti-tabelle': ClientiTabelleMockup,
  'clienti-mappa': ClientiMappaMockup,
  'clienti-gruppi': ClientiGruppiMockup,
  'clienti-parco': ClientiParcoMockup,
  'clienti-albero': ClientiAlberoMockup,
  'clienti-analitica': ClientiAnaliticaMockup,
  'clienti-presenze': ClientiPresenzeMockup,
  'clienti-importa': ClientiImportaMockup,
  'clienti-nuovo': ClientiNuovoMockup,
  'clienti-lista-v2': ClientiListaV2,
  'clienti-gruppi-v2': ClientiGruppiV2,
  'clienti-parco-v2': ClientiParcoV2,
  'clienti-albero-v2': ClientiAlberoV2,
  'clienti-tabelle-v2': ClientiTabelleV2,
  'clienti-growth-v2': ClientiGrowthV2,
  'clienti-analitica-v2': ClientiAnaliticaV2,
  'clienti-mappa-v2': ClientiMappaV2,
  'semine-lista-v2': SemineListaV2,
  'semine-long-press-v2': SemineLongPressV2,
  'semine-paste-semina-v2': SeminePasteSeminaV2,
  'semine-paste-photo-v2': SeminePastePhotoV2,
  'semine-cattura-v2': SemineCatturaV2,
  'semine-modifica-v2': SemineModificaV2,
  'semine-drag-v2': SemineDragV2,
  'semine-spente-v2': SemineSpenteV2,
  'semine-flip-v2': SemineFlipV2,
  'messaggi-lista-v2': MessaggiListaV2,
  'messaggi-chat-v2': MessaggiChatV2,
  'messaggi-menu-v2': MessaggiMenuV2,
  weekend: WeekendMockup,
  'weekend-leader': WeekendLeaderMockup,
  'weekend-tabelle': WeekendTabelleMockup,
  'weekend-growth': WeekendGrowthMockup,
  'weekend-context-menu-dates': WeekendContextMenuDatesMockup,
  'weekend-context-menu-actions': WeekendContextMenuActionsMockup,
  'weekend-ai-console': WeekendAIConsoleMockup,
  'weekend-inviti-v2': WeekendInvitiV2,
  'weekend-ricontattare-v2': WeekendRicontattareV2,
  'weekend-semina-v2': WeekendSeminaV2,
  'weekend-target-v2': WeekendTargetV2,
  'weekend-leader-v2': WeekendLeaderV2,
  'weekend-tabelle-v2': WeekendTabelleV2,
  serate: SerateMockup,
  locali: LocaliMockup,
  ilmiovibra: IlMioVibraMockup,
  'ilmiovibra-guadagni': IlMioVibraGuadagniMockup,
  'ilmiovibra-guadagni-dettagli': IlMioVibraGuadagniDettagliMockup,
  'ilmiovibra-serate': IlMioVibraSerateMockup,
  'ilmiovibra-progressi': IlMioVibraProgressiMockup,
  'ilmiovibra-team': IlMioVibraTeamMockup,
  'ilmiovibra-note': IlMioVibraNoteMockup,
  'ilmiovibra-achievements': IlMioVibraAchievementsMockup,
  'ilmiovibra-vibravs': IlMioVibraVibraVSMockup,
  'ilmiovibra-accordi': IlMioVibraAccordiMockup,
  'ilmiovibra-calcolatrice': IlMioVibraCalcolatriceMockup,
  'ilmiovibra-materiale-locali': IlMioVibraMaterialeLocaliMockup,
  'promoter-team': PromoterTeamMockup,
  'promoter-compare': PromoterCompareMockup,
  'promoter-growth': PromoterGrowthMockup,
  'promoter-expr': PromoterExprMockup,
  'promoter-report': PromoterReportMockup,
  'promoter-obiettivi': PromoterObiettiviMockup,
  'promoter-mappa': PromoterMappaMockup,
  vibragpt: VibraGPTMockup,
  notifiche: NotificheMockup,
  'menu-burger': MenuBurgerMockup,
  'menu-sidebar': MenuSidebarMockup,
  'menu-bottomnav': MenuBottomNavMockup,
  'menu-profile': MenuProfileMockup,
  'menu-fast-scroll': MobileFastScrollMockup,
  'benvenuto-cosa': BenvenutoCosaMockup,
  'benvenuto-guida': BenvenutoGuidaMockup,
  'ricerca-apri': RicercaApriMockup,
  'ricerca-cosa': RicercaCosaMockup,
  'ricerca-clienti': RicercaClientiMockup,
  'ricerca-serate': RicercaSerateMockup,
  'ricerca-materiale': RicercaMaterialeMockup,
  'ricerca-sezioni': RicercaSezioniMockup,
  generic: GenericMockup,
};

export default function ScreenMockup({ type }) {
  const M = MOCKUPS[type] || GenericMockup;
  return <M />;
}