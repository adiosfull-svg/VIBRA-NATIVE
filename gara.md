# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 12272 ms da app chiusa (di cui 3732 ms prima della prima riga di JS) · originale 4493 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 1545 | 1702 | ✅ | 864 | 373 | ❌ | 81.7% | –% |
| /clienti | 1599 | 2440 | ✅ | 2634 | 512 | ❌ | 82.9% | –% |
| /promoter | 2089 | 788 | ❌ | 440 | 844 | ✅ | 90.1% | –% |
| /promoter/prom000000000000000001 | 1361 | 2007 | ✅ | 1201 | 847 | ❌ | 91.2% | –% |
| /locali | 2334 | 982 | ❌ | 829 | 638 | ❌ | 91.7% | –% |
| /report | 326 | 682 | ✅ | 469 | 600 | ✅ | 91.3% | –% |
| /messaggi | 521 | 844 | ✅ | 488 | 566 | ✅ | –% | –% |
| /importa-serata | 268 | 775 | ✅ | 373 | 359 | ❌ | 91.6% | –% |
| /impostazioni-app | 482 | 664 | ✅ | 503 | 238 | ❌ | 90.5% | –% |
| /admin-console | 700 | 710 | ✅ | 411 | 511 | ✅ | 90.2% | –% |
| /clienti-analytics | 1351 | 1136 | ❌ | 1377 | 313 | ❌ | 91.2% | –% |
| /academy | 1378 | 2169 | ✅ | 1054 | 1538 | ✅ | 78.3% | –% |
| /notifiche | 318 | 287 | ❌ | 128 | 475 | ✅ | 89.3% | –% |
| /dashboard | 998 | 867 | ❌ | 1293 | 629 | ❌ | 86.4% | –% |

Memoria (PSS): nativa 556 MB · originale (Chrome) 354 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 69 | 56,69,70 |
| view-classi | 103 | 167,103,103 |
| div | 204 | 204,220,203 |
| div-senza-classi | 184 | 184,134,200 |
| pressable-puro | 104 | 108,104,87 |
| pressable-classi | 136 | 120,153,136 |
| btn-vuoto | 237 | 238,237,236 |
| text-puro | 72 | 72,71,72 |
| text | 220 | 219,222,220 |
| span | 239 | 236,251,239 |
| btn | 503 | 473,508,503 |
| riga | 1543 | 1543,1467,1604 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    41336                          75228
         Native Heap:   272952                         276164
                Code:    24120                         146776
               Stack:     1484                           1492
            Graphics:        0                              0
       Private Other:   212312
              System:    16382
             Unknown:                                  218268
 
           TOTAL PSS:   568586            TOTAL RSS:   717928      TOTAL SWAP (KB):        0
```
