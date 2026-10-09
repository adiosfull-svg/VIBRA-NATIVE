// Port di src/components/client/ClientTipologiaBadge.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { normalizeTipologia, TIPOLOGIE } from './ClientTipologiaSelector';

import { Span } from '@/ui/html';

const TIPOLOGIA_MAP = Object.fromEntries(TIPOLOGIE.map(t => [t.value, t]));

export default function ClientTipologiaBadge({ tipologia }) {
  const tipologie = normalizeTipologia(tipologia);
  if (tipologie.length === 0) return null;
  return (
    <Span className="inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded border bg-violet-500/10 border-violet-500/30 text-violet-300 shrink-0">
      <Span className="inline-flex items-center gap-0.5">
        {tipologie.map(t => {
          const meta = TIPOLOGIA_MAP[t];
          return meta ? <meta.Icon key={t} className="w-2.5 h-2.5" /> : null;
        })}
      </Span>
      <Span>{tipologie.map(t => {
        const meta = TIPOLOGIA_MAP[t];
        return meta ? meta.label : '';
      }).join(', ')}</Span>
    </Span>
  );
}