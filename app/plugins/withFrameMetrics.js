// SOLO build di prova (VIBRA_FRAME_METRICS=1 al prebuild: Test Lab, emulatore in modalità fluidità).
// Misura la fluidità vera dal sistema: Window.OnFrameMetricsAvailableListener dà la durata di ogni
// frame disegnato e la sua scadenza (16,7 ms a 60 Hz, 8,3 ms a 120 Hz). Ogni 5 s scrive nel logcat
//   VIBRA_FRAMES n=<frame> jank=<oltre la scadenza> p50=<ms> p90=<ms> p99=<ms> max=<ms>
// (solo se nei 5 s si è disegnato qualcosa). I test Robo di Test Lab non raccolgono gli FPS: così si
// leggono dal logcat che Test Lab scarica (tools/testlab/prestazioni.py). Nell'APK vero non c'è.
const { withMainActivity } = require('@expo/config-plugins');

const IMPORTS = `
import android.os.Handler
import android.os.HandlerThread
import android.util.Log
import android.view.FrameMetrics
`;

const HELPER = `

// VIBRA (plugins/withFrameMetrics.js): durata dei frame dal sistema, riepilogo ogni 5 s nel logcat
object VibraFrameStats {
  private val lock = Any()
  private val durations = ArrayList<Long>()
  private var jank = 0
  private var started = false

  fun attach(activity: android.app.Activity) {
    val thread = HandlerThread("vibra-frames").apply { start() }
    val handler = Handler(thread.looper)
    activity.window.addOnFrameMetricsAvailableListener({ _, metrics, _ ->
      val total = metrics.getMetric(FrameMetrics.TOTAL_DURATION)
      val deadline = if (android.os.Build.VERSION.SDK_INT >= 31) metrics.getMetric(FrameMetrics.DEADLINE) else 16_666_667L
      synchronized(lock) {
        durations.add(total)
        if (total > deadline) jank++
      }
    }, handler)
    if (!started) {
      started = true
      handler.postDelayed(object : Runnable {
        override fun run() {
          report()
          handler.postDelayed(this, 5000)
        }
      }, 5000)
    }
  }

  private fun report() {
    val copy: List<Long>
    val j: Int
    synchronized(lock) {
      if (durations.isEmpty()) return
      copy = durations.sorted()
      j = jank
      durations.clear()
      jank = 0
    }
    fun p(q: Double) = copy[((copy.size - 1) * q).toInt()] / 1_000_000.0
    Log.i("VIBRA_FRAMES", String.format(java.util.Locale.US, "n=%d jank=%d p50=%.1f p90=%.1f p99=%.1f max=%.1f",
      copy.size, j, p(0.5), p(0.9), p(0.99), copy.last() / 1_000_000.0))
  }
}
`;

module.exports = function withFrameMetrics(config) {
  if (process.env.VIBRA_FRAME_METRICS !== '1') return config;
  return withMainActivity(config, (cfg) => {
    let src = cfg.modResults.contents;
    if (src.includes('VibraFrameStats')) return cfg;
    if (cfg.modResults.language !== 'kt') throw new Error('withFrameMetrics: MainActivity non in Kotlin');
    src = src.replace(/^(package [^\n]+\n)/, `$1${IMPORTS}`);
    src = src.replace(/(super\.onCreate\([^)]*\))/, '$1\n    VibraFrameStats.attach(this)');
    if (!src.includes('VibraFrameStats.attach')) throw new Error('withFrameMetrics: super.onCreate non trovato');
    cfg.modResults.contents = src + HELPER;
    return cfg;
  });
};
