# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 17447 ms da app chiusa (di cui 2949 ms prima della prima riga di JS) · originale 2114 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 1664 | 1498 | ❌ | 2285 | 230 | ❌ | 88% | –% |
| /clienti | 274 | 739 | ✅ | 761 | 416 | ❌ | 87.9% | –% |
| /promoter | 1579 | 318 | ❌ | 802 | 561 | ❌ | 87.6% | –% |
| /promoter/prom000000000000000001 | 1778 | 1829 | ✅ | 719 | 1035 | ✅ | 87.1% | –% |
| /locali | 724 | 697 | ❌ | 346 | 206 | ❌ | 86.6% | –% |
| /report | 173 | 120 | ❌ | 150 | 311 | ✅ | 87.2% | –% |
| /messaggi | 296 | 397 | ✅ | 197 | 55 | ❌ | –% | –% |
| /importa-serata | 193 | 121 | ❌ | 166 | 184 | ✅ | 85.1% | –% |
| /impostazioni-app | 212 | 225 | ✅ | 174 | 34 | ❌ | 83.6% | –% |
| /admin-console | 308 | 376 | ✅ | 195 | 280 | ✅ | 85.9% | –% |
| /clienti-analytics | 4444 | 540 | ❌ | 3817 | 161 | ❌ | 85.9% | –% |
| /academy | 3203 | 1237 | ❌ | 3352 | 213 | ❌ | 84.3% | –% |
| /notifiche | 167 | 61 | ❌ | 168 | 473 | ✅ | 82.3% | –% |
| /dashboard | 1016 | 635 | ❌ | 902 | 109 | ❌ | 86.5% | –% |

Memoria (PSS): nativa 1037 MB · originale (Chrome) 370 MB
