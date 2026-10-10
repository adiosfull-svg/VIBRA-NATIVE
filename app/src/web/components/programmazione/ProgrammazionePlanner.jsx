// Port di src/components/programmazione/ProgrammazionePlanner.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { CalendarDays, X, UserPlus, CalendarPlus, Instagram, Zap } from '@/ui/icons.generated';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import ConvertiPresenzeDialog from '@/web/components/programmazione/ConvertiPresenzeDialog';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import CachedImage from '@/web/components/shared/CachedImage';

import { Btn, Div, P, Span } from '@/ui/html';
import { A, HtmlInput } from '@/ui/elements';

// Logo locale stabile per il prospetto: memoizzato per venueKey così non viene
// ricalcolato ad ogni render (es. digitazione nelle note) e, essendo precaricato
// in prefetchCoreData, appare subito senza flash.
const VenueLogoImg = React.memo(function VenueLogoImg({ venueKey, getVenueLogo }) {
  const { logoUrl } = getVenueLogo(venueKey);
  if (!logoUrl) {
    return (
      <Div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
        <CalendarPlus className="w-4 h-4 text-blue-400" />
      </Div>
    );
  }
  return (
    <CachedImage src={logoUrl} alt="" loading="eager" className="w-7 h-7 rounded-lg object-contain bg-card border border-white/[0.06] shrink-0" />
  );
});

const VENUE_ALIASES = {
  'Ammare Frontemare': 'Frontemare',
};

/**
 * Corpo centrale "Prospetto Inviti": per ogni data pianificata mostra
 * intestazione (logo locale + titolo serata + data) e la lista dei clienti.
 * Ogni serata ha un pulsante "Converti in presenze" che apre il form completo
 * per trasformare il prospetto in presenze effettive (EventAttendance).
 *
 * Differentia i clienti già acquisiti dalle Semine Instagram (type='semina') con un
 * badge rosa "IG" e un pulsante per aprire il profilo IG.
 */
export default function ProgrammazionePlanner({ plan, onRemove, onNoteChange, clients = [], events = [], promoterId, onConverted, onDetail, semine = [], onEditSemina }) {
  const { getVenueLogo } = useAllVenueLogos();
  const [convertEntry, setConvertEntry] = useState(null);
  const entries = Object.entries(plan).sort((a, b) => a[0].localeCompare(b[0]));

  // Mappe O(1) per recuperare foto profilo e oggetto completo dal guest del plan
  const clientsById = useMemo(() => Object.fromEntries(clients.map(c => [c.id, c])), [clients]);
  const semineById = useMemo(() => Object.fromEntries(semine.map(s => [s.id, s])), [semine]);

  // Mappa stabile dateStr -> venueKey (derivata dal titolo). Memoizzata così non
  // viene ricalcolata ad ogni keystroke nelle note.
  const venueKeyByDate = useMemo(() => {
    const map = {};
    for (const [dateStr, entry] of Object.entries(plan)) {
      const parts = (entry.title || '').split(' · ');
      map[dateStr] = parts.length > 1 ? parts[parts.length - 1] : '';
    }
    return map;
  }, [plan]);

  return (
    <Div
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card"
      style={{ boxShadow: '0 4px 24px -6px rgba(96,165,250,0.10)' }}>
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50" style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }} />
      <Div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40">
        <Div className="flex items-center gap-2">
          <Div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center"><CalendarDays className="w-3.5 h-3.5 text-blue-400" /></Div>
          <Div>
            <P className="font-semibold uppercase tracking-wider text-blue-400 text-xs">Prospetto Inviti</P>
            <P className="text-[11px] text-muted-foreground">Tasto destro (o tieni premuto su mobile) su un cliente o semina per aggiungerlo a una serata</P>
          </Div>
        </Div>
      </Div>

      {entries.length === 0 ? (
        <Div className="px-4 py-6 text-center">
          <UserPlus className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <P className="text-sm text-muted-foreground">Prospetto vuoto</P>
          <P className="text-[11px] text-muted-foreground/70 mt-1 max-w-md mx-auto">
            Tasto destro (o pressione prolungata su mobile) su un cliente o semina — nelle bacheche, in "Da Ricontattare", nella Growth League o nella lista Clienti — per pianificarlo in una serata.
          </P>
        </Div>
      ) : (
        <Div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[640px] overflow-y-auto recontact-scrollbar">
          {entries.map(([dateStr, entry]) => (
            <Div key={dateStr} className="rounded-xl border border-white/[0.08] bg-secondary/30 p-3">
              {/* Header serata — logo locale + titolo + data + converti */}
              <Div className="flex items-center justify-between mb-3 gap-2 pb-2.5 border-b border-border/30">
                <Div className="flex items-center gap-2 min-w-0">
                  <VenueLogoImg venueKey={venueKeyByDate[dateStr] || ''} getVenueLogo={getVenueLogo} />
                  <Div className="min-w-0">
                    <P className="text-sm font-bold text-foreground truncate leading-tight">{entry.title}</P>
                    <P className="text-[11px] text-muted-foreground truncate">{entry.subtitle}</P>
                  </Div>
                </Div>
                <Div className="flex items-center gap-1.5 shrink-0">
                  <Btn
                    button
                    onClick={() => setConvertEntry({ dateStr, title: entry.title, subtitle: entry.subtitle, clients: entry.clients || [] })}
                    disabled={!entry.clients?.length}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    accessibilityLabel="Converti in presenze">
                    <Zap className="w-3 h-3" />Converti
                  </Btn>
                  <Span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400">{entry.clients?.length || 0}</Span>
                </Div>
              </Div>
              {/* Righe clienti — più respiro, nome a tutta larghezza */}
              {/* Griglia: da 2 (mobile) a 3 (spazio largo) contatti per riga. Min box ~150px, ma mai oltre metà larghezza: sempre almeno 2 colonne. */}
              <Div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(max(150px, calc((100% - 1rem) / 3)), calc((100% - 0.5rem) / 2 - 1px)), 1fr))' }}>
                {(entry.clients || []).map(c => {
                   const semina = c.type === 'semina';
                   const handle = c.ig || '';
                   const fullObj = semina ? semineById[c.id] : clientsById[c.id];
                   const photoUrl = fullObj?.photo_url;
                   const initials = (c.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                   const handleNameClick = (e) => {
                     e.stopPropagation();
                     if (semina) {
                       const sem = semineById[c.id];
                       if (sem && onEditSemina) onEditSemina(sem);
                     } else {
                       onDetail?.(fullObj || { id: c.id, name: c.name });
                     }
                   };
                   return (
                     <Div key={c.id} className={`rounded-lg bg-card border ${semina ? 'border-pink-500/30' : 'border-white/[0.06]'} overflow-hidden`}>
                       <Div className="flex flex-col gap-1.5 p-2">
                        <Div className="flex items-center gap-1.5">
                         {semina ? (
                           <Span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-pink-500/15 text-pink-400 shrink-0" accessibilityLabel="Semina Instagram">
                             <Instagram className="w-2.5 h-2.5" />IG
                           </Span>
                         ) : (
                           <Span className="w-2 h-2 rounded-full bg-emerald-400/70 shrink-0" accessibilityLabel="Cliente" />
                         )}
                         <Span className="flex-1" />
                         {semina && handle && (
                           <A href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-pink-400 hover:text-pink-300 shrink-0" accessibilityLabel="Apri profilo Instagram">
                             <Instagram className="w-3.5 h-3.5" />
                           </A>
                         )}
                         <Btn
                           button
                           onClick={() => onRemove?.(dateStr, c.id)}
                           className="text-muted-foreground hover:text-red-400 transition-colors shrink-0 p-0.5"
                           accessibilityLabel="Rimuovi">
                           <X className="w-3.5 h-3.5" />
                         </Btn>
                        </Div>
                        <Div className="flex items-start gap-2">
                         <ClientAvatar
                           client={photoUrl ? { photo_url: photoUrl } : null}
                           initials={initials}
                           size="sm"
                           className="!w-7 !h-7 !text-[10px] ring-1 ring-white/10"
                         />
                         <Span
                           onPress={handleNameClick}
                           className="text-sm font-medium break-words leading-tight flex-1 min-w-0 cursor-pointer hover:text-blue-300 hover:underline transition-colors"
                           accessibilityLabel={semina ? 'Tocca per modificare la semina · Tieni premuto / tasto destro per spostare' : 'Tocca per aprire il dettaglio · Tieni premuto / tasto destro per spostare o copiare in altra serata'}>
                           {c.name}
                         </Span>
                        </Div>
                         <HtmlInput
                           value={c.note || ''}
                           onChange={e => onNoteChange?.(dateStr, c.id, e.target.value)}
                           placeholder="Note"
                           className="w-full h-7 px-2 py-0 leading-none rounded-md bg-secondary/40 border border-blue-400/20 text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-blue-400"
                         />
                       </Div>
                     </Div>
                   );
                 })}
              </Div>
            </Div>
          ))}
        </Div>
      )}

      <ConvertiPresenzeDialog
        open={!!convertEntry}
        onOpenChange={(v) => { if (!v) setConvertEntry(null); }}
        dateStr={convertEntry?.dateStr}
        title={convertEntry?.title}
        subtitle={convertEntry?.subtitle}
        plannedClients={convertEntry?.clients || []}
        allClients={clients}
        events={events}
        promoterId={promoterId}
        onConverted={onConverted}
      />
    </Div>
  );
}