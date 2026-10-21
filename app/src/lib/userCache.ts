// Ultimo utente connesso salvato sul telefono: all'avvio l'app parte subito con lui (come un'app nativa)
// mentre auth.me() lo ricontrolla dietro. Prima lo schermo restava sul caricamento per tutta la richiesta
// (e senza rete si tornava al login). Token scaduto (401/403) → uscita come prima.
import { File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';
import type { AppUser } from './auth';

const WEB = Platform.OS === 'web';
let file: File | null = null;
const userFile = () => (file ??= new File(Paths.document, 'vibra-user.json'));

export function readCachedUser(): AppUser | null {
  if (WEB) return null;
  try {
    const f = userFile();
    if (!f.exists) return null;
    const u = JSON.parse(f.textSync()) as AppUser;
    return u && typeof u.id === 'string' ? u : null;
  } catch {
    return null;
  }
}

export function writeCachedUser(user: AppUser | null) {
  if (WEB) return;
  try {
    const f = userFile();
    if (!user) { if (f.exists) f.delete(); return; }
    if (!f.exists) f.create();
    f.write(JSON.stringify(user));
  } catch { /* si ricontrolla dalla rete al prossimo avvio */ }
}
