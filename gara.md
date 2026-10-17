# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 6563 ms da app chiusa (di cui 2443 ms prima della prima riga di JS) · originale 4038 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 366 | 2952 | ✅ | 116 | 884 | ✅ | 83.5% | –% |
| /clienti | 408 | 798 | ✅ | 214 | 1058 | ✅ | 88.1% | 92% |
| /semine | 99 | 2187 | ✅ | 233 | 1274 | ✅ | 73.9% | –% |
| /notifiche | 186 | 167 | ❌ | 30 | 571 | ✅ | 80.8% | –% |
| /formazione | 292 | 313 | ✅ | 210 | 549 | ✅ | 90.3% | –% |
| /download | 1181 | 1108 | ❌ | 463 | 813 | ✅ | 87.1% | –% |
| /vibra-gpt | 690 | 1146 | ✅ | 454 | 262 | ❌ | 84.4% | –% |
| /ricerca-ai | 130 | 428 | ✅ | 297 | 334 | ✅ | 84.5% | –% |
| /messaggi | 428 | 738 | ✅ | 335 | 468 | ✅ | –% | –% |
| /clienti-analytics | 926 | 2181 | ✅ | 953 | 1484 | ✅ | 88.6% | –% |
| /academy | 464 | 1718 | ✅ | 939 | 1151 | ✅ | 87.5% | –% |
| /il-mio-vibra | 240 | 1301 | ✅ | 130 | 1291 | ✅ | 82.4% | –% |

Memoria (PSS): nativa 528 MB · originale (Chrome) 413 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 54 | 55,54,53 |
| view-classi | 73 | 71,86,73 |
| div | 74 | 87,70,74 |
| div-senza-classi | 66 | 66,66,66 |
| pressable-puro | 87 | 87,89,72 |
| pressable-classi | 102 | 102,102,106 |
| btn-vuoto | 118 | 103,118,120 |
| text-puro | 62 | 85,58,62 |
| text | 88 | 88,67,111 |
| span | 94 | 107,94,86 |
| btn | 169 | 173,169,153 |
| riga | 503 | 422,635,503 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    43496                          77340
         Native Heap:   261648                         264824
                Code:    24316                         148448
               Stack:     1792                           1800
            Graphics:        0                              0
       Private Other:   192644
              System:    17168
             Unknown:                                  198596
 
           TOTAL PSS:   541064            TOTAL RSS:   691008      TOTAL SWAP (KB):        0
```
