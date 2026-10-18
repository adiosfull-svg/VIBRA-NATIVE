// Finestra di una striscia ORIZZONTALE a scorrimento proprio (`flex gap-N overflow-x-auto`) con
// elementi a larghezza fissa: si montano solo quelli visibili più `overscan` per lato; al posto degli
// altri uno spaziatore largo quanto loro (docs/REGOLE-PRESTAZIONI.md §3). Lo stato cambia solo quando
// la finestra si sposta di un elemento.
// Uso: const strip = useStripWindow(items.length, larghezza + gap);
//      <Div onScroll={strip.onScroll} className="flex gap-2 overflow-x-auto">
//        {strip.start > 0 && <Div className="shrink-0" style={{ width: strip.start * stride - gap }} />}
//        {items.slice(strip.start, strip.end).map(...)}
//        {strip.end < items.length && <Div className="shrink-0" style={{ width: (items.length - strip.end) * stride - gap }} />}
import { useCallback, useState } from 'react';
import { Dimensions } from 'react-native';

export function useStripWindow(count, stride, overscan = 4) {
  const [first, setFirst] = useState(0);
  const onScroll = useCallback((e) => {
    const x = e?.target?.scrollLeft ?? e?.nativeEvent?.contentOffset?.x ?? 0;
    const i = Math.max(0, Math.floor(x / stride));
    setFirst((prev) => (prev === i ? prev : i));
  }, [stride]);
  const visible = Math.ceil(Dimensions.get('window').width / stride) + 1;
  const start = Math.max(0, Math.min(first, count) - overscan);
  const end = Math.min(count, first + visible + overscan);
  return { start, end, onScroll };
}
