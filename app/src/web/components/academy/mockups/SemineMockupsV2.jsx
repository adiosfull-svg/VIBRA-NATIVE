// Port di src/components/academy/mockups/SemineMockupsV2.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Search, Plus, Instagram, MessageCircle, Phone, GripVertical, Star, MoreVertical, X, Clipboard, Image, Send, Trash2, Power, Sparkles, ArrowUp, ArrowDown, Eye, EyeOff, Filter, ChevronDown } from '@/ui/icons.generated';
import { Callout, Frame, Avatar, DualFrame, MiniTabBar } from './shared';

import { Div, Span } from '@/ui/html';

const SEM_TABS = [
  { key: 'lista', label: 'Lista', icon: <MessageCircle className="w-2.5 h-2.5" /> },
];

// ── 1. LISTA SEMINE (agenda principale) ─────────────────────
function ListaContent({ desktop }) {
  const semine = [
    { i: 'GR', g: 'from-pink-400/60 to-pink-400/20', n: 'Giulia R.', ig: '@giulia.r', st: 'interessato', r: 3, off: false, last: '2gg fa' },
    { i: 'MF', g: 'from-amber-400/60 to-amber-400/20', n: 'Marco F.', ig: '@marco.f', st: 'contattato', r: 2, off: false, last: '5gg fa' },
    { i: 'SC', g: 'from-green-400/50 to-green-400/10', n: 'Sara C.', ig: '@sara.c', st: 'nuovo', r: 1, off: false, last: null },
    { i: 'LB', g: 'from-blue-400/60 to-blue-400/20', n: 'Luigi B.', ig: '@luigi.b', st: 'nuovo', r: 1, off: false, last: null },
    { i: 'DV', g: 'from-purple-400/60 to-purple-400/20', n: 'Davide V.', ig: '@davide.v', st: 'contattato', r: 2, off: false, last: '1sett fa' },
  ];
  const statusColors = { nuovo: 'bg-blue-400/15 text-blue-400', contattato: 'bg-amber-400/15 text-amber-400', interessato: 'bg-green-400/15 text-green-400', convertito: 'bg-purple-400/15 text-purple-400' };
  const recDots = { 1: '●○○', 2: '●●○', 3: '●●●' };

  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Semine</Span>
        <Plus className="w-3.5 h-3.5 text-primary" />
      </Div>
      {/* Stats */}
      <Div className="relative grid grid-cols-4 gap-1 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="rounded bg-card border border-border p-1 text-center"><Div className="text-[10px] font-bold text-primary">12</Div><Div className="text-[5px] text-muted-foreground">Tot</Div></Div>
        <Div className="rounded bg-card border border-border p-1 text-center"><Div className="text-[10px] font-bold text-green-400">3</Div><Div className="text-[5px] text-muted-foreground">Interess.</Div></Div>
        <Div className="rounded bg-card border border-border p-1 text-center"><Div className="text-[10px] font-bold text-amber-400">5</Div><Div className="text-[5px] text-muted-foreground">Contatt.</Div></Div>
        <Div className="rounded bg-card border border-border p-1 text-center"><Div className="text-[10px] font-bold text-blue-400">4</Div><Div className="text-[5px] text-muted-foreground">Nuovi</Div></Div>
      </Div>
      {/* Search + sort + view toggle */}
      <Div className="relative flex items-center gap-1 mb-2">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="flex items-center gap-1 rounded bg-card border border-border px-1.5 py-1 flex-1"><Search className="w-2.5 h-2.5 text-muted-foreground" /><Span className="text-[7px] text-muted-foreground">Cerca semina...</Span></Div>
        <Div className="flex gap-0.5">
          <Div className="rounded-full bg-primary/15 text-primary text-[6px] font-semibold px-1.5 py-0.5 border border-primary/30">Recett.</Div>
          <Div className="rounded-full bg-secondary/40 text-muted-foreground text-[6px] px-1.5 py-0.5">Stato</Div>
        </Div>
      </Div>
      {/* View toggle */}
      <Div className="relative flex gap-0.5 bg-secondary/30 p-0.5 rounded-lg mb-2">
        <Callout n={3} className="-top-1 -left-1" />
        <Div className="flex-1 text-center py-0.5 rounded bg-card text-[7px] font-semibold flex items-center justify-center gap-0.5"><Eye className="w-2.5 h-2.5" />Attive (12)</Div>
        <Div className="flex-1 text-center py-0.5 rounded text-muted-foreground text-[7px] flex items-center justify-center gap-0.5"><EyeOff className="w-2.5 h-2.5" />Spente (3)</Div>
      </Div>
      {/* Cards */}
      <Div className="relative space-y-1.5">
        <Callout n={4} className="-top-1 left-2" />
        {semine.map((s, i) => (
          <Div key={i} className="rounded-lg bg-card border border-border p-2 flex items-center gap-1.5" style={{ borderLeft: s.r === 3 ? '3px solid #4ade80' : s.r === 2 ? '3px solid #fbbf24' : '1px solid hsl(var(--border))' }}>
            {desktop && <GripVertical className="w-2.5 h-2.5 text-muted-foreground/50" />}
            <Avatar initials={s.i} grad={s.g} size="w-6 h-6" text="text-[6px]" />
            <Div className="flex-1 min-w-0">
              <Div className="text-[7px] font-semibold text-foreground truncate flex items-center gap-0.5">{s.n}</Div>
              <Div className="flex items-center gap-0.5 text-[5px] text-muted-foreground"><Instagram className="w-2 h-2" />{s.ig}</Div>
            </Div>
            <Div className="flex flex-col items-end gap-0.5">
              <Span className={"text-[5px] font-semibold px-1 py-0.5 rounded " + statusColors[s.st]} style={{ textTransform: 'capitalize' }}>{s.st}</Span>
              <Span className="text-[5px] text-muted-foreground">{recDots[s.r]}</Span>
            </Div>
            {s.last && <Span className="text-[4px] text-muted-foreground/70 hidden sm:block">{s.last}</Span>}
          </Div>
        ))}
      </Div>
    </>
  );
}
export function SemineListaV2() {
  return <DualFrame url="Semine · Lista" mobile={<Frame url="Semine · Lista" tall><ListaContent /></Frame>} desktop={<Frame url="Semine · Lista" tall desktop><ListaContent desktop /></Frame>} />;
}

// ── 2. LONG PRESS → MENU CONTESTUALE ────────────────────────
function LongPressContent({ desktop }) {
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Semine</Span>
        <Plus className="w-3.5 h-3.5 text-primary" />
      </Div>
      {/* Semina card con indicatore long-press (pulsing) */}
      <Div className="relative rounded-lg bg-card border-2 border-primary/40 p-2 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex items-center gap-1.5">
          <Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" size="w-6 h-6" text="text-[6px]" />
          <Div className="flex-1 min-w-0">
            <Div className="text-[7px] font-semibold text-foreground truncate">Giulia Russo</Div>
            <Div className="flex items-center gap-0.5 text-[5px] text-muted-foreground"><Instagram className="w-2 h-2" />@giulia.r</Div>
          </Div>
          <Span className="text-[5px] font-semibold px-1 py-0.5 rounded bg-green-400/15 text-green-400">interessato</Span>
        </Div>
        {/* Pulsing long-press indicator */}
        <Div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-primary/50 animate-ping" style={{ animationDuration: '1.5s' }} />
      </Div>
      {/* Context menu popup */}
      <Div className="relative rounded-lg bg-popover border border-border shadow-xl p-1.5 w-44 mx-auto">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="text-[6px] font-bold text-muted-foreground uppercase tracking-wider px-1 pb-1 border-b border-border/40 mb-1">Menu Semina</Div>
        <Div className="space-y-0.5">
          <Div className="relative flex items-center gap-1.5 px-1 py-1 rounded bg-primary/10 text-[7px] text-foreground">
            <Callout n={3} className="-top-1 -left-1" />
            <Clipboard className="w-2.5 h-2.5 text-primary" /><Span className="font-semibold">Incolla semina</Span>
          </Div>
          <Div className="relative flex items-center gap-1.5 px-1 py-1 rounded hover:bg-secondary/40 text-[7px] text-muted-foreground">
            <Callout n={4} className="-top-1 -left-1" />
            <Image className="w-2.5 h-2.5" /><Span>Incolla foto profilo</Span>
          </Div>
          <Div className="flex items-center gap-1.5 px-1 py-1 rounded hover:bg-secondary/40 text-[7px] text-muted-foreground">
            <Plus className="w-2.5 h-2.5" /><Span>Cattura manualmente</Span>
          </Div>
          <Div className="border-t border-border/40 my-0.5" />
          <Div className="flex items-center gap-1.5 px-1 py-1 rounded hover:bg-secondary/40 text-[7px] text-muted-foreground">
            <Send className="w-2.5 h-2.5" /><Span>Contatta (WhatsApp)</Span>
          </Div>
          <Div className="flex items-center gap-1.5 px-1 py-1 rounded hover:bg-secondary/40 text-[7px] text-muted-foreground">
            <Instagram className="w-2.5 h-2.5" /><Span>Apri profilo IG</Span>
          </Div>
          <Div className="border-t border-border/40 my-0.5" />
          <Div className="flex items-center gap-1.5 px-1 py-1 rounded hover:bg-secondary/40 text-[7px] text-amber-400">
            <Power className="w-2.5 h-2.5" /><Span>Spegni semina</Span>
          </Div>
          <Div className="flex items-center gap-1.5 px-1 py-1 rounded hover:bg-secondary/40 text-[7px] text-red-400">
            <Trash2 className="w-2.5 h-2.5" /><Span>Elimina</Span>
          </Div>
        </Div>
      </Div>
    </>
  );
}
export function SemineLongPressV2() {
  return <DualFrame url="Semine · Long Press" mobile={<Frame url="Semine · Long Press" tall><LongPressContent /></Frame>} desktop={<Frame url="Semine · Long Press" tall desktop><LongPressContent desktop /></Frame>} />;
}

// ── 9. FLIP CARD (AI data on back) ─────────────────────────
function FlipContent({ desktop }) {
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Semine</Span>
        <Plus className="w-3.5 h-3.5 text-primary" />
      </Div>
      {/* Front card (tilted to suggest flip) */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2" style={{ transform: 'rotateY(-22deg)', transformStyle: 'preserve-3d', opacity: 0.75 }}>
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex items-center gap-1.5">
          <Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" size="w-7 h-7" text="text-[7px]" />
          <Div className="flex-1 min-w-0">
            <Div className="text-[8px] font-semibold text-foreground truncate">Giulia Russo</Div>
            <Div className="flex items-center gap-0.5 text-[5px] text-muted-foreground"><Instagram className="w-2 h-2" />@giulia.r</Div>
          </Div>
          <Span className="text-[5px] font-semibold px-1 py-0.5 rounded bg-green-400/15 text-green-400">interessato</Span>
        </Div>
        <Div className="flex items-center gap-1 mt-1 text-[5px] text-muted-foreground">
          <Span>●●○</Span>
          <Span className="ml-auto">2gg fa</Span>
        </Div>
      </Div>
      {/* Back card (AI extracted data) */}
      <Div className="relative rounded-lg bg-gradient-to-br from-violet-500/10 to-primary/5 border border-violet-500/20 p-2">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="flex items-center gap-1 mb-1.5">
          <Sparkles className="w-3 h-3 text-violet-400" />
          <Span className="text-[7px] font-semibold uppercase tracking-wider text-violet-300">Dati AI dai DM</Span>
        </Div>
        <Div className="space-y-1">
          <Div className="flex items-center gap-1.5 text-[6px]">
            <Span className="text-muted-foreground w-10">Età:</Span>
            <Span className="text-foreground font-semibold">~22 anni</Span>
          </Div>
          <Div className="flex items-center gap-1.5 text-[6px]">
            <Span className="text-muted-foreground w-10">Zona:</Span>
            <Span className="text-foreground font-semibold">Vomero</Span>
          </Div>
          <Div className="flex items-center gap-1.5 text-[6px]">
            <Span className="text-muted-foreground w-10">Locali:</Span>
            <Span className="text-foreground font-semibold">Mantra, Ammare</Span>
          </Div>
          <Div className="flex items-start gap-1.5 text-[6px]">
            <Span className="text-muted-foreground w-10 shrink-0">Inviti:</Span>
            <Span className="text-foreground">Sabato al Mantra, viene in 3</Span>
          </Div>
          <Div className="rounded bg-violet-500/5 border border-violet-500/15 px-1.5 py-1 mt-1">
            <Div className="text-[5px] text-muted-foreground mb-0.5">Sintesi AI</Div>
            <Div className="text-[6px] text-foreground/80 leading-relaxed">Contatto molto interessato, ha chiesto info sul sabato. Viene in 3 persone. Da richiamare per conferma.</Div>
          </Div>
        </Div>
      </Div>
      {/* Flip hint */}
      <Div className="relative flex items-center justify-center gap-1 mt-2 text-[5px] text-muted-foreground">
        <Callout n={3} className="-top-1 left-8" />
        <Span>↔ Scorri o inclina la card per girarla</Span>
      </Div>
    </>
  );
}
export function SemineFlipV2() {
  return <DualFrame url="Semine · Flip AI" mobile={<Frame url="Semine · Flip AI" tall><FlipContent /></Frame>} desktop={<Frame url="Semine · Flip AI" tall desktop><FlipContent desktop /></Frame>} />;
}

// ── 3. INCOLLA SEMINA (clipboard parsing) ───────────────────
function PasteSeminaContent({ desktop }) {
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Semine</Span>
        <Plus className="w-3.5 h-3.5 text-primary" />
      </Div>
      {/* Clipboard preview */}
      <Div className="relative rounded-lg bg-card border border-dashed border-primary/40 p-2 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex items-center gap-1 mb-1">
          <Clipboard className="w-2.5 h-2.5 text-primary" />
          <Span className="text-[7px] font-semibold text-primary">Appunti rilevati</Span>
        </Div>
        <Div className="rounded bg-secondary/30 p-1.5 text-[6px] text-muted-foreground font-mono leading-relaxed">
          <Div className="text-foreground/80">Giulia Russo</Div>
          <Div className="text-blue-400">@giulia.russo</Div>
          <Div className="text-green-400/70">https://instagram.com/giulia.russo</Div>
          <Div className="text-foreground/60">339 1234567</Div>
        </Div>
      </Div>
      {/* Parsed preview card */}
      <Div className="relative rounded-lg bg-primary/5 border border-primary/20 p-2 mb-2">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="text-[6px] font-semibold text-primary uppercase tracking-wider mb-1">Anteprima semina</Div>
        <Div className="flex items-center gap-1.5">
          <Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" size="w-6 h-6" text="text-[6px]" />
          <Div className="flex-1 min-w-0 space-y-0.5">
            <Div className="text-[7px] font-semibold text-foreground">Giulia Russo</Div>
            <Div className="flex items-center gap-0.5 text-[5px] text-muted-foreground"><Instagram className="w-2 h-2" />@giulia.russo</Div>
            <Div className="flex items-center gap-0.5 text-[5px] text-muted-foreground"><Phone className="w-2 h-2" />339 1234567</Div>
          </Div>
        </Div>
      </Div>
      {/* Confirm button */}
      <Div className="relative flex gap-1">
        <Callout n={3} className="-top-1 -left-1" />
        <Div className="flex-1 rounded bg-secondary/40 text-[7px] text-muted-foreground text-center py-1.5 border border-border">Annulla</Div>
        <Div className="flex-1 rounded bg-primary text-primary-foreground text-[7px] font-semibold text-center py-1.5 flex items-center justify-center gap-0.5"><Clipboard className="w-2.5 h-2.5" />Incolla semina</Div>
      </Div>
    </>
  );
}
export function SeminePasteSeminaV2() {
  return <DualFrame url="Semine · Incolla Semina" mobile={<Frame url="Semine · Incolla Semina" tall><PasteSeminaContent /></Frame>} desktop={<Frame url="Semine · Incolla Semina" tall desktop><PasteSeminaContent desktop /></Frame>} />;
}

// ── 4. INCOLLA FOTO PROFILO ────────────────────────────────
function PastePhotoContent({ desktop }) {
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Semine</Span>
        <Plus className="w-3.5 h-3.5 text-primary" />
      </Div>
      {/* Semina card with photo area */}
      <Div className="relative rounded-lg bg-card border border-border p-2 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex items-center gap-1.5">
          <Div className="relative">
            <Callout n={2} className="-top-1 -left-1" />
            {/* Empty avatar with paste indicator */}
            <Div className="w-10 h-10 rounded-full border-2 border-dashed border-primary/40 bg-primary/5 flex items-center justify-center">
              <Image className="w-3.5 h-3.5 text-primary/60" />
            </Div>
          </Div>
          <Div className="flex-1">
            <Div className="text-[7px] font-semibold text-foreground">Giulia Russo</Div>
            <Div className="flex items-center gap-0.5 text-[5px] text-muted-foreground"><Instagram className="w-2 h-2" />@giulia.russo</Div>
          </Div>
        </Div>
      </Div>
      {/* Clipboard image detected */}
      <Div className="relative rounded-lg bg-card border border-dashed border-green-400/40 p-2 mb-2">
        <Callout n={3} className="-top-1 -left-1" />
        <Div className="flex items-center gap-1.5 mb-1">
          <Image className="w-2.5 h-2.5 text-green-400" />
          <Span className="text-[7px] font-semibold text-green-400">Foto rilevata negli appunti</Span>
        </Div>
        {/* Faux image preview */}
        <Div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400/30 to-purple-400/20 border border-green-400/30 flex items-center justify-center">
          <Span className="text-[5px] text-muted-foreground">anteprima</Span>
        </Div>
      </Div>
      {/* Action */}
      <Div className="relative flex gap-1">
        <Callout n={4} className="-top-1 -left-1" />
        <Div className="flex-1 rounded bg-primary text-primary-foreground text-[7px] font-semibold text-center py-1.5 flex items-center justify-center gap-0.5"><Image className="w-2.5 h-2.5" />Incolla foto profilo</Div>
      </Div>
      {/* After paste - result */}
      <Div className="relative mt-3 rounded-lg bg-green-400/5 border border-green-400/20 p-2">
        <Callout n={5} className="-top-1 -left-1" />
        <Div className="flex items-center gap-1.5">
          <Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" size="w-10 h-10" text="text-[8px]" />
          <Div>
            <Div className="text-[7px] font-semibold text-foreground">Giulia Russo</Div>
            <Div className="text-[5px] text-green-400 flex items-center gap-0.5"><Sparkles className="w-2 h-2" />Foto aggiornata!</Div>
          </Div>
        </Div>
      </Div>
    </>
  );
}
export function SeminePastePhotoV2() {
  return <DualFrame url="Semine · Incolla Foto" mobile={<Frame url="Semine · Incolla Foto" tall><PastePhotoContent /></Frame>} desktop={<Frame url="Semine · Incolla Foto" tall desktop><PastePhotoContent desktop /></Frame>} />;
}

// ── 5. CATTURA SEMINA (dialog manuale) ──────────────────────
function CatturaContent({ desktop }) {
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Semine</Span>
        <X className="w-3.5 h-3.5 text-muted-foreground" />
      </Div>
      <Div className="text-[8px] font-bold text-foreground mb-2">Cattura Semina</Div>
      {/* Platform selector */}
      <Div className="relative flex gap-0.5 bg-secondary/30 p-0.5 rounded-lg mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex-1 text-center py-1 rounded bg-card text-[7px] font-semibold flex items-center justify-center gap-0.5"><Instagram className="w-2.5 h-2.5" />Instagram</Div>
        <Div className="flex-1 text-center py-1 rounded text-muted-foreground text-[7px] flex items-center justify-center gap-0.5"><Span className="text-[8px]">♪</Span>TikTok</Div>
      </Div>
      {/* Name */}
      <Div className="relative mb-1.5">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="text-[5px] text-muted-foreground mb-0.5">Nome *</Div>
        <Div className="rounded bg-card border border-border px-1.5 py-1 text-[7px] text-foreground">Giulia Russo</Div>
      </Div>
      {/* Instagram handle */}
      <Div className="relative mb-1.5">
        <Callout n={3} className="-top-1 -left-1" />
        <Div className="text-[5px] text-muted-foreground mb-0.5">Handle Instagram</Div>
        <Div className="flex items-center rounded bg-card border border-border px-1.5 py-1"><Instagram className="w-2.5 h-2.5 text-muted-foreground mr-1" /><Span className="text-[7px] text-foreground">giulia.russo</Span></Div>
      </Div>
      {/* Profile URL */}
      <Div className="relative mb-1.5">
        <Callout n={4} className="-top-1 -left-1" />
        <Div className="text-[5px] text-muted-foreground mb-0.5">URL profilo / chat</Div>
        <Div className="rounded bg-card border border-border px-1.5 py-1 text-[6px] text-blue-400 truncate">https://instagram.com/giulia.russo</Div>
      </Div>
      {/* Phone */}
      <Div className="relative mb-1.5">
        <Callout n={5} className="-top-1 -left-1" />
        <Div className="text-[5px] text-muted-foreground mb-0.5">Telefono / WhatsApp</Div>
        <Div className="rounded bg-card border border-border px-1.5 py-1 text-[7px] text-foreground">339 1234567</Div>
      </Div>
      {/* Photo */}
      <Div className="relative mb-2">
        <Callout n={6} className="-top-1 -left-1" />
        <Div className="text-[5px] text-muted-foreground mb-0.5">Foto profilo (incolla o carica)</Div>
        <Div className="flex items-center gap-1">
          <Div className="w-8 h-8 rounded-full border-2 border-dashed border-border bg-secondary/20 flex items-center justify-center"><Image className="w-3 h-3 text-muted-foreground/50" /></Div>
          <Div className="flex-1 flex gap-0.5">
            <Div className="flex-1 rounded bg-secondary/40 text-[5px] text-muted-foreground text-center py-1 border border-border flex items-center justify-center gap-0.5"><Clipboard className="w-2 h-2" />Incolla</Div>
            <Div className="flex-1 rounded bg-secondary/40 text-[5px] text-muted-foreground text-center py-1 border border-border">Carica</Div>
          </Div>
        </Div>
      </Div>
      {/* Status + recettività */}
      <Div className="grid grid-cols-2 gap-1 mb-2">
        <Div>
          <Div className="text-[5px] text-muted-foreground mb-0.5">Stato</Div>
          <Div className="rounded bg-card border border-border px-1 py-1 text-[6px] text-foreground flex items-center justify-between">Nuovo <ChevronDown className="w-2 h-2" /></Div>
        </Div>
        <Div>
          <Div className="text-[5px] text-muted-foreground mb-0.5">Recettività</Div>
          <Div className="rounded bg-card border border-border px-1 py-1 text-[6px] text-foreground flex items-center justify-between">●○○ <ChevronDown className="w-2 h-2" /></Div>
        </Div>
      </Div>
      {/* Save */}
      <Div className="relative flex gap-1">
        <Callout n={7} className="-top-1 -left-1" />
        <Div className="flex-1 rounded bg-secondary/40 text-[7px] text-muted-foreground text-center py-1.5 border border-border">Annulla</Div>
        <Div className="flex-1 rounded bg-primary text-primary-foreground text-[7px] font-semibold text-center py-1.5">Salva semina</Div>
      </Div>
    </>
  );
}
export function SemineCatturaV2() {
  return <DualFrame url="Semine · Cattura" mobile={<Frame url="Semine · Cattura" tall><CatturaContent /></Frame>} desktop={<Frame url="Semine · Cattura" tall desktop><CatturaContent desktop /></Frame>} />;
}

// ── 6. MODIFICA SEMINA (edit dialog) ────────────────────────
function ModificaContent({ desktop }) {
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Semine</Span>
        <X className="w-3.5 h-3.5 text-muted-foreground" />
      </Div>
      <Div className="text-[8px] font-bold text-foreground mb-2">Modifica Semina</Div>
      {/* Photo + name */}
      <Div className="relative flex items-center gap-1.5 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" size="w-8 h-8" text="text-[7px]" />
        <Div className="flex-1">
          <Div className="rounded bg-card border border-border px-1.5 py-1 text-[7px] text-foreground">Giulia Russo</Div>
        </Div>
        <Div className="flex gap-0.5">
          <Div className="rounded bg-secondary/40 p-1 border border-border"><Clipboard className="w-2.5 h-2.5 text-muted-foreground" /></Div>
          <Div className="rounded bg-secondary/40 p-1 border border-border"><Image className="w-2.5 h-2.5 text-muted-foreground" /></Div>
        </Div>
      </Div>
      {/* Status pills */}
      <Div className="relative mb-2">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="text-[5px] text-muted-foreground mb-0.5">Stato di avanzamento</Div>
        <Div className="flex gap-0.5 flex-wrap">
          <Div className="rounded-full bg-blue-400/15 text-blue-400 text-[5px] px-1.5 py-0.5 border border-blue-400/30">Nuovo</Div>
          <Div className="rounded-full bg-amber-400/15 text-amber-400 text-[5px] px-1.5 py-0.5 border border-amber-400/30 font-semibold">Contattato ✓</Div>
          <Div className="rounded-full bg-green-400/15 text-green-400 text-[5px] px-1.5 py-0.5 border border-green-400/30">Interessato</Div>
          <Div className="rounded-full bg-purple-400/15 text-purple-400 text-[5px] px-1.5 py-0.5 border border-purple-400/30">Convertito</Div>
        </Div>
      </Div>
      {/* Recettività slider */}
      <Div className="relative mb-2">
        <Callout n={3} className="-top-1 -left-1" />
        <Div className="text-[5px] text-muted-foreground mb-1">Recettività (1=da coltivare, 3=super recettiva)</Div>
        <Div className="flex items-center gap-1">
          <Div className="flex-1 h-1.5 bg-secondary/40 rounded-full relative">
            <Div className="absolute left-0 top-0 h-full bg-green-400 rounded-full" style={{ width: '66%' }} />
            <Div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-400 border-2 border-background" style={{ left: 'calc(66% - 6px)' }} />
          </Div>
          <Span className="text-[7px] font-bold text-green-400">2</Span>
        </Div>
        <Div className="flex justify-between text-[4px] text-muted-foreground mt-0.5"><Span>Da coltivare</Span><Span>Ottima empatia</Span><Span>Super recettiva</Span></Div>
      </Div>
      {/* Last contacted */}
      <Div className="relative mb-2">
        <Callout n={4} className="-top-1 -left-1" />
        <Div className="text-[5px] text-muted-foreground mb-0.5">Ultimo contatto</Div>
        <Div className="rounded bg-card border border-border px-1.5 py-1 text-[6px] text-foreground flex items-center justify-between">5 giorni fa <ChevronDown className="w-2 h-2" /></Div>
      </Div>
      {/* Notes */}
      <Div className="relative mb-2">
        <Callout n={5} className="-top-1 -left-1" />
        <Div className="text-[5px] text-muted-foreground mb-0.5">Note</Div>
        <Div className="rounded bg-card border border-border px-1.5 py-1 text-[6px] text-muted-foreground min-h-[24px]">Ha chiesto info sul sabato, molto curiosa. Da richiamare venerdì.</Div>
      </Div>
      {/* Spenta toggle */}
      <Div className="relative flex items-center justify-between mb-2 rounded bg-card border border-border px-1.5 py-1">
        <Callout n={6} className="-top-1 -left-1" />
        <Div className="flex items-center gap-1"><Power className="w-2.5 h-2.5 text-amber-400" /><Span className="text-[6px] text-foreground">Semina spenta (persa)</Span></Div>
        <Div className="w-6 h-3 rounded-full bg-secondary/40 relative"><Div className="absolute left-0.5 top-0.5 w-2 h-2 rounded-full bg-muted-foreground" /></Div>
      </Div>
      {/* Actions */}
      <Div className="relative flex gap-1">
        <Callout n={7} className="-top-1 -left-1" />
        <Div className="flex-1 rounded bg-red-400/15 text-red-400 text-[7px] font-semibold text-center py-1.5 border border-red-400/30 flex items-center justify-center gap-0.5"><Trash2 className="w-2.5 h-2.5" />Elimina</Div>
        <Div className="flex-1 rounded bg-primary text-primary-foreground text-[7px] font-semibold text-center py-1.5">Salva</Div>
      </Div>
    </>
  );
}
export function SemineModificaV2() {
  return <DualFrame url="Semine · Modifica" mobile={<Frame url="Semine · Modifica" tall><ModificaContent /></Frame>} desktop={<Frame url="Semine · Modifica" tall desktop><ModificaContent desktop /></Frame>} />;
}

// ── 7. DRAG & DROP (riordinamento manuale) ──────────────────
function DragContent({ desktop }) {
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Semine</Span>
        <Plus className="w-3.5 h-3.5 text-primary" />
      </Div>
      {/* Sort mode indicator */}
      <Div className="relative flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-1.5 py-1 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <GripVertical className="w-2.5 h-2.5 text-primary" />
        <Span className="text-[6px] text-primary font-semibold">Modalità riordino: trascina le card</Span>
      </Div>
      {/* Cards with drag state */}
      <Div className="relative space-y-1.5">
        <Callout n={2} className="-top-1 left-2" />
        {/* Dragged card (lifted) */}
        <Div className="rounded-lg bg-card border-2 border-primary shadow-2xl p-2 flex items-center gap-1.5 opacity-90" style={{ transform: 'translateY(-2px) rotate(1deg)' }}>
          <GripVertical className="w-2.5 h-2.5 text-primary" />
          <Avatar initials="MF" grad="from-amber-400/60 to-amber-400/20" size="w-6 h-6" text="text-[6px]" />
          <Div className="flex-1"><Div className="text-[7px] font-semibold text-foreground">Marco F.</Div><Div className="text-[5px] text-muted-foreground">@marco.f</Div></Div>
          <Span className="text-[5px] text-amber-400 bg-amber-400/15 px-1 rounded">contattato</Span>
        </Div>
        {/* Placeholder gap */}
        <Div className="h-7 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5" />
        {/* Other cards */}
        <Div className="rounded-lg bg-card border border-border p-2 flex items-center gap-1.5 opacity-50">
          <GripVertical className="w-2.5 h-2.5 text-muted-foreground/50" />
          <Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" size="w-6 h-6" text="text-[6px]" />
          <Div className="flex-1"><Div className="text-[7px] font-semibold text-foreground">Giulia R.</Div><Div className="text-[5px] text-muted-foreground">@giulia.r</Div></Div>
          <Span className="text-[5px] text-green-400 bg-green-400/15 px-1 rounded">interessato</Span>
        </Div>
        <Div className="rounded-lg bg-card border border-border p-2 flex items-center gap-1.5 opacity-50">
          <GripVertical className="w-2.5 h-2.5 text-muted-foreground/50" />
          <Avatar initials="SC" grad="from-green-400/50 to-green-400/10" size="w-6 h-6" text="text-[6px]" />
          <Div className="flex-1"><Div className="text-[7px] font-semibold text-foreground">Sara C.</Div><Div className="text-[5px] text-muted-foreground">@sara.c</Div></Div>
          <Span className="text-[5px] text-blue-400 bg-blue-400/15 px-1 rounded">nuovo</Span>
        </Div>
      </Div>
    </>
  );
}
export function SemineDragV2() {
  return <DualFrame url="Semine · Drag & Drop" mobile={<Frame url="Semine · Drag & Drop" tall><DragContent /></Frame>} desktop={<Frame url="Semine · Drag & Drop" tall desktop><DragContent desktop /></Frame>} />;
}

// ── 8. SEMINE SPENTE (view) ─────────────────────────────────
function SpenteContent({ desktop }) {
  const semine = [
    { i: 'AB', g: 'from-gray-400/40 to-gray-400/10', n: 'Antonio B.', ig: '@anto.b', st: 'contattato' },
    { i: 'LF', g: 'from-gray-400/40 to-gray-400/10', n: 'Laura F.', ig: '@laura.f', st: 'nuovo' },
    { i: 'DM', g: 'from-gray-400/40 to-gray-400/10', n: 'Daniele M.', ig: '@dan.m', st: 'interessato' },
  ];
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Span className="text-[11px] font-bold text-foreground">Semine</Span>
        <Plus className="w-3.5 h-3.5 text-primary" />
      </Div>
      {/* View toggle - on Spente */}
      <Div className="relative flex gap-0.5 bg-secondary/30 p-0.5 rounded-lg mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex-1 text-center py-0.5 rounded text-muted-foreground text-[7px] flex items-center justify-center gap-0.5"><Eye className="w-2.5 h-2.5" />Attive (12)</Div>
        <Div className="flex-1 text-center py-0.5 rounded bg-card text-[7px] font-semibold flex items-center justify-center gap-0.5"><EyeOff className="w-2.5 h-2.5" />Spente (3)</Div>
      </Div>
      {/* Info banner */}
      <Div className="relative rounded bg-amber-400/5 border border-amber-400/20 p-1.5 mb-2 flex items-center gap-1">
        <Callout n={2} className="-top-1 -left-1" />
        <EyeOff className="w-2.5 h-2.5 text-amber-400 shrink-0" />
        <Span className="text-[5px] text-amber-400/80">Le semine spente sono nascoste dal tab Inviti fino al riattivamento.</Span>
      </Div>
      {/* Greyed out cards */}
      <Div className="relative space-y-1.5">
        <Callout n={3} className="-top-1 left-2" />
        {semine.map((s, i) => (
          <Div key={i} className="rounded-lg bg-card border border-border p-2 flex items-center gap-1.5 opacity-60">
            <Avatar initials={s.i} grad={s.g} size="w-6 h-6" text="text-[6px]" />
            <Div className="flex-1 min-w-0">
              <Div className="text-[7px] font-semibold text-muted-foreground truncate">{s.n}</Div>
              <Div className="text-[5px] text-muted-foreground/70">{s.ig}</Div>
            </Div>
            <Div className="flex items-center gap-0.5">
              <Div className="rounded bg-green-400/10 text-green-400/60 text-[5px] px-1 py-0.5 border border-green-400/20 flex items-center gap-0.5"><Power className="w-2 h-2" />Riattiva</Div>
            </Div>
          </Div>
        ))}
      </Div>
    </>
  );
}
export function SemineSpenteV2() {
  return <DualFrame url="Semine · Spente" mobile={<Frame url="Semine · Spente" tall><SpenteContent /></Frame>} desktop={<Frame url="Semine · Spente" tall desktop><SpenteContent desktop /></Frame>} />;
}