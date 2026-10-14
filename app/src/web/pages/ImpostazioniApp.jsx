// Port di src/pages/ImpostazioniApp.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from '@/web/router';
import { makeTapHandlers } from '@/web/lib/tapHandlers';
import { useStickySentinel } from '@/web/hooks/useStickySentinel';
import { stickyGlassStyle } from '@/legacy/utils/stickyGlass';
import { useStickyTabFlash } from '@/web/hooks/useStickyTabFlash';
import { useSetStickyHeader } from '@/web/lib/stickyHeaderContext';
import { useAuth } from '@/lib/auth';
import PageTitle from '@/web/components/shared/PageTitle';
import { ShieldAlert, Image, Trophy, TableProperties, Megaphone, Database, FileText, Bell, MapPin, Users, Swords, MessageCircle, Search, Shield } from '@/ui/icons.generated';
import SettingsBranding from '@/web/components/impostazioni/SettingsBranding';
import SettingsLocali from '@/web/components/impostazioni/SettingsLocali';
import SettingsTavoli from '@/web/components/impostazioni/SettingsTavoli';
import SettingsComunicazioni from '@/web/components/impostazioni/SettingsComunicazioni';
import SettingsAchievements from '@/web/components/impostazioni/SettingsAchievements';
import SettingsVibraChallenges from '@/web/components/impostazioni/SettingsVibraChallenges';
import SettingsDatabase from '@/web/components/impostazioni/SettingsDatabase';
import SettingsMaterialeLocali from '@/web/components/impostazioni/SettingsMaterialeLocali';
import SettingsNotifiche from '@/web/components/impostazioni/SettingsNotifiche';
import SettingsPromoters from '@/web/components/impostazioni/SettingsPromoters';
import SettingsChatInstagram from '@/web/components/impostazioni/SettingsChatInstagram';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, H, P } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

const SECTIONS = [
  { key: 'branding',      label: 'Branding',         icon: Image,           color: 'text-blue-400'    },
  { key: 'materiale',     label: 'Materiale Locali', icon: FileText,        color: 'text-emerald-400' },
  { key: 'comunicazioni', label: 'Comunicazioni',    icon: Megaphone,       color: 'text-amber-400'   },
  { key: 'notifiche',     label: 'Notifiche',        icon: Bell,            color: 'text-violet-400'  },
  { key: 'locali',        label: 'Locali',           icon: MapPin,          color: 'text-cyan-400'    },
  { key: 'promoter',      label: 'Promoter',         icon: Users,           color: 'text-orange-400'  },
  { key: 'tavoli',        label: 'Tavoli',            icon: TableProperties, color: 'text-green-400'   },
  { key: 'achievement',   label: 'Achievement',      icon: Trophy,          color: 'text-yellow-400'  },
  { key: 'vibravs',       label: 'Vibra VS',         icon: Swords,          color: 'text-primary'     },
  { key: 'database',      label: 'Database',         icon: Database,        color: 'text-red-400'     },
  { key: 'chat-ig',       label: 'Chat Instagram',   icon: MessageCircle,  color: 'text-pink-400'   },
];

// Desktop (lg+): sidebar a gruppi. Mobile resta con la barra di tab sticky.
const GROUPS = [
  { label: 'Generale',      keys: ['branding', 'comunicazioni', 'notifiche'] },
  { label: 'Locali e team', keys: ['locali', 'materiale', 'promoter', 'tavoli'] },
  { label: 'Gamification',  keys: ['achievement', 'vibravs'] },
  { label: 'Sistema',       keys: ['database', 'chat-ig'] },
];
const SECTION_BY_KEY = Object.fromEntries(SECTIONS.map(s => [s.key, s]));

export default function ImpostazioniApp() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState('branding');
  const lastTouchRef = useRef(0);
  const [query, setQuery] = useState('');

  // Deep link: ?tab=<key> apre direttamente il pannello corretto.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && SECTIONS.some(s => s.key === tab)) {
      setActive(tab);
    }
  }, [location.search]);
  const tabsRef = useRef(null);
  const [sentinelRef, stuck] = useStickySentinel();
  useStickyTabFlash(tabsRef);
  const setStuckHeader = useSetStickyHeader();
  useEffect(() => { setStuckHeader(stuck); }, [stuck, setStuckHeader]);
  useEffect(() => () => setStuckHeader(false), [setStuckHeader]);

  // Soglia sticky + ref per leggere stuck nel callback di cambio tab (evita
  // closure stale: stuck letto al momento del tap, non al render).
  const stickyTopRef = useRef(0);
  const stuckRef = useRef(false);
  useEffect(() => { stuckRef.current = stuck; }, [stuck]);
  useEffect(() => {
    if (!stuck && tabsRef.current) {
      stickyTopRef.current = tabsRef.current.getBoundingClientRect().top + webWindow.scrollY;
    }
  }, [stuck]);

  const handleTabChange = (key) => {
    setActive(key);
    // Se la sticky è incollata, mantiene la posizione di incollaggio così la
    // barra resta visibile anche dopo il cambio sezione (come le altre pagine).
    webWindow.scrollTo(0, stuckRef.current ? stickyTopRef.current : 0);
  };

  if (user?.role !== 'admin') {
    return (
      <Div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
        <ShieldAlert className="w-10 h-10" />
        <P>Accesso riservato agli amministratori.</P>
      </Div>
    );
  }

  const q = query.trim().toLowerCase();
  const filteredGroups = GROUPS
    .map(g => ({ ...g, items: g.keys.map(k => SECTION_BY_KEY[k]).filter(sec => !q || sec.label.toLowerCase().includes(q)) }))
    .filter(g => g.items.length > 0);
  const activeSection = SECTION_BY_KEY[active];
  const ActiveIcon = activeSection?.icon;

  return (
    <Div className="space-y-5 lg:space-y-0">
      {/* Mobile: titolo + tab sticky (invariato) */}
      <Div className="lg:hidden"><PageTitle title="Impostazioni App" /></Div>

      {/* Desktop: intestazione + ricerca */}
      {/* Stessa struttura/spaziatura di PageTitle (min-h-14, gap-4, h1 text-3xl
          font-bold text-foreground) + gap 1.25rem verso il contenuto come space-y-5 */}
      <Div className="hidden lg:flex items-center justify-end gap-4 mb-5 mt-2">
        <Div className="relative w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <HtmlInput
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && filteredGroups[0]?.items[0]) { handleTabChange(filteredGroups[0].items[0].key); }
              if (e.key === 'Escape') setQuery('');
            }}
            placeholder="Cerca un'impostazione…"
            className="w-full bg-card/60 border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </Div>
      </Div>

      {/* Mobile: tab navigation sticky. Sentinella e barra NON vanno avvolti in un
          wrapper (la sticky deve avere come contenitore l'intera pagina). */}
      <Div
        ref={sentinelRef}
        className="lg:hidden"
        style={{ height: 1, marginTop: 0, padding: 0, border: 'none' }} />
      <Div ref={tabsRef} className={`dash-fade-up group sticky top-[env(safe-area-inset-top)] z-20 overflow-hidden pt-4 pb-1.5 -mx-4 px-4 border-b lg:hidden ${stuck ? 'border-border is-stuck' : 'border-transparent'}`} style={{ marginTop: 0 }}>
        <Div className="sticky-glass absolute inset-0" style={stickyGlassStyle(stuck)} />
        <Div className="relative flex gap-1.5 overflow-x-auto overflow-y-hidden pb-1" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x', overscrollBehaviorX: 'contain' }}>
          {SECTIONS.map(s => {
            const Icon = s.icon;
            const isActive = active === s.key;
            return (
              <Btn
                button
                key={s.key}
                {...makeTapHandlers(lastTouchRef, () => handleTabChange(s.key))}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-secondary border-border text-foreground shadow-sm'
                    : 'bg-transparent border-transparent text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                }`}>
                <Icon className={`w-3.5 h-3.5 ${isActive ? s.color : ''}`} />
                {s.label}
              </Btn>
            );
          })}
        </Div>
      </Div>

      <Div className="lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8 lg:items-start">
        {/* Desktop: sidebar a gruppi */}
        <Div className="hidden lg:flex lg:flex-col lg:gap-6 lg:sticky lg:top-8">
          <Div className="space-y-5">
            {filteredGroups.length === 0 && (
              <P className="px-2 text-sm text-muted-foreground">Nessuna impostazione trovata.</P>
            )}
            {filteredGroups.map(g => (
              <Div key={g.label} className="space-y-1">
                <P className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{g.label}</P>
                {g.items.map(sec => {
                  const Icon = sec.icon;
                  const isActive = active === sec.key;
                  return (
                    <Btn
                      button
                      key={sec.key}
                      onClick={() => handleTabChange(sec.key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left border transition-colors ${
                        isActive
                          ? 'bg-primary/15 border-primary/40 text-primary'
                          : 'border-transparent text-foreground/80 hover:bg-secondary/40 hover:text-foreground'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? '' : 'text-muted-foreground'}`} />
                      {sec.label}
                    </Btn>
                  );
                })}
              </Div>
            ))}
          </Div>

          <Div className="rounded-2xl border border-primary/25 bg-primary/10 p-4 space-y-1.5">
            <Div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Shield className="w-4 h-4" />
              Sicurezza
            </Div>
            <P className="text-xs text-muted-foreground leading-relaxed">
              Le modifiche alle impostazioni vengono registrate nell'audit log.
            </P>
          </Div>
        </Div>

        {/* Contenuto — mobile: min-height per mantenere la sticky incollata anche con
            contenuto corto; desktop: pannello con titolo della sezione */}
        <Div className="min-w-0 min-h-[calc(100dvh-12rem)] lg:min-h-[calc(100vh-14rem)] lg:rounded-2xl lg:border lg:border-border/60 lg:bg-card/30 lg:p-6">
          {ActiveIcon && (
            <Div className="hidden lg:flex items-center gap-3 mb-5">
              <Div className="p-2 rounded-xl bg-secondary/50 border border-border">
                <ActiveIcon className={`w-5 h-5 ${activeSection.color}`} />
              </Div>
              <H className="text-xl font-semibold">{activeSection.label}</H>
            </Div>
          )}
          {active === 'branding'      && <SettingsBranding />}
          {active === 'materiale'     && <SettingsMaterialeLocali />}
          {active === 'comunicazioni' && <SettingsComunicazioni />}
          {active === 'notifiche'     && <SettingsNotifiche />}
          {active === 'locali'        && <SettingsLocali />}
          {active === 'promoter'      && <SettingsPromoters />}
          {active === 'tavoli'        && <SettingsTavoli />}
          {active === 'achievement'   && <SettingsAchievements />}
          {active === 'vibravs'       && <SettingsVibraChallenges />}
          {active === 'database'      && <SettingsDatabase />}
          {active === 'chat-ig'       && <SettingsChatInstagram />}
        </Div>
      </Div>
    </Div>
  );
}