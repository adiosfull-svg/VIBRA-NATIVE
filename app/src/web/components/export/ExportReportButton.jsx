// Port di src/components/export/ExportReportButton.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { Download, Loader2, Check, FileDown } from '@/ui/icons.generated';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { it } from 'date-fns/locale';
import { calcTables } from '@/legacy/utils/tables';
import jsPDF from '@/web/shims/jspdf';

import { doc as webDocument, storage as webStorage, url as webURL } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

const BRAND_COLOR = [85, 26, 142]; // #551a8e

// ── Data builders ──
function buildPromoterRows(promoters, attendances, events) {
  return promoters
    .filter(p => p.status === 'attivo')
    .map(p => {
      const pa = attendances.filter(a =>
        a.promoter_id === p.id && a.present !== false && !a.client_id && events.find(e => e.id === a.event_id)?.date
      );
      const fatturato = pa.reduce((s, a) => s + (a.revenue || 0), 0);
      const tavoli = pa.reduce((s, a) => {
        const ev = events.find(e => e.id === a.event_id);
        return s + calcTables(a.revenue || 0, null, ev?.table_threshold || 300);
      }, 0);
      const media = pa.length > 0 ? Math.round(fatturato / pa.length) : 0;
      return {
        nome: p.name,
        serate: pa.length,
        fatturato: Math.round(fatturato),
        media,
        tavoli: Math.round(tavoli * 10) / 10,
        zona: [p.neighborhood, p.city].filter(Boolean).join(', ') || '-',
      };
    })
    .sort((a, b) => b.fatturato - a.fatturato);
}

function buildEventRows(events, attendances) {
  return [...events]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .map(ev => {
      const evAtt = attendances.filter(a => a.event_id === ev.id && a.present !== false && !a.client_id);
      const totProm = evAtt.reduce((s, a) => s + (a.revenue || 0), 0);
      return {
        data: ev.date ? format(parseISO(ev.date), 'd MMM yyyy', { locale: it }) : '-',
        nome: ev.name || '-',
        locale: ev.venue || '-',
        fatturato: ev.total_revenue || 0,
        promoter_attivi: evAtt.length,
        fat_promoter: Math.round(totProm),
      };
    });
}

function buildMonthlyRows(events) {
  const byMonth = {};
  events.forEach(ev => {
    if (!ev.date) return;
    const m = ev.date.substring(0, 7);
    if (!byMonth[m]) byMonth[m] = { fatturato: 0, serate: 0 };
    byMonth[m].fatturato += ev.total_revenue || 0;
    byMonth[m].serate += 1;
  });
  return Object.entries(byMonth)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([m, v]) => ({
      mese: format(parseISO(m + '-01'), 'MMMM yyyy', { locale: it }),
      serate: v.serate,
      fatturato: Math.round(v.fatturato),
      media: v.serate > 0 ? Math.round(v.fatturato / v.serate) : 0,
    }));
}

// ── PDF helpers ──
function drawPageHeader(doc, title, dateStr, periodLabel) {
  const logoUrl = webStorage.getItem('org_logo_url') || '';
  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 0, 297, 26, 'F');

  if (logoUrl && logoUrl.startsWith('data:image')) {
    try {
      const ext = logoUrl.includes('png') ? 'PNG' : 'JPEG';
      const imgEl = new Image();
      imgEl.src = logoUrl;
      const maxH = 22, maxW = 50;
      let iw = imgEl.naturalWidth || 1, ih = imgEl.naturalHeight || 1;
      let ratio = iw / ih, drawH = maxH, drawW = drawH * ratio;
      if (drawW > maxW) { drawW = maxW; drawH = drawW / ratio; }
      doc.addImage(logoUrl, ext, 8, (26 - drawH) / 2, drawW, drawH);
    } catch {
      doc.setTextColor(255, 255, 255); doc.setFontSize(15); doc.setFont('helvetica', 'bold'); doc.text('VIBRA', 14, 13);
    }
  } else {
    doc.setTextColor(255, 255, 255); doc.setFontSize(15); doc.setFont('helvetica', 'bold'); doc.text('VIBRA', 14, 13);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12); doc.setFont('helvetica', 'bold');
  doc.text(title, 68, 10);
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  if (periodLabel) doc.text(`Periodo: ${periodLabel}`, 68, 17);
  doc.text(`Generato il ${dateStr}`, 283, 17, { align: 'right' });
}

function drawTable(doc, headers, widths, rows, startY) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  let cx = 14;
  headers.forEach((h, i) => {
    doc.setFillColor(...BRAND_COLOR);
    doc.rect(cx, startY, widths[i], 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(h, cx + 2, startY + 5);
    cx += widths[i];
  });
  let y = startY + 7;
  doc.setFont('helvetica', 'normal');
  rows.forEach((row, ri) => {
    if (y + 7 > 200) { doc.addPage(); y = 15; }
    doc.setFillColor(ri % 2 === 0 ? 255 : 248, ri % 2 === 0 ? 255 : 244, ri % 2 === 0 ? 255 : 252);
    cx = 14;
    widths.forEach(w => { doc.rect(cx, y, w, 7, 'F'); cx += w; });
    doc.setTextColor(40, 40, 40);
    cx = 14;
    row.forEach((cell, i) => { doc.text(String(cell ?? '-'), cx + 2, y + 5); cx += widths[i]; });
    y += 7;
  });
  return y;
}

function drawBarChart(doc, data, labelKey, valueKey, title, startY) {
  if (!data.length) return startY;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
  doc.text(title, 14, startY);
  let y = startY + 5;
  const maxVal = Math.max(...data.map(d => d[valueKey]), 1);
  const barArea = 180;
  data.slice(0, 15).forEach((d, i) => {
    if (y + 8 > 200) return;
    const barW = Math.max(2, (d[valueKey] / maxVal) * barArea);
    const label = String(d[labelKey]).length > 18 ? String(d[labelKey]).slice(0, 17) + '…' : String(d[labelKey]);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(60, 60, 60);
    doc.text(`${i + 1}. ${label}`, 14, y + 4.5);
    doc.setFillColor(...BRAND_COLOR);
    doc.rect(68, y, barW, 5, 'F');
    doc.setFont('helvetica', 'bold'); doc.setTextColor(...BRAND_COLOR);
    const valStr = valueKey === 'fatturato' || valueKey === 'media'
      ? `€${Number(d[valueKey]).toLocaleString('it-IT')}`
      : String(d[valueKey]);
    doc.text(valStr, 68 + barW + 2, y + 4.5);
    y += 9;
  });
  return y + 4;
}

function filterEventsByPeriod(events, from, to) {
  if (!from && !to) return events;
  const fromD = from ? parseISO(from) : new Date('1900-01-01');
  const toD = to ? parseISO(to) : new Date('2099-12-31');
  return events.filter(e => {
    if (!e.date) return false;
    try { return isWithinInterval(parseISO(e.date), { start: fromD, end: toD }); } catch { return false; }
  });
}

function filterAttendancesByPeriod(attendances, events, from, to) {
  const filteredEvIds = new Set(filterEventsByPeriod(events, from, to).map(e => e.id));
  return attendances.filter(a => filteredEvIds.has(a.event_id));
}

// ── CSV ──
function exportCSV(promoters, events, attendances, selected, from, to) {
  const dateStr = format(new Date(), 'd MMMM yyyy', { locale: it });
  const filteredEvents = filterEventsByPeriod(events, from, to);
  const filteredAttendances = filterAttendancesByPeriod(attendances, events, from, to);
  const periodLabel = (from || to) ? `${from || '…'} → ${to || '…'}` : 'Tutti i periodi';
  const allRows = [
    ['VIBRA — Report Personalizzato', '', '', '', '', ''],
    [`Generato il ${dateStr} · Periodo: ${periodLabel}`, '', '', '', '', ''],
    [''],
  ];

  if (selected.promoters) {
    const rows = buildPromoterRows(promoters, filteredAttendances, filteredEvents);
    allRows.push(['PROMOTER', '', '', '', '', '']);
    allRows.push(['Nome', 'Serate', 'Fatturato (€)', 'Media/Serata (€)', 'Tavoli chiusi', 'Zona']);
    rows.forEach(r => allRows.push([r.nome, r.serate, r.fatturato, r.media, r.tavoli, r.zona]));
    allRows.push(['']);
  }
  if (selected.events) {
    const rows = buildEventRows(filteredEvents, filteredAttendances);
    allRows.push([`SERATE (${rows.length})`, '', '', '', '', '']);
    allRows.push(['Data', 'Serata', 'Locale', 'Fatturato Tot (€)', 'Promoter presenti', 'Fat. Promoter (€)']);
    rows.forEach(r => allRows.push([r.data, r.nome, r.locale, r.fatturato, r.promoter_attivi, r.fat_promoter]));
    allRows.push(['']);
  }
  if (selected.monthly) {
    const rows = buildMonthlyRows(filteredEvents);
    allRows.push(['ANDAMENTO MENSILE', '', '', '', '']);
    allRows.push(['Mese', 'Serate', 'Fatturato (€)', 'Media/Serata (€)', '']);
    rows.forEach(r => allRows.push([r.mese, r.serate, r.fatturato, r.media, '']));
  }

  const csv = allRows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = webURL.createObjectURL(blob);
  const a = webDocument.createElement('a');
  a.href = url;
  a.download = `vibra-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  webURL.revokeObjectURL(url);
}

// ── PDF ──
function exportPDF(promoters, events, attendances, selected, from, to) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const dateStr = format(new Date(), 'd MMMM yyyy', { locale: it });
  const filteredEvents = filterEventsByPeriod(events, from, to);
  const filteredAttendances = filterAttendancesByPeriod(attendances, events, from, to);
  const periodLabel = (from || to)
    ? `${from ? format(parseISO(from), 'd MMM yyyy', { locale: it }) : '…'} → ${to ? format(parseISO(to), 'd MMM yyyy', { locale: it }) : '…'}`
    : 'Tutti i periodi';

  let firstPage = true;
  const addPage = (title) => {
    if (!firstPage) doc.addPage();
    firstPage = false;
    drawPageHeader(doc, title, dateStr, periodLabel);
  };

  if (selected.promoters) {
    const rows = buildPromoterRows(promoters, filteredAttendances, filteredEvents);
    const totalFat = rows.reduce((s, r) => s + r.fatturato, 0);
    const totalTav = rows.reduce((s, r) => s + r.tavoli, 0);
    addPage('Report Promoter');

    // KPI
    const kpis = [
      ['Promoter Attivi', rows.length],
      ['Fatturato Totale', `€${totalFat.toLocaleString('it-IT')}`],
      ['Tavoli Chiusi', totalTav],
      ['Serate nel Periodo', filteredEvents.length],
    ];
    kpis.forEach(([l, v], i) => {
      const x = 14 + i * 68;
      doc.setFillColor(240, 232, 255);
      doc.rect(x, 30, 64, 14, 'F');
      doc.setFontSize(7); doc.setTextColor(...BRAND_COLOR); doc.setFont('helvetica', 'normal'); doc.text(String(l), x + 3, 36);
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(50, 10, 80); doc.text(String(v), x + 3, 41);
    });

    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
    doc.text('Classifica Promoter', 14, 51);
    drawTable(doc,
      ['#', 'Nome promoter', 'N. serate', 'Fatturato (€)', 'Media/serata (€)', 'Tavoli chiusi', 'Zona/Città'],
      [10, 55, 18, 42, 38, 20, 60],
      rows.map((r, i) => [i + 1, r.nome, r.serate, `€${r.fatturato.toLocaleString('it-IT')}`, `€${r.media.toLocaleString('it-IT')}`, r.tavoli, r.zona]),
      54
    );

    // Pagina grafico promoter
    doc.addPage();
    drawPageHeader(doc, 'Report Promoter — Grafico', dateStr, periodLabel);
    drawBarChart(doc, rows, 'nome', 'fatturato', 'Fatturato per Promoter', 34);
  }

  if (selected.events) {
    const rows = buildEventRows(filteredEvents, filteredAttendances);
    addPage('Report Serate');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
    doc.text(`Serate nel periodo (${rows.length})`, 14, 34);
    drawTable(doc,
      ['Data serata', 'Nome serata', 'Locale', 'Fatturato totale (€)', 'N. promoter presenti', 'Fat. da promoter (€)'],
      [28, 80, 48, 42, 28, 34],
      rows.map(r => [r.data, r.nome, r.locale, `€${r.fatturato.toLocaleString('it-IT')}`, r.promoter_attivi, `€${r.fat_promoter.toLocaleString('it-IT')}`]),
      37
    );
  }

  if (selected.monthly) {
    const rows = buildMonthlyRows(filteredEvents);
    addPage('Andamento Mensile');
    let y = drawBarChart(doc, rows, 'mese', 'fatturato', 'Fatturato per Mese', 34);
    y = drawBarChart(doc, rows, 'mese', 'media', 'Media per Serata', y + 6);

    // Tabella mensile
    if (y + 20 < 200) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
      doc.text('Dettaglio Mensile', 14, y + 6);
      drawTable(doc,
        ['Mese', 'N. serate', 'Fatturato totale (€)', 'Media fatturato/serata (€)'],
        [55, 22, 55, 58],
        rows.map(r => [r.mese, r.serate, `€${r.fatturato.toLocaleString('it-IT')}`, `€${r.media.toLocaleString('it-IT')}`]),
        y + 9
      );
    }
  }

  // Footer
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(7); doc.setTextColor(160, 160, 160);
    doc.text(`Vibra Team Management · Pagina ${i} di ${pages}`, 14, 206);
    doc.text(dateStr, 283, 206, { align: 'right' });
  }

  doc.save(`vibra-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

const SECTIONS = [
  { key: 'promoters', label: 'Performance Promoter', desc: 'Classifica, fatturato, tavoli, zone + grafico' },
  { key: 'events', label: 'Tutte le Serate', desc: 'Data, locale, fatturato, promoter' },
  { key: 'monthly', label: 'Andamento Mensile', desc: 'Grafici e tabella mese per mese' },
];

export default function ExportReportButton({ promoters, events, attendances, compact }) {
  const [loading, setLoading] = useState(null);
  const [selected, setSelected] = useState({ promoters: true, events: true, monthly: true });
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const toggle = (key) => setSelected(s => ({ ...s, [key]: !s[key] }));
  const anySelected = Object.values(selected).some(Boolean);

  const handleExport = async (type) => {
    if (!anySelected) return;
    setLoading(type);
    await new Promise(r => setTimeout(r, 80));
    if (type === 'csv') exportCSV(promoters, events, attendances, selected, from, to);
    if (type === 'pdf') exportPDF(promoters, events, attendances, selected, from, to);
    setLoading(null);
  };

  if (compact) {
    return (
      <Btn
        button
        onClick={() => handleExport('pdf')}
        disabled={!!loading}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:border-white/[0.15] transition-all">
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}Export
              </Btn>
    );
  }

  return (
    <Div className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-5 space-y-4">
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
        style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />

      <Div className="flex items-center justify-between flex-wrap gap-3">
        <Div className="flex items-center gap-2">
          <Div className="p-1.5 rounded-lg bg-purple-500/15">
            <FileDown className="w-4 h-4 text-purple-400" />
          </Div>
          <Div>
            <P className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Esporta Report Personalizzato</P>
            <P className="text-[10px] text-muted-foreground mt-0.5">Seleziona dati e periodo da includere</P>
          </Div>
        </Div>
        <Div className="flex gap-2">
          <Btn
            button
            onClick={() => handleExport('pdf')}
            disabled={!!loading || !anySelected}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all disabled:opacity-40">
            {loading === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            PDF
          </Btn>
          <Btn
            button
            onClick={() => handleExport('csv')}
            disabled={!!loading || !anySelected}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all disabled:opacity-40">
            {loading === 'csv' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            CSV
          </Btn>
        </Div>
      </Div>

      {/* Filtro periodo */}
      <Div className="p-3 rounded-xl bg-secondary/20 border border-border space-y-2">
        <Span className="text-xs font-medium text-muted-foreground">Periodo:</Span>
        <Div className="flex flex-wrap items-center gap-2">
          <Span className="text-[10px] text-muted-foreground">Da</Span>
          <HtmlInput
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="flex-1 min-w-0 h-7 px-2 rounded-lg border border-input bg-secondary/30 text-xs text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            style={{ colorScheme: 'dark' }}
          />
          <Span className="text-[10px] text-muted-foreground">A</Span>
          <HtmlInput
            type="date"
            value={to}
            onChange={e => setTo(e.target.value)}
            className="flex-1 min-w-0 h-7 px-2 rounded-lg border border-input bg-secondary/30 text-xs text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            style={{ colorScheme: 'dark' }}
          />
          {(from || to) && (
            <Btn
              button
              onClick={() => { setFrom(''); setTo(''); }}
              className="text-[10px] text-destructive hover:bg-destructive/10 px-1.5 py-0.5 rounded shrink-0">✕ Reset</Btn>
          )}
        </Div>
        <Span className="text-[10px] text-muted-foreground">
          {(from || to) ? `${filterEventsByPeriod(events, from, to).length} serate nel periodo` : `${events.length} serate totali`}
        </Span>
      </Div>

      {/* Sezioni selezionabili */}
      <Div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {SECTIONS.map(({ key, label, desc }) => (
          <Btn
            button
            key={key}
            onClick={() => toggle(key)}
            className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
              selected[key] ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/20'
            }`}>
            <Div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
              selected[key] ? 'border-primary bg-primary' : 'border-muted-foreground'
            }`}>
              {selected[key] && <Check className="w-2.5 h-2.5 text-white" />}
            </Div>
            <Div>
              <P className="text-xs font-semibold">{label}</P>
              <P className="text-[10px] text-muted-foreground mt-0.5">{desc}</P>
            </Div>
          </Btn>
        ))}
      </Div>
    </Div>
  );
}