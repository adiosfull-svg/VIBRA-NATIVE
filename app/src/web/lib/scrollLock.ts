// Equivalente nativo di src/lib/scrollLock.js: i Modal nativi bloccano già lo scroll sotto.
export function lockScroll() {
  return () => {};
}
