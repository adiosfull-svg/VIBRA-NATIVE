// Port di src/components/event/BatchImportPreview.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Check } from '@/ui/icons.generated';

import { Div, P, Span } from '@/ui/html';

export default function BatchImportPreview({ tab }) {
  const matchedCount = tab.extractedData.filter(d => d.matched).length;
  const totalRevenue = tab.extractedData.reduce((s, d) => s + d.revenue, 0);

  return (
    <Div className="space-y-5 pt-1">
      <Div className="rounded-lg bg-secondary/20 p-4 space-y-3">
        <Div className="flex items-center justify-between">
          <Span className="text-sm font-medium">Data:</Span>
          <Span className="text-sm">{tab.date}</Span>
        </Div>
        <Div className="flex items-center justify-between">
          <Span className="text-sm font-medium">Locale:</Span>
          <Span className="text-sm font-semibold">{tab.eventType || 'Sconosciuto'}</Span>
        </Div>
        {tab.physicalLocation && (
          <Div className="flex items-center justify-between">
            <Span className="text-sm font-medium">Location:</Span>
            <Span className="text-sm text-primary">{tab.physicalLocation}</Span>
          </Div>
        )}
        <Div className="flex items-center justify-between">
          <Span className="text-sm font-medium">Fatturato totale:</Span>
          <Span className="text-sm font-bold text-primary">€{totalRevenue.toLocaleString('it-IT')}</Span>
        </Div>
        <Div className="flex items-center justify-between">
          <Span className="text-sm font-medium">Promoter attivi:</Span>
          <Span className="text-sm">{matchedCount}/{tab.extractedData.length} · <Span className="text-muted-foreground">ex PR: {tab.extractedData.filter(d => !d.matched).length}</Span></Span>
        </Div>
      </Div>

      <Div>
        <P className="text-sm font-medium mb-2">Dati estratti:</P>
        <Div className="space-y-1.5 max-h-[32rem] overflow-y-auto pr-1">
          {tab.extractedData.map((item, i) => (
            <Div
              key={i}
              className={`p-2 rounded-lg border text-sm flex items-center justify-between ${
                item.matched
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-border bg-secondary/20'
              }`}
            >
              <Div className="flex items-center gap-2">
                {item.matched && <Check className="w-3.5 h-3.5 text-green-500" />}
                <Span className={`font-medium ${!item.matched ? 'text-muted-foreground' : ''}`}>{item.name}</Span>
                {!item.matched && <Span className="text-[10px] text-muted-foreground">→ Ex PR</Span>}
              </Div>
              <Span className="font-semibold text-primary">€{item.revenue.toLocaleString('it-IT')}</Span>
            </Div>
          ))}
        </Div>
      </Div>
    </Div>
  );
}