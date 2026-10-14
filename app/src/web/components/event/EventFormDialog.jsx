// Port di src/components/event/EventFormDialog.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/misc';
import { Textarea } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/menu';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { fetchAll } from '@/web/lib/safeData';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/ui/dialog';
import { Plus, Trash2 } from '@/ui/icons.generated';
import SmartDateInput from '@/web/components/shared/SmartDateInput';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Btn, Div, P, Span } from '@/ui/html';
import { Form } from '@/ui/form';
import { HtmlDatalist, HtmlInput, HtmlOption, Img } from '@/ui/elements';

const EMPTY = [];
const DAY_NAMES = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

// Legge la soglia default per un locale direttamente dal locale stesso (fonte unica di verità,
// impostabile in Impostazioni App > Tavoli).
function getVenueDefaultThreshold(venueName, venues) {
  if (!venueName) return '300';
  const v = venues.find(x => x.name === venueName);
  return v?.default_threshold ? String(v.default_threshold) : '300';
}

function venueOptionLabel(v) {
  if (v.is_extra) return v.name;
  const day = (v.day_of_week === null || v.day_of_week === undefined) ? '' : DAY_NAMES[v.day_of_week];
  const season = v.season_label ? v.season_label.toLowerCase() : '';
  if (day && season) return `${v.name} (${season} - ${day})`;
  if (season) return `${v.name} (${season})`;
  return v.name;
}

export default function EventFormDialog({ open, onOpenChange, event, onSave }) {
  useOverlay(open, () => onOpenChange?.(false));
  const [date, setDate] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [customVenue, setCustomVenue] = useState('');
  const [customEventName, setCustomEventName] = useState('');
  const [physicalLocation, setPhysicalLocation] = useState('');
  const [isExtra, setIsExtra] = useState(false);
  const [tableThreshold, setTableThreshold] = useState('300');
  const [totalRevenue, setTotalRevenue] = useState('');
  const [notes, setNotes] = useState('');
  const [promoterRevenues, setPromoterRevenues] = useState({});
  const [promoterPresent, setPromoterPresent] = useState({});
  // Ex PR: array di { id (locale), name, revenue }
  const [exPrItems, setExPrItems] = useState([]);
  const [saving, setSaving] = useState(false);

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
  });

  // NB: niente default "= []" inline: creerebbe un array nuovo ad ogni render
  // e l'effetto di inizializzazione (che dipende da attendances) resetterebbe
  // il form a ogni battitura/selezione.
  const { data: attendancesData } = useQuery({
    queryKey: ['attendances-by-event', event?.id],
    queryFn: () => fetchAll(base44.entities.EventAttendance, { event_id: event.id }, { sort: '-created_date' }),
    enabled: !!event?.id,
  });
  const attendances = attendancesData || EMPTY;

  const { data: venuesData } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list('sort_order'),
  });
  const venues = venuesData || EMPTY;

  useEffect(() => {
    if (!open) return;
    if (event) {
      setDate(event.date || '');
      setTotalRevenue(event.total_revenue ?? '');
      setNotes(event.notes || '');
      setSelectedVenue(event.venue || '');
      setCustomVenue(event.venue || '');
      setCustomEventName(event.name || '');
      setPhysicalLocation(event.physical_location || '');
      setIsExtra(event.is_extra || false);
      setTableThreshold(event.table_threshold ? String(event.table_threshold) : '300');

      const existingRev = {};
      const existingPresent = {};
      attendances
        .filter(a => a.event_id === event.id && a.promoter_id && !a.client_id)
        .forEach(a => {
          existingRev[a.promoter_id] = a.revenue ?? 0;
          existingPresent[a.promoter_id] = true;
        });
      setPromoterRevenues(existingRev);
      setPromoterPresent(existingPresent);

      // Carica voci ex PR esistenti
      const existingExPr = attendances
        .filter(a => a.event_id === event.id && !a.promoter_id && a.notes && a.notes.startsWith('__ex_pr__'))
        .map(a => ({
          id: a.id, // id reale del DB per aggiornamento
          name: a.notes.startsWith('__ex_pr__:') ? a.notes.slice('__ex_pr__:'.length) : '',
          revenue: a.revenue ?? 0,
        }));
      setExPrItems(existingExPr);
    } else {
      setDate('');
      setTotalRevenue('');
      setNotes('');
      setSelectedVenue('');
      setCustomVenue('');
      setCustomEventName('');
      setPhysicalLocation('');
      setIsExtra(false);
      setTableThreshold('300');
      setPromoterRevenues({});
      setPromoterPresent({});
      setExPrItems([]);
    }
  }, [event, open, attendancesData]);

  // Quando si cambia il locale su una nuova serata, pre-compila la soglia dal default
  useEffect(() => {
    if (event) return; // non sovrascrivere in modifica
    if (customVenue) setTableThreshold(getVenueDefaultThreshold(customVenue, venues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customVenue, venues]);

  const eventName = isExtra && customEventName ? customEventName : (customVenue || 'Serata');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || saving) return;
    setSaving(true);

    const eventData = {
      name: eventName,
      date,
      venue: customVenue,
      physical_location: physicalLocation || null,
      total_revenue: totalRevenue !== '' ? Number(totalRevenue) : 0,
      notes,
      is_extra: isExtra,
      table_threshold: Number(tableThreshold),
    };

    const mergedRevenues = {};
    const removedPresences = [];
    
    activePromoters.forEach(p => {
      const isPresent = !!promoterPresent[p.id];
      const rev = promoterRevenues[p.id];

      // Se in modifica, verifica se il promoter era presente prima
      if (event) {
        const hadPresence = attendances.find(a => a.event_id === event.id && a.promoter_id === p.id && !a.client_id);
        // Se aveva presenza ma ora è "No", aggiungi ai rimossi
        if (hadPresence && !isPresent) {
          removedPresences.push(p.id);
        }
      }

      // Salva SEMPRE il fatturato, indipendentemente da "Sì/No"
      // Includi anche il flag `present`
      if (rev !== '' && rev != null && !isNaN(rev)) {
        mergedRevenues[p.id] = { revenue: Number(rev), present: isPresent };
      }
    });

    try {
      await onSave(eventData, mergedRevenues, removedPresences, exPrItems);
    } finally {
      setSaving(false);
    }
  };

  const activePromoters = promoters.filter(p => p.status === 'attivo');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Modifica Serata' : 'Nuova Serata'}</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit} className="space-y-5">

          {/* Data */}
          <Div>
            <Label>Data *</Label>
            <SmartDateInput value={date} onChange={setDate} required />
          </Div>

          {/* Venue */}
          <Div>
            <Label>Locale *</Label>
            <Select value={customVenue} onValueChange={setCustomVenue}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona locale" />
              </SelectTrigger>
              <SelectContent>
                {venues.some(v => v.is_active) && (
                  <SelectItem value="__separator_attivi__" disabled className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">— Attivi —</SelectItem>
                )}
                {venues.filter(v => v.is_active).map(v => (
                  <SelectItem key={v.id} value={v.name}>{venueOptionLabel(v)}</SelectItem>
                ))}
                {venues.some(v => !v.is_active) && (
                  <SelectItem value="__separator_conclusi__" disabled className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">— Conclusi —</SelectItem>
                )}
                {venues.filter(v => !v.is_active).map(v => (
                  <SelectItem key={v.id} value={v.name}>{venueOptionLabel(v)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Div>

          {/* Location fisica (se diversa dal locale) */}
          <Div>
            <Label>Location fisica (se diversa dal locale)</Label>
            <Input
              value={physicalLocation}
              onChange={e => setPhysicalLocation(e.target.value)}
              placeholder="Stesso locale (default)"
              list="physical-locations"
            />
            <HtmlDatalist id="physical-locations">
              {venues.map(v => (
                <HtmlOption key={v.id} value={v.name} />
              ))}
              <HtmlOption value="Flava Beach" />
              <HtmlOption value="Lido Azzurro" />
              <HtmlOption value="Lido Mappatella" />
              <HtmlOption value="Lido Gallo" />
              <HtmlOption value="Lido Lo Scoglio" />
              <HtmlOption value="Lido Varca d'Oro" />
            </HtmlDatalist>
            <P className="text-xs text-muted-foreground mt-1">Se la serata si è svolta fisicamente in un'altra sede (es. Mantra al Flava Beach). Puoi scrivere qualsiasi nome.</P>
          </Div>

          {/* Extra checkbox */}
          <Div>
            <Label className="flex items-center gap-2">
              <HtmlInput
                type="checkbox"
                checked={isExtra}
                onChange={e => setIsExtra(e.target.checked)}
                className="rounded border-border"
              />
              <Span>Segna come serata Extra</Span>
            </Label>
            <P className="text-xs text-muted-foreground mt-1">Questa serata entrerà nella categoria "Extra" nelle classifiche</P>
          </Div>

          {/* Nome custom per serate extra */}
          {isExtra && (
            <Div>
              <Label>Nome locale (per serate extra)</Label>
              <Input
                value={customEventName}
                onChange={e => setCustomEventName(e.target.value)}
                placeholder="Es: Lido Adriatico, Discoteca Tropicana..."
              />
              <P className="text-xs text-muted-foreground mt-1">Inserisci il nome del locale dove si è svolto l'evento extra</P>
            </Div>
          )}

          {/* Soglia chiusura tavoli */}
          <Div>
            <Label>Soglia chiusura tavolo</Label>
            <Div className="flex items-center gap-2">
              <Span className="text-sm text-muted-foreground">€</Span>
              <Input
                type="number"
                min="1"
                value={tableThreshold}
                onChange={e => setTableThreshold(e.target.value)}
                className="w-28"
              />
            </Div>
            <P className="text-xs text-muted-foreground mt-1">Pre-compilata dal default del locale (modificabile)</P>
          </Div>



          {/* Fatturato totale */}
          <Div>
            <Label>Fatturato totale (€)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={totalRevenue}
              onChange={e => setTotalRevenue(e.target.value)}
              placeholder="0"
            />
          </Div>

          {/* Fatturati per promoter */}
          {activePromoters.length > 0 && (
            <Div>
              <Label className="mb-2 block">Presenze e fatturato per promoter</Label>
              <Div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {activePromoters.map(p => {
                  const isPresent = !!promoterPresent[p.id];
                  return (
                    <Div key={p.id} className="flex items-center gap-3 rounded-lg px-3 py-2 border border-border bg-card">
                      <Div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary overflow-hidden shrink-0">
                        {p.photo_url
                          ? <Img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                          : p.name?.charAt(0)?.toUpperCase()
                        }
                      </Div>
                      <Span className="text-sm flex-1 truncate">{p.name}</Span>
                      <Select value={isPresent ? 'si' : 'no'} onValueChange={(val) => setPromoterPresent(prev => ({ ...prev, [p.id]: val === 'si' }))}>
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sì</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="€ 0"
                        value={promoterRevenues[p.id] ?? ''}
                        onChange={e => setPromoterRevenues(prev => ({
                          ...prev,
                          [p.id]: e.target.value === '' ? '' : Number(e.target.value),
                        }))}
                        className="w-28 h-8 text-sm"
                      />
                    </Div>
                  );
                })}
              </Div>
            </Div>
          )}

          {/* Ex PR — voci fatturato promoter non registrati */}
          <Div>
            <Div className="flex items-center justify-between mb-2">
              <Label className="text-muted-foreground">Fatturato Ex PR (promoter non registrati)</Label>
              <Btn
                button
                onClick={() => setExPrItems(prev => [...prev, { id: null, name: '', revenue: 0 }])}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Aggiungi voce
              </Btn>
            </Div>
            {exPrItems.length === 0 ? (
              <P className="text-xs text-muted-foreground/60 italic">Nessuna voce ex PR — clicca "Aggiungi voce" per inserirne una</P>
            ) : (
              <Div className="space-y-2">
                {exPrItems.map((item, i) => (
                  <Div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-secondary/10 px-3 py-2">
                    <Div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-muted-foreground shrink-0">×</Div>
                    <Input
                      placeholder="Nome promoter"
                      value={item.name}
                      onChange={e => setExPrItems(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                      className="flex-1 h-8 text-sm text-muted-foreground"
                    />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="€ 0"
                      value={item.revenue}
                      onChange={e => setExPrItems(prev => prev.map((x, j) => j === i ? { ...x, revenue: e.target.value === '' ? 0 : Number(e.target.value) } : x))}
                      className="w-28 h-8 text-sm"
                    />
                    <Btn
                      button
                      onClick={() => setExPrItems(prev => prev.filter((_, j) => j !== i))}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Btn>
                  </Div>
                ))}
              </Div>
            )}
          </Div>

          {/* Note */}
          <Div>
            <Label>Note</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
          </Div>

          <Div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annulla</Button>
            <Button type="submit" disabled={!date || saving}>{saving ? 'Salvataggio…' : (event ? 'Salva' : 'Aggiungi')}</Button>
          </Div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}