// Port di src/components/academy/mockups/AcademyTabMockups.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import {
  Search, X, LayoutGrid, Send, ContactRound, Sparkles, Users, CalendarRange,
  Building2, Map as MapIcon, Settings2, SlidersHorizontal, ChevronRight,
  Wine, FileText, Expand, Euro, Trophy, Star,
} from '@/ui/icons.generated';
import { Callout, Frame, Avatar } from './shared';

import { Div, Span } from '@/ui/html';

// ── Mini barra di navigazione reale (5 voci: Dashboard, Weekend, Clienti, Cerca, Il Mio) ──
function MiniBottomNav({ active = 0, callout }) {
  const items = [
    { icon: LayoutGrid, label: 'Dashboard' },
    { icon: Send, label: 'Weekend' },
    { icon: ContactRound, label: 'Clienti' },
    { icon: Search, label: 'Cerca' },
    { icon: Sparkles, label: 'Il Mio', isVibra: true },
  ];
  return (
    <Div className="absolute bottom-3 left-3 right-3">
      <Div className="relative rounded-xl bg-card border border-border px-1.5 py-1.5 shadow-lg">
        {callout && <Callout n={callout} className="-top-2 left-2" />}
        {/* pill attiva */}
        <Div className="absolute flex items-center justify-center pointer-events-none"
          style={{ width: '20%', height: 26, top: 2, left: 0, transform: `translateX(${active * 100}%)` }}>
          <Div className="rounded-full" style={{ width: 28, height: 26, background: 'hsl(var(--primary)/0.15)', border: '1px solid hsl(var(--primary)/0.3)' }} />
        </Div>
        <Div className="relative flex items-center justify-around">
          {items.map((it, i) => (
            <Div key={i} className="flex flex-col items-center gap-0.5 flex-1">
              {it.isVibra
                ? <Div className="w-4 h-4 rounded bg-primary/15 flex items-center justify-center text-[6px] font-bold text-primary">V</Div>
                : <it.icon className="w-3.5 h-3.5" style={{ color: i === active ? 'hsl(var(--primary))' : 'hsl(240,5%,50%)' }} />}
              <Span className="text-[7px] leading-none" style={{ color: i === active ? 'hsl(var(--primary))' : 'hsl(240,5%,50%)', opacity: i === active ? 1 : 0.5 }}>{it.label}</Span>
            </Div>
          ))}
        </Div>
      </Div>
    </Div>
  );
}

// ── Mini box di ricerca (replica del VibraSearch: header vetro + input + body) ──
function SearchDialogFrame({ query = '', placeholder = 'Cerca...', headerCallout, children }) {
  return (
    <Frame url="Vibra · Cerca" tall>
      <Div className="relative rounded-xl border border-white/10 overflow-hidden mb-2"
        style={{ backgroundColor: 'hsl(var(--background) / 0.55)', backdropFilter: 'blur(8px) saturate(160%)', WebkitBackdropFilter: 'blur(8px) saturate(160%)' }}>
        {headerCallout && <Callout n={headerCallout} className="-top-1.5 -left-1.5" />}
        <Div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
        {/* header */}
        <Div className="flex items-center gap-2 px-2.5 pt-2 pb-1.5">
          <Div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/15 shrink-0">
            <Search className="w-3 h-3 text-primary" />
          </Div>
          <Span className="text-[11px] font-bold text-foreground flex-1 leading-none">Cerca</Span>
          <Div className="w-5 h-5 rounded-md bg-secondary/50 border border-border flex items-center justify-center">
            <X className="w-2.5 h-2.5 text-muted-foreground" />
          </Div>
        </Div>
        {/* input */}
        <Div className="px-2.5 pb-2">
          <Div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
            <Div className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-secondary/40 border border-border text-[10px] text-foreground/80 truncate">
              {query || <Span className="text-muted-foreground">{placeholder}</Span>}
            </Div>
          </Div>
        </Div>
      </Div>
      <Div className="space-y-2">{children}</Div>
    </Frame>
  );
}

// ── Mini gruppo di risultati ──
function MiniGroup({ title, color, icon: Icon, count, callout, children }) {
  return (
    <Div className="relative rounded-xl overflow-hidden border border-white/[0.08]">
      <Div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <Div className="relative flex items-center gap-1.5 px-2.5 py-1.5 border-b border-white/[0.06]">
        {callout && <Callout n={callout} className="-top-1 -right-1" />}
        <Icon className="w-3 h-3" style={{ color }} />
        <Span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color }}>{title}</Span>
        <Span className="text-[8px] text-muted-foreground ml-auto bg-white/5 rounded px-1">{count}</Span>
      </Div>
      <Div className="p-1">{children}</Div>
    </Div>
  );
}

// ── BENVENUTO: Cosa fa Vibra (home mobile con barra reale) ──
export function BenvenutoCosaMockup() {
  const bars = [40, 65, 50, 80, 55, 70, 45];
  return (
    <Frame url="Vibra · Home" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Dashboard</Span>
        <Span className="text-[8px] text-muted-foreground">Lug 2026</Span>
      </Div>
      <Div className="grid grid-cols-3 gap-1 mb-2">
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center"><Div className="text-[7px] text-muted-foreground">Fatturato</Div><Div className="text-[10px] font-bold text-primary">€142K</Div></Div>
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center"><Div className="text-[7px] text-muted-foreground">Attivi</Div><Div className="text-[10px] font-bold text-green-400">12</Div></Div>
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center"><Div className="text-[7px] text-muted-foreground">Clienti</Div><Div className="text-[10px] font-bold text-foreground">847</Div></Div>
      </Div>
      <Div className="rounded-lg bg-card border border-border p-2 mb-2">
        <Div className="text-[9px] font-semibold text-foreground mb-1">Fatturato mensile</Div>
        <Div className="flex items-end gap-1 h-10">{bars.map((h, i) => <Div key={i} className="flex-1 bg-primary/50 rounded-t" style={{ height: h + '%' }} />)}</Div>
      </Div>
      <Div className="rounded-lg bg-card border border-border p-2">
        <Div className="text-[9px] font-semibold text-foreground mb-1">Top Promoters</Div>
        <Div className="flex items-center gap-1.5"><Avatar initials="MR" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/80 flex-1">Marco Rossi</Span><Span className="text-[8px] font-bold text-green-400">€28K</Span></Div>
      </Div>
      <MiniBottomNav active={0} callout={1} />
    </Frame>
  );
}

// ── BENVENUTO: Come usare questa guida (pagina academy) ──
export function BenvenutoGuidaMockup() {
  const pills = ['Benvenuto', 'Ricerca', 'Menu', 'Clienti', 'Weekend', 'Serate'];
  return (
    <Frame url="Vibra · Guida" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Guida all'uso</Span>
      </Div>
      <Div className="relative mb-2">
        <Callout n={2} className="-top-1.5 -right-1" />
        <Div className="relative flex items-center gap-1.5 rounded-xl bg-card border border-border px-2.5 py-1.5">
          <Search className="w-3 h-3 text-muted-foreground" />
          <Span className="text-[9px] text-muted-foreground">Cerca una funzione o sezione...</Span>
        </Div>
      </Div>
      <Div className="relative flex gap-1 overflow-hidden mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        {pills.map((p, i) => (
          <Div key={i} className={`px-2 py-1 rounded-lg text-[8px] whitespace-nowrap ${i === 0 ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-secondary/40 text-muted-foreground border border-border'}`}>{p}</Div>
        ))}
      </Div>
      <Div className="space-y-1.5">
        <Div className="rounded-lg bg-card border border-border p-2"><Div className="text-[9px] font-semibold text-foreground">Benvenuto in Vibra</Div><Div className="text-[8px] text-muted-foreground">2 lezioni</Div></Div>
        <Div className="rounded-lg bg-card border border-border p-2"><Div className="text-[9px] font-semibold text-foreground">Ricerca</Div><Div className="text-[8px] text-muted-foreground">6 lezioni</Div></Div>
        <Div className="rounded-lg bg-card border border-border p-2"><Div className="text-[9px] font-semibold text-foreground">Menu e Navigazione</Div><Div className="text-[8px] text-muted-foreground">4 lezioni</Div></Div>
      </Div>
    </Frame>
  );
}

// ── RICERCA: Aprire la ricerca (dialog aperto con risultati raggruppati) ──
export function RicercaApriMockup() {
  return (
    <SearchDialogFrame query="ammare" headerCallout={1}>
      <MiniGroup title="Serate" color="#60a5fa" icon={CalendarRange} count={1} callout={2}>
        <Div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
          <Div className="w-6 h-6 rounded bg-blue-400/20 flex items-center justify-center text-[7px] font-bold text-blue-400">AM</Div>
          <Div className="flex-1 min-w-0"><Div className="text-[9px] font-semibold text-foreground truncate">Ammare Frontemare</Div><Div className="text-[7px] text-muted-foreground">Ven 18 Lug</Div></Div>
          <Span className="text-[9px] font-bold text-primary">€3.200</Span>
        </Div>
      </MiniGroup>
      <MiniGroup title="Locali" color="#34d399" icon={Building2} count={1}>
        <Div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
          <Div className="w-6 h-6 rounded bg-emerald-400/20 flex items-center justify-center text-[7px] font-bold text-emerald-400">AM</Div>
          <Div className="flex-1 min-w-0"><Div className="text-[9px] font-semibold text-foreground truncate">Ammare</Div><Div className="text-[7px] text-muted-foreground">Locale · Ven</Div></Div>
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        </Div>
      </MiniGroup>
    </SearchDialogFrame>
  );
}

// ── RICERCA: Cosa puoi cercare (più gruppi) ──
export function RicercaCosaMockup() {
  return (
    <SearchDialogFrame query="marco">
      <MiniGroup title="Clienti" color="#a78bfa" icon={Users} count={1} callout={1}>
        <Div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
          <Avatar initials="MF" size="w-6 h-6" text="text-[7px]" />
          <Div className="flex-1 min-w-0"><Div className="text-[9px] font-semibold text-foreground truncate">Marco Ferrara</Div><Div className="text-[7px] text-muted-foreground">@marco.f</Div></Div>
          <Span className="text-[8px] text-muted-foreground">333 12..</Span>
        </Div>
      </MiniGroup>
      <MiniGroup title="Serate" color="#60a5fa" icon={CalendarRange} count={1} callout={2}>
        <Div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
          <Div className="w-6 h-6 rounded bg-blue-400/20 flex items-center justify-center text-[7px] font-bold text-blue-400">VI</Div>
          <Div className="flex-1 min-w-0"><Div className="text-[9px] font-semibold text-foreground truncate">Vibe Club · Marco</Div><Div className="text-[7px] text-muted-foreground">Dom 20 Lug</Div></Div>
          <Span className="text-[9px] font-bold text-primary">€2.100</Span>
        </Div>
      </MiniGroup>
      <MiniGroup title="Sezioni" color="#60a5fa" icon={SlidersHorizontal} count={1}>
        <Div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
          <Div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center"><Euro className="w-3 h-3 text-primary" /></Div>
          <Span className="text-[9px] text-foreground flex-1">Guadagni</Span>
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        </Div>
      </MiniGroup>
    </SearchDialogFrame>
  );
}

// ── RICERCA: Clienti (solo i tuoi) ──
export function RicercaClientiMockup() {
  return (
    <SearchDialogFrame query="luca">
      <MiniGroup title="Clienti" color="#a78bfa" icon={Users} count={2} callout={1}>
        <Div className="grid grid-cols-[1fr_auto] gap-1 px-2 py-1 text-[7px] font-semibold uppercase tracking-wider text-muted-foreground/70 border-b border-white/[0.06]">
          <Span>Cliente</Span><Span className="text-right">Contatto</Span>
        </Div>
        <Div className="grid grid-cols-[1fr_auto] gap-1 items-center px-2 py-1.5 rounded-lg">
          <Span className="flex items-center gap-1.5"><Avatar initials="LE" size="w-5 h-5" text="text-[6px]" /><Span className="text-[9px] text-foreground truncate">Luca Esposito</Span></Span>
          <Span className="text-[8px] text-muted-foreground">333 12..</Span>
        </Div>
        <Div className="grid grid-cols-[1fr_auto] gap-1 items-center px-2 py-1.5 rounded-lg">
          <Span className="flex items-center gap-1.5"><Avatar initials="LB" size="w-5 h-5" text="text-[6px]" grad="from-amber-400/60 to-amber-400/20" /><Span className="text-[9px] text-foreground truncate">Lucia Bianchi</Span></Span>
          <Span className="text-[8px] text-muted-foreground">347 88..</Span>
        </Div>
      </MiniGroup>
    </SearchDialogFrame>
  );
}

// ── RICERCA: Serate e prospetto (espanso) ──
export function RicercaSerateMockup() {
  return (
    <SearchDialogFrame query="ammare">
      <MiniGroup title="Serate" color="#60a5fa" icon={CalendarRange} count={1} callout={1}>
        <Div className="rounded-lg border border-primary/30 p-1.5">
          <Div className="flex items-center gap-2">
            <Div className="w-6 h-6 rounded bg-blue-400/20 flex items-center justify-center text-[7px] font-bold text-blue-400">AM</Div>
            <Div className="flex-1 min-w-0"><Div className="text-[9px] font-semibold text-foreground truncate">Ammare Frontemare</Div><Div className="text-[7px] text-muted-foreground">Ven 18 Lug</Div></Div>
            <Div className="text-right"><Span className="text-[9px] font-bold text-primary block">€3.200</Span><Span className="text-[7px] text-muted-foreground">8 tav.</Span></Div>
          </Div>
          {/* prospetto promoter */}
          <Div className="relative mt-1.5 pt-1.5 border-t border-white/[0.06] space-y-1">
            <Callout n={2} className="-top-1 -right-1" />
            <Div className="grid grid-cols-[1fr_auto_auto] gap-1 px-1 text-[6px] font-semibold uppercase text-muted-foreground/70 border-b border-white/[0.06] pb-0.5">
              <Span>Promoter</Span><Span className="text-right">%</Span><Span className="text-right">Fat.</Span>
            </Div>
            <Div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center px-1">
              <Span className="flex items-center gap-1"><Avatar initials="MR" size="w-4 h-4" text="text-[5px]" /><Span className="text-[8px] text-foreground truncate">Marco Rossi</Span></Span>
              <Span className="text-[7px] text-muted-foreground text-right">38%</Span><Span className="text-[8px] font-bold text-primary text-right">€1.216</Span>
            </Div>
            <Div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center px-1">
              <Span className="flex items-center gap-1"><Avatar initials="GD" size="w-4 h-4" text="text-[5px]" grad="from-amber-400/60 to-amber-400/20" /><Span className="text-[8px] text-foreground truncate">Giulia D'Amato</Span></Span>
              <Span className="text-[7px] text-muted-foreground text-right">30%</Span><Span className="text-[8px] font-bold text-primary text-right">€960</Span>
            </Div>
          </Div>
        </Div>
      </MiniGroup>
    </SearchDialogFrame>
  );
}

// ── RICERCA: Materiale locali ──
export function RicercaMaterialeMockup() {
  return (
    <SearchDialogFrame query="piantina ammare">
      <MiniGroup title="Materiale Locali" color="#4ade80" icon={MapIcon} count={1} callout={1}>
        <Div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
          <Div className="w-6 h-6 rounded bg-secondary/40 flex items-center justify-center"><MapIcon className="w-3 h-3 text-emerald-400" /></Div>
          <Div className="flex-1 min-w-0"><Div className="text-[9px] font-semibold text-foreground truncate">Ammare</Div><Div className="text-[7px] text-muted-foreground">Piantina</Div></Div>
          <Expand className="w-3 h-3 text-muted-foreground" />
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        </Div>
      </MiniGroup>
    </SearchDialogFrame>
  );
}

// ── RICERCA: Sezioni e impostazioni ──
export function RicercaSezioniMockup() {
  return (
    <SearchDialogFrame query="branding">
      <MiniGroup title="Sezioni" color="#60a5fa" icon={SlidersHorizontal} count={1} callout={1}>
        <Div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
          <Div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center"><Trophy className="w-3 h-3 text-primary" /></Div>
          <Span className="text-[9px] text-foreground flex-1">Achievement</Span>
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        </Div>
      </MiniGroup>
      <MiniGroup title="Impostazioni" color="#f59e0b" icon={Settings2} count={1} callout={2}>
        <Div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
          <Div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center"><Settings2 className="w-3 h-3 text-primary" /></Div>
          <Span className="text-[9px] text-foreground flex-1">Branding</Span>
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        </Div>
      </MiniGroup>
    </SearchDialogFrame>
  );
}