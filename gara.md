# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 10708 ms da app chiusa (di cui 4729 ms prima della prima riga di JS) · originale 6699 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 1402 | 3806 | ✅ | 615 | 1098 | ✅ | 89.7% | –% |
| /clienti | 5137 | 710 | ❌ | 775 | 1546 | ✅ | 83.7% | –% |
| /semine | 1042 | 293 | ❌ | 265 | 1638 | ✅ | 81.5% | –% |
| /notifiche | 99 | 143 | ✅ | 60 | 799 | ✅ | 79.3% | –% |
| /formazione | 785 | 371 | ❌ | 1076 | 426 | ❌ | 82.4% | –% |
| /download | 1838 | 387 | ❌ | 1243 | 752 | ❌ | 82.5% | –% |
| /vibra-gpt | 857 | 1045 | ✅ | 1271 | 304 | ❌ | 87.3% | 93.3% |
| /ricerca-ai | 251 | 290 | ✅ | 648 | 299 | ❌ | 87.8% | –% |
| /messaggi | 1641 | 329 | ❌ | 316 | 431 | ✅ | –% | –% |
| /clienti-analytics | 1098 | 627 | ❌ | 1003 | 1220 | ✅ | 87.3% | –% |
| /academy | 3330 | 1061 | ❌ | 4763 | 309 | ❌ | 86.5% | –% |
| /il-mio-vibra | 974 | 340 | ❌ | 377 | 862 | ✅ | 78.4% | –% |

Memoria (PSS): nativa 761 MB · originale (Chrome) 384 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 61 | 61,70,55 |
| view-classi | 88 | 88,88,89 |
| div | 137 | 137,135,138 |
| text-puro | 73 | 73,73,88 |
| text | 121 | 135,121,108 |
| span | 120 | 120,121,104 |
| btn | 237 | 237,224,247 |
| riga | 693 | 673,923,693 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    52740                          86604
         Native Heap:   370604                         373772
                Code:    27020                         151900
               Stack:     1800                           1808
            Graphics:        0                              0
       Private Other:   310784
              System:    16527
             Unknown:                                  316616
 
           TOTAL PSS:   779475            TOTAL RSS:   930700      TOTAL SWAP (KB):        0
```
