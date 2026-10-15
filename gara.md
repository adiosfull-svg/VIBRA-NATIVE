# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 7715 ms da app chiusa (di cui 2517 ms prima della prima riga di JS) · originale 1252 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 2669 | 3549 | ✅ | 583 | 361 | ❌ | 85.7% | –% |
| /clienti | 2068 | 738 | ❌ | 1029 | 162 | ❌ | 83.8% | –% |
| /promoter | 1022 | 1161 | ✅ | 389 | 1246 | ✅ | 85.9% | –% |
| /promoter/prom000000000000000001 | 1292 | 2004 | ✅ | 1078 | 1351 | ✅ | 88.4% | –% |
| /locali | 655 | 1624 | ✅ | 511 | 404 | ❌ | 88.5% | –% |
| /report | 170 | 434 | ✅ | 222 | 602 | ✅ | 90.6% | –% |
| /messaggi | 421 | 811 | ✅ | 267 | 932 | ✅ | –% | –% |
| /importa-serata | 213 | 1007 | ✅ | 239 | 722 | ✅ | 90.5% | –% |
| /impostazioni-app | 285 | 1042 | ✅ | 301 | 699 | ✅ | 90.1% | –% |
| /admin-console | 412 | 1092 | ✅ | 276 | 367 | ✅ | 91% | –% |
| /clienti-analytics | 1963 | 1193 | ❌ | 1385 | 690 | ❌ | 91.5% | –% |
| /academy | 725 | 3067 | ✅ | 661 | 1362 | ✅ | 86% | –% |
| /notifiche | 339 | 1227 | ✅ | 141 | 744 | ✅ | 80% | –% |
| /dashboard | 1337 | 1272 | ❌ | 817 | 969 | ✅ | 88.2% | –% |

Memoria (PSS): nativa 587 MB · originale (Chrome) 355 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 57 | 57,57,55 |
| view-classi | 87 | 87,87,84 |
| div | 120 | 119,134,120 |
| div-senza-classi | 84 | 69,84,84 |
| pressable-puro | 103 | 103,103,129 |
| pressable-classi | 137 | 225,136,137 |
| btn-vuoto | 136 | 137,135,136 |
| text-puro | 88 | 88,73,91 |
| text | 126 | 126,116,137 |
| span | 122 | 122,139,103 |
| btn | 219 | 237,219,205 |
| riga | 702 | 816,702,655 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    59484                          93392
         Native Heap:   269172                         272360
                Code:    44848                         167860
               Stack:     1600                           1604
            Graphics:        0                              0
       Private Other:   210008
              System:    16350
             Unknown:                                  215772
 
           TOTAL PSS:   601462            TOTAL RSS:   750988      TOTAL SWAP (KB):        0
```
