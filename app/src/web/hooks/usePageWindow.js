// Finestra di una lista virtualizzata sullo scroll della pagina, come le liste "window-based"
// dell'originale (VirtualizedClientList, RecontactList): lì leggevano getBoundingClientRect().top
// del contenitore a ogni scroll della finestra. Qui la pagina è lo ScrollView di Page: la posizione
// del contenitore nel contenuto (pageScroll.offsetOf) meno lo scroll dà lo stesso "top".
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { pageScroll } from '@/web/shims/pageScroll';
import { PageLayerContext } from '@/ui/pageLayers';

/** top del contenitore rispetto alla parte visibile della pagina (null se non misurabile). */
export function pageTopOf(el) {
  const offset = pageScroll.offsetOf(el);
  return offset == null ? null : offset - pageScroll.y;
}

function viewportHeight() {
  return pageScroll.viewportHeight || Dimensions.get('window').height;
}

/**
 * count elementi alti itemHeight: restituisce il ref del contenitore (alto count * itemHeight) e
 * l'intervallo [start, end) da rendere, con overscan elementi in più sopra e sotto.
 */
export function usePageWindow(count, itemHeight, overscan, initial = 20) {
  const containerRef = useRef(null);
  const [view, setView] = useState({ start: 0, end: Math.min(count, initial) });
  // scroll della PROPRIA pagina (con le tab montate quello globale è della pagina visibile)
  const layer = useContext(PageLayerContext);

  const compute = useCallback(() => {
    let top;
    if (layer) {
      const offset = layer.offsetOf(containerRef.current);
      top = offset == null ? null : offset - layer.y();
    } else top = pageTopOf(containerRef.current);
    if (top == null) return;
    const vh = (layer && layer.viewportHeight()) || viewportHeight();
    const height = count * itemHeight;
    // Fuori schermo (sopra o sotto): salta senza ricalcolare
    if (top > vh || top + height < 0) return;
    const start = Math.max(0, Math.floor(-top / itemHeight) - overscan);
    const end = Math.min(count, Math.ceil((vh - top) / itemHeight) + overscan);
    setView(prev => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, [count, itemHeight, overscan, layer]);

  useEffect(() => {
    // primo calcolo dopo il layout del contenitore
    let raf = requestAnimationFrame(compute);
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(compute); };
    if (layer) {
      const off = layer.onScroll(onScroll);
      return () => { cancelAnimationFrame(raf); off(); };
    }
    pageScroll.on(onScroll);
    return () => { cancelAnimationFrame(raf); pageScroll.off(onScroll); };
  }, [compute, layer]);

  // la lista si accorcia (filtro): l'intervallo non deve uscire dai limiti
  const start = Math.min(view.start, count);
  const end = Math.min(view.end, count);
  return { containerRef, start, end, compute };
}

/**
 * Come usePageWindow, ma con righe ad altezza VARIABILE misurate al montaggio (onItemLayout): le righe
 * non ancora misurate valgono quanto la prima misurata (o `estimate`). Le righe stanno in posizione
 * assoluta a `offsets[i]`, separate da `gap` (lo space-y del contenitore originale). Una riga che
 * cambia altezza sposta solo quelle dopo di lei (entrano dal basso: lo spostamento è fuori schermo).
 */
export function usePageWindowVariable(keys, estimate, overscan, gap = 0) {
  const heights = useRef(new Map());
  const [base, setBase] = useState(estimate);
  const [version, setVersion] = useState(0);
  const pending = useRef(0);
  const layer = useContext(PageLayerContext);
  const containerRef = useRef(null);

  const { offsets, total } = useMemo(() => {
    const offs = new Array(keys.length);
    let y = 0;
    for (let i = 0; i < keys.length; i++) {
      offs[i] = y;
      y += (heights.current.get(keys[i]) ?? base) + gap;
    }
    return { offsets: offs, total: keys.length ? y - gap : 0 };
    // version: altezze misurate cambiate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, base, gap, version]);

  const onItemLayout = useCallback((key, e) => {
    const h = Math.round(e.nativeEvent.layout.height * 100) / 100;
    const prev = heights.current.get(key);
    if (prev != null && Math.abs(prev - h) < 0.5) return;
    heights.current.set(key, h);
    if (heights.current.size === 1) setBase(h);
    // più righe misurate nello stesso frame: un solo ricalcolo
    if (!pending.current) pending.current = requestAnimationFrame(() => { pending.current = 0; setVersion(v => v + 1); });
  }, []);
  useEffect(() => () => { if (pending.current) cancelAnimationFrame(pending.current); }, []);

  const [view, setView] = useState({ start: 0, end: 12 });
  const geo = useRef({ offsets, total });
  geo.current = { offsets, total };

  const compute = useCallback(() => {
    let top;
    if (layer) {
      const offset = layer.offsetOf(containerRef.current);
      top = offset == null ? null : offset - layer.y();
    } else top = pageTopOf(containerRef.current);
    if (top == null) return;
    const vh = (layer && layer.viewportHeight()) || viewportHeight();
    const { offsets: offs, total: height } = geo.current;
    const n = offs.length;
    if (top > vh || top + height < 0) return;
    // prima riga con fine sotto -top, prima riga con inizio sotto vh - top (ricerca binaria)
    const firstAt = (y) => { let lo = 0, hi = n; while (lo < hi) { const m = (lo + hi) >> 1; if (offs[m] <= y) lo = m + 1; else hi = m; } return lo; };
    const start = Math.max(0, firstAt(-top) - 1 - overscan);
    const end = Math.min(n, firstAt(vh - top) + overscan);
    setView(prev => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, [overscan, layer]);

  // ricalcolo quando cambia la geometria (lista filtrata, altezze misurate)
  useEffect(() => {
    const raf = requestAnimationFrame(compute);
    return () => cancelAnimationFrame(raf);
  }, [compute, offsets]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(compute); };
    if (layer) {
      const off = layer.onScroll(onScroll);
      return () => { cancelAnimationFrame(raf); off(); };
    }
    pageScroll.on(onScroll);
    return () => { cancelAnimationFrame(raf); pageScroll.off(onScroll); };
  }, [compute, layer]);

  const start = Math.min(view.start, keys.length);
  const end = Math.min(view.end, keys.length);
  return { containerRef, start, end, offsets, total, onItemLayout };
}
