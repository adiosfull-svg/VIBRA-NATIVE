// Port di src/components/programmazione/SeminaExtractionStatus.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';
import { Sparkles } from '@/ui/icons.generated';
import { formatDistanceToNowStrict } from 'date-fns';
import { it } from 'date-fns/locale';

import { Span } from '@/ui/html';

const BATCH_WINDOW_MS = 90 * 1000; // semine estratte nello stesso batch

/**
 * Mostra l'ultimo ciclo di estrazione AI dai DM e quante semine sono state
 * estratte, con la cadenza fissa del workflow (auto ogni 15 min).
 * I dati sono dedotti dal dataset delle semine (ai_extracted_at).
 */
export default function SeminaExtractionStatus({ semine }) {
  const { lastAt, count } = useMemo(() => {
    const extracted = semine.
    map((s) => s.ai_extracted_at ? new Date(s.ai_extracted_at).getTime() : 0).
    filter(Boolean);
    if (extracted.length === 0) return { lastAt: null, count: 0 };
    const max = Math.max(...extracted);
    const batchCount = extracted.filter((ts) => Math.abs(ts - max) <= BATCH_WINDOW_MS).length;
    return { lastAt: max, count: batchCount };
  }, [semine]);

  if (!lastAt) {
    return (
      <Span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70 whitespace-nowrap">
        <Sparkles className="w-3 h-3" />Nessuna estrazione AI
              </Span>
    );

  }

  const ago = formatDistanceToNowStrict(new Date(lastAt), { locale: it, addSuffix: true });

  return (
    <Span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground whitespace-nowrap">
      <Sparkles className="w-3 h-3 text-pink-500" />
      <Span>Ultimo ciclo {ago} · {count} semine · auto ogni 15 min</Span>
    </Span>
  );

}