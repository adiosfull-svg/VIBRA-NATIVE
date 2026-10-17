// Port di src/components/client/comitive/ComitivaCanvasParts.jsx (convertito da scripts/port/codemod.mjs).
// PORT: <animateMotion>/<animate> (particelle sui fili) e keyframe CSS (cm-pop-in, cm-wire-flow, cm-end-pulse,
// cm-beat) sul telefono sono rifatti in comitiveAnim (Reanimated, thread UI). Sul web restano statici.
import React, { memo } from 'react';
import { Platform } from 'react-native';
import { MapPin, Star, ZoomIn, ZoomOut, Maximize2, Crosshair, Lock, Unlock, Target, MoveDiagonal2, BadgeCheck } from '@/ui/icons.generated';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import {
  LINK_TYPES, SOURCE_META, NODE_W, NODE_H, sourceKey, initialsOf, zoneOf, fmtEuro, wireGeometry, tempWire,
  NODE_KINDS, kindOf,
} from './comitiveUtils';
import { WireClock, WireParticles, FlowPath, PulseCircle, HeartbeatG, PopIn } from './comitiveAnim';

import { Btn, Div, P, Span } from '@/ui/html';
import { Circle, G, Line, Path, Rect, Svg, SvgText } from '@/ui/elements';

const SIDES = ['top', 'right', 'bottom', 'left'];
// PORT: sul telefono valgono le regole [@media(hover:none)] dell'originale (NativeWind non le applica)
const HOVER_NONE = Platform.OS !== 'web';

/* ───────────────────────── Card pagante (stile Funnel Studio) ───────────────────────── */
export const ComitivaNode = memo(function ComitivaNode({
  client, x, y, selected, linkSource, linkTarget, linking, referrerName, locked, scale = 1, goals = 0,
  ownerName, ownerPhoto, entering = false,
}) {
  const kind = kindOf(client);
  const own = kind === 'own';
  const sk = sourceKey(client);
  const src = SOURCE_META[sk];
  const accent = own ? src.color : NODE_KINDS[kind].color;
  const zone = zoneOf(client);
  const inactive = client.stato_pagante && client.stato_pagante !== 'attivo';
  const rating = client.cum_rating ? Number(client.cum_rating).toFixed(1) : '—';
  // Paganti non attivi: si attenua solo il contenuto, la card resta opaca (non deve vedersi il foglio dietro)
  const dim = inactive && !selected ? { opacity: 0.55 } : undefined;

  const handleStyle = (side) => {
    const base = { position: 'absolute', width: 30, height: 30, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'crosshair' };
    if (side === 'top') return { ...base, top: -15, left: '50%', marginLeft: -15 };
    if (side === 'right') return { ...base, right: -15, top: '50%', marginTop: -15 };
    if (side === 'bottom') return { ...base, bottom: -15, left: '50%', marginLeft: -15 };
    return { ...base, left: -15, top: '50%', marginTop: -15 };
  };

  return (
    <Div
      data-node-id={client.id}
      className="absolute group select-none"
      // PORT: sul telefono translate in % come array di RN (lo stile CSS in stringa li scarta)
      style={{ left: x, top: y, width: NODE_W, transform: HOVER_NONE ? [{ translateX: '-50%' }, { translateY: '-50%' }, { scale }] : `translate(-50%, -50%) scale(${scale})`, zIndex: selected || linkSource ? 6 : scale > 1 ? 2 : 1 }}
    >
      {/* data-client-id: stesso menu cliente della lista Clienti (tasto destro / pressione prolungata, ClientSerateMenu).
          data-no-multiselect: qui la pressione lunga non attiva la selezione multipla della lista dietro. */}
      <PopIn entering={entering}>
      <Div
        data-client-id={own ? client.id : undefined}
        data-client-name={own ? client.name || '' : undefined}
        data-no-multiselect={own ? '1' : undefined}
        className="relative rounded-2xl transition-[box-shadow,border-color] duration-200 [-webkit-touch-callout:none]"
        style={{
          // Nascita della card (appena aggiunta): parte piccola, rimbalza e si assesta
          // PORT: sul telefono la fa PopIn (attorno a questo Div)
          animation: entering && !HOVER_NONE ? 'cm-pop-in 560ms cubic-bezier(.2,.9,.3,1.1) both' : undefined,
          minHeight: NODE_H - 10,
          background: selected ? 'linear-gradient(135deg, #1E2535, #242B3D)' : 'linear-gradient(135deg, #141820, #1A1F2E)',
          border: selected
            ? `2px solid ${accent}`
            : linkTarget
              ? `2px dashed ${accent}`
              : '1.5px solid rgba(255,255,255,0.1)',
          boxShadow: selected
            ? `0 0 0 3px ${accent}22, 0 8px 32px rgba(0,0,0,0.6), 0 0 24px ${accent}22`
            : linkTarget
              ? `0 0 0 4px ${accent}33, 0 4px 20px rgba(0,0,0,0.5)`
              : '0 4px 20px rgba(0,0,0,0.4)',
          cursor: linking ? 'crosshair' : locked ? 'pointer' : 'grab',
        }}
      >
        {goals > 0 && (
          <Span
            className="absolute -top-2.5 right-3 z-10 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold pointer-events-none"
            style={{ background: '#2A2210', color: LINK_TYPES.obiettivo.color, border: `1px solid ${LINK_TYPES.obiettivo.color}66` }}
            accessibilityLabel="Amicizie da far nascere"
          >
            <Target className="w-2.5 h-2.5" />{goals}
          </Span>
        )}
        {/* Linea d'accento in alto */}
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl overflow-hidden">
          <Div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent 0%, ${accent} 30%, ${accent} 70%, transparent 100%)` }} />
        </Div>

        {!own ? (
          /* Pagante di un altro PR / promoter Vibra: solo nome, zona e promoter (niente dati personali) */
          <Div className="pointer-events-none">
            <Div className="flex items-start gap-2.5 px-3 pt-3 pb-2">
              <ClientAvatar client={client} initials={initialsOf(client.name)} size="lg" className={`!rounded-xl ${kind === 'ext' ? '!from-sky-500/30 !to-cyan-500/10 !ring-sky-400/40 !text-sky-100' : ''}`} />
              <Div className="min-w-0 flex-1">
                <P className="text-[13px] font-semibold leading-tight text-slate-100 [overflow-wrap:anywhere]">
                  {client.name}
                  {kind === 'promoter' && <BadgeCheck className="inline w-3.5 h-3.5 ml-1 -mt-0.5" style={{ color: accent }} />}
                </P>
                {kind === 'ext' ? (
                  <P className={`mt-0.5 text-[10px] leading-tight flex items-start gap-1 ${zone ? 'text-slate-400' : 'text-slate-600'}`}>
                    <MapPin className="w-3 h-3 shrink-0 mt-px" />
                    <Span className="[overflow-wrap:anywhere]">{zone || 'Zona non indicata'}</Span>
                  </P>
                ) : (
                  <P className="mt-0.5 text-[10px] leading-tight text-slate-400">Fa parte del team Vibra</P>
                )}
              </Div>
            </Div>
            <Div className="px-3 pb-3">
              {kind === 'ext' ? (
                <Span
                  className="inline-flex items-center gap-1.5 max-w-full pl-0.5 pr-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: 'color-mix(in srgb, #38bdf8 14%, #161B26)', color: '#7dd3fc', border: '1px solid color-mix(in srgb, #38bdf8 35%, #161B26)' }}
                >
                  <ClientAvatar client={{ name: ownerName, photo_url: ownerPhoto }} initials={initialsOf(ownerName)} size="xs" />
                  <Span className="truncate">Pagante di {ownerName || 'un altro PR'}</Span>
                </Span>
              ) : (
                <Span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
                  style={{ background: 'color-mix(in srgb, #c084fc 16%, #161B26)', color: '#d8b4fe', border: '1px solid color-mix(in srgb, #c084fc 35%, #161B26)' }}
                >
                  <BadgeCheck className="w-3 h-3" />Promoter Vibra
                </Span>
              )}
            </Div>
          </Div>
        ) : (<>
        {/* Intestazione */}
        <Div className="flex items-start gap-2.5 px-3 pt-3 pb-2 pointer-events-none" style={dim}>
          <ClientAvatar client={client} initials={initialsOf(client.name)} size="lg" className="!rounded-xl" />
          <Div className="min-w-0 flex-1">
            <P className="text-[13px] font-semibold leading-tight text-slate-100 [overflow-wrap:anywhere]">
              {client.name}
              {client.is_leader && <Star className="inline w-3 h-3 ml-1 -mt-0.5 text-amber-400 fill-amber-400" />}
            </P>
            <P className={`mt-0.5 text-[10px] leading-tight flex items-start gap-1 ${zone ? 'text-slate-400' : 'text-slate-600'}`}>
              <MapPin className="w-3 h-3 shrink-0 mt-px" />
              <Span className="[overflow-wrap:anywhere]">{zone || 'Zona non indicata'}</Span>
            </P>
          </Div>
          <Span
            className="w-2 h-2 rounded-full shrink-0 mt-1"
            style={{ background: inactive ? '#64748B' : '#22C55E', boxShadow: inactive ? 'none' : '0 0 5px #22C55E88' }}
          />
        </Div>

        {/* Valori */}
        <Div className="mx-3 mb-2 grid grid-cols-3 rounded-xl overflow-hidden pointer-events-none" style={{ background: '#1C212D', border: '1px solid rgba(255,255,255,0.06)', ...dim }}>
          {[
            ['Valore', fmtEuro(client.cum_total_spent)],
            ['Presenze', client.cum_visits || 0],
            ['Rating', rating],
          ].map(([l, v], i) => (
            <Div key={l} className={`px-1.5 py-1.5 text-center ${i ? 'border-l border-white/5' : ''}`}>
              <P className="text-[8px] uppercase tracking-wider text-slate-500">{l}</P>
              <P className="text-[11px] font-semibold text-slate-100 tabular-nums">{v}</P>
            </Div>
          ))}
        </Div>

        {/* Come è stato conosciuto */}
        <Div className="px-3 pb-3 pointer-events-none" style={dim}>
          {sk === 'referred' ? (
            <P className="text-[10px] leading-tight text-amber-200/90 [overflow-wrap:anywhere]">
              <Span className="text-slate-500">Tramite </Span>
              <Span className="font-semibold">{referrerName || '...'}</Span>
            </P>
          ) : (
            <Span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
              style={{ background: `color-mix(in srgb, ${accent} 16%, #161B26)`, color: accent, border: `1px solid color-mix(in srgb, ${accent} 35%, #161B26)` }}
            >
              {src.label}
            </Span>
          )}
        </Div>
        </>)}
      </Div>
      </PopIn>

      {/* Maniglia d'angolo: trascina per ingrandire / rimpicciolire (importanza nella comitiva) */}
      {!locked && (
        <Div
          data-resize
          className={`transition-opacity duration-150 ${
            linking
              ? 'opacity-0 pointer-events-none'
              : selected
                ? 'opacity-100'
                : HOVER_NONE ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100 [@media(hover:none)]:pointer-events-none'
          }`}
          style={{
            position: 'absolute', right: -13, bottom: -13, width: 30, height: 30, zIndex: 31,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'nwse-resize',
            transform: `scale(${1 / scale})`, touchAction: 'none',
          }}
          accessibilityLabel="Trascina per ingrandire o rimpicciolire"
        >
          <Span
            className="flex items-center justify-center rounded-full"
            style={{ width: 22, height: 22, background: '#1A2035', border: `1.5px solid ${accent}`, boxShadow: `0 0 10px ${accent}55` }}
          >
            <MoveDiagonal2 className="w-3 h-3" style={{ color: accent }} />
          </Span>
        </Div>
      )}

      {/* Maniglie di collegamento sui bordi */}
      {!locked && SIDES.map((side) => (
        <Div key={side} data-handle={side} style={handleStyle(side)}>
          <Span
            className={`block rounded-full transition-all duration-150 ${
              selected || linkSource || linking || HOVER_NONE ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100'
            }`}
            style={{
              width: 14,
              height: 14,
              background: linkSource ? accent : '#1A2035',
              border: `2px solid ${linkSource || linking ? accent : 'rgba(255,255,255,0.28)'}`,
              boxShadow: linkSource ? `0 0 0 3px ${accent}33, 0 0 14px ${accent}88` : linking ? `0 0 8px ${accent}55` : 'none',
            }}
          />
        </Div>
      ))}
    </Div>
  );
});

/* ───────────────────────── Fili (memo: non si ridisegnano su pan/zoom) ───────────────────────── */
export const WiresLayer = memo(function WiresLayer({
  svgRef, edges, pos, heights, sizes = {}, selectedNodeId, selectedEdgeId, draggingId, linkDraft, paused = false,
}) {
  const beats = [];
  // PORT: sul telefono particelle solo fino a PARTICLE_MAX fili (5 cerchi animati per filo sul thread UI)
  const particles = HOVER_NONE && edges.length <= PARTICLE_MAX;
  const wires = edges.map((e, idx) => {
    const a = pos[e.from];
    const b = pos[e.to];
    if (!a || !b) return null;
    const color = LINK_TYPES[e.type].color;
    const w = wireGeometry(a, b, heights[e.from], heights[e.to], sizes[e.from] || 1, sizes[e.to] || 1);
    const goal = !!LINK_TYPES[e.type].goal;
    const isSel = selectedEdgeId === e.id;
    const touches = !!selectedNodeId && (e.from === selectedNodeId || e.to === selectedNodeId);
    const hot = isSel || touches;
    const dim = !!((selectedNodeId && !touches) || (selectedEdgeId && !isSel));
    const moving = !!draggingId && (e.from === draggingId || e.to === draggingId);
    const labelW = e.label ? Math.min(e.label.length * 5.6 + 20, 200) : 0;
    if (!hot) beats.push({ key: e.id, color, a: w.from, b: w.to, dim });
    return (
      <G key={e.id} opacity={dim ? 0.12 : 1}>
        <Path d={w.d} fill="none" stroke={color} strokeWidth={hot ? 9 : 7} strokeOpacity={hot ? 0.08 : 0.045} strokeLinecap="round" />
        <Path d={w.d} fill="none" stroke={color} strokeWidth={hot ? 3.5 : 2.6} strokeOpacity={hot ? 0.2 : 0.11} strokeLinecap="round" />
        <Path
          d={w.d}
          fill="none"
          stroke={color}
          strokeWidth={goal ? (hot ? 2 : 1.5) : hot ? 1.6 : 1}
          strokeOpacity={goal ? (hot ? 0.95 : 0.75) : hot ? 0.8 : 0.5}
          strokeLinecap="round"
          strokeDasharray={goal ? '6 8' : undefined}
          style={goal && !moving && !HOVER_NONE ? { animation: 'cm-wire-flow 1.6s linear infinite' } : undefined}
        />
        {/* PORT: cm-wire-flow sul telefono: tratteggio animato sopra (stesso tratto) */}
        {HOVER_NONE && goal && !moving && (
          <FlowPath period={1.6} d={w.d} fill="none" stroke={color} strokeWidth={hot ? 2 : 1.5} strokeOpacity={hot ? 0.95 : 0.75} strokeLinecap="round" strokeDasharray="6 8" />
        )}
        {goal && !e.label && (
          <G style={{ pointerEvents: 'none' }}>
            <Circle cx={w.mid.x} cy={w.mid.y} r={9} fill="#0A0D14" stroke={`${color}88`} strokeWidth={1} />
            <Circle cx={w.mid.x} cy={w.mid.y} r={5} fill="none" stroke={color} strokeWidth={1.2} />
            <Circle cx={w.mid.x} cy={w.mid.y} r={1.8} fill={color} />
          </G>
        )}

        {/* PORT: particelle <animateMotion> dell'originale: sul telefono WireParticles, sul web assenti */}
        {particles && !moving && !goal && <WireParticles w={w} color={color} hot={hot} idx={idx} />}

        {hot && [w.from, w.to].map((p, i) => (
          <G key={i}>
            <Circle cx={p.x} cy={p.y} r={5.5} fill={color} fillOpacity={0.2} />
            <Circle cx={p.x} cy={p.y} r={2.8} fill={color} />
            {HOVER_NONE
              ? <PulseCircle period={1.4} cx={p.x} cy={p.y} fill="none" stroke={color} strokeWidth={1.2} />
              : <Circle cx={p.x} cy={p.y} r={3.5} fill="none" stroke={color} strokeWidth={1.2} style={{ animation: 'cm-end-pulse 1.4s ease-in-out infinite' }} />}
          </G>
        ))}

        {e.label && (
          <G style={{ pointerEvents: 'none' }}>
            <Rect x={w.mid.x - labelW / 2} y={w.mid.y - 10} width={labelW} height={19} rx={9} fill="#0A0D14" stroke={`${color}55`} strokeWidth={1} />
            <SvgText x={w.mid.x} y={w.mid.y + 3.5} textAnchor="middle" fontSize="9.5" fontWeight="600" fill={color}>{e.label}</SvgText>
          </G>
        )}

        <Path data-edge-id={e.id} d={w.d} fill="none" stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'stroke', cursor: 'pointer' }} />
      </G>
    );
  });

  let temp = null;
  if (linkDraft && pos[linkDraft.from] && linkDraft.to) {
    const w = tempWire(pos[linkDraft.from], heights[linkDraft.from], linkDraft.side, linkDraft.to, sizes[linkDraft.from] || 1);
    temp = (
      <G>
        <Path d={w.d} fill="none" stroke="#f472b6" strokeWidth={7} strokeOpacity={0.07} strokeLinecap="round" />
        {HOVER_NONE
          ? <FlowPath period={1.2} d={w.d} fill="none" stroke="#f472b6" strokeWidth={1.4} strokeOpacity={0.7} strokeDasharray="6 8" />
          : <Path d={w.d} fill="none" stroke="#f472b6" strokeWidth={1.4} strokeOpacity={0.7} strokeDasharray="6 8" style={{ animation: 'cm-wire-flow 1.2s linear infinite' }} />}
        <Circle cx={w.from.x} cy={w.from.y} r={3} fill="#f472b6" />
        {HOVER_NONE
          ? <PulseCircle period={1.2} cx={linkDraft.to.x} cy={linkDraft.to.y} fill="none" stroke="#f472b6" strokeWidth={1.2} />
          : <Circle cx={linkDraft.to.x} cy={linkDraft.to.y} r={4} fill="none" stroke="#f472b6" strokeWidth={1.2} style={{ animation: 'cm-end-pulse 1.2s ease-in-out infinite' }} />}
      </G>
    );
  }

  // PORT: sul telefono un <Svg> 1×1 con overflow-visible taglia i fili (react-native-svg disegna solo nel
  // suo riquadro): riquadro grande quanto i nodi, contenuto spostato con un <G>.
  const box = HOVER_NONE ? svgBox(pos, linkDraft) : null;
  const content = (
    <>
      {wires}
      <BeatGroup>
        {beats.map((bt) => (
          <G key={bt.key} opacity={bt.dim ? 0.12 : 1}>
            <Circle cx={bt.a.x} cy={bt.a.y} r={5.5} fill={bt.color} fillOpacity={0.18} />
            <Circle cx={bt.a.x} cy={bt.a.y} r={2.6} fill={bt.color} />
            <Circle cx={bt.b.x} cy={bt.b.y} r={5.5} fill={bt.color} fillOpacity={0.18} />
            <Circle cx={bt.b.x} cy={bt.b.y} r={2.6} fill={bt.color} />
          </G>
        ))}
      </BeatGroup>
      {temp}
    </>
  );
  if (!box) return <Svg ref={svgRef} className="absolute left-0 top-0 overflow-visible" width="1" height="1" style={{ pointerEvents: 'none' }}>{content}</Svg>;
  return (
    <WireClock paused={paused}>
      <Svg ref={svgRef} width={box.w} height={box.h} style={{ position: 'absolute', left: box.x, top: box.y, pointerEvents: 'none' }}>
        <G transform={`translate(${-box.x} ${-box.y})`}>{content}</G>
      </Svg>
    </WireClock>
  );
});

const PARTICLE_MAX = 60;

/** cm-heartbeat: sul web la classe del keyframe CSS, sul telefono HeartbeatG (stesso battito). */
function BeatGroup({ children }) {
  if (HOVER_NONE) return <HeartbeatG>{children}</HeartbeatG>;
  return <G className="cm-heartbeat" style={{ pointerEvents: 'none' }}>{children}</G>;
}

/** Riquadro (mondo) che contiene tutti i nodi e il filo in costruzione, con margine per curve ed etichette. */
function svgBox(pos, linkDraft) {
  const pts = Object.values(pos);
  if (linkDraft?.to) pts.push(linkDraft.to);
  if (!pts.length) return { x: 0, y: 0, w: 1, h: 1 };
  const M = NODE_W * 1.6;
  const x = Math.floor(Math.min(...pts.map((p) => p.x)) - M);
  const y = Math.floor(Math.min(...pts.map((p) => p.y)) - M);
  const w = Math.ceil(Math.max(...pts.map((p) => p.x)) + M) - x;
  const h = Math.ceil(Math.max(...pts.map((p) => p.y)) + M) - y;
  return { x, y, w, h };
}

/* ───────────────────────── Controlli zoom (colonna, stile Funnel) ───────────────────────── */
function ControlBtn({ icon, onClick, title }) {
  return (
    <Btn
      button
      onClick={onClick}
      className="flex items-center justify-center w-11 h-10 text-slate-500 hover:text-slate-100 hover:bg-white/10 active:bg-white/15 transition-colors"
      accessibilityLabel={title}
    >
      {icon}
    </Btn>
  );
}

export function CanvasControls({ zoom, onZoomIn, onZoomOut, onFit, onCenter, locked, onToggleLock }) {
  return (
    <Div
      data-ui
      className="absolute bottom-4 left-4 z-20 flex flex-col rounded-xl overflow-hidden"
      style={{ background: 'rgba(15,17,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
    >
      <ControlBtn icon={<ZoomIn className="w-4 h-4" />} onClick={onZoomIn} title="Ingrandisci" />
      <Btn
        button
        onClick={onCenter}
        className="flex items-center justify-center h-7 text-[10px] font-mono font-semibold text-slate-400 hover:text-slate-100"
        accessibilityLabel="Zoom 100%"
      >
        {Math.round(zoom * 100)}%
      </Btn>
      <ControlBtn icon={<ZoomOut className="w-4 h-4" />} onClick={onZoomOut} title="Riduci" />
      <Div className="h-px mx-2 bg-white/10" />
      <ControlBtn icon={<Maximize2 className="w-4 h-4" />} onClick={onFit} title="Adatta allo schermo" />
      <ControlBtn icon={<Crosshair className="w-4 h-4" />} onClick={onCenter} title="Centra" />
      <Div className="h-px mx-2 bg-white/10" />
      <ControlBtn
        icon={locked ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4" />}
        onClick={onToggleLock}
        title={locked ? 'Sblocca' : 'Blocca (niente spostamenti)'}
      />
    </Div>
  );
}

/* ───────────────────────── Minimappa ───────────────────────── */
export function CanvasMinimap({ nodes, edges, pos, sizes = {}, view, size, onJump }) {
  const W = 180;
  const H = 110;
  const pts = nodes.map((n) => pos[n.id]).filter(Boolean);
  if (!pts.length) return null;
  const minX = Math.min(...pts.map((p) => p.x)) - NODE_W;
  const minY = Math.min(...pts.map((p) => p.y)) - NODE_H;
  const maxX = Math.max(...pts.map((p) => p.x)) + NODE_W;
  const maxY = Math.max(...pts.map((p) => p.y)) + NODE_H;
  const sc = Math.min(W / (maxX - minX), H / (maxY - minY));
  const mx = (x) => (x - minX) * sc;
  const my = (y) => (y - minY) * sc;
  const vx = -view.x / view.k;
  const vy = -view.y / view.k;
  const handle = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onJump?.({ x: (e.clientX - r.left) / sc + minX, y: (e.clientY - r.top) / sc + minY });
  };
  return (
    <Btn
      data-ui
      className="absolute bottom-4 right-4 z-20 rounded-xl overflow-hidden hidden md:block cursor-pointer"
      style={{ width: W, height: H, background: 'rgba(15,17,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
      onClick={handle}
    >
      <Span className="absolute top-1.5 left-2.5 text-[8px] font-semibold uppercase tracking-widest text-slate-600">Minimappa</Span>
      <Svg width={W} height={H}>
        {edges.map((e) => {
          const a = pos[e.from];
          const b = pos[e.to];
          if (!a || !b) return null;
          return <Line key={e.id} x1={mx(a.x)} y1={my(a.y)} x2={mx(b.x)} y2={my(b.y)} stroke={LINK_TYPES[e.type].color} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray={LINK_TYPES[e.type].goal ? '2 2' : undefined} />;
        })}
        {nodes.map((n) => {
          const p = pos[n.id];
          if (!p) return null;
          const c = SOURCE_META[sourceKey(n)].color;
          const s = sizes[n.id] || 1;
          return <Rect key={n.id} x={mx(p.x - (NODE_W * s) / 2)} y={my(p.y - (NODE_H * s) / 2)} width={Math.max(NODE_W * s * sc, 5)} height={Math.max(NODE_H * s * sc, 4)} rx={1.5} fill={`${c}44`} stroke={c} strokeWidth="0.6" />;
        })}
        <Rect x={mx(vx)} y={my(vy)} width={(size.w / view.k) * sc} height={(size.h / view.k) * sc} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3 2" rx={1} />
      </Svg>
    </Btn>
  );
}
