# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 7647 ms da app chiusa (di cui 2884 ms prima della prima riga di JS) · originale 4814 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 62 | 1473 | ✅ | 106 | 647 | ✅ | 78.4% | –% |
| /clienti | 36 | 447 | ✅ | 88 | 1467 | ✅ | 83.6% | –% |
| /semine | 124 | 1464 | ✅ | 36 | 1458 | ✅ | 86% | –% |
| /notifiche | 149 | 76 | ❌ | 71 | 506 | ✅ | 86.1% | –% |
| /formazione | 1292 | 320 | ❌ | 816 | 627 | ❌ | 89.6% | –% |
| /download | 426 | 754 | ✅ | 791 | 537 | ❌ | 73.5% | –% |
| /vibra-gpt | 284 | 747 | ✅ | 1245 | 280 | ❌ | 85.8% | –% |
| /ricerca-ai | 289 | 510 | ✅ | 213 | 217 | ✅ | 84.9% | –% |
| /messaggi | 813 | 833 | ✅ | 259 | 184 | ❌ | –% | –% |
| /clienti-analytics | 1065 | 523 | ❌ | 1210 | 1241 | ✅ | 88.9% | –% |
| /academy | 716 | 2553 | ✅ | 555 | 1220 | ✅ | 86.4% | –% |
| /il-mio-vibra | 86 | 1767 | ✅ | 49 | 1204 | ✅ | 85.4% | –% |

Memoria (PSS): nativa 538 MB · originale (Chrome) 440 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 38 | 38,38,41 |
| view-classi | 53 | 53,50,54 |
| div | 71 | 67,75,71 |
| div-senza-classi | 50 | 50,50,50 |
| pressable-puro | 56 | 87,55,56 |
| pressable-classi | 102 | 102,86,102 |
| btn-vuoto | 102 | 102,86,103 |
| text-puro | 54 | 51,56,54 |
| text | 80 | 80,96,72 |
| span | 95 | 96,82,95 |
| btn | 154 | 154,151,190 |
| riga | 448 | 440,448,458 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    55964                          89804
         Native Heap:   275028                         278236
                Code:    24284                         148616
               Stack:     1980                           1984
            Graphics:        0                              0
       Private Other:   176520
              System:    16885
             Unknown:                                  182380
 
           TOTAL PSS:   550661            TOTAL RSS:   701020      TOTAL SWAP (KB):        0
```
