// Equivalente nativo di src/lib/tapHandlers.js: sul web distingueva tap e scroll sui touch;
// in RN lo fa già Pressable, quindi resta solo l'azione.
export function makeTapHandlers(_lastTouchRef: unknown, fn: () => void) {
  return { onClick: fn };
}
