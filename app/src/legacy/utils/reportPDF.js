import jsPDF from '@/web/shims/jspdf';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  buildPromoterRows, buildEventRows, buildMonthlyRows,
  computeGroupKpis, computePromoterStats, computePeriodComparison,
  computePromoterDualPeriod, monthRangeToDates, monthRangeLabel,
  filterEventsByPeriod, periodLabel, DAY_TYPES, computeGroupDayTypeMedie,
} from '@/legacy/utils/reportData';

import { storage as webStorage } from '@/web/shims/dom';

const BRAND_COLOR = [85, 26, 142]; // #551a8e
const BLUE = [96, 165, 250];
const GREEN = [74, 222, 128];
const RED = [248, 113, 113];

function getVibraLogo() {
  return webStorage.getItem('vibra_logo_cache') || webStorage.getItem('org_logo_url') || '';
}

function drawPageHeader(doc, title, dateStr, periodLabel) {
  const logoUrl = getVibraLogo();
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

function drawKpis(doc, kpis, startY) {
  const cardW = 64, cardH = 16, gap = 4;
  kpis.forEach(([label, value, color], i) => {
    const x = 14 + i * (cardW + gap);
    const c = color || BRAND_COLOR;
    doc.setFillColor(c[0] * 0.12, c[1] * 0.12, c[2] * 0.12);
    doc.rect(x, startY, cardW, cardH, 'F');
    doc.setDrawColor(c[0], c[1], c[2]);
    doc.setLineWidth(0.3);
    doc.rect(x, startY, cardW, cardH);
    doc.setFontSize(6.5); doc.setTextColor(110, 110, 110); doc.setFont('helvetica', 'normal');
    doc.text(String(label), x + 3, startY + 5);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(c[0], c[1], c[2]);
    doc.text(String(value), x + 3, startY + 12);
  });
  return startY + cardH + 6;
}

function drawTable(doc, headers, widths, rows, startY, groupHeaders) {
  let cx = 14;
  let y = startY;

  // Group headers (colSpan)
  if (groupHeaders) {
    groupHeaders.forEach(gh => {
      if (gh.colSpan > 1) {
        doc.setFillColor(...(gh.color || BRAND_COLOR));
        doc.rect(cx, y, widths.slice(gh.start, gh.start + gh.colSpan).reduce((a, b) => a + b, 0), 6, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7); doc.setFont('helvetica', 'bold');
        doc.text(gh.label, cx + 2, y + 4.5);
      }
      cx += widths.slice(gh.start, gh.start + gh.colSpan).reduce((a, b) => a + b, 0);
    });
    y += 6;
    cx = 14;
  }

  // Headers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  headers.forEach((h, i) => {
    doc.setFillColor(...BRAND_COLOR);
    doc.rect(cx, y, widths[i], 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(h, cx + 2, y + 4.5);
    cx += widths[i];
  });
  y += 6;

  // Rows
  doc.setFont('helvetica', 'normal');
  rows.forEach((row, ri) => {
    if (y + 7 > 200) { doc.addPage(); y = 15; }
    doc.setFillColor(ri % 2 === 0 ? 255 : 248, ri % 2 === 0 ? 255 : 244, ri % 2 === 0 ? 255 : 252);
    cx = 14;
    widths.forEach(w => { doc.rect(cx, y, w, 6, 'F'); cx += w; });
    doc.setTextColor(40, 40, 40);
    cx = 14;
    row.forEach((cell, i) => {
      const val = String(cell ?? '-');
      // Truncate if too long
      const maxChars = Math.floor((widths[i] - 3) / 1.8);
      doc.text(val.length > maxChars ? val.slice(0, maxChars - 1) + '…' : val, cx + 2, y + 4.5);
      cx += widths[i];
    });
    y += 6;
  });
  return y;
}

function drawBarChart(doc, data, labelKey, valueKeys, title, startY, colors) {
  if (!data.length) return startY;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
  doc.text(title, 14, startY);
  let y = startY + 5;
  const maxVal = Math.max(...data.flatMap(d => valueKeys.map(vk => d[vk] || 0)), 1);
  const barArea = 160;
  const vks = Array.isArray(valueKeys) ? valueKeys : [valueKeys];
  const cls = colors || [BRAND_COLOR];

  data.slice(0, 15).forEach((d, i) => {
    if (y + 8 > 200) return;
    const label = String(d[labelKey]).length > 18 ? String(d[labelKey]).slice(0, 17) + '…' : String(d[labelKey]);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(60, 60, 60);
    doc.text(`${i + 1}. ${label}`, 14, y + 4.5);
    vks.forEach((vk, vi) => {
      const val = d[vk] || 0;
      const barW = Math.max(2, (val / maxVal) * barArea / vks.length);
      const bx = 68 + vi * (barArea / vks.length + 2);
      doc.setFillColor(...cls[vi]);
      doc.rect(bx, y, barW, 4, 'F');
      doc.setFont('helvetica', 'bold'); doc.setTextColor(...cls[vi]); doc.setFontSize(6);
      doc.text(`€${Number(val).toLocaleString('it-IT')}`, bx + barW + 1, y + 3.5);
    });
    y += 8;
  });
  return y + 4;
}

// ── Vibra Group ──
function exportVibraGroup(doc, promoters, attendances, events, config, dateStr) {
  const periodLabelStr = periodLabel(config);
  const promoterRows = buildPromoterRows(promoters, attendances, events, config.from, config.to);
  const eventRows = buildEventRows(events, attendances, config.from, config.to);
  const monthlyRows = buildMonthlyRows(events, config.from, config.to);
  const kpis = computeGroupKpis(promoterRows, events, config.from, config.to);

  drawPageHeader(doc, 'Report Gruppo Vibra', dateStr, periodLabelStr);
  let y = drawKpis(doc, [
    ['Promoter Attivi', kpis.promoterAttivi, BRAND_COLOR],
    ['Fatturato Totale', `€${kpis.fatturatoTotale.toLocaleString('it-IT')}`, GREEN],
    ['Tavoli Chiusi', kpis.tavoliTotali, BLUE],
    ['Serate', kpis.seratePeriodo, [251, 191, 36]],
  ], 30);

  y += 2;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
  doc.text('Classifica Promoter', 14, y);
  y = drawTable(doc,
    ['#', 'Nome', 'Serate', 'Fatturato', 'Media', 'Med Ven', 'Med Sab', 'Med Dom', 'Med Extra', 'Tavoli', 'Zona'],
    [10, 38, 16, 32, 26, 16, 16, 16, 18, 18, 39],
    promoterRows.map((r, i) => [i + 1, r.nome, r.serate, `€${r.fatturato.toLocaleString('it-IT')}`, `€${r.media.toLocaleString('it-IT')}`,
      r.serVen > 0 ? `€${r.medVen.toLocaleString('it-IT')}` : '—',
      r.serSab > 0 ? `€${r.medSab.toLocaleString('it-IT')}` : '—',
      r.serDom > 0 ? `€${r.medDom.toLocaleString('it-IT')}` : '—',
      r.serExtra > 0 ? `€${r.medExtra.toLocaleString('it-IT')}` : '—',
      r.tavoli, r.zona]),
    y + 3
  );

  if (eventRows.length > 0) {
    if (y + 10 > 200) { doc.addPage(); y = 15; }
    else y += 6;
    drawPageHeader(doc, 'Report Gruppo Vibra — Serate', dateStr, periodLabelStr);
    y = 30;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
    doc.text(`Serate nel periodo (${eventRows.length})`, 14, y);
    drawTable(doc,
      ['Data', 'Serata', 'Locale', 'Fatt. Tot', 'Promoter', 'Fat. Prom'],
      [25, 70, 45, 35, 22, 30],
      eventRows.map(r => [r.data, r.nome, r.locale, `€${r.fatturato.toLocaleString('it-IT')}`, r.promoter_attivi, `€${r.fat_promoter.toLocaleString('it-IT')}`]),
      y + 3
    );
  }

  if (monthlyRows.length > 0) {
    doc.addPage();
    drawPageHeader(doc, 'Report Gruppo Vibra — Andamento Mensile', dateStr, periodLabelStr);
    drawBarChart(doc, monthlyRows, 'mese', ['fatturato'], 'Fatturato per Mese', 30, [BRAND_COLOR]);
  }
}

// ── Promoter Compare (single period) ──
function exportPromoterCompare(doc, promoters, attendances, events, config, dateStr) {
  const selected = promoters.filter(p => config.selectedPromoterIds.includes(p.id));
  const rows = selected.map(p => computePromoterStats(p, attendances, events, config.from, config.to));
  const totalFat = rows.reduce((s, r) => s + r.fatturato, 0);

  drawPageHeader(doc, 'Confronto Promoter', dateStr, periodLabel(config));
  let y = drawKpis(doc, [
    ['Promoter', rows.length, BRAND_COLOR],
    ['Fatturato Tot', `€${totalFat.toLocaleString('it-IT')}`, GREEN],
    ['Tavoli Tot', Math.round(rows.reduce((s, r) => s + r.tavoli, 0) * 10) / 10, BLUE],
    ['Serate Tot', rows.reduce((s, r) => s + r.serate, 0), [251, 191, 36]],
  ], 30);

  y += 2;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
  doc.text('Confronto per Promoter', 14, y);
  drawTable(doc,
    ['Promoter', 'Serate', 'Fatturato', 'Media/Serata', 'Med Ven', 'Med Sab', 'Med Dom', 'Med Extra', 'Tavoli', '% sul Tot'],
    [48, 16, 34, 30, 16, 16, 16, 18, 18, 22],
    rows.map(r => {
      const pct = totalFat > 0 ? Math.round((r.fatturato / totalFat) * 100) : 0;
      return [r.nome, r.serate, `€${r.fatturato.toLocaleString('it-IT')}`, `€${r.media.toLocaleString('it-IT')}`,
        r.serVen > 0 ? `€${r.medVen.toLocaleString('it-IT')}` : '—',
        r.serSab > 0 ? `€${r.medSab.toLocaleString('it-IT')}` : '—',
        r.serDom > 0 ? `€${r.medDom.toLocaleString('it-IT')}` : '—',
        r.serExtra > 0 ? `€${r.medExtra.toLocaleString('it-IT')}` : '—',
        r.tavoli, `${pct}%`];
    }),
    y + 3
  );

  doc.addPage();
  drawPageHeader(doc, 'Confronto Promoter — Grafico Fatturato', dateStr, periodLabel(config));
  drawBarChart(doc, rows, 'nome', ['fatturato'], 'Fatturato per Promoter', 30, [BRAND_COLOR]);
}

// ── Promoter Compare Dual Period ──
function exportPromoterDual(doc, promoters, attendances, events, config, dateStr) {
  const selected = promoters.filter(p => config.selectedPromoterIds.includes(p.id));
  const p1m = config.period1Months || {};
  const p2m = config.period2Months || {};
  const period1 = monthRangeToDates(p1m);
  const period2 = monthRangeToDates(p2m);
  const p1Label = monthRangeLabel(p1m);
  const p2Label = monthRangeLabel(p2m);
  const periodLabelStr = `${p1Label} vs ${p2Label}`;

  const rows = selected.map(p => computePromoterDualPeriod(p, attendances, events, period1, period2));
  const p1Total = rows.reduce((s, r) => s + r.p1.fatturato, 0);
  const p2Total = rows.reduce((s, r) => s + r.p2.fatturato, 0);
  const p1Tav = rows.reduce((s, r) => s + r.p1.tavoli, 0);
  const p2Tav = rows.reduce((s, r) => s + r.p2.tavoli, 0);
  const p1Ser = rows.reduce((s, r) => s + r.p1.serate, 0);
  const p2Ser = rows.reduce((s, r) => s + r.p2.serate, 0);
  const deltaTot = p2Total - p1Total;

  drawPageHeader(doc, 'Confronto Promoter — Due Periodi', dateStr, periodLabelStr);

  // KPI riga 1
  let y = drawKpis(doc, [
    ['Promoter', rows.length, BRAND_COLOR],
    ['Fat. Tot P1', `€${p1Total.toLocaleString('it-IT')}`, BLUE],
    ['Fat. Tot P2', `€${p2Total.toLocaleString('it-IT')}`, GREEN],
    ['Delta Tot', `${deltaTot >= 0 ? '+' : ''}€${deltaTot.toLocaleString('it-IT')}`, deltaTot >= 0 ? GREEN : RED],
  ], 30);

  // KPI riga 2
  y = drawKpis(doc, [
    ['Tavoli P1', Math.round(p1Tav * 10) / 10, BLUE],
    ['Tavoli P2', Math.round(p2Tav * 10) / 10, GREEN],
    ['Serate P1', p1Ser, [96, 165, 250]],
    ['Serate P2', p2Ser, [74, 222, 128]],
  ], y);

  // Label periodi
  doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BLUE); doc.text(`P1: ${p1Label}`, 14, y);
  doc.setTextColor(...GREEN); doc.text(`P2: ${p2Label}`, 100, y);
  y += 4;

  // Tabella
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
  doc.text('Confronto per Promoter', 14, y);
  y += 3;

  const widths = [40, 14, 30, 16, 14, 30, 16, 28, 18];
  const groupHeaders = [
    { label: 'Periodo 1', start: 1, colSpan: 3, color: BLUE },
    { label: 'Periodo 2', start: 4, colSpan: 3, color: GREEN },
  ];
  const headers = ['Promoter', 'Ser', 'Fat P1', 'Tav', 'Ser', 'Fat P2', 'Tav', 'Δ Fat', '%'];
  const tableRows = rows.map(r => [
    r.nome, r.p1.serate, `€${r.p1.fatturato.toLocaleString('it-IT')}`, r.p1.tavoli,
    r.p2.serate, `€${r.p2.fatturato.toLocaleString('it-IT')}`, r.p2.tavoli,
    `${r.deltaFat >= 0 ? '+' : ''}€${r.deltaFat.toLocaleString('it-IT')}`,
    r.pctFat === 0 && r.deltaFat === 0 ? '—' : `${r.pctFat >= 0 ? '+' : ''}${r.pctFat}%`,
  ]);

  // Tabella con media aggiuntiva su seconda pagina
  y = drawTable(doc, headers, widths, tableRows, y, groupHeaders);

  // Pagina grafico
  doc.addPage();
  drawPageHeader(doc, 'Confronto Promoter — Fatturato P1 vs P2', dateStr, periodLabelStr);
  drawBarChart(doc,
    rows.map(r => ({ nome: r.nome, p1: r.p1.fatturato, p2: r.p2.fatturato })),
    'nome', ['p1', 'p2'], 'Fatturato P1 (blu) vs P2 (verde)', 30,
    [BLUE, GREEN]
  );

  // Pagina dettaglio media + delta
  doc.addPage();
  drawPageHeader(doc, 'Confronto Promoter — Dettaglio Media & Delta', dateStr, periodLabelStr);
  y = 30;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
  doc.text('Media per Serata & Delta Tavoli/Serate', 14, y);
  y += 3;
  drawTable(doc,
    ['Promoter', 'Med P1', 'Med P2', 'Δ Med', 'Δ Tav', 'Δ Ser', '% Tav'],
    [45, 35, 35, 30, 25, 22, 25],
    rows.map(r => [
      r.nome,
      `€${r.p1.media.toLocaleString('it-IT')}`,
      `€${r.p2.media.toLocaleString('it-IT')}`,
      `${r.deltaMedia >= 0 ? '+' : ''}€${r.deltaMedia.toLocaleString('it-IT')}`,
      `${r.deltaTav >= 0 ? '+' : ''}${r.deltaTav}`,
      `${r.deltaSerate >= 0 ? '+' : ''}${r.deltaSerate}`,
      r.pctTav === 0 ? '—' : `${r.pctTav >= 0 ? '+' : ''}${r.pctTav}%`,
    ]),
    y
  );

  // Pagina medie per giorno (Ven/Sab/Dom/Extra) P1 vs P2
  doc.addPage();
  drawPageHeader(doc, 'Confronto Promoter — Medie per Giorno', dateStr, periodLabelStr);
  y = 30;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
  doc.text('Medie Fatturato per Giorno — Ven / Sab / Dom / Extra', 14, y);
  y += 3;
  const cap = (k) => k.charAt(0).toUpperCase() + k.slice(1);
  drawTable(doc,
    ['Promoter', ...DAY_TYPES.flatMap(d => [`Med ${d.label} P1`, `Med ${d.label} P2`])],
    [44, 26, 26, 26, 26, 26, 26, 28, 28],
    rows.map(r => [r.nome, ...DAY_TYPES.flatMap(d => [
      r.p1['ser' + cap(d.key)] > 0 ? `€${r.p1['med' + cap(d.key)].toLocaleString('it-IT')}` : '—',
      r.p2['ser' + cap(d.key)] > 0 ? `€${r.p2['med' + cap(d.key)].toLocaleString('it-IT')}` : '—',
    ])]),
    y
  );
}

// ── Same Promoter Periods ──
function exportSamePromoter(doc, promoters, attendances, events, config, dateStr) {
  const promoter = promoters.find(p => p.id === config.promoterId);
  if (!promoter) return;
  const comp = computePeriodComparison(promoter, attendances, events, config.period1, config.period2);
  const periodLabelStr = `${comp.period1.label} vs ${comp.period2.label}`;

  drawPageHeader(doc, `Stesso Promoter — ${promoter.name}`, dateStr, periodLabelStr);

  // Tre colonne: P1, P2, Delta
  let y = 34;
  const colW = 88, gap = 6;
  const cap = (k) => k.charAt(0).toUpperCase() + k.slice(1);
  const cols = [
    { label: 'Periodo 1', sub: comp.period1.label, data: comp.period1, color: BLUE },
    { label: 'Periodo 2', sub: comp.period2.label, data: comp.period2, color: GREEN },
    { label: 'Delta', sub: 'P2 vs P1', data: null, color: BRAND_COLOR, delta: { deltaFat: comp.deltaFat, deltaTav: comp.deltaTav, deltaSerate: comp.deltaSerate, pctFat: comp.pctFat,
      medDelta: DAY_TYPES.map(d => (comp.period2['med' + cap(d.key)] || 0) - (comp.period1['med' + cap(d.key)] || 0)) } },
  ];

  cols.forEach((col, i) => {
    const x = 14 + i * (colW + gap);
    doc.setFillColor(col.color[0] * 0.08, col.color[1] * 0.08, col.color[2] * 0.08);
    doc.rect(x, y, colW, 92, 'F');
    doc.setDrawColor(...col.color); doc.setLineWidth(0.4);
    doc.rect(x, y, colW, 92);
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...col.color);
    doc.text(col.label, x + 3, y + 5);
    doc.setFontSize(6); doc.setFont('helvetica', 'normal'); doc.setTextColor(110, 110, 110);
    doc.text(col.sub, x + 3, y + 9);

    let ly = y + 15;
    doc.setFontSize(7);
    if (col.data) {
      [['Fatturato', `€${col.data.fatturato.toLocaleString('it-IT')}`],
       ['Tavoli', col.data.tavoli],
       ['Serate', col.data.serate],
       ['Media', `€${col.data.media.toLocaleString('it-IT')}`],
       ...DAY_TYPES.map(d => [`Med ${d.label}`, col.data['ser' + cap(d.key)] > 0 ? `€${col.data['med' + cap(d.key)].toLocaleString('it-IT')}` : '—'])]
      .forEach(([l, v]) => {
        doc.setTextColor(110, 110, 110); doc.setFont('helvetica', 'normal'); doc.text(l, x + 3, ly);
        doc.setTextColor(40, 40, 40); doc.setFont('helvetica', 'bold'); doc.text(String(v), x + 40, ly);
        ly += 7;
      });
    } else {
      [['Δ Fatturato', `${col.delta.deltaFat >= 0 ? '+' : ''}€${col.delta.deltaFat.toLocaleString('it-IT')}`, col.delta.deltaFat >= 0 ? GREEN : RED],
       ['Δ Tavoli', `${col.delta.deltaTav >= 0 ? '+' : ''}${col.delta.deltaTav}`, col.delta.deltaTav >= 0 ? GREEN : RED],
       ['Δ Serate', `${col.delta.deltaSerate >= 0 ? '+' : ''}${col.delta.deltaSerate}`, col.delta.deltaSerate >= 0 ? GREEN : RED],
       ['% Fatt', `${col.delta.pctFat >= 0 ? '+' : ''}${col.delta.pctFat}%`, col.delta.pctFat >= 0 ? GREEN : RED],
       ...DAY_TYPES.map((d, idx) => [`Δ Med ${d.label}`, `${col.delta.medDelta[idx] >= 0 ? '+' : ''}€${col.delta.medDelta[idx].toLocaleString('it-IT')}`, col.delta.medDelta[idx] >= 0 ? GREEN : RED])]
      .forEach(([l, v, c]) => {
        doc.setTextColor(110, 110, 110); doc.setFont('helvetica', 'normal'); doc.text(l, x + 3, ly);
        doc.setTextColor(...c); doc.setFont('helvetica', 'bold'); doc.text(String(v), x + 40, ly);
        ly += 7;
      });
    }
  });

  // Andamento mensile
  if (comp.monthly1.length > 0) {
    doc.addPage();
    drawPageHeader(doc, `${promoter.name} — Andamento Periodo 1`, dateStr, comp.period1.label);
    drawBarChart(doc, comp.monthly1, 'mese', ['fatturato'], 'Fatturato Mensile P1', 30, [BLUE]);
  }
  if (comp.monthly2.length > 0) {
    doc.addPage();
    drawPageHeader(doc, `${promoter.name} — Andamento Periodo 2`, dateStr, comp.period2.label);
    drawBarChart(doc, comp.monthly2, 'mese', ['fatturato'], 'Fatturato Mensile P2', 30, [GREEN]);
  }
}

// ── Event Compare ──
function exportEventCompare(doc, events, attendances, config, dateStr) {
  const selectedEvents = events.filter(e => config.selectedEventIds.includes(e.id));
  const rows = selectedEvents.map(ev => {
    const evAtt = attendances.filter(a => a.event_id === ev.id && a.present !== false);
    const totProm = evAtt.reduce((s, a) => s + (a.revenue || 0), 0);
    return {
      data: ev.date ? format(parseISO(ev.date), 'd MMM yy', { locale: it }) : '-',
      nome: ev.name || '-',
      locale: ev.venue || '-',
      fatturato: ev.total_revenue || 0,
      promoter_attivi: evAtt.length,
      fat_promoter: Math.round(totProm),
      media_promoter: evAtt.length > 0 ? Math.round(totProm / evAtt.length) : 0,
    };
  }).sort((a, b) => b.fatturato - a.fatturato);

  const totalFat = rows.reduce((s, r) => s + r.fatturato, 0);
  drawPageHeader(doc, 'Confronto Serate', dateStr, `${rows.length} serate`);
  let y = drawKpis(doc, [
    ['Serate', rows.length, BRAND_COLOR],
    ['Fatturato Tot', `€${totalFat.toLocaleString('it-IT')}`, GREEN],
    ['Promoter Tot', rows.reduce((s, r) => s + r.promoter_attivi, 0), BLUE],
    ['Media/Serata', `€${rows.length > 0 ? Math.round(totalFat / rows.length).toLocaleString('it-IT') : 0}`, [251, 191, 36]],
  ], 30);

  y += 2;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
  doc.text('Confronto Serate', 14, y);
  drawTable(doc,
    ['Data', 'Serata', 'Locale', 'Fatt. Tot', 'Promoter', 'Fat. Prom', 'Med/Prom'],
    [25, 65, 45, 35, 22, 30, 28],
    rows.map(r => [r.data, r.nome, r.locale, `€${r.fatturato.toLocaleString('it-IT')}`, r.promoter_attivi, `€${r.fat_promoter.toLocaleString('it-IT')}`, `€${r.media_promoter.toLocaleString('it-IT')}`]),
    y + 3
  );

  doc.addPage();
  drawPageHeader(doc, 'Confronto Serate — Grafico', dateStr, `${rows.length} serate`);
  drawBarChart(doc, rows, 'nome', ['fatturato'], 'Fatturato per Serata', 30, [BRAND_COLOR]);
}

// ── Main export ──
export function exportReportPDF(promoters, attendances, events, config) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const dateStr = format(new Date(), 'd MMMM yyyy', { locale: it });

  if (config.reportType === 'vibra_group') exportVibraGroup(doc, promoters, attendances, events, config, dateStr);
  else if (config.reportType === 'promoter_compare' && !config.promoterCompareDual) exportPromoterCompare(doc, promoters, attendances, events, config, dateStr);
  else if (config.reportType === 'promoter_compare' && config.promoterCompareDual) exportPromoterDual(doc, promoters, attendances, events, config, dateStr);
  else if (config.reportType === 'same_promoter_periods') exportSamePromoter(doc, promoters, attendances, events, config, dateStr);
  else if (config.reportType === 'event_compare') exportEventCompare(doc, events, attendances, config, dateStr);

  // Footer
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(7); doc.setTextColor(160, 160, 160);
    doc.text(`Vibra Team Management · Pagina ${i} di ${pages}`, 14, 206);
    doc.text(dateStr, 283, 206, { align: 'right' });
  }

  const typeLabel = {
    vibra_group: 'gruppo',
    promoter_compare: 'confronto-promoter',
    same_promoter_periods: 'stesso-promoter',
    event_compare: 'confronto-serate',
  }[config.reportType] || 'report';
  doc.save(`vibra-report-${typeLabel}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}