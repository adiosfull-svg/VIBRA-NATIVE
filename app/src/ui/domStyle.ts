// `elemento.style.xxx = ...` del DOM sugli elementi nativi (ref di Div/campi di testo). Il codice
// portato lo usa in ~40 punti (altezza automatica dei textarea, transform dell'albero, viewport della
// tastiera...): sul telefono l'istanza nativa non ha `style` e l'app cadeva ("Cannot set property
// 'height' of undefined"). Qui `style` è un oggetto che traduce le scritte in setNativeProps quando la
// proprietà ha un equivalente RN, e altrimenti le ricorda soltanto (lettura come nel DOM).
import { useCallback } from 'react';
import { Platform } from 'react-native';
import { webStyle } from './webStyle';

type NativeNode = { setNativeProps?: (p: object) => void; style?: unknown };

const kebabToCamel = (k: string) => k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

function makeStyle(node: NativeNode): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  const apply = (key: string, value: unknown) => {
    if (value === '' || value == null || value === 'auto') return; // tornare al valore delle classi: non c'è in RN
    const { style } = webStyle({ [key]: value });
    if (Object.keys(style).length) {
      try { node.setNativeProps?.({ style }); } catch { /* proprietà non accettata dalla vista */ }
    }
  };
  return new Proxy(values, {
    set(target, prop, value) {
      if (typeof prop !== 'string') return true;
      const key = kebabToCamel(prop);
      target[key] = value;
      apply(key, value);
      return true;
    },
    get(target, prop) {
      if (prop === 'setProperty') return (k: string, v: unknown) => { const key = kebabToCamel(k); target[key] = v; apply(key, v); };
      if (prop === 'removeProperty') return (k: string) => { delete target[kebabToCamel(k)]; };
      if (prop === 'getPropertyValue') return (k: string) => String(target[kebabToCamel(k)] ?? '');
      return typeof prop === 'string' ? (target[prop] ?? '') : undefined;
    },
  });
}

/** Aggiunge `style` (alla DOM) all'istanza nativa, una volta. Sul web l'elemento è già un nodo DOM. */
export function withDomStyle<T>(node: T): T {
  if (Platform.OS === 'web' || !node || typeof node !== 'object') return node;
  const n = node as unknown as NativeNode;
  if (n.style === undefined) {
    try { Object.defineProperty(n, 'style', { value: makeStyle(n), configurable: true }); } catch { /* istanza non estendibile */ }
  }
  return node;
}

type AnyRef<T> = ((node: T | null) => void) | { current: T | null } | null | undefined;

/** ref che aggiunge `style` all'istanza e la passa al ref originale (stabile finché questo non cambia). */
export function useDomStyleRef<T>(outer: AnyRef<T>) {
  return useCallback((node: T | null) => {
    withDomStyle(node);
    if (typeof outer === 'function') outer(node);
    else if (outer) outer.current = node;
  }, [outer]);
}
