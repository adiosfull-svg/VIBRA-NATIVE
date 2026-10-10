// Port di src/components/programmazione/EditSeminaDialog.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - <div> gesture/eventi web rimossi: onPaste
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/misc';
import { Textarea } from '@/ui/input';
import { Instagram, Music2, Loader2, Save, Image as ImageIcon, X, Trash2, Power, Car, Sparkles } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useQueryClient } from '@tanstack/react-query';
import { parseIg, parseTikTok } from '@/legacy/utils/seminaParse';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Btn, Div, P, Span } from '@/ui/html';
import { Form } from '@/ui/form';
import { Img } from '@/ui/elements';

/**
 * Modifica di una Semina esistente: piattaforma, nome, profilo IG/TikTok,
 * foto profilo (incollabile), età, provenienza, note + campi AI estratti dai DM.
 */
export default function EditSeminaDialog({ open, onOpenChange, semina, promoterId }) {
  const qc = useQueryClient();
  useOverlay(open, () => onOpenChange?.(false));
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [igInput, setIgInput] = useState('');
  const [ttInput, setTtInput] = useState('');
  const [eta, setEta] = useState('');
  const [provenienza, setProvenienza] = useState('');
  const [notes, setNotes] = useState('');
  const [recettivita, setRecettivita] = useState(1);
  const [isOff, setIsOff] = useState(false);
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  // Campi AI estratti dai DM (modificabili manualmente per correzioni)
  const [aiZona, setAiZona] = useState('');
  const [aiUsualPromoter, setAiUsualPromoter] = useState('');
  const [aiVenuesAttended, setAiVenuesAttended] = useState('');
  const [aiInvitedEvents, setAiInvitedEvents] = useState('');
  const [aiWorkRole, setAiWorkRole] = useState('');
  const [aiWorkSchedule, setAiWorkSchedule] = useState('');
  const [aiWorkLocation, setAiWorkLocation] = useState('');
  const [aiStudyType, setAiStudyType] = useState('');
  const [aiStudySchool, setAiStudySchool] = useState('');
  const [aiStudyLocation, setAiStudyLocation] = useState('');
  const [aiIsDriver, setAiIsDriver] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiRecentSummary, setAiRecentSummary] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && semina) {
      const p = semina.platform || 'instagram';
      setPlatform(p);
      setName(semina.name || '');
      setIgInput(semina.instagram_profile_url || (semina.instagram ? `@${semina.instagram}` : ''));
      setTtInput(semina.tiktok_profile_url || (semina.tiktok ? `@${semina.tiktok}` : ''));
      // Auto-fill età e provenienza dai dati AI estratti dalla chat se non già impostati
      const aiEta = semina.ai_data?.eta;
      setEta(semina.eta > 0 ? String(semina.eta) : (aiEta > 0 ? String(aiEta) : ''));
      const aiZona = semina.ai_data?.zona;
      setProvenienza(semina.provenienza || aiZona || '');
      setNotes(semina.notes || '');
      setRecettivita(semina.recettivita || 1);
      setIsOff(!!semina.is_off);
      setPhone(semina.phone || '');
      setPhotoUrl(semina.photo_url || '');
      // Carica campi AI estratti dai DM
      const ai = semina.ai_data || {};
      setAiZona(ai.zona || '');
      setAiUsualPromoter(ai.usual_promoter || '');
      setAiVenuesAttended((ai.venues_attended || []).join(', '));
      setAiInvitedEvents((ai.invited_events || []).join(', '));
      setAiWorkRole(ai.work?.role || '');
      setAiWorkSchedule(ai.work?.schedule || '');
      setAiWorkLocation(ai.work?.location || '');
      setAiStudyType(ai.study?.type || '');
      setAiStudySchool(ai.study?.school || '');
      setAiStudyLocation(ai.study?.location || '');
      setAiIsDriver(!!ai.is_driver);
      setAiSummary(ai.summary || '');
      setAiRecentSummary(ai.recent_summary || '');
      setError('');
    }
  }, [open, semina]);

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
          const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
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
    const parseArr = (s) => s.split(',').map(x => x.trim()).filter(Boolean);
    // Costruisci ai_data preservando eventuali campi extra futuri
    const ai_data = {
      ...(semina.ai_data || {}),
      eta: eta ? Number(eta) : (semina.ai_data?.eta || 0),
      zona: aiZona.trim(),
      usual_promoter: aiUsualPromoter.trim(),
      venues_attended: parseArr(aiVenuesAttended),
      invited_events: parseArr(aiInvitedEvents),
      work: { role: aiWorkRole.trim(), schedule: aiWorkSchedule.trim(), location: aiWorkLocation.trim() },
      study: { type: aiStudyType.trim(), school: aiStudySchool.trim(), location: aiStudyLocation.trim() },
      is_driver: aiIsDriver,
      summary: aiSummary.trim(),
      recent_summary: aiRecentSummary.trim(),
    };
    setSaving(true);
    try {
      await base44.entities.Semina.update(semina.id, {
        name: name.trim(),
        platform,
        instagram: platform === 'instagram' ? (ig.handle || undefined) : undefined,
        instagram_profile_url: platform === 'instagram' ? (ig.url || undefined) : undefined,
        tiktok: platform === 'tiktok' ? (tt.handle || undefined) : undefined,
        tiktok_profile_url: platform === 'tiktok' ? (tt.url || undefined) : undefined,
        phone: phone.trim() || undefined,
        photo_url: photoUrl || undefined,
        eta: eta ? Number(eta) : undefined,
        provenienza: provenienza.trim() || undefined,
        notes: notes.trim() || undefined,
        recettivita,
        is_off: isOff,
        ai_data,
      });
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || 'Errore nel salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await base44.entities.Semina.delete(semina.id);
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || 'Errore nell\'eliminazione');
    } finally {
      setDeleting(false);
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
            Modifica Semina
          </DialogTitle>
        </DialogHeader>
        <Form onSubmit={submit} className="space-y-4">
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
            </Div>
          ) : (
            <Div>
              <Label>Profilo TikTok</Label>
              <Input value={ttInput} onChange={e => setTtInput(e.target.value)} placeholder="@username o incolla il link del profilo" />
            </Div>
          )}

          {/* WhatsApp */}
          <Div>
            <Label>WhatsApp / Telefono</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Es. 333 1234567 (per tasto destro → Contatta)" inputMode="tel" />
          </Div>

          {/* Foto profilo */}
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

          {/* ── Info da chat (estratte automaticamente dall'AI, modificabili) ── */}
          <Div className="space-y-3 p-3 rounded-lg border border-violet-500/20 bg-violet-500/5">
            <P className="text-xs font-semibold text-violet-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Info da chat Instagram (AI)
            </P>
            <P className="text-[10px] text-muted-foreground -mt-1">Estratte automaticamente dai DM. Correggi se l'AI ha sbagliato.</P>

            <Div>
              <Label className="text-[11px]">Zona / Provenienza (AI)</Label>
              <Input value={aiZona} onChange={e => setAiZona(e.target.value)} placeholder="Es. Vomero, Casalnuovo" className="text-sm" />
            </Div>

            <Div>
              <Label className="text-[11px]">Promoter abituale</Label>
              <Input value={aiUsualPromoter} onChange={e => setAiUsualPromoter(e.target.value)} placeholder="Es. Marco" className="text-sm" />
            </Div>

            <Div>
              <Label className="text-[11px]">Locali che frequenta</Label>
              <Input value={aiVenuesAttended} onChange={e => setAiVenuesAttended(e.target.value)} placeholder="Es. Venus, Toma (separati da virgola)" className="text-sm" />
            </Div>

            <Div>
              <Label className="text-[11px]">Invitata a (eventi)</Label>
              <Textarea value={aiInvitedEvents} onChange={e => setAiInvitedEvents(e.target.value)} rows={2} placeholder="Es. Mantra (ven 12 set), Toma (dom 14 set) — separati da virgola" className="text-sm" />
            </Div>

            <Div className="grid grid-cols-3 gap-2">
              <Div>
                <Label className="text-[11px]">Lavoro</Label>
                <Input value={aiWorkRole} onChange={e => setAiWorkRole(e.target.value)} placeholder="Es. commessa" className="text-sm" />
              </Div>
              <Div>
                <Label className="text-[11px]">Orari</Label>
                <Input value={aiWorkSchedule} onChange={e => setAiWorkSchedule(e.target.value)} placeholder="Es. weekend" className="text-sm" />
              </Div>
              <Div>
                <Label className="text-[11px]">Dove</Label>
                <Input value={aiWorkLocation} onChange={e => setAiWorkLocation(e.target.value)} placeholder="Es. centro" className="text-sm" />
              </Div>
            </Div>

            <Div className="grid grid-cols-3 gap-2">
              <Div>
                <Label className="text-[11px]">Studio (tipo)</Label>
                <Input value={aiStudyType} onChange={e => setAiStudyType(e.target.value)} placeholder="Es. università" className="text-sm" />
              </Div>
              <Div>
                <Label className="text-[11px]">Istituto</Label>
                <Input value={aiStudySchool} onChange={e => setAiStudySchool(e.target.value)} placeholder="Es. Federico II" className="text-sm" />
              </Div>
              <Div>
                <Label className="text-[11px]">Dove</Label>
                <Input value={aiStudyLocation} onChange={e => setAiStudyLocation(e.target.value)} placeholder="Es. Napoli" className="text-sm" />
              </Div>
            </Div>

            <Btn
              button
              onClick={() => setAiIsDriver(v => !v)}
              className={`w-full flex items-center justify-between gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                aiIsDriver
                  ? 'border-orange-500/40 bg-orange-500/10 text-orange-400'
                  : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Span className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Ha la macchina / guida
              </Span>
              <Span className="text-xs text-muted-foreground">{aiIsDriver ? 'Sì' : 'No'}</Span>
            </Btn>

            <Div>
              <Label className="text-[11px]">Riassunto (promemoria)</Label>
              <Textarea value={aiSummary} onChange={e => setAiSummary(e.target.value)} rows={3} placeholder="Riassunto generale della persona e della conversazione…" className="text-sm" />
            </Div>

            <Div>
              <Label className="text-[11px]">Ultimo scambio</Label>
              <Textarea value={aiRecentSummary} onChange={e => setAiRecentSummary(e.target.value)} rows={2} placeholder="Di cosa stavate parlando negli ultimi messaggi…" className="text-sm" />
            </Div>
          </Div>

          {/* Recettività */}
          <Div>
            <Label>Recettività</Label>
            <Div className="grid grid-cols-3 gap-1.5">
              {[
                { value: 1, emoji: '🌱', label: 'Da coltivare' },
                { value: 2, emoji: '🔥', label: 'Ottima empatia' },
                { value: 3, emoji: '⚡', label: 'Super recettiva' },
              ].map(opt => (
                <Btn
                  button
                  key={opt.value}
                  onClick={() => setRecettivita(opt.value)}
                  className={`flex flex-col items-center gap-0.5 py-2 rounded-lg border text-[10px] font-medium transition-colors ${
                    recettivita === opt.value
                      ? 'border-pink-500/40 bg-pink-500/10 text-pink-400'
                      : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Span className="text-base">{opt.emoji}</Span>
                  {opt.label}
                </Btn>
              ))}
            </Div>
          </Div>

          {/* Semina spenta/persa */}
          <Div>
            <Label>Stato semina</Label>
            <Btn
              button
              onClick={() => setIsOff(v => !v)}
              className={`w-full flex items-center justify-between gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                isOff
                  ? 'border-zinc-500/40 bg-zinc-500/10 text-zinc-400'
                  : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
              }`}
            >
              <Span className="flex items-center gap-2">
                <Power className="w-4 h-4" />
                {isOff ? 'Spenta / persa' : 'Attiva'}
              </Span>
              <Span className="text-xs text-muted-foreground">{isOff ? 'Tocca per riattivare' : 'Tocca per spegnere'}</Span>
            </Btn>
            {isOff && <P className="text-[11px] text-muted-foreground mt-1">Una semina spenta non appare nel tab Inviti del weekend.</P>}
          </Div>

          <Div>
            <Label>Note</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Es. conosciuta via DM, da convincere per sabato…" />
          </Div>
          {error && <Div className="px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">{error}</Div>}
          <Div className="flex justify-between gap-2">
            <Button type="button" variant="ghost" onClick={handleDelete} disabled={saving || deleting} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? 'Elimino…' : 'Elimina'}
            </Button>
            <Div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving || deleting}>Annulla</Button>
              <Button type="submit" disabled={saving || deleting} className="bg-pink-600 hover:bg-pink-500 text-white">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Salvo…</> : <><Save className="w-4 h-4" />Salva</>}
              </Button>
            </Div>
          </Div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}