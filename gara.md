# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 8301 ms da app chiusa (di cui 2975 ms prima della prima riga di JS) · originale 3618 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 10591 | 2803 | ❌ | 282 | 1120 | ✅ | 90.7% | –% |
| /clienti | 1594 | 438 | ❌ | 911 | 1765 | ✅ | 83.9% | –% |
| /semine | 324 | 492 | ✅ | 216 | 1538 | ✅ | –% | 92.4% |
| /notifiche | 49 | 828 | ✅ | 98 | 453 | ✅ | –% | 92.8% |
| /formazione | 468 | 1011 | ✅ | 1051 | 570 | ❌ | –% | 91.7% |
| /download | 844 | 2132 | ✅ | 1234 | 697 | ❌ | 82.6% | –% |
| /vibra-gpt | 219 | 389 | ✅ | 612 | 418 | ❌ | 89.2% | –% |
| /ricerca-ai | 258 | 962 | ✅ | 930 | 640 | ❌ | 88.8% | 93.3% |
| /messaggi | 1196 | 943 | ❌ | 355 | 1157 | ✅ | –% | –% |
| /clienti-analytics | 1209 | 276 | ❌ | 1237 | 1183 | ❌ | 90.9% | 92.9% |
| /academy | 609 | 1563 | ✅ | 1309 | 278 | ❌ | 87% | –% |
| /il-mio-vibra | 492 | 705 | ✅ | 383 | 1115 | ✅ | 86.8% | –% |

Memoria (PSS): nativa 608 MB · originale (Chrome) 377 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 56 | 153,56,55 |
| view-classi | 103 | 87,103,103 |
| div | 153 | 153,154,153 |
| div-senza-classi | 84 | 83,84,84 |
| pressable-puro | 104 | 104,120,104 |
| pressable-classi | 138 | 138,155,121 |
| btn-vuoto | 223 | 223,232,190 |
| text-puro | 99 | 103,79,99 |
| text | 120 | 121,100,120 |
| span | 105 | 105,137,105 |
| btn | 238 | 220,238,244 |
| riga | 731 | 653,939,731 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    46908                          80780
         Native Heap:   296708                         299912
                Code:    60512                         183936
               Stack:     1848                           1856
            Graphics:        0                              0
       Private Other:   199828
              System:    17113
             Unknown:                                  205540
 
           TOTAL PSS:   622917            TOTAL RSS:   772024      TOTAL SWAP (KB):        0
```
