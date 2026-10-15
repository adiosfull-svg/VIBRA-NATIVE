# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 11176 ms da app chiusa (di cui 3670 ms prima della prima riga di JS) · originale 4898 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 980 | 928 | ❌ | 338 | 347 | ✅ | 86.6% | –% |
| /clienti | 472 | 2776 | ✅ | 689 | 611 | ❌ | 80.9% | –% |
| /promoter | 398 | 307 | ❌ | 328 | 1080 | ✅ | 88.4% | –% |
| /promoter/prom000000000000000001 | 584 | 2514 | ✅ | 807 | 1367 | ✅ | 88.1% | –% |
| /locali | 312 | 1178 | ✅ | 211 | 150 | ❌ | 87.9% | –% |
| /report | 322 | 251 | ❌ | 238 | 312 | ✅ | 85.1% | –% |
| /messaggi | 635 | 780 | ✅ | 344 | 644 | ✅ | –% | –% |
| /importa-serata | 322 | 653 | ✅ | 251 | 567 | ✅ | 89.8% | –% |
| /impostazioni-app | 350 | 704 | ✅ | 315 | 345 | ✅ | 90.6% | –% |
| /admin-console | 604 | 1165 | ✅ | 354 | 360 | ✅ | 89.5% | –% |
| /clienti-analytics | 2187 | 975 | ❌ | 1559 | 562 | ❌ | 91.3% | –% |
| /academy | 676 | 786 | ✅ | 902 | 1561 | ✅ | 82.5% | –% |
| /notifiche | 686 | 451 | ❌ | 41 | 232 | ✅ | 77.4% | –% |
| /dashboard | 914 | 1302 | ✅ | errore | 587 |  | 78.1% | –% |

Memoria (PSS): nativa 477 MB · originale (Chrome) 361 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 57 | 57,57,56 |
| view-classi | 89 | 89,88,89 |
| div | 104 | 113,104,104 |
| div-senza-classi | 67 | 67,67,67 |
| pressable-puro | 89 | 88,89,91 |
| pressable-classi | 120 | 117,120,122 |
| btn-vuoto | 154 | 181,153,154 |
| text-puro | 74 | 60,93,74 |
| text | 118 | 118,125,118 |
| span | 123 | 123,100,137 |
| btn | 220 | 220,188,260 |
| riga | 602 | 590,711,602 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    48636                          82448
         Native Heap:   216808                         220036
                Code:    23380                         149396
               Stack:     1692                           1704
            Graphics:        0                              0
       Private Other:   181200
              System:    16269
             Unknown:                                  187120
 
           TOTAL PSS:   487985            TOTAL RSS:   640704      TOTAL SWAP (KB):        0
```
