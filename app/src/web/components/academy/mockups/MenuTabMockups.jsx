// Port di src/components/academy/mockups/MenuTabMockups.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import {
  Menu, X, Search, Bell, LayoutGrid, UsersRound, ContactRound, Send,
  CalendarRange, Building2, Trophy, BrainCircuit, Home, User,
  LogOut, Settings as SettingsIcon, ChevronRight,
} from '@/ui/icons.generated';
import { Callout, Frame, Avatar } from './shared';
import { useIsMobile } from '@/web/hooks/use-mobile';

import { Div, Span } from '@/ui/html';

// Voci di navigazione condivise tra burger e sidebar
const NAV_ITEMS = [
  { icon: LayoutGrid, label: 'Dashboard' },
  { icon: UsersRound, label: 'Promoter' },
  { icon: ContactRound, label: 'Clienti' },
  { icon: Send, label: 'Weekend' },
  { icon: CalendarRange, label: 'Serate' },
  { icon: Building2, label: 'Locali' },
  { icon: BrainCircuit, label: 'Vibra GPT' },
];

// ── MENU BURGER (mobile) ───────────────────────────────────
export function MenuBurgerMockup() {
  return (
    <Frame url="Vibra · Menu" tall>
      {/* Header app con icona burger */}
      <Div className="relative flex items-center gap-2 mb-2 pb-2 border-b border-border">
        <Callout n={1} className="-top-1 -left-1" />
        <Menu className="w-4 h-4 text-foreground" />
        <Span className="text-[11px] font-bold text-foreground flex-1">Dashboard</Span>
        <Div className="relative">
          <Bell className="w-4 h-4 text-foreground/60" />
          <Span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 text-[7px] text-white flex items-center justify-center font-bold">3</Span>
        </Div>
      </Div>

      {/* Drawer aperto con backdrop */}
      <Div className="relative">
        <Div className="absolute inset-0 -mx-3 bg-black/50 rounded-lg" style={{ minHeight: 240 }} />
        <Div className="relative w-[74%] rounded-r-xl bg-card border border-border p-2 shadow-2xl flex flex-col" style={{ minHeight: 240 }}>
          <Callout n={2} className="-top-1.5 -left-1.5" />
          {/* logo + chiudi */}
          <Div className="flex items-center justify-between mb-2">
            <Div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">V</Div>
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </Div>
          {/* voci nav */}
          <Div className="relative space-y-0.5 flex-1">
            <Callout n={3} className="top-3 -left-3" />
            {NAV_ITEMS.map((it, i) => (
              <Div key={i} className={`flex items-center gap-1.5 px-1.5 py-1 rounded-md text-[9px] ${i === 0 ? 'bg-primary/10 text-foreground font-semibold' : 'text-muted-foreground'}`}>
                <it.icon className="w-3 h-3" />
                <Span>{it.label}</Span>
              </Div>
            ))}
            <Div className="flex items-center gap-1.5 px-1.5 py-1 rounded-md text-[9px] text-muted-foreground border-t border-border mt-1 pt-1.5">
              <Search className="w-3 h-3" />
              <Span>Cerca</Span>
            </Div>
          </Div>
          {/* profilo in fondo */}
          <Div className="relative flex items-center gap-1.5 rounded-md bg-secondary/40 p-1.5 mt-1">
            <Callout n={4} className="-top-1.5 -left-1.5" />
            <Avatar initials="MR" size="w-6 h-6" text="text-[7px]" />
            <Div className="min-w-0">
              <Div className="text-[8px] font-semibold text-foreground truncate">Marco Rossi</Div>
              <Div className="text-[7px] text-muted-foreground truncate">PR · Posillipo</Div>
            </Div>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── SIDEBAR (desktop) ──────────────────────────────────────
export function MenuSidebarMockup() {
  const bars = [40, 65, 50, 80, 55, 70, 45];
  return (
    <Frame url="app.vibra.com/dashboard" desktop tall>
      <Div className="flex gap-2" style={{ minHeight: 280 }}>
        {/* Sidebar */}
        <Div className="relative w-[38%] rounded-lg bg-secondary/40 border border-border p-2 flex flex-col">
          <Callout n={1} className="-top-1 -left-1" />
          <Div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary mb-2">V</Div>
          <Div className="space-y-0.5 flex-1">
            {NAV_ITEMS.map((it, i) => (
              <Div key={i} className={`flex items-center gap-1.5 px-1.5 py-1 rounded text-[8px] ${i === 0 ? 'bg-primary/10 text-foreground font-semibold' : 'text-muted-foreground'}`}>
                <it.icon className="w-2.5 h-2.5" />
                <Span>{it.label}</Span>
              </Div>
            ))}
            {/* Il Mio Vibra espanso */}
            <Div className="relative mt-1">
              <Callout n={2} className="-top-1 -left-1" />
              <Div className="flex items-center gap-1.5 px-1.5 py-1 rounded text-[8px] text-primary font-semibold bg-primary/5">
                <Trophy className="w-2.5 h-2.5" />Il Mio Vibra
              </Div>
              <Div className="pl-3 border-l border-primary/20 ml-2 mt-0.5 space-y-0.5">
                <Div className="text-[7px] text-muted-foreground px-1">Guadagni</Div>
                <Div className="text-[7px] text-muted-foreground px-1">Team</Div>
                <Div className="text-[7px] text-muted-foreground px-1">Note</Div>
                <Div className="text-[7px] text-muted-foreground px-1">Achievement</Div>
              </Div>
            </Div>
            {/* Cerca */}
            <Div className="relative flex items-center gap-1.5 px-1.5 py-1 rounded text-[8px] text-muted-foreground mt-1 border-t border-border pt-1.5">
              <Callout n={3} className="-top-1 -left-1" />
              <Search className="w-2.5 h-2.5" />
              <Span>Cerca</Span>
              <Span className="ml-auto text-[6px] text-muted-foreground bg-secondary/60 px-1 rounded">⌘K</Span>
            </Div>
          </Div>
          {/* profilo in fondo */}
          <Div className="relative flex items-center gap-1.5 rounded-md bg-secondary/60 p-1.5 mt-1">
            <Callout n={4} className="-top-1.5 -left-1.5" />
            <Avatar initials="MR" size="w-6 h-6" text="text-[7px]" />
            <Div className="min-w-0">
              <Div className="text-[8px] font-semibold text-foreground truncate">Marco Rossi</Div>
              <Div className="text-[7px] text-muted-foreground truncate">PR</Div>
            </Div>
          </Div>
        </Div>
        {/* Contenuto principale */}
        <Div className="flex-1 rounded-lg bg-card border border-border p-2">
          <Div className="flex items-center justify-between mb-1.5">
            <Span className="text-[10px] font-bold text-foreground">Dashboard</Span>
            <Span className="text-[8px] text-muted-foreground">Lug 2026</Span>
          </Div>
          <Div className="grid grid-cols-3 gap-1 mb-2">
            <Div className="rounded bg-secondary/40 p-1.5 text-center"><Div className="text-[7px] text-muted-foreground">Fatturato</Div><Div className="text-[10px] font-bold text-primary">€142K</Div></Div>
            <Div className="rounded bg-secondary/40 p-1.5 text-center"><Div className="text-[7px] text-muted-foreground">Attivi</Div><Div className="text-[10px] font-bold text-green-400">12</Div></Div>
            <Div className="rounded bg-secondary/40 p-1.5 text-center"><Div className="text-[7px] text-muted-foreground">Clienti</Div><Div className="text-[10px] font-bold text-foreground">847</Div></Div>
          </Div>
          <Div className="rounded bg-secondary/40 p-2">
            <Div className="text-[8px] text-muted-foreground mb-1">Fatturato mensile</Div>
            <Div className="flex items-end gap-1 h-16">
              {bars.map((h, i) => <Div key={i} className="flex-1 bg-primary/50 rounded-t" style={{ height: h + '%' }} />)}
            </Div>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── BARRA DI NAVIGAZIONE IN BASSO (mobile) ─────────────────
// Riproduce la vera MobileNavBar: Dashboard, Weekend, Clienti, Cerca, Il Mio (5 voci)
// con pill attiva e indicatori colorati.
export function MenuBottomNavMockup() {
  const items = [
    { icon: LayoutGrid, label: 'Dashboard' },
    { icon: Send, label: 'Weekend' },
    { icon: ContactRound, label: 'Clienti' },
    { icon: Search, label: 'Cerca' },
    { icon: BrainCircuit, label: 'Il Mio', isVibra: true },
  ];
  const active = 3; // Cerca attivo
  return (
    <Frame url="Vibra" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Clienti</Span>
        <Menu className="w-4 h-4 text-foreground/60" />
      </Div>
      <Div className="space-y-1.5 mb-2">
        <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Avatar initials="LE" />
          <Div className="flex-1 min-w-0"><Div className="text-[9px] font-semibold text-foreground truncate">Luca Esposito</Div><Div className="text-[7px] text-muted-foreground">24 pres. · €201</Div></Div>
          <Span className="text-[9px] font-bold text-amber-400">8.5</Span>
        </Div>
        <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" />
          <Div className="flex-1 min-w-0"><Div className="text-[9px] font-semibold text-foreground truncate">Giorgia Russo</Div><Div className="text-[7px] text-muted-foreground">18 pres. · €165</Div></Div>
          <Span className="text-[9px] font-bold text-muted-foreground">6.2</Span>
        </Div>
      </Div>
      {/* Barra fissa in basso (layout reale a 5 voci) */}
      <Div className="absolute bottom-3 left-3 right-3">
        <Div className="relative rounded-xl bg-card border border-border px-1.5 py-1.5 shadow-lg">
          <Callout n={1} className="-top-2 left-2" />
          {/* pill attiva */}
          <Div className="absolute flex items-center justify-center pointer-events-none"
            style={{ width: '20%', height: 28, top: 2, left: 0, transform: `translateX(${active * 100}%)` }}>
            <Div className="rounded-full" style={{ width: 32, height: 28, background: 'hsl(var(--primary)/0.15)', border: '1px solid hsl(var(--primary)/0.3)' }} />
          </Div>
          <Div className="relative flex items-center justify-around">
            {items.map((it, i) => (
              <Div key={i} className="flex flex-col items-center gap-0.5 flex-1">
                {it.isVibra
                  ? <Div className="w-5 h-5 rounded bg-primary/15 flex items-center justify-center text-[6px] font-bold text-primary">V</Div>
                  : <Div className="relative">
                      {i === active && <Callout n={2} className="-top-2 -left-1" />}
                      <it.icon className="w-4 h-4" style={{ color: i === active ? 'hsl(var(--primary))' : 'hsl(240,5%,50%)' }} strokeWidth={i === active ? 2.2 : 1.8} />
                    </Div>}
                <Span className="text-[7px] leading-none" style={{ color: i === active ? 'hsl(var(--primary))' : 'hsl(240,5%,50%)', opacity: i === active ? 1 : 0.5 }}>{it.label}</Span>
              </Div>
            ))}
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── PROFILO (mobile + desktop) ─────────────────────────────
export function MenuProfileMockup() {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Sheet account su mobile
    return (
      <Frame url="Vibra · Profilo" tall>
        <Div className="relative flex items-center gap-2 mb-2 pb-2 border-b border-border">
          <Callout n={1} className="-top-1 -left-1" />
          <Avatar initials="MR" size="w-10 h-10" text="text-[10px]" />
          <Div className="relative flex-1 min-w-0">
            <Callout n={2} className="-top-1 -left-1" />
            <Div className="text-[11px] font-bold text-foreground truncate">Marco Rossi</Div>
            <Div className="text-[8px] text-muted-foreground truncate">PR · Posillipo</Div>
          </Div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Div>
        <Div className="space-y-1">
          <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <Span className="text-[9px] text-foreground/80 flex-1">Il Mio Vibra</Span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </Div>
          <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
            <SettingsIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <Span className="text-[9px] text-foreground/80 flex-1">Impostazioni</Span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </Div>
          <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
            <Bell className="w-3.5 h-3.5 text-muted-foreground" />
            <Span className="text-[9px] text-foreground/80 flex-1">Notifiche Push</Span>
            <Div className="w-7 h-3.5 rounded-full bg-primary p-0.5"><Div className="w-2.5 h-2.5 rounded-full bg-primary-foreground ml-auto" /></Div>
          </Div>
        </Div>
        <Div className="relative flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-2 mt-2">
          <Callout n={3} className="-top-1.5 -left-1.5" />
          <LogOut className="w-3.5 h-3.5 text-red-400" />
          <Span className="text-[9px] text-red-400 font-semibold">Esci</Span>
        </Div>
      </Frame>
    );
  }

  // Sidebar footer con dropdown su desktop
  return (
    <Frame url="app.vibra.com" desktop tall>
      <Div className="flex gap-2" style={{ minHeight: 260 }}>
        <Div className="w-[38%] rounded-lg bg-secondary/40 border border-border p-2 flex flex-col">
          <Div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-[9px] font-bold text-primary mb-2">V</Div>
          <Div className="space-y-0.5 flex-1">
            {NAV_ITEMS.slice(0, 4).map((it, i) => (
              <Div key={i} className="flex items-center gap-1.5 px-1.5 py-1 rounded text-[8px] text-muted-foreground">
                <it.icon className="w-2.5 h-2.5" />
                <Span>{it.label}</Span>
              </Div>
            ))}
          </Div>
          {/* profilo footer con dropdown */}
          <Div className="relative">
            <Callout n={1} className="-top-1.5 -left-1.5" />
            <Div className="flex items-center gap-1.5 rounded-md bg-secondary/60 p-1.5">
              <Avatar initials="MR" size="w-6 h-6" text="text-[7px]" />
              <Div className="min-w-0 flex-1">
                <Div className="text-[8px] font-semibold text-foreground truncate">Marco Rossi</Div>
                <Div className="text-[7px] text-muted-foreground truncate">PR</Div>
              </Div>
              <ChevronRight className="w-3 h-3 text-muted-foreground rotate-90" />
            </Div>
            <Div className="absolute bottom-full left-0 right-0 mb-1 rounded-lg bg-card border border-border p-1.5 shadow-xl">
              <Callout n={2} className="-top-1.5 -left-1.5" />
              <Div className="flex items-center gap-1.5 px-1 py-1 rounded text-[8px] text-foreground/80"><Trophy className="w-3 h-3 text-primary" />Il Mio Vibra</Div>
              <Div className="flex items-center gap-1.5 px-1 py-1 rounded text-[8px] text-foreground/80"><SettingsIcon className="w-3 h-3" />Impostazioni</Div>
              <Div className="relative flex items-center gap-1.5 px-1 py-1 rounded text-[8px] text-red-400 mt-0.5 border-t border-border pt-1">
                <Callout n={3} className="-top-1 -left-1" />
                <LogOut className="w-3 h-3" />Esci
              </Div>
            </Div>
          </Div>
        </Div>
        <Div className="flex-1 rounded-lg bg-card border border-border p-2">
          <Div className="text-[10px] font-bold text-foreground mb-1.5">Dashboard</Div>
          <Div className="grid grid-cols-2 gap-1">
            <Div className="rounded bg-secondary/40 p-1.5 text-center"><Div className="text-[7px] text-muted-foreground">Fatturato</Div><Div className="text-[10px] font-bold text-primary">€142K</Div></Div>
            <Div className="rounded bg-secondary/40 p-1.5 text-center"><Div className="text-[7px] text-muted-foreground">Attivi</Div><Div className="text-[10px] font-bold text-green-400">12</Div></Div>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}