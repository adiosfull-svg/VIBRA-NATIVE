// Sottoinsieme di recharts usato dall'app web, sopra react-native-svg, con la stessa API:
// ResponsiveContainer, BarChart/LineChart/AreaChart (layout orizzontale e verticale), Bar (+Cell,
// radius, stackId), Line/Area (monotone), XAxis/YAxis (tick, tickFormatter, width, hide, domain,
// tick personalizzati), CartesianGrid, Tooltip (al tocco, formatter/content), Legend, RadarChart.
import {
  Children, cloneElement, createContext, Fragment, isValidElement, useContext, useMemo, useState,
  type ReactElement, type ReactNode,
} from 'react';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';
import { getNiceTickValues, getTickValuesFixedDomain } from 'recharts-scale';
import Svg, { Circle, G, Line as SvgLine, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import { cssColor } from './webStyle';
import { Text } from './text';

type Datum = Record<string, any>;
type Margin = { top?: number; right?: number; bottom?: number; left?: number };

// ── marker components (configurazione letta dal grafico padre) ───────────────
export const XAxis = (_: any) => null;
export const YAxis = (_: any) => null;
export const CartesianGrid = (_: any) => null;
export const Tooltip = (_: any) => null;
export const Legend = (_: any) => null;
export const Cell = (_: any) => null;
export const Bar = (_: any) => null;
export const Line = (_: any) => null;
export const Area = (_: any) => null;
export const ReferenceLine = (_: any) => null;
export const LabelList = (_: any) => null;
export const PolarGrid = (_: any) => null;
export const PolarAngleAxis = (_: any) => null;
export const PolarRadiusAxis = (_: any) => null;
export const Radar = (_: any) => null;

// ── ResponsiveContainer ──────────────────────────────────────────────────────
const SizeCtx = createContext<{ width: number; height: number } | null>(null);

export function ResponsiveContainer({ width = '100%', height = '100%', children, minHeight }: { width?: number | string; height?: number | string; children?: ReactNode; minHeight?: number }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    if (w !== size.width || h !== size.height) setSize({ width: w, height: h });
  };
  return (
    <View style={{ width: width as any, height: height as any, minHeight }} onLayout={onLayout}>
      {size.width > 0 && size.height > 0 && <SizeCtx.Provider value={size}>{children}</SizeCtx.Provider>}
    </View>
  );
}

function useSize(width?: number, height?: number) {
  const ctx = useContext(SizeCtx);
  return { width: width ?? ctx?.width ?? 300, height: height ?? ctx?.height ?? 200 };
}

// ── utilità ──────────────────────────────────────────────────────────────────
function flatChildren(children: ReactNode): ReactElement<any>[] {
  const out: ReactElement<any>[] = [];
  Children.forEach(children, (c) => {
    if (!isValidElement(c)) return;
    if (c.type === Fragment) out.push(...flatChildren((c.props as any).children));
    else out.push(c as ReactElement<any>);
  });
  return out;
}

/**
 * Tick dell'asse dei valori come recharts (getTicksOfScale): con dominio automatico (default
 * [0, 'auto']) tick "nice" e dominio esteso al primo/ultimo tick; con dominio fisso, tick dentro il dominio.
 */
function axisTicks(min: number, max: number, domain: unknown, allowDecimals = true, count = 5): { ticks: number[]; lo: number; hi: number } {
  const auto = !Array.isArray(domain) || domain[0] === 'auto' || domain[1] === 'auto';
  if (auto) {
    const ticks = getNiceTickValues([min, max], count, allowDecimals);
    return { ticks, lo: Math.min(...ticks), hi: Math.max(...ticks) };
  }
  return { ticks: getTickValuesFixedDomain([min, max], count, allowDecimals), lo: min, hi: max };
}

function valueDomain(data: Datum[], keys: string[], stacked: boolean, domain?: any[]): [number, number] {
  let min = 0;
  let max = 0;
  for (const d of data) {
    if (stacked) {
      const sum = keys.reduce((s, k) => s + (Number(d[k]) || 0), 0);
      max = Math.max(max, sum);
    } else {
      for (const k of keys) {
        const v = Number(d[k]);
        if (Number.isFinite(v)) { max = Math.max(max, v); min = Math.min(min, v); }
      }
    }
  }
  if (Array.isArray(domain)) {
    const resolve = (x: any, auto: number) => (typeof x === 'number' ? x : typeof x === 'function' ? x(auto) : auto);
    return [resolve(domain[0], min), resolve(domain[1], max)];
  }
  return [min, max];
}

/** Curva monotone (Fritsch–Carlson, come d3.curveMonotoneX). */
function monotonePath(pts: { x: number; y: number }[]) {
  const n = pts.length;
  if (n === 0) return '';
  if (n === 1) return `M${pts[0].x},${pts[0].y}`;
  const dx = pts.slice(1).map((p, i) => p.x - pts[i].x);
  const slope = pts.slice(1).map((p, i) => (p.y - pts[i].y) / (dx[i] || 1));
  const t = pts.map((_, i) => {
    if (i === 0) return slope[0];
    if (i === n - 1) return slope[n - 2];
    if (slope[i - 1] * slope[i] <= 0) return 0;
    return (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / slope[i - 1] + (dx[i] + 2 * dx[i - 1]) / slope[i]);
  });
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${pts[i].x + h},${pts[i].y + h * t[i]},${pts[i + 1].x - h},${pts[i + 1].y - h * t[i + 1]},${pts[i + 1].x},${pts[i + 1].y}`;
  }
  return d;
}

function linearPath(pts: { x: number; y: number }[]) {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join('');
}

/** Rettangolo con raggi [tl, tr, br, bl] come Bar radius. */
function roundedRect(x: number, y: number, w: number, h: number, radius: number | number[] = 0) {
  if (w <= 0 || h <= 0) return '';
  const r = (Array.isArray(radius) ? radius : [radius, radius, radius, radius]).map((v) => Math.min(v || 0, w / 2, h / 2));
  const [tl, tr, br, bl] = r;
  return `M${x + tl},${y}H${x + w - tr}Q${x + w},${y} ${x + w},${y + tr}V${y + h - br}Q${x + w},${y + h} ${x + w - br},${y + h}H${x + bl}Q${x},${y + h} ${x},${y + h - bl}V${y + tl}Q${x},${y} ${x + tl},${y}Z`;
}

const DEFAULT_TICK = { fill: '#666', fontSize: 12 };
const TICK_FONT = 'Inter_400Regular';

function TickText({ x, y, value, tick, anchor = 'middle', dy = 0 }: { x: number; y: number; value: string; tick: any; anchor?: 'start' | 'middle' | 'end'; dy?: number }) {
  const t = { ...DEFAULT_TICK, ...(tick && typeof tick === 'object' && !isValidElement(tick) ? tick : null) };
  return (
    <SvgText x={x} y={y} dy={dy} fill={cssColor(t.fill) ?? '#666'} fontSize={t.fontSize} fontWeight={t.fontWeight} textAnchor={anchor} fontFamily={TICK_FONT}>
      {value}
    </SvgText>
  );
}

function renderCustomTick(tick: any, props: any) {
  if (isValidElement(tick)) return cloneElement(tick as ReactElement<any>, props);
  if (typeof tick === 'function') return tick(props);
  return null;
}

// ── tooltip ──────────────────────────────────────────────────────────────────
function TooltipBox({ cfg, label, payload, x, chartWidth }: { cfg: any; label: any; payload: any[]; x: number; chartWidth: number }) {
  if (cfg.content) {
    const el = isValidElement(cfg.content)
      ? cloneElement(cfg.content as ReactElement<any>, { active: true, payload, label })
      : typeof cfg.content === 'function' ? cfg.content({ active: true, payload, label }) : null;
    return <View pointerEvents="none" style={{ position: 'absolute', top: 4, left: Math.min(Math.max(4, x - 70), chartWidth - 150) }}>{el}</View>;
  }
  const cs = cfg.contentStyle ?? {};
  const label2 = cfg.labelFormatter ? cfg.labelFormatter(label, payload) : label;
  return (
    <View pointerEvents="none" style={{
      position: 'absolute', top: 4, left: Math.min(Math.max(4, x - 70), Math.max(4, chartWidth - 150)),
      backgroundColor: cssColor(cs.backgroundColor ?? cs.background) ?? '#fff', borderColor: cssColor(cs.borderColor ?? (typeof cs.border === 'string' ? cs.border.split(' ').slice(2).join(' ') : undefined)) ?? '#ccc',
      borderWidth: 1, borderRadius: typeof cs.borderRadius === 'number' ? cs.borderRadius : parseFloat(cs.borderRadius) || 4, padding: 10, minWidth: 120,
    }}>
      {label2 != null && label2 !== '' && <Text style={{ fontSize: Number(cs.fontSize) || 12, color: cssColor(cfg.labelStyle?.color) ?? cssColor(cs.color) ?? '#333', marginBottom: 4 }}>{String(label2)}</Text>}
      {payload.map((p, i) => {
        const res = cfg.formatter ? cfg.formatter(p.value, p.name, p, i, payload) : p.value;
        const [val, name] = Array.isArray(res) ? res : [res, p.name];
        return (
          <Text key={i} style={{ fontSize: Number(cs.fontSize) || 12, color: cssColor(cfg.itemStyle?.color) ?? p.color ?? '#333' }}>
            {name != null && name !== '' ? `${name} : ` : ''}{String(val)}
          </Text>
        );
      })}
    </View>
  );
}

function LegendRow({ cfg, items }: { cfg: any; items: { name: string; color: string }[] }) {
  const ws = cfg.wrapperStyle ?? {};
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, paddingTop: Number(ws.paddingTop) || 4 }}>
      {items.map((it) => (
        <View key={it.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 10, height: 10, backgroundColor: it.color }} />
          <Text style={{ fontSize: Number(ws.fontSize) || 12, color: it.color }}>{it.name}</Text>
        </View>
      ))}
    </View>
  );
}

// ── grafici cartesiani ───────────────────────────────────────────────────────
type CartesianProps = {
  data?: Datum[]; width?: number; height?: number; margin?: Margin; layout?: 'horizontal' | 'vertical';
  barGap?: number; barCategoryGap?: number | string; children?: ReactNode; onClick?: (e: any) => void; stackOffset?: string;
};

function CartesianChart({ kind, data = [], width: w, height: h, margin, layout = 'horizontal', barGap = 4, barCategoryGap = '10%', children, onClick }: CartesianProps & { kind: 'bar' | 'line' | 'area' }) {
  const { width, height } = useSize(w, h);
  const [active, setActive] = useState<number | null>(null);
  const kids = flatChildren(children);
  const x = kids.find((c) => c.type === XAxis)?.props ?? null;
  const y = kids.find((c) => c.type === YAxis)?.props ?? null;
  const grid = kids.find((c) => c.type === CartesianGrid)?.props ?? null;
  const tooltip = kids.find((c) => c.type === Tooltip)?.props ?? null;
  const legend = kids.find((c) => c.type === Legend)?.props ?? null;
  const series = kids.filter((c) => c.type === Bar || c.type === Line || c.type === Area);
  const svgExtras = kids.filter((c) => ![XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line, Area, ReferenceLine, Cell].includes(c.type as any));
  const refLines = kids.filter((c) => c.type === ReferenceLine);

  const vertical = layout === 'vertical';
  const catAxis = vertical ? y : x;
  const valAxis = vertical ? x : y;
  const m = { top: 5, right: 5, bottom: 5, left: 5, ...margin };
  const yWidth = y?.hide ? 0 : y?.width ?? 60;
  const xHeight = x?.hide ? 0 : x?.height ?? 30;
  const legendH = legend ? 24 : 0;
  const plot = { left: m.left + yWidth, top: m.top, width: Math.max(10, width - m.left - m.right - yWidth), height: Math.max(10, height - m.top - m.bottom - xHeight - legendH) };

  const keys = series.map((s) => s.props.dataKey as string);
  const stacked = series.some((s) => s.props.stackId != null);
  const [dMin, dMax] = valueDomain(data, keys, stacked, valAxis?.domain);
  const { ticks, lo: vMin, hi: vMax } = useMemo(() => axisTicks(dMin, dMax, valAxis?.domain, valAxis?.allowDecimals !== false, valAxis?.tickCount ?? 5),
    [dMin, dMax, valAxis?.domain, valAxis?.allowDecimals, valAxis?.tickCount]);
  const span = vMax - vMin || 1;
  const valLen = vertical ? plot.width : plot.height;
  const valPos = (v: number) => (vertical ? plot.left + ((v - vMin) / span) * valLen : plot.top + plot.height - ((v - vMin) / span) * valLen);

  // asse categorie: bande (barre) o punti (linee/aree)
  const n = data.length || 1;
  const catLen = vertical ? plot.height : plot.width;
  const band = catLen / n;
  const pointMode = kind !== 'bar';
  const catPos = (i: number) => (pointMode ? (n === 1 ? catLen / 2 : (i * catLen) / (n - 1)) : i * band + band / 2) + (vertical ? plot.top : plot.left);
  const catKey = catAxis?.dataKey;
  const catLabel = (d: Datum, i: number) => {
    const raw = catKey ? d[catKey] : i;
    return catAxis?.tickFormatter ? catAxis.tickFormatter(raw, i) : raw;
  };

  // barre
  const barSeries = series.filter((s) => s.type === Bar);
  const gapPct = typeof barCategoryGap === 'string' ? parseFloat(barCategoryGap) / 100 : (barCategoryGap as number) / band;
  const groupSize = band * (1 - 2 * gapPct);
  const groups = stacked ? 1 : barSeries.length || 1;
  const maxBar = barSeries[0]?.props.maxBarSize ?? Infinity;
  const barSize = barSeries[0]?.props.barSize ?? Math.min(maxBar, (groupSize - barGap * (groups - 1)) / groups);

  // etichette asse categorie: salta quelle che si sovrappongono (interval preserveStartEnd)
  const tickEvery = (() => {
    if (typeof catAxis?.interval === 'number') return catAxis.interval + 1;
    if (vertical) return 1;
    const fs = catAxis?.tick?.fontSize ?? 12;
    const longest = Math.max(1, ...data.map((d, i) => String(catLabel(d, i) ?? '').length));
    const need = longest * fs * 0.6 + (catAxis?.minTickGap ?? 5);
    return Math.max(1, Math.ceil(need / (catLen / n)));
  })();

  const onTouch = (evtX: number, evtY: number) => {
    const pos = vertical ? evtY - plot.top : evtX - plot.left;
    const i = pointMode ? Math.round((pos / catLen) * (n - 1)) : Math.floor(pos / band);
    if (i >= 0 && i < data.length) {
      setActive(i);
      onClick?.({ activeTooltipIndex: i, activePayload: series.map((s) => ({ payload: data[i], value: data[i][s.props.dataKey], dataKey: s.props.dataKey, name: s.props.name ?? s.props.dataKey })), activeLabel: catKey ? data[i][catKey] : i });
    }
  };

  const colorOf = (s: ReactElement<any>) => cssColor(s.props.stroke ?? s.props.fill) ?? '#8884d8';
  const tooltipPayload = active != null ? series.map((s) => ({
    name: s.props.name ?? s.props.dataKey, dataKey: s.props.dataKey, value: data[active]?.[s.props.dataKey], payload: data[active],
    color: (() => { const cells = flatChildren(s.props.children).filter((c) => c.type === Cell); return cssColor(cells[active]?.props.fill) ?? colorOf(s); })(),
  })) : [];

  return (
    <View style={{ width, height }}>
      <Pressable onPress={(e) => onTouch(e.nativeEvent.locationX, e.nativeEvent.locationY)} style={{ width, height: height - legendH }}>
        <Svg width={width} height={height - legendH}>
          {svgExtras.map((el, i) => <Fragment key={`x${i}`}>{el}</Fragment>)}

          {/* griglia */}
          {grid && (
            <G>
              {grid.horizontal !== false && (vertical ? data.map((_, i) => catPos(i)) : ticks.map(valPos)).map((pos, i) => (
                <SvgLine key={`h${i}`} x1={plot.left} x2={plot.left + plot.width} y1={pos} y2={pos} stroke={cssColor(grid.stroke) ?? '#ccc'} strokeDasharray={grid.strokeDasharray} strokeOpacity={grid.strokeOpacity} />
              ))}
              {grid.vertical !== false && (vertical ? ticks.map(valPos) : data.map((_, i) => catPos(i))).map((pos, i) => (
                <SvgLine key={`v${i}`} y1={plot.top} y2={plot.top + plot.height} x1={pos} x2={pos} stroke={cssColor(grid.stroke) ?? '#ccc'} strokeDasharray={grid.strokeDasharray} strokeOpacity={grid.strokeOpacity} />
              ))}
            </G>
          )}

          {/* asse dei valori */}
          {valAxis && !valAxis.hide && ticks.map((t, i) => {
            const label = valAxis.tickFormatter ? valAxis.tickFormatter(t, i) : String(t);
            if (vertical) return <TickText key={`vt${i}`} x={valPos(t)} y={plot.top + plot.height + 14} value={String(label)} tick={valAxis.tick} />;
            return <TickText key={`vt${i}`} x={plot.left - 8} y={valPos(t)} dy={4} value={String(label)} tick={valAxis.tick} anchor="end" />;
          })}
          {/* asse delle categorie */}
          {catAxis && !catAxis.hide && data.map((d, i) => {
            if (i % tickEvery !== 0 && i !== data.length - 1) return null;
            const value = catLabel(d, i);
            const pos = catPos(i);
            const props = vertical
              ? { x: plot.left - 8, y: pos, payload: { value: catKey ? d[catKey] : i, index: i }, index: i, textAnchor: 'end', fill: '#666' }
              : { x: pos, y: plot.top + plot.height + 8, payload: { value: catKey ? d[catKey] : i, index: i }, index: i, textAnchor: 'middle', fill: '#666' };
            const custom = renderCustomTick(catAxis.tick, props);
            if (custom) return <G key={`ct${i}`}>{custom}</G>;
            return vertical
              ? <TickText key={`ct${i}`} x={plot.left - 8} y={pos} dy={4} value={String(value ?? '')} tick={catAxis.tick} anchor="end" />
              : <TickText key={`ct${i}`} x={pos} y={plot.top + plot.height + 16} value={String(value ?? '')} tick={catAxis.tick} />;
          })}
          {/* lineette dei tick (recharts: tickLine visibile, tickSize 6) */}
          {valAxis && !valAxis.hide && valAxis.tickLine !== false && ticks.map((t, i) => {
            const p = valPos(t);
            return vertical
              ? <SvgLine key={`vl${i}`} x1={p} x2={p} y1={plot.top + plot.height} y2={plot.top + plot.height + 6} stroke="#666" />
              : <SvgLine key={`vl${i}`} x1={plot.left - 6} x2={plot.left} y1={p} y2={p} stroke="#666" />;
          })}
          {catAxis && !catAxis.hide && catAxis.tickLine !== false && data.map((_, i) => {
            if (i % tickEvery !== 0 && i !== data.length - 1) return null;
            const p = catPos(i);
            return vertical
              ? <SvgLine key={`cl${i}`} x1={plot.left - 6} x2={plot.left} y1={p} y2={p} stroke="#666" />
              : <SvgLine key={`cl${i}`} x1={p} x2={p} y1={plot.top + plot.height} y2={plot.top + plot.height + 6} stroke="#666" />;
          })}
          {(x && !x.hide && x.axisLine !== false) && <SvgLine x1={plot.left} x2={plot.left + plot.width} y1={plot.top + plot.height} y2={plot.top + plot.height} stroke="#666" />}
          {(y && !y.hide && y.axisLine !== false) && <SvgLine x1={plot.left} x2={plot.left} y1={plot.top} y2={plot.top + plot.height} stroke="#666" />}

          {/* serie */}
          {(() => {
            const stackBase = data.map(() => 0);
            return series.map((s, si) => {
              const key = s.props.dataKey;
              if (s.type === Bar) {
                const cells = flatChildren(s.props.children).filter((c) => c.type === Cell);
                const bi = barSeries.indexOf(s);
                return (
                  <G key={`s${si}`}>
                    {data.map((d, i) => {
                      const v = Number(d[key]) || 0;
                      const base = stacked ? stackBase[i] : 0;
                      if (stacked) stackBase[i] += v;
                      const fill = cssColor(cells[i]?.props.fill ?? s.props.fill) ?? '#8884d8';
                      const start = (vertical ? plot.top : plot.left) + i * band + (band - (stacked ? barSize : barSize * groups + barGap * (groups - 1))) / 2 + (stacked ? 0 : bi * (barSize + barGap));
                      const a = valPos(base);
                      const b2 = valPos(base + v);
                      const rect = vertical
                        ? { x: Math.min(a, b2), y: start, w: Math.abs(b2 - a), h: barSize }
                        : { x: start, y: Math.min(a, b2), w: barSize, h: Math.abs(b2 - a) };
                      return <Path key={i} d={roundedRect(rect.x, rect.y, rect.w, rect.h, s.props.radius)} fill={fill} fillOpacity={cells[i]?.props.fillOpacity ?? s.props.fillOpacity} opacity={active != null && active !== i ? 0.85 : 1} />;
                    })}
                  </G>
                );
              }
              const pts = data.map((d, i) => ({ x: catPos(i), y: valPos(Number(d[key]) || 0) }));
              const curve = s.props.type === 'monotone' ? monotonePath(pts) : linearPath(pts);
              const stroke = cssColor(s.props.stroke) ?? '#3182bd';
              const showDots = s.props.dot !== false && s.type === Line;
              return (
                <G key={`s${si}`}>
                  {s.type === Area && pts.length > 0 && (
                    <Path d={`${curve}L${pts[pts.length - 1].x},${plot.top + plot.height}L${pts[0].x},${plot.top + plot.height}Z`}
                      fill={s.props.fill?.startsWith?.('url(') ? s.props.fill : cssColor(s.props.fill) ?? stroke} fillOpacity={s.props.fillOpacity ?? (s.props.fill?.startsWith?.('url(') ? 1 : 0.6)} />
                  )}
                  <Path d={curve} fill="none" stroke={stroke} strokeWidth={s.props.strokeWidth ?? (s.type === Line ? 1 : 1)} strokeDasharray={s.props.strokeDasharray} />
                  {showDots && pts.map((p, i) => <Circle key={i} cx={p.x} cy={p.y} r={typeof s.props.dot === 'object' ? s.props.dot.r ?? 3 : 3} fill={typeof s.props.dot === 'object' ? cssColor(s.props.dot.fill) ?? stroke : '#fff'} stroke={stroke} strokeWidth={1} />)}
                  {active != null && pts[active] && <Circle cx={pts[active].x} cy={pts[active].y} r={4} fill={stroke} />}
                </G>
              );
            });
          })()}

          {refLines.map((r, i) => {
            const p = r.props;
            if (p.y != null) return <SvgLine key={`r${i}`} x1={plot.left} x2={plot.left + plot.width} y1={valPos(p.y)} y2={valPos(p.y)} stroke={cssColor(p.stroke) ?? '#ccc'} strokeDasharray={p.strokeDasharray} />;
            return null;
          })}

          {/* cursore del tooltip */}
          {tooltip && active != null && kind !== 'bar' && <SvgLine x1={catPos(active)} x2={catPos(active)} y1={plot.top} y2={plot.top + plot.height} stroke="#ccc" />}
        </Svg>
        {tooltip && active != null && <TooltipBox cfg={tooltip} label={catKey ? data[active]?.[catKey] : active} payload={tooltipPayload} x={catPos(active)} chartWidth={width} />}
      </Pressable>
      {legend && <LegendRow cfg={legend} items={series.map((s) => ({ name: s.props.name ?? s.props.dataKey, color: colorOf(s) }))} />}
    </View>
  );
}

export const BarChart = (p: CartesianProps) => <CartesianChart kind="bar" {...p} />;
export const LineChart = (p: CartesianProps) => <CartesianChart kind="line" {...p} />;
export const AreaChart = (p: CartesianProps) => <CartesianChart kind="area" {...p} />;
export const ComposedChart = (p: CartesianProps) => <CartesianChart kind="line" {...p} />;

// ── RadarChart ───────────────────────────────────────────────────────────────
export function RadarChart({ data = [], width: w, height: h, cx, cy, outerRadius, children }: { data?: Datum[]; width?: number; height?: number; cx?: number | string; cy?: number | string; outerRadius?: number | string; children?: ReactNode }) {
  const { width, height } = useSize(w, h);
  const kids = flatChildren(children);
  const angleAxis = kids.find((c) => c.type === PolarAngleAxis)?.props;
  const radiusAxis = kids.find((c) => c.type === PolarRadiusAxis)?.props;
  const gridCfg = kids.find((c) => c.type === PolarGrid)?.props;
  const radars = kids.filter((c) => c.type === Radar);
  const pct = (v: any, total: number, def: number) => (typeof v === 'string' && v.endsWith('%') ? (parseFloat(v) / 100) * total : typeof v === 'number' ? v : def);
  const centerX = pct(cx, width, width / 2);
  const centerY = pct(cy, height, height / 2);
  // come recharts: margine di 5px per lato, raggio massimo = metà del lato minore, default 80%
  const maxRadius = Math.min(width - 10, height - 10) / 2;
  const R = pct(outerRadius ?? '80%', maxRadius, maxRadius * 0.8);
  const n = data.length || 1;
  // asse del raggio come recharts: dominio [0, 'auto'] (o quello dato) e anelli della griglia ai suoi tick
  const dataMax = Math.max(0, ...radars.flatMap((r) => data.map((d) => Number(d[r.props.dataKey]) || 0)));
  const rDomain = radiusAxis?.domain;
  const rMin = Array.isArray(rDomain) && typeof rDomain[0] === 'number' ? rDomain[0] : 0;
  const rMax = Array.isArray(rDomain) && typeof rDomain[1] === 'number' ? rDomain[1] : dataMax;
  const radial = axisTicks(rMin, rMax, rDomain ?? [0, 'auto'], radiusAxis?.allowDecimals !== false, radiusAxis?.tickCount ?? 5);
  const maxV = radial.hi - radial.lo || 1;
  const point = (i: number, r: number) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return { x: centerX + r * Math.cos(a), y: centerY + r * Math.sin(a) };
  };
  return (
    <Svg width={width} height={height}>
      {gridCfg !== undefined && radial.ticks.map((t) => (t - radial.lo) / maxV).filter((f) => f > 0).map((f) => (
        <Polygon key={f} points={data.map((_, i) => { const p = point(i, R * f); return `${p.x},${p.y}`; }).join(' ')} fill="none" stroke={cssColor(gridCfg?.stroke) ?? '#ccc'} />
      ))}
      {gridCfg !== undefined && data.map((_, i) => { const p = point(i, R); return <SvgLine key={i} x1={centerX} y1={centerY} x2={p.x} y2={p.y} stroke={cssColor(gridCfg?.stroke) ?? '#ccc'} />; })}
      {radars.map((r, ri) => (
        <Polygon key={ri}
          points={data.map((d, i) => { const p = point(i, (R * (Number(d[r.props.dataKey]) || 0)) / maxV); return `${p.x},${p.y}`; }).join(' ')}
          fill={cssColor(r.props.fill) ?? '#8884d8'} fillOpacity={r.props.fillOpacity ?? 0.6} stroke={cssColor(r.props.stroke) ?? 'none'} strokeWidth={r.props.strokeWidth ?? 1} />
      ))}
      {radars.map((r, ri) => {
        // dot={{ fill, r }} o dot: pallini sui vertici (come recharts: props del Radar + quelle del dot)
        const dot = r.props.dot;
        if (!dot) return null;
        const cfg = typeof dot === 'object' && !isValidElement(dot) ? dot : {};
        return data.map((d, i) => {
          const p = point(i, (R * (Number(d[r.props.dataKey]) || 0)) / maxV);
          return <Circle key={`${ri}-${i}`} cx={p.x} cy={p.y} r={cfg.r ?? 3} fill={cssColor(cfg.fill ?? r.props.fill) ?? '#8884d8'} fillOpacity={cfg.fillOpacity ?? r.props.fillOpacity ?? 1}
            stroke={cssColor(cfg.stroke ?? r.props.stroke) ?? 'none'} strokeWidth={cfg.strokeWidth ?? r.props.strokeWidth ?? 1} />;
        });
      })}
      {angleAxis && data.map((d, i) => {
        // etichette come PolarAngleAxis: a tickSize (8) oltre il raggio, ancorate secondo il lato
        const p = point(i, R + (angleAxis.tickSize ?? 8));
        const cos = Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / n);
        const anchor = cos > 1e-5 ? 'start' : cos < -1e-5 ? 'end' : 'middle';
        const value = angleAxis.dataKey ? d[angleAxis.dataKey] : i;
        const custom = renderCustomTick(angleAxis.tick, { x: p.x, y: p.y, payload: { value }, index: i, textAnchor: anchor });
        if (custom) return <G key={i}>{custom}</G>;
        return <TickText key={i} x={p.x} y={p.y} anchor={anchor} value={String(value)} tick={angleAxis.tick} />;
      })}
    </Svg>
  );
}

export { Rect as RechartsRect };
