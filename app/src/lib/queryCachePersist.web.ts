// Sul web (solo confronti con l'originale) la cache non si salva: ogni confronto parte dalla rete.
import type { QueryClient } from '@tanstack/react-query';

export async function restoreCache(_queryClient: QueryClient): Promise<boolean> { return false; }
export function persistCache(_queryClient: QueryClient): () => void { return () => {}; }
export function clearPersistedCache() {}
