// Port di src/components/programmazione/SeminaSidebar.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { CalendarClock, ArrowDownAZ, ArrowUpAZ, Instagram, Music2, Power, Lightbulb } from '@/ui/icons.generated';
import CachedImage from '@/web/components/shared/CachedImage';

import { Btn, Div, P, Span } from '@/ui/html';

const initials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const SORT_OPTIONS = [
  { key: 'smart', label: 'Smart', icon: Lightbulb },
  { key: 'recent', label: 'Recenti', icon: CalendarClock },
  { key: 'az', label: 'A-Z', icon: ArrowDownAZ },
  { key: 'za', label: 'Z-A', icon: ArrowUpAZ },
];

/**
 * Sidebar con lista nomi delle semine, cliccabili per evidenziare/selezionare
 * la card corrispondente. Pulsanti di ordinamento in alto.
 *
 * Desktop: colonna verticale 240px a sinistra.
 * Mobile: chips orizzontali scrollabili (gestito dal parent SeminaAgenda).
 */
export default function SeminaSidebar({ semine, sortBy, onSortChange, selectedId, onSelect, layout = 'desktop' }) {
  if (layout === 'mobile') {
    return (
      <Div className="sm:hidden">
        {/* Sort chips orizzontali */}
        <Div className="flex items-center gap-1.5 mb-2 overflow-x-auto no-scrollbar">
          {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
            <Btn
              button
              key={key}
              onClick={() => onSortChange(key)}
              className={`shrink-0 whitespace-nowrap inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-medium transition-colors ${
                sortBy === key
                  ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
                  : 'bg-secondary/30 text-muted-foreground border border-transparent'
              }`}>
              <Icon className="w-2.5 h-2.5 shrink-0" />{label}
            </Btn>
          ))}
        </Div>
        {/* Nomi come chips orizzontali */}
        <Div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
          {semine.length === 0 ? (
            <P className="text-xs text-muted-foreground py-2 px-1">Nessuna semina</P>
          ) : semine.map(s => {
            const isTikTok = (s.platform || 'instagram') === 'tiktok';
            const PlatformIcon = isTikTok ? Music2 : Instagram;
            const isOff = !!s.is_off;
            return (
              <Btn
                button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  selectedId === s.id
                    ? 'bg-pink-500/15 text-pink-400 border-pink-500/30'
                    : 'bg-secondary/30 text-foreground border-transparent'
                } ${isOff ? 'opacity-50' : ''}`}>
                <Span className={`w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-[9px] font-bold text-pink-200 overflow-hidden ${isOff ? 'grayscale' : ''}`}>
                  {s.photo_url
                    ? <CachedImage src={s.photo_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    : initials(s.name)}
                </Span>
                <Span className="max-w-[100px] truncate">{s.name}</Span>
                {isOff
                  ? <Power className="w-3 h-3 text-zinc-500 shrink-0" />
                  : <PlatformIcon className="w-3 h-3 opacity-60" />}
              </Btn>
            );
          })}
        </Div>
      </Div>
    );
  }

  // Desktop: colonna verticale
  return (
    <Div className="hidden sm:flex flex-col h-full">
      {/* Header sort — 4 bottoni su una riga, compatti */}
      <Div className="flex items-center gap-0.5 px-1 pb-2 border-b border-border">
        {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
          <Btn
            button
            key={key}
            onClick={() => onSortChange(key)}
            className={`shrink-0 whitespace-nowrap inline-flex items-center gap-0.5 px-1.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
              sortBy === key
                ? 'bg-pink-500/15 text-pink-400'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
            }`}>
            <Icon className="w-2.5 h-2.5 shrink-0" />{label}
          </Btn>
        ))}
      </Div>
      {/* Lista nomi */}
      <Div className="flex-1 overflow-y-auto py-1 space-y-0.5 min-h-0">
        {semine.length === 0 ? (
          <P className="text-xs text-muted-foreground text-center py-6">Nessuna semina</P>
        ) : semine.map(s => {
            const isTikTok = (s.platform || 'instagram') === 'tiktok';
            const PlatformIcon = isTikTok ? Music2 : Instagram;
            const isOff = !!s.is_off;
            return (
              <Btn
                button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                  selectedId === s.id
                    ? 'bg-pink-500/15 text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                } ${isOff ? 'opacity-50' : ''}`}>
                <Span className={`w-7 h-7 rounded-full bg-pink-500/20 flex items-center justify-center text-[10px] font-bold text-pink-200 overflow-hidden shrink-0 ${isOff ? 'grayscale' : ''}`}>
                  {s.photo_url
                    ? <CachedImage src={s.photo_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    : initials(s.name)}
                </Span>
                <Span className="flex-1 min-w-0">
                  <Span className="flex items-center gap-1">
                    <Span className="block text-xs font-medium truncate">{s.name}</Span>
                    {isOff && <Power className="w-2.5 h-2.5 text-zinc-500 shrink-0" />}
                  </Span>
                  <Span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <PlatformIcon className="w-2.5 h-2.5" />
                    {s.instagram || s.tiktok ? `@${(s.instagram || s.tiktok || '').replace('@', '')}` : '—'}
                  </Span>
                </Span>
              </Btn>
            );
          })}
      </Div>
    </Div>
  );
}