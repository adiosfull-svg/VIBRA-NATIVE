// Port di src/components/ilmiovibra/AchievementProgressBar.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Flame, Target } from '@/ui/icons.generated';
import { RARITY_LABELS } from '@/legacy/utils/achievementLogic';

import { Div, Span } from '@/ui/html';

// Barra di progresso "family-aware": mostra checkpoint per ogni rango della
// famiglia (stesso condition_type), evidenzia il prossimo rank da raggiungere
// e, se il valore supera il massimo, uno stato "esploso" con l'overflow raggiunto.
export default function AchievementProgressBar({ current, maxValue, percent, isMaxed, overflow, checkpoints }) {
  const fillPercent = isMaxed ? 100 : percent;
  const nextCheckpoint = !isMaxed ? checkpoints.find(c => !c.achieved) : null;

  return (
    <Div className="space-y-1 pt-3.5">
      <Div className="flex justify-between text-[10px] text-muted-foreground">
        <Span>{Number(current).toLocaleString('it-IT')} / {Number(maxValue).toLocaleString('it-IT')}</Span>
        {isMaxed && overflow > 0 ? (
          <Span className="flex items-center gap-1 text-orange-400 font-semibold">
            <Flame className="w-3 h-3" /> +{Number(overflow).toLocaleString('it-IT')} oltre
          </Span>
        ) : (
          <Span>{percent}%</Span>
        )}
      </Div>
      <Div className="relative w-full bg-secondary/40 rounded-full h-1.5">
        <Div
          className={`h-1.5 rounded-full transition-all ${
            isMaxed ? 'bg-gradient-to-r from-orange-500 to-yellow-400' : fillPercent >= 75 ? 'bg-primary' : fillPercent >= 40 ? 'bg-yellow-500' : 'bg-red-500/60'
          }`}
          style={{ width: `${fillPercent}%` }}
        />
        {checkpoints.filter(c => c.position > 1 && c.position < 99).map((c, i) => {
          const isNext = nextCheckpoint && c.value === nextCheckpoint.value;
          return (
            <Div
              key={i}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${c.position}%` }}
            >
              {isNext && (
                <Div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <Target className="w-2.5 h-2.5 text-yellow-300 animate-pulse" />
                </Div>
              )}
              <Div
                className={`rounded-full ${
                  isNext
                    ? 'w-2.5 h-2.5 -translate-x-1/2 bg-yellow-300 ring-2 ring-yellow-300/50 animate-pulse'
                    : `-translate-x-1/2 ${c.isOwn ? 'w-2 h-2 ring-1 ring-white' : 'w-1 h-1'} ${c.achieved ? 'bg-white' : 'bg-white/30'}`
                }`}
                accessibilityLabel={`${RARITY_LABELS[c.rarity] || c.rarity}: ${Number(c.value).toLocaleString('it-IT')}`}
              />
            </Div>
          );
        })}
      </Div>
      {nextCheckpoint && (
        <Div className="flex items-center gap-1 text-[10px] text-yellow-300/90">
          <Target className="w-3 h-3" />
          <Span>Prossimo: {RARITY_LABELS[nextCheckpoint.rarity] || nextCheckpoint.rarity} a {Number(nextCheckpoint.value).toLocaleString('it-IT')}</Span>
        </Div>
      )}
      {isMaxed && overflow > 0 && (
        <Div className="flex items-center gap-1 text-[10px] text-orange-400">
          <Span>💥</Span>
          <Span>Sei andato oltre il massimo di {overflow.toLocaleString('it-IT')}!</Span>
        </Div>
      )}
    </Div>
  );
}