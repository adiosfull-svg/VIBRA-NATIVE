# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 9763 ms da app chiusa (di cui 3685 ms prima della prima riga di JS) · originale 4764 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 1074 | 1885 | ✅ | 925 | 342 | ❌ | 83% | –% |
| /clienti | 1090 | 2145 | ✅ | 1598 | 198 | ❌ | 77.8% | –% |
| /promoter | 3518 | 693 | ❌ | 639 | 971 | ✅ | 85.3% | –% |
| /promoter/prom000000000000000001 | 2710 | 1822 | ❌ | 2197 | 1105 | ❌ | 89.7% | –% |
| /locali | 1013 | 1424 | ✅ | 727 | 459 | ❌ | 87.2% | –% |
| /report | 452 | 452 | ✅ | 350 | 203 | ❌ | 91.8% | –% |
| /messaggi | 629 | 1142 | ✅ | 421 | 612 | ✅ | –% | –% |
| /importa-serata | 401 | 843 | ✅ | 302 | 755 | ✅ | 89.3% | –% |
| /impostazioni-app | 600 | 877 | ✅ | 432 | 289 | ❌ | 90.2% | –% |
| /admin-console | 750 | 1114 | ✅ | 351 | 378 | ✅ | 90.3% | –% |
| /clienti-analytics | 1364 | 908 | ❌ | 1415 | 492 | ❌ | 90.5% | –% |
| /academy | 1334 | 2501 | ✅ | 979 | 1646 | ✅ | 78.9% | –% |
| /notifiche | 446 | 974 | ✅ | 80 | 149 | ✅ | 89.4% | –% |
| /dashboard | 837 | 577 | ❌ | 1227 | 946 | ❌ | 89.4% | –% |

Memoria (PSS): nativa 556 MB · originale (Chrome) 357 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 53 | 53,53,54 |
| view-classi | 87 | 86,87,119 |
| div | 202 | 249,195,202 |
| div-senza-classi | 150 | 141,153,150 |
| pressable-puro | 71 | 72,71,71 |
| pressable-classi | 104 | 104,104,136 |
| btn-vuoto | 220 | 219,220,220 |
| text-puro | 64 | 42,64,75 |
| text | 183 | 182,213,183 |
| span | 331 | 194,338,331 |
| btn | 466 | 466,466,433 |
| riga | 1311 | 1311,1295,1568 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    59776                          93656
         Native Heap:   263868                         267116
                Code:    23992                         147348
               Stack:     1552                           1564
            Graphics:        0                              0
       Private Other:   204920
              System:    16283
             Unknown:                                  210844
 
           TOTAL PSS:   570391            TOTAL RSS:   720528      TOTAL SWAP (KB):        0
```
