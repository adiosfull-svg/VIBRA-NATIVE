// Port di src/components/ilmiovibra/RankCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import { motion, AnimatePresence } from '@/ui/motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { Star } from '@/ui/icons.generated';
import { computeAutoUnlocked } from '@/legacy/utils/achievementLogic';
import { computePRPoints, getRankInfo, getDynamicRankTiers, RANK_TIERS } from '@/legacy/utils/rankSystem';

import { doc as webDocument } from '@/web/shims/dom';
import { Div, H, P, Span } from '@/ui/html';

// Indici rank per confronto (esclude goat)
const RANK_TIER_KEYS = RANK_TIERS.filter(r => r.key !== 'goat').map(r => r.key);
function rankIndex(key) {
  const i = RANK_TIER_KEYS.indexOf(key);
  return i === -1 ? 999 : i;
}

// ── Roadmap scrollabile ────────────────────────────────────────────────────
function RankRoadmap({ current, next, prPoints, rankHistory, tiers }) {
  const RANK_TIERS_LOCAL = tiers || RANK_TIERS;
  const scrollRef = useRef(null);
  // PORT: querySelector('[data-current]') non esiste in RN: ref sull'elemento del rank attuale
  const currentRef = useRef(null);
  const [tooltip, setTooltip] = useState(null); // { rankKey, label, date, x, y }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const t = setTimeout(() => {
      const currentEl = currentRef.current;
      if (currentEl) {
        const containerCenter = el.offsetWidth / 2;
        const itemCenter = currentEl.offsetLeft + currentEl.offsetWidth / 2;
        el.scrollLeft = itemCenter - containerCenter;
      }
    }, 80);
    return () => clearTimeout(t);
  }, [current.key]);

  // Mobile: mostra tutti i rank (non nascondere nulla)

  return (
    <Div className="space-y-2">
      <P className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Strada verso la vetta</P>
      <Div ref={scrollRef} className="flex gap-1.5 overflow-x-auto pb-1">
        {RANK_TIERS_LOCAL.map((rank) => {
          const isGoatItem = rank.key === 'goat';
          const isCurrent = rank.key === current.key;
          const isPast = !isGoatItem && prPoints >= rank.minPR;
          const isNext = next && rank.key === next.key;
          const isMobileHidden = false;
          const isUnlocked = isPast || isCurrent || isGoatItem;

          // Data sblocco: per il rank corrente usa updated_date/created_date del record PromoterRank
          const historyEntry = rankHistory?.find(r => r.rank_key === rank.key);
          const rawDate = historyEntry?.updated_date || historyEntry?.created_date;
          const unlockDate = rawDate
            ? new Date(rawDate).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
            : null;

          return (
            <Div
              key={rank.key}
              ref={isCurrent ? currentRef : undefined}
              className={`shrink-0 rounded-xl px-2 py-1.5 flex flex-col items-center gap-0.5 border transition-all ${isMobileHidden ? 'hidden sm:flex' : 'flex'}`}
              style={{
                borderColor: isCurrent ? `${rank.color}60` : isNext ? `${rank.color}40` : `${rank.color}20`,
                background: isCurrent ? `${rank.color}15` : 'transparent',
                minWidth: 46,
                opacity: isCurrent ? 1 : isPast ? 0.7 : isNext ? 0.85 : 0.3,
                cursor: isUnlocked ? 'default' : 'default',
                position: 'relative',
              }}
              onMouseEnter={isUnlocked ? e => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({ rankKey: rank.key, label: rank.label, emoji: rank.emoji, date: unlockDate, x: rect.left + rect.width / 2, y: rect.top });
              } : undefined}
              onMouseLeave={isUnlocked ? () => setTooltip(null) : undefined}>
              <motion.span
                className="text-lg leading-none"
                animate={isCurrent ? { scale: [1, 1.12, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                {isGoatItem ? '👑' : (isPast || isCurrent) ? rank.emoji : '🔒'}
              </motion.span>
              <P className="text-[8px] font-bold leading-none text-center whitespace-pre-line"
                style={{ color: isCurrent ? rank.color : undefined }}>
                {isGoatItem ? 'G.O.A.T' : rank.label.replace(' ', '\n')}
              </P>
            </Div>
          );
        })}
      </Div>

      {/* Tooltip hover rank sbloccati — via portal per evitare il containing block creato dai transform di framer-motion sugli antenati */}
      {createPortal(
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="fixed z-50 pointer-events-none rounded-xl border border-white/10 bg-[hsl(240_6%_8%)] shadow-2xl px-3 py-2 text-xs"
              style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, calc(-100% - 8px))' }}
            >
              <P className="font-bold text-foreground flex items-center gap-1">{tooltip.emoji} {tooltip.label}</P>
              {tooltip.date
                ? <P className="text-muted-foreground mt-0.5">📅 Sbloccato il {tooltip.date}</P>
                : <P className="text-muted-foreground mt-0.5">📅 Data non disponibile</P>
              }
            </motion.div>
          )}
        </AnimatePresence>,
        webDocument.body
      )}
    </Div>
  );
}

// ── RankCard principale ────────────────────────────────────────────────────
export default function RankCard({ promoter, stats, isActive = true }) {
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.filter({ is_active: true }),
    enabled: isActive,
    staleTime: 10 * 60000,
    refetchOnWindowFocus: false,
  });

  // Storico rank per tooltip hover sulla roadmap
  const { data: rankHistory = [] } = useQuery({
    queryKey: ['promoter-rank-history', promoter?.id],
    queryFn: () => base44.entities.PromoterRank.filter({ promoter_id: promoter.id }),
    enabled: isActive && !!promoter?.id,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const autoUnlocked = useMemo(() => computeAutoUnlocked(achievements, stats), [achievements, stats]);
  const prPoints = useMemo(() => computePRPoints(achievements, autoUnlocked, stats), [achievements, autoUnlocked, stats]);
  const isGoat = achievements.length > 0 && autoUnlocked.size === achievements.length;
  const dynamicTiers = useMemo(() => getDynamicRankTiers(achievements), [achievements]);
  const { current, next, progress, prToNext } = useMemo(() => getRankInfo(prPoints, isGoat, dynamicTiers), [prPoints, isGoat, dynamicTiers]);

  if (achievements.length === 0 || !current) return null;

  const unlockedCount = autoUnlocked.size;
  const totalCount = achievements.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-card"
      style={{
        boxShadow: `0 8px 40px -12px ${current.glow}`,
        borderColor: `${current.color}30`,
      }}
    >
      {/* Accent top line */}
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${current.color}, transparent)` }} />

      {/* Background glow */}
      <Div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% -20%, ${current.color}, transparent 70%)` }} />

      <Div className="relative p-5 space-y-5">
        {/* Header */}
        <Div className="flex items-center gap-4">
          {/* Rank badge */}
          <motion.div
            animate={isGoat
              ? { rotate: [0, 5, -5, 5, 0] }
              : { scale: [1, 1.06, 1], boxShadow: [`0 4px 20px -4px ${current.glow}`, `0 8px 32px -4px ${current.glow}`, `0 4px 20px -4px ${current.glow}`] }
            }
            transition={{ repeat: Infinity, duration: isGoat ? 3 : 2.5, repeatDelay: isGoat ? 2 : 1, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 border"
            style={{
              background: `linear-gradient(135deg, ${current.color}20, ${current.color}08)`,
              borderColor: `${current.color}50`,
              boxShadow: `0 4px 20px -4px ${current.glow}`,
            }}
          >
            <Span className="text-4xl">{current.emoji}</Span>
            {isGoat && (
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-[9px] font-black tracking-widest mt-0.5"
                style={{ color: current.color }}
              >
                GOAT
              </motion.span>
            )}
          </motion.div>

          <Div className="flex-1 min-w-0">
            <P className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">Il Tuo Rank</P>
            <H className="text-2xl font-black leading-none" style={{ color: current.color }}>
              {current.label}
            </H>
            <Div className="flex items-center gap-2 mt-2">
              <Div className="flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold"
                style={{ borderColor: `${current.color}40`, color: current.color, background: `${current.color}12` }}>
                <Star className="w-3 h-3" />
                {Math.round(prPoints).toLocaleString('it-IT')} PR points
              </Div>
              <Span className="text-[11px] text-muted-foreground">{unlockedCount}/{totalCount} achievement</Span>
            </Div>
          </Div>
        </Div>

        {/* Progress bar verso il rank successivo */}
        {!isGoat && next && (
          <Div className="space-y-3">
            <Div className="flex items-center gap-3">
              {/* Rank corrente */}
              <Div className="flex flex-col items-center gap-1 shrink-0">
                <Div className="w-10 h-10 rounded-xl flex items-center justify-center border text-2xl"
                  style={{ borderColor: `${current.color}50`, background: `${current.color}15` }}>
                  {current.emoji}
                </Div>
                <P className="text-[9px] font-bold text-center leading-tight" style={{ color: current.color, maxWidth: 44 }}>
                  {current.label}
                </P>
              </Div>

              {/* Barra progresso */}
              <Div className="flex-1 space-y-1.5">
                <Div className="relative w-full h-5 bg-secondary/40 rounded-full overflow-hidden border border-white/[0.05]">
                  <Div className="absolute inset-0 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${current.color}08, transparent)` }} />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${current.color}cc, ${next.color}cc)`,
                      boxShadow: `0 0 12px ${current.color}80`,
                    }}
                  />
                  {/* Shimmer */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
                    className="absolute top-0 h-full w-1/3 rounded-full opacity-40"
                    style={{ background: `linear-gradient(90deg, transparent, ${current.color}60, transparent)` }}
                  />
                </Div>
                <Div className="flex justify-between text-[10px] text-muted-foreground">
                  <Span style={{ color: current.color }} className="font-semibold">{Math.round(prPoints).toLocaleString('it-IT')} PR</Span>
                  <Span style={{ color: next.color }} className="font-semibold">-{Math.round(prToNext).toLocaleString('it-IT')} al {next.label}</Span>
                </Div>
              </Div>

              {/* Rank successivo */}
              <Div className="flex flex-col items-center gap-1 shrink-0">
                <Div className="w-10 h-10 rounded-xl flex items-center justify-center border text-2xl opacity-60"
                  style={{ borderColor: `${next.color}40`, background: `${next.color}10` }}>
                  {next.emoji}
                </Div>
                <P className="text-[9px] font-bold text-center leading-tight opacity-60" style={{ color: next.color, maxWidth: 44 }}>
                  {next.label}
                </P>
              </Div>
            </Div>
          </Div>
        )}

        {/* GOAT state */}
        {isGoat && (
          <motion.div
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="rounded-xl border p-3 text-center"
            style={{ borderColor: `${current.color}40`, background: `${current.color}10` }}
          >
            <P className="text-sm font-black" style={{ color: current.color }}>👑 HAI SBLOCCATO TUTTI GLI ACHIEVEMENT! 👑</P>
            <P className="text-xs text-muted-foreground mt-0.5">Sei il G.O.A.T. del team. Leggendario.</P>
          </motion.div>
        )}

        {/* Roadmap rank scrollabile */}
        {!isGoat && <RankRoadmap current={current} next={next} prPoints={prPoints} rankHistory={rankHistory} tiers={dynamicTiers} />}
      </Div>
    </motion.div>
  );
}