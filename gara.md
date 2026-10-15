# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 8453 ms da app chiusa (di cui 4156 ms prima della prima riga di JS) · originale 3708 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 171 | 4734 | ✅ | 211 | 942 | ✅ | 84.3% | –% |
| /clienti | 314 | 816 | ✅ | 96 | 2209 | ✅ | 80.8% | –% |
| /semine | 152 | 2612 | ✅ | 72 | 1390 | ✅ | –% | –% |
| /notifiche | 69 | 178 | ✅ | 74 | 840 | ✅ | 83.7% | –% |
| /formazione | 415 | 545 | ✅ | 2202 | 85 | ❌ | –% | –% |
| /download | 567 | 1076 | ✅ | 424 | 817 | ✅ | 86% | –% |
| /vibra-gpt | 1960 | 858 | ❌ | 524 | 793 | ✅ | 87.6% | –% |
| /ricerca-ai | 478 | 337 | ❌ | 716 | 714 | ❌ | 87% | –% |
| /messaggi | 902 | 574 | ❌ | 534 | 868 | ✅ | –% | –% |
| /clienti-analytics | 2776 | 2159 | ❌ | 3662 | 2409 | ❌ | 90.1% | –% |
| /academy | 1322 | 2536 | ✅ | 823 | 2158 | ✅ | 78.8% | –% |
| /il-mio-vibra | 209 | 1495 | ✅ | 205 | 1025 | ✅ | 76.9% | –% |

Memoria (PSS): nativa 470 MB · originale (Chrome) 433 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 57 | 188,57,55 |
| view-classi | 88 | 87,88,89 |
| div | 121 | 123,121,120 |
| div-senza-classi | 83 | 83,84,83 |
| pressable-puro | 90 | 87,90,105 |
| pressable-classi | 154 | 259,137,154 |
| btn-vuoto | 138 | 137,138,153 |
| text-puro | 94 | 76,95,94 |
| text | 105 | 105,105,123 |
| span | 136 | 136,106,136 |
| btn | 240 | 240,204,252 |
| riga | 708 | 711,671,708 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    42924                          76764
         Native Heap:   233560                         236772
                Code:    23988                         148500
               Stack:     1920                           1928
            Graphics:        0                              0
       Private Other:   162144
              System:    16806
             Unknown:                                  167964
 
           TOTAL PSS:   481342            TOTAL RSS:   631928      TOTAL SWAP (KB):        0
```
