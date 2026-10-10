// Port di src/components/programmazione/SeminaInfoTile.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { motion } from '@/ui/motion';
import {
  ChevronDown, CalendarDays, MapPin, User, Briefcase, GraduationCap,
  Music2, Sparkles, Car, StickyNote, MessageCircle, Pencil, Trash2,
  Power, ArrowRight, Instagram, Zap, Clock, Hourglass, CalendarClock,
} from '@/ui/icons.generated';

import { Btn, Div, H, P, Span } from '@/ui/html';

const TIERS = [
  {
    icon: Zap,
    color: '#f472b6',
    label: 'Immediata',
    threshold: '≥10 messaggi in 15 min',
    timing: 'Estratta al ciclo corrente (entro 15 min)',
    desc: 'Estrae se ci sono almeno 10 o più messaggi negli ultimi 15 minuti, utile quando ti serve avere già info in chat veloci. ',
  },
  {
    icon: Clock,
    color: '#a78bfa',
    label: '2 ore',
    threshold: '5-9 messaggi in 2 ore',
    timing: 'Estratta al ciclo successivo (entro 2 ore)',
    desc: 'Se ci sono stati tra i 5 e i 9 messaggi, estrae entro due ore. Entra in gioco solo se non ci sono state estrazioni nelle 2 ore precedenti.',
  },
  {
    icon: Hourglass,
    color: '#60a5fa',
    label: '8 ore',
    threshold: '2-4 messaggi in 8 ore',
    timing: 'Estratta entro 8 ore',
    desc: 'Chat lente ma vive: pochi messaggi sparsi. Entra in gioco solo se non ci sono state estrazioni nelle 8 ore precedenti (nessuna fascia precedente ha già processato la chat).',
  },
  {
    icon: CalendarClock,
    color: '#fbbf24',
    label: '24 ore',
    threshold: '≥1 messaggio in 24 ore',
    timing: 'Estratta entro 24 ore',
    desc: 'Qualsiasi chat con almeno un messaggio nuovo viene analizzata entro un giorno. Niente resta indietro.',
  },
];

const CARD_ICONS = [
  { icon: Instagram, color: '#ec4899', label: 'Instagram', desc: 'Piattaforma del contatto' },
  { icon: Power, color: '#71717a', label: 'SPENTA', desc: 'Semina disattivata — grigia, nascosta dagli inviti' },
  { icon: ArrowRight, color: '#a78bfa', label: 'Gira', desc: 'Bottone per girare la card e vedere i dati AI estratti dai DM' },
  { icon: CalendarDays, color: '#a78bfa', label: 'Data', desc: 'Data di creazione della semina (badge viola)' },
  { icon: CalendarDays, color: '#60a5fa', label: 'Età', desc: 'Età del contatto (estratta AI o manuale)' },
  { icon: MapPin, color: '#34d399', label: 'Zona', desc: 'Quartiere/città di provenienza' },
  { icon: User, color: '#fbbf24', label: 'Promoter abituale', desc: 'Promoter con cui dice di entrare di solito' },
  { icon: Briefcase, color: '#22d3ee', label: 'Lavoro', desc: 'Che lavoro fa (con orari e sede se noti)' },
  { icon: GraduationCap, color: '#818cf8', label: 'Studio', desc: 'Scuola/università e sede' },
  { icon: Music2, color: '#f472b6', label: 'Locali frequentati', desc: 'Locali dove dice di andare abitualmente' },
  { icon: Sparkles, color: '#a78bfa', label: 'Inviti', desc: 'Serate a cui l\'hai invitata (con data)' },
  { icon: Car, color: '#f97316', label: 'Guidatrice', desc: 'Ha macchina e patente — utile per organizzare passaggi' },
  { icon: StickyNote, color: '#fbbf24', label: 'Nota', desc: 'Note personali — si salva automaticamente quando smetti di scrivere' },
  { icon: MessageCircle, color: '#a78bfa', label: 'Chat', desc: 'Apri la conversazione Instagram di questa semina' },
  { icon: Pencil, color: '#a1a1aa', label: 'Modifica', desc: 'Modifica i dettagli della semina' },
  { icon: Trash2, color: '#ef4444', label: 'Rimuovi', desc: 'Elimina la semina' },
];

export default function SeminaInfoTile() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-3 rounded-xl border border-pink-500/15 bg-card overflow-hidden"
    >
      <Btn
        button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-secondary/30 transition-colors">
        <Div className="flex items-center gap-2">
          <Div className="flex items-center justify-center p-1.5 rounded-lg" style={{ background: '#291824' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#ec4899' }} />
          </Div>
          <Span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#ec4899' }}>
            Come funzionano le Semine
          </Span>
        </Div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </Btn>

      {open && (
        <Div className="px-4 pb-4 space-y-4 border-t border-border/50 pt-3">
          {/* Fasce di estrazione AI */}
          <Div>
            <H className="text-xs font-semibold text-foreground/80 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-violet-400" />
              Fasce di estrazione AI dai messaggi Instagram
            </H>
            <P className="text-[11px] text-muted-foreground mb-2.5 leading-relaxed">
              L'AI legge le tue conversazioni Instagram e estrae automaticamente età, zona, lavoro, studio, locali e inviti.
              Non analizza ogni messaggio (consumerebbe troppi crediti): usa 4 fasce di priorità in base all'attività della chat.
                </P>
            <Div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TIERS.map(t => (
                <Div key={t.label} className="flex gap-2.5 p-2.5 rounded-lg bg-secondary/30 border border-border/50">
                  <Div className="flex items-center justify-center p-1.5 rounded-lg shrink-0 self-start" style={{ background: `${t.color}1a` }}>
                    <t.icon className="w-4 h-4" style={{ color: t.color }} />
                  </Div>
                  <Div className="min-w-0">
                    <Div className="flex items-baseline gap-2 flex-wrap">
                      <Span className="text-xs font-semibold" style={{ color: t.color }}>{t.label}</Span>
                      <Span className="text-[10px] text-muted-foreground">{t.threshold}</Span>
                    </Div>
                    <P className="text-[10px] text-foreground/70 mt-0.5 leading-snug">{t.desc}</P>
                    <P className="text-[10px] font-medium text-foreground/50 mt-0.5">⏱ {t.timing}</P>
                  </Div>
                </Div>
              ))}
            </Div>
          </Div>

          {/* Legenda icone card */}
          <Div>
            <H className="text-xs font-semibold text-foreground/80 mb-2 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              Legenda icone della card
            </H>
            <Div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
              {CARD_ICONS.map((item, i) => (
                <Div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-secondary/20">
                  <Div className="flex items-center justify-center p-1 rounded shrink-0" style={{ background: `${item.color}1a` }}>
                    <item.icon className="w-3 h-3" style={{ color: item.color }} />
                  </Div>
                  <Div className="min-w-0">
                    <Span className="text-[11px] font-semibold text-foreground">{item.label}</Span>
                    <P className="text-[10px] text-muted-foreground leading-tight">{item.desc}</P>
                  </Div>
                </Div>
              ))}
            </Div>
          </Div>

          {/* Spiegazione card */}
          <Div>
            <H className="text-xs font-semibold text-foreground/80 mb-2 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
              Cosa succede sulla card
            </H>
            <Div className="space-y-1.5 text-[11px] text-muted-foreground leading-relaxed">
              <Div className="flex gap-2">
                <Span className="text-pink-400 shrink-0">▸</Span>
                <Span><Span className='font-bold text-foreground/80'>Banner colorato</Span>: cliccabile per aprire il profilo Instagram/TikTok. Mostra la piattaforma e, se presente, la data dell'invito in alto.</Span>
              </Div>
              <Div className="flex gap-2">
                <Span className="text-pink-400 shrink-0">▸</Span>
                <Span><Span className='font-bold text-foreground/80'>Gira la card</Span>: il bottone viola in alto a destra ruota la card per vedere il retro con i dati AI estratti (riassunto, recettività, dettagli).</Span>
              </Div>
              <Div className="flex gap-2">
                <Span className="text-pink-400 shrink-0">▸</Span>
                <Span><Span className='font-bold text-foreground/80'>Pill info AI</Span>: chip colorate con età, zona, lavoro, studio, locali, inviti — aggiornate automaticamente dall'AI dai tuoi DM.</Span>
              </Div>
              <Div className="flex gap-2">
                <Span className="text-pink-400 shrink-0">▸</Span>
                <Span><Span className='font-bold text-foreground/80'>Nota inline</Span>: scrivi note personali. Si salva da sola quando smetti di scrivere (icona ✓ verde = salvato).</Span>
              </Div>
              <Div className="flex gap-2">
                <Span className="text-pink-400 shrink-0">▸</Span>
                <Span><Span className='font-bold text-foreground/80'>Slider recettività</Span>: imposta il livello (1 = da coltivare, 2 = ottima empatia, 3 = super recettiva/prossima a venire). L'AI lo aggiorna automaticamente in base ai messaggi.</Span>
              </Div>
              <Div className="flex gap-2">
                <Span className="text-pink-400 shrink-0">▸</Span>
                <Span><Span className='font-bold text-foreground/80'>Menu contestuale</Span>: long-press (mobile) o tasto destro (desktop) sulla card per aggiungerla a una serata, segnarla contattata, spegnerla, convertirla in cliente o incollare una foto.</Span>
              </Div>
              <Div className="flex gap-2">
                <Span className="text-pink-400 shrink-0">▸</Span>
                <Span><Span className='font-bold text-foreground/80'>Semine spente</Span>: le card grigie sono disattivate. Restano visibili in fondo ma nascoste dal tab Inviti finché non le riattivi.</Span>
              </Div>
            </Div>
          </Div>
        </Div>
      )}
    </motion.div>
  );
}