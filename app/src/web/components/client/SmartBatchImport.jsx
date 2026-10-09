// Port di src/components/client/SmartBatchImport.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { base44 } from '@/lib/base44';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/ui/button';
import { Sparkles, Loader2, Check, AlertCircle, Users, X, Plus, History, Star, Pencil, ChevronDown, ChevronUp, ClipboardList, FolderPlus } from '@/ui/icons.generated';
import ParsedEntryCard from '@/web/components/client/ParsedEntryCard';
import ClientSearchRow from '@/web/components/client/AttendanceClientSearchRow';
import ClientAvatar from '@/web/components/client/ClientAvatar';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput, HtmlTextarea } from '@/ui/elements';

// ─── Card ────────────────────────────────────────────────────────────────────
function Card({ children, className = '' }) {
  return <Div className={`relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-card to-card/80 shadow-lg ${className}`}>{children}</Div>;
}

// ─── PanelHeader ─────────────────────────────────────────────────────────────
function PanelHeader({ icon: Icon, title, count, color = '#a78bfa', right }) {
  return (
    <Div className="flex items-center border-b border-border/40 bg-gradient-to-r from-secondary/15 to-transparent px-3 py-2.5">
      <Div className="flex items-center gap-2 min-w-0">
        {Icon && (
          <Div className="p-1 rounded-md" style={{ backgroundColor: `${color}18` }}>
            <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
          </Div>
        )}
        <P className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/90 truncate">{title}</P>
      </Div>
      {count != null && <Span className="ml-2 text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full" style={{ color, backgroundColor: `${color}18` }}>{count}</Span>}
      {right && <Div className="ml-auto">{right}</Div>}
    </Div>
  );
}

// ─── Fuzzy matching locale (zero crediti AI) ─────────────────────────────────
function scoreClientName(dbName, dbInstagram, inputName) {
  const db = (dbName || '').toLowerCase().trim();
  const ig = (dbInstagram || '').toLowerCase().trim();
  const inp = inputName.toLowerCase().trim();
  if (!inp || (!db && !ig)) return 0;
  if (db === inp || ig === inp) return 100;
  if (db.includes(inp) || inp.includes(db)) return 90;
  if (ig && (ig.includes(inp) || inp.includes(ig))) return 88;
  const dbWords = db.split(/\s+/).filter(w => w.length > 1);
  const inpWords = inp.split(/\s+/).filter(w => w.length > 1);
  let wordMatches = 0;
  const MIN_WORD_LEN = 4;
  inpWords.forEach(inpWord => {
    if (dbWords.some(dbWord => dbWord === inpWord ||
      (dbWord.length >= MIN_WORD_LEN && inpWord.length >= MIN_WORD_LEN &&
        (dbWord.includes(inpWord) || inpWord.includes(dbWord))))) {
      wordMatches++;
    }
  });
  if (wordMatches === inpWords.length && inpWords.length > 0) return 85;
  if (wordMatches > 0) return 55 + (wordMatches * 10);
  const dbStart = db.slice(0, 3);
  const inpStart = inp.slice(0, 3);
  if (dbStart === inpStart) return 70;
  return 0;
}

function matchClientForName(rawName, clients) {
  let bestClient = null;
  let bestScore = 0;
  clients.forEach(c => {
    const score = scoreClientName(c.name, c.instagram, rawName);
    if (score > bestScore) { bestScore = score; bestClient = c; }
  });
  if (bestScore >= 85) return { matched_client_id: bestClient.id, matched_client_name: bestClient.name, match_confidence: 'high' };
  if (bestScore >= 70) return { matched_client_id: bestClient.id, matched_client_name: bestClient.name, match_confidence: 'medium' };
  if (bestScore >= 50) return { matched_client_id: bestClient.id, matched_client_name: bestClient.name, match_confidence: 'low' };
  return { matched_client_id: '', matched_client_name: '', match_confidence: 'none' };
}

// ─── AddedRow (stile TabManuale) ─────────────────────────────────────────────
function AddedRow({ row, onUpdate, onDelete, onClientDetail, tone = 'new' }) {
  const isExisting = tone === 'existing';
  const tileClass = isExisting ? 'border-border bg-secondary/20' : 'border-red-500/30 bg-red-500/10';
  const nameClass = isExisting ? 'text-foreground' : 'text-red-300';
  const revClass = isExisting ? 'text-primary' : 'text-red-400';
  const pplClass = isExisting ? 'text-muted-foreground' : 'text-red-300/80';
  const checkClass = isExisting ? 'text-muted-foreground' : 'text-red-400';
  const [editing, setEditing] = useState(false);
  const [rev, setRev] = useState(String(row.rev));
  const [ppl, setPpl] = useState(String(row.ppl));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const newRev = Number(rev) || 0;
    const newPpl = Number(ppl) || 0;
    await base44.entities.EventAttendance.update(row.attendanceId, { revenue: newRev, new_people_brought: newPpl });
    const diffPpl = newPpl - row.ppl;
    if (diffPpl !== 0) {
      const cd = await base44.entities.Client.get(row.client.id);
      await base44.entities.Client.update(row.client.id, { new_people_brought: Math.max(0, (cd.new_people_brought || 0) + diffPpl) });
    }
    onUpdate({ ...row, rev: newRev, ppl: newPpl });
    setEditing(false);
    setSaving(false);
  };

  const handleDelete = async () => {
    await base44.entities.EventAttendance.delete(row.attendanceId);
    if (row.ppl > 0) {
      const cd = await base44.entities.Client.get(row.client.id);
      await base44.entities.Client.update(row.client.id, { new_people_brought: Math.max(0, (cd.new_people_brought || 0) - row.ppl) });
    }
    onDelete(row);
  };

  if (editing) {
    return (
      <Card className="p-3 space-y-2.5 border-blue-500/40">
        <Div className="flex items-center gap-2">
          {row.client.is_leader && <Star className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" />}
          <Span className="text-xs font-semibold text-blue-300 flex-1 truncate">{row.client.name}</Span>
          <Btn
            button
            onClick={() => setEditing(false)}
            className="text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </Btn>
        </Div>
        <Div className="flex items-center gap-2 flex-wrap">
          <Div className="flex items-center gap-1.5 bg-background/60 border border-blue-500/30 rounded-lg px-2.5 py-1.5">
            <Span className="text-[10px] text-blue-400 font-semibold">€</Span>
            <HtmlInput type="number" min="0" value={rev} onChange={e => setRev(e.target.value)}
              className="h-6 w-16 text-xs px-1 bg-transparent border-0 focus:outline-none" placeholder="0" autoFocus />
          </Div>
          <Div className="flex items-center gap-1.5 bg-background/60 border border-blue-500/30 rounded-lg px-2.5 py-1.5">
            <Span className="text-[10px] text-blue-400 font-semibold">Pers.</Span>
            <HtmlInput type="number" min="0" value={ppl} onChange={e => setPpl(e.target.value)}
              className="h-6 w-12 text-xs px-1 bg-transparent border-0 focus:outline-none" placeholder="0" />
          </Div>
          <Button size="sm" disabled={saving} onClick={handleSave}
            className="h-8 text-xs ml-auto bg-blue-600 hover:bg-blue-500 text-white border-0">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Check className="w-3 h-3 mr-1" />Salva</>}
          </Button>
        </Div>
      </Card>
    );
  }

  return (
    <Div
      className={`flex items-center justify-between rounded-xl border ${tileClass} px-3 py-2.5`}>
      <Div className="flex items-center gap-1.5 min-w-0">
        <ClientAvatar client={row.client} size="xs" initials={row.client.name?.charAt(0)?.toUpperCase() || '?'} />
        {row.client.is_leader && <Star className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" />}
        <Btn
          button
          onClick={() => onClientDetail?.(row.client)}
          className={`text-xs font-semibold ${nameClass} truncate hover:underline text-left`}>
          {row.client.name}
        </Btn>
      </Div>
      <Div className="flex items-center gap-2.5 text-[10px] shrink-0">
        {row.rev > 0 && <Span className={`${revClass} font-bold`}>€{row.rev}</Span>}
        {row.ppl > 0 && <Span className={pplClass}>{row.ppl} pers.</Span>}
        <Check className={`w-3.5 h-3.5 ${checkClass}`} />
        <Btn
          button
          onClick={() => { setRev(String(row.rev)); setPpl(String(row.ppl)); setEditing(true); }}
          className="text-muted-foreground hover:text-blue-400 transition-colors">
          <Pencil className="w-3 h-3" />
        </Btn>
        <Btn
          button
          onClick={handleDelete}
          className="text-muted-foreground hover:text-red-400 transition-colors">
          <X className="w-3 h-3" />
        </Btn>
      </Div>
    </Div>
  );
}

// ─── SmartBatchImport (layout split-screen con funzioni manuali) ─────────────
export default function SmartBatchImport({
  events, clients, groups, attendances, promoterId, onSaved, selectedEvent, onClientDetail,
  onOpenImportaBulk, bulkCreatedClients, onBulkClientUpdated,
}) {
  const [batchText, setBatchText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [entries, setEntries] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [error, setError] = useState(null);
  const [addedRows, setAddedRows] = useState([]);
  const [localClients, setLocalClients] = useState(clients);
  // Pannello sinistro collassato (mobile): quando l'AI finisce l'estrazione,
  // collassa automaticamente incolla+aggiungi manuale per dare spazio ai risultati.
  // L'utente riapre tappando sulla barra compatta.
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const resultsRef = useRef(null);
  const [showGroupCreate, setShowGroupCreate] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [groupCreated, setGroupCreated] = useState(false);
  const qc = useQueryClient();

  useEffect(() => { setLocalClients(clients); }, [clients]);
  useEffect(() => { setEntries(null); setSavedCount(0); setError(null); setAddedRows([]); setLeftCollapsed(false); }, [selectedEvent?.id]);

  // Quando l'AI finisce l'estrazione (entries diventa non-null), collassa il
  // pannello sinistro e scrolla in cima ai risultati per dare spazio sul mobile.
  useEffect(() => {
    if (entries && entries.length > 0) {
      setLeftCollapsed(true);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [entries]);

  const existingClientIds = useMemo(() => {
    if (!selectedEvent) return new Set();
    const fromDB = attendances.filter(a => a.event_id === selectedEvent.id && a.client_id).map(a => a.client_id);
    const fromSession = addedRows.map(r => r.client.id);
    return new Set([...fromDB, ...fromSession]);
  }, [selectedEvent, attendances, addedRows]);

  const sessionClientIds = useMemo(() => new Set(addedRows.map(r => r.client.id)), [addedRows]);
  const existingRows = useMemo(() => {
    if (!selectedEvent) return [];
    return attendances
      .filter(a => a.event_id === selectedEvent.id && a.client_id)
      .filter(a => !sessionClientIds.has(a.client_id))
      .map(a => {
        const client = localClients.find(c => c.id === a.client_id) || { id: a.client_id, name: '(cliente rimosso)', is_leader: false };
        return { client, rev: a.revenue || 0, ppl: a.new_people_brought || 0, attendanceId: a.id };
      });
  }, [selectedEvent, attendances, sessionClientIds, localClients]);

  const handleParse = async () => {
    if (!batchText.trim() || !selectedEvent) return;
    setParsing(true);
    setEntries(null);
    setError(null);
    setSavedCount(0);
    try {
      const response = await base44.functions.invoke('parseAttendanceList', { text: batchText, promoter_id: promoterId });
      const result = response.data || response;
      if (result?.error) throw new Error(result.error);
      const rawEntries = result?.entries || [];
      const processed = rawEntries.map(e => {
        const match = matchClientForName(e.raw_name || '', localClients);
        const matchedClientObj = match.matched_client_id ? localClients.find(c => c.id === match.matched_client_id) : null;
        const alreadyPresent = matchedClientObj && existingClientIds.has(matchedClientObj.id);
        const peopleBrought = e.people_brought || 0;
        const parsedTotal = e.total_amount || 0;
        // Formula: se c'è un totale e delle persone portate, il prezzo del primo = totale / (persone+1)
        // Es: "Angelo +3, totale 120" → Angelo paga 120/4 = 30
        const totalAmount = peopleBrought > 0
          ? (parsedTotal > 0 ? Math.round(parsedTotal / (peopleBrought + 1)) : 30)
          : parsedTotal;
        return {
          ...e,
          people_brought: peopleBrought,
          new_people: 0,
          total_amount: totalAmount,
          matched_client_id: match.matched_client_id,
          matched_client_name: match.matched_client_name,
          match_confidence: match.match_confidence,
          matchedClientObj,
          selectedClient: null,
          createNew: false,
          excluded: alreadyPresent,
          alreadyPresent,
          companions: [],
        };
      });
      setEntries(processed);
    } catch (err) {
      setError(err.message || 'Errore durante l\'analisi');
    }
    setParsing(false);
  };

  const handleUpdateEntry = (idx, updated) => {
    setEntries(prev => prev.map((e, i) => i === idx ? updated : e));
  };

  // ── Manual add (da ClientSearchRow, salva subito come TabManuale) ──
  const handleManualAdded = (client, rev, ppl, attendanceId) => {
    setAddedRows(prev => [...prev, { client, rev, ppl, attendanceId }]);
    onSaved();
  };
  const handleNewClient = (c) => setLocalClients(prev => [...prev, c]);
  const handleRowUpdate = (updated) => { setAddedRows(prev => prev.map(r => r.attendanceId === updated.attendanceId ? updated : r)); onSaved(); };
  const handleRowDelete = (deleted) => { setAddedRows(prev => prev.filter(r => r.attendanceId !== deleted.attendanceId)); onSaved(); };

  // ── Crea cliente + salva presenza immediatamente (mostra in lista destra) ──
  const handleClientCreated = async (newClient, entry) => {
    setLocalClients(prev => [...prev, newClient]);
    // Non salvare la presenza in automatico: imposta solo come selezionato.
    // L'utente confermerà con il pulsante "Conferma" del batch.
    setEntries(prev => prev.map((e, i) => {
      if (e !== entry) return e;
      return { ...e, selectedClient: newClient, createNew: false, groupMembers: [] };
    }));
  };

  // ── Save AI entries (con revenue per accompagnatori) ──
  const handleSave = async () => {
    if (!entries || !selectedEvent) return;
    setSaving(true);
    let count = 0;
    const createdAtts = [];
    const updatedNewPeople = {}; // { clientId: delta }
    for (const entry of entries) {
      if (entry.excluded || entry.alreadyPresent) continue;
      if (!entry.selectedClient) continue;
      const clientId = entry.selectedClient.id;
      const alreadyExists = attendances.some(a => a.event_id === selectedEvent.id && a.client_id === clientId) ||
        addedRows.some(r => r.client.id === clientId);
      if (alreadyExists) continue;
      const att = await base44.entities.EventAttendance.create({
        event_id: selectedEvent.id,
        client_id: clientId,
        promoter_id: promoterId ?? '',
        revenue: entry.total_amount || 0,
        new_people_brought: entry.new_people || 0,
      });
      count++;
      createdAtts.push(att);
      setAddedRows(prev => [...prev, { client: entry.selectedClient, rev: entry.total_amount || 0, ppl: entry.new_people || 0, attendanceId: att.id }]);

      if (!entry.createNew && entry.new_people > 0) {
        updatedNewPeople[clientId] = (updatedNewPeople[clientId] || 0) + entry.new_people;
        try {
          const cd = await base44.entities.Client.get(clientId);
          await base44.entities.Client.update(clientId, { new_people_brought: (cd.new_people_brought || 0) + entry.new_people });
        } catch {}
      }

      // Accompagnatori con revenue + persone nuove individuali
      for (const companion of (entry.companions || [])) {
        const compRev = companion.revenue || 0;
        const compNewPeople = companion.new_people || 0;
        if (companion.client) {
          const compExists = attendances.some(a => a.event_id === selectedEvent.id && a.client_id === companion.client.id) ||
            addedRows.some(r => r.client.id === companion.client.id);
          if (!compExists) {
            const compAtt = await base44.entities.EventAttendance.create({
              event_id: selectedEvent.id,
              client_id: companion.client.id,
              promoter_id: promoterId ?? '',
              revenue: compRev,
              new_people_brought: compNewPeople,
            });
            count++;
            createdAtts.push(compAtt);
            setAddedRows(prev => [...prev, { client: companion.client, rev: compRev, ppl: compNewPeople, attendanceId: compAtt.id }]);
            if (compNewPeople > 0) {
              updatedNewPeople[companion.client.id] = (updatedNewPeople[companion.client.id] || 0) + compNewPeople;
              try {
                const cd = await base44.entities.Client.get(companion.client.id);
                await base44.entities.Client.update(companion.client.id, { new_people_brought: (cd.new_people_brought || 0) + compNewPeople });
              } catch {}
            }
          }
        } else if (companion.newName) {
          const newComp = await base44.entities.Client.create({
            name: companion.newName,
            promoter_id: promoterId,
          });
          setLocalClients(prev => [...prev, newComp]);
          qc.setQueryData(['clients', promoterId], (old = []) => [...(old || []), newComp]);
          const compAtt = await base44.entities.EventAttendance.create({
            event_id: selectedEvent.id,
            client_id: newComp.id,
            promoter_id: promoterId ?? '',
            revenue: compRev,
            new_people_brought: compNewPeople,
          });
          count++;
          createdAtts.push(compAtt);
          setAddedRows(prev => [...prev, { client: newComp, rev: compRev, ppl: compNewPeople, attendanceId: compAtt.id }]);
          if (compNewPeople > 0) {
            updatedNewPeople[newComp.id] = (updatedNewPeople[newComp.id] || 0) + compNewPeople;
            try {
              const cd = await base44.entities.Client.get(newComp.id);
              await base44.entities.Client.update(newComp.id, { new_people_brought: (cd.new_people_brought || 0) + compNewPeople });
            } catch {}
          }
        }
      }

      // Membri del gruppo (se leader confermato)
      for (const gm of (entry.groupMembers || [])) {
        if (gm.excluded) continue;
        const gmExists = attendances.some(a => a.event_id === selectedEvent.id && a.client_id === gm.client.id) ||
          addedRows.some(r => r.client.id === gm.client.id);
        if (gmExists) continue;
        const gmAtt = await base44.entities.EventAttendance.create({
          event_id: selectedEvent.id,
          client_id: gm.client.id,
          promoter_id: promoterId ?? '',
          revenue: gm.rev || 0,
          new_people_brought: gm.ppl || 0,
        });
        count++;
        createdAtts.push(gmAtt);
        setAddedRows(prev => [...prev, { client: gm.client, rev: gm.rev || 0, ppl: gm.ppl || 0, attendanceId: gmAtt.id }]);

        if (gm.ppl > 0) {
          updatedNewPeople[gm.client.id] = (updatedNewPeople[gm.client.id] || 0) + gm.ppl;
          try {
            const cd = await base44.entities.Client.get(gm.client.id);
            await base44.entities.Client.update(gm.client.id, { new_people_brought: (cd.new_people_brought || 0) + gm.ppl });
          } catch {}
        }
      }
    }

    // Optimistic: aggiungi tutte le presenze create alla cache attendances e
    // aggiorna new_people_brought nella cache clients, così la pagina Clienti
    // si aggiorna istantaneamente (visite + rating live).
    if (createdAtts.length > 0) {
      qc.setQueryData(['attendances', promoterId], (old = []) => [...(old || []), ...createdAtts]);
    }
    if (Object.keys(updatedNewPeople).length > 0) {
      qc.setQueryData(['clients', promoterId], (old = []) =>
        (old || []).map(cl => {
          const delta = updatedNewPeople[cl.id];
          return delta ? { ...cl, new_people_brought: (cl.new_people_brought || 0) + delta } : cl;
        })
      );
    }

    setSaving(false);
    setSavedCount(count);
    setEntries(null);
    setBatchText('');
    onSaved();
  };

  // Clienti confermati dalle entries AI (per creazione gruppo)
  const confirmedClients = useMemo(() => {
    if (!entries) return [];
    return entries
      .filter(e => e.selectedClient && !e.excluded && !e.alreadyPresent)
      .map(e => e.selectedClient);
  }, [entries]);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || confirmedClients.length === 0 || !promoterId) return;
    setCreatingGroup(true);
    try {
      await base44.entities.ClientGroup.create({
        promoter_id: promoterId,
        name: groupName.trim(),
        client_ids: confirmedClients.map(c => c.id),
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

  const stats = useMemo(() => {
    if (!entries) return null;
    return {
      total: entries.length,
      confirmed: entries.filter(e => (e.selectedClient || e.createNew) && !e.excluded && !e.alreadyPresent).length,
      unmatched: entries.filter(e => !e.selectedClient && !e.createNew && !e.excluded).length,
      alreadyPresent: entries.filter(e => e.alreadyPresent).length,
      excluded: entries.filter(e => e.excluded && !e.alreadyPresent).length,
    };
  }, [entries]);

  if (!selectedEvent) {
    return (
      <Div className="h-full flex items-center justify-center text-muted-foreground p-6">
        <Div className="text-center">
          <Div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-3">
            <Sparkles className="w-8 h-8 text-primary/50" />
          </Div>
          <P className="text-sm font-medium">Seleziona una serata per iniziare</P>
          <P className="text-xs text-muted-foreground/70 mt-1">Scegli la serata dal selettore in alto</P>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="h-full overflow-y-auto overscroll-y-contain lg:overflow-hidden lg:grid lg:grid-rows-1 lg:grid-cols-[minmax(380px,440px)_1fr]">
      {/* ── Pannello sinistro: Incolla + Aggiungi cliente/gruppo + Crea in blocco ── */}
      {/* Mobile collassato: barra compatta per riaprire (lg:hidden su desktop) */}
      {leftCollapsed && (
        <Btn
          button
          onClick={() => setLeftCollapsed(false)}
          className="lg:hidden flex items-center gap-2.5 rounded-xl border border-border/50 bg-gradient-to-r from-secondary/30 to-secondary/10 hover:from-secondary/40 hover:to-secondary/20 px-3 py-2.5 transition-all text-left shadow-sm mx-4 mt-3">
          <Div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
            <ClipboardList className="w-3.5 h-3.5 text-primary" />
          </Div>
          <Div className="flex-1 min-w-0">
            <P className="text-xs font-semibold text-foreground">Incolla lista / Aggiungi cliente</P>
            <P className="text-[10px] text-muted-foreground">Tocca per espandere</P>
          </Div>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </Btn>
      )}
      <Div className={`p-4 space-y-3 lg:min-h-0 lg:overflow-y-auto lg:overscroll-y-contain lg:border-r lg:border-border ${leftCollapsed ? 'hidden lg:block' : ''}`}>
        {/* Mobile: pulsante per collassare di nuovo il pannello sinistro */}
        <Btn
          button
          onClick={() => setLeftCollapsed(true)}
          className="lg:hidden flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 px-2.5 py-1.5 transition-colors text-left w-fit">
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          <Span className="text-[10px] font-medium text-muted-foreground">Comprimi</Span>
        </Btn>
        {/* Box incolla lista AI */}
        <Div className="rounded-2xl border border-border/50 overflow-hidden bg-gradient-to-b from-card to-card/90 shadow-xl">
          <PanelHeader icon={Sparkles} title="Incolla lista presenze" color="#a78bfa" />
          <Div className="p-3 space-y-2.5">
            <P className="text-[11px] text-muted-foreground leading-relaxed">
              Incolla la lista come la scrivi di solito. L'AI riconosce nomi abbreviati, nickname, +N persone e importi.
            </P>
            <HtmlTextarea
              className="w-full h-32 rounded-xl bg-background/80 border border-border/40 text-sm px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 font-mono placeholder:text-muted-foreground/40 placeholder:font-sans shadow-inner transition-all"
              placeholder={"Incolla qui la lista della serata..."}
              value={batchText}
              onChange={e => setBatchText(e.target.value)}
            />
            {error && (
              <Div className="flex items-center gap-2 text-xs text-destructive">
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </Div>
            )}
            <Button disabled={!batchText.trim() || parsing} onClick={handleParse} className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 shadow-lg shadow-violet-600/25 border-0" size="sm">
              {parsing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analisi AI in corso...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" />Analizza con AI</>
              )}
            </Button>
          </Div>
        </Div>

        {/* Aggiungi cliente o gruppo (manuale, stesso del tab Manuale) */}
        <ClientSearchRow
          clients={localClients}
          groups={groups}
          existingClientIds={existingClientIds}
          promoterId={promoterId}
          eventId={selectedEvent.id}
          onAdded={handleManualAdded}
          onNewClient={handleNewClient}
          onClientDetail={onClientDetail}
        />

        {/* Crea nuovi clienti in blocco */}
        <Btn
          button
          onClick={onOpenImportaBulk}
          className="w-full flex items-center gap-2.5 rounded-xl border border-border/50 bg-gradient-to-r from-secondary/30 to-secondary/10 hover:from-secondary/40 hover:to-secondary/20 hover:border-foreground/20 px-3 py-3 transition-all text-left shadow-sm">
          <Div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
            <Plus className="w-3.5 h-3.5 text-primary" />
          </Div>
          <Div>
            <P className="text-xs font-semibold text-foreground">Crea nuovi clienti in blocco</P>
            <P className="text-[10px] text-muted-foreground">Incolla una lista di nomi</P>
          </Div>
        </Btn>
      </Div>

      {/* ── Pannello destro: Risultati AI + Presenze ── */}
      <Div className="p-4 space-y-4 lg:min-h-0 lg:overflow-y-auto lg:overscroll-y-contain">
        {/* Barra statistiche */}
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-gradient-to-r from-secondary/30 to-secondary/10 px-3 py-1.5 text-[11px] text-foreground/80 font-medium shadow-sm">
            <Users className="w-3.5 h-3.5 text-primary" />
            {existingClientIds.size} presenze totali
          </Span>
          {addedRows.length > 0 && (
            <Span className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-500/15 to-red-500/5 px-3 py-1.5 text-[11px] text-red-400 font-bold shadow-sm shadow-red-500/10">
              +{addedRows.length} aggiunte ora
            </Span>
          )}
        </Div>

        {/* Risultati analisi AI */}
        {entries && (
          <Div ref={resultsRef} className="rounded-2xl border border-border/50 overflow-hidden bg-gradient-to-b from-card to-card/90 shadow-xl scroll-mt-3">
            <PanelHeader icon={Users} title="Risultati analisi" count={stats.total} color="#a78bfa" />
            <Div className="p-2.5 space-y-1.5 max-h-[50vh] overflow-y-auto recontact-scrollbar">
              {entries.map((entry, i) => (
                <ParsedEntryCard
                  key={i}
                  entry={entry}
                  clients={localClients}
                  groups={groups}
                  existingClientIds={existingClientIds}
                  promoterId={promoterId}
                  onUpdate={(updated) => handleUpdateEntry(i, updated)}
                  onClientDetail={onClientDetail}
                  onClientCreated={handleClientCreated}
                />
              ))}
            </Div>
            {/* Action buttons */}
            <Div className="p-2.5 space-y-2 border-t border-border/40 bg-gradient-to-r from-secondary/10 to-transparent">
              <Div className="flex gap-2">
                <Button disabled={stats.confirmed === 0 || saving} onClick={handleSave} size="sm" className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-600/25 border-0">
                  {saving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Salvo...</> : `Conferma ${stats.confirmed} presen${stats.confirmed === 1 ? 'za' : 'ze'}`}
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setEntries(null); setBatchText(''); setSavedCount(0); setError(null); setLeftCollapsed(false); }}>
                  Ricomincia
                </Button>
              </Div>
              {confirmedClients.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => setShowGroupCreate(s => !s)} className="w-full border-violet-500/30 text-violet-300 hover:bg-violet-500/10 hover:text-violet-200">
                  <FolderPlus className="w-3.5 h-3.5 mr-1.5" /> Crea gruppo ({confirmedClients.length} clienti)
                </Button>
              )}
              {showGroupCreate && (
                <Div className="flex gap-2">
                  <HtmlInput
                    autoFocus
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    placeholder="Nome gruppo..."
                    className="flex-1 h-8 text-xs px-3 rounded-lg bg-background border border-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                    onKeyDown={e => { if (e.key === 'Enter') handleCreateGroup(); if (e.key === 'Escape') setShowGroupCreate(false); }} />
                  <Button size="sm" disabled={!groupName.trim() || creatingGroup} onClick={handleCreateGroup} className="bg-violet-600 hover:bg-violet-500 text-white border-0">
                    {creatingGroup ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  </Button>
                </Div>
              )}
              {groupCreated && (
                <Div className="flex items-center gap-2 text-xs text-green-400 px-1">
                  <Check className="w-3.5 h-3.5" /> Gruppo creato con {confirmedClients.length} clienti
                </Div>
              )}
            </Div>
          </Div>
        )}

        {/* Success message */}
        {savedCount > 0 && !entries && (
          <Div className="rounded-xl border border-green-500/30 bg-green-500/8 px-3 py-2.5 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <Span className="text-xs text-green-300 font-medium">{savedCount} presenze salvate con successo!</Span>
          </Div>
        )}

        {/* Già presenti (storico DB) */}
        {existingRows.length > 0 && (
          <Div className="rounded-2xl border border-border/50 overflow-hidden bg-gradient-to-b from-card to-card/90 shadow-xl">
            <PanelHeader icon={History} title="Già presenti in questa serata" count={existingRows.length} color="#a78bfa" />
            <Div className="p-2.5 space-y-1.5">
              {existingRows.map((r) => (
                <AddedRow key={r.attendanceId} row={r} tone="existing"
                  onUpdate={() => onSaved()} onDelete={() => onSaved()} onClientDetail={onClientDetail} />
              ))}
            </Div>
          </Div>
        )}

        {/* Aggiunti ora */}
        <Div className="rounded-2xl border border-border/50 overflow-hidden bg-gradient-to-b from-card to-card/90 shadow-xl">
          <PanelHeader icon={Check} title="Aggiunti ora" count={addedRows.length} color="#f87171" />
          <Div className="p-2.5 space-y-1.5">
            {addedRows.length > 0 ? (
              addedRows.map((r) => (
                <AddedRow key={r.attendanceId} row={r}
                  onUpdate={handleRowUpdate} onDelete={handleRowDelete} onClientDetail={onClientDetail} />
              ))
            ) : (
              <P className="text-xs text-muted-foreground text-center py-5">
                Nessun cliente aggiunto in questa sessione.{'\n'}Usa il pannello a sinistra per iniziare.
              </P>
            )}
          </Div>
        </Div>
      </Div>
    </Div>
  );
}