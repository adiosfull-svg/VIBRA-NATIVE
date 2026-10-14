# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 6164 ms da app chiusa (di cui 1201 ms prima della prima riga di JS) · originale 3831 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 1026 | 3648 | ✅ | 406 | 610 | ✅ | 87.1% | –% |
| /clienti | 2697 | 490 | ❌ | 90 | 1320 | ✅ | 81.4% | 90% |
| /semine | 241 | 188 | ❌ | 104 | 1041 | ✅ | 83.8% | –% |
| /notifiche | 49 | 195 | ✅ | 33 | 462 | ✅ | 81% | –% |
| /formazione | 1720 | 976 | ❌ | 470 | 441 | ❌ | 89.5% | –% |
| /download | 1016 | 1145 | ✅ | 438 | 931 | ✅ | 88.6% | –% |
| /vibra-gpt | 545 | 1443 | ✅ | 411 | 478 | ✅ | 78.5% | –% |
| /ricerca-ai | 210 | 560 | ✅ | 204 | 579 | ✅ | 79.2% | –% |
| /messaggi | 754 | 642 | ❌ | 312 | 344 | ✅ | –% | –% |
| /clienti-analytics | 711 | 1953 | ✅ | 1038 | 1250 | ✅ | 88.8% | –% |
| /academy | 949 | 2355 | ✅ | 430 | 845 | ✅ | 83.8% | –% |
| /il-mio-vibra | 699 | 1150 | ✅ | 354 | 924 | ✅ | 85.7% | –% |

Memoria (PSS): nativa 607 MB · originale (Chrome) 427 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 37 | 37,37,38 |
| view-classi | 54 | 57,53,54 |
| div | 74 | 74,69,74 |
| div-senza-classi | 52 | 50,67,52 |
| pressable-puro | 69 | 69,69,70 |
| pressable-classi | 74 | 72,74,86 |
| btn-vuoto | 85 | 102,84,85 |
| text-puro | 49 | 49,34,73 |
| text | 77 | 78,73,77 |
| span | 79 | 79,94,77 |
| btn | 156 | 156,214,136 |
| riga | 406 | 406,375,411 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    61784                          95636
         Native Heap:   309120                         312340
                Code:    47024                         170756
               Stack:     1804                           1812
            Graphics:        0                              0
       Private Other:   185204
              System:    16606
             Unknown:                                  191000
 
           TOTAL PSS:   621542            TOTAL RSS:   771544      TOTAL SWAP (KB):        0
```
