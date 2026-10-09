// Equivalente nativo di src/hooks/useStickySentinel.jsx: sul web restituiva un callback ref per
// un "sentinella" DOM e lo stato "incollato" della barra sticky. In RN lo stato resta false
// (le barre sticky le gestisce lo ScrollView) e il ref è una funzione no-op.
const noopRef = (_node: unknown) => {};

export function useStickySentinel(): [(node: unknown) => void, boolean] {
  return [noopRef, false];
}
