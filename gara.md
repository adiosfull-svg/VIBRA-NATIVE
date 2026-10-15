# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 6092 ms da app chiusa (di cui 2312 ms prima della prima riga di JS) · originale 2536 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 5227 | 2629 | ❌ | 183 | 786 | ✅ | –% | –% |
| /clienti | 1166 | 670 | ❌ | 215 | 1112 | ✅ | 77.8% | 93.1% |
| /semine | 370 | 178 | ❌ | 80 | 939 | ✅ | –% | –% |
| /notifiche | 41 | 231 | ✅ | 35 | 427 | ✅ | 79.3% | –% |
| /formazione | 1260 | 341 | ❌ | 744 | 215 | ❌ | 86.5% | –% |
| /download | 1874 | 602 | ❌ | 469 | 664 | ✅ | 81.8% | –% |
| /vibra-gpt | 401 | 1039 | ✅ | 465 | 594 | ✅ | 86.7% | –% |
| /ricerca-ai | 282 | 772 | ✅ | 305 | 458 | ✅ | 86.4% | –% |
| /messaggi | 1154 | 1006 | ❌ | 350 | 779 | ✅ | –% | –% |
| /clienti-analytics | 992 | 2062 | ✅ | 1342 | 1306 | ❌ | 89% | –% |
| /academy | 1032 | 1616 | ✅ | 690 | 1728 | ✅ | 86.4% | –% |
| /il-mio-vibra | 428 | 1490 | ✅ | 424 | 1172 | ✅ | 82.9% | –% |

Memoria (PSS): nativa 531 MB · originale (Chrome) 409 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 58 | 57,58,59 |
| view-classi | 86 | 86,86,88 |
| div | 102 | 103,83,102 |
| div-senza-classi | 66 | 66,67,66 |
| pressable-puro | 87 | 86,89,87 |
| pressable-classi | 143 | 121,143,219 |
| btn-vuoto | 120 | 106,122,120 |
| text-puro | 74 | 54,74,81 |
| text | 86 | 105,84,86 |
| span | 111 | 117,108,111 |
| btn | 187 | 187,204,174 |
| riga | 571 | 506,590,571 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    48128                          81996
         Native Heap:   258292                         261520
                Code:    47076                         171088
               Stack:     1932                           1936
            Graphics:        0                              0
       Private Other:   171972
              System:    16435
             Unknown:                                  177820
 
           TOTAL PSS:   543835            TOTAL RSS:   694360      TOTAL SWAP (KB):        0
```
