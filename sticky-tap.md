# Tap sulla barra delle tab dopo un lancio (admin)

Barra a y=405; tab Gruppi a x=412 (barra all'inizio), Growth a x=1011 (barra alla fine).
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
| 0.7s | fine | sì |
| 1.0s | inizio | NO |
| 1.0s | fine | sì |
| 1.5s | inizio | sì |
| 1.5s | fine | NO |
| 0s | inizio | sì |
| 0s | fine | NO |
| 0.2s | inizio | NO |
| 0.2s | fine | sì |
| 0.4s | inizio | sì |
| 0.4s | fine | NO |
| 0.7s | inizio | NO |
| 0.7s | fine | sì |
| 1.0s | inizio | sì |
| 1.0s | fine | NO |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |
| controllo | fermo | NO |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |

Tap arrivati: 22 su 32

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-21 16:14:30.350 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata inviti dopo=1456624ms
10-21 16:14:30.504 10415 10440 I ReactNativeJS: VIBRA subtab disegnata inviti dopo=1456778ms
10-21 16:14:32.737 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata clienti dopo=1459011ms
10-21 16:14:32.949 10415 10440 I ReactNativeJS: VIBRA subtab disegnata clienti dopo=1459224ms
10-21 16:14:33.203 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata progressi dopo=1459478ms
10-21 16:14:33.225 10415 10440 I ReactNativeJS: VIBRA subtab disegnata progressi dopo=1459499ms
10-21 16:14:55.619 10415 10440 I ReactNativeJS: VIBRA subtab premuto clienti dopo=1481893ms
10-21 16:14:55.619 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,154 loc=29,16 target=3656
10-21 16:14:55.658 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:14:55.753 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-21 16:14:56.235 10415 10440 I ReactNativeJS: VIBRA hscroll lancio x=0
10-21 16:14:56.235 10415 10440 I ReactNativeJS: VIBRA hscroll ferma x=0
10-21 16:15:01.503 10415 10440 I ReactNativeJS: VIBRA subtab premuto albero dopo=1487778ms
10-21 16:15:01.504 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=5251ms lancio=0 x=0 page=362,154 loc=8,8 target=3690
10-21 16:15:01.538 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:15:01.890 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato albero
10-21 16:15:02.366 10415 10440 I ReactNativeJS: VIBRA hscroll lancio x=255
10-21 16:15:02.620 10415 10440 I ReactNativeJS: VIBRA hscroll ferma x=255
10-21 16:15:07.668 10656 10656 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-21 16:15:07.704 10415 10440 I ReactNativeJS: VIBRA subtab premuto parco dopo=1493979ms
10-21 16:15:07.705 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=5340ms lancio=0 x=255 page=49,154 loc=79,8 target=3678
10-21 16:15:07.706 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:15:07.821 10415 10440 I ReactNativeJS: VIBRA subtab premuto comitive dopo=1494095ms
10-21 16:15:07.821 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=5456ms lancio=0 x=255 page=157,154 loc=4,16 target=3704
10-21 16:15:07.823 10415 10440 I ReactNativeJS: VIBRA subtab comitive dopo=1494097ms
10-21 16:15:07.823 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-21 16:15:07.863 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=40ms
10-21 16:15:07.864 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato parco
10-21 16:15:07.872 10415 10440 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=49ms
10-21 16:15:07.872 10415 10440 I ReactNativeJS: VIBRA subtab cambio comitive dopo=49ms
10-21 16:15:08.008 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-21 16:15:10.380 10677 10677 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-21 16:15:10.402 10415 10440 I ReactNativeJS: VIBRA subtab premuto growth dopo=2580ms
10-21 16:15:10.403 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=1929ms lancio=0 x=250 page=362,154 loc=14,16 target=3728
10-21 16:15:10.420 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:15:10.661 10415 10440 I ReactNativeJS: VIBRA hscroll lancio x=480
10-21 16:15:10.661 10415 10440 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 16:15:10.662 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 16:15:10.957 10415 10440 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 16:15:10.963 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=302ms lancio=0 x=480 page=385,154 loc=78,16 target=3752
10-21 16:15:11.158 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=195ms
10-21 16:15:11.219 10415 10440 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 16:15:11.220 10415 10440 I ReactNativeJS: VIBRA subtab mappa dopo=61ms
10-21 16:15:11.248 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=89ms
10-21 16:15:11.255 10415 10440 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=96ms
10-21 16:15:11.258 10415 10440 I ReactNativeJS: VIBRA subtab cambio mappa dopo=100ms
10-21 16:15:14.039 10808 10808 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-21 16:15:14.301 10415 10440 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3143ms
10-21 16:15:14.302 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=3641ms lancio=0 x=480 page=49,154 loc=22,16 target=3716
10-21 16:15:14.303 10415 10440 I ReactNativeJS: VIBRA subtab tabelle dopo=3145ms
10-21 16:15:14.309 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=7ms
10-21 16:15:14.381 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=72ms
10-21 16:15:14.633 10415 10440 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=324ms
10-21 16:15:14.633 10415 10440 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=324ms
10-21 16:15:14.634 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 16:15:17.703 10835 10835 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-21 16:15:21.007 10855 10855 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-21 16:15:24.613 10879 10879 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-21 16:15:25.021 10415 10440 I ReactNativeJS: VIBRA subtab premuto analitica dopo=10712ms
10-21 16:15:25.021 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=644ms lancio=0 x=344 page=362,154 loc=18,16 target=3740
10-21 16:15:25.158 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-21 16:15:25.162 10415 10440 I ReactNativeJS: VIBRA subtab analitica dopo=10853ms
10-21 16:15:25.163 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=141ms
10-21 16:15:25.235 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=73ms
10-21 16:15:25.939 10415 10440 I ReactNativeJS: VIBRA subtab premuto analitica dopo=777ms
10-21 16:15:25.969 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=1592ms lancio=0 x=344 page=385,154 loc=9,8 target=3738
10-21 16:15:25.982 10415 10440 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=820ms
10-21 16:15:25.982 10415 10440 I ReactNativeJS: VIBRA subtab cambio analitica dopo=820ms
10-21 16:15:26.249 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-21 16:15:26.250 10415 10440 I ReactNativeJS: VIBRA subtab analitica dopo=1088ms
10-21 16:15:26.301 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=333ms
10-21 16:15:27.252 10415 10440 I ReactNativeJS: VIBRA subtab cambio analitica dopo=951ms
10-21 16:15:28.611 10900 10900 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-21 16:15:28.635 10415 10440 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2334ms
10-21 16:15:28.635 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=1380ms lancio=0 x=480 page=49,154 loc=22,16 target=3716
10-21 16:15:28.654 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:15:28.844 10415 10440 I ReactNativeJS: VIBRA hscroll lancio x=210
10-21 16:15:28.845 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 16:15:29.302 10415 10440 I ReactNativeJS: VIBRA hscroll ferma x=210
10-21 16:15:29.669 10415 10440 I ReactNativeJS: VIBRA subtab premuto albero dopo=3367ms
10-21 16:15:29.669 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=825ms lancio=0 x=210 page=157,154 loc=13,8 target=3690
10-21 16:15:29.670 10415 10440 I ReactNativeJS: VIBRA subtab albero dopo=3369ms
10-21 16:15:29.671 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-21 16:15:29.686 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=15ms
10-21 16:15:29.703 10415 10440 I ReactNativeJS: VIBRA subtab disegnata albero dopo=32ms
10-21 16:15:29.703 10415 10440 I ReactNativeJS: VIBRA subtab cambio albero dopo=32ms
10-21 16:15:30.230 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato albero
10-21 16:15:32.225 10921 10921 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-21 16:15:32.252 10415 10440 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2581ms
10-21 16:15:32.252 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=1929ms lancio=0 x=157 page=362,154 loc=12,16 target=3716
10-21 16:15:32.272 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:15:32.462 10415 10440 I ReactNativeJS: VIBRA hscroll lancio x=437
10-21 16:15:32.463 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 16:15:32.788 10415 10440 I ReactNativeJS: VIBRA hscroll ferma x=437
10-21 16:15:33.219 10415 10440 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3548ms
10-21 16:15:33.219 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=762ms lancio=0 x=437 page=385,154 loc=3,8 target=3750
10-21 16:15:33.220 10415 10440 I ReactNativeJS: VIBRA subtab mappa dopo=3549ms
10-21 16:15:33.220 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 16:15:33.235 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=16ms
10-21 16:15:33.252 10415 10440 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=32ms
10-21 16:15:33.252 10415 10440 I ReactNativeJS: VIBRA subtab cambio mappa dopo=33ms
10-21 16:15:33.887 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-21 16:15:36.164 10969 10969 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-21 16:15:36.292 10415 10440 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3073ms
10-21 16:15:36.296 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=1921ms lancio=0 x=480 page=49,154 loc=22,16 target=3716
10-21 16:15:37.007 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 16:15:37.008 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:15:41.594 10990 10990 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-21 16:15:42.896 10415 10440 I ReactNativeJS: VIBRA subtab premuto mappa dopo=9676ms
10-21 16:15:42.900 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=8525ms lancio=0 x=480 page=385,154 loc=78,16 target=3752
10-21 16:15:42.907 10415 10440 I ReactNativeJS: VIBRA subtab mappa dopo=9687ms
10-21 16:15:42.907 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=6ms
10-21 16:15:42.968 10415 10440 I ReactNativeJS: VIBRA subtab cambio mappa dopo=62ms
10-21 16:15:43.035 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-21 16:15:46.132 11011 11011 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-21 16:15:46.190 10415 10440 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3284ms
10-21 16:15:46.191 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=11816ms lancio=0 x=480 page=49,154 loc=22,16 target=3716
10-21 16:15:46.205 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:15:46.628 10415 10440 I ReactNativeJS: VIBRA hscroll lancio x=397
10-21 16:15:46.629 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 16:15:47.822 10415 10440 I ReactNativeJS: VIBRA hscroll ferma x=397
10-21 16:15:48.275 10415 10440 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5368ms
10-21 16:15:48.275 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=1647ms lancio=0 x=397 page=157,154 loc=15,8 target=3714
10-21 16:15:48.282 10415 10440 I ReactNativeJS: VIBRA subtab tabelle dopo=5375ms
10-21 16:15:48.282 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=7ms
10-21 16:15:48.342 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=60ms
10-21 16:15:48.560 10415 10440 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=278ms
10-21 16:15:48.561 10415 10440 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=279ms
10-21 16:15:48.561 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 16:15:51.077 11032 11032 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-21 16:15:55.868 11052 11052 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-21 16:15:56.086 10415 10440 I ReactNativeJS: VIBRA subtab premuto analitica dopo=7804ms
10-21 16:15:56.086 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=9458ms lancio=0 x=397 page=362,154 loc=39,8 target=3738
10-21 16:15:56.092 10415 10440 I ReactNativeJS: VIBRA subtab analitica dopo=7810ms
10-21 16:15:56.092 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=6ms
10-21 16:15:56.099 10415 10440 I ReactNativeJS: VIBRA subtab premuto analitica dopo=7ms
10-21 16:15:56.100 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=9472ms lancio=0 x=397 page=385,154 loc=94,16 target=3740
10-21 16:15:56.102 10415 10440 I ReactNativeJS: VIBRA subtab analitica dopo=10ms
10-21 16:15:56.102 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-21 16:15:56.123 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=21ms
10-21 16:15:56.605 10415 10440 I ReactNativeJS: VIBRA subtab premuto comitive dopo=503ms
10-21 16:15:56.615 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=9987ms lancio=0 x=397 page=49,154 loc=6,8 target=3702
10-21 16:15:56.664 10415 10440 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=562ms
10-21 16:15:56.665 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-21 16:15:57.070 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-21 16:15:57.085 10415 10440 I ReactNativeJS: VIBRA subtab comitive dopo=983ms
10-21 16:15:57.085 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=470ms
10-21 16:15:57.242 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=157ms
10-21 16:15:57.244 10415 10440 I ReactNativeJS: VIBRA subtab cambio analitica dopo=159ms
10-21 16:15:57.244 10415 10440 I ReactNativeJS: VIBRA subtab cambio analitica dopo=159ms
10-21 16:15:57.942 10415 10440 I ReactNativeJS: VIBRA subtab premuto comitive dopo=857ms
10-21 16:15:57.943 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=858ms lancio=0 x=344 page=157,154 loc=93,16 target=3704
10-21 16:15:57.945 10415 10440 I ReactNativeJS: VIBRA subtab comitive dopo=860ms
10-21 16:15:57.948 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=5ms
10-21 16:15:58.217 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=269ms
10-21 16:15:58.221 10415 10440 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=273ms
10-21 16:15:58.410 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-21 16:15:58.412 10415 10440 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=463ms
10-21 16:15:58.412 10415 10440 I ReactNativeJS: VIBRA subtab cambio comitive dopo=464ms
10-21 16:15:58.480 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=532ms
10-21 16:15:58.679 10415 10440 I ReactNativeJS: VIBRA subtab cambio comitive dopo=731ms
10-21 16:15:58.680 10415 10440 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=731ms
10-21 16:16:00.481 11075 11075 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-21 16:16:03.181 11095 11095 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-21 16:16:03.220 10415 10440 I ReactNativeJS: VIBRA subtab premuto parco dopo=5272ms
10-21 16:16:03.221 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=4210ms lancio=0 x=250 page=49,154 loc=74,8 target=3678
10-21 16:16:03.222 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:16:03.355 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato parco
10-21 16:16:03.519 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=4508ms lancio=0 x=250 page=157,154 loc=391,20 target=3754
10-21 16:16:03.522 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-21 16:16:06.091 11116 11116 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-21 16:16:06.119 10415 10440 I ReactNativeJS: VIBRA subtab premuto growth dopo=2597ms
10-21 16:16:06.119 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=7108ms lancio=0 x=250 page=362,154 loc=14,16 target=3728
10-21 16:16:06.141 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:16:06.438 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 16:16:06.567 10415 10440 I ReactNativeJS: VIBRA hscroll lancio x=480
10-21 16:16:06.567 10415 10440 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 16:16:06.870 10415 10440 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 16:16:06.870 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=432ms lancio=0 x=480 page=385,154 loc=78,16 target=3752
10-21 16:16:06.875 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=5ms
10-21 16:16:06.936 10415 10440 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 16:16:06.939 10415 10440 I ReactNativeJS: VIBRA subtab mappa dopo=64ms
10-21 16:16:06.984 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=109ms
10-21 16:16:07.006 10415 10440 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=131ms
10-21 16:16:07.007 10415 10440 I ReactNativeJS: VIBRA subtab cambio mappa dopo=132ms
10-21 16:16:09.641 11160 11160 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-21 16:16:10.344 10415 10440 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3469ms
10-21 16:16:10.344 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=3906ms lancio=0 x=480 page=49,154 loc=22,16 target=3716
10-21 16:16:10.348 10415 10440 I ReactNativeJS: VIBRA subtab tabelle dopo=3473ms
10-21 16:16:10.348 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-21 16:16:10.418 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=70ms
10-21 16:16:11.117 10415 10440 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=768ms
10-21 16:16:11.117 10415 10440 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=769ms
10-21 16:16:11.117 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 16:16:14.696 11181 11181 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-21 16:16:18.774 11201 11201 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-21 16:16:22.353 11224 11224 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-21 16:16:22.387 10415 10440 I ReactNativeJS: VIBRA subtab premuto analitica dopo=12039ms
10-21 16:16:22.388 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=2115ms lancio=0 x=344 page=362,154 loc=18,16 target=3740
10-21 16:16:22.390 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:16:22.474 10415 10440 I ReactNativeJS: VIBRA hscroll lancio x=480
10-21 16:16:22.474 10415 10440 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 16:16:22.850 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-21 16:16:23.294 10415 10440 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 16:16:23.294 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=820ms lancio=0 x=480 page=385,154 loc=78,16 target=3752
10-21 16:16:23.886 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=592ms
10-21 16:16:23.954 10415 10440 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 16:16:23.954 10415 10440 I ReactNativeJS: VIBRA subtab mappa dopo=68ms
10-21 16:16:24.073 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=187ms
10-21 16:16:24.088 10415 10440 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=202ms
10-21 16:16:24.088 10415 10440 I ReactNativeJS: VIBRA subtab cambio mappa dopo=203ms
10-21 16:16:26.726 11269 11269 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-21 16:16:27.242 10415 10440 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3356ms
10-21 16:16:27.242 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=4767ms lancio=0 x=480 page=49,154 loc=22,16 target=3716
10-21 16:16:27.246 10415 10440 I ReactNativeJS: VIBRA subtab tabelle dopo=3360ms
10-21 16:16:27.246 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-21 16:16:27.286 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=40ms
10-21 16:16:27.325 10415 10440 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=79ms
10-21 16:16:27.992 10415 10440 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=746ms
10-21 16:16:27.992 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 16:16:31.902 11290 11290 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-21 16:16:35.761 11312 11312 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-21 16:16:35.864 10415 10440 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 16:16:35.865 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=13391ms lancio=0 x=480 page=49,154 loc=22,16 target=3716
10-21 16:16:36.233 10415 10440 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-21 16:16:36.239 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:16:36.239 10415 10440 I ReactNativeJS: VIBRA hscroll lancio x=344
10-21 16:16:36.385 10415 10440 I ReactNativeJS: VIBRA hscroll ferma x=344
10-21 16:16:37.769 10415 10440 I ReactNativeJS: VIBRA subtab premuto comitive dopo=10523ms
10-21 16:16:37.769 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=1903ms lancio=0 x=344 page=157,154 loc=93,16 target=3704
10-21 16:16:37.770 10415 10440 I ReactNativeJS: VIBRA subtab comitive dopo=10524ms
10-21 16:16:37.770 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 16:16:37.793 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=23ms
10-21 16:16:37.803 10415 10440 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=33ms
10-21 16:16:37.803 10415 10440 I ReactNativeJS: VIBRA subtab cambio comitive dopo=33ms
10-21 16:16:38.087 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-21 16:16:40.322 11332 11332 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-21 16:16:40.353 10415 10440 I ReactNativeJS: VIBRA subtab premuto growth dopo=2583ms
10-21 16:16:40.354 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=1790ms lancio=0 x=250 page=362,154 loc=14,16 target=3728
10-21 16:16:40.355 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:16:40.628 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 16:16:40.903 10415 10440 I ReactNativeJS: VIBRA hscroll lancio x=480
10-21 16:16:40.907 10415 10440 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 16:16:42.452 10415 10440 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4682ms
10-21 16:16:42.452 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=1824ms lancio=0 x=480 page=385,154 loc=78,16 target=3752
10-21 16:16:42.454 10415 10440 I ReactNativeJS: VIBRA subtab mappa dopo=4684ms
10-21 16:16:42.454 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-21 16:16:42.470 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=16ms
10-21 16:16:42.486 10415 10440 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=32ms
10-21 16:16:42.486 10415 10440 I ReactNativeJS: VIBRA subtab cambio mappa dopo=32ms
10-21 16:16:43.137 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-21 16:16:45.349 10415 10440 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2896ms
10-21 16:16:45.350 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=4722ms lancio=0 x=480 page=49,154 loc=22,16 target=3716
10-21 16:16:45.792 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 16:16:45.792 10415 10440 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 16:16:48.833 11376 11376 I ReactNativeJS: VIBRA prova controllo senza-lancio
10-21 16:16:52.310 10415 10440 I ReactNativeJS: VIBRA subtab premuto growth dopo=9857ms
10-21 16:16:52.314 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=11686ms lancio=0 x=480 page=157,154 loc=7,8 target=3726
10-21 16:16:52.317 10415 10440 I ReactNativeJS: VIBRA subtab growth dopo=9863ms
10-21 16:16:52.317 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=3ms
10-21 16:16:52.361 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=44ms
10-21 16:16:52.376 10415 10440 I ReactNativeJS: VIBRA subtab disegnata growth dopo=59ms
10-21 16:16:52.377 10415 10440 I ReactNativeJS: VIBRA subtab cambio growth dopo=60ms
10-21 16:16:54.440 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 16:16:55.531 10415 10440 I ReactNativeJS: VIBRA subtab premuto analitica dopo=3214ms
10-21 16:16:55.534 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=14906ms lancio=0 x=480 page=265,154 loc=25,8 target=3738
10-21 16:16:55.541 10415 10440 I ReactNativeJS: VIBRA subtab analitica dopo=3224ms
10-21 16:16:55.541 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=8ms
10-21 16:16:55.681 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=139ms
10-21 16:16:56.183 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-21 16:16:56.183 10415 10440 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=642ms
10-21 16:16:56.681 10415 10440 I ReactNativeJS: VIBRA subtab cambio analitica dopo=1140ms
10-21 16:16:58.293 10415 10440 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 16:16:58.293 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=2152ms lancio=0 x=435 page=157,154 loc=85,16 target=3716
10-21 16:16:58.295 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-21 16:16:58.485 10415 10440 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 16:16:58.488 10415 10440 I ReactNativeJS: VIBRA subtab growth dopo=193ms
10-21 16:16:58.541 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=246ms
10-21 16:16:58.607 10415 10440 I ReactNativeJS: VIBRA subtab disegnata growth dopo=311ms
10-21 16:16:58.816 10415 10440 I ReactNativeJS: VIBRA subtab cambio growth dopo=521ms
10-21 16:17:01.054 10415 10440 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 16:17:01.054 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=2759ms lancio=0 x=480 page=265,154 loc=25,8 target=3738
10-21 16:17:01.060 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=6ms
10-21 16:17:01.699 10415 10440 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 16:17:01.717 10415 10440 I ReactNativeJS: VIBRA subtab analitica dopo=657ms
10-21 16:17:01.869 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=809ms
10-21 16:17:01.985 10415 10440 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=925ms
10-21 16:17:02.362 10415 10440 I ReactNativeJS: VIBRA subtab cambio analitica dopo=1302ms
10-21 16:17:04.001 10415 10440 I ReactNativeJS: VIBRA subtab premuto growth dopo=2941ms
10-21 16:17:04.002 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=138ms lancio=0 x=480 page=157,154 loc=7,8 target=3726
10-21 16:17:04.132 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 16:17:04.137 10415 10440 I ReactNativeJS: VIBRA subtab growth dopo=3077ms
10-21 16:17:04.138 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=136ms
10-21 16:17:04.160 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=22ms
10-21 16:17:04.318 10415 10440 I ReactNativeJS: VIBRA subtab disegnata growth dopo=180ms
10-21 16:17:04.494 10415 10440 I ReactNativeJS: VIBRA subtab cambio growth dopo=357ms
10-21 16:17:06.985 10415 10440 I ReactNativeJS: VIBRA subtab premuto analitica dopo=2847ms
10-21 16:17:06.985 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=441ms lancio=0 x=435 page=265,154 loc=12,16 target=3740
10-21 16:17:06.986 10415 10440 I ReactNativeJS: VIBRA subtab analitica dopo=2849ms
10-21 16:17:06.992 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=7ms
10-21 16:17:07.224 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=232ms
10-21 16:17:07.346 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-21 16:17:07.347 10415 10440 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=354ms
10-21 16:17:07.584 10415 10440 I ReactNativeJS: VIBRA subtab cambio analitica dopo=592ms
10-21 16:17:09.585 10415 10440 I ReactNativeJS: VIBRA subtab premuto growth dopo=2593ms
10-21 16:17:09.586 10415 10440 I ReactNativeJS: VIBRA hscroll tocco dopo=811ms lancio=0 x=480 page=157,154 loc=7,8 target=3726
10-21 16:17:09.587 10415 10440 I ReactNativeJS: VIBRA subtab growth dopo=2595ms
10-21 16:17:09.588 10415 10440 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-21 16:17:09.606 10415 10440 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=18ms
10-21 16:17:09.619 10415 10440 I ReactNativeJS: VIBRA subtab disegnata growth dopo=31ms
10-21 16:17:09.620 10415 10440 I ReactNativeJS: VIBRA subtab cambio growth dopo=32ms
10-21 16:17:10.445 10415 10440 I ReactNativeJS: VIBRA subtab rilasciato growth
```
