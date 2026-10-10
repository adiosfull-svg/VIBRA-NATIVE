// Port di src/components/ilmiovibra/PromoterRecordCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef, useCallback } from 'react';
import { motion } from '@/ui/motion';
import { Share2, Calendar, Users, Euro, Crown, Trophy, Flame, TrendingUp, Layers, Swords } from '@/ui/icons.generated';
import CachedImage from '@/web/components/shared/CachedImage';
import { useVibraLogo } from '@/web/hooks/useVibraLogo';
import { useToast } from '@/ui/use-toast';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import PromoterRecordShareCard from './PromoterRecordShareCard';

import { doc as webDocument, nav as webNavigator, url as webURL, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, H, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

const fmtEuro = (v) => `€${Number(v || 0).toLocaleString('it-IT')}`;

function StatTile({ icon: Icon, label, value, sub, accent }) {
  return (
    <Div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"
      style={{ boxShadow: `0 4px 16px -8px ${accent}40` }}>
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <Div className="flex items-center gap-1.5 mb-1.5">
        <Div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accent}1a` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
        </Div>
        <Span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground truncate">{label}</Span>
      </Div>
      <P className="text-lg font-black leading-none" style={{ color: accent }}>{value}</P>
      {sub && <P className="text-[9px] text-muted-foreground mt-1 truncate">{sub}</P>}
    </Div>
  );
}

function StreakRow({ icon: Icon, label, current, record, accent, showInProgress }) {
  const pct = record > 0 ? Math.min(100, Math.round((current / record) * 100)) : (current > 0 ? 100 : 0);
  const isLive = current > 0 && current === record && record > 0;
  const inProgress = showInProgress && current > 0 && current < record;
  return (
    <Div className="space-y-1.5">
      <Div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
        <Span className="text-[11px] font-semibold truncate">{label}</Span>
        {isLive && (
          <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-[8px] font-black text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded shrink-0">
            RECORD!
          </motion.span>
        )}
        {inProgress && (
          <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-[8px] font-black text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded shrink-0 flex items-center gap-0.5">
            <Flame className="w-2.5 h-2.5" /> IN CORSO
          </motion.span>
        )}
      </Div>
      <Div className="flex items-baseline gap-2">
        <Span className="text-2xl font-black leading-none" style={{ color: accent }}>{record}</Span>
        <Span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">record</Span>
        <Span className="text-[11px] font-semibold text-muted-foreground ml-auto">
          {current} <Span className="font-normal">attuali</Span>
        </Span>
      </Div>
      <Div className="relative w-full h-2.5 bg-secondary/40 rounded-full overflow-hidden border border-white/[0.04]">
        <Div className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(90deg, ${accent}10, transparent)` }} />
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${accent}cc, ${accent}66)`, boxShadow: `0 0 10px ${accent}80` }}
        />
      </Div>
    </Div>
  );
}

export default function PromoterRecordCard({ promoter, records, rank }) {
  const { logoDataUrl: vibraLogo } = useVibraLogo();
  const { toast } = useToast();
  const [sharing, setSharing] = useState(false);
  const shareCardRef = useRef(null);
  const longPressTimer = useRef(null);

  const accent = rank?.color || '#a78bfa';
  const initials = (promoter?.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const photoUrl = promoter?.photo_url || '';

  const triggerShare = useCallback(async () => {
    if (sharing) return;
    setSharing(true);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    if (!shareCardRef.current) { setSharing(false); return; }
    try {
      const imgs = [...(shareCardRef.current.querySelectorAll('img') || [])];
      await Promise.all(imgs.map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise(res => {
          img.addEventListener('load', res, { once: true });
          img.addEventListener('error', res, { once: true });
          setTimeout(res, 2500);
        });
      }));
      await new Promise(r => setTimeout(r, 100));

      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: null, scale: 3, useCORS: true, logging: false,
      });
      const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
      if (!blob) throw new Error('capture failed');

      const fileName = `${(promoter?.name || 'promoter').replace(/[^a-zA-Z0-9]/g, '_')}_record.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (webNavigator.canShare && webNavigator.canShare({ files: [file] })) {
        await webNavigator.share({ files: [file], title: promoter?.name || 'Promoter', text: `I record di ${promoter?.name}` });
      } else {
        let copied = false;
        try {
          await webNavigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          copied = true;
        } catch {
          const url = webURL.createObjectURL(blob);
          const a = webDocument.createElement('a');
          a.href = url; a.download = fileName; a.click();
          webURL.revokeObjectURL(url);
        }
        toast({ title: copied ? 'Scheda copiata negli appunti' : 'Scheda scaricata', description: copied ? 'Incollala dove vuoi (Ctrl+V)' : undefined });
      }
    } catch (e) {
      if (e?.name !== 'AbortError') {
        try { if (webNavigator.share) await webNavigator.share({ title: promoter?.name || 'Promoter', text: `I record di ${promoter?.name}` }); } catch {}
      }
    } finally {
      setSharing(false);
    }
  }, [sharing, promoter, toast]);

  // Long-press (touch) + context menu (desktop) → share, come le card clienti/semine.
  const startLongPress = (e) => {
    const startX = e.clientX, startY = e.clientY;
    longPressTimer.current = setTimeout(() => triggerShare(), 500);
    const move = (ev) => {
      if (Math.abs(ev.clientX - startX) > 10 || Math.abs(ev.clientY - startY) > 10) {
        clearTimeout(longPressTimer.current);
        cleanup();
      }
    };
    const up = () => { clearTimeout(longPressTimer.current); cleanup(); };
    const cleanup = () => {
      webWindow.removeEventListener('pointermove', move);
      webWindow.removeEventListener('pointerup', up);
      webWindow.removeEventListener('pointercancel', up);
    };
    webWindow.addEventListener('pointermove', move);
    webWindow.addEventListener('pointerup', up);
    webWindow.addEventListener('pointercancel', up);
  };
  const onContextMenu = (e) => { e.preventDefault(); triggerShare(); };

  const topEventDate = records?.topEvent?.date
    ? format(parseISO(records.topEvent.date), 'd MMM yy', { locale: it })
    : '';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        onContextMenu={onContextMenu}
        onPointerDown={startLongPress}
        className="relative overflow-hidden rounded-2xl border bg-card select-none"
        style={{ borderColor: `${accent}30`, boxShadow: `0 8px 40px -12px ${accent}55` }}
      >
        {/* Accent top line */}
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
        {/* Background radial glow */}
        <Div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% -20%, ${accent}, transparent 70%)` }} />
        {/* Decorative circles */}
        <Div className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: `${accent}0d` }} />
        <Div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: `${accent}0a` }} />

        <Div className="relative p-4 sm:p-5 space-y-4">
          {/* Share button (desktop discoverability) */}
          <Btn
            button
            onClick={(e) => { e.stopPropagation(); triggerShare(); }}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-lg border bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            style={{ borderColor: `${accent}30` }}
            accessibilityLabel="Condividi scheda record">
            <Share2 className="w-3.5 h-3.5" style={{ color: accent }} />
          </Btn>

          {/* Header: avatar + name + rank */}
          <Div className="flex items-center gap-3.5 pr-9">
            <motion.div
              animate={{ boxShadow: [`0 4px 20px -4px ${accent}66`, `0 8px 28px -4px ${accent}88`, `0 4px 20px -4px ${accent}66`] }}
              transition={{ repeat: Infinity, duration: 2.6, repeatDelay: 1.2, ease: 'easeInOut' }}
              className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center shrink-0 border overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
                borderColor: `${accent}55`,
              }}
            >
              <Span className="text-2xl font-black" style={{ color: accent }}>{initials}</Span>
              {photoUrl && (
                <CachedImage src={photoUrl} alt={promoter?.name} className="absolute inset-0 w-full h-full object-cover" />
              )}
            </motion.div>

            <Div className="flex-1 min-w-0">
              <P className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">La tua Card Record</P>
              <H className="text-xl font-black leading-none truncate">{promoter?.name || 'Promoter'}</H>
              <Div className="flex items-center gap-2 mt-2 flex-wrap">
                {rank && (
                  <Div className="flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-bold"
                    style={{ borderColor: `${accent}40`, color: accent, background: `${accent}12` }}>
                    <Span className="text-sm leading-none">{rank.emoji}</Span>
                    {rank.label}
                  </Div>
                )}
                {rank && (
                  <Span className="text-[10px] font-semibold text-muted-foreground">
                    {rank.prPoints.toLocaleString('it-IT')} PR
                  </Span>
                )}
              </Div>
            </Div>
          </Div>

          {/* Promoter dal badge */}
          {records?.promoterSinceLabel && (
            <Div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" style={{ color: accent }} />
              <Span>Promoter da <Span className="font-semibold text-foreground">{records.promoterSinceLabel}</Span></Span>
              {records.achievementsTotal > 0 && (
                <Span className="ml-auto flex items-center gap-1">
                  <Trophy className="w-3 h-3" style={{ color: accent }} />
                  <Span className="font-semibold" style={{ color: accent }}>{records.achievementsUnlocked}</Span>
                  <Span className="text-muted-foreground">/ {records.achievementsTotal} ach</Span>
                </Span>
              )}
            </Div>
          )}

          {/* Stats grid 2x2 */}
          <Div className="grid grid-cols-2 gap-2.5">
            <StatTile icon={Euro} label="Fatturato Totale" value={fmtEuro(records?.totalRevenue)} accent="#a78bfa" />
            <StatTile
              icon={Crown}
              label="Top Serata"
              value={records?.topEvent ? fmtEuro(records.topEvent.revenue) : '—'}
              sub={records?.topEvent ? records.topEvent.name : undefined}
              accent="#fbbf24"
            />
            <StatTile icon={Users} label="Clienti" value={records?.totalClients ?? 0} accent="#34d399" />
            <StatTile icon={Layers} label="Tavoli Totali" value={(records?.totalTables ?? 0).toFixed(0)} accent="#60a5fa" />
          </Div>

          {/* Vibra VS wins banner */}
          <Div className="relative overflow-hidden rounded-xl border p-3"
            style={{ borderColor: `${accent}30`, background: `linear-gradient(135deg, ${accent}14, ${accent}06)` }}>
            <Div className="flex items-center gap-3">
              <Div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${accent}1a` }}>
                <Swords className="w-5 h-5" style={{ color: accent }} />
              </Div>
              <Div className="min-w-0">
                <P className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Vibra VS — Vittorie settimanali</P>
                <P className="text-2xl font-black leading-none mt-0.5" style={{ color: accent }}>
                  {records?.vibraVsWins ?? 0}
                  <Span className="text-xs font-semibold text-muted-foreground ml-1.5">{(records?.vibraVsWins ?? 0) === 1 ? 'vittoria' : 'vittorie'}</Span>
                </P>
              </Div>
            </Div>
          </Div>

          {/* Streaks */}
          <Div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-3">
            <P className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Streak Record
            </P>
            <StreakRow icon={Layers} label="Tavoli consecutivi" current={records?.tablesStreakCurrent ?? 0} record={records?.tablesStreakRecord ?? 0} accent="#60a5fa" />
            <StreakRow icon={TrendingUp} label="Serate con fatturato" current={records?.revenueStreakCurrent ?? 0} record={records?.revenueStreakRecord ?? 0} accent="#a78bfa" />
            <StreakRow icon={Swords} label="Vibra VS vinti di fila" current={records?.vibraVsStreakCurrent ?? 0} record={records?.vibraVsStreakRecord ?? 0} accent={accent} showInProgress />
          </Div>

          {/* Footer */}
          <Div className="flex items-center justify-between pt-1">
            <Span className="text-[10px] text-muted-foreground">{format(new Date(), 'd MMM yyyy', { locale: it })}</Span>
            {vibraLogo && (
              <Img src={vibraLogo} alt="Vibra" className="h-7 object-contain opacity-80" />
            )}
          </Div>
        </Div>
      </motion.div>

      {/* Scheda nascosta per la condivisione (html2canvas) — montata solo durante lo share */}
      {sharing && (
        <Div style={{ position: 'fixed', left: -9999, top: 0, pointerEvents: 'none' }}>
          <PromoterRecordShareCard promoter={promoter} records={records} rank={rank} cardRef={shareCardRef} />
        </Div>
      )}
    </>
  );
}