# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 8743 ms da app chiusa (di cui 4290 ms prima della prima riga di JS) · originale 5581 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 2067 | 2350 | ✅ | 84 | 1149 | ✅ | 83% | –% |
| /clienti | 108 | 274 | ✅ | 44 | 2400 | ✅ | 82.5% | –% |
| /semine | 198 | 2541 | ✅ | 111 | 1345 | ✅ | –% | –% |
| /notifiche | 79 | 278 | ✅ | 91 | 758 | ✅ | –% | –% |
| /formazione | 270 | 1361 | ✅ | 760 | 76 | ❌ | –% | –% |
| /download | 2335 | 659 | ❌ | 415 | 708 | ✅ | 84.6% | –% |
| /vibra-gpt | 1062 | 888 | ❌ | 308 | 901 | ✅ | 86.2% | –% |
| /ricerca-ai | 348 | 377 | ✅ | 515 | 358 | ❌ | 86.9% | –% |
| /messaggi | 1371 | 1096 | ❌ | 357 | 572 | ✅ | 83.9% | –% |
| /clienti-analytics | 3031 | 979 | ❌ | 1113 | 1468 | ✅ | 90.9% | –% |
| /academy | 600 | 2314 | ✅ | 632 | 1277 | ✅ | 76.7% | –% |
| /il-mio-vibra | 72 | 1633 | ✅ | 55 | 1422 | ✅ | 81.5% | –% |

Memoria (PSS): nativa 513 MB · originale (Chrome) 412 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 70 | 70,89,57 |
| view-classi | 104 | 104,104,105 |
| div | 120 | 120,120,120 |
| div-senza-classi | 84 | 84,84,83 |
| pressable-puro | 104 | 104,103,104 |
| pressable-classi | 153 | 153,190,153 |
| btn-vuoto | 141 | 140,153,141 |
| text-puro | 99 | 99,101,79 |
| text | 137 | 124,137,137 |
| span | 137 | 105,137,144 |
| btn | 217 | 240,217,208 |
| riga | 675 | 800,671,675 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    54276                          88128
         Native Heap:   270036                         273256
                Code:    24448                         148516
               Stack:     1720                           1728
            Graphics:        0                              0
       Private Other:   158256
              System:    16834
             Unknown:                                  164180
 
           TOTAL PSS:   525570            TOTAL RSS:   675808      TOTAL SWAP (KB):        0
```
