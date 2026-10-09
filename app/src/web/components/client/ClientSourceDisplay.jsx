// Port di src/components/client/ClientSourceDisplay.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Instagram, UserPlus, ArrowRightLeft, Search, UserCheck } from '@/ui/icons.generated';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput, Path, Svg } from '@/ui/elements';

/** Icona TikTok custom SVG */
function TikTokIcon({ className }) {
  return (
    <Svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <Path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.89a2.89 2.89 0 0 1-2.88 2.81 2.89 2.89 0 0 1-2.89-2.89c0-1.64 1.36-2.98 3-2.98.3 0 .58.05.86.13v-3.5c-.28-.04-.57-.06-.86-.06a6.45 6.45 0 0 0-6.45 6.45 6.45 6.45 0 0 0 6.45 6.45 6.45 6.45 0 0 0 6.45-6.45V8.58a8.29 8.29 0 0 0 4.84 1.54v-3.4c-.09 0-.18-.01-.26-.03h-.04z"/>
    </Svg>
  );
}

const SOURCE_CONFIG = {
  instagram: {
    prefix: 'Conosciuto su',
    label: 'Instagram',
    icon: Instagram,
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
    border: 'border-pink-400/30',
  },
  tiktok: {
    prefix: 'Conosciuto su',
    label: 'TikTok',
    icon: TikTokIcon,
    color: 'text-slate-200',
    bg: 'bg-slate-200/10',
    border: 'border-slate-200/30',
  },
  direct: {
    prefix: 'Conosciuto tramite',
    label: 'Contatto diretto',
    icon: UserPlus,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
  },
  referred: {
    prefix: null,
    label: 'Tramite...',
    icon: ArrowRightLeft,
    color: 'text-amber-200',
    bg: 'bg-amber-600/25',
    border: 'border-amber-500/40',
  },
  paganti_acquisiti: {
    prefix: 'Conosciuto tramite',
    label: 'Paganti acquisiti',
    icon: UserCheck,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/30',
  },
};

/** Mostra l'icona della fonte come badge piccolo (es. nella lista clienti) */
export function ClientSourceBadge({ sourceType, referredClientName, size = 'sm' }) {
  if (!sourceType) return null;
  const config = SOURCE_CONFIG[sourceType];
  if (!config) return null;

  const Icon = config.icon;
  const label = sourceType === 'referred' && referredClientName
    ? `Via ${referredClientName}`
    : config.label;

  if (size === 'xs') {
    return (
      <Span
        className={`inline-flex items-center gap-0.5 text-[9px] font-medium px-1 py-0.5 rounded border ${config.color} ${config.bg} ${config.border}`}
        accessibilityLabel={label}
      >
        {config.prefix && <Span className="text-[8px] opacity-70">{config.prefix}</Span>}
        <Icon className="w-2.5 h-2.5 shrink-0" />
        {sourceType !== 'referred' && <Span>{config.label}</Span>}
        {sourceType === 'referred' && referredClientName && <Span className="truncate max-w-[60px]">{referredClientName}</Span>}
      </Span>
    );
  }

  return (
    <Span
      className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${config.color} ${config.bg} ${config.border}`}
      accessibilityLabel={label}
    >
      {config.prefix && <Span className="text-[9px] opacity-70">{config.prefix}</Span>}
      <Icon className="w-3 h-3 shrink-0" />
      <Span className="whitespace-nowrap">{label}</Span>
    </Span>
  );
}

/** Selector per il form (usa icone grandi con label). Clic ricliccando si disattiva. */
export default function ClientSourceSelector({ value, referredClientId, clients, onChange }) {
  const sourceType = value || null;
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    if (sourceType === 'referred' && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [sourceType]);

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter(c => c.name?.toLowerCase().includes(q));
  }, [clients, search]);

  const handleSelect = (key) => {
    // Toggle: se clicco la stessa fonte già selezionata, la disattivo
    if (sourceType === key) {
      onChange({ sourceType: null, referredClientId: null });
      setSearch('');
    } else {
      onChange({ sourceType: key, referredClientId: key === 'referred' ? referredClientId : null });
      if (key !== 'referred') setSearch('');
    }
  };

  const handleReferredSelect = (clientId) => {
    onChange({ sourceType: 'referred', referredClientId: clientId });
  };

  return (
    <Div className="space-y-3">
      {/* Griglia opzioni */}
      <Div className="grid grid-cols-5 gap-2">
        {Object.entries(SOURCE_CONFIG).map(([key, config]) => {
          const Icon = config.icon;
          const isSelected = sourceType === key;
          return (
            <Btn
              button
              key={key}
              onClick={() => handleSelect(key)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                isSelected
                  ? `${config.bg} ${config.border} ${config.color}`
                  : 'border-border bg-card hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
              }`}>
              <Icon className={`w-5 h-5 ${isSelected ? config.color : ''}`} />
              <Span className="text-[10px] font-medium leading-tight text-center">{config.label}</Span>
            </Btn>
          );
        })}
      </Div>

      {/* Ricerca "Tramite" */}
      {sourceType === 'referred' && (
        <Div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 space-y-2">
          <P className="text-[10px] text-amber-300/80 font-medium uppercase tracking-wider">
            Cerca il cliente che ti ha presentato
          </P>
          <Div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <HtmlInput
              ref={searchRef}
              type="text"
              placeholder="Cerca tra i clienti..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-secondary/60 border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </Div>
          <Div
            className="max-h-32 overflow-y-auto space-y-0.5 source-referred-scroll"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(240 5% 20%) transparent',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
            }}
            onWheel={e => e.stopPropagation()}
            onTouchMove={e => e.stopPropagation()}>
            {filteredClients.length === 0 ? (
              <P className="text-xs text-muted-foreground px-1 py-2">Nessun cliente trovato</P>
            ) : (
              filteredClients.map(c => (
                <Btn
                  button
                  key={c.id}
                  onClick={() => handleReferredSelect(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    referredClientId === c.id
                      ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                      : 'text-foreground/80 hover:bg-secondary/60'
                  }`}>
                  {c.name}
                </Btn>
              ))
            )}
          </Div>
        </Div>
      )}
    </Div>
  );
}

export { SOURCE_CONFIG };