// <input type="file"> sul telefono: ref.current.click() apre la galleria (accept="image/*")
// o la scelta documenti, poi onChange riceve { target: { files: [...] } } come sul web.
// I file sono oggetti con il prototipo di File (lo SDK Base44 controlla `instanceof File`)
// e con { uri, name, type }, che il FormData di React Native carica come parte del multipart.
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { forwardRef, useImperativeHandle } from 'react';
import { Btn } from './html';
import { Text } from './text';
import { cn } from './cn';

export type FileFieldProps = {
  accept?: string; multiple?: boolean; capture?: string; disabled?: boolean; className?: string;
  onChange?: (e: { target: { files: ArrayLike<unknown> | null; value: string } }) => void;
};
export type FileFieldHandle = { click: () => void };

type Picked = { uri: string; name: string; type: string; size?: number };

/** File "nativo": instanceof File, ma con uri al posto del contenuto. */
export function nativeFile({ uri, name, type, size }: Picked): unknown {
  const FileCtor = (globalThis as { File?: { prototype: object } }).File;
  const f = Object.create(FileCtor?.prototype ?? Object.prototype);
  // proprietà proprie (File.prototype ha name/size/type in sola lettura)
  for (const [k, v] of Object.entries({ uri, name, type, size: size ?? 0, lastModified: Date.now() })) {
    Object.defineProperty(f, k, { value: v, enumerable: true });
  }
  return f;
}

const isImageOnly = (accept?: string) => !!accept && accept.split(',').every((a) => a.trim().startsWith('image/'));

async function pick(accept: string | undefined, multiple: boolean): Promise<Picked[]> {
  if (isImageOnly(accept)) {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: multiple, quality: 0.9 });
    if (r.canceled) return [];
    return r.assets.map((a, i) => ({
      uri: a.uri,
      name: a.fileName ?? `foto-${Date.now()}-${i}.jpg`,
      type: a.mimeType ?? 'image/jpeg',
      size: a.fileSize,
    }));
  }
  const types = accept ? accept.split(',').map((t) => t.trim()).filter((t) => t.includes('/')) : [];
  const r = await DocumentPicker.getDocumentAsync({ type: types.length ? types : '*/*', multiple, copyToCacheDirectory: true });
  if (r.canceled) return [];
  return r.assets.map((a) => ({ uri: a.uri, name: a.name, type: a.mimeType ?? 'application/octet-stream', size: a.size }));
}

export const FileField = forwardRef<FileFieldHandle, FileFieldProps>(({ accept, multiple = false, disabled, className, onChange }, ref) => {
  const open = async () => {
    if (disabled) return;
    const picked = await pick(accept, multiple);
    if (!picked.length) return;
    onChange?.({ target: { files: picked.map(nativeFile), value: '' } });
  };
  useImperativeHandle(ref, () => ({ click: () => { open(); } }));
  if (/(^|\s)hidden(\s|$)/.test(className ?? '')) return null;
  // input visibile: pulsante come quello del browser
  return (
    <Btn className={cn('flex-row items-center gap-2', className)} disabled={disabled} onClick={open}>
      <Text className="text-sm rounded border border-border px-2 py-1">Scegli file</Text>
    </Btn>
  );
});
FileField.displayName = 'FileField';
