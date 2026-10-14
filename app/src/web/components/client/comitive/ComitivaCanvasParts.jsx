// Port di src/components/client/comitive/ComitivaCanvasParts.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - tag <animateMotion> non mappato
//  - tag <animate> non mappato
import React, { memo } from 'react';
import { MapPin, Star, ZoomIn, ZoomOut, Maximize2, Crosshair, Lock, Unlock } from '@/ui/icons.generated';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import {
  LINK_TYPES, SOURCE_META, NODE_W, NODE_H, sourceKey, initialsOf, zoneOf, fmtEuro, wireGeometry, tempWire,
} from './comitiveUtils';

import { Btn, Div, P, Span } from '@/ui/html';
import { Circle, G, Line, Path, Rect, Svg, SvgText } from '@/ui/elements';

const SIDES = ['top', 'right', 'bottom', 'left'];

/* ───────────────────────── Card pagante (stile Funnel Studio) ───────────────────────── */
export const ComitivaNode = memo(function ComitivaNode({
  client, x, y, selected, linkSource, linkTarget, linking, referrerName, locked,
}) {
  const sk = sourceKey(client);
  const src = SOURCE_META[sk];
  const accent = src.color;
  const zone = zoneOf(client);
  const inactive = client.stato_pagante && client.stato_pagante !== 'attivo';
  const rating = client.cum_rating ? Number(client.cum_rating).toFixed(1) : '—';

  const handleStyle = (side) => {
    const base = { position: 'absolute', width: 30, height: 30, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'crosshair' };
    if (side === 'top') return { ...base, top: -15, left: '50%', marginLeft: -15 };
    if (side === 'right') return { ...base, right: -15, top: '50%', marginTop: -15 };
    if (side === 'bottom') return { ...base, bottom: -15, left: '50%', marginLeft: -15 };
    return { ...base, left: -15, top: '50%', marginTop: -15 };
  };

  return (
    <Div
      className="absolute group select-none"
      style={{ left: x, top: y, width: NODE_W, transform: 'translate(-50%, -50%)', zIndex: selected || linkSource ? 6 : 1 }}>
      <Div
        className="relative rounded-2xl transition-[box-shadow,border-color] duration-200"
        style={{
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
          opacity: inactive && !selected ? 0.6 : 1,
        }}
      >
        {/* Linea d'accento in alto */}
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl overflow-hidden">
          <Div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent 0%, ${accent} 30%, ${accent} 70%, transparent 100%)` }} />
        </Div>

        {/* Intestazione */}
        <Div className="flex items-start gap-2.5 px-3 pt-3 pb-2 pointer-events-none">
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
        <Div className="mx-3 mb-2 grid grid-cols-3 rounded-xl overflow-hidden pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
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
        <Div className="px-3 pb-3 pointer-events-none">
          {sk === 'referred' ? (
            <P className="text-[10px] leading-tight text-amber-200/90 [overflow-wrap:anywhere]">
              <Span className="text-slate-500">Tramite </Span>
              <Span className="font-semibold">{referrerName || '...'}</Span>
            </P>
          ) : (
            <Span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
              style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}33` }}
            >
              {src.label}
            </Span>
          )}
        </Div>
      </Div>

      {/* Maniglie di collegamento sui bordi */}
      {!locked && SIDES.map((side) => (
        <Div key={side} style={handleStyle(side)}>
          <Span
            className={`block rounded-full transition-all duration-150 ${
              selected || linkSource || linking ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100'
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
  svgRef, edges, pos, heights, selectedNodeId, selectedEdgeId, draggingId, linkDraft,
}) {
  const beats = [];
  const wires = edges.map((e, idx) => {
    const a = pos[e.from];
    const b = pos[e.to];
    if (!a || !b) return null;
    const color = LINK_TYPES[e.type].color;
    const w = wireGeometry(a, b, heights[e.from], heights[e.to]);
    const isSel = selectedEdgeId === e.id;
    const touches = !!selectedNodeId && (e.from === selectedNodeId || e.to === selectedNodeId);
    const hot = isSel || touches;
    const dim = !!((selectedNodeId && !touches) || (selectedEdgeId && !isSel));
    const moving = !!draggingId && (e.from === draggingId || e.to === draggingId);
    const delay = ((idx * 0.55) % 3).toFixed(2);
    const delay2 = ((idx * 0.55 + 1.4) % 3).toFixed(2);
    const dur = hot ? '1.6s' : '2.8s';
    const labelW = e.label ? Math.min(e.label.length * 5.6 + 20, 200) : 0;
    if (!hot) beats.push({ key: e.id, color, a: w.from, b: w.to, dim });
    return (
      <G key={e.id} opacity={dim ? 0.12 : 1}>
        <Path d={w.d} fill="none" stroke={color} strokeWidth={hot ? 9 : 7} strokeOpacity={hot ? 0.08 : 0.045} strokeLinecap="round" />
        <Path d={w.d} fill="none" stroke={color} strokeWidth={hot ? 3.5 : 2.6} strokeOpacity={hot ? 0.2 : 0.11} strokeLinecap="round" />
        <Path d={w.d} fill="none" stroke={color} strokeWidth={hot ? 1.6 : 1} strokeOpacity={hot ? 0.8 : 0.5} strokeLinecap="round" />

        {!moving && (
          <>
            <G opacity="0">
              <Circle r={hot ? 6 : 5} fill={color} fillOpacity={0.22} />
              <Circle r={hot ? 2.6 : 2.1} fill={color} />
              <Circle r={hot ? 1.2 : 0.9} fill="white" fillOpacity={0.9} />
              <Div dur={dur} begin={`${delay}s`} repeatCount="indefinite" path={w.d} />
              <Div attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.15;0.85;1" dur={dur} begin={`${delay}s`} repeatCount="indefinite" />
            </G>
            <G opacity="0">
              <Circle r={hot ? 3.6 : 2.8} fill="white" fillOpacity={0.14} />
              <Circle r={hot ? 1.6 : 1.2} fill="white" fillOpacity={0.6} />
              <Div dur={dur} begin={`${delay2}s`} repeatCount="indefinite" path={w.d} />
              <Div attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.15;0.85;1" dur={dur} begin={`${delay2}s`} repeatCount="indefinite" />
            </G>
          </>
        )}

        {hot && [w.from, w.to].map((p, i) => (
          <G key={i}>
            <Circle cx={p.x} cy={p.y} r={5.5} fill={color} fillOpacity={0.2} />
            <Circle cx={p.x} cy={p.y} r={2.8} fill={color} />
            <Circle cx={p.x} cy={p.y} r={3.5} fill="none" stroke={color} strokeWidth={1.2} style={{ animation: 'cm-end-pulse 1.4s ease-in-out infinite' }} />
          </G>
        ))}

        {e.label && (
          <G style={{ pointerEvents: 'none' }}>
            <Rect x={w.mid.x - labelW / 2} y={w.mid.y - 10} width={labelW} height={19} rx={9} fill="#0A0D14" stroke={`${color}55`} strokeWidth={1} />
            <SvgText x={w.mid.x} y={w.mid.y + 3.5} textAnchor="middle" fontSize="9.5" fontWeight="600" fill={color}>{e.label}</SvgText>
          </G>
        )}

        <Path
          d={w.d}
          fill="none"
          stroke="transparent"
          strokeWidth={20}
          style={{ pointerEvents: 'stroke', cursor: 'pointer' }} />
      </G>
    );
  });

  let temp = null;
  if (linkDraft && pos[linkDraft.from] && linkDraft.to) {
    const w = tempWire(pos[linkDraft.from], heights[linkDraft.from], linkDraft.side, linkDraft.to);
    temp = (
      <G>
        <Path d={w.d} fill="none" stroke="#f472b6" strokeWidth={7} strokeOpacity={0.07} strokeLinecap="round" />
        <Path d={w.d} fill="none" stroke="#f472b6" strokeWidth={1.4} strokeOpacity={0.7} strokeDasharray="6 8" style={{ animation: 'cm-wire-flow 1.2s linear infinite' }} />
        <Circle cx={w.from.x} cy={w.from.y} r={3} fill="#f472b6" />
        <Circle cx={linkDraft.to.x} cy={linkDraft.to.y} r={4} fill="none" stroke="#f472b6" strokeWidth={1.2} style={{ animation: 'cm-end-pulse 1.2s ease-in-out infinite' }} />
      </G>
    );
  }

  return (
    <Svg ref={svgRef} className="absolute left-0 top-0 overflow-visible" width="1" height="1" style={{ pointerEvents: 'none' }}>
      {wires}
      <G className="cm-heartbeat" style={{ pointerEvents: 'none' }}>
        {beats.map((bt) => (
          <G key={bt.key} opacity={bt.dim ? 0.12 : 1}>
            <Circle cx={bt.a.x} cy={bt.a.y} r={5.5} fill={bt.color} fillOpacity={0.18} />
            <Circle cx={bt.a.x} cy={bt.a.y} r={2.6} fill={bt.color} />
            <Circle cx={bt.b.x} cy={bt.b.y} r={5.5} fill={bt.color} fillOpacity={0.18} />
            <Circle cx={bt.b.x} cy={bt.b.y} r={2.6} fill={bt.color} />
          </G>
        ))}
      </G>
      {temp}
    </Svg>
  );
});

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
      className="absolute bottom-4 left-4 z-20 flex flex-col rounded-xl overflow-hidden"
      style={{ background: 'rgba(15,17,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
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
export function CanvasMinimap({ nodes, edges, pos, view, size, onJump }) {
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
      className="absolute bottom-4 right-4 z-20 rounded-xl overflow-hidden hidden md:block cursor-pointer"
      style={{ width: W, height: H, background: 'rgba(15,17,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
      onClick={handle}>
      <Span className="absolute top-1.5 left-2.5 text-[8px] font-semibold uppercase tracking-widest text-slate-600">Minimappa</Span>
      <Svg width={W} height={H}>
        {edges.map((e) => {
          const a = pos[e.from];
          const b = pos[e.to];
          if (!a || !b) return null;
          return <Line key={e.id} x1={mx(a.x)} y1={my(a.y)} x2={mx(b.x)} y2={my(b.y)} stroke={LINK_TYPES[e.type].color} strokeWidth="0.8" strokeOpacity="0.5" />;
        })}
        {nodes.map((n) => {
          const p = pos[n.id];
          if (!p) return null;
          const c = SOURCE_META[sourceKey(n)].color;
          return <Rect key={n.id} x={mx(p.x - NODE_W / 2)} y={my(p.y - NODE_H / 2)} width={Math.max(NODE_W * sc, 5)} height={Math.max(NODE_H * sc, 4)} rx={1.5} fill={`${c}44`} stroke={c} strokeWidth="0.6" />;
        })}
        <Rect x={mx(vx)} y={my(vy)} width={(size.w / view.k) * sc} height={(size.h / view.k) * sc} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3 2" rx={1} />
      </Svg>
    </Btn>
  );
}