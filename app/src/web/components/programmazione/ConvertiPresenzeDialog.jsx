// Port di src/components/programmazione/ConvertiPresenzeDialog.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { base44 } from '@/lib/base44';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { Trash2, Plus, Search, Check, Loader2, Users, TrendingUp } from '@/ui/icons.generated';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Btn, Div, P, Span } from '@/ui/html';

/**
 * Dialog "Converti in presenze": trasforma il prospetto inviti di una serata
 * in presenze effettive (EventAttendance). Pre-popolato con i clienti pianificati,
 * permette di aggiungere altri nomi, importi (revenue) e persone nuove portate.
 *
 * Trova o crea l'Event per la data, poi crea una EventAttendance per ogni riga
 * con importo > 0 o persone > 0.
 */
export default function ConvertiPresenzeDialog({
  open, onOpenChange,
  dateStr, title, subtitle,
  plannedClients = [],
  allClients = [],
  events = [],
  promoterId,
  onConverted,
}) {
  useOverlay(open, () => onOpenChange?.(false));
  // rows: [{ clientId, name, revenue, people, source: 'plan'|'added', semina }]
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const searchRef = useRef(null);

  const venueName = useMemo(() => {
    if (!title) return '';
    const parts = title.split(' · ');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }, [title]);

  // Pre-popola le righe con i clienti pianificati all'apertura
  useEffect(() => {
    if (!open) return;
    setRows(plannedClients.map(c => ({
      clientId: c.id || null,
      name: c.name,
      revenue: '',
      people: '',
      source: 'plan',
      semina: c.type === 'semina',
    })));
    setSearch('');
    setDone(false);
    setSaving(false);
    setError('');
  }, [open, plannedClients]);

  // Auto-focus ricerca quando il dialog si apre
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus({ preventScroll: true }), 250);
  }, [open]);

  const existingIds = new Set(rows.filter(r => r.clientId).map(r => r.clientId));
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allClients
      .filter(c => !existingIds.has(c.id) && c.name?.toLowerCase().includes(q))
      .slice(0, 8);
  }, [search, allClients, existingIds]);

  const addRow = (client) => {
    setRows(prev => [...prev, {
      clientId: client.id,
      name: client.name,
      revenue: '',
      people: '',
      source: 'added',
      semina: false,
    }]);
    setSearch('');
  };

  const addManualRow = () => {
    const name = search.trim();
    if (!name) return;
    setRows(prev => [...prev, {
      clientId: null,
      name,
      revenue: '',
      people: '',
      source: 'manual',
      semina: false,
    }]);
    setSearch('');
  };

  const updateRow = (idx, field, val) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  };

  const removeRow = (idx) => {
    setRows(prev => prev.filter((_, i) => i !== idx));
  };

  const totalRevenue = rows.reduce((s, r) => s + (Number(r.revenue) || 0), 0);
  const totalPeople = rows.reduce((s, r) => s + (Number(r.people) || 0), 0);
  const validRows = rows.filter(r => (Number(r.revenue) > 0) || (Number(r.people) > 0));

  // Verifica che la serata sia già registrata in "Serate" (Event esistente per la data)
  const findEvent = () => events.find(e => e.date === dateStr) || null;

  // Crea i clienti "manuali" (nomi nuovi non ancora in DB)
  const ensureClient = async (row) => {
    if (row.clientId) return row.clientId;
    const created = await base44.entities.Client.create({
      name: row.name,
      promoter_id: promoterId,
      is_lead: false,
    });
    return created.id;
  };

  const handleConvert = async () => {
    if (validRows.length === 0 || saving) return;
    setSaving(true);
    setError('');
    try {
      const event = findEvent();
      if (!event) {
        setError('Serata ancora non registrata. Vai in "Serate" e crea prima la serata per questa data.');
        setSaving(false);
        return;
      }
      let createdCount = 0;
      for (const row of validRows) {
        const clientId = await ensureClient(row);
        const rev = Number(row.revenue) || 0;
        const ppl = Number(row.people) || 0;
        // Evita duplicati: se esiste già una presenza per questo cliente+evento, aggiorna
        const existingAtt = null; // non abbiamo attendances qui; creiamo sempre
        await base44.entities.EventAttendance.create({
          event_id: event.id,
          client_id: clientId,
          promoter_id: promoterId ?? '',
          revenue: rev,
          new_people_brought: ppl,
        });
        if (ppl > 0) {
          try {
            const cData = await base44.entities.Client.get(clientId);
            await base44.entities.Client.update(clientId, {
              new_people_brought: (cData.new_people_brought || 0) + ppl,
            });
          } catch {}
        }
        createdCount++;
      }
      setSaving(false);
      setDone(true);
      onConverted?.(dateStr, createdCount);
      setTimeout(() => onOpenChange(false), 900);
    } catch (err) {
      console.error('Errore conversione presenze:', err);
      setSaving(false);
      alert('Errore durante la conversione: ' + (err?.message || 'sconosciuto'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-sm:top-16 max-sm:translate-y-0 max-sm:bottom-auto max-sm:max-h-[88vh] max-sm:overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-0.5">
            <Span>Converti in presenze</Span>
            <Span className="text-xs font-normal text-muted-foreground">{title} · {subtitle}</Span>
          </DialogTitle>
        </DialogHeader>

        <Div className="space-y-3">
          {/* Riepilogo */}
          <Div className="flex gap-4 text-sm text-muted-foreground pb-2 border-b border-border">
            <Span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> <Span className="font-semibold text-foreground">{rows.length}</Span> nomi</Span>
            <Span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Tot: <Span className="text-primary font-semibold">€{totalRevenue.toLocaleString('it-IT')}</Span></Span>
            <Span>Pers. nuove: <Span className="font-semibold text-foreground">{totalPeople}</Span></Span>
          </Div>

          {/* Aggiungi nome: ricerca clienti esistenti o inserimento manuale */}
          <Div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              ref={searchRef}
              placeholder="Aggiungi nome: cerca cliente esistente o scrivi nuovo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && search.trim() && searchResults.length === 0) addManualRow(); }}
              className="pl-9 h-8 text-sm"
            />
            {search.trim() && (
              <Div className="absolute z-10 mt-1 left-0 right-0 rounded-lg border border-border bg-card shadow-lg max-h-56 overflow-y-auto p-1 space-y-0.5">
                {searchResults.length > 0 ? (
                  searchResults.map(c => (
                    <Btn
                      button
                      key={c.id}
                      onClick={() => addRow(c)}
                      className="w-full flex items-center gap-2 text-left text-xs px-2 py-2 rounded hover:bg-secondary/60 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-primary shrink-0" />
                      <Span className="font-medium truncate">{c.name}</Span>
                      {c.instagram && <Span className="text-muted-foreground truncate">@{c.instagram}</Span>}
                    </Btn>
                  ))
                ) : (
                  <Btn
                    button
                    onClick={addManualRow}
                    className="w-full flex items-center gap-2 text-left text-xs px-2 py-2 rounded hover:bg-secondary/60 transition-colors"
                  >
                    <Plus className="w-3 h-3 text-green-400 shrink-0" />
                    <Span>Crea nuovo cliente: <Span className="font-semibold text-foreground">{search.trim()}</Span></Span>
                  </Btn>
                )}
              </Div>
            )}
          </Div>

          {/* Tabella righe */}
          <Div className="space-y-1.5 max-h-[44vh] overflow-y-auto recontact-scrollbar">
            {rows.length === 0 && (
              <P className="text-sm text-muted-foreground text-center py-6">Nessun nome. Aggiungine almeno uno sopra.</P>
            )}
            {rows.map((r, idx) => (
              <Div key={idx} className={`rounded-lg border px-2.5 py-2 ${r.semina ? 'border-pink-500/30 bg-pink-500/5' : 'border-border bg-secondary/30'}`}>
                <Div className="flex items-center gap-2">
                  {r.semina ? (
                    <Span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-pink-500/15 text-pink-400 shrink-0">IG</Span>
                  ) : (
                    <Span className="w-2 h-2 rounded-full bg-emerald-400/70 shrink-0" />
                  )}
                  <Span className="text-xs font-medium truncate flex-1 min-w-0">{r.name}</Span>
                  <Btn
                    button
                    onClick={() => removeRow(idx)}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1"
                    accessibilityLabel="Rimuovi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Btn>
                </Div>
                <Div className="flex items-center gap-2 mt-1.5 pl-5">
                  <Div className="flex items-center gap-1">
                    <Span className="text-[10px] text-muted-foreground w-7">€</Span>
                    <Input
                      type="number"
                      min="0"
                      value={r.revenue}
                      onChange={e => updateRow(idx, 'revenue', e.target.value)}
                      placeholder="0"
                      className="h-7 w-20 text-xs"
                    />
                  </Div>
                  <Div className="flex items-center gap-1">
                    <Span className="text-[10px] text-muted-foreground">Pers.</Span>
                    <Input
                      type="number"
                      min="0"
                      value={r.people}
                      onChange={e => updateRow(idx, 'people', e.target.value)}
                      placeholder="0"
                      className="h-7 w-16 text-xs"
                    />
                  </Div>
                </Div>
              </Div>
            ))}
          </Div>

          {/* Footer azioni */}
          {error && (
            <Div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
              ⚠ {error}
            </Div>
          )}
          <Div className="flex items-center justify-between gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={saving}>
              Annulla
            </Button>
            <Button
              size="sm"
              disabled={validRows.length === 0 || saving || done}
              onClick={handleConvert}
              className="gap-1.5"
            >
              {done ? (
                <><Check className="w-3.5 h-3.5" /> Convertito!</>
              ) : saving ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Conversione...</>
              ) : (
                <>Converti {validRows.length} presenze</>
              )}
            </Button>
          </Div>
          {done && (
            <P className="text-xs text-center text-green-400">
              ✓ {validRows.length} presenze create per {title}
            </P>
          )}
        </Div>
      </DialogContent>
    </Dialog>
  );
}