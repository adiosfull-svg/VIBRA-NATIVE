// Port di src/hooks/useSwipeToOpenSidebar.jsx: swipe verso destra partito vicino al bordo sinistro
// (5-35% della larghezza, fuori dalla barra in basso) → apre il menu laterale. Come l'originale il pannello
// non segue il dito: a dito alzato, se lo spostamento è > 50 px e soprattutto orizzontale, parte l'apertura
// (animazione del pannello sul thread UI, ui/sideDrawer via setSidebarOpen).
//
// Sul telefono gli eventi touch arrivano a document dalla radice dell'app (ui/gestures, rootTouch).
// Equivalenti dei controlli dell'originale (isInsideBlocked, tocchi sui pulsanti):
//  - scroll orizzontali nativi (barre delle tab, strisce, ScrollView), gesti RNGH (barra in basso, tela):
//    il sistema prende il tocco e a JS arriva touchcancel, non touchend → nessuna apertura;
//  - <div> che gestiscono da sé i gesti (onTouchStart/onPointerDown: trascinamenti, pinch, card che si
//    girano, il touch-action: none dell'originale) → touchend con `gestureOwner`;
//  - grafici uPlot (PanResponder) → [data-vibra-gesture] tra gli antenati;
//  - tocco iniziato su un <button> (Btn con `button`) → lastButtonPressInAt.
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { lastButtonPressInAt } from '../../ui/gestures';
import { doc as webDocument, win as webWindow } from '../shims/dom';

const SWIPE_START_MIN_PCT = 0.05; // 5% dal bordo sinistro
const SWIPE_START_MAX_PCT = 0.35; // fino al 35%
const SWIPE_THRESHOLD = 50; // px minimi per aprire

type TouchPoint = { clientX: number; clientY: number; target?: { closest?: (s: string) => unknown } | null };
type TouchEv = { touches: TouchPoint[]; changedTouches: TouchPoint[]; target?: TouchPoint['target']; gestureOwner?: boolean };

export function useSwipeToOpenSidebar(onOpen: () => void) {
  useEffect(() => {
    if (Platform.OS === 'web') return undefined;
    const start = { x: 0, y: 0, t: 0, active: false, target: null as TouchPoint['target'] };
    const onTouchStart = (e: TouchEv) => {
      start.active = false;
      const t = e.touches[0];
      if (!t || e.touches.length !== 1) return;
      if ((webWindow as unknown as { __seminaFlipActive?: boolean }).__seminaFlipActive) return;
      // zona bassa (barra in basso) e fuori dalla fascia del bordo: niente swipe
      if (t.clientY > webWindow.innerHeight - 100) return;
      const pct = t.clientX / webWindow.innerWidth;
      if (pct < SWIPE_START_MIN_PCT || pct > SWIPE_START_MAX_PCT) return;
      start.x = t.clientX; start.y = t.clientY; start.t = Date.now(); start.target = t.target ?? e.target ?? null;
      start.active = true;
    };
    const onTouchEnd = (e: TouchEv) => {
      if (!start.active) return;
      start.active = false;
      if (e.gestureOwner) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      // solo swipe prevalentemente orizzontale verso destra
      if (!(dx > SWIPE_THRESHOLD && Math.abs(dy) < Math.abs(dx))) return;
      if (lastButtonPressInAt() >= start.t - 30) return;
      if (start.target?.closest?.('[data-vibra-gesture]')) return;
      onOpen();
    };
    const onTouchCancel = () => { start.active = false; };
    webDocument.addEventListener('touchstart', onTouchStart);
    webDocument.addEventListener('touchend', onTouchEnd);
    webDocument.addEventListener('touchcancel', onTouchCancel);
    return () => {
      webDocument.removeEventListener('touchstart', onTouchStart);
      webDocument.removeEventListener('touchend', onTouchEnd);
      webDocument.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [onOpen]);
}
