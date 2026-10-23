# Tap sulla barra delle tab dopo un lancio (admin)

Barra a y=405; tab Gruppi a x=412 (barra all'inizio), Growth a x=979 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | sì |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | sì |
| 0.4s | inizio | sì |
| 0.4s | fine | sì |
| 0.7s | inizio | sì |
| 0.7s | fine | sì |
| 1.0s | inizio | sì |
| 1.0s | fine | sì |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |
| 0s | inizio | sì |
| 0s | fine | sì |
| 0.2s | inizio | sì |
| 0.2s | fine | sì |
| 0.4s | inizio | sì |
| 0.4s | fine | sì |
| 0.7s | inizio | sì |
| 0.7s | fine | sì |
| 1.0s | inizio | sì |
| 1.0s | fine | sì |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |
| controllo | fermo | sì |
| controllo | fermo | NO |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |

Tap arrivati: 30 su 32

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-23 02:07:54.611 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata inviti dopo=1425927ms
10-23 02:07:54.809 10507 10530 I ReactNativeJS: VIBRA subtab disegnata inviti dopo=1426126ms
10-23 02:07:56.708 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata clienti dopo=1428024ms
10-23 02:07:56.778 10507 10530 I ReactNativeJS: VIBRA subtab disegnata clienti dopo=1428095ms
10-23 02:07:57.079 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata progressi dopo=1428395ms
10-23 02:07:57.092 10507 10530 I ReactNativeJS: VIBRA subtab disegnata progressi dopo=1428408ms
10-23 02:08:17.340 10507 10530 I ReactNativeJS: VIBRA subtab premuto clienti dopo=1448656ms
10-23 02:08:17.340 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,154 loc=29,16 target=3938
10-23 02:08:17.361 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:08:17.472 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-23 02:08:17.938 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=0
10-23 02:08:17.938 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=0
10-23 02:08:23.105 10507 10530 I ReactNativeJS: VIBRA subtab premuto albero dopo=1454421ms
10-23 02:08:23.105 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=5150ms lancio=0 x=0 page=362,154 loc=8,8 target=3972
10-23 02:08:23.142 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:08:23.273 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato albero
10-23 02:08:23.910 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=278
10-23 02:08:24.022 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=278
10-23 02:08:29.182 10824 10824 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-23 02:08:29.205 10507 10530 I ReactNativeJS: VIBRA subtab premuto albero dopo=1460521ms
10-23 02:08:29.205 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=5333ms lancio=0 x=278 page=49,154 loc=6,16 target=3974
10-23 02:08:29.223 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:08:29.377 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=0
10-23 02:08:29.378 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=0
10-23 02:08:29.389 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato albero
10-23 02:08:29.547 10507 10530 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-23 02:08:29.547 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=173ms lancio=0 x=0 page=157,154 loc=20,8 target=3948
10-23 02:08:29.548 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:08:29.621 10507 10530 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-23 02:08:29.621 10507 10530 I ReactNativeJS: VIBRA subtab gruppi dopo=74ms
10-23 02:08:29.672 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata gruppi dopo=124ms
10-23 02:08:29.690 10507 10530 I ReactNativeJS: VIBRA subtab disegnata gruppi dopo=142ms
10-23 02:08:29.695 10507 10530 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=147ms
10-23 02:08:32.103 10845 10845 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-23 02:08:32.122 10507 10530 I ReactNativeJS: VIBRA subtab premuto albero dopo=2575ms
10-23 02:08:32.122 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2749ms lancio=0 x=0 page=362,154 loc=8,8 target=3972
10-23 02:08:32.144 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:08:32.271 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=288
10-23 02:08:32.272 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato albero
10-23 02:08:32.364 10507 10530 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-23 02:08:32.364 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=142ms lancio=1 x=288 page=373,154 loc=32,8 target=4008
10-23 02:08:32.365 10507 10530 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-23 02:08:32.365 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:08:32.469 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=288
10-23 02:08:32.622 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=288
10-23 02:08:35.067 10865 10865 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-23 02:08:35.088 10507 10530 I ReactNativeJS: VIBRA subtab premuto albero dopo=5541ms
10-23 02:08:35.088 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2867ms lancio=0 x=288 page=49,154 loc=16,16 target=3974
10-23 02:08:35.110 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:08:35.254 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=18
10-23 02:08:35.255 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato albero
10-23 02:08:35.419 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=0
10-23 02:08:35.546 10507 10530 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-23 02:08:35.546 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=127ms lancio=0 x=0 page=157,154 loc=20,8 target=3948
10-23 02:08:35.547 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:08:35.605 10507 10530 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-23 02:08:35.607 10507 10530 I ReactNativeJS: VIBRA subtab gruppi dopo=60ms
10-23 02:08:35.666 10507 10530 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=120ms
10-23 02:08:38.096 10885 10885 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-23 02:08:38.122 10507 10530 I ReactNativeJS: VIBRA subtab premuto albero dopo=2576ms
10-23 02:08:38.122 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2703ms lancio=0 x=0 page=362,154 loc=8,8 target=3972
10-23 02:08:38.123 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:08:38.201 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=212
10-23 02:08:38.258 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato albero
10-23 02:08:38.308 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=212
10-23 02:08:38.441 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2894ms
10-23 02:08:38.441 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=249ms lancio=0 x=212 page=373,154 loc=78,16 target=3998
10-23 02:08:38.456 10507 10530 I ReactNativeJS: VIBRA subtab tabelle dopo=2909ms
10-23 02:08:38.456 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=16ms
10-23 02:08:38.488 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=32ms
10-23 02:08:38.536 10507 10530 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=80ms
10-23 02:08:38.536 10507 10530 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=80ms
10-23 02:08:40.558 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:08:41.076 10909 10909 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-23 02:08:41.264 10507 10530 I ReactNativeJS: VIBRA subtab premuto albero dopo=2808ms
10-23 02:08:41.265 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=346ms lancio=0 x=344 page=49,154 loc=72,16 target=3974
10-23 02:08:41.468 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato albero
10-23 02:08:41.481 10507 10530 I ReactNativeJS: VIBRA subtab albero dopo=3024ms
10-23 02:08:41.481 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=216ms
10-23 02:08:41.573 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=92ms
10-23 02:08:41.590 10507 10530 I ReactNativeJS: VIBRA subtab disegnata albero dopo=109ms
10-23 02:08:41.590 10507 10530 I ReactNativeJS: VIBRA subtab cambio albero dopo=109ms
10-23 02:08:44.567 10931 10931 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-23 02:08:45.122 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3641ms
10-23 02:08:45.122 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=1872ms lancio=0 x=157 page=373,154 loc=23,16 target=3998
10-23 02:08:45.123 10507 10530 I ReactNativeJS: VIBRA subtab tabelle dopo=3642ms
10-23 02:08:45.123 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:08:45.143 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=21ms
10-23 02:08:45.156 10507 10530 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=33ms
10-23 02:08:45.156 10507 10530 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=33ms
10-23 02:08:47.117 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:08:47.779 10952 10952 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-23 02:08:47.947 10507 10530 I ReactNativeJS: VIBRA subtab premuto albero dopo=2824ms
10-23 02:08:47.947 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=546ms lancio=0 x=344 page=49,154 loc=72,16 target=3974
10-23 02:08:47.948 10507 10530 I ReactNativeJS: VIBRA subtab albero dopo=2825ms
10-23 02:08:47.948 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:08:48.020 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=72ms
10-23 02:08:48.117 10507 10530 I ReactNativeJS: VIBRA subtab disegnata albero dopo=169ms
10-23 02:08:48.118 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato albero
10-23 02:08:48.226 10507 10530 I ReactNativeJS: VIBRA subtab cambio albero dopo=278ms
10-23 02:08:51.243 10974 10974 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-23 02:08:52.072 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=4124ms
10-23 02:08:52.072 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2786ms lancio=0 x=157 page=373,154 loc=23,16 target=3998
10-23 02:08:52.073 10507 10530 I ReactNativeJS: VIBRA subtab tabelle dopo=4125ms
10-23 02:08:52.074 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-23 02:08:52.085 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=11ms
10-23 02:08:52.089 10507 10530 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=15ms
10-23 02:08:52.107 10507 10530 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=33ms
10-23 02:08:54.131 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:08:54.762 10995 10995 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-23 02:08:55.005 10507 10530 I ReactNativeJS: VIBRA subtab premuto albero dopo=2931ms
10-23 02:08:55.006 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=542ms lancio=0 x=344 page=49,154 loc=72,16 target=3974
10-23 02:08:55.010 10507 10530 I ReactNativeJS: VIBRA subtab albero dopo=2936ms
10-23 02:08:55.012 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=6ms
10-23 02:08:55.048 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=36ms
10-23 02:08:55.182 10507 10530 I ReactNativeJS: VIBRA subtab disegnata albero dopo=170ms
10-23 02:08:55.183 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato albero
10-23 02:08:55.207 10507 10530 I ReactNativeJS: VIBRA subtab cambio albero dopo=196ms
10-23 02:08:58.823 11016 11016 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-23 02:08:59.955 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=4943ms
10-23 02:08:59.955 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=3209ms lancio=0 x=157 page=373,154 loc=23,16 target=3998
10-23 02:08:59.956 10507 10530 I ReactNativeJS: VIBRA subtab tabelle dopo=4944ms
10-23 02:08:59.956 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:08:59.968 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=13ms
10-23 02:08:59.972 10507 10530 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=16ms
10-23 02:08:59.988 10507 10530 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=32ms
10-23 02:09:02.086 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:09:02.614 11038 11038 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-23 02:09:02.876 10507 10530 I ReactNativeJS: VIBRA subtab premuto albero dopo=2920ms
10-23 02:09:02.876 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=500ms lancio=0 x=344 page=49,154 loc=72,16 target=3974
10-23 02:09:03.054 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato albero
10-23 02:09:03.072 10507 10530 I ReactNativeJS: VIBRA subtab albero dopo=3116ms
10-23 02:09:03.075 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=198ms
10-23 02:09:03.121 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=47ms
10-23 02:09:03.253 10507 10530 I ReactNativeJS: VIBRA subtab disegnata albero dopo=178ms
10-23 02:09:03.272 10507 10530 I ReactNativeJS: VIBRA subtab cambio albero dopo=197ms
10-23 02:09:07.439 11060 11060 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-23 02:09:09.057 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5982ms
10-23 02:09:09.057 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=4557ms lancio=0 x=157 page=373,154 loc=23,16 target=3998
10-23 02:09:09.073 10507 10530 I ReactNativeJS: VIBRA subtab tabelle dopo=5998ms
10-23 02:09:09.073 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=16ms
10-23 02:09:09.100 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=27ms
10-23 02:09:09.108 10507 10530 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=34ms
10-23 02:09:09.108 10507 10530 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=35ms
10-23 02:09:11.135 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:09:11.720 11081 11081 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-23 02:09:11.919 10507 10530 I ReactNativeJS: VIBRA subtab premuto albero dopo=2846ms
10-23 02:09:11.920 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=496ms lancio=0 x=344 page=49,154 loc=72,16 target=3974
10-23 02:09:12.135 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato albero
10-23 02:09:12.135 10507 10530 I ReactNativeJS: VIBRA subtab albero dopo=3062ms
10-23 02:09:12.135 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=215ms
10-23 02:09:12.374 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=239ms
10-23 02:09:12.386 10507 10530 I ReactNativeJS: VIBRA subtab premuto comitive dopo=251ms
10-23 02:09:12.387 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=964ms lancio=0 x=344 page=157,154 loc=93,16 target=3986
10-23 02:09:12.436 10507 10530 I ReactNativeJS: VIBRA subtab comitive dopo=301ms
10-23 02:09:12.438 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=51ms
10-23 02:09:12.619 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=180ms
10-23 02:09:12.632 10507 10530 I ReactNativeJS: VIBRA subtab disegnata albero dopo=194ms
10-23 02:09:12.633 10507 10530 I ReactNativeJS: VIBRA subtab cambio albero dopo=195ms
10-23 02:09:12.636 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-23 02:09:12.640 10507 10530 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=202ms
10-23 02:09:13.199 10507 10530 I ReactNativeJS: VIBRA subtab cambio comitive dopo=761ms
10-23 02:09:14.928 11102 11102 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-23 02:09:15.069 10507 10530 I ReactNativeJS: VIBRA subtab premuto growth dopo=2630ms
10-23 02:09:15.069 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=1390ms lancio=0 x=250 page=373,154 loc=25,16 target=4010
10-23 02:09:15.078 10507 10530 I ReactNativeJS: VIBRA subtab growth dopo=2640ms
10-23 02:09:15.079 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=10ms
10-23 02:09:15.114 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=35ms
10-23 02:09:15.168 10507 10530 I ReactNativeJS: VIBRA subtab disegnata growth dopo=89ms
10-23 02:09:15.177 10507 10530 I ReactNativeJS: VIBRA subtab cambio growth dopo=98ms
10-23 02:09:15.752 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato growth
10-23 02:09:17.662 11123 11123 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-23 02:09:17.694 10507 10530 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2615ms
10-23 02:09:17.695 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=990ms lancio=0 x=435 page=49,154 loc=45,8 target=3984
10-23 02:09:17.714 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:09:17.889 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=152
10-23 02:09:18.150 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-23 02:09:18.151 10507 10530 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-23 02:09:18.151 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=263ms lancio=1 x=152 page=157,154 loc=116,16 target=3962
10-23 02:09:18.152 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:09:18.234 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=152
10-23 02:09:18.252 10507 10530 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-23 02:09:18.252 10507 10530 I ReactNativeJS: VIBRA subtab parco dopo=100ms
10-23 02:09:18.313 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata parco dopo=161ms
10-23 02:09:18.379 10507 10530 I ReactNativeJS: VIBRA subtab disegnata parco dopo=227ms
10-23 02:09:18.383 10507 10530 I ReactNativeJS: VIBRA subtab cambio parco dopo=230ms
10-23 02:09:20.707 11145 11145 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-23 02:09:20.740 10507 10530 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2587ms
10-23 02:09:20.740 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=1971ms lancio=0 x=50 page=362,154 loc=4,16 target=3986
10-23 02:09:20.741 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:09:20.934 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=365
10-23 02:09:20.934 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-23 02:09:21.096 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=365
10-23 02:09:21.192 10507 10530 I ReactNativeJS: VIBRA subtab premuto analitica dopo=3040ms
10-23 02:09:21.192 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=350ms lancio=0 x=365 page=373,154 loc=18,8 target=4020
10-23 02:09:21.194 10507 10530 I ReactNativeJS: VIBRA subtab analitica dopo=3042ms
10-23 02:09:21.194 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-23 02:09:21.229 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=35ms
10-23 02:09:21.240 10507 10530 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=46ms
10-23 02:09:21.240 10507 10530 I ReactNativeJS: VIBRA subtab cambio analitica dopo=46ms
10-23 02:09:21.546 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-23 02:09:23.743 11166 11166 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-23 02:09:23.773 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2579ms
10-23 02:09:23.773 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2056ms lancio=0 x=480 page=49,154 loc=22,16 target=3998
10-23 02:09:23.774 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:09:23.905 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:09:24.288 10507 10530 I ReactNativeJS: VIBRA subtab premuto growth dopo=3094ms
10-23 02:09:24.289 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2572ms lancio=0 x=480 page=157,154 loc=7,8 target=4008
10-23 02:09:24.289 10507 10530 I ReactNativeJS: VIBRA subtab growth dopo=3095ms
10-23 02:09:24.291 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=3ms
10-23 02:09:24.303 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=11ms
10-23 02:09:24.305 10507 10530 I ReactNativeJS: VIBRA subtab disegnata growth dopo=14ms
10-23 02:09:24.322 10507 10530 I ReactNativeJS: VIBRA subtab cambio growth dopo=30ms
10-23 02:09:24.458 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato growth
10-23 02:09:26.841 11187 11187 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-23 02:09:26.873 10507 10530 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2582ms
10-23 02:09:26.873 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2256ms lancio=0 x=435 page=362,154 loc=10,16 target=4034
10-23 02:09:26.874 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:09:27.020 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=480
10-23 02:09:27.020 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=480
10-23 02:09:27.020 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-23 02:09:27.438 10507 10530 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3147ms
10-23 02:09:27.438 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=419ms lancio=0 x=480 page=373,154 loc=34,8 target=4032
10-23 02:09:27.439 10507 10530 I ReactNativeJS: VIBRA subtab mappa dopo=3148ms
10-23 02:09:27.442 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=3ms
10-23 02:09:27.453 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=11ms
10-23 02:09:27.455 10507 10530 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=14ms
10-23 02:09:27.472 10507 10530 I ReactNativeJS: VIBRA subtab cambio mappa dopo=30ms
10-23 02:09:27.831 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-23 02:09:30.107 11329 11329 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-23 02:09:30.143 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2702ms
10-23 02:09:30.143 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=3124ms lancio=0 x=480 page=49,154 loc=22,16 target=3998
10-23 02:09:30.160 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:09:30.224 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=402
10-23 02:09:30.289 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:09:30.505 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=402
10-23 02:09:30.955 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3513ms
10-23 02:09:30.955 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=738ms lancio=0 x=402 page=157,154 loc=19,8 target=3996
10-23 02:09:30.956 10507 10530 I ReactNativeJS: VIBRA subtab tabelle dopo=3514ms
10-23 02:09:30.956 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:09:30.968 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=12ms
10-23 02:09:30.972 10507 10530 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=16ms
10-23 02:09:30.988 10507 10530 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=32ms
10-23 02:09:31.276 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:09:33.507 11351 11351 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-23 02:09:33.539 10507 10530 I ReactNativeJS: VIBRA subtab premuto analitica dopo=2583ms
10-23 02:09:33.539 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2162ms lancio=0 x=344 page=362,154 loc=18,16 target=4022
10-23 02:09:33.540 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:09:33.608 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=480
10-23 02:09:33.608 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=480
10-23 02:09:33.728 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-23 02:09:34.338 10507 10530 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3383ms
10-23 02:09:34.338 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=731ms lancio=0 x=480 page=373,154 loc=34,8 target=4032
10-23 02:09:34.339 10507 10530 I ReactNativeJS: VIBRA subtab mappa dopo=3384ms
10-23 02:09:34.339 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:09:34.352 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=12ms
10-23 02:09:34.355 10507 10530 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=16ms
10-23 02:09:34.371 10507 10530 I ReactNativeJS: VIBRA subtab cambio mappa dopo=32ms
10-23 02:09:34.523 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-23 02:09:36.927 11409 11409 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-23 02:09:36.956 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2617ms
10-23 02:09:36.957 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=3349ms lancio=0 x=480 page=49,154 loc=22,16 target=3998
10-23 02:09:36.958 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:09:37.089 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:09:38.072 10507 10530 I ReactNativeJS: VIBRA subtab premuto growth dopo=3732ms
10-23 02:09:38.072 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=4464ms lancio=0 x=480 page=157,154 loc=7,8 target=4008
10-23 02:09:38.072 10507 10530 I ReactNativeJS: VIBRA subtab growth dopo=3733ms
10-23 02:09:38.072 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:09:38.084 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=12ms
10-23 02:09:38.088 10507 10530 I ReactNativeJS: VIBRA subtab disegnata growth dopo=16ms
10-23 02:09:38.105 10507 10530 I ReactNativeJS: VIBRA subtab cambio growth dopo=32ms
10-23 02:09:38.276 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato growth
10-23 02:09:40.616 11433 11433 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-23 02:09:40.639 10507 10530 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2566ms
10-23 02:09:40.639 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2198ms lancio=0 x=435 page=362,154 loc=10,16 target=4034
10-23 02:09:40.640 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:09:40.722 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=480
10-23 02:09:40.724 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=480
10-23 02:09:40.855 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-23 02:09:41.755 10507 10530 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3682ms
10-23 02:09:41.755 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=1031ms lancio=0 x=480 page=373,154 loc=34,8 target=4032
10-23 02:09:41.756 10507 10530 I ReactNativeJS: VIBRA subtab mappa dopo=3683ms
10-23 02:09:41.756 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:09:41.773 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=18ms
10-23 02:09:41.789 10507 10530 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=33ms
10-23 02:09:41.789 10507 10530 I ReactNativeJS: VIBRA subtab cambio mappa dopo=33ms
10-23 02:09:41.923 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-23 02:09:44.378 11479 11479 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-23 02:09:44.422 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2666ms
10-23 02:09:44.422 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=3698ms lancio=0 x=480 page=49,154 loc=22,16 target=3998
10-23 02:09:44.445 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:09:44.598 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=306
10-23 02:09:44.598 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:09:44.955 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=306
10-23 02:09:46.138 10507 10530 I ReactNativeJS: VIBRA subtab premuto comitive dopo=4383ms
10-23 02:09:46.138 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=1541ms lancio=0 x=306 page=157,154 loc=22,8 target=3984
10-23 02:09:46.139 10507 10530 I ReactNativeJS: VIBRA subtab comitive dopo=4384ms
10-23 02:09:46.142 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=3ms
10-23 02:09:46.158 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=17ms
10-23 02:09:46.172 10507 10530 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=30ms
10-23 02:09:46.172 10507 10530 I ReactNativeJS: VIBRA subtab cambio comitive dopo=30ms
10-23 02:09:46.307 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-23 02:09:48.692 11500 11500 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-23 02:09:48.722 10507 10530 I ReactNativeJS: VIBRA subtab premuto growth dopo=2581ms
10-23 02:09:48.723 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2278ms lancio=0 x=250 page=362,154 loc=14,16 target=4010
10-23 02:09:48.724 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:09:48.856 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato growth
10-23 02:09:48.894 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=480
10-23 02:09:48.894 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=480
10-23 02:09:50.422 10507 10530 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4280ms
10-23 02:09:50.422 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=1647ms lancio=0 x=480 page=373,154 loc=34,8 target=4032
10-23 02:09:50.423 10507 10530 I ReactNativeJS: VIBRA subtab mappa dopo=4281ms
10-23 02:09:50.423 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=2ms
10-23 02:09:50.435 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=11ms
10-23 02:09:50.438 10507 10530 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=15ms
10-23 02:09:50.455 10507 10530 I ReactNativeJS: VIBRA subtab cambio mappa dopo=32ms
10-23 02:09:50.574 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-23 02:09:53.039 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2615ms
10-23 02:09:53.039 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=4264ms lancio=0 x=480 page=49,154 loc=22,16 target=3998
10-23 02:09:53.073 10507 10530 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-23 02:09:53.313 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:09:53.859 10507 10530 I ReactNativeJS: VIBRA hscroll lancio x=189
10-23 02:09:54.121 10507 10530 I ReactNativeJS: VIBRA hscroll ferma x=189
10-23 02:09:56.871 11545 11545 I ReactNativeJS: VIBRA prova controllo senza-lancio
10-23 02:09:56.922 10507 10530 I ReactNativeJS: VIBRA subtab premuto comitive dopo=6498ms
10-23 02:09:56.922 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=3063ms lancio=0 x=189 page=265,154 loc=14,8 target=3984
10-23 02:09:56.922 10507 10530 I ReactNativeJS: VIBRA subtab comitive dopo=6499ms
10-23 02:09:56.922 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:09:56.934 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=11ms
10-23 02:09:56.938 10507 10530 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=16ms
10-23 02:09:56.955 10507 10530 I ReactNativeJS: VIBRA subtab cambio comitive dopo=32ms
10-23 02:09:57.085 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-23 02:09:59.489 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2246ms lancio=0 x=250 page=157,154 loc=391,20 target=4036
10-23 02:09:59.489 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:10:02.055 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2566ms
10-23 02:10:02.055 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=4812ms lancio=0 x=250 page=265,154 loc=8,16 target=3998
10-23 02:10:02.056 10507 10530 I ReactNativeJS: VIBRA subtab tabelle dopo=2567ms
10-23 02:10:02.056 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:10:02.067 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=11ms
10-23 02:10:02.072 10507 10530 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=16ms
10-23 02:10:02.090 10507 10530 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=34ms
10-23 02:10:02.199 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:10:04.622 10507 10530 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2565ms
10-23 02:10:04.622 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2396ms lancio=0 x=344 page=157,154 loc=93,16 target=3986
10-23 02:10:04.622 10507 10530 I ReactNativeJS: VIBRA subtab comitive dopo=2566ms
10-23 02:10:04.623 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:10:04.633 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=11ms
10-23 02:10:04.639 10507 10530 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=16ms
10-23 02:10:04.655 10507 10530 I ReactNativeJS: VIBRA subtab cambio comitive dopo=32ms
10-23 02:10:04.794 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-23 02:10:07.188 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2566ms
10-23 02:10:07.189 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2355ms lancio=0 x=250 page=265,154 loc=8,16 target=3998
10-23 02:10:07.189 10507 10530 I ReactNativeJS: VIBRA subtab tabelle dopo=2567ms
10-23 02:10:07.190 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:10:07.201 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=11ms
10-23 02:10:07.205 10507 10530 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=16ms
10-23 02:10:07.222 10507 10530 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=32ms
10-23 02:10:07.346 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:10:09.755 10507 10530 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2565ms
10-23 02:10:09.755 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2365ms lancio=0 x=344 page=157,154 loc=93,16 target=3986
10-23 02:10:09.756 10507 10530 I ReactNativeJS: VIBRA subtab comitive dopo=2566ms
10-23 02:10:09.756 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:10:09.767 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=11ms
10-23 02:10:09.772 10507 10530 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=16ms
10-23 02:10:09.788 10507 10530 I ReactNativeJS: VIBRA subtab cambio comitive dopo=32ms
10-23 02:10:09.923 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-23 02:10:12.322 10507 10530 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2566ms
10-23 02:10:12.322 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2341ms lancio=0 x=250 page=265,154 loc=8,16 target=3998
10-23 02:10:12.322 10507 10530 I ReactNativeJS: VIBRA subtab tabelle dopo=2566ms
10-23 02:10:12.322 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:10:12.332 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=10ms
10-23 02:10:12.338 10507 10530 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=16ms
10-23 02:10:12.355 10507 10530 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=32ms
10-23 02:10:12.506 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-23 02:10:14.888 10507 10530 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2566ms
10-23 02:10:14.888 10507 10530 I ReactNativeJS: VIBRA hscroll tocco dopo=2213ms lancio=0 x=344 page=157,154 loc=93,16 target=3986
10-23 02:10:14.889 10507 10530 I ReactNativeJS: VIBRA subtab comitive dopo=2567ms
10-23 02:10:14.890 10507 10530 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-23 02:10:14.901 10507 10530 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=11ms
10-23 02:10:14.905 10507 10530 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=16ms
10-23 02:10:14.921 10507 10530 I ReactNativeJS: VIBRA subtab cambio comitive dopo=32ms
10-23 02:10:15.038 10507 10530 I ReactNativeJS: VIBRA subtab rilasciato comitive
```
