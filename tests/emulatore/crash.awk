# Crash dell'app nel logcat (-v time): segnale nativo con la sua traccia (tombstone di crash_dump),
# eccezione Java non gestita, ANR, memoria esaurita (Scudo OOM). Le chiusure fatte da Maestro non contano.
function pidof(l) { return match(l, /\( *[0-9]+\)/) ? substr(l, RSTART + 1, RLENGTH - 2) + 0 : -1 }
FNR == NR {
  p = pidof($0)
  if ($0 ~ /F\/DEBUG/ && $0 ~ />>> com\.vibra\.mobile <<</) dbg[p] = 1
  if ($0 ~ /AndroidRuntime/ && $0 ~ /Process: com\.vibra\.mobile,/) jrt[p] = 1
  if ($0 ~ /Fatal signal/ && $0 ~ /\(om\.vibra\.mobile\)/) app[p] = 1
  next
}
{
  p = pidof($0)
  if (($0 ~ /F\/DEBUG/ && (p in dbg)) || ($0 ~ /E\/AndroidRuntime/ && (p in jrt)) || ($0 ~ /scudo/ && (p in app)) ||
      ($0 ~ /Fatal signal/ && $0 ~ /\(om\.vibra\.mobile\)/) || $0 ~ /ANR in com\.vibra\.mobile/ ||
      ($0 ~ /Scudo OOM/ && $0 ~ /vibra/)) print
}
