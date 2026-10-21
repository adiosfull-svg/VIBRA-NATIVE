# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 8803 ms da app chiusa (di cui 2743 ms prima della prima riga di JS) · originale 3942 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 1054 | 5188 | ✅ | 242 | 2407 | ✅ | 80.9% | –% |
| /clienti | 130 | 1564 | ✅ | 123 | 1338 | ✅ | 86.8% | 93.3% |
| /semine | 385 | 314 | ❌ | 75 | 2604 | ✅ | 79.3% | 93.3% |
| /notifiche | 1046 | 1560 | ✅ | 353 | 1193 | ✅ | –% | –% |
| /formazione | 297 | 417 | ✅ | 727 | 370 | ❌ | 85.3% | –% |
| /download | 499 | 370 | ❌ | 1845 | 1014 | ❌ | 77.6% | –% |
| /vibra-gpt | 202 | 1152 | ✅ | 654 | 514 | ❌ | 87.9% | 93.3% |
| /ricerca-ai | 247 | 1043 | ✅ | 441 | 374 | ❌ | 88.3% | –% |
| /messaggi | 1030 | 670 | ❌ | 511 | 594 | ✅ | –% | –% |
| /clienti-analytics | 1346 | 1097 | ❌ | 1982 | 2300 | ✅ | 90.4% | –% |
| /academy | 425 | 3269 | ✅ | 591 | 880 | ✅ | 83.9% | –% |
| /il-mio-vibra | 496 | 2271 | ✅ | 183 | 1275 | ✅ | 81.3% | –% |

Memoria (PSS): nativa 533 MB · originale (Chrome) 527 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 71 | 176,57,71 |
| view-classi | 88 | 88,86,89 |
| div | 120 | 120,120,120 |
| div-senza-classi | 84 | 84,84,84 |
| pressable-puro | 105 | 103,107,105 |
| pressable-classi | 137 | 156,137,137 |
| btn-vuoto | 186 | 186,187,169 |
| text-puro | 93 | 93,59,108 |
| text | 122 | 90,124,122 |
| span | 126 | 124,126,145 |
| btn | 240 | 239,240,264 |
| riga | 774 | 774,779,690 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    45648                          79504
         Native Heap:   296688                         299848
                Code:    47444                         172472
               Stack:     2056                           2064
            Graphics:        0                              0
       Private Other:   136644
              System:    16918
             Unknown:                                  142460
 
           TOTAL PSS:   545398            TOTAL RSS:   696348      TOTAL SWAP (KB):        0
```
