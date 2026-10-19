// Port di src/components/promoter/ExportReportMensile.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { Download, Loader2, FileText, ChevronDown } from '@/ui/icons.generated';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import jsPDF from '@/web/shims/jspdf';

import { doc as webDocument, storage as webStorage, url as webURL } from '@/web/shims/dom';
import { Btn, Div } from '@/ui/html';
import { AnchoredPanel } from '@/ui/anchoredPanel';

function getDeltaPct(curr, prev) {
  if (prev === 0 && curr === 0) return null;
  if (prev === 0) return '+∞%';
  const pct = ((curr - prev) / prev) * 100;
  return (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
}

function drawHeader(doc, title, subtitle, dateStr) {
  const logoUrl = webStorage.getItem('org_logo_url') || '';

  doc.setFillColor(85, 26, 142);
  doc.rect(0, 0, 297, 26, 'F');

  // Logo a sinistra con proporzioni corrette oppure testo "VIBRA"
  if (logoUrl && logoUrl.startsWith('data:image')) {
    try {
      const ext = logoUrl.includes('png') ? 'PNG' : 'JPEG';
      // Carica immagine per ottenere dimensioni reali
      const imgEl = new Image();
      imgEl.src = logoUrl;
      const maxH = 22; // altezza max mm
      const maxW = 50; // larghezza max mm
      let iw = imgEl.naturalWidth || 1;
      let ih = imgEl.naturalHeight || 1;
      let ratio = iw / ih;
      let drawH = maxH;
      let drawW = drawH * ratio;
      if (drawW > maxW) { drawW = maxW; drawH = drawW / ratio; }
      const topY = (26 - drawH) / 2;
      doc.addImage(logoUrl, ext, 8, topY, drawW, drawH);
    } catch {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('VIBRA', 14, 13);
    }
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('VIBRA', 14, 13);
  }

  // Titolo e sottotitolo a destra del logo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title.replace(/^VIBRA — /, ''), 50, 10);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, 50, 17);
  doc.text(`Generato il ${dateStr}`, 230, 17);
}

function drawTableSection(doc, headers, colWidths, rows, startY, pageH = 200) {
  // header
  doc.setFillColor(85, 26, 142);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  let cx = 14;
  headers.forEach((h, i) => {
    doc.rect(cx, startY, colWidths[i], 7, 'F');
    doc.text(h, cx + 2, startY + 5);
    cx += colWidths[i];
  });

  let y = startY + 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  rows.forEach((row, ri) => {
    if (y + 7 > pageH) { doc.addPage(); y = 15; }
    doc.setFillColor(ri % 2 === 0 ? 255 : 248, ri % 2 === 0 ? 255 : 245, ri % 2 === 0 ? 255 : 255);
    cx = 14;
    colWidths.forEach(w => { doc.rect(cx, y, w, 7, 'F'); cx += w; });
    doc.setTextColor(40, 40, 40);
    cx = 14;
    row.forEach((cell, i) => {
      doc.text(String(cell ?? '-'), cx + 2, y + 5);
      cx += colWidths[i];
    });
    y += 7;
  });

  return y;
}

export default function ExportReportMensile({ promoterReports, monthLabel, prevMonthLabel }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExportPDF = async () => {
    setOpen(false);
    setLoading(true);
    await new Promise(r => setTimeout(r, 80));

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const dateStr = format(new Date(), 'd MMMM yyyy', { locale: it });

    // ── Pagina 1: Classifica + confronto ──
    drawHeader(doc, `VIBRA — Report Mensile · ${monthLabel}`, `Confronto con ${prevMonthLabel}`, dateStr);

    // KPI totali
    const totalCurr = promoterReports.reduce((s, r) => s + r.curr.revenue, 0);
    const totalPrev = promoterReports.reduce((s, r) => s + r.prev.revenue, 0);
    const totalTavCurr = promoterReports.reduce((s, r) => s + r.curr.tavoli, 0);
    const totalSerateCurr = promoterReports.reduce((s, r) => s + r.curr.serate, 0);
    const kpis = [
      ['Fatturato Totale', `€${Math.round(totalCurr).toLocaleString('it-IT')}`, getDeltaPct(totalCurr, totalPrev)],
      ['Tavoli Chiusi', String(Math.round(totalTavCurr * 10) / 10), ''],
      ['Serate Totali (att.)', String(totalSerateCurr), ''],
      ['Promoter Attivi', String(promoterReports.length), ''],
    ];
    kpis.forEach(([label, val, delta], i) => {
      const x = 14 + i * 67;
      doc.setFillColor(240, 232, 255);
      doc.rect(x, 25, 63, 16, 'F');
      doc.setFontSize(7);
      doc.setTextColor(85, 26, 142);
      doc.setFont('helvetica', 'normal');
      doc.text(label, x + 3, 31);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 10, 80);
      doc.text(val, x + 3, 37);
      if (delta) {
        doc.setFontSize(7);
        doc.setTextColor(delta.startsWith('+') ? 22 : 180, delta.startsWith('+') ? 160 : 20, delta.startsWith('+') ? 70 : 20);
        doc.text(delta, x + 3, 40);
      }
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text('Classifica Promoter — Confronto Mensile', 14, 47);

    // Legenda colonne — sintetica
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 90, 160);
    doc.text(
      `Fat. = fatturato promoter  ·  Δ% = variazione vs ${prevMonthLabel}  ·  Media/Ser. = media fatturato a serata  ·  Tavoli = tavoli chiusi nel mese`,
      14, 51
    );

    const headers = ['#', 'Promoter', 'Zona', `Fat. ${monthLabel}`, `Fat. ${prevMonthLabel}`, 'Δ%', 'Serate', 'Media/Ser.', 'Tavoli'];
    const widths =  [10,  60,         45,     38,                    38,                      20,   18,      30,         20];

    const rows = promoterReports.map((r, i) => {
      const delta = getDeltaPct(r.curr.revenue, r.prev.revenue);
      return [
        i + 1,
        r.promoter.name,
        [r.promoter.neighborhood, r.promoter.city].filter(Boolean).join(', ') || '-',
        `€${Math.round(r.curr.revenue).toLocaleString('it-IT')}`,
        `€${Math.round(r.prev.revenue).toLocaleString('it-IT')}`,
        delta ?? '-',
        r.curr.serate,
        `€${Math.round(r.curr.avgPerSerata).toLocaleString('it-IT')}`,
        Math.round(r.curr.tavoli * 10) / 10,
      ];
    });

    drawTableSection(doc, headers, widths, rows, 57);

    // ── Pagina 2: barchart testuale dei fatturati ──
    doc.addPage();
    drawHeader(doc, `VIBRA — Dettaglio Visivo · ${monthLabel}`, 'Grafici performance promoter', dateStr);

    // Barchart orizzontale testuale
    const maxRev = Math.max(...promoterReports.map(r => r.curr.revenue), 1);
    const barAreaW = 180;
    let y = 30;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text('Fatturato per Promoter', 14, y);
    y += 5;

    promoterReports.slice(0, 20).forEach((r, i) => {
      if (y + 14 > 200) return;
      const barW = Math.max(2, (r.curr.revenue / maxRev) * barAreaW);
      const barWPrev = Math.max(1, (r.prev.revenue / maxRev) * barAreaW);

      // Label nome
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(40, 40, 40);
      const shortName = r.promoter.name.length > 16 ? r.promoter.name.slice(0, 15) + '…' : r.promoter.name;
      doc.text(`${i + 1}. ${shortName}`, 14, y + 4);

      // Barra mese corrente
      const colors = [[139, 92, 246], [236, 72, 153], [14, 165, 233], [249, 115, 22], [20, 184, 166]];
      const [cr, cg, cb] = colors[i % colors.length];
      doc.setFillColor(cr, cg, cb);
      doc.rect(68, y, barW, 4, 'F');

      // Valore mese corrente
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(cr, cg, cb);
      doc.text(`€${Math.round(r.curr.revenue).toLocaleString('it-IT')}`, 68 + barW + 2, y + 3.5);

      // Barra mese precedente
      doc.setFillColor(200, 190, 220);
      doc.rect(68, y + 5, barWPrev, 2.5, 'F');

      // Valore mese precedente
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(130, 120, 150);
      doc.text(`prec. €${Math.round(r.prev.revenue).toLocaleString('it-IT')}`, 68 + barWPrev + 2, y + 7.5);

      y += 13;
    });

    // Legenda
    y += 3;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setFillColor(139, 92, 246);
    doc.rect(14, y, 8, 3.5, 'F');
    doc.setTextColor(60, 60, 60);
    doc.text(`Mese corrente (${monthLabel})`, 24, y + 3);
    doc.setFillColor(200, 190, 220);
    doc.rect(14, y + 5, 8, 3.5, 'F');
    doc.text(`Mese precedente (${prevMonthLabel})`, 24, y + 8);

    // Footer
    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text(`Vibra Team Management · Pagina ${i} di ${pages}`, 14, 206);
      doc.text(dateStr, 283, 206, { align: 'right' });
    }

    doc.save(`vibra-report-mensile-${format(new Date(), 'yyyy-MM')}.pdf`);
    setLoading(false);
  };

  const handleExportCSV = () => {
    setOpen(false);
    const rows = [
      ['VIBRA — Report Mensile', monthLabel, '', '', '', '', '', '', ''],
      ['Confronto con', prevMonthLabel, '', '', '', '', '', '', ''],
      [''],
      ['#', 'Promoter', 'Zona', `Fatturato ${monthLabel}`, `Fatturato ${prevMonthLabel}`, 'Δ%', 'Serate', 'Media/Serata', 'Tavoli Chiusi'],
      ...promoterReports.map((r, i) => {
        const delta = getDeltaPct(r.curr.revenue, r.prev.revenue);
        return [
          i + 1,
          r.promoter.name,
          [r.promoter.neighborhood, r.promoter.city].filter(Boolean).join(', ') || '-',
          Math.round(r.curr.revenue),
          Math.round(r.prev.revenue),
          delta ?? '-',
          r.curr.serate,
          Math.round(r.curr.avgPerSerata),
          Math.round(r.curr.tavoli * 10) / 10,
        ];
      }),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = webURL.createObjectURL(blob);
    const a = webDocument.createElement('a');
    a.href = url;
    a.download = `vibra-report-mensile-${format(new Date(), 'yyyy-MM')}.csv`;
    a.click();
    webURL.revokeObjectURL(url);
  };

  return (
    <Div className="relative">
      <Btn
        button
        onClick={() => setOpen(o => !o)}
        disabled={loading || promoterReports.length === 0}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all disabled:opacity-40">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Scarica Report
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Btn>

      {/* PORT: menu nel portale sul telefono, agganciato al pulsante (ui/anchoredPanel): sporgendo dal
          contenitore non riceveva i tocchi */}
      <AnchoredPanel open={open} onClose={() => setOpen(false)}
        className="absolute right-0 top-full mt-1.5 z-20 bg-card border border-border rounded-xl shadow-2xl overflow-hidden min-w-[200px]">
            <Btn
              button
              onClick={handleExportPDF}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary/40 transition-all text-left">
              <Div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-red-400" />
              </Div>
              <Div>
                <Div className="font-medium">Esporta PDF</Div>
                <Div className="text-[10px] text-muted-foreground">Report professionale con grafici</Div>
              </Div>
            </Btn>
            <Div className="h-px bg-border mx-3" />
            <Btn
              button
              onClick={handleExportCSV}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary/40 transition-all text-left">
              <Div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-green-400" />
              </Div>
              <Div>
                <Div className="font-medium">Esporta CSV</Div>
                <Div className="text-[10px] text-muted-foreground">Dati per Excel</Div>
              </Div>
            </Btn>
      </AnchoredPanel>
    </Div>
  );
}