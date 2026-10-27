# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=405; tab Gruppi a x=412 (barra all'inizio), Growth a x=1031 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | sì |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | NO |
| 0.4s | inizio | sì |
| 0.4s | fine | NO |
| 0.7s | inizio | sì |
| 0.7s | fine | NO |
| 1.0s | inizio | sì |
| 1.0s | fine | NO |
| 1.5s | inizio | sì |
| 1.5s | fine | NO |
| 0s | inizio | sì |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | NO |
| 0.4s | inizio | sì |
| 0.4s | fine | NO |
| 0.7s | inizio | sì |
| 0.7s | fine | NO |
| 1.0s | inizio | sì |
| 1.0s | fine | NO |
| 1.5s | inizio | sì |
| 1.5s | fine | NO |
| controllo | fermo | sì |
| controllo | fermo | NO |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |

Tap arrivati: 19 su 32

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-27 15:04:08.962 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata progressi dopo=535088ms
10-27 15:04:09.050 10137 10160 I ReactNativeJS: VIBRA subtab disegnata progressi dopo=535176ms
10-27 15:04:11.255 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata inviti dopo=537381ms
10-27 15:04:11.573 10137 10160 I ReactNativeJS: VIBRA subtab disegnata inviti dopo=537699ms
10-27 15:04:13.517 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata clienti dopo=539643ms
10-27 15:04:13.620 10137 10160 I ReactNativeJS: VIBRA subtab disegnata clienti dopo=539746ms
10-27 15:04:32.372 10137 10160 I ReactNativeJS: VIBRA subtab premuto clienti dopo=558498ms
10-27 15:04:32.372 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,154 loc=29,16 target=4894
10-27 15:04:32.410 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:04:32.505 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-27 15:04:32.988 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=0
10-27 15:04:32.988 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=0
10-27 15:04:38.205 10137 10160 I ReactNativeJS: VIBRA subtab premuto albero dopo=564331ms
10-27 15:04:38.205 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=5196ms lancio=0 x=0 page=362,154 loc=8,8 target=4928
10-27 15:04:38.243 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:04:38.367 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato albero
10-27 15:04:38.828 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=239
10-27 15:04:39.005 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=239
10-27 15:04:44.041 10435 10435 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-27 15:04:44.073 10137 10160 I ReactNativeJS: VIBRA subtab premuto parco dopo=570200ms
10-27 15:04:44.074 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=5245ms lancio=0 x=239 page=49,154 loc=64,8 target=4916
10-27 15:04:44.075 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:04:44.206 10137 10160 I ReactNativeJS: VIBRA subtab premuto albero dopo=570332ms
10-27 15:04:44.206 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=5378ms lancio=0 x=239 page=157,154 loc=75,16 target=4930
10-27 15:04:44.208 10137 10160 I ReactNativeJS: VIBRA subtab albero dopo=570334ms
10-27 15:04:44.208 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-27 15:04:44.230 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=22ms
10-27 15:04:44.231 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato parco
10-27 15:04:44.239 10137 10160 I ReactNativeJS: VIBRA subtab disegnata albero dopo=31ms
10-27 15:04:44.240 10137 10160 I ReactNativeJS: VIBRA subtab cambio albero dopo=31ms
10-27 15:04:44.490 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato albero
10-27 15:04:46.755 10457 10457 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-27 15:04:46.772 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2564ms
10-27 15:04:46.772 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=1430ms lancio=0 x=157 page=362,154 loc=12,16 target=4954
10-27 15:04:46.794 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:04:46.864 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=422
10-27 15:04:46.958 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=480
10-27 15:04:46.958 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:04:49.583 10478 10478 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-27 15:04:49.606 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5397ms
10-27 15:04:49.606 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=2648ms lancio=0 x=480 page=49,154 loc=22,16 target=4954
10-27 15:04:49.606 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:04:49.754 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=182
10-27 15:04:49.755 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:04:49.883 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=0
10-27 15:04:50.022 10137 10160 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-27 15:04:50.022 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=139ms lancio=0 x=0 page=157,154 loc=20,8 target=4904
10-27 15:04:50.023 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-27 15:04:50.088 10137 10160 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-27 15:04:50.088 10137 10160 I ReactNativeJS: VIBRA subtab gruppi dopo=66ms
10-27 15:04:50.100 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata gruppi dopo=77ms
10-27 15:04:50.105 10137 10160 I ReactNativeJS: VIBRA subtab disegnata gruppi dopo=83ms
10-27 15:04:50.121 10137 10160 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=99ms
10-27 15:04:52.575 10500 10500 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-27 15:04:52.606 10137 10160 I ReactNativeJS: VIBRA subtab premuto albero dopo=2583ms
10-27 15:04:52.606 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=2723ms lancio=0 x=0 page=362,154 loc=8,8 target=4928
10-27 15:04:52.607 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:04:52.697 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=237
10-27 15:04:52.811 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=480
10-27 15:04:52.812 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato albero
10-27 15:04:55.558 10520 10520 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-27 15:04:55.590 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5567ms
10-27 15:04:55.590 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=2779ms lancio=0 x=480 page=49,154 loc=22,16 target=4954
10-27 15:04:55.591 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:04:55.721 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:04:56.088 10137 10160 I ReactNativeJS: VIBRA subtab premuto growth dopo=6065ms
10-27 15:04:56.088 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=3278ms lancio=0 x=480 page=157,154 loc=7,8 target=4964
10-27 15:04:56.090 10137 10160 I ReactNativeJS: VIBRA subtab growth dopo=6067ms
10-27 15:04:56.090 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-27 15:04:56.102 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=12ms
10-27 15:04:56.106 10137 10160 I ReactNativeJS: VIBRA subtab disegnata growth dopo=15ms
10-27 15:04:56.125 10137 10160 I ReactNativeJS: VIBRA subtab cambio growth dopo=34ms
10-27 15:04:56.599 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato growth
10-27 15:04:58.636 10543 10543 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-27 15:04:58.655 10137 10160 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2565ms
10-27 15:04:58.655 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=1552ms lancio=0 x=435 page=362,154 loc=10,16 target=4990
10-27 15:04:58.676 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:04:58.740 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=480
10-27 15:04:58.740 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=480
10-27 15:04:58.811 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-27 15:05:01.763 10564 10564 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-27 15:05:01.789 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5699ms
10-27 15:05:01.789 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=3049ms lancio=0 x=480 page=49,154 loc=22,16 target=4954
10-27 15:05:01.790 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:01.921 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:05:02.588 10137 10160 I ReactNativeJS: VIBRA subtab premuto growth dopo=6498ms
10-27 15:05:02.588 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=3848ms lancio=0 x=480 page=157,154 loc=7,8 target=4964
10-27 15:05:02.589 10137 10160 I ReactNativeJS: VIBRA subtab growth dopo=6499ms
10-27 15:05:02.589 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-27 15:05:02.622 10137 10160 I ReactNativeJS: VIBRA subtab cambio growth dopo=33ms
10-27 15:05:02.721 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato growth
10-27 15:05:05.133 10585 10585 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-27 15:05:05.155 10137 10160 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2566ms
10-27 15:05:05.155 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=6415ms lancio=0 x=480 page=362,154 loc=23,8 target=4988
10-27 15:05:05.174 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:05.239 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=480
10-27 15:05:05.239 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=480
10-27 15:05:05.332 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-27 15:05:08.512 10605 10605 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-27 15:05:08.540 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5951ms
10-27 15:05:08.540 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=3301ms lancio=0 x=480 page=49,154 loc=22,16 target=4954
10-27 15:05:08.541 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:08.672 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:05:09.639 10137 10160 I ReactNativeJS: VIBRA subtab premuto growth dopo=7050ms
10-27 15:05:09.639 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=4400ms lancio=0 x=480 page=157,154 loc=7,8 target=4964
10-27 15:05:09.642 10137 10160 I ReactNativeJS: VIBRA subtab growth dopo=7053ms
10-27 15:05:09.642 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=3ms
10-27 15:05:09.672 10137 10160 I ReactNativeJS: VIBRA subtab cambio growth dopo=30ms
10-27 15:05:09.771 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato growth
10-27 15:05:12.224 10626 10626 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-27 15:05:12.256 10137 10160 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2614ms
10-27 15:05:12.256 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=7017ms lancio=0 x=480 page=362,154 loc=23,8 target=4988
10-27 15:05:12.257 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:12.348 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=480
10-27 15:05:12.348 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=480
10-27 15:05:12.389 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-27 15:05:15.910 10646 10646 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-27 15:05:15.940 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=6298ms
10-27 15:05:15.940 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=3562ms lancio=0 x=480 page=49,154 loc=22,16 target=4954
10-27 15:05:15.941 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:16.072 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:05:17.538 10137 10160 I ReactNativeJS: VIBRA subtab premuto growth dopo=7896ms
10-27 15:05:17.538 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=5160ms lancio=0 x=480 page=157,154 loc=7,8 target=4964
10-27 15:05:17.539 10137 10160 I ReactNativeJS: VIBRA subtab growth dopo=7897ms
10-27 15:05:17.541 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=3ms
10-27 15:05:17.573 10137 10160 I ReactNativeJS: VIBRA subtab cambio growth dopo=31ms
10-27 15:05:17.671 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato growth
10-27 15:05:20.087 10667 10667 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-27 15:05:20.123 10137 10160 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2582ms
10-27 15:05:20.123 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=7745ms lancio=0 x=480 page=362,154 loc=23,8 target=4988
10-27 15:05:20.124 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:20.247 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=480
10-27 15:05:20.247 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=480
10-27 15:05:20.264 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-27 15:05:24.276 10687 10687 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-27 15:05:24.306 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=6765ms
10-27 15:05:24.306 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=4059ms lancio=0 x=480 page=49,154 loc=22,16 target=4954
10-27 15:05:24.307 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:24.410 10137 10160 I ReactNativeJS: VIBRA subtab premuto growth dopo=6868ms
10-27 15:05:24.414 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=4167ms lancio=0 x=480 page=157,154 loc=7,8 target=4964
10-27 15:05:24.426 10137 10160 I ReactNativeJS: VIBRA subtab growth dopo=6885ms
10-27 15:05:24.427 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=12ms
10-27 15:05:24.438 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:05:24.459 10137 10160 I ReactNativeJS: VIBRA subtab cambio growth dopo=32ms
10-27 15:05:24.555 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato growth
10-27 15:05:26.983 10708 10708 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-27 15:05:27.005 10137 10160 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2578ms
10-27 15:05:27.005 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=6758ms lancio=0 x=480 page=362,154 loc=23,8 target=4988
10-27 15:05:27.024 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:27.112 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=480
10-27 15:05:27.112 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=480
10-27 15:05:27.195 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-27 15:05:29.699 10729 10729 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-27 15:05:29.723 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5296ms
10-27 15:05:29.723 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=2611ms lancio=0 x=480 page=49,154 loc=22,16 target=4954
10-27 15:05:29.724 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:29.855 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:05:30.022 10137 10160 I ReactNativeJS: VIBRA subtab premuto growth dopo=5595ms
10-27 15:05:30.022 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=2910ms lancio=0 x=480 page=157,154 loc=7,8 target=4964
10-27 15:05:30.022 10137 10160 I ReactNativeJS: VIBRA subtab growth dopo=5596ms
10-27 15:05:30.022 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-27 15:05:30.056 10137 10160 I ReactNativeJS: VIBRA subtab cambio growth dopo=34ms
10-27 15:05:30.155 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato growth
10-27 15:05:32.564 10750 10750 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-27 15:05:32.589 10137 10160 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2567ms
10-27 15:05:32.589 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=5477ms lancio=0 x=480 page=362,154 loc=23,8 target=4988
10-27 15:05:32.590 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:32.671 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=480
10-27 15:05:32.672 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=480
10-27 15:05:32.754 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-27 15:05:35.462 10770 10770 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-27 15:05:35.490 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5467ms
10-27 15:05:35.490 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=2773ms lancio=0 x=480 page=49,154 loc=22,16 target=4954
10-27 15:05:35.491 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:35.621 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:05:35.989 10137 10160 I ReactNativeJS: VIBRA subtab premuto growth dopo=5967ms
10-27 15:05:35.990 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=3272ms lancio=0 x=480 page=157,154 loc=7,8 target=4964
10-27 15:05:35.990 10137 10160 I ReactNativeJS: VIBRA subtab growth dopo=5968ms
10-27 15:05:35.991 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-27 15:05:36.022 10137 10160 I ReactNativeJS: VIBRA subtab cambio growth dopo=31ms
10-27 15:05:36.121 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato growth
10-27 15:05:38.550 10792 10792 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-27 15:05:38.571 10137 10160 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2580ms
10-27 15:05:38.572 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=5854ms lancio=0 x=480 page=362,154 loc=23,8 target=4988
10-27 15:05:38.589 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:38.676 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=480
10-27 15:05:38.676 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=480
10-27 15:05:38.705 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-27 15:05:41.620 10812 10812 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-27 15:05:41.638 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5647ms
10-27 15:05:41.638 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=2959ms lancio=0 x=480 page=49,154 loc=22,16 target=4954
10-27 15:05:41.660 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:41.778 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=212
10-27 15:05:41.827 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:05:42.005 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=212
10-27 15:05:42.507 10137 10160 I ReactNativeJS: VIBRA subtab premuto albero dopo=6516ms
10-27 15:05:42.507 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=729ms lancio=0 x=212 page=157,154 loc=16,8 target=4928
10-27 15:05:42.524 10137 10160 I ReactNativeJS: VIBRA subtab albero dopo=6533ms
10-27 15:05:42.525 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=18ms
10-27 15:05:42.542 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=17ms
10-27 15:05:42.557 10137 10160 I ReactNativeJS: VIBRA subtab disegnata albero dopo=31ms
10-27 15:05:42.557 10137 10160 I ReactNativeJS: VIBRA subtab cambio albero dopo=32ms
10-27 15:05:43.021 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato albero
10-27 15:05:45.095 10834 10834 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-27 15:05:45.141 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2616ms
10-27 15:05:45.141 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=1476ms lancio=0 x=157 page=362,154 loc=12,16 target=4954
10-27 15:05:45.157 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:45.288 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=416
10-27 15:05:45.340 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:05:45.428 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=480
10-27 15:05:48.567 10854 10854 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-27 15:05:48.588 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=6063ms
10-27 15:05:48.588 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=3161ms lancio=0 x=480 page=49,154 loc=22,16 target=4954
10-27 15:05:48.613 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:48.709 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=275
10-27 15:05:48.722 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:05:48.789 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=275
10-27 15:05:49.755 10137 10160 I ReactNativeJS: VIBRA subtab premuto comitive dopo=7230ms
10-27 15:05:49.755 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=1046ms lancio=0 x=275 page=157,154 loc=24,16 target=4942
10-27 15:05:49.756 10137 10160 I ReactNativeJS: VIBRA subtab comitive dopo=7231ms
10-27 15:05:49.756 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-27 15:05:49.781 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=25ms
10-27 15:05:49.789 10137 10160 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=33ms
10-27 15:05:49.789 10137 10160 I ReactNativeJS: VIBRA subtab cambio comitive dopo=33ms
10-27 15:05:49.908 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-27 15:05:52.323 10879 10879 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-27 15:05:52.356 10137 10160 I ReactNativeJS: VIBRA subtab premuto growth dopo=2600ms
10-27 15:05:52.356 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=2298ms lancio=0 x=250 page=362,154 loc=14,16 target=4966
10-27 15:05:52.357 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:52.455 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=480
10-27 15:05:52.455 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=480
10-27 15:05:52.513 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato growth
10-27 15:05:56.034 10899 10899 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-27 15:05:56.055 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=6299ms
10-27 15:05:56.055 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=3644ms lancio=0 x=480 page=49,154 loc=22,16 target=4954
10-27 15:05:56.074 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:05:56.229 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=210
10-27 15:05:56.232 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:05:56.342 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=210
10-27 15:05:57.775 10137 10160 I ReactNativeJS: VIBRA subtab premuto albero dopo=8019ms
10-27 15:05:57.775 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=1613ms lancio=0 x=210 page=157,154 loc=13,8 target=4928
10-27 15:05:57.792 10137 10160 I ReactNativeJS: VIBRA subtab albero dopo=8035ms
10-27 15:05:57.792 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=17ms
10-27 15:05:57.816 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=24ms
10-27 15:05:57.828 10137 10160 I ReactNativeJS: VIBRA subtab disegnata albero dopo=36ms
10-27 15:05:57.828 10137 10160 I ReactNativeJS: VIBRA subtab cambio albero dopo=36ms
10-27 15:05:58.140 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato albero
10-27 15:06:00.328 10920 10920 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-27 15:06:00.356 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2564ms
10-27 15:06:00.356 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=1654ms lancio=0 x=157 page=362,154 loc=12,16 target=4954
10-27 15:06:00.357 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:06:00.470 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=448
10-27 15:06:00.583 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=480
10-27 15:06:00.584 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:06:04.539 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=6747ms
10-27 15:06:04.539 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=3956ms lancio=0 x=480 page=49,154 loc=22,16 target=4954
10-27 15:06:04.557 10137 10160 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-27 15:06:04.701 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:06:05.222 10137 10160 I ReactNativeJS: VIBRA hscroll lancio x=182
10-27 15:06:05.340 10137 10160 I ReactNativeJS: VIBRA hscroll ferma x=182
10-27 15:06:08.235 10941 10941 I ReactNativeJS: VIBRA prova controllo senza-lancio
10-27 15:06:08.274 10137 10160 I ReactNativeJS: VIBRA subtab premuto comitive dopo=10482ms
10-27 15:06:08.275 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=3053ms lancio=0 x=182 page=265,154 loc=8,8 target=4940
10-27 15:06:08.293 10137 10160 I ReactNativeJS: VIBRA subtab comitive dopo=10497ms
10-27 15:06:08.293 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=18ms
10-27 15:06:08.313 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=20ms
10-27 15:06:08.329 10137 10160 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=36ms
10-27 15:06:08.362 10137 10160 I ReactNativeJS: VIBRA subtab cambio comitive dopo=69ms
10-27 15:06:08.469 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-27 15:06:10.839 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=2262ms lancio=0 x=250 page=157,154 loc=391,20 target=4992
10-27 15:06:10.839 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-27 15:06:13.405 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2566ms
10-27 15:06:13.405 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=4829ms lancio=0 x=250 page=265,154 loc=8,16 target=4954
10-27 15:06:13.406 10137 10160 I ReactNativeJS: VIBRA subtab tabelle dopo=2566ms
10-27 15:06:13.406 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-27 15:06:13.417 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=12ms
10-27 15:06:13.422 10137 10160 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=16ms
10-27 15:06:13.441 10137 10160 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=35ms
10-27 15:06:14.591 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:06:16.072 10137 10160 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2666ms
10-27 15:06:16.073 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=220ms lancio=0 x=344 page=157,154 loc=93,16 target=4942
10-27 15:06:16.074 10137 10160 I ReactNativeJS: VIBRA subtab comitive dopo=2668ms
10-27 15:06:16.077 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-27 15:06:16.095 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=18ms
10-27 15:06:16.106 10137 10160 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=29ms
10-27 15:06:16.108 10137 10160 I ReactNativeJS: VIBRA subtab cambio comitive dopo=31ms
10-27 15:06:16.427 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-27 15:06:18.621 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2545ms
10-27 15:06:18.622 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=2046ms lancio=0 x=250 page=265,154 loc=8,16 target=4954
10-27 15:06:18.622 10137 10160 I ReactNativeJS: VIBRA subtab tabelle dopo=2545ms
10-27 15:06:18.622 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-27 15:06:18.633 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=11ms
10-27 15:06:18.638 10137 10160 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=16ms
10-27 15:06:18.658 10137 10160 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=36ms
10-27 15:06:19.619 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:06:21.238 10137 10160 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2616ms
10-27 15:06:21.238 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=404ms lancio=0 x=344 page=157,154 loc=93,16 target=4942
10-27 15:06:21.239 10137 10160 I ReactNativeJS: VIBRA subtab comitive dopo=2617ms
10-27 15:06:21.239 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-27 15:06:21.253 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=14ms
10-27 15:06:21.255 10137 10160 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=16ms
10-27 15:06:21.273 10137 10160 I ReactNativeJS: VIBRA subtab cambio comitive dopo=33ms
10-27 15:06:21.435 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-27 15:06:23.788 10137 10160 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2549ms
10-27 15:06:23.788 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=2138ms lancio=0 x=250 page=265,154 loc=8,16 target=4954
10-27 15:06:23.789 10137 10160 I ReactNativeJS: VIBRA subtab tabelle dopo=2550ms
10-27 15:06:23.789 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-27 15:06:23.801 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=12ms
10-27 15:06:23.805 10137 10160 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=16ms
10-27 15:06:23.824 10137 10160 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=34ms
10-27 15:06:24.850 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-27 15:06:26.481 10137 10160 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2692ms
10-27 15:06:26.482 10137 10160 I ReactNativeJS: VIBRA hscroll tocco dopo=385ms lancio=0 x=344 page=157,154 loc=93,16 target=4942
10-27 15:06:26.522 10137 10160 I ReactNativeJS: VIBRA subtab comitive dopo=2732ms
10-27 15:06:26.522 10137 10160 I ReactNativeJS: VIBRA hscroll fine-tocco durata=40ms
10-27 15:06:26.536 10137 10160 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=14ms
10-27 15:06:26.540 10137 10160 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=18ms
10-27 15:06:26.555 10137 10160 I ReactNativeJS: VIBRA subtab cambio comitive dopo=33ms
10-27 15:06:26.711 10137 10160 I ReactNativeJS: VIBRA subtab rilasciato comitive
```
