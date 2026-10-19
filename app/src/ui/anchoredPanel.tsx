// Menu a discesa delle pagine scritto "a mano" nell'originale: dentro un contenitore `relative` un velo
// `fixed inset-0 z-10` che chiude al tocco e un riquadro `absolute z-20 mt-1 ...` sotto il contenitore.
// Sul web resta identico. Sul telefono quel riquadro sporge dal contenitore e Android non passa i tocchi
// fuori dai bordi del padre; in più il velo `fixed` va nel portale della radice e copre il riquadro rimasto
// nella pagina (menu "Seleziona serate..." di Confronto Serate: né tocchi né scorrimento).
// Qui velo e riquadro vanno insieme nel portale (come Popover/Select), il riquadro alla posizione misurata
// del contenitore (measureInWindow): sotto di esso, allineato a sinistra o a destra (`right-0`), largo
// quanto il contenitore con `w-full`. Le classi del riquadro restano quelle dell'originale.
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { PortalToRoot } from './fixedPortal';
import { Btn, Div } from './html';

type Box = { x: number; y: number; w: number; h: number };

export function AnchoredPanel({ open, onClose, className = '', children, ...rest }: {
  open: boolean; onClose: () => void; className?: string; children?: ReactNode; [prop: string]: unknown;
}) {
  if (Platform.OS === 'web') {
    if (!open) return null;
    return (
      <>
        <Btn className="fixed inset-0 z-10" onClick={onClose} />
        <Div className={className} {...rest}>{children}</Div>
      </>
    );
  }
  return <NativeAnchoredPanel open={open} onClose={onClose} className={className} {...rest}>{children}</NativeAnchoredPanel>;
}

function NativeAnchoredPanel({ open, onClose, className, children, ...rest }: {
  open: boolean; onClose: () => void; className: string; children?: ReactNode; [prop: string]: unknown;
}) {
  const anchorRef = useRef<View>(null);
  const hostRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<Box | null>(null);
  const [host, setHost] = useState<Box | null>(null);

  useLayoutEffect(() => {
    if (!open) { setAnchor(null); setHost(null); return; }
    anchorRef.current?.measureInWindow((x, y, w, h) => setAnchor({ x, y, w, h }));
  }, [open]);

  const measureHost = () => hostRef.current?.measureInWindow((x, y, w, h) => setHost({ x, y, w, h }));

  let place: { position: 'absolute'; top: number; left?: number; right?: number; width?: number } | null = null;
  if (anchor && host) {
    place = { position: 'absolute', top: anchor.y + anchor.h - host.y };
    if (/(^|\s)right-0(\s|$)/.test(className)) place.right = host.w - (anchor.x - host.x + anchor.w);
    else place.left = anchor.x - host.x;
    if (/(^|\s)w-full(\s|$)/.test(className)) place.width = anchor.w;
  }

  return (
    <>
      {/* stessa area del contenitore relative: da qui si legge dove mettere il riquadro */}
      <View ref={anchorRef} collapsable={false} pointerEvents="none" style={StyleSheet.absoluteFill} />
      {open && (
        <PortalToRoot>
          <View ref={hostRef} collapsable={false} pointerEvents="box-none" style={StyleSheet.absoluteFill} onLayout={measureHost}>
            <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Chiudi menu" />
            {place && <Div className={className} style={place} {...rest}>{children}</Div>}
          </View>
        </PortalToRoot>
      )}
    </>
  );
}
