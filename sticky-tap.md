# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=405; tab Gruppi a x=412 (barra all'inizio), Growth a x=987 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | sì |
| 0s | fine | sì |
| 0.2s | inizio | sì |
| 0.2s | fine | sì |
| 0.4s | inizio | sì |
| 0.4s | fine | NO |
| 0.7s | inizio | sì |
| 0.7s | fine | sì |
| 1.0s | inizio | sì |
| 1.0s | fine | NO |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |
| 0s | inizio | sì |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | sì |
| 0.4s | inizio | NO |
| 0.4s | fine | sì |
| 0.7s | inizio | sì |
| 0.7s | fine | NO |
| 1.0s | inizio | sì |
| 1.0s | fine | sì |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |

Tap arrivati: 27 su 32

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-20 03:24:41.827 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata progressi dopo=671523ms
10-20 03:24:41.869 10230 10254 I ReactNativeJS: VIBRA subtab disegnata progressi dopo=671565ms
10-20 03:24:45.207 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata inviti dopo=674903ms
10-20 03:24:45.735 10230 10254 I ReactNativeJS: VIBRA subtab disegnata inviti dopo=675431ms
10-20 03:24:51.257 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata clienti dopo=680953ms
10-20 03:24:51.922 10230 10254 I ReactNativeJS: VIBRA subtab disegnata clienti dopo=681618ms
10-20 03:25:09.676 10230 10254 I ReactNativeJS: VIBRA subtab premuto clienti dopo=699372ms
10-20 03:25:09.677 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,154 loc=29,16 target=17116
10-20 03:25:09.713 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:25:09.811 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-20 03:25:10.293 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=0
10-20 03:25:10.293 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=0
10-20 03:25:15.510 10230 10254 I ReactNativeJS: VIBRA subtab premuto albero dopo=705206ms
10-20 03:25:15.510 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=5199ms lancio=0 x=0 page=362,154 loc=8,8 target=17150
10-20 03:25:15.547 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:25:15.829 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato albero
10-20 03:25:16.320 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=273
10-20 03:25:16.427 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=273
10-20 03:25:21.504 10511 10511 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-20 03:25:21.527 10230 10254 I ReactNativeJS: VIBRA subtab premuto albero dopo=711223ms
10-20 03:25:21.527 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=5405ms lancio=0 x=273 page=49,154 loc=0,16 target=17152
10-20 03:25:21.528 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:25:21.852 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=0
10-20 03:25:21.855 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=0
10-20 03:25:21.855 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato albero
10-20 03:25:21.952 10230 10254 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-20 03:25:21.954 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=102ms lancio=0 x=0 page=157,154 loc=20,8 target=17126
10-20 03:25:21.955 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-20 03:25:22.242 10230 10254 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-20 03:25:22.242 10230 10254 I ReactNativeJS: VIBRA subtab gruppi dopo=287ms
10-20 03:25:22.285 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata gruppi dopo=330ms
10-20 03:25:22.296 10230 10254 I ReactNativeJS: VIBRA subtab disegnata gruppi dopo=341ms
10-20 03:25:22.297 10230 10254 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=342ms
10-20 03:25:24.502 10533 10533 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-20 03:25:24.527 10230 10254 I ReactNativeJS: VIBRA subtab premuto albero dopo=2572ms
10-20 03:25:24.528 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=2676ms lancio=0 x=0 page=362,154 loc=8,8 target=17150
10-20 03:25:24.529 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:25:24.687 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=279
10-20 03:25:24.688 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato albero
10-20 03:25:24.797 10230 10254 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-20 03:25:24.797 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=110ms lancio=1 x=279 page=376,154 loc=26,8 target=17186
10-20 03:25:24.933 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=136ms
10-20 03:25:25.056 10230 10254 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-20 03:25:25.057 10230 10254 I ReactNativeJS: VIBRA subtab growth dopo=123ms
10-20 03:25:25.111 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=178ms
10-20 03:25:25.111 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=279
10-20 03:25:25.127 10230 10254 I ReactNativeJS: VIBRA subtab disegnata growth dopo=193ms
10-20 03:25:25.127 10230 10254 I ReactNativeJS: VIBRA subtab cambio growth dopo=194ms
10-20 03:25:27.792 10553 10553 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-20 03:25:27.861 10230 10254 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2928ms
10-20 03:25:27.861 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=856ms lancio=0 x=435 page=49,154 loc=45,8 target=17162
10-20 03:25:27.878 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:25:28.252 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-20 03:25:28.434 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=178
10-20 03:25:28.714 10230 10254 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-20 03:25:28.715 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=463ms lancio=1 x=178 page=157,154 loc=14,16 target=17152
10-20 03:25:28.716 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-20 03:25:28.716 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=178
10-20 03:25:28.776 10230 10254 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-20 03:25:28.776 10230 10254 I ReactNativeJS: VIBRA subtab albero dopo=61ms
10-20 03:25:28.807 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=92ms
10-20 03:25:28.811 10230 10254 I ReactNativeJS: VIBRA subtab disegnata albero dopo=95ms
10-20 03:25:28.813 10230 10254 I ReactNativeJS: VIBRA subtab cambio albero dopo=98ms
10-20 03:25:31.256 10573 10573 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-20 03:25:31.276 10230 10254 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2561ms
10-20 03:25:31.276 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1744ms lancio=0 x=157 page=362,154 loc=12,16 target=17176
10-20 03:25:31.294 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:25:31.444 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-20 03:25:31.561 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=434
10-20 03:25:31.762 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=434
10-20 03:25:31.845 10230 10254 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3130ms
10-20 03:25:31.857 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=418ms lancio=0 x=434 page=376,154 loc=23,16 target=17212
10-20 03:25:31.858 10230 10254 I ReactNativeJS: VIBRA subtab mappa dopo=3142ms
10-20 03:25:31.859 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-20 03:25:31.892 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=33ms
10-20 03:25:31.910 10230 10254 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=51ms
10-20 03:25:31.910 10230 10254 I ReactNativeJS: VIBRA subtab cambio mappa dopo=51ms
10-20 03:25:32.124 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-20 03:25:34.691 10706 10706 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-20 03:25:35.300 10230 10254 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3441ms
10-20 03:25:35.308 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=2731ms lancio=0 x=480 page=49,154 loc=22,16 target=17176
10-20 03:25:35.319 10230 10254 I ReactNativeJS: VIBRA subtab tabelle dopo=3459ms
10-20 03:25:35.319 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=11ms
10-20 03:25:35.460 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=141ms
10-20 03:25:35.537 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-20 03:25:35.537 10230 10254 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=218ms
10-20 03:25:35.537 10230 10254 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=218ms
10-20 03:25:38.935 10730 10730 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-20 03:25:42.403 10752 10752 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-20 03:25:43.662 10230 10254 I ReactNativeJS: VIBRA subtab premuto comitive dopo=8344ms
10-20 03:25:43.663 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=372ms lancio=0 x=344 page=157,154 loc=93,16 target=17164
10-20 03:25:43.664 10230 10254 I ReactNativeJS: VIBRA subtab comitive dopo=8345ms
10-20 03:25:43.665 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-20 03:25:43.736 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=71ms
10-20 03:25:43.750 10230 10254 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=85ms
10-20 03:25:43.751 10230 10254 I ReactNativeJS: VIBRA subtab cambio comitive dopo=86ms
10-20 03:25:44.278 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-20 03:25:46.217 10773 10773 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-20 03:25:46.244 10230 10254 I ReactNativeJS: VIBRA subtab premuto growth dopo=2579ms
10-20 03:25:46.244 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1317ms lancio=0 x=250 page=362,154 loc=14,16 target=17188
10-20 03:25:46.245 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:25:46.505 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=480
10-20 03:25:46.505 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=480
10-20 03:25:46.506 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato growth
10-20 03:25:47.278 10230 10254 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3613ms
10-20 03:25:47.278 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=773ms lancio=0 x=480 page=376,154 loc=37,8 target=17210
10-20 03:25:47.293 10230 10254 I ReactNativeJS: VIBRA subtab mappa dopo=3628ms
10-20 03:25:47.293 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=15ms
10-20 03:25:47.315 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=22ms
10-20 03:25:47.327 10230 10254 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=34ms
10-20 03:25:47.328 10230 10254 I ReactNativeJS: VIBRA subtab cambio mappa dopo=35ms
10-20 03:25:47.435 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-20 03:25:50.232 10818 10818 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-20 03:25:50.560 10230 10254 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3267ms
10-20 03:25:50.562 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=4057ms lancio=0 x=480 page=49,154 loc=22,16 target=17176
10-20 03:25:50.564 10230 10254 I ReactNativeJS: VIBRA subtab tabelle dopo=3271ms
10-20 03:25:50.565 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=3ms
10-20 03:25:50.596 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=31ms
10-20 03:25:50.634 10230 10254 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=68ms
10-20 03:25:50.858 10230 10254 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=292ms
10-20 03:25:50.858 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-20 03:25:54.750 10839 10839 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-20 03:25:58.862 10863 10863 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-20 03:25:58.895 10230 10254 I ReactNativeJS: VIBRA subtab premuto albero dopo=8329ms
10-20 03:25:58.895 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1189ms lancio=0 x=344 page=49,154 loc=72,16 target=17152
10-20 03:25:58.895 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:25:59.028 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato albero
10-20 03:26:00.495 10230 10254 I ReactNativeJS: VIBRA subtab premuto comitive dopo=9930ms
10-20 03:26:00.495 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=2789ms lancio=0 x=344 page=157,154 loc=93,16 target=17164
10-20 03:26:00.510 10230 10254 I ReactNativeJS: VIBRA subtab comitive dopo=9945ms
10-20 03:26:00.510 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=15ms
10-20 03:26:00.529 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=18ms
10-20 03:26:00.545 10230 10254 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=35ms
10-20 03:26:00.546 10230 10254 I ReactNativeJS: VIBRA subtab cambio comitive dopo=35ms
10-20 03:26:00.824 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-20 03:26:03.056 10885 10885 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-20 03:26:03.076 10230 10254 I ReactNativeJS: VIBRA subtab premuto growth dopo=2566ms
10-20 03:26:03.077 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1547ms lancio=0 x=250 page=362,154 loc=14,16 target=17188
10-20 03:26:03.094 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:26:03.332 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato growth
10-20 03:26:03.541 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=480
10-20 03:26:03.541 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=480
10-20 03:26:05.076 10230 10254 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4566ms
10-20 03:26:05.077 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1745ms lancio=0 x=480 page=376,154 loc=37,8 target=17210
10-20 03:26:05.077 10230 10254 I ReactNativeJS: VIBRA subtab mappa dopo=4567ms
10-20 03:26:05.077 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-20 03:26:05.090 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=13ms
10-20 03:26:05.093 10230 10254 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=16ms
10-20 03:26:05.111 10230 10254 I ReactNativeJS: VIBRA subtab cambio mappa dopo=34ms
10-20 03:26:05.288 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-20 03:26:08.024 10929 10929 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-20 03:26:08.709 10230 10254 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3632ms
10-20 03:26:08.725 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=5393ms lancio=0 x=480 page=49,154 loc=22,16 target=17176
10-20 03:26:08.731 10230 10254 I ReactNativeJS: VIBRA subtab tabelle dopo=3654ms
10-20 03:26:08.732 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=7ms
10-20 03:26:08.772 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=40ms
10-20 03:26:08.785 10230 10254 I ReactNativeJS: VIBRA subtab premuto growth dopo=53ms
10-20 03:26:08.785 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=5453ms lancio=0 x=480 page=157,154 loc=7,8 target=17186
10-20 03:26:08.786 10230 10254 I ReactNativeJS: VIBRA subtab growth dopo=54ms
10-20 03:26:08.786 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-20 03:26:08.815 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=29ms
10-20 03:26:08.816 10230 10254 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=30ms
10-20 03:26:08.827 10230 10254 I ReactNativeJS: VIBRA subtab disegnata growth dopo=41ms
10-20 03:26:08.827 10230 10254 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=41ms
10-20 03:26:08.827 10230 10254 I ReactNativeJS: VIBRA subtab cambio growth dopo=41ms
10-20 03:26:10.353 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-20 03:26:10.353 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato growth
10-20 03:26:11.498 10950 10950 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-20 03:26:14.422 10971 10971 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-20 03:26:14.443 10230 10254 I ReactNativeJS: VIBRA subtab premuto comitive dopo=5657ms
10-20 03:26:14.443 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=2542ms lancio=0 x=435 page=49,154 loc=45,8 target=17162
10-20 03:26:14.461 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:26:14.831 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-20 03:26:15.037 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=158
10-20 03:26:15.378 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=158
10-20 03:26:15.379 10230 10254 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-20 03:26:15.380 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=552ms lancio=0 x=158 page=157,154 loc=123,16 target=17140
10-20 03:26:15.382 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-20 03:26:15.443 10230 10254 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-20 03:26:15.444 10230 10254 I ReactNativeJS: VIBRA subtab parco dopo=63ms
10-20 03:26:15.475 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata parco dopo=93ms
10-20 03:26:15.480 10230 10254 I ReactNativeJS: VIBRA subtab disegnata parco dopo=98ms
10-20 03:26:15.480 10230 10254 I ReactNativeJS: VIBRA subtab cambio parco dopo=99ms
10-20 03:26:17.943 10993 10993 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-20 03:26:17.963 10230 10254 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2581ms
10-20 03:26:17.963 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1964ms lancio=0 x=50 page=362,154 loc=4,16 target=17164
10-20 03:26:17.978 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:26:18.197 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-20 03:26:18.307 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=300
10-20 03:26:18.460 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=300
10-20 03:26:18.531 10230 10254 I ReactNativeJS: VIBRA subtab premuto growth dopo=3149ms
10-20 03:26:18.533 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=351ms lancio=0 x=300 page=376,154 loc=78,16 target=17188
10-20 03:26:18.546 10230 10254 I ReactNativeJS: VIBRA subtab growth dopo=3165ms
10-20 03:26:18.550 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=17ms
10-20 03:26:18.572 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=22ms
10-20 03:26:18.578 10230 10254 I ReactNativeJS: VIBRA subtab disegnata growth dopo=29ms
10-20 03:26:18.578 10230 10254 I ReactNativeJS: VIBRA subtab cambio growth dopo=29ms
10-20 03:26:19.228 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato growth
10-20 03:26:21.290 11014 11014 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-20 03:26:21.557 10230 10254 I ReactNativeJS: VIBRA subtab premuto comitive dopo=3008ms
10-20 03:26:21.558 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1039ms lancio=0 x=435 page=49,154 loc=45,8 target=17162
10-20 03:26:21.559 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:26:21.820 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-20 03:26:24.813 11034 11034 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-20 03:26:25.343 10230 10254 I ReactNativeJS: VIBRA subtab premuto mappa dopo=6793ms
10-20 03:26:25.343 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=4825ms lancio=0 x=435 page=376,154 loc=24,16 target=17212
10-20 03:26:25.344 10230 10254 I ReactNativeJS: VIBRA subtab mappa dopo=6794ms
10-20 03:26:25.344 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-20 03:26:25.357 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=13ms
10-20 03:26:25.360 10230 10254 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=16ms
10-20 03:26:25.378 10230 10254 I ReactNativeJS: VIBRA subtab cambio mappa dopo=34ms
10-20 03:26:25.653 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-20 03:26:28.102 11078 11078 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-20 03:26:28.724 10230 10254 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3380ms
10-20 03:26:28.724 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=2845ms lancio=0 x=480 page=49,154 loc=22,16 target=17176
10-20 03:26:28.734 10230 10254 I ReactNativeJS: VIBRA subtab tabelle dopo=3390ms
10-20 03:26:28.735 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=10ms
10-20 03:26:28.755 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=20ms
10-20 03:26:28.919 10230 10254 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=184ms
10-20 03:26:28.919 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-20 03:26:28.937 10230 10254 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=202ms
10-20 03:26:32.924 11099 11099 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-20 03:26:36.407 11120 11120 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-20 03:26:36.427 10230 10254 I ReactNativeJS: VIBRA subtab premuto albero dopo=7693ms
10-20 03:26:36.427 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=969ms lancio=0 x=344 page=49,154 loc=72,16 target=17152
10-20 03:26:36.445 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:26:36.831 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato albero
10-20 03:26:37.154 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=94
10-20 03:26:37.759 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=94
10-20 03:26:38.193 10230 10254 I ReactNativeJS: VIBRA subtab premuto parco dopo=9459ms
10-20 03:26:38.193 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1363ms lancio=0 x=94 page=157,154 loc=26,8 target=17138
10-20 03:26:38.195 10230 10254 I ReactNativeJS: VIBRA subtab parco dopo=9460ms
10-20 03:26:38.195 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-20 03:26:38.211 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata parco dopo=16ms
10-20 03:26:38.227 10230 10254 I ReactNativeJS: VIBRA subtab disegnata parco dopo=32ms
10-20 03:26:38.227 10230 10254 I ReactNativeJS: VIBRA subtab cambio parco dopo=32ms
10-20 03:26:38.406 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato parco
10-20 03:26:40.744 11143 11143 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-20 03:26:40.778 10230 10254 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2583ms
10-20 03:26:40.778 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1842ms lancio=0 x=50 page=362,154 loc=4,16 target=17164
10-20 03:26:40.779 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:26:40.972 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-20 03:26:41.045 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=365
10-20 03:26:41.328 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=365
10-20 03:26:42.193 10230 10254 I ReactNativeJS: VIBRA subtab premuto analitica dopo=3998ms
10-20 03:26:42.193 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1222ms lancio=0 x=365 page=376,154 loc=21,8 target=17198
10-20 03:26:42.195 10230 10254 I ReactNativeJS: VIBRA subtab analitica dopo=4000ms
10-20 03:26:42.195 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-20 03:26:42.208 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=13ms
10-20 03:26:42.228 10230 10254 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=33ms
10-20 03:26:42.228 10230 10254 I ReactNativeJS: VIBRA subtab cambio analitica dopo=33ms
10-20 03:26:42.689 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-20 03:26:44.741 11165 11165 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-20 03:26:44.760 10230 10254 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2565ms
10-20 03:26:44.760 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1558ms lancio=0 x=480 page=49,154 loc=22,16 target=17176
10-20 03:26:44.778 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:26:44.973 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-20 03:26:45.145 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=219
10-20 03:26:45.344 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=219
10-20 03:26:46.676 10230 10254 I ReactNativeJS: VIBRA subtab premuto albero dopo=4482ms
10-20 03:26:46.676 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1704ms lancio=0 x=219 page=157,154 loc=22,8 target=17150
10-20 03:26:46.677 10230 10254 I ReactNativeJS: VIBRA subtab albero dopo=4482ms
10-20 03:26:46.677 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-20 03:26:46.691 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=13ms
10-20 03:26:46.693 10230 10254 I ReactNativeJS: VIBRA subtab disegnata albero dopo=16ms
10-20 03:26:46.711 10230 10254 I ReactNativeJS: VIBRA subtab cambio albero dopo=34ms
10-20 03:26:47.077 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato albero
10-20 03:26:49.226 11186 11186 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-20 03:26:49.244 10230 10254 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2567ms
10-20 03:26:49.244 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=2105ms lancio=0 x=157 page=362,154 loc=12,16 target=17176
10-20 03:26:49.261 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:26:49.422 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-20 03:26:49.531 10230 10254 I ReactNativeJS: VIBRA hscroll lancio x=412
10-20 03:26:49.760 10230 10254 I ReactNativeJS: VIBRA hscroll ferma x=412
10-20 03:26:51.126 10230 10254 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4449ms
10-20 03:26:51.127 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1705ms lancio=0 x=412 page=376,154 loc=1,16 target=17212
10-20 03:26:51.128 10230 10254 I ReactNativeJS: VIBRA subtab mappa dopo=4450ms
10-20 03:26:51.128 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-20 03:26:51.141 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=13ms
10-20 03:26:51.143 10230 10254 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=15ms
10-20 03:26:51.160 10230 10254 I ReactNativeJS: VIBRA subtab cambio mappa dopo=33ms
10-20 03:26:51.326 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-20 03:26:54.087 10230 10254 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2959ms
10-20 03:26:54.090 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=2227ms lancio=0 x=480 page=49,154 loc=22,16 target=17176
10-20 03:26:54.226 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-20 03:26:54.227 10230 10254 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-20 03:26:58.256 11230 11230 I ReactNativeJS: VIBRA prova controllo senza-lancio
10-20 03:26:58.446 10230 10254 I ReactNativeJS: VIBRA subtab premuto analitica dopo=7318ms
10-20 03:26:58.446 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=6584ms lancio=0 x=480 page=265,154 loc=25,8 target=17198
10-20 03:26:58.451 10230 10254 I ReactNativeJS: VIBRA subtab analitica dopo=7323ms
10-20 03:26:58.451 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=5ms
10-20 03:26:58.472 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=21ms
10-20 03:26:58.479 10230 10254 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=28ms
10-20 03:26:58.479 10230 10254 I ReactNativeJS: VIBRA subtab cambio analitica dopo=28ms
10-20 03:26:59.668 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-20 03:27:01.210 10230 10254 I ReactNativeJS: VIBRA subtab premuto growth dopo=2759ms
10-20 03:27:01.211 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=9348ms lancio=0 x=480 page=157,154 loc=7,8 target=17186
10-20 03:27:01.212 10230 10254 I ReactNativeJS: VIBRA subtab growth dopo=2761ms
10-20 03:27:01.212 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-20 03:27:01.249 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=38ms
10-20 03:27:01.262 10230 10254 I ReactNativeJS: VIBRA subtab disegnata growth dopo=51ms
10-20 03:27:01.262 10230 10254 I ReactNativeJS: VIBRA subtab cambio growth dopo=51ms
10-20 03:27:02.148 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato growth
10-20 03:27:03.994 10230 10254 I ReactNativeJS: VIBRA subtab premuto analitica dopo=2783ms
10-20 03:27:03.995 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1005ms lancio=0 x=435 page=265,154 loc=12,16 target=17200
10-20 03:27:04.188 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-20 03:27:04.194 10230 10254 I ReactNativeJS: VIBRA subtab analitica dopo=2983ms
10-20 03:27:04.195 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=200ms
10-20 03:27:04.253 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=59ms
10-20 03:27:04.263 10230 10254 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=68ms
10-20 03:27:04.263 10230 10254 I ReactNativeJS: VIBRA subtab cambio analitica dopo=68ms
10-20 03:27:06.793 10230 10254 I ReactNativeJS: VIBRA subtab premuto growth dopo=2599ms
10-20 03:27:06.793 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1358ms lancio=0 x=480 page=157,154 loc=7,8 target=17186
10-20 03:27:06.794 10230 10254 I ReactNativeJS: VIBRA subtab growth dopo=2600ms
10-20 03:27:06.794 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-20 03:27:06.815 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=21ms
10-20 03:27:06.827 10230 10254 I ReactNativeJS: VIBRA subtab disegnata growth dopo=33ms
10-20 03:27:06.827 10230 10254 I ReactNativeJS: VIBRA subtab cambio growth dopo=33ms
10-20 03:27:07.762 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato growth
10-20 03:27:09.877 10230 10254 I ReactNativeJS: VIBRA subtab premuto analitica dopo=3082ms
10-20 03:27:09.877 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1168ms lancio=0 x=435 page=265,154 loc=12,16 target=17200
10-20 03:27:09.966 10230 10254 I ReactNativeJS: VIBRA subtab analitica dopo=3171ms
10-20 03:27:09.968 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=89ms
10-20 03:27:10.021 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=54ms
10-20 03:27:10.245 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-20 03:27:10.245 10230 10254 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=279ms
10-20 03:27:10.450 10230 10254 I ReactNativeJS: VIBRA subtab cambio analitica dopo=485ms
10-20 03:27:12.545 10230 10254 I ReactNativeJS: VIBRA subtab premuto growth dopo=2579ms
10-20 03:27:12.545 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=633ms lancio=0 x=480 page=157,154 loc=7,8 target=17186
10-20 03:27:12.560 10230 10254 I ReactNativeJS: VIBRA subtab growth dopo=2594ms
10-20 03:27:12.560 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=15ms
10-20 03:27:12.576 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=16ms
10-20 03:27:12.593 10230 10254 I ReactNativeJS: VIBRA subtab disegnata growth dopo=33ms
10-20 03:27:12.594 10230 10254 I ReactNativeJS: VIBRA subtab cambio growth dopo=34ms
10-20 03:27:13.661 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato growth
10-20 03:27:15.517 10230 10254 I ReactNativeJS: VIBRA subtab premuto analitica dopo=2957ms
10-20 03:27:15.518 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1210ms lancio=0 x=435 page=265,154 loc=12,16 target=17200
10-20 03:27:15.549 10230 10254 I ReactNativeJS: VIBRA subtab analitica dopo=2989ms
10-20 03:27:15.549 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=31ms
10-20 03:27:15.571 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=22ms
10-20 03:27:15.578 10230 10254 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=29ms
10-20 03:27:15.578 10230 10254 I ReactNativeJS: VIBRA subtab cambio analitica dopo=29ms
10-20 03:27:16.296 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-20 03:27:18.127 10230 10254 I ReactNativeJS: VIBRA subtab premuto growth dopo=2578ms
10-20 03:27:18.127 10230 10254 I ReactNativeJS: VIBRA hscroll tocco dopo=1386ms lancio=0 x=480 page=157,154 loc=7,8 target=17186
10-20 03:27:18.128 10230 10254 I ReactNativeJS: VIBRA subtab growth dopo=2579ms
10-20 03:27:18.128 10230 10254 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-20 03:27:18.148 10230 10254 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=20ms
10-20 03:27:18.160 10230 10254 I ReactNativeJS: VIBRA subtab disegnata growth dopo=32ms
10-20 03:27:18.160 10230 10254 I ReactNativeJS: VIBRA subtab cambio growth dopo=32ms
10-20 03:27:19.115 10230 10254 I ReactNativeJS: VIBRA subtab rilasciato growth
```
