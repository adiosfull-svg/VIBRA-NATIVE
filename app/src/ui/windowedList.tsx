// Lista virtualizzata in un riquadro a scorrimento proprio (es. `max-h-32 overflow-y-auto` con
// centinaia di clienti). docs/REGOLE-PRESTAZIONI.md §3.
//
// Per le liste che scorrono con la PAGINA si usa invece web/hooks/usePageWindow (VirtualizedClientList,
// RecontactList, ClientGrowthLeague). Qui le righe hanno altezza fissa: si disegnano solo quelle nel
// riquadro più `overscan` sopra e sotto, posizionate in assoluto; lo stato cambia solo quando la
// finestra si sposta di una riga (non a ogni evento di scroll).
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Dimensions, ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

type Props<T> = {
  items: T[];
  /** altezza di ogni riga (px) */
  itemHeight: number;
  /** spazio tra le righe (space-y-*) */
  gap?: number;
  /** altezza massima del riquadro (max-h-*) */
  maxHeight: number;
  overscan?: number;
  keyOf: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
};

export function WindowedList<T>({ items, itemHeight, gap = 0, maxHeight, overscan = 6, keyOf, renderItem }: Props<T>) {
  const stride = itemHeight + gap;
  const [first, setFirst] = useState(0);
  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const row = Math.floor(e.nativeEvent.contentOffset.y / stride);
    setFirst((prev) => (prev === row ? prev : row));
  }, [stride]);
  const count = items.length;
  const visible = Math.ceil(maxHeight / stride) + 1;
  const start = Math.max(0, Math.min(first, count - 1) - overscan);
  const end = Math.min(count, first + visible + overscan);
  const rows: ReactNode[] = [];
  for (let i = start; i < end; i++) {
    rows.push(
      <View key={keyOf(items[i], i)} style={{ position: 'absolute', top: i * stride, left: 0, right: 0, height: itemHeight }}>
        {renderItem(items[i], i)}
      </View>,
    );
  }
  return (
    <ScrollView
      style={{ maxHeight }}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      onScroll={onScroll}
      showsVerticalScrollIndicator
    >
      <View style={{ height: Math.max(0, count * stride - gap) }}>{rows}</View>
    </ScrollView>
  );
}

type VariableProps<T> = {
  items: T[];
  /** altezza stimata delle righe non ancora misurate (poi vale quella misurata) */
  estimate: number;
  gap?: number;
  /** altezza massima del riquadro (max-h-*); senza, il riquadro riempie il genitore (flex-1) e misura la sua altezza */
  maxHeight?: number;
  overscan?: number;
  /** padding interno del riquadro (p-* come numero, o px/pt/pb): le righe partono da qui */
  padding?: number | { x?: number; top?: number; bottom?: number };
  keyOf: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
};

/**
 * Come WindowedList, ma con righe ad altezza VARIABILE (testo che può andare a capo): ogni riga si
 * misura al montaggio (onLayout) e le righe non ancora misurate valgono quanto la prima misurata (o
 * `estimate`). Le righe stanno in posizione assoluta a `offsets[i]`; lo stato cambia solo quando cambia
 * la prima riga visibile o un'altezza misurata (un solo ricalcolo per frame).
 */
export function WindowedListVariable<T>({ items, estimate, gap = 0, maxHeight, overscan = 6, padding = 0, keyOf, renderItem }: VariableProps<T>) {
  const pad = typeof padding === 'number' ? { x: padding, top: padding, bottom: padding } : { x: padding.x ?? 0, top: padding.top ?? 0, bottom: padding.bottom ?? 0 };
  const [measured, setMeasured] = useState(0);
  const viewport = maxHeight ?? (measured || Dimensions.get('window').height);
  const heights = useRef(new Map<string, number>());
  const [base, setBase] = useState(estimate);
  const [version, setVersion] = useState(0);
  const pending = useRef(0);
  const [scrollY, setScrollY] = useState(0);

  const keys = useMemo(() => items.map((it, i) => keyOf(it, i)), [items, keyOf]);
  const { offsets, total } = useMemo(() => {
    const offs = new Array<number>(keys.length);
    let y = 0;
    for (let i = 0; i < keys.length; i++) {
      offs[i] = y;
      y += (heights.current.get(keys[i]) ?? base) + gap;
    }
    return { offsets: offs, total: keys.length ? y - gap : 0 };
    // version: altezze misurate cambiate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, base, gap, version]);

  const onItemLayout = useCallback((key: string, e: LayoutChangeEvent) => {
    const h = Math.round(e.nativeEvent.layout.height * 100) / 100;
    const prev = heights.current.get(key);
    if (prev != null && Math.abs(prev - h) < 0.5) return;
    heights.current.set(key, h);
    if (heights.current.size === 1) setBase(h);
    if (!pending.current) pending.current = requestAnimationFrame(() => { pending.current = 0; setVersion((v) => v + 1); });
  }, []);
  useEffect(() => () => { if (pending.current) cancelAnimationFrame(pending.current); }, []);

  // prima riga con inizio oltre y (ricerca binaria)
  const firstAfter = (y: number) => {
    let lo = 0, hi = offsets.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (offsets[m] <= y) lo = m + 1; else hi = m; }
    return lo;
  };
  const geo = useRef(offsets);
  geo.current = offsets;
  const padTop = pad.top;
  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y - padTop;
    const offs = geo.current;
    let lo = 0, hi = offs.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (offs[m] <= y) lo = m + 1; else hi = m; }
    // lo stato tiene l'inizio della riga in cima: cambia solo quando cambia riga
    const rowTop = lo > 0 ? offs[lo - 1] : 0;
    setScrollY((prev) => (prev === rowTop ? prev : rowTop));
  }, [padTop]);

  const count = items.length;
  const start = Math.max(0, firstAfter(scrollY) - 1 - overscan);
  const end = Math.min(count, firstAfter(scrollY + viewport) + overscan);
  const rows: ReactNode[] = [];
  for (let i = start; i < end; i++) {
    const key = keys[i];
    rows.push(
      <View key={key} onLayout={(e) => onItemLayout(key, e)} style={{ position: 'absolute', top: pad.top + offsets[i], left: pad.x, right: pad.x }}>
        {renderItem(items[i], i)}
      </View>,
    );
  }
  return (
    <ScrollView
      style={maxHeight != null ? { maxHeight } : { flex: 1 }}
      onLayout={maxHeight != null ? undefined : (e) => setMeasured(e.nativeEvent.layout.height)}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      onScroll={onScroll}
      showsVerticalScrollIndicator
    >
      <View style={{ height: Math.max(0, total) + pad.top + pad.bottom }}>{rows}</View>
    </ScrollView>
  );
}
