// PORT: animazioni della tela Comitive sul telefono (nessun equivalente nel file originale).
// L'originale usa <animateMotion>/<animate> SVG e keyframe CSS nel <style> dell'editor; react-native-svg
// e NativeWind non li eseguono. Qui gli stessi tempi e valori con Reanimated sul thread UI:
//   particelle sui fili (animateMotion + opacity 0;.95;.95;0 a 0;.15;.85;1), cm-wire-flow (dashoffset 28→0),
//   cm-end-pulse (opacity .6↔.1, r 3.5↔8), cm-beat (battito dei terminali), cm-pop-in (nascita card),
//   cm-drop-ring (anello al rilascio). Un solo orologio per tela: fermo durante pan/zoom/trascinamento
//   (come .cm-paused) e quando la schermata non è a fuoco.
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import Animated, {
  Easing, Keyframe, useAnimatedProps, useAnimatedStyle, useFrameCallback, useSharedValue, withDelay, withTiming,
} from 'react-native-reanimated';
import { Circle, G, Path } from 'react-native-svg';
import { useScreenFocused } from '@/ui/fixedPortal';

const ACircle = Animated.createAnimatedComponent(Circle);
const AG = Animated.createAnimatedComponent(G);
const APath = Animated.createAnimatedComponent(Path);

const ClockCtx = createContext(null);

/** Orologio condiviso (secondi) per le animazioni dei fili; `paused` lo ferma senza azzerarlo. */
export function WireClock({ paused, children }) {
  const focused = useScreenFocused();
  const t = useSharedValue(0);
  const cb = useFrameCallback((f) => {
    'worklet';
    t.value += Math.min(f.timeSincePreviousFrame ?? 0, 100) / 1000;
  }, false);
  const active = focused && !paused;
  useEffect(() => { cb.setActive(active); }, [active, cb]);
  return <ClockCtx.Provider value={t}>{children}</ClockCtx.Provider>;
}

function useClock() {
  const t = useContext(ClockCtx);
  const fallback = useSharedValue(0);
  return t || fallback;
}

/* ── Particelle (animateMotion) ── */
const LUT_N = 32;
function bez(p0, p1, p2, p3, s) {
  const u = 1 - s;
  return u * u * u * p0 + 3 * u * u * s * p1 + 3 * u * s * s * p2 + s * s * s * p3;
}
/** Punti del filo a passo costante di lunghezza (animateMotion va a velocità costante). */
export function wireLut(w) {
  const raw = [];
  for (let i = 0; i <= LUT_N * 2; i++) {
    const s = i / (LUT_N * 2);
    raw.push([bez(w.from.x, w.c1.x, w.c2.x, w.to.x, s), bez(w.from.y, w.c1.y, w.c2.y, w.to.y, s)]);
  }
  const acc = [0];
  for (let i = 1; i < raw.length; i++) acc.push(acc[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]));
  const total = acc[acc.length - 1] || 1;
  const xs = [];
  const ys = [];
  let j = 0;
  for (let i = 0; i <= LUT_N; i++) {
    const target = (i / LUT_N) * total;
    while (j < acc.length - 2 && acc[j + 1] < target) j++;
    const seg = acc[j + 1] - acc[j] || 1;
    const k = Math.min(Math.max((target - acc[j]) / seg, 0), 1);
    xs.push(raw[j][0] + (raw[j + 1][0] - raw[j][0]) * k);
    ys.push(raw[j][1] + (raw[j + 1][1] - raw[j][1]) * k);
  }
  return { xs, ys };
}

function ParticleCircle({ lut, dur, delay, peak, r, fill, fillOpacity }) {
  const t = useClock();
  const { xs, ys } = lut;
  const props = useAnimatedProps(() => {
    const local = t.value - delay;
    if (local < 0) return { cx: xs[0], cy: ys[0], opacity: 0 };
    const p = (local % dur) / dur;
    const f = p * (xs.length - 1);
    const i = Math.min(Math.floor(f), xs.length - 2);
    const k = f - i;
    const op = p < 0.15 ? (p / 0.15) * peak : p > 0.85 ? ((1 - p) / 0.15) * peak : peak;
    return { cx: xs[i] + (xs[i + 1] - xs[i]) * k, cy: ys[i] + (ys[i + 1] - ys[i]) * k, opacity: op };
  }, [xs, ys, dur, delay, peak]);
  return <ACircle r={r} fill={fill} fillOpacity={fillOpacity} animatedProps={props} />;
}

/** Le due particelle di un filo (stessi raggi, colori, durate e ritardi dell'originale). */
export function WireParticles({ w, color, hot, idx }) {
  const lut = useMemo(() => wireLut(w), [w.d]); // eslint-disable-line react-hooks/exhaustive-deps
  const dur = hot ? 1.6 : 2.8;
  const delay = (idx * 0.55) % 3;
  const delay2 = (idx * 0.55 + 1.4) % 3;
  return (
    <>
      <ParticleCircle lut={lut} dur={dur} delay={delay} peak={0.95} r={hot ? 6 : 5} fill={color} fillOpacity={0.22} />
      <ParticleCircle lut={lut} dur={dur} delay={delay} peak={0.95} r={hot ? 2.6 : 2.1} fill={color} />
      <ParticleCircle lut={lut} dur={dur} delay={delay} peak={0.95} r={hot ? 1.2 : 0.9} fill="white" fillOpacity={0.9} />
      <ParticleCircle lut={lut} dur={dur} delay={delay2} peak={0.9} r={hot ? 3.6 : 2.8} fill="white" fillOpacity={0.14} />
      <ParticleCircle lut={lut} dur={dur} delay={delay2} peak={0.9} r={hot ? 1.6 : 1.2} fill="white" fillOpacity={0.6} />
    </>
  );
}

/* ── cm-wire-flow: tratteggio che scorre ── */
export function FlowPath({ period, ...rest }) {
  const t = useClock();
  const props = useAnimatedProps(() => ({ strokeDashoffset: 28 - ((t.value % period) / period) * 28 }), [period]);
  return <APath {...rest} animatedProps={props} />;
}

/* ── cm-end-pulse: anello che si allarga e sfuma (ease-in-out) ── */
export function PulseCircle({ period, ...rest }) {
  const t = useClock();
  const props = useAnimatedProps(() => {
    const p = (t.value % period) / period;
    const h = p < 0.5 ? p * 2 : (1 - p) * 2;
    const e = h < 0.5 ? 2 * h * h : 1 - Math.pow(-2 * h + 2, 2) / 2;
    return { r: 3.5 + 4.5 * e, opacity: 0.6 - 0.5 * e };
  }, [period]);
  return <ACircle {...rest} animatedProps={props} />;
}

/* ── cm-beat: 0/100% 1, 12% .35, 24% 1, 36% .5, 52% 1 (1.8s) ── */
const BEAT_T = [0, 0.12, 0.24, 0.36, 0.52, 1];
const BEAT_V = [1, 0.35, 1, 0.5, 1, 1];
export function HeartbeatG({ children }) {
  const t = useClock();
  const props = useAnimatedProps(() => {
    const p = (t.value % 1.8) / 1.8;
    let i = 0;
    while (i < BEAT_T.length - 2 && p > BEAT_T[i + 1]) i++;
    const k = (p - BEAT_T[i]) / (BEAT_T[i + 1] - BEAT_T[i]);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    return { opacity: BEAT_V[i] + (BEAT_V[i + 1] - BEAT_V[i]) * e };
  });
  return <AG animatedProps={props}>{children}</AG>;
}

/* ── cm-pop-in: 0% scale .3 opacity 0 · 55% scale 1.07 opacity 1 · 75% .97 · 100% 1 (560ms) ── */
const POP_IN = new Keyframe({
  0: { transform: [{ scale: 0.3 }], opacity: 0 },
  55: { transform: [{ scale: 1.07 }], opacity: 1, easing: Easing.bezier(0.2, 0.9, 0.3, 1.1) },
  75: { transform: [{ scale: 0.97 }], opacity: 1, easing: Easing.bezier(0.2, 0.9, 0.3, 1.1) },
  100: { transform: [{ scale: 1 }], opacity: 1, easing: Easing.bezier(0.2, 0.9, 0.3, 1.1) },
}).duration(560);

/** Sul web passa i figli così come sono (lì vale il keyframe CSS). Conta solo `entering` al montaggio. */
export function PopIn({ entering, children }) {
  if (Platform.OS === 'web') return children;
  return <Animated.View entering={entering ? POP_IN : undefined}>{children}</Animated.View>;
}

/* ── cm-drop-ring: centro sul punto, scale .3 → 2.4, opacity .85 → 0 ── */
export function DropRing({ size, duration, delay = 0, easing, style }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withTiming(1, { duration, easing }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const anim = useAnimatedStyle(() => ({
    opacity: 0.85 * (1 - p.value),
    transform: [{ scale: 0.3 + 2.1 * p.value }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', left: -size / 2, top: -size / 2, width: size, height: size, borderRadius: size / 2 }, style, anim]}
    />
  );
}
export const DROP_EASE = Easing.bezier(0.2, 0.7, 0.3, 1);
export const EASE_OUT_CSS = Easing.bezier(0, 0, 0.58, 1);

/* ── .cm-list-dragging (telefono): niente CSS, stili diretti sugli elementi della lista ──
   Solo le righe con data-drag-payload (quelle senza opacity-50): alla fine tornano ai valori delle classi
   (bg-white/[0.04], border-white/5, opacità 1). */
export function listDragHighlight(list, active, on) {
  if (Platform.OS === 'web' || !list?.querySelectorAll) return;
  for (const n of list.querySelectorAll('[data-drag-payload]')) {
    try {
      if (!on) {
        n.setNativeProps?.({ style: { opacity: 1, transform: [{ scale: 1 }], backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.05)' } });
      } else if (n === active) {
        n.setNativeProps?.({ style: { opacity: 1, transform: [{ scale: 1.03 }], backgroundColor: 'rgba(124,58,237,0.24)', borderColor: 'rgba(167,139,250,0.9)' } });
      } else {
        n.setNativeProps?.({ style: { opacity: 0.32 } });
      }
    } catch { /* istanza smontata */ }
  }
}

/* ── cm-ghost-pick / cm-ghost-land / cm-ghost-back: etichetta trascinata dalla lista ── */
const GHOST_EASE_LAND = Easing.bezier(0.4, 0, 0.2, 1);
const GHOST_EASE_IN = Easing.bezier(0.42, 0, 1, 1);
const GHOST_EASE_OUT = Easing.bezier(0, 0, 0.58, 1);
export function GhostAnim({ phase, children }) {
  const pick = useSharedValue(Platform.OS === 'web' ? 1 : 0);
  const end = useSharedValue(0);
  const h = useSharedValue(40);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (phase === 'drag') { end.value = 0; pick.value = withTiming(1, { duration: 160, easing: GHOST_EASE_OUT }); }
    else end.value = withTiming(1, phase === 'land' ? { duration: 320, easing: GHOST_EASE_LAND } : { duration: 260, easing: GHOST_EASE_IN });
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
  const land = phase === 'land';
  const style = useAnimatedStyle(() => {
    const e = end.value;
    const scale = (0.7 + 0.3 * pick.value) * (land ? 1 + 0.45 * e : 1 - 0.4 * e);
    return {
      opacity: pick.value * (1 - e),
      transform: [{ translateY: land ? 0.78 * h.value * e : 0 }, { scale }],
    };
  }, [land]);
  if (Platform.OS === 'web') return children;
  return (
    <Animated.View style={style} onLayout={(ev) => { h.value = ev.nativeEvent.layout.height; }}>
      {children}
    </Animated.View>
  );
}
