// Port di src/components/programmazione/TargetLocaleTab.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo, useState } from 'react';
import { motion } from '@/ui/motion';
import { Target, MapPin, Star, Instagram, ChevronDown } from '@/ui/icons.generated';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import WhatsAppIcon from '@/web/components/shared/WhatsAppIcon';
import SelectCheckbox from '@/web/components/client/SelectCheckbox';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import { useBulkSelection } from '@/web/lib/bulkSelectionContext';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';

import { Btn, Div, P, Span } from '@/ui/html';
import { A, Img } from '@/ui/elements';

// Ordine di visualizzazione: Venerdì, Sabato, Domenica
const DAY_ORDER = [5, 6, 0];
const DAY_LABELS = { 5: 'Venerdì', 6: 'Sabato', 0: 'Domenica' };
// Alias logo (stesso mapping di useUpcomingSerate)
const VENUE_ALIASES = { 'Ammare Frontemare': 'Frontemare' };

// Colore per rank (come LiveRankingWidget): oro/argento/bronzo per il podio, blu per il resto.
// Usato sia per il numero (hero) sia per la barra sottile, così colore e valore sono coerenti.
const RANK_COLOR = (i) => i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#fb923c' : '#60a5fa';

const PREVIEW_COUNT = 8;

/**
 * Tab "Target Locale" del Weekend: per ogni locale attivo assegnato al
 * prossimo Ven/Sab/Dom, mostra i clienti del promoter più affezionati a quel
 * locale, ordinati per presenze. Di base considera solo le presenze degli
 * ultimi 4 mesi (così i clienti inattivi o dell'anno scorso non emergono);
 * uno switch mostra il totale di sempre.
 * Il numero di presenze è l'elemento principale (grande, colorato per rank);
 * la barra sottile sotto il nome rafforza visivamente il peso. Tasto destro /
 * pressione prolungata sul cliente apre il menu "Aggiungi a serata".
 */
export default function TargetLocaleTab({ clients, upcomingDates, attendances = [], events = [], onContact, onDetail }) {
  const { getVenueLogo } = useAllVenueLogos();
  const [mode, setMode] = useState('recent'); // 'recent' (ultimi 4 mesi) | 'alltime'
  const [showAll, setShowAll] = useState({}); // { [dow]: bool }
  const bulk = useBulkSelection();
  const selectMode = bulk?.selectMode;
  const selectedIds = bulk?.selectedIds;
  const toggleSelect = bulk?.toggleSelect;
  const isSel = (id) => !!selectedIds?.has(id);
  const handleRowClick = (e, c) => {
    if (selectMode) { toggleSelect?.(c); return; }
    if (e?.ctrlKey || e?.metaKey) { e.preventDefault(); toggleSelect?.(c); return; }
    onDetail?.(c);
  };

  // Locale attivo per giorno della settimana (prima occorrenza in arrivo)
  const venueByDow = useMemo(() => {
    const map = {};
    for (const u of upcomingDates) {
      if (u.venueName && map[u.dow] == null) map[u.dow] = u.venueName;
    }
    return map;
  }, [upcomingDates]);

  // Prossima data disponibile per giorno della settimana (label informativa)
  const nextDateByDow = useMemo(() => {
    const map = {};
    for (const u of upcomingDates) {
      if (map[u.dow] == null) map[u.dow] = u.dateStr;
    }
    return map;
  }, [upcomingDates]);

  // Presenze recenti (ultimi 4 mesi) per venue → { [clientId]: count }
  const recentByVenue = useMemo(() => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 4);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    const eventsById = new Map(events.map(e => [e.id, e]));
    const map = {};
    for (const a of attendances) {
      if (!a.client_id) continue;
      const ev = eventsById.get(a.event_id);
      if (!ev || !ev.venue || !ev.date) continue;
      if (ev.date < cutoffStr) continue;
      if (!map[ev.venue]) map[ev.venue] = {};
      map[ev.venue][a.client_id] = (map[ev.venue][a.client_id] || 0) + 1;
    }
    return map;
  }, [attendances, events]);

  // Sezioni: una per giorno/locale con i clienti ordinati per presenze
  const sections = useMemo(() => {
    return DAY_ORDER.map(dow => {
      const venueName = venueByDow[dow];
      if (!venueName) return null;
      const recentMap = recentByVenue[venueName] || {};
      const rows = clients
        .map(c => {
          const recent = recentMap[c.id] || 0;
          const alltime = c.cum_venue_counts?.[venueName] || 0;
          return { client: c, recent, alltime };
        })
        .filter(r => (mode === 'recent' ? r.recent : r.alltime) > 0)
        .sort((a, b) => (mode === 'recent' ? b.recent - a.recent : b.alltime - a.alltime));
      return { dow, venueName, dateStr: nextDateByDow[dow], rows };
    }).filter(Boolean);
  }, [clients, venueByDow, nextDateByDow, recentByVenue, mode]);

  if (sections.length === 0) {
    return (
      <Div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-8 text-center">
        <Target className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <P className="text-sm text-muted-foreground">
          Nessun locale attivo assegnato ai prossimi Ven/Sab/Dom. Configura i locali in Impostazioni → Locali.
        </P>
      </Div>
    );
  }

  return (
    <Div className="space-y-4">
      {/* Switch globale: Recenti (4 mesi) / Di sempre */}
      <Div className="flex items-center justify-between gap-3 flex-wrap">
        <P className="text-xs text-muted-foreground max-w-md">
          I clienti più affezionati di ogni locale: chi è venuto più volte tornerà probabilmente alla prossima serata.
          Tasto destro o pressione prolungata per aggiungere al prospetto.
        </P>
        <Div className="flex gap-1 p-1 rounded-xl bg-secondary/30 shrink-0">
          <Btn
            button
            onClick={() => setMode('recent')}
            className={`text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
              mode === 'recent' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}>
            Recenti · 4 mesi
          </Btn>
          <Btn
            button
            onClick={() => setMode('alltime')}
            className={`text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
              mode === 'alltime' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}>
            Di sempre
          </Btn>
        </Div>
      </Div>

      {sections.map(({ dow, venueName, dateStr, rows }) => {
        const { logoUrl } = getVenueLogo(VENUE_ALIASES[venueName] || venueName);
        const expanded = showAll[dow];
        const shown = expanded ? rows : rows.slice(0, PREVIEW_COUNT);
        return (
          <motion.div
            key={dow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card"
            style={{ boxShadow: '0 4px 24px -6px rgba(96,165,250,0.10)' }}
          >
            <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
              style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }} />

            <Div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              {logoUrl
                ? <Img src={logoUrl} alt={venueName} className="w-8 h-8 object-contain rounded-lg bg-secondary/30 shrink-0" />
                : <Div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-primary" /></Div>}
              <Div className="min-w-0 flex-1">
                <P className="text-sm font-semibold truncate">{DAY_LABELS[dow]} · {venueName}</P>
                <P className="text-[10px] text-muted-foreground">
                  {rows.length} clienti attivi · {mode === 'recent' ? 'ultimi 4 mesi' : 'di sempre'}
                  {dateStr ? ` · prossima ${format(parseISO(dateStr), 'd MMM', { locale: it })}` : ''}
                </P>
              </Div>
            </Div>

            {rows.length === 0 ? (
              <P className="text-xs text-muted-foreground text-center py-6">
                Nessun cliente {mode === 'recent' ? 'negli ultimi 4 mesi' : 'storico'} per questo locale.
              </P>
            ) : (
              <Div className="px-4 py-1">
                {shown.map(({ client: c, recent, alltime }, i) => {
                  const count = mode === 'recent' ? recent : alltime;
                  const color = RANK_COLOR(i);
                  const phoneClean = c.phone?.replace(/[^0-9]/g, '');
                  const igHandle = c.instagram?.replace('@', '');
                  return (
                    <Btn
                      key={c.id}
                      onClick={(e) => handleRowClick(e, c)}
                      className={`flex items-center gap-2.5 cursor-pointer group py-2.5 border-b border-white/[0.03] last:border-0`}
                      style={isSel(c.id) ? { backgroundColor: 'rgba(139, 92, 246, 0.18)' } : undefined}>
                      {selectMode && <SelectCheckbox selected={isSel(c.id)} />}
                      <Span className="text-xs w-5 text-center shrink-0 text-muted-foreground font-semibold">{i + 1}</Span>
                      <ClientAvatar client={c} initials={(c.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()} size="sm" />
                      <Div className="flex-1 min-w-0">
                        <Div className="flex items-center gap-2">
                          <P className="text-sm font-semibold truncate flex-1 min-w-0 group-hover:text-primary transition-colors flex items-center gap-1">
                            {c.name}
                            {c.is_leader && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                          </P>
                          {/* Numero presenze: elemento principale, grande e colorato per rank */}
                          <Div className="flex items-baseline gap-1 shrink-0">
                            <Span className="text-xl font-extrabold tabular-nums leading-none" style={{ color }}>{count}</Span>
                            <Span className="text-[10px] text-muted-foreground">pres.</Span>
                          </Div>
                          <Btn className="flex items-center gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
                            {phoneClean && (
                              <A
                                href={`https://wa.me/${phoneClean}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => onContact?.(c.id)}
                                className="p-1 rounded-lg text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                                accessibilityLabel="Invita su WhatsApp"
                              >
                                <WhatsAppIcon className="w-3.5 h-3.5" />
                              </A>
                            )}
                            {igHandle && (
                              <A
                                href={`https://instagram.com/${igHandle}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded-lg text-pink-400 hover:bg-pink-400/10 transition-colors"
                                accessibilityLabel="Instagram"
                              >
                                <Instagram className="w-3.5 h-3.5" />
                              </A>
                            )}
                          </Btn>
                        </Div>
                      </Div>
                    </Btn>
                  );
                })}
                {rows.length > PREVIEW_COUNT && (
                  <Btn
                    button
                    onClick={() => setShowAll(s => ({ ...s, [dow]: !s[dow] }))}
                    className="w-full py-2.5 text-xs text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
                    {expanded ? 'Riduci' : `Mostra tutti (${rows.length})`}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </Btn>
                )}
              </Div>
            )}
          </motion.div>
        );
      })}
    </Div>
  );
}