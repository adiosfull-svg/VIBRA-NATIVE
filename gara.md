# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 8585 ms da app chiusa (di cui 3336 ms prima della prima riga di JS) · originale 5070 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 1478 | 3419 | ✅ | 67 | 883 | ✅ | 90.8% | –% |
| /clienti | 2579 | 410 | ❌ | 68 | 1552 | ✅ | 78.4% | –% |
| /semine | 288 | 2322 | ✅ | 99 | 1083 | ✅ | –% | –% |
| /notifiche | 53 | 213 | ✅ | 38 | 919 | ✅ | –% | –% |
| /formazione | 264 | 558 | ✅ | 661 | 239 | ❌ | 78.9% | –% |
| /download | 982 | 318 | ❌ | 580 | 489 | ❌ | 86.4% | –% |
| /vibra-gpt | 780 | 974 | ✅ | 369 | 670 | ✅ | 87.5% | –% |
| /ricerca-ai | 495 | 192 | ❌ | 344 | 357 | ✅ | 88% | –% |
| /messaggi | 1028 | 919 | ❌ | 410 | 892 | ✅ | –% | –% |
| /clienti-analytics | 3540 | 1503 | ❌ | 1290 | 1949 | ✅ | 87.2% | –% |
| /academy | 1882 | 1770 | ❌ | 674 | 1059 | ✅ | 85.7% | –% |
| /il-mio-vibra | 910 | 822 | ❌ | 689 | 729 | ✅ | 81.8% | –% |

Memoria (PSS): nativa 552 MB · originale (Chrome) 393 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 58 | 68,58,50 |
| view-classi | 87 | 87,87,103 |
| div | 120 | 105,120,130 |
| div-senza-classi | 67 | 83,67,67 |
| pressable-puro | 89 | 87,89,111 |
| pressable-classi | 138 | 203,121,138 |
| btn-vuoto | 138 | 136,139,138 |
| text-puro | 84 | 84,91,81 |
| text | 121 | 107,121,123 |
| span | 123 | 123,101,123 |
| btn | 204 | 221,202,204 |
| riga | 734 | 741,674,734 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    52696                          86536
         Native Heap:   274124                         277336
                Code:    24704                         149436
               Stack:     1976                           1980
            Graphics:        0                              0
       Private Other:   194776
              System:    16834
             Unknown:                                  200644
 
           TOTAL PSS:   565110            TOTAL RSS:   715932      TOTAL SWAP (KB):        0
```
