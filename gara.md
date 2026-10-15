# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 7584 ms da app chiusa (di cui 2393 ms prima della prima riga di JS) · originale 4923 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 4485 | 1883 | ❌ | 354 | 241 | ❌ | 89.6% | –% |
| /clienti | 1926 | 941 | ❌ | 954 | 379 | ❌ | 84.4% | –% |
| /promoter | 1968 | 459 | ❌ | 250 | 538 | ✅ | 91% | –% |
| /promoter/prom000000000000000001 | 2858 | 1785 | ❌ | 792 | 1190 | ✅ | 89.6% | –% |
| /locali | 533 | 721 | ✅ | 309 | 326 | ✅ | 90.3% | –% |
| /report | 147 | 212 | ✅ | 175 | 352 | ✅ | 88.8% | –% |
| /messaggi | 361 | 652 | ✅ | 164 | 363 | ✅ | –% | –% |
| /importa-serata | 152 | 377 | ✅ | 169 | 233 | ✅ | 88.4% | –% |
| /impostazioni-app | 274 | 431 | ✅ | 182 | 157 | ❌ | 88.7% | –% |
| /admin-console | 353 | 909 | ✅ | 159 | 298 | ✅ | 89.6% | –% |
| /clienti-analytics | 669 | 676 | ✅ | 558 | 656 | ✅ | 89.8% | –% |
| /academy | 857 | 1660 | ✅ | 429 | 1343 | ✅ | 81.5% | –% |
| /notifiche | 92 | 528 | ✅ | 42 | 422 | ✅ | 89.8% | –% |
| /dashboard | 602 | 601 | ❌ | 657 | 837 | ✅ | 88.5% | –% |

Memoria (PSS): nativa 657 MB · originale (Chrome) 372 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 37 | 37,37,38 |
| view-classi | 55 | 55,52,55 |
| div | 70 | 70,70,86 |
| div-senza-classi | 50 | 50,50,50 |
| pressable-puro | 70 | 91,70,67 |
| pressable-classi | 87 | 87,87,89 |
| btn-vuoto | 103 | 103,103,103 |
| text-puro | 55 | 51,55,75 |
| text | 80 | 82,70,80 |
| span | 80 | 80,72,81 |
| btn | 164 | 163,169,164 |
| riga | 424 | 424,590,421 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    54704                          88592
         Native Heap:   326036                         329244
                Code:    24096                         147976
               Stack:     1664                           1668
            Graphics:        0                              0
       Private Other:   249360
              System:    16271
             Unknown:                                  255264
 
           TOTAL PSS:   672131            TOTAL RSS:   822744      TOTAL SWAP (KB):        0
```
