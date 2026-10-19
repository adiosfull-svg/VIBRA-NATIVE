# Dopo prove/viste.yaml: albero delle viste dell'attività in primo piano e conteggio per classe.
OUT="$1"
adb shell dumpsys activity top > "$OUT/viste.txt" 2>&1
{
  echo "viste totali: $(grep -cE '^ +[a-zA-Z_.$]+\{[0-9a-f]+ ' "$OUT/viste.txt")"
  grep -oE '^ +[a-zA-Z_.$]+\{' "$OUT/viste.txt" | sed -E 's/^ +//; s/\{$//' | sort | uniq -c | sort -rn | head -30
} > "$OUT/viste-conteggio.txt"
cat "$OUT/viste-conteggio.txt"
