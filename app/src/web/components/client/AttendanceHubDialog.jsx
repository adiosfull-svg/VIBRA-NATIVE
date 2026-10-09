// Port di src/components/client/AttendanceHubDialog.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - <div> gesture/eventi web rimossi: onPointerDown
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
// Dialog principale gestito come overlay sempre montato (custom) per preservare la
// sessione allo stesso modo dell'import serate: la chiusura non smonta il contenuto.
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/input';
import { CheckCircle2 } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  Search, X, Check, ChevronDown, ChevronUp, ChevronRight,
  Sparkles, Users, Star, AlertCircle, Loader2, CalendarDays, UserPlus, Pencil, FolderOpen, Plus, History, Trash2
} from '@/ui/icons.generated';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import BulkCreatedClientsList from '@/web/components/client/BulkCreatedClientsList';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import ClientSearchRow from '@/web/components/client/AttendanceClientSearchRow';
import SmartBatchImport from '@/web/components/client/SmartBatchImport';
import { useOverlay } from '@/web/lib/overlayStackContext';
import { lockScroll } from '@/web/lib/scrollLock';
import { toast } from '@/ui/use-toast';
import { refetchEventTables, triggerStatsRecompute } from '@/web/lib/eventSync';

import { Btn, Div, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

import { doc as webDocument, win as webWindow } from '@/web/shims/dom';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getEventLabel(ev) {
  if (!ev) return '—';
  return `${ev.name}${ev.date ? ' · ' + format(parseISO(ev.date), 'dd MMM yy', { locale: it }) : ''}`;
}

function VenueLogoSmall({ venue, getVenueLogo }) {
  if (!venue) return null;
  const { logoUrl } = getVenueLogo(venue);
  if (!logoUrl) return null;
  return (
    <Img
      src={logoUrl}
      alt={venue}
      className="h-4 w-4 object-contain shrink-0 rounded-sm" />
  );
}

// Logo locale grande per il selettore serata — visibile e riconoscibile
function VenueLogoBig({ venue, getVenueLogo }) {
  if (!venue) return <CalendarDays className="w-5 h-5 text-muted-foreground" />;
  const { logoUrl } = getVenueLogo(venue);
  if (!logoUrl) return <CalendarDays className="w-5 h-5 text-muted-foreground" />;
  return (
    <Img
      src={logoUrl}
      alt={venue}
      className="max-h-full max-w-full object-contain" />
  );
}

// ─── Card — riquadro stile "approccio grafico nuovo" (bordo sottile, bg-card) ─

function Card({ children, className = '' }) {
  return (
    <Div className={`relative rounded-2xl border border-white/[0.06] bg-card ${className}`}>
      {children}
    </Div>
  );
}

// ─── PanelHeader — intestazione riquadro stile "tabella nuova" ────────────────
//    bordo inferiore, bg secondary, uppercase tracking — come DesktopClientTable

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

// ─── EventPicker — selettore serata compatto per header persistente ──────────

function EventPicker({ events, selectedEvent, onSelect, getVenueLogo }) {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    if (show) setTimeout(() => searchRef.current?.focus({ preventScroll: true }), 60);
  }, [show]);

  const filtered = search
    ? events.filter(e => getEventLabel(e).toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : events.slice(0, 6);

  return (
    <Div className="relative">
      <Btn
        onClick={() => setShow(s => !s)}
        className={`w-full flex items-center gap-3 rounded-xl border bg-secondary/20 px-3 py-2.5 text-left transition-colors ${selectedEvent ? 'border-border' : 'border-border hover:border-foreground/30'}`}>
        {selectedEvent ? (
          <Div className="h-12 w-12 rounded-lg bg-secondary/40 shrink-0 flex items-center justify-center overflow-hidden p-1">
            <VenueLogoBig venue={selectedEvent.venue} getVenueLogo={getVenueLogo} />
          </Div>
        ) : (
          <Div className="p-2 rounded-lg bg-secondary/40 shrink-0">
            <CalendarDays className="w-5 h-5 text-muted-foreground" />
          </Div>
        )}
        <Div className="flex-1 min-w-0">
          <P className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/80">Serata selezionata</P>
          <P className={`text-sm font-semibold truncate ${selectedEvent ? 'text-foreground' : 'text-muted-foreground'}`}>
            {selectedEvent ? getEventLabel(selectedEvent) : 'Seleziona una serata...'}
          </P>
        </Div>
        {show ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </Btn>

      {/* Backdrop: sempre montato, attivo solo a dropdown aperto */}
      <Btn
        className={`fixed inset-0 z-0 touch-none transition-opacity duration-150 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShow(false)}
      />
      {/* Dropdown SEMPRE montato (invisibile a chiusura): gli <img> dei loghi
          non vengono mai smontati → restano decodificati nel DOM → niente flash
          di re-fetch/re-decode ad ogni apertura. */}
      <Div
        className={`absolute z-10 top-full left-0 right-0 mt-1.5 rounded-xl border border-border bg-card shadow-2xl p-2.5 space-y-2 transition-opacity duration-150 ${show ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <Div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input ref={searchRef} placeholder="Cerca serata..." value={search}
            onChange={e => setSearch(e.target.value)} className="h-8 text-sm pl-8" />
        </Div>
        <Div className="grid grid-cols-1 gap-1.5 max-h-52 overflow-y-auto overscroll-y-contain recontact-scrollbar pr-0.5">
          {filtered.length === 0 && (
            <P className="text-xs text-muted-foreground text-center py-3">Nessuna serata trovata</P>
          )}
          {filtered.map(e => (
            <Btn
              key={e.id}
              onClick={() => { onSelect(e); setShow(false); setSearch(''); }}
              className={`flex items-center gap-2 text-left text-xs px-2.5 py-2 rounded-lg border transition-all ${selectedEvent?.id === e.id ? 'border-primary/50 bg-primary/10' : 'border-white/[0.04] bg-secondary/20 hover:border-primary/30'}`}>
              <VenueLogoSmall venue={e.venue} getVenueLogo={getVenueLogo} />
              <Span className="flex-1 truncate">{getEventLabel(e)}</Span>
            </Btn>
          ))}
        </Div>
      </Div>
    </Div>
  );
}

// ─── AddedRow — tile modificabile ───────────────────────────────────────────

function AddedRow({ row, onUpdate, onDelete, onClientDetail, tone = 'new', promoterId }) {
  const qc = useQueryClient();
  const isExisting = tone === 'existing';
  const tileClass = isExisting
    ? 'border-border bg-secondary/20'
    : 'border-red-500/30 bg-red-500/10';
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
    try {
      await base44.entities.EventAttendance.update(row.attendanceId, {
        revenue: newRev,
        new_people_brought: newPpl,
      });
      const diffPpl = newPpl - row.ppl;
      // Optimistic: aggiorna la presenza nella cache attendances
      qc.setQueryData(['attendances', promoterId], (old = []) =>
        (old || []).map(a => a.id === row.attendanceId ? { ...a, revenue: newRev, new_people_brought: newPpl } : a)
      );
      if (diffPpl !== 0) {
        qc.setQueryData(['clients', promoterId], (old = []) =>
          (old || []).map(cl => cl.id === row.client.id ? { ...cl, new_people_brought: Math.max(0, (cl.new_people_brought || 0) + diffPpl) } : cl)
        );
        try {
          const cd = await base44.entities.Client.get(row.client.id);
          await base44.entities.Client.update(row.client.id, {
            new_people_brought: Math.max(0, (cd.new_people_brought || 0) + diffPpl),
          });
        } catch {}
      }
      onUpdate({ ...row, rev: newRev, ppl: newPpl });
      setEditing(false);
      refetchEventTables(qc);
      triggerStatsRecompute(qc);
    } catch (err) {
      toast({ title: 'Salvataggio fallito', description: 'Riprova tra qualche secondo.', variant: 'destructive' });
      refetchEventTables(qc);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await base44.entities.EventAttendance.delete(row.attendanceId);
      // Optimistic: rimuovi la presenza dalla cache attendances
      qc.setQueryData(['attendances', promoterId], (old = []) =>
        (old || []).filter(a => a.id !== row.attendanceId)
      );
      if (row.ppl > 0) {
        qc.setQueryData(['clients', promoterId], (old = []) =>
          (old || []).map(cl => cl.id === row.client.id ? { ...cl, new_people_brought: Math.max(0, (cl.new_people_brought || 0) - row.ppl) } : cl)
        );
        try {
          const cd = await base44.entities.Client.get(row.client.id);
          await base44.entities.Client.update(row.client.id, {
            new_people_brought: Math.max(0, (cd.new_people_brought || 0) - row.ppl),
          });
        } catch {}
      }
      onDelete(row);
      refetchEventTables(qc);
      triggerStatsRecompute(qc);
    } catch (err) {
      toast({ title: 'Eliminazione fallita', description: 'Riprova tra qualche secondo.', variant: 'destructive' });
      refetchEventTables(qc);
    }
  };

  if (editing) {
    return (
      <Card className="p-3 space-y-2.5 border-blue-500/40">
        <Div className="flex items-center gap-2">
          {row.client.is_leader && <Star className="w-3 h-3 text-yellow-400 shrink-0" />}
          <Span className="text-xs font-semibold text-blue-300 flex-1 truncate">{row.client.name}</Span>
          <Btn
            onClick={() => setEditing(false)}
            className="text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </Btn>
        </Div>
        <Div className="flex items-center gap-2 flex-wrap">
          <Div className="flex items-center gap-1.5 bg-background/60 border border-blue-500/30 rounded-lg px-2.5 py-1.5">
            <Span className="text-[10px] text-blue-400 font-semibold">€</Span>
            <Input type="number" min="0" value={rev} onChange={e => setRev(e.target.value)}
              className="h-6 w-16 text-xs border-0 bg-transparent p-0 focus-visible:ring-0" placeholder="0" autoFocus />
          </Div>
          <Div className="flex items-center gap-1.5 bg-background/60 border border-blue-500/30 rounded-lg px-2.5 py-1.5">
            <Span className="text-[10px] text-blue-400 font-semibold">Pers.</Span>
            <Input type="number" min="0" value={ppl} onChange={e => setPpl(e.target.value)}
              className="h-6 w-12 text-xs border-0 bg-transparent p-0 focus-visible:ring-0" placeholder="0" />
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
          onClick={() => { setRev(String(row.rev)); setPpl(String(row.ppl)); setEditing(true); }}
          className="text-muted-foreground hover:text-blue-400 transition-colors">
          <Pencil className="w-3 h-3" />
        </Btn>
        <Btn
          onClick={handleDelete}
          className="text-muted-foreground hover:text-red-400 transition-colors">
          <X className="w-3 h-3" />
        </Btn>
      </Div>
    </Div>
  );
}

// ─── ImportaBulkDialog ────────────────────────────────────────────────────────

function ImportaBulkDialog({ open, onOpenChange, promoterId, onImported }) {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [importing, setImporting] = useState(false);

  const names = text.split('\n').map(n => n.trim()).filter(n => n.length > 0);

  const handleImport = async () => {
    if (!names.length || !promoterId) return;
    setImporting(true);
    setResults(null);
    const created = [];
    const errors = [];
    for (const name of names) {
      try {
        const c = await base44.entities.Client.create({ name, promoter_id: promoterId });
        created.push(c);
      } catch {
        errors.push(name);
      }
    }
    setImporting(false);
    setResults({ created, errors });
    if (created.length > 0) onImported(created);
  };

  const handleClose = () => {
    setText('');
    setResults(null);
    onOpenChange(false);
  };

  // Registra il dialog nello stack overlay globale: il tasto back di Android
  // chiude questo dialog (in cima allo stack) invece del AttendanceHubDialog
  // sottostante. Senza questo, il back non trovando un entry per questo dialog
  // colpiva l'entry del hub e chiudeva quello.
  useOverlay(open, handleClose);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <Div className="p-1.5 rounded-lg bg-primary/15"><UserPlus className="w-4 h-4 text-primary" /></Div>
            Importa Nuovi Clienti
          </DialogTitle>
        </DialogHeader>

        {!results ? (
          <Div className="space-y-4">
            <P className="text-sm text-muted-foreground">
              Inserisci un nome per riga. Ogni riga creerà una scheda cliente associata al tuo profilo.
            </P>
            <Textarea
              placeholder={"Mario Rossi\nGiuseppe Verdi\nSara Bianchi"}
              value={text}
              onChange={e => setText(e.target.value)}
              className="min-h-[160px] font-mono text-sm"
              autoFocus
            />
            {names.length > 0 && (
              <P className="text-xs text-muted-foreground">{names.length} client{names.length === 1 ? 'e' : 'i'} da importare</P>
            )}
            <Div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleClose}>Annulla</Button>
              <Button size="sm" onClick={handleImport} disabled={names.length === 0 || importing}>
                {importing ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Importando...</> : `Importa ${names.length > 0 ? names.length : ''} client${names.length === 1 ? 'e' : 'i'}`}
              </Button>
            </Div>
          </Div>
        ) : (
          <Div className="space-y-4">
            {results.created.length > 0 && (
              <Div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 space-y-2">
                <Div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  {results.created.length} client{results.created.length === 1 ? 'e importato' : 'i importati'} con successo
                </Div>
                <Div className="text-xs text-muted-foreground space-y-0.5 pl-6">
                  {results.created.map(c => <Div key={c.id}>{c.name}</Div>)}
                </Div>
              </Div>
            )}
            {results.errors.length > 0 && (
              <Div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 space-y-2">
                <Div className="flex items-center gap-2 text-destructive text-sm font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  {results.errors.length} errori
                </Div>
                <Div className="text-xs text-muted-foreground space-y-0.5 pl-6">
                  {results.errors.map(n => <Div key={n}>{n}</Div>)}
                </Div>
              </Div>
            )}
            <Div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setText(''); setResults(null); }}>Importa altri</Button>
              <Button size="sm" onClick={handleClose}>Chiudi</Button>
            </Div>
          </Div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Tab Manuale (layout a riquadri full-screen) ─────────────────────────────

function TabManuale({ events, clients: initialClients, groups, attendances, promoterId, onSaved, onOpenImportaBulk, bulkCreatedClients, onBulkClientUpdated, selectedEvent, onClientDetail }) {
  const [addedRows, setAddedRows] = useState([]);
  const [localClients, setLocalClients] = useState(initialClients);

  useEffect(() => { setLocalClients(initialClients); }, [initialClients]);

  // Reset added rows quando cambia la serata
  useEffect(() => { setAddedRows([]); }, [selectedEvent?.id]);

  // Sync live: quando i dati cliente si aggiornano (es. leader/driver togglati
  // dal menu contestuale, o refetch della query clients), aggiorna gli snapshot
  // dei clienti nelle righe "Aggiunti ora" così le icone/stelle si riflettono
  // immediatamente senza dover ricaricare la pagina.
  useEffect(() => {
    setAddedRows(prev => {
      if (prev.length === 0) return prev;
      let changed = false;
      const next = prev.map(r => {
        const latest = localClients.find(c => c.id === r.client.id);
        if (latest && latest !== r.client) { changed = true; return { ...r, client: latest }; }
        return r;
      });
      return changed ? next : prev;
    });
  }, [localClients]);

  const handleNewClient = (c) => setLocalClients(prev => [...prev, c]);

  const existingClientIds = useMemo(() => {
    if (!selectedEvent) return new Set();
    const fromDB = attendances
      .filter(a => a.event_id === selectedEvent.id && a.client_id && (!promoterId || a.promoter_id === promoterId))
      .map(a => a.client_id);
    const fromSession = addedRows.map(r => r.client.id);
    return new Set([...fromDB, ...fromSession]);
  }, [selectedEvent, attendances, addedRows, promoterId]);

  const leadersPresent = useMemo(() => {
    const allPresent = [
      ...attendances.filter(a => a.event_id === selectedEvent?.id && a.client_id)
        .map(a => localClients.find(c => c.id === a.client_id)).filter(Boolean),
      ...addedRows.map(r => r.client),
    ].filter(c => c.is_leader);
    const seen = new Set();
    return allPresent.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });
  }, [selectedEvent, attendances, addedRows, localClients]);

  // Presenze già salvate nel DB per la serata selezionata (storico). Esclude i
  // clienti aggiunti nella sessione corrente (addedRows) per non duplicarli.
  // Alla (ri)apertura di una serata mostra tutte le persone già presenti, così
  // il box non riparte da zero ma mantiene la cronologia dei precedenti aggiunti.
  const sessionClientIds = useMemo(() => new Set(addedRows.map(r => r.client.id)), [addedRows]);
  const existingRows = useMemo(() => {
    if (!selectedEvent) return [];
    return attendances
      .filter(a => a.event_id === selectedEvent.id && a.client_id && (!promoterId || a.promoter_id === promoterId))
      .filter(a => !sessionClientIds.has(a.client_id))
      .map(a => {
        const client = localClients.find(c => c.id === a.client_id) || { id: a.client_id, name: '(cliente rimosso)', is_leader: false };
        return { client, rev: a.revenue || 0, ppl: a.new_people_brought || 0, attendanceId: a.id };
      });
  }, [selectedEvent, attendances, promoterId, sessionClientIds, localClients]);

  // Modifica/elimina di una presenza storica: scrive su DB (AddedRow) poi riflette
  // il cambio facendo refetch delle presenze (onSaved).
  const handleExistingUpdate = () => { onSaved(); };
  const handleExistingDelete = () => { onSaved(); };

  const handleAdded = (client, rev, ppl, attendanceId) => {
    setAddedRows(prev => [...prev, { client, rev, ppl, attendanceId }]);
    onSaved();
  };

  const handleRowUpdate = (updated) => {
    setAddedRows(prev => prev.map(r => r.attendanceId === updated.attendanceId ? updated : r));
    onSaved();
  };

  const handleRowDelete = (deleted) => {
    setAddedRows(prev => prev.filter(r => r.attendanceId !== deleted.attendanceId));
    onSaved();
  };

  // Empty state: nessuna serata selezionata
  if (!selectedEvent) {
    return (
      <Div className="h-full flex items-center justify-center text-muted-foreground p-6">
        <Div className="text-center">
          <Div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-3">
            <CalendarDays className="w-8 h-8 text-primary/50" />
          </Div>
          <P className="text-sm font-medium">Seleziona una serata per iniziare</P>
          <P className="text-xs text-muted-foreground/70 mt-1">Scegli la serata dal selettore in alto</P>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="h-full overflow-y-auto overscroll-y-contain lg:overflow-hidden lg:grid lg:grid-rows-1 lg:grid-cols-[minmax(380px,440px)_1fr]">
      {/* ── Pannello sinistro: Aggiungi + Crea in blocco ── */}
      <Div className="p-4 space-y-3 lg:min-h-0 lg:overflow-y-auto lg:overscroll-y-contain lg:border-r lg:border-border">
        <ClientSearchRow
          clients={localClients}
          groups={groups}
          existingClientIds={existingClientIds}
          promoterId={promoterId}
          eventId={selectedEvent.id}
          onAdded={handleAdded}
          onNewClient={handleNewClient}
          onClientDetail={onClientDetail}
        />

        <Btn
          onClick={onOpenImportaBulk}
          className="w-full flex items-center gap-2.5 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 hover:border-foreground/30 px-3 py-3 transition-colors text-left">
          <Div className="p-1.5 rounded-lg bg-secondary/40 shrink-0">
            <Plus className="w-3.5 h-3.5 text-foreground" />
          </Div>
          <Div>
            <P className="text-xs font-semibold text-foreground">Crea nuovi clienti in blocco</P>
            <P className="text-[10px] text-muted-foreground">Incolla una lista di nomi</P>
          </Div>
        </Btn>
      </Div>

      {/* ── Pannello destro: Riquadri presenze ── */}
      <Div className="p-4 space-y-4 lg:min-h-0 lg:overflow-y-auto lg:overscroll-y-contain">
        {/* Barra statistiche */}
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-gradient-to-r from-secondary/30 to-secondary/10 px-3 py-1.5 text-[11px] text-foreground/80 font-medium shadow-sm">
            <Users className="w-3.5 h-3.5 text-primary" />
            {existingClientIds.size} presenze totali
          </Span>
          {addedRows.length > 0 && (
            <Span className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] text-red-400 font-semibold">
              +{addedRows.length} aggiunte ora
            </Span>
          )}
        </Div>

        {/* Riquadro: Già presenti (storico DB) */}
        {existingRows.length > 0 && (
          <Div className="rounded-2xl border border-border/50 overflow-hidden bg-gradient-to-b from-card to-card/90 shadow-xl">
            <PanelHeader
              icon={History}
              title="Già presenti in questa serata"
              count={existingRows.length}
              color="#a78bfa"
            />
            <Div className="p-2.5 space-y-1.5">
              {existingRows.map((r) => (
                <AddedRow
                  key={r.attendanceId}
                  row={r}
                  tone="existing"
                  promoterId={promoterId}
                  onUpdate={handleExistingUpdate}
                  onDelete={handleExistingDelete}
                  onClientDetail={onClientDetail}
                />
              ))}
            </Div>
          </Div>
        )}

        {/* Riquadro: Aggiunti ora */}
        <Div className="rounded-xl border border-border overflow-hidden bg-card">
          <PanelHeader
            icon={Check}
            title="Aggiunti ora"
            count={addedRows.length}
            color="#f87171"
          />
          <Div className="p-2.5 space-y-1.5">
            {addedRows.length > 0 ? (
              addedRows.map((r) => (
                <AddedRow
                  key={r.attendanceId}
                  row={r}
                  promoterId={promoterId}
                  onUpdate={handleRowUpdate}
                  onDelete={handleRowDelete}
                  onClientDetail={onClientDetail}
                />
              ))
            ) : (
              <P className="text-xs text-muted-foreground text-center py-5">
                Nessun cliente aggiunto in questa sessione.{'\n'}Usa il pannello a sinistra per iniziare.
              </P>
            )}
          </Div>
        </Div>

        {/* Riquadro: Creati in questa sessione */}
        {bulkCreatedClients && bulkCreatedClients.length > 0 && (
          <Div className="rounded-xl border border-emerald-500/30 overflow-hidden bg-card">
            <PanelHeader
              icon={Plus}
              title="Creati in questa sessione"
              count={bulkCreatedClients.length}
              color="#34d399"
            />
            <Div className="p-2.5">
              <BulkCreatedClientsList
                clients={bulkCreatedClients}
                allClients={localClients}
                attendances={attendances}
                events={events}
                onUpdated={onBulkClientUpdated}
              />
            </Div>
          </Div>
        )}

        {/* Riquadro: Leader presenti */}
        {leadersPresent.length > 0 && (
          <Div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-3 py-2.5 flex items-start gap-2.5">
            <Div className="p-1.5 rounded-lg bg-yellow-500/15 shrink-0">
              <Star className="w-3.5 h-3.5 text-yellow-400" />
            </Div>
            <Div>
              <P className="text-[11px] font-bold text-yellow-300">
                {leadersPresent.length} Leader present{leadersPresent.length === 1 ? 'e' : 'i'} questa serata
              </P>
              <P className="text-[10px] text-yellow-400/80 mt-0.5 font-medium">
                {leadersPresent.map(c => c.name).join(', ')}
              </P>
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}

// ─── Main Dialog (full-screen, header persistente, layout a riquadri) ────────

export default function AttendanceHubDialog({ open, onOpenChange, events, clients, attendances, promoterId, onSaved, onClientDetail }) {
  // Stessa logica di apertura/chiusura di ClientDetailDialog: internalOpen guida
  // fade + zoom; la chiusura notifica il parent dopo 220ms (fade-out completo).
  const [internalOpen, setInternalOpen] = useState(false);
  const closeTimerRef = useRef(null);
  useEffect(() => { setInternalOpen(open); }, [open]);
  useEffect(() => () => clearTimeout(closeTimerRef.current), []);
  const requestClose = () => {
    setInternalOpen(false);
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => onOpenChange?.(false), 220);
  };
  const requestCloseRef = useRef(requestClose);
  useEffect(() => { requestCloseRef.current = requestClose; });

  useOverlay(open, () => requestCloseRef.current());
  // Tastiera software (mobile): riduci l'altezza del dialog all'area visibile
  // (sopra la tastiera). Senza questo, il dialog fixed inset-0 mantiene
  // l'altezza full-screen e scrollIntoView({block:'center'}) del hook globale
  // useKeyboardSafeFocus centra il campo nel layout viewport (dietro la
  // tastiera) invece che nel visualViewport (area visibile).
  // Tastiera software (mobile): niente tracking JS di visualViewport — il
  // listener 'resize' scatta a fine animazione causando un ritardo ~500ms.
  // Usiamo invece height: 100dvh (dynamic viewport height) sul container fixed:
  // il browser aggiorna l'unità dvh frame-by-frame durante l'animazione della
  // tastiera, così il dialog si restringe in tempo reale, istantaneo e fluido,
  // identico al comportamento nativo degli input in-flow (es. ricerca in
  // Analisi Intelligente). scrollIntoView({block:'center'}) del hook globale
  // useKeyboardSafeFocus ora centra il campo nell'area visibile (dvh = area
  // visibile, non layout viewport dietro la tastiera).
  const [tab, setTab] = useState('manuale');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showImportaBulk, setShowImportaBulk] = useState(false);
  const [bulkImportedClients, setBulkImportedClients] = useState([]);
  // sessionKey: incrementato dal tasto "Svuota" per remontare i tab e azzerare
  // tutti i dati draft (righe aggiunte, testo AI, entries) in entrambi i tab.
  const [sessionKey, setSessionKey] = useState(0);
  const seenInClientsRef = useRef(new Set());
  const { getVenueLogo } = useAllVenueLogos();

  useEffect(() => {
    const currentIds = new Set(clients.map(c => c.id));
    setBulkImportedClients(prev => {
      if (prev.length === 0) return prev;
      const stillValid = prev.filter(c => currentIds.has(c.id) || !seenInClientsRef.current.has(c.id));
      return stillValid.length === prev.length ? prev : stillValid;
    });
    currentIds.forEach(id => seenInClientsRef.current.add(id));
  }, [clients]);

  const handleBulkImported = (created) => {
    setBulkImportedClients(prev => [...prev, ...created]);
    onSaved();
  };

  // Svuota tutti i dati in memoria: deseleziona la serata, cancella i clienti
  // creati in blocco e remonta i tab (via sessionKey) per azzerare righe, testo
  // AI ed entries. L'utente può così ripartire da zero dopo una sessione.
  const handleSvuota = () => {
    setSelectedEvent(null);
    setBulkImportedClients([]);
    setSessionKey(k => k + 1);
  };

  const mergedClients = useMemo(() => {
    const ids = new Set(clients.map(c => c.id));
    const extra = bulkImportedClients.filter(c => !ids.has(c.id));
    return extra.length ? [...clients, ...extra] : clients;
  }, [clients, bulkImportedClients]);

  const { data: groups = [] } = useQuery({
    queryKey: ['client-groups', promoterId],
    queryFn: () => base44.entities.ClientGroup.filter({ promoter_id: promoterId }),
    enabled: open && !!promoterId,
    staleTime: 0,
    refetchOnMount: true,
  });

  const sortedEvents = useMemo(() =>
    [...events].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [events]
  );

  // ESC + scroll lock ref-counted per overlay custom (sempre montato)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      // Se c'è un dialog Radix aperto sopra (es. Dettaglio Cliente, Importa Bulk),
      // lascia che si chiuda quello: non chiudere anche il Box Presenze.
      if (webDocument.querySelector('[role="dialog"][data-state="open"]')) return;
      // Se il menu contestuale "Aggiungi a serata" è aperto sopra, chiudi solo quello.
      if (webDocument.body.dataset.clientSerateMenu) return;
      requestCloseRef.current();
    };
    webWindow.addEventListener('keydown', onKey);
    const unlock = lockScroll();
    return () => {
      webWindow.removeEventListener('keydown', onKey);
      unlock();
    };
  }, [open, onOpenChange]);

  // Portal su document.body (come ClientDetailDialog): un overlay `fixed` renderizzato
  // dentro la pagina viene posizionato rispetto al primo antenato con transform/filter
  // (es. .main-content durante il rubber band, motion.div) e non copre tutto il viewport
  // → strisce di pagina scoperte ai bordi. Sul body copre sempre l'intero schermo.
  return (
    <>
      {createPortal(
      <Div
        // pointer-events-none dipende da `open` (parent), NON da internalOpen: durante il
        // fade-out (220ms) l'overlay continua a intercettare i tocchi, così il click
        // sintetico dopo la chiusura non attiva gli elementi della pagina sotto.
        className={`fixed z-[9999] flex items-center justify-center max-sm:pt-[env(safe-area-inset-top)] max-sm:pb-[env(safe-area-inset-bottom)] sm:p-8 transition-opacity duration-200 ${internalOpen ? 'opacity-100' : 'opacity-0'} ${open ? '' : 'pointer-events-none'}`}
        style={{ top: 0, left: 0, right: 0, bottom: 'auto', height: '100dvh' }}>
        <Div className="absolute inset-0 bg-black/80 touch-none" />
        {/* Popup centrato (angoli stondati, margini laterali). Altezza DEFINITA (non auto):
            i tab interni usano h-full / grid. Zoom-in via scale solo da chiuso: da aperto
            nessun transform, così gli elementi fixed interni (picker serata) restano relativi al viewport. */}
        <Div
          className={`relative max-sm:w-[calc(100%-1.5rem)] max-sm:h-[calc(100dvh-4rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] max-sm:rounded-2xl sm:w-full sm:h-full bg-background border border-border shadow-lg flex flex-col overflow-hidden transition-transform duration-200 sm:rounded-2xl ${internalOpen ? '' : 'scale-95'}`}
          style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(167,139,250,0.12) 0%, rgba(196,181,253,0.05) 30%, transparent 55%)' }}
        >

          {/* ── Header persistente: titolo + tab + selettore serata ── */}
          <Div className="shrink-0 border-b border-border bg-secondary/5">
            {/* Riga titolo + tab + chiudi */}
            <Div className="flex items-center gap-3 px-4 py-3">
              <Div className="p-2 rounded-xl bg-primary/15 shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </Div>
              <Div className="min-w-0">
                <P className="text-sm font-semibold truncate">Aggiungi Presenze per Evento</P>
                <P className="text-xs text-muted-foreground font-normal truncate">Aggiungi clienti o gruppi a una serata</P>
              </Div>
              <Div className="ml-auto flex items-center gap-2 shrink-0">
                <Div className="flex bg-secondary/40 rounded-lg p-0.5 border border-border">
                  <Btn
                    onClick={() => setTab('manuale')}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${tab === 'manuale' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Search className="w-3 h-3" />Manuale
                  </Btn>
                  <Btn
                    onClick={() => setTab('ai')}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${tab === 'ai' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Sparkles className="w-3 h-3" />AI
                  </Btn>
                </Div>
                <Btn
                  onClick={handleSvuota}
                  className="text-muted-foreground hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                  accessibilityLabel="Svuota sessione">
                  <Trash2 className="w-4 h-4" />
                </Btn>
                <Btn
                  onClick={requestClose}
                  className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary/60"
                  accessibilityLabel="Chiudi">
                  <X className="w-4 h-4" />
                </Btn>
              </Div>
            </Div>
            {/* Selettore serata — sempre visibile */}
            <Div className="px-4 pb-3">
              <EventPicker
                events={sortedEvents}
                selectedEvent={selectedEvent}
                onSelect={setSelectedEvent}
                getVenueLogo={getVenueLogo}
              />
            </Div>
          </Div>

          {/* ── Contenuto principale (full-height, grid su desktop) ── */}
          <Div className="flex-1 overflow-hidden min-h-0">
            {/* Entrambi i tab SEMPRE montati (CSS hidden per l'inattivo): lo stato
                draft (righe aggiunte, testo AI, entries) persiste quando si cambia
                tab o si chiude il box. sessionKey remonta i tab al click di "Svuota". */}
            <Div className={`h-full ${tab === 'manuale' ? '' : 'hidden'}`}>
              <TabManuale
                key={`manuale-${sessionKey}`}
                events={sortedEvents}
                clients={mergedClients}
                groups={groups}
                attendances={attendances}
                promoterId={promoterId}
                onSaved={onSaved}
                onOpenImportaBulk={() => setShowImportaBulk(true)}
                bulkCreatedClients={bulkImportedClients}
                onBulkClientUpdated={(updated) => setBulkImportedClients(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } : c))}
                selectedEvent={selectedEvent}
                onClientDetail={onClientDetail}
              />
            </Div>
            <Div className={`h-full ${tab === 'ai' ? '' : 'hidden'}`}>
              <SmartBatchImport
                key={`ai-${sessionKey}`}
                events={sortedEvents}
                clients={mergedClients}
                groups={groups}
                attendances={attendances}
                promoterId={promoterId}
                onSaved={onSaved}
                selectedEvent={selectedEvent}
                onClientDetail={onClientDetail}
                onOpenImportaBulk={() => setShowImportaBulk(true)}
                bulkCreatedClients={bulkImportedClients}
                onBulkClientUpdated={(updated) => setBulkImportedClients(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } : c))}
              />
            </Div>
          </Div>

          {/* ── Footer ── */}
          <Div className="shrink-0 border-t border-border p-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={requestClose}>Chiudi</Button>
          </Div>
        </Div>
      </Div>,
      webDocument.body
      )}

      <ImportaBulkDialog
        open={showImportaBulk}
        onOpenChange={setShowImportaBulk}
        promoterId={promoterId}
        onImported={handleBulkImported}
      />
    </>
  );
}