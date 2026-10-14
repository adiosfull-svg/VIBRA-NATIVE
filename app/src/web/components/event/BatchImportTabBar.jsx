// Port di src/components/event/BatchImportTabBar.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Check, Plus, X } from '@/ui/icons.generated';

import { Btn, Div, Span } from '@/ui/html';

function tabLabel(tab, index) {
  const hasVenue = tab.eventType && !tab.eventType.startsWith('__sep_');
  let dateLabel = '';
  if (tab.date) {
    const [y, m, d] = tab.date.split('-');
    dateLabel = `${d}/${m}`;
  }
  if (hasVenue && dateLabel) return `${tab.eventType} - ${dateLabel}`;
  if (hasVenue) return tab.eventType;
  if (dateLabel) return dateLabel;
  return `Serata ${index + 1}`;
}

export default function BatchImportTabBar({ tabs, activeTabId, onSelect, onAdd, onRemove }) {
  return (
    <Div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border">
      {tabs.map((tab, i) => (
        <Btn
          button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors ${
            tab.id === activeTabId
              ? 'border-primary text-foreground bg-secondary/30'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20'
          }`}
        >
          {tab.extractedData.length > 0 && <Check className="w-3 h-3 text-green-500" />}
          <Span>{tabLabel(tab, i)}</Span>
          {tabs.length > 1 && (
            <Span
              onPress={(e) => { e.stopPropagation(); onRemove(tab.id); }}
              className="opacity-60 hover:opacity-100 hover:text-destructive transition-opacity"
            >
              <X className="w-3 h-3" />
            </Span>
          )}
        </Btn>
      ))}
      <Btn
        button
        onClick={onAdd}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors"
        accessibilityLabel="Aggiungi un'altra serata"
      >
        <Plus className="w-4 h-4" />
      </Btn>
    </Div>
  );
}