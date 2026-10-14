// Port di src/components/academy/mockups/WeekendTabMockups.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Crown, Star, Trophy, Table2, TrendingDown, TrendingUp, MessageCircle, Instagram, Search, Calendar, CalendarPlus, Check, Sparkles, Car, Bell, Trash2, X, Brain, RefreshCw, Gem, Minus } from '@/ui/icons.generated';
import { Callout, Frame, Avatar } from './shared';

import { Div, P, Span } from '@/ui/html';

// ── WEEKEND · TAB LEADER ─────────────────────────────────────
export function WeekendLeaderMockup() {
  return (
    <Frame url="Weekend · Leader" tall>
      {/* Tab bar */}
      <Div className="flex gap-1 bg-secondary/30 p-0.5 rounded-lg my-2">
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]"><Calendar className="w-3 h-3 inline mr-0.5" />Inviti</Div>
        <Div className="relative flex-1 text-center py-1 rounded-md bg-card text-[9px] font-semibold">
          <Callout n={1} className="-top-1 -left-1" />
          <Crown className="w-3 h-3 inline mr-0.5" />Leader
        </Div>
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]"><Table2 className="w-3 h-3 inline mr-0.5" />Tab.</Div>
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]"><Trophy className="w-3 h-3 inline mr-0.5" />Growth</Div>
      </Div>
      {/* Header con bordo ambrato */}
      <Div className="relative rounded-xl border border-amber-500/20 bg-card p-3 overflow-hidden" style={{ borderTop: '2px solid rgba(245,158,11,0.4)' }}>
        <Callout n={2} className="-top-1 left-3" />
        <Div className="flex items-center justify-between mb-2">
          <Div className="flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-400" />
            <Span className="text-[11px] font-bold text-foreground">Leader</Span>
          </Div>
          <Span className="text-[9px] text-muted-foreground bg-secondary/40 px-2 py-0.5 rounded-full">5 clienti</Span>
        </Div>
        <Div className="space-y-1.5">
          <Div className="relative flex items-center gap-2 rounded-lg bg-secondary/30 p-2">
            <Callout n={3} className="-top-1 -left-1" />
            <Avatar initials="LE" grad="from-purple-400/60 to-purple-400/20" />
            <Div className="flex-1 min-w-0">
              <Div className="text-[10px] font-semibold text-foreground truncate flex items-center gap-1">Luca Esposito <Star className="w-3 h-3 text-amber-400 fill-amber-400" /></Div>
              <Div className="text-[8px] text-muted-foreground">24 pres · €201 med · ⭐ Oro</Div>
            </Div>
            <Span className="text-[8px] text-amber-400">2 giorni fa</Span>
          </Div>
          <Div className="flex items-center gap-2 rounded-lg bg-secondary/30 p-2">
            <Avatar initials="MF" grad="from-amber-400/60 to-amber-400/20" />
            <Div className="flex-1 min-w-0">
              <Div className="text-[10px] font-semibold text-foreground truncate flex items-center gap-1">Marco Ferrara <Star className="w-3 h-3 text-amber-400 fill-amber-400" /></Div>
              <Div className="text-[8px] text-muted-foreground">31 pres · €178 med · ⭐ Oro</Div>
            </Div>
            <Span className="text-[8px] text-muted-foreground">1 sett. fa</Span>
          </Div>
          <Div className="flex items-center gap-2 rounded-lg bg-secondary/30 p-2">
            <Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" />
            <Div className="flex-1 min-w-0">
              <Div className="text-[10px] font-semibold text-foreground truncate flex items-center gap-1">Giorgia Russo <Star className="w-3 h-3 text-gray-300 fill-gray-300" /></Div>
              <Div className="text-[8px] text-muted-foreground">18 pres · €165 med · ⭐ Argento</Div>
            </Div>
            <Span className="text-[8px] text-muted-foreground">2 sett. fa</Span>
          </Div>
          <Div className="flex items-center gap-2 rounded-lg bg-secondary/30 p-2">
            <Avatar initials="AB" grad="from-blue-400/60 to-blue-400/20" />
            <Div className="flex-1 min-w-0">
              <Div className="text-[10px] font-semibold text-foreground truncate flex items-center gap-1">Antonio Bruno <Star className="w-3 h-3 text-amber-700 fill-amber-700" /></Div>
              <Div className="text-[8px] text-muted-foreground">12 pres · €142 med · ⭐ Bronzo</Div>
            </Div>
            <Span className="text-[8px] text-muted-foreground">1 mese fa</Span>
          </Div>
        </Div>
      </Div>
      <Div className="relative mt-2">
        <Callout n={4} className="top-0 right-0" />
      </Div>
    </Frame>
  );
}

// ── WEEKEND · TAB TABELLE ────────────────────────────────────
export function WeekendTabelleMockup() {
  return (
    <Frame url="Weekend · Tabelle" tall>
      {/* Tab bar */}
      <Div className="flex gap-1 bg-secondary/30 p-0.5 rounded-lg my-2">
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]">Inviti</Div>
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]">Leader</Div>
        <Div className="relative flex-1 text-center py-1 rounded-md bg-card text-[9px] font-semibold">
          <Callout n={1} className="-top-1 -left-1" />
          Tabelle
        </Div>
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]">Growth</Div>
      </Div>
      {/* Grid 2x2 bacheche */}
      <Div className="grid grid-cols-2 gap-1.5">
        <Div className="relative rounded-lg bg-card border border-purple-500/20 p-2" style={{ borderTop: '2px solid rgba(167,139,250,0.3)' }}>
          <Callout n={2} className="-top-1 -left-1" />
          <Div className="text-[9px] font-bold text-purple-400 mb-1">✨ Nuovi</Div>
          <Div className="space-y-1">
            <Div className="flex items-center gap-1"><Avatar initials="SC" grad="from-green-400/50 to-green-400/10" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate">Sara Costa</Span></Div>
            <Div className="flex items-center gap-1"><Avatar initials="DV" grad="from-green-400/50 to-green-400/10" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate">Diego Vitale</Span></Div>
          </Div>
        </Div>
        <Div className="relative rounded-lg bg-card border border-amber-500/20 p-2" style={{ borderTop: '2px solid rgba(250,204,21,0.3)' }}>
          <Callout n={3} className="-top-1 -left-1" />
          <Div className="text-[9px] font-bold text-amber-400 mb-1">🏆 Top Paganti</Div>
          <Div className="space-y-1">
            <Div className="flex items-center gap-1"><Avatar initials="LE" grad="from-purple-400/60 to-purple-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate">L. Esposito</Span><Span className="text-[7px] text-amber-400 ml-auto">8.5</Span></Div>
            <Div className="flex items-center gap-1"><Avatar initials="MF" grad="from-amber-400/60 to-amber-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate">M. Ferrara</Span><Span className="text-[7px] text-amber-400 ml-auto">7.8</Span></Div>
          </Div>
        </Div>
        <Div className="relative rounded-lg bg-card border border-orange-500/20 p-2" style={{ borderTop: '2px solid rgba(245,158,11,0.3)' }}>
          <Callout n={4} className="-top-1 -left-1" />
          <Div className="text-[9px] font-bold text-orange-400 mb-1">⭐ Leader Inattivi</Div>
          <Div className="space-y-1">
            <Div className="flex items-center gap-1"><Avatar initials="AB" grad="from-blue-400/60 to-blue-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate">A. Bruno</Span></Div>
          </Div>
        </Div>
        <Div className="relative rounded-lg bg-card border border-red-500/20 p-2" style={{ borderTop: '2px solid rgba(239,68,68,0.3)' }}>
          <Callout n={5} className="-top-1 -left-1" />
          <Div className="text-[9px] font-bold text-red-400 mb-1">📉 In Calo</Div>
          <Div className="space-y-1">
            <Div className="flex items-center gap-1"><Avatar initials="MF" grad="from-amber-400/60 to-amber-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate">M. Ferrara</Span><TrendingDown className="w-2 h-2 text-red-400 ml-auto" /></Div>
            <Div className="flex items-center gap-1"><Avatar initials="LB" grad="from-pink-400/60 to-pink-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate">L. Bianchi</Span><TrendingDown className="w-2 h-2 text-red-400 ml-auto" /></Div>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── WEEKEND · MENU CONTESTUALE (DATE + EXTRA) ────────────────
export function WeekendContextMenuDatesMockup() {
  return (
    <Frame url="Weekend · Menu contestuale" tall>
      {/* Client card dietro (trigger long-press) */}
      <Div className="relative flex items-center gap-2 rounded-lg bg-card border border-border p-2 mb-2 opacity-50">
        <Callout n={1} className="-top-1 -left-1" />
        <Avatar initials="LE" grad="from-purple-400/60 to-purple-400/20" size="w-7 h-7" />
        <Div className="flex-1 min-w-0">
          <Div className="text-[10px] font-semibold text-foreground truncate flex items-center gap-1">Luca Esposito <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /></Div>
          <Div className="text-[8px] text-muted-foreground">24 pres · €201 med</Div>
        </Div>
        <Span className="text-[9px] font-bold text-amber-400">8.5</Span>
      </Div>
      {/* Popup menu */}
      <Div className="relative rounded-xl border border-white/10 bg-popover shadow-2xl overflow-hidden">
        <Div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-secondary/40">
          <P className="text-[10px] font-semibold text-foreground truncate">Aggiungi Luca Esposito</P>
          <X className="w-3 h-3 text-muted-foreground" />
        </Div>
        {/* Section header */}
        <Div className="px-3 py-1 text-[7px] font-semibold uppercase tracking-wider text-muted-foreground">Aggiungi a una serata</Div>
        {/* Date list */}
        <Div className="py-0.5">
          <Div className="relative flex items-center gap-2 px-3 py-2">
            <Callout n={2} className="top-0 -left-1" />
            <CalendarPlus className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <Div className="flex-1 min-w-0">
              <P className="text-[9px] font-medium truncate">Ven · Ammare Frontemare</P>
              <P className="text-[8px] text-muted-foreground">14 ago 2026</P>
            </Div>
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <Callout n={3} className="top-0 -right-1" />
          </Div>
          <Div className="flex items-center gap-2 px-3 py-2">
            <CalendarPlus className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <Div className="flex-1 min-w-0">
              <P className="text-[9px] font-medium truncate">Sab · Mantra</P>
              <P className="text-[8px] text-muted-foreground">15 ago 2026</P>
            </Div>
          </Div>
          <Div className="flex items-center gap-2 px-3 py-2">
            <CalendarPlus className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <Div className="flex-1 min-w-0">
              <P className="text-[9px] font-medium truncate">Dom · Toma</P>
              <P className="text-[8px] text-muted-foreground">16 ago 2026</P>
            </Div>
          </Div>
          {/* Extra serata (fittizia) */}
          <Div className="relative flex items-center gap-2 px-3 py-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <Div className="flex-1 min-w-0">
              <P className="text-[9px] font-medium truncate">Ferra</P>
              <P className="text-[8px] text-muted-foreground">14 ago 2026 · Extra</P>
            </Div>
            <Trash2 className="w-3 h-3 text-muted-foreground shrink-0" />
            <Callout n={5} className="top-0 -right-1" />
          </Div>
        </Div>
        {/* Create extra */}
        <Div className="border-t border-border/40">
          <Div className="relative flex items-center gap-2 px-3 py-2.5 text-amber-400">
            <Callout n={4} className="top-0 -left-1" />
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <Span className="text-[9px] font-medium">Crea nuova serata extra</Span>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── WEEKEND · MENU CONTESTUALE (AZIONI RAPIDE) ───────────────
export function WeekendContextMenuActionsMockup() {
  return (
    <Frame url="Weekend · Menu contestuale" tall>
      {/* Client card dietro (trigger long-press) */}
      <Div className="relative flex items-center gap-2 rounded-lg bg-card border border-border p-2 mb-2 opacity-50">
        <Avatar initials="LE" grad="from-purple-400/60 to-purple-400/20" size="w-7 h-7" />
        <Div className="flex-1 min-w-0">
          <Div className="text-[10px] font-semibold text-foreground truncate flex items-center gap-1">Luca Esposito <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /></Div>
          <Div className="text-[8px] text-muted-foreground">24 pres · €201 med</Div>
        </Div>
        <Span className="text-[9px] font-bold text-amber-400">8.5</Span>
      </Div>
      {/* Popup menu — sezione azioni rapide */}
      <Div className="relative rounded-xl border border-white/10 bg-popover shadow-2xl overflow-hidden">
        <Div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-secondary/40">
          <P className="text-[10px] font-semibold text-foreground truncate">Aggiungi Luca Esposito</P>
          <X className="w-3 h-3 text-muted-foreground" />
        </Div>
        <Div className="border-t border-border/40">
          <Div className="relative flex items-center gap-2 px-3 py-2">
            <Callout n={1} className="top-0 -left-1" />
            <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
            <Span className="text-[9px] font-medium text-foreground">Rimuovi leader</Span>
          </Div>
          <Div className="relative flex items-center gap-2 px-3 py-2">
            <Callout n={2} className="top-0 -left-1" />
            <Car className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <Span className="text-[9px] font-medium text-foreground">Rimuovi guidatore</Span>
          </Div>
          <Div className="relative flex items-center gap-2 px-3 py-2">
            <Callout n={3} className="top-0 -left-1" />
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <Span className="text-[9px] font-medium text-foreground">Contatta</Span>
          </Div>
          <Div className="relative flex items-center gap-2 px-3 py-2">
            <Callout n={4} className="top-0 -left-1" />
            <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <Span className="text-[9px] font-medium text-foreground">Ricordami di ricontattarlo</Span>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── WEEKEND · TAB GROWTH ─────────────────────────────────────
export function WeekendGrowthMockup() {
  return (
    <Frame url="Weekend · Growth" tall>
      {/* Tab bar */}
      <Div className="flex gap-1 bg-secondary/30 p-0.5 rounded-lg my-2">
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]">Inviti</Div>
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]">Leader</Div>
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]">Tabelle</Div>
        <Div className="relative flex-1 text-center py-1 rounded-md bg-card text-[9px] font-semibold">
          <Callout n={1} className="-top-1 -left-1" />
          <Trophy className="w-3 h-3 inline mr-0.5" />Growth
        </Div>
      </Div>
      {/* Search */}
      <Div className="relative mb-2">
        <Callout n={2} className="-top-1.5 -left-1.5" />
        <Div className="flex items-center gap-1.5 rounded-lg bg-card border border-border px-2 py-1.5">
          <Search className="w-3 h-3 text-muted-foreground" />
          <Span className="text-[10px] text-muted-foreground">Cerca cliente...</Span>
        </Div>
      </Div>
      {/* Table */}
      <Div className="relative rounded-lg bg-card border border-border overflow-hidden">
        <Callout n={3} className="-top-1 -right-1" />
        {/* Header */}
        <Div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-secondary/30 text-[7px] font-semibold text-muted-foreground uppercase">
          <Span className="flex-1">Cliente</Span>
          <Span className="w-8 text-center">Pres.</Span>
          <Span className="w-10 text-center">Spesa</Span>
          <Span className="w-8 text-center">Punt.</Span>
          <Span className="w-8 text-center">Cresc.</Span>
          <Span className="w-6 text-center">WA</Span>
        </Div>
        {/* Rows */}
        <Div className="divide-y divide-border/40">
          <Div className="flex items-center gap-1 px-2 py-1.5 text-[8px]">
            <Avatar initials="LE" grad="from-purple-400/60 to-purple-400/20" size="w-5 h-5" text="text-[6px]" />
            <Span className="flex-1 text-foreground/80 truncate">L. Esposito</Span>
            <Span className="w-8 text-center text-green-400">24</Span>
            <Span className="w-10 text-center text-amber-400">€4.8K</Span>
            <Span className="w-8 text-center font-bold text-amber-400">8.5</Span>
            <Span className="w-8 text-center text-green-400">+18%</Span>
            <Span className="w-6 text-center"><MessageCircle className="w-2.5 h-2.5 text-green-400 inline" /></Span>
          </Div>
          <Div className="flex items-center gap-1 px-2 py-1.5 text-[8px]">
            <Avatar initials="MF" grad="from-amber-400/60 to-amber-400/20" size="w-5 h-5" text="text-[6px]" />
            <Span className="flex-1 text-foreground/80 truncate">M. Ferrara</Span>
            <Span className="w-8 text-center text-green-400">31</Span>
            <Span className="w-10 text-center text-amber-400">€5.5K</Span>
            <Span className="w-8 text-center font-bold text-amber-400">7.8</Span>
            <Span className="w-8 text-center text-red-400">-12%</Span>
            <Span className="w-6 text-center"><MessageCircle className="w-2.5 h-2.5 text-green-400 inline" /></Span>
          </Div>
          <Div className="flex items-center gap-1 px-2 py-1.5 text-[8px]">
            <Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" size="w-5 h-5" text="text-[6px]" />
            <Span className="flex-1 text-foreground/80 truncate">G. Russo</Span>
            <Span className="w-8 text-center text-green-400">18</Span>
            <Span className="w-10 text-center text-amber-400">€2.9K</Span>
            <Span className="w-8 text-center font-bold text-muted-foreground">6.2</Span>
            <Span className="w-8 text-center text-green-400">+5%</Span>
            <Span className="w-6 text-center"><Instagram className="w-2.5 h-2.5 text-pink-400 inline" /></Span>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── WEEKEND · ANALISI INTELLIGENTE (AI Console) ───────────────
export function WeekendAIConsoleMockup() {
  return (
    <Frame url="Weekend · Analisi Intelligente" tall>
      {/* Tab bar — Inviti active */}
      <Div className="flex gap-1 bg-secondary/30 p-0.5 rounded-lg my-2">
        <Div className="flex-1 text-center py-1 rounded-md bg-card text-[9px] font-semibold"><Calendar className="w-3 h-3 inline mr-0.5" />Inviti</Div>
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]"><Crown className="w-3 h-3 inline mr-0.5" />Leader</Div>
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]"><Table2 className="w-3 h-3 inline mr-0.5" />Tab.</Div>
        <Div className="flex-1 text-center py-1 rounded-md text-muted-foreground text-[9px]"><Trophy className="w-3 h-3 inline mr-0.5" />Growth</Div>
      </Div>
      {/* AI Console box */}
      <Div className="relative rounded-xl border border-violet-500/15 bg-card p-2.5 space-y-2 overflow-hidden" style={{ boxShadow: '0 4px 24px -6px rgba(167,139,250,0.12)' }}>
        <Div className="absolute top-0 left-0 right-0 h-[2px] opacity-50" style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
        {/* Header */}
        <Div className="relative flex items-center justify-between">
          <Callout n={1} className="-top-1 -left-1" />
          <Div className="flex items-center gap-1.5">
            <Div className="p-1 rounded-lg" style={{ background: '#a78bfa1a' }}><Brain className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} /></Div>
            <Span className="text-[10px] font-semibold uppercase tracking-wider text-violet-300">Analisi Intelligente</Span>
          </Div>
          <Div className="flex items-center gap-1">
            <Span className="text-[8px] text-muted-foreground">2h fa</Span>
            <Div className="relative">
              <Callout n={2} className="-top-1.5 -right-1" />
              <Div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-violet-500/30 text-violet-300 bg-violet-500/10 text-[8px] font-semibold"><RefreshCw className="w-2.5 h-2.5" />Ricalcola</Div>
            </Div>
          </Div>
        </Div>
        {/* Sintesi */}
        <Div className="relative rounded-lg bg-violet-500/5 border border-violet-500/15 px-2 py-1.5">
          <Callout n={3} className="-top-1 -left-1" />
          <P className="text-[7px] font-semibold uppercase tracking-wider text-violet-300 mb-0.5">Sintesi del parco paganti</P>
          <P className="text-[8px] text-foreground/90 leading-snug">42 clienti attivi, 6 leader, 3 in calo. Zone forti: Vomero, Posillipo. 4 guidatori. Sabato punta sul Mantra col gruppo Vomero.</P>
        </Div>
        {/* Filters */}
        <Div className="relative flex items-center gap-1">
          <Callout n={4} className="-top-1 -left-1" />
          <Div className="flex items-center gap-1 rounded-md bg-secondary/40 border border-border px-1.5 py-1 flex-1"><Search className="w-2.5 h-2.5 text-muted-foreground" /><Span className="text-[8px] text-muted-foreground">Cerca cliente…</Span></Div>
          <Div className="rounded-md bg-secondary/40 border border-border px-1.5 py-1 text-[8px] text-muted-foreground">Tutte</Div>
          <Span className="text-[8px] text-muted-foreground">42</Span>
        </Div>
        {/* Recommendation pill 1 */}
        <Div className="relative rounded-lg border border-border bg-secondary/20 p-2 space-y-1">
          <Callout n={5} className="-top-1 -left-1" />
          <Div className="flex items-center gap-1">
            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400 shrink-0" />
            <P className="font-medium text-[9px] text-foreground truncate flex-1">Luca Esposito</P>
            <Span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-amber-400"><Gem className="w-2.5 h-2.5" />8.5</Span>
          </Div>
          <Div className="flex flex-wrap items-center gap-1">
            <Span className="text-[7px] font-medium px-1 py-0.5 rounded" style={{ background: '#fbbf241a', color: '#fbbf24' }}>Leader</Span>
            <Span className="text-[7px] text-muted-foreground">P1</Span>
            <Span className="inline-flex items-center gap-0.5 text-[7px] font-semibold text-green-400"><TrendingUp className="w-2 h-2" />Su</Span>
            <Span className="text-[7px] text-muted-foreground ml-auto">24 pres.</Span>
          </Div>
          <P className="text-[7px] text-foreground/80 leading-snug">Viene quasi sempre al Mantra il sabato (14 presenze). Streak di 5 settimane consecutive.</P>
          <P className="text-[7px] text-violet-300/90 leading-snug"><Span className="font-semibold">Perché ora: </Span>Sabato si va al Mantra, il suo locale forte: è il giorno giusto.</P>
          <P className="text-[7px] text-muted-foreground leading-snug"><Span className="font-semibold">Approccio: </Span>Ue Luca! 🙌 sabato facciamo il bis al Mantra, ti tengo un tavolo, fammi sapere che porti amici</P>
          <Div className="flex items-center gap-1.5 pt-0.5">
            <Div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400"><MessageCircle className="w-2.5 h-2.5" /></Div>
            <Div className="p-1 rounded-lg bg-pink-500/10 text-pink-400"><Instagram className="w-2.5 h-2.5" /></Div>
          </Div>
        </Div>
        {/* Recommendation pill 2 */}
        <Div className="rounded-lg border border-border bg-secondary/20 p-2 space-y-1">
          <Div className="flex items-center gap-1">
            <P className="font-medium text-[9px] text-foreground truncate flex-1">Antonio Rizzo</P>
            <Span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-muted-foreground"><Gem className="w-2.5 h-2.5" />4.2</Span>
          </Div>
          <Div className="flex flex-wrap items-center gap-1">
            <Span className="text-[7px] font-medium px-1 py-0.5 rounded" style={{ background: '#ef44441a', color: '#ef4444' }}>Da recuperare</Span>
            <Span className="text-[7px] text-muted-foreground">P2</Span>
            <Span className="inline-flex items-center gap-0.5 text-[7px] font-semibold text-red-400"><TrendingDown className="w-2 h-2" />Giu</Span>
            <Span className="text-[7px] text-muted-foreground ml-auto">8 pres.</Span>
          </Div>
          <P className="text-[7px] text-violet-300/90 leading-snug"><Span className="font-semibold">Perché ora: </Span>Non viene da 40 giorni, abita al Vomero: accoppialo col gruppo per un passaggio.</P>
        </Div>
      </Div>
    </Frame>
  );
}