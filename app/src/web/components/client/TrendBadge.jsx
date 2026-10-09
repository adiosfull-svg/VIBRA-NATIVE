// Port di src/components/client/TrendBadge.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from '@/ui/icons.generated';

/**
 * Piccolo badge inline che mostra il trend presenze.
 * trend: 'up' | 'stable' | 'down' | null
 */
export default function TrendBadge({ trend }) {
  if (!trend) return null;

  const config = {
    up:     { Icon: TrendingUp,   classes: 'text-emerald-400' },
    stable: { Icon: Minus,        classes: 'text-slate-400'   },
    down:   { Icon: TrendingDown, classes: 'text-red-400'     },
  };

  const { Icon, classes } = config[trend];

  return (
    <Icon className={`w-3 h-3 shrink-0 ${classes}`} />
  );
}