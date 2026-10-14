// Port di src/components/academy/mockups/shared.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { useIsMobile } from '@/web/hooks/use-mobile';

import { Div, Span } from '@/ui/html';

// Callout badge — cerchio numerato sovrapposto alle zone del mockup
export function Callout({ n, className = '', style = {} }) {
  return (
    <Span
      className={"absolute flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold ring-2 ring-background shadow-md z-30 " + className}
      style={style}
    >
      {n}
    </Span>
  );
}

// Cornice browser/telefono — mobile (default) o desktop (con sidebar finta)
export function Frame({ children, url = 'vibra.app', tall = false, extra = '', desktop = false }) {
  const minH = desktop ? (tall ? 'min-h-[440px]' : 'min-h-[300px]') : (tall ? 'min-h-[340px]' : 'min-h-[200px]');
  const maxW = desktop ? 'max-w-2xl' : 'max-w-sm';
  const browserBar = (
    <Div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border bg-secondary/40">
      <Div className="w-2 h-2 rounded-full bg-red-400/50" />
      <Div className="w-2 h-2 rounded-full bg-yellow-400/50" />
      <Div className="w-2 h-2 rounded-full bg-green-400/50" />
      <Div className="flex-1 mx-2 px-2 py-0.5 rounded bg-background/50 text-[9px] text-muted-foreground truncate text-center">{url}</Div>
    </Div>
  );
  if (desktop) {
    return (
      <Div className={`rounded-2xl border border-border bg-card overflow-hidden shadow-lg mx-auto ${maxW}`}>
        {browserBar}
        <Div className={`relative isolate bg-background flex ${minH} ${extra}`}>
          {/* Faux sidebar */}
          <Div className="w-10 shrink-0 border-r border-border bg-secondary/20 p-1 flex flex-col items-center gap-1.5">
            <Div className="w-5 h-5 rounded-lg bg-primary/25" />
            <Div className="w-5 h-5 rounded-md bg-card border border-border" />
            <Div className="w-5 h-5 rounded-md bg-secondary/50" />
            <Div className="w-5 h-5 rounded-md bg-secondary/50" />
            <Div className="w-5 h-5 rounded-md bg-secondary/50" />
            <Div className="w-5 h-5 rounded-md bg-secondary/50" />
            <Div className="mt-auto w-5 h-5 rounded-full bg-secondary/50" />
          </Div>
          {/* Content */}
          <Div className="flex-1 p-2.5 min-w-0 overflow-hidden">{children}</Div>
        </Div>
      </Div>
    );
  }
  return (
    <Div className={`rounded-2xl border border-border bg-card overflow-hidden shadow-lg mx-auto ${maxW}`}>
      {browserBar}
      <Div className={`relative isolate bg-background p-3 ${minH} ${extra}`}>{children}</Div>
    </Div>
  );
}

// DualFrame: riconosce automaticamente il viewport (mobile o desktop)
// e mostra solo la versione corrispondente.
export function DualFrame({ url, mobile, desktop, tall = true }) {
  const isMobile = useIsMobile();
  return isMobile ? mobile : desktop;
}

// Avatar tondo con iniziali
export function Avatar({ initials, grad = 'from-purple-400/60 to-purple-400/20', size = 'w-7 h-7', text = 'text-[8px]' }) {
  return (<Div className={"rounded-full bg-gradient-to-br " + grad + " shrink-0 flex items-center justify-center font-bold " + size + " " + text}> {initials}</Div>);
}

// Mini barra sticky tabs
export function MiniTabBar({ tabs, active }) {
  return (
    <Div className="flex gap-0.5 bg-secondary/30 p-0.5 rounded-lg mb-2 overflow-x-auto no-scrollbar">
      {tabs.map(t => (
        <Div key={t.key} className={"flex items-center justify-center gap-0.5 py-1 px-1.5 rounded-md shrink-0 " + (t.key === active ? "bg-card text-[8px] font-semibold" : "text-muted-foreground text-[8px]")}>
          {t.icon}{t.label}
        </Div>
      ))}
    </Div>
  );
}