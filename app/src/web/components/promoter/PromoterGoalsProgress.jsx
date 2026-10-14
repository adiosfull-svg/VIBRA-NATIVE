// Port di src/components/promoter/PromoterGoalsProgress.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Target } from '@/ui/icons.generated';
import GoalBar from './GoalBar';

import { Div, H } from '@/ui/html';

export default function PromoterGoalsProgress({
  promoter, attendances, events,
  clients = [], achievements = [], promoterAchievements = [], promoterRanks = [],
  compact = false,
}) {
  const goals = promoter?.goals || [];
  if (goals.length === 0) return null;

  return (
    <Div className={compact ? 'space-y-3' : 'rounded-xl bg-card border border-border p-5 space-y-4'}>
      {!compact && (
        <Div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <H className="font-semibold text-sm">Obiettivi</H>
        </Div>
      )}
      <Div className="space-y-4">
        {goals.map(goal => (
          <GoalBar
            key={goal.id}
            goal={goal}
            promoterId={promoter.id}
            attendances={attendances}
            events={events}
            clients={clients}
            achievements={achievements}
            promoterAchievements={promoterAchievements}
            promoterRanks={promoterRanks}
          />
        ))}
      </Div>
    </Div>
  );
}