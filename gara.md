# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 6160 ms da app chiusa (di cui 1024 ms prima della prima riga di JS) · originale 2172 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 1396 | 439 | ❌ | 470 | 250 | ❌ | 89.7% | 90% |
| /clienti | 891 | 587 | ❌ | 917 | 404 | ❌ | 86.6% | 92.2% |
| /promoter | 3154 | 793 | ❌ | 985 | 436 | ❌ | 88.1% | –% |
| /promoter/prom000000000000000001 | 1770 | 3425 | ✅ | 806 | 605 | ❌ | 88.6% | –% |
| /locali | 702 | 967 | ✅ | 671 | 333 | ❌ | 87% | –% |
| /report | 201 | 518 | ✅ | 333 | 339 | ✅ | 86.8% | –% |
| /messaggi | 341 | 1159 | ✅ | 239 | 807 | ✅ | 86.1% | –% |
| /importa-serata | 177 | 427 | ✅ | 193 | 566 | ✅ | 86% | –% |
| /impostazioni-app | 363 | 568 | ✅ | 299 | 405 | ✅ | 84.8% | –% |
| /admin-console | 528 | 271 | ❌ | 255 | 508 | ✅ | 87.3% | –% |
| /clienti-analytics | 763 | 774 | ✅ | 895 | 823 | ❌ | 87.3% | –% |
| /academy | 680 | 437 | ❌ | 566 | 585 | ✅ | 84.3% | 89.6% |
| /notifiche | 87 | 370 | ✅ | 41 | 426 | ✅ | 89.6% | –% |
| /dashboard | 829 | 1302 | ✅ | 827 | 478 | ❌ | 88.9% | –% |

Memoria (PSS): nativa 540 MB · originale (Chrome) 370 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 37 | 37,36,37 |
| view-classi | 53 | 52,53,53 |
| div | 120 | 118,153,120 |
| div-senza-classi | 85 | 84,85,102 |
| pressable-puro | 51 | 51,51,55 |
| pressable-classi | 70 | 69,73,70 |
| btn-vuoto | 119 | 119,103,136 |
| text-puro | 47 | 45,47,52 |
| text | 109 | 117,102,109 |
| span | 134 | 119,143,134 |
| btn | 287 | 339,287,227 |
| riga | 818 | 875,758,818 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    44088                          77988
         Native Heap:   271660                         274908
                Code:    45868                         168872
               Stack:     1588                           1592
            Graphics:        0                              0
       Private Other:   173500
              System:    16452
             Unknown:                                  179556
 
           TOTAL PSS:   553156            TOTAL RSS:   702916      TOTAL SWAP (KB):        0
```
