// Diagnostica delle build di test sull'emulatore (EXPO_PUBLIC_TEST_DIAG=1, workflow "Emulatore"):
// nel logcat (tag ReactNativeJS) un battito ogni 2 s col numero di render di Div/Btn/Text nel
// frattempo. Se il battito si ferma il JS è bloccato; se i render non scendono a zero a pagina
// ferma c'è un ciclo di aggiornamenti. Spenta (nessun costo) nelle build normali.
export const TEST_DIAG = process.env.EXPO_PUBLIC_TEST_DIAG === '1';

export const diagCounts: Record<string, number> = {};
export function diagCount(name: string) {
  if (TEST_DIAG) diagCounts[name] = (diagCounts[name] ?? 0) + 1;
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
