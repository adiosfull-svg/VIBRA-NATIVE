# Fluidità per percorso (admin)

Frame disegnati, frame persi (jank) e tempi per frame dal sistema (dumpsys gfxinfo).
Emulatore senza GPU: i valori assoluti sono peggiori di un telefono vero, contano i confronti tra run.

| percorso | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | draw lento |
|---|---|---|---|---|---|---|---|---|---|
| 17-app-nativa | 35 | 35 | 100.00% | 600ms | 1250ms | 1550ms | 1700ms | 31 | 35 |
