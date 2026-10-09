// Port di src/components/client/SelectCheckbox.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Check } from '@/ui/icons.generated';

import { Span } from '@/ui/html';

/**
 * Indicatore di selezione rotondo (viola quando selezionato).
 * Usato da tutte le liste clienti in modalità selezione multipla.
 */
export default function SelectCheckbox({ selected, size = 'sm', className = '' }) {
  const sz = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const icon = size === 'lg' ? 'w-3 h-3' : 'w-2.5 h-2.5';
  return (
    <Span className={`${sz} rounded-full flex items-center justify-center border-2 transition-colors shrink-0 ${className} ${
      selected ? 'bg-violet-500 border-violet-500' : 'border-muted-foreground/40 bg-background/60'
    }`}>
      {selected && <Check className={`${icon} text-white`} />}
    </Span>
  );
}