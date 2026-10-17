#!/usr/bin/env bash
# Tap sulla barra delle tab dopo un lancio orizzontale (vedi 08-sticky-tap.yaml). Uso: $0 <out>
# Per ogni attesa (dalla fine del lancio al tap) e per i due versi: lancio veloce fino al bordo, tap su
# una tab vicina a quel bordo, poi conta se l'app ha ricevuto il tap (riga "VIBRA subtab" nel logcat).
OUT=$1
REPORT=$OUT/sticky-tap.md
W=$(adb shell wm size | grep -oE '[0-9]+x[0-9]+' | tail -1 | cut -dx -f1)
dump() { adb exec-out uiautomator dump /dev/tty 2>/dev/null; }
# centro "x y" del testo $1 (con o senza spazio davanti, come dopo un'icona)
center() {
  echo "$2" | grep -oE "text=\" ?$1\"[^>]*bounds=\"\[[0-9]+,[0-9]+\]\[[0-9]+,[0-9]+\]\"" | head -1 |
    sed -E 's/.*bounds="\[([0-9]+),([0-9]+)\]\[([0-9]+),([0-9]+)\]".*/\1 \2 \3 \4/' |
    awk '{ printf "%d %d", ($1+$3)/2, ($2+$4)/2 }'
}
taps() { adb logcat -d -s ReactNativeJS:* 2>/dev/null | grep -c "VIBRA subtab"; }
UI=$(dump)
read -r _ Y <<< "$(center 'Parco Paganti' "$UI")"
if [ -z "${Y:-}" ]; then echo "barra non trovata" > "$REPORT"; exit 0; fi
L=$((W * 12 / 100)); R=$((W * 88 / 100))
# posizioni delle tab con la barra ferma ai due bordi (scorrimenti lenti, poi attesa)
adb shell input swipe $L $Y $R $Y 600; sleep 3
read -r XS _ <<< "$(center 'Gruppi' "$(dump)")"
adb shell input swipe $R $Y $L $Y 600; sleep 3
read -r XE _ <<< "$(center 'Growth' "$(dump)")"
printf '# Tap sulla barra delle tab dopo un lancio (%s)\n\nBarra a y=%s; tab Gruppi a x=%s (barra all'"'"'inizio), Growth a x=%s (barra alla fine).\nAttesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).\n\n| attesa | verso | tap arrivato |\n|---|---|---|\n' "${UTENTE:-}" "$Y" "$XS" "$XE" > "$REPORT"
ok=0; tot=0
for round in 1 2; do
  for d in 0 0.2 0.4 0.7 1.0 1.5; do
    for verso in inizio fine; do
      if [ "$verso" = inizio ]; then from=$L; to=$R; x=$XS; else from=$R; to=$L; x=$XE; fi
      [ -z "$x" ] && continue
      before=$(taps)
      adb shell "input swipe $from $Y $to $Y 70; sleep $d; input tap $x $Y"
      sleep 2.5
      after=$(taps)
      tot=$((tot + 1))
      if [ "$after" -gt "$before" ]; then ok=$((ok + 1)); r=sì; else r=NO; fi
      echo "| ${d}s | $verso | $r |" >> "$REPORT"
    done
  done
done
printf '\nTap arrivati: %s su %s\n\nRighe dell'"'"'app (tocchi sulla barra e tab scelte):\n\n```\n' "$ok" "$tot" >> "$REPORT"
adb logcat -d -s ReactNativeJS:* 2>/dev/null | grep -E "VIBRA (hscroll|subtab)" | tail -80 >> "$REPORT"
echo '```' >> "$REPORT"
cat "$REPORT"
