// Port di src/components/client/ClientFamilyTree.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - <div> gesture/eventi web rimossi: onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onTouchStart, onTouchMove, onTouchEnd
import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from '@/ui/motion';
import { GitBranch, Users, Euro, Star, ChevronDown, ChevronRight, Eye, EyeOff, X, ZoomIn, ZoomOut, RotateCcw } from '@/ui/icons.generated';
import { rankingColor } from '@/legacy/utils/clientRanking';
import { Gem } from '@/ui/icons.generated';
import ClientFamilyTreeMobile from '@/web/components/client/ClientFamilyTreeMobile';
import CachedImage from '@/web/components/shared/CachedImage';
import { useStuck } from '@/web/hooks/useStuck';
import { stickyGlassStyle } from '@/legacy/utils/stickyGlass';

import { Btn, Div, P, Span } from '@/ui/html';

import { win as webWindow } from '@/web/shims/dom';

/** Punteggio importanza per ordinamento — usa campi pre-calcolati cum_* (O(1)) */
function importanceScore(client, cumMap, childrenMap) {
  const cs = cumMap[client.id] || { totalSpent: 0, visits: 0 };
  const branches = (childrenMap[client.id] || []).length;
  return cs.totalSpent * 0.4 + cs.visits * 1 + branches * 3;
}

/** Conta tutti i discendenti (intero sottoalbero) */
function totalDescendants(id, childrenMap) {
  let count = 0;
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop();
    (childrenMap[cur] || []).forEach(cid => { count++; stack.push(cid); });
  }
  return count;
}

/** Costruisce l'albero con parentMap per lookup antenati — usa cumMap (nessun filtering presenze) */
function buildTree(clients, cumMap) {
  const byId = {};
  clients.forEach(c => { byId[c.id] = c; });

  const childrenMap = {};
  const parentMap = {};
  clients.forEach(c => {
    const parentId = c.referred_by_client_id;
    parentMap[c.id] = parentId && byId[parentId] ? parentId : null;
    if (parentId && byId[parentId]) {
      if (!childrenMap[parentId]) childrenMap[parentId] = [];
      childrenMap[parentId].push(c.id);
    }
  });

  const rootIds = clients
    .filter(c => !c.referred_by_client_id || !byId[c.referred_by_client_id])
    .filter(c => childrenMap[c.id]?.length > 0)
    .sort((a, b) => totalDescendants(b.id, childrenMap) - totalDescendants(a.id, childrenMap))
    .map(c => c.id);

  function buildNode(id) {
    const client = byId[id];
    if (!client) return null;
    const childIds = (childrenMap[id] || [])
      .sort((a, b) => importanceScore(byId[b], cumMap, childrenMap) - importanceScore(byId[a], cumMap, childrenMap));
    return { client, children: childIds.map(cid => buildNode(cid)).filter(Boolean) };
  }

  return { roots: rootIds.map(id => buildNode(id)).filter(Boolean), childrenMap, parentMap, byId };
}

/** Colori per profondità generazionale */
const DEPTH_BORDERS = [
  'border-primary/40 hover:border-primary/60',
  'border-cyan-500/40 hover:border-cyan-500/60',
  'border-amber-500/40 hover:border-amber-500/60',
  'border-emerald-500/40 hover:border-emerald-500/60',
  'border-rose-500/40 hover:border-rose-500/60',
  'border-indigo-400/40 hover:border-indigo-400/60',
  'border-lime-400/40 hover:border-lime-400/60',
  'border-orange-500/40 hover:border-orange-500/60',
  'border-teal-400/40 hover:border-teal-400/60',
  'border-fuchsia-500/40 hover:border-fuchsia-500/60',
];

const DEPTH_GRADIENTS = [
  'from-primary to-violet-700',
  'from-cyan-500 to-blue-700',
  'from-amber-500 to-orange-700',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
  'from-indigo-400 to-indigo-700',
  'from-lime-400 to-green-700',
  'from-orange-500 to-red-700',
  'from-teal-400 to-cyan-700',
  'from-fuchsia-500 to-purple-700',
];

const DEPTH_LINES = [
  'bg-primary/30',
  'bg-cyan-500/30',
  'bg-amber-500/30',
  'bg-emerald-500/30',
  'bg-rose-500/30',
  'bg-indigo-400/30',
  'bg-lime-400/30',
  'bg-orange-500/30',
  'bg-teal-400/30',
  'bg-fuchsia-500/30',
];

/** Puntino animato che scorre lungo le linee */
function FlowDot({ color = '#a78bfa', delay = 0, duration = 2.5 }) {
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 z-10"
      initial={{ top: '0%', opacity: 0 }}
      animate={{ top: ['0%', '80%', '100%'], opacity: [0, 1, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Div
        className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_1px_rgba(139,92,246,0.7)]"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}

/** Barra sottilissima di ranking sotto il nome */
function RankBar({ ranking, width = 60 }) {
  if (ranking === null) return null;
  const pct = Math.min(100, (ranking / 10) * 100);
  const cols = {
    'text-cyan-300': '#22d3ee',
    'text-blue-400': '#60a5fa',
    'text-violet-400': '#a78bfa',
    'text-slate-400': '#94a3b8',
  };
  const colorClass = rankingColor(ranking);
  const barColor = cols[colorClass] || '#a78bfa';
  return (
    <Div className="w-full flex justify-center mt-0.5">
      <Div className="h-[2px] rounded-full bg-secondary/60 overflow-hidden" style={{ width: `${width}px` }}>
        <Div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </Div>
    </Div>
  );
}

/** Riga figli — sempre semplice flex centered */
function ChildrenRow({ children, lineColor, lineWidth, depth, onClientClick, allClients, cumMap, focusedClientId, onFocus, focusPathSet, maxSpent, compact }) {
  return (
    <Div className={`relative flex justify-center pt-3 ${compact ? 'gap-2.5' : 'gap-5'}`}>
      {children.length > 1 && (
        <>
          <Div className={`absolute top-0 left-0 right-0 ${lineColor}`} style={{ height: lineWidth }} />
          <Div className={`absolute top-1 left-1/2 -translate-x-1/2 ${lineColor}`} style={{ width: lineWidth, height: '10px' }} />
        </>
      )}
      <AnimatePresence>
        {children.map((child) => {
          const childNp = child.client.new_people_brought || 0;
          const childW = `${Math.min(3, 0.8 + childNp * 0.4)}px`;
          return (
            <motion.div
              key={child.client.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="relative shrink-0"
            >
              <Div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${lineColor}`}
                style={{ width: childW, height: '12px' }} />
              <TreeNode
                node={child}
                depth={depth + 1}
                onClientClick={onClientClick}
                allClients={allClients}
                cumMap={cumMap}
                focusedClientId={focusedClientId}
                onFocus={onFocus}
                focusPathSet={focusPathSet}
                maxSpent={maxSpent}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </Div>
  );
}

/** Nodo albero */
function TreeNode({
  node, depth, onClientClick, allClients, cumMap,
  focusedClientId, onFocus, focusPathSet, maxSpent,
  compact = false, touchAction,
}) {
  const [expanded, setExpanded] = useState(true);
  const { client, children } = node;
  const hasChildren = children.length > 0;

  // Pre-calcolato sul backend (cum_*): zero filtering presenze per nodo
  const cs = cumMap[client.id] || { visits: 0, totalSpent: 0, ranking: null };
  const totalSpent = cs.totalSpent;
  const visits = cs.visits;
  const newPeople = client.new_people_brought || 0;
  const ranking = cs.ranking;

  const initials = client.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const depthIdx = Math.min(depth, DEPTH_BORDERS.length - 1);
  const lineColor = DEPTH_LINES[depthIdx];
  const lineHex = ['#a78bfa', '#22d3ee', '#f59e0b', '#34d399', '#f43f5e', '#818cf8', '#a3e635', '#f97316', '#2dd4bf', '#d946ef'][depthIdx];

  const focusActive = !!focusedClientId;
  const inFocusPath = focusPathSet.has(client.id) || focusedClientId === client.id;
  const dimmed = focusActive && !inFocusPath;
  const isFocused = focusedClientId === client.id;

  const sizeScale = maxSpent > 0 ? 0.92 + (totalSpent / maxSpent) * 0.16 : 1;
  const nodeScale = Math.min(1.08, sizeScale);
  const lineWidth = hasChildren ? `${Math.min(3, 0.8 + newPeople * 0.4)}px` : '1px';

  return (
    <Div className={`relative transition-all duration-500 ${dimmed ? 'opacity-[0.16] scale-[0.96] pointer-events-none' : 'opacity-100'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={inFocusPath && focusActive ? { opacity: 1, scale: nodeScale * 1.06 } : { opacity: 1, scale: nodeScale }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="flex flex-col items-center"
      >
        {/* Contenitore nodo */}
        <Div className="relative group">
          <motion.button
            onClick={() => onClientClick(client)}
            onDoubleClick={(e) => { e.stopPropagation(); onFocus(isFocused ? null : client.id); }}
            className={`flex flex-col items-center gap-1.5 rounded-2xl bg-card border-2 transition-all duration-300 cursor-pointer
              ${compact ? 'px-2.5 py-2 gap-1' : 'px-4 py-3'}
              ${DEPTH_BORDERS[depthIdx]} hover:shadow-lg hover:shadow-primary/5
              ${isFocused ? '!border-primary shadow-lg shadow-primary/25 ring-2 ring-primary/30' : ''}
            `}
            style={{ transform: `scale(${nodeScale})`, ...(touchAction ? { touchAction } : {}) }}
          >
            <Btn
              onClick={(e) => { e.stopPropagation(); onFocus(isFocused ? null : client.id); }}
              className={`absolute top-1.5 right-1.5 p-1 rounded-full transition-all duration-200 z-10
                ${isFocused
                  ? 'bg-primary text-primary-foreground shadow-md opacity-100'
                  : 'bg-secondary/70 text-muted-foreground opacity-0 group-hover:opacity-100 hover:!opacity-100 hover:text-primary hover:bg-secondary'
                }`}
              accessibilityLabel={isFocused ? 'Togli focus' : 'Metti a fuoco'}
            >
              {isFocused ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Btn>

            <Div className={`relative rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden bg-gradient-to-br ${DEPTH_GRADIENTS[depthIdx]}
              ${compact ? 'w-8 h-8 text-[10px]' : 'w-11 h-11 text-sm'}`}>
              <Span className="relative z-0">{initials}</Span>
              {client.photo_url && (
                <CachedImage src={client.photo_url} alt={client.name} className="absolute inset-0 w-full h-full object-cover z-10" loading="lazy" decoding="async" onError={(e) => e.currentTarget.style.display = 'none'} />
              )}
              {client.is_leader && (
                <Star className={`absolute text-yellow-400 fill-yellow-400 drop-shadow-md ${compact ? '-top-1 -right-1 w-3.5 h-3.5' : '-top-1.5 -right-1.5 w-5 h-5'}`} />
              )}
            </Div>

            <Div className={`text-center ${compact ? 'min-w-[60px] max-w-[100px]' : 'min-w-[80px] max-w-[140px]'}`}>
              <P className={`font-semibold text-foreground group-hover:text-primary transition-colors truncate ${compact ? 'text-[10px]' : 'text-xs'}`}>
                {client.name}
              </P>
              <Div className={`flex items-center justify-center gap-2 mt-1 text-muted-foreground ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
                <Span className="inline-flex items-center gap-0.5"><Users className="w-2 h-2" />{visits}</Span>
                <Span className="inline-flex items-center gap-0.5"><Euro className="w-2 h-2" />{totalSpent > 0 ? `€${totalSpent}` : '—'}</Span>
              </Div>
              <RankBar ranking={ranking} width={compact ? 50 : Math.max(55, Math.min(80, nodeScale * 60))} />
              {ranking !== null && (
                <Span className={`inline-flex items-center gap-0.5 font-bold mt-0.5 ${rankingColor(ranking)} ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
                  <Gem className={compact ? 'w-2 h-2' : 'w-2.5 h-2.5'} />{ranking.toFixed(1)}
                </Span>
              )}
            </Div>

            {hasChildren && (
              <Span className={`font-medium text-amber-400 bg-amber-400/10 rounded-full ${compact ? 'text-[8px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'}`}>
                {children.length} {children.length === 1 ? 'ramo' : 'rami'}
              </Span>
            )}
          </motion.button>
        </Div>

        {hasChildren && (
          <Btn
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className={`rounded-full bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all ${compact ? 'mt-0.5 p-0.5' : 'mt-1.5 p-1'}`}
          >
            {expanded ? <ChevronDown className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} /> : <ChevronRight className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
          </Btn>
        )}
      </motion.div>

      {/* Rami discendenti */}
      {hasChildren && expanded && (
        <Div className={`flex flex-col ${compact ? 'mt-0.5' : 'mt-1'}`}>
          <Div className="relative self-center" style={{ height: compact ? '14px' : '20px' }}>
            <Div className={`absolute left-1/2 -translate-x-1/2 h-full bg-gradient-to-b ${lineColor} to-transparent`}
              style={{ width: lineWidth }} />
            {newPeople >= 1 && <FlowDot color={lineHex} delay={depth * 0.15} duration={2 + Math.random() * 1.5} />}
          </Div>

          <ChildrenRow depth={depth} children={children} lineColor={lineColor} lineWidth={lineWidth}
            onClientClick={onClientClick} allClients={allClients} cumMap={cumMap}
            focusedClientId={focusedClientId} onFocus={onFocus} focusPathSet={focusPathSet} maxSpent={maxSpent}
            compact={compact} />
        </Div>
      )}

      {hasChildren && !expanded && (
        <Div className="flex flex-col items-center">
          <Div className="w-px h-3 bg-border/40" />
          <Span className="text-[10px] text-muted-foreground bg-secondary/30 px-2.5 py-0.5 rounded-full">
            {children.length} {children.length === 1 ? 'ramo nascosto' : 'rami nascosti'}
          </Span>
        </Div>
      )}
    </Div>
  );
}

/** Wrapper scrollabile per un intero albero (trascinabile sia mouse che touch) */
function TreeScrollWrapper({ children, treeKey }) {
  const scrollRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const getX = (e) => e.touches ? e.touches[0].pageX : e.pageX;

  const onDown = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) return;
    dragRef.current = { active: true, startX: getX(e) - el.getBoundingClientRect().left, scrollLeft: el.scrollLeft };
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  }, []);

  const onMove = useCallback((e) => {
    if (!dragRef.current.active || !scrollRef.current) return;
    e.preventDefault();
    const el = scrollRef.current;
    const x = getX(e) - el.getBoundingClientRect().left;
    el.scrollLeft = dragRef.current.scrollLeft - (x - dragRef.current.startX);
  }, []);

  const onUp = useCallback(() => {
    dragRef.current.active = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.userSelect = '';
    }
  }, []);

  useEffect(() => {
    webWindow.addEventListener('mouseup', onUp);
    webWindow.addEventListener('touchend', onUp);
    return () => {
      webWindow.removeEventListener('mouseup', onUp);
      webWindow.removeEventListener('touchend', onUp);
    };
  }, [onUp]);

  return (
    <Div
      ref={scrollRef}
      className="overflow-x-auto cursor-grab select-none"
      style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x', scrollBehavior: 'smooth' }}>
      <Div className="flex justify-center min-w-max px-8">
        {children}
      </Div>
    </Div>
  );
}

/** Mini legenda */
function LegendItem({ color, label }) {
  return (
    <Div className="flex items-center gap-1.5 text-[10px]">
      <Div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
      <Span className="text-muted-foreground">{label}</Span>
    </Div>
  );
}

export { TreeNode, ChildrenRow, TreeScrollWrapper };
export default function ClientFamilyTree({ clients, attendances, events, onClientClick }) {
  const [focusedClientId, setFocusedClientId] = useState(null);
  const [displayZoom, setDisplayZoom] = useState(1.0);
  const zoomBarRef = useRef(null);
  const [zoomStuck] = useStuck(zoomBarRef, 88);

  // ─── GPU-composited transform (stesso approccio mobile) ───
  const zoomRef = useRef(1.0);
  const panRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const viewportRef = useRef(null);
  const gestureRef = useRef({
    type: null,    // 'mouse' | 'touch-drag' | 'pinch'
    startX: 0, startY: 0, panStartX: 0, panStartY: 0,
    dist0: 0, zoom0: 1.0, fx: 0, fy: 0,
    vpRect: null,
  });
  const centeredRef = useRef(false);

  const getTouchesDist = (touches) => {
    if (touches.length < 2) return 0;
    return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
  };

  const applyTransform = useCallback(() => {
    if (!canvasRef.current) return;
    const { x, y } = panRef.current;
    canvasRef.current.style.transform = `translate(${x}px, ${y}px) scale(${zoomRef.current})`;
  }, []);

  // ─── Mouse drag-to-pan ───
  const onMouseDown = useCallback((e) => {
    if (!viewportRef.current) return;
    const vr = viewportRef.current.getBoundingClientRect();
    if (canvasRef.current) canvasRef.current.style.willChange = 'transform';
    gestureRef.current = {
      type: 'mouse',
      startX: e.clientX, startY: e.clientY,
      panStartX: panRef.current.x, panStartY: panRef.current.y,
      vpRect: vr,
    };
  }, []);

  const onMouseMove = useCallback((e) => {
    const g = gestureRef.current;
    if (g.type !== 'mouse') return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    panRef.current = { x: g.panStartX + dx, y: g.panStartY + dy };
    applyTransform();
  }, [applyTransform]);

  const onMouseUp = useCallback(() => {
    if (gestureRef.current.type === 'mouse') {
      gestureRef.current.type = null;
      if (canvasRef.current) canvasRef.current.style.willChange = 'auto';
    }
  }, []);

  // ─── Touch: pinch + drag (identico al mobile) ───
  const onTouchStart = useCallback((e) => {
    if (!viewportRef.current) return;
    const vr = viewportRef.current.getBoundingClientRect();
    if (canvasRef.current) canvasRef.current.style.willChange = 'transform';

    if (e.touches.length === 1) {
      gestureRef.current = {
        type: 'touch-drag',
        startX: e.touches[0].clientX, startY: e.touches[0].clientY,
        panStartX: panRef.current.x, panStartY: panRef.current.y,
        vpRect: vr,
      };
    } else if (e.touches.length === 2) {
      gestureRef.current = {
        type: 'pinch',
        dist0: getTouchesDist(e.touches),
        zoom0: zoomRef.current,
        fx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        fy: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        panStartX: panRef.current.x, panStartY: panRef.current.y,
        vpRect: vr,
      };
    }
  }, []);

  const onTouchMove = useCallback((e) => {
    const g = gestureRef.current;
    if (!g.type || !canvasRef.current) return;

    if (g.type === 'touch-drag' && e.touches.length === 1) {
      const dx = e.touches[0].clientX - g.startX;
      const dy = e.touches[0].clientY - g.startY;
      panRef.current = { x: g.panStartX + dx, y: g.panStartY + dy };
      applyTransform();
    }

    if (g.type === 'pinch' && e.touches.length === 2) {
      const ratio = getTouchesDist(e.touches) / g.dist0;
      const newZoom = Math.max(0.2, Math.min(2.0, g.zoom0 * ratio));
      zoomRef.current = newZoom;

      const vr = g.vpRect;
      const relX = g.fx - vr.left;
      const relY = g.fy - vr.top;
      const worldX = (relX - g.panStartX) / g.zoom0;
      const worldY = (relY - g.panStartY) / g.zoom0;
      panRef.current = { x: relX - worldX * newZoom, y: relY - worldY * newZoom };
      applyTransform();
    }
  }, [applyTransform]);

  const onTouchEnd = useCallback(() => {
    gestureRef.current.type = null;
    if (canvasRef.current) canvasRef.current.style.willChange = 'auto';
    setDisplayZoom(zoomRef.current);
  }, []);

  // ─── Bottoni zoom: DOM + stato sincronizzati ───
  const zoomIn = () => {
    zoomRef.current = Math.min(2.0, zoomRef.current + 0.15);
    setDisplayZoom(zoomRef.current);
    applyTransform();
  };
  const zoomOut = () => {
    zoomRef.current = Math.max(0.2, zoomRef.current - 0.15);
    setDisplayZoom(zoomRef.current);
    applyTransform();
  };
  const zoomReset = () => {
    zoomRef.current = 1.0;
    panRef.current = { x: 0, y: 0 };
    setDisplayZoom(1.0);
    applyTransform();
    centeredRef.current = false;
  };

  // ─── Centra la prima radice al mount ───
  useEffect(() => {
    if (centeredRef.current || !viewportRef.current || !canvasRef.current) return;
    const raf = requestAnimationFrame(() => {
      if (!viewportRef.current || !canvasRef.current) return;
      const vp = viewportRef.current;
      const cw = canvasRef.current.scrollWidth;
      panRef.current = { x: (vp.clientWidth - cw) / 2, y: 0 };
      applyTransform();
      centeredRef.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, [applyTransform]);

  // Mappa cum_* pre-calcolata sul backend: zero filtering presenze per tutto l'albero
  const clientCumMap = useMemo(() => {
    const m = {};
    clients.forEach(c => { m[c.id] = {
      visits: c.cum_visits || 0,
      totalSpent: c.cum_total_spent || 0,
      ranking: (c.cum_visits || 0) > 0 ? (c.cum_rating || 0) : null,
    }});
    return m;
  }, [clients]);

  const tree = useMemo(() => buildTree(clients, clientCumMap), [clients, clientCumMap]);

  const maxSpent = useMemo(() => clients.reduce((max, c) => Math.max(max, c.cum_total_spent || 0), 0), [clients]);

  const focusPathSet = useMemo(() => {
    const s = new Set();
    if (!focusedClientId) return s;

    let current = focusedClientId;
    while (current && tree.parentMap[current]) {
      current = tree.parentMap[current];
      s.add(current);
    }
    s.add(focusedClientId);

    const stack = [focusedClientId];
    while (stack.length) {
      const id = stack.pop();
      s.add(id);
      (tree.childrenMap[id] || []).forEach(cid => stack.push(cid));
    }

    return s;
  }, [focusedClientId, tree.parentMap, tree.childrenMap]);

  const handleFocus = useCallback((id) => {
    setFocusedClientId(id);
  }, []);

  if (tree.roots.length === 0) {
    return (
      <Div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <Div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <GitBranch className="w-8 h-8 text-primary/50" />
        </Div>
        <Div>
          <P className="font-semibold text-sm text-foreground">Nessun albero genealogico</P>
          <P className="text-xs text-muted-foreground mt-1 max-w-xs">
            Non ci sono ancora ramificazioni tra i tuoi clienti. Aggiungi la fonte "Tramite..." ai clienti per creare collegamenti e visualizzare l'albero.
          </P>
        </Div>
      </Div>
    );
  }

  // ── MOBILE: albero verticale indentato, scorrevole come lista ──
  const mobileContent = (
    <ClientFamilyTreeMobile
      clients={clients}
      attendances={attendances}
      events={events}
      onClientClick={onClientClick}
    />
  );

  // ── DESKTOP/TABLET: viewport + canvas GPU-composited (mouse drag + touch pinch) ──
  const desktopContent = (
    <Div className="space-y-4">
      <Div className="flex items-center gap-4 justify-center flex-wrap">
        <LegendItem color="bg-primary" label="Radice" />
        <LegendItem color="bg-cyan-500" label="1ª" />
        <LegendItem color="bg-amber-500" label="2ª" />
        <LegendItem color="bg-emerald-500" label="3ª" />
        <LegendItem color="bg-rose-500" label="4ª" />
        <LegendItem color="bg-indigo-400" label="5ª" />
        <LegendItem color="bg-lime-400" label="6ª" />
        <LegendItem color="bg-orange-500" label="7ª" />
        <LegendItem color="bg-teal-400" label="8ª" />
        <LegendItem color="bg-fuchsia-500" label="9ª+" />
        {focusedClientId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 text-[10px] bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full"
          >
            <Eye className="w-3 h-3 text-primary" />
            <Span className="text-muted-foreground">Focus:</Span>
            <Span className="font-semibold text-primary">{tree.byId[focusedClientId]?.name || '—'}</Span>
            <Btn onClick={() => setFocusedClientId(null)} className="ml-1 p-0.5 rounded-full hover:bg-primary/20 transition-all">
              <X className="w-3 h-3 text-primary" />
            </Btn>
          </motion.div>
        )}
      </Div>

      {/* Zoom controls sticky — sotto il menu tab di Clienti (tab bar alto ~5.5rem con pt-10) */}
      <Div ref={zoomBarRef} className="sticky top-[5.5rem] z-20 py-1.5 -mx-4 px-4 border-b border-border flex items-center gap-1.5 justify-center" style={stickyGlassStyle(zoomStuck)}>
        <Span className="text-[9px] text-muted-foreground">Zoom</Span>
        <Btn onClick={zoomOut} className="p-1 rounded-md bg-secondary/60 text-muted-foreground hover:text-foreground active:bg-secondary">
          <ZoomOut className="w-3.5 h-3.5" />
        </Btn>
        <Span className="text-[10px] font-semibold text-foreground w-9 text-center">{Math.round(displayZoom * 100)}%</Span>
        <Btn onClick={zoomIn} className="p-1 rounded-md bg-secondary/60 text-muted-foreground hover:text-foreground active:bg-secondary">
          <ZoomIn className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={zoomReset} className="p-1 rounded-md bg-secondary/60 text-muted-foreground hover:text-foreground active:bg-secondary ml-1">
          <RotateCcw className="w-3 h-3" />
        </Btn>
      </Div>

      {/* VIEWPORT + CANVAS: GPU-composited transform (mouse drag + touch pinch) */}
      <Div
        ref={viewportRef}
        className="overflow-hidden select-none rounded-xl border border-border/40 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none', minHeight: '55vh' }}>
        <Div
          ref={canvasRef}
          style={{ transformOrigin: '0 0' }}
        >
          <Div className="flex flex-col gap-8 sm:gap-14 py-4 sm:py-6 px-4 min-w-max">
            {tree.roots.map((root, i) => (
              <motion.div
                key={root.client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col"
              >
                <Div className="self-center mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-semibold text-primary uppercase tracking-wider">
                  Radice
                </Div>
                <TreeNode
                  node={root}
                  depth={0}
                  onClientClick={onClientClick}
                  allClients={clients}
                  cumMap={clientCumMap}
                  focusedClientId={focusedClientId}
                  onFocus={handleFocus}
                  focusPathSet={focusPathSet}
                  maxSpent={maxSpent}
                />
              </motion.div>
            ))}
          </Div>
          <P className="text-center text-[10px] text-muted-foreground pb-3">
            <Eye className="w-3 h-3 inline mr-1 opacity-50" />
            Trascina per esplorare i rami · Mouse per pan, pinch per zoom · Doppio clic per focus
            {tree.roots.some(r => r.children.length > 3) && (
              <Span className="ml-2">· Alberi larghi: trascina lateralmente</Span>
            )}
          </P>
        </Div>
      </Div>

      <P className="text-center text-[10px] text-muted-foreground">
        <Eye className="w-3 h-3 inline mr-1 opacity-50" />
        Passa sopra un nodo e clicca l'icona occhio per la modalità focus · Doppio clic sul nodo per attivare/disattivare il focus
      </P>
    </Div>
  );

  return (
    <>
      {/* Mobile + Tablet: albero con pinch-to-zoom */}
      <Div className="lg:hidden">{mobileContent}</Div>
      {/* Desktop (≥1024px): albero orizzontale con drag e zoom */}
      <Div className="hidden lg:block">{desktopContent}</Div>
    </>
  );
}