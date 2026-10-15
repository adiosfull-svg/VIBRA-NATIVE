// PORT (solo RN): riga con swipe a destra (azione) e a sinistra (WhatsApp), condivisa da
// programmazione/RecontactList e client/LeadersList (prima due copie con setState a ogni movimento).
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { CheckCircle2 } from '@/ui/icons.generated';
import WhatsAppIcon from '@/web/components/shared/WhatsAppIcon';
import { Div, Span } from '@/ui/html';

/** Riga swipeable di Da ricontattare (rightLabel "Contattato") e della lista Leader ("Sentito"). */
// PORT: posizione della riga in un Animated.Value (setValue mentre il dito si muove, animazioni sul driver
// nativo al rilascio): prima ogni movimento era un setState che ridisegnava la riga, e al rilascio la riga
// saltava a 0/±120 senza scorrere (le transizioni di transform non passano da ui/cssTransition).
const SWIPE_GREEN = 'rgba(16,185,129,0.2)';
const SWIPE_CLEAR = 'rgba(16,185,129,0)';
export default function SwipeableRow({ children, onSwipeRight, onSwipeLeft, hasPhone, disabled, rightLabel }) {
  const x = useRef(new Animated.Value(0)).current;
  const startX = useRef(0);
  const startY = useRef(0);
  const swiping = useRef(false);
  const offsetRef = useRef(0);
  const timer = useRef(null);
  const latest = useRef({ onSwipeRight, onSwipeLeft });
  latest.current = { onSwipeRight, onSwipeLeft };
  const threshold = 60;
  useEffect(() => () => clearTimeout(timer.current), []);

  const slideTo = (to, cb) => {
    offsetRef.current = to;
    Animated.timing(x, { toValue: to, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(cb);
  };

  const onTouchStart = (e) => {
    if (disabled) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    swiping.current = false;
  };

  const onTouchMove = (e) => {
    if (disabled) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    if (!swiping.current) {
      // Engage swipe only when horizontal motion clearly dominates: this lets
      // vertical-dominant touches fall through to native scroll (page/list)
      // instead of hijacking the gesture and freezing the scroll.
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        swiping.current = true;
      }
      return;
    }
    const clamped = Math.max(-120, Math.min(120, dx));
    offsetRef.current = clamped;
    x.setValue(clamped);
  };

  const onTouchEnd = () => {
    if (!swiping.current) { if (offsetRef.current !== 0) slideTo(0); return; }
    swiping.current = false;
    let side = null;
    if (offsetRef.current > threshold) { side = 'right'; slideTo(120); }
    else if (offsetRef.current < -threshold && hasPhone) { side = 'left'; slideTo(-120); }
    else slideTo(0);
    if (!side) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (side === 'right') latest.current.onSwipeRight?.();
      else latest.current.onSwipeLeft?.();
      slideTo(0);
    }, 300);
  };

  const background = useMemo(() => x.interpolate({
    inputRange: [-120, -60, 0, 60, 120],
    outputRange: hasPhone ? [SWIPE_GREEN, SWIPE_GREEN, SWIPE_CLEAR, SWIPE_GREEN, SWIPE_GREEN] : [SWIPE_CLEAR, SWIPE_CLEAR, SWIPE_CLEAR, SWIPE_GREEN, SWIPE_GREEN],
    extrapolate: 'clamp',
  }), [x, hasPhone]);
  const rightHint = useMemo(() => x.interpolate({ inputRange: [20, 20.01, 80], outputRange: [0, 0.25, 1], extrapolate: 'clamp' }), [x]);
  const leftHint = useMemo(() => x.interpolate({ inputRange: [-80, -20.01, -20], outputRange: [1, 0.25, 0], extrapolate: 'clamp' }), [x]);
  const rowStyle = useMemo(() => ({ transform: [{ translateX: x }], backgroundColor: background }), [x, background]);

  return (
    <Div className="relative overflow-hidden">
      <Div
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-4"
        animatedStyle={{ opacity: rightHint }}
      >
        <Div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <Span className="text-[11px] font-semibold">{rightLabel}</Span>
        </Div>
      </Div>
      {hasPhone && (
        <Div
          className="absolute inset-y-0 left-0 flex items-center pl-4"
          animatedStyle={{ opacity: leftHint }}
        >
          <Div className="flex items-center gap-1.5 text-emerald-400">
            <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
            <Span className="text-[11px] font-semibold">WhatsApp</Span>
          </Div>
        </Div>
      )}
      <Div
        className="relative"
        style={{ touchAction: 'pan-y' }}
        animatedStyle={rowStyle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </Div>
    </Div>
  );
}
