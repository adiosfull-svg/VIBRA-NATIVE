// Port di src/components/promoter/ObiettiviTab.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/ui/button';
import { Plus, Target, Trash2 } from '@/ui/icons.generated';
import { motion } from '@/ui/motion';
import { base44 } from '@/lib/base44';
import AddGoalDialog from './AddGoalDialog';
import GoalBar from './GoalBar';
import EmptyState from '@/web/components/shared/EmptyState';

import { Btn, Div, P } from '@/ui/html';

export default function ObiettiviTab({ promoters, attendances, events, clients, achievements, promoterAchievements, promoterRanks }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const qc = useQueryClient();

  const promotersWithGoals = promoters
    .filter(p => p.goals?.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleDeleteGoal = async (promoter, goalId) => {
    const updatedGoals = (promoter.goals || []).filter(g => g.id !== goalId);
    await base44.entities.Promoter.update(promoter.id, { goals: updatedGoals });
    qc.invalidateQueries({ queryKey: ['promoters'] });
  };

  return (
    <Div className="space-y-4">
      <Div className="flex items-center justify-between gap-2 flex-wrap">
        <P className="text-sm text-muted-foreground">Assegna e monitora gli obiettivi personalizzati per ogni promoter.</P>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />Nuovo Obiettivo
        </Button>
      </Div>

      {promotersWithGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Nessun obiettivo assegnato"
          description="Crea il primo obiettivo per uno dei tuoi promoter."
          onAction={() => setDialogOpen(true)}
          actionLabel="Nuovo Obiettivo"
        />
      ) : (
        <Div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {promotersWithGoals.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="rounded-xl bg-card border border-border p-4 space-y-3"
            >
              <P className="font-semibold text-sm">{p.name}</P>
              <Div className="space-y-4">
                {p.goals.map(goal => (
                  <Div key={goal.id} className="flex items-start gap-2">
                    <Div className="flex-1">
                      <GoalBar
                        goal={goal}
                        promoterId={p.id}
                        attendances={attendances}
                        events={events}
                        clients={clients}
                        achievements={achievements}
                        promoterAchievements={promoterAchievements}
                        promoterRanks={promoterRanks}
                      />
                    </Div>
                    <Btn
                      button
                      onClick={() => handleDeleteGoal(p, goal.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-1"
                      accessibilityLabel="Elimina obiettivo">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Btn>
                  </Div>
                ))}
              </Div>
            </motion.div>
          ))}
        </Div>
      )}

      <AddGoalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        promoters={promoters}
        achievements={achievements}
      />
    </Div>
  );
}