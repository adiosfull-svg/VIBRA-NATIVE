// Port di src/pages/Dashboard.jsx (convertito da scripts/port/codemod.mjs).
import { STALE_FULL_TABLE, GC_FULL_TABLE } from '@/web/lib/query-client';
import React, { useState } from 'react';
import { keepPreviousData } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { fetchAll } from '@/web/lib/safeData';
import { DollarSign, Users, CalendarDays, TrendingUp, Megaphone } from '@/ui/icons.generated';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval, subMonths, getMonth, getYear } from 'date-fns';
import { useAppSetting } from '@/web/hooks/useAppSetting';
import PageTitle from '@/web/components/shared/PageTitle';

import KpiFlashCard from '@/web/components/dashboard/KpiFlashCard';
import LiveRankingWidget from '@/web/components/dashboard/LiveRankingWidget';
import TopClientsWidget from '@/web/components/dashboard/TopClientsWidget';
import RecentEventsWidget from '@/web/components/dashboard/RecentEventsWidget';
import VenueRevenueWidget from '@/web/components/dashboard/VenueRevenueWidget';
import RevenueTimelineWidget from '@/web/components/dashboard/RevenueTimelineWidget';
import QuickStatsRow from '@/web/components/dashboard/QuickStatsRow';
import AverageTablesStats from '@/web/components/dashboard/AverageTablesStats';
import ActivePromotersPopup from '@/web/components/dashboard/ActivePromotersPopup';
import ExportReportButton from '@/web/components/export/ExportReportButton';
import MonthPicker from '@/web/components/dashboard/MonthPicker';

import { Div, P } from '@/ui/html';

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const [showPromotersPopup, setShowPromotersPopup] = useState(false);
  const [announcement] = useAppSetting('global_announcement');

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 30 * 60000, gcTime: 45 * 60000, refetchOnMount: false, refetchOnWindowFocus: false, retry: 0,
    placeholderData: keepPreviousData,
  });
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    // refetchOnMount: false come le altre query: il refresh arriva dall'invalidazione
    // (Serate) che aggiorna la cache condivisa, non da un refetch on mount che causa bump.
    staleTime: 30 * 60000, gcTime: 45 * 60000, refetchOnMount: false, refetchOnWindowFocus: false, retry: 0,
    placeholderData: keepPreviousData,
  });
  const { data: attendances = [] } = useQuery({
    queryKey: ['attendances-all'], staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE,
    queryFn: () => fetchAll(base44.entities.EventAttendance, {}, { sort: '-created_date' }),
refetchOnMount: false, refetchOnWindowFocus: false, retry: 0,
    placeholderData: keepPreviousData,
  });
  const { data: clients = [] } = useQuery({
    queryKey: ['clients-dashboard-by-rating'],
    // Ordinato per rating (pre-calcolato) cosi il widget "Top Clienti" riflette i veri top 13
    // su TUTTI i clienti registrati, non solo gli ultimi creati.
    queryFn: () => base44.entities.Client.list('-cum_rating', 50),
    staleTime: 30 * 60000, gcTime: 45 * 60000, refetchOnMount: false, refetchOnWindowFocus: false, retry: 0,
    placeholderData: keepPreviousData,
  });

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

  const totalRevenue = events.reduce((s, e) => s + (e.total_revenue || 0), 0);
  const activePromoters = promoters.filter(p => p.status === 'attivo').length;

  const monthlyRevenue = events
    .filter(e => e.date && isWithinInterval(parseISO(e.date), { start: monthStart, end: monthEnd }))
    .reduce((s, e) => s + (e.total_revenue || 0), 0);

  // Trend: confronto mese corrente vs mese precedente
  const prevMonth = subMonths(selectedMonth, 1);
  const prevStart = startOfMonth(prevMonth);
  const prevEnd = endOfMonth(prevMonth);
  const prevRevenue = events
    .filter(e => e.date && isWithinInterval(parseISO(e.date), { start: prevStart, end: prevEnd }))
    .reduce((s, e) => s + (e.total_revenue || 0), 0);
  const trend = prevRevenue > 0 ? Math.round(((monthlyRevenue - prevRevenue) / prevRevenue) * 100) : null;

  return (
    <Div className="space-y-5 pb-8">

      {/* ── Header ── */}
      <PageTitle title="Dashboard" />

      {/* ── Announcement ── */}
      {announcement && (
        <Div className="flex items-start gap-2.5 rounded-xl bg-amber-900/20 border border-amber-700/30 px-4 py-3"
          style={{ boxShadow: '0 0 20px rgba(217, 119, 6, 0.1)' }}
        >
          <Megaphone className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <P className="text-sm text-amber-200">{announcement}</P>
        </Div>
      )}

      {/* ── KPI Cards (4 col) ── */}
      <Div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiFlashCard
          title="Fatturato Totale"
          value={`€${totalRevenue.toLocaleString('it-IT')}`}
          rawValue={totalRevenue}
          label="Tutte le serate"
          icon={DollarSign}
          color="#a78bfa"
        />
        <KpiFlashCard
          title="Fatturato Mensile"
          value={`€${monthlyRevenue.toLocaleString('it-IT')}`}
          rawValue={monthlyRevenue}
          label={<MonthPicker value={selectedMonth} onChange={setSelectedMonth} />}
          icon={TrendingUp}
          color="#60a5fa"
          trend={trend}
        />
        <KpiFlashCard
          title="Promoter Attivi"
          value={activePromoters}
          rawValue={activePromoters}
          label={`su ${promoters.length} totali`}
          icon={Users}
          color="#4ade80"
          onClick={() => setShowPromotersPopup(true)}
        />
        <KpiFlashCard
          title="Serate Totali"
          value={events.length}
          rawValue={events.length}
          label={events.length > 0 ? `ultima: ${[...events].sort((a,b) => new Date(b.date)-new Date(a.date))[0]?.name?.slice(0,18) || '—'}` : 'nessuna serata'}
          icon={CalendarDays}
          color="#fb923c"
        />
      </Div>

      {/* ── Quick Stats Row ── */}
      <QuickStatsRow events={events} promoters={promoters} />

      {/* ── Main Row: Ranking + Venue Revenue ── */}
      <Div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[280px]">
        <LiveRankingWidget promoters={promoters} attendances={attendances} events={events} />
        <VenueRevenueWidget events={events} />
      </Div>

      {/* ── Revenue Timeline (full width) ── */}
      <RevenueTimelineWidget />

      {/* ── Top Clients + Recent Events ── */}
      <Div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[280px]">
        <TopClientsWidget clients={clients} promoters={promoters} />
        <RecentEventsWidget events={events} attendances={attendances} promoters={promoters} />
      </Div>

      {/* ── Tavoli Medi (sezione avanzata, collassabile) ── */}
      <AverageTablesStats events={events} attendances={attendances} promoters={promoters} />

      {/* ── Export Report ── */}
      <ExportReportButton promoters={promoters} events={events} attendances={attendances} />

      <ActivePromotersPopup
        open={showPromotersPopup}
        onClose={() => setShowPromotersPopup(false)}
        promoters={promoters}
      />
    </Div>
  );
}
