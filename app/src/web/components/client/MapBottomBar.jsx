// Port di src/components/client/MapBottomBar.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { Gem, Users, Expand, ChevronUp } from '@/ui/icons.generated';
import { rankingColor } from '@/legacy/utils/clientRanking';

import { Btn, Div, P, Span } from '@/ui/html';
import { Circle, Path, Rect, Svg } from '@/ui/elements';

const CarIcon = () => (
  <Svg viewBox="0 0 24 12" width="14" height="7" fill="none" style={{display:'inline',flexShrink:0}}>
    <Rect x="1" y="5" width="22" height="6" rx="2" fill="#3b82f6"/>
    <Path d="M4 5 L6.5 1.5 L17.5 1.5 L20 5 Z" fill="#60a5fa"/>
    <Circle cx="6" cy="11" r="1.8" fill="#1e3a5f" stroke="#93c5fd" strokeWidth="0.8"/>
    <Circle cx="18" cy="11" r="1.8" fill="#1e3a5f" stroke="#93c5fd" strokeWidth="0.8"/>
  </Svg>
);

function initialsOf(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (parts[0]?.[0] || '?').toUpperCase();
}

const PREVIEW_MAX = 8;

export default function MapBottomBar({ visibleClients = [], onClientClick }) {
  const [expanded, setExpanded] = useState(false);

  if (visibleClients.length === 0) {
    return (
      <Div className="rounded-xl border border-border bg-secondary/20 px-3 py-2.5 text-center">
        <P className="text-[11px] text-muted-foreground">Nessun cliente in vista — sposta o riduci lo zoom</P>
      </Div>
    );
  }

  const displayClients = expanded ? visibleClients : visibleClients.slice(0, PREVIEW_MAX);
  const overflow = visibleClients.length - PREVIEW_MAX;
  const driverCount = visibleClients.filter(({ client }) => client.is_driver).length;

  return (
    <Div className="rounded-xl border border-border bg-secondary/20 p-2 space-y-1.5">
      {/* Header — il toggle resta sempre qui, non si sposta */}
      <Div className="flex items-center gap-1.5 px-1 flex-wrap">
        <Users className="w-3.5 h-3.5 text-primary shrink-0" />
        <Span className="text-[11px] font-semibold">{visibleClients.length} clienti in vista</Span>
        {driverCount > 0 && (
          <Span className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-semibold">
            <CarIcon />{driverCount} guidator{driverCount === 1 ? 'e' : 'i'}
          </Span>
        )}
        <Span className="text-[10px] text-muted-foreground">· per rating</Span>
        {overflow > 0 && (
          <Btn
            button
            onClick={() => setExpanded(e => !e)}
            className="ml-auto flex items-center gap-1 text-[10px] font-medium text-primary hover:text-primary/80 px-2 py-0.5 rounded-md border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Comprimi
              </>
            ) : (
              <>
                <Expand className="w-3 h-3" />
                +{overflow} altri
              </>
            )}
          </Btn>
        )}
      </Div>

      {/* Chip clienti */}
      {expanded ? (
        <Div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto recontact-scrollbar pb-0.5">
          {displayClients.map(({ client, rating }) => (
            <Btn
              button
              key={client.id}
              onClick={() => onClientClick?.(client.id)}
              className="flex items-center gap-2 shrink-0 px-2.5 py-1.5 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors">
              <Div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                {initialsOf(client.name)}
              </Div>
              <Span className="text-[11px] font-medium whitespace-nowrap">{client.name}</Span>
              {rating != null && (
                <Span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${rankingColor(rating)}`}>
                  <Gem className="w-3 h-3" />{rating.toFixed(1)}
                </Span>
              )}
            </Btn>
          ))}
        </Div>
      ) : (
        <Div className="flex gap-2 overflow-x-auto pb-0.5" style={{ WebkitOverflowScrolling: 'touch' }}>
          {displayClients.map(({ client, rating }) => (
            <Btn
              button
              key={client.id}
              onClick={() => onClientClick?.(client.id)}
              className="flex items-center gap-2 shrink-0 px-2.5 py-1.5 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors">
              <Div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                {initialsOf(client.name)}
              </Div>
              <Span className="text-[11px] font-medium whitespace-nowrap">{client.name}</Span>
              {rating != null && (
                <Span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${rankingColor(rating)}`}>
                  <Gem className="w-3 h-3" />{rating.toFixed(1)}
                </Span>
              )}
            </Btn>
          ))}
        </Div>
      )}
    </Div>
  );
}