// Equivalente nativo di src/lib/overlayStackContext.jsx: sul web ogni overlay aperto aggiunge una
// voce alla cronologia e il "back" del browser lo chiude. Qui il tasto Indietro di Android chiude
// l'overlay più in alto (stessa API: useOverlay(isOpen, onClose)).
import { useEffect, useRef, type ReactNode } from 'react';
import { BackHandler } from 'react-native';

const stack: { id: number; close: () => void }[] = [];
let nextId = 1;
let subscribed = false;

function ensureListener() {
  if (subscribed) return;
  subscribed = true;
  BackHandler.addEventListener('hardwareBackPress', () => {
    const top = stack[stack.length - 1];
    if (!top) return false;
    top.close();
    return true;
  });
}

export function OverlayStackProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useOverlayStack() {
  return {
    push(close: () => void) { ensureListener(); const id = nextId++; stack.push({ id, close }); return id; },
    remove(id: number) { const i = stack.findIndex((o) => o.id === id); if (i >= 0) stack.splice(i, 1); },
    size: () => stack.length,
  };
}

export function useOverlay(isOpen: boolean, onClose: () => void, disabled = false) {
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!isOpen || disabled) return;
    ensureListener();
    const id = nextId++;
    stack.push({ id, close: () => onCloseRef.current() });
    return () => {
      const i = stack.findIndex((o) => o.id === id);
      if (i >= 0) stack.splice(i, 1);
    };
  }, [isOpen, disabled]);
}
