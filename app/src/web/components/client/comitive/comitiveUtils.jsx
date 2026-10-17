// Port di src/components/client/comitive/comitiveUtils.js (convertito da scripts/port/codemod.mjs).
// Logica pura dell'editor Comitive: tipi di legame, fonti, geometria dei fili
// (sviluppo orizzontale), disposizione automatica e utilità di formattazione.
import { LOCATION_BY_KEY } from '@/web/lib/campaniaLocations';

export const LINK_TYPES = {
  presentato: { key: 'presentato', label: 'Presentato da', short: 'Presentato', color: '#a78bfa', auto: true },
  amici: { key: 'amici', label: 'Amici', short: 'Amici', color: '#60a5fa', hint: 'Si conoscono, stessa comitiva' },
  serata: { key: 'serata', label: 'Conosciuti in serata', short: 'In serata', color: '#f472b6', hint: 'Hanno legato a una serata Vibra' },
  coppia: { key: 'coppia', label: 'Coppia', short: 'Coppia', color: '#f87171', hint: 'Stanno insieme' },
  altro: { key: 'altro', label: 'Altro', short: 'Altro', color: '#94a3b8', hint: 'Colleghi, parenti, ...' },
  obiettivo: { key: 'obiettivo', label: 'Da far conoscere', short: 'Obiettivo', color: '#fbbf24', hint: 'Devo fargli fare amicizia', goal: true },
  equilibrio: { key: 'equilibrio', label: 'Equilibrio promoter', short: 'Equilibrio', color: '#c084fc', hint: 'Legame tra un promoter Vibra e il pagante', promoterOnly: true },
};
export const MANUAL_LINK_TYPES = ['amici', 'serata', 'coppia', 'altro', 'obiettivo', 'equilibrio'];
/** Legami che contano come amicizia già fatta (per l'Analisi Intelligente e i contatori). */
export const FRIEND_LINK_TYPES = ['presentato', 'amici', 'serata', 'coppia', 'altro', 'equilibrio'];

/* ── Tipi di nodo: pagante proprio, pagante di un altro PR, promoter Vibra ── */
export const NODE_KINDS = {
  own: { key: 'own' },
  ext: { key: 'ext', label: 'Pagante di un altro PR', color: '#38bdf8' },
  promoter: { key: 'promoter', label: 'Promoter Vibra', color: '#c084fc' },
};
/** I nodi esterni portano _kind ('ext' | 'promoter'); i propri paganti no. */
export const kindOf = (n) => n?._kind || 'own';
/** Nodo esterno costruito dall'istantanea salvata nella comitiva (o dalla directory). Solo nome/zona/promoter. */
export function nodeFromMeta(id, m = {}) {
  const isPromoter = m.kind === 'promoter';
  return {
    id,
    _kind: isPromoter ? 'promoter' : 'ext',
    name: m.name || (isPromoter ? 'Promoter' : 'Pagante'),
    residenza_key: isPromoter ? '' : m.residenza_key || '',
    promoter_id: isPromoter ? '' : m.promoter_id || '',
    photo_url: isPromoter ? m.photo_url || '' : '',
  };
}

/* Importanza nella comitiva = dimensione della card */
export const SIZE_MIN = 0.7;
export const SIZE_MAX = 1.6;
export const SIZE_STEP = 0.15;
export const SIZE_PRESETS = [
  { key: 'sm', label: 'Marginale', scale: 0.8 },
  { key: 'md', label: 'Normale', scale: 1 },
  { key: 'lg', label: 'Importante', scale: 1.25 },
  { key: 'xl', label: 'Centrale', scale: 1.5 },
];
export const clampSize = (s) => Math.round(Math.max(SIZE_MIN, Math.min(SIZE_MAX, Number(s) || 1)) * 100) / 100;
export const importanceLabel = (s) => {
  const v = Number(s) || 1;
  if (v >= 1.4) return 'Centrale';
  if (v >= 1.12) return 'Importante';
  if (v <= 0.88) return 'Marginale';
  return 'Normale';
};

export const SOURCE_META = {
  instagram: { label: 'Conosciuto su Instagram', short: 'Instagram', color: '#f472b6' },
  tiktok: { label: 'Conosciuto su TikTok', short: 'TikTok', color: '#e2e8f0' },
  direct: { label: 'Contatto diretto', short: 'Diretto', color: '#34d399' },
  referred: { label: 'Tramite...', short: 'Tramite', color: '#fcd34d' },
  paganti_acquisiti: { label: 'Paganti acquisiti', short: 'Acquisiti', color: '#22d3ee' },
  none: { label: 'Fonte non indicata', short: 'Senza fonte', color: '#64748b' },
};

export const COMITIVA_COLORS = ['#a78bfa', '#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#22d3ee', '#fb7185', '#a3e635'];

export const sourceKey = (c) => (c?.source_type && SOURCE_META[c.source_type] ? c.source_type : 'none');
export const initialsOf = (name) =>
  (name || '?').split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
export const zoneOf = (c) => (c?.residenza_key && LOCATION_BY_KEY[c.residenza_key]?.label) || '';
export const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
export const fmtEuro = (n) => euro.format(Math.round(Number(n) || 0));

/** Archi tra i membri: "presentato da" automatici + legami manuali (ClientLink). */
export function buildEdges(members, links) {
  const ids = new Set(members.map((c) => c.id));
  const edges = [];
  members.forEach((c) => {
    if (c.referred_by_client_id && ids.has(c.referred_by_client_id) && c.referred_by_client_id !== c.id) {
      edges.push({ id: `ref-${c.id}`, from: c.referred_by_client_id, to: c.id, type: 'presentato', auto: true });
    }
  });
  (links || []).forEach((l) => {
    if (!ids.has(l.from_client_id) || !ids.has(l.to_client_id) || l.from_client_id === l.to_client_id) return;
    edges.push({
      id: l.id,
      from: l.from_client_id,
      to: l.to_client_id,
      type: LINK_TYPES[l.link_type] && !LINK_TYPES[l.link_type].auto ? l.link_type : 'altro',
      label: l.label || '',
      event_id: l.event_id || '',
      auto: false,
    });
  });
  return edges;
}

export const NODE_W = 220;
export const NODE_H = 150;

/** Punto di aggancio sul bordo della card (centro del lato). s = scala della card. */
export function sidePoint(p, h, side, s = 1) {
  const hh = ((h || NODE_H) * s) / 2;
  const hw = (NODE_W * s) / 2;
  if (side === 'left') return { x: p.x - hw, y: p.y };
  if (side === 'right') return { x: p.x + hw, y: p.y };
  if (side === 'top') return { x: p.x, y: p.y - hh };
  return { x: p.x, y: p.y + hh };
}

export function bezierMid(p0, p1, p2, p3) {
  const t = 0.5;
  const mt = 1 - t;
  return {
    x: mt ** 3 * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t ** 3 * p3.y,
  };
}

function curve(from, fs, to, ts) {
  const ctrl = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y), 80) * 0.5;
  const off = { right: [ctrl, 0], left: [-ctrl, 0], bottom: [0, ctrl], top: [0, -ctrl], free: [0, 0] };
  const c1 = { x: from.x + off[fs][0], y: from.y + off[fs][1] };
  const c2 = { x: to.x + off[ts][0], y: to.y + off[ts][1] };
  return {
    d: `M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`,
    from,
    to,
    mid: bezierMid(from, c1, c2, to),
  };
}

/**
 * Filo tra due card (centri a, b). Preferenza orizzontale: esce dal lato destro/sinistro;
 * solo se le card sono quasi incolonnate usa alto/basso.
 */
export function wireGeometry(a, b, ha, hb, sa = 1, sb = 1) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const horizontal = Math.abs(dx) > NODE_W * 0.7 * Math.max(sa, sb) || Math.abs(dx) >= Math.abs(dy);
  let fs;
  let ts;
  if (horizontal) {
    fs = dx >= 0 ? 'right' : 'left';
    ts = dx >= 0 ? 'left' : 'right';
  } else {
    fs = dy >= 0 ? 'bottom' : 'top';
    ts = dy >= 0 ? 'top' : 'bottom';
  }
  return curve(sidePoint(a, ha, fs, sa), fs, sidePoint(b, hb, ts, sb), ts);
}

/** Filo provvisorio mentre trascini da una maniglia. */
export function tempWire(a, ha, side, target, s = 1) {
  return curve(sidePoint(a, ha, side, s), side, target, 'free');
}

/* ── Comitive (componenti connesse) e disposizione orizzontale ── */
export function computeComponents(ids, edges) {
  const parent = new Map(ids.map((id) => [id, id]));
  const find = (x) => {
    while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); }
    return x;
  };
  edges.forEach((e) => {
    if (!parent.has(e.from) || !parent.has(e.to)) return;
    const a = find(e.from);
    const b = find(e.to);
    if (a !== b) parent.set(a, b);
  });
  const groups = new Map();
  ids.forEach((id) => {
    const r = find(id);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(id);
  });
  return [...groups.values()];
}

const COL_GAP = 120;
const ROW_GAP = 36;
const COMP_GAP = 90;

/**
 * Disposizione automatica da sinistra a destra: chi ha presentato a sinistra,
 * i presentati a destra; i legami manuali agganciano gli altri. Le comitive
 * scollegate tra loro si impilano in verticale.
 */
export function layoutHorizontal(ids, edges, clientsById) {
  const comps = computeComponents(ids, edges).sort((a, b) => b.length - a.length);
  const refKids = new Map();
  const adj = new Map();
  const hasParent = new Set();
  edges.forEach((e) => {
    if (e.type === 'presentato') {
      if (!refKids.has(e.from)) refKids.set(e.from, []);
      refKids.get(e.from).push(e.to);
      hasParent.add(e.to);
    }
    [[e.from, e.to], [e.to, e.from]].forEach(([a, b]) => {
      if (!adj.has(a)) adj.set(a, []);
      adj.get(a).push(b);
    });
  });
  const degree = (id) => (adj.get(id) || []).length;
  const pos = {};
  let top = 0;
  comps.forEach((members) => {
    const set = new Set(members);
    const roots = members
      .filter((id) => !hasParent.has(id))
      .sort((a, b) => (refKids.get(b)?.length || 0) - (refKids.get(a)?.length || 0) || degree(b) - degree(a)
        || (clientsById[a]?.name || '').localeCompare(clientsById[b]?.name || ''));
    const depth = new Map();
    const queue = [];
    const start = roots.length ? roots[0] : members[0];
    depth.set(start, 0);
    queue.push(start);
    const bfs = () => {
      while (queue.length) {
        const id = queue.shift();
        const d = depth.get(id);
        const kids = [...(refKids.get(id) || []), ...(adj.get(id) || [])].filter((k) => set.has(k));
        kids.forEach((k) => { if (!depth.has(k)) { depth.set(k, d + 1); queue.push(k); } });
      }
    };
    bfs();
    members.forEach((id) => { if (!depth.has(id)) { depth.set(id, 0); queue.push(id); bfs(); } });
    const cols = [];
    members.forEach((id) => {
      const d = depth.get(id);
      if (!cols[d]) cols[d] = [];
      cols[d].push(id);
    });
    const clean = cols.filter(Boolean);
    const tallest = Math.max(...clean.map((c) => c.length));
    const compH = tallest * (NODE_H + ROW_GAP) - ROW_GAP;
    clean.forEach((col, ci) => {
      const colH = col.length * (NODE_H + ROW_GAP) - ROW_GAP;
      const y0 = top + (compH - colH) / 2;
      col.forEach((id, i) => {
        pos[id] = {
          x: Math.round(ci * (NODE_W + COL_GAP) + NODE_W / 2),
          y: Math.round(y0 + i * (NODE_H + ROW_GAP) + NODE_H / 2),
        };
      });
    });
    top += compH + COMP_GAP;
  });
  return pos;
}

/** Primo posto libero vicino a un punto (griglia a spirale), per non sovrapporre le card. */
export function findFreeSpot(positions, near) {
  const occupied = Object.values(positions);
  const free = (p) => occupied.every((o) => Math.abs(o.x - p.x) > NODE_W + 16 || Math.abs(o.y - p.y) > NODE_H + 12);
  const sx = NODE_W + 40;
  const sy = NODE_H + 30;
  for (let r = 0; r < 12; r++) {
    for (let i = -r; i <= r; i++) {
      for (let j = -r; j <= r; j++) {
        if (Math.max(Math.abs(i), Math.abs(j)) !== r) continue;
        const p = { x: Math.round(near.x + i * sx), y: Math.round(near.y + j * sy) };
        if (free(p)) return p;
      }
    }
  }
  return { x: near.x, y: near.y };
}

/** Colonna di posti liberi a destra di tutto (per aggiungere un gruppo intero). */
export function columnRightOf(positions, count, anchorY) {
  const xs = Object.values(positions).map((p) => p.x);
  const x = xs.length ? Math.max(...xs) + NODE_W + COL_GAP : NODE_W / 2;
  const totalH = count * (NODE_H + ROW_GAP) - ROW_GAP;
  const y0 = (anchorY ?? 0) - totalH / 2 + NODE_H / 2;
  return Array.from({ length: count }, (_, i) => ({ x: Math.round(x), y: Math.round(y0 + i * (NODE_H + ROW_GAP)) }));
}
