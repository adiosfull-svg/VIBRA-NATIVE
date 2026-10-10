// Port di src/components/programmazione/SeminaCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@/web/router';
import { Instagram, Trash2, CalendarDays, Pencil, MapPin, Music2, StickyNote, Check, Loader2, Power, ArrowRight, MessageCircle, User, Briefcase, GraduationCap, Sparkles, Car } from '@/ui/icons.generated';
import SeminaCardBack from './SeminaCardBack';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import { base44 } from '@/lib/base44';
import { useQueryClient } from '@tanstack/react-query';
import { extractNameFromHandle } from '@/legacy/utils/seminaParse';
import CachedImage from '@/web/components/shared/CachedImage';
import SeminaRecettivitaSlider from '@/web/components/programmazione/SeminaRecettivitaSlider';
import { useFlipGesture } from '@/web/hooks/useFlipGesture';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { A, HtmlTextarea } from '@/ui/elements';

const STATUS_META = {
  nuovo: { label: 'Nuovo', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  contattato: { label: 'Contattato', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  interessato: { label: 'Interessato', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  convertito: { label: 'Convertito', cls: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25' },
};

const initials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Card per una Semina (prospect IG/TikTok non ancora cliente).
 * `compact` → variante mini per il tab Inviti (con note su 1 riga).
 *
 * Full card: foto profilo grande, chip, nota modificabile inline con
 * auto-espansione, slider recettività, banner cliccabile per aprire il profilo.
 */
export default function SeminaCard({ semina, onDelete, onEdit, compact = false, dragHandleProps, isDragging, planInfo, chatConvId, highlightFlash = false }) {
  const [flipped, setFlipped] = useState(false);
  const flip = useFlipGesture(flipped, setFlipped);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { getVenueLogo } = useAllVenueLogos();
  const planDateLabel = planInfo ? (() => { try { return format(parseISO(planInfo.dateStr), 'd MMM', { locale: it }); } catch { return planInfo.dateStr; } })() : '';
  const planVenueName = planInfo?.title?.split(' · ')[1] || '';
  const { logoUrl: planVenueLogo } = getVenueLogo(planVenueName);
  const platform = semina.platform || 'instagram';
  const isTikTok = platform === 'tiktok';
  const handle = isTikTok ? (semina.tiktok || '') : (semina.instagram || '');
  const profileUrl = isTikTok ? (semina.tiktok_profile_url || '') : (semina.instagram_profile_url || '');
  const handleDisplay = handle.replace('@', '');
  const isOff = !!semina.is_off;

  const displayName = (() => {
    const n = (semina.name || '').trim();
    const h = handleDisplay || '';
    if (n && h && (n === h || n.replace(/[@]/g, '') === h || n.toLowerCase() === h.toLowerCase())) {
      return extractNameFromHandle(h) || n;
    }
    return n || h;
  })();

  const createdDate = semina.created_date
    ? format(new Date(semina.created_date), 'd MMM yy', { locale: it })
    : '';
  const status = semina.status || 'nuovo';
  const statusMeta = STATUS_META[status] || STATUS_META.nuovo;
  // Il badge "Nuovo" si nasconde automaticamente dopo 7 giorni dalla creazione
  const isRecent = !semina.created_date || (Date.now() - new Date(semina.created_date).getTime()) / 86400000 < 7;
  const showStatusBadge = status !== 'nuovo' || isRecent;
  const displayAge = semina.eta > 0 ? semina.eta : (semina.ai_data?.eta || 0);
  const ai = semina.ai_data || {};
  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  const PlatformIcon = isTikTok ? Music2 : Instagram;
  const bannerGradient = isTikTok
    ? 'linear-gradient(135deg, #25f4ee, #fe2c55)'
    : 'linear-gradient(135deg, #ec4899, #ec489966)';

  const openProfile = (e) => {
    if (!profileUrl && !handleDisplay) return;
    e.stopPropagation();
    const url = profileUrl || (isTikTok ? `https://www.tiktok.com/@${handleDisplay}` : `https://instagram.com/${handleDisplay}`);
    webWindow.open(url, '_blank', 'noopener,noreferrer');
  };

  // ── Nota inline con auto-salvataggio su blur + auto-espansione ──
  const [noteDraft, setNoteDraft] = useState(semina.notes || '');
  const [noteFocused, setNoteFocused] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const noteRef = useRef(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!noteFocused) setNoteDraft(semina.notes || '');
  }, [semina.notes, noteFocused]);

  // Auto-resize: espande il textarea per mostrare sempre tutto il contenuto
  useEffect(() => {
    if (noteRef.current) {
      noteRef.current.style.height = 'auto';
      noteRef.current.style.height = Math.max(36, noteRef.current.scrollHeight) + 'px';
    }
  }, [noteDraft, noteFocused]);

  const saveNote = async () => {
    if (savingRef.current) return;
    const trimmed = noteDraft.trim();
    if (trimmed === (semina.notes || '').trim()) return;
    savingRef.current = true;
    setNoteSaving(true);
    try {
      await base44.entities.Semina.update(semina.id, { notes: trimmed || undefined });
      qc.invalidateQueries({ queryKey: ['semine'] });
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 1500);
    } catch (err) {
      console.error('Save note failed:', err);
    } finally {
      savingRef.current = false;
      setNoteSaving(false);
    }
  };

  // ── Fallback immagini ──
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [semina.photo_url]);

  // ── Compact: mini-card per il tab Inviti ──
  if (compact) {
    return (
      <Div
        {...(dragHandleProps || {})}
        className={`shrink-0 w-[140px] flex flex-col rounded-lg border border-pink-500/20 bg-card overflow-hidden ${isDragging ? 'opacity-60 ring-2 ring-pink-500' : ''} ${isOff ? 'opacity-40 grayscale' : ''}`}
        style={{ boxShadow: '0 2px 12px -4px rgba(236,72,153,0.12)' }}>
        <Btn className="relative h-12 shrink-0 cursor-pointer" style={{ background: bannerGradient }} onClick={openProfile}>
          {planInfo && (
            <Div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-card border border-pink-500/40 shadow-md whitespace-nowrap">
              <CalendarDays className="w-2 h-2 text-pink-400 shrink-0" />
              <Span className="text-[8px] font-semibold text-foreground">{planDateLabel}</Span>
              {planVenueLogo && <CachedImage src={planVenueLogo} alt="" className="w-2.5 h-2.5 rounded-sm object-contain shrink-0" />}
            </Div>
          )}
          <Div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 30% 20%, white, transparent 60%)' }} />
          <Span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/30 text-white backdrop-blur-sm">
            {isTikTok ? 'TT' : 'IG'}
          </Span>
          {isOff && (
            <Span className="absolute top-1 right-1 inline-flex items-center gap-0.5 text-[8px] font-bold px-1 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400">
              <Power className="w-2 h-2" />OFF
            </Span>
          )}
          <Div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
            <Div className="w-10 h-10 rounded-full bg-card ring-2 ring-pink-500/30 overflow-hidden flex items-center justify-center">
              {semina.photo_url && !imgError
                ? <CachedImage src={semina.photo_url} alt={displayName} className="w-full h-full object-cover" decoding="sync" onError={() => setImgError(true)} />
                : <Span className="text-xs font-bold text-pink-300">{initials(displayName)}</Span>}
            </Div>
          </Div>
        </Btn>
        <Div className="px-2 pt-6 pb-2 flex flex-col gap-1">
          <P className="text-[11px] font-semibold truncate text-center leading-tight">{displayName}</P>
          {handleDisplay && (
            <A
              href={profileUrl || (isTikTok ? `https://www.tiktok.com/@${handleDisplay}` : `https://instagram.com/${handleDisplay}`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-[9px] text-pink-400 hover:text-pink-300 truncate text-center leading-tight"
            >
              @{handleDisplay}
            </A>
          )}
          <Div className="flex items-center justify-center gap-1 pt-0.5">
            {showStatusBadge && (
              <Span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full border ${statusMeta.cls}`}>
                {statusMeta.label}
              </Span>
            )}
            {createdDate && (
              <Span className="inline-flex items-center gap-0.5 text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                <CalendarDays className="w-2 h-2 shrink-0" />{createdDate}
              </Span>
            )}
          </Div>
          {semina.notes && (
            <Div className="flex items-center gap-1 mt-0.5 px-1.5 py-1 rounded bg-amber-500/10">
              <StickyNote className="w-2.5 h-2.5 text-amber-400 shrink-0" />
              <P className="text-[9px] text-amber-100/80 truncate leading-tight">{semina.notes}</P>
            </Div>
          )}
        </Div>
      </Div>
    );
  }

  // ── Full card: tab Semina ──
  return (
    <Div
      {...(dragHandleProps || {})}
      className={`shrink-0 w-[180px] sm:w-full semina-flip-container ${isDragging ? 'opacity-60 ring-2 ring-pink-500' : ''} ${isOff ? 'opacity-40 grayscale' : ''}`}>
      <Div
        ref={flip.innerRef}
        className="semina-flip-inner"
        style={{
          transform: `rotateY(${flip.rotation}deg)`,
          transition: flip.transition ? `transform 400ms cubic-bezier(0.22,1,0.36,1)` : 'none',
        }}
        onPointerMove={flip.onPointerMove}
        onPointerUp={flip.onPointerUp}
        onPointerCancel={flip.onPointerCancel}>
        <Div className={`semina-flip-front flex flex-col rounded-xl border border-pink-500/20 bg-card overflow-hidden ${highlightFlash ? 'client-highlight-flash' : ''}`} style={{ boxShadow: '0 4px 18px -6px rgba(236,72,153,0.15)', pointerEvents: flipped ? 'none' : 'auto' }}>
      {/* Banner — cliccabile per aprire il profilo IG/TikTok */}
      <Btn className="relative h-20 shrink-0 cursor-pointer" style={{ background: bannerGradient }} onClick={openProfile}>
        {planInfo && (
<Div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(50%-18px)] z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-card border border-pink-500/40 shadow-md whitespace-nowrap">
            <CalendarDays className="w-3 h-3 text-pink-400 shrink-0" />
            <Span className="text-[9px] font-semibold text-foreground">{planDateLabel}</Span>
            {planVenueLogo && <CachedImage src={planVenueLogo} alt="" className="w-3 h-3 rounded-sm object-contain shrink-0" />}
          </Div>
        )}
        <Div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 30% 20%, white, transparent 60%)' }} />
        <Span className="absolute top-1.5 left-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-black/50 text-white">
          <PlatformIcon className="w-3 h-3" />{isTikTok ? 'TikTok' : 'IG'}
        </Span>
        {isOff && (
          <Span className="absolute top-1.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-zinc-900/90 text-zinc-400">
            <Power className="w-2.5 h-2.5" />SPENTA
          </Span>
        )}
        <Btn
          button
          onClick={(e) => { e.stopPropagation(); setFlipped(true); }}
          className="absolute top-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/60 text-white hover:bg-violet-500/80 transition-colors"
          accessibilityLabel="Gira la card">
          <Span className="text-[10px] font-semibold leading-none">Gira</Span>
          <ArrowRight className="w-3 h-3" />
        </Btn>
        <Div className="absolute -bottom-7 left-1/2 -translate-x-1/2">
          <Div className="w-14 h-14 rounded-full bg-card ring-4 ring-pink-500/20 overflow-hidden flex items-center justify-center">
            {semina.photo_url && !imgError
              ? <CachedImage src={semina.photo_url} alt={displayName} className="w-full h-full object-cover" decoding="sync" onError={() => setImgError(true)} />
              : <Span className="text-base font-bold text-pink-300">{initials(displayName)}</Span>}
          </Div>
        </Div>
      </Btn>

      {/* Body */}
      <Div className="px-3 pt-9 pb-2 flex flex-col gap-1.5">
        <Div className="text-center">
          <P className="text-sm font-semibold truncate leading-tight">{displayName}</P>
          {handleDisplay && (
            <A
              href={profileUrl || (isTikTok ? `https://www.tiktok.com/@${handleDisplay}` : `https://instagram.com/${handleDisplay}`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center justify-center gap-1 text-[11px] text-pink-400 hover:text-pink-300 truncate leading-tight"
            >
              <PlatformIcon className="w-3 h-3 shrink-0" />@{handleDisplay}
            </A>
          )}
        </Div>

        {/* Chip meta: status + data */}
        <Div className="flex items-center justify-center gap-1 flex-wrap">
          {showStatusBadge && (
            <Span className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${statusMeta.cls}`}>
              {statusMeta.label}
            </Span>
          )}
          {createdDate && (
            <Span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
              <CalendarDays className="w-3 h-3 shrink-0" />{createdDate}
            </Span>
          )}
        </Div>

        {/* Info chips AI (stile pill con icona in contenitore colorato) */}
        {(displayAge > 0 || semina.provenienza || ai.zona || ai.usual_promoter || ai.work?.role || ai.study?.school || ai.venues_attended?.length > 0 || ai.invited_events?.length > 0 || ai.is_driver) && (
          <Div className="flex flex-col gap-1">
            {displayAge > 0 && (
              <Div className="flex w-full items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary/50">
                <Div className="flex items-center justify-center p-0.5 rounded shrink-0" style={{ background: '#60a5fa1a' }}>
                  <CalendarDays className="w-2.5 h-2.5" style={{ color: '#60a5fa' }} />
                </Div>
                <Span className="text-[10px] text-foreground">{displayAge} anni</Span>
              </Div>
            )}
            {(semina.provenienza || ai.zona) && (
              <Div className="flex w-full items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary/50 max-w-full">
                <Div className="flex items-center justify-center p-0.5 rounded shrink-0" style={{ background: '#34d3991a' }}>
                  <MapPin className="w-2.5 h-2.5" style={{ color: '#34d399' }} />
                </Div>
                <Span className="text-[10px] text-foreground break-words">{capitalize(semina.provenienza || ai.zona)}</Span>
              </Div>
            )}
            {ai.usual_promoter && (
              <Div className="flex w-full items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary/50 max-w-full">
                <Div className="flex items-center justify-center p-0.5 rounded shrink-0" style={{ background: '#fbbf241a' }}>
                  <User className="w-2.5 h-2.5" style={{ color: '#fbbf24' }} />
                </Div>
                <Span className="text-[10px] text-foreground break-words"><Span className="text-foreground/60">Entra con </Span>{capitalize(ai.usual_promoter)}</Span>
              </Div>
            )}
            {ai.work?.role && (
              <Div className="flex w-full items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary/50 max-w-full">
                <Div className="flex items-center justify-center p-0.5 rounded shrink-0" style={{ background: '#22d3ee1a' }}>
                  <Briefcase className="w-2.5 h-2.5" style={{ color: '#22d3ee' }} />
                </Div>
                <Span className="text-[10px] text-foreground break-words">{capitalize(ai.work.role)}</Span>
              </Div>
            )}
            {ai.study?.school && (
              <Div className="flex w-full items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary/50 max-w-full">
                <Div className="flex items-center justify-center p-0.5 rounded shrink-0" style={{ background: '#818cf81a' }}>
                  <GraduationCap className="w-2.5 h-2.5" style={{ color: '#818cf8' }} />
                </Div>
                <Span className="text-[10px] text-foreground break-words">{capitalize(ai.study.school)}</Span>
              </Div>
            )}
            {ai.venues_attended?.length > 0 && (
              <Div className="flex w-full items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary/50 max-w-full">
                <Div className="flex items-center justify-center p-0.5 rounded shrink-0" style={{ background: '#f472b61a' }}>
                  <Music2 className="w-2.5 h-2.5" style={{ color: '#f472b6' }} />
                </Div>
                <Span className="text-[10px] text-foreground break-words"><Span className="text-foreground/60">Frequenta </Span>{ai.venues_attended.map(capitalize).join(', ')}</Span>
              </Div>
            )}
            {ai.invited_events?.length > 0 && (
              <Div className="flex w-full items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary/50 max-w-full">
                <Div className="flex items-center justify-center p-0.5 rounded shrink-0" style={{ background: '#a78bfa1a' }}>
                  <Sparkles className="w-2.5 h-2.5" style={{ color: '#a78bfa' }} />
                </Div>
                <Span className="text-[10px] text-foreground break-words"><Span className="text-foreground/60">Invitata al </Span>{ai.invited_events.map(capitalize).join(', ')}</Span>
              </Div>
            )}
            {ai.is_driver && (
              <Div className="flex w-full items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary/50 max-w-full">
                <Div className="flex items-center justify-center p-0.5 rounded shrink-0" style={{ background: '#f973161a' }}>
                  <Car className="w-2.5 h-2.5" style={{ color: '#f97316' }} />
                </Div>
                <Span className="text-[10px] text-foreground break-words"><Span className="text-foreground/60">Guidatrice</Span></Span>
              </Div>
            )}
          </Div>
        )}

        {/* Nota modificabile inline con auto-espansione + auto-salvataggio su blur */}
        <Btn
          onClick={e => e.stopPropagation()}
          className={`relative flex gap-1.5 px-2 py-1.5 rounded-lg border transition-colors ${
            noteFocused ? 'bg-amber-500/10 border-amber-500/40' : 'bg-amber-500/5 border-amber-500/20'
          }`}
        >
          <StickyNote className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${noteFocused ? 'text-amber-300' : 'text-amber-400/70'}`} />
          <HtmlTextarea
            ref={noteRef}
            value={noteDraft}
            onChange={e => setNoteDraft(e.target.value)}
            onFocus={() => setNoteFocused(true)}
            onBlur={() => { setNoteFocused(false); saveNote(); }}
            onClick={e => e.stopPropagation()}
            placeholder="Aggiungi una nota…"
            className="flex-1 min-w-0 bg-transparent border-0 p-0 semina-note-textarea text-amber-100/90 placeholder:text-amber-100/30 focus:outline-none focus:ring-0 resize-none leading-snug overflow-hidden"
            style={{ minHeight: '36px' }}
          />
          {noteSaving && (
            <Loader2 className="absolute top-1.5 right-1.5 w-3 h-3 animate-spin text-amber-400/60" />
          )}
          {noteSaved && !noteSaving && (
            <Check className="absolute top-1.5 right-1.5 w-3 h-3 text-green-400" />
          )}
        </Btn>

        {/* Slider recettività */}
        <SeminaRecettivitaSlider semina={semina} promoterId={semina.promoter_id} />
      </Div>

      {/* Azioni */}
      <Btn className="px-3 pb-2.5 mt-auto flex gap-2" onClick={e => e.stopPropagation()}>
        {onEdit && (
          <Btn
            button
            onClick={(e) => { e.stopPropagation(); onEdit(semina); }}
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground bg-secondary/40 border border-border hover:bg-secondary transition-colors"
            accessibilityLabel="Modifica">
            <Pencil className="w-3 h-3" />
          </Btn>
        )}
        {chatConvId && (
          <Btn
            button
            onClick={() => navigate(`/messaggi?semina_id=${semina.id}`)}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium text-violet-400 bg-violet-400/5 border border-violet-400/20 hover:bg-violet-400/15 transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />Chat
          </Btn>
        )}
        <Btn
          button
          onClick={() => onDelete?.(semina.id)}
          className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium text-red-400 bg-red-400/5 border border-red-400/20 hover:bg-red-400/15 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />Rimuovi
        </Btn>
      </Btn>
        </Div>
        {/* Back — AI data from chats */}
        {/* Retro: la faccia NON visibile non deve ricevere tocchi. Su iOS/WebKit una faccia con
            backface-visibility:hidden riceve comunque l'hit-test (le due facce sono complanari) e il
            suo contenitore overflow-y-auto "ruba" lo scroll al tocco: la pagina non parte, lo scroll
            avviene dentro la faccia nascosta, e riparte solo al tocco successivo. */}
        <Div className="semina-flip-back rounded-xl border border-violet-500/20 bg-card overflow-hidden relative" style={{ boxShadow: '0 4px 18px -6px rgba(139,92,246,0.15)', pointerEvents: flipped ? 'auto' : 'none' }}>
          <SeminaCardBack semina={semina} onClose={() => setFlipped(false)} />
        </Div>
      </Div>
    </Div>
  );
}