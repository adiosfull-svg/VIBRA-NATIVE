// Port di src/components/programmazione/SeminaPasteMenu.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import { Clipboard, Plus, Loader2, Check, AlertCircle } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useQueryClient } from '@tanstack/react-query';
import { parsePlatform } from '@/legacy/utils/seminaParse';
import { lockScroll } from '@/web/lib/scrollLock';

import { doc as webDocument, nav as webNavigator, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, Span } from '@/ui/html';

/**
 * Menu contestuale "Incolla / Crea nuova semina" per il box Semina Instagram.
 *
 * - Mobile: long-press (800ms) su un'area vuota del box → menu popup
 * - Desktop: tasto destro (contextmenu) su un'area vuota del box → menu popup
 *
 * "Incolla" legge gli appunti (navigator.clipboard.readText), riconosce
 * automaticamente se il contenuto è un URL Instagram o un nickname, e crea
 * la semina direttamente — senza aprire alcun popup.
 *
 * "Crea nuova semina" apre il dialog di cattura manuale (onOpenCapture).
 *
 * Il long-press su una card semina esistente (data-client-id) viene ignorato:
 * è gestito dal ClientSerateMenu globale.
 */
const LONG_PRESS_MS = 800;

export default function SeminaPasteMenu({ children, promoterId, onOpenCapture }) {
  const qc = useQueryClient();
  const [menu, setMenu] = useState(null); // { x, y }
  const [pasting, setPasting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type, msg }
  const longPressTimer = useRef(null);

  const showMenu = useCallback((x, y) => {
    const menuW = 224, menuH = 116;
    const px = Math.min(x, webWindow.innerWidth - menuW - 8);
    const py = Math.min(y, webWindow.innerHeight - menuH - 8);
    setMenu({ x: Math.max(8, px), y: Math.max(8, py) });
  }, []);

  const closeMenu = useCallback(() => {
    setMenu(null);
    setFeedback(null);
    setPasting(false);
  }, []);

  // Desktop: right-click — ignora card semine e controlli (gestiti dal menu card)
  const onContextMenu = useCallback((e) => {
    if (e.target.closest('[data-client-id], [data-semina], .semina-flip-container, button, a[href], input, textarea, select, [contenteditable], [role="button"]')) return;
    e.preventDefault();
    showMenu(e.clientX, e.clientY);
  }, [showMenu]);

  // Mobile: long-press — ignora card semine e controlli (gestiti dal menu card).
  // Approccio robusto: parent walk manuale + flag globale __seminaFlipActive.
  // composedPath()/closest() risultavano inaffidabili su Android (SVG, text nodes).
  const onTouchStart = useCallback((e) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
    if (e.touches.length !== 1) return;
    // Flag globale: il flip gesture della card ha ricevuto un pointerdown
    // (pointerdown fires BEFORE touchstart) → siamo su una card, skip.
    if (webWindow.__seminaFlipActive) return;
    // Parent walk manuale: cerca data-semina / data-client-id / controlli interattivi
    let el = e.target;
    while (el && el !== webDocument.body) {
      if (el.hasAttribute && (el.hasAttribute('data-semina') || el.hasAttribute('data-client-id'))) return;
      if (el.classList && el.classList.contains('semina-flip-container')) return;
      if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return;
      if (el.isContentEditable) return;
      if (el.getAttribute && el.getAttribute('role') === 'button') return;
      el = el.parentElement;
    }
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = null;
      if (webNavigator.vibrate) webNavigator.vibrate(15);
      showMenu(x, y);
    }, LONG_PRESS_MS);
  }, [showMenu]);

  const onTouchMove = useCallback(() => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
  }, []);

  useEffect(() => () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }, []);

  // Blocca scroll quando il menu è aperto (ref-counted)
  useEffect(() => {
    if (!menu) return;
    return lockScroll();
  }, [menu]);

  const doPaste = useCallback(async () => {
    setPasting(true);
    setFeedback(null);
    try {
      const text = await webNavigator.clipboard.readText();
      if (!text || !text.trim()) {
        setFeedback({ type: 'error', msg: 'Appunti vuoti' });
        setPasting(false);
        setTimeout(() => setFeedback(null), 2200);
        return;
      }
      const { platform, handle, profile_url, name } = parsePlatform(text);
      if (!handle) {
        setFeedback({ type: 'error', msg: 'Contenuto non riconosciuto' });
        setPasting(false);
        setTimeout(() => setFeedback(null), 2200);
        return;
      }
      await base44.entities.Semina.create({
        name: name || handle,
        platform,
        instagram: platform === 'instagram' ? handle : undefined,
        instagram_profile_url: platform === 'instagram' ? profile_url : undefined,
        tiktok: platform === 'tiktok' ? handle : undefined,
        tiktok_profile_url: platform === 'tiktok' ? profile_url : undefined,
        promoter_id: promoterId,
      });
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
      setFeedback({ type: 'success', msg: `Semina creata: @${handle}` });
      setPasting(false);
      setTimeout(() => closeMenu(), 1100);
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err?.name === 'NotAllowedError'
          ? 'Permesso appunti negato'
          : 'Impossibile leggere gli appunti',
      });
      setPasting(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  }, [promoterId, qc, closeMenu]);

  return (
    <>
      <Div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        style={{ touchAction: 'pan-y' }}>
        {children}
      </Div>
      {menu && createPortal(
        <>
          <Btn
            className="fixed inset-0 z-[10001] backdrop-fade-in"
            onClick={closeMenu}
            onTouchStart={(e) => { if (e.target === e.currentTarget) closeMenu(); }} />
          <Div
            className="fixed z-[10002] menu-pop-in"
            style={{ left: menu.x, top: menu.y, width: 224 }}
          >
            <Div className="rounded-xl border border-pink-500/30 bg-popover shadow-2xl overflow-hidden">
              {feedback ? (
                <Div className={`px-4 py-3.5 text-sm font-medium flex items-center gap-2 ${
                  feedback.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {feedback.type === 'success'
                    ? <Check className="w-4 h-4 shrink-0" />
                    : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <Span className="truncate">{feedback.msg}</Span>
                </Div>
              ) : (
                <>
                  <Btn
                    button
                    onClick={doPaste}
                    disabled={pasting}
                    className="w-full flex items-center gap-2.5 px-4 py-3.5 text-sm font-semibold text-left text-pink-400 hover:bg-pink-500/10 transition-colors disabled:opacity-50">
                    {pasting
                      ? <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      : <Clipboard className="w-4 h-4 shrink-0" />}
                    {pasting ? 'Creazione…' : 'Incolla'}
                  </Btn>
                  <Div className="h-px bg-border" />
                  <Btn
                    button
                    onClick={() => { closeMenu(); onOpenCapture?.(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3.5 text-sm font-semibold text-left text-foreground hover:bg-secondary/30 transition-colors">
                    <Plus className="w-4 h-4 shrink-0" />
                    Crea nuova semina
                  </Btn>
                </>
              )}
            </Div>
          </Div>
        </>,
        webDocument.body
      )}
    </>
  );
}