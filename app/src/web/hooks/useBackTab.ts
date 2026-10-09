// Equivalente nativo di src/hooks/useBackTab.jsx: il tasto Indietro torna al tab precedente
// invece di uscire dalla pagina (sul web usava la cronologia del browser).
import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';

export function useBackTab<T extends string>(tab: T, setTab: (t: T) => void, defaultTab: T, enabled = true) {
  const history = useRef<T[]>([]);
  const prev = useRef(tab);
  const restoring = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (restoring.current) { restoring.current = false; prev.current = tab; return; }
    if (prev.current !== tab) history.current.push(prev.current);
    prev.current = tab;
  }, [tab, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const last = history.current.pop();
      if (last === undefined) {
        if (prev.current !== defaultTab) { restoring.current = true; setTab(defaultTab); return true; }
        return false;
      }
      restoring.current = true;
      setTab(last);
      return true;
    });
    return () => sub.remove();
  }, [enabled, setTab, defaultTab]);
}
