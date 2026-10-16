# Fluidità per percorso (admin)

Frame disegnati, frame persi (jank) e tempi per frame dal sistema (dumpsys gfxinfo).
Emulatore senza GPU: i valori assoluti sono peggiori di un telefono vero, contano i confronti tra run.

| percorso | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | draw lento |
|---|---|---|---|---|---|---|---|---|---|
| 01-dashboard | 135 | 135 | 100.00% | 450ms | 1150ms | 1200ms | 1300ms | 86 | 135 |
| 02-navbar | 105 | 105 | 100.00% | 200ms | 850ms | 1050ms | 1800ms | 59 | 105 |
| 03-pagine-nuove | 231 | 231 | 100.00% | 300ms | 750ms | 850ms | 1350ms | 139 | 231 |
| 04-serate-scroll | 188 | 188 | 100.00% | 250ms | 700ms | 900ms | 1400ms | 98 | 188 |
| 05-vibragpt-tastiera | 97 | 97 | 100.00% | 150ms | 850ms | 950ms | 1900ms | 44 | 97 |
