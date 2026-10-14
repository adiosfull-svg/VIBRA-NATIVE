// Port di src/components/promoter/PromoterFormDialog.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/misc';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/menu';
import { Textarea } from '@/ui/input';
import { base44 } from '@/lib/base44';
import { Camera, Loader2, RefreshCw, MapPin, ZoomIn, ZoomOut } from '@/ui/icons.generated';
import { Switch } from '@/ui/menu';
import { toast } from '@/ui/sonner';
import { useQuery } from '@tanstack/react-query';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Btn, Div, P, Span } from '@/ui/html';
import { Form } from '@/ui/form';
import { HtmlInput, HtmlLabel, Img } from '@/ui/elements';

const RUOLI = [
  { value: 'fondatore',        label: 'Fondatore (Admin)' },
  { value: 'super4',           label: 'Super 4' },
  { value: 'capogruppo',       label: 'Capogruppo' },
  { value: 'pr',               label: 'PR' },
  { value: 'ragazza_immagine', label: 'Ragazza Immagine' },
];

export default function PromoterFormDialog({ open, onOpenChange, promoter, onSave }) {
  useOverlay(open, () => onOpenChange?.(false));
  const [form, setForm] = useState({
    name: '', phone: '', instagram: '', instagram_followers: '', instagram_following: '',
    status: 'attivo', show_in_stats: true, notes: '', photo_url: '', neighborhood: '', city: '', province_area: '',
    ruolo: '', referente_id: '', promoter_from: '',
  });

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    enabled: open,
  });
  const [uploading, setUploading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [imgZoom, setImgZoom] = useState(1);
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const containerRef = useRef(null);

  const handleImgMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, px: imgPos.x, py: imgPos.y };
  };
  const handleImgMouseMove = useCallback((e) => {
    if (!dragging || !dragStart.current) return;
    setImgPos({
      x: dragStart.current.px + (e.clientX - dragStart.current.mx),
      y: dragStart.current.py + (e.clientY - dragStart.current.my),
    });
  }, [dragging]);
  const handleImgMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (promoter) {
      setImgZoom(promoter.photo_zoom || 1);
      setImgPos({ x: promoter.photo_offset_x || 0, y: promoter.photo_offset_y || 0 });
      setForm({
        name: promoter.name || '',
        phone: promoter.phone || '',
        instagram: promoter.instagram || '',
        instagram_followers: promoter.instagram_followers || '',
        instagram_following: promoter.instagram_following || '',
        status: promoter.status || 'attivo',
        show_in_stats: promoter.show_in_stats !== false,
        notes: promoter.notes || '',
        photo_url: promoter.photo_url || '',
        neighborhood: promoter.neighborhood || '',
        city: promoter.city || '',
        province_area: promoter.province_area || '',
        address: promoter.address || '',
        lat: promoter.lat || '',
        lng: promoter.lng || '',
        ruolo: promoter.ruolo || '',
        referente_id: promoter.referente_id || '',
        promoter_from: promoter.promoter_from || '',
      });
    } else {
      setImgZoom(1);
      setImgPos({ x: 0, y: 0 });
      setForm({ name: '', phone: '', instagram: '', instagram_followers: '', instagram_following: '', status: 'attivo', show_in_stats: true, notes: '', photo_url: '', neighborhood: '', city: '', province_area: '', address: '', lat: '', lng: '', ruolo: '', referente_id: '', promoter_from: '' });
    }
  }, [promoter, open]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setImgZoom(1);
    setImgPos({ x: 0, y: 0 });
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, photo_url: file_url }));
    setUploading(false);
  };





  const geocodeAddress = async (address, cityOverride) => {
    if (!address?.trim()) return;
    setGeocoding(true);
    try {
      // Usa la città del form se disponibile, altrimenti "Campania" come area generica
      const city = cityOverride || form.city?.trim() || '';
      const locationSuffix = city ? `, ${city}, Italia` : ', Campania, Italia';
      const query = encodeURIComponent(address + locationSuffix);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=it`);
      const data = await res.json();
      if (data && data[0]) {
        setForm(f => ({ ...f, lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }));
      }
    } catch {}
    setGeocoding(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form };
    if (data.instagram_followers === '' || data.instagram_followers === null) delete data.instagram_followers;
    else data.instagram_followers = Number(data.instagram_followers);
    if (data.instagram_following === '' || data.instagram_following === null) delete data.instagram_following;
    else data.instagram_following = Number(data.instagram_following);
    if (data.lat === '' || data.lat === null) delete data.lat;
    else data.lat = Number(data.lat);
    if (data.lng === '' || data.lng === null) delete data.lng;
    else data.lng = Number(data.lng);
    // Salva zoom e offset foto
    data.photo_zoom = imgZoom;
    data.photo_offset_x = imgPos.x;
    data.photo_offset_y = imgPos.y;
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-sm:max-h-[90vh] max-sm:overflow-y-auto max-sm:top-[5vh] max-sm:translate-y-0 max-sm:bottom-auto">
        <DialogHeader>
          <DialogTitle>{promoter ? 'Modifica Promoter' : 'Nuovo Promoter'}</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit} className="space-y-3">
          {/* Photo upload */}
          <Div className="flex items-center gap-4">
            <Div
              ref={containerRef}
              className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center overflow-hidden shrink-0 relative select-none"
              style={{ cursor: form.photo_url ? (dragging ? 'grabbing' : 'grab') : 'default' }}
              onMouseDown={form.photo_url ? handleImgMouseDown : undefined}
              onMouseMove={handleImgMouseMove}
              onMouseUp={handleImgMouseUp}
              onMouseLeave={handleImgMouseUp}
            >
              {form.photo_url ? (
                <Img
                  src={form.photo_url}
                  alt="foto"
                  style={{
                    position: 'absolute',
                    width: `${imgZoom * 100}%`,
                    height: `${imgZoom * 100}%`,
                    objectFit: 'cover',
                    left: `calc(50% + ${imgPos.x}px)`,
                    top: `calc(50% + ${imgPos.y}px)`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }} />
              ) : (
                <Span className="text-primary font-bold text-xl">{form.name?.charAt(0)?.toUpperCase() || '?'}</Span>
              )}
            </Div>
            <Div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground block">Foto profilo</Label>
              <HtmlLabel className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" asChild>
                  <Span>
                    {uploading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Camera className="w-3.5 h-3.5 mr-1.5" />}
                    {uploading ? 'Caricamento...' : 'Carica foto'}
                  </Span>
                </Button>
                <HtmlInput type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </HtmlLabel>
              {form.photo_url && (
                <Div className="flex items-center gap-1">
                  <Btn button onClick={() => setImgZoom(z => Math.max(0.5, z - 0.2))} className="p-1 rounded hover:bg-secondary/50 transition-colors">
                    <ZoomOut className="w-3.5 h-3.5 text-muted-foreground" />
                  </Btn>
                  <Span className="text-[10px] text-muted-foreground w-8 text-center">{Math.round(imgZoom * 100)}%</Span>
                  <Btn button onClick={() => setImgZoom(z => Math.min(3, z + 0.2))} className="p-1 rounded hover:bg-secondary/50 transition-colors">
                    <ZoomIn className="w-3.5 h-3.5 text-muted-foreground" />
                  </Btn>
                  <Span className="text-[10px] text-muted-foreground ml-1">Trascina per spostare</Span>
                </Div>
              )}
            </Div>
          </Div>

          <Div>
            <Label>Nome *</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </Div>

          <Div className="grid grid-cols-2 gap-2">
            <Div>
              <Label className="text-xs">Telefono</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </Div>
            <Div>
              <Label className="text-xs">Instagram (senza @)</Label>
              <Input
                value={form.instagram}
                placeholder="nomeutente"
                onChange={e => setForm({ ...form, instagram: e.target.value })}
              />
            </Div>
          </Div>

          {/* Instagram stats (input manuale) */}
          <Div className="grid grid-cols-2 gap-2">
            <Div>
              <Label className="text-xs">Follower</Label>
              <Input
                type="number"
                min="0"
                value={form.instagram_followers || ''}
                onChange={e => setForm({ ...form, instagram_followers: e.target.value ? Number(e.target.value) : '' })}
                placeholder="0"
              />
            </Div>
            <Div>
              <Label className="text-xs">Following</Label>
              <Input
                type="number"
                min="0"
                value={form.instagram_following || ''}
                onChange={e => setForm({ ...form, instagram_following: e.target.value ? Number(e.target.value) : '' })}
                placeholder="0"
              />
            </Div>
          </Div>

          {/* Zona geografica */}
          <Div className="rounded-lg bg-secondary/20 border border-border p-3 space-y-3">
            <P className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Zona di provenienza</P>
            <Div className="grid grid-cols-2 gap-3">
              <Div>
                <Label className="text-xs">Quartiere / Zona</Label>
                <Input
                  value={form.neighborhood}
                  onChange={e => setForm({ ...form, neighborhood: e.target.value })}
                  placeholder="es. Posillipo, Bagnoli..."
                />
              </Div>
              <Div>
                <Label className="text-xs">Città / Comune</Label>
                <Input
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value, lat: '', lng: '' })}
                  onBlur={e => { if (form.address?.trim()) geocodeAddress(form.address, e.target.value.trim()); }}
                  placeholder="es. Napoli, Pozzuoli..."
                />
              </Div>
            </Div>
            {/* Area calcolata automaticamente */}
            {(form.city || form.neighborhood) && (
              <Div className="text-[10px] text-muted-foreground italic">
                Area assegnata automaticamente dalla mappa in base a quartiere/città
              </Div>
            )}

            {/* Indirizzo preciso per il pin sulla mappa */}
            <Div>
              <Label className="text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Indirizzo (per pin preciso sulla mappa)
              </Label>
              <Div className="flex gap-2 items-center">
                <Input
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value, lat: '', lng: '' })}
                  onBlur={e => geocodeAddress(e.target.value)}
                  placeholder="es. Via Toledo 10, Napoli"
                  className="flex-1"
                />
                {geocoding && <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />}
                {!geocoding && form.lat && form.lng && (
                  <Span className="text-[10px] text-green-500 shrink-0">✓ Pin trovato</Span>
                )}
              </Div>
              <P className="text-[10px] text-muted-foreground mt-1">Lascia il campo vuoto per usare il centroide dell'area</P>
            </Div>
          </Div>

          {/* Ruolo e Referente */}
          <Div className="grid grid-cols-2 gap-2">
            <Div>
              <Label>Ruolo</Label>
              <Select value={form.ruolo || ''} onValueChange={v => setForm({ ...form, ruolo: v })}>
                <SelectTrigger><SelectValue placeholder="Seleziona ruolo" /></SelectTrigger>
                <SelectContent>
                  {RUOLI.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Div>
            <Div>
              <Label>Referente</Label>
              <Select value={form.referente_id || ''} onValueChange={v => setForm({ ...form, referente_id: v === '__none__' ? '' : v })}>
                <SelectTrigger><SelectValue placeholder="Nessun referente" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Nessun referente</SelectItem>
                  {promoters.filter(p => !promoter || p.id !== promoter?.id).sort((a, b) => a.name.localeCompare(b.name)).map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Div>
          </Div>

          <Div>
            <Label>Stato</Label>
            <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="attivo">Attivo</SelectItem>
                <SelectItem value="inattivo">Inattivo</SelectItem>
              </SelectContent>
            </Select>
          </Div>

          {form.status === 'inattivo' && (
            <Div className="flex items-center justify-between gap-3 rounded-lg bg-amber-500/10 border border-amber-500/25 px-3 py-2.5">
              <Div className="min-w-0">
                <P className="text-xs font-medium text-amber-200">Mostra nei grafici storici</P>
                <P className="text-[10px] text-amber-200/70 mt-0.5">Mantieni le statistiche di questo promoter visibili in tutti i grafici aziendali anche da inattivo.</P>
              </Div>
              <Switch
                checked={form.show_in_stats}
                onCheckedChange={v => setForm({ ...form, show_in_stats: v })}
                className="shrink-0"
              />
            </Div>
          )}
          <Div>
            <Label>Note</Label>
            <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
          </Div>
          <Div>
            <Label>Promoter dal</Label>
            <Input type="date" value={form.promoter_from} onChange={e => setForm({ ...form, promoter_from: e.target.value })} />
          </Div>
          <Div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annulla</Button>
            <Button type="submit" disabled={uploading}>{promoter ? 'Salva' : 'Aggiungi'}</Button>
          </Div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}