# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 8046 ms da app chiusa (di cui 1432 ms prima della prima riga di JS) · originale 2383 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 4896 | 823 | ❌ | 317 | 335 | ✅ | 90.4% | –% |
| /clienti | 1066 | 2485 | ✅ | 1024 | 293 | ❌ | 81.4% | –% |
| /promoter | 1861 | 633 | ❌ | 372 | 1117 | ✅ | 89.4% | –% |
| /promoter/prom000000000000000001 | 292 | 1794 | ✅ | 830 | 1263 | ✅ | 88.5% | –% |
| /locali | 1297 | 1259 | ❌ | 329 | 527 | ✅ | 90% | –% |
| /report | 141 | 384 | ✅ | 219 | 774 | ✅ | 88.9% | –% |
| /messaggi | 560 | 1045 | ✅ | 247 | 920 | ✅ | –% | –% |
| /importa-serata | 162 | 841 | ✅ | 272 | 519 | ✅ | 88.2% | –% |
| /impostazioni-app | 225 | 758 | ✅ | 272 | 333 | ✅ | 89.4% | –% |
| /admin-console | 355 | 793 | ✅ | 286 | 297 | ✅ | 88.8% | –% |
| /clienti-analytics | 676 | 1417 | ✅ | 683 | 748 | ✅ | 88.2% | –% |
| /academy | 866 | 2984 | ✅ | 597 | 1054 | ✅ | 78.6% | –% |
| /notifiche | 173 | 575 | ✅ | 67 | 311 | ✅ | 75.9% | –% |
| /dashboard | 1072 | 1894 | ✅ | 996 | 886 | ❌ | 88.4% | –% |

Memoria (PSS): nativa 605 MB · originale (Chrome) 366 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 69 | 69,71,60 |
| view-classi | 70 | 84,69,70 |
| div | 87 | 87,88,83 |
| div-senza-classi | 67 | 69,67,67 |
| pressable-puro | 87 | 103,85,87 |
| pressable-classi | 226 | 226,237,119 |
| btn-vuoto | 120 | 104,136,120 |
| text-puro | 85 | 85,86,70 |
| text | 116 | 127,104,116 |
| span | 104 | 142,104,104 |
| btn | 189 | 185,218,189 |
| riga | 477 | 475,727,477 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    54012                          87908
         Native Heap:   286176                         289380
                Code:    46172                         169192
               Stack:     1572                           1580
            Graphics:        0                              0
       Private Other:   215360
              System:    16215
             Unknown:                                  221152
 
           TOTAL PSS:   619507            TOTAL RSS:   769212      TOTAL SWAP (KB):        0
```
