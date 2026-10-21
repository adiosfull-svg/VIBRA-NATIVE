// Port di src/components/promoter/PromoterContextMenu.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import { useNavigate } from '@/web/router';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Copy, Instagram, BarChart3, Info, CalendarDays, X } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import PromoterQuickInfoPopup from './PromoterQuickInfoPopup';
import PromoterLastEventsPopup from './PromoterLastEventsPopup';
import { wasRecentScroll } from '@/web/lib/scrollGuard';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { doc as webDocument, nav as webNavigator, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { Path, Svg } from '@/ui/elements';

function WhatsAppIcon({ className = '' }) {
  return (
    <Svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <Path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.057zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </Svg>
  );
}

/**
 * Menu contestuale globale per i promoter — funziona come quello dei clienti
 * (ClientSerateMenu): tasto destro su desktop, pressione prolungata su mobile,
 * su qualsiasi elemento con [data-promoter-id]. Attivo ovunque nell'app perché
 * renderizzato nell'AppLayout. Funzioni di prova: vai al dettaglio, contatta
 * (WhatsApp), copia telefono, apri Instagram, attiva/disattiva (solo admin).
 */
export default function PromoterContextMenu() {
  const navigate = useNavigate();

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 20 * 60000,
    gcTime: 25 * 60000,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const [menu, setMenu] = useState(null); // { promoter: { id, name, live }, x, y }
  const [closing, setClosing] = useState(false);
  const [subView, setSubView] = useState(null); // null | 'quickInfo' | 'lastEvents'
  const closeTimer = useRef(null);

  const closeMenu = () => {
    if (closing || !menu) return;
    setSubView(null);
    setClosing(true);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => { setMenu(null); setClosing(false); }, 140);
  };
  // Chiude tutto (menu base + submenu) — usato dal tap esterno sui submenu.
  const closeAll = () => { setSubView(null); closeMenu(); };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Back button gestito dallo stack centralizzato (OverlayStackContext):
  // menu base e submenu sono due overlay separati, così il primo back
  // chiude il submenu e il secondo chiude il menu base.
  useOverlay(menu !== null, () => closeMenu());
  useOverlay(subView !== null, () => setSubView(null));

  const openMenu = (el, x, y) => {
    const id = el.getAttribute('data-promoter-id');
    if (!id) return;
    const name = el.getAttribute('data-promoter-name') || '';
    const live = promoters.find(p => p.id === id);
    setMenu({ promoter: { id, name, live }, x, y });
  };

  const goDetail = () => { navigate(`/promoter/${menu.promoter.id}`); closeMenu(); };
  const confronta = () => { navigate(`/promoter?tab=compare`); closeMenu(); };
  // Apre un submenu (info rapide / ultime serate) mantenendo il menu base in
  // state: il primo back torna al menu base, il secondo chiude tutto.
  const openQuickInfo = () => { setSubView('quickInfo'); };
  const openLastEvents = () => { setSubView('lastEvents'); };
  const contatta = () => {
    const phone = (menu.promoter.live?.phone || '').replace(/[^\d]/g, '');
    if (phone) webWindow.open(`https://wa.me/${phone}`, '_blank');
    closeMenu();
  };
  const copyPhone = async () => {
    const phone = menu.promoter.live?.phone || '';
    if (phone) { try { await webNavigator.clipboard.writeText(phone); } catch {} }
    closeMenu();
  };
  const openIg = () => {
    const h = menu.promoter.live?.instagram;
    if (h) webWindow.open(`https://instagram.com/${h}`, '_blank');
    closeMenu();
  };
  // Listener globali: contextmenu (desktop) + long-press (mobile), come ClientSerateMenu.
  const touchOpenedRef = useRef(0);
  const menuOpenRef = useRef(false);
  menuOpenRef.current = menu !== null && !closing;
  useEffect(() => {
    let timer = null;
    let startX = 0, startY = 0;
    const clear = () => { if (timer) { clearTimeout(timer); timer = null; } };
    const onCtx = (e) => {
      const el = e.target.closest && e.target.closest('[data-promoter-id]');
      if (!el) return;
      e.preventDefault();
      if (Date.now() - touchOpenedRef.current < 800) return;
      openMenu(el, e.clientX, e.clientY);
    };
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      const el = t.target.closest && t.target.closest('[data-promoter-id]');
      if (!el) return;
      if (wasRecentScroll(300)) return;
      startX = t.clientX; startY = t.clientY;
      clear();
      // PORT: vibrazione all'apertura col dito, come un menu di sistema (ui/haptics)
      timer = setTimeout(() => { timer = null; touchOpenedRef.current = Date.now(); webNavigator.vibrate?.(15); openMenu(el, startX, startY); }, 500);
    };
    const onTouchMove = (e) => {
      if (!timer) return;
      const t = e.touches[0];
      if (Math.abs(t.clientX - startX) > 10 || Math.abs(t.clientY - startY) > 10) clear();
    };
    const onClickGuard = (e) => {
      // PORT: sul telefono il Pressable della card esegue il click al rilascio anche dopo una pressione
      // lunga qualunque (il browser no): finché il menu aperto dal dito è a schermo il click si ferma.
      if (Date.now() - touchOpenedRef.current > 600 && !menuOpenRef.current) return;
      if (e.target.closest && e.target.closest('[data-promoter-id]')) {
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      }
    };
    const onScroll = () => { if (timer) clear(); };
    webWindow.addEventListener('scroll', onScroll, { passive: true, capture: true });
    webDocument.addEventListener('contextmenu', onCtx);
    webDocument.addEventListener('touchstart', onTouchStart, { passive: true });
    webDocument.addEventListener('touchmove', onTouchMove, { passive: true });
    webDocument.addEventListener('touchend', clear, { passive: true });
    webDocument.addEventListener('touchcancel', clear, { passive: true });
    webDocument.addEventListener('click', onClickGuard, true);
    return () => {
      clear();
      webDocument.removeEventListener('contextmenu', onCtx);
      webDocument.removeEventListener('touchstart', onTouchStart);
      webDocument.removeEventListener('touchmove', onTouchMove);
      webDocument.removeEventListener('touchend', clear);
      webDocument.removeEventListener('touchcancel', clear);
      webDocument.removeEventListener('click', onClickGuard, true);
      webWindow.removeEventListener('scroll', onScroll, { capture: true });
    };
  }, [promoters]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e) => { if (e.key === 'Escape') closeMenu(); };
    webWindow.addEventListener('keydown', onKey);
    return () => webWindow.removeEventListener('keydown', onKey);
  }, [menu, closing]);

  const live = menu?.promoter?.live;
  const phone = live?.phone || '';
  const ig = live?.instagram || '';

  const w = 248;
  const h = 330;
  const x = menu ? Math.max(8, Math.min(menu.x, webWindow.innerWidth - w - 8)) : 0;
  const y = menu ? Math.max(8, Math.min(menu.y, webWindow.innerHeight - h - 8)) : 0;
  const ox = menu ? Math.max(0, Math.min(menu.x - x, w)) : 0;
  const oy = menu ? Math.max(0, Math.min(menu.y - y, h)) : 0;

  const subPromoter = menu ? (menu.promoter.live || menu.promoter) : null;

  return createPortal(
    <>
      {menu && subView === null && (
        <>
          <Div
            className={`fixed inset-0 z-[10000] bg-black/30 ${closing ? 'backdrop-fade-out' : 'backdrop-fade-in'}`}
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => { e.preventDefault(); closeMenu(); }} />
          <Div
            className={`fixed z-[10001] w-[248px] rounded-xl border border-white/10 bg-popover shadow-2xl overflow-y-auto overflow-x-hidden ${closing ? 'menu-pop-out' : 'menu-pop-in'}`}
            style={{ left: x, top: y, maxHeight: webWindow.innerHeight - y - 8, transformOrigin: `${ox}px ${oy}px` }}>
            <Div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-secondary/40">
              <P className="text-[11px] font-semibold text-foreground truncate">{menu.promoter.name || 'Promoter'}</P>
              <Btn
                button
                onClick={closeMenu}
                className="text-muted-foreground hover:text-foreground shrink-0">
                <X className="w-3.5 h-3.5" />
              </Btn>
            </Div>

            <Div className="py-1">
              <Btn
                button
                onClick={goDetail}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors">
                <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0" />
                <Span className="text-xs font-medium">Vai al dettaglio</Span>
              </Btn>
              <Btn
                button
                onClick={contatta}
                disabled={!phone}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors disabled:opacity-40">
                <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <Span className="text-xs font-medium">Contatta</Span>
              </Btn>
              <Btn
                button
                onClick={copyPhone}
                disabled={!phone}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors disabled:opacity-40">
                <Copy className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <Span className="text-xs font-medium">Copia telefono</Span>
              </Btn>
              <Btn
                button
                onClick={openIg}
                disabled={!ig}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors disabled:opacity-40">
                <Instagram className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <Span className="text-xs font-medium">Apri Instagram</Span>
              </Btn>
              <Btn
                button
                onClick={confronta}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors">
                <BarChart3 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <Span className="text-xs font-medium">Confronta</Span>
              </Btn>
              <Btn
                button
                onClick={openQuickInfo}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors">
                <Info className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <Span className="text-xs font-medium">Info rapide</Span>
              </Btn>
              <Btn
                button
                onClick={openLastEvents}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors">
                <CalendarDays className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <Span className="text-xs font-medium">Ultime serate</Span>
              </Btn>
            </Div>
          </Div>
        </>
      )}
      {menu && subView === 'quickInfo' && (
        <PromoterQuickInfoPopup open promoter={subPromoter} onClose={closeAll} />
      )}
      {menu && subView === 'lastEvents' && (
        <PromoterLastEventsPopup open promoter={subPromoter} onClose={closeAll} />
      )}
    </>,
    webDocument.body
  );
}