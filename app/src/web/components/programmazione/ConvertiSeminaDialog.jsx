// Port di src/components/programmazione/ConvertiSeminaDialog.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/misc';
import { Instagram, MapPin, Car, Star, Loader2, UserPlus, Sparkles } from '@/ui/icons.generated';
import CachedImage from '@/web/components/shared/CachedImage';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Div, P, Span } from '@/ui/html';

const initials = (n) => {
  if (!n) return '?';
  const parts = n.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Dialog tematico per convertire una Semina in Cliente.
 * Effetto aureo viola/oro dietro la foto (stile icone navbar mobile).
 * Pre-compila nome + trasferisce automaticamente Instagram, zona, guidatore,
 * e imposta leader = true (le semine sono futuri leader).
 */
export default function ConvertiSeminaDialog({ open, onOpenChange, semina, onConfirm, isLoading }) {
  useOverlay(open, () => onOpenChange?.(false));
  const [name, setName] = useState('');

  useEffect(() => {
    if (semina && open) setName(semina.name || '');
  }, [semina, open]);

  if (!semina) return null;

  const ai = semina.ai_data || {};
  const zona = semina.provenienza || ai.zona || '';
  const instagram = (semina.instagram || '').replace(/^@/, '');
  const isDriver = !!ai.is_driver;
  const photoUrl = semina.photo_url || '';
  const platform = semina.platform || 'instagram';
  const isTikTok = platform === 'tiktok';

  const handleConfirm = () => {
    if (!name.trim() || isLoading) return;
    onConfirm(name.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm overflow-y-auto overscroll-contain">
        <DialogHeader className="relative">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Converti in Cliente
          </DialogTitle>
        </DialogHeader>

        <Div className="relative space-y-4">
          {/* Foto semina con aurea dorata */}
          <Div className="flex flex-col items-center gap-1.5 pt-1">
            <Div
              className="relative w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-card"
              style={{
                boxShadow: '0 0 28px -2px rgba(167,139,250,0.55), 0 0 52px -4px rgba(196,181,253,0.35), 0 4px 14px rgba(0,0,0,0.3)',
                border: '2px solid rgba(167,139,250,0.5)',
              }}
            >
              {photoUrl
                ? <CachedImage src={photoUrl} alt={semina.name} className="w-full h-full object-cover" />
                : <Span className="text-2xl font-bold text-violet-300">{initials(semina.name)}</Span>}
            </Div>
            <P className="text-[11px] text-muted-foreground">Diventerà un nuovo cliente</P>
          </Div>

          {/* Nome cliente (modificabile) */}
          <Div>
            <Label>Nome cliente *</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome del cliente"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleConfirm(); } }}
            />
          </Div>

          {/* Dati trasferiti automaticamente */}
          <Div className="space-y-1.5">
            <P className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Dati trasferiti dalla semina</P>
            <Div className="flex flex-wrap gap-1.5">
              {instagram && (
                <Div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/25">
                  {isTikTok ? <Sparkles className="w-3.5 h-3.5 text-pink-400" /> : <Instagram className="w-3.5 h-3.5 text-pink-400" />}
                  <Span className="text-xs text-foreground">@{instagram}</Span>
                </Div>
              )}
              {zona && (
                <Div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <Span className="text-xs text-foreground">{zona}</Span>
                </Div>
              )}
              {isDriver && (
                <Div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25">
                  <Car className="w-3.5 h-3.5 text-orange-400" />
                  <Span className="text-xs text-foreground">Guidatore</Span>
                </Div>
              )}
              <Div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <Span className="text-xs text-foreground">Leader</Span>
              </Div>
            </Div>
            <P className="text-[10px] text-muted-foreground/70 pt-0.5">
              Leader attivato in automatico · Instagram, zona e guidatore copiati dalla semina
            </P>
          </Div>

          <Div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Annulla</Button>
            <Button type="button" onClick={handleConfirm} disabled={!name.trim() || isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {isLoading ? 'Conversione…' : 'Converti'}
            </Button>
          </Div>
        </Div>
      </DialogContent>
    </Dialog>
  );
}