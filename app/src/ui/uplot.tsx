// Grafici dell'app web disegnati con uPlot (canvas) → SVG, stesse misure e regole di uPlot:
//  - assi di 50px (y a sinistra, x in basso), padding [10, 10, 0, 0], griglia hsl(240 5% 18%),
//    etichette 11px Inter hsl(240 5% 45%) a 15px dal grafico (tick 10 + gap 5; i tick di uPlot,
//    col colore di default, sul fondo scuro non si vedono);
//  - asse y: incrementi 1/2/2,5/5·10^n, almeno 30px fra un tick e l'altro; asse x: un'etichetta ogni
//    55px al massimo;
//  - linee: spline monotona (uPlot.paths.spline) spessa 2,5; barre raggruppate (70% della categoria);
//  - tooltip al tocco (come setCursor), pinch con due dita e trascinamento quando è ingrandito
//    (lib/uplotTouchZoom.js dell'originale).
import { useMemo, useRef, useState } from 'react';
import { PanResponder, Text, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, G, Line as SvgLine, Path, Rect, Text as SvgText } from 'react-native-svg';
import { monotonePath } from './recharts';

type Datum = Record<string, any>;
type Serie = { key: string; name: string; color: string };
type Props = {
  data: Datum[];
  series: Serie[];
  xLabels: string[];
  valueFormatter?: (v: number) => string | number;
  height?: number;
};

const AXIS = 50;
const PAD = { top: 10, right: 10 };
const GRID = 'hsl(240, 5%, 18%)';
const LABEL = 'hsl(240, 5%, 45%)';
const FONT = 'Inter_400Regular';
const MIN_RANGE = 3;

// ── scale (come uPlot) ───────────────────────────────────────────────────────
const roundDec = (v: number) => Math.round(v * 1e9) / 1e9;

/** rangeNum(min, max, 0.1, true) di uPlot (_rangeNum con pad 0.1 e zero "morbido", mode 3). */
function rangeNum(min: number, max: number): [number, number] {
  let delta = max - min;
  const scalarMax = Math.max(Math.abs(min), Math.abs(max));
  if (delta < 1e-24 || Math.abs(Math.log10(scalarMax) - Math.log10(delta)) > 10) {
    delta = 0;
    if (min === 0 || max === 0) delta = 1e-24;
  }
  const nonZero = delta || scalarMax || 1e3;
  const step = 10 ** Math.floor(Math.log10(nonZero)) / 10;
  const fix = (v: number) => Math.round(v * 1e12) / 1e12;
  const padMin = nonZero * (delta === 0 ? (min === 0 ? 0.1 : 1) : 0.1);
  const padMax = nonZero * (delta === 0 ? (max === 0 ? 0.1 : 1) : 0.1);
  const newMin = fix(Math.floor(fix((min - padMin) / step)) * step);
  const newMax = fix(Math.ceil(fix((max + padMax) / step)) * step);
  // soft 0, mode 3: se il minimo imbottito scende sotto 0 con dati ≥ 0, si ferma a 0
  const lo = min >= 0 && newMin <= 0 ? 0 : newMin;
  const hi = lo === newMax && lo === 0 ? 100 : newMax;
  return [lo, hi];
}

/** Tick dell'asse y: il primo incremento "bello" con almeno `space` px fra un tick e l'altro. */
function yTicks(lo: number, hi: number, px: number, space = 30): number[] {
  const range = hi - lo;
  if (!(range > 0) || px <= 0) return [lo];
  const minIncr = (range * space) / px;
  const mag = 10 ** Math.floor(Math.log10(minIncr));
  const incr = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((v) => v >= minIncr) ?? 10 * mag;
  const out: number[] = [];
  for (let v = Math.ceil(lo / incr) * incr; v <= hi + incr * 1e-9; v += incr) out.push(roundDec(v));
  return out;
}

function xSplits(scaleMin: number, scaleMax: number, plotWidth: number, last: number): number[] {
  const count = Math.floor(scaleMax) - Math.ceil(scaleMin) + 1;
  const maxLabels = Math.max(2, Math.floor(plotWidth / 55));
  const step = Math.max(1, Math.ceil(count / maxLabels));
  const out: number[] = [];
  for (let i = Math.ceil(scaleMin); i <= Math.min(Math.floor(scaleMax), last); i += step) out.push(i);
  return out;
}

// ── gesti: tocco = cursore, pinch e trascinamento sull'asse x ────────────────
function useXZoom(boundMin: number, boundMax: number) {
  const [view, setView] = useState<{ min: number; max: number } | null>(null);
  const cur = view ?? { min: boundMin, max: boundMax };
  const ref = useRef({ cur, bounds: [boundMin, boundMax] as [number, number], width: 1 });
  ref.current.cur = cur;
  ref.current.bounds = [boundMin, boundMax];
  const clamp = (min: number, max: number) => {
    const [b0, b1] = ref.current.bounds;
    let range = Math.min(b1 - b0, Math.max(Math.min(MIN_RANGE, b1 - b0), max - min));
    let lo = min;
    if (lo < b0) lo = b0;
    if (lo + range > b1) lo = b1 - range;
    range = Math.min(range, b1 - lo);
    return { min: lo, max: lo + range };
  };
  return { view: cur, setView: (min: number, max: number) => setView(clamp(min, max)), ref, zoomed: cur.max - cur.min < boundMax - boundMin - 0.01 };
}

function ChartFrame({ data, series, xLabels, valueFormatter = (v) => v, height = 250, kind, rightPad = 0 }: Props & { kind: 'line' | 'bar'; rightPad?: number }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height: h } = e.nativeEvent.layout;
    if (Math.abs(width - size.width) > 0.5 || Math.abs(h - size.height) > 0.5) setSize({ width, height: h });
  };
  const W = size.width;
  const H = size.height > 0 ? size.height : height;
  const last = data.length - 1;
  const boundMin = kind === 'bar' ? -0.5 : 0;
  const boundMax = kind === 'bar' ? last + 0.5 : Math.max(1, last) + rightPad;
  const { view, setView, ref, zoomed } = useXZoom(boundMin, boundMax);
  const [cursor, setCursor] = useState<{ idx: number; x: number; y: number } | null>(null);

  const plot = { left: AXIS, top: PAD.top, width: Math.max(1, W - AXIS - PAD.right), height: Math.max(1, H - PAD.top - AXIS) };
  ref.current.width = plot.width;
  const values = useMemo(() => series.map((s) => data.map((d) => Number(d[s.key]) || 0)), [data, series]);
  const [yLo, yHi] = useMemo<[number, number]>(() => {
    const all = values.flat();
    const max = all.length ? Math.max(...all) : 0;
    if (kind === 'bar') return [0, max <= 0 ? 1 : max * 1.1];
    return rangeNum(all.length ? Math.min(...all) : 0, max);
  }, [values, kind]);

  const xPos = (v: number) => ((v - view.min) / (view.max - view.min || 1)) * plot.width;
  const yPos = (v: number) => plot.height - ((v - yLo) / (yHi - yLo || 1)) * plot.height;
  const xVal = (px: number) => view.min + (px / plot.width) * (view.max - view.min);

  // gesti sull'area del grafico (coordinate relative all'area: locationX/Y)
  const g = useRef({ startDist: 0, startMin: 0, startMax: 0, startMid: 0, startX: 0, moved: false, pinch: false });
  const dist = (e: GestureResponderEvent) => {
    const t = e.nativeEvent.touches;
    return t.length >= 2 ? Math.hypot(t[0].pageX - t[1].pageX, t[0].pageY - t[1].pageY) : 0;
  };
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (e, s) => e.nativeEvent.touches.length >= 2 || (zoomedRef.current && Math.abs(s.dx) > Math.abs(s.dy) && Math.abs(s.dx) > 4),
    onPanResponderTerminationRequest: () => !g.current.pinch && !(zoomedRef.current && g.current.moved),
    onPanResponderGrant: (e) => {
      const { cur } = ref.current;
      Object.assign(g.current, { startMin: cur.min, startMax: cur.max, startX: e.nativeEvent.pageX, moved: false, pinch: false, startDist: dist(e) });
      g.current.startMid = cur.min + (e.nativeEvent.locationX / ref.current.width) * (cur.max - cur.min);
    },
    onPanResponderMove: (e, s) => {
      const d = dist(e);
      if (d > 0) {
        if (!g.current.pinch) Object.assign(g.current, { pinch: true, startDist: d, startMin: ref.current.cur.min, startMax: ref.current.cur.max });
        const range = (g.current.startMax - g.current.startMin) * (g.current.startDist / d);
        const ratio = (g.current.startMid - g.current.startMin) / (g.current.startMax - g.current.startMin || 1);
        setView(g.current.startMid - range * ratio, g.current.startMid - range * ratio + range);
        g.current.moved = true;
        return;
      }
      if (Math.abs(s.dx) > 4 || Math.abs(s.dy) > 4) g.current.moved = true;
      if (!zoomedRef.current || g.current.pinch) return;
      const perPx = (g.current.startMax - g.current.startMin) / ref.current.width;
      const shift = -s.dx * perPx;
      setView(g.current.startMin + shift, g.current.startMax + shift);
    },
    onPanResponderRelease: (e) => {
      if (g.current.moved) return;
      const { locationX, locationY } = e.nativeEvent;
      const idx = Math.round(xValRef.current(locationX));
      setCursor((c) => (idx < 0 || idx > lastRef.current ? null : c && c.idx === idx ? null : { idx, x: locationX, y: locationY }));
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);
  const zoomedRef = useRef(zoomed); zoomedRef.current = zoomed;
  const xValRef = useRef(xVal); xValRef.current = xVal;
  const lastRef = useRef(last); lastRef.current = last;

  const ticksY = yTicks(yLo, yHi, plot.height);
  const splitsX = xSplits(view.min, view.max, plot.width, last);
  const visible = (i: number) => xPos(i) >= -40 && xPos(i) <= plot.width + 40;

  let seriesEls: React.ReactNode = null;
  if (kind === 'line') {
    seriesEls = series.map((s, si) => {
      const pts = values[si].map((v, i) => ({ x: xPos(i), y: yPos(v) }));
      return <Path key={s.key} d={monotonePath(pts)} stroke={s.color} strokeWidth={2.5} fill="none" />;
    });
  } else {
    const baseline = yPos(0);
    const pxPerCat = Math.abs(xPos(1) - xPos(0)) || 40;
    const groupWidth = pxPerCat * 0.7;
    const barWidth = groupWidth / Math.max(1, series.length);
    seriesEls = data.map((_, i) => {
      if (!visible(i)) return null;
      const center = xPos(i);
      return (
        <G key={i}>
          {series.map((s, j) => {
            const top = yPos(values[j][i]);
            return <Rect key={s.key} x={center - groupWidth / 2 + j * barWidth} y={Math.min(top, baseline)} width={Math.max(1, barWidth * 0.85)} height={Math.abs(baseline - top)} fill={s.color} />;
          })}
        </G>
      );
    });
  }

  // tooltip come setCursor: righe ordinate per valore, a destra del punto (a sinistra oltre il 60%)
  const [tipSize, setTipSize] = useState({ width: 0, height: 0 });
  let tooltip: React.ReactNode = null;
  if (cursor && cursor.idx >= 0 && cursor.idx <= last) {
    const rows = series.map((s, i) => ({ name: s.name, color: s.color, value: values[i][cursor.idx] })).sort((a, b) => b.value - a.value);
    const left = xPos(cursor.idx);
    const top = yPos(Math.max(...rows.map((r) => r.value)));
    const showLeft = left > plot.width * 0.6;
    tooltip = (
      <View
        pointerEvents="none"
        onLayout={(e) => { const { width, height: h } = e.nativeEvent.layout; if (width !== tipSize.width || h !== tipSize.height) setTipSize({ width, height: h }); }}
        style={{
          position: 'absolute', left: showLeft ? left - tipSize.width - 10 : left + 10, top: Math.max(0, top - 10) - tipSize.height / 2,
          backgroundColor: 'hsl(240, 6%, 8%)', borderWidth: 1, borderColor: GRID, borderRadius: 8, padding: 10, zIndex: 50,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'Inter_500Medium', marginBottom: 4 }} numberOfLines={1}>{xLabels[cursor.idx] || ''}</Text>
        {rows.map((r) => (
          <Text key={r.name} style={{ color: r.color, fontSize: 12, lineHeight: 12 * 1.4, fontFamily: FONT }} numberOfLines={1}>{`${r.name} : ${valueFormatter(r.value)}`}</Text>
        ))}
      </View>
    );
  }

  return (
    <View style={{ position: 'relative', flexGrow: 1, flexShrink: 1, minHeight: 0, width: '100%' }} onLayout={onLayout}>
      {W > 0 && (
        <View style={{ width: W, height: H }}>
          <Svg width={W} height={H}>
            {/* griglia e etichette */}
            {ticksY.map((t) => {
              const y = plot.top + yPos(t);
              return (
                <G key={`y${t}`}>
                  <SvgLine x1={plot.left} x2={plot.left + plot.width} y1={y} y2={y} stroke={GRID} strokeWidth={1} />
                  <SvgText x={plot.left - 15} y={y + 4} fill={LABEL} fontSize={11} fontFamily={FONT} textAnchor="end">{String(valueFormatter(t))}</SvgText>
                </G>
              );
            })}
            {splitsX.map((i) => {
              const x = plot.left + xPos(i);
              return (
                <G key={`x${i}`}>
                  <SvgLine x1={x} x2={x} y1={plot.top} y2={plot.top + plot.height} stroke={GRID} strokeWidth={1} />
                  <SvgText x={x} y={plot.top + plot.height + 15 + 9} fill={LABEL} fontSize={11} fontFamily={FONT} textAnchor="middle">{xLabels[i] || ''}</SvgText>
                </G>
              );
            })}
            {/* serie, ritagliate all'area del grafico come il canvas di uPlot */}
            <Svg x={plot.left} y={plot.top} width={plot.width} height={plot.height}>
              {seriesEls}
              {cursor && (
                <G>
                  <SvgLine x1={cursor.x} x2={cursor.x} y1={0} y2={plot.height} stroke="#607D8B" strokeWidth={1} strokeDasharray="4,4" />
                  <SvgLine x1={0} x2={plot.width} y1={cursor.y} y2={cursor.y} stroke="#607D8B" strokeWidth={1} strokeDasharray="4,4" />
                  {kind === 'line' && series.map((s, si) => (
                    <Circle key={s.key} cx={xPos(cursor.idx)} cy={yPos(values[si][cursor.idx])} r={3} fill={s.color} stroke={s.color} />
                  ))}
                </G>
              )}
            </Svg>
          </Svg>
          {/* area dei gesti sopra il grafico (come u.over) */}
          <View {...responder.panHandlers} style={{ position: 'absolute', left: plot.left, top: plot.top, width: plot.width, height: plot.height }} />
          {tooltip}
        </View>
      )}
    </View>
  );
}

export function UPlotLineChart(props: Props & { rightPad?: number }) {
  if (!props.data.length) return <View style={{ flexGrow: 1, minHeight: 0 }} />;
  return <ChartFrame {...props} kind="line" />;
}

export function UPlotBarChart(props: Props) {
  if (!props.data.length) return <View style={{ flexGrow: 1, minHeight: 0 }} />;
  return <ChartFrame {...props} kind="bar" />;
}
