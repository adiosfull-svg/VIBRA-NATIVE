// Port di src/components/client/ClientFamilyTreeMobile.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - <div> gesture/eventi web rimossi: onTouchStart, onTouchMove, onTouchEnd
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from '@/ui/motion';
import { ChevronDown, ChevronRight, Users, Euro, Star, GitBranch, AlignJustify, GitFork, ZoomIn, ZoomOut, RotateCcw } from '@/ui/icons.generated';
import { rankingColor } from '@/legacy/utils/clientRanking';
import { Gem } from '@/ui/icons.generated';
import { TreeNode } from '@/web/components/client/ClientFamilyTree';
import CachedImage from '@/web/components/shared/CachedImage';

import { Btn, Div, P, Span } from '@/ui/html';

const DEPTH_COLORS = [
  { bar: 'bg-primary', text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' },
  { bar: 'bg-cyan-500', text: 'text-cyan-300', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  { bar: 'bg-amber-500', text: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { bar: 'bg-emerald-500', text: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { bar: 'bg-rose-500', text: 'text-rose-300', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  { bar: 'bg-indigo-400', text: 'text-indigo-300', bg: 'bg-indigo-400/10', border: 'border-indigo-400/30' },
  { bar: 'bg-lime-400', text: 'text-lime-300', bg: 'bg-lime-400/10', border: 'border-lime-400/30' },
  { bar: 'bg-orange-500', text: 'text-orange-300', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { bar: 'bg-teal-400', text: 'text-teal-300', bg: 'bg-teal-400/10', border: 'border-teal-400/30' },
  { bar: 'bg-fuchsia-500', text: 'text-fuchsia-300', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30' },
];

// ─── LOD (Level of Detail) in base al livello di zoom ───
// zoom >= 0.85 → full: nome, stats, ranking, rami
// zoom >= 0.55 → medium: nome + ranking
// zoom <  0.55 → compact: solo avatar colorato + stellina leader

function getLOD(zoom) {
  if (zoom >= 0.85) return 'full';
  if (zoom >= 0.55) return 'medium';
  return 'compact';
}

/** Nodo mobile lista verticale con LOD */
function MobileListNode({ node, depth, onClientClick, allClients, cumMap, zoom }) {
  const [expanded, setExpanded] = useState(true);
  const { client, children } = node;
  const hasChildren = children.length > 0;

  // Pre-calcolato sul backend (cum_*): zero filtering presenze per nodo
  const cs = cumMap[client.id] || { visits: 0, totalSpent: 0, ranking: null };
  const totalSpent = cs.totalSpent;
  const visits = cs.visits;
  const ranking = cs.ranking;

  const initials = client.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const depthIdx = Math.min(depth, DEPTH_COLORS.length - 1);
  const colors = DEPTH_COLORS[depthIdx];
  const lod = getLOD(zoom);

  // Avatar ridotto per compact
  const avatarSize = lod === 'compact' ? 'w-5 h-5 text-[7px]' : 'w-8 h-8 text-[10px]';

  return (
    <Div>
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.03 }}
        onClick={() => onClientClick(client)}
        className="w-full"
      >
        <Div
          className="flex items-center gap-2 py-2 rounded-lg transition-colors active:bg-secondary/30"
          style={{ paddingLeft: `${depth * (lod === 'compact' ? 8 : 12)}px` }}
        >
          {hasChildren && lod !== 'compact' ? (
            <Btn
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="shrink-0 p-0.5 rounded text-muted-foreground active:text-foreground"
            >
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </Btn>
          ) : (
            <Span className="w-4 shrink-0" />
          )}

          {lod !== 'compact' && <Div className={`w-0.5 h-8 rounded-full shrink-0 ${colors.bar}`} />}

          <Div className={`relative rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden ${colors.bg} ${colors.text} ${avatarSize}`}>
            <Span className="relative z-0">{initials}</Span>
            {client.photo_url && (
              <CachedImage src={client.photo_url} alt={client.name} className="absolute inset-0 w-full h-full object-cover z-10" loading="lazy" decoding="async" onError={(e) => e.currentTarget.style.display = 'none'} />
            )}
            {client.is_leader && (
              <Star className={`absolute text-yellow-400 fill-yellow-400 drop-shadow-md ${lod === 'compact' ? '-top-1 -right-1 w-3 h-3' : '-top-1 -right-1 w-3.5 h-3.5'}`} />
            )}
          </Div>

          {lod !== 'compact' && (
            <Div className="flex-1 min-w-0 text-left">
              <P className="text-xs font-semibold truncate">{client.name}</P>
              {lod === 'full' && (
                <Div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                  <Span className="inline-flex items-center gap-0.5"><Users className="w-2.5 h-2.5" />{visits}</Span>
                  <Span className="inline-flex items-center gap-0.5"><Euro className="w-2.5 h-2.5" />{totalSpent > 0 ? `€${totalSpent}` : '—'}</Span>
                  {ranking !== null && (
                    <Span className={`inline-flex items-center gap-0.5 font-bold ${rankingColor(ranking)}`}>
                      <Gem className="w-2.5 h-2.5" />{ranking.toFixed(1)}
                    </Span>
                  )}
                </Div>
              )}
            </Div>
          )}

          {lod === 'compact' ? (
            /* Compact: testo nome abbreviato accanto a pallino */
            <Span className="text-[9px] text-muted-foreground truncate max-w-[60px]">{client.name?.split(' ')[0]}</Span>
          ) : (
            hasChildren && (
              <Span className="text-[9px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full shrink-0">
                {children.length}
              </Span>
            )
          )}
        </Div>
      </motion.button>

      <AnimatePresence>
        {hasChildren && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children.map(child => (
              <MobileListNode
                key={child.client.id}
                node={child}
                depth={depth + 1}
                onClientClick={onClientClick}
                allClients={allClients}
                cumMap={cumMap}
                zoom={zoom}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Div>
  );
}

// ─── MINI ZOOM CONTROLS ───
function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset }) {
  return (
    <Div className="flex items-center gap-1.5 justify-center pb-2">
      <Span className="text-[9px] text-muted-foreground">Zoom</Span>
      <Btn onClick={onZoomOut} className="p-1 rounded-md bg-secondary/60 text-muted-foreground hover:text-foreground active:bg-secondary">
        <ZoomOut className="w-3.5 h-3.5" />
      </Btn>
      <Span className="text-[10px] font-semibold text-foreground w-9 text-center">{Math.round(zoom * 100)}%</Span>
      <Btn onClick={onZoomIn} className="p-1 rounded-md bg-secondary/60 text-muted-foreground hover:text-foreground active:bg-secondary">
        <ZoomIn className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={onReset} className="p-1 rounded-md bg-secondary/60 text-muted-foreground hover:text-foreground active:bg-secondary ml-1">
        <RotateCcw className="w-3 h-3" />
      </Btn>
    </Div>
  );
}

export default function ClientFamilyTreeMobile({ clients, attendances, events, onClientClick }) {
  const [viewMode, setViewMode] = useState('list');
  const [displayZoom, setDisplayZoom] = useState(1.0);

  // ─── Refs: pan + zoom GPU-composited (transform, non zoom CSS → zero layout) ───
  const zoomRef = useRef(1.0);
  const panRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const viewportRef = useRef(null);
  const gestureRef = useRef({
    type: null,    // 'drag' | 'pinch'
    startX: 0, startY: 0, panStartX: 0, panStartY: 0,
    dist0: 0, zoom0: 1.0, fx: 0, fy: 0,
    vpRect: null,  // viewport rect cache (evita getBoundingClientRect ogni frame)
  });
  const centeredRef = useRef(false);

  const getTouchesDist = (touches) => {
    if (touches.length < 2) return 0;
    return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
  };

  // Applica trasformata via DOM (GPU → zero layout thrashing)
  const applyTransform = useCallback(() => {
    if (!canvasRef.current) return;
    const { x, y } = panRef.current;
    canvasRef.current.style.transform = `translate(${x}px, ${y}px) scale(${zoomRef.current})`;
  }, []);

  // ─── Touch handlers: distinguono drag (1 dito) da pinch (2 dita) ───
  const onTouchStart = useCallback((e) => {
    if (viewMode !== 'tree') return; // list view usa page scroll nativo
    // Cattura viewport rect UNA volta (evita layout thrashing su ogni frame)
    const vpRect = viewportRef.current ? viewportRef.current.getBoundingClientRect() : null;

    // Attiva will-change SOLO durante gesture attiva (previene glitch bordi)
    if (canvasRef.current) canvasRef.current.style.willChange = 'transform';

    if (e.touches.length === 1) {
      gestureRef.current = {
        type: 'drag',
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        panStartX: panRef.current.x,
        panStartY: panRef.current.y,
        vpRect,
      };
    } else if (e.touches.length === 2) {
      gestureRef.current = {
        type: 'pinch',
        dist0: getTouchesDist(e.touches),
        zoom0: zoomRef.current,
        fx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        fy: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        panStartX: panRef.current.x,
        panStartY: panRef.current.y,
        vpRect,
      };
    }
  }, [viewMode]);

  const onTouchMove = useCallback((e) => {
    if (viewMode !== 'tree' || !canvasRef.current || !viewportRef.current) return;
    const g = gestureRef.current;
    if (!g.type) return;

    if (g.type === 'drag' && e.touches.length === 1) {
      // Pan: sposta il contenuto (GPU-composited)
      const dx = e.touches[0].clientX - g.startX;
      const dy = e.touches[0].clientY - g.startY;
      panRef.current = { x: g.panStartX + dx, y: g.panStartY + dy };
      applyTransform();
    }

    if (g.type === 'pinch' && e.touches.length === 2) {
      const ratio = getTouchesDist(e.touches) / g.dist0;
      const newZoom = Math.max(0.2, Math.min(2.0, g.zoom0 * ratio));
      zoomRef.current = newZoom;

      // Focal point: mantieni fermo il punto tra le dita (usa rect cached, zero layout read)
      const vr = g.vpRect;
      // Punto focale relativo al viewport (prima del cambio zoom)
      const relX = g.fx - vr.left;
      const relY = g.fy - vr.top;
      // Posizione nel "mondo" prima dello zoom
      const worldX = (relX - g.panStartX) / g.zoom0;
      const worldY = (relY - g.panStartY) / g.zoom0;
      // Nuovo pan per mantenere fisso il punto
      panRef.current = {
        x: relX - worldX * newZoom,
        y: relY - worldY * newZoom,
      };
      applyTransform();
    }
  }, [viewMode, applyTransform]);

  const onTouchEnd = useCallback(() => {
    gestureRef.current.type = null;
    // Rimuovi will-change: evita glitch bordi e libera memoria GPU
    if (canvasRef.current) canvasRef.current.style.willChange = 'auto';
    setDisplayZoom(zoomRef.current);
  }, []);

  // ─── Bottoni zoom: trasformata diretta ───
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
    if (centeredRef.current || !viewportRef.current || !canvasRef.current || viewMode !== 'tree') return;
    const raf = requestAnimationFrame(() => {
      if (!viewportRef.current || !canvasRef.current) return;
      const vp = viewportRef.current;
      const cw = canvasRef.current.scrollWidth;  // larghezza naturale (pre-transform)
      panRef.current = { x: (vp.clientWidth - cw) / 2, y: 0 };
      applyTransform();
      centeredRef.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, [viewMode, applyTransform]);

  // Mappa cum_* pre-calcolata sul backend (zero filtering presenze)
  const clientCumMap = useMemo(() => {
    const m = {};
    clients.forEach(c => { m[c.id] = {
      visits: c.cum_visits || 0,
      totalSpent: c.cum_total_spent || 0,
      ranking: (c.cum_visits || 0) > 0 ? (c.cum_rating || 0) : null,
    }});
    return m;
  }, [clients]);

  // ─── Tree data ───
  const { roots } = useMemo(() => {
    const map = {};
    clients.forEach(c => { map[c.id] = c; });
    const chMap = {};
    clients.forEach(c => {
      const pid = c.referred_by_client_id;
      if (pid && map[pid]) {
        if (!chMap[pid]) chMap[pid] = [];
        chMap[pid].push(c.id);
      }
    });

    function totalDesc(id) {
      let count = 0;
      const stack = [id];
      while (stack.length) {
        const cur = stack.pop();
        (chMap[cur] || []).forEach(cid => { count++; stack.push(cid); });
      }
      return count;
    }

    function impScore(cid) {
      const cs = clientCumMap[cid] || { totalSpent: 0, visits: 0 };
      const branches = (chMap[cid] || []).length;
      return cs.totalSpent * 0.4 + cs.visits * 1 + branches * 3;
    }

    function buildNode(id) {
      const client = map[id];
      if (!client) return null;
      const childIds = (chMap[id] || []).sort((a, b) => impScore(b) - impScore(a));
      return { client, children: childIds.map(cid => buildNode(cid)).filter(Boolean) };
    }

    const rootIds = clients
      .filter(c => !c.referred_by_client_id || !map[c.referred_by_client_id])
      .filter(c => chMap[c.id]?.length > 0)
      .sort((a, b) => totalDesc(b.id) - totalDesc(a.id))
      .map(c => c.id);

    return { roots: rootIds.map(id => buildNode(id)).filter(Boolean) };
  }, [clients, clientCumMap]);

  const maxSpent = useMemo(() => clients.reduce((max, c) => Math.max(max, c.cum_total_spent || 0), 0), [clients]);

  if (roots.length === 0) {
    return (
      <Div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <Div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <GitBranch className="w-7 h-7 text-primary/50" />
        </Div>
        <P className="font-semibold text-sm text-foreground">Nessun albero genealogico</P>
        <P className="text-xs text-muted-foreground max-w-xs">
          Non ci sono ancora ramificazioni tra i tuoi clienti.
        </P>
      </Div>
    );
  }

  const legend = (
    <Div className="flex items-center gap-3 justify-center flex-wrap pb-2">
      <Span className="text-[9px] flex items-center gap-1"><Span className="w-2 h-2 rounded-sm bg-primary" /> Radice</Span>
      <Span className="text-[9px] flex items-center gap-1"><Span className="w-2 h-2 rounded-sm bg-cyan-500" /> 1ª</Span>
      <Span className="text-[9px] flex items-center gap-1"><Span className="w-2 h-2 rounded-sm bg-amber-500" /> 2ª</Span>
      <Span className="text-[9px] flex items-center gap-1"><Span className="w-2 h-2 rounded-sm bg-emerald-500" /> 3ª</Span>
      <Span className="text-[9px] flex items-center gap-1"><Span className="w-2 h-2 rounded-sm bg-rose-500" /> 4ª+</Span>
    </Div>
  );

  const viewToggle = (
    <Div className="flex justify-center pb-2">
      <Div className="inline-flex rounded-lg bg-secondary/60 p-0.5 gap-0.5">
        <Btn
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
            viewMode === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
          }`}
        >
          <AlignJustify className="w-3.5 h-3.5" /> Lista
        </Btn>
        <Btn
          onClick={() => setViewMode('tree')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
            viewMode === 'tree' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" /> Albero
        </Btn>
      </Div>
    </Div>
  );

  return (
    <Div>
      {legend}
      {viewToggle}
      <ZoomControls zoom={displayZoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={zoomReset} />

      {/* ── LISTA VERTICALE: zoom CSS + scroll pagina nativo ── */}
      {viewMode === 'list' && (
        <Div className="space-y-0 divide-y divide-border/30" style={{ zoom: displayZoom, touchAction: 'manipulation' }}>
          {roots.map((root) => (
            <Div key={root.client.id} className="pt-1 pb-2">
              <Div className="px-2 pt-2 pb-1">
                <Div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">
                  Radice — {root.client.name}
                </Div>
              </Div>
              <MobileListNode
                node={root}
                depth={0}
                onClientClick={onClientClick}
                allClients={clients}
                cumMap={clientCumMap}
                zoom={displayZoom}
              />
            </Div>
          ))}
        </Div>
      )}

      {/* ── ALBERO: GPU-composited (transform, non zoom) → tipo browser ── */}
      {viewMode === 'tree' && (
        <Div
          ref={viewportRef}
          className="overflow-hidden select-none rounded-xl border border-border/40"
          style={{
            touchAction: 'none',
            maxHeight: 'calc(100vh - 260px)',
            minHeight: '50vh',
          }}
        >
          <Div
            ref={canvasRef}
            className="min-w-fit"
            style={{ transformOrigin: '0 0' }}
          >
            <Div className="flex flex-col gap-8 py-6 px-4 min-w-max">
              {roots.map((root) => (
                <Div key={root.client.id} className="flex flex-col">
                  <Div className="self-center mb-2 px-3 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-semibold text-primary uppercase tracking-wider">
                    Radice
                  </Div>
                  <TreeNode
                    node={root}
                    depth={0}
                    onClientClick={onClientClick}
                    allClients={clients}
                    cumMap={clientCumMap}
                    focusedClientId={null}
                    onFocus={() => {}}
                    focusPathSet={new Set()}
                    maxSpent={maxSpent}
                    compact
                  />
                </Div>
              ))}
            </Div>
            <P className="text-center text-[9px] text-muted-foreground pb-3">
              Trascina per esplorare i rami • Fai pinch per zoom
            </P>
          </Div>
        </Div>
      )}
    </Div>
  );
}