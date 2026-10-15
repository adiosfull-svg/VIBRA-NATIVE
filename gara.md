# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 7111 ms da app chiusa (di cui 2607 ms prima della prima riga di JS) · originale 2237 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 10947 | 3225 | ❌ | 139 | 1135 | ✅ | 90.3% | –% |
| /clienti | 1955 | 435 | ❌ | 113 | 1980 | ✅ | 78.9% | 92.8% |
| /semine | 585 | 2211 | ✅ | 151 | 1499 | ✅ | 86% | –% |
| /notifiche | 58 | 254 | ✅ | 117 | 734 | ✅ | –% | –% |
| /formazione | 493 | 1132 | ✅ | 878 | 335 | ❌ | 76.2% | –% |
| /download | 1423 | 678 | ❌ | 521 | 785 | ✅ | 82.4% | –% |
| /vibra-gpt | 565 | 692 | ✅ | 459 | 297 | ❌ | 85.6% | –% |
| /ricerca-ai | 418 | 999 | ✅ | 269 | 435 | ✅ | 85.4% | 92.4% |
| /messaggi | 914 | 1176 | ✅ | 417 | 818 | ✅ | –% | –% |
| /clienti-analytics | 1286 | 647 | ❌ | 1400 | 638 | ❌ | 89% | –% |
| /academy | 1266 | 1875 | ✅ | 1185 | 1025 | ❌ | 79.3% | –% |
| /il-mio-vibra | 1838 | 1462 | ❌ | 1146 | 852 | ❌ | 75% | –% |

Memoria (PSS): nativa 536 MB · originale (Chrome) 422 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 54 | 145,53,54 |
| view-classi | 67 | 71,67,67 |
| div | 202 | 202,271,153 |
| div-senza-classi | 152 | 152,167,116 |
| pressable-puro | 74 | 72,87,74 |
| pressable-classi | 119 | 103,119,122 |
| btn-vuoto | 220 | 220,252,219 |
| text-puro | 72 | 104,72,71 |
| text | 193 | 193,203,169 |
| span | 235 | 220,255,235 |
| btn | 472 | 472,471,570 |
| riga | 1419 | 1284,1419,1619 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    48236                          82068
         Native Heap:   259524                         262796
                Code:    24948                         149608
               Stack:     1744                           1752
            Graphics:        0                              0
       Private Other:   197972
              System:    16914
             Unknown:                                  203908
 
           TOTAL PSS:   549338            TOTAL RSS:   700132      TOTAL SWAP (KB):        0
```
