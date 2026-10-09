// Port di src/components/dashboard/VenueRevenueWidget.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';

import { BarChart2 } from '@/ui/icons.generated';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from '@/ui/recharts';
import MonthPicker from './MonthPicker';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import CachedImage from '@/web/components/shared/CachedImage';


import { Btn, Div, P, Span } from '@/ui/html';


const ALL_VENUES = [
  { key: 'Ammare Frontemare',         hex: '#60a5fa' },
  { key: 'Nemesi Club Type',          hex: '#818cf8' },
  { key: 'Mantra',                    hex: '#fb923c' },
  { key: 'Hi.Club Brass',             hex: '#4ade80' },
  { key: 'Toma',                      hex: '#fbbf24' },
  { key: 'Superstar Pineta',          hex: '#f472b6' },
  { key: 'Paprika Scilla',            hex: '#38bdf8' },
  { key: 'Estasi Scilla',             hex: '#7dd3fc' },
  { key: 'Fantasya Living',           hex: '#a5b4fc' },
  { key: 'Loonatica Maison del Mare', hex: '#ea580c' },
  { key: 'Kolossal Brass',            hex: '#86efac' },
  { key: 'Chapeau Club Type',         hex: '#c084fc' },
  { key: '__festivo__',               hex: '#ef4444' },
];

const tooltipStyle = {
  background: 'hsl(240 6% 8%)',
  border: '1px solid hsl(240 5% 18%)',
  borderRadius: '10px',
  fontSize: 12,
  color: '#fff',
};

function buildData(events) {
  return ALL_VENUES.map(v => {
    const filtered = v.key === '__festivo__'
      ? events.filter(e => e.is_extra)
      : events.filter(e => e.venue === v.key);
    const rev = filtered.reduce((s, e) => s + (e.total_revenue || 0), 0);
    const name = v.key === '__festivo__' ? 'Extra/Festivi' : v.key;
    return { key: v.key, name, rev, count: filtered.length, hex: v.hex };
  }).filter(d => d.count > 0);
}

export default function VenueRevenueWidget({ events, delay = 0 }) {
  const [tab, setTab] = useState('alltime');
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const { getVenueLogo } = useAllVenueLogos();

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

  const filteredEvents = tab === 'month'
    ? events.filter(e => e.date && isWithinInterval(parseISO(e.date), { start: monthStart, end: monthEnd }))
    : events;

  const data = buildData(filteredEvents).sort((a, b) => b.rev - a.rev);
  const maxRev = data[0]?.rev || 1;

  return (
    <Div
      className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-5 h-full"
      style={{ animationDelay: `${delay}s` }}
    >
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, #fb923c, transparent)', opacity: 0.6 }} />

      <Div className="flex items-center justify-between mb-4">
        <Div className="flex items-center gap-2">
          <Div className="p-1.5 rounded-lg bg-orange-500/15">
            <BarChart2 className="w-4 h-4 text-orange-400" />
          </Div>
          <P className="text-xs font-semibold text-orange-400 uppercase tracking-widest">Fatturato per Locale</P>
        </Div>
        {tab === 'month' && (
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
        )}
      </Div>

      {/* Tabs */}
      <Div className="flex gap-1 mb-4 p-1 rounded-xl bg-secondary/30">
        {['alltime', 'month'].map(t => (
          <Btn
            button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-all duration-200 ${
              tab === t
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}>
            {t === 'alltime' ? 'Sempre' : 'Mese'}
          </Btn>
        ))}
      </Div>

      {data.length === 0 ? (
        <P className="text-xs text-muted-foreground text-center py-8">Nessun dato</P>
      ) : (
        <Div className="space-y-2.5" key={`${tab}-${selectedMonth.getTime()}`}>
          {data.map((d, i) => {
            const { logoUrl } = getVenueLogo(d.key);
            const pct = Math.round((d.rev / maxRev) * 100);
            return (
              <Div
                key={d.key}
                className="flex items-center gap-3"
              >
                <Div className="w-6 h-6 rounded-lg overflow-hidden bg-card flex items-center justify-center shrink-0 border border-white/[0.06]">
                  {logoUrl
                    ? <CachedImage src={logoUrl} alt={d.name} className="w-full h-full object-contain" />
                    : <Div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: d.hex }}>{d.name.charAt(0)}</Div>
                  }
                </Div>
                <Div className="flex-1 min-w-0">
                  <Div className="flex items-center justify-between mb-1">
                    <Span className="text-xs font-medium truncate">{d.name}</Span>
                    <Span className="text-xs font-bold shrink-0 ml-2" style={{ color: d.hex }}>€{d.rev.toLocaleString('it-IT')}</Span>
                  </Div>
                  <Div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <Div
                      className="h-1.5 rounded-full bar-grow"
                      style={{
                        '--bar-width': `${pct}%`,
                        background: d.hex,
                      }}
                    />
                  </Div>
                </Div>
              </Div>
            );
          })}
        </Div>
      )}
    </Div>
  );
}
