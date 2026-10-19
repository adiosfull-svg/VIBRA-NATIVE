# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=405; tab Gruppi a x=412 (barra all'inizio), Growth a x=1015 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | sì |
| 0s | fine | sì |
| 0.2s | inizio | sì |
| 0.2s | fine | NO |
| 0.4s | inizio | NO |
| 0.4s | fine | sì |
| 0.7s | inizio | sì |
| 0.7s | fine | NO |
| 1.0s | inizio | sì |
| 1.0s | fine | sì |
| 1.5s | inizio | sì |
| 1.5s | fine | NO |
| 0s | inizio | sì |
| 0s | fine | sì |
| 0.2s | inizio | sì |
| 0.2s | fine | sì |
| 0.4s | inizio | NO |
| 0.4s | fine | sì |
| 0.7s | inizio | sì |
| 0.7s | fine | sì |
| 1.0s | inizio | sì |
| 1.0s | fine | NO |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | NO |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |

Tap arrivati: 25 su 32

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-19 21:13:15.752 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata progressi dopo=761552ms
10-19 21:13:15.806 10352 10376 I ReactNativeJS: VIBRA subtab disegnata progressi dopo=761605ms
10-19 21:13:18.845 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata inviti dopo=764644ms
10-19 21:13:19.282 10352 10376 I ReactNativeJS: VIBRA subtab disegnata inviti dopo=765081ms
10-19 21:13:26.244 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata clienti dopo=772043ms
10-19 21:13:26.563 10352 10376 I ReactNativeJS: VIBRA subtab disegnata clienti dopo=772362ms
10-19 21:13:47.922 10352 10376 I ReactNativeJS: VIBRA subtab premuto clienti dopo=793721ms
10-19 21:13:47.922 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,154 loc=29,16 target=18814
10-19 21:13:47.970 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:13:48.056 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-19 21:13:48.538 10352 10376 I ReactNativeJS: VIBRA hscroll lancio x=0
10-19 21:13:48.538 10352 10376 I ReactNativeJS: VIBRA hscroll ferma x=0
10-19 21:13:53.955 10352 10376 I ReactNativeJS: VIBRA subtab premuto albero dopo=799755ms
10-19 21:13:53.956 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=5397ms lancio=0 x=0 page=362,154 loc=8,8 target=18848
10-19 21:13:53.989 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:13:54.314 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato albero
10-19 21:13:55.091 10352 10376 I ReactNativeJS: VIBRA hscroll lancio x=252
10-19 21:13:55.172 10352 10376 I ReactNativeJS: VIBRA hscroll ferma x=252
10-19 21:14:00.540 10618 10618 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-19 21:14:00.573 10352 10376 I ReactNativeJS: VIBRA subtab premuto parco dopo=806372ms
10-19 21:14:00.573 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=5767ms lancio=0 x=252 page=49,154 loc=76,8 target=18836
10-19 21:14:00.574 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:14:00.674 10352 10376 I ReactNativeJS: VIBRA subtab premuto comitive dopo=806473ms
10-19 21:14:00.676 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=5871ms lancio=0 x=252 page=157,154 loc=1,16 target=18862
10-19 21:14:00.690 10352 10376 I ReactNativeJS: VIBRA subtab comitive dopo=806490ms
10-19 21:14:00.690 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=14ms
10-19 21:14:00.720 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=30ms
10-19 21:14:00.731 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato parco
10-19 21:14:00.731 10352 10376 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=40ms
10-19 21:14:01.077 10352 10376 I ReactNativeJS: VIBRA subtab cambio comitive dopo=387ms
10-19 21:14:01.078 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 21:14:03.244 10640 10640 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-19 21:14:03.272 10352 10376 I ReactNativeJS: VIBRA subtab premuto growth dopo=2582ms
10-19 21:14:03.272 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=1366ms lancio=0 x=250 page=362,154 loc=14,16 target=18886
10-19 21:14:03.273 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:14:03.562 10352 10376 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 21:14:03.563 10352 10376 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 21:14:03.564 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 21:14:03.697 10352 10376 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 21:14:03.698 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=136ms lancio=0 x=480 page=387,154 loc=80,16 target=18910
10-19 21:14:03.699 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-19 21:14:03.933 10352 10376 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 21:14:03.933 10352 10376 I ReactNativeJS: VIBRA subtab mappa dopo=234ms
10-19 21:14:03.980 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=281ms
10-19 21:14:03.991 10352 10376 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=291ms
10-19 21:14:03.991 10352 10376 I ReactNativeJS: VIBRA subtab cambio mappa dopo=291ms
10-19 21:14:06.663 10771 10771 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-19 21:14:06.971 10352 10376 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3271ms
10-19 21:14:06.977 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=3415ms lancio=0 x=480 page=49,154 loc=22,16 target=18874
10-19 21:14:06.981 10352 10376 I ReactNativeJS: VIBRA subtab tabelle dopo=3282ms
10-19 21:14:06.982 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=5ms
10-19 21:14:07.110 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=128ms
10-19 21:14:07.417 10352 10376 I ReactNativeJS: VIBRA subtab premuto growth dopo=435ms
10-19 21:14:07.417 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=3855ms lancio=0 x=480 page=157,154 loc=7,8 target=18884
10-19 21:14:07.418 10352 10376 I ReactNativeJS: VIBRA subtab growth dopo=436ms
10-19 21:14:07.418 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 21:14:07.438 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=21ms
10-19 21:14:07.439 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 21:14:07.439 10352 10376 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=22ms
10-19 21:14:07.767 10352 10376 I ReactNativeJS: VIBRA subtab disegnata growth dopo=349ms
10-19 21:14:07.767 10352 10376 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=349ms
10-19 21:14:07.768 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 21:14:10.117 10798 10798 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-19 21:14:13.573 10818 10818 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-19 21:14:15.082 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=7664ms
10-19 21:14:15.147 10352 10376 I ReactNativeJS: VIBRA subtab cambio growth dopo=7730ms
10-19 21:14:16.866 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=9448ms
10-19 21:14:16.966 10840 10840 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-19 21:14:18.510 10352 10376 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=11092ms
10-19 21:14:18.512 10352 10376 I ReactNativeJS: VIBRA subtab disegnata growth dopo=11094ms
10-19 21:14:18.520 10352 10376 I ReactNativeJS: VIBRA subtab premuto mappa dopo=11102ms
10-19 21:14:18.520 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=14958ms lancio=0 x=480 page=387,154 loc=80,16 target=18910
10-19 21:14:18.524 10352 10376 I ReactNativeJS: VIBRA subtab mappa dopo=11106ms
10-19 21:14:18.524 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-19 21:14:19.113 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=589ms
10-19 21:14:19.149 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 21:14:19.150 10352 10376 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=626ms
10-19 21:14:19.750 10352 10376 I ReactNativeJS: VIBRA subtab cambio mappa dopo=1226ms
10-19 21:14:20.704 10885 10885 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-19 21:14:21.021 10352 10376 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2497ms
10-19 21:14:21.022 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=533ms lancio=0 x=480 page=49,154 loc=22,16 target=18874
10-19 21:14:21.025 10352 10376 I ReactNativeJS: VIBRA subtab tabelle dopo=2501ms
10-19 21:14:21.025 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-19 21:14:21.053 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=28ms
10-19 21:14:21.278 10352 10376 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=253ms
10-19 21:14:21.279 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 21:14:21.355 10352 10376 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=329ms
10-19 21:14:24.658 10905 10905 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-19 21:14:29.612 10926 10926 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-19 21:14:29.640 10352 10376 I ReactNativeJS: VIBRA subtab premuto albero dopo=8614ms
10-19 21:14:29.640 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=2187ms lancio=0 x=344 page=49,154 loc=72,16 target=18850
10-19 21:14:29.641 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:14:29.772 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato albero
10-19 21:14:30.755 10352 10376 I ReactNativeJS: VIBRA subtab premuto comitive dopo=9729ms
10-19 21:14:30.755 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=3302ms lancio=0 x=344 page=157,154 loc=93,16 target=18862
10-19 21:14:30.756 10352 10376 I ReactNativeJS: VIBRA subtab comitive dopo=9731ms
10-19 21:14:30.757 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-19 21:14:30.772 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=16ms
10-19 21:14:30.788 10352 10376 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=32ms
10-19 21:14:30.788 10352 10376 I ReactNativeJS: VIBRA subtab cambio comitive dopo=32ms
10-19 21:14:30.978 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 21:14:33.307 10947 10947 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-19 21:14:33.339 10352 10376 I ReactNativeJS: VIBRA subtab premuto growth dopo=2582ms
10-19 21:14:33.339 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=1796ms lancio=0 x=250 page=362,154 loc=14,16 target=18886
10-19 21:14:33.340 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:14:33.657 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 21:14:33.679 10352 10376 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 21:14:33.679 10352 10376 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 21:14:34.721 10352 10376 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3965ms
10-19 21:14:34.721 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=1327ms lancio=0 x=480 page=387,154 loc=80,16 target=18910
10-19 21:14:34.722 10352 10376 I ReactNativeJS: VIBRA subtab mappa dopo=3966ms
10-19 21:14:34.722 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 21:14:34.736 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=14ms
10-19 21:14:34.738 10352 10376 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=16ms
10-19 21:14:34.754 10352 10376 I ReactNativeJS: VIBRA subtab cambio mappa dopo=32ms
10-19 21:14:35.002 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 21:14:37.518 10991 10991 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-19 21:14:38.061 10352 10376 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3339ms
10-19 21:14:38.063 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=4668ms lancio=0 x=480 page=49,154 loc=22,16 target=18874
10-19 21:14:38.521 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 21:14:38.525 10352 10376 I ReactNativeJS: VIBRA subtab tabelle dopo=3802ms
10-19 21:14:38.525 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=462ms
10-19 21:14:38.565 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=40ms
10-19 21:14:38.853 10352 10376 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=328ms
10-19 21:14:39.109 10352 10376 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=584ms
10-19 21:14:43.384 11012 11012 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-19 21:14:47.934 11035 11035 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-19 21:14:47.971 10352 10376 I ReactNativeJS: VIBRA subtab premuto albero dopo=9446ms
10-19 21:14:47.971 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=890ms lancio=0 x=344 page=49,154 loc=72,16 target=18850
10-19 21:14:48.083 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:14:48.521 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato albero
10-19 21:14:48.930 10352 10376 I ReactNativeJS: VIBRA hscroll lancio x=154
10-19 21:14:49.072 10352 10376 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 21:14:49.073 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=552ms lancio=1 x=154 page=157,154 loc=118,16 target=18838
10-19 21:14:49.075 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-19 21:14:49.515 10352 10376 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 21:14:49.522 10352 10376 I ReactNativeJS: VIBRA subtab parco dopo=447ms
10-19 21:14:49.575 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata parco dopo=499ms
10-19 21:14:49.576 10352 10376 I ReactNativeJS: VIBRA hscroll ferma x=154
10-19 21:14:49.651 10352 10376 I ReactNativeJS: VIBRA subtab disegnata parco dopo=575ms
10-19 21:14:49.651 10352 10376 I ReactNativeJS: VIBRA subtab cambio parco dopo=576ms
10-19 21:14:51.639 11057 11057 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-19 21:14:51.673 10352 10376 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2597ms
10-19 21:14:51.673 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=825ms lancio=0 x=50 page=362,154 loc=4,16 target=18862
10-19 21:14:51.674 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:14:51.899 10352 10376 I ReactNativeJS: VIBRA hscroll lancio x=356
10-19 21:14:51.899 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 21:14:52.087 10352 10376 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 21:14:52.087 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=188ms lancio=1 x=356 page=387,154 loc=22,8 target=18896
10-19 21:14:52.186 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=98ms
10-19 21:14:52.330 10352 10376 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 21:14:52.334 10352 10376 I ReactNativeJS: VIBRA subtab analitica dopo=149ms
10-19 21:14:52.370 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=185ms
10-19 21:14:52.374 10352 10376 I ReactNativeJS: VIBRA hscroll ferma x=356
10-19 21:14:52.408 10352 10376 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=223ms
10-19 21:14:52.408 10352 10376 I ReactNativeJS: VIBRA subtab cambio analitica dopo=223ms
10-19 21:14:54.818 11077 11077 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-19 21:14:54.840 10352 10376 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2654ms
10-19 21:14:54.840 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=1553ms lancio=0 x=480 page=49,154 loc=22,16 target=18874
10-19 21:14:54.857 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:14:55.066 10352 10376 I ReactNativeJS: VIBRA hscroll lancio x=234
10-19 21:14:55.067 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 21:14:55.507 10352 10376 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 21:14:55.507 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=441ms lancio=1 x=234 page=157,154 loc=38,8 target=18848
10-19 21:14:55.651 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=144ms
10-19 21:14:55.652 10352 10376 I ReactNativeJS: VIBRA hscroll ferma x=234
10-19 21:14:55.705 10352 10376 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 21:14:55.705 10352 10376 I ReactNativeJS: VIBRA subtab albero dopo=54ms
10-19 21:14:55.737 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=85ms
10-19 21:14:55.771 10352 10376 I ReactNativeJS: VIBRA subtab disegnata albero dopo=120ms
10-19 21:14:55.771 10352 10376 I ReactNativeJS: VIBRA subtab cambio albero dopo=120ms
10-19 21:14:58.219 11097 11097 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-19 21:14:58.239 10352 10376 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2587ms
10-19 21:14:58.239 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=1823ms lancio=0 x=157 page=362,154 loc=12,16 target=18874
10-19 21:14:58.257 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:14:58.448 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 21:14:58.606 10352 10376 I ReactNativeJS: VIBRA hscroll lancio x=410
10-19 21:14:58.789 10352 10376 I ReactNativeJS: VIBRA hscroll ferma x=410
10-19 21:14:58.888 10352 10376 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3237ms
10-19 21:14:58.888 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=443ms lancio=0 x=410 page=387,154 loc=10,16 target=18910
10-19 21:14:58.889 10352 10376 I ReactNativeJS: VIBRA subtab mappa dopo=3238ms
10-19 21:14:58.890 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 21:14:58.919 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=29ms
10-19 21:14:58.990 10352 10376 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=100ms
10-19 21:14:58.990 10352 10376 I ReactNativeJS: VIBRA subtab cambio mappa dopo=100ms
10-19 21:14:59.241 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 21:15:01.606 11142 11142 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-19 21:15:01.683 10352 10376 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2794ms
10-19 21:15:01.684 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=1808ms lancio=0 x=480 page=49,154 loc=22,16 target=18874
10-19 21:15:02.106 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 21:15:02.106 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:15:06.567 11163 11163 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-19 21:15:07.511 10352 10376 I ReactNativeJS: VIBRA subtab premuto mappa dopo=8622ms
10-19 21:15:07.512 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=7636ms lancio=0 x=480 page=387,154 loc=80,16 target=18910
10-19 21:15:07.900 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 21:15:07.907 10352 10376 I ReactNativeJS: VIBRA subtab mappa dopo=9017ms
10-19 21:15:07.911 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=399ms
10-19 21:15:07.975 10352 10376 I ReactNativeJS: VIBRA subtab cambio mappa dopo=64ms
10-19 21:15:10.982 11185 11185 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-19 21:15:11.127 10352 10376 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3216ms
10-19 21:15:11.127 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=11251ms lancio=0 x=480 page=49,154 loc=22,16 target=18874
10-19 21:15:11.147 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:15:11.591 10352 10376 I ReactNativeJS: VIBRA hscroll lancio x=334
10-19 21:15:11.592 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 21:15:12.677 10352 10376 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 21:15:12.681 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=1086ms lancio=1 x=334 page=157,154 loc=83,16 target=18862
10-19 21:15:12.682 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-19 21:15:12.682 10352 10376 I ReactNativeJS: VIBRA hscroll ferma x=334
10-19 21:15:12.738 10352 10376 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 21:15:12.738 10352 10376 I ReactNativeJS: VIBRA subtab comitive dopo=56ms
10-19 21:15:12.774 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=92ms
10-19 21:15:12.789 10352 10376 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=107ms
10-19 21:15:12.789 10352 10376 I ReactNativeJS: VIBRA subtab cambio comitive dopo=107ms
10-19 21:15:15.250 11205 11205 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-19 21:15:15.271 10352 10376 I ReactNativeJS: VIBRA subtab premuto growth dopo=2590ms
10-19 21:15:15.271 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=1378ms lancio=0 x=250 page=362,154 loc=14,16 target=18886
10-19 21:15:15.289 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:15:15.589 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 21:15:15.753 10352 10376 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 21:15:15.753 10352 10376 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 21:15:16.555 10352 10376 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3873ms
10-19 21:15:16.555 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=966ms lancio=0 x=480 page=387,154 loc=80,16 target=18910
10-19 21:15:16.556 10352 10376 I ReactNativeJS: VIBRA subtab mappa dopo=3874ms
10-19 21:15:16.556 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 21:15:16.570 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=14ms
10-19 21:15:16.571 10352 10376 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=15ms
10-19 21:15:16.588 10352 10376 I ReactNativeJS: VIBRA subtab cambio mappa dopo=32ms
10-19 21:15:16.782 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 21:15:19.235 11249 11249 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-19 21:15:19.381 10352 10376 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2825ms
10-19 21:15:19.382 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=3793ms lancio=0 x=480 page=49,154 loc=22,16 target=18874
10-19 21:15:19.522 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 21:15:19.526 10352 10376 I ReactNativeJS: VIBRA subtab tabelle dopo=2970ms
10-19 21:15:19.527 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=146ms
10-19 21:15:19.652 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=124ms
10-19 21:15:20.223 10352 10376 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=695ms
10-19 21:15:20.304 10352 10376 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=776ms
10-19 21:15:23.896 11269 11269 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-19 21:15:28.150 11291 11291 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-19 21:15:30.204 10352 10376 I ReactNativeJS: VIBRA subtab premuto comitive dopo=10677ms
10-19 21:15:30.205 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=1547ms lancio=0 x=344 page=157,154 loc=93,16 target=18862
10-19 21:15:30.221 10352 10376 I ReactNativeJS: VIBRA subtab comitive dopo=10694ms
10-19 21:15:30.222 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=17ms
10-19 21:15:30.242 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=21ms
10-19 21:15:30.255 10352 10376 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=33ms
10-19 21:15:30.256 10352 10376 I ReactNativeJS: VIBRA subtab cambio comitive dopo=34ms
10-19 21:15:30.620 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 21:15:32.774 11312 11312 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-19 21:15:32.805 10352 10376 I ReactNativeJS: VIBRA subtab premuto growth dopo=2584ms
10-19 21:15:32.805 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=1347ms lancio=0 x=250 page=362,154 loc=14,16 target=18886
10-19 21:15:32.806 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:15:33.101 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 21:15:33.124 10352 10376 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 21:15:33.124 10352 10376 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 21:15:34.655 10352 10376 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4434ms
10-19 21:15:34.656 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=1795ms lancio=0 x=480 page=387,154 loc=80,16 target=18910
10-19 21:15:34.671 10352 10376 I ReactNativeJS: VIBRA subtab mappa dopo=4450ms
10-19 21:15:34.672 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=16ms
10-19 21:15:34.701 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=29ms
10-19 21:15:34.705 10352 10376 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=33ms
10-19 21:15:34.705 10352 10376 I ReactNativeJS: VIBRA subtab cambio mappa dopo=34ms
10-19 21:15:34.902 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 21:15:37.479 10352 10376 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2808ms
10-19 21:15:37.481 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=4620ms lancio=0 x=480 page=49,154 loc=22,16 target=18874
10-19 21:15:37.652 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 21:15:37.653 10352 10376 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 21:15:38.308 10352 10376 I ReactNativeJS: VIBRA hscroll lancio x=386
10-19 21:15:39.010 10352 10376 I ReactNativeJS: VIBRA hscroll ferma x=386
10-19 21:15:41.350 11358 11358 I ReactNativeJS: VIBRA prova controllo senza-lancio
10-19 21:15:41.493 10352 10376 I ReactNativeJS: VIBRA subtab premuto growth dopo=6821ms
10-19 21:15:41.493 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=3187ms lancio=0 x=386 page=265,154 loc=21,8 target=18884
10-19 21:15:41.494 10352 10376 I ReactNativeJS: VIBRA subtab growth dopo=6823ms
10-19 21:15:41.494 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 21:15:41.517 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=23ms
10-19 21:15:41.523 10352 10376 I ReactNativeJS: VIBRA subtab disegnata growth dopo=28ms
10-19 21:15:41.523 10352 10376 I ReactNativeJS: VIBRA subtab cambio growth dopo=28ms
10-19 21:15:44.552 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 21:15:44.589 10352 10376 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3094ms
10-19 21:15:44.589 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=6283ms lancio=0 x=386 page=157,154 loc=3,8 target=18872
10-19 21:15:44.594 10352 10376 I ReactNativeJS: VIBRA subtab tabelle dopo=3100ms
10-19 21:15:44.595 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=6ms
10-19 21:15:45.083 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=489ms
10-19 21:15:46.315 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 21:15:46.510 10352 10376 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=1915ms
10-19 21:15:46.514 10352 10376 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=1919ms
10-19 21:15:49.906 10352 10376 I ReactNativeJS: VIBRA subtab premuto analitica dopo=5312ms
10-19 21:15:49.907 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=3534ms lancio=0 x=435 page=265,154 loc=12,16 target=18898
10-19 21:15:49.908 10352 10376 I ReactNativeJS: VIBRA subtab analitica dopo=5313ms
10-19 21:15:49.908 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 21:15:49.934 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=26ms
10-19 21:15:50.352 10352 10376 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=444ms
10-19 21:15:50.353 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=3981ms lancio=0 x=435 page=157,154 loc=85,16 target=18874
10-19 21:15:50.369 10352 10376 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=462ms
10-19 21:15:50.370 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-19 21:15:50.370 10352 10376 I ReactNativeJS: VIBRA subtab cambio analitica dopo=462ms
10-19 21:15:50.376 10352 10376 I ReactNativeJS: VIBRA subtab tabelle dopo=469ms
10-19 21:15:50.378 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=26ms
10-19 21:15:51.410 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=1031ms
10-19 21:15:51.893 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=1514ms
10-19 21:15:52.166 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 21:15:52.168 10352 10376 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=1789ms
10-19 21:15:52.193 10352 10376 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=1814ms
10-19 21:15:52.444 10352 10376 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=2066ms
10-19 21:15:54.497 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=4118ms
10-19 21:15:55.494 10352 10376 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 21:15:55.494 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=2ms lancio=0 x=480 page=265,154 loc=25,8 target=18896
10-19 21:15:55.495 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 21:15:55.502 10352 10376 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=7ms
10-19 21:15:55.919 10352 10376 I ReactNativeJS: VIBRA subtab premuto growth dopo=424ms
10-19 21:15:55.920 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=427ms lancio=0 x=480 page=157,154 loc=7,8 target=18884
10-19 21:15:55.923 10352 10376 I ReactNativeJS: VIBRA subtab growth dopo=428ms
10-19 21:15:55.924 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-19 21:15:55.976 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=52ms
10-19 21:15:56.307 10352 10376 I ReactNativeJS: VIBRA subtab disegnata growth dopo=384ms
10-19 21:15:56.307 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 21:15:56.821 10352 10376 I ReactNativeJS: VIBRA subtab cambio growth dopo=897ms
10-19 21:15:59.396 10352 10376 I ReactNativeJS: VIBRA subtab premuto growth dopo=3472ms
10-19 21:15:59.396 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=3415ms lancio=0 x=344 page=265,154 loc=12,16 target=18886
10-19 21:15:59.400 10352 10376 I ReactNativeJS: VIBRA subtab growth dopo=3476ms
10-19 21:15:59.400 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-19 21:16:00.714 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 21:16:00.714 10352 10376 I ReactNativeJS: VIBRA subtab cambio growth dopo=1314ms
10-19 21:16:01.616 10352 10376 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2215ms
10-19 21:16:01.616 10352 10376 I ReactNativeJS: VIBRA hscroll tocco dopo=903ms lancio=0 x=435 page=157,154 loc=85,16 target=18874
10-19 21:16:01.618 10352 10376 I ReactNativeJS: VIBRA subtab tabelle dopo=2218ms
10-19 21:16:01.620 10352 10376 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-19 21:16:01.675 10352 10376 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=54ms
10-19 21:16:02.012 10352 10376 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=392ms
10-19 21:16:02.012 10352 10376 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=392ms
10-19 21:16:02.013 10352 10376 I ReactNativeJS: VIBRA subtab rilasciato tabelle
```
