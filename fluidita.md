# Fluidità per percorso (admin)

Frame disegnati, frame persi (jank) e tempi per frame dal sistema (dumpsys gfxinfo).
Emulatore senza GPU: i valori assoluti sono peggiori di un telefono vero, contano i confronti tra run.

| percorso | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | draw lento |
|---|---|---|---|---|---|---|---|---|---|
| 01-dashboard | 116 | 116 | 100.00% | 450ms | 1000ms | 1200ms | 1500ms | 71 | 116 |
| 02-navbar | 104 | 104 | 100.00% | 250ms | 900ms | 1200ms | 1800ms | 64 | 104 |
| 03-pagine-nuove | 216 | 216 | 100.00% | 300ms | 750ms | 900ms | 1250ms | 138 | 216 |
| 04-serate-scroll | 182 | 181 | 99.45% | 250ms | 700ms | 800ms | 1250ms | 99 | 181 |
| 05-vibragpt-tastiera | 103 | 102 | 99.03% | 150ms | 750ms | 1200ms | 1450ms | 48 | 102 |
