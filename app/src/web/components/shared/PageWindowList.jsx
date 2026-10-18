// Lista (o griglia a N colonne) virtualizzata sullo scroll della PAGINA, con righe ad altezza variabile
// misurate al montaggio (hooks/usePageWindow → usePageWindowVariable). docs/REGOLE-PRESTAZIONI.md §3.
// Sostituisce `<Div className="space-y-N">{items.map(...)}</Div>` (columns 1) o
// `<Div className="grid grid-cols-2 gap-N">{items.map(...)}</Div>` (columns 2: ogni riga è una griglia
// di N colonne, alta quanto la card più alta come nella griglia CSS).
// - `gap`: spazio verticale tra le righe in px (space-y-* / gap-*); `rowClassName`: classi della riga
//   (per le griglie la griglia di una riga, es. 'grid grid-cols-2 gap-3').
// - `apiRef.current.scrollToItem(key, block)`: porta un elemento al centro (o in cima) della pagina anche
//   se la sua riga non è montata (el.scrollIntoView dell'originale).
// - Le righe che entrano nella finestra scorrendo NON rifanno le animazioni d'entrata: `renderItem`
//   riceve `entering` (true solo per quelle montate all'apertura) da passare come `initial` a motion.
import React, { createContext, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { usePageWindowVariable } from '@/web/hooks/usePageWindow';
import { pageScroll } from '@/web/shims/pageScroll';
import { Div } from '@/ui/html';

// true fuori dallo scroll della pagina (es. il popup a schermo intero di ChartFullscreen): lì la
// finestra non si può calcolare e le righe si disegnano tutte, come nell'originale.
export const PageWindowOffContext = createContext(false);

const EMPTY = [];

function Row({ rowKey, top, onMeasure, className, children }) {
  return (
    <View onLayout={(e) => onMeasure(rowKey, e)} style={{ position: 'absolute', top, left: 0, right: 0 }}>
      {className ? <Div className={className}>{children}</Div> : children}
    </View>
  );
}

export default function PageWindowList({ items, keyOf, renderItem, columns = 1, gap = 0, estimate = 80, overscan = 4, rowClassName, className, apiRef }) {
  const rows = useMemo(() => {
    const out = [];
    for (let i = 0; i < items.length; i += columns) out.push(items.slice(i, i + columns));
    return out;
  }, [items, columns]);
  const rowKeys = useMemo(() => rows.map((r) => r.map(keyOf).join('|')), [rows, keyOf]);
  const off = useContext(PageWindowOffContext);
  const win = usePageWindowVariable(off ? EMPTY : rowKeys, estimate, overscan, gap);

  // animazioni d'entrata solo per le righe montate all'apertura (poi entrano già al loro posto)
  const opened = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => { opened.current = true; }, 800);
    return () => clearTimeout(t);
  }, []);

  const geo = useRef(null);
  geo.current = { rows, offsets: win.offsets };
  const scrollToItem = useCallback((key, block = 'center') => {
    const { rows: rs, offsets } = geo.current;
    const r = rs.findIndex((row) => row.some((it) => keyOf(it) === key));
    if (r < 0) return false;
    const top = pageScroll.offsetOf(win.containerRef.current);
    if (top == null) return false;
    const y = top + offsets[r];
    const h = (offsets[r + 1] ?? win.total + gap) - offsets[r] - gap;
    const vh = pageScroll.viewportHeight || 0;
    pageScroll.scrollTo(Math.max(0, block === 'center' ? y - (vh - h) / 2 : y), true);
    return true;
  }, [keyOf, gap, win.containerRef, win.total]);
  useImperativeHandle(apiRef, () => ({ scrollToItem }), [scrollToItem]);

  const entering = !opened.current;
  if (off) {
    return (
      <Div className={className}>
        {rows.map((row, idx) => (
          <View key={rowKeys[idx]} style={idx ? { marginTop: gap } : undefined}>
            {rowClassName ? <Div className={rowClassName}>{row.map((it, j) => renderItem(it, idx * columns + j, true))}</Div>
              : row.map((it, j) => renderItem(it, idx * columns + j, true))}
          </View>
        ))}
      </Div>
    );
  }
  return (
    <Div ref={win.containerRef} className={className} style={{ position: 'relative', height: win.total }}>
      {rows.slice(win.start, win.end).map((row, i) => {
        const idx = win.start + i;
        return (
          <Row key={rowKeys[idx]} rowKey={rowKeys[idx]} top={win.offsets[idx]} onMeasure={win.onItemLayout} className={rowClassName}>
            {row.map((it, j) => renderItem(it, idx * columns + j, entering))}
          </Row>
        );
      })}
    </Div>
  );
}
