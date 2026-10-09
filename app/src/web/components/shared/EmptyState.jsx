// Port di src/components/shared/EmptyState.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Button } from '@/ui/button';
import { Plus } from '@/ui/icons.generated';

import { Div, H, P } from '@/ui/html';

export default function EmptyState({ icon: Icon, title, description, onAction, actionLabel }) {
  return (
    <Div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <Div className="p-4 rounded-full bg-primary/10 mb-4">
          <Icon className="w-8 h-8 text-primary" />
        </Div>
      )}
      <H className="text-lg font-semibold">{title}</H>
      <P className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</P>
      {onAction && (
        <Button onClick={onAction} className="mt-4">
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </Div>
  );
}