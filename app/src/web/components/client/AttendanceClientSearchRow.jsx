// Port di src/components/client/AttendanceClientSearchRow.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { base44 } from '@/lib/base44';
import { useQueryClient } from '@tanstack/react-query';
import {
  Search, X, Check, ChevronDown, ChevronUp, ChevronRight,
  Users, Star, Loader2, UserPlus, FolderOpen, Plus
} from '@/ui/icons.generated';
import ClientAvatar from '@/web/components/client/ClientAvatar';

import { Btn, Div, P, Span } from '@/ui/html';

// Card locale — stile dashboard: bordo sottile neutro, bg-card
function Card({ children, className = '' }) {
  return (
    <Div className={`relative rounded-2xl border border-border/60 bg-card ${className}`}>
      {children}
    </Div>
  );
}

/**
 * Riga di ricerca cliente/gruppo per il tab Manuale del Box Presenze.
 * Stile dashboard: palette neutra (border/bg-card) + accento emerald per stati attivi.
 */
export default function ClientSearchRow({ clients, groups, existingClientIds, promoterId, eventId, onAdded, onNewClient, onClientDetail }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('client');
  const [phase, setPhase] = useState('search');
  const [selectedClient, setSelectedClient] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [revenue, setRevenue] = useState('');
  const [people, setPeople] = useState('');
  const [clientGroups, setClientGroups] = useState([]);
  const [expandGroupIds, setExpandGroupIds] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newInsta, setNewInsta] = useState('');
  const [creatingNewSaving, setCreatingNewSaving] = useState(false);
  const inputRef = useRef(null);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [groupSearch, setGroupSearch] = useState('');
  const [groupFeedback, setGroupFeedback] = useState(null);
  const [expandedGroupIds, setExpandedGroupIds] = useState(new Set());
  const [createGroupMode, setCreateGroupMode] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [creatingGroup, setCreatingGroup] = useState(false);
  const qc = useQueryClient();

  const handleToggleGroup = async (g) => {
    if (!selectedClient) return;
    const currentIds = g.client_ids || [];
    const isIn = currentIds.includes(selectedClient.id);
    const newIds = isIn ? currentIds.filter(id => id !== selectedClient.id) : [...currentIds, selectedClient.id];
    await base44.entities.ClientGroup.update(g.id, { client_ids: newIds });
    await qc.refetchQueries({ queryKey: ['client-groups', promoterId] });
    setGroupFeedback({ name: g.name, action: isIn ? 'removed' : 'added' });
    setTimeout(() => setGroupFeedback(null), 2200);
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !promoterId || !selectedClient) return;
    setCreatingGroup(true);
    try {
      await base44.entities.ClientGroup.create({
        promoter_id: promoterId,
        name: newGroupName.trim(),
        client_ids: [selectedClient.id],
      });
      await qc.refetchQueries({ queryKey: ['client-groups', promoterId] });
      setGroupFeedback({ name: newGroupName.trim(), action: 'added' });
      setTimeout(() => setGroupFeedback(null), 2200);
      setCreateGroupMode(false);
      setNewGroupName('');
      setGroupSearch('');
    } finally {
      setCreatingGroup(false);
    }
  };

  const toggleExpandGroupRow = (gid) => {
    setExpandedGroupIds(prev => {
      const next = new Set(prev);
      next.has(gid) ? next.delete(gid) : next.add(gid);
      return next;
    });
  };

  const availableGroups = useMemo(() => {
    const q = groupSearch.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(g => {
      if (g.name?.toLowerCase().includes(q)) return true;
      const members = (g.client_ids || [])
        .map(id => clients.find(c => c.id === id))
        .filter(Boolean);
      return members.some(m => m.name?.toLowerCase().includes(q));
    });
  }, [groupSearch, groups, clients]);

  const reset = () => {
    setSearch(''); setPhase('search'); setSelectedClient(null);
    setShowAddGroup(false); setGroupSearch('');
    setGroupMembers([]); setGroupName(''); setRevenue(''); setPeople('');
    setClientGroups([]); setExpandGroupIds(new Set());
    setCreatingNew(false); setNewName(''); setNewPhone(''); setNewInsta('');
  };

  const handleCreateNewClient = async () => {
    if (!newName.trim() || !promoterId) return;
    setCreatingNewSaving(true);
    const created = await base44.entities.Client.create({
      name: newName.trim(),
      phone: newPhone.trim() || undefined,
      instagram: newInsta.trim() || undefined,
      promoter_id: promoterId,
      source_type: 'direct',
    });
    qc.invalidateQueries({ queryKey: ['clients', promoterId] });
    onNewClient(created);
    setCreatingNew(false); setNewName(''); setNewPhone(''); setNewInsta('');
    handleSelectClient(created);
    setCreatingNewSaving(false);
  };

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 80);
  }, [open]);

  const filteredClients = useMemo(() => {
    if (!search.trim()) return [];
    return clients
      .filter(c => !existingClientIds.has(c.id))
      .filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.instagram?.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 8);
  }, [search, clients, existingClientIds]);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups.slice(0, 6);
    return groups.filter(g => g.name?.toLowerCase().includes(search.toLowerCase())).slice(0, 6);
  }, [search, groups]);

  const handleSelectClient = (c) => {
    setSelectedClient(c);
    setSearch('');
    const cg = groups
      .filter(g => (g.client_ids || []).includes(c.id))
      .map(g => {
        const members = (g.client_ids || [])
          .filter(id => id !== c.id && !existingClientIds.has(id))
          .map(id => clients.find(cl => cl.id === id))
          .filter(Boolean);
        return { group: g, members };
      })
      .filter(cg => cg.members.length > 0);
    setClientGroups(cg);
    setExpandGroupIds(new Set(cg.map(cg => cg.group.id)));
    setPhase('amount');
  };

  const handleSelectGroup = (g) => {
    const members = (g.client_ids || [])
      .map(id => clients.find(c => c.id === id))
      .filter(Boolean)
      .filter(c => !existingClientIds.has(c.id));
    setGroupMembers(members.map(c => ({ client: c, checked: true })));
    setGroupName(g.name);
    setSearch('');
    setPhase('group-members');
  };

  const toggleGroupMember = (id) => {
    setGroupMembers(prev => prev.map(m => m.client.id === id ? { ...m, checked: !m.checked } : m));
  };

  const toggleExpandGroup = (gid) => {
    setExpandGroupIds(prev => {
      const next = new Set(prev);
      next.has(gid) ? next.delete(gid) : next.add(gid);
      return next;
    });
  };

  const getClientsToSave = () => {
    if (phase === 'group-members') {
      return groupMembers.filter(m => m.checked).map(m => ({
        client: m.client,
        rev: Number(revenue) || 0,
        ppl: Number(people) || 0,
      }));
    }
    const list = [{ client: selectedClient, rev: Number(revenue) || 0, ppl: Number(people) || 0 }];
    for (const cg of clientGroups) {
      if (!expandGroupIds.has(cg.group.id)) continue;
      const excluded = cg._excluded || new Set();
      const memberData = cg._memberData || {};
      cg.members.filter(m => !excluded.has(m.id)).forEach(m => {
        const md = memberData[m.id] || {};
        const memberRev = md.rev !== undefined && md.rev !== '' ? Number(md.rev) : Number(revenue) || 0;
        list.push({ client: m, rev: memberRev, ppl: Number(md.ppl) || 0 });
      });
    }
    return list;
  };

  const handleSave = async () => {
    if (!eventId) return;
    setSaving(true);
    const toSave = getClientsToSave();

    for (const { client: c, rev, ppl } of toSave) {
      const att = await base44.entities.EventAttendance.create({
        event_id: eventId,
        client_id: c.id,
        promoter_id: promoterId ?? '',
        revenue: rev,
        new_people_brought: ppl,
      });
      // Optimistic: aggiungi subito la presenza alla cache attendances e
      // aggiorna new_people_brought nella cache clients, così la pagina Clienti
      // si aggiorna istantaneamente (visite + rating live) senza aspettare il
      // refetch backend (cum_* ricalcolato in background).
      qc.setQueryData(['attendances', promoterId], (old = []) => [...(old || []), att]);
      if (ppl > 0) {
        qc.setQueryData(['clients', promoterId], (old = []) =>
          (old || []).map(cl => cl.id === c.id ? { ...cl, new_people_brought: (cl.new_people_brought || 0) + ppl } : cl)
        );
        try {
          const cd = await base44.entities.Client.get(c.id);
          await base44.entities.Client.update(c.id, { new_people_brought: (cd.new_people_brought || 0) + ppl });
        } catch {}
      }
      onAdded(c, rev, ppl, att.id);
    }

    const savedRevenue = revenue;
    reset();
    setRevenue(savedRevenue);
    setOpen(true);
    setSaving(false);
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 80);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && filteredClients.length === 1) {
      e.preventDefault();
      handleSelectClient(filteredClients[0]);
    }
  };

  return (
    <Card className={open ? 'border-border' : 'hover:border-border/80'}>
      <Btn
        button
        onClick={() => { setOpen(o => !o); if (open) reset(); }}
        className="w-full flex items-center justify-between p-3">
        <Div className="flex items-center gap-2.5">
          <Div className="p-1.5 rounded-lg bg-secondary/20">
            <UserPlus className="w-3.5 h-3.5 text-foreground" />
          </Div>
          <Span className="text-xs font-semibold text-foreground">Aggiungi cliente o gruppo</Span>
        </Div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </Btn>

      {open && (
        <Div className="px-3 pb-3 space-y-2.5 border-t border-border pt-2.5">

          {phase === 'search' && (
            <>
              <Div className="flex gap-1 bg-secondary/30 p-0.5 rounded-lg">
                <Btn
                  button
                  onClick={() => { setMode('client'); setSearch(''); }}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[11px] font-medium transition-all ${mode === 'client' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  <Users className="w-3 h-3" />Cliente
                </Btn>
                <Btn
                  button
                  onClick={() => { setMode('group'); setSearch(''); }}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[11px] font-medium transition-all ${mode === 'group' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  <FolderOpen className="w-3 h-3" />Gruppo
                </Btn>
              </Div>
              <Div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input ref={inputRef}
                  placeholder={mode === 'client' ? 'Cerca per nome o Instagram...' : 'Cerca gruppo...'}
                  value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-xs pl-8"
                  onKeyDown={handleSearchKeyDown} />
                {mode === 'client' && filteredClients.length > 0 && (
                  <Div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-xl border border-border bg-card shadow-xl max-h-36 overflow-y-auto p-1 space-y-0.5 recontact-scrollbar">
                    {filteredClients.map(c => (
                      <Btn
                        button
                        key={c.id}
                        onClick={() => handleSelectClient(c)}
                        className="w-full flex items-center gap-2 text-left text-xs px-2 py-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
                        {c.is_leader && <Star className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" />}
                        <ClientAvatar client={c} size="xs" initials={c.name?.charAt(0)?.toUpperCase() || '?'} />
                        <Span className="flex-1 truncate">{c.name}</Span>
                        {c.instagram && <Span className="text-muted-foreground text-[10px] shrink-0">@{c.instagram}</Span>}
                      </Btn>
                    ))}
                  </Div>
                )}
                {mode === 'group' && (
                  <Div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-xl border border-border bg-card shadow-xl max-h-36 overflow-y-auto p-1 space-y-0.5 recontact-scrollbar">
                    {(search ? filteredGroups : groups).map(g => {
                      const available = (g.client_ids || []).filter(id => !existingClientIds.has(id)).length;
                      return (
                        <Btn
                          button
                          key={g.id}
                          onClick={() => handleSelectGroup(g)}
                          className="w-full flex items-center gap-2 text-left text-xs px-2 py-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
                          <FolderOpen className="w-3 h-3 text-muted-foreground shrink-0" />
                          <Span className="flex-1 truncate">{g.name}</Span>
                          <Span className="text-muted-foreground text-[10px] shrink-0">{available} disponibili</Span>
                        </Btn>
                      );
                    })}
                    {(search ? filteredGroups : groups).length === 0 && (
                      <P className="text-xs text-muted-foreground text-center py-2">Nessun gruppo trovato</P>
                    )}
                  </Div>
                )}
                {mode === 'group' && groups.length === 0 && (
                  <P className="text-[11px] text-muted-foreground mt-1.5 text-center">Nessun gruppo creato. Creali dalla tab Gruppi.</P>
                )}
              </Div>

              {mode === 'client' && search.trim() && filteredClients.length === 0 && !creatingNew && (
                <Btn
                  button
                  onClick={() => { setCreatingNew(true); setNewName(search.trim()); }}
                  className="w-full flex items-center gap-2 text-xs text-foreground border border-dashed border-border rounded-xl px-3 py-2.5 hover:bg-secondary/20 transition-colors">
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  Crea nuovo cliente "{search.trim()}"
                </Btn>
              )}
              {mode === 'client' && creatingNew && (
                <Card className="p-3 space-y-2 border-border">
                  <Div className="flex items-center justify-between">
                    <Span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5"><Plus className="w-3 h-3" />Nuovo cliente</Span>
                    <Btn
                      button
                      onClick={() => { setCreatingNew(false); setNewName(''); setNewPhone(''); setNewInsta(''); }}
                      className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></Btn>
                  </Div>
                  <Input placeholder="Nome completo *" value={newName} onChange={e => setNewName(e.target.value)} className="h-8 text-xs" autoFocus />
                  <Div className="flex gap-2">
                    <Input placeholder="Telefono" value={newPhone} onChange={e => setNewPhone(e.target.value)} className="h-8 text-xs flex-1" />
                    <Input placeholder="Instagram" value={newInsta} onChange={e => setNewInsta(e.target.value)} className="h-8 text-xs flex-1" />
                  </Div>
                  <Button size="sm" disabled={!newName.trim() || creatingNewSaving} onClick={handleCreateNewClient} className="w-full h-8 text-xs">
                    {creatingNewSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Check className="w-3 h-3 mr-1" />Crea e seleziona</>}
                  </Button>
                </Card>
              )}
            </>
          )}

          {phase === 'group-members' && (
            <>
              <Div className="flex items-center gap-2">
                <Btn
                  button
                  onClick={reset}
                  className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </Btn>
                <Div className="flex items-center gap-1.5 flex-1">
                  <FolderOpen className="w-3 h-3 text-muted-foreground shrink-0" />
                  <Span className="text-xs font-semibold text-foreground">{groupName}</Span>
                </Div>
              </Div>
              {groupMembers.length === 0 && (
                <P className="text-[11px] text-muted-foreground text-center py-2">Tutti i membri sono già presenti</P>
              )}
              <Div className="space-y-1.5 max-h-36 overflow-y-auto recontact-scrollbar">
                {groupMembers.map(m => (
                  <Btn
                    button
                    key={m.client.id}
                    onClick={() => toggleGroupMember(m.client.id)}
                    className={`w-full flex items-center gap-2 text-left text-xs px-2.5 py-2 rounded-lg border transition-colors ${m.checked ? 'border-emerald-500/30 bg-emerald-500/8 text-foreground' : 'border-border/40 bg-transparent text-muted-foreground line-through'}`}>
                    <Div className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center transition-colors ${m.checked ? 'bg-emerald-500 border-emerald-500' : 'border-border'}`}>
                      {m.checked && <Check className="w-2.5 h-2.5 text-white" />}
                    </Div>
                    {m.client.is_leader && <Star className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" />}
                    <ClientAvatar client={m.client} size="xs" initials={m.client.name?.charAt(0)?.toUpperCase() || '?'} />
                    <Span className="flex-1 text-left">{m.client.name}</Span>
                  </Btn>
                ))}
              </Div>
            </>
          )}

          {phase === 'amount' && selectedClient && (
            <>
              <Div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-2.5">
                <Div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </Div>
                <Btn
                  button
                  onClick={() => setShowAddGroup(s => !s)}
                  className="flex-1 flex items-center gap-1.5 min-w-0 text-left hover:bg-emerald-500/10 rounded-lg -mx-1 px-1 py-0.5 transition-colors"
                  accessibilityLabel="Aggiungi a un gruppo esistente">
                  {selectedClient.is_leader && <Star className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" />}
                  <ClientAvatar client={selectedClient} size="xs" initials={selectedClient.name?.charAt(0)?.toUpperCase() || '?'} />
                  <Span className="text-xs font-semibold text-foreground truncate">{selectedClient.name}</Span>
                  <FolderOpen className={`w-3 h-3 shrink-0 ml-auto transition-colors ${showAddGroup ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                </Btn>
                <Btn
                  button
                  onClick={reset}
                  className="text-muted-foreground hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" />
                </Btn>
              </Div>

              {showAddGroup && (
                <Div className="rounded-xl border border-border bg-secondary/20 px-3 py-2.5 space-y-2">
                  <Div className="flex items-center gap-1.5">
                    <FolderOpen className="w-3 h-3 text-muted-foreground shrink-0" />
                    <Span className="text-[11px] font-semibold text-foreground truncate">Aggiungi "{selectedClient.name}" a un gruppo</Span>
                  </Div>
                  {groupFeedback && (
                    <P className={`text-[10px] flex items-center gap-1 ${groupFeedback.action === 'added' ? 'text-green-400' : 'text-amber-400'}`}>
                      <Check className="w-3 h-3" />
                      {groupFeedback.action === 'added' ? 'Aggiunto a' : 'Rimosso da'} "{groupFeedback.name}"
                    </P>
                  )}
                  <Div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input placeholder="Cerca per nome gruppo o componente..." value={groupSearch}
                      onChange={e => setGroupSearch(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && groupSearch.trim()) { e.preventDefault(); setCreateGroupMode(true); } }}
                      className="h-8 text-xs pl-8" autoFocus />
                  </Div>
                  {createGroupMode ? (
                    <Div className="space-y-2">
                      <Input
                        autoFocus
                        placeholder="Nome nuovo gruppo..."
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCreateGroup(); } }}
                        className="h-8 text-xs border-violet-500/40 focus-visible:ring-violet-500/40"
                      />
                      <Div className="flex gap-2">
                        <Button type="button" variant="ghost" size="sm"
                          onClick={() => { setCreateGroupMode(false); setNewGroupName(''); }}
                          className="h-8 text-xs flex-1">Annulla</Button>
                        <Button type="button" size="sm" disabled={!newGroupName.trim() || creatingGroup}
                          onClick={handleCreateGroup}
                          className="h-8 text-xs flex-1 bg-violet-600 hover:bg-violet-500 text-white border-0">
                          {creatingGroup ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Plus className="w-3 h-3 mr-1" />Crea e aggiungi</>}
                        </Button>
                      </Div>
                    </Div>
                  ) : (
                    <Btn
                      button
                      onClick={() => setCreateGroupMode(true)}
                      className="w-full flex items-center gap-2 text-xs font-medium text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 rounded-lg px-2.5 py-2 transition-colors">
                      <Plus className="w-3.5 h-3.5 shrink-0" />Crea nuovo gruppo
                    </Btn>
                  )}
                  <Div className="space-y-1 max-h-44 overflow-y-auto recontact-scrollbar" style={{ display: createGroupMode ? 'none' : undefined }}>
                    {availableGroups.length === 0 && (
                      <P className="text-[11px] text-muted-foreground text-center py-2">Nessun gruppo trovato</P>
                    )}
                    {availableGroups.map(g => {
                      const inGroup = (g.client_ids || []).includes(selectedClient.id);
                      const members = (g.client_ids || [])
                        .map(id => clients.find(c => c.id === id))
                        .filter(Boolean);
                      const expanded = expandedGroupIds.has(g.id);
                      return (
                        <Div key={g.id} className={`rounded-lg border transition-colors ${inGroup ? 'border-green-500/30 bg-green-500/8' : 'border-border/40'}`}>
                          <Div className="flex items-center gap-1.5 px-2 py-1.5">
                            <Btn
                              button
                              onClick={() => toggleExpandGroupRow(g.id)}
                              className="shrink-0 text-muted-foreground hover:text-foreground p-0.5">
                              {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            </Btn>
                            <FolderOpen className="w-3 h-3 text-muted-foreground shrink-0" />
                            <Span className={`flex-1 truncate text-xs font-medium ${inGroup ? 'text-green-400' : 'text-foreground'}`}>{g.name}</Span>
                            <Span className="text-[10px] text-muted-foreground shrink-0">{members.length}</Span>
                            <Btn
                              button
                              onClick={() => handleToggleGroup(g)}
                              className={`shrink-0 flex items-center gap-0.5 rounded-md px-1.5 py-1 text-[10px] font-medium transition-colors ${inGroup ? 'text-amber-400 hover:bg-amber-500/15' : 'text-emerald-400 hover:bg-emerald-500/15'}`}>
                              {inGroup
                                ? <><X className="w-3 h-3" />Rimuovi</>
                                : <><Plus className="w-3 h-3" />Aggiungi</>}
                            </Btn>
                          </Div>
                          {expanded && (
                            <Div className="px-2 pb-2 pt-0.5 space-y-0.5">
                              {members.length === 0 && <P className="text-[10px] text-muted-foreground pl-6">Nessun membro</P>}
                              {members.map(m => (
                                <Div key={m.id} className={`flex items-center gap-1.5 text-[11px] pl-6 py-0.5 ${m.id === selectedClient.id ? 'text-green-400 font-medium' : 'text-muted-foreground'}`}>
                                  {m.is_leader && <Star className="w-2.5 h-2.5 text-yellow-400 shrink-0" fill="currentColor" />}
                                  <Btn
                                    button
                                    onClick={() => onClientDetail?.(m)}
                                    className="truncate hover:text-primary hover:underline transition-colors text-left"
                                    accessibilityLabel="Apri dettaglio cliente · tasto destro per menu serate">
                                    {m.name}
                                  </Btn>
                                  {m.id === selectedClient.id && <Span className="text-[9px]">(tu)</Span>}
                                </Div>
                              ))}
                            </Div>
                          )}
                        </Div>
                      );
                    })}
                  </Div>
                </Div>
              )}

              {clientGroups.map(cg => {
                const excludedSet = cg._excluded || new Set();
                const allExcluded = cg.members.length > 0 && cg.members.every(m => excludedSet.has(m.id));
                const setAllExcluded = (excluded) => {
                  setClientGroups(prev => prev.map(g => {
                    if (g.group.id !== cg.group.id) return g;
                    return { ...g, _excluded: excluded ? new Set(cg.members.map(m => m.id)) : new Set() };
                  }));
                };
                return (
                  <Div key={cg.group.id} className="rounded-xl border border-amber-500/30 bg-amber-500/8 px-3 py-2.5 space-y-1.5">
                    <Div className="flex items-center gap-2">
                      <Btn
                        button
                        onClick={() => toggleExpandGroup(cg.group.id)}
                        className="flex items-center gap-2 text-left flex-1 min-w-0">
                        <FolderOpen className="w-3 h-3 text-amber-400 shrink-0" />
                        <Span className="text-[11px] font-semibold text-amber-300 flex-1 truncate">
                          Gruppo "{cg.group.name}" — aggiungere anche gli altri {cg.members.length}?
                        </Span>
                        {expandGroupIds.has(cg.group.id)
                          ? <ChevronUp className="w-3 h-3 text-amber-400/60 shrink-0" />
                          : <ChevronDown className="w-3 h-3 text-amber-400/60 shrink-0" />}
                      </Btn>
                      <Btn
                        button
                        onClick={() => setAllExcluded(!allExcluded)}
                        className="text-[10px] font-medium text-amber-400/80 hover:text-amber-300 shrink-0 transition-colors whitespace-nowrap">
                        {allExcluded ? 'Includi tutti' : 'Rimuovi tutti'}
                      </Btn>
                    </Div>
                    {expandGroupIds.has(cg.group.id) && (
                      <Div className="space-y-1.5 pl-2">
                        {cg.members.map(m => {
                          const excluded = cg._excluded?.has(m.id);
                          const md = cg._memberData?.[m.id] || {};
                          const displayRev = md.rev !== undefined ? md.rev : revenue;
                          const updateMemberData = (field, val) => {
                            setClientGroups(prev => prev.map(g => {
                              if (g.group.id !== cg.group.id) return g;
                              return { ...g, _memberData: { ...(g._memberData || {}), [m.id]: { ...(g._memberData?.[m.id] || {}), [field]: val } } };
                            }));
                          };
                          return (
                            <Div key={m.id} className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg transition-colors ${excluded ? 'opacity-40' : 'bg-background/40'}`}>
                              <Btn
                                button
                                onClick={() => {
                                  setClientGroups(prev => prev.map(g => {
                                    if (g.group.id !== cg.group.id) return g;
                                    const excl = new Set(g._excluded || []);
                                    if (excl.has(m.id)) { excl.delete(m.id); } else { excl.add(m.id); }
                                    return { ...g, _excluded: excl };
                                  }));
                                }}
                                className="shrink-0">
                                <Div className={`w-3 h-3 rounded border flex items-center justify-center transition-colors ${!excluded ? 'bg-emerald-500 border-emerald-500' : 'border-border'}`}>
                                  {!excluded && <Check className="w-2 h-2 text-white" />}
                                </Div>
                              </Btn>
                              {m.is_leader && <Star className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" />}
                              <ClientAvatar client={m} size="xs" initials={m.name?.charAt(0)?.toUpperCase() || '?'} />
                              <Btn
                                button
                                onClick={() => onClientDetail?.(m)}
                                className={`flex-1 text-left truncate hover:text-primary hover:underline transition-colors ${excluded ? 'line-through text-muted-foreground' : ''}`}
                                accessibilityLabel="Apri dettaglio cliente · tasto destro per menu serate">
                                {m.name}
                              </Btn>
                              {!excluded && (
                                <>
                                  <Div className="flex items-center gap-1 shrink-0">
                                    <Span className="text-[10px] text-muted-foreground">€</Span>
                                    <Input type="number" min="0" value={displayRev} onChange={e => updateMemberData('rev', e.target.value)}
                                      className="h-6 w-16 text-[11px] px-1.5" placeholder="0" />
                                  </Div>
                                  <Div className="flex items-center gap-1 shrink-0">
                                    <Span className="text-[10px] text-muted-foreground">Pers.</Span>
                                    <Input type="number" min="0" value={md.ppl ?? ''} onChange={e => updateMemberData('ppl', e.target.value)}
                                      className="h-6 w-12 text-[11px] px-1.5" placeholder="0" />
                                  </Div>
                                </>
                              )}
                            </Div>
                          );
                        })}
                      </Div>
                    )}
                  </Div>
                );
              })}
            </>
          )}

          {(phase === 'amount' || (phase === 'group-members' && groupMembers.some(m => m.checked))) && (
            <Div className="flex items-center gap-2 flex-wrap rounded-xl border border-border bg-secondary/30 px-3 py-2.5">
              <Div className="flex items-center gap-1.5">
                <Span className="text-[10px] font-semibold text-emerald-400">€</Span>
                <Input type="number" min="0" value={revenue} onChange={e => setRevenue(e.target.value)}
                  className="h-7 w-20 text-xs border-emerald-500/30 focus-visible:ring-emerald-500/30" placeholder="0"
                  onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                  autoFocus={phase === 'amount'} />
              </Div>
              <Div className="flex items-center gap-1.5">
                <Span className="text-[10px] font-semibold text-sky-400">Pers.</Span>
                <Input type="number" min="0" value={people} onChange={e => setPeople(e.target.value)}
                  className="h-7 w-16 text-xs border-sky-500/30 focus-visible:ring-sky-500/30" placeholder="0"
                  onKeyDown={e => { if (e.key === 'Enter') handleSave(); }} />
              </Div>
              <Button size="sm" disabled={saving} onClick={handleSave}
                className="h-8 text-xs ml-auto px-4 bg-emerald-600 hover:bg-emerald-500 text-white border-0 font-semibold">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Check className="w-3.5 h-3.5 mr-1.5" />Salva</>}
              </Button>
            </Div>
          )}

        </Div>
      )}
    </Card>
  );
}