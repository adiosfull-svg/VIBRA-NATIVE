// Indirizzo di ritorno del login Base44 sul telefono (vibra://auth?access_token=..., passando dalla
// pagina ponte /accesso-app dell'app Base44). Il token lo legge
// signInWithGoogle dal risultato del browser interno; se il sistema apre comunque questa
// pagina (Android), si torna semplicemente all'inizio.
import { Redirect } from 'expo-router';

export default function AuthReturn() {
  return <Redirect href="/" />;
}
