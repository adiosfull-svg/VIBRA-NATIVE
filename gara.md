# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 8382 ms da app chiusa (di cui 2888 ms prima della prima riga di JS) · originale 2444 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 280 | 3583 | ✅ | 152 | 1151 | ✅ | 90.6% | –% |
| /clienti | 1247 | 1115 | ❌ | 138 | 2097 | ✅ | 80.8% | –% |
| /semine | 524 | 122 | ❌ | 121 | 1633 | ✅ | –% | –% |
| /notifiche | 36 | 200 | ✅ | 282 | 611 | ✅ | –% | –% |
| /formazione | 284 | 1290 | ✅ | 757 | 434 | ❌ | –% | –% |
| /download | 533 | 815 | ✅ | 567 | 916 | ✅ | 84.9% | –% |
| /vibra-gpt | 823 | 863 | ✅ | 374 | 547 | ✅ | 87.2% | –% |
| /ricerca-ai | 479 | 597 | ✅ | 415 | 564 | ✅ | 86.9% | –% |
| /messaggi | 1001 | 783 | ❌ | 646 | 548 | ❌ | –% | –% |
| /clienti-analytics | 2903 | 2331 | ❌ | 1172 | 2251 | ✅ | 90.8% | –% |
| /academy | 1084 | 2449 | ✅ | 665 | 1611 | ✅ | 84.6% | –% |
| /il-mio-vibra | 1607 | 1747 | ✅ | 682 | 1076 | ✅ | 78.3% | –% |

Memoria (PSS): nativa 558 MB · originale (Chrome) 453 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 69 | 87,55,69 |
| view-classi | 103 | 104,103,103 |
| div | 120 | 137,120,117 |
| div-senza-classi | 83 | 83,84,67 |
| pressable-puro | 103 | 103,92,137 |
| pressable-classi | 136 | 121,136,141 |
| btn-vuoto | 137 | 152,137,137 |
| text-puro | 78 | 76,78,95 |
| text | 121 | 100,137,121 |
| span | 123 | 104,124,123 |
| btn | 256 | 201,289,256 |
| riga | 677 | 631,677,695 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    56376                          90224
         Native Heap:   284836                         288048
                Code:    46904                         172032
               Stack:     1896                           1900
            Graphics:        0                              0
       Private Other:   164456
              System:    16812
             Unknown:                                  170296
 
           TOTAL PSS:   571280            TOTAL RSS:   722500      TOTAL SWAP (KB):        0
```
