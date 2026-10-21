# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 9757 ms da app chiusa (di cui 2482 ms prima della prima riga di JS) · originale 5570 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 562 | 587 | ✅ | 352 | 385 | ✅ | 91.1% | –% |
| /clienti | 901 | 960 | ✅ | 922 | 552 | ❌ | 80.8% | –% |
| /promoter | 1674 | 316 | ❌ | 550 | 1244 | ✅ | 90.5% | –% |
| /promoter/prom000000000000000001 | 3752 | 3332 | ❌ | 1402 | 749 | ❌ | 89.7% | –% |
| /locali | 563 | 1394 | ✅ | 624 | 473 | ❌ | 89.2% | –% |
| /report | 479 | 562 | ✅ | 398 | 341 | ❌ | 89.7% | –% |
| /messaggi | 892 | 1345 | ✅ | 563 | 949 | ✅ | –% | –% |
| /importa-serata | 238 | 1155 | ✅ | 476 | 628 | ✅ | 90% | –% |
| /impostazioni-app | 187 | 666 | ✅ | 468 | 473 | ✅ | 88.9% | –% |
| /admin-console | 484 | 659 | ✅ | 438 | 697 | ✅ | 89.5% | –% |
| /clienti-analytics | 985 | 845 | ❌ | 1254 | 414 | ❌ | 89.4% | –% |
| /academy | 635 | 3339 | ✅ | 776 | 1046 | ✅ | 86.5% | –% |
| /notifiche | 286 | 332 | ✅ | 443 | 492 | ✅ | 88.9% | –% |
| /dashboard | 577 | 735 | ✅ | 957 | 634 | ❌ | 86.5% | –% |

Memoria (PSS): nativa 689 MB · originale (Chrome) 373 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 58 | 55,58,73 |
| view-classi | 103 | 103,104,89 |
| div | 120 | 120,120,120 |
| div-senza-classi | 84 | 84,84,84 |
| pressable-puro | 103 | 104,103,100 |
| pressable-classi | 137 | 137,137,153 |
| btn-vuoto | 153 | 153,253,153 |
| text-puro | 97 | 101,91,97 |
| text | 119 | 119,106,121 |
| span | 134 | 136,122,134 |
| btn | 221 | 190,221,233 |
| riga | 684 | 611,684,834 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    56180                          90088
         Native Heap:   342368                         345588
                Code:    47192                         171064
               Stack:     1616                           1624
            Graphics:        0                              0
       Private Other:   240600
              System:    16958
             Unknown:                                  246444
 
           TOTAL PSS:   704914            TOTAL RSS:   854808      TOTAL SWAP (KB):        0
```
