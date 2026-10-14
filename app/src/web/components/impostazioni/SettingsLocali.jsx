// Port di src/components/impostazioni/SettingsLocali.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { Input } from '@/ui/input';
import { Label } from '@/ui/misc';
import { Button } from '@/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/menu';
import { MapPin, Plus, Pencil, Trash2, X, CalendarPlus, GripVertical } from '@/ui/icons.generated';
import { DragDropContext, Droppable, Draggable } from '@/web/shims/dnd';
import { toast } from '@/ui/use-toast';
import SectionHeader from '@/web/components/shared/SectionHeader';
import CachedImage from '@/web/components/shared/CachedImage';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/ui/dialog';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput, HtmlLabel } from '@/ui/elements';

const DAY_OPTIONS = [
  { value: 'none', label: 'Nessuno (speciale/extra)' },
  { value: '5', label: 'Venerdì' },
  { value: '6', label: 'Sabato' },
  { value: '0', label: 'Domenica' },
  { value: '1', label: 'Lunedì' },
  { value: '2', label: 'Martedì' },
  { value: '3', label: 'Mercoledì' },
  { value: '4', label: 'Giovedì' },
];

const EMPTY_FORM = {
  name: '', day_of_week: 'none', season_label: '', color_hex: '#a78bfa',
  default_threshold: '300', is_extra: false, is_active: true,
};

function VenueForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const isEdit = !!initial?.id;

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      day_of_week: form.day_of_week === 'none' ? null : Number(form.day_of_week),
      season_label: form.season_label,
      color_hex: form.color_hex || '#a78bfa',
      default_threshold: Number(form.default_threshold) || 300,
      is_extra: form.is_extra,
      is_active: form.is_active,
    };
    if (isEdit) {
      await base44.entities.Venue.update(initial.id, payload);
    } else {
      const count = await base44.entities.Venue.list();
      await base44.entities.Venue.create({ ...payload, sort_order: count.length });
    }
    await queryClient.invalidateQueries({ queryKey: ['venues'] });
    setSaving(false);
    onSaved();
  };

  return (
    <Div className="rounded-lg border border-border bg-secondary/10 p-4 space-y-3">
      <Div>
        <Label className="text-xs">Nome locale *</Label>
        <Input
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Es: Ammare Frontemare"
          className="h-8 text-sm"
        />
      </Div>
      <Div className="grid grid-cols-2 gap-3">
        <Div>
          <Label className="text-xs">Giorno fisso</Label>
          <Select value={String(form.day_of_week)} onValueChange={v => setForm(f => ({ ...f, day_of_week: v }))}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DAY_OPTIONS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </Div>
        <Div>
          <Label className="text-xs">Etichetta stagione</Label>
          <Input
            value={form.season_label}
            onChange={e => setForm(f => ({ ...f, season_label: e.target.value }))}
            placeholder="Estate, Inverno, Festivi..."
            className="h-8 text-sm"
          />
        </Div>
      </Div>
      <Div className="grid grid-cols-2 gap-3">
        <Div>
          <Label className="text-xs">Soglia default tavolo (€)</Label>
          <Input
            type="number"
            value={form.default_threshold}
            onChange={e => setForm(f => ({ ...f, default_threshold: e.target.value }))}
            className="h-8 text-sm"
          />
        </Div>
        <Div>
          <Label className="text-xs">Colore</Label>
          <Div className="flex items-center gap-2">
            <HtmlInput
              type="color"
              value={form.color_hex}
              onChange={e => setForm(f => ({ ...f, color_hex: e.target.value }))}
              className="h-8 w-10 rounded border border-border bg-transparent cursor-pointer"
            />
            <Input
              value={form.color_hex}
              onChange={e => setForm(f => ({ ...f, color_hex: e.target.value }))}
              className="h-8 text-sm flex-1"
            />
          </Div>
        </Div>
      </Div>
      <Div className="flex items-center gap-5">
        <Label className="flex items-center gap-2 text-xs">
          <HtmlInput
            type="checkbox"
            checked={form.is_extra}
            onChange={e => setForm(f => ({ ...f, is_extra: e.target.checked }))}
            className="rounded border-border"
          />
          Locale Extra/Festivi
        </Label>
        <Label className="flex items-center gap-2 text-xs">
          <HtmlInput
            type="checkbox"
            checked={form.is_active}
            onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
            className="rounded border-border"
          />
          Attivo (altrimenti concluso)
        </Label>
      </Div>
      <Div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={onCancel} className="h-8 text-xs">Annulla</Button>
        <Button type="button" size="sm" onClick={handleSave} disabled={saving || !form.name.trim()} className="h-8 text-xs">
          {saving ? 'Salvataggio...' : isEdit ? 'Salva modifiche' : 'Aggiungi locale'}
        </Button>
      </Div>
    </Div>
  );
}

export default function SettingsLocali() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list('sort_order'),
  });
  const { getVenueLogo } = useAllVenueLogos();

  const toggleProspetto = async (v) => {
    const next = v.show_in_prospetto === false ? true : false;
    await base44.entities.Venue.update(v.id, { show_in_prospetto: next });
    await queryClient.invalidateQueries({ queryKey: ['venues'] });
  };

  // Riordino a TRASCINAMENTO. L'ordine (sort_order) determina l'ordine dei tile in Serate.
  // - La lista si riordina SUBITO (aggiornamento ottimistico della cache ['venues']), senza attendere il server.
  // - Si scrivono solo i locali il cui sort_order cambia davvero (alla prima volta anche la normalizzazione
  //   di eventuali buchi/duplicati), tutti in parallelo; poi un solo refresh.
  // - Se il salvataggio fallisce si torna all'ordine precedente e compare un avviso.
  // - I salvataggi di trascinamenti ravvicinati vengono messi in coda: l'ultimo vince, nell'ordine giusto.
  const saveChain = useRef(Promise.resolve());
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || destination.index === source.index) return;
    const ordered = Array.from(venues);
    const [moved] = ordered.splice(source.index, 1);
    ordered.splice(destination.index, 0, moved);
    const changes = ordered.map((v, i) => ({ id: v.id, from: v.sort_order, to: i })).filter(c => c.from !== c.to);
    const previous = queryClient.getQueryData(['venues']);
    queryClient.cancelQueries({ queryKey: ['venues'] });   // un refetch in corso non deve sovrascrivere il nuovo ordine
    queryClient.setQueryData(['venues'], ordered.map((v, i) => ({ ...v, sort_order: i })));
    saveChain.current = saveChain.current.then(async () => {
      try {
        await Promise.all(changes.map(c => base44.entities.Venue.update(c.id, { sort_order: c.to })));
      } catch {
        queryClient.setQueryData(['venues'], previous);
        toast({ title: 'Impossibile salvare il nuovo ordine dei locali', variant: 'destructive' });
      }
      await queryClient.invalidateQueries({ queryKey: ['venues'] });
    });
  };

  // Una riga (tile) di locale.
  const renderRow = (v, provided, snapshot) => (
            <Div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={provided.draggableProps.style}
              className={`flex items-center gap-3 py-2 px-3 rounded-lg border select-none cursor-grab active:cursor-grabbing transition-colors ${snapshot.isDragging ? 'border-primary/60 bg-card shadow-2xl' : 'border-border/40 bg-secondary/5'}`}
              accessibilityLabel={`Trascina per riordinare: ${v.name}`}
            >
              {(() => { const url = getVenueLogo(v.logo_key || v.name).logoUrl; return url
                ? <CachedImage src={url} alt="" className="w-7 h-7 rounded-lg object-contain bg-secondary/40 shrink-0" />
                : <Span className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `${v.color_hex}33` }}><Span className="w-2.5 h-2.5 rounded-full" style={{ background: v.color_hex }} /></Span>; })()}
              <Div className="flex-1 min-w-0">
                <P className="text-sm font-medium truncate">{v.name}</P>
                <P className="text-[10px] text-muted-foreground">
                  {v.season_label || '—'} · {v.is_active ? 'Attivo' : 'Concluso'}{v.is_extra ? ' · Extra' : ''} · Soglia €{v.default_threshold ?? 300}
                </P>
              </Div>
              <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" aria-hidden="true" />
              <Btn
                button
                onClick={() => { setEditingId(v.id); setShowAddForm(false); }}
                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </Btn>
              <Btn
                button
                onClick={() => setDeleteTarget(v)}
                className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </Btn>
            </Div>
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await base44.entities.Venue.delete(deleteTarget.id);
    await queryClient.invalidateQueries({ queryKey: ['venues'] });
    setDeleteTarget(null);
  };

  return (
    <Div className="rounded-xl border border-border bg-card overflow-hidden">
      <Div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-secondary/20">
        <SectionHeader icon={MapPin} title="Gestione Locali" color="#22d3ee" />
        {!showAddForm && (
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => { setShowAddForm(true); setEditingId(null); }}>
            <Plus className="w-3.5 h-3.5" /> Aggiungi locale
          </Button>
        )}
      </Div>
      <Div className="p-4 space-y-3">
        <P className="text-[11px] text-muted-foreground">
          Aggiungi, modifica o rimuovi i locali. Una volta creato, il locale compare automaticamente nelle soglie tavoli, nella creazione/importazione serate e nella pagina Locali.
          Trascina un locale per cambiare l'ordine in cui compare in Serate.
        </P>


        {showAddForm && (
          <VenueForm
            initial={null}
            onCancel={() => setShowAddForm(false)}
            onSaved={() => setShowAddForm(false)}
          />
        )}

        {isLoading ? (
          <Div className="flex justify-center py-4">
            <Div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </Div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            {/* Nessun renderClone: il tile trascinato resta l'elemento originale (come in Promoter e Le Mie Note).
                Con un clone in portal l'elemento toccato viene rimosso dal DOM e su touch gli eventi di
                movimento si perdono: il tile non seguiva il dito. */}
            <Droppable droppableId="venues">
              {(dropProvided) => (
                <Div ref={dropProvided.innerRef} {...dropProvided.droppableProps} className="space-y-2">
                  {venues.map((v, idx) => (
                    <Draggable key={v.id} draggableId={v.id} index={idx} isDragDisabled={editingId === v.id}>
                      {(provided, snapshot) => editingId === v.id ? (
                        <Div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                          <VenueForm
                            initial={{
                              id: v.id,
                              name: v.name,
                              day_of_week: v.day_of_week === null || v.day_of_week === undefined ? 'none' : String(v.day_of_week),
                              season_label: v.season_label || '',
                              color_hex: v.color_hex || '#a78bfa',
                              default_threshold: String(v.default_threshold ?? 300),
                              is_extra: !!v.is_extra,
                              is_active: v.is_active !== false,
                            }}
                            onCancel={() => setEditingId(null)}
                            onSaved={() => setEditingId(null)}
                          />
                        </Div>
                      ) : renderRow(v, provided, snapshot)}
                    </Draggable>
                  ))}
                  {dropProvided.placeholder}
                </Div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Div>

      {/* Prospetto: selezione semplice dei locali da mostrare nel menu contestuale */}
      <Div className="border-t border-border px-4 py-4 space-y-3">
        <SectionHeader icon={CalendarPlus} title="Prospetto Inviti" color="#a78bfa" />
        <P className="text-[11px] text-muted-foreground">
          Scegli quali locali mostrare nel prospetto (menu contestuale su clienti e semine). Utile per passare dai locali estivi a quelli invernali.
        </P>
        <Div className="space-y-1">
          {venues.map(v => (
            <HtmlLabel key={v.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-secondary/30 cursor-pointer">
              <HtmlInput
                type="checkbox"
                checked={v.show_in_prospetto !== false}
                onChange={() => toggleProspetto(v)}
                className="w-4 h-4 rounded border-border accent-violet-500"
              />
              {(() => { const url = getVenueLogo(v.logo_key || v.name).logoUrl; return url
                ? <CachedImage src={url} alt="" className="w-5 h-5 rounded object-contain bg-secondary/40 shrink-0" />
                : <Span className="w-5 h-5 rounded shrink-0" style={{ background: v.color_hex }} />; })()}
              <Span className="text-sm">{v.name}</Span>
            </HtmlLabel>
          ))}
        </Div>
      </Div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Il locale non sarà più selezionabile nelle nuove serate. Le serate già create non vengono modificate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Div>
  );
}