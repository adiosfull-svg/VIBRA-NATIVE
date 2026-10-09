// Port di src/components/shared/ScrollToTopButton.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import { ArrowUp } from '@/ui/icons.generated';
import { useBulkSelection } from '@/web/lib/bulkSelectionContext';

import { Btn } from '@/ui/html';

import { doc as webDocument, win as webWindow } from '@/web/shims/dom';

/**
 * Pulsante flottante "Torna su" — appare dopo aver scrollato oltre `threshold`px.
 * Funziona sia su mobile (bottom-20 per non coprire la nav bar) che desktop.
 */
export default function ScrollToTopButton({ threshold = 500 }) {
  const [visible, setVisible] = useState(false);
  const bulk = useBulkSelection();
  const bulkActive = !!(bulk?.selectedIds?.size > 0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVisible(webWindow.scrollY > threshold));
    };
    webWindow.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      webWindow.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  if (!visible) return null;

  // Portal a document.body: il rubber-band scroll su Android applica un transform
  // a .main-content, che rompe position:fixed sui discendenti (il pulsante si
  // deforma/salta insieme al contenuto). Renderizzato fuori da .main-content
  // resta veramente fixed rispetto al viewport.
  return createPortal(
    <Btn
      button
      onClick={() => webWindow.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed right-4 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 hover:bg-primary/90 transition-all duration-200 ${bulkActive ? 'bottom-40 z-50' : 'bottom-[calc(env(safe-area-inset-bottom)+5rem)] z-40'} sm:bottom-6 sm:right-6 sm:z-30`}
      accessibilityLabel="Torna su">
      <ArrowUp className="w-5 h-5" />
    </Btn>,
    webDocument.body
  );
}