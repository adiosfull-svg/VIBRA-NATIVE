// Port di src/components/client/EditAttendanceDialog.jsx (convertito da scripts/port/codemod.mjs).
import { invalidateFullTables } from '@/web/lib/query-client';
import { toast } from '@/ui/use-toast';
import { refetchEventTables, triggerStatsRecompute } from '@/web/lib/eventSync';
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/misc';
import { base44 } from '@/lib/base44';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { Pencil, Check, X, Trash2, Plus, Users, ChevronDown } from '@/ui/icons.generated';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Btn, Div, P, Span } from '@/ui/html';

// Aggiornamento ottimistico su TUTTE le cache presenze: per-promoter ['attendances', pid] e tabella
// completa ['attendances-all'] (Serate, Report, Dashboard...). setQueriesData tocca solo le cache già
// caricate, quindi se la tabella completa non è in memoria non scarica nulla.
const ATTENDANCE_CACHES = { predicate: (q) => q.queryKey[0] === 'attendances' || q.queryKey[0] === 'attendances-all' };

export default function EditAttendanceDialog({
  open, onOpenChange, client, attendances, events, promoters, onSaved,
  defaultAddMode = false, promoterId, clients = [],
}) {
  useOverlay(open, () => onOpenChange?.(false));
  const qc = useQueryClient();
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editPeople, setEditPeople] = useState('');
  const [editEventId, setEditEventId] = useState('');
  const [editEventSearch, setEditEventSearch] = useState('');
  const [showEditEventSearch, setShowEditEventSearch] = useState(false);
  const [saving, setSaving] = useState(false);
  // Prompt gruppo per modifica
  const [editGroupPrompt, setEditGroupPrompt] = useState(null); // { rowId, newEventId, newRev, newPeople, companions }
  const [excludedEditCompanions, setExcludedEditCompanions] = useState(new Set());

  // Multi-serata add mode
  const [addMode, setAddMode] = useState(false);
  // selectedEvents: { [eventId]: { revenue: string, people: string } }
  const [selectedEvents, setSelectedEvents] = useState({});
  const [eventSearch, setEventSearch] = useState('');

  // Suggestion: aggiungi stessa presenza ai compagni di gruppo
  const [groupSuggestion, setGroupSuggestion] = useState(null);
  // companionPerEvent: { companionId: { eventId: { revenue: string, people: string } } }
  const [companionPerEvent, setCompanionPerEvent] = useState({});
  const [savingCompanions, setSavingCompanions] = useState(false);

  const { data: groups = [] } = useQuery({
    queryKey: ['client-groups', promoterId],
    queryFn: () => base44.entities.ClientGroup.filter({ promoter_id: promoterId }),
    enabled: !!promoterId && open,
    staleTime: 5 * 60000,
  });

  useEffect(() => {
    setRows(attendances.map(a => ({ ...a })));
    setEditingId(null);
    setAddMode(defaultAddMode);
    setSelectedEvents({});
    setEventSearch('');
    setGroupSuggestion(null);
    setCompanionPerEvent({});
    setExcludedCompanions(new Set());
    setEditGroupPrompt(null);
    setExcludedEditCompanions(new Set());
  }, [attendances, open]);

  // Auto-focus sulla ricerca serate quando addMode si attiva o il dialog si apre già in addMode
  useEffect(() => {
    if (open && addMode) {
      setTimeout(() => eventSearchRef.current?.focus({ preventScroll: true }), 200);
    }
  }, [open, addMode]);

  const getEventLabel = (id) => {
    const ev = events.find(e => e.id === id);
    if (!ev) return '—';
    return `${ev.name}${ev.date ? ' · ' + format(parseISO(ev.date), 'dd MMM yy', { locale: it }) : ''}`;
  };

  const startEdit = (a) => {
    setEditingId(a.id);
    setEditValue(String(a.revenue ?? 0));
    setEditPeople(String(a.new_people_brought ?? 0));
    setEditEventId(a.event_id);
    setEditEventSearch('');
    setShowEditEventSearch(false);
  };

  const cancelEdit = () => setEditingId(null);

  // Mutazione ottimistica: la UI si aggiorna all'istante, il server sincronizza in
  // background; in caso di errore si ripristina lo stato precedente (rollback silenzioso).
  const doSaveEdit = async (id, newRev, newPeopleVal, newEventId) => {
    const row = rows.find(r => r.id === id);
    const snapshot = rows;
    setRows(prev => prev.map(r => r.id === id ? { ...r, revenue: newRev, new_people_brought: newPeopleVal, event_id: newEventId || r.event_id } : r));
    onSaved();
    try {
      const updateData = { revenue: newRev, new_people_brought: newPeopleVal };
      if (newEventId && newEventId !== row?.event_id) updateData.event_id = newEventId;
      await base44.entities.EventAttendance.update(id, updateData);
      // Optimistic: aggiorna la presenza nella cache attendances
      qc.setQueriesData(ATTENDANCE_CACHES, (old) =>
        Array.isArray(old) ? old.map(a => a.id === id ? { ...a, ...updateData } : a) : old
      );
      if (row && row.client_id) {
        const oldPeople = row.new_people_brought || 0;
        const diff = newPeopleVal - oldPeople;
        if (diff !== 0) {
          qc.setQueriesData({ queryKey: ['clients'] }, (old) =>
            Array.isArray(old) ? old.map(c => c.id === row.client_id ? { ...c, new_people_brought: Math.max(0, (c.new_people_brought || 0) + diff) } : c) : old
          );
          try {
            const clientData = await base44.entities.Client.get(row.client_id);
            await base44.entities.Client.update(row.client_id, { new_people_brought: (clientData.new_people_brought || 0) + diff });
          } catch {}
        }
      }
      refetchEventTables(qc);
      triggerStatsRecompute(qc);
    } catch (err) {
      setRows(snapshot);
      onSaved();
      throw err;
    }
  };

  const saveEdit = async (id) => {
    setSaving(true);
    const newRev = Number(editValue);
    const newPeopleVal = Number(editPeople);
    const row = rows.find(r => r.id === id);

    // Controlla se ci sono compagni di gruppo
    const companions = findGroupCompanions();
    const eventChanged = editEventId && editEventId !== row?.event_id;
    if (companions.length > 0) {
      // Mostra prompt gruppo prima di salvare
      setEditGroupPrompt({ rowId: id, newRev, newPeopleVal, newEventId: editEventId, companions, eventChanged });
      setExcludedEditCompanions(new Set());
      setSaving(false);
      return;
    }

    await doSaveEdit(id, newRev, newPeopleVal, editEventId);
    setSaving(false);
    setEditingId(null);
  };

  const confirmEditWithGroup = async () => {
    if (!editGroupPrompt) return;
    setSaving(true);
    const { rowId, newRev, newPeopleVal, newEventId, companions, eventChanged } = editGroupPrompt;
    await doSaveEdit(rowId, newRev, newPeopleVal, newEventId);

    // Aggiorna anche i compagni non esclusi
    for (const companion of companions) {
      if (excludedEditCompanions.has(companion.id)) continue;
      const row = rows.find(r => r.id === rowId);
      const compAtt = attendances.find(a => a.client_id === companion.id && a.event_id === (row?.event_id || newEventId));
      if (compAtt) {
        const updateData = { revenue: newRev, new_people_brought: newPeopleVal };
        if (eventChanged && newEventId) updateData.event_id = newEventId;
        await base44.entities.EventAttendance.update(compAtt.id, updateData);
        // Optimistic: aggiorna anche il compagno nella cache attendances
        qc.setQueriesData(ATTENDANCE_CACHES, (old) =>
          Array.isArray(old) ? old.map(a => a.id === compAtt.id ? { ...a, ...updateData } : a) : old
        );
      }
    }

    setSaving(false);
    setEditGroupPrompt(null);
    setEditingId(null);
    onSaved();
  };

  // Eliminazione ottimistica: la riga scompare all'istante, rollback su errore.
  const deleteRow = async (id) => {
    const row = rows.find(r => r.id === id);
    const snapshot = rows;
    setRows(prev => prev.filter(r => r.id !== id));
    onSaved();
    try {
      await base44.entities.EventAttendance.delete(id);
      // Optimistic: rimuovi la presenza dalla cache attendances
      qc.setQueriesData(ATTENDANCE_CACHES, (old) =>
        Array.isArray(old) ? old.filter(a => a.id !== id) : old
      );
      if (row?.client_id && (row.new_people_brought || 0) > 0) {
        qc.setQueriesData({ queryKey: ['clients'] }, (old) =>
          Array.isArray(old) ? old.map(c => c.id === row.client_id ? { ...c, new_people_brought: Math.max(0, (c.new_people_brought || 0) - row.new_people_brought) } : c) : old
        );
        try {
          const clientData = await base44.entities.Client.get(row.client_id);
          await base44.entities.Client.update(row.client_id, { new_people_brought: Math.max(0, (clientData.new_people_brought || 0) - row.new_people_brought) });
        } catch {}
      }
      refetchEventTables(qc);
      triggerStatsRecompute(qc);
    } catch (err) {
      setRows(snapshot);
      onSaved();
      throw err;
    }
  };

  // Toggle serata nella selezione multipla
  const toggleEventSelect = (eventId) => {
    setSelectedEvents(prev => {
      if (prev[eventId]) {
        const next = { ...prev };
        delete next[eventId];
        return next;
      }
      // Auto-focus sul campo € di questa serata dopo il render
      setTimeout(() => revenueRefs.current[eventId]?.focus({ preventScroll: true }), 80);
      return { ...prev, [eventId]: { revenue: '', people: '' } };
    });
  };

  const updateSelectedField = (eventId, field, val) => {
    setSelectedEvents(prev => ({ ...prev, [eventId]: { ...prev[eventId], [field]: val } }));
  };

  const [excludedCompanions, setExcludedCompanions] = useState(new Set());

  // Refs per auto-focus
  const eventSearchRef = useRef(null);
  const revenueRefs = useRef({}); // { [eventId]: ref }

  const toggleExcludeCompanion = (id) => {
    setExcludedCompanions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Trova compagni di gruppo per il cliente corrente
  const findGroupCompanions = () => {
    if (!client || !groups.length) return [];
    const myGroup = groups.find(g => (g.client_ids || []).includes(client.id));
    if (!myGroup) return [];
    return (myGroup.client_ids || [])
      .filter(id => id !== client.id)
      .map(id => clients.find(c => c.id === id))
      .filter(Boolean);
  };

  const addPresences = async () => {
    const entries = Object.entries(selectedEvents);
    if (entries.length === 0) return;
    // Optimistic: inserisci le presenze nella cache subito (UI istantanea)
    const tempRecords = entries.map(([eventId, { revenue, people }], i) => ({
      id: 'opt-' + Date.now() + '-' + i,
      event_id: eventId,
      client_id: client.id,
      promoter_id: promoterId ?? '',
      revenue: revenue ? Number(revenue) : 0,
      new_people_brought: people ? Number(people) : 0,
    }));
    qc.setQueriesData(ATTENDANCE_CACHES, (old) =>
      Array.isArray(old) ? [...old, ...tempRecords] : old
    );
    const totalNewPeople = tempRecords.reduce((s, r) => s + (r.new_people_brought || 0), 0);
    if (totalNewPeople > 0) {
      qc.setQueriesData({ queryKey: ['clients'] }, (old) =>
        Array.isArray(old) ? old.map(c => c.id === client.id ? { ...c, new_people_brought: (c.new_people_brought || 0) + totalNewPeople } : c) : old
      );
    }

    // Fire creates in background; refetch esplicito riconcilia i record ottimistici
    (async () => {
      for (const [eventId, { revenue, people }] of entries) {
        const rev = revenue ? Number(revenue) : 0;
        const ppl = people ? Number(people) : 0;
        await base44.entities.EventAttendance.create({
          event_id: eventId, client_id: client.id, promoter_id: promoterId ?? '',
          revenue: rev, new_people_brought: ppl,
        });
        if (ppl > 0) {
          const clientData = await base44.entities.Client.get(client.id);
          await base44.entities.Client.update(client.id, { new_people_brought: (clientData.new_people_brought || 0) + ppl });
        }
      }
    })().then(() => {
      refetchEventTables(qc);
      triggerStatsRecompute(qc);
      onSaved();
    }).catch(() => {
      refetchEventTables(qc);
      onSaved();
      toast({ title: 'Presenze non salvate', description: 'Riprova tra qualche secondo.', variant: 'destructive' });
    });

    // Controlla se ci sono compagni di gruppo da suggerire
    const companions = findGroupCompanions();
    if (companions.length > 0) {
      // Per ogni compagno, per ogni serata: { companionId: { eventId: { revenue, people } } }
      const initPerEvent = {};
      companions.forEach(c => {
        initPerEvent[c.id] = {};
        entries.forEach(([eventId, { revenue }]) => {
          initPerEvent[c.id][eventId] = { revenue: revenue || '', people: '' };
        });
      });
      setGroupSuggestion({ companions, entries });
      setCompanionPerEvent(initPerEvent);
      setSelectedEvents({});
      setAddMode(false);
    } else {
      onOpenChange(false);
    }
  };

  const saveCompanionPresences = async () => {
    if (!groupSuggestion) return;
    // Optimistic: inserisci le presenze dei compagni nella cache subito
    const tempRecords = [];
    groupSuggestion.companions.forEach(companion => {
      if (excludedCompanions.has(companion.id)) return;
      groupSuggestion.entries.forEach(([eventId]) => {
        const eventData = companionPerEvent[companion.id]?.[eventId] || {};
        tempRecords.push({
          id: 'opt-comp-' + Date.now() + '-' + companion.id + '-' + eventId,
          event_id: eventId,
          client_id: companion.id,
          promoter_id: promoterId ?? '',
          revenue: eventData.revenue ? Number(eventData.revenue) : 0,
          new_people_brought: eventData.people ? Number(eventData.people) : 0,
        });
      });
    });
    if (tempRecords.length > 0) {
      qc.setQueriesData(ATTENDANCE_CACHES, (old) =>
        Array.isArray(old) ? [...old, ...tempRecords] : old
      );
    }

    // Fire creates in background; refetch esplicito riconcilia i record ottimistici
    (async () => {
      for (const companion of groupSuggestion.companions) {
        if (excludedCompanions.has(companion.id)) continue;
        let totalPpl = 0;
        for (const [eventId] of groupSuggestion.entries) {
          const eventData = companionPerEvent[companion.id]?.[eventId] || {};
          const rev = eventData.revenue ? Number(eventData.revenue) : 0;
          const ppl = eventData.people ? Number(eventData.people) : 0;
          totalPpl += ppl;
          const alreadyPresent = attendances.some(a => a.client_id === companion.id && a.event_id === eventId);
          if (!alreadyPresent) {
            await base44.entities.EventAttendance.create({
              event_id: eventId, client_id: companion.id, promoter_id: promoterId ?? '',
              revenue: rev, new_people_brought: ppl,
            });
          }
        }
        if (totalPpl > 0) {
          const clientData = await base44.entities.Client.get(companion.id);
          await base44.entities.Client.update(companion.id, { new_people_brought: (clientData.new_people_brought || 0) + totalPpl });
        }
      }
    })().then(() => {
      refetchEventTables(qc);
      triggerStatsRecompute(qc);
      onSaved();
    }).catch(() => {
      refetchEventTables(qc);
      onSaved();
      toast({ title: 'Presenze non salvate', description: 'Riprova tra qualche secondo.', variant: 'destructive' });
    });

    setGroupSuggestion(null);
    onOpenChange(false);
  };

  const alreadyPresentEventIds = new Set(rows.map(r => r.event_id));
  const availableEvents = events
    .filter(e => !alreadyPresentEventIds.has(e.id))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentEvents = availableEvents.slice(0, 5);

  const filteredSearch = eventSearch
    ? availableEvents.filter(e => getEventLabel(e.id).toLowerCase().includes(eventSearch.toLowerCase())).slice(0, 8)
    : [];

  const total = rows.reduce((s, a) => s + (a.revenue || 0), 0);
  const avg = rows.length > 0 ? Math.round(total / rows.length) : 0;

  const selectedCount = Object.keys(selectedEvents).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent popup className="sm:max-w-lg overflow-y-auto overscroll-contain">
        <DialogHeader>
          <DialogTitle>Presenze — {client?.name}</DialogTitle>
        </DialogHeader>
        <Div className="space-y-3">

          {/* Riepilogo */}
          <Div className="flex gap-4 text-sm text-muted-foreground pb-2 border-b border-border">
            <Span><Span className="font-semibold text-foreground">{rows.length}</Span> presenze</Span>
            <Span>Spesa tot.: <Span className="text-primary font-semibold">€{total.toLocaleString('it-IT')}</Span></Span>
            <Span>Media: <Span className="font-semibold text-foreground">€{avg.toLocaleString('it-IT')}</Span></Span>
          </Div>

          {/* Lista presenze esistenti */}
          <Div className="max-h-48 overflow-y-auto space-y-1.5">
            {rows.length === 0 && (
              <P className="text-sm text-muted-foreground text-center py-4">Nessuna presenza registrata</P>
            )}
            {rows.map(a => (
              <Div key={a.id} className="rounded-lg bg-secondary/30 px-3 py-2.5 space-y-1.5">
                {editingId === a.id ? (
                  <Div className="space-y-2">
                    {/* Serata */}
                    <Div>
                      <P className="text-[10px] text-muted-foreground mb-1">Serata</P>
                      <Btn
                        button
                        onClick={() => setShowEditEventSearch(s => !s)}
                        className="w-full flex items-center justify-between text-xs rounded-md bg-secondary/40 border border-border px-2.5 py-1.5 hover:border-primary/50 transition-colors">
                        <Span className="truncate text-left">{getEventLabel(editEventId)}</Span>
                        <ChevronDown className="w-3 h-3 ml-2 shrink-0 text-muted-foreground" />
                      </Btn>
                      {showEditEventSearch && (
                        <Div className="mt-1 space-y-1">
                          <Input
                            placeholder="Cerca serata..."
                            value={editEventSearch}
                            onChange={e => setEditEventSearch(e.target.value)}
                            className="h-7 text-xs"
                            autoFocus
                          />
                          {editEventSearch && (
                            <Div className="rounded-lg border border-border bg-card shadow-sm max-h-32 overflow-y-auto p-1 space-y-0.5">
                              {events
                                .filter(e => getEventLabel(e.id).toLowerCase().includes(editEventSearch.toLowerCase()))
                                .slice(0, 8)
                                .map(e => (
                                  <Btn
                                    button
                                    key={e.id}
                                    onClick={() => { setEditEventId(e.id); setEditEventSearch(''); setShowEditEventSearch(false); }}
                                    className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${editEventId === e.id ? 'bg-primary/10 text-primary' : 'hover:bg-secondary/60'}`}>
                                    {getEventLabel(e.id)}
                                  </Btn>
                                ))}
                            </Div>
                          )}
                        </Div>
                      )}
                    </Div>
                    {/* Importo e persone */}
                    <Div className="flex items-center gap-3">
                      <Div className="flex items-center gap-1">
                        <Span className="text-xs text-muted-foreground">€</Span>
                        <Input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} className="h-7 w-20 text-xs" onKeyDown={e => { if (e.key === 'Enter') saveEdit(a.id); if (e.key === 'Escape') cancelEdit(); }} />
                      </Div>
                      <Div className="flex items-center gap-1">
                        <Span className="text-xs text-muted-foreground">Pers.</Span>
                        <Input type="number" value={editPeople} onChange={e => setEditPeople(e.target.value)} className="h-7 w-20 text-xs" onKeyDown={e => { if (e.key === 'Enter') saveEdit(a.id); if (e.key === 'Escape') cancelEdit(); }} />
                      </Div>
                      <Div className="flex items-center gap-1 ml-auto">
                        <Button size="icon" variant="ghost" className="h-6 w-6" disabled={saving} onClick={() => saveEdit(a.id)}><Check className="w-3.5 h-3.5 text-green-400" /></Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEdit}><X className="w-3.5 h-3.5 text-destructive" /></Button>
                      </Div>
                    </Div>
                  </Div>
                ) : (
                  <Div className="flex items-center justify-between gap-3">
                    <P className="text-xs text-muted-foreground flex-1 truncate">{getEventLabel(a.event_id)}</P>
                    <Div className="flex items-center gap-1.5">
                      <Span className="text-sm font-semibold text-primary">€{(a.revenue || 0).toLocaleString('it-IT')}</Span>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => startEdit(a)}><Pencil className="w-3 h-3 text-muted-foreground" /></Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => deleteRow(a.id)}><Trash2 className="w-3 h-3 text-destructive/70 hover:text-destructive" /></Button>
                    </Div>
                  </Div>
                )}
              </Div>
            ))}
          </Div>

          {/* Prompt gruppo per MODIFICA */}
          {editGroupPrompt && (
            <Div className="rounded-lg border border-primary/40 bg-primary/8 p-3 space-y-3">
              <Div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary shrink-0" />
                <P className="text-xs font-semibold text-primary">Vuoi applicare la modifica anche ai compagni di gruppo?</P>
              </Div>
              <Div className="space-y-1.5">
                {editGroupPrompt.companions.map(companion => {
                  const excluded = excludedEditCompanions.has(companion.id);
                  return (
                    <Div key={companion.id} className="flex items-center justify-between rounded-md bg-secondary/30 px-3 py-2">
                      <Span className={`text-xs font-medium ${excluded ? 'line-through text-muted-foreground' : ''}`}>{companion.name}</Span>
                      <Btn
                        button
                        onClick={() => setExcludedEditCompanions(prev => { const n = new Set(prev); if (n.has(companion.id)) n.delete(companion.id); else n.add(companion.id); return n; })}
                        className={`text-xs flex items-center gap-1 transition-colors ${excluded ? 'text-primary' : 'text-muted-foreground hover:text-destructive'}`}>
                        {excluded ? 'Includi' : <X className="w-3.5 h-3.5" />}
                      </Btn>
                    </Div>
                  );
                })}
              </Div>
              <Div className="flex gap-2">
                <Button size="sm" disabled={saving} onClick={confirmEditWithGroup}>
                  {saving ? 'Salvo...' : 'Salva per tutti'}
                </Button>
                <Button size="sm" variant="outline" onClick={async () => {
                  setSaving(true);
                  await doSaveEdit(editGroupPrompt.rowId, editGroupPrompt.newRev, editGroupPrompt.newPeopleVal, editGroupPrompt.newEventId);
                  setSaving(false);
                  setEditGroupPrompt(null);
                  setEditingId(null);
                }}>
                  Solo per {client?.name?.split(' ')[0]}
                </Button>
              </Div>
            </Div>
          )}

          {/* Banner suggerimento gruppo */}
          {groupSuggestion && (
            <Div className="rounded-lg border border-primary/40 bg-primary/8 p-3 space-y-3 max-h-[55vh] overflow-y-auto">
              <Div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary shrink-0" />
                <P className="text-xs font-semibold text-primary">Vuoi aggiungere la stessa presenza anche a:</P>
              </Div>
              <Div className="space-y-4">
                {groupSuggestion.companions.map(companion => {
                  const excluded = excludedCompanions.has(companion.id);
                  return (
                    <Div key={companion.id} className={`space-y-2 transition-opacity ${excluded ? 'opacity-40' : ''}`}>
                      <Div className="flex items-center justify-between">
                        <Span className={`text-xs font-semibold ${excluded ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{companion.name}</Span>
                        <Btn
                          button
                          onClick={() => toggleExcludeCompanion(companion.id)}
                          className={`text-xs flex items-center gap-1 transition-colors ${excluded ? 'text-primary hover:text-foreground' : 'text-muted-foreground hover:text-destructive'}`}>
                          {excluded ? <Span className="text-[10px]">Includi</Span> : <X className="w-3.5 h-3.5" />}
                        </Btn>
                      </Div>
                      {!excluded && groupSuggestion.entries.map(([eventId]) => {
                        const fieldData = companionPerEvent[companion.id]?.[eventId] || { revenue: '', people: '' };
                        return (
                          <Div key={eventId} className="rounded-md bg-secondary/30 px-2.5 py-2 space-y-1.5">
                            <P className="text-[10px] text-muted-foreground truncate">{getEventLabel(eventId)}</P>
                            <Div className="flex items-center gap-2">
                              <Div className="flex items-center gap-1">
                                <Span className="text-[10px] text-muted-foreground">€</Span>
                                <Input
                                  type="number"
                                  min="0"
                                  value={fieldData.revenue}
                                  onChange={e => setCompanionPerEvent(prev => ({
                                    ...prev,
                                    [companion.id]: { ...prev[companion.id], [eventId]: { ...prev[companion.id]?.[eventId], revenue: e.target.value } }
                                  }))}
                                  className="h-7 w-20 text-xs"
                                  placeholder="0"
                                />
                              </Div>
                              <Div className="flex items-center gap-1">
                                <Span className="text-[10px] text-muted-foreground">Pers.</Span>
                                <Input
                                  type="number"
                                  min="0"
                                  value={fieldData.people}
                                  onChange={e => setCompanionPerEvent(prev => ({
                                    ...prev,
                                    [companion.id]: { ...prev[companion.id], [eventId]: { ...prev[companion.id]?.[eventId], people: e.target.value } }
                                  }))}
                                  className="h-7 w-16 text-xs"
                                  placeholder="0"
                                />
                              </Div>
                            </Div>
                          </Div>
                        );
                      })}
                    </Div>
                  );
                })}
              </Div>
              <Div className="flex gap-2 pt-1">
                <Button size="sm" disabled={savingCompanions} onClick={saveCompanionPresences}>
                  {savingCompanions ? 'Salvo...' : 'Aggiungi a tutti'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setGroupSuggestion(null); onOpenChange(false); }}>
                  Salta
                </Button>
              </Div>
            </Div>
          )}

          {/* Aggiunta multi-serata */}
          {!groupSuggestion && (addMode ? (
            <Div className="rounded-lg border border-border bg-secondary/20 p-3 space-y-3">
              <P className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nuova presenza — seleziona serate</P>

              {/* Chip ultime 5 serate */}
              {recentEvents.length > 0 && (
                <Div className="flex flex-wrap gap-1">
                  {recentEvents.map(e => {
                    const sel = !!selectedEvents[e.id];
                    return (
                      <Btn
                        button
                        key={e.id}
                        onClick={() => toggleEventSelect(e.id)}
                        className={`text-[10px] px-2 py-1 rounded-full border transition-all ${sel ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}>
                        {e.name}· {e.date ? format(parseISO(e.date), 'dd MMM', { locale: it }) : ''}
                      </Btn>
                    );
                  })}
                </Div>
              )}

              {/* Ricerca serata */}
              <Input
                ref={eventSearchRef}
                placeholder="Cerca serata..."
                value={eventSearch}
                onChange={e => setEventSearch(e.target.value)}
                className="h-8 text-sm"
              />
              {filteredSearch.length > 0 && (
                <Div className="rounded-lg border border-border bg-card shadow-sm space-y-0.5 p-1 max-h-32 overflow-y-auto">
                  {filteredSearch.map(e => (
                    <Btn
                      button
                      key={e.id}
                      onClick={() => { toggleEventSelect(e.id); setEventSearch(''); }}
                      className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${selectedEvents[e.id] ? 'bg-primary/10 text-primary' : 'hover:bg-secondary/60'}`}>
                      {getEventLabel(e.id)}
                    </Btn>
                  ))}
                </Div>
              )}

              {/* Importo per ogni serata selezionata */}
              {Object.keys(selectedEvents).length > 0 && (
                <Div className="space-y-2 border-t border-border pt-2">
                  <P className="text-[10px] text-muted-foreground uppercase tracking-wider">Importo e persone per serata:</P>
                  {Object.keys(selectedEvents).map(eventId => (
                    <Div key={eventId} className="space-y-1">
                      <Div className="flex items-center justify-between gap-2">
                        <P className="text-[10px] text-muted-foreground flex-1 truncate">{getEventLabel(eventId)}</P>
                        <Btn
                          button
                          onClick={() => toggleEventSelect(eventId)}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                          <X className="w-3 h-3" />
                        </Btn>
                      </Div>
                      <Div className="flex items-center gap-2">
                        <Div className="flex items-center gap-1">
                          <Span className="text-[10px] text-muted-foreground">€</Span>
                          <Input
                            ref={el => revenueRefs.current[eventId] = el}
                            type="number"
                            min="0"
                            value={selectedEvents[eventId].revenue}
                            onChange={e => updateSelectedField(eventId, 'revenue', e.target.value)}
                            className="h-7 w-20 text-xs"
                            placeholder="0"
                          />
                        </Div>
                        <Div className="flex items-center gap-1">
                          <Span className="text-[10px] text-muted-foreground">Pers.</Span>
                          <Input
                            type="number"
                            min="0"
                            value={selectedEvents[eventId].people}
                            onChange={e => updateSelectedField(eventId, 'people', e.target.value)}
                            className="h-7 w-16 text-xs"
                            placeholder="0"
                          />
                        </Div>
                      </Div>
                    </Div>
                  ))}
                </Div>
              )}

              <Div className="flex gap-2">
                <Button size="sm" disabled={selectedCount === 0 || saving} onClick={addPresences}>
                  {saving ? 'Salvo...' : selectedCount > 1 ? `Aggiungi ${selectedCount} presenze` : 'Aggiungi'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setAddMode(false); setSelectedEvents({}); setEventSearch(''); }}>Annulla</Button>
              </Div>
            </Div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setAddMode(true)}
              disabled={availableEvents.length === 0}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              {availableEvents.length === 0 ? 'Presente in tutte le serate disponibili' : 'Aggiungi presenza'}
            </Button>
          ))}

          <Div className="flex justify-end pt-1">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Chiudi</Button>
          </Div>
        </Div>
      </DialogContent>
    </Dialog>
  );
}