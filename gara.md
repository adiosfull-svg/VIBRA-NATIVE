# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 7945 ms da app chiusa (di cui 3164 ms prima della prima riga di JS) · originale 3278 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 368 | 3594 | ✅ | 137 | 725 | ✅ | 88.6% | –% |
| /clienti | 114 | 423 | ✅ | 156 | 1407 | ✅ | 78.4% | 93.3% |
| /semine | 230 | 2145 | ✅ | 133 | 1477 | ✅ | –% | –% |
| /notifiche | 34 | 276 | ✅ | 78 | 740 | ✅ | 78.6% | –% |
| /formazione | 881 | 514 | ❌ | 531 | 186 | ❌ | –% | –% |
| /download | 3121 | 814 | ❌ | 378 | 848 | ✅ | 83.7% | –% |
| /vibra-gpt | 1230 | 1121 | ❌ | 502 | 741 | ✅ | 87.5% | –% |
| /ricerca-ai | 392 | 731 | ✅ | 274 | 263 | ❌ | 87% | –% |
| /messaggi | 701 | 952 | ✅ | 708 | 796 | ✅ | –% | –% |
| /clienti-analytics | 2855 | 2361 | ❌ | 1155 | 1373 | ✅ | 89.3% | –% |
| /academy | 519 | 2432 | ✅ | 939 | 863 | ❌ | 84.6% | –% |
| /il-mio-vibra | 135 | 2003 | ✅ | 592 | 1589 | ✅ | –% | –% |

Memoria (PSS): nativa 505 MB · originale (Chrome) 434 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 56 | 73,55,56 |
| view-classi | 90 | 90,89,103 |
| div | 121 | 105,121,121 |
| div-senza-classi | 67 | 84,67,66 |
| pressable-puro | 88 | 87,89,88 |
| pressable-classi | 122 | 122,122,130 |
| btn-vuoto | 120 | 137,120,120 |
| text-puro | 77 | 88,59,77 |
| text | 124 | 102,124,149 |
| span | 123 | 102,123,123 |
| btn | 202 | 200,223,202 |
| riga | 593 | 590,745,593 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    54700                          88540
         Native Heap:   252024                         255244
                Code:    24372                         148444
               Stack:     1720                           1728
            Graphics:        0                              0
       Private Other:   167332
              System:    16553
             Unknown:                                  173300
 
           TOTAL PSS:   516701            TOTAL RSS:   667256      TOTAL SWAP (KB):        0
```
