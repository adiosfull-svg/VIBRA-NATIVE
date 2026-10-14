// Montaggio progressivo di una lista lunga con righe di altezza variabile (dove usePageWindow, che vuole
// righe ad altezza fissa, non va bene): prima `initial` righe, poi `step` alla volta quando la fine della
// lista si avvicina allo schermo (scroll della PROPRIA pagina) e, a app ferma, a blocchi fino alla fine.
// Il layout resta quello dell'originale (nessuna altezza stimata); si risparmia il montaggio iniziale.
// Uso: const { count, sentinelRef, showAll } = useProgressiveList(items.length[, { initial, step, idleStep }]);
//      items.slice(0, count).map(...)  e  <Div ref={sentinelRef} /> subito dopo la lista.
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, InteractionManager } from 'react-native';
import { pageScroll } from '@/web/shims/pageScroll';
import { PageLayerContext } from '@/ui/pageLayers';

export function useProgressiveList(total, { initial = 20, step = 20, idleStep = 40 } = {}) {
  const [count, setCount] = useState(Math.min(total, initial));
  const sentinelRef = useRef(null);
  const layer = useContext(PageLayerContext);
  const grow = useCallback((n) => setCount((c) => (c >= total ? c : Math.min(total, c + n))), [total]);

  // fine della lista entro due schermi dalla parte visibile → altre righe
  const check = useCallback(() => {
    const el = sentinelRef.current;
    const offset = layer ? layer.offsetOf(el) : pageScroll.offsetOf(el);
    if (offset == null) return;
    const top = offset - (layer ? layer.y() : pageScroll.y);
    const vh = (layer && layer.viewportHeight()) || pageScroll.viewportHeight || Dimensions.get('window').height;
    if (top < vh * 2) grow(step);
  }, [layer, grow, step]);

  useEffect(() => {
    let raf = requestAnimationFrame(check);
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(check); };
    if (layer) { const off = layer.onScroll(onScroll); return () => { cancelAnimationFrame(raf); off(); }; }
    pageScroll.on(onScroll);
    return () => { cancelAnimationFrame(raf); pageScroll.off(onScroll); };
  }, [check, layer, count]);

  // a app ferma completa la lista a blocchi (lo scroll veloce trova già le righe); idleStep 0: solo
  // avvicinandosi alla fine (liste in fondo alla pagina, che spesso non si guardano)
  useEffect(() => {
    if (count >= total || !idleStep) return;
    const task = InteractionManager.runAfterInteractions(() => setTimeout(() => grow(idleStep), 300));
    return () => task.cancel?.();
  }, [count, total, grow, idleStep]);

  // tutte le righe subito (es. prima di saltare a un elemento in fondo)
  const showAll = useCallback(() => setCount(total), [total]);
  return { count: Math.min(count, total), sentinelRef, showAll };
}
