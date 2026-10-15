# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 10234 ms da app chiusa (di cui 3909 ms prima della prima riga di JS) · originale 2518 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 1013 | 2020 | ✅ | 372 | 333 | ❌ | 82.6% | –% |
| /clienti | 822 | 758 | ❌ | 322 | 102 | ❌ | 82.2% | –% |
| /promoter | 826 | 133 | ❌ | 226 | 1049 | ✅ | 90% | –% |
| /promoter/prom000000000000000001 | 2071 | 1852 | ❌ | 1144 | 846 | ❌ | 85.1% | –% |
| /locali | 1215 | 1458 | ✅ | 337 | 128 | ❌ | 84.8% | –% |
| /report | 444 | 717 | ✅ | 324 | 647 | ✅ | 89.3% | –% |
| /messaggi | 453 | 1167 | ✅ | 490 | 521 | ✅ | –% | –% |
| /importa-serata | 308 | 723 | ✅ | 440 | 532 | ✅ | 89.6% | –% |
| /impostazioni-app | 212 | 748 | ✅ | 439 | 402 | ❌ | 90.2% | –% |
| /admin-console | 439 | 820 | ✅ | 440 | 774 | ✅ | 90.8% | –% |
| /clienti-analytics | 897 | 1011 | ✅ | 1163 | 682 | ❌ | 90.1% | –% |
| /academy | 691 | 3308 | ✅ | 624 | 1863 | ✅ | 86.7% | –% |
| /notifiche | 426 | 481 | ✅ | 90 | 356 | ✅ | 87.2% | –% |
| /dashboard | 1707 | 1225 | ❌ | 784 | 1201 | ✅ | 89% | –% |

Memoria (PSS): nativa 519 MB · originale (Chrome) 350 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 55 | 55,55,56 |
| view-classi | 88 | 88,88,88 |
| div | 104 | 103,104,120 |
| div-senza-classi | 67 | 84,67,67 |
| pressable-puro | 103 | 89,103,103 |
| pressable-classi | 122 | 148,121,122 |
| btn-vuoto | 154 | 169,154,141 |
| text-puro | 73 | 72,73,79 |
| text | 123 | 220,122,123 |
| span | 137 | 137,122,155 |
| btn | 220 | 220,220,245 |
| riga | 621 | 621,703,606 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    40236                          74108
         Native Heap:   240368                         243540
                Code:    23240                         147272
               Stack:     1660                           1664
            Graphics:        0                              0
       Private Other:   208428
              System:    16500
             Unknown:                                  214144
 
           TOTAL PSS:   530432            TOTAL RSS:   680728      TOTAL SWAP (KB):        0
```
