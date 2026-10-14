// Port di src/pages/PromoterDetail.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from '@/web/router';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { ArrowLeft, TrendingUp } from '@/ui/icons.generated';
import { filterCleanAttendances } from '@/legacy/utils/tables';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/menu';
import { useStuck } from '@/web/hooks/useStuck';
import { stickyGlassStyle } from '@/legacy/utils/stickyGlass';
import WeeklyRevenueChart from '@/web/components/promoter/WeeklyRevenueChart';
import MonthlyRevenueChart from '@/web/components/promoter/MonthlyRevenueChart';
import MonthlyRevenueHistory from '@/web/components/promoter/MonthlyRevenueHistory';
import ClosedTablesCard from '@/web/components/promoter/ClosedTablesCard';
import VenueRevenueStats from '@/web/components/promoter/VenueRevenueStats';
import PromoterGoalsProgress from '@/web/components/promoter/PromoterGoalsProgress';
import PromoterSerateTab from '@/web/components/promoter/PromoterSerateTab';
import MonthlyCompare from '@/web/components/promoter/MonthlyCompare';
import SerateHeatmap from '@/web/components/promoter/SerateHeatmap';
import TablesStreakHeatmap from '@/web/components/promoter/TablesStreakHeatmap';
import MonthlyRevenueBarChart from '@/web/components/promoter/MonthlyRevenueBarChart';

import { Div, H, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

export default function PromoterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tabsRef = useRef(null);
  const [stuck] = useStuck(tabsRef, 0);

  const { data: promoters = [] } = useQuery({ queryKey: ['promoters'], queryFn: () => base44.entities.Promoter.list(), staleTime: 10 * 60000, gcTime: 15 * 60000, refetchOnWindowFocus: false, retry: 1 });
  const { data: attendances = [] } = useQuery({ queryKey: ['attendances', id], queryFn: () => base44.entities.EventAttendance.filter({ promoter_id: id }, '-created_date', 5000), staleTime: 10 * 60000, gcTime: 15 * 60000, refetchOnWindowFocus: false, retry: 1 });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => base44.entities.Event.list('-date', 5000), staleTime: 10 * 60000, gcTime: 15 * 60000, refetchOnWindowFocus: false, retry: 1 });

  const promoter = promoters.find(p => p.id === id);
  const pa = filterCleanAttendances(attendances.filter(a => a.promoter_id === id && !a.client_id));

  const totalRevenue = pa.reduce((s, a) => s + (a.revenue || 0), 0);
  const now = new Date();
  const monthlyRevenue = pa.reduce((s, a) => {
    const ev = events.find(e => e.id === a.event_id);
    if (!ev?.date) return s;
    const d = new Date(ev.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() ? s + (a.revenue || 0) : s;
  }, 0);

  if (!promoter) {
    return (
      <Div className="flex items-center justify-center h-64">
        <Div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </Div>
    );
  }

  return (
    <Div className="space-y-6">
      {/* Header */}
      <Div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/promoter')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Div className="flex items-center gap-3 flex-1">
          <Div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-lg overflow-hidden">
            {promoter.photo_url
              ? <Img src={promoter.photo_url} alt={promoter.name} className="w-full h-full object-cover" />
              : promoter.name?.charAt(0)?.toUpperCase()
            }
          </Div>
          <Div>
            <H className="text-2xl font-bold tracking-tight">{promoter.name}</H>
            <Div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className={promoter.status === 'attivo' ? 'border-green-500/30 text-green-400 text-xs' : 'text-xs'}>
                {promoter.status}
              </Badge>
              {promoter.phone && <Span className="text-xs text-muted-foreground">{promoter.phone}</Span>}
            </Div>
          </Div>
        </Div>
        {/* Summary stats */}
        <Div className="hidden md:flex gap-4">
          <Div className="text-right">
            <P className="text-xs text-muted-foreground">Fatturato Totale</P>
            <P className="text-xl font-bold text-primary">€{totalRevenue.toLocaleString('it-IT')}</P>
          </Div>
          <Div className="text-right">
            <P className="text-xs text-muted-foreground">Questo Mese</P>
            <P className="text-xl font-bold">€{monthlyRevenue.toLocaleString('it-IT')}</P>
          </Div>
        </Div>
      </Div>

      {/* Mobile stats */}
      <Div className="grid grid-cols-2 gap-3 md:hidden">
       <Div className="rounded-xl bg-card border border-border p-4">
         <P className="text-xs text-muted-foreground">Fatturato Totale</P>
         <P className="text-xl font-bold text-primary mt-1">€{totalRevenue.toLocaleString('it-IT')}</P>
       </Div>
       <Div className="rounded-xl bg-card border border-border p-4">
         <P className="text-xs text-muted-foreground">Questo Mese</P>
         <P className="text-xl font-bold mt-1">€{monthlyRevenue.toLocaleString('it-IT')}</P>
       </Div>
      </Div>

      {/* Goals progress */}
      <PromoterGoalsProgress promoter={promoter} attendances={pa} events={events} />

      {/* Closed tables card */}
      <ClosedTablesCard attendances={pa} events={events} promoterFrom={promoter.promoter_from} />

      {/* Tabs */}
      <Tabs defaultValue="weekly">
        <Div ref={tabsRef} className="sticky top-0 z-20 py-1.5 -mx-4 px-4 border-b border-border" style={stickyGlassStyle(stuck)}>
          <TabsList className="w-full overflow-x-auto flex-nowrap">
            <TabsTrigger value="weekly" className="flex-1 text-xs">Sett.</TabsTrigger>
            <TabsTrigger value="monthly" className="flex-1 text-xs">Mensile</TabsTrigger>
            <TabsTrigger value="history" className="flex-1 text-xs">Storico</TabsTrigger>
            <TabsTrigger value="serate" className="flex-1 text-xs">Serate</TabsTrigger>
          </TabsList>
        </Div>

        <TabsContent value="weekly">
          <Div className="space-y-6">
            <WeeklyRevenueChart attendances={pa} events={events} />
            <VenueRevenueStats attendances={pa} events={events} />
          </Div>
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyRevenueChart attendances={pa} events={events} />
        </TabsContent>

        <TabsContent value="history">
          <Div className="space-y-6">
            <MonthlyCompare attendances={pa} events={events} />
            <MonthlyRevenueHistory attendances={pa} events={events} />
          </Div>
        </TabsContent>

        <TabsContent value="serate">
          <PromoterSerateTab attendances={pa} events={events} />
        </TabsContent>
      </Tabs>

      {/* Fatturato mensile totale — barre verticali (dal primo all'ultimo mese) */}
      <MonthlyRevenueBarChart attendances={pa} events={events} />

      {/* Heatmap serate */}
      <SerateHeatmap attendances={pa} events={events} promoterFrom={promoter.promoter_from} />

      {/* Heatmap tavoli consecutivi */}
      <TablesStreakHeatmap attendances={pa} events={events} promoterFrom={promoter.promoter_from} />
    </Div>
  );
}