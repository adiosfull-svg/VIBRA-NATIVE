// Port di src/components/RoleGate.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { useRoleAccess } from '@/lib/useRoleAccess';
import { Lock } from '@/ui/icons.generated';

import { Div, H, P } from '@/ui/html';

export default function RoleGate({ routeName, children }) {
  const { canAccessRoute } = useRoleAccess();

  if (!canAccessRoute(routeName)) {
    return (
      <Div className="min-h-screen flex items-center justify-center p-4">
        <Div className="rounded-xl bg-card border border-border p-8 text-center space-y-4 max-w-md">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
          <H className="text-xl font-bold">Accesso Limitato</H>
          <P className="text-sm text-muted-foreground">
            Il tuo ruolo non è sufficiente per consultare questi dati.
          </P>
        </Div>
      </Div>
    );
  }

  return children;
}