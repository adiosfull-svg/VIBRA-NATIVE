# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 8841 ms da app chiusa (di cui 2137 ms prima della prima riga di JS) · originale 5404 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 4518 | 1043 | ❌ | 722 | 410 | ❌ | 90% | –% |
| /clienti | 1462 | 1034 | ❌ | 1401 | 807 | ❌ | 78.1% | –% |
| /promoter | 2701 | 736 | ❌ | 282 | 1583 | ✅ | 87.4% | –% |
| /promoter/prom000000000000000001 | 1471 | 2470 | ✅ | 1224 | 888 | ❌ | 86.6% | –% |
| /locali | 834 | 1707 | ✅ | 532 | 527 | ❌ | 88.1% | –% |
| /report | 338 | 463 | ✅ | 318 | 461 | ✅ | 90.8% | –% |
| /messaggi | 598 | 1458 | ✅ | 338 | 451 | ✅ | –% | –% |
| /importa-serata | 294 | 859 | ✅ | 298 | 664 | ✅ | 90.3% | –% |
| /impostazioni-app | 430 | 490 | ✅ | 396 | 82 | ❌ | 90.3% | –% |
| /admin-console | 746 | 595 | ❌ | 367 | 688 | ✅ | 91.6% | –% |
| /clienti-analytics | 1417 | 920 | ❌ | 1317 | 729 | ❌ | 90.7% | –% |
| /academy | 1076 | 1064 | ❌ | 1169 | 1836 | ✅ | 83.3% | –% |
| /notifiche | 224 | 733 | ✅ | 178 | 553 | ✅ | 91.2% | –% |
| /dashboard | 751 | 1307 | ✅ | 1242 | 789 | ❌ | 89.9% | –% |

Memoria (PSS): nativa 625 MB · originale (Chrome) 358 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 69 | 57,69,70 |
| view-classi | 87 | 104,86,87 |
| div | 104 | 104,104,102 |
| div-senza-classi | 83 | 83,84,67 |
| pressable-puro | 103 | 103,87,103 |
| pressable-classi | 136 | 136,169,120 |
| btn-vuoto | 136 | 187,135,136 |
| text-puro | 85 | 72,85,85 |
| text | 121 | 133,121,121 |
| span | 119 | 105,119,135 |
| btn | 224 | 318,202,224 |
| riga | 638 | 587,640,638 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    70096                         104016
         Native Heap:   278824                         282044
                Code:    46412                         169460
               Stack:     1496                           1504
            Graphics:        0                              0
       Private Other:   226668
              System:    16499
             Unknown:                                  232444
 
           TOTAL PSS:   639995            TOTAL RSS:   789468      TOTAL SWAP (KB):        0
```
