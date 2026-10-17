# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 10020 ms da app chiusa (di cui 3427 ms prima della prima riga di JS) · originale 3246 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 902 | 2878 | ✅ | 636 | 300 | ❌ | 89.3% | –% |
| /clienti | 789 | 923 | ✅ | 878 | 458 | ❌ | 80.6% | –% |
| /promoter | 547 | 911 | ✅ | 251 | 990 | ✅ | 89.5% | –% |
| /promoter/prom000000000000000001 | 1967 | 1928 | ❌ | 757 | 1292 | ✅ | 87.1% | –% |
| /locali | 810 | 1315 | ✅ | 279 | 533 | ✅ | 89.2% | –% |
| /report | 324 | 690 | ✅ | 242 | 301 | ✅ | 90.9% | –% |
| /messaggi | 1001 | 1398 | ✅ | 350 | 326 | ❌ | 91.2% | –% |
| /importa-serata | 234 | 504 | ✅ | 139 | 538 | ✅ | 89.4% | –% |
| /impostazioni-app | 176 | 917 | ✅ | 188 | 337 | ✅ | 89.7% | –% |
| /admin-console | 434 | 970 | ✅ | 312 | 548 | ✅ | 88.7% | –% |
| /clienti-analytics | 928 | 1234 | ✅ | 777 | 1172 | ✅ | 89.5% | –% |
| /academy | 601 | 430 | ❌ | 620 | 1750 | ✅ | 87.1% | –% |
| /notifiche | 114 | 495 | ✅ | 86 | 375 | ✅ | 88.4% | –% |
| /dashboard | 753 | 1681 | ✅ | 918 | 1425 | ✅ | 87.9% | –% |

Memoria (PSS): nativa 491 MB · originale (Chrome) 354 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 57 | 72,51,57 |
| view-classi | 86 | 103,84,86 |
| div | 104 | 104,121,104 |
| div-senza-classi | 84 | 84,84,67 |
| pressable-puro | 89 | 89,88,89 |
| pressable-classi | 137 | 120,137,144 |
| btn-vuoto | 153 | 137,154,153 |
| text-puro | 59 | 59,75,59 |
| text | 128 | 129,128,106 |
| span | 119 | 119,118,119 |
| btn | 189 | 189,221,187 |
| riga | 557 | 544,818,557 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    41168                          75048
         Native Heap:   227208                         230420
                Code:    23356                         146444
               Stack:     1496                           1504
            Graphics:        0                              0
       Private Other:   191804
              System:    16541
             Unknown:                                  197808
 
           TOTAL PSS:   501573            TOTAL RSS:   651224      TOTAL SWAP (KB):        0
```
