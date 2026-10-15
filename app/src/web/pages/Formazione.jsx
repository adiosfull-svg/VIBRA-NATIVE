// Port di src/pages/Formazione.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { InteractionManager } from 'react-native';
import { prefetchImages } from '@/ui/imageCache';
import { ChevronLeft, ChevronRight, X, BookOpen, Maximize2, Grid3X3, List } from '@/ui/icons.generated';
import { motion, AnimatePresence } from '@/ui/motion';
import PageTitle from '@/web/components/shared/PageTitle';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { makeTapHandlers } from '@/web/lib/tapHandlers';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

const BASE_URL = 'https://media.base44.com/images/public/69de4f1f7f53d9f187d01392/';

const SLIDES = [
  // Modulo 1: Le Pubbliche Relazioni (1-5)
  { id: 1,  file: 'bec294e5e_1.png',   module: 'Le Pubbliche Relazioni',     title: 'Cosa sono? Lavoro ed Investimento' },
  { id: 2,  file: '7fef6fd22_2.png',   module: 'Le Pubbliche Relazioni',     title: 'E nel By Night? Locali e Divertimento' },
  { id: 3,  file: '93e283922_3.png',   module: 'Le Pubbliche Relazioni',     title: 'Cosa significa essere un PR?' },
  { id: 4,  file: '53c5af5ad_4.png',   module: 'Le Pubbliche Relazioni',     title: 'Risvolti Sociali Positivi, Personali ed Economici' },
  { id: 5,  file: '68f7ead9d_5.png',   module: 'Le Pubbliche Relazioni',     title: 'Obiettivi ed Ambizione — Che futuro ho?' },
  // Modulo 2: Armi per diventare Leader (6-14)
  { id: 6,  file: 'acab7ae1d_6.png',   module: 'Armi per diventare Leader',  title: 'Ostinazione' },
  { id: 7,  file: '67a5af0d6_7.png',   module: 'Armi per diventare Leader',  title: 'Tempo (Investimento)' },
  { id: 8,  file: 'cac1bb315_8.png',   module: 'Armi per diventare Leader',  title: 'Tempo (a Disposizione)' },
  { id: 9,  file: 'ab084063d_9.png',   module: 'Armi per diventare Leader',  title: 'Perseveranza' },
  { id: 10, file: '79a2d4299_10.png',  module: 'Armi per diventare Leader',  title: 'Costanza' },
  { id: 11, file: 'a9a7d7d7f_11.png',  module: 'Armi per diventare Leader',  title: 'Pazienza' },
  { id: 12, file: '47f15e487_12.png',  module: 'Armi per diventare Leader',  title: "Serietà" },
  { id: 13, file: '11899ebcd_13.png',  module: 'Armi per diventare Leader',  title: 'Empatia' },
  // Modulo 3: Vibra — Chi siamo (14-17)
  { id: 14, file: '212065a08_14.png',  module: 'Vibra — Chi Siamo',          title: 'Chi siamo, Cosa siamo, Come nasciamo' },
  { id: 15, file: 'd92acc1ff_15.png',  module: 'Vibra — Chi Siamo',          title: 'In cosa consiste il nostro progetto?' },
  { id: 16, file: '2aa22bc24_16.png',  module: 'Vibra — Chi Siamo',          title: "Perché vogliamo essere diversi?" },
  { id: 17, file: '00fcfdb28_17.png',  module: 'Vibra — Chi Siamo',          title: 'Movimento unico e senso di appartenenza' },
  { id: 18, file: '495363fe8_18.png',  module: 'Vibra — Chi Siamo',          title: 'Significato di Famiglia — Supportarsi ed Aiutarsi' },
  // Modulo 4: Gestione ed Organizzazione Personale (19-23)
  { id: 19, file: '6c9ebbca4_19.png',  module: 'Gestione ed Organizzazione Personale', title: "Individuazione Capacità Personali (Esco e/o Contatto)" },
  { id: 20, file: 'c94aecd24_20.png',  module: 'Gestione ed Organizzazione Personale', title: 'Individuazione Metodo di Approccio (Aspetto, Simpatia, ecc)' },
  { id: 21, file: 'e8f1d353f_21.png',  module: 'Gestione ed Organizzazione Personale', title: 'Organizzazione del Tempo Settimanale' },
  { id: 22, file: 'b2f22180d_22.png',  module: 'Gestione ed Organizzazione Personale', title: 'Rinnovo Stimolo ed Energie Mentali' },
  { id: 23, file: '87c250995_23.png',  module: 'Gestione ed Organizzazione Personale', title: 'Burnout e Componente Emotiva' },
  // Modulo 5: Vendita del Prodotto ed Approccio al Cliente (24-41)
  { id: 24, file: '869ed2967_24.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Le 3 Regole di Vendita (Feel, Felt, Found)' },
  { id: 25, file: 'f03cfe3e3_24b.png', module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Come faccio a convincere qualcuno?' },
  { id: 26, file: '814f76f1d_25.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Individuare Mancanze e Insoddisfazione (se già nel locale)' },
  { id: 27, file: '67c8c03d4_26.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: "Individuazione Opinion Leader — Chi è?" },
  { id: 28, file: '3e5d200d4_27.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: "Ricerca ed Analisi del Profilo Giusto (Età, Abitudini, Interessi)" },
  { id: 29, file: '6ad634aca_28.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Come contattare qualcuno? Che metodi ho?' },
  { id: 30, file: 'e14316574_29.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Quali sono i Rompighiaccio Efficaci?' },
  { id: 31, file: '0edd734b6_30.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'La Ricerca della Scintilla nella Conversazione (Empatia)' },
  { id: 32, file: '51162a4d4_31.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Richiesta Indiretta per Prendersi una Conferma' },
  { id: 33, file: '2369676e9_32.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Prevedere Risposte ed Evitare quelle Chiuse' },
  { id: 34, file: 'c9741ae0d_33.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Riprova Sociale' },
  { id: 35, file: 'ff62ab1b8_34.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Ognuno ha i suoi Tempi e Situazione Sociale (Pazienza e Perseveranza)' },
  { id: 36, file: 'a631ebf50_35.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: "Qualità e Quantità" },
  { id: 37, file: 'daee3243e_36.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'La Chiave? Instaurare un Rapporto' },
  { id: 38, file: 'b536e9415_37.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Infoline, Indotto, Produzione Lavorata' },
  // Modulo 6: Gestione del Cliente (39-43)
  { id: 39, file: '2e1f70721_38.png',  module: 'Gestione del Cliente',       title: 'Il Pagante prima di tutto — Prima il Dovere, poi il Piacere' },
  { id: 40, file: 'b51855f6a_39.png',  module: 'Gestione del Cliente',       title: 'Osservazione del loro Comportamento e Divertimento in Serata' },
  { id: 41, file: '7312ca454_40.png',  module: 'Gestione del Cliente',       title: "Mantenersi in Contatto con i propri Paganti" },
  { id: 42, file: 'fa93c5715_41.png',  module: 'Gestione del Cliente',       title: 'Risolvere ed Accogliere Lamentele e Critiche senza Ignorarle' },
  { id: 43, file: '79220eeb3_42.png',  module: 'Gestione del Cliente',       title: "Il tuo Opinion Leader è un tuo PR Indiretto" },
  // Modulo 7: Social Media (44-49)
  { id: 44, file: 'cc1681640_43.png',  module: 'Social Media',               title: 'Il Nostro Mezzo Lavorativo più Potente (La Nostra Vetrina)' },
  { id: 45, file: '12dd00221_44.png',  module: 'Social Media',               title: 'Interazioni Settimanali Costanti' },
  { id: 46, file: 'ee3619c70_45.png',  module: 'Social Media',               title: 'Pubblicazione Materiale Pubblicitario (Locandine e Video)' },
  { id: 47, file: '1fb1fae9b_46.png',  module: 'Social Media',               title: 'La Differenza tra Instagram e Tik Tok' },
  { id: 48, file: 'b88293456_47.png',  module: 'Social Media',               title: 'Dove Trovare Contattati su Instagram?' },
  { id: 49, file: '44b11aecc_48.png',  module: 'Social Media',               title: 'Come Sfruttare Tik Tok?' },
  { id: 50, file: 'a470213f7_49.png',  module: 'Social Media',               title: "Pubblicazione Contenuti di Qualità ed in HD" },
  // Modulo 8: Lato Tecnico (50-54)
  { id: 51, file: 'ea90861bf_50.png',  module: 'Lato Tecnico',               title: 'Come Funzionano le Serate in cui Lavoro?' },
  { id: 52, file: '1cce3a95d_51.png',  module: 'Lato Tecnico',               title: 'Differenziazione Formule Ven, Sab, Dom' },
  { id: 53, file: 'c49d93464_52.png',  module: 'Lato Tecnico',               title: 'Casse e Pagamenti — Cambusa e Comande' },
  { id: 54, file: '8815d93eb_53.png',  module: 'Lato Tecnico',               title: 'Organizzazione del Proprio Lavoro (Note e Google Keep)' },
  { id: 55, file: '99d67d41e_54.png',  module: 'Lato Tecnico',               title: 'Criteri di Selezione' },
  // Riassunti (55-56)
  { id: 56, file: '565205aef_55.png',  module: 'Riassunti',                  title: 'Vendita del Prodotto — In Pillole (Parte 1)' },
  { id: 57, file: '953bec071_56.png',  module: 'Riassunti',                  title: 'Vendita del Prodotto — In Pillole (Parte 2)' },
  // Timeline (57)
  { id: 58, file: 'c54294d78_57.png',  module: 'Timeline Annuale',           title: 'Timeline Annuale — Archi della Stagione' },
];

const MODULES = [...new Set(SLIDES.map(s => s.module))];

const MODULE_COLORS = {
  'Le Pubbliche Relazioni': '#8b5cf6',
  'Armi per diventare Leader': '#f97316',
  'Vibra — Chi Siamo': '#ec4899',
  'Gestione ed Organizzazione Personale': '#0ea5e9',
  'Vendita del Prodotto ed Approccio al Cliente': '#22c55e',
  'Gestione del Cliente': '#eab308',
  'Social Media': '#ef4444',
  'Lato Tecnico': '#14b8a6',
  'Riassunti': '#a855f7',
  'Timeline Annuale': '#f59e0b',
};

const THUMB_FIRST = 8;
const THUMB_STEP = 10;

export default function Formazione() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [viewMode, setViewMode] = useState('presentation'); // 'presentation' | 'grid'
  const lastTouchRef = useRef(0);

  const displaySlides = activeModule ? SLIDES.filter(s => s.module === activeModule) : SLIDES;
  const currentSlide = displaySlides[currentIdx] || displaySlides[0];

  // PORT: striscia delle miniature montata a blocchi: tutte insieme erano 58 pulsanti + 58 immagini, se ne
  // vedono ~3,5. Prime max(8, corrente+4), il resto a app ferma; in coda un segnaposto largo quanto le
  // mancanti (lo scorrimento non si ferma su una fine falsa); immagini delle mancanti precaricate.
  const [thumbCount, setThumbCount] = useState(THUMB_FIRST);
  useEffect(() => { setThumbCount(THUMB_FIRST); }, [activeModule]);
  const shownThumbs = Math.min(displaySlides.length, Math.max(thumbCount, currentIdx + 4));
  useEffect(() => {
    if (shownThumbs >= displaySlides.length) return;
    prefetchImages(displaySlides.slice(shownThumbs).map((sl) => BASE_URL + sl.file));
    let timer = null;
    const task = InteractionManager.runAfterInteractions(() => {
      timer = setTimeout(() => setThumbCount((c) => Math.max(c, shownThumbs) + THUMB_STEP), 200);
    });
    return () => { task.cancel?.(); if (timer) clearTimeout(timer); };
  // displaySlides è un array nuovo a ogni render: conta il modulo scelto
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shownThumbs, activeModule, displaySlides.length]);

  const go = useCallback((dir) => {
    setCurrentIdx(i => {
      const next = i + dir;
      if (next < 0) return displaySlides.length - 1;
      if (next >= displaySlides.length) return 0;
      return next;
    });
  }, [displaySlides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    webWindow.addEventListener('keydown', handler);
    return () => webWindow.removeEventListener('keydown', handler);
  }, [go]);

  const handleModuleChange = (mod) => {
    setActiveModule(mod);
    setCurrentIdx(0);
  };

  const jumpToSlide = (idx) => {
    setCurrentIdx(idx);
    setViewMode('presentation');
  };

  const progressPct = displaySlides.length > 1 ? (currentIdx / (displaySlides.length - 1)) * 100 : 100;
  const moduleColor = MODULE_COLORS[currentSlide?.module] || '#8b5cf6';

  return (
    <Div className="space-y-6">
      <PageTitle title="Formazione" />
      <Div className="flex items-center justify-between flex-wrap gap-3">
        <Div>
          <P className="text-sm text-muted-foreground">
            Corso di formazione — Le Pubbliche Relazioni · <Span className="font-semibold">{SLIDES.length} slide</Span>
          </P>
        </Div>
        <Div className="flex gap-2">
          <Btn
            button
            {...makeTapHandlers(lastTouchRef, () => setViewMode('presentation'))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${viewMode === 'presentation' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
            <List className="w-3.5 h-3.5" /> Presentazione
          </Btn>
          <Btn
            button
            {...makeTapHandlers(lastTouchRef, () => setViewMode('grid'))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${viewMode === 'grid' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
            <Grid3X3 className="w-3.5 h-3.5" /> Griglia
          </Btn>
        </Div>
      </Div>

      {/* Filtro moduli */}
      <Div className="flex flex-wrap gap-2">
        <Btn
          button
          {...makeTapHandlers(lastTouchRef, () => handleModuleChange(null))}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${!activeModule ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
          Tutti ({SLIDES.length})
        </Btn>
        {MODULES.map(mod => {
          const count = SLIDES.filter(s => s.module === mod).length;
          const col = MODULE_COLORS[mod];
          return (
            <Btn
              button
              key={mod}
              {...makeTapHandlers(lastTouchRef, () => handleModuleChange(mod))}
              style={activeModule === mod ? { borderColor: col, color: col, background: col + '18' } : {}}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${activeModule === mod ? '' : 'border-border text-muted-foreground hover:text-foreground'}`}>
              {mod} ({count})
                          </Btn>
          );
        })}
      </Div>

      {viewMode === 'presentation' ? (
        <Div className="space-y-4">
          <Div
            className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card"
            style={{ boxShadow: `0 4px 32px -8px ${moduleColor}28` }}
          >
            <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
              style={{ background: `linear-gradient(90deg, transparent, ${moduleColor}, transparent)` }} />
            <Div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <Span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: moduleColor + '22', color: moduleColor }}>
                {currentSlide?.module}
              </Span>
              <Span className="text-xs text-muted-foreground font-mono">
                {currentIdx + 1} / {displaySlides.length}
              </Span>
            </Div>

            {/* Slide */}
            <Btn className="relative group cursor-pointer" onClick={() => setLightboxOpen(true)}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide?.id}
                  src={BASE_URL + currentSlide?.file}
                  alt={currentSlide?.title}
                  className="w-full object-contain bg-[#5B2D8E]"
                  style={{ maxHeight: '520px', minHeight: '300px' }}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
              {/* Fullscreen hint */}
              <Div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-lg p-1.5">
                <Maximize2 className="w-4 h-4 text-white" />
              </Div>
              {/* Nav arrows overlay */}
              <Btn
                button
                onClick={e => { e.stopPropagation(); go(-1); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-5 h-5 text-white" />
              </Btn>
              <Btn
                button
                onClick={e => { e.stopPropagation(); go(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-white" />
              </Btn>
            </Btn>

            {/* Progress bar */}
            <Div className="h-1 bg-border">
              <motion.div
                className="h-full transition-all"
                style={{ width: `${progressPct}%`, background: moduleColor }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </Div>

            {/* Title + nav buttons */}
            <Div className="flex items-center justify-between px-5 py-4 gap-4">
              <P className="text-sm font-semibold flex-1 leading-snug">{currentSlide?.title}</P>
              <Div className="flex gap-2 shrink-0">
                <Btn
                  button
                  onClick={() => go(-1)}
                  disabled={currentIdx === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-border hover:bg-secondary/50 disabled:opacity-30 transition-all">
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </Btn>
                <Btn
                  button
                  onClick={() => go(1)}
                  disabled={currentIdx === displaySlides.length - 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-border hover:bg-secondary/50 disabled:opacity-30 transition-all">
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Btn>
              </Div>
            </Div>
          </Div>

          {/* Thumbnail strip */}
          <Div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {displaySlides.slice(0, shownThumbs).map((slide, idx) => {
              const col = MODULE_COLORS[slide.module];
              return (
                <Btn
                  button
                  key={slide.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIdx ? 'scale-105 shadow-lg' : 'opacity-60 hover:opacity-90'}`}
                  style={{ borderColor: idx === currentIdx ? col : 'transparent' }}
                  accessibilityLabel={slide.title}>
                  <Img
                    src={BASE_URL + slide.file}
                    alt={slide.title}
                    className="w-24 h-14 object-cover bg-[#5B2D8E]"
                  />
                </Btn>
              );
            })}
            {shownThumbs < displaySlides.length && (
              <Div className="shrink-0" style={{ width: (displaySlides.length - shownThumbs) * 108 - 8 }} />
            )}
          </Div>
        </Div>
      ) : (
        /* Grid view */
        <Div className="space-y-8">
          {MODULES.filter(mod => !activeModule || mod === activeModule).map((mod, mIdx) => {
            const modSlides = SLIDES.filter(s => s.module === mod);
            const col = MODULE_COLORS[mod];
            return (
              <Div
                key={mod}
                className="dash-fade-up"
              >
                <Div className="flex items-center gap-3 mb-4">
                  <SectionHeader icon={BookOpen} title={mod} color={col} />
                  <Span className="text-xs text-muted-foreground">({modSlides.length} slide)</Span>
                </Div>
                <Div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {modSlides.map(slide => {
                    const globalIdx = SLIDES.findIndex(s => s.id === slide.id);
                    const localIdx = displaySlides.findIndex(s => s.id === slide.id);
                    return (
                      <Btn
                        button
                        key={slide.id}
                        onClick={() => { handleModuleChange(activeModule); jumpToSlide(localIdx >= 0 ? localIdx : 0); }}
                        className="group rounded-xl overflow-hidden border border-white/[0.06] bg-card hover:border-primary/40 transition-all text-left"
                        style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.3)' }}>
                        <Div className="relative">
                          <Img
                            src={BASE_URL + slide.file}
                            alt={slide.title}
                            className="w-full h-28 object-cover bg-[#5B2D8E]"
                          />
                          <Div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Div>
                          <Span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-black/60 text-white rounded px-1.5 py-0.5">
                            #{globalIdx + 1}
                          </Span>
                        </Div>
                        <Div className="p-2">
                          <P className="text-[10px] text-foreground/80 leading-tight line-clamp-2">{slide.title}</P>
                        </Div>
                      </Btn>
                    );
                  })}
                </Div>
              </Div>
            );
          })}
        </Div>
      )}

      {/* Lightbox fullscreen */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <Btn
              button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10">
              <X className="w-5 h-5 text-white" />
            </Btn>
            <Btn
              button
              onClick={e => { e.stopPropagation(); go(-1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10">
              <ChevronLeft className="w-6 h-6 text-white" />
            </Btn>
            <Btn
              button
              onClick={e => { e.stopPropagation(); go(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10">
              <ChevronRight className="w-6 h-6 text-white" />
            </Btn>

            <motion.img
              key={currentSlide?.id}
              src={BASE_URL + currentSlide?.file}
              alt={currentSlide?.title}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
            />

            <Div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <P className="text-white text-sm font-semibold mb-1">{currentSlide?.title}</P>
              <P className="text-white/50 text-xs">{currentIdx + 1} / {displaySlides.length} · {currentSlide?.module}</P>
            </Div>
          </motion.div>
        )}
      </AnimatePresence>
    </Div>
  );
}