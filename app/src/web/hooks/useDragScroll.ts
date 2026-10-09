// Equivalente nativo di src/hooks/useDragScroll.js: il trascinamento col mouse delle liste
// orizzontali non serve (ScrollView orizzontale scorre col dito).
import { useRef } from 'react';

export function useDragScroll() {
  const ref = useRef(null);
  return { ref, handlers: {}, moved: () => false };
}
