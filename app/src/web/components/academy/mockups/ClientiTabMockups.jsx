// Port di src/components/academy/mockups/ClientiTabMockups.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Search, Table2, MapPin, Users, Star, TrendingUp, TrendingDown, MessageCircle, Instagram, Sparkles, Trophy, Plus, Wallet, GitBranch, BarChart2, Save, CalendarDays, UserPlus, FolderOpen, Check, ChevronDown, AlertCircle, Upload, CalendarPlus } from '@/ui/icons.generated';
import { Callout, Frame, Avatar } from './shared';

import { Btn, Div, P, Span } from '@/ui/html';
import { Path, Svg } from '@/ui/elements';

const CLIENTI_TABS = [
  { key: 'clienti', label: 'Clienti' },
  { key: 'gruppi', label: 'Gruppi' },
  { key: 'parco', label: 'Parco' },
  { key: 'albero', label: 'Albero' },
  { key: 'tabelle', label: 'Tabelle' },
  { key: 'analitica', label: 'Analitica' },
  { key: 'mappa', label: 'Mappa' },
];

function ClientiTabBar({ active }) {
  return (
    <Div className="flex gap-0.5 bg-secondary/30 p-0.5 rounded-lg mb-2 overflow-x-auto no-scrollbar">
      {CLIENTI_TABS.map(t => (
        <Div key={t.key} className={"py-1 px-1.5 rounded-md shrink-0 " + (t.key === active ? "bg-card text-[9px] font-semibold" : "text-muted-foreground text-[9px]")}>{t.label}</Div>
      ))}
    </Div>
  );
}

// ── CLIENTI · TAB TABELLE ────────────────────────────────────
export function ClientiTabelleMockup() {
  return (
    <Frame url="Clienti · Tabelle" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Clienti</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <ClientiTabBar active="tabelle" />
      </Div>
      {/* Grid 2x2 bacheche */}
      <Div className="grid grid-cols-2 gap-1.5">
        <Div className="relative rounded-lg bg-card border border-purple-500/20 p-2" style={{ borderTop: '2px solid rgba(167,139,250,0.3)' }}>
          <Callout n={2} className="-top-1 -left-1" />
          <Div className="flex items-center gap-1 mb-1"><Sparkles className="w-3 h-3 text-purple-400" /><Span className="text-[9px] font-bold text-purple-400">Nuovi</Span></Div>
          <Div className="space-y-1">
            <Div className="flex items-center gap-1"><Avatar initials="SC" grad="from-green-400/50 to-green-400/10" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate flex-1">Sara Costa</Span><Span className="text-[7px] text-muted-foreground">1 pres.</Span></Div>
            <Div className="flex items-center gap-1"><Avatar initials="DV" grad="from-green-400/50 to-green-400/10" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate flex-1">Diego Vitale</Span><Span className="text-[7px] text-muted-foreground">2 pres.</Span></Div>
          </Div>
        </Div>
        <Div className="relative rounded-lg bg-card border border-amber-500/20 p-2" style={{ borderTop: '2px solid rgba(250,204,21,0.3)' }}>
          <Callout n={3} className="-top-1 -left-1" />
          <Div className="flex items-center gap-1 mb-1"><Trophy className="w-3 h-3 text-amber-400" /><Span className="text-[9px] font-bold text-amber-400">Top Paganti</Span></Div>
          <Div className="space-y-1">
            <Div className="flex items-center gap-1"><Avatar initials="LE" grad="from-purple-400/60 to-purple-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate flex-1">L. Esposito</Span><Span className="text-[7px] text-amber-400">8.5</Span></Div>
            <Div className="flex items-center gap-1"><Avatar initials="MF" grad="from-amber-400/60 to-amber-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate flex-1">M. Ferrara</Span><Span className="text-[7px] text-amber-400">7.8</Span></Div>
          </Div>
        </Div>
        <Div className="relative rounded-lg bg-card border border-orange-500/20 p-2" style={{ borderTop: '2px solid rgba(245,158,11,0.3)' }}>
          <Callout n={4} className="-top-1 -left-1" />
          <Div className="flex items-center gap-1 mb-1"><Star className="w-3 h-3 text-orange-400" /><Span className="text-[9px] font-bold text-orange-400">Leader Inattivi</Span></Div>
          <Div className="space-y-1">
            <Div className="flex items-center gap-1"><Avatar initials="AB" grad="from-blue-400/60 to-blue-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate flex-1">A. Bruno</Span></Div>
          </Div>
        </Div>
        <Div className="relative rounded-lg bg-card border border-red-500/20 p-2" style={{ borderTop: '2px solid rgba(239,68,68,0.3)' }}>
          <Callout n={5} className="-top-1 -left-1" />
          <Div className="flex items-center gap-1 mb-1"><TrendingDown className="w-3 h-3 text-red-400" /><Span className="text-[9px] font-bold text-red-400">In Calo</Span></Div>
          <Div className="space-y-1">
            <Div className="flex items-center gap-1"><Avatar initials="MF" grad="from-amber-400/60 to-amber-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate flex-1">M. Ferrara</Span><TrendingDown className="w-2.5 h-2.5 text-red-400" /></Div>
            <Div className="flex items-center gap-1"><Avatar initials="LB" grad="from-pink-400/60 to-pink-400/20" size="w-4 h-4" text="text-[6px]" /><Span className="text-[8px] text-foreground/70 truncate flex-1">L. Bianchi</Span><TrendingDown className="w-2.5 h-2.5 text-red-400" /></Div>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── CLIENTI · TAB MAPPA ──────────────────────────────────────
export function ClientiMappaMockup() {
  return (
    <Frame url="Clienti · Mappa" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Clienti</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <ClientiTabBar active="mappa" />
      </Div>
      {/* Map area */}
      <Div className="relative rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-border overflow-hidden" style={{ minHeight: '180px' }}>
        <Callout n={2} className="top-1.5 left-1.5" />
        {/* Faux streets */}
        <Svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 180">
          <Path d="M0 60 L200 60 M0 120 L200 120 M60 0 L60 180 M140 0 L140 180" stroke="#666" strokeWidth="1" fill="none" />
          <Path d="M0 30 L200 30 M0 90 L200 90 M0 150 L200 150 M30 0 L30 180 M100 0 L100 180 M170 0 L170 180" stroke="#444" strokeWidth="0.5" fill="none" />
        </Svg>
        {/* Cluster */}
        <Div className="absolute" style={{ top: '30%', left: '25%' }}>
          <Div className="relative w-7 h-7 rounded-full bg-primary/80 border-2 border-background flex items-center justify-center text-[9px] font-bold text-primary-foreground">12</Div>
        </Div>
        {/* Single markers */}
        <Div className="absolute" style={{ top: '50%', left: '45%' }}>
          <Div className="w-4 h-4 rounded-full bg-purple-400 border-2 border-background" />
        </Div>
        <Div className="absolute" style={{ top: '60%', left: '70%' }}>
          <Div className="relative w-5 h-5 rounded-full bg-amber-400 border-2 border-background flex items-center justify-center"><Star className="w-2.5 h-2.5 text-amber-900 fill-amber-900" /></Div>
        </Div>
        <Div className="absolute" style={{ top: '75%', left: '30%' }}>
          <Div className="w-4 h-4 rounded-full bg-pink-400 border-2 border-background" />
        </Div>
        {/* Legend bottom bar */}
        <Div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur p-1.5">
          <Callout n={3} className="-top-2 right-1.5" />
          <Div className="flex items-center gap-1.5 text-[8px]">
            <Div className="w-2.5 h-2.5 rounded-full bg-purple-400" /><Span className="text-muted-foreground">Cliente</Span>
            <Div className="w-2.5 h-2.5 rounded-full bg-amber-400" /><Span className="text-muted-foreground">Leader</Span>
            <Div className="w-4 h-4 rounded-full bg-primary/80 flex items-center justify-center text-[6px] text-white">N</Div><Span className="text-muted-foreground">Gruppo</Span>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── CLIENTI · TAB GRUPPI ──────────────────────────────────────
export function ClientiGruppiMockup() {
  return (
    <Frame url="Clienti · Gruppi" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Clienti</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <ClientiTabBar active="gruppi" />
      </Div>
      {/* Create button */}
      <Div className="relative mb-2">
        <Callout n={2} className="-top-1.5 -left-1.5" />
        <Btn
          button
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-dashed border-border text-[10px] text-muted-foreground w-full justify-center"><Plus className="w-3 h-3" />Crea nuovo gruppo</Btn>
      </Div>
      {/* Group cards */}
      <Div className="space-y-1.5">
        <Div className="relative rounded-lg bg-card border border-purple-500/20 p-2.5" style={{ borderLeft: '3px solid #a78bfa' }}>
          <Callout n={3} className="-top-1 -left-1" />
          <Div className="flex items-center justify-between mb-1.5">
            <Div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-purple-400" /><Span className="text-[10px] font-bold text-foreground">Amici Posillipo</Span></Div>
            <Span className="text-[8px] text-muted-foreground bg-secondary/40 px-1.5 py-0.5 rounded-full">8 clienti</Span>
          </Div>
          <Div className="flex -space-x-1.5">
            <Avatar initials="LE" grad="from-purple-400/60 to-purple-400/20" size="w-5 h-5" text="text-[6px]" />
            <Avatar initials="MF" grad="from-amber-400/60 to-amber-400/20" size="w-5 h-5" text="text-[6px]" />
            <Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" size="w-5 h-5" text="text-[6px]" />
            <Avatar initials="AB" grad="from-blue-400/60 to-blue-400/20" size="w-5 h-5" text="text-[6px]" />
            <Div className="w-5 h-5 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[7px] text-muted-foreground">+4</Div>
          </Div>
        </Div>
        <Div className="rounded-lg bg-card border border-green-500/20 p-2.5" style={{ borderLeft: '3px solid #4ade80' }}>
          <Div className="flex items-center justify-between mb-1.5">
            <Div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-green-400" /><Span className="text-[10px] font-bold text-foreground">VIP Borgo</Span></Div>
            <Span className="text-[8px] text-muted-foreground bg-secondary/40 px-1.5 py-0.5 rounded-full">5 clienti</Span>
          </Div>
          <Div className="flex -space-x-1.5">
            <Avatar initials="SC" grad="from-green-400/50 to-green-400/10" size="w-5 h-5" text="text-[6px]" />
            <Avatar initials="DV" grad="from-green-400/50 to-green-400/10" size="w-5 h-5" text="text-[6px]" />
            <Avatar initials="LB" grad="from-pink-400/60 to-pink-400/20" size="w-5 h-5" text="text-[6px]" />
          </Div>
        </Div>
        <Div className="rounded-lg bg-card border border-amber-500/20 p-2.5" style={{ borderLeft: '3px solid #facc15' }}>
          <Div className="flex items-center justify-between mb-1.5">
            <Div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-amber-400" /><Span className="text-[10px] font-bold text-foreground">Compleanno Antonio</Span></Div>
            <Span className="text-[8px] text-muted-foreground bg-secondary/40 px-1.5 py-0.5 rounded-full">12 clienti</Span>
          </Div>
          <Div className="flex -space-x-1.5">
            <Avatar initials="AM" grad="from-blue-400/60 to-blue-400/20" size="w-5 h-5" text="text-[6px]" />
            <Avatar initials="LE" grad="from-purple-400/60 to-purple-400/20" size="w-5 h-5" text="text-[6px]" />
            <Div className="w-5 h-5 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[7px] text-muted-foreground">+10</Div>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── CLIENTI · TAB LISTA (main) ───────────────────────────────
export function ClientiListaMockup() {
  return (
    <Frame url="Clienti · Lista" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Clienti</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <ClientiTabBar active="clienti" />
      </Div>
      <Div className="relative mb-2">
        <Callout n={2} className="-top-1.5 -left-1.5" />
        <Div className="flex items-center gap-1.5 rounded-lg bg-card border border-border px-2 py-1.5">
          <Search className="w-3 h-3 text-muted-foreground" />
          <Span className="text-[10px] text-muted-foreground">Cerca cliente...</Span>
        </Div>
      </Div>
      <Div className="space-y-1.5">
        <Div className="relative flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Callout n={3} className="-top-1 -left-1" />
          <Avatar initials="LE" grad="from-purple-400/60 to-purple-400/20" />
          <Div className="flex-1 min-w-0">
            <Div className="flex items-center gap-1"><Span className="text-[10px] font-semibold text-foreground truncate">Luca Esposito</Span><Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /></Div>
            <Div className="text-[8px] text-muted-foreground">8 presenze · €620 media</Div>
          </Div>
          <Span className="text-[9px] font-bold text-amber-400">8.5</Span>
        </Div>
        <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Avatar initials="MF" grad="from-amber-400/60 to-amber-400/20" />
          <Div className="flex-1 min-w-0">
            <Span className="text-[10px] font-semibold text-foreground truncate">Marco Ferrara</Span>
            <Div className="text-[8px] text-muted-foreground">5 presenze · €380 media</Div>
          </Div>
          <Span className="text-[9px] font-bold text-amber-400">7.8</Span>
        </Div>
        <Div className="flex items-center gap-2 rounded-lg bg-card border border-border p-2">
          <Avatar initials="SC" grad="from-green-400/50 to-green-400/10" />
          <Div className="flex-1 min-w-0">
            <Span className="text-[10px] font-semibold text-foreground truncate">Sara Costa</Span>
            <Div className="text-[8px] text-muted-foreground">1 pres. · nuovo cliente</Div>
          </Div>
          <Span className="text-[9px] font-bold text-green-400">5.0</Span>
        </Div>
      </Div>
    </Frame>
  );
}

// ── CLIENTI · TAB PARCO PAGANTI ──────────────────────────────
export function ClientiParcoMockup() {
  return (
    <Frame url="Clienti · Parco Paganti" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Clienti</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <ClientiTabBar active="parco" />
      </Div>
      <Div className="relative rounded-xl bg-card border border-border p-3 space-y-2">
        <Callout n={2} className="-top-1 left-3" />
        <Div className="flex items-center justify-between">
          <Div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primary" /><Span className="text-[10px] font-bold text-foreground">Parco Paganti</Span></Div>
          <Span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[8px] font-semibold"><Save className="w-2.5 h-2.5" />Salva</Span>
        </Div>
        <P className="text-[8px] text-muted-foreground">Lista personale libera — inserisci nomi, note, gruppi. Non ha effetti sulle altre sezioni.</P>
        <Div className="relative">
          <Callout n={3} className="-top-1 -left-1" />
          <Div className="w-full bg-secondary/30 border border-border rounded-lg px-2 py-2 text-[9px] text-foreground/80 font-mono leading-relaxed resize-none" style={{ minHeight: '90px' }}>
            Mario Rossi{'\n'}Luca Bianchi - gruppo 4 persone{'\n'}Gruppo Pozzuoli (5){'\n'}Giorgia R. - VIP Ammare{'\n'}...
          </Div>
        </Div>
        <P className="text-[8px] text-muted-foreground text-right">4 righe</P>
      </Div>
    </Frame>
  );
}

// ── CLIENTI · TAB ALBERO (Family Tree) ────────────────────────
export function ClientiAlberoMockup() {
  return (
    <Frame url="Clienti · Albero" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Clienti</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <ClientiTabBar active="albero" />
      </Div>
      <Div className="relative rounded-lg bg-card border border-border p-2.5" style={{ minHeight: '160px' }}>
        <Callout n={2} className="-top-1 left-3" />
        <Div className="flex items-center gap-1 mb-2"><GitBranch className="w-3 h-3 text-primary" /><Span className="text-[9px] font-semibold text-muted-foreground">Albero referenze</Span></Div>
        <Div className="flex justify-center mb-2">
          <Div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/15 border border-primary/30">
            <Avatar initials="LE" grad="from-purple-400/60 to-purple-400/20" size="w-4 h-4" text="text-[6px]" />
            <Span className="text-[9px] font-semibold text-foreground">Luca E.</Span>
          </Div>
        </Div>
        <Svg className="w-full h-6" viewBox="0 0 200 24">
          <Path d="M100 0 L100 12 M50 12 L150 12 M50 12 L50 24 M100 12 L100 24 M150 12 L150 24" stroke="#444" strokeWidth="0.8" fill="none" />
        </Svg>
        <Div className="flex justify-around gap-1">
          <Div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary/40 border border-border">
            <Avatar initials="MF" grad="from-amber-400/60 to-amber-400/20" size="w-3.5 h-3.5" text="text-[5px]" />
            <Span className="text-[8px] text-foreground/80">Marco</Span>
          </Div>
          <Div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary/40 border border-border">
            <Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" size="w-3.5 h-3.5" text="text-[5px]" />
            <Span className="text-[8px] text-foreground/80">Giorgia</Span>
          </Div>
          <Div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary/40 border border-border">
            <Avatar initials="SC" grad="from-green-400/50 to-green-400/10" size="w-3.5 h-3.5" text="text-[5px]" />
            <Span className="text-[8px] text-foreground/80">Sara</Span>
          </Div>
        </Div>
        <Div className="mt-2 text-center text-[7px] text-muted-foreground">3 clienti portati da Luca</Div>
      </Div>
    </Frame>
  );
}

// ── CLIENTI · TAB ANALITICA ──────────────────────────────────
export function ClientiAnaliticaMockup() {
  return (
    <Frame url="Clienti · Analitica" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-sm font-bold text-foreground">Clienti</Span>
        <Plus className="w-4 h-4 text-primary" />
      </Div>
      <Div className="relative">
        <Callout n={1} className="-top-1 -left-1" />
        <ClientiTabBar active="analitica" />
      </Div>
      <Div className="relative grid grid-cols-3 gap-1.5 mb-2">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center"><Div className="text-[11px] font-bold text-primary">86</Div><Div className="text-[7px] text-muted-foreground">Clienti</Div></Div>
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center"><Div className="text-[11px] font-bold text-green-400">312</Div><Div className="text-[7px] text-muted-foreground">Presenze</Div></Div>
        <Div className="rounded-lg bg-card border border-border p-1.5 text-center"><Div className="text-[11px] font-bold text-amber-400">€676</Div><Div className="text-[7px] text-muted-foreground">Media</Div></Div>
      </Div>
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2">
        <Callout n={3} className="-top-1 left-3" />
        <Div className="flex items-center gap-1 mb-1"><BarChart2 className="w-3 h-3 text-primary" /><Span className="text-[9px] font-semibold text-muted-foreground">Presenze per giorno</Span></Div>
        <Div className="flex items-end gap-2 h-14">
          <Div className="flex-1 flex flex-col items-center"><Div className="w-3 bg-blue-400/50 rounded-t" style={{ height: '60%' }} /><Span className="text-[7px] text-muted-foreground mt-0.5">Ven</Span></Div>
          <Div className="flex-1 flex flex-col items-center"><Div className="w-3 bg-amber-400/50 rounded-t" style={{ height: '85%' }} /><Span className="text-[7px] text-muted-foreground mt-0.5">Sab</Span></Div>
          <Div className="flex-1 flex flex-col items-center"><Div className="w-3 bg-purple-400/50 rounded-t" style={{ height: '35%' }} /><Span className="text-[7px] text-muted-foreground mt-0.5">Dom</Span></Div>
          <Div className="flex-1 flex flex-col items-center"><Div className="w-3 bg-pink-400/50 rounded-t" style={{ height: '20%' }} /><Span className="text-[7px] text-muted-foreground mt-0.5">Extra</Span></Div>
        </Div>
      </Div>
      <Div className="relative rounded-lg bg-card border border-border p-2">
        <Callout n={4} className="-top-1 left-3" />
        <Div className="text-[9px] font-semibold text-muted-foreground mb-1.5">Locali preferiti</Div>
        <Div className="space-y-1">
          <Div className="flex items-center gap-1.5 text-[8px]"><Div className="w-2 h-2 rounded bg-blue-400" /><Span className="text-foreground/80 flex-1">Ammare</Span><Span className="text-muted-foreground">42%</Span></Div>
          <Div className="flex items-center gap-1.5 text-[8px]"><Div className="w-2 h-2 rounded bg-amber-400" /><Span className="text-foreground/80 flex-1">Borgo</Span><Span className="text-muted-foreground">31%</Span></Div>
          <Div className="flex items-center gap-1.5 text-[8px]"><Div className="w-2 h-2 rounded bg-purple-400" /><Span className="text-foreground/80 flex-1">Vibe</Span><Span className="text-muted-foreground">18%</Span></Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── CLIENTI · BOX PRESENZE (AttendanceHub) ────────────────────
export function ClientiPresenzeMockup() {
  return (
    <Frame url="Clienti · Aggiungi Presenze" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="inline-flex items-center gap-1 rounded border border-border bg-card px-1.5 py-0.5 text-[7px] text-muted-foreground"><Users className="w-2 h-2 text-primary" />42 clienti</Span>
        <Div className="flex items-center gap-1">
          <Span className="inline-flex items-center gap-0.5 rounded border border-border px-1 py-0.5 text-[7px] text-muted-foreground"><Upload className="w-2 h-2" />Importa</Span>
          <Span className="relative inline-flex items-center gap-0.5 rounded border border-border px-1 py-0.5 text-[7px] text-muted-foreground"><CalendarPlus className="w-2 h-2" />Presenze<Callout n={1} className="-top-1 -right-1" /></Span>
          <Span className="inline-flex items-center justify-center rounded bg-primary text-primary-foreground w-4 h-4"><UserPlus className="w-2 h-2" /></Span>
        </Div>
      </Div>
      {/* Dialog box presenze */}
      <Div className="relative rounded-xl bg-card border border-border overflow-hidden">
        <Div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-border">
          <Div className="p-1 rounded-md bg-primary/15"><Users className="w-3 h-3 text-primary" /></Div>
          <Div className="flex-1 min-w-0">
            <P className="text-[9px] font-semibold text-foreground">Aggiungi Presenze per Evento</P>
            <P className="text-[7px] text-muted-foreground">Aggiungi clienti o gruppi a una serata</P>
          </Div>
          <Div className="flex bg-secondary/40 rounded p-0.5 border border-border">
            <Span className="flex items-center gap-0.5 rounded px-1 py-0.5 text-[7px] font-semibold bg-primary text-primary-foreground"><Search className="w-2 h-2" />Manuale</Span>
            <Span className="flex items-center gap-0.5 rounded px-1 py-0.5 text-[7px] text-muted-foreground"><Sparkles className="w-2 h-2" />AI</Span>
          </Div>
        </Div>
        {/* Selettore serata */}
        <Div className="relative px-2 pt-2">
          <Callout n={2} className="-top-1 -left-1" />
          <Div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-1.5">
            <Div className="p-1 rounded-md bg-primary/15"><CalendarDays className="w-2.5 h-2.5 text-primary" /></Div>
            <Div className="flex-1 min-w-0">
              <P className="text-[6px] font-semibold uppercase tracking-wider text-muted-foreground">Serata</P>
              <P className="text-[8px] font-semibold text-foreground truncate">Ammare · 19 lug 26</P>
            </Div>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </Div>
        </Div>
        {/* Box aggiungi cliente */}
        <Div className="relative px-2 pt-2">
          <Callout n={3} className="-top-1 -left-1" />
          <Div className="rounded-lg border border-primary/40">
            <Div className="flex items-center justify-between px-2 py-1.5">
              <Div className="flex items-center gap-1.5">
                <Div className="p-1 rounded-md bg-primary/15"><UserPlus className="w-2.5 h-2.5 text-primary" /></Div>
                <Span className="text-[8px] font-semibold text-primary">Aggiungi cliente o gruppo</Span>
              </Div>
              <ChevronDown className="w-3 h-3 text-primary/70" />
            </Div>
            <Div className="px-2 pb-2 border-t border-primary/20 pt-1.5 space-y-1.5">
              <Div className="flex gap-1 bg-secondary/30 p-0.5 rounded">
                <Span className="flex items-center gap-0.5 rounded px-1 py-0.5 text-[7px] font-medium bg-card">Cliente</Span>
                <Span className="flex items-center gap-0.5 px-1 py-0.5 text-[7px] text-muted-foreground"><FolderOpen className="w-2 h-2" />Gruppo</Span>
              </Div>
              <Div className="flex items-center gap-1 rounded border border-border bg-secondary/20 px-1.5 py-1">
                <Search className="w-2.5 h-2.5 text-muted-foreground" />
                <Span className="text-[7px] text-muted-foreground">Cerca per nome o Instagram...</Span>
              </Div>
            </Div>
          </Div>
        </Div>
        {/* Riga fatturato/persone + salva */}
        <Div className="relative px-2 pt-2">
          <Callout n={4} className="-top-1 -left-1" />
          <Div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/30 px-2 py-1.5">
            <Span className="text-[7px] font-semibold text-emerald-400">€</Span>
            <Span className="w-7 h-4 rounded bg-background/60 border border-emerald-500/30 text-[7px] text-center text-foreground/80">150</Span>
            <Span className="text-[7px] font-semibold text-sky-400">Pers.</Span>
            <Span className="w-6 h-4 rounded bg-background/60 border border-sky-500/30 text-[7px] text-center text-foreground/80">3</Span>
            <Span className="ml-auto rounded bg-emerald-600 text-white text-[7px] font-semibold px-2 py-1 flex items-center gap-0.5"><Check className="w-2.5 h-2.5" />Salva</Span>
          </Div>
        </Div>
        {/* Riga aggiunta */}
        <Div className="px-2 pt-2">
          <Div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1.5">
            <Div className="flex items-center gap-1"><Star className="w-2.5 h-2.5 text-yellow-400" /><Span className="text-[7px] font-semibold text-red-300">Mario Rossi</Span></Div>
            <Div className="flex items-center gap-1.5"><Span className="text-[7px] text-red-400 font-bold">€150</Span><Span className="text-[7px] text-red-300/80">3 pers.</Span><Check className="w-2.5 h-2.5 text-red-400" /></Div>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── CLIENTI · IMPORTA CLIENTI ─────────────────────────────────
export function ClientiImportaMockup() {
  return (
    <Frame url="Clienti · Importa Clienti" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="inline-flex items-center gap-1 rounded border border-border bg-card px-1.5 py-0.5 text-[7px] text-muted-foreground"><Users className="w-2 h-2 text-primary" />42 clienti</Span>
        <Div className="flex items-center gap-1">
          <Span className="relative inline-flex items-center gap-0.5 rounded border border-border px-1 py-0.5 text-[7px] text-muted-foreground"><Upload className="w-2 h-2" />Importa<Callout n={1} className="-top-1 -right-1" /></Span>
          <Span className="inline-flex items-center gap-0.5 rounded border border-border px-1 py-0.5 text-[7px] text-muted-foreground"><CalendarPlus className="w-2 h-2" />Presenze</Span>
          <Span className="inline-flex items-center justify-center rounded bg-primary text-primary-foreground w-4 h-4"><UserPlus className="w-2 h-2" /></Span>
        </Div>
      </Div>
      {/* Dialog importa clienti */}
      <Div className="relative rounded-xl bg-card border border-border overflow-hidden">
        <Div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-border">
          <Div className="p-1 rounded-md bg-primary/15"><UserPlus className="w-3 h-3 text-primary" /></Div>
          <Span className="text-[9px] font-semibold text-foreground">Importa Nuovi Clienti</Span>
        </Div>
        <Div className="p-2 space-y-2">
          <P className="text-[7px] text-muted-foreground">Inserisci un nome per riga. Ogni riga creerà una scheda cliente associata al tuo profilo.</P>
          {/* Textarea con lista nomi */}
          <Div className="relative">
            <Callout n={2} className="-top-1 -left-1" />
            <Div className="rounded-lg border border-border bg-secondary/30 p-2 font-mono space-y-0.5">
              <P className="text-[7px] text-foreground/80">Mario Rossi</P>
              <P className="text-[7px] text-foreground/80">Giuseppe Verdi</P>
              <P className="text-[7px] text-foreground/80">Sara Bianchi</P>
              <P className="text-[7px] text-muted-foreground/50">|</P>
            </Div>
          </Div>
          <P className="text-[7px] text-muted-foreground">3 clienti da importare</P>
          <Div className="flex justify-end gap-1">
            <Span className="rounded border border-border px-2 py-1 text-[7px] text-muted-foreground">Annulla</Span>
            <Span className="rounded bg-primary text-primary-foreground px-2 py-1 text-[7px] font-semibold">Importa 3 clienti</Span>
          </Div>
          {/* Box risultato (stato dopo import) */}
          <Div className="relative rounded-lg bg-green-500/10 border border-green-500/20 p-2">
            <Callout n={3} className="-top-1 -left-1" />
            <Div className="flex items-center gap-1 text-green-400 text-[8px] font-semibold"><Check className="w-2.5 h-2.5" />3 clienti importati con successo</Div>
            <Div className="text-[7px] text-muted-foreground pl-3 mt-0.5 space-y-0.5">
              <Div>Mario Rossi</Div>
              <Div>Giuseppe Verdi</Div>
              <Div>Sara Bianchi</Div>
            </Div>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}

// ── CLIENTI · NUOVO CLIENTE (form) ────────────────────────────
export function ClientiNuovoMockup() {
  return (
    <Frame url="Clienti · Nuovo Cliente" tall>
      <Div className="flex items-center justify-between mb-2">
        <Span className="inline-flex items-center gap-1 rounded border border-border bg-card px-1.5 py-0.5 text-[7px] text-muted-foreground"><Users className="w-2 h-2 text-primary" />42 clienti</Span>
        <Div className="flex items-center gap-1">
          <Span className="inline-flex items-center gap-0.5 rounded border border-border px-1 py-0.5 text-[7px] text-muted-foreground"><Upload className="w-2 h-2" />Importa</Span>
          <Span className="inline-flex items-center gap-0.5 rounded border border-border px-1 py-0.5 text-[7px] text-muted-foreground"><CalendarPlus className="w-2 h-2" />Presenze</Span>
          <Span className="relative inline-flex items-center justify-center rounded bg-primary text-primary-foreground w-4 h-4"><UserPlus className="w-2 h-2" /><Callout n={1} className="-top-1 -right-1" /></Span>
        </Div>
      </Div>
      {/* Dialog nuovo cliente */}
      <Div className="relative rounded-xl bg-card border border-border overflow-hidden">
        <Div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-border">
          <Span className="text-[9px] font-semibold text-foreground">Nuovo Cliente</Span>
        </Div>
        <Div className="p-2 space-y-2">
          {/* Nome */}
          <Div className="relative">
            <Callout n={2} className="-top-1 -left-1" />
            <P className="text-[6px] font-medium text-muted-foreground mb-0.5">Nome *</P>
            <Div className="rounded border border-border bg-secondary/30 px-1.5 py-1 text-[8px] text-foreground">Mario Rossi</Div>
          </Div>
          {/* Telefono + Instagram */}
          <Div className="grid grid-cols-2 gap-1.5">
            <Div>
              <P className="text-[6px] font-medium text-muted-foreground mb-0.5">Telefono</P>
              <Div className="rounded border border-border bg-secondary/30 px-1.5 py-1 text-[8px] text-foreground/70">333 1234567</Div>
            </Div>
            <Div>
              <P className="text-[6px] font-medium text-muted-foreground mb-0.5">Instagram</P>
              <Div className="rounded border border-border bg-secondary/30 px-1.5 py-1 text-[8px] text-foreground/70">@mario</Div>
            </Div>
          </Div>
          {/* Zona residenza */}
          <Div className="relative">
            <Callout n={3} className="-top-1 -left-1" />
            <P className="text-[6px] font-medium text-muted-foreground mb-0.5">Zona di residenza</P>
            <Div className="rounded border border-border bg-secondary/30 px-1.5 py-1 text-[8px] text-foreground/70 flex items-center justify-between">
              <Span>Napoli · Vomero</Span><ChevronDown className="w-2.5 h-2.5 text-muted-foreground" />
            </Div>
          </Div>
          {/* Fonte */}
          <Div className="relative">
            <Callout n={4} className="-top-1 -left-1" />
            <P className="text-[6px] font-medium text-muted-foreground mb-0.5">Dove l'hai conosciuto?</P>
            <Div className="flex gap-1 flex-wrap">
              <Span className="rounded-full border border-primary/40 bg-primary/10 text-primary px-1.5 py-0.5 text-[7px] font-medium">Di persona</Span>
              <Span className="rounded-full border border-border text-muted-foreground px-1.5 py-0.5 text-[7px]">Instagram</Span>
              <Span className="rounded-full border border-border text-muted-foreground px-1.5 py-0.5 text-[7px]">TikTok</Span>
              <Span className="rounded-full border border-border text-muted-foreground px-1.5 py-0.5 text-[7px]">Presentato</Span>
            </Div>
          </Div>
          {/* Leader + Guidatore */}
          <Div className="relative flex gap-1">
            <Callout n={5} className="-top-1 -left-1" />
            <Div className="flex-1 flex items-center justify-between rounded border border-border bg-secondary/10 px-1.5 py-1">
              <Span className="text-yellow-400 text-[9px]">⭐</Span>
              <Span className="text-[7px] font-medium text-foreground flex-1 ml-1">Leader</Span>
              <Div className="w-5 h-2.5 rounded-full bg-secondary border border-border" />
            </Div>
            <Div className="flex-1 flex items-center justify-between rounded border border-border bg-secondary/10 px-1.5 py-1">
              <Span className="text-[9px]">🚗</Span>
              <Span className="text-[7px] font-medium text-foreground flex-1 ml-1">Guidatore</Span>
              <Div className="w-5 h-2.5 rounded-full bg-primary border border-primary" />
            </Div>
          </Div>
          {/* Pulsanti */}
          <Div className="flex justify-end gap-1 pt-1">
            <Span className="rounded border border-border px-2 py-1 text-[7px] text-muted-foreground">Annulla</Span>
            <Span className="rounded bg-primary text-primary-foreground px-2 py-1 text-[7px] font-semibold">Aggiungi</Span>
          </Div>
        </Div>
      </Div>
    </Frame>
  );
}