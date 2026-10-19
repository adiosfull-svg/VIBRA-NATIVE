// Port di src/components/client/comitive/ComitivaEditor.jsx (convertito da scripts/port/codemod.mjs).
// PORT: <style> dell'originale (keyframe cm-* e .cm-list-dragging) tolto: sul telefono le stesse animazioni
// le fa comitiveAnim (Reanimated: GhostAnim, DropRing, listDragHighlight; fili e card in ComitivaCanvasParts).
// Gesti sul telefono: data-*/closest/elementFromPoint da ui/domData, pinch dai pointer per dito di ui/gestures, ResizeObserver dallo shim del DOM.
import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import { createPortal } from '@/web/shims/react-dom';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { useOverlay } from '@/web/lib/overlayStackContext';
import { useVibraLogo } from '@/web/hooks/useVibraLogo';
import { lockScroll } from '@/web/lib/scrollLock';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  ChevronLeft, Network, Pencil, Loader2, CheckCircle2, UserPlus, LayoutGrid, UsersRound, Trash2, X, Search,
  Plus, Check, MoreHorizontal, ExternalLink, ArrowRight, Link2, MapPin, Star, AlertCircle, Target, Minus, PartyPopper,
  BadgeCheck, Lock,
} from '@/ui/icons.generated';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import {
  LINK_TYPES, MANUAL_LINK_TYPES, SOURCE_META, NODE_W, NODE_H, sourceKey, initialsOf, zoneOf, fmtEuro, norm,
  buildEdges, layoutHorizontal, findFreeSpot, columnRightOf, wireGeometry,
  SIZE_MIN, SIZE_MAX, SIZE_STEP, SIZE_PRESETS, clampSize, importanceLabel,
  kindOf, nodeFromMeta,
} from './comitiveUtils';
import { ComitivaNode, WiresLayer, CanvasControls, CanvasMinimap } from './ComitivaCanvasParts';
import { GhostAnim, DropRing, DROP_EASE, EASE_OUT_CSS, listDragHighlight } from './comitiveAnim';
import { useProgressiveList } from '@/web/hooks/useProgressiveList';

import { doc as webDocument, nav as webNavigator, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { CssStyleTag, HtmlInput, HtmlOption, HtmlSelect, Img } from '@/ui/elements';

const MIN_K = 0.2;
const MAX_K = 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function eventLabel(ev) {
  if (!ev) return '';
  let d = ev.date || '';
  try { d = format(new Date(`${ev.date}T00:00:00`), 'EEE d MMM yyyy', { locale: it }); } catch { /* noop */ }
  return `${ev.venue || ev.name || 'Serata'} · ${d}`;
}
function fmtDate(s) {
  if (!s) return '—';
  try { return format(new Date(`${s.slice(0, 10)}T00:00:00`), 'd MMM yyyy', { locale: it }); } catch { return s; }
}

/* ───────────────────────── Barra in alto ───────────────────────── */
function TopBarBtn({ icon, label, onClick, active, danger, title }) {
  return (
    <Btn
      button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        danger ? 'text-red-400 hover:bg-red-500/15' : active ? 'bg-white/10 text-slate-100' : 'text-slate-400 hover:bg-white/10 hover:text-slate-100'
      }`}
      accessibilityLabel={title || label}
    >
      {icon}
      {label && <Span className="hidden lg:inline">{label}</Span>}
    </Btn>
  );
}

function TopBar({
  name, onRename, saveState, onBack, members, edgesCount, goalsCount = 0, sidebarOpen, onToggleSidebar,
  onRelayout, onSaveGroup, groupSaved, onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [menu, setMenu] = useState(false);
  const { logoDataUrl: vibraLogo } = useVibraLogo();
  useEffect(() => { if (!editing) setDraft(name); }, [name, editing]);
  const commit = () => { setEditing(false); if (draft.trim() && draft.trim() !== name) onRename(draft.trim()); };

  return (
    // Tre colonne: [indietro + nome] [logo Vibra centrato] [azioni]. Le due laterali sono 1fr
    // così il logo resta al centro esatto della riga; l'altezza della barra non cambia (56px).
    <Div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-2 md:px-3 h-14 border-b shrink-0" style={{ background: '#0A0D14', borderColor: 'rgba(255,255,255,0.08)' }}>
      <Div className="flex items-center gap-2 min-w-0">
       <Btn button onClick={onBack} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 text-xs font-medium shrink-0">
         <ChevronLeft className="w-4 h-4" />
         <Span className="hidden md:inline">Comitive</Span>
       </Btn>
       <Div className="w-px h-5 bg-white/10 shrink-0 hidden sm:block" />
       <Div className="min-w-0 flex-1">
         {editing ? (
           <HtmlInput
             autoFocus
             value={draft}
             onChange={(e) => setDraft(e.target.value)}
             onBlur={commit}
             onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setDraft(name); } }}
             className="w-full text-sm font-semibold bg-transparent outline-none border-b border-violet-400 text-slate-100"
           />
         ) : (
           <Btn button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-left hover:opacity-80 max-w-full" accessibilityLabel={name}>
             <Span className="text-sm font-semibold text-slate-100 leading-tight truncate">{name}</Span>
             <Pencil className="w-3 h-3 text-slate-500 shrink-0" />
           </Btn>
         )}
       </Div>
       <Div className="flex items-center gap-1 text-[10px] shrink-0">
         {saveState === 'saving' && <Span className="flex items-center gap-1 text-slate-500"><Loader2 className="w-3 h-3 animate-spin" /><Span className="hidden sm:inline">Salvataggio...</Span></Span>}
         {saveState === 'saved' && <Span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3 h-3" /><Span className="hidden sm:inline">Salvato</Span></Span>}
         {saveState === 'error' && <Span className="flex items-center gap-1 text-red-400"><AlertCircle className="w-3 h-3" /><Span className="hidden sm:inline">Non salvato</Span></Span>}
       </Div>
      </Div>

      {/* Logo Vibra al centro della riga, grande ma dentro l'altezza della barra */}
      <Div className="flex items-center justify-center h-full pointer-events-none select-none">
        {vibraLogo ? (
          // Il PNG è 1024×1024 con la scritta solo nella fascia x 47–962, y 419–641: il box ha le proporzioni
          // della scritta (916:223) e l'immagine è ingrandita/spostata per ritagliare il bordo trasparente.
          <Div className="relative overflow-hidden w-[80px] sm:w-[120px] md:w-[150px] max-w-[24vw] sm:max-w-[34vw]" style={{ aspectRatio: '916 / 223' }}>
            <Img
              src={vibraLogo}
              alt="Vibra"
              className="absolute max-w-none"
              style={{ width: `${(1024 / 916) * 100}%`, height: `${(1024 / 223) * 100}%`, left: `${-(47 / 916) * 100}%`, top: `${-(419 / 223) * 100}%` }} />
          </Div>
        ) : (
          <Div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #551A8E)' }}>
            <Network className="w-4 h-4 text-white" />
          </Div>
        )}
      </Div>

      <Div className="flex items-center justify-end gap-2 min-w-0">
       <Span className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-slate-400 bg-white/5 shrink-0">
         <UsersRound className="w-3.5 h-3.5" /> {members} persone · {edgesCount - goalsCount} legami
         {goalsCount > 0 && <Span className="inline-flex items-center gap-1 text-amber-300">· <Target className="w-3 h-3" />{goalsCount} da far conoscere</Span>}
       </Span>

       <Btn
         button
         onClick={onToggleSidebar}
         className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all active:scale-95 ${sidebarOpen ? 'bg-white/10 text-slate-100' : 'text-white'}`}
         style={sidebarOpen ? undefined : { background: 'linear-gradient(135deg, #7C3AED, #551A8E)', boxShadow: '0 2px 10px rgba(124,58,237,0.4)' }}
       >
         <UserPlus className="w-3.5 h-3.5" />
         <Span className="hidden sm:inline">Aggiungi persone</Span>
       </Btn>

       <Div className="hidden md:flex items-center gap-0.5 shrink-0">
         <Div className="w-px h-5 mx-1 bg-white/10" />
         <TopBarBtn icon={<LayoutGrid className="w-3.5 h-3.5" />} label="Riordina" onClick={onRelayout} />
         <TopBarBtn
           icon={groupSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <UsersRound className="w-3.5 h-3.5" />}
           label={groupSaved ? 'Nei Gruppi' : 'Salva come gruppo'}
           onClick={onSaveGroup}
         />
         <TopBarBtn icon={<Trash2 className="w-3.5 h-3.5" />} onClick={onDelete} danger title="Elimina comitiva" />
       </Div>

       <Div className="relative md:hidden shrink-0">
         <Btn button onClick={() => setMenu((v) => !v)} className="p-2 rounded-lg text-slate-400 hover:bg-white/10">
           <MoreHorizontal className="w-4 h-4" />
         </Btn>
         {menu && (
           <>
             <Btn className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
             <Div className="absolute right-0 top-10 z-50 w-56 rounded-xl border border-white/10 bg-[#0F1117] shadow-2xl p-1">
               <P className="px-3 py-2 text-[11px] text-slate-500">{members} persone · {edgesCount - goalsCount} legami{goalsCount > 0 ? ` · ${goalsCount} da far conoscere` : ''}</P>
               {[
                 [<LayoutGrid key="i" className="w-4 h-4" />, 'Riordina', onRelayout, ''],
                 [groupSaved ? <Check key="i" className="w-4 h-4 text-emerald-400" /> : <UsersRound key="i" className="w-4 h-4" />, groupSaved ? 'Già nei Gruppi' : 'Salva come gruppo', onSaveGroup, ''],
                 [<Trash2 key="i" className="w-4 h-4" />, 'Elimina comitiva', onDelete, 'text-red-400'],
               ].map(([ic, l, fn, cls]) => (
                 <Btn button key={l} onClick={() => { setMenu(false); fn(); }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-white/5 ${cls || 'text-slate-200'}`}>
                   {ic} {l}
                 </Btn>
               ))}
             </Div>
           </>
         )}
       </Div>
      </Div>
    </Div>
  );
}

/* ───────────────────────── Sidebar: Paganti e Gruppi ───────────────────────── */
const SIDEBAR_TABS = [
  ['paganti', 'Paganti', '#7C3AED'],
  ['gruppi', 'Gruppi', '#3B82F6'],
  ['altri', 'Altri PR', '#0284C7'],
  ['promoter', 'Promoter', '#9333EA'],
];

function PeopleSidebar({
  open, onClose, clients, groups, clientsById, memberSet, onAddClient, onAddGroup,
  extClients = [], promoters = [], promotersById = {}, onAddForeign, dirLoading = false,
  onTouchDrop, onTouchDragState, hidden = false,
}) {
  const [tab, setTab] = useState('paganti');

  /* ── Trascinamento col dito (mobile): il drag&drop HTML5 (draggable) non parte col touch.
     Tieni premuto ~0,3 s oppure trascina verso destra: la card segue il dito, la barra si
     nasconde e rilasciando sul foglio la persona viene aggiunta in quel punto. Lo scroll
     verticale della lista resta normale. ── */
  const listRef = useRef(null);
  // PORT: sul telefono l'istanza nativa non ha addEventListener: touchstart passa dalla prop della lista
  // (move/end arrivano comunque a window, ui/gestures)
  const touchStartRef = useRef(null);
  // Il draggable nativo resta solo con il mouse: su touch (Chrome Android) partirebbe insieme al nostro e lo annullerebbe
  const [isTouch] = useState(() => typeof window !== 'undefined' && !!webWindow.matchMedia?.('(pointer: coarse)').matches);
  const [ghost, setGhost] = useState(null);
  const dropRef = useRef(onTouchDrop);
  dropRef.current = onTouchDrop;
  const dragStateRef = useRef(onTouchDragState);
  dragStateRef.current = onTouchDragState;
  useEffect(() => {
    const el = listRef.current;
    if (!el) return undefined;
    let s = null;
    let landTimer = null;
    const begin = () => {
      if (!s || s.dragging) return;
      s.dragging = true;
      clearTimeout(s.timer);
      try { webNavigator.vibrate?.(10); } catch { /* noop */ }
      // Evidenzia chi sto trascinando, scurisce gli altri nomi (classi CSS, nessun re-render della lista)
      s.item.setAttribute('data-active-drag', '1');
      el.classList.add('cm-list-dragging');
      listDragHighlight(el, s.item, true);
      setGhost({ x: s.x, y: s.y, label: s.label, phase: 'drag' });
      dragStateRef.current?.(true);
    };
    const onStart = (e) => {
      if (e.touches.length !== 1) return;
      if (e.target.closest('button, input')) return;
      const item = e.target.closest('[data-drag-payload]');
      if (!item) return;
      let payload;
      try { payload = JSON.parse(item.getAttribute('data-drag-payload')); } catch { return; }
      const t = e.touches[0];
      s = { payload, item, label: item.getAttribute('data-drag-label') || '', sx: t.clientX, sy: t.clientY, x: t.clientX, y: t.clientY, dragging: false };
      s.timer = setTimeout(begin, 300);
    };
    const onMove = (e) => {
      if (!s) return;
      const t = e.touches[0];
      s.x = t.clientX;
      s.y = t.clientY;
      if (!s.dragging) {
        const dx = t.clientX - s.sx;
        const dy = t.clientY - s.sy;
        // Movimento verticale = scroll della lista: rinuncia al trascinamento
        if (Math.abs(dy) > 10 && Math.abs(dy) >= Math.abs(dx)) { clearTimeout(s.timer); s = null; return; }
        if (Math.abs(dx) > 14) begin();
        else return;
      }
      if (e.cancelable) e.preventDefault();
      const { x, y } = s;
      setGhost((g) => (g ? { ...g, x, y } : g));
    };
    const onEnd = (e) => {
      if (!s) return;
      clearTimeout(s.timer);
      const st = s;
      s = null;
      if (!st.dragging) return;
      st.item.removeAttribute('data-active-drag');
      el.classList.remove('cm-list-dragging');
      listDragHighlight(el, st.item, false);
      const ok = e.type === 'touchend' ? !!dropRef.current?.(st.payload, st.x, st.y) : false;
      // L'etichetta "atterra" sul foglio (o torna indietro se rilasciata fuori), poi la barra si richiude
      setGhost((g) => (g ? { ...g, x: st.x, y: st.y, phase: ok ? 'land' : 'back' } : g));
      clearTimeout(landTimer);
      landTimer = setTimeout(() => { setGhost(null); dragStateRef.current?.(false, ok); }, 340);
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    touchStartRef.current = onStart;
    webWindow.addEventListener('touchmove', onMove, { passive: false });
    webWindow.addEventListener('touchend', onEnd);
    webWindow.addEventListener('touchcancel', onEnd);
    return () => {
      if (s) clearTimeout(s.timer);
      clearTimeout(landTimer);
      touchStartRef.current = null;
      el.removeEventListener('touchstart', onStart);
      webWindow.removeEventListener('touchmove', onMove);
      webWindow.removeEventListener('touchend', onEnd);
      webWindow.removeEventListener('touchcancel', onEnd);
    };
  }, [open]);
  const [q, setQ] = useState('');
  const query = norm(q.trim());
  // Paganti degli altri PR: si cerca per nome, zona o nome del promoter. Solo nome/zona/promoter.
  const extList = useMemo(() => {
    if (tab !== 'altri') return [];
    const list = query
      ? extClients.filter((c) => norm(c.name).includes(query) || norm(zoneOf(c)).includes(query) || norm(promotersById[c.promoter_id]?.name).includes(query))
      : extClients;
    return [...list].sort((a, b) => Number(memberSet.has(a.id)) - Number(memberSet.has(b.id)) || (a.name || '').localeCompare(b.name || '', 'it')).slice(0, 200);
  }, [tab, extClients, query, memberSet, promotersById]);
  const promoterList = useMemo(() => {
    const list = query ? promoters.filter((p) => norm(p.name).includes(query)) : promoters;
    return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'it'));
  }, [promoters, query]);
  const people = useMemo(() => {
    const list = query ? clients.filter((c) => norm(c.name).includes(query) || norm(zoneOf(c)).includes(query)) : clients;
    return [...list].sort((a, b) => Number(memberSet.has(a.id)) - Number(memberSet.has(b.id)) || (a.name || '').localeCompare(b.name || '', 'it')).slice(0, 250);
  }, [clients, query, memberSet]);
  const groupList = useMemo(() => {
    const list = query ? groups.filter((g) => norm(g.name).includes(query) || (g.client_ids || []).some((id) => norm(clientsById[id]?.name).includes(query))) : groups;
    return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'it'));
  }, [groups, query, clientsById]);

  // PORT: fino a 250 paganti / 200 di altri PR, rimontati a ogni apertura del pannello: righe montate a
  // blocchi scorrendo la lista (useProgressiveList box). Le righe restano figlie della lista: il
  // trascinamento col dito (closest/data-drag-payload, listDragHighlight) resta quello di prima.
  const listTotal = tab === 'paganti' ? people.length : tab === 'gruppi' ? groupList.length : tab === 'altri' ? extList.length : promoterList.length;
  const rows = useProgressiveList(listTotal, { initial: 20, step: 20, box: 'y', resetKey: `${open}|${tab}|${query}` });

  const dragStart = (e, payload) => {
    e.dataTransfer.setData('application/x-comitiva', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  if (!open) return null;
  return (
    <>
      <CssStyleTag />
      <Btn className={`md:hidden absolute inset-0 z-30 bg-black/50 transition-opacity duration-200 ${hidden ? 'opacity-0 pointer-events-none' : ''}`} onClick={onClose} />
      {ghost && createPortal(
        <Div className="fixed z-[9500] pointer-events-none" style={{ left: ghost.x, top: ghost.y, transform: 'translate(-50%, -125%)' }}>
          <GhostAnim phase={ghost.phase}>
          <Div
            className="flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-2xl text-xs font-semibold text-white max-w-[240px]"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #551A8E)',
              boxShadow: '0 10px 34px rgba(124,58,237,0.6), 0 0 0 1px rgba(255,255,255,0.15) inset',
              animation: Platform.OS !== 'web' ? undefined : ghost.phase === 'land'
                ? 'cm-ghost-land 320ms cubic-bezier(.4,0,.2,1) forwards'
                : ghost.phase === 'back' ? 'cm-ghost-back 260ms ease-in forwards' : 'cm-ghost-pick 160ms ease-out',
            }}
          >
            <Span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0">{initialsOf(ghost.label)}</Span>
            <Span className="truncate">{ghost.label || 'Rilascia sul foglio'}</Span>
          </Div>
          </GhostAnim>
        </Div>,
        webDocument.body
      )}
      <Div
        data-ui
        className={`absolute md:relative z-40 md:z-auto left-0 top-0 bottom-0 flex flex-col border-r w-[86%] max-w-[330px] md:w-[270px] md:max-w-none shrink-0 origin-left transition-[transform,opacity] duration-200 ease-out ${hidden ? 'scale-[0.58] opacity-90 pointer-events-none rounded-r-2xl shadow-2xl' : ''}`}
        style={{ background: '#0F1117', borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <Div className="flex items-center justify-between px-4 pt-4 pb-3">
          <Div>
            <P className="text-sm font-semibold text-slate-100">Aggiungi persone</P>
            <P className="text-[10px] text-slate-500 hidden md:block">Trascina sul foglio o tocca +</P>
          </Div>
          <Btn button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-100 hover:bg-white/10">
            <ChevronLeft className="w-4 h-4" />
          </Btn>
        </Div>
        <Div className="px-3 pb-2">
          <Div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-white/5">
            {SIDEBAR_TABS.map(([k, l, c]) => (
              <Btn
                button
                key={k}
                onClick={() => setTab(k)}
                className={`py-1.5 px-0.5 rounded-lg text-[11px] font-medium leading-none whitespace-nowrap transition-all ${tab === k ? 'text-white' : 'text-slate-400'}`}
                style={tab === k ? { background: c } : undefined}
              >
                {l}
              </Btn>
            ))}
          </Div>
        </Div>
        <Div className="px-3 pb-2">
          <Div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <HtmlInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tab === 'paganti' ? 'Cerca nome o zona...' : tab === 'gruppi' ? 'Cerca gruppo o persona...' : tab === 'altri' ? 'Cerca nome, zona o PR...' : 'Cerca promoter...'}
              className="bg-transparent text-xs outline-none flex-1 text-slate-200 placeholder:text-slate-500"
            />
          </Div>
        </Div>
        <Div
          ref={listRef}
          className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5 overscroll-contain"
          style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
          onTouchStart={Platform.OS !== 'web' ? (e) => touchStartRef.current?.(e) : undefined}
          onScroll={rows.onBoxScroll}>
          {tab === 'paganti' && people.slice(0, rows.count).map((c) => {
            const inside = memberSet.has(c.id);
            const src = SOURCE_META[sourceKey(c)];
            return (
              <Div
                key={c.id}
                data-drag-payload={inside ? undefined : JSON.stringify({ kind: 'client', id: c.id })}
                data-drag-label={c.name}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl border transition-colors ${
                  inside ? 'border-white/5 bg-white/[0.02] opacity-50' : 'border-white/5 bg-white/[0.04] hover:bg-violet-500/10 hover:border-violet-400/30 cursor-grab active:cursor-grabbing'
                }`}>
                <ClientAvatar client={c} initials={initialsOf(c.name)} size="sm" />
                <Div className="min-w-0 flex-1">
                  <P className="text-xs font-semibold text-slate-100 leading-tight [overflow-wrap:anywhere]">{c.name}</P>
                  <P className="text-[10px] text-slate-500 leading-tight mt-0.5 [overflow-wrap:anywhere]">
                    <Span style={{ color: src.color }}>{src.short}</Span>
                    {zoneOf(c) && <> · {zoneOf(c)}</>}
                    {c.cum_total_spent > 0 && <> · {fmtEuro(c.cum_total_spent)}</>}
                  </P>
                </Div>
                {inside ? (
                  <Span className="text-[10px] text-emerald-400 flex items-center gap-0.5 shrink-0"><Check className="w-3 h-3" />Dentro</Span>
                ) : (
                  <Btn button onClick={() => onAddClient(c.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-500/20 text-violet-200 hover:bg-violet-500/35 shrink-0" accessibilityLabel="Aggiungi">
                    <Plus className="w-4 h-4" />
                  </Btn>
                )}
              </Div>
            );
          })}
          {tab === 'paganti' && people.length === 0 && <P className="text-xs text-center py-6 text-slate-500">Nessun pagante trovato</P>}

          {tab === 'gruppi' && groupList.slice(0, rows.count).map((g) => {
            const ids = (g.client_ids || []).filter((id) => clientsById[id]);
            const missing = ids.filter((id) => !memberSet.has(id));
            const names = ids.map((id) => clientsById[id]?.name).filter(Boolean);
            return (
              <Div
                key={g.id}
                data-drag-payload={missing.length > 0 ? JSON.stringify({ kind: 'group', id: g.id }) : undefined}
                data-drag-label={g.name}
                className="px-2.5 py-2.5 rounded-xl border border-white/5 bg-white/[0.04] hover:border-blue-400/30">
                <Div className="flex items-start gap-2">
                  <Div className="min-w-0 flex-1">
                    <P className="text-xs font-semibold text-slate-100 leading-tight [overflow-wrap:anywhere]">{g.name}</P>
                    <P className="text-[10px] text-slate-500 mt-0.5 leading-snug [overflow-wrap:anywhere]">{names.join(', ') || 'Gruppo vuoto'}</P>
                  </Div>
                  {missing.length > 0 ? (
                    <Btn button onClick={() => onAddGroup(g)} className="px-2 h-8 rounded-lg flex items-center gap-1 bg-blue-500/20 text-blue-200 hover:bg-blue-500/35 text-[11px] font-semibold shrink-0">
                      <Plus className="w-3.5 h-3.5" />{missing.length}
                    </Btn>
                  ) : (
                    <Span className="text-[10px] text-emerald-400 flex items-center gap-0.5 shrink-0 mt-1"><Check className="w-3 h-3" />Dentro</Span>
                  )}
                </Div>
              </Div>
            );
          })}
          {tab === 'gruppi' && groupList.length === 0 && <P className="text-xs text-center py-6 text-slate-500">Nessun gruppo. Creali nella tab Gruppi.</P>}

          {(tab === 'altri' || tab === 'promoter') && (
            <P className="text-[10px] text-slate-500 leading-snug px-0.5 pb-1 flex items-start gap-1.5">
              <Lock className="w-3 h-3 shrink-0 mt-px" />
              {tab === 'altri'
                ? 'Paganti di altri PR: vedi solo nome, zona e promoter. Niente rating o dati personali.'
                : 'Promoter Vibra: collegali ai paganti con il filo "Equilibrio promoter".'}
            </P>
          )}
          {(tab === 'altri' || tab === 'promoter') && dirLoading && (
            <Div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-500"><Loader2 className="w-4 h-4 animate-spin" />Caricamento...</Div>
          )}

          {tab === 'altri' && !dirLoading && extList.slice(0, rows.count).map((c) => {
            const inside = memberSet.has(c.id);
            const owner = promotersById[c.promoter_id];
            return (
              <Div
                key={c.id}
                data-drag-payload={inside ? undefined : JSON.stringify({ kind: 'ext', id: c.id })}
                data-drag-label={c.name}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl border transition-colors ${
                  inside ? 'border-white/5 bg-white/[0.02] opacity-50' : 'border-white/5 bg-white/[0.04] hover:bg-sky-500/10 hover:border-sky-400/30 cursor-grab active:cursor-grabbing'
                }`}>
                <ClientAvatar client={{ name: c.name }} initials={initialsOf(c.name)} size="sm" className="!from-sky-500/30 !to-cyan-500/10 !ring-sky-400/40 !text-sky-100" />
                <Div className="min-w-0 flex-1">
                  <P className="text-xs font-semibold text-slate-100 leading-tight [overflow-wrap:anywhere]">{c.name}</P>
                  <P className="text-[10px] text-slate-500 leading-tight mt-0.5 flex items-center gap-1 min-w-0">
                    <ClientAvatar client={owner} initials={initialsOf(owner?.name)} size="xs" />
                    <Span className="text-sky-300 truncate">{owner?.name || 'Altro PR'}</Span>
                    {zoneOf(c) && <Span className="truncate">· {zoneOf(c)}</Span>}
                  </P>
                </Div>
                {inside ? (
                  <Span className="text-[10px] text-emerald-400 flex items-center gap-0.5 shrink-0"><Check className="w-3 h-3" />Dentro</Span>
                ) : (
                  <Btn button onClick={() => onAddForeign('ext', c)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-sky-500/20 text-sky-200 hover:bg-sky-500/35 shrink-0" accessibilityLabel="Aggiungi">
                    <Plus className="w-4 h-4" />
                  </Btn>
                )}
              </Div>
            );
          })}
          {tab === 'altri' && !dirLoading && extList.length === 0 && <P className="text-xs text-center py-6 text-slate-500">{query ? 'Nessun pagante trovato' : 'Nessun pagante di altri PR'}</P>}
          {tab === 'altri' && !dirLoading && !query && extClients.length > 200 && <P className="text-[10px] text-center py-2 text-slate-600">Mostrati i primi 200: cerca per trovare gli altri</P>}

          {tab === 'promoter' && !dirLoading && promoterList.slice(0, rows.count).map((p) => {
            const inside = memberSet.has(p.id);
            return (
              <Div
                key={p.id}
                data-drag-payload={inside ? undefined : JSON.stringify({ kind: 'promoter', id: p.id })}
                data-drag-label={p.name}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl border transition-colors ${
                  inside ? 'border-white/5 bg-white/[0.02] opacity-50' : 'border-white/5 bg-white/[0.04] hover:bg-purple-500/10 hover:border-purple-400/30 cursor-grab active:cursor-grabbing'
                }`}>
                <ClientAvatar client={p} initials={initialsOf(p.name)} size="sm" />
                <Div className="min-w-0 flex-1">
                  <P className="text-xs font-semibold text-slate-100 leading-tight [overflow-wrap:anywhere]">{p.name}</P>
                  <P className="text-[10px] text-purple-300 leading-tight mt-0.5 flex items-center gap-1"><BadgeCheck className="w-3 h-3" />Promoter Vibra</P>
                </Div>
                {inside ? (
                  <Span className="text-[10px] text-emerald-400 flex items-center gap-0.5 shrink-0"><Check className="w-3 h-3" />Dentro</Span>
                ) : (
                  <Btn button onClick={() => onAddForeign('promoter', p)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/20 text-purple-200 hover:bg-purple-500/35 shrink-0" accessibilityLabel="Aggiungi">
                    <Plus className="w-4 h-4" />
                  </Btn>
                )}
              </Div>
            );
          })}
          {tab === 'promoter' && !dirLoading && promoterList.length === 0 && <P className="text-xs text-center py-6 text-slate-500">Nessun promoter trovato</P>}
        </Div>
      </Div>
    </>
  );
}

/* ───────────────────────── Scelta del tipo di legame ───────────────────────── */
function LinkPicker({ picker, clientsById, members, events, onSave, onDelete, onClose, setPicker, boxSize, offsetX = 0 }) {
  const from = clientsById[picker.from];
  const to = picker.to ? clientsById[picker.to] : null;
  const [q, setQ] = useState('');
  const recent = useMemo(() => [...events].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 120), [events]);

  // "Equilibrio promoter" ha senso solo se uno dei due è un promoter Vibra
  const withPromoter = kindOf(from) === 'promoter' || kindOf(to) === 'promoter';
  const linkTypes = MANUAL_LINK_TYPES.filter((k) => !LINK_TYPES[k].promoterOnly || withPromoter);
  const choose = (type) => {
    if (type === 'amici' || type === 'coppia' || type === 'obiettivo' || type === 'equilibrio') onSave({ ...picker, type });
    else setPicker((p) => ({ ...p, type }));
  };

  // Posizione: vicino al punto di rilascio su desktop, foglio in basso su telefono
  const W = 320;
  const desktop = boxSize.w >= 768 && picker.anchor;
  const style = desktop
    ? { left: offsetX + clamp(picker.anchor.x - W / 2, 12, boxSize.w - W - 12), top: clamp(picker.anchor.y + 14, 12, boxSize.h - 380), width: W }
    : undefined;

  return (
    <Div data-ui className="absolute inset-0 z-40" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {!desktop && <Div className="absolute inset-0 bg-black/50 pointer-events-none" />}
      <Div
        className={`${desktop ? 'absolute' : 'absolute left-0 right-0 bottom-0 rounded-b-none'} rounded-2xl border border-white/10 bg-[#0F1117] shadow-2xl shadow-black/70 p-3.5 space-y-3 max-h-[80%] overflow-y-auto overscroll-contain [touch-action:pan-y]`}
        style={style}
      >
        <Div className="flex items-start justify-between gap-2">
          <P className="text-[13px] font-semibold text-slate-100 leading-snug [overflow-wrap:anywhere]">
            {to ? <>Che legame c'è tra <Span className="text-violet-300">{from?.name}</Span> e <Span className="text-violet-300">{to.name}</Span>?</> : <>Collega <Span className="text-violet-300">{from?.name}</Span> a...</>}
          </P>
          <Btn button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:text-slate-100 hover:bg-white/10 shrink-0"><X className="w-4 h-4" /></Btn>
        </Div>

        {!to ? (
          <Div className="space-y-1.5">
            <Div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <HtmlInput autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca nella comitiva..." className="bg-transparent text-xs outline-none flex-1 text-slate-200" />
            </Div>
            <Div className="max-h-56 overflow-y-auto space-y-0.5">
              {members.filter((c) => c.id !== picker.from && (!q.trim() || norm(c.name).includes(norm(q.trim())))).map((c) => (
                <Btn button key={c.id} onClick={() => setPicker((p) => ({ ...p, to: c.id }))} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 text-left">
                  <ClientAvatar client={c} initials={initialsOf(c.name)} size="xs" />
                  <Span className="text-xs text-slate-200 [overflow-wrap:anywhere]">{c.name}</Span>
                </Btn>
              ))}
              {members.length < 2 && <P className="text-[11px] text-slate-500 py-3 text-center">Aggiungi almeno un'altra persona alla comitiva.</P>}
            </Div>
          </Div>
        ) : (
          <>
            <Div className="grid grid-cols-2 gap-1.5">
              {linkTypes.map((k) => {
                const t = LINK_TYPES[k];
                const active = picker.type === k;
                return (
                  <Btn
                    button
                    key={k}
                    onClick={() => choose(k)}
                    className="flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl border text-left transition-all active:scale-[0.98]"
                    style={{
                      borderColor: active ? t.color : t.goal ? `${t.color}55` : 'rgba(255,255,255,0.08)',
                      borderStyle: t.goal ? 'dashed' : 'solid',
                      background: active ? `${t.color}1f` : 'rgba(255,255,255,0.03)',
                      gridColumn: t.goal ? '1 / -1' : undefined,
                    }}
                  >
                    <Span className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
                      {t.goal
                        ? <Target className="w-3.5 h-3.5" style={{ color: t.color }} />
                        : <Span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }} />}
                      {t.label}
                    </Span>
                    <Span className="text-[10px] text-slate-500 leading-tight">{t.hint}</Span>
                  </Btn>
                );
              })}
            </Div>

            {(picker.type === 'serata' || picker.type === 'altro' || picker.editingId) && (
              <Div className="space-y-2">
                {picker.type === 'serata' && (
                  <HtmlSelect
                    value={picker.event_id || ''}
                    onChange={(e) => setPicker((p) => ({ ...p, event_id: e.target.value }))}
                    className="w-full h-9 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 px-2 outline-none focus:border-pink-400/60"
                  >
                    <HtmlOption value="">In quale serata? (facoltativo)</HtmlOption>
                    {recent.map((ev) => <HtmlOption key={ev.id} value={ev.id}>{eventLabel(ev)}</HtmlOption>)}
                  </HtmlSelect>
                )}
                <HtmlInput
                  value={picker.label || ''}
                  onChange={(e) => setPicker((p) => ({ ...p, label: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter' && picker.type && (picker.type !== 'altro' || picker.label?.trim())) onSave(picker); }}
                  placeholder={picker.type === 'altro' ? 'Che legame è? (es. colleghi, cugini)' : 'Nota sul filo (facoltativa)'}
                  className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-violet-400/60"
                />
                <Div className="flex gap-1.5">
                  {picker.editingId && (
                    <Btn button onClick={() => onDelete(picker.editingId)} className="h-9 px-3 rounded-lg bg-red-500/10 border border-red-400/30 text-xs font-semibold text-red-300 inline-flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" />Elimina
                    </Btn>
                  )}
                  <Btn
                    button
                    disabled={!picker.type || (picker.type === 'altro' && !picker.label?.trim())}
                    onClick={() => onSave(picker)}
                    className="flex-1 h-9 rounded-lg text-xs font-semibold text-white disabled:opacity-40 inline-flex items-center justify-center gap-1.5"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #551A8E)' }}
                  >
                    <Link2 className="w-3.5 h-3.5" />{picker.editingId ? 'Salva' : 'Collega'}
                  </Btn>
                </Div>
              </Div>
            )}
          </>
        )}
      </Div>
    </Div>
  );
}

/* ───────────────────────── Editor ───────────────────────── */
export default function ComitivaEditor({
  comitiva, clients, clientsById: ownById, links, groups, events, promoterId, onClose, onDeleted, onClientClick,
  directory = null, directoryLoading = false,
}) {
  const qc = useQueryClient();
  useOverlay(true, onClose);

  const isPhone = typeof window !== 'undefined' && webWindow.innerWidth < 768;
  const [doc, setDoc] = useState(() => ({
    name: comitiva.name || 'Nuova comitiva',
    // Tutti i nodi in un'unica lista: propri paganti + paganti di altri PR + promoter (separati solo al salvataggio)
    client_ids: [
      ...(comitiva.client_ids || []).filter((id) => ownById[id]),
      ...[...(comitiva.external_client_ids || []), ...(comitiva.promoter_ids || [])].filter((id) => comitiva.external_meta?.[id]),
    ],
    external_meta: comitiva.external_meta || {},
    positions: comitiva.positions || {},
    sizes: comitiva.sizes || {},
    group_ids: comitiva.group_ids || [],
  }));
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const [size, setSize] = useState({ w: 1200, h: 800 });
  const [heights, setHeights] = useState({});
  const [interacting, setInteracting] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [linkDraft, setLinkDraft] = useState(null);
  const [picker, setPicker] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => !isPhone || (comitiva.client_ids || []).length === 0);
  // Durante il trascinamento col dito la barra laterale si nasconde per lasciare libero il foglio
  const [touchDragging, setTouchDragging] = useState(false);
  // Card appena aggiunte: animazione di "nascita" (piccola → rimbalzo → dimensione vera)
  const [enteringIds, setEnteringIds] = useState(() => new Set());
  const [dropFx, setDropFx] = useState(null);
  const [locked, setLocked] = useState(false);
  const [saveState, setSaveState] = useState('idle');
  const [notice, setNotice] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  // Il foglio resta invisibile finché la vista non è centrata: niente flash di card fuori posto all'apertura
  const [ready, setReady] = useState(false);

  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const docRef = useRef(doc);
  docRef.current = doc;
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const rafRef = useRef(null);
  const pendingRef = useRef(null);
  const wheelIdle = useRef(null);
  const saveTimer = useRef(null);
  const dirty = useRef(false);
  const noticeTimer = useRef(null);

  /* ── Derivati ── */
  /* ── Nodi: propri paganti + esterni (istantanea salvata, aggiornata con la directory se disponibile) ── */
  const dirClientsById = useMemo(() => Object.fromEntries((directory?.clients || []).map((c) => [c.id, c])), [directory]);
  const promotersById = useMemo(() => Object.fromEntries((directory?.promoters || []).map((p) => [p.id, p])), [directory]);
  const clientsById = useMemo(() => {
    const out = { ...ownById };
    Object.entries(doc.external_meta || {}).forEach(([id, m]) => {
      if (out[id]) return;
      const fresh = m.kind === 'promoter' ? promotersById[id] : dirClientsById[id];
      out[id] = nodeFromMeta(id, fresh ? { ...m, ...fresh, kind: m.kind } : m);
    });
    return out;
  }, [ownById, doc.external_meta, promotersById, dirClientsById]);
  const ownerOf = (n) => (kindOf(n) === 'ext' ? promotersById[n.promoter_id] || null : null);

  const members = useMemo(() => doc.client_ids.map((id) => clientsById[id]).filter(Boolean), [doc.client_ids, clientsById]);
  const ownMembers = useMemo(() => members.filter((m) => kindOf(m) === 'own'), [members]);
  const memberSet = useMemo(() => new Set(doc.client_ids), [doc.client_ids]);
  const edges = useMemo(() => buildEdges(members, links), [members, links]);
  const pos = useMemo(() => {
    const missing = members.filter((m) => !doc.positions[m.id]);
    if (!missing.length) return doc.positions;
    const auto = layoutHorizontal(members.map((m) => m.id), edges, clientsById);
    const out = { ...doc.positions };
    missing.forEach((m) => { out[m.id] = auto[m.id]; });
    return out;
  }, [members, doc.positions, edges, clientsById]);
  const posRef = useRef(pos);
  posRef.current = pos;
  const goalsByNode = useMemo(() => {
    const out = {};
    edges.forEach((e) => {
      if (!LINK_TYPES[e.type].goal) return;
      out[e.from] = (out[e.from] || 0) + 1;
      out[e.to] = (out[e.to] || 0) + 1;
    });
    return out;
  }, [edges]);
  const goalsCount = useMemo(() => edges.filter((e) => LINK_TYPES[e.type].goal).length, [edges]);
  const eventsById = useMemo(() => Object.fromEntries(events.map((e) => [e.id, e])), [events]);
  const groupSaved = useMemo(
    () => ownMembers.length > 1 && groups.some((g) => (g.client_ids || []).length === ownMembers.length && ownMembers.every((m) => (g.client_ids || []).includes(m.id))),
    [groups, ownMembers]
  );

  const flash = (text) => {
    setNotice(text);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 2200);
  };

  /* ── Salvataggio automatico ── */
  const persist = useCallback(async () => {
    saveTimer.current = null;
    if (!dirty.current) return;
    dirty.current = false;
    const d = docRef.current;
    const positions = {};
    const sizes = {};
    const ownIds = [];
    const extIds = [];
    const prIds = [];
    const externalMeta = {};
    d.client_ids.forEach((id) => {
      if (posRef.current[id]) positions[id] = posRef.current[id];
      if (d.sizes?.[id] && d.sizes[id] !== 1) sizes[id] = d.sizes[id];
      const m = d.external_meta?.[id];
      if (ownById[id]) ownIds.push(id);
      else if (m) { externalMeta[id] = m; (m.kind === 'promoter' ? prIds : extIds).push(id); }
    });
    setSaveState('saving');
    try {
      const patch = {
        name: d.name, client_ids: ownIds, external_client_ids: extIds, promoter_ids: prIds, external_meta: externalMeta,
        group_ids: d.group_ids, positions, sizes,
      };
      await base44.entities.Comitiva.update(comitiva.id, patch);
      qc.setQueryData(['comitive', promoterId], (old = []) => old.map((c) => (c.id === comitiva.id ? { ...c, ...patch, updated_date: new Date().toISOString() } : c)));
      setSaveState('saved');
    } catch {
      dirty.current = true;
      setSaveState('error');
    }
  }, [comitiva.id, promoterId, qc, ownById]);

  const update = (fn) => {
    setDoc((d) => fn(d));
    dirty.current = true;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(persist, 700);
  };

  useEffect(() => () => {
    clearTimeout(saveTimer.current);
    if (dirty.current) persist();
  }, [persist]);

  /* ── Schermo intero: blocco scroll pagina (prima del primo paint, così la pagina dietro non salta) ── */
  // Blocco scroll ufficiale dell'app: imposta anche body[data-scroll-lock], che fa fare da parte
  // pull-to-refresh e rubber band globali. Prima l'overflow era bloccato a mano e quei gestori
  // restavano attivi sotto l'editor, bloccando lo scroll della lista "Aggiungi persone" su mobile.
  useLayoutEffect(() => lockScroll(), []);

  /* ── Misure ── */
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const next = {};
    let changed = false;
    el.querySelectorAll('[data-node-id]').forEach((n) => {
      const id = n.getAttribute('data-node-id');
      next[id] = n.offsetHeight;
      if (heights[id] !== next[id]) changed = true;
    });
    if (changed) setHeights((p) => ({ ...p, ...next }));
  }, [members]);

  /* ── Vista ── */
  const fitTo = (ids, maxK = 1) => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pts = ids.filter((id) => posRef.current[id]).map((id) => ({ ...posRef.current[id], s: docRef.current.sizes?.[id] || 1 }));
    if (!pts.length) { setView({ x: r.width / 2, y: r.height / 2, k: 1 }); return; }
    const minX = Math.min(...pts.map((p) => p.x - (NODE_W * p.s) / 2)) - 60;
    const maxX = Math.max(...pts.map((p) => p.x + (NODE_W * p.s) / 2)) + 60;
    const minY = Math.min(...pts.map((p) => p.y - (NODE_H * p.s) / 2)) - 60;
    const maxY = Math.max(...pts.map((p) => p.y + (NODE_H * p.s) / 2)) + 60;
    const k = clamp(Math.min(r.width / (maxX - minX), r.height / (maxY - minY), maxK), MIN_K, MAX_K);
    setView({ k, x: r.width / 2 - ((minX + maxX) / 2) * k, y: r.height / 2 - ((minY + maxY) / 2) * k });
  };
  const fitAll = () => fitTo(docRef.current.client_ids);
  const zoomAt = (factor, cx, cy) => {
    const v = viewRef.current;
    const k = clamp(v.k * factor, MIN_K, MAX_K);
    const next = { k, x: cx - ((cx - v.x) / v.k) * k, y: cy - ((cy - v.y) / v.k) * k };
    viewRef.current = next;
    setView(next);
  };
  const zoomCenter = (factor) => zoomAt(factor, size.w / 2, size.h / 2);
  const centerOn = (p, k = Math.max(viewRef.current.k, 0.9)) => setView({ k, x: size.w / 2 - p.x * k, y: size.h / 2 - p.y * k });
  const resetZoom = () => {
    const v = viewRef.current;
    const c = { x: (size.w / 2 - v.x) / v.k, y: (size.h / 2 - v.y) / v.k };
    centerOn(c, 1);
  };

  // Centratura iniziale sincrona (prima del paint). Solo se il contenitore non ha ancora misure si aspetta un frame.
  useLayoutEffect(() => {
    const go = () => { fitTo(docRef.current.client_ids, isPhone ? 0.75 : 1); setReady(true); };
    const el = containerRef.current;
    if (el && el.getBoundingClientRect().width > 0) { go(); return undefined; }
    const id = requestAnimationFrame(go);
    return () => cancelAnimationFrame(id);
  }, []);

  // Rotella = zoom attorno al cursore (fluido), trackpad pinch incluso
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      if (e.target.closest && e.target.closest('[data-ui]')) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const v = viewRef.current;
      const k = clamp(v.k * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)), MIN_K, MAX_K);
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const next = { k, x: mx - ((mx - v.x) / v.k) * k, y: my - ((my - v.y) / v.k) * k };
      viewRef.current = next;
      setInteracting(true);
      clearTimeout(wheelIdle.current);
      wheelIdle.current = setTimeout(() => setInteracting(false), 180);
      schedule(() => setView(next));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Pausa animazioni durante l'interazione
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    try { if (interacting) svg.pauseAnimations(); else svg.unpauseAnimations(); } catch { /* noop */ }
  }, [interacting]);

  /* ── rAF ── */
  function schedule(fn) {
    pendingRef.current = fn;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const f = pendingRef.current;
      pendingRef.current = null;
      if (f) f();
    });
  }
  const flushScheduled = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    const f = pendingRef.current;
    pendingRef.current = null;
    if (f) f();
  };

  /* ── Aggiunta / rimozione persone ── */
  const viewCenterWorld = () => {
    const v = viewRef.current;
    return { x: (size.w / 2 - v.x) / v.k, y: (size.h / 2 - v.y) / v.k };
  };
  // meta: istantanea minima per i nodi esterni ({ [id]: { kind, name, ... } })
  const addClients = (ids, at, groupId, meta = null) => {
    const fresh = ids.filter((id) => (clientsById[id] || meta?.[id]) && !docRef.current.client_ids.includes(id));
    if (!fresh.length) { flash('Già nella comitiva'); return; }
    const current = { ...posRef.current };
    Object.keys(current).forEach((id) => { if (!docRef.current.client_ids.includes(id)) delete current[id]; });
    const placed = {};
    if (fresh.length === 1) {
      placed[fresh[0]] = findFreeSpot(current, at || viewCenterWorld());
    } else {
      const col = columnRightOf(current, fresh.length, (at || viewCenterWorld()).y);
      fresh.forEach((id, i) => { placed[id] = col[i]; });
    }
    update((d) => ({
      ...d,
      client_ids: [...d.client_ids, ...fresh],
      positions: { ...d.positions, ...placed },
      group_ids: groupId && !d.group_ids.includes(groupId) ? [...d.group_ids, groupId] : d.group_ids,
      external_meta: meta ? { ...(d.external_meta || {}), ...meta } : d.external_meta,
    }));
    setEnteringIds((prev) => new Set([...prev, ...fresh]));
    setTimeout(() => setEnteringIds((prev) => { const n = new Set(prev); fresh.forEach((id) => n.delete(id)); return n; }), 800);
    flash(fresh.length === 1 ? `${(clientsById[fresh[0]] || meta?.[fresh[0]])?.name || 'Persona'} aggiunto` : `${fresh.length} persone aggiunte`);
    if (fresh.length > 1 || docRef.current.client_ids.length === 0) {
      requestAnimationFrame(() => requestAnimationFrame(() => fitAll()));
    }
  };
  const addGroup = (g, at) => addClients((g.client_ids || []).filter((id) => ownById[id]), at, g.id);
  // Pagante di un altro PR o promoter Vibra: si salva solo nome/zona/promoter (niente dati personali)
  const addForeign = (kind, item, at) => {
    if (!item) return;
    const m = kind === 'promoter'
      ? { kind: 'promoter', name: item.name || '', photo_url: item.photo_url || '' }
      : { kind: 'ext', name: item.name || '', residenza_key: item.residenza_key || '', promoter_id: item.promoter_id || '' };
    addClients([item.id], at, null, { [item.id]: m });
  };
  const removeMember = (id) => {
    update((d) => {
      const positions = { ...d.positions };
      delete positions[id];
      const sizes = { ...(d.sizes || {}) };
      delete sizes[id];
      const externalMeta = { ...(d.external_meta || {}) };
      delete externalMeta[id];
      return { ...d, client_ids: d.client_ids.filter((x) => x !== id), positions, sizes, external_meta: externalMeta };
    });
    setSelectedNodeId(null);
    setConfirmRemove(false);
    flash('Rimosso dalla comitiva');
  };

  /* ── Importanza = dimensione della card ── */
  const setNodeSize = (id, s) => {
    const v = clampSize(s);
    update((d) => ({ ...d, sizes: { ...(d.sizes || {}), [id]: v } }));
  };
  const bumpNodeSize = (id, dir) => setNodeSize(id, (docRef.current.sizes?.[id] || 1) + dir * SIZE_STEP);

  const relayout = () => {
    const auto = layoutHorizontal(docRef.current.client_ids, edges, clientsById);
    update((d) => ({ ...d, positions: auto }));
    requestAnimationFrame(() => requestAnimationFrame(() => fitAll()));
  };

  /* ── Legami ── */
  const findManual = (a, b) => links.find((l) => (l.from_client_id === a && l.to_client_id === b) || (l.from_client_id === b && l.to_client_id === a));
  const openPicker = (from, to, anchor) => {
    const ex = to ? findManual(from, to) : null;
    setSelectedEdgeId(null);
    setPicker({
      from: ex ? ex.from_client_id : from,
      to: ex ? ex.to_client_id : to,
      type: ex ? ex.link_type : null,
      label: ex?.label || '',
      event_id: ex?.event_id || '',
      editingId: ex?.id || null,
      anchor,
    });
  };
  const saveLink = async (p) => {
    if (!p.from || !p.to || !p.type) return;
    const payload = { link_type: p.type, label: (p.label || '').trim(), event_id: p.type === 'serata' ? p.event_id || '' : '' };
    setPicker(null);
    try {
      const ex = p.editingId ? links.find((l) => l.id === p.editingId) : findManual(p.from, p.to);
      if (ex) {
        qc.setQueryData(['client-links', promoterId], (old = []) => old.map((l) => (l.id === ex.id ? { ...l, ...payload } : l)));
        await base44.entities.ClientLink.update(ex.id, payload);
        flash('Legame aggiornato');
      } else {
        const tmp = { id: `tmp-${Date.now()}`, promoter_id: promoterId, from_client_id: p.from, to_client_id: p.to, ...payload };
        qc.setQueryData(['client-links', promoterId], (old = []) => [...old, tmp]);
        const created = await base44.entities.ClientLink.create({ promoter_id: promoterId, from_client_id: p.from, to_client_id: p.to, ...payload });
        qc.setQueryData(['client-links', promoterId], (old = []) => old.map((l) => (l.id === tmp.id ? created : l)));
        flash(`${LINK_TYPES[p.type].label}: ${clientsById[p.from]?.name} ↔ ${clientsById[p.to]?.name}`);
      }
      if (ex && ex.link_type === 'obiettivo' && p.type !== 'obiettivo') flash(`Obiettivo raggiunto: ${clientsById[p.from]?.name} e ${clientsById[p.to]?.name} ora sono amici 🎉`);
    } catch {
      qc.invalidateQueries({ queryKey: ['client-links', promoterId] });
      flash('Errore: legame non salvato');
    }
  };
  const deleteLink = async (id) => {
    const prev = qc.getQueryData(['client-links', promoterId]);
    qc.setQueryData(['client-links', promoterId], (old = []) => old.filter((l) => l.id !== id));
    setPicker(null);
    if (selectedEdgeId === id) setSelectedEdgeId(null);
    try {
      await base44.entities.ClientLink.delete(id);
      flash('Legame eliminato');
    } catch {
      qc.setQueryData(['client-links', promoterId], prev);
      flash('Errore: impossibile eliminare');
    }
  };

  const saveAsGroup = async () => {
    if (groupSaved) { flash('Questa comitiva è già nei Gruppi'); return; }
    // Nei Gruppi entrano solo i propri paganti (i Gruppi sono la tua lista privata)
    if (ownMembers.length < 2) { flash('Servono almeno 2 tuoi paganti'); return; }
    try {
      await base44.entities.ClientGroup.create({ promoter_id: promoterId, name: doc.name, client_ids: ownMembers.map((m) => m.id) });
      qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
      flash(`Gruppo "${doc.name}" creato`);
    } catch {
      flash('Errore: gruppo non creato');
    }
  };
  const deleteComitiva = async () => {
    try {
      clearTimeout(saveTimer.current);
      dirty.current = false;
      await base44.entities.Comitiva.delete(comitiva.id);
      qc.setQueryData(['comitive', promoterId], (old = []) => old.filter((c) => c.id !== comitiva.id));
      onDeleted?.();
    } catch {
      flash('Errore: impossibile eliminare');
    }
  };

  /* ── Gesti: drag card, pan, pinch, collegamento dai bordi ── */
  const toWorld = (cx, cy) => {
    const r = containerRef.current.getBoundingClientRect();
    const v = viewRef.current;
    return { x: (cx - r.left - v.x) / v.k, y: (cy - r.top - v.y) / v.k };
  };
  // PORT: tocco su un filo (telefono): distanza dalla curva campionata, soglia 10 px dello schermo
  const edgeAtPoint = (cx, cy) => {
    const w = toWorld(cx, cy);
    const tol = 10 / viewRef.current.k;
    let best = null;
    let bestD = tol;
    for (const ed of edges) {
      const a = posRef.current[ed.from];
      const b = posRef.current[ed.to];
      if (!a || !b) continue;
      const g = wireGeometry(a, b, heights[ed.from], heights[ed.to], docRef.current.sizes?.[ed.from] || 1, docRef.current.sizes?.[ed.to] || 1);
      const n = g.d.match(/-?[\d.]+/g).map(Number);
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        const u = 1 - t;
        const x = u * u * u * n[0] + 3 * u * u * t * n[2] + 3 * u * t * t * n[4] + t * t * t * n[6];
        const y = u * u * u * n[1] + 3 * u * u * t * n[3] + 3 * u * t * t * n[5] + t * t * t * n[7];
        const d = Math.hypot(x - w.x, y - w.y);
        if (d < bestD) { bestD = d; best = ed.id; }
      }
    }
    return best;
  };
  const nodeAtPoint = (cx, cy) => {
    const el = webDocument.elementFromPoint(cx, cy);
    return el?.closest?.('[data-node-id]')?.getAttribute('data-node-id') || null;
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('[data-ui]')) return;
    const el = containerRef.current;
    try { el.setPointerCapture(e.pointerId); } catch { /* noop */ }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      flushScheduled();
      if ((gesture.current?.type === 'node' || gesture.current?.type === 'resize') && gesture.current.moved) update((d) => d);
      setLinkDraft(null);
      setDraggingId(null);
      setInteracting(true);
      const [p1, p2] = [...pointers.current.values()];
      const r = el.getBoundingClientRect();
      gesture.current = {
        type: 'pinch',
        dist: Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1,
        mid: { x: (p1.x + p2.x) / 2 - r.left, y: (p1.y + p2.y) / 2 - r.top },
        view: { ...viewRef.current },
      };
      return;
    }
    if (pointers.current.size > 2) return;

    const handleEl = e.target.closest('[data-handle]');
    const nodeEl = e.target.closest('[data-node-id]');
    const base = { sx: e.clientX, sy: e.clientY, moved: false, view: { ...viewRef.current }, pid: e.pointerId, t0: Date.now() };
    const resizeEl = e.target.closest('[data-resize]');
    if (resizeEl && nodeEl && !locked) {
      // Maniglia d'angolo: la scala segue la distanza del dito/mouse dal centro della card
      const id = nodeEl.getAttribute('data-node-id');
      const c = posRef.current[id];
      if (c) {
        const w0 = toWorld(e.clientX, e.clientY);
        gesture.current = { ...base, type: 'resize', id, center: { ...c }, d0: Math.max(Math.hypot(w0.x - c.x, w0.y - c.y), 20), s0: docRef.current.sizes?.[id] || 1 };
        setSelectedEdgeId(null);
        setSelectedNodeId(id);
        setInteracting(true);
        return;
      }
    }
    if (handleEl && nodeEl && !locked) {
      const id = nodeEl.getAttribute('data-node-id');
      const side = handleEl.getAttribute('data-handle');
      gesture.current = { ...base, type: 'link', id, side };
      setSelectedEdgeId(null);
      setLinkDraft({ from: id, side, to: toWorld(e.clientX, e.clientY), target: null });
    } else if (nodeEl) {
      const id = nodeEl.getAttribute('data-node-id');
      gesture.current = { ...base, type: 'node', id, orig: posRef.current[id] ? { ...posRef.current[id] } : null };
    } else if (e.target.closest('[data-edge-id]')) {
      gesture.current = { ...base, type: 'edge', id: e.target.closest('[data-edge-id]').getAttribute('data-edge-id') };
    } else if (Platform.OS !== 'web' && edgeAtPoint(e.clientX, e.clientY)) {
      // PORT: sul telefono i fili non ricevono tocchi (Svg senza eventi): filo più vicino entro ~10 px
      gesture.current = { ...base, type: 'edge', id: edgeAtPoint(e.clientX, e.clientY) };
    } else {
      gesture.current = { ...base, type: 'pan' };
    }
  };

  const onPointerMove = (e) => {
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;
    if (g.type === 'pinch') {
      if (pointers.current.size < 2) return;
      const [p1, p2] = [...pointers.current.values()];
      const r = containerRef.current.getBoundingClientRect();
      const k = clamp(g.view.k * ((Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1) / g.dist), MIN_K, MAX_K);
      const mid = { x: (p1.x + p2.x) / 2 - r.left, y: (p1.y + p2.y) / 2 - r.top };
      const wx = (g.mid.x - g.view.x) / g.view.k;
      const wy = (g.mid.y - g.view.y) / g.view.k;
      const next = { k, x: mid.x - wx * k, y: mid.y - wy * k };
      viewRef.current = next;
      schedule(() => setView(next));
      return;
    }
    if (e.pointerId !== g.pid) return;
    const dx = e.clientX - g.sx;
    const dy = e.clientY - g.sy;
    if (g.type === 'resize') {
      const w = toWorld(e.clientX, e.clientY);
      const s = clampSize(g.s0 * (Math.hypot(w.x - g.center.x, w.y - g.center.y) / g.d0));
      g.moved = true;
      const id = g.id;
      schedule(() => setDoc((d) => (d.sizes?.[id] === s ? d : { ...d, sizes: { ...(d.sizes || {}), [id]: s } })));
      return;
    }
    if (g.type === 'link') {
      const to = toWorld(e.clientX, e.clientY);
      const t = nodeAtPoint(e.clientX, e.clientY);
      const target = t && t !== g.id ? t : null;
      schedule(() => setLinkDraft((d) => (d ? { ...d, to, target } : d)));
      return;
    }
    if (!g.moved && Math.hypot(dx, dy) > 6) {
      g.moved = true;
      setInteracting(true);
      if (g.type === 'node' && g.orig && !locked) setDraggingId(g.id);
    }
    if (!g.moved) return;
    if (g.type === 'node') {
      if (!g.orig || locked) return;
      const k = viewRef.current.k;
      const np = { x: Math.round(g.orig.x + dx / k), y: Math.round(g.orig.y + dy / k) };
      const id = g.id;
      schedule(() => setDoc((d) => ({ ...d, positions: { ...d.positions, [id]: np } })));
    } else {
      const next = { ...g.view, x: g.view.x + dx, y: g.view.y + dy };
      viewRef.current = next;
      schedule(() => setView(next));
    }
  };

  const endPointer = (e, cancelled) => {
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (!g) return;
    flushScheduled();
    if (pointers.current.size === 0) { setInteracting(false); setDraggingId(null); }
    if (g.type === 'pinch') {
      if (pointers.current.size < 2) {
        const rem = [...pointers.current.entries()][0];
        gesture.current = rem ? { type: 'pan', sx: rem[1].x, sy: rem[1].y, moved: true, view: { ...viewRef.current }, pid: rem[0] } : null;
      }
      return;
    }
    if (e.pointerId !== g.pid) return;
    gesture.current = null;
    if (g.type === 'resize') {
      if (g.moved) update((d) => d);
      return;
    }
    if (g.type === 'link') {
      setLinkDraft(null);
      if (cancelled) return;
      const target = nodeAtPoint(e.clientX, e.clientY);
      const r = containerRef.current.getBoundingClientRect();
      if (target && target !== g.id) openPicker(g.id, target, { x: e.clientX - r.left, y: e.clientY - r.top });
      else if (Math.hypot(e.clientX - g.sx, e.clientY - g.sy) < 8) openPicker(g.id, null, { x: e.clientX - r.left, y: e.clientY - r.top });
      return;
    }
    if (g.type === 'node' && g.moved) {
      if (!locked) update((d) => d);
      return;
    }
    if (cancelled) return;
    // Pressione prolungata ferma = si è aperto il menu cliente (ClientSerateMenu): non aprire anche il pannello
    if (g.type === 'node' && e.pointerType !== 'mouse' && Date.now() - g.t0 >= 450) return;
    if (g.type === 'node') { setSelectedEdgeId(null); setSelectedNodeId(g.id); setConfirmRemove(false); }
    else if (g.type === 'edge' && !g.moved) { setSelectedNodeId(null); setSelectedEdgeId(g.id); }
    else if (g.type === 'pan' && !g.moved) { setSelectedNodeId(null); setSelectedEdgeId(null); }
  };

  /* ── Drop dalla sidebar ── */
  const onDrop = (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/x-comitiva');
    if (!raw) return;
    let data;
    try { data = JSON.parse(raw); } catch { return; }
    const r = containerRef.current?.getBoundingClientRect();
    if (r) showDropFx(e.clientX - r.left, e.clientY - r.top);
    dropPayload(data, toWorld(e.clientX, e.clientY));
  };
  // Rilascio dal trascinamento col dito (mobile): aggiunge nel punto del foglio sotto il dito
  // Restituisce true se rilasciato sul foglio (per l'animazione di atterraggio dell'etichetta)
  const onTouchDrop = (data, cx, cy) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r || cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) { flash('Rilascia la card sul foglio'); return false; }
    showDropFx(cx - r.left, cy - r.top);
    dropPayload(data, toWorld(cx, cy));
    return true;
  };
  const onTouchDragState = (on, dropped) => {
    setTouchDragging(on);
    // Su telefono, dopo un rilascio riuscito la barra si chiude così si vede la card appena nata
    if (!on && dropped && isPhone) setSidebarOpen(false);
  };
  // Onda ad anello nel punto di rilascio
  const showDropFx = (x, y) => {
    const k = Date.now();
    setDropFx({ x, y, k });
    setTimeout(() => setDropFx((f) => (f?.k === k ? null : f)), 700);
  };
  function dropPayload(data, at) {
    if (data.kind === 'client') addClients([data.id], at);
    if (data.kind === 'ext') addForeign('ext', dirClientsById[data.id], at);
    if (data.kind === 'promoter') addForeign('promoter', promotersById[data.id], at);
    if (data.kind === 'group') { const g = groups.find((x) => x.id === data.id); if (g) addGroup(g, at); }
  }

  /* ── Tastiera ── */
  useEffect(() => {
    const onKey = (e) => {
      const tag = webDocument.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Escape') {
        if (picker) setPicker(null);
        else if (selectedNodeId || selectedEdgeId) { setSelectedNodeId(null); setSelectedEdgeId(null); }
      }
      if (selectedNodeId && (e.key === ']' || e.key === '[')) { bumpNodeSize(selectedNodeId, e.key === ']' ? 1 : -1); return; }
      if (e.key === '+' || e.key === '=') zoomCenter(1.2);
      if (e.key === '-') zoomCenter(1 / 1.2);
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEdgeId && !selectedEdgeId.startsWith('ref-')) deleteLink(selectedEdgeId);
    };
    webWindow.addEventListener('keydown', onKey);
    return () => webWindow.removeEventListener('keydown', onKey);
  });

  /* ── Pannello dettagli ── */
  const selectedClient = selectedNodeId ? clientsById[selectedNodeId] : null;
  const selectedEdge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null;
  const neighborEdges = useMemo(
    () => (selectedNodeId ? edges.filter((e) => e.from === selectedNodeId || e.to === selectedNodeId) : []),
    [edges, selectedNodeId]
  );
  const grid = 22 * view.k;
  const empty = members.length === 0;

  const content = (
    <Div className="fixed inset-0 z-[9000] flex flex-col text-slate-200" style={{ background: '#0A0D14', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <CssStyleTag />

      <TopBar
        name={doc.name}
        onRename={(n) => update((d) => ({ ...d, name: n }))}
        saveState={saveState}
        onBack={onClose}
        members={members.length}
        edgesCount={edges.length}
        goalsCount={goalsCount}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onRelayout={relayout}
        onSaveGroup={saveAsGroup}
        groupSaved={groupSaved}
        onDelete={() => setConfirmDelete(true)}
      />

      <Div className="relative flex flex-1 min-h-0">
        <PeopleSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          clients={clients}
          groups={groups}
          clientsById={clientsById}
          memberSet={memberSet}
          onAddClient={(id) => addClients([id])}
          onAddGroup={(g) => addGroup(g)}
          extClients={directory?.clients || []}
          promoters={directory?.promoters || []}
          promotersById={promotersById}
          onAddForeign={(kind, item) => addForeign(kind, item)}
          onTouchDrop={onTouchDrop}
          onTouchDragState={onTouchDragState}
          hidden={touchDragging}
          dirLoading={directoryLoading}
        />

        {/* Foglio */}
        <Div
          ref={containerRef}
          className={`relative flex-1 min-w-0 overflow-hidden select-none ${interacting ? 'cm-paused' : ''}`}
          style={{ background: '#0D1018', touchAction: 'none', cursor: linkDraft ? 'crosshair' : 'default' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(e) => endPointer(e, false)}
          onPointerCancel={(e) => endPointer(e, true)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <Div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 0.9px, transparent 1.3px)',
              backgroundSize: `${grid}px ${grid}px`,
              backgroundPosition: `${view.x}px ${view.y}px`,
            }}
          />

          {empty && (
            <Div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 gap-3 pointer-events-none">
              <Div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)' }}>
                <UsersRound className="w-7 h-7 text-violet-300" />
              </Div>
              <P className="text-sm font-semibold text-slate-300">La comitiva è vuota</P>
              <P className="text-xs text-slate-500 max-w-xs">Aggiungi paganti o interi gruppi dalla barra a sinistra, poi collegali trascinando i pallini sul bordo delle card.</P>
              {!sidebarOpen && (
                <Btn button data-ui onClick={() => setSidebarOpen(true)} className="pointer-events-auto mt-1 px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #7C3AED, #551A8E)' }}>
                  Aggiungi persone
                </Btn>
              )}
            </Div>
          )}

          {!empty && members.length > 1 && edges.length === 0 && !picker && (
            <Div data-ui className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-2 rounded-xl text-[11px] font-medium text-violet-100 bg-violet-500/15 border border-violet-400/30 backdrop-blur-md text-center max-w-[90%] pointer-events-none">
              Trascina un pallino sul bordo di una card fino a un'altra per collegarle (anche "Da far conoscere" se devi fargli fare amicizia)
            </Div>
          )}

          {/* Mondo */}
          <Div className="absolute left-0 top-0" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`, transformOrigin: '0 0', opacity: ready ? 1 : 0, transition: 'opacity 180ms ease-out' }}>
            <WiresLayer
              svgRef={svgRef}
              edges={edges}
              pos={pos}
              heights={heights}
              sizes={doc.sizes}
              selectedNodeId={selectedNodeId}
              selectedEdgeId={selectedEdgeId}
              draggingId={draggingId}
              linkDraft={linkDraft}
              paused={interacting}
            />
            {members.map((c) => {
              const p = pos[c.id];
              if (!p) return null;
              return (
                <ComitivaNode
                  key={c.id}
                  client={c}
                  x={p.x}
                  y={p.y}
                  selected={selectedNodeId === c.id}
                  linkSource={linkDraft?.from === c.id}
                  linkTarget={linkDraft?.target === c.id}
                  linking={!!linkDraft}
                  referrerName={clientsById[c.referred_by_client_id]?.name}
                  ownerName={ownerOf(c)?.name}
                  ownerPhoto={ownerOf(c)?.photo_url}
                  locked={locked}
                  scale={doc.sizes?.[c.id] || 1}
                  goals={goalsByNode[c.id] || 0}
                  entering={enteringIds.has(c.id)}
                />
              );
            })}
          </Div>

          {dropFx && (
            <Div key={dropFx.k} className="absolute z-10 pointer-events-none" style={{ left: dropFx.x, top: dropFx.y }}>
              {Platform.OS !== 'web' ? (
                <>
                  {/* PORT: cm-drop-ring con Reanimated (alone radiale → cerchio pieno sfumato) */}
                  <DropRing size={96} duration={650} easing={DROP_EASE} style={{ borderWidth: 2, borderColor: 'rgba(167,139,250,.9)', boxShadow: '0 0 24px rgba(124,58,237,.6)' }} />
                  <DropRing size={40} duration={500} delay={60} easing={EASE_OUT_CSS} style={{ backgroundColor: 'rgba(167,139,250,.35)' }} />
                </>
              ) : (
                <>
                  <Span className="absolute w-24 h-24 rounded-full" style={{ left: 0, top: 0, border: '2px solid rgba(167,139,250,.9)', boxShadow: '0 0 24px rgba(124,58,237,.6)', animation: 'cm-drop-ring 650ms cubic-bezier(.2,.7,.3,1) forwards' }} />
                  <Span className="absolute w-10 h-10 rounded-full" style={{ left: 0, top: 0, background: 'radial-gradient(circle, rgba(167,139,250,.55), transparent 70%)', animation: 'cm-drop-ring 500ms ease-out 60ms both' }} />
                </>
              )}
            </Div>
          )}

          <CanvasControls
            zoom={view.k}
            onZoomIn={() => zoomCenter(1.2)}
            onZoomOut={() => zoomCenter(1 / 1.2)}
            onFit={fitAll}
            onCenter={resetZoom}
            locked={locked}
            onToggleLock={() => setLocked((v) => !v)}
          />
          {ready && <CanvasMinimap nodes={members} edges={edges} pos={pos} sizes={doc.sizes} view={view} size={size} onJump={(p) => centerOn(p, viewRef.current.k)} />}

          {notice && (
            <Div data-ui className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl text-xs font-medium text-slate-100 bg-[#1A1F2E]/95 border border-white/10 shadow-xl max-w-[80%] text-center pointer-events-none">
              {notice}
            </Div>
          )}

        </Div>

        {/* Pannelli FUORI dal foglio: il foglio ha touch-action:none (pan/zoom col dito) e su mobile
            (Safari) bloccava anche lo scroll dei pannelli contenuti. Qui scorrono normalmente. */}
        {/* Pannello card selezionata */}
        {selectedClient && !picker && (
          <Div data-ui className="absolute z-30 left-0 right-0 bottom-0 max-h-[62%] md:left-auto md:top-0 md:bottom-0 md:max-h-none md:w-[320px] overflow-y-auto overscroll-contain [touch-action:pan-y] border-t md:border-t-0 md:border-l border-white/10 bg-[#0F1117] shadow-2xl rounded-t-2xl md:rounded-none p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-4">
            <Div className="flex items-start gap-3">
              <ClientAvatar client={selectedClient} initials={initialsOf(selectedClient.name)} size="lg" className="!rounded-xl" />
              <Div className="min-w-0 flex-1">
                <P className="text-[15px] font-semibold text-slate-100 leading-tight [overflow-wrap:anywhere]">
                  {selectedClient.name}
                  {selectedClient.is_leader && <Star className="inline w-3.5 h-3.5 ml-1 -mt-0.5 text-amber-400 fill-amber-400" />}
                </P>
                {kindOf(selectedClient) === 'promoter' ? (
                  <P className="text-[11px] text-purple-300 mt-0.5 flex items-center gap-1"><BadgeCheck className="w-3 h-3 shrink-0" />Promoter Vibra</P>
                ) : (
                  <P className="text-[11px] text-slate-400 mt-0.5 flex items-start gap-1"><MapPin className="w-3 h-3 mt-0.5 shrink-0" /><Span className="[overflow-wrap:anywhere]">{zoneOf(selectedClient) || 'Zona non indicata'}</Span></P>
                )}
              </Div>
              <Btn button onClick={() => setSelectedNodeId(null)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-100 hover:bg-white/10"><X className="w-4 h-4" /></Btn>
            </Div>

            {kindOf(selectedClient) === 'ext' && (
              <Div className="rounded-xl px-3 py-2.5 space-y-1.5" style={{ background: 'color-mix(in srgb, #38bdf8 10%, #0F1117)', border: '1px solid color-mix(in srgb, #38bdf8 25%, #0F1117)' }}>
                <P className="text-[11px] text-sky-200 flex items-center gap-1.5 min-w-0">
                  <ClientAvatar client={ownerOf(selectedClient)} initials={initialsOf(ownerOf(selectedClient)?.name)} size="xs" />
                  <Span className="truncate">Pagante di <Span className='font-bold'>{ownerOf(selectedClient)?.name || 'un altro PR'}</Span></Span>
                </P>
                <P className="text-[10px] text-slate-500 flex items-start gap-1.5"><Lock className="w-3 h-3 shrink-0 mt-px" />Non è un tuo pagante: vedi solo nome e zona, niente rating o dati personali.</P>
              </Div>
            )}
            {kindOf(selectedClient) === 'promoter' && (
              <Div className="rounded-xl px-3 py-2.5" style={{ background: 'color-mix(in srgb, #c084fc 10%, #0F1117)', border: '1px solid color-mix(in srgb, #c084fc 25%, #0F1117)' }}>
                <P className="text-[11px] text-purple-200">Collegalo ai paganti con il filo <Span className='font-bold'>Equilibrio promoter</Span>: l'Analisi Intelligente lo citerà nei consigli.</P>
              </Div>
            )}

            {kindOf(selectedClient) === 'own' && (
            <Div className="grid grid-cols-2 gap-1.5">
              {[
                ['Valore', fmtEuro(selectedClient.cum_total_spent)],
                ['Presenze', selectedClient.cum_visits || 0],
                ['Rating', selectedClient.cum_rating ? Number(selectedClient.cum_rating).toFixed(1) : '—'],
                ['Ultima presenza', fmtDate(selectedClient.cum_last_attendance_date)],
              ].map(([l, v]) => (
                <Div key={l} className="rounded-xl bg-white/[0.04] border border-white/5 px-2.5 py-2">
                  <P className="text-[9px] uppercase tracking-wider text-slate-500">{l}</P>
                  <P className="text-[13px] font-semibold text-slate-100">{v}</P>
                </Div>
              ))}
            </Div>
            )}

            {/* Importanza nella comitiva = dimensione della card */}
            {(() => {
              const s = doc.sizes?.[selectedClient.id] || 1;
              return (
                <Div className="rounded-xl bg-white/[0.04] border border-white/5 p-2.5 space-y-2">
                  <Div className="flex items-center justify-between gap-2">
                    <P className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Importanza nella comitiva</P>
                    <Span className="text-[11px] font-semibold text-violet-200">{importanceLabel(s)} · {Math.round(s * 100)}%</Span>
                  </Div>
                  <Div className="flex items-center gap-2">
                    <Btn button disabled={s <= SIZE_MIN} onClick={() => bumpNodeSize(selectedClient.id, -1)} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-slate-200 inline-flex items-center justify-center hover:bg-white/10 disabled:opacity-30 shrink-0" accessibilityLabel="Rimpicciolisci card ( [ )">
                      <Minus className="w-4 h-4" />
                    </Btn>
                    <Div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <Div className="h-full rounded-full" style={{ width: `${((s - SIZE_MIN) / (SIZE_MAX - SIZE_MIN)) * 100}%`, background: 'linear-gradient(90deg, #7C3AED, #a78bfa)' }} />
                    </Div>
                    <Btn button disabled={s >= SIZE_MAX} onClick={() => bumpNodeSize(selectedClient.id, 1)} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-slate-200 inline-flex items-center justify-center hover:bg-white/10 disabled:opacity-30 shrink-0" accessibilityLabel="Ingrandisci card ( ] )">
                      <Plus className="w-4 h-4" />
                    </Btn>
                  </Div>
                  <Div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-1">
                      {SIZE_PRESETS.map((pr) => {
                        const active = Math.abs(s - pr.scale) < 0.08;
                        return (
                          <Btn
                            button
                            key={pr.key}
                            onClick={() => setNodeSize(selectedClient.id, pr.scale)}
                            className={`h-8 px-1 rounded-lg text-[11px] font-semibold leading-none whitespace-nowrap border transition-colors ${active ? 'bg-violet-500/25 border-violet-400/60 text-violet-100' : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-100'}`}
                          >
                            {pr.label}
                          </Btn>
                        );
                      })}
                  </Div>
                </Div>
              );
            })()}

            {kindOf(selectedClient) === 'own' && (
            <Div className="rounded-xl px-3 py-2 text-[11px]" style={{ background: `color-mix(in srgb, ${SOURCE_META[sourceKey(selectedClient)].color} 10%, #0F1117)`, color: SOURCE_META[sourceKey(selectedClient)].color }}>
              {sourceKey(selectedClient) === 'referred'
                ? <>Tramite <Span className='font-bold [overflow-wrap:anywhere]'>{clientsById[selectedClient.referred_by_client_id]?.name || '...'}</Span></>
                : SOURCE_META[sourceKey(selectedClient)].label}
            </Div>
            )}

            <Div>
              <P className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Legami in questa comitiva ({neighborEdges.filter((e) => !LINK_TYPES[e.type].goal).length})</P>
              {neighborEdges.length === 0 ? (
                <P className="text-[11px] text-slate-500">Nessun legame. Trascina un pallino sul bordo della card verso un'altra persona.</P>
              ) : (
                <Div className="space-y-1">
                  {neighborEdges.map((e) => {
                    const otherId = e.from === selectedNodeId ? e.to : e.from;
                    const other = clientsById[otherId];
                    const t = LINK_TYPES[e.type];
                    const typeText = e.type === 'presentato' ? (e.from === selectedNodeId ? 'Ha presentato' : 'Presentato da') : t.label;
                    return (
                      <Div key={e.id} className="flex items-start gap-2 rounded-xl bg-white/[0.03] px-2.5 py-2">
                        <Span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }} />
                        <Btn button className="min-w-0 flex-1 text-left" onClick={() => { setSelectedNodeId(otherId); if (pos[otherId]) centerOn(pos[otherId]); }}>
                          <P className="text-xs font-semibold text-slate-100 [overflow-wrap:anywhere]">{other?.name}</P>
                          <P className="text-[10px]" style={{ color: t.color }}>{typeText}{e.label ? ` · ${e.label}` : ''}</P>
                          {e.event_id && eventsById[e.event_id] && <P className="text-[10px] text-slate-500">{eventLabel(eventsById[e.event_id])}</P>}
                        </Btn>
                        {t.goal && (
                          <Btn button onClick={() => saveLink({ from: e.from, to: e.to, type: 'amici', label: e.label, editingId: e.id })} className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/15 shrink-0" accessibilityLabel="Fatto: ora sono amici"><PartyPopper className="w-3.5 h-3.5" /></Btn>
                        )}
                        {!e.auto && (
                          <Btn button onClick={() => openPicker(e.from, e.to, null)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-100 hover:bg-white/10 shrink-0"><Pencil className="w-3.5 h-3.5" /></Btn>
                        )}
                      </Div>
                    );
                  })}
                </Div>
              )}
            </Div>

            <Div className={`grid gap-1.5 ${kindOf(selectedClient) === 'own' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <Btn button onClick={() => openPicker(selectedClient.id, null, null)} className="h-9 rounded-xl text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5" style={{ background: 'linear-gradient(135deg, #7C3AED, #551A8E)' }}>
                <Link2 className="w-3.5 h-3.5" />Collega a...
              </Btn>
              {kindOf(selectedClient) === 'own' && <Btn button onClick={() => onClientClick?.(selectedClient)} className="h-9 rounded-xl text-xs font-semibold text-slate-100 bg-white/5 border border-white/10 hover:bg-white/10 inline-flex items-center justify-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />Apri scheda
              </Btn>}
            </Div>
            <Btn
              button
              onClick={() => (confirmRemove ? removeMember(selectedClient.id) : setConfirmRemove(true))}
              className={`w-full h-9 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 ${confirmRemove ? 'bg-red-500/20 text-red-200 border border-red-400/40' : 'text-red-400 hover:bg-red-500/10'}`}
            >
              <Trash2 className="w-3.5 h-3.5" />{confirmRemove ? 'Tocca di nuovo per rimuovere' : 'Rimuovi dalla comitiva'}
            </Btn>
          </Div>
        )}

        {/* Pannello legame selezionato */}
        {selectedEdge && !picker && (
          <Div data-ui className="absolute z-30 left-0 right-0 bottom-0 md:left-auto md:top-0 md:bottom-auto md:w-[320px] md:m-3 rounded-t-2xl md:rounded-2xl border border-white/10 bg-[#0F1117] shadow-2xl p-4 space-y-3">
            <Div className="flex items-center justify-between">
              <Span className="flex items-center gap-2 text-xs font-semibold" style={{ color: LINK_TYPES[selectedEdge.type].color }}>
                <Span className="w-2.5 h-2.5 rounded-full" style={{ background: LINK_TYPES[selectedEdge.type].color, boxShadow: `0 0 8px ${LINK_TYPES[selectedEdge.type].color}` }} />
                {LINK_TYPES[selectedEdge.type].goal && <Target className="w-3.5 h-3.5" />}
                {LINK_TYPES[selectedEdge.type].label}
              </Span>
              <Btn button onClick={() => setSelectedEdgeId(null)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-100 hover:bg-white/10"><X className="w-4 h-4" /></Btn>
            </Div>
            <Div className="flex items-center gap-2 flex-wrap">
              {[selectedEdge.from, selectedEdge.to].map((id, i) => (
                <React.Fragment key={id}>
                  {i === 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-500" />}
                  <Btn button onClick={() => { setSelectedEdgeId(null); setSelectedNodeId(id); }} className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-1">
                    <ClientAvatar client={clientsById[id]} initials={initialsOf(clientsById[id]?.name)} size="xs" />
                    <Span className="text-[11px] font-semibold text-slate-100 [overflow-wrap:anywhere]">{clientsById[id]?.name}</Span>
                  </Btn>
                </React.Fragment>
              ))}
            </Div>
            {selectedEdge.event_id && eventsById[selectedEdge.event_id] && <P className="text-[11px] text-slate-400">Conosciuti a: {eventLabel(eventsById[selectedEdge.event_id])}</P>}
            {selectedEdge.label && <P className="text-[11px] text-slate-200">{selectedEdge.label}</P>}
            {LINK_TYPES[selectedEdge.type].goal && (
              <>
                <P className="text-[11px] text-amber-200/80">Non sono ancora amici: è un tuo obiettivo farli conoscere. L'Analisi Intelligente ne tiene conto nei consigli.</P>
                <Btn
                  button
                  onClick={() => saveLink({ from: selectedEdge.from, to: selectedEdge.to, type: 'amici', label: selectedEdge.label, editingId: selectedEdge.id })}
                  className="w-full h-9 rounded-xl text-xs font-semibold text-emerald-100 bg-emerald-500/15 border border-emerald-400/40 inline-flex items-center justify-center gap-1.5"
                >
                  <PartyPopper className="w-3.5 h-3.5" />Fatto! Ora sono amici
                </Btn>
              </>
            )}
            {selectedEdge.auto ? (
              <P className="text-[10px] text-slate-500">Viene dalla scheda cliente (campo "Tramite..."): si modifica da lì.</P>
            ) : (
              <Div className="grid grid-cols-2 gap-1.5">
                <Btn button onClick={() => openPicker(selectedEdge.from, selectedEdge.to, null)} className="h-9 rounded-xl text-xs font-semibold text-slate-100 bg-white/5 border border-white/10 inline-flex items-center justify-center gap-1.5"><Pencil className="w-3.5 h-3.5" />Modifica</Btn>
                <Btn button onClick={() => deleteLink(selectedEdge.id)} className="h-9 rounded-xl text-xs font-semibold text-red-300 bg-red-500/10 border border-red-400/30 inline-flex items-center justify-center gap-1.5"><Trash2 className="w-3.5 h-3.5" />Elimina</Btn>
              </Div>
            )}
          </Div>
        )}

        {picker && (
          <LinkPicker
            picker={picker}
            setPicker={setPicker}
            clientsById={clientsById}
            members={members}
            events={events}
            onSave={saveLink}
            onDelete={deleteLink}
            onClose={() => setPicker(null)}
            boxSize={size}
            offsetX={containerRef.current?.offsetLeft || 0}
          />
        )}
      </Div>

      {confirmDelete && (
        <Btn data-ui className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setConfirmDelete(false)}>
          <Btn className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0F1117] p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <P className="text-sm font-semibold text-slate-100 [overflow-wrap:anywhere]">Eliminare "{doc.name}"?</P>
            <P className="text-xs text-slate-400">Le persone e i legami tra loro restano: si elimina solo questa mappa.</P>
            <Div className="grid grid-cols-2 gap-1.5">
              <Btn button onClick={() => setConfirmDelete(false)} className="h-9 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-100">Annulla</Btn>
              <Btn button onClick={deleteComitiva} className="h-9 rounded-xl text-xs font-semibold bg-red-500/20 border border-red-400/40 text-red-200">Elimina</Btn>
            </Div>
          </Btn>
        </Btn>
      )}
    </Div>
  );

  return createPortal(content, webDocument.body);
}
