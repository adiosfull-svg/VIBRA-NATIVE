// Port di src/components/academy/AcademyTile.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { motion, AnimatePresence } from '@/ui/motion';
import { ChevronDown, ChevronRight, Lightbulb } from '@/ui/icons.generated';
import ScreenMockup from './ScreenMockups';
import { makeTapHandlers } from '@/web/lib/tapHandlers';

import { Btn, Div, H, P, Span } from '@/ui/html';

/**
 * Tile grafico per una sezione della Guida all'uso.
 * Mostra un'anteprima del mockup, titolo, descrizione breve (Opus 5)
 * e si espande per rivelare le lezioni dettagliate.
 */
export default function AcademyTile({ section, description, Icon, isExpanded, onToggle, lastTouchRef }) {
  const firstMockup = section.lessons[0]?.mockup;

  return (
    <Div
      className={`rounded-2xl border bg-card overflow-hidden transition-all duration-300 ${
        isExpanded
          ? 'border-primary/30 shadow-lg shadow-primary/5'
          : 'border-border hover:border-border/80'
      }`}
    >
      {/* Mockup preview — sempre visibile, scale-down del primo mockup */}
      <Btn
        button
        {...makeTapHandlers(lastTouchRef, onToggle)}
        className="block w-full text-left">
        <Div className="relative h-28 sm:h-32 overflow-hidden bg-gradient-to-b from-secondary/25 via-secondary/10 to-background border-b border-border">
          {firstMockup ? (
            <Div className="flex justify-center items-start pt-1.5">
              <Div className="origin-top scale-[0.48] sm:scale-[0.52] pointer-events-none select-none">
                <ScreenMockup type={firstMockup} />
              </Div>
            </Div>
          ) : (
            <Div className="flex items-center justify-center h-full">
              <Icon className="w-8 h-8 text-muted-foreground/30" />
            </Div>
          )}
          {/* Fade graduale sul bordo inferiore */}
          <Div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card via-card/60 to-transparent pointer-events-none" />
        </Div>
      </Btn>

      {/* Header + descrizione Opus 5 */}
      <Div className="p-3.5">
        <Div className="flex items-center gap-2 mb-1.5">
          <Div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </Div>
          <H className="text-sm font-semibold text-foreground leading-tight flex-1 min-w-0">
            {section.title}
          </H>
          <Span className="text-[10px] font-medium text-muted-foreground px-1.5 py-0.5 rounded-full bg-secondary/50 shrink-0">
            {section.lessons.length}
          </Span>
        </Div>
        <P className="text-xs text-muted-foreground leading-relaxed mb-2.5">{description}</P>
        <Btn
          button
          {...makeTapHandlers(lastTouchRef, onToggle)}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
          {isExpanded ? 'Meno dettagli' : 'Scopri di più'}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </Btn>
      </Div>

      {/* Lezioni dettagliate (espandibili) */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border"
          >
            <Div className="divide-y divide-border/50">
              {section.lessons.map((lesson, lIdx) => (
                <Div key={lIdx} className="px-3.5 py-3">
                  <Div className="flex items-start gap-2 mb-2">
                    <Span className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/15 text-primary text-[10px] font-bold shrink-0 mt-0.5">
                      {lIdx + 1}
                    </Span>
                    <H className="text-sm font-semibold text-foreground leading-snug">
                      {lesson.title}
                    </H>
                  </Div>

                  {lesson.intro && (
                    <P className="text-xs text-muted-foreground leading-relaxed mb-2.5 ml-7 italic">
                      {lesson.intro}
                    </P>
                  )}

                  {lesson.mockup && (
                    <Div className="mb-2.5 ml-7">
                      <ScreenMockup type={lesson.mockup} />
                      {lesson.callouts && lesson.callouts.length > 0 && (
                        <Div className="mt-2.5 max-w-sm mx-auto space-y-1">
                          {lesson.callouts.map((c, ci) => (
                            <Div
                              key={ci}
                              className="flex items-start gap-2 text-[11px] text-foreground/70 leading-relaxed"
                            >
                              <Span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold shrink-0 mt-0.5">
                                {c.n}
                              </Span>
                              <Span>{c.text}</Span>
                            </Div>
                          ))}
                        </Div>
                      )}
                    </Div>
                  )}

                  <Div className="space-y-1 mt-2 ml-7">
                    {lesson.steps.map((step, stIdx) => (
                      <Div
                        key={stIdx}
                        className="flex items-start gap-2 text-xs text-foreground/80 leading-relaxed"
                      >
                        <ChevronRight className="w-3 h-3 text-primary/60 shrink-0 mt-1" />
                        <Span>{step}</Span>
                      </Div>
                    ))}
                  </Div>

                  {lesson.tips && lesson.tips.length > 0 && (
                    <Div className="mt-2 ml-7 space-y-1">
                      {lesson.tips.map((tip, tIdx) => (
                        <Div
                          key={tIdx}
                          className="flex items-start gap-2 text-[11px] text-amber-400/90 bg-amber-500/5 border border-amber-500/15 rounded-lg px-2.5 py-1.5"
                        >
                          <Lightbulb className="w-3 h-3 shrink-0 mt-0.5" />
                          <Span className="leading-relaxed">{tip}</Span>
                        </Div>
                      ))}
                    </Div>
                  )}
                </Div>
              ))}
            </Div>
          </motion.div>
        )}
      </AnimatePresence>
    </Div>
  );
}