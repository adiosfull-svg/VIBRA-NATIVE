// SOLO build di prova (VIBRA_FRAME_METRICS=1 al prebuild: Test Lab, emulatore in modalità fluidità).
// Misura la fluidità vera dal sistema: Window.OnFrameMetricsAvailableListener dà la durata di ogni
// frame disegnato e la sua scadenza (16,7 ms a 60 Hz, 8,3 ms a 120 Hz). Ogni 5 s scrive nel logcat
//   VIBRA_FRAMES n=<frame> jank=<oltre la scadenza> p50=<ms> p90=<ms> p99=<ms> max=<ms> worst=<fasi>
// worst = dove è andato il tempo nel frame più lungo della finestra (ms): wait=thread UI occupato prima
// del frame (es. creazione delle viste), in=input, anim=animazioni,
// layout=misura e posizioni, draw=registrazione del disegno, sync=caricamento immagini/texture,
// cmd=comandi alla GPU, swap=consegna del frame, gpu=lavoro della GPU (ombre, sfocature)
// (solo se nei 5 s si è disegnato qualcosa). I test Robo di Test Lab non raccolgono gli FPS: così si
// leggono dal logcat che Test Lab scarica (tools/testlab/prestazioni.py). Nell'APK vero non c'è.
const { withMainActivity } = require('@expo/config-plugins');

const IMPORTS = `
import android.os.Looper
import android.os.SystemClock
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
  private var worstTotal = 0L
  private var worst = ""
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
        if (total > worstTotal) {
          worstTotal = total
          fun ms(id: Int) = metrics.getMetric(id) / 1_000_000.0
          val gpu = if (android.os.Build.VERSION.SDK_INT >= 31) ms(FrameMetrics.GPU_DURATION) else -1.0
          worst = String.format(java.util.Locale.US, "wait=%.0f,in=%.0f,anim=%.0f,layout=%.0f,draw=%.0f,sync=%.0f,cmd=%.0f,swap=%.0f,gpu=%.0f",
            ms(FrameMetrics.UNKNOWN_DELAY_DURATION), ms(FrameMetrics.INPUT_HANDLING_DURATION), ms(FrameMetrics.ANIMATION_DURATION), ms(FrameMetrics.LAYOUT_MEASURE_DURATION),
            ms(FrameMetrics.DRAW_DURATION), ms(FrameMetrics.SYNC_DURATION), ms(FrameMetrics.COMMAND_ISSUE_DURATION),
            ms(FrameMetrics.SWAP_BUFFERS_DURATION), gpu)
        }
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
    val w: String
    synchronized(lock) {
      if (durations.isEmpty()) return
      copy = durations.sorted()
      j = jank
      w = worst
      durations.clear()
      jank = 0
      worstTotal = 0L
      worst = ""
    }
    fun p(q: Double) = copy[((copy.size - 1) * q).toInt()] / 1_000_000.0
    Log.i("VIBRA_FRAMES", String.format(java.util.Locale.US, "n=%d jank=%d p50=%.1f p90=%.1f p99=%.1f max=%.1f worst=%s",
      copy.size, j, p(0.5), p(0.9), p(0.99), copy.last() / 1_000_000.0, w))
  }
}

// VIBRA (plugins/withFrameMetrics.js): operazioni lente del thread UI con i loro stack campionati.
// Ogni messaggio del Looper principale (anche Choreographer#doFrame: montaggio, disegno) oltre 40 ms
// scrive VIBRA_SLOW ms=<durata> n=<campioni> msg=<handler/callback>, poi le funzioni più presenti negli
// stack (campionati ogni 5 ms mentre il messaggio gira) come VIBRA_SLOW_TOP <presenze>/<campioni> <metodo>.
object VibraLooperMon {
  @Volatile private var start = 0L
  @Volatile private var current: String? = null
  private val samples = ArrayList<Array<StackTraceElement>>()
  private val lock = Any()

  fun attach() {
    val main = Looper.getMainLooper().thread
    Looper.getMainLooper().setMessageLogging { s ->
      if (s.startsWith(">>>>> Dispatching")) {
        synchronized(lock) { samples.clear() }
        current = s
        start = SystemClock.uptimeMillis()
      } else if (s.startsWith("<<<<< Finished")) {
        val t0 = start
        start = 0L
        val d = SystemClock.uptimeMillis() - t0
        if (t0 != 0L && d >= 40) {
          val copy: List<Array<StackTraceElement>>
          synchronized(lock) { copy = ArrayList(samples) }
          report(d, current ?: "", copy)
        }
      }
    }
    val th = HandlerThread("vibra-looper-mon").apply { start() }
    val h = Handler(th.looper)
    h.post(object : Runnable {
      override fun run() {
        val t0 = start
        if (t0 != 0L && SystemClock.uptimeMillis() - t0 > 8) {
          val st = main.stackTrace
          synchronized(lock) { if (samples.size < 400) samples.add(st) }
        }
        h.postDelayed(this, 5)
      }
    })
  }

  private fun report(ms: Long, msg: String, st: List<Array<StackTraceElement>>) {
    val m = msg.replace(Regex("^>>>>> Dispatching to "), "").take(160)
    Log.i("VIBRA_SLOW", "ms=$ms n=\${st.size} msg=$m")
    if (st.isEmpty()) return
    val incl = HashMap<String, Int>()
    val leaf = HashMap<String, Int>()
    for (s in st) {
      val seen = HashSet<String>()
      for ((i, f) in s.withIndex()) {
        val k = f.className + "." + f.methodName
        if (i == 0) leaf[k] = (leaf[k] ?: 0) + 1
        if (seen.add(k)) incl[k] = (incl[k] ?: 0) + 1
      }
    }
    for ((k, v) in leaf.entries.sortedByDescending { it.value }.take(8)) Log.i("VIBRA_SLOW_LEAF", "$v/\${st.size} $k")
    for ((k, v) in incl.entries.filter { !it.key.startsWith("android.os.") && !it.key.startsWith("java.lang.reflect") && !it.key.startsWith("com.android.internal.os") }
        .sortedByDescending { it.value }.take(30)) Log.i("VIBRA_SLOW_TOP", "$v/\${st.size} $k")
  }
}

// VIBRA (plugins/withFrameMetrics.js): quanti nodi vede chi legge l'albero dell'accessibilità (Robo di
// Test Lab lo legge tutto, anche fuori schermo). Ogni 10 s sul thread UI: VIBRA_A11Y viste=<VISIBLE>
// importanti=<importanti per l'accessibilità> fuori=<viste non a schermo> fuoriImp=<importanti non a schermo>.
// Quando il conteggio cambia, i sottoalberi fuori schermo più grandi:
// VIBRA_A11Y_OFF n=<viste> imp=<importanti> y=<posizione> <classe#testID> in <antenati> «<primo testo>»
object VibraA11yTree {
  private var last = -1
  private var testId = 0
  private var nativeId = 0

  fun attach(activity: android.app.Activity) {
    val h = Handler(Looper.getMainLooper())
    testId = activity.resources.getIdentifier("react_test_id", "id", activity.packageName)
    nativeId = activity.resources.getIdentifier("view_tag_native_id", "id", activity.packageName)
    h.postDelayed(object : Runnable {
      override fun run() {
        try { scan(activity) } catch (e: Throwable) { Log.w("VIBRA_A11Y", "errore $e") }
        h.postDelayed(this, 10000)
      }
    }, 10000)
  }

  private class Off(val v: android.view.View, val n: Int, val imp: Int, val path: String)

  private fun label(v: android.view.View): String {
    var l = v.javaClass.simpleName
    val t = (if (testId != 0) v.getTag(testId) else null) ?: (if (nativeId != 0) v.getTag(nativeId) else null)
    if (t != null) l += "#" + t
    if (v.importantForAccessibility == android.view.View.IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS) l += "(nascosto)"
    return l
  }

  private fun firstText(v: android.view.View, budget: IntArray): String? {
    if (budget[0]-- <= 0) return null
    val d = v.contentDescription
    if (!d.isNullOrBlank()) return d.toString()
    if (v is android.widget.TextView && !v.text.isNullOrBlank()) return v.text.toString()
    if (v.javaClass.simpleName.contains("Text")) {
      val info = v.createAccessibilityNodeInfo()
      val t = info.text
      if (!t.isNullOrBlank()) return t.toString()
    }
    if (v is android.view.ViewGroup) for (i in 0 until v.childCount) firstText(v.getChildAt(i), budget)?.let { return it }
    return null
  }

  // conta le viste VISIBLE del sottoalbero: [viste, importanti]
  private fun count(v: android.view.View): IntArray {
    val r = intArrayOf(1, if (v.isImportantForAccessibility) 1 else 0)
    if (v is android.view.ViewGroup) for (i in 0 until v.childCount) {
      val c = v.getChildAt(i)
      if (c.visibility != android.view.View.VISIBLE) continue
      val s = count(c); r[0] += s[0]; r[1] += s[1]
    }
    return r
  }

  private fun scan(activity: android.app.Activity) {
    val root = activity.window?.decorView ?: return
    val offs = ArrayList<Off>()
    val tot = intArrayOf(0, 0, 0, 0)
    val rect = android.graphics.Rect()
    fun walk(v: android.view.View, path: String) {
      if (!v.getGlobalVisibleRect(rect) && v !== root) {
        val s = count(v)
        tot[0] += s[0]; tot[1] += s[1]; tot[2] += s[0]; tot[3] += s[1]
        offs.add(Off(v, s[0], s[1], path))
        return
      }
      tot[0]++
      if (v.isImportantForAccessibility) tot[1]++
      if (v is android.view.ViewGroup) {
        val p = (if (path.length > 140) path.takeLast(140) else path) + "/" + label(v)
        for (i in 0 until v.childCount) {
          val c = v.getChildAt(i)
          if (c.visibility == android.view.View.VISIBLE) walk(c, p)
        }
      }
    }
    walk(root, "")
    Log.i("VIBRA_A11Y", "viste=\${tot[0]} importanti=\${tot[1]} fuori=\${tot[2]} fuoriImp=\${tot[3]}")
    if (Math.abs(tot[0] - last) < 20) return
    last = tot[0]
    val loc = IntArray(2)
    for (o in offs.sortedByDescending { it.n }.take(25)) {
      o.v.getLocationOnScreen(loc)
      val txt = firstText(o.v, intArrayOf(400))?.replace('\\n', ' ')?.take(40) ?: ""
      Log.i("VIBRA_A11Y_OFF", "n=\${o.n} imp=\${o.imp} x=\${loc[0]} y=\${loc[1]} \${label(o.v)} in \${o.path.takeLast(220)} «$txt»")
    }
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
    src = src.replace(/(super\.onCreate\([^)]*\))/, '$1\n    VibraFrameStats.attach(this)\n    VibraLooperMon.attach()\n    VibraA11yTree.attach(this)');
    if (!src.includes('VibraFrameStats.attach')) throw new Error('withFrameMetrics: super.onCreate non trovato');
    cfg.modResults.contents = src + HELPER;
    return cfg;
  });
};
