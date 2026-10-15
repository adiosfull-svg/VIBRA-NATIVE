# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 5905 ms da app chiusa (di cui 2003 ms prima della prima riga di JS) · originale 654 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 82 | 2474 | ✅ | 390 | 711 | ✅ | 87.1% | –% |
| /clienti | 465 | 159 | ❌ | 49 | 1039 | ✅ | 89.8% | 90.5% |
| /semine | 51 | 1669 | ✅ | 48 | 538 | ✅ | 84.7% | –% |
| /notifiche | 38 | 184 | ✅ | 24 | 276 | ✅ | 77.6% | –% |
| /formazione | 206 | 347 | ✅ | 201 | 851 | ✅ | 89.9% | –% |
| /download | 200 | 493 | ✅ | 168 | 1062 | ✅ | 88.7% | –% |
| /vibra-gpt | 136 | 780 | ✅ | 240 | 275 | ✅ | 75.9% | 90% |
| /ricerca-ai | 115 | 849 | ✅ | 138 | 285 | ✅ | 77.7% | –% |
| /messaggi | 367 | 646 | ✅ | 142 | 353 | ✅ | –% | –% |
| /clienti-analytics | 752 | 1444 | ✅ | 860 | 1108 | ✅ | 87.5% | –% |
| /academy | 307 | 1078 | ✅ | 297 | 820 | ✅ | 84.7% | –% |
| /il-mio-vibra | 234 | 868 | ✅ | 48 | 971 | ✅ | 83% | –% |

Memoria (PSS): nativa 524 MB · originale (Chrome) 450 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 37 | 37,36,37 |
| view-classi | 53 | 53,53,53 |
| div | 69 | 71,69,69 |
| div-senza-classi | 50 | 50,52,50 |
| pressable-puro | 54 | 70,53,54 |
| pressable-classi | 71 | 71,69,71 |
| btn-vuoto | 85 | 84,85,85 |
| text-puro | 47 | 52,46,47 |
| text | 75 | 76,56,75 |
| span | 77 | 75,77,77 |
| btn | 167 | 167,182,129 |
| riga | 344 | 344,336,474 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    59828                          93648
         Native Heap:   272792                         276000
                Code:    24136                         148904
               Stack:     1924                           1928
            Graphics:        0                              0
       Private Other:   161528
              System:    16356
             Unknown:                                  167404
 
           TOTAL PSS:   536564            TOTAL RSS:   687884      TOTAL SWAP (KB):        0
```
