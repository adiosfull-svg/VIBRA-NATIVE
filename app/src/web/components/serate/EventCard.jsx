// Port di src/components/serate/EventCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, Suspense } from 'react';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import CachedImage from '@/web/components/shared/CachedImage';

function VenueLogo({ venueKey, size = 'md' }) {
  const { getVenueLogo } = useAllVenueLogos();
  const { logoUrl, zoom } = getVenueLogo(venueKey);
  if (!logoUrl) return null;
  const px = size === 'sm' ? 32 : 48;
  return (
    <Div style={{ width: px, height: px, overflow: 'hidden', flexShrink: 0 }} className="rounded flex items-center justify-center">
      <CachedImage src={logoUrl} alt={venueKey} style={{ width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${zoom})`, transformOrigin: 'center' }} />
    </Div>
  );
}
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { Button } from '@/ui/button';
import { Pencil, Trash2, ChevronDown, ChevronUp, StickyNote, Users } from '@/ui/icons.generated';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { calcTables } from '@/legacy/utils/tables';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { Btn, Div, H, P, Span } from '@/ui/html';
import { HtmlTextarea, Img } from '@/ui/elements';
const EventPromoterChart = React.lazy(() => import('@/web/components/event/EventPromoterChart'));

export default function EventCard({
  event,
  attendances,
  promoters,
  layout,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  showDivider,
  dividerLabel,
  dividerColor,
  dividerControls,
  dividerOnly = false,
}) {
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState(event.notes || '');
  const queryClient = useQueryClient();

  const updateNoteMut = useMutation({
    mutationFn: async (notes) => {
      await base44.entities.Event.update(event.id, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setNoteDialogOpen(false);
    },
  });

  const eventAtts = attendances.filter(a => a.event_id === event.id);
  const promoterDirectAtts = eventAtts.filter(a => a.promoter_id && !a.client_id);
  // Ex PR: attendance senza promoter_id con notes che inizia con '__ex_pr__'
  const exPrAtts = eventAtts.filter(a => !a.promoter_id && a.notes && a.notes.startsWith('__ex_pr__'));
  const exPrRows = exPrAtts.map(a => ({
    name: a.notes.startsWith('__ex_pr__:') ? a.notes.slice('__ex_pr__:'.length) : 'Ex PR',
    revenue: a.revenue || 0,
  }));
  const exPrTotalRevenue = exPrRows.reduce((s, r) => s + r.revenue, 0);
  const totalRevenue = event.total_revenue || (promoterDirectAtts.reduce((s, a) => s + (a.revenue || 0), 0) + exPrTotalRevenue);

  const eventDow = (() => {
    if (!event.date) return -1;
    const [y, m, d] = event.date.split('-').map(Number);
    return new Date(y, m - 1, d).getDay();
  })();

  const customThreshold = event.table_threshold || null;
  const totalTables = calcTables(totalRevenue, eventDow, customThreshold);

  const promoterRows = promoterDirectAtts
    .map(a => ({
      promoter: promoters.find(p => p.id === a.promoter_id),
      revenue: a.revenue || 0,
      tables: calcTables(a.revenue || 0, eventDow, customThreshold),
    }))
    .filter(r => r.promoter)
    .sort((a, b) => b.revenue - a.revenue);

  const formatDateShort = () => {
    if (!event.date) return { day: '--', month: '' };
    try {
      return {
        day: format(parseISO(event.date), 'dd'),
        month: format(parseISO(event.date), 'MMM yy', { locale: it }),
      };
    } catch {
      return { day: '--', month: '' };
    }
  };

  const { day, month } = formatDateShort();

  // Righe Ex PR condivise tra i layout
  const ExPrRows = ({ compact = false }) => exPrRows.length > 0 ? (
    <>
      {exPrRows.map((row, i) => {
        const pct = totalRevenue > 0 ? Math.round((row.revenue / totalRevenue) * 100) : 0;
        return (
          <Div key={i} className={`rounded-lg bg-secondary/30 border border-border/50 ${compact ? 'p-1.5 text-[11px]' : 'p-2.5 text-sm space-y-1.5'}`}>
            <Div className="flex items-center justify-between">
              <Div className="flex items-center gap-2">
                <Div className={`rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground ${compact ? 'w-4 h-4 text-[9px]' : 'w-6 h-6 text-[10px]'}`}>×</Div>
                <Span className="text-muted-foreground font-medium">{row.name}</Span>
                {!compact && <Span className="text-[10px] text-muted-foreground/60 italic">ex PR</Span>}
              </Div>
              <Span className="font-bold text-muted-foreground">€{row.revenue.toLocaleString('it-IT')}</Span>
            </Div>
            {!compact && (
              <Div className="w-full bg-secondary rounded-full h-1.5">
                <Div className="bg-muted-foreground/40 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
              </Div>
            )}
          </Div>
        );
      })}
    </>
  ) : null;

  const Divider = () => showDivider ? (
    <Div
      className="flex items-center gap-2 py-1.5 px-3 rounded-lg border-l-2 mb-2 transition-opacity"
      style={{ borderColor: dividerColor, backgroundColor: `${dividerColor}08` }}
    >
      <Span className="text-xs font-medium flex-1" style={{ color: dividerColor }}>{dividerLabel}</Span>
      {dividerControls}
    </Div>
  ) : null;

  // Solo separatore, senza card evento
  if (dividerOnly) return <Divider />;

  // Layout a quadrati (grid)
  if (layout === 'grid') {
    return (
      <Div>
        <Divider />
        <Btn
          button
          onClick={() => onToggleExpand(!isExpanded)}
          className="w-full rounded-lg bg-card border border-border overflow-hidden hover:border-primary/30 transition-all">
          <Div className="p-4 space-y-3">
            <Div className="flex items-center justify-between">
              <Div className="flex-1 text-left">
                <Div className="flex items-center gap-2">
                  <VenueLogo venueKey={event.venue} />
                  <P className="font-semibold text-sm">{event.name}</P>
                </Div>
                <Div className="flex items-center gap-1.5 mt-0.5">
                  <P className="text-xs text-muted-foreground">{day} {month}</P>
                  {event.physical_location && (
                    <Span className="text-[10px] text-primary">→ {event.physical_location}</Span>
                  )}
                </Div>
              </Div>
              <Div className="text-right">
                <P className="font-bold text-primary text-sm">€{totalRevenue.toLocaleString('it-IT')}</P>
                <P className="text-[10px] text-muted-foreground">{totalTables}t</P>
              </Div>
            </Div>
            <Div className="w-full bg-secondary rounded-full h-1">
              <Div className="bg-primary h-1 rounded-full" style={{ width: '100%' }} />

            </Div>
          </Div>
        </Btn>

        {isExpanded && (
          <Div className="border-t border-border px-4 py-4 bg-secondary/10 space-y-4 rounded-b-lg bg-card border border-border border-t-0">
            {promoterRows.length === 0 && exPrTotalRevenue === 0 ? (
              <P className="text-xs text-muted-foreground text-center py-2">
                Nessun fatturato promoter — modificala per inserirli
              </P>
            ) : (
              <>
                <Div>
                  <SectionHeader icon={Users} title="Fatturato per promoter" color="#a78bfa" className="mb-2" />
                  <Div className="space-y-1.5 mb-3">
                    {promoterRows.map(({ promoter, revenue, tables }) => {
                      const pct = totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0;
                      return (
                        <Div key={promoter.id} className="p-2.5 rounded-lg bg-card/50 text-sm space-y-1.5">
                          <Div className="flex items-center justify-between">
                            <Div className="flex items-center gap-2">
                              <Div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden">
                                {promoter.photo_url
                                  ? <Img src={promoter.photo_url} alt={promoter.name} className="w-full h-full object-cover" />
                                  : promoter.name?.charAt(0)?.toUpperCase()
                                }
                              </Div>
                              <Span className="font-medium">{promoter.name}</Span>
                              {promoter.status === 'inattivo' && <Span className="text-[10px] text-amber-400/70 italic">(inattivo)</Span>}
                            </Div>
                            <Div className="flex items-center gap-2">
                              <Span className="text-xs text-muted-foreground">{pct}%</Span>
                              <Span className="text-xs text-muted-foreground">{tables}t</Span>
                              <Span className="font-bold text-primary">€{revenue.toLocaleString('it-IT')}</Span>
                            </Div>
                          </Div>
                          <Div className="w-full bg-secondary rounded-full h-1.5">
                            <Div className="bg-primary h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                          </Div>
                        </Div>
                      );
                    })}
                    <ExPrRows />
                  </Div>
                  <Suspense fallback={<Div
                    className="h-32 vibra-skeleton rounded-lg"
                    accessibilityLabel="Caricamento grafico" />}><EventPromoterChart promoterRows={promoterRows} /></Suspense>
                </Div>
              </>
            )}
            <Div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </Div>
          </Div>
        )}
      </Div>
    );
  }

  // Layout a quadrati piccoli (mini)
  if (layout === 'mini') {
    return (
      <Div>
        <Divider />
        <Btn
          button
          onClick={() => onToggleExpand(!isExpanded)}
          className="w-full rounded-lg bg-card border border-border overflow-hidden hover:border-primary/30 transition-all">
          <Div className="p-2.5 space-y-1.5">
            <Div className="flex items-start justify-between gap-2">
              <Div className="flex-1 text-left min-w-0">
                <Div className="flex items-center gap-1.5 min-w-0">
                  <VenueLogo venueKey={event.venue} size="sm" />
                  <P className="font-semibold text-xs">{event.name}</P>
                </Div>
                <P className="text-[10px] text-muted-foreground">
                  {day} {month}
                  {event.physical_location && <Span className="text-primary ml-1">→ {event.physical_location}</Span>}
                </P>
              </Div>
              <Div className="text-right shrink-0">
                <P className="font-bold text-primary text-xs">€{(totalRevenue / 1000).toFixed(0)}k</P>
                <P className="text-[9px] text-muted-foreground">{totalTables}t</P>
              </Div>
            </Div>
          </Div>
        </Btn>

        {isExpanded && (
          <Div className="border-t border-border px-3 py-3 bg-secondary/10 space-y-3 rounded-b-lg bg-card border border-border border-t-0">
            {promoterRows.length === 0 && exPrTotalRevenue === 0 ? (
              <P className="text-xs text-muted-foreground text-center py-2">Nessun fatturato</P>
            ) : (
              <>
                <Div className="space-y-1">
                  {promoterRows.map(({ promoter, revenue }) => (
                    <Div key={promoter.id} className="p-1.5 rounded-lg bg-card/50 text-[11px]">
                      <Div className="flex items-center justify-between">
                        <Span className="font-medium truncate">{promoter.name}{promoter.status === 'inattivo' ? ' (inattivo)' : ''}</Span>
                        <Span className="text-muted-foreground">€{revenue.toLocaleString('it-IT')}</Span>
                      </Div>
                    </Div>
                  ))}
                  <ExPrRows compact />
                </Div>
              </>
            )}
            <Div className="flex justify-end gap-1 pt-2 border-t border-border">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <Pencil className="w-2.5 h-2.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                <Trash2 className="w-2.5 h-2.5" />
              </Button>
            </Div>
          </Div>
        )}
      </Div>
    );
  }

  // Layout rettangolare (default)
  return (
    <Div>
      <Divider />
      <Div className="rounded-xl bg-card border border-border overflow-hidden">
        <Btn
          className="px-3 py-3 flex items-center gap-2 cursor-pointer hover:bg-secondary/20 transition-colors"
          onClick={() => onToggleExpand(!isExpanded)}
        >
          {/* Data - solo su schermi >= sm */}
          <Div className="hidden sm:flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0">
            <Span className="text-base font-bold text-primary leading-none">{day}</Span>
            <Span className="text-[9px] text-primary/70 uppercase">{month}</Span>
          </Div>

          {/* Info serata — flex-1 con min-w-0 per truncate */}
          <Div className="flex-1 min-w-0">
            <Div className="flex items-center gap-1.5 min-w-0">
              <VenueLogo venueKey={event.venue} size="sm" />
              <P className="font-semibold text-sm">{event.name}</P>
            </Div>
            {event.notes && <P className="text-xs text-amber-500 italic">{event.notes}</P>}
            <Div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5 flex-wrap">
              {/* Data anche su mobile */}
              <Span className="sm:hidden">{day} {month} ·</Span>
              <Span>
                {event.physical_location
                  ? <>{event.venue || ''} <Span className="text-primary">→ {event.physical_location}</Span></>
                  : event.venue || ''
                }
              </Span>
              {customThreshold && <Span className="text-amber-400/70 font-medium">soglia €{customThreshold}</Span>}
            </Div>
          </Div>

          {/* Revenue + azioni */}
          <Div className="flex items-center gap-1.5 flex-shrink-0">
            <Div className="text-right">
              <P className="font-bold text-primary text-sm">€{totalRevenue.toLocaleString('it-IT')}</P>
              <P className="text-[10px] text-muted-foreground">{totalTables}t</P>
            </Div>
            <Div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={e => { e.stopPropagation(); setNoteDialogOpen(true); }}
                title="Nota"
              >
                <StickyNote className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); onEdit(); }}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={e => { e.stopPropagation(); onDelete(); }}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </Div>
          </Div>
        </Btn>

        {isExpanded && (
          <Div className="border-t border-border px-4 py-4 bg-secondary/10 space-y-4">
            {promoterRows.length === 0 && exPrTotalRevenue === 0 ? (
              <P className="text-xs text-muted-foreground text-center py-2">
                Nessun fatturato promoter — modificala per inserirli
              </P>
            ) : (
              <>
                <Div>
                  <SectionHeader icon={Users} title="Fatturato per promoter" color="#a78bfa" className="mb-2" />
                  <Div className="space-y-1.5 mb-3">
                    {promoterRows.map(({ promoter, revenue, tables }) => {
                      const pct = totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0;
                      return (
                        <Div key={promoter.id} className="p-2.5 rounded-lg bg-card/50 text-sm space-y-1.5">
                          <Div className="flex items-center justify-between">
                            <Div className="flex items-center gap-2">
                              <Div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden">
                                {promoter.photo_url
                                  ? <Img src={promoter.photo_url} alt={promoter.name} className="w-full h-full object-cover" />
                                  : promoter.name?.charAt(0)?.toUpperCase()
                                }
                              </Div>
                              <Span className="font-medium">{promoter.name}</Span>
                              {promoter.status === 'inattivo' && <Span className="text-[10px] text-amber-400/70 italic">(inattivo)</Span>}
                            </Div>
                            <Div className="flex items-center gap-2">
                              <Span className="text-xs text-muted-foreground">{pct}%</Span>
                              <Span className="text-xs text-muted-foreground">{tables}t</Span>
                              <Span className="font-bold text-primary">€{revenue.toLocaleString('it-IT')}</Span>
                            </Div>
                          </Div>
                          <Div className="w-full bg-secondary rounded-full h-1.5">
                            <Div className="bg-primary h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                          </Div>
                        </Div>
                      );
                    })}
                    <ExPrRows />
                  </Div>
                  <Suspense fallback={<Div
                    className="h-32 vibra-skeleton rounded-lg"
                    accessibilityLabel="Caricamento grafico" />}><EventPromoterChart promoterRows={promoterRows} /></Suspense>
                </Div>
              </>
            )}
          </Div>
        )}
      </Div>

      {/* Note dialog */}
      {noteDialogOpen && (
        <Div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-sm">
            <Div className="p-6 space-y-4">
              <H className="font-semibold text-lg">Nota per {event.name}</H>
              <HtmlTextarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Aggiungi una nota per ricordare dettagli particolari di questa serata..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                rows={4}
              />
              <Div className="flex gap-2 justify-end">
                <Btn
                  button
                  onClick={() => setNoteDialogOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary/20">
                  Annulla
                </Btn>
                <Btn
                  button
                  onClick={() => updateNoteMut.mutate(noteText)}
                  disabled={updateNoteMut.isPending}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                  Salva
                </Btn>
              </Div>
            </Div>
          </Div>
        </Div>
      )}
    </Div>
  );
}