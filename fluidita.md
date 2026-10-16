# Fluidità per percorso (pr)

Frame disegnati, frame persi (jank) e tempi per frame dal sistema (dumpsys gfxinfo).
Emulatore senza GPU: i valori assoluti sono peggiori di un telefono vero, contano i confronti tra run.

| percorso | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | draw lento |
|---|---|---|---|---|---|---|---|---|---|
| 01-il-mio-vibra | 137 | 137 | 100.00% | 700ms | 1750ms | 2200ms | 2350ms | 92 | 137 |
| 02-clienti | 160 | 160 | 100.00% | 500ms | 1050ms | 1100ms | 1400ms | 109 | 160 |
| 03-weekend | 113 | 112 | 99.12% | 550ms | 1250ms | 1350ms | 1450ms | 76 | 112 |
| 04-dettaglio | 75 | 75 | 100.00% | 450ms | 1050ms | 1250ms | 1850ms | 51 | 75 |
| 05-tab-ritorno | 104 | 104 | 100.00% | 350ms | 1050ms | 1100ms | 1300ms | 61 | 104 |
| 06-semine | 93 | 92 | 98.92% | 500ms | 1200ms | 1500ms | 2150ms | 63 | 92 |
| 07-menu-laterali | 105 | 105 | 100.00% | 250ms | 900ms | 1150ms | 1550ms | 64 | 105 |
