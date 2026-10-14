// Port di src/pages/Locali.jsx (convertito da scripts/port/codemod.mjs).
import { STALE_FULL_TABLE, GC_FULL_TABLE } from '@/web/lib/query-client';
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from '@/web/router';
import { makeTapHandlers } from '@/web/lib/tapHandlers';
import { useQuery } from '@tanstack/react-query';
import PageTitle from '@/web/components/shared/PageTitle';
import { base44 } from '@/lib/base44';
import { fetchAll } from '@/web/lib/safeData';
import VenueCard from '@/web/components/locali/VenueCard';
import VenueAnalytics from '@/web/components/locali/VenueAnalytics';
import { MapPin, BarChart3 } from '@/ui/icons.generated';
import { useStickySentinel } from '@/web/hooks/useStickySentinel';
import { stickyGlassStyle } from '@/legacy/utils/stickyGlass';
import { useStickyTabFlash } from '@/web/hooks/useStickyTabFlash';
import { useSetStickyHeader } from '@/web/lib/stickyHeaderContext';
import { useBackTab } from '@/web/hooks/useBackTab';

import { doc as webDocument, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';

const DAY_NAMES = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

function toDisplayVenue(v) {
  const label = v.is_extra ? 'Extra' : (v.day_of_week === null || v.day_of_week === undefined ? 'Speciale' : DAY_NAMES[v.day_of_week]);
  return {
    id: v.id,
    name: v.name,
    is_extra: v.is_extra,
    logo_key: v.logo_key || v.name,
    label,
    sublabel: v.season_label || (v.is_extra ? 'Festivi' : ''),
    hex: v.color_hex || '#a78bfa',
  };
}

const TABS = [
  { key: 'locali', label: 'Locali' },
  { key: 'analytics', label: 'Analitica' },
];

export default function Locali() {
  const location = useLocation();
  const venueParam = new URLSearchParams(location.search).get('venue');
  const [tab, setTab] = useState(() => webWindow.history.state?._tab || 'locali');
  const tabsRef = useRef(null);
  const lastTouchRef = useRef(0);
  const [sentinelRef, stuck] = useStickySentinel();
  useStickyTabFlash(tabsRef);
  const setStuckHeader = useSetStickyHeader();
  useEffect(() => { setStuckHeader(stuck); }, [stuck, setStuckHeader]);
  useEffect(() => () => setStuckHeader(false), [setStuckHeader]);

  // Tasto back: torna al tab precedente
  useBackTab(tab, setTab, 'locali');

  // Deep-link: se arrivi con ?venue=<nome>, espandi quel locale e scrolla da lui.
  useEffect(() => {
    if (venueParam) {
      setTab('locali');
      const el = webDocument.getElementById('venue-card-' + venueParam);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
    }
  }, [venueParam]);

  // Soglia sticky: mantiene la barra attiva anche al cambio tab
  const stickyTopRef = useRef(0);
  useEffect(() => {
    if (!stuck && tabsRef.current) {
      stickyTopRef.current = tabsRef.current.getBoundingClientRect().top + webWindow.scrollY;
    }
  }, [stuck]);

  const handleTabChange = (key) => {
    setTab(key);
    webWindow.scrollTo(0, stuck ? stickyTopRef.current : 0);
  };

  const { data: venuesRaw = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list('sort_order'),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const venues = venuesRaw.map(toDisplayVenue);

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const { data: attendances = [] } = useQuery({
    queryKey: ['attendances-all'], staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE,
    queryFn: () => fetchAll(base44.entities.EventAttendance, {}, { sort: '-created_date' }),
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return (
    <Div className="space-y-5 pb-8">
      <PageTitle title="Locali" />

      {/* ── Tab switcher sticky ── */}
      <Div
        ref={sentinelRef}
        style={{ height: 1, marginTop: 0, padding: 0, border: 'none' }} />
      <Div ref={tabsRef} className={`dash-fade-up group sticky top-[env(safe-area-inset-top)] z-20 pt-4 pb-1.5 -mx-4 px-4 border-b ${stuck ? 'border-border is-stuck' : 'border-transparent'}`} style={{ marginTop: 0 }}>
        <Div className="sticky-glass absolute inset-0" style={stickyGlassStyle(stuck)} />
        <Div className={`relative flex gap-1 bg-secondary/40 p-1 rounded-xl w-max`}>
          {TABS.map(t => (
            <Btn
              button
              key={t.key}
              {...makeTapHandlers(lastTouchRef, () => handleTabChange(t.key))}
              className={`cursor-pointer flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t.key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}>
              {t.key === 'locali' ? <MapPin className="w-3.5 h-3.5" /> : <BarChart3 className="w-3.5 h-3.5" />}
              {t.label}
            </Btn>
          ))}
        </Div>
      </Div>

      {/* ── Header count ── */}
      <Div
        className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card px-4 py-3"
        style={{ boxShadow: '0 4px 32px -8px rgba(167,139,250,0.08)' }}
      >
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
        <P className="text-xs text-muted-foreground">
          <Span className="font-semibold text-foreground">{venues.length}</Span> locali — statistiche e confronto analytics
        </P>
      </Div>

      {tab === 'locali' && (
        <Div className="space-y-4">
          {venues.map((venue, index) => (
            <Div
              key={venue.id}
              className="dash-fade-up"
            >
              <VenueCard
                venue={venue}
                events={events}
                attendances={attendances}
                promoters={promoters}
                defaultExpanded={venueParam === venue.name}
              />
            </Div>
          ))}
        </Div>
      )}

      {tab === 'analytics' && (
        <Div className="dash-fade-up">
          <VenueAnalytics events={events} attendances={attendances} />
        </Div>
      )}
    </Div>
  );
}