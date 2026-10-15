// Port di src/pages/Download.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef, useEffect } from 'react';
import { useProgressiveList } from '@/web/hooks/useProgressiveList';
import { useMountedOnce } from '@/web/hooks/useMountedOnce';
import { prefetchImages } from '@/ui/imageCache';
import { makeTapHandlers } from '@/web/lib/tapHandlers';
import { Download, FolderOpen, FileText, Plus, Trash2, Share2 } from '@/ui/icons.generated';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PageTitle from '@/web/components/shared/PageTitle';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { base44 } from '@/lib/base44';
import { useAuth } from '@/lib/auth';
import UploadMaterialDialog from '@/web/components/download/UploadMaterialDialog';
import { BASE_IMG, BASE_FILE, STATIC_SECTIONS, shareMedia } from '@/legacy/utils/downloadMaterials';

import { doc as webDocument } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

const previewOf = (item) => (item.file_url
  ? (item.file_type === 'img' ? item.file_url : null)
  : item.preview);

function FileCard({ item, isAdmin, onDelete }) {
  const isPdf = item.type === 'file';
  // Supporta sia items statici (file relativo) che items da DB (file_url assoluto)
  const downloadUrl = item.file_url
    ? item.file_url
    : isPdf ? (BASE_FILE + item.file) : (BASE_IMG + item.file);
  const previewUrl = previewOf(item);

  const handleDownload = () => {
    const link = webDocument.createElement('a');
    link.href = downloadUrl;
    link.download = item.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    webDocument.body.appendChild(link);
    link.click();
    webDocument.body.removeChild(link);
  };

  const handleShare = () => { shareMedia(downloadUrl, item.name); };

  const bgClass = item.bg_class || item.bg || 'bg-gray-900';

  return (
    <Div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-card group hover:border-primary/30 transition-all duration-200" style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.3)' }}>
      <Div className={`relative h-32 flex items-center justify-center overflow-hidden ${bgClass}`}>
        {(isPdf || item.file_type === 'file') ? (
          <Div className="flex flex-col items-center gap-2">
            <FileText className="w-10 h-10 text-red-400" />
            <Span className="text-[10px] text-white/70 font-bold uppercase">FILE</Span>
          </Div>
        ) : previewUrl ? (
          <Img
            src={previewUrl}
            alt={item.name}
            className="max-h-28 max-w-full object-contain p-2" />
        ) : (
          <Div className="flex flex-col items-center gap-2">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </Div>
        )}
        {isAdmin && onDelete && (
          <Btn
            button
            onClick={e => { e.stopPropagation(); onDelete(); }}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive">
            <Trash2 className="w-3 h-3 text-white" />
          </Btn>
        )}
      </Div>
      <Div className="p-3 flex flex-col gap-2.5">
        <Div className="min-w-0">
          <P className="text-xs font-medium text-foreground leading-tight break-words">{item.name}</P>
          <P className="text-[10px] text-muted-foreground mt-0.5 uppercase">
            {item.file_url ? item.file_url.split('.').pop().toUpperCase() : (isPdf ? 'PDF' : (item.file || '').split('.').pop().toUpperCase())}
          </P>
        </Div>
        <Div className="flex items-center gap-1.5 w-full">
          <Btn
            button
            onClick={handleShare}
            className="flex items-center justify-center px-2 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-all active:scale-95"
            accessibilityLabel="Condividi"
          >
            <Share2 className="w-3.5 h-3.5" />
          </Btn>
          <Btn
            button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all text-[11px] font-semibold">
            <Download className="w-3.5 h-3.5" />
            Scarica
          </Btn>
        </Div>
      </Div>
    </Div>
  );
}

export default function DownloadPage() {
  const [activeSection, setActiveSection] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const lastTouchRef = useRef(0);
  const qc = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: dbItems = [] } = useQuery({
    queryKey: ['download-items'],
    queryFn: () => base44.entities.DownloadItem.list(),
    staleTime: 5 * 60000,
  });

  // Sezioni custom ricavate dai dbItems
  const customSections = [];
  const seenIds = new Set(STATIC_SECTIONS.map(s => s.id));
  dbItems.forEach(item => {
    if (!seenIds.has(item.section_id)) {
      seenIds.add(item.section_id);
      customSections.push({
        id: item.section_id,
        label: item.section_label || item.section_id,
        icon: item.section_icon || '📁',
        color: item.section_color || '#6366f1',
      });
    }
  });

  // Costruisce le sezioni complete (statiche + custom) con items DB appesi
  const allSections = [...STATIC_SECTIONS, ...customSections].map(sec => {
    const dynamicItems = dbItems.filter(i => i.section_id === sec.id);
    return { ...sec, items: [...(sec.items || []), ...dynamicItems] };
  });

  const totalFiles = allSections.reduce((acc, s) => acc + s.items.length, 0);
  const visibleSections = activeSection ? allSections.filter(s => s.id === activeSection) : allSections;

  // PORT: card montate a blocchi su tutte le sezioni (prima tutte insieme), a app ferma si completano; le
  // anteprime delle card non ancora montate si precaricano. I contatori restano sui dati.
  const totalItems = visibleSections.reduce((n, sec) => n + sec.items.length, 0);
  const { count: shownItems, sentinelRef: itemsSentinelRef } = useProgressiveList(totalItems, { initial: 10, step: 10, idleStep: 10 });
  const pendingPreviews = shownItems < totalItems
    ? visibleSections.flatMap((sec) => sec.items).slice(shownItems).map(previewOf).filter(Boolean).join('\n')
    : '';
  useEffect(() => { if (pendingPreviews) prefetchImages(pendingPreviews.split('\n')); }, [pendingPreviews]);
  const uploadMounted = useMountedOnce(uploadOpen);
  let budget = shownItems;

  const handleDelete = async (id) => {
    await base44.entities.DownloadItem.delete(id);
    qc.invalidateQueries({ queryKey: ['download-items'] });
  };

  return (
    <Div className="space-y-6">
      <PageTitle title="Download" />
      {/* Header */}
      <Div className="flex items-start justify-between gap-3">
        <Div>
          <P className="text-sm text-muted-foreground">
            Tutti i file grafici in formato originale · <Span className="font-semibold">{totalFiles} file</Span>
          </P>
        </Div>
        {isAdmin && (
          <Btn
            button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shrink-0">
            <Plus className="w-4 h-4" />
            Aggiungi materiale
          </Btn>
        )}
      </Div>

      {/* Filtro sezioni */}
      <Div className="flex flex-wrap gap-2">
        <Btn
          button
          {...makeTapHandlers(lastTouchRef, () => setActiveSection(null))}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${!activeSection ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
          Tutti ({totalFiles})
        </Btn>
        {allSections.map(s => (
          <Btn
            button
            key={s.id}
            {...makeTapHandlers(lastTouchRef, () => setActiveSection(s.id))}
            style={activeSection === s.id ? { borderColor: s.color, color: s.color, background: s.color + '18' } : {}}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${activeSection === s.id ? '' : 'border-border text-muted-foreground hover:text-foreground'}`}>
            {s.icon} {s.label} ({s.items.length})
          </Btn>
        ))}
      </Div>

      {/* Sezioni */}
      {visibleSections.map((section, sIdx) => (
        <Div
          key={section.id}
          className="dash-fade-up"
        >
          <Div className="flex items-center gap-3 mb-4">
            <SectionHeader icon={section.icon} title={section.label} color={section.color} />
            <Span className="text-xs text-muted-foreground">({section.items.length} file)</Span>
          </Div>
          <Div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {section.items.slice(0, Math.max(0, budget)).map((item, idx) => (
              <FileCard
                key={item.id || idx}
                item={item}
                isAdmin={isAdmin}
                onDelete={item.id ? () => handleDelete(item.id) : null}
              />
            ))}
            {(() => { budget -= section.items.length; return null; })()}
          </Div>
        </Div>
      ))}
      {shownItems < totalItems && <Div ref={itemsSentinelRef} />}

      {uploadMounted && <UploadMaterialDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        customSections={customSections}
        onSaved={() => qc.invalidateQueries({ queryKey: ['download-items'] })}
      />}
    </Div>
  );
}