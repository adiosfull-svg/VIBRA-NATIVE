// Equivalente nativo di src/lib/scrollGuard.js: Pressable ignora già i tap durante lo scroll.
export function wasRecentScroll(_ms = 300) {
  return false;
}
