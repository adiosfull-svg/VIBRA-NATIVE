// Salvataggio di file generati dall'app (PDF, CSV, immagini): sul web è un download del browser
// (files.web.ts); sul telefono il file va nella cache e si apre la condivisione di sistema
// (salva su file, invia su WhatsApp, ...).
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function saveBase64File(name: string, base64: string, mime: string): Promise<void> {
  const file = new File(Paths.cache, name.replace(/[\\/:*?"<>|]+/g, ' '));
  if (file.exists) file.delete();
  file.create();
  file.write(base64, { encoding: 'base64' });
  if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(file.uri, { mimeType: mime, dialogTitle: name });
}

/** Blob → base64 (senza il prefisso data:). */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).replace(/^data:[^,]*,/, ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
