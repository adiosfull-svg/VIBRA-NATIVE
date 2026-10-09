// Port di src/components/client/ClientDetailDialog.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import CachedImage from '@/web/components/shared/CachedImage';
// Dialog sostituito con overlay custom (stesso pattern di AttendanceHubDialog):
// overlay custom centrato (popup, stesse proprietà di ClientFormDialog/ImportaClientiDialog:
// overlay bg-black/80, max-h 100dvh-2rem, zoom-in); overflow-hidden confina tutto il contenuto.
// Evita i conflitti CSS dell'override Radix (top/transform) che causavano lo sforamento.
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/menu';
import { Star, TrendingUp, Calendar, Users, Pencil, MapPin, ArrowLeft, Award, History, X, Gem, Image as ImageIcon, Loader2, Check, AlertCircle, Cake, Undo2 } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { format, parseISO, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { it } from 'date-fns/locale';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from '@/ui/recharts';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { BADGE_META } from '@/legacy/utils/clientBadges';
import { computeClientRanking, rankingColor } from '@/legacy/utils/clientRanking';
import { computeClientTrend } from '@/legacy/utils/clientTrend';
import TrendBadge from '@/web/components/client/TrendBadge';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import { ClientSourceBadge } from '@/web/components/client/ClientSourceDisplay';
import ClientSourceSelector from '@/web/components/client/ClientSourceDisplay';
import ClientSkillRadar from '@/web/components/client/ClientSkillRadar';
import ClientRatingHistory from '@/web/components/client/ClientRatingHistory';
import QuickContactEdit from '@/web/components/client/QuickContactEdit';
import QuickNoteEdit from '@/web/components/client/QuickNoteEdit';
import ClientGroupsBox from '@/web/components/client/ClientGroupsBox';
import ClientLocationSelector from '@/web/components/client/ClientLocationSelector';
import ClientTipologiaSelector, { normalizeTipologia, TIPOLOGIE, ClientStatoSelector, getStatoMeta } from '@/web/components/client/ClientTipologiaSelector';
import ClientBirthDateEditor from '@/web/components/client/ClientBirthDateEditor';
import { calculateAge } from '@/legacy/utils/clientAge';
import ClientReferralsBox from '@/web/components/client/ClientReferralsBox';
import { LOCATION_BY_KEY } from '@/web/lib/campaniaLocations';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import { useOverlay } from '@/web/lib/overlayStackContext';
import { lockScroll } from '@/web/lib/scrollLock';

import { Btn, Div, P, Span } from '@/ui/html';
import { Circle, Defs, Path, Rect, Stop, Svg, SvgLinearGradient } from '@/ui/elements';

import { doc as webDocument, nav as webNavigator, win as webWindow } from '@/web/shims/dom';

const BADGE_LEGEND = [
  { icon: '🏅', label: 'Fedeltà', desc: 'Più presenze' },
  { icon: '💰', label: 'Rendita', desc: 'Più spesa nel tempo' },
  { icon: '💎', label: 'Spender', desc: 'Spesa media più alta in serata' },
  { icon: '🤝', label: 'Aggregatore', desc: 'Chi ha portato più amici' },
];

const tooltipStyle = {
  background: 'hsl(240 6% 8%)',
  border: '1px solid hsl(240 5% 18%)',
  borderRadius: '6px',
  fontSize: 11,
  color: '#fff',
};

const DAY_LABELS = { 5: 'Venerdì', 6: 'Sabato', 0: 'Domenica' };

export default function ClientDetailDialog({ open, onOpenChange, client, attendances = [], events = [], badges = [], allClients = [], groups = [], onClientUpdated, onClientDetail, onBack, embeddedInDialog = false, closeRef }) {
  // Animazione apertura/uscita: gestiamo l'open internamente così l'overlay resta
  // montato durante il fade-out (transition-opacity 200ms) e notifichiamo il
  // parent solo a fine animazione. Inizializza a false così il primo render è
  // opacity-0, poi l'effect setInternalOpen(open) fa partire il fade-in.
  const [internalOpen, setInternalOpen] = useState(false);
  const closeTimer = useRef(null);
  // Scagliona il mount dei grafici Recharts: il primo frame monta solo
  // header + info + KPI (scroll fluido), poi entrano i chart uno alla volta.
  const [chartTier, setChartTier] = useState(0);
  useEffect(() => {
    if (!internalOpen) {
      // Non smontare i grafici durante il fade-out: lo smontaggio dei
      // ResponsiveContainer di Recharts è costoso e causa jank visivo durante
      // la transizione di opacità. Ritardiamo a fade-out completato.
      const t = setTimeout(() => setChartTier(0), 300);
      return () => clearTimeout(t);
    }
    // Tutto simultaneo: nessuno scaglionamento, apre tutto insieme.
    setChartTier(4);
  }, [internalOpen]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);
  useEffect(() => { setInternalOpen(open); }, [open]);
  const handleOpenChange = (v) => {
    if (v) { setInternalOpen(true); onOpenChange?.(true); return; }
    setInternalOpen(false);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => onOpenChange?.(false), 220);
  };
  // Ref sempre aggiornato alla closure corrente di handleOpenChange, così
  // l'handler popstate (back Android) può chiamarla con il fade-out di 220ms
  // invece di chiudere di netto bypassando l'animazione di uscita.
  const handleOpenChangeRef = useRef(handleOpenChange);
  useEffect(() => { handleOpenChangeRef.current = handleOpenChange; });
  // Expose fade-close to parent (dialog stack / onBack) così il back Android
  // e onBack passano dal fade di 220ms invece di chiudere di netto.
  useEffect(() => {
    if (closeRef) closeRef.current = () => handleOpenChangeRef.current(false);
  });

  // Usa le presenze già caricate dal parent (attendances prop) — nessuna
  // query aggiuntiva al backend, zero lag all'apertura del dialog.
  const ca = useMemo(
    () => client ? attendances.filter(a => a.client_id === client.id) : [],
    [client, attendances]
  );

  // Mappa eventi O(1) invece di events.find() lineare per ogni presenza
  const eventsById = useMemo(() => Object.fromEntries(events.map(e => [e.id, e])), [events]);

  const enriched = useMemo(() => ca.map(a => {
    const ev = eventsById[a.event_id];
    return { ...a, event: ev };
  }).filter(x => x.event?.date).sort((a, b) => a.event.date.localeCompare(b.event.date)), [ca, eventsById]);

  const totalSpent = enriched.reduce((s, a) => s + (a.revenue || 0), 0);
  const avgSpent = enriched.length > 0 ? Math.round(totalSpent / enriched.length) : 0;

  const monthlyData = useMemo(() => {
    const now = new Date();
    // Pre-parsa le date una sola volta (evita parseISO ad ogni filtro)
    const dated = enriched.map(a => ({ a, t: parseISO(a.event.date).getTime() }));
    return Array.from({ length: 12 }, (_, i) => {
      const base = subMonths(now, 11 - i);
      const mStart = startOfMonth(base).getTime();
      const mEnd = endOfMonth(base).getTime();
      const label = format(base, 'MMM yy', { locale: it });
      let spent = 0, visits = 0;
      for (const { a, t } of dated) {
        if (t >= mStart && t <= mEnd) {
          spent += a.revenue || 0;
          visits++;
        }
      }
      return { label, spent, visits };
    });
  }, [enriched]);

  const byVenue = useMemo(() => {
    const map = {};
    enriched.forEach(a => {
      if (a.event.is_extra) {
      const key = '__extra__';
      if (!map[key]) map[key] = { venue: 'Extra / Festivi', logoVenue: 'Extra / Festivi', spent: 0, visits: 0 };
        map[key].spent += a.revenue || 0;
        map[key].visits++;
      } else {
        const venue = a.event.venue || a.event.physical_location || 'N/D';
        if (!map[venue]) map[venue] = { venue, logoVenue: venue, spent: 0, visits: 0 };
        map[venue].spent += a.revenue || 0;
        map[venue].visits++;
      }
    });
    return Object.values(map).sort((a, b) => b.spent - a.spent);
  }, [enriched]);

  const byDay = useMemo(() => {
    const map = { Venerdì: 0, Sabato: 0, Domenica: 0, Extra: 0 };
    enriched.forEach(a => {
      if (a.event.is_extra) { map.Extra++; return; }
      const [y, m, d] = a.event.date.split('-').map(Number);
      const dow = new Date(y, m - 1, d).getDay();
      const label = DAY_LABELS[dow];
      if (label) map[label]++;
    });
    return Object.entries(map).map(([day, count]) => ({ day, count })).filter(x => x.count > 0);
  }, [enriched]);

  const ranking = useMemo(() => {
    if (!client) return null;
    return computeClientRanking(client, {
      visits: enriched.length,
      avgSpent: enriched.length > 0 ? Math.round(enriched.reduce((s, a) => s + (a.revenue || 0), 0) / enriched.length) : 0,
      attendances: enriched,
    }, events, eventsById);
  }, [client, enriched, events, eventsById]);

  const trend = useMemo(() => {
    if (!client) return null;
    return computeClientTrend(client.id, ca, events);
  }, [client, ca, events]);

  const { getVenueLogo } = useAllVenueLogos();

  const queryClient = useQueryClient();
  const [sourceEditOpen, setSourceEditOpen] = useState(false);
  const [savingSource, setSavingSource] = useState(false);
  const [locationEditOpen, setLocationEditOpen] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  // Stato locale per aggiornamento immediato senza dover chiudere/riaprire
  const [localSourceType, setLocalSourceType] = useState(client?.source_type);
  const [localReferredByClientId, setLocalReferredByClientId] = useState(client?.referred_by_client_id);
  // Merge locale per i contatti salvati da QuickContactEdit
  const [localClient, setLocalClient] = useState(client);

  const [savingDriver, setSavingDriver] = useState(false);
  const [savingLeader, setSavingLeader] = useState(false);
  const [tipologiaEditOpen, setTipologiaEditOpen] = useState(false);
  const [savingTipologia, setSavingTipologia] = useState(false);
  const [statoEditOpen, setStatoEditOpen] = useState(false);
  const [savingStato, setSavingStato] = useState(false);
  const [birthDateEditOpen, setBirthDateEditOpen] = useState(false);
  const [savingBirthDate, setSavingBirthDate] = useState(false);
  const [pastingPhoto, setPastingPhoto] = useState(false);
  // I menu a comparsa (status, locale, fonte, tipologia, data di nascita) sono Popover Radix: su touch
  // si chiudono solo al `click` successivo al tocco fuori, mentre il dialog parte con il fade-out già al
  // pointerdown (e con back/ESC non c'è nessun tocco fuori). Risultato: il menu restava aperto e spariva
  // con un attimo di ritardo. Appena il dialog inizia a chiudersi li chiudiamo tutti nello stesso istante.
  useEffect(() => {
    if (internalOpen) return;
    setStatoEditOpen(false);
    setLocationEditOpen(false);
    setSourceEditOpen(false);
    setTipologiaEditOpen(false);
    setBirthDateEditOpen(false);
  }, [internalOpen]);
  const [pastePhotoStatus, setPastePhotoStatus] = useState(null); // null | 'success' | 'error' | 'restored'
  const [undoPhoto, setUndoPhoto] = useState(null); // { prev } → foto precedente da ripristinare dopo un incolla

  // Ref per la callback del parent (onBack è arrow ricreata a ogni render).
  // Usandola via ref, l'effect del backspace re-runnano solo quando cambia
  // `open` — non ad ogni salvataggio di un campo rapido.
  const onBackRef = useRef(onBack);
  useEffect(() => { onBackRef.current = onBack; }, [onBack]);

  // Sincronizza lo stato locale quando cambia il client prop (es. cambio cliente)
  useEffect(() => {
    setLocalSourceType(client?.source_type);
    setLocalReferredByClientId(client?.referred_by_client_id);
    setLocalClient(client);
  }, [client?.id, client?.source_type, client?.referred_by_client_id]);

  // Optimistic: aggiorna subito il cliente nella cache React Query così la
  // lista Clienti si aggiorna istantaneamente (badge leader, tipologia, foto,
  // fonte, residenza...) senza aspettare il refetch backend.
  const optimisticClientUpdate = (updates) => {
    queryClient.setQueriesData({ queryKey: ['clients'] }, (old) =>
      Array.isArray(old) ? old.map(c => c.id === client.id ? { ...c, ...updates } : c) : old
    );
  };

  const handleToggleDriver = async () => {
    if (savingDriver) return;
    setSavingDriver(true);
    const newVal = !localClient?.is_driver;
    const updated = { ...localClient, is_driver: newVal };
    setLocalClient(updated);
    try {
      await base44.entities.Client.update(client.id, { is_driver: newVal });
      optimisticClientUpdate({ is_driver: newVal });
      onClientUpdated?.(updated);
    } finally {
      setSavingDriver(false);
    }
  };

  const handleToggleLeader = async () => {
    if (savingLeader) return;
    setSavingLeader(true);
    const newVal = !localClient?.is_leader;
    const leaderSince = newVal ? new Date().toISOString() : null;
    const updated = { ...localClient, is_leader: newVal, leader_since: leaderSince };
    setLocalClient(updated);
    try {
      await base44.entities.Client.update(client.id, { is_leader: newVal, leader_since: leaderSince });
      optimisticClientUpdate({ is_leader: newVal, leader_since: leaderSince });
      onClientUpdated?.(updated);
    } finally {
      setSavingLeader(false);
    }
  };

  const handleContactSaved = (updateData) => {
    const updated = localClient ? { ...localClient, ...updateData } : localClient;
    setLocalClient(updated);
    onClientUpdated?.(updated);
  };

  // Incolla foto profilo dagli appunti (clipboard API). Optimistic: aggiorna
  // subito l'avatar locale, poi persiste su backend. Mostra stato visivo.
  const handlePastePhoto = async () => {
    if (pastingPhoto) return;
    setPastePhotoStatus(null);
    try {
      const items = await webNavigator.clipboard.read();
      const imageItem = items.find(item => item.types.some(t => t.startsWith('image/')));
      if (!imageItem) {
        setPastePhotoStatus('error');
        setTimeout(() => setPastePhotoStatus(null), 2500);
        return;
      }
      const imageType = imageItem.types.find(t => t.startsWith('image/'));
      const blob = await imageItem.getType(imageType);
      const file = new File([blob], 'photo.jpg', { type: imageType });
      setPastingPhoto(true);
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      const prevPhoto = localClient?.photo_url || client?.photo_url || '';
      await base44.entities.Client.update(client.id, { photo_url: file_url });
      setUndoPhoto({ prev: prevPhoto }); // abilita "Annulla caricamento" finché il dialog resta aperto
      const updated = { ...localClient, photo_url: file_url };
      setLocalClient(updated);
      onClientUpdated?.(updated);
      optimisticClientUpdate({ photo_url: file_url });
      setPastePhotoStatus('success');
      setTimeout(() => setPastePhotoStatus(null), 2000);
    } catch (err) {
      setPastePhotoStatus('error');
      setTimeout(() => setPastePhotoStatus(null), 2500);
    } finally {
      setPastingPhoto(false);
    }
  };

  // Annulla l'ultimo incolla foto: ripristina la foto che c'era prima (o nessuna foto, se non c'era).
  const handleUndoPhoto = async () => {
    if (!undoPhoto || pastingPhoto) return;
    const prev = undoPhoto.prev || '';
    setPastingPhoto(true);
    try {
      await base44.entities.Client.update(client.id, { photo_url: prev });
      const updated = { ...localClient, photo_url: prev };
      setLocalClient(updated);
      onClientUpdated?.(updated);
      optimisticClientUpdate({ photo_url: prev });
      setUndoPhoto(null);
      setPastePhotoStatus('restored');
      setTimeout(() => setPastePhotoStatus(null), 2000);
    } catch (err) {
      setPastePhotoStatus('error');
      setTimeout(() => setPastePhotoStatus(null), 2500);
    } finally {
      setPastingPhoto(false);
    }
  };

  // L'annullamento vale solo per il cliente corrente e finché il dialog è aperto
  useEffect(() => { setUndoPhoto(null); }, [client?.id, open]);

  // Tasto Backspace per tornare indietro (solo quando il dialog è aperto e c'è onBack)
  useEffect(() => {
    if (!open || !onBackRef.current) return;
    const handler = (e) => {
      if (e.key === 'Backspace' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(webDocument.activeElement?.tagName)) {
        e.preventDefault();
        onBackRef.current();
      }
    };
    webWindow.addEventListener('keydown', handler);
    return () => webWindow.removeEventListener('keydown', handler);
  }, [open]);

  // Stack overlay centralizzato: il back button chiude solo questo dialog (non
  // il genitore). Sempre attivo (anche quando annidato nel hub Aggiungi Presenze):
  // così il detail entra nello stack globale SOPRA il hub e un solo back chiude
  // solo il detail, lasciando il hub aperto.
  useOverlay(open, () => handleOpenChangeRef.current(false));

  // Scroll lock custom overlay: blocca sia body che html (lo scroll della pagina
  // Clienti vive su html per via di overflow-y:scroll in index.css).
  // Usa `open` (non `internalOpen`): lo scroll-lock resta attivo per tutta
  // la durata del fade-out (220ms) e viene rilasciato solo quando il parent
  // setta open=false. Se usassimo `internalOpen` (che diventa false subito al
  // click di chiusura), il reflow della pagina scatenato dal ripristino di
  // overflow avvenrebbe DURANTE il fade-out → flash/micro-lag visibile,
  // soprattutto con la lista clienti scrollata a righe 50/60+ (680 righe
  // desktop non virtualizzate da re-layoutare).
  useEffect(() => {
    if (!open) return;
    return lockScroll();
  }, [open]);

  // ESC chiude sempre il dettaglio cliente su desktop (tastiera fisica).
  // Usa handleOpenChangeRef per passare dal fade-out di 220ms come il back.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleOpenChangeRef.current(false);
      }
    };
    webWindow.addEventListener('keydown', onKey);
    return () => webWindow.removeEventListener('keydown', onKey);
  }, [open]);

  if (!client) return null;

  const initials = client.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleSourceChange = async ({ sourceType, referredClientId }) => {
    // Aggiorna subito l'UI locale
    setLocalSourceType(sourceType);
    setLocalReferredByClientId(referredClientId);
    setSavingSource(true);
    try {
      await base44.entities.Client.update(client.id, {
        source_type: sourceType,
        referred_by_client_id: referredClientId,
      });
      optimisticClientUpdate({ source_type: sourceType, referred_by_client_id: referredClientId });
    } finally {
      setSavingSource(false);
    }
  };

  // NB: pointer-events-none dipende da `open` (prop del parent), NON da internalOpen.
  // Durante il fade-out (220ms) l'overlay deve continuare a intercettare i tocchi,
  // altrimenti il click sintetico che segue il pointerdown di chiusura "atterra"
  // sugli elementi della pagina sotto (righe cliente, bottoni) e li attiva.
  return createPortal(
    <Div
      className={`fixed inset-0 z-[10000] flex items-center justify-center max-sm:pt-[env(safe-area-inset-top)] max-sm:pb-[env(safe-area-inset-bottom)] sm:p-8 ${open ? '' : 'pointer-events-none'}`}>
      <Div
        style={{ transform: 'translateZ(0)' }}
        className={`fixed inset-0 bg-black/80 touch-none ${internalOpen ? 'opacity-100' : 'opacity-0 transition-opacity duration-200'}`}
        onPointerDown={(e) => { if (e.target === e.currentTarget) handleOpenChange(false); }} />
      <Div className={`relative w-full max-sm:w-[calc(100%-1.5rem)] max-sm:rounded-2xl max-sm:max-h-[calc(100dvh-7rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] sm:h-full bg-gradient-to-b from-background to-background/95 border border-border/50 shadow-lg flex flex-col overflow-hidden [will-change:transform,opacity] [backface-visibility:hidden] transition-[transform,opacity] duration-200 sm:max-w-2xl sm:max-h-[90vh] sm:rounded-2xl ${internalOpen ? 'opacity-100' : 'opacity-0 scale-95'}`}>
        {/* Header persistente */}
        <Div className="shrink-0 border-b border-border/40 bg-gradient-to-r from-secondary/15 to-transparent px-4 py-3 flex flex-col gap-2">
          {/* Riga 1: foto, nome completo, leader, rating, chiudi */}
          <Div className="flex items-center gap-2">
          {onBack && (
            <Btn
              button
              onClick={(e) => { e.stopPropagation(); onBack(); }}
              className="p-1 -ml-1 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              accessibilityLabel="Torna alla lista ricontatti">
              <ArrowLeft className="w-4 h-4" />
            </Btn>
          )}
          <ClientAvatar client={localClient || client} initials={initials} size="lg" />
          <Span className="font-semibold break-words leading-tight min-w-0">{client.name}</Span>
          {client.is_leader && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />}
          {ranking !== null && (
            <Span className={`inline-flex items-center gap-1 text-sm font-bold shrink-0 ${rankingColor(ranking)}`}>
              <Gem className="w-4 h-4" />{ranking.toFixed(1)}
            </Span>
          )}
          <Btn
            button
            onClick={() => handleOpenChange(false)}
            className="ml-auto text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary/60 shrink-0"
            accessibilityLabel="Chiudi">
            <X className="w-4 h-4" />
          </Btn>
          </Div>
          {/* Riga 2: badge andamento, status attività, incolla foto */}
          <Div className="flex flex-wrap items-center gap-1.5">
          <TrendBadge trend={trend} />
          {/* Status pagante — modificabile (letto dall'Analisi Intelligente). Vuoto = Attivo. */}
          <Popover open={statoEditOpen} onOpenChange={setStatoEditOpen}>
            <PopoverTrigger asChild>
              <Btn
                button
                disabled={savingStato}
                className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full transition-all shrink-0 disabled:opacity-50 ${getStatoMeta(localClient?.stato_pagante).chip}`}
                accessibilityLabel={getStatoMeta(localClient?.stato_pagante).label}>
                {React.createElement(getStatoMeta(localClient?.stato_pagante).Icon, { className: 'w-3 h-3 shrink-0' })}
                <Span>{getStatoMeta(localClient?.stato_pagante).label}</Span>
              </Btn>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3" align="start">
              <P className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Status pagante</P>
              <ClientStatoSelector
                value={localClient?.stato_pagante}
                onChange={async (v) => {
                  if (savingStato) return;
                  setSavingStato(true);
                  try {
                    await base44.entities.Client.update(client.id, { stato_pagante: v });
                    const updated = localClient ? { ...localClient, stato_pagante: v } : { ...client, stato_pagante: v };
                    setLocalClient(updated);
                    onClientUpdated?.(updated);
                    optimisticClientUpdate({ stato_pagante: v });
                    setStatoEditOpen(false);
                  } finally {
                    setSavingStato(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
          <Btn
            button
            onClick={handlePastePhoto}
            disabled={pastingPhoto}
            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-secondary/40 hover:bg-secondary/60 transition-colors shrink-0 disabled:opacity-50"
            accessibilityLabel="Incolla foto profilo dagli appunti">
            {pastingPhoto ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
            ) : (pastePhotoStatus === 'success' || pastePhotoStatus === 'restored') ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : pastePhotoStatus === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <Span>{pastingPhoto ? 'Attendi...' : pastePhotoStatus === 'success' ? 'Fatto' : pastePhotoStatus === 'restored' ? 'Foto ripristinata' : pastePhotoStatus === 'error' ? 'Errore' : 'Incolla foto'}</Span>
          </Btn>
          {undoPhoto && (
            <Btn
              button
              onClick={handleUndoPhoto}
              disabled={pastingPhoto}
              className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-colors shrink-0 disabled:opacity-50"
              accessibilityLabel="Annulla l'ultimo incolla e ripristina la foto precedente">
              <Undo2 className="w-3 h-3" />
              <Span>Annulla caricamento</Span>
            </Btn>
          )}
          </Div>
        </Div>
        {/* Content scrollabile, confinato da overflow-hidden del contenitore */}
        <Div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain p-4 space-y-3 sm:space-y-4">

        {/* Info cliente — Riga 1: contatti + provenienza */}
        <Div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <QuickContactEdit client={localClient} onSaved={handleContactSaved} />
          {/* Residenza — modificabile */}
          <Popover open={locationEditOpen} onOpenChange={setLocationEditOpen}>
            <PopoverTrigger asChild>
              <Btn
                button
                className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-50"
                disabled={savingLocation}>
                {localClient?.residenza_key && LOCATION_BY_KEY[localClient.residenza_key] ? (
                  <Span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-100 rounded-full px-2.5 py-1" style={{ background: '#3b0764' }}>
                    <MapPin className="w-3 h-3 text-violet-300" />
                    {LOCATION_BY_KEY[localClient.residenza_key].label}
                  </Span>
                ) : (
                  <Span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary/40 rounded-full px-2 py-1">
                    <MapPin className="w-2.5 h-2.5" />
                    Zona di residenza
                  </Span>
                )}
              </Btn>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3" align="start">
              <ClientLocationSelector
                value={localClient?.residenza_key}
                onChange={async (key) => {
                  setSavingLocation(true);
                  try {
                    await base44.entities.Client.update(client.id, { residenza_key: key });
                    const updated = localClient ? { ...localClient, residenza_key: key } : { ...client, residenza_key: key };
                    setLocalClient(updated);
                    onClientUpdated?.(updated);
                    optimisticClientUpdate({ residenza_key: key });
                  } finally {
                    setSavingLocation(false);
                    setLocationEditOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
          {/* Fonte modificabile */}
          <Popover open={sourceEditOpen} onOpenChange={setSourceEditOpen}>
            <PopoverTrigger asChild>
              <Btn
                button
                className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-50"
                disabled={savingSource}>
                {localSourceType ? (
                  <ClientSourceBadge
                    sourceType={localSourceType}
                    referredClientName={localReferredByClientId ? allClients.find(c => c.id === localReferredByClientId)?.name : null}
                  />
                ) : (
                  <Span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary/40 rounded-full px-2 py-1">
                    <Pencil className="w-2.5 h-2.5" />Dove l'ho conosciuto
                  </Span>
                )}
              </Btn>
            </PopoverTrigger>
            <PopoverContent
              className="w-72 p-3"
              align="start"
              onFocusOutside={(e) => e.preventDefault()}
            >
              <ClientSourceSelector
                value={localSourceType}
                referredClientId={localReferredByClientId}
                clients={allClients.filter(c => c.id !== client.id)}
                onChange={({ sourceType, referredClientId }) => {
                  handleSourceChange({ sourceType, referredClientId });
                }}
              />
            </PopoverContent>
          </Popover>

        </Div>
        {/* Riga 2: attributi cliente */}
        <Div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {/* Toggle guidatore */}
          <Btn
            button
            onClick={handleToggleDriver}
            disabled={savingDriver}
            className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full transition-all ${
              localClient?.is_driver
                ? 'bg-blue-500/15 text-blue-300 hover:bg-blue-500/25'
                : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/60'
            }`}>
            <Svg
              viewBox="0 0 24 12"
              width="18"
              height="9"
              fill="none"
              style={{flexShrink:0}}>
              <Rect x="1" y="5" width="22" height="6" rx="2" fill={localClient?.is_driver ? '#3b82f6' : 'currentColor'} opacity={localClient?.is_driver ? 1 : 0.5}/>
              <Path d="M4 5 L6.5 1.5 L17.5 1.5 L20 5 Z" fill={localClient?.is_driver ? '#60a5fa' : 'currentColor'} opacity={localClient?.is_driver ? 1 : 0.4}/>
              <Circle cx="6" cy="11" r="1.8" fill={localClient?.is_driver ? '#1e3a5f' : '#222'} stroke={localClient?.is_driver ? '#93c5fd' : '#666'} strokeWidth="0.8"/>
              <Circle cx="18" cy="11" r="1.8" fill={localClient?.is_driver ? '#1e3a5f' : '#222'} stroke={localClient?.is_driver ? '#93c5fd' : '#666'} strokeWidth="0.8"/>
            </Svg>
            <Span>{localClient?.is_driver ? 'Guidatore' : 'Non guidatore'}</Span>
          </Btn>

          {/* Toggle leader */}
          <Btn
            button
            onClick={handleToggleLeader}
            disabled={savingLeader}
            className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full transition-all ${
              localClient?.is_leader
                ? 'bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/25'
                : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/60'
            }`}>
            <Star className={`w-3 h-3 ${localClient?.is_leader ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            <Span>{localClient?.is_leader ? 'Leader' : 'Non leader'}</Span>
          </Btn>

          {/* Tipologia caratteriale — modificabile */}
          <Popover open={tipologiaEditOpen} onOpenChange={setTipologiaEditOpen}>
            <PopoverTrigger asChild>
              <Btn
                button
                disabled={savingTipologia}
                className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full transition-all ${
                  normalizeTipologia(localClient?.tipologia_cliente).length > 0
                    ? 'bg-violet-500/15 text-violet-300 hover:bg-violet-500/25'
                    : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/60'
                }`}>
                {normalizeTipologia(localClient?.tipologia_cliente).map(t => {
                  const meta = TIPOLOGIE.find(x => x.value === t);
                  return meta ? <meta.Icon key={t} className="w-3 h-3" /> : null;
                })}
                <Span>{(() => {
                  const tipologie = normalizeTipologia(localClient?.tipologia_cliente);
                  return tipologie.length > 0
                    ? tipologie.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')
                    : 'Tipologia';
                })()}</Span>
              </Btn>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3" align="start">
              <ClientTipologiaSelector
                value={localClient?.tipologia_cliente}
                onChange={async (v) => {
                  setSavingTipologia(true);
                  try {
                    await base44.entities.Client.update(client.id, { tipologia_cliente: v });
                    const updated = localClient ? { ...localClient, tipologia_cliente: v } : { ...client, tipologia_cliente: v };
                    setLocalClient(updated);
                    onClientUpdated?.(updated);
                    optimisticClientUpdate({ tipologia_cliente: v });
                  } finally {
                    setSavingTipologia(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Età — modificabile */}
          <Popover open={birthDateEditOpen} onOpenChange={setBirthDateEditOpen}>
            <PopoverTrigger asChild>
              <Btn
                button
                disabled={savingBirthDate}
                className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full transition-all disabled:opacity-50 ${
                  localClient?.data_nascita
                    ? 'bg-blue-500/15 text-blue-300 hover:bg-blue-500/25'
                    : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/60'
                }`}>
                <Cake className="w-3 h-3" />
                <Span>{(() => {
                  const age = calculateAge(localClient?.data_nascita);
                  return age ? age.label : 'Età?';
                })()}</Span>
              </Btn>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3" align="start" onFocusOutside={(e) => e.preventDefault()}>
              <ClientBirthDateEditor
                value={localClient?.data_nascita || ''}
                onChange={async (v) => {
                  const updated = localClient ? { ...localClient, data_nascita: v } : { ...client, data_nascita: v };
                  setLocalClient(updated);
                  const isValid = v === '' || /^\d{4}$/.test(v) || /^\d{4}-\d{2}-\d{2}$/.test(v);
                  if (!isValid) return;
                  setSavingBirthDate(true);
                  try {
                    await base44.entities.Client.update(client.id, { data_nascita: v });
                    onClientUpdated?.(updated);
                    optimisticClientUpdate({ data_nascita: v });
                  } finally {
                    setSavingBirthDate(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </Div>

        {/* Badge riconoscimenti */}
        {badges.length > 0 && (
          <Div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/12 to-transparent p-3 space-y-2 shadow-xl shadow-amber-500/10">
            <SectionHeader icon={Award} title="Riconoscimenti" color="#fbbf24" />
            <Div className="flex flex-wrap gap-1.5">
              {badges.map((badge, i) => {
                const meta = BADGE_META[badge];
                return (
                  <Span key={i} className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg border ${meta?.color}`}>
                    <Span className="text-sm">{badge}</Span>
                    <Span>{meta?.label}</Span>
                  </Span>
                );
              })}
            </Div>
            {/* Leggenda */}
            <Div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-border/50">
              {BADGE_LEGEND.map(({ icon, label, desc }) => (
                <Div key={icon} className="flex items-start gap-1.5">
                  <Span className="text-sm leading-none mt-0.5">{icon}</Span>
                  <Div>
                    <P className="text-[10px] font-semibold text-foreground">{label}</P>
                    <P className="text-[10px] text-muted-foreground">{desc}</P>
                  </Div>
                </Div>
              ))}
            </Div>
          </Div>
        )}

        {/* Note cliente — modifica rapida inline */}
        <QuickNoteEdit client={localClient} onSaved={handleContactSaved} />

        {/* Gruppi del cliente — espandibile per vedere i membri */}
        <ClientGroupsBox client={localClient || client} groups={groups} allClients={allClients} onClientDetail={onClientDetail} />

        {/* Persone portate (referrals) — box espandibile */}
        <ClientReferralsBox client={localClient || client} allClients={allClients} />

        {/* KPI */}
        <Div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-2.5 sm:p-3 text-center shadow-md shadow-emerald-500/5">
            <P className="text-[9px] sm:text-[10px] text-emerald-400/80 uppercase tracking-wider mb-1 font-semibold">Presenze</P>
            <P className="text-xl sm:text-2xl font-bold text-green-400">{enriched.length}</P>
          </Div>
          <Div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20 p-2.5 sm:p-3 text-center shadow-md shadow-violet-500/5">
            <P className="text-[9px] sm:text-[10px] text-violet-400/80 uppercase tracking-wider mb-1 font-semibold">Spesa Totale</P>
            <P className="text-xl sm:text-2xl font-bold text-primary">€{totalSpent.toLocaleString('it-IT')}</P>
          </Div>
          <Div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 p-2.5 sm:p-3 text-center shadow-md shadow-amber-500/5">
            <P className="text-[9px] sm:text-[10px] text-amber-400/80 uppercase tracking-wider mb-1 font-semibold">Media/Serata</P>
            <P className="text-xl sm:text-2xl font-bold text-amber-300">€{avgSpent.toLocaleString('it-IT')}</P>
          </Div>
        </Div>

        {/* Spider chart skill */}
        {chartTier >= 1 && allClients.length > 0 && (
          <ClientSkillRadar
            client={client}
            allClients={allClients}
            allAttendances={attendances}
            allEvents={events}
          />
        )}

        {/* Grafico mensile spesa */}
        {chartTier >= 2 && enriched.length > 0 && (
          <Div className="rounded-xl bg-gradient-to-b from-card to-card/80 border border-border/60 p-3 sm:p-4 space-y-2 shadow-lg shadow-violet-500/10">
            <SectionHeader icon={TrendingUp} title="Andamento Spesa (12 mesi)" color="#a78bfa" />
            <Div className="h-32 sm:h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <Defs>
                    <SvgLinearGradient id="grad-client" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <Stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </SvgLinearGradient>
                  </Defs>
                  <XAxis dataKey="label" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [`€${Number(v).toLocaleString('it-IT')}`, 'Spesa']} />
                  <Area type="monotone" dataKey="spent" stroke="#8b5cf6" strokeWidth={2} fill="url(#grad-client)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Div>
          </Div>
        )}

        {/* Grafico mensile presenze */}
        {chartTier >= 3 && enriched.length > 0 && (
          <Div className="rounded-xl bg-gradient-to-b from-card to-card/80 border border-border/60 p-3 sm:p-4 space-y-2 shadow-lg shadow-emerald-500/10">
            <SectionHeader icon={Users} title="Andamento Presenze (12 mesi)" color="#4ade80" />
            <Div className="h-28 sm:h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="label" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis hide allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [v, 'Presenze']} />
                  <Bar dataKey="visits" fill="hsl(150 60% 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Div>
          </Div>
        )}

        {/* Presenze per giorno settimana */}
        {chartTier >= 4 && byDay.length > 0 && (
          <Div className="rounded-xl bg-gradient-to-b from-card to-card/80 border border-border/60 p-3 sm:p-4 space-y-2 shadow-lg shadow-blue-500/10">
            <SectionHeader icon={Calendar} title="Presenze per Giorno" color="#60a5fa" />
            <Div className="h-24 sm:h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDay}>
                  <XAxis dataKey="day" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis hide allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [v, 'Presenze']} />
                  <Bar dataKey="count" fill="hsl(200 70% 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Div>
          </Div>
        )}

        {/* Evoluzione rating mensile (stile icona FIFA) */}
        <ClientRatingHistory client={client} attendances={ca} events={events} />

        {/* Performance per locale */}
        {byVenue.length > 0 && (
          <Div className="rounded-xl bg-gradient-to-b from-card to-card/80 border border-border/60 p-3 sm:p-4 space-y-2 shadow-lg shadow-amber-500/10">
            <SectionHeader icon={MapPin} title="Per Locale" color="#fbbf24" />
            <Div className="space-y-1.5">
              {byVenue.map(v => (
                <Div key={v.venue} className="flex items-center gap-2 sm:gap-3 text-xs">
                  <Div className="w-24 sm:w-32 flex items-center gap-1.5 shrink-0">
                    {(() => {

                      const { logoUrl } = getVenueLogo(v.logoVenue || v.venue);
                      return logoUrl
                        ? <CachedImage src={logoUrl} alt={v.venue} className="w-4 h-4 rounded-sm object-contain shrink-0" />
                        : <Span className="w-4 h-4 rounded-sm bg-secondary shrink-0 inline-block" />;
                    })()}
                    <Span className="truncate text-muted-foreground">{v.venue}</Span>
                  </Div>
                  <Div className="flex-1 h-1.5 bg-secondary rounded-full">
                    <Div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${byVenue[0].spent > 0 ? (v.spent / byVenue[0].spent) * 100 : 0}%` }} />
                  </Div>
                  <Span className="font-semibold text-primary w-16 sm:w-20 text-right">€{v.spent.toLocaleString('it-IT')}</Span>
                  <Span className="text-muted-foreground w-10 sm:w-12 text-right">{v.visits} pres.</Span>
                </Div>
              ))}
            </Div>
          </Div>
        )}

        {/* Storico presenze */}
        {enriched.length > 0 && (
          <Div className="rounded-xl bg-gradient-to-b from-card to-card/80 border border-border/60 overflow-hidden shadow-lg shadow-violet-500/10">
            <Div className="px-4 py-3 border-b border-border/40 bg-gradient-to-r from-secondary/10 to-transparent">
              <SectionHeader icon={History} title="Storico Presenze" color="#a78bfa" />
            </Div>
            <Div className="divide-y divide-border/50 max-h-60 overflow-y-auto overscroll-y-contain">
              {[...enriched].reverse().map((a, i) => (
                <Div key={i} className="flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 text-xs min-h-9">
                  <Span className="text-muted-foreground w-20 sm:w-24 shrink-0 whitespace-nowrap">{format(parseISO(a.event.date), 'd MMM yyyy', { locale: it })}</Span>
                  <Span className="flex-1 truncate text-foreground/80">{a.event.name}</Span>
                  {a.event.venue && <Span className="text-muted-foreground shrink-0 hidden sm:inline">{a.event.venue}</Span>}
                  <Span className={`shrink-0 flex items-center gap-0.5 font-semibold w-10 justify-end ${(a.new_people_brought > 0) ? 'text-green-400' : 'text-muted-foreground'}`}>
                    <Users className="w-3 h-3" />{a.new_people_brought > 0 ? a.new_people_brought : '—'}
                  </Span>
                  <Span className="font-bold text-primary shrink-0">€{(a.revenue || 0).toLocaleString('it-IT')}</Span>
                </Div>
              ))}
            </Div>
          </Div>
        )}

        {enriched.length === 0 && (
          <Div className="text-center py-8 text-sm text-muted-foreground">
            Nessuna presenza registrata per questo cliente.
          </Div>
        )}
        </Div>
      </Div>
    </Div>,
    webDocument.body
  );
}