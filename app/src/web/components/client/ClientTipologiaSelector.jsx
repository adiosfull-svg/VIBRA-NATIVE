// Port di src/components/client/ClientTipologiaSelector.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { UserX, PartyPopper, Users, User, UserCheck, PhoneOff, Heart, Crown, ArrowRightLeft } from '@/ui/icons.generated';

import { Btn, Div, Span } from '@/ui/html';

// Status del pagante (campo Client.stato_pagante). Vuoto / 'attivo' = pagante attivo (default).
// Letto dall'Analisi Intelligente (computeAISuggestions / computeWeeklySuggestions).
export const STATI_PAGANTE = [
  { value: 'attivo', label: 'Attivo', short: 'Attivo', desc: 'Pagante regolare', Icon: UserCheck,
    chip: 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25', sel: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' },
  { value: 'contatti_persi', label: 'Contatti persi', short: 'Persi', desc: 'Non ci sentiamo più', Icon: PhoneOff,
    chip: 'bg-red-500/15 text-red-300 hover:bg-red-500/25', sel: 'bg-red-500/15 border-red-500/40 text-red-300' },
  { value: 'fidanzato', label: 'Attualmente fidanzato', short: 'Fidanzato', desc: 'Verrà sicuramente di meno, il suo gruppo potrebbe aver perso un leader', Icon: Heart,
    chip: 'bg-pink-500/15 text-pink-300 hover:bg-pink-500/25', sel: 'bg-pink-500/15 border-pink-500/40 text-pink-300' },
  { value: 'diventato_pr', label: 'Diventato PR', short: 'Ora PR', desc: 'Storico solo commemorativo', Icon: Crown,
    chip: 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25', sel: 'bg-amber-500/15 border-amber-500/40 text-amber-300' },
  { value: 'altro_pr', label: 'Entra con un altro PR', short: 'Altro PR', desc: 'Non entra più con me, magari recuperabile', Icon: ArrowRightLeft,
    chip: 'bg-orange-500/15 text-orange-300 hover:bg-orange-500/25', sel: 'bg-orange-500/15 border-orange-500/40 text-orange-300' },
];
const STATO_BY_VALUE = Object.fromEntries(STATI_PAGANTE.map(s => [s.value, s]));
export const getStatoMeta = (v) => STATO_BY_VALUE[v] || STATO_BY_VALUE.attivo;

export function ClientStatoSelector({ value, onChange }) {
  const current = getStatoMeta(value).value;
  return (
    <Div className="flex flex-col gap-1.5">
      {STATI_PAGANTE.map(s => (
        <Btn
          key={s.value}
          onClick={() => onChange(s.value)}
          className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
            current === s.value ? s.sel : 'bg-secondary/20 border-border text-muted-foreground hover:bg-secondary/40'
          }`}>
          <s.Icon className="w-4 h-4 shrink-0" />
          <Span className="min-w-0 flex-1">
            <Span className="block text-xs font-semibold leading-tight">{s.label}</Span>
            <Span className="block text-[10px] leading-tight opacity-80">{s.desc}</Span>
          </Span>
        </Btn>
      ))}
    </Div>
  );
}

export const TIPOLOGIE = [
  { value: 'isolato', label: 'Isolato', desc: 'In cerca di amicizie', Icon: UserX },
  { value: 'casinista', label: 'Casinista', desc: 'Anima della serata', Icon: PartyPopper },
  { value: 'aggregatore', label: 'Aggregatore', desc: 'Viene sempre in compagnia', Icon: Users },
  { value: 'normale', label: 'Normale', desc: 'Segue gli amici in serata', Icon: User },
];

export const normalizeTipologia = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === 'string') return [val];
  return [];
};

export default function ClientTipologiaSelector({ value, onChange }) {
  const selected = normalizeTipologia(value);

  const toggle = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <Div className="grid grid-cols-2 gap-2">
      {TIPOLOGIE.map(t => (
        <Btn
          key={t.value}
          onClick={() => toggle(t.value)}
          className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border text-center transition-all ${
            selected.includes(t.value)
              ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
              : 'bg-secondary/20 border-border text-muted-foreground hover:bg-secondary/40'
          }`}>
          <t.Icon className="w-5 h-5" />
          <Span className="text-xs font-semibold leading-none">{t.label}</Span>
          <Span className="text-[10px] leading-tight opacity-80">{t.desc}</Span>
        </Btn>
      ))}
    </Div>
  );
}