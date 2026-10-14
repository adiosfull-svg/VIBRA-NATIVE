// Shim di `leaflet` per le pagine convertite: Leaflet vero gira nella pagina della mappa (ui/map/leafletGeneric).
// Qui servono solo le opzioni che le pagine costruiscono e passano a react-leaflet (shims/react-leaflet.tsx).
const L = {
  divIcon: (options: Record<string, unknown>) => ({ __divIcon: true, ...options }),
  latLng: (lat: number, lng: number) => [lat, lng] as [number, number],
};
export default L;
