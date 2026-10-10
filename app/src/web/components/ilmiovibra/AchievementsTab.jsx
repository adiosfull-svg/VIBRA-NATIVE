// Port di src/components/ilmiovibra/AchievementsTab.jsx (convertito da scripts/port/codemod.mjs).
import { STALE_FULL_TABLE, GC_FULL_TABLE } from '@/web/lib/query-client';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from '@/ui/motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { fetchAll } from '@/web/lib/safeData';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { Trophy, Lock, Search, X } from '@/ui/icons.generated';
import {
  computePromoterStats,
  computeAutoUnlocked,
  getFamilyProgress,
  RARITY_COLORS,
  RARITY_LABELS,
  RARITY_ORDER,
  CATEGORY_LABELS,
} from '@/legacy/utils/achievementLogic';
import { computePRPoints, getRankInfo, getDynamicRankTiers } from '@/legacy/utils/rankSystem';
import RankCard from './RankCard';
import AchievementProgressBar from './AchievementProgressBar';
import SectionHeader from '@/web/components/shared/SectionHeader';
import CachedImage from '@/web/components/shared/CachedImage';

import { doc as webDocument, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

// ─── Calcola data di sblocco stimata dallo storico ──────────────────────────
// Per ogni achievement, trova la data della "n-esima" attendance/client
// che ha portato il valore oltre la soglia.
function computeUnlockDates(achievements, promoter, clients, attendances, events) {
  const dates = {};
  if (!promoter) return dates;

  // Indice eventi per id (Map): la ricerca lineare dentro cicli e sort rendeva il
  // calcolo O(presenze × eventi × achievement), oltre 1s con ~3000 eventi/presenze.
  const eventsById = new Map();
  for (const e of events) eventsById.set(e.id, e);

  const myClients = clients.filter(c => c.promoter_id === promoter.id);
  const myAtts = attendances
    .filter(a => a.promoter_id === promoter.id && !a.client_id)
    .map(a => ({ a, d: eventsById.get(a.event_id)?.date || '' }))
    .sort((x, y) => x.d.localeCompare(y.d))
    .map(x => x.a);

  achievements.forEach(ach => {
    const target = ach.condition_value;
    let accumulated = 0;
    let unlockDate = null;

    // Statistiche basate su presenze
    if (['total_revenue', 'single_event_revenue', 'monthly_revenue'].includes(ach.condition_type)) {
      if (ach.condition_type === 'total_revenue') {
        for (const a of myAtts) {
          accumulated += (a.revenue || 0);
          if (accumulated >= target) {
            const ev = eventsById.get(a.event_id);
            unlockDate = ev?.date;
            break;
          }
        }
      } else if (ach.condition_type === 'single_event_revenue') {
        for (const a of myAtts) {
          if ((a.revenue || 0) >= target) {
            const ev = eventsById.get(a.event_id);
            unlockDate = ev?.date;
            break;
          }
        }
      } else if (ach.condition_type === 'monthly_revenue') {
        const monthMap = {};
        for (const a of myAtts) {
          const ev = eventsById.get(a.event_id);
          if (!ev?.date) continue;
          const mk = ev.date.slice(0, 7);
          monthMap[mk] = (monthMap[mk] || { total: 0, lastDate: ev.date });
          monthMap[mk].total += (a.revenue || 0);
          if (monthMap[mk].total > monthMap[mk].lastDate) monthMap[mk].lastDate = ev.date;
          if (monthMap[mk].total >= target && !unlockDate) {
            unlockDate = ev.date;
          }
        }
      }
    } else if (['total_tables', 'monthly_tables', 'single_event_tables'].includes(ach.condition_type)) {
      if (ach.condition_type === 'total_tables') {
        for (const a of myAtts) {
          const ev = eventsById.get(a.event_id);
          if (!ev?.date) continue;
          const thr = ev.table_threshold || 300;
          accumulated += Math.floor((a.revenue || 0) / thr);
          if (accumulated >= target) { unlockDate = ev.date; break; }
        }
      } else if (ach.condition_type === 'single_event_tables') {
        for (const a of myAtts) {
          const ev = eventsById.get(a.event_id);
          if (!ev?.date) continue;
          const thr = ev.table_threshold || 300;
          if (Math.floor((a.revenue || 0) / thr) >= target) { unlockDate = ev.date; break; }
        }
      }
    } else if (ach.condition_type === 'total_presences') {
      for (const a of myAtts) {
        if (a.present && (a.revenue || 0) > 0) {
          accumulated++;
          if (accumulated >= target) {
            const ev = eventsById.get(a.event_id);
            unlockDate = ev?.date;
            break;
          }
        }
      }
    } else if (ach.condition_type === 'total_clients') {
      const sorted = [...myClients].sort((a, b) => (a.created_date || '').localeCompare(b.created_date || ''));
      if (sorted.length >= target) {
        unlockDate = sorted[target - 1]?.created_date?.slice(0, 10);
      }
    } else if (ach.condition_type === 'leaders_count') {
      const leaders = myClients.filter(c => c.is_leader).sort((a, b) => (a.created_date || '').localeCompare(b.created_date || ''));
      if (leaders.length >= target) {
        unlockDate = leaders[target - 1]?.created_date?.slice(0, 10);
      }
    } else if (ach.condition_type === 'referrals_count') {
      const refs = myClients.filter(c => c.source_type === 'referred').sort((a, b) => (a.created_date || '').localeCompare(b.created_date || ''));
      if (refs.length >= target) {
        unlockDate = refs[target - 1]?.created_date?.slice(0, 10);
      }
    } else if (ach.condition_type === 'clients_with_instagram') {
      const insta = myClients.filter(c => c.instagram).sort((a, b) => (a.created_date || '').localeCompare(b.created_date || ''));
      if (insta.length >= target) {
        unlockDate = insta[target - 1]?.created_date?.slice(0, 10);
      }
    }
    // Per tipi complessi (vibra_vs, consecutive, ecc.) usiamo l'ultima data di attendance come proxy
    if (!unlockDate && ach.condition_type.startsWith('vibra_vs')) {
      if (myAtts.length > 0) unlockDate = eventsById.get(myAtts[myAtts.length - 1]?.event_id)?.date;
    }

    if (unlockDate) dates[ach.id] = unlockDate;
  });

  return dates;
}

// Mappa rarità → colore esadecimale per gli header stile Growth League
const RARITY_HEX = {
  bronzo:   '#fbbf24',
  argento:  '#cbd5e1',
  oro:      '#facc15',
  platino:  '#a78bfa',
  master:   '#22d3ee',
  leggenda: '#fb7185',
};

// ─── Determina ordine smart ──────────────────────────────────────────────────
function computeSmartOrder(achievements, autoUnlocked) {
  // Verifica se 95%+ di bronzo, argento e oro sono sbloccati
  const basicRarities = ['bronzo', 'argento', 'oro'];
  let basicTotal = 0, basicUnlocked = 0;
  achievements.forEach(a => {
    if (basicRarities.includes(a.rarity || 'bronzo')) {
      basicTotal++;
      if (autoUnlocked.has(a.id)) basicUnlocked++;
    }
  });
  const basicPct = basicTotal > 0 ? basicUnlocked / basicTotal : 0;
  // Se 95%+ dei base sono sbloccati → mostra da leggenda a bronzo (discendente)
  // Altrimenti → mostra da bronzo a leggenda (ascendente, per motivare)
  return basicPct >= 0.95 ? 'desc' : 'asc';
}

// ─── AchievementCard ─────────────────────────────────────────────────────────

function AchievementCard({ achievement, progress, isUnlocked, unlockDate, delay = 0 }) {
  const rarity = achievement.rarity || 'bronzo';
  const colors = RARITY_COLORS[rarity] || RARITY_COLORS.bronzo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`relative rounded-2xl border p-4 flex flex-col gap-3 transition-all ${
        isUnlocked
          ? `${colors.bg} ${colors.border} shadow-lg`
          : 'bg-secondary/10 border-border/40 opacity-55 grayscale'
      }`}
      style={isUnlocked ? { boxShadow: '0 4px 20px -6px rgba(0,0,0,0.4)' } : {}}
    >
      {/* Badge rarità + categoria */}
      <Div className="flex items-center justify-between">
        <Span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors.bg} ${colors.border} ${colors.text}`}>
          {RARITY_LABELS[rarity] || rarity}
        </Span>
        {achievement.category && (
          <Span className="text-[10px] text-muted-foreground">{CATEGORY_LABELS[achievement.category] || achievement.category}</Span>
        )}
      </Div>

      {/* Icona + titolo */}
      <Div className="flex items-center gap-3">
        <Div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border ${
          isUnlocked ? `${colors.bg} ${colors.border}` : 'bg-secondary/30 border-border/30'
        }`}>
          {isUnlocked ? (
            achievement.icon_url
              ? <CachedImage loading="lazy" src={achievement.icon_url} alt={achievement.title} className="w-10 h-10 object-contain" />
              : <Span>{achievement.icon_emoji || '🏆'}</Span>
          ) : (
            <Lock className="w-6 h-6 text-muted-foreground/40" />
          )}
        </Div>
        <Div className="flex-1 min-w-0">
          <P className={`font-bold text-sm leading-tight ${isUnlocked ? colors.text : 'text-muted-foreground'}`}>
            {achievement.title}
          </P>
          <P className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{achievement.description}</P>
        </Div>
      </Div>

      {/* Sbloccato + data */}
      {isUnlocked && (
        <Div className="flex items-center gap-2">
          <P className={`text-[10px] ${colors.text} opacity-80`}>✅ Sbloccato</P>
          {unlockDate && (
            <P className="text-[10px] text-muted-foreground">
              · {format(parseISO(unlockDate), 'd MMM yyyy', { locale: it })}
            </P>
          )}
        </Div>
      )}

      {/* Progress bar: sempre visibile, con checkpoint per ogni rango della famiglia */}
      <AchievementProgressBar {...progress} />
    </motion.div>
  );
}

// ─── Skeleton: stessa struttura del tab (rank card + progresso + ricerca + card) ──
function AchievementsSkeleton() {
  const block = 'rounded-2xl border border-white/[0.06] bg-card animate-pulse';
  return (
    <Div className="space-y-6">
      <Div className={`${block} p-5 space-y-5`}>
        <Div className="flex items-center gap-4">
          <Div className="w-20 h-20 rounded-2xl bg-secondary/40 shrink-0" />
          <Div className="flex-1 space-y-2">
            <Div className="h-2.5 w-20 rounded bg-secondary/40" />
            <Div className="h-6 w-36 rounded bg-secondary/40" />
            <Div className="h-6 w-44 rounded-lg bg-secondary/30" />
          </Div>
        </Div>
        <Div className="h-5 rounded-full bg-secondary/40" />
        <Div className="flex gap-1.5 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => <Div key={i} className="shrink-0 w-[46px] h-12 rounded-xl bg-secondary/30" />)}
        </Div>
      </Div>
      <Div className={`${block} p-5 space-y-3`}>
        <Div className="h-4 w-40 rounded bg-secondary/40" />
        <Div className="h-3 rounded-full bg-secondary/40" />
      </Div>
      <Div className="h-10 rounded-xl bg-card border border-border animate-pulse" />
      <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <Div key={i} className={`${block} h-36`} />)}
      </Div>
    </Div>
  );
}

// ─── Guard anti-duplicazione a livello modulo (sopravvive ai remount) ────────
// Chiave: promoter_id → Set di achievement_id già creati in questa sessione
const _sessionCreated = {};
// ─── Flag: sync PA già eseguito per questo promoter in questa sessione ────────
const _paCheckDone = {};

// ─── Guard rank-up in-sessione (evita doppio invio tra render ravvicinati) ───
// Chiave: promoter_id → rank_key già processato in questa sessione
const _rankUpProcessed = {};

const EMPTY_PROMOTERS = [];
const EMPTY_SET = new Set();

export default function AchievementsTab({ promoter, isActive, isVisible, promoters = EMPTY_PROMOTERS, highlightId, scrollTrigger }) {
  const [showOnlyLocked, setShowOnlyLocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: achievements = [], isFetched: achievementsFetched } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.filter({ is_active: true }),
    enabled: isActive,
    staleTime: 10 * 60000,
    refetchOnWindowFocus: false,
  });

  const { data: clients = [], isFetched: clientsFetched } = useQuery({
    queryKey: ['clients-all'], staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE,
    queryFn: () => fetchAll(base44.entities.Client, {}, { sort: '-created_date' }),
    enabled: isActive,
    refetchOnWindowFocus: false,
  });

  const { data: attendances = [], isFetched: attendancesFetched } = useQuery({
    queryKey: ['attendances-all'], staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE,
    queryFn: () => fetchAll(base44.entities.EventAttendance, {}, { sort: '-created_date' }),
    enabled: isActive,
    refetchOnWindowFocus: false,
  });

  const { data: events = [], isFetched: eventsFetched } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    enabled: isActive,
    staleTime: 5 * 60000,
    refetchOnWindowFocus: false,
  });

  // Il rank è calcolato lato client da questi 4 dataset + il promoter: finché non
  // sono TUTTI arrivati i PR points sono parziali e verrebbe mostrato per qualche
  // frazione di secondo un rank più basso (poi corretto). Fino ad allora non si
  // mostra/calcola nulla: skeleton, mai un valore sbagliato.
  const dataReady = !!promoter && achievementsFetched && clientsFetched && attendancesFetched && eventsFetched;

  // Nessun calcolo finché i 4 dataset non sono tutti arrivati: prima ogni arrivo
  // rilanciava stats/achievement/date di sblocco su dati parziali (lavoro buttato).
  const stats = useMemo(() => {
    if (!promoter || !dataReady) return {};
    return computePromoterStats(promoter, clients, attendances, events, promoters);
  }, [promoter, dataReady, clients, attendances, events, promoters]);

  const autoUnlocked = useMemo(
    () => (dataReady ? computeAutoUnlocked(achievements, stats) : EMPTY_SET),
    [dataReady, achievements, stats]
  );

  // ── Rank corrente calcolato ───────────────────────────────────────────────
  const prPoints = useMemo(() => computePRPoints(achievements, autoUnlocked, stats), [achievements, autoUnlocked, stats]);
  const isGoat = achievements.length > 0 && autoUnlocked.size === achievements.length;
  const dynamicTiers = useMemo(() => getDynamicRankTiers(achievements), [achievements]);
  const { current: currentRank } = useMemo(() => getRankInfo(prPoints, isGoat, dynamicTiers), [prPoints, isGoat, dynamicTiers]);

  // ── Rank salvato nel DB per questo promoter (fonte di verità) ────────────
  // Un solo record per promoter: { promoter_id, rank_key }
  // Se il rank_key cambia → rank-up → invia notifica + aggiorna record
  const { data: savedRankRecords = [], isFetched: savedRankFetched } = useQuery({
    queryKey: ['promoter-rank', promoter?.id],
    queryFn: () => base44.entities.PromoterRank.filter({ promoter_id: promoter.id }),
    enabled: isActive && !!promoter?.id && !!currentRank && dataReady,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // Mai valutare rank-up/salvataggi con dati parziali (rank calcolato troppo basso)
    if (!promoter?.id || !currentRank || !savedRankFetched || !dataReady) return;

    const savedRecord = savedRankRecords[0];
    const savedRankKey = savedRecord?.rank_key;

    // Stesso rank già in DB → nessuna azione
    if (savedRankKey === currentRank.key) return;

    // ── GUARD ANTI-DEMOZIONE ──────────────────────────────────────────────
    // Non scrivere mai nel DB se il rank calcolato è più basso di quello già salvato
    if (savedRankKey) {
      const RANK_KEYS = ['bronzo_1','bronzo_2','bronzo_3','argento_1','argento_2','argento_3','oro_1','oro_2','oro_3','platino_1','platino_2','platino_3','master_1','master_2','master_3','leggenda_1','leggenda_2','leggenda_3','goat'];
      const savedIdx = RANK_KEYS.indexOf(savedRankKey);
      const currentIdx = RANK_KEYS.indexOf(currentRank.key);
      if (currentIdx <= savedIdx) return; // rank calcolato uguale o più basso → ignora
    }

    // Guard in-sessione: evita doppio invio tra render ravvicinati
    if (!_rankUpProcessed[promoter.id]) _rankUpProcessed[promoter.id] = new Set();
    const processed = _rankUpProcessed[promoter.id];
    if (processed.has(currentRank.key)) return;
    processed.add(currentRank.key);

    // Rank in aumento (o primo accesso) → salva/aggiorna nel DB poi notifica
    const savePromise = savedRecord
      ? base44.entities.PromoterRank.update(savedRecord.id, { rank_key: currentRank.key })
      : base44.entities.PromoterRank.create({ promoter_id: promoter.id, rank_key: currentRank.key });

    savePromise.then(() => {
      // Notifica solo se è un upgrade reale (non il primo salvataggio a freddo)
      if (savedRankKey) {
        base44.functions.invoke('notifyRankUp', {
          promoter_id: promoter.id,
          new_rank_key: currentRank.key,
          new_rank_label: currentRank.label,
          new_rank_emoji: currentRank.emoji,
          pr_points: prPoints,
        }).catch(() => {});
      }
    }).catch(() => {
      processed.delete(currentRank.key);
    });
  }, [promoter?.id, savedRankRecords, savedRankFetched, dataReady]);

  // ── Persiste i nuovi achievement sbloccati come PromoterAchievement ──────────
  // Questo è il trigger che fa partire l'automazione entity → notifica push
  const { data: existingPA, isFetched: existingPAFetched } = useQuery({
    queryKey: ['promoter-achievements', promoter?.id],
    queryFn: () => base44.entities.PromoterAchievement.filter({ promoter_id: promoter.id }),
    enabled: isActive && !!promoter?.id && achievements.length > 0 && dataReady && !_paCheckDone[promoter?.id],
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!dataReady || !promoter?.id || !existingPAFetched || !existingPA || achievements.length === 0 || autoUnlocked.size === 0) return;
    // Esegui il sync PA una sola volta per sessione per questo promoter
    if (_paCheckDone[promoter.id]) return;
    _paCheckDone[promoter.id] = true;

    // Il DB è l'unica fonte di verità
    const existingIds = new Set(existingPA.map(pa => pa.achievement_id));

    // Inizializza il sessionSet con tutti gli ID già in DB
    if (!_sessionCreated[promoter.id]) {
      _sessionCreated[promoter.id] = new Set();
    }
    const sessionSet = _sessionCreated[promoter.id];
    existingIds.forEach(id => sessionSet.add(id));

    // Crea solo achievement effettivamente nuovi: non in DB e non già tentati
    const newlyUnlocked = [...autoUnlocked].filter(id => !existingIds.has(id) && !sessionSet.has(id));
    newlyUnlocked.forEach(id => sessionSet.add(id));
    newlyUnlocked.forEach((achievementId, i) => {
      setTimeout(() => {
        const ach = achievements.find(a => a.id === achievementId);
        base44.entities.PromoterAchievement.create({
          promoter_id: promoter.id,
          achievement_id: achievementId,
          achievement_key: ach?.key || '',
          unlocked_at: new Date().toISOString(),
        }).catch(() => {});
      }, i * 1500);
    });
  }, [promoter?.id, existingPA, existingPAFetched, autoUnlocked, dataReady]);



  const unlockDates = useMemo(
    () => (dataReady ? computeUnlockDates(achievements, promoter, clients, attendances, events) : {}),
    [dataReady, achievements, promoter, clients, attendances, events]
  );

  const sorted = useMemo(
    () => [...achievements].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [achievements]
  );

  // ── Filtro ricerca ────────────────────────────────────────────────────────
  const filteredSorted = useMemo(() => {
    if (!searchQuery.trim()) return sorted;
    const q = searchQuery.toLowerCase();
    return sorted.filter(a =>
      (a.title || '').toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q) ||
      String(a.condition_value || '').includes(q)
    );
  }, [sorted, searchQuery]);

  // Scroll all'achievement evidenziato.
  // Aspetta che: 1) il tab sia visibile (isVisible), 2) i dati siano caricati (sorted.length > 0),
  // poi scrolla con window.scrollTo per posizionare l'elemento al centro dello schermo.
  useEffect(() => {
    if (!highlightId || !isVisible || sorted.length === 0) return;
    // Un solo tentativo dopo un breve delay per permettere al browser di fare il layout
    const t = setTimeout(() => {
      const el = webDocument.getElementById(`achievement-${highlightId}`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollTop = webWindow.scrollY + rect.top - webWindow.innerHeight / 2 + rect.height / 2;
      webWindow.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
    }, 150);
    return () => clearTimeout(t);
  }, [highlightId, scrollTrigger, isVisible, sorted.length]);

  // Ordine fisso: bronzo → leggenda (ascendente)
  const displayOrder = [...RARITY_ORDER].reverse(); // ['bronzo', 'argento', 'oro', 'platino', 'master', 'leggenda']

  const unlockedCount = sorted.filter(a => autoUnlocked.has(a.id)).length;
  const totalCount = sorted.length;
  const globalPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const byRarity = Object.fromEntries(RARITY_ORDER.map(r => [r, []]));
  filteredSorted.forEach(a => {
    const r = a.rarity || 'bronzo';
    if (byRarity[r]) byRarity[r].push(a);
    else byRarity['bronzo'].push(a);
  });

  // Dati non ancora completi: skeleton (stessa struttura/altezze del contenuto reale)
  // invece di rank parziale o del falso "Nessun Achievement disponibile".
  if (!dataReady) return <AchievementsSkeleton />;

  if (sorted.length === 0) {
    return (
      <Div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-8 text-center space-y-3">
        <Trophy className="w-10 h-10 text-muted-foreground mx-auto" />
        <P className="font-semibold text-sm">Nessun Achievement disponibile</P>
        <P className="text-xs text-muted-foreground">Un admin può creare gli achievement in Impostazioni App.</P>
      </Div>
    );
  }

  return (
    <Div className="space-y-6">
      {/* ── Il Mio Rank ── */}
      <RankCard promoter={promoter} stats={stats} isActive={isActive} />

      {/* Barra progresso globale */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-5 space-y-3"
        style={{ boxShadow: '0 4px 24px -6px rgba(251,191,36,0.10)' }}
      >
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
          style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }} />
        <Div className="flex items-center justify-between">
          <Div className="flex items-center gap-2">
            <SectionHeader icon={Trophy} title="I Tuoi Achievement" color="#fbbf24" />
          </Div>
          <Div className="flex items-center gap-2 flex-wrap justify-end">
            <Span className="text-sm font-bold text-primary">{unlockedCount} / {totalCount}</Span>
            {/* Toggle mostra solo da completare */}
            <Btn
              button
              onClick={() => setShowOnlyLocked(v => !v)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] border transition-all ${showOnlyLocked ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground'}`}
              accessibilityLabel="Mostra solo da completare">
              <Lock className="w-3 h-3" />
              Da fare
            </Btn>

          </Div>
        </Div>
        <Div className="w-full bg-secondary/40 rounded-full h-3 overflow-hidden">
          <Div
            className="h-3 rounded-full bg-gradient-to-r from-primary to-violet-400 transition-all duration-500"
            style={{ width: `${globalPercent}%` }}
          />
        </Div>
        <Div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <Span>{globalPercent}% completato</Span>
          <Span>{totalCount - unlockedCount} ancora da sbloccare</Span>
        </Div>
      </motion.div>

      {/* Barra di ricerca */}
      <Div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <HtmlInput
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Cerca achievement per nome, descrizione o valore..."
          className="w-full bg-card border border-border rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
        />
        {searchQuery && (
          <Btn
            button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-3.5 h-3.5" />
          </Btn>
        )}
      </Div>
      {searchQuery && (
        <P className="text-xs text-muted-foreground -mt-3">
          {filteredSorted.length} risultat{filteredSorted.length === 1 ? 'o' : 'i'} per "{searchQuery}"
        </P>
      )}

      {/* Sezioni per rarità */}
      {displayOrder.map((rarity, rIdx) => {
        const allItems = byRarity[rarity];
        if (!allItems || allItems.length === 0) return null;
        const items = showOnlyLocked ? allItems.filter(a => !autoUnlocked.has(a.id)) : allItems;
        if (items.length === 0) return null;
        const colors = RARITY_COLORS[rarity];
        return (
          <motion.div
            key={rarity}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: rIdx * 0.06 }}
            className="space-y-3"
          >
            <SectionHeader icon={Trophy} title={RARITY_LABELS[rarity]} color={RARITY_HEX[rarity] || '#a78bfa'} />
            <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((a, aIdx) => (
                <Div
                  key={a.id}
                  className={a.id === highlightId ? 'ring-2 ring-primary rounded-2xl' : ''}>
                  <AchievementCard
                    achievement={a}
                    isUnlocked={autoUnlocked.has(a.id)}
                    progress={getFamilyProgress(a, achievements, stats)}
                    unlockDate={autoUnlocked.has(a.id) ? unlockDates[a.id] : null}
                    delay={rIdx * 0.06 + aIdx * 0.04}
                  />
                </Div>
              ))}
            </Div>
          </motion.div>
        );
      })}
    </Div>
  );
}