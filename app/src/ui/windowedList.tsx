// Lista virtualizzata in un riquadro a scorrimento proprio (es. `max-h-32 overflow-y-auto` con
// centinaia di clienti). docs/REGOLE-PRESTAZIONI.md §3.
//
// Per le liste che scorrono con la PAGINA si usa invece web/hooks/usePageWindow (VirtualizedClientList,
// RecontactList, ClientGrowthLeague). Qui le righe hanno altezza fissa: si disegnano solo quelle nel
// riquadro più `overscan` sopra e sotto, posizionate in assoluto; lo stato cambia solo quando la
// finestra si sposta di una riga (non a ogni evento di scroll).
import { useCallback, useState, type ReactNode } from 'react';
import { ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

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
