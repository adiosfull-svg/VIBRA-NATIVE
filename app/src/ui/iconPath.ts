// Forme di un'icona lucide come sottotracciati di un solo path (vedi icon.tsx).
// Un'icona lucide è fatta di più forme (path, circle, line, rect...): ognuna era una vista nativa
// (RNSVGPath/Circle/Line…), 4-7 viste per icona. Nel percorso di Clienti 3.200 delle 7.200 viste create
// erano icone (traccia Perfetto sull'emulatore). Le stesse forme come sottotracciati di un solo path:
// stesso tratto (spessore, estremità e giunzioni round per ogni sottotracciato), 3 viste per icona.
// Solo senza riempimento e con colore pieno: con fill o colore trasparente le forme sovrapposte si
// fonderebbero in modo diverso, e resta il disegno forma per forma.
const n = (v: string | undefined, d = 0) => (v == null ? d : Number(v));
export function shapeToD(tag: string, a: Record<string, string>): string | null {
  switch (tag) {
    case 'path': return a.d ?? null;
    case 'line': return `M${n(a.x1)} ${n(a.y1)}L${n(a.x2)} ${n(a.y2)}`;
    case 'circle': {
      const cx = n(a.cx), cy = n(a.cy), r = n(a.r);
      return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
    }
    case 'ellipse': {
      const cx = n(a.cx), cy = n(a.cy), rx = n(a.rx), ry = n(a.ry);
      return `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;
    }
    case 'rect': {
      const x = n(a.x), y = n(a.y), w = n(a.width), h = n(a.height);
      let rx = a.rx != null ? n(a.rx) : a.ry != null ? n(a.ry) : 0;
      let ry = a.ry != null ? n(a.ry) : rx;
      rx = Math.min(rx, w / 2); ry = Math.min(ry, h / 2);
      if (!rx || !ry) return `M${x} ${y}h${w}v${h}h${-w}Z`;
      return `M${x + rx} ${y}h${w - 2 * rx}a${rx} ${ry} 0 0 1 ${rx} ${ry}v${h - 2 * ry}a${rx} ${ry} 0 0 1 ${-rx} ${ry}`
        + `h${-(w - 2 * rx)}a${rx} ${ry} 0 0 1 ${-rx} ${-ry}v${-(h - 2 * ry)}a${rx} ${ry} 0 0 1 ${rx} ${-ry}Z`;
    }
    case 'polyline':
    case 'polygon': {
      const pts = (a.points ?? '').trim().split(/[\s,]+/).map(Number);
      if (pts.length < 4) return null;
      let d = `M${pts[0]} ${pts[1]}`;
      for (let i = 2; i + 1 < pts.length; i += 2) d += `L${pts[i]} ${pts[i + 1]}`;
      return tag === 'polygon' ? `${d}Z` : d;
    }
    default: return null;
  }
}
const combinedCache = new WeakMap<object, string | null>();
export function combinedD(node: [string, Record<string, string>][]): string | null {
  if (combinedCache.has(node)) return combinedCache.get(node)!;
  let out: string | null = '';
  for (const [tag, attrs] of node) {
    const d = shapeToD(tag, attrs);
    if (d == null) { out = null; break; }
    out += d;
  }
  combinedCache.set(node, out || null);
  return out || null;
}
/** colore pieno (nessuna trasparenza): #rgb, #rrggbb, #rrggbbff, rgb(), nomi tranne transparent */
export function opaque(c: string): boolean {
  if (!c || c === 'currentColor' || c === 'transparent') return false;
  if (c[0] === '#') return c.length === 4 || c.length === 7 || (c.length === 9 && c.slice(7).toLowerCase() === 'ff');
  if (/^rgba\(/i.test(c)) return /,\s*1(?:\.0*)?\s*\)$/.test(c);
  if (/^hsla\(/i.test(c) || c.includes('/')) return false;
  return true;
}

