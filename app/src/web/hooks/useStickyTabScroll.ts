// Equivalente nativo di src/hooks/useStickyTabScroll.jsx.
import { useRef } from 'react';

export function useStickyTabScroll(_stuck: boolean, _tabsRef: unknown) {
  const stickyTopRef = useRef(0);
  return { stickyTopRef, scrollToTab: () => {} };
}
