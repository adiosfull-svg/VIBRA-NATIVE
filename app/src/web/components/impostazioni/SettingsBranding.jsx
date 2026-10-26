// Port di src/components/impostazioni/SettingsBranding.jsx (convertito da scripts/port/codemod.mjs).
import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { Image, Upload, X } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { useAppSetting, uploadFile } from '@/web/hooks/useAppSetting';

import { Btn, Div, P } from '@/ui/html';
import { HtmlInput, Img } from '@/ui/elements';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function LogoSetting({ settingKey, label }) {
  const [url, setUrl] = useAppSetting(settingKey);
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    if (file.size > MAX_FILE_SIZE) {
      setError('Immagine troppo grande (max 5MB)');
      return;
    }
    try {
      const newUrl = await uploadFile(file);
      await setUrl(newUrl);
    } catch (err) {
      setError('Caricamento fallito, riprova');
    }
  };

  const handleRemove = async () => {
    await setUrl('');
  };

  return (
    <Div className="py-2.5 border-b border-border/40 last:border-0">
      <Div className="flex items-center gap-3">
        <Div className="w-10 h-10 rounded-lg bg-secondary/40 flex items-center justify-center overflow-hidden shrink-0">
          {url ? (
            <Img src={url} alt={label} className="w-full h-full object-contain p-0.5" />
          ) : (
            <Image className="w-5 h-5 text-muted-foreground/40" />
          )}
        </Div>
        <P className="text-xs font-medium flex-1">{label}</P>
        <Div className="flex gap-1.5 shrink-0">
          <Btn
            button
            onClick={() => inputRef.current?.click()}
            className="text-[10px] px-2 py-1 rounded border border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <Upload className="w-3 h-3" />
            {url ? 'Cambia' : 'Carica'}
          </Btn>
          {url && (
            <Btn
              button
              onClick={handleRemove}
              className="text-[10px] px-2 py-1 rounded border border-destructive/40 hover:bg-destructive/10 text-destructive transition-colors">
              <X className="w-3 h-3" />
            </Btn>
          )}
        </Div>
        <HtmlInput ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </Div>
      {error && <P className="text-[10px] text-destructive mt-1 ml-[52px]">{error}</P>}
    </Div>
  );
}

export default function SettingsBranding() {
  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list('sort_order'),
  });

  return (
    <Div className="rounded-xl border border-border bg-card overflow-hidden">
      <Div className="px-4 py-3 border-b border-border bg-secondary/20">
        <SectionHeader icon={Image} title="Branding & Loghi" color="#60a5fa" />
      </Div>
      <Div className="p-4 space-y-1">
        <P className="text-[11px] text-muted-foreground mb-3">Logo organizzazione e loghi dei locali usati nelle viste evento.</P>

        <Div className="mb-3">
          <P className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Logo Organizzazione</P>
          <LogoSetting settingKey="org_logo" label="Logo Vibra (sidebar)" />
        </Div>

        <Div>
          <P className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Loghi Locali</P>
          {venues.map(v => (
            <LogoSetting key={v.id} settingKey={`venue_logo_${v.logo_key || v.name}`} label={v.is_extra ? 'Extra / Festivi' : v.name} />
          ))}
        </Div>
      </Div>
    </Div>
  );
}
// riga di un elenco con last:border-0 sulla radice (ui/html, resolveLastVariant)
LogoSetting.cssLastChild = true;
