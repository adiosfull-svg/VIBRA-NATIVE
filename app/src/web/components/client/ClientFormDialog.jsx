// Port di src/components/client/ClientFormDialog.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - <div> gesture/eventi web rimossi: onPaste (incolla foto con Ctrl+V; resta "Carica dal dispositivo")
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/misc';
import { Textarea } from '@/ui/input';
import { Switch } from '@/ui/menu';
import { Image as ImageIcon, Loader2, X, Sparkles } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import ClientSourceSelector from '@/web/components/client/ClientSourceDisplay';
import ClientLocationSelector from '@/web/components/client/ClientLocationSelector';
import ClientTipologiaSelector, { normalizeTipologia } from '@/web/components/client/ClientTipologiaSelector';
import ClientBirthDateEditor from '@/web/components/client/ClientBirthDateEditor';
import { parseIgHandle } from '@/legacy/utils/seminaParse';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Btn, Div, P, Span } from '@/ui/html';
import { Form } from '@/ui/form';
import { HtmlInput, Img } from '@/ui/elements';

export default function ClientFormDialog({ open, onOpenChange, client, onSave, isLoading, clients = [] }) {
  useOverlay(open, () => onOpenChange?.(false));
  const [form, setForm] = useState({ name: '', phone: '', instagram: '', photo_url: '', new_people_brought: '', is_leader: false, is_driver: false, notes: '', source_type: null, referred_by_client_id: null, residenza_key: null, tipologia_cliente: [], data_nascita: '' });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Clienti disponibili escludendo se stesso (per il dropdown "Tramite...")
  const availableClients = useMemo(() => clients.filter(c => c.id !== client?.id), [clients, client]);

  useEffect(() => {
    setError('');
    if (client) {
      setForm({
        name: client.name || '',
        phone: client.phone || '',
        instagram: client.instagram || '',
        photo_url: client.photo_url || '',
        new_people_brought: client.new_people_brought ?? '',
        is_leader: client.is_leader || false,
        is_driver: client.is_driver || false,
        notes: client.notes || '',
        source_type: client.source_type || null,
        referred_by_client_id: client.referred_by_client_id || null,
        residenza_key: client.residenza_key || null,
        tipologia_cliente: normalizeTipologia(client.tipologia_cliente),
        data_nascita: client.data_nascita || '',
      });
    } else {
      setForm({ name: '', phone: '', instagram: '', photo_url: '', new_people_brought: '', is_leader: false, is_driver: false, notes: '', source_type: null, referred_by_client_id: null, residenza_key: null, tipologia_cliente: [], data_nascita: '' });
    }
  }, [client, open]);

  const uploadPhoto = async (file) => {
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      setForm(f => ({ ...f, photo_url: file_url }));
    } catch (err) {
      setError('Errore upload foto: ' + (err?.message || ''));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoPaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) await uploadPhoto(file);
        return;
      }
    }
  };

  const handlePhotoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadPhoto(file);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError('Il nome del cliente è obbligatorio');
      return;
    }
    const data = { ...form };
    data.instagram = data.instagram ? parseIgHandle(data.instagram) : '';
    data.new_people_brought = data.new_people_brought === '' ? 0 : Number(data.new_people_brought);
    // Imposta leader_since quando il cliente diventa leader; azzusta quando smette
    if (data.is_leader && !client?.is_leader) {
      data.leader_since = new Date().toISOString();
    } else if (!data.is_leader && client?.is_leader) {
      data.leader_since = null;
    }
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent popup className="sm:max-w-md overflow-y-auto overscroll-contain">
        <DialogHeader className="relative">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            {client ? 'Modifica Cliente' : 'Nuovo Cliente'}
          </DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit} className="space-y-4 relative">
          {/* Foto profilo */}
          <Div>
            <Label>Foto profilo</Label>
            <Div
              className="relative flex items-center gap-3 p-3 rounded-lg border border-dashed border-border bg-secondary/20 cursor-text focus:outline-none focus:ring-1 focus:ring-violet-400">
              {form.photo_url ? (
                <>
                  <Img src={form.photo_url} alt="anteprima" className="w-12 h-12 rounded-full object-cover ring-1 ring-violet-500/30" />
                  <Div className="flex-1 min-w-0">
                    <P className="text-xs text-muted-foreground truncate">Foto caricata</P>
                    <P className="text-[10px] text-muted-foreground">Incolla una nuova immagine per sostituirla</P>
                  </Div>
                  <Btn
                    onClick={() => setForm({ ...form, photo_url: '' })}
                    className="p-1 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground">
                    <X className="w-3.5 h-3.5" />
                  </Btn>
                </>
              ) : uploadingPhoto ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                  <P className="text-xs text-muted-foreground">Caricamento foto…</P>
                </>
              ) : (
                <>
                  <Div className="w-12 h-12 rounded-full bg-secondary/40 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </Div>
                  <Div className="flex-1 min-w-0">
                    <P className="text-xs text-muted-foreground">Incolla una foto (Ctrl+V) o</P>
                    <Btn
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-violet-400 hover:text-violet-300 font-medium">
                      Carica dal dispositivo
                    </Btn>
                  </Div>
                </>
              )}
              <HtmlInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoFileChange}
                className="hidden"
              />
            </Div>
          </Div>

          <Div>
            <Label>Nome *</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </Div>
          <Div className="grid grid-cols-2 gap-3">
            <Div>
              <Label>Telefono</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </Div>
            <Div>
              <Label>Instagram</Label>
              <Input
                value={form.instagram}
                onChange={e => setForm({ ...form, instagram: e.target.value })}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData('text');
                  const parsed = parseIgHandle(pasted);
                  if (parsed && parsed !== pasted.trim()) {
                    e.preventDefault();
                    setForm(f => ({ ...f, instagram: parsed }));
                  }
                }}
                onBlur={() => {
                  const parsed = parseIgHandle(form.instagram.trim());
                  if (parsed && parsed !== form.instagram.trim()) {
                    setForm(f => ({ ...f, instagram: parsed }));
                  }
                }}
                placeholder="@username"
              />
            </Div>
          </Div>

          {/* Residenza / Zona geografica */}
          <Div>
            <Label className="mb-2 block">Zona di residenza</Label>
            <ClientLocationSelector
              value={form.residenza_key}
              onChange={(key) => setForm({ ...form, residenza_key: key })}
            />
          </Div>

          {/* Fonte / Canale di acquisizione */}
          <Div className="pt-1">
            <Label className="mb-2 block">Dove l'hai conosciuto?</Label>
            <ClientSourceSelector
              value={form.source_type}
              referredClientId={form.referred_by_client_id}
              clients={availableClients}
              onChange={({ sourceType, referredClientId }) =>
                setForm({ ...form, source_type: sourceType, referred_by_client_id: referredClientId })
              }
            />
          </Div>

          <Div>
            <Label>Persone nuove portate</Label>
            <Input
              type="number"
              min="0"
              value={form.new_people_brought}
              onChange={e => setForm({ ...form, new_people_brought: e.target.value })}
              placeholder="0"
            />
          </Div>

          {/* Leader + Guidatore — stessa riga */}
          <Div className="flex gap-2">
            <Div className="flex-1 flex items-center justify-between rounded-lg border border-border px-3 py-2.5 bg-secondary/10">
              <Div className="flex items-center gap-2">
                <Span className="text-yellow-400 text-base">⭐</Span>
                <Label className="text-sm font-medium cursor-pointer">Leader</Label>
              </Div>
              <Switch
                checked={form.is_leader}
                onCheckedChange={v => setForm({ ...form, is_leader: v })}
              />
            </Div>
            <Div className="flex-1 flex items-center justify-between rounded-lg border border-border px-3 py-2.5 bg-secondary/10">
              <Div className="flex items-center gap-2">
                <Span className="text-base">🚗</Span>
                <Label className="text-sm font-medium cursor-pointer">Guidatore</Label>
              </Div>
              <Switch
                checked={form.is_driver}
                onCheckedChange={v => setForm({ ...form, is_driver: v })}
              />
            </Div>
          </Div>

          {/* Tipologia caratteriale */}
          <Div>
            <Label className="mb-2 block">Tipologia</Label>
            <ClientTipologiaSelector
              value={form.tipologia_cliente}
              onChange={(v) => setForm({ ...form, tipologia_cliente: v })}
            />
          </Div>

          {/* Data di nascita / Età */}
          <Div>
            <Label className="mb-2 block">Data di nascita</Label>
            <ClientBirthDateEditor
              value={form.data_nascita}
              onChange={(v) => setForm({ ...form, data_nascita: v })}
            />
          </Div>

          <Div>
            <Label>Note</Label>
            <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
          </Div>
          {error && <Div className="px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">{error}</Div>}
          <Div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Annulla</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvataggio...' : (client ? 'Salva' : 'Aggiungi')}</Button>
          </Div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}