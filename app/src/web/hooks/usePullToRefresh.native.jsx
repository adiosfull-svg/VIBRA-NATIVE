// Pull-to-refresh sul telefono: invece di ascoltare i touch del `document` (inerti su RN) registra
// onRefresh sulla pagina, che mostra il RefreshControl nativo del suo ScrollView (components/layout/Page).
// Gesto e animazione restano sul thread UI; l'indicatore web (PullToRefreshIndicator) resta nascosto.
import { useContext, useEffect, useRef } from 'react';
import { PageLayerContext } from '@/ui/pageLayers';

const IDLE = { isRefreshing: false, pullProgress: 0 };

export function usePullToRefresh(onRefresh) {
  const layer = useContext(PageLayerContext);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;
  useEffect(() => {
    if (!layer) return;
    layer.setRefreshHandler(() => onRefreshRef.current?.());
    return () => layer.setRefreshHandler(null);
  }, [layer]);
  return IDLE;
}
