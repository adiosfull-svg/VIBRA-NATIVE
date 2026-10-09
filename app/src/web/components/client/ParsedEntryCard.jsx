// Port di src/components/client/ParsedEntryCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { base44 } from '@/lib/base44';
import { useQueryClient } from '@tanstack/react-query';
import { Search, X, Check, Star, UserPlus, AlertCircle, Loader2, ChevronDown, ChevronUp, Users, Plus, FolderPlus } from '@/ui/icons.generated';
import CompanionSlot from '@/web/components/client/CompanionSlot';
import ClientAvatar from '@/web/components/client/ClientAvatar';

import { Btn, Div, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

const CONFIDENCE_COLOR = {
  high: 'text-emerald-400',
  medium: 'text-amber-400',
  low: 'text-orange-400',
  none: 'text-red-400',
};

const CONFIDENCE_BG = {
  high: 'bg-emerald-500/15 border-emerald-500/30',
  medium: 'bg-amber-500/15 border-amber-500/30',
  low: 'bg-orange-500/15 border-orange-500/30',
  none: 'bg-red-500/15 border-red-500/30',
};

const DEFAULT_AMOUNT = 30;

export default function ParsedEntryCard({ entry, clients, groups, existingClientIds, promoterId, onUpdate, onClientDetail, onClientCreated }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [createName, setCreateName] = useState('');
  const [companionsOpen, setCompanionsOpen] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);
  const [showGroupCreate, setShowGroupCreate] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [groupCreated, setGroupCreated] = useState(false);
  const qc = useQueryClient();

  const selectedClient = entry.selectedClient;
  const isConfirmed = selectedClient || entry.createNew;
  const isExcluded = entry.excluded;
  const isAlreadyPresent = selectedClient && existingClientIds.has(selectedClient.id);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return clients
      .filter(c => !existingClientIds.has(c.id))
      .filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instagram?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 6);
  }, [searchQuery, clients, existingClientIds]);

  const computeGroupMembers = (client) => {
    if (!client?.is_leader || !groups) return [];
    const members = [];
    const seenIds = new Set();
    groups.forEach(g => {
      if ((g.client_ids || []).includes(client.id)) {
        (g.client_ids || []).forEach(id => {
          if (id !== client.id && !existingClientIds.has(id) && !seenIds.has(id)) {
            const member = clients.find(c => c.id === id);
            if (member) {
              seenIds.add(id);
              members.push({ client: member, excluded: false, rev: DEFAULT_AMOUNT, ppl: 0 });
            }
          }
        });
      }
    });
    return members;
  };

  const handleConfirmMatch = () => {
    if (entry.matchedClientObj) {
      const client = entry.matchedClientObj;
      onUpdate({ ...entry, selectedClient: client, createNew: false, groupMembers: computeGroupMembers(client) });
    }
  };

  const handleSelectClient = (client) => {
    onUpdate({ ...entry, selectedClient: client, createNew: false, groupMembers: computeGroupMembers(client) });
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleStartCreate = () => {
    setCreateName(entry.raw_name);
    setCreateMode('editing');
  };

  const handleConfirmCreate = async () => {
    if (!createName.trim()) return;
    setCreating(true);
    try {
      const newClient = await base44.entities.Client.create({
        name: createName.trim(),
        promoter_id: promoterId,
      });
      qc.invalidateQueries({ queryKey: ['clients'] });
      if (onClientCreated) {
        await onClientCreated(newClient, entry);
      } else {
        onUpdate({ ...entry, selectedClient: newClient, createNew: false });
      }
      setCreateMode(false);
    } finally {
      setCreating(false);
    }
  };

  // "+" aggiungi accompagnatore: non tocca people_brought, importo default 30
  const handleAddCompanion = () => {
    const newCompanions = [...(entry.companions || []), { client: null, newName: '', revenue: DEFAULT_AMOUNT, new_people: 0 }];
    onUpdate({ ...entry, companions: newCompanions });
    setCompanionsOpen(true);
  };

  const handleAmountChange = (val) => {
    onUpdate({ ...entry, total_amount: Number(val) || 0 });
  };

  const handlePeopleChange = (val) => {
    onUpdate({ ...entry, people_brought: Number(val) || 0 });
  };

  const handleNewPeopleChange = (val) => {
    onUpdate({ ...entry, new_people: Number(val) || 0 });
  };

  // Crea gruppo dal singolo riquadro: principale + accompagnatori confermati
  const entryGroupClients = useMemo(() => {
    const list = [];
    if (selectedClient && !isExcluded && !isAlreadyPresent) list.push(selectedClient);
    (entry.companions || []).forEach(c => { if (c.client) list.push(c.client); });
    return list;
  }, [selectedClient, isExcluded, isAlreadyPresent, entry.companions]);

  const handleCreateEntryGroup = async () => {
    if (!groupName.trim() || entryGroupClients.length === 0 || !promoterId) return;
    setCreatingGroup(true);
    try {
      await base44.entities.ClientGroup.create({
        promoter_id: promoterId,
        name: groupName.trim(),
        client_ids: entryGroupClients.map(c => c.id),
      });
      qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
      setGroupCreated(true);
      setShowGroupCreate(false);
      setGroupName('');
      setTimeout(() => setGroupCreated(false), 3000);
    } catch (err) {
      console.error('Group creation error:', err);
    } finally {
      setCreatingGroup(false);
    }
  };

  const handleCompanionChange = (idx, newSlot) => {
    const newCompanions = [...(entry.companions || [])];
    newCompanions[idx] = newSlot;
    onUpdate({ ...entry, companions: newCompanions });
  };

  const handleExclude = () => {
    onUpdate({ ...entry, excluded: !entry.excluded });
  };

  if (isExcluded) {
    return (
      <Div className="flex items-center gap-2.5 rounded-xl border border-border/30 bg-transparent opacity-40 px-3 py-2.5">
        <Span className="text-xs text-muted-foreground flex-1 truncate">{entry.raw_name}</Span>
        <Btn
          onClick={handleExclude}
          className="text-[10px] text-primary hover:underline">Includi</Btn>
      </Div>
    );
  }

  const identifiedCompanions = (entry.companions || []).filter(c => c.client || c.newName).length;
  const companionCount = (entry.companions || []).length;

  return (
    <Div className={`rounded-2xl border px-3.5 py-3 space-y-2.5 transition-all duration-300 ${
      isAlreadyPresent ? 'border-blue-500/20 bg-blue-500/5 shadow-sm' :
      isConfirmed ? 'border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 via-emerald-500/3 to-transparent shadow-lg shadow-emerald-500/5' :
      'border-amber-500/20 bg-gradient-to-br from-amber-500/6 via-amber-500/2 to-transparent shadow-md shadow-amber-500/5'
    }`}>
      {/* Riga 1: nome raw + badge + exclude */}
      <Div className="flex items-center gap-2">
        <Div className={`w-1 self-stretch min-h-[20px] rounded-full shrink-0 ${
          isAlreadyPresent ? 'bg-blue-400/40' :
          isConfirmed ? 'bg-emerald-400/60' :
          'bg-amber-400/40'
        }`} />
        <Span className="text-xs font-bold text-foreground/90 flex-1 break-words leading-tight">{entry.raw_name}</Span>
        {entry.is_single && (
          <Span className="text-[9px] text-blue-400 font-bold uppercase tracking-wide shrink-0 px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            singolo
          </Span>
        )}
        <Btn
          onClick={handleExclude}
          className="text-muted-foreground/50 hover:text-destructive shrink-0 transition-colors">
          <X className="w-3.5 h-3.5" />
        </Btn>
      </Div>

      {/* Riga 2: area conferma cliente */}
      {isAlreadyPresent ? (
        <Div className="flex items-center gap-2 text-[11px] text-blue-400/80 rounded-lg bg-blue-500/5 border border-blue-500/15 px-2.5 py-1.5">
          <AlertCircle className="w-3 h-3 shrink-0" /> Già presente in questa serata
        </Div>
      ) : isConfirmed && !searchOpen ? (
        <Div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 border border-emerald-500/25 px-2.5 py-2 shadow-sm shadow-emerald-500/10">
          <Div className="w-5 h-5 rounded-full bg-emerald-500/25 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
            <Check className="w-3 h-3 text-emerald-300" />
          </Div>
          {selectedClient && <ClientAvatar client={selectedClient} size="xs" initials={selectedClient.name?.charAt(0)?.toUpperCase() || '?'} />}
          {selectedClient?.is_leader && <Star className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" />}
          <Btn
            onClick={() => onClientDetail?.(selectedClient)}
            className="text-xs font-semibold text-emerald-200 break-words leading-tight flex-1 text-left hover:underline">
            {selectedClient?.name}
          </Btn>
          <Btn
            onClick={() => setSearchOpen(true)}
            className="text-[10px] text-muted-foreground/70 hover:text-foreground shrink-0 transition-colors">Cambia</Btn>
        </Div>
      ) : !isConfirmed && !searchOpen && entry.matched_client_id && !createMode ? (
        <Div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-secondary/40 to-secondary/10 border border-border/50 px-2.5 py-2 shadow-sm">
          <Span className={`text-[9px] font-bold uppercase shrink-0 px-1.5 py-0.5 rounded-full border ${CONFIDENCE_BG[entry.match_confidence]} ${CONFIDENCE_COLOR[entry.match_confidence]}`}>
            {entry.match_confidence === 'high' ? 'Sicuro' : entry.match_confidence === 'medium' ? 'Probabile' : 'Incerto'}
          </Span>
          {entry.matchedClientObj && <ClientAvatar client={entry.matchedClientObj} size="xs" initials={entry.matchedClientObj.name?.charAt(0)?.toUpperCase() || '?'} />}
          {entry.matchedClientObj?.is_leader && <Star className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" />}
          <Span className="text-xs text-foreground/90 break-words leading-tight flex-1 min-w-0">{entry.matched_client_name}</Span>
          <Btn
            onClick={handleConfirmMatch}
            className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/15 rounded-md px-2 py-1 shrink-0 transition-colors shadow-sm shadow-emerald-500/10">
            <Check className="w-3 h-3" /> Conferma
          </Btn>
          <Btn
            onClick={() => setSearchOpen(true)}
            className="text-[10px] text-muted-foreground/70 hover:text-foreground shrink-0 ml-auto transition-colors">Cambia</Btn>
        </Div>
      ) : createMode === 'editing' ? (
        <Div className="space-y-2">
          <Div className="flex items-center gap-1.5">
            <HtmlInput
              autoFocus
              value={createName}
              onChange={e => setCreateName(e.target.value)}
              className="flex-1 h-9 text-xs px-3 rounded-lg bg-background border border-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500/30 shadow-sm"
              placeholder="Nome cliente..."
              onKeyDown={e => { if (e.key === 'Enter') handleConfirmCreate(); if (e.key === 'Escape') setCreateMode(false); }} />
            <Btn
              onClick={() => setCreateMode(false)}
              className="text-muted-foreground hover:text-destructive shrink-0 p-1">
              <X className="w-3.5 h-3.5" />
            </Btn>
          </Div>
          <Btn
            onClick={handleConfirmCreate}
            disabled={creating || !createName.trim()}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 rounded-lg py-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-600/25">
            {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Check className="w-3.5 h-3.5" /> Conferma cliente</>}
          </Btn>
        </Div>
      ) : (
        <Div className="space-y-1.5">
          {!isConfirmed && !searchOpen && (
            <Div className="flex items-center gap-1.5 text-[11px] text-amber-400/80 rounded-lg bg-amber-500/5 border border-amber-500/15 px-2.5 py-1.5">
              <AlertCircle className="w-3 h-3 shrink-0" /> Cliente non trovato
            </Div>
          )}
          {searchOpen && (
            <Div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <HtmlInput
                autoFocus
                placeholder="Cerca cliente..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-8 text-xs pl-8 pr-3 rounded-lg bg-background border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
              />
              {filteredClients.length > 0 && (
                <Div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-xl border border-border/60 bg-card shadow-2xl max-h-36 overflow-y-auto p-1 space-y-0.5">
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
                </Div>
              )}
            </Div>
          )}
          <Btn
            onClick={handleStartCreate}
            className="w-full flex items-center gap-2 text-xs text-violet-300/80 hover:text-violet-300 border border-dashed border-violet-500/25 rounded-lg px-2.5 py-2 hover:bg-violet-500/8 transition-colors">
            <UserPlus className="w-3.5 h-3.5 shrink-0" />
            Crea nuovo cliente
          </Btn>
        </Div>
      )}

      {/* Riga 2b: membri del gruppo (se leader confermato) */}
      {isConfirmed && selectedClient?.is_leader && (entry.groupMembers || []).length > 0 && (
        <Div className="rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/8 to-amber-500/3 px-2.5 py-2 space-y-1.5 shadow-sm">
          <Div className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-amber-400 shrink-0" />
            <Span className="text-[10px] font-semibold text-amber-300 flex-1">
              Aggiungere anche il gruppo? ({(entry.groupMembers || []).filter(m => !m.excluded).length} selezionati)
            </Span>
            <Btn
              onClick={() => {
                const allExcluded = (entry.groupMembers || []).every(m => m.excluded);
                onUpdate({ ...entry, groupMembers: (entry.groupMembers || []).map(m => ({ ...m, excluded: !allExcluded })) });
              }}
              className="text-[9px] font-medium text-amber-400/80 hover:text-amber-300 shrink-0 transition-colors">
              {(entry.groupMembers || []).every(m => m.excluded) ? 'Includi tutti' : 'Rimuovi tutti'}
            </Btn>
          </Div>
          <Div className="space-y-1 pl-1">
            {(entry.groupMembers || []).map((m, idx) => (
              <Div key={m.client.id} className={`flex items-center gap-1.5 text-[11px] px-1.5 py-1 rounded-lg transition-colors ${m.excluded ? 'opacity-40' : 'bg-background/50 shadow-sm'}`}>
                <Btn
                  onClick={() => {
                    const newGm = [...(entry.groupMembers || [])];
                    newGm[idx] = { ...m, excluded: !m.excluded };
                    onUpdate({ ...entry, groupMembers: newGm });
                  }}
                  className="shrink-0">
                  <Div className={`w-3 h-3 rounded border flex items-center justify-center transition-colors ${!m.excluded ? 'bg-emerald-500 border-emerald-500' : 'border-border'}`}>
                    {!m.excluded && <Check className="w-2 h-2 text-white" />}
                  </Div>
                </Btn>
                <ClientAvatar client={m.client} size="xs" initials={m.client.name?.charAt(0)?.toUpperCase() || '?'} />
                {m.client.is_leader && <Star className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" />}
                <Btn
                  onClick={() => onClientDetail?.(m.client)}
                  className={`flex-1 text-left truncate hover:underline transition-colors ${m.excluded ? 'line-through text-muted-foreground' : ''}`}>
                  {m.client.name}
                </Btn>
                {!m.excluded && (
                  <Div className="flex items-center gap-1 shrink-0">
                    <Div className="flex items-center gap-0.5 rounded-md bg-background/60 border border-border/40 px-1 py-0.5">
                      <Span className="text-[9px] text-muted-foreground">€</Span>
                      <HtmlInput type="number" min="0" value={m.rev || ''} onChange={e => {
                        const newGm = [...(entry.groupMembers || [])];
                        newGm[idx] = { ...m, rev: Number(e.target.value) || 0 };
                        onUpdate({ ...entry, groupMembers: newGm });
                      }} className="h-5 w-10 text-[10px] px-0.5 bg-transparent border-0 focus:outline-none text-primary font-semibold" placeholder="30" />
                    </Div>
                    <Div className="flex items-center gap-0.5 rounded-md bg-background/60 border border-border/40 px-1 py-0.5">
                      <Span className="text-[9px] text-muted-foreground">P</Span>
                      <HtmlInput type="number" min="0" value={m.ppl || ''} onChange={e => {
                        const newGm = [...(entry.groupMembers || [])];
                        newGm[idx] = { ...m, ppl: Number(e.target.value) || 0 };
                        onUpdate({ ...entry, groupMembers: newGm });
                      }} className="h-5 w-8 text-[10px] px-0.5 bg-transparent border-0 focus:outline-none text-sky-400 font-semibold" placeholder="0" />
                    </Div>
                  </Div>
                )}
              </Div>
            ))}
          </Div>
        </Div>
      )}

      {/* Riga 3: importo + accompagnatori + persone nuove (editabili) */}
      <Div className="flex items-center gap-2">
        <Div className="flex items-center gap-1.5 rounded-lg bg-background/50 border border-border/50 px-2.5 py-1.5 shadow-sm">
          <Span className="text-[10px] text-primary font-bold">€</Span>
          <HtmlInput type="number" min="0" value={amountFocused && entry.total_amount === 0 ? '' : entry.total_amount}
            onFocus={() => setAmountFocused(true)}
            onBlur={() => setAmountFocused(false)}
            onChange={e => handleAmountChange(e.target.value)}
            className="h-6 w-16 text-xs bg-transparent border-0 focus:outline-none text-primary font-bold" />
        </Div>
        <Div className="flex items-center gap-1.5 rounded-lg bg-background/50 border border-border/50 px-2.5 py-1.5 shadow-sm">
          <Span className="text-[10px] text-sky-400 font-bold">Accomp.</Span>
          <HtmlInput type="number" min="0" value={entry.people_brought || ''}
            onChange={e => handlePeopleChange(e.target.value)}
            className="h-6 w-10 text-xs bg-transparent border-0 focus:outline-none text-sky-400 font-bold" />
        </Div>
        <Div className="flex items-center gap-1.5 rounded-lg bg-background/50 border border-emerald-500/20 px-2.5 py-1.5 shadow-sm">
          <Span className="text-[10px] text-emerald-400 font-bold">Nuove</Span>
          <HtmlInput type="number" min="0" value={entry.new_people || ''}
            onChange={e => handleNewPeopleChange(e.target.value)}
            className="h-6 w-10 text-xs bg-transparent border-0 focus:outline-none text-emerald-400 font-bold" />
        </Div>
      </Div>

      {/* Riga 4: accompagnatori + crea gruppo */}
      <Div className="space-y-1.5">
        {companionCount > 0 && (
          <>
            <Btn
              onClick={() => setCompanionsOpen(!companionsOpen)}
              className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors w-full">
              <Users className="w-3 h-3" />
              <Span>{companionCount} accompagnatori</Span>
              {identifiedCompanions > 0 && (
                <Span className="text-emerald-400 font-medium">({identifiedCompanions} identificati)</Span>
              )}
              {companionsOpen ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
            </Btn>
            {companionsOpen && (
              <Div className="space-y-1.5 pl-1">
                {(entry.companions || []).map((slot, i) => (
                  <CompanionSlot
                    key={i}
                    index={i}
                    slot={slot}
                    clients={clients}
                    existingClientIds={existingClientIds}
                    promoterId={promoterId}
                    onChange={(newSlot) => handleCompanionChange(i, newSlot)}
                    onAddMore={handleAddCompanion}
                  />
                ))}
              </Div>
            )}
          </>
        )}
        <Div className="flex items-center gap-1.5">
          <Btn
            onClick={handleAddCompanion}
            className="flex items-center gap-1 text-[10px] font-semibold text-violet-300 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 rounded-lg px-2.5 py-1.5 transition-colors shrink-0">
            <Plus className="w-3 h-3" /> Accompagnatore
          </Btn>
          {entryGroupClients.length >= 2 && (
            <Btn
              onClick={() => setShowGroupCreate(s => !s)}
              className="flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 rounded-lg px-2.5 py-1.5 transition-colors shrink-0">
              <FolderPlus className="w-3 h-3" /> Gruppo
            </Btn>
          )}
        </Div>
        {showGroupCreate && entryGroupClients.length >= 2 && (
          <Div className="flex gap-1.5">
            <HtmlInput
              autoFocus
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="Nome gruppo..."
              className="flex-1 h-7 text-[11px] px-2 rounded-lg bg-background border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
              onKeyDown={e => { if (e.key === 'Enter') handleCreateEntryGroup(); if (e.key === 'Escape') setShowGroupCreate(false); }} />
            <Btn
              disabled={!groupName.trim() || creatingGroup}
              onClick={handleCreateEntryGroup}
              className="flex items-center gap-1 text-[10px] font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-50 shrink-0">
              {creatingGroup ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Check className="w-3 h-3" /> Crea</>}
            </Btn>
            <Btn
              onClick={() => setShowGroupCreate(false)}
              className="text-muted-foreground hover:text-destructive shrink-0 p-1">
              <X className="w-3 h-3" />
            </Btn>
          </Div>
        )}
        {groupCreated && (
          <Div className="flex items-center gap-1.5 text-[10px] text-green-400 px-1">
            <Check className="w-3 h-3" /> Gruppo creato con {entryGroupClients.length} clienti
          </Div>
        )}
      </Div>
    </Div>
  );
}