// Port di src/pages/Report.jsx (convertito da scripts/port/codemod.mjs).
import { attendancesAllOptions } from '@/web/lib/attendanceQueries';
import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { FileBarChart, Sparkles } from '@/ui/icons.generated';
import { useAuth } from '@/lib/auth';
import ReportBuilder from '@/web/components/report/ReportBuilder';
import ReportPreview from '@/web/components/report/ReportPreview';

import { win as webWindow } from '@/web/shims/dom';
import { Div, H, P } from '@/ui/html';

export default function Report() {
  const { user } = useAuth();
  const [config, setConfig] = useState({
    reportType: 'vibra_group',
    from: '',
    to: '',
    selectedPromoterIds: [],
    promoterId: '',
    period1: { from: '', to: '' },
    period2: { from: '', to: '' },
    promoterCompareDual: false,
    period1Months: { fromMonth: 5, fromYear: 2024, toMonth: 9, toYear: 2024 },
    period2Months: { fromMonth: 0, fromYear: 2025, toMonth: 2, toYear: 2025 },
    selectedEventIds: [],
    sections: { promoters: true, events: true, monthly: true },
  });
  const [generated, setGenerated] = useState(false);

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 30 * 60000, gcTime: 45 * 60000, refetchOnMount: false, refetchOnWindowFocus: false, retry: 0,
  });
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    staleTime: 30 * 60000, gcTime: 45 * 60000, refetchOnWindowFocus: false, retry: 0,
  });
  const { data: attendances = [] } = useQuery({
    ...attendancesAllOptions(),
    refetchOnMount: false, refetchOnWindowFocus: false, retry: 0,
    placeholderData: keepPreviousData,
  });

  const handleGenerate = () => setGenerated(true);
  const handlePrint = () => webWindow.print();

  if (user?.role !== 'admin') {
    return (
      <Div className="min-h-screen flex items-center justify-center p-4">
        <Div className="rounded-xl bg-card border border-border p-8 text-center space-y-4 max-w-md">
          <FileBarChart className="w-12 h-12 text-muted-foreground mx-auto" />
          <H className="text-xl font-bold">Accesso Riservato Admin</H>
          <P className="text-sm text-muted-foreground">Solo gli amministratori possono accedere alla sezione Report.</P>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 pt-6 max-w-6xl mx-auto">
      {/* Page title */}
      <Div className="report-no-print flex items-center gap-2.5 mb-5">
        <Div className="p-2 rounded-xl bg-purple-500/15">
          <FileBarChart className="w-5 h-5 text-purple-400" />
        </Div>
        <Div>
          <H className="text-xl font-bold">Report</H>
          <P className="text-xs text-muted-foreground">Costruisci confronti personalizzati e stampa report</P>
        </Div>
      </Div>

      {/* Builder */}
      <Div className="report-no-print mb-5">
        <ReportBuilder
          promoters={promoters}
          events={events}
          config={config}
          onChange={setConfig}
          onGenerate={handleGenerate}
        />
      </Div>

      {/* Preview */}
      {generated ? (
        <ReportPreview
          promoters={promoters}
          attendances={attendances}
          events={events}
          config={config}
          onPrint={handlePrint}
        />
      ) : (
        <Div className="report-no-print rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <Sparkles className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <P className="text-sm text-muted-foreground">Configura il report e premi "Genera Report" per visualizzare i dati</P>
        </Div>
      )}
    </Div>
  );
}