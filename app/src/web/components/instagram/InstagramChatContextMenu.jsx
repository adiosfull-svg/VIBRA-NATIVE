// Port di src/components/instagram/InstagramChatContextMenu.jsx (convertito da scripts/port/codemod.mjs).
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { ExternalLink, Ban, UserPlus, UserMinus, X, CalendarPlus, Sparkles, Plus, Eye, Clipboard } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';

import { doc as webDocument, nav as webNavigator, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput, Img } from '@/ui/elements';

export default function InstagramChatContextMenu({ position, conv, onClose, onOpenProfile, onIgnore, onAddToProspetto, onRemoveFromSemina, onShowCard, upcomingDates, onAddToPlan, onAddCustom, onPasteSeminaPhoto, onPasteClientPhoto, touchOpenedAt = 0 }) {
  const menuRef = useRef(null);
  const [adjustedPos, setAdjustedPos] = useState(position);
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDate, setCustomDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(null);
  const [pastingPhoto, setPastingPhoto] = useState(false);
  const [pastePhotoMsg, setPastePhotoMsg] = useState(null);

  // Delay di chiusura con animazione (come ClientSerateMenu): mantiene il backdrop
  // montato per 140ms così il click successivo viene intercettato dallo stopPropagation
  // e non passa all'elemento sottostante (es. riga conversazione).
  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      onClose();
    }, 140);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Guarded: ignora click nei primi 450ms dopo il long-press touch
  // (il browser emette un click spurio al rilascio del dito)
  const guarded = (fn) => () => {
    if (Date.now() - touchOpenedAt < 450) return;
    fn();
  };

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let x = position.x;
      let y = position.y;
      if (x + rect.width > webWindow.innerWidth) x = webWindow.innerWidth - rect.width - 8;
      if (y + rect.height > webWindow.innerHeight) y = webWindow.innerHeight - rect.height - 8;
      setAdjustedPos({ x: Math.max(8, x), y: Math.max(8, y) });
    }
  }, [position]);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    webDocument.addEventListener('keydown', handleEscape);
    return () => {
      webDocument.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const hasDates = upcomingDates && upcomingDates.length > 0 && onAddToPlan;
  const displayName = conv.senderUsername || conv.senderHandle || '';
  const isMatchedSemina = !!conv.matchedSeminaId;
  const isMatchedClient = !!conv.matchedClientId;
  const canPastePhoto = (isMatchedSemina && onPasteSeminaPhoto) || (isMatchedClient && onPasteClientPhoto);

  // Incolla foto profilo dagli appunti (immagine o URL) — aggiorna semina o cliente abbinato
  const handlePastePhoto = async () => {
    setPastingPhoto(true);
    setPastePhotoMsg(null);
    try {
      let imageBlob = null;
      if (webNavigator.clipboard && webNavigator.clipboard.read) {
        try {
          const items = await webNavigator.clipboard.read();
          for (const item of items) {
            const imageType = item.types.find(t => t.startsWith('image/'));
            if (imageType) { imageBlob = await item.getType(imageType); break; }
          }
        } catch { /* permesso negato o nessuna immagine → fallback URL */ }
      }
      if (imageBlob) {
        const ext = (imageBlob.type.split('/')[1] || 'png').replace('jpeg', 'jpg');
        const file = new File([imageBlob], `ig-profile.${ext}`, { type: imageBlob.type });
        const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
        if (isMatchedSemina) onPasteSeminaPhoto(conv.matchedSeminaId, file_url);
        else onPasteClientPhoto?.(conv.matchedClientId, file_url);
        setPastePhotoMsg({ type: 'success', text: 'Foto profilo aggiornata' });
        setPastingPhoto(false);
        setTimeout(() => handleClose(), 600);
        return;
      }
      const text = await webNavigator.clipboard.readText();
      if (!text || !text.trim()) {
        setPastePhotoMsg({ type: 'error', text: 'Appunti vuoti — copia un\u2019immagine o un URL' });
        setPastingPhoto(false);
        setTimeout(() => setPastePhotoMsg(null), 3000);
        return;
      }
      const url = text.trim();
      if (!/^https?:\/\/.+/i.test(url)) {
        setPastePhotoMsg({ type: 'error', text: 'Nessun URL negli appunti — copia il link di un\u2019immagine' });
        setPastingPhoto(false);
        setTimeout(() => setPastePhotoMsg(null), 3000);
        return;
      }
      if (isMatchedSemina) onPasteSeminaPhoto(conv.matchedSeminaId, url);
      else onPasteClientPhoto?.(conv.matchedClientId, url);
      setPastePhotoMsg({ type: 'success', text: 'Foto profilo aggiornata' });
      setPastingPhoto(false);
      setTimeout(() => handleClose(), 600);
    } catch (err) {
      setPastePhotoMsg({
        type: 'error',
        text: err?.name === 'NotAllowedError' ? 'Permesso appunti negato' : 'Impossibile leggere gli appunti',
      });
      setPastingPhoto(false);
      setTimeout(() => setPastePhotoMsg(null), 3000);
    }
  };

  const submitCustom = () => {
    if (!customName.trim() || !onAddCustom) return;
    onAddCustom(conv, customName, customDate);
    setCustomOpen(false);
    setCustomName('');
    handleClose();
  };

  return createPortal(
    <>
      <Btn
        className={`fixed inset-0 z-[10000] bg-black/30 ${closing ? 'backdrop-fade-out' : 'backdrop-fade-in'}`}
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => { e.preventDefault(); handleClose(); }}
        onClick={(e) => e.stopPropagation()} />
      <Btn
        ref={menuRef}
        style={{ position: 'fixed', top: adjustedPos.y, left: adjustedPos.x, zIndex: 10001, maxHeight: webWindow.innerHeight - adjustedPos.y - 8 }}
        className={`w-[248px] rounded-xl border border-white/10 bg-popover shadow-2xl overflow-y-auto overflow-x-hidden ${closing ? 'menu-pop-out' : 'menu-pop-in'}`}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <Div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-secondary/40">
          <P className="text-[11px] font-semibold text-foreground truncate">
            {displayName ? `Aggiungi ${displayName}` : 'Aggiungi a serata'}
          </P>
          <Btn
            button
            onClick={guarded(handleClose)}
            className="text-muted-foreground hover:text-foreground shrink-0">
            <X className="w-3.5 h-3.5" />
          </Btn>
        </Div>

        {/* Date list with venue logos */}
        {hasDates && (
          <Div className="max-h-36 overflow-y-auto recontact-scrollbar py-1">
            {upcomingDates.slice(0, 15).map(d => (
              <Div key={d.dateStr + (d.id || '')} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary/60 transition-colors">
                <Btn
                  button
                  onClick={guarded(() => { onAddToPlan(conv, d); handleClose(); })}
                  className="flex items-center gap-2 min-w-0 flex-1 text-left">
                  {d.logoUrl
                    ? <Img
                    src={d.logoUrl}
                    alt=""
                    className="w-4 h-4 rounded object-contain shrink-0 bg-secondary/40" />
                    : <CalendarPlus className="w-4 h-4 text-blue-400 shrink-0" />}
                  <Div className="min-w-0 flex-1">
                    <P className="text-xs font-medium truncate">{d.dayLabel}{d.venueName ? ` · ${d.venueName}` : ''}</P>
                    <P className="text-[10px] text-muted-foreground">{format(d.dateObj, 'd MMM yyyy', { locale: it })}</P>
                  </Div>
                </Btn>
              </Div>
            ))}
          </Div>
        )}

        {/* Crea nuova serata extra */}
        {onAddCustom && (
          <Div className="border-t border-border/40">
            {!customOpen ? (
              <Btn
                button
                onClick={guarded(() => setCustomOpen(true))}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-secondary/60 transition-colors text-amber-400">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <Span className="text-xs font-medium">Crea nuova serata extra</Span>
              </Btn>
            ) : (
              <Div className="px-3 py-2.5 space-y-2">
                <HtmlInput
                  autoFocus
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  placeholder="Nome serata (es. Capodanno)"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-secondary/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <HtmlInput
                  type="date"
                  value={customDate}
                  onChange={e => setCustomDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-secondary/40 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <Div className="flex gap-2">
                  <Btn
                    button
                    onClick={guarded(() => setCustomOpen(false))}
                    className="flex-1 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground">Annulla</Btn>
                  <Btn
                    button
                    onClick={guarded(submitCustom)}
                    disabled={!customName.trim()}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/90 text-black disabled:opacity-40 hover:bg-amber-500">
                    <Plus className="w-3 h-3" />Aggiungi
                  </Btn>
                </Div>
              </Div>
            )}
          </Div>
        )}

        {/* Other actions */}
        <Div className="border-t border-border/40">
          <Btn
            button
            onClick={guarded(() => { onOpenProfile(conv); handleClose(); })}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-secondary/60 transition-colors">
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            <Span className="text-xs font-medium">Apri Profilo</Span>
          </Btn>
          {isMatchedSemina && onShowCard && (
            <Btn
              button
              onClick={guarded(() => { onShowCard(conv); handleClose(); })}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-secondary/60 transition-colors">
              <Eye className="w-3.5 h-3.5 text-violet-400" />
              <Span className="text-xs font-medium">Mostra Card</Span>
            </Btn>
          )}
          {isMatchedSemina ? (
            <Btn
              button
              onClick={guarded(() => { onRemoveFromSemina?.(conv); handleClose(); })}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-red-400 hover:bg-red-500/10 transition-colors">
              <UserMinus className="w-3.5 h-3.5" />
              <Span className="text-xs font-medium">Rimuovi da Semina</Span>
            </Btn>
          ) : onAddToProspetto && (
            <Btn
              button
              onClick={guarded(() => { onAddToProspetto(conv); handleClose(); })}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-secondary/60 transition-colors">
              <UserPlus className="w-3.5 h-3.5 text-violet-400" />
              <Span className="text-xs font-medium">Aggiungi a Semine</Span>
            </Btn>
          )}
          {canPastePhoto && (
            <Div className="border-t border-border/40">
              {pastePhotoMsg ? (
                <Div className={`px-3 py-2.5 text-xs font-medium flex items-center gap-2 ${pastePhotoMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {pastePhotoMsg.type === 'success'
                    ? <Eye className="w-3.5 h-3.5 shrink-0" />
                    : <Ban className="w-3.5 h-3.5 shrink-0" />}
                  <Span className="truncate">{pastePhotoMsg.text}</Span>
                </Div>
              ) : (
                <Btn
                  button
                  onClick={guarded(handlePastePhoto)}
                  disabled={pastingPhoto}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-secondary/60 transition-colors disabled:opacity-50">
                  <Clipboard className="w-3.5 h-3.5 text-violet-400" />
                  <Span className="text-xs font-medium">{pastingPhoto ? 'Caricamento\u2026' : 'Incolla foto profilo'}</Span>
                </Btn>
              )}
            </Div>
          )}
          <Btn
            button
            onClick={guarded(() => { onIgnore(conv); handleClose(); })}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-red-400 hover:bg-red-500/10 transition-colors">
            <Ban className="w-3.5 h-3.5" />
            <Span className="text-xs font-medium">Ignora</Span>
          </Btn>
        </Div>
      </Btn>
    </>,
    webDocument.body
  );
}