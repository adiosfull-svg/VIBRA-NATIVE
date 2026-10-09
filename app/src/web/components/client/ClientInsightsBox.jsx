// Port di src/components/client/ClientInsightsBox.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';
import { parseISO, getMonth, differenceInDays, differenceInWeeks } from 'date-fns';
import { Lightbulb } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';

import { Div, Span } from '@/ui/html';

const MONTHS_IT = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const DAYS_IT = { 5: 'Venerdì', 6: 'Sabato', 0: 'Domenica' };

/**
 * Dato l'array di presenze per data (ordinato), calcola la durata media
 * dei "periodi attivi" (streak consecutive entro N giorni).
 */
function computeAvgActivePeriod(dates, gapDays = 35) {
  if (dates.length < 2) return null;
  const sorted = [...dates].sort((a, b) => a - b);
  const streaks = [];
  let streakStart = sorted[0];
  let streakEnd = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const gap = differenceInDays(sorted[i], sorted[i - 1]);
    if (gap <= gapDays) {
      streakEnd = sorted[i];
    } else {
      streaks.push(differenceInWeeks(streakEnd, streakStart));
      streakStart = sorted[i];
      streakEnd = sorted[i];
    }
  }
  streaks.push(differenceInWeeks(streakEnd, streakStart));
  const completed = streaks.filter(s => s > 0);
  if (completed.length === 0) return null;
  return Math.round(completed.reduce((s, v) => s + v, 0) / completed.length);
}

export default function ClientInsightsBox({ clients, attendances, events }) {
  const insights = useMemo(() => {
    if (!clients.length || !events.length || !attendances.length) return null;

    const eventsById = Object.fromEntries(events.map(e => [e.id, e]));

    // Costruiamo stats per cliente
    const clientAttMap = {};
    attendances.forEach(a => {
      if (!a.client_id) return;
      if (!clientAttMap[a.client_id]) clientAttMap[a.client_id] = [];
      clientAttMap[a.client_id].push(a);
    });

    // --- 1. Serata preferita (giorno della settimana) ---
    const dowCounts = { 5: 0, 6: 0, 0: 0 };
    // --- 2. Locale più frequentato ---
    const venueCounts = {};
    // --- 3. Serata con spesa media più alta (nome evento) ---
    const eventSpend = {};  // eventId -> { total, count }

    // --- 4. Mese più attivo ---
    const monthCounts = Array(12).fill(0);
    // --- 5. Periodi attivi per cliente ---
    const activePeriods = [];

    attendances.forEach(a => {
      if (!a.client_id) return;
      const ev = eventsById[a.event_id];
      if (!ev?.date) return;
      const d = parseISO(ev.date);
      const dow = d.getDay();
      if (dow in dowCounts) dowCounts[dow]++;
      if (ev.venue) venueCounts[ev.venue] = (venueCounts[ev.venue] || 0) + 1;
      if (!eventSpend[a.event_id]) eventSpend[a.event_id] = { total: 0, count: 0 };
      eventSpend[a.event_id].total += (a.revenue || 0);
      eventSpend[a.event_id].count += 1;
      monthCounts[getMonth(d)]++;
    });

    // Periodo attivo medio per cliente
    for (const cid of Object.keys(clientAttMap)) {
      const dates = clientAttMap[cid]
        .map(a => eventsById[a.event_id]?.date)
        .filter(Boolean)
        .map(d => parseISO(d));
      const avg = computeAvgActivePeriod(dates);
      if (avg !== null) activePeriods.push(avg);
    }

    const bestDow = Object.entries(dowCounts).sort((a, b) => b[1] - a[1])[0];
    const bestVenue = Object.entries(venueCounts).sort((a, b) => b[1] - a[1])[0];
    const bestEventId = Object.entries(eventSpend)
      .sort((a, b) => (b[1].total / b[1].count) - (a[1].total / a[1].count))[0];
    const bestEvent = bestEventId ? eventsById[bestEventId[0]] : null;
    const bestEventAvg = bestEventId ? Math.round(bestEventId[1].total / bestEventId[1].count) : 0;

    // Mese più attivo e range (mesi consecutivi con più attività)
    const topMonth = monthCounts.indexOf(Math.max(...monthCounts));
    // trova range di 2 mesi consecutivi più denso
    let bestRange = { start: 0, total: 0 };
    for (let i = 0; i < 12; i++) {
      const total = monthCounts[i] + monthCounts[(i + 1) % 12] + monthCounts[(i + 2) % 12];
      if (total > bestRange.total) bestRange = { start: i, total };
    }
    const rangeLabel = `${MONTHS_IT[bestRange.start]}–${MONTHS_IT[(bestRange.start + 2) % 12]}`;

    const avgActive = activePeriods.length > 0
      ? Math.round(activePeriods.reduce((s, v) => s + v, 0) / activePeriods.length)
      : null;

    return {
      bestDay: bestDow ? DAYS_IT[bestDow[0]] : null,
      bestDayCount: bestDow ? bestDow[1] : 0,
      bestVenue: bestVenue ? bestVenue[0] : null,
      bestVenueCount: bestVenue ? bestVenue[1] : 0,
      bestEventName: bestEvent ? (bestEvent.name || bestEvent.venue) : null,
      bestEventAvg,
      topMonth: MONTHS_IT[topMonth],
      activeRange: rangeLabel,
      avgActivePeriodWeeks: avgActive,
    };
  }, [clients, attendances, events]);

  if (!insights) return null;

  const rows = [
    insights.bestDay && {
      label: '📅 Serata preferita',
      value: `${insights.bestDay} (${insights.bestDayCount} presenze totali)`,
    },
    insights.bestVenue && {
      label: '🏟️ Locale più frequentato',
      value: `${insights.bestVenue} (${insights.bestVenueCount} presenze)`,
    },
    insights.bestEventName && {
      label: '💸 Serata con più spesa media',
      value: `${insights.bestEventName} (media €${insights.bestEventAvg.toLocaleString('it-IT')})`,
    },
    {
      label: '📈 Mese con più presenze',
      value: insights.topMonth,
    },
    {
      label: '🗓️ Periodo di massima attività',
      value: insights.activeRange,
    },
    insights.avgActivePeriodWeeks !== null && {
      label: '⏱️ Durata media periodo attivo',
      value: `~${insights.avgActivePeriodWeeks} settimane per cliente`,
    },
  ].filter(Boolean);

  return (
    <Div className="rounded-xl bg-card border border-border overflow-hidden">
      <Div className="px-4 py-3 border-b border-border bg-secondary/30">
        <SectionHeader icon={Lightbulb} title="Insights sui tuoi Clienti" color="#fbbf24" />
      </Div>
      <Div className="divide-y divide-border/50">
        {rows.map((row, i) => (
          <Div key={i} className="flex items-start justify-between gap-4 px-4 py-2.5">
            <Span className="text-xs text-muted-foreground shrink-0 w-44">{row.label}</Span>
            <Span className="text-xs font-semibold text-foreground text-right">{row.value}</Span>
          </Div>
        ))}
      </Div>
    </Div>
  );
}