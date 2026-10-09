// Port di src/components/client/ClientLocationSelector.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, MapPin, X } from '@/ui/icons.generated';
import { Input } from '@/ui/input';
import { LOCATIONS_SORTED, LOCATION_BY_KEY, LABEL_TO_KEY, AREA_COLORS } from '@/web/lib/campaniaLocations';

import { Btn, Div, Span } from '@/ui/html';

import { doc as webDocument } from '@/web/shims/dom';

/**
 * Selettore geografico con ricerca: digiti e il sistema riconosce quartiere/comune.
 * Restituisce la residenza_key selezionata.
 */
export default function ClientLocationSelector({ value, onChange, className = '' }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const selected = value ? LOCATION_BY_KEY[value] : null;

  // Filtro risultati: match su label, area, keywords
  const results = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase()
      .replace(/[àá]/g, 'a').replace(/[èé]/g, 'e').replace(/[ìí]/g, 'i')
      .replace(/[òó]/g, 'o').replace(/[ùú]/g, 'u')
      .replace(/['']/g, '').replace(/[\/\-]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Prima: match esatto su LABEL_TO_KEY
    const exactKey = LABEL_TO_KEY[q] || LABEL_TO_KEY[search.trim()];
    if (exactKey && !selected) {
      return [LOCATION_BY_KEY[exactKey]];
    }

    // Secondo: fuzzy search
    return LOCATIONS_SORTED.filter(loc => {
      const labelLow = loc.label.toLowerCase();
      const areaLow = loc.area.toLowerCase();
      return labelLow.includes(q) || areaLow.includes(q) || 
             labelLow.split(' ').some(w => w.startsWith(q));
    }).slice(0, 12);
  }, [search]);

  // Chiudi dropdown quando clicchi fuori
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    webDocument.addEventListener('mousedown', handleClick);
    return () => webDocument.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (key) => {
    onChange(key);
    setSearch('');
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setSearch('');
  };

  return (
    <Div className={`relative ${className}`} ref={dropdownRef}>
      {selected ? (
        <Div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/20 px-3 py-2">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <Span className="text-sm font-medium flex-1 truncate">{selected.label}</Span>
          <Span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
            {selected.area}
          </Span>
          <Btn
            onClick={handleClear}
            className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/40 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </Btn>
        </Div>
      ) : (
        <Div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Quartiere o città in Campania..."
            value={search}
            onChange={e => { setSearch(e.target.value); setOpen(true); }}
            onFocus={() => { if (search) setOpen(true); }}
            className="pl-9 h-9 text-sm"
          />
          {open && results.length > 0 && (
            <Div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-popover shadow-xl z-50 max-h-56 overflow-y-auto">
              {results.map(loc => (
                <Btn
                  key={loc.key}
                  onClick={() => handleSelect(loc.key)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary/40 transition-colors text-left">
                  <Div className="w-2 h-2 rounded-full shrink-0" style={{ background: AREA_COLORS[loc.area] || '#666' }} />
                  <Span className="text-sm flex-1 truncate">{loc.label}</Span>
                  <Span className="text-[9px] text-muted-foreground shrink-0">{loc.area}</Span>
                </Btn>
              ))}
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}