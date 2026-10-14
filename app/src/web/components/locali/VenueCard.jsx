// Port di src/components/locali/VenueCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronDown, ChevronUp, CalendarDays, Users, Trophy, LayoutGrid, Pencil, X, TrendingUp, FileText, Map, Expand } from '@/ui/icons.generated';
import { calcTables } from '@/legacy/utils/tables';
import PiantinaFullscreen from '@/web/components/ilmiovibra/PiantinaFullscreen';
import CachedImage from '@/web/components/shared/CachedImage';
import { uploadFile, useAppSetting } from '@/web/hooks/useAppSetting';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from '@/ui/recharts';
import { getEventDow } from '@/legacy/utils/dateUtils';

import { url as webURL } from '@/web/shims/dom';
import { Btn, Div, H, P, Span } from '@/ui/html';
import { HtmlInput, Img } from '@/ui/elements';

function getEventRev(ev, attendances) {
  if (ev.total_revenue) return ev.total_revenue;
  return attendances.filter(a => a.event_id === ev.id).reduce((s, a) => s + (a.revenue || 0), 0);
}



function getVenueEvents(venue, events) {
  if (venue.is_extra) return events.filter(e => e.is_extra);
  return events.filter(e => e.venue === venue.name);
}

function VenueRevenueChart({ enrichedEvents, hex }) {
  const [chartMonths, setChartMonths] = useState(12);
  const now = new Date();

  const effectiveMonths = chartMonths === 0
    ? (() => {
        const oldest = enrichedEvents.map(e => e.date).filter(Boolean).sort()[0];
        if (!oldest) return 12;
        const o = parseISO(oldest);
        return Math.max((now.getFullYear() - o.getFullYear()) * 12 + (now.getMonth() - o.getMonth()) + 1, 1);
      })()
    : chartMonths;

  const chartData = Array.from({ length: effectiveMonths }, (_, i) => {
    const ms = startOfMonth(subMonths(now, effectiveMonths - 1 - i));
    const me = endOfMonth(ms);
    const label = format(ms, 'MMM yy', { locale: it });
    const monthEvents = enrichedEvents.filter(ev => {
      try { return ev.date && isWithinInterval(parseISO(ev.date), { start: ms, end: me }); } catch { return false; }
    });
    const rev = monthEvents.reduce((s, ev) => s + ev._rev, 0);
    return { label, fatturato: rev, serate: monthEvents.length };
  });

  const tooltipStyle = { background: 'hsl(240 6% 8%)', border: '1px solid hsl(240 5% 18%)', borderRadius: 6, fontSize: 11, color: '#fff' };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const { fatturato, serate } = payload[0].payload;
    return (
      <Div style={tooltipStyle} className="px-3 py-2.5">
        <P className="font-semibold text-xs mb-1" style={{ color: 'hsl(0 0% 90%)' }}>{label}</P>
        <P style={{ color: hex }} className="text-xs font-medium">Fatturato: €{Number(fatturato).toLocaleString('it-IT')}</P>
        <P className="text-xs" style={{ color: 'hsl(240 5% 60%)' }}>{serate} {serate === 1 ? 'serata' : 'serate'}</P>
      </Div>
    );
  };

  return (
    <Div className="rounded-xl border border-border/30 p-4 space-y-3">
      <Div className="flex items-center justify-between">
        <P className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" /> Andamento Fatturato
        </P>
        <Div className="flex gap-1">
          {[6, 12, 24, 48].map(m => (
            <Btn
              button
              key={m}
              onClick={() => setChartMonths(m)}
              className={`px-2 py-1 rounded text-[10px] border transition-all ${chartMonths === m ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
              {m}m
            </Btn>
          ))}
          <Btn
            button
            onClick={() => setChartMonths(0)}
            className={`px-2 py-1 rounded text-[10px] border transition-all ${chartMonths === 0 ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
            ∞
          </Btn>
        </Div>
      </Div>
      <Div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickLine={false} axisLine={false}
              interval={effectiveMonths > 18 ? Math.floor(effectiveMonths / 10) : 0} />
            <YAxis tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={v => v >= 1000 ? `€${(v / 1000).toFixed(0)}k` : `€${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="fatturato" stroke={hex} strokeWidth={2}
              dot={{ r: 3, fill: hex, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Div>
    </Div>
  );
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <P className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" /> {children}
    </P>
  );
}

function VenueLogoWithEdit({ logoUrl, venueKey, hex, onEdit }) {
  if (!logoUrl) {
    return (
      <Div className="relative w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: `${hex}10` }}>
        <Span className="text-xs font-bold" style={{ color: hex }}>{venueKey.charAt(0)}</Span>
        <Btn
          button
          onClick={onEdit}
          className="absolute bottom-1 right-1 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          accessibilityLabel="Modifica logo">
          <Pencil className="w-3 h-3" />
        </Btn>
      </Div>
    );
  }
  return (
    <Div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-card flex items-center justify-center">
      <CachedImage src={logoUrl} alt={venueKey} className="w-full h-full object-contain" />
      <Btn
        button
        onClick={onEdit}
        className="absolute bottom-1 right-1 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        accessibilityLabel="Modifica logo">
        <Pencil className="w-3 h-3" />
      </Btn>
    </Div>
  );
}

function LogoEditDialog({ open, onClose, venueKey, currentLogoUrl, onConfirm, uploading }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef();

  React.useEffect(() => {
    if (open) {
      setPreviewUrl(currentLogoUrl);
      setFile(null);
    }
  }, [open, currentLogoUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(webURL.createObjectURL(selectedFile));
    }
  };

  if (!open) return null;

  return (
    <Btn className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <Btn className="bg-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-border" onClick={e => e.stopPropagation()}>
        <Div className="flex items-center justify-between mb-4">
          <H className="text-lg font-semibold">Modifica logo {venueKey}</H>
          <Btn
            button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </Btn>
        </Div>
        <Div className="w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden bg-secondary/20 flex items-center justify-center border border-border">
          {previewUrl
            ? <Img src={previewUrl} alt={venueKey} className="w-full h-full object-contain" />
            : <Span className="text-muted-foreground text-xs">Nessun logo</Span>
          }
        </Div>
        <Div className="mb-4">
          <HtmlInput ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <Btn
            button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors text-sm font-medium">
            {file ? 'Cambia immagine' : currentLogoUrl ? 'Sostituisci logo' : 'Carica logo'}
          </Btn>
          {file && <P className="text-xs text-muted-foreground text-center mt-1">{file.name}</P>}
        </Div>
        <Div className="flex gap-2">
          <Btn
            button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-border bg-transparent hover:bg-secondary transition-colors text-sm font-medium">
            Annulla
          </Btn>
          <Btn
            button
            onClick={() => onConfirm(file)}
            disabled={uploading}
            className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50">
            {uploading ? 'Salvataggio...' : 'Conferma'}
          </Btn>
        </Div>
      </Btn>
    </Btn>
  );
}

export default function VenueCard({ venue, events, attendances, promoters, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [piantinaFs, setPiantinaFs] = useState(false);
  const queryClient = useQueryClient();

  const logoVenueKey = venue.logo_key || venue.name;
  const [logoUrl, setLogoUrl] = useAppSetting('venue_logo_' + logoVenueKey);
  const [piantinaUrl] = useAppSetting('venue_piantina_' + logoVenueKey);
  const [formulaText] = useAppSetting('venue_formule_' + logoVenueKey);

  const handleLogoConfirm = async (file) => {
    if (!file) { setShowEditDialog(false); return; }
    setUploading(true);
    try {
      const url = await uploadFile(file);
      await setLogoUrl(url);
      queryClient.invalidateQueries({ queryKey: ['venue-logos-all'] });
      setShowEditDialog(false);
    } catch (error) {
      console.error('Errore upload logo:', error);
    }
    setUploading(false);
  };

  const venueEvents = getVenueEvents(venue, events).sort((a, b) =>
    (b.date || '').localeCompare(a.date || '')
  );

  const totalSerate = venueEvents.length;

  const enrichedEvents = venueEvents.map(ev => {
    const rev = getEventRev(ev, attendances);
    const dow = getEventDow(ev);
    const tables = calcTables(rev, dow, ev.table_threshold);
    return { ...ev, _rev: rev, _tables: tables };
  });

  const totalRevenue = enrichedEvents.reduce((s, ev) => s + ev._rev, 0);
  const avgRevenue = totalSerate > 0 ? Math.round(totalRevenue / totalSerate) : 0;
  const totalTables = enrichedEvents.reduce((s, ev) => s + ev._tables, 0);
  const avgTables = totalSerate > 0 ? Math.round((totalTables / totalSerate) * 10) / 10 : 0;
  const maxRevenue = enrichedEvents.length > 0 ? Math.max(...enrichedEvents.map(e => e._rev)) : 0;

  const top10Revenue = [...enrichedEvents].sort((a, b) => b._rev - a._rev).slice(0, 10);
  const top10Tables = [...enrichedEvents].sort((a, b) => b._tables - a._tables).slice(0, 10);
  const recentEvents = enrichedEvents.slice(0, 5);

  const promoterRevMap = {};
  venueEvents.forEach(ev => {
    attendances.filter(a => a.event_id === ev.id && a.promoter_id).forEach(a => {
      promoterRevMap[a.promoter_id] = (promoterRevMap[a.promoter_id] || 0) + (a.revenue || 0);
    });
  });
  const topPromoters = Object.entries(promoterRevMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pid, rev]) => ({ promoter: promoters.find(p => p.id === pid), revenue: rev }))
    .filter(r => r.promoter);

  const venueName = venue.is_extra ? 'Extra / Festivi' : venue.name;

  return (
    <Btn
      id={`venue-card-${venue.name}`}
      className="rounded-2xl bg-card border overflow-hidden transition-all duration-200 cursor-pointer scroll-mt-24"
      style={{ borderColor: `${venue.hex}30` }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Header — sempre visibile */}
      <Div className="p-6">
        <Div className="flex items-center gap-5">
          {/* Logo con editing */}
          <VenueLogoWithEdit
            logoUrl={logoUrl}
            venueKey={venue.name}
            hex={venue.hex}
            onEdit={(e) => { e.stopPropagation(); setShowEditDialog(true); }}
          />

          <LogoEditDialog
            open={showEditDialog}
            onClose={() => setShowEditDialog(false)}
            venueKey={venue.name}
            currentLogoUrl={logoUrl}
            onConfirm={handleLogoConfirm}
            uploading={uploading}
          />

          {/* Info principale */}
          <Div className="flex-1 min-w-0">
            <Div className="flex items-center gap-1.5 mb-1">
              <Span className="w-2 h-2 rounded-full shrink-0" style={{ background: venue.hex }} />
              <Span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: venue.hex }}>
                {venue.label} · {venue.sublabel}
              </Span>
            </Div>
            <H className="font-bold text-lg leading-tight">{venueName}</H>
            <P className="text-sm text-muted-foreground mt-0.5">{totalSerate} serate registrate</P>
            {venueEvents[0]?.date && (
              <P className="text-xs text-muted-foreground mt-0.5">
                Ultima: {format(parseISO(venueEvents[0].date), 'd MMM yyyy', { locale: it })}
              </P>
            )}
          </Div>

          {/* Chevron */}
          <Div className="shrink-0 text-muted-foreground">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Div>
        </Div>

        {/* KPI grid */}
        <Div className="grid grid-cols-6 gap-2 mt-5">
          {[
            { label: 'Fatturato tot.', value: `€${totalRevenue.toLocaleString('it-IT')}` },
            { label: 'Media/serata', value: `€${avgRevenue.toLocaleString('it-IT')}` },
            { label: 'Miglior serata', value: `€${maxRevenue.toLocaleString('it-IT')}` },
            { label: 'Tavoli tot.', value: Math.round(totalTables * 10) / 10 },
            { label: 'Media tavoli', value: avgTables },
            { label: 'N. serate', value: totalSerate },
          ].map(({ label, value }) => (
            <Div key={label} className="rounded-xl p-3 text-center" style={{ background: `${venue.hex}10` }}>
              <P className="text-[10px] text-muted-foreground leading-tight">{label}</P>
              <P className="text-sm font-bold mt-1 leading-tight">{value}</P>
            </Div>
          ))}
        </Div>
      </Div>

      {/* Expanded details */}
      {expanded && (
        <Btn
          className="border-t px-6 py-6 space-y-8 bg-secondary/10"
          style={{ borderColor: `${venue.hex}20` }}
          onClick={e => e.stopPropagation()}
        >
          {totalSerate === 0 && (
            <P className="text-sm text-muted-foreground text-center py-4 italic">Nessuna serata registrata per questo locale</P>
          )}

          {/* Piantina */}
          {piantinaUrl && (
            <Div className="rounded-lg border border-border bg-secondary/20 p-3 overflow-hidden space-y-2">
              <Div className="flex items-center justify-between">
                <P className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Map className="w-3.5 h-3.5" /> Piantina
                </P>
                <Btn
                  button
                  onClick={() => setPiantinaFs(true)}
                  className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors">
                  <Expand className="w-3 h-3" /> Espandi
                </Btn>
              </Div>
              <Img
                src={piantinaUrl}
                alt="Piantina"
                onClick={() => setPiantinaFs(true)}
                className="w-full max-h-64 object-contain rounded border border-border cursor-pointer active:opacity-80 transition-opacity"
              />
            </Div>
          )}

          {piantinaFs && (
            <PiantinaFullscreen
              src={piantinaUrl}
              label={`${venueName} — Piantina`}
              onClose={() => setPiantinaFs(false)}
            />
          )}

          {/* Formule di Entrata */}
          {formulaText && (
            <Div className="rounded-lg border border-border bg-secondary/20 p-3 space-y-2">
              <P className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Formule di Entrata
              </P>
              <P className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed">{formulaText}</P>
            </Div>
          )}

          {/* Grafico andamento fatturato */}
          {enrichedEvents.length > 0 && (
            <VenueRevenueChart enrichedEvents={enrichedEvents} hex={venue.hex} />
          )}

          {/* Top 10 fatturato + tavoli — side by side */}
          {(top10Revenue.length > 0 || top10Tables.length > 0) && (
            <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top 10 fatturato */}
              {top10Revenue.length > 0 && (
                <Div>
                  <SectionTitle icon={Trophy}>Top 10 — Fatturato</SectionTitle>
                  <Div className="space-y-2">
                    {top10Revenue.map((ev, i) => {
                      const pct = maxRevenue > 0 ? Math.round((ev._rev / maxRevenue) * 100) : 0;
                      return (
                        <Div key={ev.id} className="flex items-center gap-2">
                          <Span className="text-xs text-muted-foreground w-5 text-right shrink-0">{i + 1}</Span>
                          <Div className="flex-1 min-w-0">
                            <Div className="flex items-center justify-between mb-0.5">
                              <Span className="text-xs text-muted-foreground shrink-0 mr-2">
                                {ev.date ? format(parseISO(ev.date), 'd MMM yy', { locale: it }) : '-'}
                              </Span>
                              <Span className="text-xs font-bold shrink-0">€{ev._rev.toLocaleString('it-IT')}</Span>
                            </Div>
                            <Div className="w-full bg-secondary rounded-full h-1.5">
                              <Div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: venue.hex }} />
                            </Div>
                          </Div>
                        </Div>
                      );
                    })}
                  </Div>
                </Div>
              )}

              {/* Top 10 tavoli */}
              {top10Tables.length > 0 && (
                <Div>
                  <SectionTitle icon={LayoutGrid}>Top 10 — Tavoli</SectionTitle>
                  <Div className="space-y-2">
                    {top10Tables.map((ev, i) => {
                      const maxT = top10Tables[0]._tables || 1;
                      const pct = Math.round((ev._tables / maxT) * 100);
                      return (
                        <Div key={ev.id} className="flex items-center gap-2">
                          <Span className="text-xs text-muted-foreground w-5 text-right shrink-0">{i + 1}</Span>
                          <Div className="flex-1 min-w-0">
                            <Div className="flex items-center justify-between mb-0.5">
                              <Span className="text-xs text-muted-foreground shrink-0 mr-2">
                                {ev.date ? format(parseISO(ev.date), 'd MMM yy', { locale: it }) : '-'}
                              </Span>
                              <Span className="text-xs font-bold shrink-0">{Math.round(ev._tables * 10) / 10} t</Span>
                            </Div>
                            <Div className="w-full bg-secondary rounded-full h-1.5">
                              <Div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: venue.hex }} />
                            </Div>
                          </Div>
                        </Div>
                      );
                    })}
                  </Div>
                </Div>
              )}
            </Div>
          )}

          {/* Top promoter + Ultime serate — side by side */}
          <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topPromoters.length > 0 && (
              <Div>
                <SectionTitle icon={Users}>Top Promoter</SectionTitle>
                <Div className="space-y-2">
                  {topPromoters.map(({ promoter, revenue }, i) => {
                    const pct = totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0;
                    return (
                      <Div key={promoter.id} className="flex items-center gap-2">
                        <Span className="text-xs text-muted-foreground w-5 text-right">{i + 1}</Span>
                        <Div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden shrink-0">
                          {promoter.photo_url
                            ? <Img src={promoter.photo_url} alt={promoter.name} className="w-full h-full object-cover" />
                            : promoter.name?.charAt(0)?.toUpperCase()
                          }
                        </Div>
                        <Div className="flex-1 min-w-0">
                          <Div className="flex items-center justify-between mb-0.5">
                            <Span className="text-xs font-medium truncate">{promoter.name}</Span>
                            <Span className="text-xs text-muted-foreground ml-2 shrink-0">€{revenue.toLocaleString('it-IT')}</Span>
                          </Div>
                          <Div className="w-full bg-secondary rounded-full h-1.5">
                            <Div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: venue.hex }} />
                          </Div>
                        </Div>
                      </Div>
                    );
                  })}
                </Div>
              </Div>
            )}

            {recentEvents.length > 0 && (
              <Div>
                <SectionTitle icon={CalendarDays}>Ultime serate</SectionTitle>
                <Div className="space-y-1.5">
                  {recentEvents.map(ev => (
                    <Div key={ev.id} className="flex items-center justify-between text-sm px-3 py-2 rounded-lg bg-card/60">
                      <Div>
                        <Span className="text-muted-foreground text-xs">
                          {ev.date ? format(parseISO(ev.date), 'd MMM yy', { locale: it }) : '-'}
                        </Span>
                        {ev.physical_location && (
                          <Span className="text-[10px] text-primary ml-1.5">→ {ev.physical_location}</Span>
                        )}
                      </Div>
                      <Div className="flex items-center gap-4">
                        <Span className="text-muted-foreground text-xs">{Math.round(ev._tables * 10) / 10} t</Span>
                        <Span className="font-semibold text-sm">€{ev._rev.toLocaleString('it-IT')}</Span>
                      </Div>
                    </Div>
                  ))}
                </Div>
              </Div>
            )}
          </Div>
        </Btn>
      )}
    </Btn>
  );
}