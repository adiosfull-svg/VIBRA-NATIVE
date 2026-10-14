// Gara (docs/PIANO-PRESTAZIONI.md): nelle build della gara metro.config.js lo esegue per primo, prima
// dell'app; il segno nel logcat separa l'avvio nativo (processo + bundle) dal lavoro del JS.
// Importato da lib/testDiag solo perché Metro lo includa nel bundle (fuori dalla gara non fa nulla).
if (process.env.EXPO_PUBLIC_TEST_GARA === '1' && !globalThis.__garaStartMarked) {
  globalThis.__garaStartMarked = true;
  console.log(`VIBRA gara js-inizio fine=${Date.now()}`);
}
