// Port di src/components/client/ClientBirthDateEditor.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { calculateAge } from '@/legacy/utils/clientAge';

import { Div, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

export default function ClientBirthDateEditor({ value, onChange }) {
  const isFullDate = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const age = calculateAge(value);

  return (
    <Div className="space-y-2">
      <Div className="flex items-center gap-2">
        <HtmlInput
          type="date"
          value={isFullDate ? value : ''}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground"
        />
        <Span className="text-[11px] text-muted-foreground whitespace-nowrap">o solo anno</Span>
        <HtmlInput
          type="number"
          min="1940"
          max={new Date().getFullYear()}
          value={isFullDate ? '' : (value || '')}
          onChange={e => onChange(e.target.value)}
          placeholder="YYYY"
          className="w-20 px-2 py-2 rounded-lg bg-card border border-border text-sm text-foreground"
        />
      </Div>
      {age && (
        <P className="text-xs text-muted-foreground">
          Età: <Span className="text-foreground font-medium">{age.label}</Span>
        </P>
      )}
    </Div>
  );
}