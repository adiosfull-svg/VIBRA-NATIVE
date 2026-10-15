# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 10535 ms da app chiusa (di cui 3684 ms prima della prima riga di JS) · originale 4007 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 3012 | 457 | ❌ | 267 | 316 | ✅ | 81.4% | –% |
| /clienti | 191 | 2476 | ✅ | 80 | 184 | ✅ | 81.3% | –% |
| /promoter | 744 | 2025 | ✅ | 1273 | 668 | ❌ | 86.5% | –% |
| /promoter/prom000000000000000001 | 3030 | 2255 | ❌ | 840 | 899 | ✅ | 88.9% | –% |
| /locali | 212 | 1682 | ✅ | 273 | 278 | ✅ | 88.8% | –% |
| /report | 310 | 357 | ✅ | 217 | 133 | ❌ | 90.9% | –% |
| /messaggi | 588 | 745 | ✅ | 486 | 607 | ✅ | –% | –% |
| /importa-serata | 296 | 702 | ✅ | 312 | 335 | ✅ | 90.3% | –% |
| /impostazioni-app | 391 | 908 | ✅ | 343 | 350 | ✅ | 89.8% | –% |
| /admin-console | 558 | 860 | ✅ | 365 | 516 | ✅ | 90.2% | –% |
| /clienti-analytics | 978 | 1112 | ✅ | 757 | 763 | ✅ | 91% | –% |
| /academy | 666 | 2910 | ✅ | 612 | 1421 | ✅ | 82.5% | –% |
| /notifiche | 108 | 752 | ✅ | 52 | 433 | ✅ | 90.7% | –% |
| /dashboard | 109 | 636 | ✅ | errore | 1227 |  | 91.7% | –% |

Memoria (PSS): nativa 488 MB · originale (Chrome) 366 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 53 | 53,55,40 |
| view-classi | 74 | 86,74,70 |
| div | 87 | 105,87,87 |
| div-senza-classi | 67 | 67,51,67 |
| pressable-puro | 87 | 87,87,73 |
| pressable-classi | 105 | 119,105,104 |
| btn-vuoto | 120 | 120,125,120 |
| text-puro | 72 | 72,73,71 |
| text | 119 | 119,198,117 |
| span | 101 | 101,100,115 |
| btn | 200 | 187,219,200 |
| riga | 599 | 507,599,613 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    53192                          87036
         Native Heap:   219940                         223148
                Code:    23208                         146984
               Stack:     1868                           1876
            Graphics:        0                              0
       Private Other:   185496
              System:    16058
             Unknown:                                  191348
 
           TOTAL PSS:   499762            TOTAL RSS:   650392      TOTAL SWAP (KB):        0
```
