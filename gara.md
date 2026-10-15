# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 6801 ms da app chiusa (di cui 1963 ms prima della prima riga di JS) · originale 1860 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 318 | 380 | ✅ | 197 | 209 | ✅ | 88.4% | 91.2% |
| /clienti | 78 | 579 | ✅ | 491 | 297 | ❌ | 87.6% | –% |
| /promoter | 694 | 1490 | ✅ | 157 | 544 | ✅ | 88.5% | –% |
| /promoter/prom000000000000000001 | 1493 | 1382 | ❌ | 752 | 161 | ❌ | 87.5% | –% |
| /locali | 207 | 886 | ✅ | 155 | 452 | ✅ | 88.1% | –% |
| /report | 105 | 245 | ✅ | 107 | 347 | ✅ | 88.1% | –% |
| /messaggi | 440 | 659 | ✅ | 160 | 159 | ❌ | –% | –% |
| /importa-serata | 152 | 442 | ✅ | 114 | 294 | ✅ | 85.6% | –% |
| /impostazioni-app | 101 | 658 | ✅ | 128 | 360 | ✅ | 85.3% | –% |
| /admin-console | 280 | 461 | ✅ | 117 | 417 | ✅ | 87.1% | –% |
| /clienti-analytics | 638 | 636 | ❌ | 570 | 478 | ❌ | 87.9% | –% |
| /academy | 328 | 1817 | ✅ | 347 | 906 | ✅ | 85.4% | –% |
| /notifiche | 86 | 245 | ✅ | 32 | 188 | ✅ | 91% | –% |
| /dashboard | 735 | 1024 | ✅ | 242 | 1016 | ✅ | 88.7% | –% |

Memoria (PSS): nativa 520 MB · originale (Chrome) 365 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 37 | 51,37,34 |
| view-classi | 69 | 119,54,69 |
| div | 69 | 69,70,69 |
| div-senza-classi | 50 | 50,50,50 |
| pressable-puro | 52 | 52,54,52 |
| pressable-classi | 70 | 70,68,74 |
| btn-vuoto | 85 | 88,85,85 |
| text-puro | 34 | 34,46,34 |
| text | 76 | 55,77,76 |
| span | 105 | 134,105,83 |
| btn | 129 | 131,124,129 |
| riga | 389 | 389,448,355 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    44192                          78084
         Native Heap:   276040                         279256
                Code:    23252                         145968
               Stack:     1684                           1688
            Graphics:        0                              0
       Private Other:   171504
              System:    16128
             Unknown:                                  177328
 
           TOTAL PSS:   532800            TOTAL RSS:   682324      TOTAL SWAP (KB):        0
```
