// TODO(porting): src/components/client/ClientMap.jsx usa Leaflet (solo web). Va rifatto con
// react-native-maps (marker per zona di residenza, cluster, filtri, schermo intero).
// Finché non è pronto la scheda Mappa mostra questo segnaposto esplicito.
import { Div, P } from '@/ui/html';
import { MapPin } from '@/ui/icons.generated';

export default function ClientMap() {
  return (
    <Div className="rounded-2xl border border-border bg-card p-8 items-center">
      <MapPin className="w-8 h-8 text-muted-foreground" />
      <P className="text-sm text-muted-foreground mt-2 text-center">Mappa clienti in fase di porting.</P>
    </Div>
  );
}
