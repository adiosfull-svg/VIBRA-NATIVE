# Tap sulla barra delle tab dopo un lancio (admin)

Barra a y=405; tab Gruppi a x=412 (barra all'inizio), Growth a x=1012 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | sì |
| 0s | fine | sì |
| 0.2s | inizio | sì |
| 0.2s | fine | NO |
| 0.4s | inizio | NO |
| 0.4s | fine | sì |
| 0.7s | inizio | NO |
| 0.7s | fine | sì |
| 1.0s | inizio | sì |
| 1.0s | fine | sì |
| 1.5s | inizio | sì |
| 1.5s | fine | NO |
| 0s | inizio | sì |
| 0s | fine | sì |
| 0.2s | inizio | sì |
| 0.2s | fine | NO |
| 0.4s | inizio | sì |
| 0.4s | fine | sì |
| 0.7s | inizio | sì |
| 0.7s | fine | NO |
| 1.0s | inizio | sì |
| 1.0s | fine | sì |
| 1.5s | inizio | sì |
| 1.5s | fine | NO |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |

Tap arrivati: 25 su 32

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-21 20:38:02.167 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata inviti dopo=1458859ms
10-21 20:38:02.470 10237 10261 I ReactNativeJS: VIBRA subtab disegnata inviti dopo=1459162ms
10-21 20:38:04.247 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata clienti dopo=1460940ms
10-21 20:38:04.311 10237 10261 I ReactNativeJS: VIBRA subtab disegnata clienti dopo=1461003ms
10-21 20:38:04.719 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata progressi dopo=1461411ms
10-21 20:38:04.743 10237 10261 I ReactNativeJS: VIBRA subtab disegnata progressi dopo=1461435ms
10-21 20:38:26.470 10237 10261 I ReactNativeJS: VIBRA subtab premuto clienti dopo=1483163ms
10-21 20:38:26.471 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,154 loc=29,16 target=3626
10-21 20:38:26.500 10237 10261 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 20:38:26.616 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-21 20:38:27.082 10237 10261 I ReactNativeJS: VIBRA hscroll lancio x=0
10-21 20:38:27.091 10237 10261 I ReactNativeJS: VIBRA hscroll ferma x=0
10-21 20:38:32.365 10237 10261 I ReactNativeJS: VIBRA subtab premuto albero dopo=1489057ms
10-21 20:38:32.365 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=5264ms lancio=0 x=0 page=362,154 loc=8,8 target=3660
10-21 20:38:32.401 10237 10261 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 20:38:32.726 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato albero
10-21 20:38:33.204 10237 10261 I ReactNativeJS: VIBRA hscroll lancio x=254
10-21 20:38:33.501 10237 10261 I ReactNativeJS: VIBRA hscroll ferma x=254
10-21 20:38:38.504 10477 10477 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-21 20:38:38.533 10237 10261 I ReactNativeJS: VIBRA subtab premuto parco dopo=1495225ms
10-21 20:38:38.533 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=5330ms lancio=0 x=254 page=49,154 loc=78,8 target=3648
10-21 20:38:38.534 10237 10261 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 20:38:38.651 10237 10261 I ReactNativeJS: VIBRA subtab premuto comitive dopo=1495343ms
10-21 20:38:38.651 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=5447ms lancio=0 x=254 page=157,154 loc=3,16 target=3674
10-21 20:38:38.655 10237 10261 I ReactNativeJS: VIBRA subtab comitive dopo=1495347ms
10-21 20:38:38.655 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=5ms
10-21 20:38:38.684 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=28ms
10-21 20:38:38.684 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato parco
10-21 20:38:38.701 10237 10261 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=46ms
10-21 20:38:38.702 10237 10261 I ReactNativeJS: VIBRA subtab cambio comitive dopo=46ms
10-21 20:38:39.086 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-21 20:38:41.210 10499 10499 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-21 20:38:41.232 10237 10261 I ReactNativeJS: VIBRA subtab premuto growth dopo=2576ms
10-21 20:38:41.232 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=1790ms lancio=0 x=250 page=362,154 loc=14,16 target=3698
10-21 20:38:41.250 10237 10261 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 20:38:41.491 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 20:38:41.694 10237 10261 I ReactNativeJS: VIBRA hscroll lancio x=480
10-21 20:38:41.695 10237 10261 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 20:38:42.003 10237 10261 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 20:38:42.004 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=513ms lancio=0 x=480 page=386,154 loc=78,16 target=3722
10-21 20:38:42.005 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 20:38:42.067 10237 10261 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 20:38:42.067 10237 10261 I ReactNativeJS: VIBRA subtab mappa dopo=63ms
10-21 20:38:42.100 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=96ms
10-21 20:38:42.117 10237 10261 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=112ms
10-21 20:38:42.118 10237 10261 I ReactNativeJS: VIBRA subtab cambio mappa dopo=113ms
10-21 20:38:44.786 10631 10631 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-21 20:38:45.430 10237 10261 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3425ms
10-21 20:38:45.430 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=3940ms lancio=0 x=480 page=49,154 loc=22,16 target=3686
10-21 20:38:45.431 10237 10261 I ReactNativeJS: VIBRA subtab tabelle dopo=3426ms
10-21 20:38:45.431 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 20:38:45.475 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=44ms
10-21 20:38:46.109 10237 10261 I ReactNativeJS: VIBRA subtab premuto growth dopo=678ms
10-21 20:38:46.109 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=4619ms lancio=0 x=480 page=157,154 loc=7,8 target=3696
10-21 20:38:46.110 10237 10261 I ReactNativeJS: VIBRA subtab growth dopo=679ms
10-21 20:38:46.110 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 20:38:46.148 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=38ms
10-21 20:38:46.149 10237 10261 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=38ms
10-21 20:38:46.149 10237 10261 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=39ms
10-21 20:38:46.149 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 20:38:48.860 10655 10655 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-21 20:38:52.591 10675 10675 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-21 20:38:53.892 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=7782ms
10-21 20:38:53.934 10237 10261 I ReactNativeJS: VIBRA subtab disegnata growth dopo=7824ms
10-21 20:38:53.935 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 20:38:54.389 10237 10261 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=8279ms
10-21 20:38:54.578 10237 10261 I ReactNativeJS: VIBRA subtab cambio growth dopo=8468ms
10-21 20:38:56.031 10698 10698 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-21 20:38:57.422 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=11312ms
10-21 20:38:57.463 10237 10261 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 20:38:57.464 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=0ms lancio=0 x=344 page=362,154 loc=18,16 target=3710
10-21 20:38:57.465 10237 10261 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-21 20:38:57.465 10237 10261 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 20:38:57.466 10237 10261 I ReactNativeJS: VIBRA hscroll lancio x=480
10-21 20:38:57.466 10237 10261 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 20:38:57.466 10237 10261 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 20:38:57.466 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=0ms lancio=0 x=480 page=386,154 loc=78,16 target=3722
10-21 20:38:57.467 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 20:38:58.095 10237 10261 I ReactNativeJS: VIBRA subtab disegnata growth dopo=628ms
10-21 20:38:58.096 10237 10261 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 20:38:58.096 10237 10261 I ReactNativeJS: VIBRA subtab mappa dopo=629ms
10-21 20:38:58.221 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=754ms
10-21 20:38:58.701 10237 10261 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=1234ms
10-21 20:38:58.704 10237 10261 I ReactNativeJS: VIBRA subtab cambio mappa dopo=1238ms
10-21 20:38:59.863 10719 10719 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-21 20:38:59.988 10237 10261 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2521ms
10-21 20:38:59.988 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=1324ms lancio=0 x=435 page=49,154 loc=45,8 target=3672
10-21 20:38:59.989 10237 10261 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 20:39:00.376 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-21 20:39:03.668 10762 10762 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-21 20:39:04.986 10237 10261 I ReactNativeJS: VIBRA subtab premuto mappa dopo=7520ms
10-21 20:39:04.989 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=4409ms lancio=0 x=480 page=386,154 loc=78,16 target=3722
10-21 20:39:04.994 10237 10261 I ReactNativeJS: VIBRA subtab mappa dopo=7527ms
10-21 20:39:04.994 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=5ms
10-21 20:39:05.366 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-21 20:39:05.536 10237 10261 I ReactNativeJS: VIBRA subtab cambio mappa dopo=542ms
10-21 20:39:07.648 10785 10785 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-21 20:39:07.722 10237 10261 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2728ms
10-21 20:39:07.724 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=7144ms lancio=0 x=480 page=49,154 loc=22,16 target=3686
10-21 20:39:07.725 10237 10261 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 20:39:08.421 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 20:39:09.733 10237 10261 I ReactNativeJS: VIBRA subtab premuto growth dopo=4739ms
10-21 20:39:09.737 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=9158ms lancio=0 x=480 page=157,154 loc=7,8 target=3696
10-21 20:39:09.770 10237 10261 I ReactNativeJS: VIBRA subtab growth dopo=4776ms
10-21 20:39:09.771 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=34ms
10-21 20:39:09.798 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=27ms
10-21 20:39:10.120 10237 10261 I ReactNativeJS: VIBRA subtab disegnata growth dopo=349ms
10-21 20:39:10.123 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 20:39:10.638 10237 10261 I ReactNativeJS: VIBRA subtab cambio growth dopo=866ms
10-21 20:39:12.624 10806 10806 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-21 20:39:12.976 10237 10261 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3205ms
10-21 20:39:12.977 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=12397ms lancio=0 x=480 page=362,154 loc=23,8 target=3720
10-21 20:39:12.978 10237 10261 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 20:39:12.979 10237 10261 I ReactNativeJS: VIBRA hscroll lancio x=480
10-21 20:39:12.980 10237 10261 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 20:39:14.072 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-21 20:39:14.159 10237 10261 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 20:39:14.159 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=13579ms lancio=0 x=480 page=386,154 loc=78,16 target=3722
10-21 20:39:14.165 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=6ms
10-21 20:39:14.632 10237 10261 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 20:39:14.633 10237 10261 I ReactNativeJS: VIBRA subtab mappa dopo=468ms
10-21 20:39:14.657 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=493ms
10-21 20:39:14.872 10237 10261 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=707ms
10-21 20:39:15.043 10237 10261 I ReactNativeJS: VIBRA subtab cambio mappa dopo=878ms
10-21 20:39:16.862 10850 10850 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-21 20:39:17.408 10237 10261 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3243ms
10-21 20:39:17.409 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=1075ms lancio=0 x=480 page=49,154 loc=22,16 target=3686
10-21 20:39:17.410 10237 10261 I ReactNativeJS: VIBRA subtab tabelle dopo=3245ms
10-21 20:39:17.410 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 20:39:17.453 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=43ms
10-21 20:39:17.813 10237 10261 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=403ms
10-21 20:39:17.814 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 20:39:18.214 10237 10261 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=804ms
10-21 20:39:21.719 10889 10889 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-21 20:39:26.418 10909 10909 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-21 20:39:28.345 10237 10261 I ReactNativeJS: VIBRA subtab premuto comitive dopo=10935ms
10-21 20:39:28.345 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=589ms lancio=0 x=344 page=157,154 loc=93,16 target=3674
10-21 20:39:28.469 10237 10261 I ReactNativeJS: VIBRA subtab comitive dopo=11059ms
10-21 20:39:28.469 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=124ms
10-21 20:39:28.520 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=51ms
10-21 20:39:29.024 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-21 20:39:29.024 10237 10261 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=555ms
10-21 20:39:29.428 10237 10261 I ReactNativeJS: VIBRA subtab cambio comitive dopo=959ms
10-21 20:39:31.088 10933 10933 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-21 20:39:31.116 10237 10261 I ReactNativeJS: VIBRA subtab premuto growth dopo=2647ms
10-21 20:39:31.116 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=681ms lancio=0 x=250 page=362,154 loc=14,16 target=3698
10-21 20:39:31.117 10237 10261 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 20:39:31.437 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 20:39:31.652 10237 10261 I ReactNativeJS: VIBRA hscroll lancio x=480
10-21 20:39:31.653 10237 10261 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 20:39:31.875 10237 10261 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 20:39:31.875 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=439ms lancio=0 x=480 page=386,154 loc=78,16 target=3722
10-21 20:39:31.883 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=8ms
10-21 20:39:32.065 10237 10261 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 20:39:32.067 10237 10261 I ReactNativeJS: VIBRA subtab mappa dopo=184ms
10-21 20:39:32.105 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=221ms
10-21 20:39:32.116 10237 10261 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=233ms
10-21 20:39:32.119 10237 10261 I ReactNativeJS: VIBRA subtab cambio mappa dopo=236ms
10-21 20:39:34.729 10976 10976 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-21 20:39:34.942 10237 10261 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3059ms
10-21 20:39:34.942 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=3505ms lancio=0 x=480 page=49,154 loc=22,16 target=3686
10-21 20:39:35.597 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 20:39:35.607 10237 10261 I ReactNativeJS: VIBRA subtab tabelle dopo=3723ms
10-21 20:39:35.607 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=665ms
10-21 20:39:35.655 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=48ms
10-21 20:39:35.697 10237 10261 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=90ms
10-21 20:39:36.022 10237 10261 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=415ms
10-21 20:39:38.720 10997 10997 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-21 20:39:43.196 11017 11017 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-21 20:39:44.389 10237 10261 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 20:39:44.392 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=12955ms lancio=0 x=480 page=157,154 loc=7,8 target=3696
10-21 20:39:44.394 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-21 20:39:44.812 10237 10261 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 20:39:44.812 10237 10261 I ReactNativeJS: VIBRA subtab comitive dopo=418ms
10-21 20:39:44.861 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=467ms
10-21 20:39:44.867 10237 10261 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=474ms
10-21 20:39:45.153 10237 10261 I ReactNativeJS: VIBRA subtab cambio comitive dopo=759ms
10-21 20:39:46.924 11041 11041 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-21 20:39:46.949 10237 10261 I ReactNativeJS: VIBRA subtab premuto growth dopo=2556ms
10-21 20:39:46.949 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=844ms lancio=0 x=250 page=362,154 loc=14,16 target=3698
10-21 20:39:46.951 10237 10261 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 20:39:47.227 10237 10261 I ReactNativeJS: VIBRA hscroll lancio x=451
10-21 20:39:47.227 10237 10261 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 20:39:47.228 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 20:39:47.770 10237 10261 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 20:39:47.771 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=543ms lancio=0 x=480 page=386,154 loc=78,16 target=3722
10-21 20:39:47.772 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 20:39:47.832 10237 10261 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 20:39:47.832 10237 10261 I ReactNativeJS: VIBRA subtab mappa dopo=60ms
10-21 20:39:47.865 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=93ms
10-21 20:39:47.883 10237 10261 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=111ms
10-21 20:39:47.883 10237 10261 I ReactNativeJS: VIBRA subtab cambio mappa dopo=111ms
10-21 20:39:50.476 11085 11085 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-21 20:39:50.696 10237 10261 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2924ms
10-21 20:39:50.696 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=3468ms lancio=0 x=480 page=49,154 loc=22,16 target=3686
10-21 20:39:51.362 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 20:39:51.375 10237 10261 I ReactNativeJS: VIBRA subtab tabelle dopo=3603ms
10-21 20:39:51.375 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=679ms
10-21 20:39:51.428 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=54ms
10-21 20:39:51.614 10237 10261 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=239ms
10-21 20:39:52.141 10237 10261 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=766ms
10-21 20:39:55.433 11106 11106 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-21 20:39:59.387 11127 11127 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-21 20:40:01.520 10237 10261 I ReactNativeJS: VIBRA subtab premuto comitive dopo=10146ms
10-21 20:40:01.522 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=550ms lancio=0 x=344 page=157,154 loc=93,16 target=3674
10-21 20:40:01.523 10237 10261 I ReactNativeJS: VIBRA subtab comitive dopo=10149ms
10-21 20:40:01.525 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=3ms
10-21 20:40:01.614 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=89ms
10-21 20:40:01.633 10237 10261 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=108ms
10-21 20:40:01.633 10237 10261 I ReactNativeJS: VIBRA subtab cambio comitive dopo=108ms
10-21 20:40:02.249 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-21 20:40:04.089 11149 11149 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-21 20:40:04.116 10237 10261 I ReactNativeJS: VIBRA subtab premuto growth dopo=2591ms
10-21 20:40:04.116 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=1194ms lancio=0 x=250 page=362,154 loc=14,16 target=3698
10-21 20:40:04.117 10237 10261 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 20:40:04.432 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 20:40:04.635 10237 10261 I ReactNativeJS: VIBRA hscroll lancio x=480
10-21 20:40:04.635 10237 10261 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 20:40:05.682 10237 10261 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4156ms
10-21 20:40:05.682 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=1250ms lancio=0 x=480 page=386,154 loc=78,16 target=3722
10-21 20:40:05.683 10237 10261 I ReactNativeJS: VIBRA subtab mappa dopo=4158ms
10-21 20:40:05.683 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 20:40:05.697 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=14ms
10-21 20:40:05.715 10237 10261 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=32ms
10-21 20:40:05.715 10237 10261 I ReactNativeJS: VIBRA subtab cambio mappa dopo=32ms
10-21 20:40:06.341 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-21 20:40:08.567 11193 11193 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-21 20:40:09.060 10237 10261 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3377ms
10-21 20:40:09.061 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=4629ms lancio=0 x=480 page=49,154 loc=22,16 target=3686
10-21 20:40:09.062 10237 10261 I ReactNativeJS: VIBRA subtab tabelle dopo=3380ms
10-21 20:40:09.063 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 20:40:09.158 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=95ms
10-21 20:40:09.752 10237 10261 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=689ms
10-21 20:40:09.752 10237 10261 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=689ms
10-21 20:40:09.752 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 20:40:13.376 11214 11214 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-21 20:40:18.971 10237 10261 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 20:40:18.971 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=14539ms lancio=0 x=480 page=49,154 loc=22,16 target=3686
10-21 20:40:18.975 10237 10261 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-21 20:40:18.976 10237 10261 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 20:40:19.400 10237 10261 I ReactNativeJS: VIBRA hscroll lancio x=469
10-21 20:40:20.015 10237 10261 I ReactNativeJS: VIBRA hscroll ferma x=469
10-21 20:40:22.424 11236 11236 I ReactNativeJS: VIBRA prova controllo senza-lancio
10-21 20:40:22.465 10237 10261 I ReactNativeJS: VIBRA subtab premuto analitica dopo=13402ms
10-21 20:40:22.465 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=3129ms lancio=0 x=469 page=265,154 loc=14,8 target=3708
10-21 20:40:22.466 10237 10261 I ReactNativeJS: VIBRA subtab analitica dopo=13403ms
10-21 20:40:22.466 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 20:40:22.484 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=18ms
10-21 20:40:22.499 10237 10261 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=33ms
10-21 20:40:22.499 10237 10261 I ReactNativeJS: VIBRA subtab cambio analitica dopo=33ms
10-21 20:40:22.673 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-21 20:40:25.082 10237 10261 I ReactNativeJS: VIBRA subtab premuto growth dopo=2616ms
10-21 20:40:25.082 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=1087ms lancio=0 x=480 page=157,154 loc=7,8 target=3696
10-21 20:40:25.083 10237 10261 I ReactNativeJS: VIBRA subtab growth dopo=2617ms
10-21 20:40:25.083 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 20:40:25.101 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=18ms
10-21 20:40:25.115 10237 10261 I ReactNativeJS: VIBRA subtab disegnata growth dopo=32ms
10-21 20:40:25.115 10237 10261 I ReactNativeJS: VIBRA subtab cambio growth dopo=32ms
10-21 20:40:25.317 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 20:40:27.634 10237 10261 I ReactNativeJS: VIBRA subtab premuto analitica dopo=2551ms
10-21 20:40:27.634 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=2275ms lancio=0 x=435 page=265,154 loc=12,16 target=3710
10-21 20:40:27.649 10237 10261 I ReactNativeJS: VIBRA subtab analitica dopo=2565ms
10-21 20:40:27.649 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=14ms
10-21 20:40:27.666 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=17ms
10-21 20:40:27.682 10237 10261 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=33ms
10-21 20:40:27.682 10237 10261 I ReactNativeJS: VIBRA subtab cambio analitica dopo=34ms
10-21 20:40:28.000 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-21 20:40:30.215 10237 10261 I ReactNativeJS: VIBRA subtab premuto growth dopo=2566ms
10-21 20:40:30.215 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=1964ms lancio=0 x=480 page=157,154 loc=7,8 target=3696
10-21 20:40:30.216 10237 10261 I ReactNativeJS: VIBRA subtab growth dopo=2567ms
10-21 20:40:30.216 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 20:40:30.229 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=13ms
10-21 20:40:30.232 10237 10261 I ReactNativeJS: VIBRA subtab disegnata growth dopo=16ms
10-21 20:40:30.248 10237 10261 I ReactNativeJS: VIBRA subtab cambio growth dopo=32ms
10-21 20:40:30.423 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 20:40:32.782 10237 10261 I ReactNativeJS: VIBRA subtab premuto analitica dopo=2566ms
10-21 20:40:32.782 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=2311ms lancio=0 x=435 page=265,154 loc=12,16 target=3710
10-21 20:40:32.799 10237 10261 I ReactNativeJS: VIBRA subtab analitica dopo=2583ms
10-21 20:40:32.799 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=17ms
10-21 20:40:32.831 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=33ms
10-21 20:40:32.849 10237 10261 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=50ms
10-21 20:40:32.849 10237 10261 I ReactNativeJS: VIBRA subtab cambio analitica dopo=50ms
10-21 20:40:32.931 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-21 20:40:35.365 10237 10261 I ReactNativeJS: VIBRA subtab premuto growth dopo=2566ms
10-21 20:40:35.365 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=1594ms lancio=0 x=480 page=157,154 loc=7,8 target=3696
10-21 20:40:35.366 10237 10261 I ReactNativeJS: VIBRA subtab growth dopo=2567ms
10-21 20:40:35.366 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 20:40:35.379 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=13ms
10-21 20:40:35.382 10237 10261 I ReactNativeJS: VIBRA subtab disegnata growth dopo=16ms
10-21 20:40:35.398 10237 10261 I ReactNativeJS: VIBRA subtab cambio growth dopo=32ms
10-21 20:40:35.586 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 20:40:37.932 10237 10261 I ReactNativeJS: VIBRA subtab premuto analitica dopo=2566ms
10-21 20:40:37.932 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=2013ms lancio=0 x=435 page=265,154 loc=12,16 target=3710
10-21 20:40:37.933 10237 10261 I ReactNativeJS: VIBRA subtab analitica dopo=2567ms
10-21 20:40:37.933 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 20:40:37.945 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=13ms
10-21 20:40:37.949 10237 10261 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=16ms
10-21 20:40:37.968 10237 10261 I ReactNativeJS: VIBRA subtab cambio analitica dopo=35ms
10-21 20:40:38.131 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-21 20:40:40.499 10237 10261 I ReactNativeJS: VIBRA subtab premuto growth dopo=2566ms
10-21 20:40:40.499 10237 10261 I ReactNativeJS: VIBRA hscroll tocco dopo=1885ms lancio=0 x=480 page=157,154 loc=7,8 target=3696
10-21 20:40:40.516 10237 10261 I ReactNativeJS: VIBRA subtab growth dopo=2584ms
10-21 20:40:40.516 10237 10261 I ReactNativeJS: VIBRA hscroll fine-tocco durata=17ms
10-21 20:40:40.540 10237 10261 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=23ms
10-21 20:40:40.549 10237 10261 I ReactNativeJS: VIBRA subtab disegnata growth dopo=32ms
10-21 20:40:40.549 10237 10261 I ReactNativeJS: VIBRA subtab cambio growth dopo=33ms
10-21 20:40:40.720 10237 10261 I ReactNativeJS: VIBRA subtab rilasciato growth
```
