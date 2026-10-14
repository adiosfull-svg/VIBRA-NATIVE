// Port di src/components/academy/mockups/MessaggiMockups.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import {
  Search, RefreshCw, Instagram, Send, Mic, X, Pin, Ban,
  UserPlus, CalendarPlus, MessageCircle, Star, Lock, Inbox,
} from '@/ui/icons.generated';
import { Callout, Frame, Avatar, DualFrame } from './shared';

import { Div, P, Span } from '@/ui/html';

// ── 1. LISTA CONVERSAZIONI ──────────────────────────────────
function ListaContent({ desktop }) {
  return (
    <>
      {/* Header */}
      <Div className="relative rounded-xl border border-pink-500/15 bg-card p-2 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-50" style={{ background: 'linear-gradient(90deg, transparent, #ec4899, transparent)' }} />
        <Div className="flex items-center justify-between mb-1.5">
          <Div className="flex items-center gap-1">
            <Instagram className="w-3 h-3 text-pink-400" />
            <Span className="text-[7px] font-semibold uppercase tracking-wider text-pink-300">Messaggi Instagram</Span>
          </Div>
          <Div className="flex items-center gap-1">
            <Span className="text-[5px] text-muted-foreground bg-secondary/40 px-1.5 py-0.5 rounded-full">8 conv · 3 non letti</Span>
            <Div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-pink-500/30 text-pink-400 bg-pink-500/10 text-[5px] font-semibold">
              <RefreshCw className="w-2 h-2" />Aggiorna
            </Div>
          </Div>
        </Div>
        {/* Search */}
        <Div className="flex items-center gap-1 rounded-lg bg-secondary/30 border border-border px-1.5 py-1">
          <Search className="w-2.5 h-2.5 text-muted-foreground" />
          <Span className="text-[6px] text-muted-foreground">Cerca per nome, handle, messaggio…</Span>
        </Div>
      </Div>

      {/* Sub-tabs */}
      <Div className="relative flex gap-1 p-1 rounded-xl border border-pink-500/15 bg-card mb-2">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="flex-1 text-center py-1 rounded-lg bg-pink-500/15 text-pink-300 border border-pink-500/30 text-[6px] font-semibold">Semine (3)</Div>
        <Div className="flex-1 text-center py-1 rounded-lg text-muted-foreground text-[6px] border border-transparent">Clienti (2)</Div>
        <Div className="flex-1 text-center py-1 rounded-lg text-muted-foreground text-[6px] border border-transparent">Non abbinati (3)</Div>
      </Div>

      {/* Conversation cards */}
      <Div className="space-y-1.5">
        {/* Pinned conversation (semina, unread) */}
        <Div className="relative rounded-xl border border-primary/40 bg-primary/5 p-2">
          <Callout n={3} className="-top-1 -left-1" />
          <Div className="flex items-start gap-1.5">
            <Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" size="w-7 h-7" text="text-[7px]" />
            <Div className="flex-1 min-w-0">
              <Div className="flex items-center gap-1">
                <Span className="text-[7px] font-semibold text-foreground truncate">Giulia Russo</Span>
                <Span className="text-[5px] text-primary bg-primary/10 px-1 rounded">semina</Span>
                <Pin className="w-2 h-2 text-primary ml-auto" />
              </Div>
              <Div className="text-[5px] text-muted-foreground truncate flex items-center gap-0.5">
                <Instagram className="w-2 h-2" />@giulia.r
              </Div>
              <Div className="text-[6px] text-foreground/70 truncate mt-0.5">Ciao! Mi piacerebbe venire sabato 🙌</Div>
            </Div>
            <Div className="flex flex-col items-end gap-0.5 shrink-0">
              <Span className="text-[5px] text-muted-foreground">2h fa</Span>
              <Span className="w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground text-[5px] flex items-center justify-center font-bold">2</Span>
            </Div>
          </Div>
        </Div>

        {/* Client conversation (read) */}
        <Div className="relative rounded-xl border border-border bg-card p-2">
          <Callout n={4} className="-top-1 -left-1" />
          <Div className="flex items-start gap-1.5">
            <Avatar initials="MF" grad="from-amber-400/60 to-amber-400/20" size="w-7 h-7" text="text-[7px]" />
            <Div className="flex-1 min-w-0">
              <Div className="flex items-center gap-1">
                <Span className="text-[7px] font-semibold text-foreground truncate">Marco Ferrara</Span>
                <Span className="text-[5px] text-amber-400 bg-amber-400/10 px-1 rounded">cliente</Span>
              </Div>
              <Div className="text-[5px] text-muted-foreground truncate flex items-center gap-0.5">
                <Instagram className="w-2 h-2" />@marco.f
              </Div>
              <Div className="text-[6px] text-foreground/70 truncate mt-0.5 flex items-center gap-0.5">
                <Mic className="w-2 h-2" />Messaggio vocale
              </Div>
            </Div>
            <Span className="text-[5px] text-muted-foreground shrink-0">5h fa</Span>
          </Div>
        </Div>

        {/* Unmatched conversation (unread) */}
        <Div className="rounded-xl border border-border bg-card p-2">
          <Div className="flex items-start gap-1.5">
            <Avatar initials="LB" grad="from-blue-400/60 to-blue-400/20" size="w-7 h-7" text="text-[7px]" />
            <Div className="flex-1 min-w-0">
              <Div className="flex items-center gap-1">
                <Span className="text-[7px] font-semibold text-foreground truncate">@lucia.v</Span>
              </Div>
              <Div className="text-[5px] text-muted-foreground truncate">Non abbinato</Div>
              <Div className="text-[6px] text-foreground/70 truncate mt-0.5">Quanto costa il tavolo?</Div>
            </Div>
            <Div className="flex flex-col items-end gap-0.5 shrink-0">
              <Span className="text-[5px] text-muted-foreground">1gg fa</Span>
              <Span className="w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground text-[5px] flex items-center justify-center font-bold">1</Span>
            </Div>
          </Div>
        </Div>
      </Div>
    </>
  );
}
export function MessaggiListaV2() {
  return (
    <DualFrame
      url="Messaggi · Lista"
      mobile={<Frame url="Messaggi · Lista" tall><ListaContent /></Frame>}
      desktop={<Frame url="Messaggi · Lista" tall desktop><ListaContent desktop /></Frame>}
    />
  );
}

// ── 2. CHAT APERTA + RISPOSTA ──────────────────────────────
function ChatContent({ desktop }) {
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Div className="flex items-center gap-1.5">
          <Instagram className="w-3.5 h-3.5 text-pink-400" />
          <Span className="text-[9px] font-bold text-foreground">Messaggi</Span>
        </Div>
        <X className="w-3.5 h-3.5 text-muted-foreground" />
      </Div>

      {/* Expanded conversation */}
      <Div className="relative rounded-xl border border-pink-500/20 bg-card overflow-hidden">
        <Callout n={1} className="-top-1 -left-1" />
        {/* Conv header */}
        <Div className="flex items-center gap-1.5 p-2 border-b border-border bg-secondary/30">
          <Avatar initials="GR" grad="from-pink-400/60 to-pink-400/20" size="w-7 h-7" text="text-[7px]" />
          <Div className="flex-1 min-w-0">
            <Div className="text-[8px] font-semibold text-foreground truncate">Giulia Russo</Div>
            <Div className="text-[5px] text-muted-foreground flex items-center gap-0.5">
              <Instagram className="w-2 h-2" />@giulia.r · <Span className="text-primary">semina</Span>
            </Div>
          </Div>
          <Instagram className="w-3 h-3 text-pink-400" />
        </Div>

        {/* Messages */}
        <Div className="p-2 space-y-1.5 min-h-[110px]">
          {/* Date separator */}
          <Div className="text-center text-[5px] text-muted-foreground py-0.5">Oggi</Div>
          {/* Incoming */}
          <Div className="flex gap-1">
            <Callout n={2} className="top-0 -left-1" />
            <Div className="max-w-[75%] rounded-xl rounded-tl-sm bg-secondary/40 px-2 py-1 text-[7px] text-foreground/90 leading-relaxed">
              Ciao! Ti ho scritto per sabato al Mantra 😊
            </Div>
          </Div>
          {/* Outgoing */}
          <Div className="flex justify-end">
            <Div className="max-w-[75%] rounded-xl rounded-tr-sm bg-primary text-primary-foreground px-2 py-1 text-[7px] leading-relaxed">
              Ehi Giulia! Certo, ti tengo un posto. Quanti siete?
            </Div>
          </Div>
          {/* Incoming */}
          <Div className="flex gap-1">
            <Div className="max-w-[75%] rounded-xl rounded-tl-sm bg-secondary/40 px-2 py-1 text-[7px] text-foreground/90 leading-relaxed">
              In 3, una è la prima volta 🙌
            </Div>
          </Div>
        </Div>

        {/* Reply input */}
        <Div className="relative border-t border-border p-2">
          <Callout n={3} className="-top-1 -left-1" />
          <Div className="flex items-center gap-1 rounded-xl bg-secondary/30 border border-border px-1.5 py-1">
            <Span className="text-[6px] text-muted-foreground flex-1">Scrivi una risposta…</Span>
            <Div className="w-5 h-5 rounded-lg bg-primary flex items-center justify-center">
              <Send className="w-2.5 h-2.5 text-primary-foreground" />
            </Div>
          </Div>
        </Div>
      </Div>
    </>
  );
}
export function MessaggiChatV2() {
  return (
    <DualFrame
      url="Messaggi · Chat"
      mobile={<Frame url="Messaggi · Chat" tall><ChatContent /></Frame>}
      desktop={<Frame url="Messaggi · Chat" tall desktop><ChatContent desktop /></Frame>}
    />
  );
}

// ── 3. MENU CONTESTUALE (long-press sulla conversazione) ───
function MenuContent({ desktop }) {
  return (
    <>
      <Div className="flex items-center justify-between mb-2">
        <Div className="flex items-center gap-1.5">
          <Instagram className="w-3.5 h-3.5 text-pink-400" />
          <Span className="text-[9px] font-bold text-foreground">Messaggi</Span>
        </Div>
      </Div>

      {/* Faded conversation card behind (trigger long-press) */}
      <Div className="relative rounded-xl border border-border bg-card p-2 opacity-40 mb-2">
        <Callout n={1} className="-top-1 -left-1" />
        <Div className="flex items-start gap-1.5">
          <Avatar initials="LB" grad="from-blue-400/60 to-blue-400/20" size="w-7 h-7" text="text-[7px]" />
          <Div className="flex-1 min-w-0">
            <Span className="text-[7px] font-semibold text-foreground truncate">@lucia.v</Span>
            <Div className="text-[5px] text-muted-foreground truncate">Non abbinato · Quanto costa il tavolo?</Div>
          </Div>
        </Div>
      </Div>

      {/* Context menu popup */}
      <Div className="relative rounded-xl border border-white/10 bg-popover shadow-2xl overflow-hidden">
        <Callout n={2} className="-top-1 -left-1" />
        <Div className="flex items-center justify-between px-2 py-1.5 border-b border-border/40 bg-secondary/40">
          <P className="text-[7px] font-semibold text-foreground truncate">@lucia.v</P>
          <X className="w-2.5 h-2.5 text-muted-foreground" />
        </Div>
        <Div className="py-0.5">
          <Div className="relative flex items-center gap-1.5 px-2 py-1.5">
            <Callout n={3} className="top-0 -left-1" />
            <UserPlus className="w-3 h-3 text-pink-400 shrink-0" />
            <Span className="text-[7px] font-medium text-foreground">Aggiungi alle Semine</Span>
          </Div>
          <Div className="relative flex items-center gap-1.5 px-2 py-1.5">
            <Callout n={4} className="top-0 -left-1" />
            <CalendarPlus className="w-3 h-3 text-blue-400 shrink-0" />
            <Span className="text-[7px] font-medium text-foreground">Aggiungi a una serata</Span>
          </Div>
          <Div className="flex items-center gap-1.5 px-2 py-1.5">
            <Pin className="w-3 h-3 text-primary shrink-0" />
            <Span className="text-[7px] font-medium text-foreground">Fissa in cima</Span>
          </Div>
          <Div className="border-t border-border/40 my-0.5" />
          <Div className="flex items-center gap-1.5 px-2 py-1.5">
            <Ban className="w-3 h-3 text-amber-400 shrink-0" />
            <Span className="text-[7px] font-medium text-amber-400">Ignora conversazione</Span>
          </Div>
        </Div>
      </Div>
    </>
  );
}
export function MessaggiMenuV2() {
  return (
    <DualFrame
      url="Messaggi · Menu"
      mobile={<Frame url="Messaggi · Menu" tall><MenuContent /></Frame>}
      desktop={<Frame url="Messaggi · Menu" tall desktop><MenuContent desktop /></Frame>}
    />
  );
}