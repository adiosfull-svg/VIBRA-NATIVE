# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 8964 ms da app chiusa (di cui 3447 ms prima della prima riga di JS) · originale 3877 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 482 | 452 | ❌ | 607 | 341 | ❌ | 84.9% | –% |
| /clienti | 201 | 2670 | ✅ | 162 | 111 | ❌ | 81.1% | –% |
| /promoter | 880 | 767 | ❌ | 965 | 713 | ❌ | 85.7% | –% |
| /promoter/prom000000000000000001 | 3331 | 1834 | ❌ | 824 | 1461 | ✅ | 87.9% | –% |
| /locali | 319 | 1004 | ✅ | 295 | 429 | ✅ | 88.9% | –% |
| /report | 443 | 726 | ✅ | 571 | 463 | ❌ | 87.9% | –% |
| /messaggi | 621 | 773 | ✅ | 528 | 502 | ❌ | –% | –% |
| /importa-serata | 323 | 786 | ✅ | 268 | 320 | ✅ | 90.5% | –% |
| /impostazioni-app | 337 | 731 | ✅ | 346 | 203 | ❌ | 89.4% | –% |
| /admin-console | 474 | 664 | ✅ | 324 | 469 | ✅ | 91.3% | –% |
| /clienti-analytics | 1489 | 1054 | ❌ | 1207 | 1035 | ❌ | 89.8% | –% |
| /academy | 898 | 600 | ❌ | 743 | 1215 | ✅ | 80% | –% |
| /notifiche | 312 | 678 | ✅ | 61 | 349 | ✅ | 82.9% | –% |
| /dashboard | 118 | 1049 | ✅ | errore | 1245 |  | 84.9% | –% |

Memoria (PSS): nativa 521 MB · originale (Chrome) 371 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 56 | 50,56,57 |
| view-classi | 87 | 87,87,93 |
| div | 120 | 104,126,120 |
| div-senza-classi | 83 | 83,84,76 |
| pressable-puro | 96 | 84,96,104 |
| pressable-classi | 142 | 137,142,207 |
| btn-vuoto | 141 | 141,137,153 |
| text-puro | 89 | 108,89,58 |
| text | 124 | 121,124,124 |
| span | 137 | 139,137,121 |
| btn | 240 | 240,270,208 |
| riga | 713 | 713,624,751 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    58312                          92184
         Native Heap:   245028                         248252
                Code:    23060                         147660
               Stack:     1856                           1868
            Graphics:        0                              0
       Private Other:   188456
              System:    16391
             Unknown:                                  194444
 
           TOTAL PSS:   533103            TOTAL RSS:   684408      TOTAL SWAP (KB):        0
```
