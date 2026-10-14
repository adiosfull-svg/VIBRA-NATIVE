// Port di src/pages/AdminConsole.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect } from 'react';
import PageTitle from '@/web/components/shared/PageTitle';
import CreditUsageDashboard from '@/web/components/admin/CreditUsageDashboard';
import AuditLogConsole from '@/web/components/admin/AuditLogConsole';
import { useStickySentinel } from '@/web/hooks/useStickySentinel';
import { stickyGlassStyle } from '@/legacy/utils/stickyGlass';
import { Zap, ScrollText } from '@/ui/icons.generated';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div } from '@/ui/html';

const TABS = [
  { key: 'crediti', label: 'Crediti AI', icon: Zap },
  { key: 'log', label: 'Log Attività', icon: ScrollText },
];

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState(() => webWindow.history.state?._tab || 'crediti');
  const [sentinelRef, stuck] = useStickySentinel();

  useEffect(() => {
    webWindow.history.replaceState({ ...webWindow.history.state, _tab: activeTab }, '');
  }, [activeTab]);

  return (
    <Div className="min-h-screen pb-24">
      <Div ref={sentinelRef} className="h-px" />
      <Div className="px-4">
        <PageTitle title="Console Admin" />
      </Div>

      {/* Sticky tab bar */}
      <Div className="sticky top-0 z-20 -mx-4 px-4 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-1.5">
        <Div
          className={`group sticky overflow-hidden ${stuck ? 'is-stuck' : ''}`}
          style={{ marginTop: 0 }}
        >
          <Div className="sticky-glass absolute inset-0" style={stickyGlassStyle(stuck)} />
          <Div className="relative flex items-center gap-1.5">
            {TABS.map(({ key, label, icon: Icon }) => (
              <Btn
                button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === key
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                }`}>
                <Icon className="w-4 h-4" />
                {label}
              </Btn>
            ))}
          </Div>
        </Div>
      </Div>

      <Div className="px-4 mt-3">
        {activeTab === 'crediti' ? <CreditUsageDashboard /> : <AuditLogConsole />}
      </Div>
    </Div>
  );
}