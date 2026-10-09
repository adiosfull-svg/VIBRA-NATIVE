// Converte gli oggetti `style` scritti per il web (CSS) in stile React Native:
//  - colori: hsl(var(--primary) / 0.55), hsl(240,5%,50%), var(--x) → #rrggbbaa
//  - background(Image): linear-gradient(...) → descrittore gradiente (reso da Div/Btn)
//  - boxShadow: '0 0 12px -2px <colore>' → shadow* (iOS) + elevation (Android)
//  - textShadow, transform in stringa, misure '12px'
//  - proprietà solo-web (filter, transition, cursor, willChange...) → scartate
import { THEME } from './palette.generated.ts';
import type { Gradient } from './webClasses.ts';

type AnyStyle = Record<string, any>;
export type WebStyleResult = { style: AnyStyle; gradient?: Gradient & { angle?: number; locations?: number[] } };

const DROP = new Set([
  'filter', 'backdropFilter', 'WebkitBackdropFilter', 'transition', 'transitionDelay', 'animation', 'animationDelay',
  'animationDuration', 'cursor', 'willChange', 'touchAction', 'userSelect', 'WebkitUserSelect', 'WebkitTapHighlightColor',
  'WebkitTouchCallout', 'pointerEvents', 'overscrollBehavior', 'scrollbarWidth', 'msOverflowStyle', 'WebkitOverflowScrolling',
  'WebkitTransform', 'transformOrigin', 'contain', 'isolation', 'mixBlendMode', 'outline', 'visibility', 'clipPath',
  'maskImage', 'WebkitMaskImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat', 'boxSizing', 'whiteSpace',
  'wordBreak', 'overflowWrap', 'textOverflow', 'WebkitLineClamp', 'WebkitBoxOrient', 'listStyle', 'resize', 'appearance',
  'WebkitAppearance', 'scrollBehavior', 'scrollMarginTop', 'caretColor', 'accentColor', 'fontFeatureSettings',
  'fontVariantNumeric', 'gridTemplateColumns', 'gridColumn', 'gridRow', 'animationFillMode', 'imageRendering',
]);
const COLOR_KEYS = new Set(['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'shadowColor', 'textShadowColor', 'tintColor', 'textDecorationColor']);

function hex2(n: number) {
  return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
}
function hslToHex(h: number, s: number, l: number, a = 1) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const f = (n: number) => l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return `#${hex2(f(0) * 255)}${hex2(f(8) * 255)}${hex2(f(4) * 255)}${a < 1 ? hex2(a * 255) : ''}`;
}
function alphaOf(v?: string) {
  if (v == null) return 1;
  const t = v.trim();
  return t.endsWith('%') ? Number(t.slice(0, -1)) / 100 : Number(t);
}
function withAlpha(hex: string, a: number) {
  const base = hex.slice(0, 7);
  const prev = hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1;
  const final = prev * a;
  return final >= 1 ? base : `${base}${hex2(final * 255)}`;
}

/** Risolve un colore CSS in un colore accettato da React Native (o undefined). */
export function cssColor(input: unknown): string | undefined {
  if (typeof input !== 'string') return undefined;
  const v = input.trim();
  let m: RegExpMatchArray | null;
  // hsl(var(--primary)) / hsl(var(--primary) / 0.55)
  if ((m = v.match(/^hsla?\(\s*var\(--([a-z0-9-]+)\)\s*(?:\/\s*([\d.]+%?))?\s*\)$/i))) {
    const key = m[1] === 'sidebar-background' ? 'sidebar' : m[1];
    const hex = THEME[key];
    return hex ? withAlpha(hex, alphaOf(m[2])) : undefined;
  }
  if ((m = v.match(/^var\(--([a-z0-9-]+)\)$/i))) return THEME[m[1]];
  // hsl(240,5%,50%) | hsl(240 5% 50% / .5) | hsla(240,5%,50%,0.5)
  if ((m = v.match(/^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%\s*(?:[,/]\s*([\d.]+%?))?\s*\)$/i))) {
    return hslToHex(Number(m[1]), Number(m[2]), Number(m[3]), alphaOf(m[4]));
  }
  if (v === 'currentColor' || v === 'inherit' || v === 'initial') return undefined;
  return v; // #hex, rgb(a), nomi: già validi in RN
}

/** '12px' → 12, '1.5rem' → 24, '50%' → '50%', calc/vh/env → undefined */
export function cssLength(v: unknown): number | string | undefined {
  if (typeof v === 'number') return v;
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  let m: RegExpMatchArray | null;
  if ((m = t.match(/^(-?[\d.]+)px$/))) return Number(m[1]);
  if ((m = t.match(/^(-?[\d.]+)rem$/))) return Number(m[1]) * 16;
  if ((m = t.match(/^(-?[\d.]+)%$/))) return t;
  if ((m = t.match(/^-?[\d.]+$/))) return Number(t);
  if (t === 'auto') return 'auto';
  return undefined;
}

/** Divide per virgole di primo livello (non dentro parentesi). */
function splitTop(s: string, sep = ','): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === sep && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const DIR_ANGLE: Record<string, number> = {
  'to top': 0, 'to right': 90, 'to bottom': 180, 'to left': 270,
  'to top right': 45, 'to right top': 45, 'to bottom right': 135, 'to right bottom': 135,
  'to bottom left': 225, 'to left bottom': 225, 'to top left': 315, 'to left top': 315,
};

/** linear-gradient(135deg, #a 0%, #b 100%) → { angle, colors, locations } */
export function parseLinearGradient(v: string): WebStyleResult['gradient'] | undefined {
  const m = v.match(/linear-gradient\((.*)\)\s*$/s);
  if (!m) return undefined;
  const parts = splitTop(m[1]);
  let angle = 180;
  if (/^-?[\d.]+deg$/.test(parts[0])) angle = parseFloat(parts.shift()!);
  else if (parts[0]?.startsWith('to ')) angle = DIR_ANGLE[parts.shift()!] ?? 180;
  const colors: string[] = [];
  const locations: number[] = [];
  parts.forEach((p, i) => {
    const sm = p.match(/^(.*?)(?:\s+([\d.]+)%)?$/);
    const c = cssColor(sm?.[1] ?? p);
    if (!c) return;
    colors.push(c);
    locations.push(sm?.[2] != null ? Number(sm[2]) / 100 : parts.length === 1 ? 0 : i / (parts.length - 1));
  });
  if (colors.length === 1) { colors.push(colors[0]); locations.push(1); }
  return colors.length ? { dir: 'angle', angle, colors, locations } : undefined;
}

/** Estrae il primo colore (#hex o funzione rgb/hsl con parentesi annidate) da una stringa CSS. */
function extractColor(s: string): string | undefined {
  const hex = s.match(/#[0-9a-f]{3,8}\b/i);
  const fn = s.search(/(rgba?|hsla?)\(/i);
  if (fn >= 0 && (!hex || fn < (hex.index ?? 0))) {
    let depth = 0;
    for (let i = s.indexOf('(', fn); i < s.length; i++) {
      if (s[i] === '(') depth++;
      if (s[i] === ')' && --depth === 0) return s.slice(fn, i + 1);
    }
  }
  return hex?.[0];
}

/** Primo box-shadow non inset → ombra RN (iOS) + elevation (Android). */
function parseBoxShadow(v: string): AnyStyle {
  const shadows = splitTop(v).filter((s) => !/^inset\b/.test(s) && s !== 'none');
  if (!shadows.length) return {};
  const s = shadows[0];
  const color = extractColor(s);
  const nums = s.replace(color ?? '', '').trim().split(/\s+/).map((n) => parseFloat(n)).filter((n) => !Number.isNaN(n));
  const [x = 0, y = 0, blur = 0] = nums;
  const c = cssColor(color ?? 'rgba(0,0,0,0.25)');
  return {
    shadowColor: c,
    shadowOffset: { width: x, height: y },
    shadowOpacity: 1,
    shadowRadius: blur / 2,
    elevation: Math.min(24, Math.round(blur / 3)),
  };
}

function parseTextShadow(v: string): AnyStyle {
  const s = splitTop(v)[0];
  if (!s || s === 'none') return {};
  const color = extractColor(s);
  const [x = 0, y = 0, blur = 0] = s.replace(color ?? '', '').trim().split(/\s+/).map(parseFloat);
  return { textShadowColor: cssColor(color ?? '#000'), textShadowOffset: { width: x, height: y }, textShadowRadius: blur };
}

function parseTransform(v: string): AnyStyle[] | undefined {
  const out: AnyStyle[] = [];
  for (const m of v.matchAll(/(\w+)\(([^)]*)\)/g)) {
    const [fn, raw] = [m[1], m[2].split(/[\s,]+/).filter(Boolean)];
    const px = (s?: string) => (s && !s.endsWith('%') ? parseFloat(s) : undefined);
    switch (fn) {
      case 'translateX': if (px(raw[0]) != null) out.push({ translateX: px(raw[0]) }); break;
      case 'translateY': if (px(raw[0]) != null) out.push({ translateY: px(raw[0]) }); break;
      case 'translate':
      case 'translate3d':
        if (px(raw[0]) != null) out.push({ translateX: px(raw[0]) });
        if (px(raw[1]) != null) out.push({ translateY: px(raw[1]) });
        break;
      case 'scale': out.push({ scale: parseFloat(raw[0]) }); break;
      case 'scaleX': out.push({ scaleX: parseFloat(raw[0]) }); break;
      case 'scaleY': out.push({ scaleY: parseFloat(raw[0]) }); break;
      case 'rotate': out.push({ rotate: raw[0] }); break;
      default: break;
    }
  }
  return out.length ? out : undefined;
}

export function webStyle(input: unknown): WebStyleResult {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { style: (input as AnyStyle) ?? {} };
  const style: AnyStyle = {};
  let gradient: WebStyleResult['gradient'];
  for (const [k, v] of Object.entries(input as AnyStyle)) {
    if (v == null || DROP.has(k)) continue;
    if (k === 'background' || k === 'backgroundImage') {
      if (typeof v === 'string' && v.includes('linear-gradient')) { gradient = parseLinearGradient(v); continue; }
      if (typeof v === 'string' && v.includes('gradient')) continue; // radial/conic: non supportati
      const c = cssColor(v);
      if (c) style.backgroundColor = c;
      continue;
    }
    if (k === 'boxShadow') { if (typeof v === 'string') Object.assign(style, parseBoxShadow(v)); continue; }
    if (k === 'textShadow') { if (typeof v === 'string') Object.assign(style, parseTextShadow(v)); continue; }
    if (k === 'transform') {
      if (Array.isArray(v)) style.transform = v;
      else if (typeof v === 'string') { const t = parseTransform(v); if (t) style.transform = t; }
      continue;
    }
    if (/^border(Top|Right|Bottom|Left)?$/.test(k) && typeof v === 'string') {
      // border: '1px solid <colore>' (anche per lato)
      const side = k.slice(6);
      if (v === 'none' || v === '0') { style[`border${side}Width`] = 0; continue; }
      const m = v.match(/^([\d.]+)px\s+(\w+)\s+(.+)$/);
      if (m) {
        style[`border${side}Width`] = Number(m[1]);
        if (!side) style.borderStyle = m[2] === 'dashed' || m[2] === 'dotted' ? m[2] : 'solid';
        style[`border${side}Color`] = cssColor(m[3]);
      }
      continue;
    }
    if (k === 'borderRadius' && typeof v === 'string' && /\s/.test(v.trim())) {
      // '0 0 7px 0' → angoli singoli (TL, TR, BR, BL)
      const parts = v.trim().split(/\s+/).map((x) => cssLength(x));
      const [tl, tr = tl, br = tl, bl = tr] = parts as number[];
      Object.assign(style, { borderTopLeftRadius: tl, borderTopRightRadius: tr, borderBottomRightRadius: br, borderBottomLeftRadius: bl });
      continue;
    }
    if ((k === 'padding' || k === 'margin') && typeof v === 'string' && /\s/.test(v.trim())) {
      // shorthand '4px 8px' / '0 4px 2px' / '1px 2px 3px 4px'
      const parts = v.trim().split(/\s+/).map((x) => cssLength(x));
      const [t, r = t, bo = t, l = r] = parts;
      Object.assign(style, { [`${k}Top`]: t, [`${k}Right`]: r, [`${k}Bottom`]: bo, [`${k}Left`]: l });
      continue;
    }
    if (k === 'display' && v !== 'none' && v !== 'flex') continue;
    if (k === 'position' && v !== 'absolute' && v !== 'relative') { if (v === 'fixed' || v === 'sticky') style.position = v === 'fixed' ? 'absolute' : 'relative'; continue; }
    if (COLOR_KEYS.has(k) || k === 'fill' || k === 'stroke') { const c = cssColor(v); if (c) style[k] = c; continue; }
    if (k === 'fontWeight') { style.fontWeight = String(v); continue; }
    if (typeof v === 'string' && k !== 'fontFamily' && k !== 'textAlign' && k !== 'flexDirection' && k !== 'alignItems'
      && k !== 'justifyContent' && k !== 'alignSelf' && k !== 'overflow' && k !== 'textTransform' && k !== 'fontStyle'
      && k !== 'flexWrap' && k !== 'textDecorationLine' && k !== 'borderStyle' && k !== 'objectFit' && k !== 'aspectRatio'
      && k !== 'flex' && k !== 'rotate') {
      const len = cssLength(v);
      if (len === undefined) continue; // calc(), vh, env(): non convertibili
      style[k] = len;
      continue;
    }
    if (k === 'flex' && typeof v === 'string') { const n = parseFloat(v); if (!Number.isNaN(n)) style.flex = n; continue; }
    style[k] = v;
  }
  // display:flex inline: sul web la direzione di default è la riga
  if ((input as AnyStyle).display === 'flex' && !(input as AnyStyle).flexDirection) style.flexDirection = 'row';
  // borderRadius in percentuale (es. '50%' per i cerchi): RN accetta solo numeri
  const br = (input as AnyStyle).borderRadius;
  if (typeof br === 'string' && br.trim().endsWith('%')) {
    const size = typeof style.width === 'number' ? style.width : typeof style.height === 'number' ? style.height : undefined;
    if (size != null) style.borderRadius = (parseFloat(br) / 100) * size;
    else delete style.borderRadius;
  }
  return { style, gradient };
}
