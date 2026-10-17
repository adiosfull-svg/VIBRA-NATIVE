// Port di src/components/layout/MobileNavBar.jsx come tab bar di expo-router.
// - pill indicatore che scorre sotto il tab attivo (0.28s cubic-bezier(0.22,1,0.36,1))
// - drag-to-select stile Instagram: il dito scorre sulla barra e il pill lo segue
// - long-press (250ms) su Weekend → menu radiale a ventaglio (Semine, Messaggi)
// - vetro: blur(6px) + bg-background/30 + bordo superiore
//
// PRESTAZIONI (docs/REGOLE-PRESTAZIONI.md §5): tocchi, pillola e icone girano sul thread UI.
// Prima il dito passava dal PanResponder (thread JS) e pillola/icone ripartivano da uno stato React:
// se il JS era occupato (pagina che si monta, dati in arrivo) il tocco restava fermo finché il JS non
// si liberava, e il cambio di colore delle icone era secco. Ora il gesto è di react-native-gesture-handler
// (worklet sul thread UI): pillola, scala e colori delle icone rispondono nel frame del tocco anche con
// il JS occupato; al JS vanno solo la navigazione, la vibrazione e il menu radiale.
import { usePathname, useRouter } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { NativeBlur, usePageBlurTarget } from '../../../ui/pageLayers';
import { Image } from 'expo-image';
import { IMAGE_CACHE } from '../../../ui/imageCache';
import * as Haptics from 'expo-haptics';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated as RNAnimated, Easing as RNEasing, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { GestureDetector, GestureHandlerRootView, GestureStateManager, useManualGesture } from 'react-native-gesture-handler';
import Animated, {
  Easing, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming, type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoleAccess } from '../../../lib/useRoleAccess';
import { navProbeArrived, navProbeStart } from '../../../lib/testDiag';
import { Div } from '../../../ui/html';
import { ContactRound, Instagram, LayoutGrid, Search, Send, Sprout } from '../../../ui/icons.generated';
import { THEME } from '../../../ui/palette.generated';
import { Text } from '../../../ui/text';
import { useVibraLogo } from '../../hooks/useVibraLogo';
import { useLayoutUI } from '../../lib/layoutUI';

type NavItem = { route: string; icon: React.ComponentType<any> | null; label: string };

const ADMIN_NAV_ITEMS: NavItem[] = [
  { route: 'index', icon: LayoutGrid, label: 'Dashboard' },
  { route: 'programmazione', icon: Send, label: 'Weekend' },
  { route: 'clienti', icon: ContactRound, label: 'Clienti' },
  { route: '__search__', icon: Search, label: 'Cerca' },
  { route: 'il-mio-vibra', icon: null, label: 'Il Mio' },
];
// Per capogruppo/pr: "Semine" sostituisce "Dashboard" come primo item.
const LIMITED_NAV_ITEMS: NavItem[] = [
  { route: 'semine', icon: Sprout, label: 'Semine' },
  { route: 'programmazione', icon: Send, label: 'Weekend' },
  { route: 'clienti', icon: ContactRound, label: 'Clienti' },
  { route: '__search__', icon: Search, label: 'Cerca' },
  { route: 'il-mio-vibra', icon: null, label: 'Il Mio' },
];
// Long-press: scorciatoie a ventaglio
const RADIAL_MENUS: Record<string, { path: string; icon: React.ComponentType<any>; label: string }[]> = {
  programmazione: [
    { path: 'semine', icon: Sprout, label: 'Semine' },
    { path: '/messaggi', icon: Instagram, label: 'Messaggi' },
  ],
};
function getRadialOffsets(count: number) {
  if (count === 2) return [{ x: -50, y: -46 }, { x: 50, y: -46 }];
  if (count === 3) return [{ x: -62, y: -30 }, { x: 0, y: -66 }, { x: 62, y: -30 }];
  return Array.from({ length: count }, () => ({ x: 0, y: -46 }));
}

const INACTIVE = '#7a7a85'; // hsl(240,5%,50%)
const ACTIVE = '#f2f2f2';
const PRIMARY = THEME.primary;
const BAR_HEIGHT = 60;
const LONG_PRESS_MS = 250;
// curve dell'originale
const PILL_EASE = Easing.bezier(0.22, 1, 0.36, 1); // transform 0.28s
const PILL_MS = 280;
const SCALE_EASE = Easing.bezier(0.34, 1.56, 0.64, 1); // transform 0.18s
const SCALE_MS = 180;
const FADE_MS = 200; // transition-colors / transition-opacity duration-200
const FADE_EASE = Easing.bezier(0.4, 0, 0.2, 1); // timing di default di Tailwind

// stato del gesto (thread UI)
const MODE_IDLE = 0;
const MODE_PRESS = 1;
const MODE_RADIAL = 2;

/** Stato condiviso tra il gesto (thread UI), le icone e il JS. */
type NavShared = {
  /** voce evidenziata (pillola visibile e icona attiva); -1 = nessuna (pagina fuori dalla barra) */
  visual: SharedValue<number>;
  /** voce sotto il dito (scala 1.3); -1 = nessun trascinamento */
  dragIdx: SharedValue<number>;
};

function VibraIcon({ index, initialActive, shared, logo }: { index: number; initialActive: boolean; shared: NavShared; logo?: string }) {
  // opacity e filter con transizione di 200ms come l'originale, sfondo istantaneo
  const p = useSharedValue(initialActive ? 1 : 0);
  const on = useSharedValue(initialActive ? 1 : 0);
  useAnimatedReaction(() => (shared.visual.value === index ? 1 : 0), (a, prev) => {
    if (a === prev) return;
    on.value = a;
    p.value = withTiming(a, { duration: FADE_MS, easing: FADE_EASE });
  });
  const boxStyle = useAnimatedStyle(() => ({ backgroundColor: on.value ? `${PRIMARY}26` : 'transparent' }));
  const colorStyle = useAnimatedStyle(() => ({ opacity: p.value }));
  const grayStyle = useAnimatedStyle(() => ({ opacity: 0.5 * (1 - p.value) }));
  if (!logo) return <View style={{ width: 28, height: 28 }} />;
  return (
    <Animated.View style={[styles.vibraBox, boxStyle]}>
      {/* attiva: logo a colori; inattiva: opacity 0.5 + grayscale(60%) */}
      <Animated.View style={[styles.vibraLayer, grayStyle, styles.gray]}>
        <Image source={{ uri: logo }} style={styles.vibraImg} contentFit="contain" cachePolicy={IMAGE_CACHE} transition={0} />
      </Animated.View>
      <Animated.View style={[styles.vibraLayer, colorStyle]}>
        <Image source={{ uri: logo }} style={styles.vibraImg} contentFit="contain" cachePolicy={IMAGE_CACHE} transition={0} />
      </Animated.View>
    </Animated.View>
  );
}

// Le voci non dipendono dallo stato React del tocco: leggono le shared value sul thread UI, quindi non
// si ridisegnano né durante il trascinamento né a ogni navigazione.
const NavIcon = memo(function NavIcon({ item, index, initialActive, shared, logo }: { item: NavItem; index: number; initialActive: boolean; shared: NavShared; logo?: string }) {
  const initial = initialActive ? 1 : 0;
  const scale = useSharedValue(initial ? 1.15 : 1);
  const color = useSharedValue(initial); // transition-colors dell'icona
  const label = useSharedValue(initial); // transition-opacity della scritta
  const on = useSharedValue(initial); // pallino e colore della scritta: istantanei
  useAnimatedReaction(
    () => (shared.dragIdx.value === index ? 2 : shared.visual.value === index ? 1 : 0),
    (s, prev) => {
      if (s === prev) return;
      const a = s > 0 ? 1 : 0;
      scale.value = withTiming(s === 2 ? 1.3 : a ? 1.15 : 1, { duration: SCALE_MS, easing: SCALE_EASE });
      if (prev == null || (prev > 0 ? 1 : 0) !== a) {
        on.value = a;
        color.value = withTiming(a, { duration: FADE_MS, easing: FADE_EASE });
        label.value = withTiming(a, { duration: FADE_MS, easing: FADE_EASE });
      }
    },
  );
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -1 }, { scale: scale.value }] }));
  const activeIconStyle = useAnimatedStyle(() => ({ opacity: color.value }));
  const inactiveIconStyle = useAnimatedStyle(() => ({ opacity: 1 - color.value }));
  const dotStyle = useAnimatedStyle(() => ({ opacity: on.value }));
  const labelStyle = useAnimatedStyle(() => ({ opacity: 0.45 + 0.55 * label.value }));
  const labelActiveStyle = useAnimatedStyle(() => ({ opacity: on.value }));
  const labelInactiveStyle = useAnimatedStyle(() => ({ opacity: 1 - on.value }));
  const Icon = item.icon;
  return (
    <View style={styles.item} pointerEvents="none">
      <Animated.View style={[{ zIndex: 10 }, iconStyle]}>
        {item.route === 'il-mio-vibra'
          ? <VibraIcon index={index} initialActive={initialActive} shared={shared} logo={logo} />
          : Icon && (
            <View>
              <Animated.View style={inactiveIconStyle}><Icon size={24} color={INACTIVE} strokeWidth={1.8} /></Animated.View>
              <Animated.View style={[StyleSheet.absoluteFill, activeIconStyle]}><Icon size={24} color={ACTIVE} strokeWidth={2.2} /></Animated.View>
            </View>
          )}
        <Animated.View style={[styles.dot, dotStyle]} />
      </Animated.View>
      <Animated.View style={labelStyle}>
        <Animated.View style={labelInactiveStyle}>
          <Text className="font-medium leading-none" style={{ fontSize: 10, color: INACTIVE }}>{item.label}</Text>
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, labelActiveStyle]}>
          <Text className="font-medium leading-none" style={{ fontSize: 10, color: ACTIVE }}>{item.label}</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
});

/**
 * Tab bar delle 5 tab (props di expo-router) e, senza props, barra delle altre pagine
 * (Dashboard, Serate, Locali...): come nell'originale (AppLayout) la barra c'è ovunque;
 * fuori dalle tab nessuna voce è attiva e si naviga col router.
 */
export default function MobileNavBar({ state, navigation }: Partial<BottomTabBarProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAdmin, isSuper4 } = useRoleAccess();
  const { logoDataUrl } = useVibraLogo();
  const { searchOpen, setSearchOpen } = useLayoutUI();
  const NAV_ITEMS = isAdmin || isSuper4 ? ADMIN_NAV_ITEMS : LIMITED_NAV_ITEMS;
  const count = NAV_ITEMS.length;

  const activeRoute = state ? state.routes[state.index]?.name : pathname.split('/')[1] || 'index';
  const activeIndex = NAV_ITEMS.findIndex((i) => i.route === activeRoute);
  const searchIndex = NAV_ITEMS.findIndex((i) => i.route === '__search__');
  // voce su cui sta la pillola a dito fermo (la ricerca aperta la tiene su Cerca, come l'originale)
  const restIndex = searchOpen && searchIndex >= 0 ? searchIndex : activeIndex;

  const [width, setWidth] = useState(0);
  const [radial, setRadial] = useState<null | { anchorIndex: number; highlighted: number }>(null);
  const itemWidth = width / count;

  // ── stato condiviso con il thread UI ──
  const visual = useSharedValue(restIndex);
  const dragIdx = useSharedValue(-1);
  const pillX = useSharedValue(Math.max(0, restIndex) * itemWidth);
  const itemW = useSharedValue(itemWidth);
  const mode = useSharedValue(MODE_IDLE);
  const pressIdx = useSharedValue(-1);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const moved = useSharedValue(false);
  const highlighted = useSharedValue(-1);
  const radialCount = useSharedValue(0);
  const shared = useMemo<NavShared>(() => ({ visual, dragIdx }), [visual, dragIdx]);
  // stato iniziale delle icone (costante: le voci poi seguono le shared value senza ridisegnarsi)
  const initialRest = useRef(restIndex).current;

  // la pillola torna sulla voce a riposo quando cambia la pagina (o la ricerca), se il dito non è sulla
  // barra; se è già lì (tocco appena rilasciato) non la si tocca: ripartire con una nuova animazione
  // verso lo stesso punto la rallentava a metà corsa
  const restRef = useRef(restIndex);
  restRef.current = restIndex;
  const syncTo = useCallback((i: number, animate = true) => {
    if (mode.value !== MODE_IDLE) return;
    const w = itemW.value;
    if (visual.value === i && animate) return;
    const wasHidden = visual.value < 0;
    visual.value = i;
    if (i < 0) return;
    pillX.value = animate && !wasHidden ? withTiming(i * w, { duration: PILL_MS, easing: PILL_EASE }) : i * w;
  }, [mode, itemW, visual, pillX]);
  useEffect(() => { syncTo(restIndex); }, [restIndex, syncTo]);
  useEffect(() => { navProbeArrived(activeRoute); }, [activeRoute]);
  // larghezza nota (o cambiata): pillola al suo posto senza animazione
  useEffect(() => {
    itemW.value = itemWidth;
    if (mode.value === MODE_IDLE && visual.value >= 0) pillX.value = visual.value * itemWidth;
  }, [itemWidth, itemW, mode, visual, pillX]);

  const items = useRef(NAV_ITEMS);
  items.current = NAV_ITEMS;

  const go = (item: NavItem | { path: string }) => {
    if ('route' in item) {
      if (item.route === '__search__') { setSearchOpen(true); return; }
      if (!navigation) router.navigate(item.route === 'index' ? '/' : `/${item.route}`);
      else navigation.navigate(item.route as never);
    } else if (!navigation) {
      router.navigate(item.path.startsWith('/') ? item.path : `/${item.path}`);
    } else if (item.path.startsWith('/')) {
      navigation.getParent()?.navigate(item.path.slice(1) as never);
    } else {
      navigation.navigate(item.path as never);
    }
  };
  const goRef = useRef(go);
  goRef.current = go;

  // ── lato JS del gesto (chiamato dal thread UI con scheduleOnRN) ──
  const longPress = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const js = useMemo(() => ({
    down(idx: number) {
      if (longPress.current) clearTimeout(longPress.current);
      longPress.current = null;
      const route = items.current[idx]?.route;
      const opts = route ? RADIAL_MENUS[route] : undefined;
      if (!opts) return;
      longPress.current = setTimeout(() => {
        longPress.current = null;
        // il dito è ancora giù, fermo sulla stessa voce (letto dal thread UI)
        if (mode.value !== MODE_PRESS || moved.value || pressIdx.value !== idx) return;
        radialCount.value = opts.length;
        highlighted.value = -1;
        mode.value = MODE_RADIAL;
        dragIdx.value = -1;
        setRadial({ anchorIndex: idx, highlighted: -1 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      }, LONG_PRESS_MS);
    },
    cancelLongPress() {
      if (longPress.current) clearTimeout(longPress.current);
      longPress.current = null;
    },
    select() { Haptics.selectionAsync().catch(() => {}); },
    radialHighlight(best: number) {
      setRadial((p) => (p ? { ...p, highlighted: best } : p));
      Haptics.selectionAsync().catch(() => {});
    },
    release(idx: number) {
      if (longPress.current) clearTimeout(longPress.current);
      longPress.current = null;
      const item = items.current[idx];
      if (item) { navProbeStart(item.route); goRef.current(item); }
      // rete di sicurezza: navigazione rifiutata o verso la voce già attiva → pillola a riposo
      if (settle.current) clearTimeout(settle.current);
      settle.current = setTimeout(() => { settle.current = null; syncTo(restRef.current, true); }, 1500);
    },
    radialRelease(anchor: number, best: number) {
      setRadial(null);
      const opts = RADIAL_MENUS[items.current[anchor]?.route ?? ''] ?? [];
      if (best >= 0 && opts[best]) goRef.current(opts[best]);
      else syncTo(restRef.current, true);
    },
    cancel() {
      if (longPress.current) clearTimeout(longPress.current);
      longPress.current = null;
      setRadial(null);
      syncTo(restRef.current, true);
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);
  useEffect(() => () => {
    if (longPress.current) clearTimeout(longPress.current);
    if (settle.current) clearTimeout(settle.current);
  }, []);

  // ── gesto sul thread UI: stessi passi dei pointer handler dell'originale ──
  const gesture = useManualGesture({
    onTouchesDown: (e) => {
      'worklet';
      if (e.numberOfTouches > 1 || mode.value !== MODE_IDLE) return;
      GestureStateManager.activate(e.handlerTag);
      const t = e.changedTouches[0];
      const w = itemW.value || 1;
      const idx = Math.max(0, Math.min(count - 1, Math.floor(t.x / w)));
      mode.value = MODE_PRESS;
      pressIdx.value = idx;
      startX.value = t.x;
      startY.value = t.y;
      moved.value = false;
      dragIdx.value = idx;
      // la pillola si centra sull'icona premuta; se era nascosta (pagina fuori dalla barra) compare lì
      const wasHidden = visual.value < 0;
      visual.value = idx;
      pillX.value = wasHidden ? idx * w : withTiming(idx * w, { duration: PILL_MS, easing: PILL_EASE });
      scheduleOnRN(js.down, idx);
    },
    onTouchesMove: (e) => {
      'worklet';
      if (mode.value === MODE_IDLE) return;
      const t = e.allTouches[0];
      if (!t) return;
      const w = itemW.value || 1;
      if (mode.value === MODE_RADIAL) {
        // il dito sale verso il ventaglio: settore in base all'angolo dal verticale dell'icona
        const dx = t.x - w * (pressIdx.value + 0.5);
        const dy = t.y;
        if (dy > -5) return;
        const n = radialCount.value || 1;
        const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
        const sector = 180 / n;
        let best = -1;
        for (let i = 0; i < n; i++) {
          if (angle >= -90 + sector * i && angle < -90 + sector * (i + 1)) { best = i; break; }
        }
        if (best === -1) best = n - 1;
        if (best !== highlighted.value) {
          highlighted.value = best;
          scheduleOnRN(js.radialHighlight, best);
        }
        return;
      }
      if (!moved.value && (Math.abs(t.x - startX.value) > 10 || Math.abs(t.y - startY.value) > 10)) {
        moved.value = true;
        scheduleOnRN(js.cancelLongPress);
      }
      const idx = Math.max(0, Math.min(count - 1, Math.floor(t.x / w)));
      // oltre 10px la pillola segue il dito, prima resta centrata sull'icona (soglia anti-jitter)
      if (moved.value) pillX.value = Math.max(0, Math.min(w * (count - 1), t.x - w / 2));
      if (idx !== pressIdx.value) {
        pressIdx.value = idx;
        dragIdx.value = idx;
        visual.value = idx;
        if (!moved.value) pillX.value = withTiming(idx * w, { duration: PILL_MS, easing: PILL_EASE });
        scheduleOnRN(js.select);
      }
    },
    onTouchesUp: (e) => {
      'worklet';
      // ultimo dito alzato (numberOfTouches conta già senza quello appena alzato)
      if (e.numberOfTouches > 0) return;
      const w = itemW.value || 1;
      const t = e.changedTouches[0];
      let idx = pressIdx.value;
      if (mode.value === MODE_RADIAL) {
        mode.value = MODE_IDLE;
        dragIdx.value = -1;
        scheduleOnRN(js.radialRelease, idx, highlighted.value);
      } else if (mode.value === MODE_PRESS) {
        // come l'originale: la voce è quella sotto il punto di rilascio
        if (t) idx = Math.max(0, Math.min(count - 1, Math.floor(t.x / w)));
        mode.value = MODE_IDLE;
        dragIdx.value = -1;
        visual.value = idx;
        // dopo un trascinamento la pillola è sotto il dito: la si centra sulla voce
        if (moved.value) pillX.value = withTiming(idx * w, { duration: PILL_MS, easing: PILL_EASE });
        scheduleOnRN(js.release, idx);
      }
      GestureStateManager.deactivate(e.handlerTag);
    },
    onTouchesCancel: () => {
      'worklet';
      if (mode.value === MODE_IDLE) return;
      mode.value = MODE_IDLE;
      dragIdx.value = -1;
      scheduleOnRN(js.cancel);
    },
    onFinalize: (e) => {
      'worklet';
      // gesto interrotto dal sistema (o da un altro gesto) senza il rilascio del dito
      if (!e.canceled || mode.value === MODE_IDLE) return;
      mode.value = MODE_IDLE;
      dragIdx.value = -1;
      scheduleOnRN(js.cancel);
    },
  });

  const pillStyle = useAnimatedStyle(() => ({
    opacity: visual.value >= 0 ? 1 : 0,
    transform: [{ translateX: pillX.value }],
  }));

  const blurTarget = usePageBlurTarget();
  const radialOptions = radial ? RADIAL_MENUS[NAV_ITEMS[radial.anchorIndex].route] ?? [] : [];
  const offsets = getRadialOffsets(radialOptions.length);

  return (
    <GestureHandlerRootView style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }}>
      {/* Vetro: blur(6px) saturate(160%) + bg-background/30 + border-t */}
      {/* su Android sfoca la pagina in primo piano (ui/pageLayers); blur(6px) → intensità 24 come backdrop-blur */}
      <NativeBlur intensity={24} target={blurTarget} />
      {/* sopra la riga per l'ordine CSS degli elementi posizionati: non deve prendersi i tocchi */}
      <Div pointerEvents="none" className="absolute inset-0 border-t border-border bg-background/30" />

      <GestureDetector gesture={gesture}>
        <View
          style={styles.row}
          onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
          accessibilityRole="tablist"
        >
          {/* Pill indicatore — sempre montato */}
          <Animated.View pointerEvents="none" style={[styles.pill, { width: itemWidth }, pillStyle]}>
            <View style={styles.pillShape} />
          </Animated.View>
          {NAV_ITEMS.map((item, index) => (
            <NavIcon key={item.route} item={item} index={index} initialActive={index === initialRest} shared={shared} logo={logoDataUrl} />
          ))}
        </View>
      </GestureDetector>

      {/* Menu radiale (long-press) */}
      {radial && (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 0 }}>
          {radialOptions.map((opt, i) => {
            const cx = itemWidth * (radial.anchorIndex + 0.5) + offsets[i].x + insets.left;
            const cy = offsets[i].y;
            const hl = radial.highlighted === i;
            const Icon = opt.icon;
            return (
              <RadialItem key={opt.path} delay={i * 50} x={cx} y={cy} highlighted={hl}>
                <View style={{
                  width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: hl ? PRIMARY : THEME.card,
                  borderWidth: 1.5, borderColor: hl ? PRIMARY : 'rgba(167,139,250,0.25)',
                  shadowColor: hl ? PRIMARY : '#a78bfa', shadowOpacity: hl ? 0.65 : 0.5, shadowRadius: hl ? 18 : 28, shadowOffset: { width: 0, height: 0 },
                }}>
                  <Icon size={20} color={hl ? '#ffffff' : '#94949e'} strokeWidth={hl ? 2.2 : 1.8} />
                </View>
                <Text className="text-[10px] font-medium leading-none" style={{ color: hl ? ACTIVE : '#85858f' }}>{opt.label}</Text>
              </RadialItem>
            );
          })}
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  row: { height: BAR_HEIGHT, width: '100%', maxWidth: 512, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' },
  item: { flex: 1, minHeight: BAR_HEIGHT, minWidth: 44, alignItems: 'center', justifyContent: 'center', gap: 2 },
  pill: { position: 'absolute', top: 5, left: 0, height: 50, alignItems: 'center', justifyContent: 'center' },
  pillShape: {
    width: 75, height: 46, borderRadius: 23,
    backgroundColor: `${PRIMARY}8c`, // primary / 0.55
    borderWidth: 1, borderColor: `${PRIMARY}b3`, // inset primary / 0.7
    shadowColor: PRIMARY, shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 0 },
  },
  dot: { position: 'absolute', top: -2, right: -2, width: 6, height: 6, borderRadius: 3, backgroundColor: PRIMARY },
  vibraBox: { width: 28, height: 28, borderRadius: 6, overflow: 'hidden' },
  vibraLayer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  vibraImg: { width: 32, height: 32 },
  // grayscale(60%) dell'icona inattiva (filter: Android 12+ e web; altrove resta a colori)
  gray: { filter: [{ grayscale: 0.6 }] } as object,
});

/** Pop-up dal basso (vibraRadialPopUp 0.32s) + scala 1.25 quando evidenziato. */
function RadialItem({ x, y, delay, highlighted, children }: { x: number; y: number; delay: number; highlighted: boolean; children: React.ReactNode }) {
  const pop = useRef(new RNAnimated.Value(0)).current;
  const hl = useRef(new RNAnimated.Value(1)).current;
  useEffect(() => {
    RNAnimated.timing(pop, { toValue: 1, duration: 320, delay, easing: RNEasing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }).start();
  }, [pop, delay]);
  useEffect(() => {
    RNAnimated.timing(hl, { toValue: highlighted ? 1.25 : 1, duration: 150, easing: RNEasing.bezier(0.34, 1.56, 0.64, 1), useNativeDriver: true }).start();
  }, [highlighted, hl]);
  return (
    <RNAnimated.View
      style={{
        position: 'absolute', left: x - 40, top: y - 30, width: 80, alignItems: 'center', gap: 4,
        opacity: pop,
        transform: [
          { translateY: pop.interpolate({ inputRange: [0, 0.65, 1], outputRange: [22, -3, 0] }) },
          { scale: pop.interpolate({ inputRange: [0, 0.65, 1], outputRange: [0.65, 1.06, 1] }) },
          { scale: hl },
        ],
      }}
    >
      {children}
    </RNAnimated.View>
  );
}
