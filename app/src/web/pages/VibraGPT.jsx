// Port di src/pages/VibraGPT.jsx (convertito da scripts/port/codemod.mjs).
import { useAIAttendances } from '@/web/hooks/useAIAttendances';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@/web/router';
import { base44 } from '@/lib/base44';
import ChatStrategica from '@/web/components/ai/ChatStrategica';
import { useRoleAccess } from '@/lib/useRoleAccess';
import { Lock } from '@/ui/icons.generated';

import { Div, H, P } from '@/ui/html';

export default function VibraGPT() {
  const { canAccessRicercaAI } = useRoleAccess();
  const navigate = useNavigate();

  const { data: promoters = [] } = useQuery({ queryKey: ['promoters'], queryFn: () => base44.entities.Promoter.list(), staleTime: 10 * 60000, gcTime: 15 * 60000, refetchOnWindowFocus: false, retry: 1 });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => base44.entities.Event.list('-date', 5000), staleTime: 10 * 60000, gcTime: 15 * 60000, refetchOnWindowFocus: false, retry: 1 });
  const attendances = useAIAttendances();

  if (!canAccessRicercaAI()) {
    return (
      <Div className="min-h-screen flex items-center justify-center p-4">
        <Div className="rounded-xl bg-card border border-border p-8 text-center space-y-4 max-w-md">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
          <H className="text-xl font-bold">Accesso Limitato</H>
          <P className="text-sm text-muted-foreground">Il tuo ruolo non ha accesso a questa sezione.</P>
        </Div>
      </Div>
    );
  }

  return <ChatStrategica promoters={promoters} events={events} attendances={attendances} onExit={() => navigate(-1)} />;
}