// Banco del costo per elemento (solo build della gara, EXPO_PUBLIC_TEST_GARA=1; vedi
// docs/PIANO-PRESTAZIONI.md): monta N elementi di ogni tipo e misura il tempo dal montaggio al
// layout del contenitore. Confronta RN puro, View con classi (NativeWind) e i nostri Div/Text/Btn.
// Righe nel logcat: "VIBRA gara bench <caso> ms=<mediana> tutti=a,b,c", in fondo "VIBRA gara bench fine".
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, Text as RNText, View, type LayoutChangeEvent } from 'react-native';
import { TEST_GARA } from '../../lib/testDiag';
import { Btn, Div, P, Span } from '../../ui/html';
import { Text } from '../../ui/text';

const N = 300;
const RIPETIZIONI = 3;
const S = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#131316', borderWidth: 1, borderColor: '#2c2c30' },
  text: { fontSize: 14, fontWeight: '500', color: '#fafafa' },
});
const CLASSI = 'flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border';

const CASI: Record<string, () => ReactNode> = {
  'view-puro': () => <View style={S.row} />,
  'view-classi': () => <View className="flex-row items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border" />,
  div: () => <Div className={CLASSI} />,
  'text-puro': () => <RNText style={S.text}>Mario Rossi</RNText>,
  text: () => <Text className="text-sm font-medium text-foreground">Mario Rossi</Text>,
  span: () => <Span className="text-sm font-medium">Mario Rossi</Span>,
  btn: () => <Btn className="px-3 py-1.5 rounded-lg bg-secondary text-xs">Apri</Btn>,
  riga: () => (
    <Div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
      <Div className="w-8 h-8 rounded-full bg-primary/20" />
      <Div className="flex-1 min-w-0">
        <P className="text-sm font-semibold truncate">Mario Rossi</P>
        <P className="text-xs text-muted-foreground">3 serate · €120</P>
      </Div>
      <Btn className="px-2 py-1 rounded-md bg-secondary text-xs">Apri</Btn>
    </Div>
  ),
};

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function Bench() {
  const [caso, setCaso] = useState<string | null>(null);
  const done = useRef<((e: LayoutChangeEvent) => void) | null>(null);
  useEffect(() => {
    if (!TEST_GARA) return;
    let alive = true;
    (async () => {
      await sleep(1500);
      for (const nome of Object.keys(CASI)) {
        const tempi: number[] = [];
        for (let i = 0; i < RIPETIZIONI && alive; i++) {
          const fine = new Promise<void>((r) => { done.current = () => r(); });
          const t0 = performance.now();
          setCaso(nome);
          await fine;
          tempi.push(Math.round(performance.now() - t0));
          setCaso(null);
          await nextFrame();
          await sleep(250);
        }
        const ord = [...tempi].sort((a, b) => a - b);
        console.log(`VIBRA gara bench ${nome} ms=${ord[Math.floor(ord.length / 2)]} tutti=${tempi.join(',')} n=${N}`);
      }
      console.log('VIBRA gara bench fine');
    })();
    return () => { alive = false; };
  }, []);
  if (!TEST_GARA) return null;
  const make = caso ? CASI[caso] : null;
  return (
    <View style={{ flex: 1, backgroundColor: '#09090b' }}>
      {make ? (
        <View key={caso} style={{ flex: 1, overflow: 'hidden' }} onLayout={(e) => done.current?.(e)}>
          {Array.from({ length: N }, (_, i) => <View key={i}>{make()}</View>)}
        </View>
      ) : null}
    </View>
  );
}
