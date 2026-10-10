// Port di src/components/shared/PullToRefreshIndicator.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { RefreshCw } from '@/ui/icons.generated';

import { Div } from '@/ui/html';

export default function PullToRefreshIndicator({ isRefreshing, pullProgress }) {
  const visible = isRefreshing || pullProgress > 0.05;
  if (!visible) return null;

  const size = isRefreshing ? 1 : pullProgress;
  const rotation = pullProgress * 360;

  return (
    <Div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ paddingTop: `calc(env(safe-area-inset-top) + 0.5rem)` }}
    >
      <Div
        className="flex items-center justify-center rounded-full bg-card border border-border shadow-lg"
        style={{
          width: 36,
          height: 36,
          transform: `scale(${size})`,
          opacity: size,
          transition: isRefreshing ? 'none' : 'transform 0.1s, opacity 0.1s',
        }}
      >
        <RefreshCw
          className={`w-4 h-4 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
          style={!isRefreshing ? { transform: `rotate(${rotation}deg)` } : {}}
        />
      </Div>
    </Div>
  );
}