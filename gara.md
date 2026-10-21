# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 8129 ms da app chiusa (di cui 2953 ms prima della prima riga di JS) · originale 1203 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 676 | 1875 | ✅ | 338 | 357 | ✅ | 90.4% | –% |
| /clienti | 587 | 515 | ❌ | 726 | 305 | ❌ | 83.7% | –% |
| /promoter | 757 | 1089 | ✅ | 394 | 940 | ✅ | 89.9% | –% |
| /promoter/prom000000000000000001 | 3643 | 2937 | ❌ | 1123 | 981 | ❌ | 90.7% | –% |
| /locali | 4347 | 1550 | ❌ | 721 | 153 | ❌ | 87.2% | –% |
| /report | 628 | 627 | ❌ | 314 | 125 | ❌ | 88% | –% |
| /messaggi | 772 | 923 | ✅ | 488 | 590 | ✅ | –% | –% |
| /importa-serata | 398 | 719 | ✅ | 305 | 751 | ✅ | 88.6% | –% |
| /impostazioni-app | 276 | 695 | ✅ | 228 | 793 | ✅ | 89.6% | –% |
| /admin-console | 629 | 704 | ✅ | 397 | 1009 | ✅ | 90.3% | –% |
| /clienti-analytics | 1188 | 1316 | ✅ | 1294 | 908 | ❌ | 89.5% | –% |
| /academy | 697 | 646 | ❌ | 632 | 1613 | ✅ | 88.4% | –% |
| /notifiche | 262 | 808 | ✅ | 179 | 405 | ✅ | 88.7% | –% |
| /dashboard | 784 | 524 | ❌ | 684 | 842 | ✅ | 89.7% | –% |

Memoria (PSS): nativa 517 MB · originale (Chrome) 361 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 57 | 71,55,57 |
| view-classi | 90 | 90,88,128 |
| div | 119 | 170,119,104 |
| div-senza-classi | 67 | 67,67,84 |
| pressable-puro | 93 | 93,91,106 |
| pressable-classi | 120 | 117,120,137 |
| btn-vuoto | 136 | 136,154,136 |
| text-puro | 95 | 94,102,95 |
| text | 109 | 104,117,109 |
| span | 121 | 126,121,121 |
| btn | 209 | 209,310,193 |
| riga | 619 | 559,619,699 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    27508                          61396
         Native Heap:   286548                         289828
                Code:    46864                         170488
               Stack:     1712                           1720
            Graphics:        0                              0
       Private Other:   148100
              System:    16860
             Unknown:                                  153980
 
           TOTAL PSS:   527592            TOTAL RSS:   677412      TOTAL SWAP (KB):        0
```
