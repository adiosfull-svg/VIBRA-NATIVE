// Port di src/components/programmazione/CaptureSeminaDialog.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - <div> gesture/eventi web rimossi: onPaste
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/misc';
import { Textarea } from '@/ui/input';
import { Instagram, Music2, Loader2, Plus, Image as ImageIcon, X } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useQueryClient } from '@tanstack/react-query';
import { parseIg, parseTikTok, extractNameFromHandle } from '@/legacy/utils/seminaParse';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Btn, Div, P, Span } from '@/ui/html';
import { Form } from '@/ui/form';
import { Img } from '@/ui/elements';

const STATUS_OPTIONS = [
  { value: 'nuovo', label: 'Nuovo' },
  { value: 'contattato', label: 'Contattato' },
  { value: 'interessato', label: 'Interessato' },
  { value: 'convertito', label: 'Convertito' },
];

/**
 * Cattura rapida di una Semina (prospect IG/TikTok non ancora cliente).
 * Supporta selettore piattaforma, campi TikTok, foto profilo incollabile
 * dagli appunti (Ctrl+V), status di avanzamento.
 *
 * Deep-link: apre il dialog precompilato con ?semina_ig=<url>&semina_name=<nome>.
 */
export default function CaptureSeminaDialog({ open, onOpenChange, promoterId, initial = {} }) {
  const qc = useQueryClient();
  useOverlay(open, () => onOpenChange?.(false));
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [igInput, setIgInput] = useState('');
  const [ttInput, setTtInput] = useState('');
  const [eta, setEta] = useState('');
  const [provenienza, setProvenienza] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('nuovo');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(initial.name || '');
      setIgInput(initial.url || '');
      setTtInput('');
      setPlatform(initial.url && /tiktok\.com/i.test(initial.url) ? 'tiktok' : 'instagram');
      setEta('');
      setProvenienza('');
      setNotes('');
      setStatus('nuovo');
      setPhotoUrl('');
      setError('');
    }
  }, [open, initial.name, initial.url]);

  // Auto-estrazione del nome dall'handle: se il nome è vuoto, lo deriva dal
  // nickname IG/TikTok (es. "angela.agnino_" → "Angela Agnino").
  useEffect(() => {
    if (!open) return;
    const input = platform === 'instagram' ? igInput : ttInput;
    if (!input.trim()) return;
    const parsed = platform === 'instagram' ? parseIg(input) : parseTikTok(input);
    if (parsed.handle && !name.trim()) {
      setName(extractNameFromHandle(parsed.handle));
    }
  }, [igInput, ttInput, platform, open, name]);

  const handlePhotoPaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        setUploadingPhoto(true);
        try {
          const { file_url } = await base44.integrations.Core.UploadFile({ file });
          setPhotoUrl(file_url);
        } catch (err) {
          setError('Errore upload foto: ' + (err?.message || ''));
        } finally {
          setUploadingPhoto(false);
        }
        return;
      }
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Inserisci un nome o nickname'); return; }
    const ig = platform === 'instagram' ? parseIg(igInput) : { handle: '', url: '' };
    const tt = platform === 'tiktok' ? parseTikTok(ttInput) : { handle: '', url: '' };
    setSaving(true);
    try {
      await base44.entities.Semina.create({
        name: name.trim(),
        platform,
        instagram: platform === 'instagram' ? (ig.handle || undefined) : undefined,
        instagram_profile_url: platform === 'instagram' ? (ig.url || undefined) : undefined,
        tiktok: platform === 'tiktok' ? (tt.handle || undefined) : undefined,
        tiktok_profile_url: platform === 'tiktok' ? (tt.url || undefined) : undefined,
        photo_url: photoUrl || undefined,
        eta: eta ? Number(eta) : undefined,
        provenienza: provenienza.trim() || undefined,
        notes: notes.trim() || undefined,
        status,
        promoter_id: promoterId,
      });
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || 'Errore nel salvataggio');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Span className="w-7 h-7 rounded-lg bg-pink-500/15 flex items-center justify-center">
              {platform === 'tiktok'
                ? <Music2 className="w-4 h-4 text-pink-400" />
                : <Instagram className="w-4 h-4 text-pink-400" />}
            </Span>
            Aggiungi Semina
          </DialogTitle>
        </DialogHeader>
        <Form onSubmit={submit} className="space-y-4">
          {/* Selettore piattaforma */}
          <Div>
            <Label>Piattaforma</Label>
            <Div className="grid grid-cols-2 gap-2">
              <Btn
                button
                onClick={() => setPlatform('instagram')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  platform === 'instagram'
                    ? 'border-pink-500/40 bg-pink-500/10 text-pink-400'
                    : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Instagram className="w-4 h-4" />Instagram
              </Btn>
              <Btn
                button
                onClick={() => setPlatform('tiktok')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  platform === 'tiktok'
                    ? 'border-pink-500/40 bg-pink-500/10 text-pink-400'
                    : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Music2 className="w-4 h-4" />TikTok
              </Btn>
            </Div>
          </Div>

          <Div>
            <Label>Nome / Nickname *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Es. Giulia o @giuliax" autoFocus required />
          </Div>

          {platform === 'instagram' ? (
            <Div>
              <Label>Profilo Instagram</Label>
              <Input value={igInput} onChange={e => setIgInput(e.target.value)} placeholder="@username o incolla il link del profilo/chat" />
              <P className="text-[11px] text-muted-foreground mt-1">Incolla il link della chat o del profilo: estraiamo l'username in automatico.</P>
            </Div>
          ) : (
            <Div>
              <Label>Profilo TikTok</Label>
              <Input value={ttInput} onChange={e => setTtInput(e.target.value)} placeholder="@username o incolla il link del profilo" />
              <P className="text-[11px] text-muted-foreground mt-1">Incolla il link del profilo TikTok: estraiamo l'username in automatico.</P>
            </Div>
          )}

          {/* Foto profilo — incollabile dagli appunti */}
          <Div>
            <Label>Foto profilo</Label>
            <Div
              className="relative flex items-center gap-3 p-3 rounded-lg border border-dashed border-border bg-secondary/20 cursor-text focus:outline-none focus:ring-1 focus:ring-pink-400">
              {photoUrl ? (
                <>
                  <Img src={photoUrl} alt="anteprima" className="w-12 h-12 rounded-full object-cover ring-1 ring-pink-500/30" />
                  <Div className="flex-1 min-w-0">
                    <P className="text-xs text-muted-foreground truncate">Foto caricata</P>
                    <P className="text-[10px] text-muted-foreground">Incolla una nuova immagine per sostituirla</P>
                  </Div>
                  <Btn
                    button
                    onClick={() => setPhotoUrl('')}
                    className="p-1 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Btn>
                </>
              ) : uploadingPhoto ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-pink-400" />
                  <P className="text-xs text-muted-foreground">Caricamento foto…</P>
                </>
              ) : (
                <>
                  <Div className="w-12 h-12 rounded-full bg-secondary/40 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </Div>
                  <Div className="flex-1 min-w-0">
                    <P className="text-xs text-foreground font-medium">Ctrl+V per incollare un'immagine</P>
                    <P className="text-[10px] text-muted-foreground">Copia la foto di profilo dal browser, poi incolla qui</P>
                  </Div>
                </>
              )}
            </Div>
          </Div>

          <Div className="grid grid-cols-2 gap-3">
            <Div>
              <Label>Età</Label>
              <Input type="number" min="0" max="120" value={eta} onChange={e => setEta(e.target.value)} placeholder="Es. 24" />
            </Div>
            <Div>
              <Label>Provenienza</Label>
              <Input value={provenienza} onChange={e => setProvenienza(e.target.value)} placeholder="Es. Napoli, Vomero" />
            </Div>
          </Div>

          <Div>
            <Label>Status</Label>
            <Div className="grid grid-cols-4 gap-1.5">
              {STATUS_OPTIONS.map(opt => (
                <Btn
                  button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                    status === opt.value
                      ? 'border-pink-500/40 bg-pink-500/10 text-pink-400'
                      : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </Btn>
              ))}
            </Div>
          </Div>

          <Div>
            <Label>Note</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Es. conosciuta via DM, da convincere per sabato…" />
          </Div>
          {error && <Div className="px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">{error}</Div>}
          <Div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Annulla</Button>
            <Button type="submit" disabled={saving} className="bg-pink-600 hover:bg-pink-500 text-white">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Salvo…</> : <><Plus className="w-4 h-4" />Aggiungi alla Semina</>}
            </Button>
          </Div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}