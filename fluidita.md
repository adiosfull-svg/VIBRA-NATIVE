# Fluidità per percorso (pr)

Frame disegnati, frame persi (jank) e tempi per frame dal sistema (dumpsys gfxinfo).
Emulatore senza GPU: i valori assoluti sono peggiori di un telefono vero, contano i confronti tra run.

| percorso | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | draw lento |
|---|---|---|---|---|---|---|---|---|---|
| 01-il-mio-vibra | 129 | 129 | 100.00% | 400ms | 1050ms | 1200ms | 1850ms | 88 | 129 |
| 02-clienti | 181 | 181 | 100.00% | 300ms | 650ms | 700ms | 900ms | 124 | 181 |
| 03-weekend | 135 | 135 | 100.00% | 250ms | 750ms | 800ms | 1000ms | 84 | 135 |
| 04-dettaglio | 81 | 79 | 97.53% | 200ms | 700ms | 800ms | 950ms | 55 | 79 |
| 05-tab-ritorno | 119 | 119 | 100.00% | 250ms | 650ms | 750ms | 900ms | 72 | 119 |
| 06-semine | 102 | 102 | 100.00% | 250ms | 700ms | 900ms | 1000ms | 69 | 102 |
| 07-menu-laterali | 126 | 126 | 100.00% | 150ms | 600ms | 700ms | 850ms | 79 | 126 |
