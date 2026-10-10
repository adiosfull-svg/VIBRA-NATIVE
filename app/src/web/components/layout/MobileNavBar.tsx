// Port di src/components/layout/MobileNavBar.jsx come tab bar di expo-router.
// - pill indicatore che scorre sotto il tab attivo (0.28s cubic-bezier(0.22,1,0.36,1))
// - drag-to-select stile Instagram: il dito scorre sulla barra e il pill lo segue
// - long-press (250ms) su Weekend → menu radiale a ventaglio (Semine, Messaggi)
// - vetro: blur(6px) + bg-background/30 + bordo superiore
import { usePathname, useRouter } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { NativeBlur, usePageBlurTarget } from '../../../ui/pageLayers';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, StyleSheet, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoleAccess } from '../../../lib/useRoleAccess';
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

function VibraIcon({ active, logo }: { active: boolean; logo?: string }) {
  if (!logo) return <View style={{ width: 28, height: 28 }} />;
  return (
    <View style={{ width: 28, height: 28, borderRadius: 6, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: active ? `${PRIMARY}26` : 'transparent', opacity: active ? 1 : 0.5 }}>
      <Image source={{ uri: logo }} style={{ width: 32, height: 32 }} contentFit="contain" />
    </View>
  );
}

function NavIcon({ item, active, dragging, logo }: { item: NavItem; active: boolean; dragging: boolean; logo?: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(scale, {
      toValue: dragging ? 1.3 : active ? 1.15 : 1,
      duration: 180,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      useNativeDriver: true,
    }).start();
  }, [active, dragging, scale]);
  const Icon = item.icon;
  return (
    <View style={{ flex: 1, minHeight: BAR_HEIGHT, minWidth: 44, alignItems: 'center', justifyContent: 'center', gap: 2 }} pointerEvents="none">
      <Animated.View style={{ transform: [{ translateY: -1 }, { scale }], zIndex: 10 }}>
        {item.route === 'il-mio-vibra'
          ? <VibraIcon active={active} logo={logo} />
          : Icon && <Icon size={24} color={active ? ACTIVE : INACTIVE} strokeWidth={active ? 2.2 : 1.8} />}
        {active && <View style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, borderRadius: 3, backgroundColor: PRIMARY }} />}
      </Animated.View>
      <Text className="font-medium leading-none" style={{ fontSize: 10, opacity: active ? 1 : 0.45, color: active ? ACTIVE : INACTIVE }}>
        {item.label}
      </Text>
    </View>
  );
}

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

  const activeRoute = state ? state.routes[state.index]?.name : pathname.split('/')[1] || 'index';
  const activeIndex = NAV_ITEMS.findIndex((i) => i.route === activeRoute);
  const searchIndex = NAV_ITEMS.findIndex((i) => i.route === '__search__');

  const [width, setWidth] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [radial, setRadial] = useState<null | { anchorIndex: number; highlighted: number }>(null);
  const visualIndex = dragIndex ?? (searchOpen && searchIndex >= 0 ? searchIndex : activeIndex);
  const itemWidth = width / NAV_ITEMS.length;

  // Pill: posizione animata (transform translateX)
  const pillX = useRef(new Animated.Value(0)).current;
  const dragging = useRef(false);
  useEffect(() => {
    if (!itemWidth || dragging.current) return;
    Animated.timing(pillX, {
      toValue: Math.max(0, visualIndex) * itemWidth,
      duration: 280,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    }).start();
  }, [visualIndex, itemWidth, pillX]);

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

  // Gesture: tap, drag-to-select e long-press radiale, come i pointer handler originali
  const refs = useRef({ downAt: 0, startX: 0, startY: 0, moved: false, index: -1, timer: null as ReturnType<typeof setTimeout> | null, radial: false, highlighted: -1 });
  // posizione del tocco rispetto alla barra: pageX meno il bordo sinistro della barra sullo schermo.
  // (locationX è relativo all'elemento toccato, cioè l'icona o la scritta, non alla barra: toccando
  // "Clienti" dava ~0 e si andava sempre sulla prima voce)
  const barRef = useRef<View>(null);
  const barLeft = useRef(0);
  const barX = (e: GestureResponderEvent) => e.nativeEvent.pageX - barLeft.current;
  const indexFromX = (x: number) => Math.max(0, Math.min(NAV_ITEMS.length - 1, Math.floor(x / (itemWidth || 1))));
  const items = useRef(NAV_ITEMS);
  items.current = NAV_ITEMS;

  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: (e) => {
      const r = refs.current;
      const x = barX(e);
      r.downAt = e.nativeEvent.timestamp;
      r.startX = e.nativeEvent.pageX;
      r.startY = e.nativeEvent.pageY;
      r.moved = false;
      r.radial = false;
      r.highlighted = -1;
      const idx = indexFromX(x);
      r.index = idx;
      dragging.current = true;
      setDragIndex(idx);
      Animated.timing(pillX, { toValue: idx * itemWidth, duration: 280, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }).start();
      const route = items.current[idx].route;
      if (RADIAL_MENUS[route]) {
        r.timer = setTimeout(() => {
          r.timer = null;
          r.radial = true;
          dragging.current = false;
          setDragIndex(null);
          setRadial({ anchorIndex: idx, highlighted: -1 });
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        }, 250);
      }
    },
    onPanResponderMove: (e, g) => {
      const r = refs.current;
      if (r.timer && (Math.abs(g.dx) > 10 || Math.abs(g.dy) > 10)) { clearTimeout(r.timer); r.timer = null; }
      if (r.radial) {
        // il dito sale verso il ventaglio: settore in base all'angolo dal verticale
        const opts = RADIAL_MENUS[items.current[refs.current.index].route] ?? [];
        if (g.dy > -5) return;
        const angle = (Math.atan2(g.dx, -g.dy) * 180) / Math.PI;
        const sector = 180 / opts.length;
        let best = opts.findIndex((_, i) => angle >= -90 + sector * i && angle < -90 + sector * (i + 1));
        if (best === -1) best = opts.length - 1;
        if (best !== r.highlighted) {
          r.highlighted = best;
          setRadial((p) => (p ? { ...p, highlighted: best } : p));
          Haptics.selectionAsync().catch(() => {});
        }
        return;
      }
      if (!r.moved && (Math.abs(g.dx) > 10 || Math.abs(g.dy) > 10)) r.moved = true;
      const x = barX(e);
      const idx = indexFromX(x);
      if (r.moved) pillX.setValue(Math.max(0, Math.min(width - itemWidth, x - itemWidth / 2)));
      if (idx !== r.index) {
        r.index = idx;
        setDragIndex(idx);
        Haptics.selectionAsync().catch(() => {});
      }
    },
    onPanResponderRelease: (e) => {
      const r = refs.current;
      if (r.timer) { clearTimeout(r.timer); r.timer = null; }
      dragging.current = false;
      // tocco breve (orari nativi del dito): è un tap anche se il timer del ventaglio è scattato
      // in ritardo perché il JS era occupato (succedeva sull'emulatore: "Weekend" non si apriva)
      if (r.radial && r.highlighted < 0 && e.nativeEvent.timestamp - r.downAt < 250) {
        r.radial = false;
        setRadial(null);
        setDragIndex(null);
        go(items.current[r.index]);
        return;
      }
      if (r.radial) {
        r.radial = false;
        const opts = RADIAL_MENUS[items.current[r.index].route] ?? [];
        setRadial(null);
        setDragIndex(null);
        if (r.highlighted >= 0) go(opts[r.highlighted]);
        return;
      }
      setDragIndex(null);
      go(items.current[r.index]);
    },
    onPanResponderTerminate: () => {
      const r = refs.current;
      if (r.timer) clearTimeout(r.timer);
      r.radial = false;
      dragging.current = false;
      setRadial(null);
      setDragIndex(null);
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [itemWidth, width, navigation]);

  const blurTarget = usePageBlurTarget();
  const radialOptions = radial ? RADIAL_MENUS[NAV_ITEMS[radial.anchorIndex].route] ?? [] : [];
  const offsets = getRadialOffsets(radialOptions.length);

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }}>
      {/* Vetro: blur(6px) saturate(160%) + bg-background/30 + border-t */}
      {/* su Android sfoca la pagina in primo piano (ui/pageLayers); blur(6px) → intensità 24 come backdrop-blur */}
      <NativeBlur intensity={24} target={blurTarget} />
      {/* sopra la riga per l'ordine CSS degli elementi posizionati: non deve prendersi i tocchi */}
      <Div pointerEvents="none" className="absolute inset-0 border-t border-border bg-background/30" />

      <View
        style={{ height: BAR_HEIGHT, width: '100%', maxWidth: 512, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}
        ref={barRef}
        onLayout={(e: LayoutChangeEvent) => {
          setWidth(e.nativeEvent.layout.width);
          barRef.current?.measureInWindow((left) => { barLeft.current = left; });
        }}
        {...responder.panHandlers}
        accessibilityRole="tablist"
      >
        {/* Pill indicatore — sempre montato */}
        {width > 0 && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute', top: 5, left: 0, width: itemWidth, height: 50,
              alignItems: 'center', justifyContent: 'center',
              opacity: visualIndex >= 0 ? 1 : 0,
              transform: [{ translateX: pillX }],
            }}
          >
            <View style={{
              width: 75, height: 46, borderRadius: 23,
              backgroundColor: `${PRIMARY}8c`, // primary / 0.55
              borderWidth: 1, borderColor: `${PRIMARY}b3`, // inset primary / 0.7
              shadowColor: PRIMARY, shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 0 },
            }} />
          </Animated.View>
        )}
        {NAV_ITEMS.map((item, index) => (
          <NavIcon key={item.route} item={item} active={visualIndex === index} dragging={dragIndex === index} logo={logoDataUrl} />
        ))}
      </View>

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
    </View>
  );
}

/** Pop-up dal basso (vibraRadialPopUp 0.32s) + scala 1.25 quando evidenziato. */
function RadialItem({ x, y, delay, highlighted, children }: { x: number; y: number; delay: number; highlighted: boolean; children: React.ReactNode }) {
  const pop = useRef(new Animated.Value(0)).current;
  const hl = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(pop, { toValue: 1, duration: 320, delay, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }).start();
  }, [pop, delay]);
  useEffect(() => {
    Animated.timing(hl, { toValue: highlighted ? 1.25 : 1, duration: 150, easing: Easing.bezier(0.34, 1.56, 0.64, 1), useNativeDriver: true }).start();
  }, [highlighted, hl]);
  return (
    <Animated.View
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
    </Animated.View>
  );
}
