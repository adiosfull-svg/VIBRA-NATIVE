// Port di src/components/impostazioni/SettingsMaterialeLocali.jsx (convertito da scripts/port/codemod.mjs).
import React, { useRef, useState } from 'react';
import { Map, Upload, X, FileText, Wine } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { uploadFile, bustAppSettingCache } from '@/web/hooks/useAppSetting';
import { base44 } from '@/lib/base44';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Btn, Div, P } from '@/ui/html';
import { HtmlInput, HtmlTextarea, Img } from '@/ui/elements';

function toVenueOption(v) {
  return { key: v.logo_key || v.name, label: v.is_extra ? 'Extra / Festivi' : v.name };
}

async function saveSetting(queryClient, key, value) {
  const existing = await base44.entities.AppSettings.filter({ key });
  if (existing.length > 0) {
    await base44.entities.AppSettings.update(existing[0].id, { value });
  } else {
    await base44.entities.AppSettings.create({ key, value });
  }
  queryClient.invalidateQueries({ queryKey: ['app-settings-materiale'] });
  queryClient.invalidateQueries({ queryKey: ['all-app-settings'] });
  bustAppSettingCache(key);
}

function PiantinaSetting({ venueKey, label, value, onSave }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    await onSave('venue_piantina_' + venueKey, url);
    setUploading(false);
  };

  return (
    <Div className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0">
      <Div className="w-10 h-10 rounded-lg bg-secondary/40 flex items-center justify-center overflow-hidden shrink-0">
        {value
          ? <Img src={value} alt={label} className="w-full h-full object-cover" />
          : <Map className="w-5 h-5 text-muted-foreground/40" />
        }
      </Div>
      <P className="text-xs font-medium flex-1">{label}</P>
      <Div className="flex gap-1.5 shrink-0">
        <Btn
          button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-[10px] px-2 py-1 rounded border border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 disabled:opacity-50">
          <Upload className="w-3 h-3" />
          {uploading ? '...' : value ? 'Cambia' : 'Carica'}
        </Btn>
        {value && (
          <Btn
            button
            onClick={() => onSave('venue_piantina_' + venueKey, '')}
            className="text-[10px] px-2 py-1 rounded border border-destructive/40 hover:bg-destructive/10 text-destructive transition-colors">
            <X className="w-3 h-3" />
          </Btn>
        )}
      </Div>
      <HtmlInput ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
    </Div>
  );
}

function FormuleSetting({ venueKey, label, value, onSave }) {
  const [local, setLocal] = useState(value || '');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => { setLocal(value || ''); }, [value]);

  const handleSave = async () => {
    setSaving(true);
    await onSave('venue_formule_' + venueKey, local);
    setSaving(false);
  };

  return (
    <Div className="py-3 border-b border-border/40 last:border-0 space-y-2">
      <P className="text-xs font-medium">{label}</P>
      <HtmlTextarea
        className="w-full h-24 p-2 text-sm bg-secondary/40 border border-border rounded-lg resize-none placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Inserisci qui le formule di entrata, i prezzi, le promozioni..."
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      />
      <Btn
        button
        onClick={handleSave}
        disabled={saving || local === (value || '')}
        className="text-[10px] px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
        {saving ? 'Salvataggio...' : 'Salva'}
      </Btn>
    </Div>
  );
}

export default function SettingsMaterialeLocali() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ['app-settings-materiale'],
    queryFn: () => base44.entities.AppSettings.list(),
    staleTime: 0,
  });

  const { data: venuesRaw = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list('sort_order'),
  });
  const VENUES = venuesRaw.map(toVenueOption);

  const getVal = (key) => settings.find(s => s.key === key)?.value || '';

  const handleSave = (key, value) => saveSetting(queryClient, key, value);

  return (
    <Div className="space-y-4">
      <Div className="rounded-xl border border-border bg-card overflow-hidden">
        <Div className="px-4 py-3 border-b border-border bg-secondary/20">
          <SectionHeader icon={Map} title="Piantine Locali" color="#4ade80" />
        </Div>
        <Div className="p-4">
          <P className="text-[11px] text-muted-foreground mb-3">Carica la mappa / piantina dei tavoli per ciascun locale.</P>
          {VENUES.map(v => (
            <PiantinaSetting
              key={v.key}
              venueKey={v.key}
              label={v.label}
              value={getVal('venue_piantina_' + v.key)}
              onSave={handleSave}
            />
          ))}
        </Div>
      </Div>

      <Div className="rounded-xl border border-border bg-card overflow-hidden">
        <Div className="px-4 py-3 border-b border-border bg-secondary/20">
          <SectionHeader icon={Wine} title="Listino Bottiglie" color="#a78bfa" />
        </Div>
        <Div className="p-4">
          <P className="text-[11px] text-muted-foreground mb-3">Carica il listino bottiglie per ciascun locale.</P>
          {VENUES.map(v => (
            <PiantinaSetting
              key={v.key}
              venueKey={v.key}
              label={v.label}
              value={getVal('venue_listino_' + v.key)}
              onSave={(_key, url) => handleSave('venue_listino_' + v.key, url)}
            />
          ))}
        </Div>
      </Div>

      <Div className="rounded-xl border border-border bg-card overflow-hidden">
        <Div className="px-4 py-3 border-b border-border bg-secondary/20">
          <SectionHeader icon={FileText} title="Formule di Entrata" color="#fb923c" />
        </Div>
        <Div className="p-4">
          <P className="text-[11px] text-muted-foreground mb-3">Inserisci prezzi, format e regole d'ingresso per ogni locale.</P>
          {VENUES.map(v => (
            <FormuleSetting
              key={v.key}
              venueKey={v.key}
              label={v.label}
              value={getVal('venue_formule_' + v.key)}
              onSave={handleSave}
            />
          ))}
        </Div>
      </Div>
    </Div>
  );
}
// riga di un elenco con last:border-0 sulla radice (ui/html, resolveLastVariant)
PiantinaSetting.cssLastChild = true;
FormuleSetting.cssLastChild = true;
