// Port di src/pages/Semine.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { base44 } from '@/lib/base44';
import { useAuth } from '@/lib/auth';
import { useViewAsPromoter } from '@/lib/viewAs';
import { chunkedBulk } from '@/legacy/utils/chunkedBulk';
import { fetchIgMessages } from '@/web/lib/igMessages';
import PageTitle from '@/web/components/shared/PageTitle';
import SeminaAgenda from '@/web/components/programmazione/SeminaAgenda';
import SeminaPasteMenu from '@/web/components/programmazione/SeminaPasteMenu';
import ClientSerateMenu from '@/web/components/programmazione/ClientSerateMenu';
import CaptureSeminaDialog from '@/web/components/programmazione/CaptureSeminaDialog';
import EditSeminaDialog from '@/web/components/programmazione/EditSeminaDialog';
import ContactReminderDialog from '@/web/components/client/ContactReminderDialog';
import { useProgrammazionePlan } from '@/web/hooks/useProgrammazionePlan';
import { useUpcomingSerate } from '@/web/hooks/useUpcomingSerate';
import { useSerateFittizie } from '@/web/hooks/useSerateFittizie';
import { usePullToRefresh } from '@/web/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/web/components/shared/PullToRefreshIndicator';
import { preloadImages } from '@/legacy/utils/imageCache';
import { cn } from '@/ui/cn';
import { useToast } from '@/ui/use-toast';
import { parseIgHandle } from '@/legacy/utils/seminaParse';
import { LABEL_TO_KEY, LOCATIONS_SORTED } from '@/web/lib/campaniaLocations';
import ConvertiSeminaDialog from '@/web/components/programmazione/ConvertiSeminaDialog';
import { UserCheck, Undo2 } from '@/ui/icons.generated';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';

const normalizeText = (s) => (s || '').toLowerCase()
  .replace(/[àá]/g, 'a').replace(/[èé]/g, 'e').replace(/[ìí]/g, 'i')
  .replace(/[òó]/g, 'o').replace(/[ùú]/g, 'u')
  .replace(/['']/g, '').replace(/[\/\-]/g, ' ').replace(/\s+/g, ' ').trim();

// Tenta di abbinare una zona testuale (provenienza semina / ai_data.zona) a una
// residenza_key valida del database geografico Campania.
const matchResidenzaKey = (zona) => {
  if (!zona) return null;
  const normalized = normalizeText(zona);
  if (!normalized) return null;
  if (LABEL_TO_KEY[normalized]) return LABEL_TO_KEY[normalized];
  const match = LOCATIONS_SORTED.find(loc => {
    const labelNorm = normalizeText(loc.label);
    return labelNorm.includes(normalized) || normalized.includes(labelNorm);
  });
  return match?.key || null;
};

export default function Semine() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureInitial, setCaptureInitial] = useState({ url: '', name: '' });
  const [editSemina, setEditSemina] = useState(null);
  const [reminderClient, setReminderClient] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [convertSemina, setConvertSemina] = useState(null);
  const [convertLoading, setConvertLoading] = useState(false);
  const [undoData, setUndoData] = useState(null);
  const { toast } = useToast();

  const isAdmin = user?.role === 'admin';
  const { effectivePromoterId: promoterId } = useViewAsPromoter();

  const { data: semine = [], isLoading } = useQuery({
    queryKey: ['semine', promoterId],
    queryFn: () => isAdmin && !promoterId
      ? base44.entities.Semina.list()
      : base44.entities.Semina.filter({ promoter_id: promoterId }),
    enabled: !!user,
    staleTime: 2 * 60000,
    gcTime: 10 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Fetch Instagram messages to build semina_id → conversation_id map for "Vai alla chat"
  const { data: igMessages = [] } = useQuery({
    queryKey: ['instagram-messages', promoterId],
    queryFn: () => fetchIgMessages({ isAdmin, promoterId }),
    enabled: !!user && !isLoading,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const seminaChatMap = useMemo(() => {
    const map = {};
    igMessages.forEach(m => {
      if (m.matched_semina_id && !map[m.matched_semina_id]) {
        map[m.matched_semina_id] = m.conversation_id;
      }
    });
    return map;
  }, [igMessages]);

  useEffect(() => {
    preloadImages(semine.map(s => s.photo_url).filter(Boolean));
  }, [semine]);

  // Realtime: aggiorna le card delle semine live quando cambiano (anche estrazione AI dal sync DM)
  useEffect(() => {
    const unsubscribe = base44.entities.Semina.subscribe(() => {
      qc.invalidateQueries({ queryKey: ['semine'] });
    });
    return unsubscribe;
  }, [qc]);

  // Re-match InstagramMessage records when semine Instagram handles change
  // (moves DMs from "Non abbinati" to "Semine" automatically and marks as read)
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

  const handleConvertSemina = (seminaId) => {
    const s = semine.find(x => x.id === seminaId);
    if (s) setConvertSemina(s);
  };

  const handleConfirmConvert = async (name) => {
    if (!convertSemina) return;
    setConvertLoading(true);
    const seminaSnapshot = convertSemina;
    const ai = seminaSnapshot.ai_data || {};
    const zona = seminaSnapshot.provenienza || ai.zona || '';
    const residenzaKey = matchResidenzaKey(zona);
    const clientData = {
      name,
      promoter_id: promoterId,
      phone: seminaSnapshot.phone || '',
      instagram: seminaSnapshot.instagram ? parseIgHandle(seminaSnapshot.instagram) : '',
      instagram_profile_url: seminaSnapshot.instagram_profile_url || '',
      photo_url: seminaSnapshot.photo_url || '',
      is_leader: true,
      leader_since: new Date().toISOString(),
      is_driver: !!ai.is_driver,
      source_type: seminaSnapshot.platform === 'tiktok' ? 'tiktok' : 'instagram',
      residenza_key: residenzaKey || undefined,
    };
    // Optimistic: rimuovi la semina dalla cache subito (card scompare all'istante)
    qc.setQueryData(['semine', promoterId], (old = []) => old.filter(s => s.id !== seminaSnapshot.id));
    try {
      const created = await base44.entities.Client.create(clientData);
      await base44.entities.Semina.delete(seminaSnapshot.id);
      setUndoData({ semina: seminaSnapshot, clientId: created.id });
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
      qc.invalidateQueries({ queryKey: ['clients'] });
      setConvertSemina(null);
      toast({ title: `${name} convertito in cliente` });
    } catch (err) {
      // Rollback: ripristina la semina nella cache
      qc.setQueryData(['semine', promoterId], (old = []) => [...old, seminaSnapshot]);
      toast({ title: 'Errore conversione', description: err.message, variant: 'destructive' });
    } finally {
      setConvertLoading(false);
    }
  };

  const handleUndoConvert = async () => {
    if (!undoData) return;
    try {
      await base44.entities.Client.delete(undoData.clientId);
      const { id, created_date, updated_date, created_by_id, ...seminaData } = undoData.semina;
      await base44.entities.Semina.create(seminaData);
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
      qc.invalidateQueries({ queryKey: ['clients'] });
      setUndoData(null);
      toast({ title: 'Conversione annullata — semina ripristinata' });
    } catch (err) {
      toast({ title: 'Errore annullamento', description: err.message, variant: 'destructive' });
    }
  };

  const { plan, addToPlan, removeFromPlan } = useProgrammazionePlan(promoterId);
  const { upcomingDates } = useUpcomingSerate();
  const serateFittizie = useSerateFittizie();

  // Deep-link "fast-capture": ?semina_ig=<url>&semina_name=<nome> apre il dialog precompilato
  useEffect(() => {
    const p = new URLSearchParams(webWindow.location.search);
    const igUrl = p.get('semina_ig') || p.get('lead_ig');
    const igName = p.get('semina_name') || p.get('lead_name');
    if (igUrl || igName) {
      setCaptureInitial({ url: igUrl || '', name: igName || '' });
      setCaptureOpen(true);
      const u = new URL(webWindow.location.href);
      u.searchParams.delete('semina_ig');
      u.searchParams.delete('semina_name');
      u.searchParams.delete('lead_ig');
      u.searchParams.delete('lead_name');
      const qs = u.searchParams.toString();
      webWindow.history.replaceState({}, '', u.pathname + (qs ? `?${qs}` : ''));
    }
  }, []);

  // Deep-link "mostra card": ?highlight_semina=<id> scorre ed evidenzia la card
  useEffect(() => {
    const p = new URLSearchParams(webWindow.location.search);
    const hl = p.get('highlight_semina');
    if (hl) {
      setHighlightId(hl);
      const u = new URL(webWindow.location.href);
      u.searchParams.delete('highlight_semina');
      const qs = u.searchParams.toString();
      webWindow.history.replaceState({}, '', u.pathname + (qs ? `?${qs}` : ''));
    }
  }, []);

  const handleDeleteSemina = async (seminaId) => {
    // Optimistic: rimuovi dalla cache subito, rollback su errore
    const prev = qc.getQueryData(['semine', promoterId]);
    qc.setQueryData(['semine', promoterId], (old = []) => old.filter(s => s.id !== seminaId));
    try {
      await base44.entities.Semina.delete(seminaId);
    } catch {
      qc.setQueryData(['semine', promoterId], prev);
      return;
    }
    qc.invalidateQueries({ queryKey: ['semine', promoterId] });
  };

  const handlePasteSeminaPhoto = async (seminaId, url) => {
    qc.setQueriesData({ queryKey: ['semine', promoterId] }, (old) => {
      if (!Array.isArray(old)) return old;
      return old.map(s => s.id === seminaId ? { ...s, photo_url: url } : s);
    });
    try {
      await base44.entities.Semina.update(seminaId, { photo_url: url });
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    } catch (e) {
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    }
  };

  const handleMarkSeminaContacted = async (semina) => {
    const now = new Date().toISOString();
    qc.setQueriesData({ queryKey: ['semine', promoterId] }, (old) => {
      if (!Array.isArray(old)) return old;
      return old.map(s => s.id === semina.id ? { ...s, last_contacted_at: now } : s);
    });
    try {
      await base44.entities.Semina.update(semina.id, { last_contacted_at: now });
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    } catch {
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    }
  };

  const handleToggleSeminaOff = async (semina) => {
    const newOff = !semina.is_off;
    qc.setQueriesData({ queryKey: ['semine', promoterId] }, (old) => {
      if (!Array.isArray(old)) return old;
      return old.map(s => s.id === semina.id ? { ...s, is_off: newOff } : s);
    });
    try {
      await base44.entities.Semina.update(semina.id, { is_off: newOff });
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    } catch {
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    }
  };

  // Merge serate fittizie con serate standard (per il menu contestuale)
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

  const handleRefresh = () => Promise.all([
    qc.refetchQueries({ queryKey: ['semine', promoterId] }),
    qc.refetchQueries({ queryKey: ['instagram-messages', promoterId] }),
  ]);
  const { isRefreshing, pullProgress } = usePullToRefresh(handleRefresh);

  const handleAddToPlan = (semina, dateItem) => {
    if (!dateItem) return;
    let subtitle;
    try { subtitle = format(dateItem.dateObj, 'd MMM yyyy', { locale: it }); } catch { subtitle = dateItem.dateStr; }
    if (dateItem.venueName) subtitle += ` · ${dateItem.venueName}`;
    else if (dateItem.dow === null) subtitle += ' · Extra';
    addToPlan(dateItem.dateStr, { title: `${dateItem.dayLabel}${dateItem.venueName ? ' · ' + dateItem.venueName : ''}`, subtitle }, semina);
  };
  const handleRemoveFromPlan = (semina, dateStr) => removeFromPlan(dateStr, semina.id);
  const handleAddCustom = async (semina, name, dateStr) => {
    const exists = serateFittizie.some(s => s.name === name && s.date === dateStr);
    if (!exists) {
      qc.setQueryData(['serate-fittizie'], (old = []) => [...old, { id: 'opt-' + Date.now(), name, date: dateStr }]);
      try { await base44.entities.SerataFittizia.create({ name, date: dateStr }); } catch {}
      qc.invalidateQueries({ queryKey: ['serate-fittizie'] });
    }
    let subtitle = dateStr;
    try { subtitle = format(new Date(dateStr + 'T00:00:00'), 'd MMM yyyy', { locale: it }) + ' · Extra'; } catch {}
    addToPlan(dateStr, { title: name, subtitle }, semina);
  };
  const handleDeleteFittizia = async (id) => {
    if (!id) return;
    qc.setQueryData(['serate-fittizie'], (old = []) => old.filter(s => s.id !== id));
    try { await base44.entities.SerataFittizia.delete(id); } catch {}
    qc.invalidateQueries({ queryKey: ['serate-fittizie'] });
  };

  if (!user || isLoading) {
    return (
      <Div className="flex items-center justify-center min-h-[60vh]">
        <Div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </Div>
    );
  }

  return (
    <Div className="space-y-4 pb-10">
      <PullToRefreshIndicator isRefreshing={isRefreshing} pullProgress={pullProgress} />
      {undoData && (
        <Div className="flex items-center justify-between gap-3 px-4 py-3 bg-violet-500/15 border border-violet-500/30 rounded-xl backdrop-blur-sm">
          <Div className="flex items-center gap-2 min-w-0">
            <UserCheck className="w-4 h-4 text-violet-400 shrink-0" />
            <P className="text-sm text-foreground truncate">
              <Span className="font-semibold">{undoData.semina.name}</Span> convertito in cliente
            </P>
          </Div>
          <Btn
            button
            onClick={handleUndoConvert}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-500/20 text-violet-200 border border-violet-500/40 hover:bg-violet-500/30 transition-colors">
            <Undo2 className="w-3.5 h-3.5" />Annulla inserimento
          </Btn>
        </Div>
      )}
      <SeminaPasteMenu promoterId={promoterId} onOpenCapture={() => { setCaptureInitial({ url: '', name: '' }); setCaptureOpen(true); }}>
        <PageTitle title="Semine" />
        <Div className="dash-fade-up">
        <SeminaAgenda
            semine={semine}
            promoterId={promoterId}
            plan={plan}
            onOpenCapture={() => { setCaptureInitial({ url: '', name: '' }); setCaptureOpen(true); }}
            onEditSemina={setEditSemina}
            onDeleteSemina={handleDeleteSemina}
            seminaChatMap={seminaChatMap}
            highlightId={highlightId}
            enableHeaderFade
          />
        </Div>
      </SeminaPasteMenu>

      <CaptureSeminaDialog
        open={captureOpen}
        onOpenChange={setCaptureOpen}
        promoterId={promoterId}
        initial={captureInitial}
      />

      <EditSeminaDialog
        open={!!editSemina}
        onOpenChange={(v) => { if (!v) setEditSemina(null); }}
        semina={editSemina}
        promoterId={promoterId}
      />

      <ConvertiSeminaDialog
        open={!!convertSemina}
        onOpenChange={(v) => { if (!v) setConvertSemina(null); }}
        semina={convertSemina}
        onConfirm={handleConfirmConvert}
        isLoading={convertLoading}
      />

      <ContactReminderDialog
        client={reminderClient}
        promoterId={promoterId}
        open={!!reminderClient}
        onOpenChange={(v) => { if (!v) setReminderClient(null); }}
      />

      <ClientSerateMenu
        upcomingDates={mergedUpcomingDates}
        onAdd={handleAddToPlan}
        onRemove={handleRemoveFromPlan}
        onAddCustom={handleAddCustom}
        onDeleteFittizia={isAdmin ? handleDeleteFittizia : undefined}
        plan={plan}
        onMarkSeminaContacted={handleMarkSeminaContacted}
        onSetReminder={(c) => setReminderClient(c)}
        onToggleSeminaOff={handleToggleSeminaOff}
        onPasteSeminaPhoto={handlePasteSeminaPhoto}
        onConvertSemina={handleConvertSemina}
        getSemina={(id) => semine.find(s => s.id === id)}
      />
    </Div>
  );
}