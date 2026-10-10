// Classi focus:/focus-visible: dei campi (es. "focus:outline-none focus:ring-1 focus:ring-primary") →
// stile da applicare mentre il campo ha il fuoco, come in Tailwind 3: ring = box-shadow fuori dal bordo
// (colore di default blu-500 al 50%), ring-offset = anello interno (bianco di default), outline-none
// toglie il contorno del browser.
import { themeColor } from './colors.ts';

const PREFIX = /^(?:focus|focus-visible):(.+)$/;
const RING_WIDTH: Record<string, number> = { '': 3, '0': 0, '1': 1, '2': 2, '4': 4, '8': 8 };

export type FocusStyle = { boxShadow?: string; borderColor?: string; backgroundColor?: string; outlineStyle?: 'none' };

export function focusStyle(classes?: string): FocusStyle | null {
  if (!classes || !classes.includes('focus')) return null;
  let ring: number | null = null;
  let ringColor = 'rgba(59,130,246,0.5)';
  let offset = 0;
  let offsetColor = '#ffffff';
  const out: FocusStyle = {};
  for (const c of classes.split(/\s+/)) {
    const m = c.match(PREFIX);
    if (!m) continue;
    const u = m[1];
    let v: RegExpMatchArray | null;
    if (u === 'outline-none') out.outlineStyle = 'none';
    else if (u === 'ring' || (v = u.match(/^ring-(\d+)$/))) ring = RING_WIDTH[u === 'ring' ? '' : v![1]] ?? Number(v![1]);
    else if ((v = u.match(/^ring-offset-(\d+)$/))) offset = Number(v[1]);
    else if ((v = u.match(/^ring-offset-(.+)$/))) offsetColor = themeColor(v[1]) ?? offsetColor;
    else if ((v = u.match(/^ring-(.+)$/))) {
      const color = themeColor(v[1]);
      // ring-<colore> senza /alpha: opacità piena (il 50% vale solo per il colore di default)
      if (color) ringColor = color;
    } else if ((v = u.match(/^border-(.+)$/))) { const color = themeColor(v[1]); if (color) out.borderColor = color; }
    else if ((v = u.match(/^bg-(.+)$/))) { const color = themeColor(v[1]); if (color) out.backgroundColor = color; }
  }
  if (ring) {
    out.boxShadow = offset
      ? `0px 0px 0px ${offset}px ${offsetColor}, 0px 0px 0px ${offset + ring}px ${ringColor}`
      : `0px 0px 0px ${ring}px ${ringColor}`;
  }
  return Object.keys(out).length ? out : null;
}
