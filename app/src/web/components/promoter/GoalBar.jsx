// Port di src/components/promoter/GoalBar.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { CheckCircle2, AlertCircle } from '@/ui/icons.generated';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { getGoalTypeMeta } from '@/legacy/utils/goalTypes';
import { computeGoalProgress } from '@/legacy/utils/goalProgress';
import { RANK_TIERS } from '@/legacy/utils/rankSystem';

import { Div, P, Span } from '@/ui/html';

const GIORNO_LABELS = {
  'tutti': 'Tutti', '5': 'Ven', '6': 'Sab', '0': 'Dom',
  '5,6': 'Ven+Sab', '5,0': 'Ven+Dom', '6,0': 'Sab+Dom', '5,6,0': 'Ven+Sab+Dom', 'extra': 'Extra',
};

export default function GoalBar({
  goal, promoterId,
  attendances = [], events = [], clients = [],
  achievements = [], promoterAchievements = [], promoterRanks = [],
}) {
  const meta = getGoalTypeMeta(goal.type);
  const Icon = meta.icon;
  const { current, pct, done } = computeGoalProgress(goal, { attendances, events, clients, promoterAchievements, promoterRanks, promoterId });

  let valueStr = '';
  let label = goal.label || meta.label;

  if (goal.type === 'fatturato') valueStr = `€${current.toLocaleString('it-IT')} / €${Number(goal.target).toLocaleString('it-IT')}`;
  else if (goal.type === 'tavoli') valueStr = `${current} / ${goal.target} tavoli`;
  else if (goal.type === 'clienti_instagram' || goal.type === 'clienti_tiktok') valueStr = `${current} / ${goal.target} clienti`;
  else if (goal.type === 'achievement') {
    const ach = achievements.find(a => a.id === goal.achievement_id);
    label = goal.label || `Sblocca: ${ach?.title || 'Achievement'}`;
    valueStr = done ? 'Sbloccato ✓' : 'Da sbloccare';
  } else if (goal.type === 'rank') {
    const tier = RANK_TIERS.find(t => t.key === goal.rank_key);
    label = goal.label || `Raggiungi: ${tier?.label || goal.rank_key}`;
    valueStr = done ? 'Raggiunto ✓' : 'In corso';
  }

  const periodLabel = goal.date_from && goal.date_to
    ? `${format(parseISO(goal.date_from), 'd MMM', { locale: it })} → ${format(parseISO(goal.date_to), 'd MMM yyyy', { locale: it })}`
    : null;
  const giornoLabel = goal.giorni && goal.giorni !== 'tutti' ? GIORNO_LABELS[goal.giorni] || goal.giorni : null;

  const barColor = done ? 'bg-green-500' : pct >= 75 ? 'bg-primary' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500/70';

  return (
    <Div className="space-y-1.5">
      <Div className="flex items-center justify-between text-xs">
        <Div className="flex items-center gap-1.5 flex-wrap">
          <Icon className={`w-3.5 h-3.5 shrink-0 ${meta.color}`} />
          <Span className="font-medium">{label}</Span>
          {giornoLabel && (
            <Span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">{giornoLabel}</Span>
          )}
          {periodLabel && <Span className="text-muted-foreground">· {periodLabel}</Span>}
        </Div>
        <Div className="flex items-center gap-1.5 shrink-0">
          <Span className={done ? 'text-green-400 font-bold' : 'font-semibold'}>{valueStr}</Span>
          {done
            ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            : pct < 40 ? <AlertCircle className="w-3.5 h-3.5 text-red-400" /> : null}
        </Div>
      </Div>
      <Div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
        <Div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
      </Div>
      <P className="text-[10px] text-muted-foreground text-right">{pct.toFixed(1)}%</P>
    </Div>
  );
}