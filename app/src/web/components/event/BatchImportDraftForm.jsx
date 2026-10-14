// Port di src/components/event/BatchImportDraftForm.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/ui/input';
import { Label } from '@/ui/misc';
import { Textarea } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/menu';
import { AlertCircle } from '@/ui/icons.generated';


import { Div, P } from '@/ui/html';
import { Form } from '@/ui/form';
import { HtmlDatalist, HtmlOption } from '@/ui/elements';


const DAY_NAMES = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

function venueOptionLabel(v) {
  if (v.is_extra) return v.name;
  const day = (v.day_of_week === null || v.day_of_week === undefined) ? '' : DAY_NAMES[v.day_of_week];
  const season = v.season_label ? v.season_label.toLowerCase() : '';
  if (day && season) return `${v.name} (${season} - ${day})`;
  if (season) return `${v.name} (${season})`;
  return v.name;
}

// Legge la soglia default per un locale direttamente dal locale stesso (fonte unica di verità,
// impostabile in Impostazioni App > Tavoli).
function getVenueDefaultThreshold(venueName, venues) {
  if (!venueName) return '300';
  const v = venues.find(x => x.name === venueName);
  return v?.default_threshold ? String(v.default_threshold) : '300';
}

export default function BatchImportDraftForm({ tab, onChange, venues = [] }) {
  useEffect(() => {
    if (tab.eventType) onChange({ tableThreshold: getVenueDefaultThreshold(tab.eventType, venues) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab.eventType, venues]);

  return (
    <Form className="space-y-5 pt-1">
      <Div>
        <Label>Data della serata *</Label>
        <Input type="date" value={tab.date} onChange={(e) => onChange({ date: e.target.value })} required />
      </Div>

      <Div>
        <Label>Locale *</Label>
        <Select value={tab.eventType} onValueChange={(v) => onChange({ eventType: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona locale..." />
          </SelectTrigger>
          <SelectContent>
            {venues.some(v => v.is_active) && (
              <SelectItem value="__sep_a__" disabled className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">— Attivi —</SelectItem>
            )}
            {venues.filter(v => v.is_active).map(v => (
              <SelectItem key={v.id} value={v.name}>{venueOptionLabel(v)}</SelectItem>
            ))}
            {venues.some(v => !v.is_active) && (
              <SelectItem value="__sep_c__" disabled className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">— Conclusi —</SelectItem>
            )}
            {venues.filter(v => !v.is_active).map(v => (
              <SelectItem key={v.id} value={v.name}>{venueOptionLabel(v)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Div>

      {tab.eventType === 'Extra - Festivi' && (
        <Div>
          <Label>Nome locale (per serate extra)</Label>
          <Input
            value={tab.eventName}
            onChange={e => onChange({ eventName: e.target.value })}
            placeholder="Es: Lido Adriatico, Discoteca Tropicana..."
          />
          <P className="text-xs text-muted-foreground mt-1">Inserisci il nome del locale dove si è svolto l'evento extra</P>
        </Div>
      )}

      <Div>
        <Label>Location fisica (se diversa dal locale)</Label>
        <Input
          value={tab.physicalLocation}
          onChange={e => onChange({ physicalLocation: e.target.value })}
          placeholder="Stesso locale (default)"
          list="batch-physical-locations"
        />
        <HtmlDatalist id="batch-physical-locations">
          <HtmlOption value="Flava Beach" />
          <HtmlOption value="Lido Azzurro" />
          <HtmlOption value="Lido Mappatella" />
          <HtmlOption value="Lido Gallo" />
          <HtmlOption value="Lido Lo Scoglio" />
          <HtmlOption value="Lido Varca d'Oro" />
          {venues.map(v => (
            <HtmlOption key={v.id} value={v.name} />
          ))}
        </HtmlDatalist>
        <P className="text-xs text-muted-foreground mt-1">Se la serata si è svolta fisicamente in un'altra sede</P>
      </Div>

      <Div>
        <Label>Soglia chiusura tavolo</Label>
        <Select value={tab.tableThreshold} onValueChange={(v) => onChange({ tableThreshold: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="120">€120</SelectItem>
            <SelectItem value="240">€240</SelectItem>
            <SelectItem value="300">€300</SelectItem>
            <SelectItem value="360">€360</SelectItem>
          </SelectContent>
        </Select>
        <P className="text-xs text-muted-foreground mt-1">Soglia per il calcolo dei tavoli chiusi</P>
      </Div>

      <Div>
        <Label>Nota (opzionale)</Label>
        <Textarea
          value={tab.notes}
          onChange={e => onChange({ notes: e.target.value })}
          placeholder="Es: serata piovosa, ospite speciale..."
          rows={2}
        />
      </Div>

      <Div>
        <Label>Incolla il testo con i fatturati *</Label>
        <Textarea
          value={tab.rawText}
          onChange={e => onChange({ rawText: e.target.value })}
          placeholder="Es: Marco 150€, Alessia 200€, ..."
          rows={14}
        />
        <P className="text-[10px] text-muted-foreground mt-1">L'IA estrarrà automaticamente nomi e importi</P>
      </Div>

      {tab.error && (
        <Div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <P className="text-sm text-destructive">{tab.error}</P>
        </Div>
      )}
    </Form>
  );
}