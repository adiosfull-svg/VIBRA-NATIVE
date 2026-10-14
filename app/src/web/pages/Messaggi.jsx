// Port di src/pages/Messaggi.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { base44 } from '@/lib/base44';
import { fetchIgMessages } from '@/web/lib/igMessages';
import { useAuth } from '@/lib/auth';
import { useViewAsPromoter } from '@/lib/viewAs';
import { chunkedBulk } from '@/legacy/utils/chunkedBulk';
import PageTitle from '@/web/components/shared/PageTitle';
import InstagramDMsTab from '@/web/components/instagram/InstagramDMsTab';
import CaptureSeminaDialog from '@/web/components/programmazione/CaptureSeminaDialog';
import { useProgrammazionePlan } from '@/web/hooks/useProgrammazionePlan';
import { useUpcomingSerate } from '@/web/hooks/useUpcomingSerate';
import { useSerateFittizie } from '@/web/hooks/useSerateFittizie';

import { Div } from '@/ui/html';

export default function Messaggi() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureInitial, setCaptureInitial] = useState({ url: '', name: '' });

  const isAdmin = user?.role === 'admin';
  const { effectivePromoterId: promoterId } = useViewAsPromoter();

  const { data: semine = [] } = useQuery({
    queryKey: ['semine', promoterId],
    queryFn: () => isAdmin && !promoterId
      ? base44.entities.Semina.list()
      : base44.entities.Semina.filter({ promoter_id: promoterId }),
    enabled: !!user,
    staleTime: 2 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Re-match InstagramMessage records when semine handles change
  const prevIgHandlesRef = useRef('');
  useEffect(() => {
    if (!promoterId) return;
    const handles = semine.filter(s => s.instagram).map(s => s.instagram.toLowerCase().replace(/^@/, '').trim()).sort().join(',');
    if (handles === prevIgHandlesRef.current) return;
    prevIgHandlesRef.current = handles;
    if (!handles) return;

    const seminaByHandle = new Map();
    semine.forEach(s => {
      if (s.instagram) seminaByHandle.set(s.instagram.toLowerCase().replace(/^@/, '').trim(), s);
    });

    qc.fetchQuery({
      queryKey: ['instagram-messages', promoterId],
      queryFn: () => fetchIgMessages({ isAdmin, promoterId }),
    }).then(messages => {
      if (!messages || messages.length === 0) return;
      const updates = [];
      messages.forEach(m => {
        const normalizedHandle = (m.sender_handle || '').toLowerCase().replace(/^@/, '').trim();
        const matchedSemina = seminaByHandle.get(normalizedHandle);
        const newSeminaId = matchedSemina?.id || null;
        if (m.matched_semina_id !== newSeminaId) {
          updates.push({
            id: m.id,
            matched_semina_id: newSeminaId,
            is_read: newSeminaId ? true : m.is_read,
          });
        }
      });
      if (updates.length > 0) {
        chunkedBulk(base44.entities.InstagramMessage.bulkUpdate, updates).then(() => {
          qc.invalidateQueries({ queryKey: ['instagram-messages'] });
        });
      }
    });
  }, [semine, promoterId, qc, isAdmin]);

  const { plan, addToPlan } = useProgrammazionePlan(promoterId);
  const { upcomingDates } = useUpcomingSerate();
  const serateFittizie = useSerateFittizie();

  const mergedUpcomingDates = useMemo(() => {
    const custom = serateFittizie
      .map(s => {
        let dateObj;
        try { dateObj = new Date(s.date + 'T00:00:00'); } catch { dateObj = new Date(NaN); }
        return {
          id: s.id,
          dateStr: s.date,
          dow: null,
          dayLabel: s.name,
          venueName: null,
          logoUrl: '',
          dateObj,
        };
      })
      .filter(d => !isNaN(d.dateObj.getTime()));
    return [...custom, ...upcomingDates].sort((a, b) => a.dateObj - b.dateObj);
  }, [upcomingDates, serateFittizie]);

  const handleAddCustom = async (clientObj, name, dateStr) => {
    const exists = serateFittizie.some(s => s.name === name && s.date === dateStr);
    if (!exists) {
      qc.setQueryData(['serate-fittizie'], (old = []) => [...old, { id: 'opt-' + Date.now(), name, date: dateStr }]);
      try { await base44.entities.SerataFittizia.create({ name, date: dateStr }); } catch {}
      qc.invalidateQueries({ queryKey: ['serate-fittizie'] });
    }
    let subtitle = dateStr;
    try { subtitle = format(new Date(dateStr + 'T00:00:00'), 'd MMM yyyy', { locale: it }) + ' · Extra'; } catch {}
    addToPlan(dateStr, { title: name, subtitle }, clientObj);
  };

  if (!user) {
    return (
      <Div className="flex items-center justify-center h-64">
        <Div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </Div>
    );
  }

  return (
    <Div className="space-y-4 pb-10">
      <PageTitle title="Messaggi" />
      <Div className="dash-fade-up">
        <InstagramDMsTab
          semine={semine}
          upcomingDates={mergedUpcomingDates}
          addToPlan={addToPlan}
          onAddCustom={handleAddCustom}
          onAddToSemine={(handle) => {
            setCaptureInitial({ url: `https://instagram.com/${handle}`, name: handle });
            setCaptureOpen(true);
          }}
        />
      </Div>
      <CaptureSeminaDialog
        open={captureOpen}
        onOpenChange={setCaptureOpen}
        promoterId={promoterId}
        initial={captureInitial}
      />
    </Div>
  );
}