# Fluidità per percorso (pr)

Frame disegnati, frame persi (jank) e tempi per frame dal sistema (dumpsys gfxinfo).
Emulatore senza GPU: i valori assoluti sono peggiori di un telefono vero, contano i confronti tra run.

| percorso | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | draw lento |
|---|---|---|---|---|---|---|---|---|---|
| 17-app-nativa | 190 | 189 | 99.47% | 350ms | 950ms | 1100ms | 1500ms | 115 | 189 |
