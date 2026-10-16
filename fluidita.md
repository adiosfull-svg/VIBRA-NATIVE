# Fluidità per percorso (admin)

Frame disegnati, frame persi (jank) e tempi per frame dal sistema (dumpsys gfxinfo).
Emulatore senza GPU: i valori assoluti sono peggiori di un telefono vero, contano i confronti tra run.

| percorso | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | draw lento |
|---|---|---|---|---|---|---|---|---|---|
| 01-dashboard | 141 | 140 | 99.29% | 350ms | 800ms | 900ms | 1250ms | 75 | 140 |
| 02-navbar | 100 | 100 | 100.00% | 200ms | 700ms | 900ms | 1550ms | 46 | 100 |
| 03-pagine-nuove | 231 | 231 | 100.00% | 250ms | 550ms | 750ms | 1000ms | 145 | 231 |
| 04-serate-scroll | 192 | 191 | 99.48% | 250ms | 550ms | 600ms | 900ms | 109 | 191 |
| 05-vibragpt-tastiera | 112 | 112 | 100.00% | 133ms | 600ms | 800ms | 1150ms | 54 | 112 |
