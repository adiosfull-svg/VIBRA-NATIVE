// Port di src/components/client/ClientSkillRadar.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from '@/ui/recharts';
import DeferredChart from '@/web/components/shared/DeferredChart';
import { Gauge } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';

import { Div, Span } from '@/ui/html';

/**
 * Calcola i 5 skill score (1–99) per un cliente rispetto a tutti gli altri.
 *
 * Tutti i punteggi sono proporzioni lineari sul massimo osservato → scala uniforme 1–99,
 * tranne la COSTANZA che è un modello ibrido storico+recente calibrato sull'attività reale.
 *
 * MODELLO COSTANZA (0–99):
 *
 *  NUOVI CLIENTI (<6 presenze): si costruisce dallo streak recente (finestra mensile 30gg:
 *  riconosce cadenza mensile/bisettimanale come attiva — 5 serate ravvicinate → ~99),
 *  con decadimento temporale se la presenza si dirada. Pavimento recency-aware: presenze reali
 *  recenti (≤6 sett.) con 3+ ingressi non scendono sotto ~20; chi è raffreddato o crollato da
 *  tempo resta sul pavimento basso. Regolarità dei pochi ingressi: gap regolari tengono di più,
 *  erratici scendono di più (es. 5 presenze reg 0.5 → ~22, reg 0.25 → ~12). Mai a 1 con storia.
 *
 *  CLIENTI STORICI (≥6 presenze):
 *   storicoBase = regolarità (% gap ≤14gg) × affidabilità (8+ presenze) × 99.
 *   densità effettiva = presenze/mese ultimi 120gg × (0.75 + 0.25·regolarità).
 *   densityScore = 50 + √(densitàEffettiva/6) × 49   (≈3/mese → 85, 4/mese → 90, 6/mese → 99).
 *   recentScore  = densityScore   (nessun cap: ≥6 presenze bastano anche per i nuovi molto attivi).
 *   recencyPenalty = se nell'ultimo mese sono venuti <3 volte: deficit vs atteso × 13
 *                    (un mese senza presenze costa 10-15 pt; chi è settimanale non viene penalizzato).
 *
 *   ENGAGED (≥3 presenze recenti E ultima ≤60gg, non "scintilla isolata"):
 *     costanza = max(recentScore, storicoBase·0.6)   — lo storico fa da pavimento, non da freno.
 *   DISENGAGED (assente o scintilla isolata dopo buco >60gg):
 *     decadimento per serate saltate (×0.965), floor storico al 40%:
 *       Martina (1 presenza in 6 mesi, storico 91) → ~36.
 */
function computeConsistency(cas, allEvents) {
  const dates = cas
    .map(a => allEvents.find(e => e.id === a.event_id)?.date)
    .filter(Boolean)
    .map(d => new Date(d).getTime())
    .sort((a, b) => a - b);

  if (dates.length === 0) return 0;

  const DAY = 24 * 3600 * 1000;
  const now = Date.now();
  const last = dates[dates.length - 1];
  const first = dates[0];
  const daysSinceLast = (now - last) / DAY;

  // --- NUOVI CLIENTI (<6 presenze): solo streak recente con decadimento temporale ---
  // Regolarità: serve in entrambi i rami (nuovi e storici).
  let shortGaps = 0, totalGaps = 0;
  for (let i = 1; i < dates.length; i++) {
    totalGaps++;
    if ((dates[i] - dates[i - 1]) / DAY <= 14) shortGaps++;
  }
  const regularity = totalGaps > 0 ? shortGaps / totalGaps : 1;

  // --- NUOVI CLIENTI (<6 presenze) ---
  if (dates.length < 6) {
    let streak = daysSinceLast <= 30 ? 1 : 0;
    for (let i = dates.length - 1; i > 0; i--) {
      if ((dates[i] - dates[i - 1]) / DAY <= 30) streak++;
      else break;
    }
    streak = Math.min(streak, dates.length);
    const streakScore = Math.min(99, (streak / 5) * 99);
    const decay = Math.exp(-daysSinceLast / 60); // mezza vita ~42 giorni
    const raw = streakScore * decay;
    // Pavimento storico: chi ha accumulato presenze reali ma poi è crollato non scende a 1.
    // Scala con quante presenze ha (reliability) e la sua regolarità.
    const reliabilityN = Math.min(1, dates.length / 5);
    const storicoBaseN = Math.min(99, regularity * reliabilityN * 99);
    // Pavimento recency-aware: un cliente nuovo con presenze reali recenti (≤6 settimane)
    // e 3+ presenze non scende sotto ~20; chi si è raffreddato resta sul pavimento basso,
    // così i crollati antichi (regolare 0, >6 settimane) restano bassi ma i nuovi recenti no.
    const recent = daysSinceLast <= 45;
    const countFloor = Math.min(20, dates.length * 7);
    const historyFloor = recent
      ? Math.max(storicoBaseN * 0.45, countFloor)
      : Math.max(storicoBaseN * 0.45, reliabilityN * 12);
    return Math.min(99, Math.max(1, Math.round(Math.max(historyFloor, raw))));
  }

  // --- CLIENTI STORICI (≥6 presenze) ---

  // Fedeltà storica: regolarità × affidabilità × 99.
  const reliability = Math.min(1, dates.length / 8);          // 8+ presenze = affidabilità piena
  const storicoBase = Math.min(99, regularity * reliability * 99);

  // Attività recente (ultimi 120 giorni): densità mensile effettiva + tasso di presenza.
  const recentDates = dates.filter(d => (now - d) <= 120 * DAY);
  const recentPresences = recentDates.length;
  const firstRecent = recentDates.length > 0 ? recentDates[0] : now;
  const monthsSpan = Math.min(4, Math.max(1, (now - firstRecent) / (30 * DAY)));
  const recentDensityPerMonth = recentPresences / monthsSpan;
  const last30Presences = dates.filter(d => (now - d) <= 30 * DAY).length;
  // Densità effettiva: penalizza leggermente chi ha gap irregolari.
  const effectiveDensity = recentDensityPerMonth * (0.75 + 0.25 * regularity);
  // Curva morbida: 3/mese → ~85, 4/mese → ~90, 6/mese → 99.
  const densityScore = Math.min(99, 50 + Math.sqrt(effectiveDensity / 6) * 49);

  // Nessun cap: ≥6 presenze sono già segnale sufficiente, anche per clienti nuovi molto attivi.
  const recentScore = densityScore;

  // Penalità per il mese senza presenze: un mese vuoto costa 10-15 pt.
  const expectedMonthly = Math.max(2, recentDensityPerMonth);
  const recencyPenalty = last30Presences < 3
    ? Math.max(0, expectedMonthly - last30Presences) / expectedMonthly * 13
    : 0;

  // "Scintilla isolata": ultima presenza dopo un buco >60gg → non è reale engagement.
  const gapBeforeLast = dates.length >= 2 ? (dates[dates.length - 1] - dates[dates.length - 2]) / DAY : 0;
  const isolatedSpark = gapBeforeLast > 60;

  // ENGAGED: ≥3 presenze recenti con ultima ≤60gg, oppure ultima ≤21gg (e non scintilla).
  const engaged = (recentPresences >= 3 && daysSinceLast <= 60 && !isolatedSpark)
               || (daysSinceLast <= 21 && !isolatedSpark);

  if (engaged) {
    // Lo storico fa da pavimento (60%); il recente domina, meno la penalità di assenza mensile.
    const consistency = Math.max(recentScore - recencyPenalty, storicoBase * 0.6);
    return Math.min(99, Math.max(1, Math.round(consistency)));
  }

  // DISENGAGED: decadimento per serate saltate, floor storico al 40%.
  // Se l'ultima presenza è una scintilla isolata, il conteggio parte da prima del buco.
  const breakIdx = isolatedSpark ? dates.length - 2 : dates.length - 1;
  const breakPointDate = dates[breakIdx];
  const attendedSinceBreak = dates.length - 1 - breakIdx;
  const eventsSinceBreak = allEvents.filter(e => {
    const ed = e.date ? new Date(e.date).getTime() : NaN;
    return ed > breakPointDate && ed <= now;
  }).length;
  const missedEvents = Math.max(0, eventsSinceBreak - attendedSinceBreak);
  const loyaltyFloor = Math.round(storicoBase * 0.4);
  const consistency = Math.max(loyaltyFloor, storicoBase * Math.pow(0.965, missedEvents));
  return Math.min(99, Math.max(1, Math.round(consistency)));
}

function computeSkills(client, allClients, allAttendances, allEvents) {
  // Raggruppa le presenze per client_id una sola volta (O(M)) invece di
  // filter() lineare per ogni cliente (O(N×M)).
  const attByClient = {};
  for (const a of allAttendances) {
    (attByClient[a.client_id] ||= []).push(a);
  }
  const statsMap = {};
  allClients.forEach(c => {
    const cas = attByClient[c.id] || [];
    const totalSpent = cas.reduce((s, a) => s + (a.revenue || 0), 0);
    const visits = cas.length;
    const avgSpent = visits > 0 ? totalSpent / visits : 0;
    const newPeople = c.new_people_brought || 0;
    const consistency = computeConsistency(cas, allEvents);
    statsMap[c.id] = { totalSpent, visits, avgSpent, newPeople, consistency };
  });

  const myStats = statsMap[client.id] || { totalSpent: 0, visits: 0, avgSpent: 0, newPeople: 0, consistency: 0 };

  // Massimi tra tutti — usati come riferimento per scala lineare uniforme
  // (la costanza è assoluta 0–99, non normalizzata)
  const maxVisits      = Math.max(1, ...Object.values(statsMap).map(s => s.visits));
  const maxTotalSpent  = Math.max(1, ...Object.values(statsMap).map(s => s.totalSpent));
  const maxNewPeople   = Math.max(1, ...Object.values(statsMap).map(s => s.newPeople));
  const maxAvgSpent    = Math.max(1, ...Object.values(statsMap).map(s => s.avgSpent));

  const toScore = (val, max) => val <= 0 ? 1 : Math.round(1 + (val / max) * 98);

  // Aggregazione con radice quadrata: distribuzione più omogenea (es. 10 su 28 max → 60 invece di 36)
  const toAggregationScore = (val, max) => val <= 0 ? 1 : Math.round(1 + Math.sqrt(val / max) * 98);

  // Spesa media: logica originale — 30€ = 90, sopra scala fino a 99 sul max
  let spesaMedia;
  if (myStats.avgSpent === 0) {
    spesaMedia = 1;
  } else if (maxAvgSpent <= 30) {
    spesaMedia = Math.round(1 + (myStats.avgSpent / 30) * 89);
  } else {
    if (myStats.avgSpent <= 30) {
      spesaMedia = Math.round(1 + (myStats.avgSpent / 30) * 89);
    } else {
      spesaMedia = Math.round(90 + ((myStats.avgSpent - 30) / (maxAvgSpent - 30)) * 9);
    }
  }

  return {
    aggregazione: Math.min(99, Math.max(1, toAggregationScore(myStats.newPeople, maxNewPeople))),
    presenze:     Math.min(99, Math.max(1, toScore(myStats.visits, maxVisits))),
    costanza:     Math.min(99, Math.max(1, myStats.consistency)),
    spesaMedia:   Math.min(99, Math.max(1, spesaMedia)),
    spesaTotale:  Math.min(99, Math.max(1, toScore(myStats.totalSpent, maxTotalSpent))),
  };
}

const SKILL_LABELS = {
  aggregazione: 'Aggregazione',
  presenze:     'Presenze',
  costanza:     'Costanza',
  spesaMedia:   'Spesa media',
  spesaTotale:  'Spesa totale',
};

const SKILL_COLORS = {
  aggregazione: '#f59e0b',
  presenze:     '#22d3ee',
  costanza:     '#a78bfa',
  spesaMedia:   '#34d399',
  spesaTotale:  '#f472b6',
};

export default function ClientSkillRadar({ client, allClients, allAttendances, allEvents }) {
  const skills = useMemo(
    () => computeSkills(client, allClients, allAttendances, allEvents),
    [client, allClients, allAttendances, allEvents]
  );

  // Animazione fluida: parte dai valori attuali e anima verso quelli reali.
  // Re-dipende dai valori calcolati: quando le presenze arrivano in ritardo
  // (es. dialog aperto dalla ricerca con dati async), l'animazione riparte
  // dai valori correnti verso quelli nuovi invece di restare bloccata a 1.
  const [animatedSkills, setAnimatedSkills] = useState({
    aggregazione: 0, presenze: 0, costanza: 0, spesaMedia: 0, spesaTotale: 0,
  });
  const animatedRef = useRef(animatedSkills);
  animatedRef.current = animatedSkills;

  useEffect(() => {
    const duration = 700;
    let start = null;
    const from = { ...animatedRef.current };
    const target = skills;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedSkills({
        aggregazione: Math.round(from.aggregazione + ease * (target.aggregazione - from.aggregazione)),
        presenze:     Math.round(from.presenze + ease * (target.presenze - from.presenze)),
        costanza:     Math.round(from.costanza + ease * (target.costanza - from.costanza)),
        spesaMedia:   Math.round(from.spesaMedia + ease * (target.spesaMedia - from.spesaMedia)),
        spesaTotale:  Math.round(from.spesaTotale + ease * (target.spesaTotale - from.spesaTotale)),
      });
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [client.id, skills.aggregazione, skills.presenze, skills.costanza, skills.spesaMedia, skills.spesaTotale]);

  const data = [
    { skill: 'Aggregazione', value: animatedSkills.aggregazione },
    { skill: 'Presenze',     value: animatedSkills.presenze },
    { skill: 'Costanza',     value: animatedSkills.costanza },
    { skill: 'Spesa media',  value: animatedSkills.spesaMedia },
    { skill: 'Spesa totale', value: animatedSkills.spesaTotale },
  ];

  const skillKeys = ['aggregazione', 'presenze', 'costanza', 'spesaMedia', 'spesaTotale'];

  return (
    <Div className="rounded-xl bg-card border border-border p-3 sm:p-4 space-y-3">
      <SectionHeader icon={Gauge} title="Skill del cliente" color="#a78bfa" />

      {/* Spider chart */}
      <DeferredChart className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
              <PolarGrid stroke="hsl(240 5% 22%)" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: 'hsl(240 5% 55%)', fontSize: 10, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                domain={[0, 99]}
                tick={false}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(240 6% 8%)',
                  border: '1px solid hsl(240 5% 18%)',
                  borderRadius: '6px',
                  fontSize: 11,
                  color: '#fff',
                }}
                formatter={v => [v, 'Score']}
              />
              <Radar
                dataKey="value"
                stroke="hsl(275 72% 55%)"
                fill="hsl(275 72% 45%)"
                fillOpacity={0.25}
                strokeWidth={2}
                dot={{ fill: 'hsl(275 72% 65%)', r: 3 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </DeferredChart>

      {/* Score chips */}
      <Div className="grid grid-cols-5 gap-1.5 min-w-0">
        {skillKeys.map(key => (
          <Div key={key} className="flex flex-col items-center gap-0.5 rounded-lg bg-secondary/40 px-1 py-2 min-w-0 overflow-hidden">
            <Span className="text-[9px] text-muted-foreground text-center leading-tight break-words">{SKILL_LABELS[key]}</Span>
            <Span className="text-base font-bold" style={{ color: SKILL_COLORS[key] }}>{animatedSkills[key]}</Span>
          </Div>
        ))}
      </Div>
    </Div>
  );
}