# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=405; tab Gruppi a x=412 (barra all'inizio), Growth a x=1022 (barra alla fine).
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
| 0.7s | fine | sì |
| 1.0s | inizio | sì |
| 1.0s | fine | NO |
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

Tap arrivati: 21 su 32

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-21 22:34:59.383 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata progressi dopo=995364ms
10-21 22:34:59.662 10586 10610 I ReactNativeJS: VIBRA subtab disegnata progressi dopo=995644ms
10-21 22:35:01.706 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata inviti dopo=997687ms
10-21 22:35:02.010 10586 10610 I ReactNativeJS: VIBRA subtab disegnata inviti dopo=997992ms
10-21 22:35:06.098 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata clienti dopo=1002080ms
10-21 22:35:06.315 10586 10610 I ReactNativeJS: VIBRA subtab disegnata clienti dopo=1002297ms
10-21 22:35:30.553 10586 10610 I ReactNativeJS: VIBRA subtab premuto clienti dopo=1026535ms
10-21 22:35:30.553 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,154 loc=29,16 target=7148
10-21 22:35:30.587 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:35:30.686 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-21 22:35:31.168 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=0
10-21 22:35:31.168 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=0
10-21 22:35:36.436 10586 10610 I ReactNativeJS: VIBRA subtab premuto albero dopo=1032417ms
10-21 22:35:36.436 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=5250ms lancio=0 x=0 page=362,154 loc=8,8 target=7182
10-21 22:35:36.470 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:35:36.801 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato albero
10-21 22:35:37.429 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=246
10-21 22:35:37.535 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=246
10-21 22:35:42.722 10870 10870 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-21 22:35:42.753 10586 10610 I ReactNativeJS: VIBRA subtab premuto parco dopo=1038735ms
10-21 22:35:42.753 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=5471ms lancio=0 x=246 page=49,154 loc=71,8 target=7170
10-21 22:35:42.755 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:35:42.861 10586 10610 I ReactNativeJS: VIBRA subtab premuto albero dopo=1038842ms
10-21 22:35:42.861 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=5578ms lancio=0 x=246 page=157,154 loc=82,16 target=7184
10-21 22:35:42.878 10586 10610 I ReactNativeJS: VIBRA subtab albero dopo=1038859ms
10-21 22:35:42.882 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=22ms
10-21 22:35:42.926 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=43ms
10-21 22:35:42.926 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato parco
10-21 22:35:42.941 10586 10610 I ReactNativeJS: VIBRA subtab disegnata albero dopo=58ms
10-21 22:35:42.941 10586 10610 I ReactNativeJS: VIBRA subtab cambio albero dopo=58ms
10-21 22:35:43.520 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato albero
10-21 22:35:45.792 10892 10892 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-21 22:35:45.838 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2955ms
10-21 22:35:45.838 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=1070ms lancio=0 x=157 page=362,154 loc=12,16 target=7208
10-21 22:35:45.874 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:35:46.099 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=327
10-21 22:35:46.100 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:35:46.321 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=327
10-21 22:35:48.806 10914 10914 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-21 22:35:48.837 10586 10610 I ReactNativeJS: VIBRA subtab premuto albero dopo=5954ms
10-21 22:35:48.837 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=2900ms lancio=0 x=327 page=49,154 loc=23,8 target=7182
10-21 22:35:48.838 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:35:48.968 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato albero
10-21 22:35:49.152 10586 10610 I ReactNativeJS: VIBRA subtab premuto comitive dopo=6270ms
10-21 22:35:49.152 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=3215ms lancio=0 x=327 page=157,154 loc=44,8 target=7194
10-21 22:35:49.153 10586 10610 I ReactNativeJS: VIBRA subtab comitive dopo=6271ms
10-21 22:35:49.153 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 22:35:49.168 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=15ms
10-21 22:35:49.186 10586 10610 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=33ms
10-21 22:35:49.186 10586 10610 I ReactNativeJS: VIBRA subtab cambio comitive dopo=33ms
10-21 22:35:49.367 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-21 22:35:51.722 10936 10936 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-21 22:35:51.753 10586 10610 I ReactNativeJS: VIBRA subtab premuto growth dopo=2600ms
10-21 22:35:51.753 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=1917ms lancio=0 x=250 page=362,154 loc=14,16 target=7220
10-21 22:35:51.754 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:35:51.823 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=458
10-21 22:35:52.027 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 22:35:52.200 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 22:35:54.767 10956 10956 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-21 22:35:54.787 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5634ms
10-21 22:35:54.787 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=2587ms lancio=0 x=480 page=49,154 loc=22,16 target=7208
10-21 22:35:54.804 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:35:55.058 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:35:55.299 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=227
10-21 22:35:55.505 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=227
10-21 22:35:55.752 10586 10610 I ReactNativeJS: VIBRA subtab premuto albero dopo=6599ms
10-21 22:35:55.752 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=698ms lancio=0 x=227 page=157,154 loc=31,8 target=7182
10-21 22:35:55.753 10586 10610 I ReactNativeJS: VIBRA subtab albero dopo=6600ms
10-21 22:35:55.753 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 22:35:55.769 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=16ms
10-21 22:35:55.785 10586 10610 I ReactNativeJS: VIBRA subtab disegnata albero dopo=32ms
10-21 22:35:55.786 10586 10610 I ReactNativeJS: VIBRA subtab cambio albero dopo=32ms
10-21 22:35:56.139 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato albero
10-21 22:35:58.322 10977 10977 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-21 22:35:58.353 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2600ms
10-21 22:35:58.353 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=1619ms lancio=0 x=157 page=362,154 loc=12,16 target=7208
10-21 22:35:58.354 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:35:58.573 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:35:58.708 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=461
10-21 22:35:58.919 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=461
10-21 22:36:01.732 10998 10998 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-21 22:36:01.752 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5999ms
10-21 22:36:01.752 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=3179ms lancio=0 x=461 page=49,154 loc=3,16 target=7208
10-21 22:36:01.770 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:02.015 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:36:02.091 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=218
10-21 22:36:02.202 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=218
10-21 22:36:02.854 10586 10610 I ReactNativeJS: VIBRA subtab premuto albero dopo=7101ms
10-21 22:36:02.854 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=839ms lancio=0 x=218 page=157,154 loc=21,8 target=7182
10-21 22:36:02.856 10586 10610 I ReactNativeJS: VIBRA subtab albero dopo=7103ms
10-21 22:36:02.856 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-21 22:36:02.885 10586 10610 I ReactNativeJS: VIBRA subtab cambio albero dopo=29ms
10-21 22:36:02.985 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato albero
10-21 22:36:05.433 11019 11019 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-21 22:36:05.453 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2597ms
10-21 22:36:05.453 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=3438ms lancio=0 x=218 page=362,154 loc=40,8 target=7206
10-21 22:36:05.471 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:05.634 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=477
10-21 22:36:05.634 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:36:06.035 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=477
10-21 22:36:08.941 11039 11039 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-21 22:36:08.970 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=6114ms
10-21 22:36:08.970 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=3336ms lancio=0 x=477 page=49,154 loc=18,16 target=7208
10-21 22:36:08.971 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:09.104 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:36:10.069 10586 10610 I ReactNativeJS: VIBRA subtab premuto growth dopo=7213ms
10-21 22:36:10.070 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=4436ms lancio=0 x=477 page=157,154 loc=4,8 target=7218
10-21 22:36:10.071 10586 10610 I ReactNativeJS: VIBRA subtab growth dopo=7215ms
10-21 22:36:10.073 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=3ms
10-21 22:36:10.093 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=19ms
10-21 22:36:10.102 10586 10610 I ReactNativeJS: VIBRA subtab disegnata growth dopo=29ms
10-21 22:36:10.102 10586 10610 I ReactNativeJS: VIBRA subtab cambio growth dopo=29ms
10-21 22:36:10.869 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 22:36:12.886 11093 11093 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-21 22:36:12.919 10586 10610 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2846ms
10-21 22:36:12.919 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=864ms lancio=0 x=435 page=362,154 loc=10,16 target=7244
10-21 22:36:12.920 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:13.002 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=480
10-21 22:36:13.003 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 22:36:13.329 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-21 22:36:16.587 11114 11114 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-21 22:36:16.620 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=6546ms
10-21 22:36:16.620 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=3601ms lancio=0 x=480 page=49,154 loc=22,16 target=7208
10-21 22:36:16.621 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:16.752 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:36:18.218 10586 10610 I ReactNativeJS: VIBRA subtab premuto growth dopo=8145ms
10-21 22:36:18.219 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=5200ms lancio=0 x=480 page=157,154 loc=7,8 target=7218
10-21 22:36:18.220 10586 10610 I ReactNativeJS: VIBRA subtab growth dopo=8146ms
10-21 22:36:18.221 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-21 22:36:18.252 10586 10610 I ReactNativeJS: VIBRA subtab cambio growth dopo=30ms
10-21 22:36:18.353 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 22:36:20.789 11135 11135 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-21 22:36:20.819 10586 10610 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2598ms
10-21 22:36:20.819 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=7801ms lancio=0 x=480 page=362,154 loc=23,8 target=7242
10-21 22:36:20.820 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:20.902 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=480
10-21 22:36:20.902 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 22:36:21.214 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-21 22:36:24.997 11155 11155 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-21 22:36:25.018 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=6797ms
10-21 22:36:25.019 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=4099ms lancio=0 x=480 page=49,154 loc=22,16 target=7208
10-21 22:36:25.038 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:25.426 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:36:25.734 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=208
10-21 22:36:25.823 10586 10610 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 22:36:25.824 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=398ms lancio=1 x=208 page=157,154 loc=11,8 target=7182
10-21 22:36:25.845 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=21ms
10-21 22:36:25.845 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=208
10-21 22:36:25.903 10586 10610 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 22:36:25.903 10586 10610 I ReactNativeJS: VIBRA subtab albero dopo=58ms
10-21 22:36:26.013 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=168ms
10-21 22:36:26.020 10586 10610 I ReactNativeJS: VIBRA subtab disegnata albero dopo=175ms
10-21 22:36:26.020 10586 10610 I ReactNativeJS: VIBRA subtab cambio albero dopo=175ms
10-21 22:36:28.638 11175 11175 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-21 22:36:28.719 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2874ms
10-21 22:36:28.720 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=1153ms lancio=0 x=157 page=362,154 loc=12,16 target=7208
10-21 22:36:28.777 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:28.893 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=336
10-21 22:36:28.900 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:36:29.118 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 22:36:31.683 11196 11196 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-21 22:36:31.702 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5857ms
10-21 22:36:31.703 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=2584ms lancio=0 x=480 page=49,154 loc=22,16 target=7208
10-21 22:36:31.720 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:31.888 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=210
10-21 22:36:31.889 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:36:32.257 10586 10610 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-21 22:36:32.257 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=369ms lancio=1 x=210 page=157,154 loc=13,8 target=7182
10-21 22:36:32.258 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 22:36:32.301 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=210
10-21 22:36:32.318 10586 10610 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 22:36:32.319 10586 10610 I ReactNativeJS: VIBRA subtab albero dopo=61ms
10-21 22:36:32.352 10586 10610 I ReactNativeJS: VIBRA subtab cambio albero dopo=94ms
10-21 22:36:34.830 11216 11216 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-21 22:36:34.852 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2594ms
10-21 22:36:34.852 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=2964ms lancio=0 x=210 page=362,154 loc=32,8 target=7206
10-21 22:36:34.872 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:35.039 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:36:35.233 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=475
10-21 22:36:35.371 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=475
10-21 22:36:38.117 11236 11236 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-21 22:36:38.137 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5879ms
10-21 22:36:38.137 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=3098ms lancio=0 x=475 page=49,154 loc=17,16 target=7208
10-21 22:36:38.155 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:38.351 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:36:38.523 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=227
10-21 22:36:38.689 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=227
10-21 22:36:38.952 10586 10610 I ReactNativeJS: VIBRA subtab premuto albero dopo=6694ms
10-21 22:36:38.952 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=601ms lancio=0 x=227 page=157,154 loc=31,8 target=7182
10-21 22:36:38.953 10586 10610 I ReactNativeJS: VIBRA subtab albero dopo=6695ms
10-21 22:36:38.953 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 22:36:38.985 10586 10610 I ReactNativeJS: VIBRA subtab cambio albero dopo=32ms
10-21 22:36:39.085 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato albero
10-21 22:36:41.522 11259 11259 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-21 22:36:41.553 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2600ms
10-21 22:36:41.553 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=3202ms lancio=0 x=227 page=362,154 loc=82,16 target=7208
10-21 22:36:41.554 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:41.757 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=480
10-21 22:36:41.757 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 22:36:41.758 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:36:44.771 11279 11279 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-21 22:36:44.803 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5850ms
10-21 22:36:44.803 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=3064ms lancio=0 x=480 page=49,154 loc=22,16 target=7208
10-21 22:36:44.804 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:44.937 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:36:45.602 10586 10610 I ReactNativeJS: VIBRA subtab premuto growth dopo=6649ms
10-21 22:36:45.602 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=3863ms lancio=0 x=480 page=157,154 loc=7,8 target=7218
10-21 22:36:45.604 10586 10610 I ReactNativeJS: VIBRA subtab growth dopo=6651ms
10-21 22:36:45.604 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-21 22:36:45.620 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=16ms
10-21 22:36:45.636 10586 10610 I ReactNativeJS: VIBRA subtab disegnata growth dopo=32ms
10-21 22:36:45.636 10586 10610 I ReactNativeJS: VIBRA subtab cambio growth dopo=32ms
10-21 22:36:46.543 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 22:36:48.316 11300 11300 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-21 22:36:48.587 10586 10610 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2983ms
10-21 22:36:48.587 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=963ms lancio=0 x=435 page=362,154 loc=10,16 target=7244
10-21 22:36:48.628 10586 10610 I ReactNativeJS: VIBRA subtab mappa dopo=3024ms
10-21 22:36:48.631 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=44ms
10-21 22:36:48.659 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=28ms
10-21 22:36:48.728 10586 10610 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=98ms
10-21 22:36:48.729 10586 10610 I ReactNativeJS: VIBRA subtab cambio mappa dopo=98ms
10-21 22:36:48.729 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-21 22:36:52.789 11432 11432 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-21 22:36:52.837 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=4207ms
10-21 22:36:52.838 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=2994ms lancio=0 x=480 page=49,154 loc=22,16 target=7208
10-21 22:36:52.854 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:36:53.464 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=386
10-21 22:36:53.465 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:36:54.452 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=386
10-21 22:36:54.528 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5897ms
10-21 22:36:54.529 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=1065ms lancio=0 x=386 page=157,154 loc=3,8 target=7206
10-21 22:36:54.532 10586 10610 I ReactNativeJS: VIBRA subtab tabelle dopo=5901ms
10-21 22:36:54.537 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=8ms
10-21 22:36:54.575 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=38ms
10-21 22:36:54.586 10586 10610 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=49ms
10-21 22:36:54.587 10586 10610 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=50ms
10-21 22:36:58.191 11456 11456 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-21 22:37:02.171 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:37:02.278 10586 10610 I ReactNativeJS: VIBRA subtab premuto analitica dopo=7741ms
10-21 22:37:02.278 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=8814ms lancio=0 x=386 page=362,154 loc=27,8 target=7230
10-21 22:37:02.282 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:37:02.283 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=480
10-21 22:37:02.283 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=480
10-21 22:37:02.817 11481 11481 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-21 22:37:03.221 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=8684ms
10-21 22:37:03.221 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=939ms lancio=0 x=480 page=49,154 loc=22,16 target=7208
10-21 22:37:03.234 10586 10610 I ReactNativeJS: VIBRA subtab tabelle dopo=8697ms
10-21 22:37:03.234 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=13ms
10-21 22:37:03.266 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-21 22:37:03.608 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:37:03.624 10586 10610 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=390ms
10-21 22:37:07.269 11516 11516 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-21 22:37:11.452 10586 10610 I ReactNativeJS: VIBRA subtab premuto albero dopo=8218ms
10-21 22:37:11.452 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=7845ms lancio=0 x=344 page=49,154 loc=72,16 target=7184
10-21 22:37:11.487 10586 10610 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-21 22:37:12.185 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato albero
10-21 22:37:12.390 10586 10610 I ReactNativeJS: VIBRA hscroll lancio x=318
10-21 22:37:12.868 10586 10610 I ReactNativeJS: VIBRA hscroll ferma x=318
10-21 22:37:15.391 11538 11538 I ReactNativeJS: VIBRA prova controllo senza-lancio
10-21 22:37:15.436 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=12202ms
10-21 22:37:15.436 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=3251ms lancio=0 x=318 page=265,154 loc=76,16 target=7208
10-21 22:37:15.437 10586 10610 I ReactNativeJS: VIBRA subtab tabelle dopo=12203ms
10-21 22:37:15.437 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 22:37:15.468 10586 10610 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=31ms
10-21 22:37:15.570 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:37:18.035 10586 10610 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2598ms
10-21 22:37:18.036 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=5851ms lancio=0 x=318 page=157,154 loc=35,8 target=7194
10-21 22:37:18.037 10586 10610 I ReactNativeJS: VIBRA subtab comitive dopo=2600ms
10-21 22:37:18.037 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 22:37:18.054 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=17ms
10-21 22:37:18.070 10586 10610 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=33ms
10-21 22:37:18.070 10586 10610 I ReactNativeJS: VIBRA subtab cambio comitive dopo=33ms
10-21 22:37:18.282 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-21 22:37:20.603 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2566ms
10-21 22:37:20.603 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=1712ms lancio=0 x=250 page=265,154 loc=8,16 target=7208
10-21 22:37:20.618 10586 10610 I ReactNativeJS: VIBRA subtab tabelle dopo=2581ms
10-21 22:37:20.619 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=16ms
10-21 22:37:20.668 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=49ms
10-21 22:37:20.686 10586 10610 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=67ms
10-21 22:37:20.686 10586 10610 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=67ms
10-21 22:37:22.412 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:37:24.372 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=5481ms lancio=0 x=250 page=157,154 loc=391,20 target=7246
10-21 22:37:24.373 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 22:37:24.861 10586 10610 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-21 22:37:24.862 10586 10610 I ReactNativeJS: VIBRA subtab comitive dopo=489ms
10-21 22:37:24.909 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=536ms
10-21 22:37:25.599 10586 10610 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=1226ms
10-21 22:37:25.740 10586 10610 I ReactNativeJS: VIBRA subtab cambio comitive dopo=1367ms
10-21 22:37:26.742 10586 10610 I ReactNativeJS: VIBRA subtab premuto growth dopo=2369ms
10-21 22:37:26.742 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=2318ms lancio=0 x=344 page=265,154 loc=12,16 target=7220
10-21 22:37:26.743 10586 10610 I ReactNativeJS: VIBRA subtab growth dopo=2370ms
10-21 22:37:26.743 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 22:37:26.790 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=47ms
10-21 22:37:26.898 10586 10610 I ReactNativeJS: VIBRA subtab disegnata growth dopo=155ms
10-21 22:37:26.898 10586 10610 I ReactNativeJS: VIBRA subtab cambio growth dopo=155ms
10-21 22:37:26.901 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato growth
10-21 22:37:29.963 10586 10610 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3220ms
10-21 22:37:29.964 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=700ms lancio=0 x=435 page=157,154 loc=85,16 target=7208
10-21 22:37:30.012 10586 10610 I ReactNativeJS: VIBRA subtab tabelle dopo=3269ms
10-21 22:37:30.013 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=49ms
10-21 22:37:30.151 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=138ms
10-21 22:37:30.152 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-21 22:37:30.178 10586 10610 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=165ms
10-21 22:37:30.196 10586 10610 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=183ms
10-21 22:37:33.328 10586 10610 I ReactNativeJS: VIBRA subtab premuto analitica dopo=3315ms
10-21 22:37:33.328 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=4064ms lancio=0 x=435 page=265,154 loc=12,16 target=7232
10-21 22:37:33.329 10586 10610 I ReactNativeJS: VIBRA subtab analitica dopo=3316ms
10-21 22:37:33.329 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-21 22:37:33.345 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=16ms
10-21 22:37:33.838 10586 10610 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=509ms
10-21 22:37:33.841 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-21 22:37:33.841 10586 10610 I ReactNativeJS: VIBRA subtab cambio analitica dopo=512ms
10-21 22:37:35.654 10586 10610 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2325ms
10-21 22:37:35.654 10586 10610 I ReactNativeJS: VIBRA hscroll tocco dopo=1807ms lancio=0 x=344 page=157,154 loc=93,16 target=7196
10-21 22:37:35.661 10586 10610 I ReactNativeJS: VIBRA subtab comitive dopo=2331ms
10-21 22:37:35.662 10586 10610 I ReactNativeJS: VIBRA hscroll fine-tocco durata=8ms
10-21 22:37:35.710 10586 10610 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=48ms
10-21 22:37:35.973 10586 10610 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=310ms
10-21 22:37:35.973 10586 10610 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-21 22:37:36.332 10586 10610 I ReactNativeJS: VIBRA subtab cambio comitive dopo=670ms
```
