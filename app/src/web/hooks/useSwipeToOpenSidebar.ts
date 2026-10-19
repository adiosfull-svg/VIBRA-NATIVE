// Port di src/hooks/useSwipeToOpenSidebar.jsx: swipe verso destra partito vicino al bordo sinistro
// (5-35% della larghezza, fuori dalla barra in basso) → apre il menu laterale. Come l'originale il pannello
// non segue il dito: a dito alzato, se lo spostamento è > 50 px e soprattutto orizzontale, parte l'apertura
// (animazione del pannello sul thread UI, ui/sideDrawer via setSidebarOpen).
//
// Sul thread UI (gesto RNGH alla radice del layout, come ui/sideDrawer e la barra in basso). Nel browser
// touchend arriva anche dopo che la pagina ha iniziato a scorrere; su Android no: lo ScrollView della
// pagina prende il tocco appena il dito scende di 8 dp (anche in uno swipe quasi orizzontale) e a JS
// arriva touchcancel. Quindi il gesto prende lui il tocco quando il dito è andato a destra di 12 dp
// restando più orizzontale che verticale, prima che lo ScrollView verticale lo faccia suo.
// Equivalenti dei controlli dell'originale (isInsideBlocked, tocchi sui pulsanti):
//  - scroll orizzontali nativi (barre delle tab, strisce): prendono il tocco a 8 dp, prima dei 12 dp del
//    gesto, e RNGH lo annulla (requestDisallowInterceptTouchEvent) → gli swipe delle pagine restano loro;
//  - <div> che gestiscono da sé i gesti (onTouchStart/onPointerDown: trascinamenti, pinch, card che si
//    girano, il touch-action: none dell'originale), tocchi iniziati su un <button> (Btn con `button`) e
//    grafici uPlot ([data-vibra-gesture]): il JS lo segnala al gesto (blocked) appena il tocco parte,
//    e lo ricontrolla a dito alzato prima di aprire.
import { useEffect, useMemo, useRef } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { GestureStateManager, useManualGesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { touchBlockSink } from '../../ui/gestures';
import { TEST_DIAG } from '../../lib/testDiag';
import { doc as webDocument, win as webWindow } from '../shims/dom';

const SWIPE_START_MIN_PCT = 0.05; // 5% dal bordo sinistro
const SWIPE_START_MAX_PCT = 0.35; // fino al 35%
const SWIPE_THRESHOLD = 50; // px minimi per aprire
const BOTTOM_ZONE = 100; // barra in basso
/** oltre lo slop (8 dp) degli scroll orizzontali nativi, che così vincono loro */
const ACTIVATE_DX = 12;

type TouchPoint = { target?: { closest?: (s: string) => unknown } | null };
type TouchEv = { touches: TouchPoint[]; target?: TouchPoint['target'] };

/** Gesto da mettere (GestureDetector) attorno al contenuto del layout. */
export function useSwipeToOpenSidebar(onOpen: () => void, enabled: boolean) {
  const { width, height } = useWindowDimensions();
  const blocked = useSharedValue(false);
  const jsBlocked = useRef(false);
  const enabledSv = useSharedValue(enabled);
  useEffect(() => { enabledSv.value = enabled; }, [enabled, enabledSv]);

  // il JS segnala i tocchi partiti su pulsanti, <div> con gesti propri e grafici
  useEffect(() => {
    if (Platform.OS === 'web') return undefined;
    const block = () => { jsBlocked.current = true; blocked.value = true; };
    touchBlockSink.fn = block;
    const onTouchStart = (e: TouchEv) => {
      jsBlocked.current = false;
      const target = e.touches[0]?.target ?? e.target;
      if (target?.closest?.('[data-vibra-gesture]')) block();
    };
    webDocument.addEventListener('touchstart', onTouchStart);
    return () => {
      if (touchBlockSink.fn === block) touchBlockSink.fn = null;
      webDocument.removeEventListener('touchstart', onTouchStart);
    };
  }, [blocked]);

  const ref = useRef(onOpen);
  ref.current = onOpen;
  const decide = useMemo(() => (dx: number, dy: number) => {
    if (TEST_DIAG) console.log(`VIBRA swipe fine dx=${Math.round(dx)} dy=${Math.round(dy)} bloccato=${jsBlocked.current}`);
    if (jsBlocked.current) return;
    if ((webWindow as unknown as { __seminaFlipActive?: boolean }).__seminaFlipActive) return;
    if (!(dx > SWIPE_THRESHOLD && Math.abs(dy) < Math.abs(dx))) return;
    ref.current();
  }, []);

  const sx = useSharedValue(0);
  const sy = useSharedValue(0);
  const tracking = useSharedValue(false);
  const active = useSharedValue(false);

  return useManualGesture({
    onTouchesDown: (e) => {
      'worklet';
      tracking.value = false;
      active.value = false;
      blocked.value = false;
      const t = e.changedTouches[0];
      if (!enabledSv.value || e.numberOfTouches !== 1 || !t) { GestureStateManager.fail(e.handlerTag); return; }
      const pct = t.absoluteX / width;
      if (t.absoluteY > height - BOTTOM_ZONE || pct < SWIPE_START_MIN_PCT || pct > SWIPE_START_MAX_PCT) {
        GestureStateManager.fail(e.handlerTag);
        return;
      }
      sx.value = t.absoluteX;
      sy.value = t.absoluteY;
      tracking.value = true;
    },
    onTouchesMove: (e) => {
      'worklet';
      if (!tracking.value || active.value) return;
      const t = e.allTouches[0];
      if (!t || e.numberOfTouches !== 1 || blocked.value) { tracking.value = false; GestureStateManager.fail(e.handlerTag); return; }
      const dx = t.absoluteX - sx.value;
      const dy = t.absoluteY - sy.value;
      if (dx < -ACTIVATE_DX || Math.abs(dy) > Math.max(ACTIVATE_DX, Math.abs(dx))) {
        tracking.value = false;
        GestureStateManager.fail(e.handlerTag);
        return;
      }
      if (dx > ACTIVATE_DX && Math.abs(dy) < dx) {
        active.value = true;
        GestureStateManager.activate(e.handlerTag);
      }
    },
    onTouchesUp: (e) => {
      'worklet';
      if (e.numberOfTouches > 0) return;
      const t = e.changedTouches[0];
      if (active.value && t && !blocked.value) scheduleOnRN(decide, t.absoluteX - sx.value, t.absoluteY - sy.value);
      tracking.value = false;
      if (active.value) GestureStateManager.deactivate(e.handlerTag);
      else GestureStateManager.fail(e.handlerTag);
      active.value = false;
    },
    onFinalize: () => {
      'worklet';
      tracking.value = false;
      active.value = false;
    },
  });
}
