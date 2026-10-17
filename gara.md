# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 10288 ms da app chiusa (di cui 3538 ms prima della prima riga di JS) · originale 4494 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 483 | 1023 | ✅ | 296 | 318 | ✅ | 89.8% | –% |
| /clienti | 588 | 3569 | ✅ | 734 | 371 | ❌ | 82.4% | –% |
| /promoter | 1898 | 1927 | ✅ | 277 | 1317 | ✅ | 90.5% | –% |
| /promoter/prom000000000000000001 | 3593 | 2698 | ❌ | 634 | 868 | ✅ | 89.1% | –% |
| /locali | 572 | 1426 | ✅ | 284 | 576 | ✅ | 90.4% | –% |
| /report | 307 | 473 | ✅ | 203 | 277 | ✅ | 91.1% | –% |
| /messaggi | 542 | 953 | ✅ | 204 | 647 | ✅ | –% | –% |
| /importa-serata | 235 | 762 | ✅ | 306 | 548 | ✅ | 88.8% | –% |
| /impostazioni-app | 196 | 1127 | ✅ | 163 | 575 | ✅ | 89.3% | –% |
| /admin-console | 612 | 713 | ✅ | 176 | 816 | ✅ | 88.5% | –% |
| /clienti-analytics | 899 | 1134 | ✅ | 692 | 530 | ❌ | 88.4% | –% |
| /academy | 555 | 2806 | ✅ | 557 | 1555 | ✅ | 80.6% | –% |
| /notifiche | 152 | 861 | ✅ | 132 | 446 | ✅ | 81.8% | –% |
| /dashboard | 783 | 1568 | ✅ | 280 | 593 | ✅ | 88% | –% |

Memoria (PSS): nativa 484 MB · originale (Chrome) 361 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 72 | 75,70,72 |
| view-classi | 87 | 87,103,87 |
| div | 104 | 104,104,103 |
| div-senza-classi | 69 | 67,84,69 |
| pressable-puro | 104 | 104,106,104 |
| pressable-classi | 122 | 122,121,122 |
| btn-vuoto | 136 | 121,136,136 |
| text-puro | 82 | 82,73,102 |
| text | 106 | 107,106,106 |
| span | 118 | 106,120,118 |
| btn | 221 | 203,221,226 |
| riga | 615 | 643,585,615 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    41896                          75772
         Native Heap:   245988                         249224
                Code:    23132                         147212
               Stack:     1556                           1564
            Graphics:        0                              0
       Private Other:   166948
              System:    16336
             Unknown:                                  172764
 
           TOTAL PSS:   495856            TOTAL RSS:   646536      TOTAL SWAP (KB):        0
```
