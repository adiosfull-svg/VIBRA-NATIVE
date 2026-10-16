# Fluidità per percorso (pr)

Frame disegnati, frame persi (jank) e tempi per frame dal sistema (dumpsys gfxinfo).
Emulatore senza GPU: i valori assoluti sono peggiori di un telefono vero, contano i confronti tra run.

| percorso | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | draw lento |
|---|---|---|---|---|---|---|---|---|---|
| 01-il-mio-vibra | 126 | 126 | 100.00% | 900ms | 2200ms | 2500ms | 2800ms | 94 | 126 |
| 02-clienti | 182 | 182 | 100.00% | 600ms | 1350ms | 1400ms | 1900ms | 112 | 182 |
| 03-weekend | 118 | 118 | 100.00% | 600ms | 1550ms | 1700ms | 1800ms | 84 | 118 |
| 04-dettaglio | 72 | 72 | 100.00% | 500ms | 1200ms | 1450ms | 2450ms | 56 | 72 |
| 05-tab-ritorno | 98 | 98 | 100.00% | 550ms | 1200ms | 1450ms | 2250ms | 63 | 98 |
| 06-semine | 90 | 90 | 100.00% | 600ms | 1500ms | 1650ms | 1850ms | 61 | 90 |
| 07-menu-laterali | 97 | 97 | 100.00% | 400ms | 1200ms | 1600ms | 2100ms | 65 | 97 |
