// Port di src/components/client/CompanionSlot.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - <input> gesture/eventi web rimossi: onKeyDown
import React, { useState, useMemo } from 'react';
import { Search, X, Star, UserPlus, Plus } from '@/ui/icons.generated';
import ClientAvatar from '@/web/components/client/ClientAvatar';

import { Btn, Div, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

/**
 * Slot accompagnatore con nome (cerca/crea), importo pagato e rimozione.
 * Il pulsante "+" per aggiungere altri accompagnatori è gestito dal parent
 * (ParsedEntryCard) tramite onAddMore.
 */
export default function CompanionSlot({ slot, clients, existingClientIds, onChange, index, onAddMore }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return clients
      .filter(c => !existingClientIds.has(c.id))
      .filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instagram?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [searchQuery, clients, existingClientIds]);

  const handleSelectClient = (client) => {
    onChange({ ...slot, client, newName: '' });
    setSearchQuery('');
  };

  const handleCreateNew = () => {
    onChange({ ...slot, client: null, newName: searchQuery.trim() });
    setSearchQuery('');
  };

  const handleClear = () => {
    onChange({ ...slot, client: null, newName: '', revenue: 0 });
  };

  const handleRevenueChange = (val) => {
    onChange({ ...slot, revenue: Number(val) || 0 });
  };

  const handleNewPeopleChange = (val) => {
    onChange({ ...slot, new_people: Number(val) || 0 });
  };

  const isConfirmed = slot.client || slot.newName;

  // ── Row confermata: nome + importo + nuove + rimuovi ──
  if (isConfirmed) {
    return (
      <Div className="flex items-center gap-1.5 rounded-lg bg-secondary/30 border border-border px-2 py-1.5">
        <Span className="text-[9px] text-muted-foreground font-medium shrink-0">{index + 1}.</Span>
        {slot.client && <ClientAvatar client={slot.client} size="xs" initials={slot.client.name?.charAt(0)?.toUpperCase() || '?'} />}
        {slot.client?.is_leader && <Star className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" />}
        {slot.client ? (
          <Span className="text-xs text-foreground truncate flex-1">{slot.client.name}</Span>
        ) : (
          <Span className="flex items-center gap-1 text-xs text-violet-300 truncate flex-1">
            <UserPlus className="w-3 h-3 shrink-0" />{slot.newName}
          </Span>
        )}
        {/* Importo pagato dall'accompagnatore */}
        <Div className="flex items-center gap-0.5 shrink-0">
          <Span className="text-[9px] text-muted-foreground">€</Span>
          <HtmlInput
            type="number"
            min="0"
            value={slot.revenue || ''}
            onChange={e => handleRevenueChange(e.target.value)}
            placeholder="0"
            className="h-5 w-10 text-[10px] px-1 rounded bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary text-center"
          />
        </Div>
        {/* Persone nuove portate dall'accompagnatore */}
        <Div className="flex items-center gap-0.5 shrink-0">
          <Span className="text-[9px] text-emerald-400/70">N</Span>
          <HtmlInput
            type="number"
            min="0"
            value={slot.new_people || ''}
            onChange={e => handleNewPeopleChange(e.target.value)}
            placeholder="0"
            className="h-5 w-8 text-[10px] px-1 rounded bg-background border border-border focus:outline-none focus:ring-1 focus:ring-emerald-500/40 text-center text-emerald-400"
          />
        </Div>
        <Btn
          onClick={handleClear}
          className="text-muted-foreground hover:text-destructive shrink-0">
          <X className="w-3 h-3" />
        </Btn>
      </Div>
    );
  }

  // ── Ricerca: cerca cliente esistente o crea nuovo ──
  return (
    <Div className="relative">
      <Span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground font-medium z-10">{index + 1}.</Span>
      <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground z-10" />
      <HtmlInput
        autoFocus
        placeholder="Cerca o digita nome..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="w-full h-7 text-xs pl-12 pr-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary" />
      {searchQuery.trim() && (
        <Div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-xl max-h-32 overflow-y-auto p-1 space-y-0.5">
          {filteredClients.map(c => (
            <Btn
              key={c.id}
              onClick={() => handleSelectClient(c)}
              className="w-full flex items-center gap-2 text-left text-xs px-2 py-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
              <ClientAvatar client={c} size="xs" initials={c.name?.charAt(0)?.toUpperCase() || '?'} />
              {c.is_leader && <Star className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" />}
              <Span className="flex-1 truncate">{c.name}</Span>
              {c.instagram && <Span className="text-muted-foreground text-[10px] shrink-0">@{c.instagram}</Span>}
            </Btn>
          ))}
          <Btn
            onClick={handleCreateNew}
            className="w-full flex items-center gap-2 text-left text-xs px-2 py-1.5 rounded-lg hover:bg-violet-500/10 text-violet-300 transition-colors">
            <UserPlus className="w-3 h-3 shrink-0" />
            <Span>Crea nuovo: "{searchQuery.trim()}"</Span>
          </Btn>
        </Div>
      )}
    </Div>
  );
}