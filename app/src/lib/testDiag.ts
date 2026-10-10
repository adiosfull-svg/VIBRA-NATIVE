// Diagnostica delle build di test sull'emulatore (EXPO_PUBLIC_TEST_DIAG=1, workflow "Emulatore"):
// nel logcat (tag ReactNativeJS) un battito ogni 2 s col numero di render di Div/Btn/Text nel
// frattempo. Se il battito si ferma il JS è bloccato; se i render non scendono a zero a pagina
// ferma c'è un ciclo di aggiornamenti. Spenta (nessun costo) nelle build normali.
export const TEST_DIAG = process.env.EXPO_PUBLIC_TEST_DIAG === '1';

export const diagCounts: Record<string, number> = {};
/** EXPO_PUBLIC_TEST_TRACE=1: una riga nel logcat per ogni elemento disegnato (trovare un blocco). */
const TEST_TRACE = process.env.EXPO_PUBLIC_TEST_TRACE === '1';
let traceN = 0;
export function diagCount(name: string, detail?: string) {
  if (!TEST_DIAG) return;
  diagCounts[name] = (diagCounts[name] ?? 0) + 1;
  if (TEST_TRACE) console.log(`VIBRA trace ${++traceN} ${name} ${(detail ?? '').slice(0, 80)}`);
}
/** Traccia di un punto preciso del codice (solo con EXPO_PUBLIC_TEST_TRACE=1). */
export function diagTrace(label: string) {
  if (TEST_DIAG && TEST_TRACE) console.log(`VIBRA trace ${++traceN} ${label}`);
}

if (TEST_DIAG) {
  let last = Date.now();
  setInterval(() => {
    const now = Date.now();
    const parts = Object.entries(diagCounts).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(' ');
    // ritardo del timer: quanto il thread JS è rimasto occupato
    console.log(`VIBRA diag battito ritardo=${now - last - 2000}ms ${parts}`);
    for (const k of Object.keys(diagCounts)) diagCounts[k] = 0;
    last = now;
  }, 2000);
}

/**
 * Radiografia del layout (solo diagnostica): albero degli elementi nativi sotto `root` con
 * posizione/dimensioni (getBoundingClientRect delle API DOM di Fabric) e l'inizio del testo.
 * Scende fino a `maxDepth` livelli e salta i rami piccoli e senza testo, per restare leggibile.
 */
export function dumpLayout(label: string, root: unknown, maxDepth = 14) {
  if (!TEST_DIAG || !root) return;
  const lines: string[] = [];
  const visit = (node: any, depth: number) => {
    if (!node || depth > maxDepth || lines.length > 400) return;
    let r: { x: number; y: number; width: number; height: number } | null = null;
    try { r = node.getBoundingClientRect?.() ?? null; } catch { r = null; }
    const text = String(node.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 50);
    if (r) lines.push(`${'  '.repeat(depth)}[${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}] ${node.nodeName ?? ''} "${text}"`);
    const kids = Array.from((node.children ?? []) as ArrayLike<any>);
    // rami con un solo figlio: non conta come livello (wrapper)
    for (const k of kids) visit(k, kids.length === 1 ? depth : depth + 1);
  };
  visit(root, 0);
  // il logcat tronca le righe lunghe: un messaggio per gruppo di righe
  for (let i = 0; i < lines.length; i += 20) console.log(`VIBRA layout ${label} ${i / 20}\n${lines.slice(i, i + 20).join('\n')}`);
}
