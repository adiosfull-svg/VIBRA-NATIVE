// Port di src/components/ilmiovibra/MaterialeLocaliSection.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo, useEffect } from 'react';
import { Map as MapIcon, FileText, ChevronDown, Expand, Wine, Image as ImageIcon, Download, Share2, Copy, Check } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useQuery } from '@tanstack/react-query';
import PiantinaFullscreen from '@/web/components/ilmiovibra/PiantinaFullscreen';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { shareText } from '@/legacy/utils/downloadMaterials';

import { doc as webDocument, nav as webNavigator, url as webURL, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

const SECTION_COLOR = '#4ade80';

// Scarica un'immagine come file (forza il download invece di aprirla nel browser).
async function downloadImage(url, name) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const ext = (blob.type.split('/')[1] || 'png').replace('jpeg', 'jpg');
    const objUrl = webURL.createObjectURL(blob);
    const a = webDocument.createElement('a');
    a.href = objUrl;
    a.download = `${name}.${ext}`;
    webDocument.body.appendChild(a);
    a.click();
    a.remove();
    webURL.revokeObjectURL(objUrl);
  } catch (e) {
    webWindow.open(url, '_blank');
  }
}

// Condivide l'immagine verso altre app (WhatsApp, Telegram...) via Web Share API.
// Se il device non supporta la condivisione di file, apre l'immagine in una nuova scheda.
async function shareImage(url, name) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const ext = (blob.type.split('/')[1] || 'png').replace('jpeg', 'jpg');
    const file = new File([blob], `${name}.${ext}`, { type: blob.type });
    if (webNavigator.canShare && webNavigator.canShare({ files: [file] })) {
      await webNavigator.share({ files: [file], title: name });
    } else if (webNavigator.share) {
      await webNavigator.share({ title: name, url });
    } else {
      webWindow.open(url, '_blank');
    }
  } catch (e) { /* utente ha annullato */ }
}

function ImageActions({ src, name, onFullscreen }) {
  const btn = "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all active:scale-95";
  return (
    <Div className="flex items-center gap-1.5 flex-wrap justify-end">
      <Btn
        button
        onClick={onFullscreen}
        className={`${btn} bg-primary/15 text-primary hover:bg-primary/25`}>
        <Expand className="w-3.5 h-3.5" /> Espandi
      </Btn>
      <Btn
        button
        onClick={() => downloadImage(src, name)}
        className={`${btn} bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25`}>
        <Download className="w-3.5 h-3.5" /> Scarica
      </Btn>
      <Btn
        button
        onClick={() => shareImage(src, name)}
        className={`${btn} bg-sky-500/15 text-sky-400 hover:bg-sky-500/25`}>
        <Share2 className="w-3.5 h-3.5" /> Condividi
      </Btn>
    </Div>
  );
}

function toVenueOption(v) {
  return { key: v.logo_key || v.name, label: v.is_extra ? 'Extra / Festivi' : v.name };
}

function VenueRow({ label, piantina, listino, formule, onFullscreen }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!piantina && !listino && !formule) return null;

  const copyFormule = async () => {
    try {
      await webNavigator.clipboard.writeText(formule);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) { /* clipboard non disponibile */ }
  };

  return (
    <Div className="border-b border-white/[0.05] last:border-0">
      <Btn
        button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-2 py-2.5 hover:bg-secondary/20 rounded-lg transition-colors text-left">
        <Span className="text-sm font-semibold">{label}</Span>
        <Div className="flex items-center gap-1.5">
          {piantina && <Span className="p-1 rounded-md bg-emerald-500/15"><MapIcon className="w-3.5 h-3.5 text-emerald-400" /></Span>}
          {listino && <Span className="p-1 rounded-md bg-purple-500/15"><Wine className="w-3.5 h-3.5 text-purple-400" /></Span>}
          {formule && <Span className="p-1 rounded-md bg-orange-500/15"><FileText className="w-3.5 h-3.5 text-orange-400" /></Span>}
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </Div>
      </Btn>
      {open && (
        <Div className="px-2 pb-3 space-y-3">
          {/* Piantina + Listino affiancati */}
          {(piantina || listino) && (
            <Div className={`grid gap-2 ${piantina && listino ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {piantina && (
                <Div>
                  <Div className="flex items-center justify-between gap-2 mb-2">
                    <Div className="flex items-center gap-1.5">
                      <Span className="p-1 rounded-md bg-emerald-500/15"><MapIcon className="w-3.5 h-3.5 text-emerald-400" /></Span>
                      <P className="text-[11px] font-semibold text-emerald-400">Piantina</P>
                    </Div>
                    <ImageActions src={piantina} name={label + ' - Piantina'} onFullscreen={() => onFullscreen(piantina, label + ' — Piantina')} />
                  </Div>
                  <Img
                    src={piantina}
                    alt="Piantina"
                    onClick={() => onFullscreen(piantina, label + ' — Piantina')}
                    className="w-full max-h-56 object-contain rounded-lg border border-border cursor-pointer active:opacity-80 transition-opacity" />
                </Div>
              )}
              {listino && (
                <Div>
                  <Div className="flex items-center justify-between gap-2 mb-2">
                    <Div className="flex items-center gap-1.5">
                      <Span className="p-1 rounded-md bg-purple-500/15"><Wine className="w-3.5 h-3.5 text-purple-400" /></Span>
                      <P className="text-[11px] font-semibold text-purple-400">Listino</P>
                    </Div>
                    <ImageActions src={listino} name={label + ' - Listino'} onFullscreen={() => onFullscreen(listino, label + ' — Listino')} />
                  </Div>
                  <Img
                    src={listino}
                    alt="Listino"
                    onClick={() => onFullscreen(listino, label + ' — Listino')}
                    className="w-full max-h-56 object-contain rounded-lg border border-border cursor-pointer active:opacity-80 transition-opacity" />
                </Div>
              )}
            </Div>
          )}
          {formule && (
            <Div>
              <Div className="flex items-center justify-between gap-2 mb-2">
                <Div className="flex items-center gap-1.5">
                  <Span className="p-1 rounded-md bg-orange-500/15"><FileText className="w-3.5 h-3.5 text-orange-400" /></Span>
                  <P className="text-[11px] font-semibold text-orange-400">Formule di Entrata</P>
                </Div>
                <Div className="flex items-center gap-1.5">
                  <Btn
                    button
                    onClick={copyFormule}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-orange-500/15 text-orange-400 hover:bg-orange-500/25 transition-all active:scale-95">
                    {copied ? <><Check className="w-3.5 h-3.5" /> Copiato</> : <><Copy className="w-3.5 h-3.5" /> Copia</>}
                  </Btn>
                  <Btn
                    button
                    onClick={() => shareText(formule, `${label} — Formule di Entrata`)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-sky-500/15 text-sky-400 hover:bg-sky-500/25 transition-all active:scale-95">
                    <Share2 className="w-3.5 h-3.5" /> Condividi
                  </Btn>
                </Div>
              </Div>
              <P className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed bg-secondary/30 rounded-lg p-2.5">
                {formule}
              </P>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}

export default function MaterialeLocaliSection() {
  const [fullscreen, setFullscreen] = useState(null); // { src, label }

  const { data: settings = [] } = useQuery({
    queryKey: ['app-settings-materiale'],
    queryFn: () => base44.entities.AppSettings.list(),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { data: venuesRaw = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list('sort_order'),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // ── Lookup O(1): settings → Map (una sola passata, stabile al re-render) ──
  const settingsMap = useMemo(() => new Map(settings.map(s => [s.key, s.value || ''])), [settings]);

  // ── Dati venue pre-aggregati in un'unica passata memoizzata ──
  // Invece di chiamare getVal (find lineare) 3× per venue ad ogni render,
  // costruisco una volta per tutte l'array di righe con materiali già risolti.
  const venueRows = useMemo(() => {
    return venuesRaw
      .map(toVenueOption)
      .map(v => ({
        key: v.key,
        label: v.label,
        piantina: settingsMap.get('venue_piantina_' + v.key) || '',
        listino: settingsMap.get('venue_listino_' + v.key) || '',
        formule: settingsMap.get('venue_formule_' + v.key) || '',
      }))
      .filter(v => v.piantina || v.listino || v.formule);
  }, [venuesRaw, settingsMap]);

  // Precarica subito piantine e listini nella cache del browser (Image() in background),
  // così quando l'utente espande un locale l'immagine è già pronta senza esitazioni.
  useEffect(() => {
    venueRows.forEach(v => {
      [v.piantina, v.listino].forEach(url => {
        if (!url) return;
        const img = new Image();
        img.src = url;
      });
    });
  }, [venueRows]);

  const hasAny = venueRows.length > 0;

  // Non mostrare nulla finché i settings non sono caricati (settings.length === 0 = loading)
  if (settings.length > 0 && !hasAny) return null;

  return (
    <>
      {fullscreen && (
        <PiantinaFullscreen
          src={fullscreen.src}
          label={fullscreen.label}
          onClose={() => setFullscreen(null)}
        />
      )}

      <Div
        className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06]"
        style={{ boxShadow: `0 4px 24px -6px ${SECTION_COLOR}14` }}
      >
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
          style={{ background: `linear-gradient(90deg, transparent, ${SECTION_COLOR}, transparent)` }} />
        <Div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-secondary/15">
          <SectionHeader
            icon={MapIcon}
            title="Materiale Locali"
            color={SECTION_COLOR}
          />
          <Span className="text-[10px] text-muted-foreground ml-auto">piantine · listini · formule</Span>
        </Div>
        <Div className="p-3">
          {venueRows.map(v => (
            <VenueRow
              key={v.key}
              label={v.label}
              piantina={v.piantina}
              listino={v.listino}
              formule={v.formule}
              onFullscreen={(src, lbl) => setFullscreen({ src, label: lbl })}
            />
          ))}
          {settings.length === 0 && (
            <Div className="flex items-center justify-center gap-2 py-4">
              <Div className="w-4 h-4 border-2 border-emerald-400/40 border-t-emerald-400 rounded-full animate-spin" />
              <P className="text-[10px] text-muted-foreground italic">Caricamento materiale...</P>
            </Div>
          )}
          {settings.length > 0 && venueRows.length === 0 && (
            <Div className="flex items-center justify-center gap-2 py-4">
              <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
              <P className="text-[10px] text-muted-foreground/60 italic">Nessun materiale caricato</P>
            </Div>
          )}
        </Div>
      </Div>
    </>
  );
}