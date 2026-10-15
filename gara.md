# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 9620 ms da app chiusa (di cui 3080 ms prima della prima riga di JS) · originale 4106 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 852 | 1555 | ✅ | 329 | 319 | ❌ | 88.5% | –% |
| /clienti | 327 | 1917 | ✅ | 759 | 562 | ❌ | 83.6% | –% |
| /promoter | 1007 | 1829 | ✅ | 642 | 869 | ✅ | 89.9% | –% |
| /promoter/prom000000000000000001 | 913 | 1657 | ✅ | 973 | 643 | ❌ | 88.5% | –% |
| /locali | 58 | 1026 | ✅ | 132 | 471 | ✅ | 88.8% | –% |
| /report | 177 | 267 | ✅ | 350 | 114 | ❌ | 90.3% | –% |
| /messaggi | 361 | 1024 | ✅ | 412 | 411 | ❌ | –% | –% |
| /importa-serata | 172 | 606 | ✅ | 270 | 344 | ✅ | 88.4% | –% |
| /impostazioni-app | 193 | 353 | ✅ | 179 | 238 | ✅ | 89.4% | –% |
| /admin-console | 308 | 480 | ✅ | 212 | 216 | ✅ | 89% | –% |
| /clienti-analytics | 744 | 949 | ✅ | 1182 | 558 | ❌ | 89.1% | –% |
| /academy | 516 | 339 | ❌ | 501 | 778 | ✅ | 83.1% | –% |
| /notifiche | 234 | 337 | ✅ | 37 | 195 | ✅ | 86.4% | –% |
| /dashboard | 833 | 1222 | ✅ | errore | 959 |  | 85.2% | –% |

Memoria (PSS): nativa 433 MB · originale (Chrome) 363 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 38 | 52,38,37 |
| view-classi | 55 | 70,55,55 |
| div | 71 | 72,71,71 |
| div-senza-classi | 50 | 50,50,50 |
| pressable-puro | 54 | 54,54,55 |
| pressable-classi | 103 | 90,103,170 |
| btn-vuoto | 103 | 119,103,98 |
| text-puro | 52 | 53,52,52 |
| text | 83 | 84,83,80 |
| span | 83 | 86,82,83 |
| btn | 163 | 138,168,163 |
| riga | 518 | 518,424,546 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    45060                          78916
         Native Heap:   185608                         188844
                Code:    23276                         147736
               Stack:     1676                           1684
            Graphics:        0                              0
       Private Other:   171652
              System:    16045
             Unknown:                                  177532
 
           TOTAL PSS:   443317            TOTAL RSS:   594712      TOTAL SWAP (KB):        0
```
