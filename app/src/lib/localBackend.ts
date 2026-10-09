// Backend di PROVA (EXPO_PUBLIC_BACKEND=local): oggetto con la stessa interfaccia dello SDK Base44
// sopra lo stack locale Supabase-like (scripts/local/dev_stack.sh), usato per i confronti grafici
// con tools/compare/measure.mjs su dati sintetici. In produzione l'app usa il vero SDK (base44Remote.ts).
import { File as ExpoFile } from 'expo-file-system';
import { entities } from './entities';
import { supabase } from './supabase';

async function me() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw Object.assign(new Error('Authentication required'), { status: 401 });
  const { data, error } = await supabase.from('profiles')
    .select('id, email, full_name, role, promoter_id').eq('id', session.user.id).single();
  if (error) throw error;
  return data;
}

/** Funzioni backend: Supabase Edge Functions con lo stesso nome delle funzioni Base44. */
async function invoke(name: string, payload?: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke(name, { body: payload ?? {} });
  if (error) throw error;
  return { data };
}

type UploadArg = { file: { uri: string; name?: string; type?: string } | Blob };
const BUCKET_PUBLIC = 'public-files';
const BUCKET_PRIVATE = 'private-files';

async function upload(bucket: string, { file }: UploadArg) {
  const isBlob = typeof Blob !== 'undefined' && file instanceof Blob;
  const meta = isBlob ? { name: 'file', type: (file as Blob).type } : (file as { uri: string; name?: string; type?: string });
  const ext = (meta.name?.split('.').pop() || meta.type?.split('/').pop() || 'bin').toLowerCase();
  const path = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const body = isBlob ? (file as Blob) : await new ExpoFile((file as { uri: string }).uri).arrayBuffer();
  const { error } = await supabase.storage.from(bucket).upload(path, body, { contentType: meta.type || undefined });
  if (error) throw error;
  return path;
}

export const localBase44 = {
  entities,
  auth: {
    me,
    isAuthenticated: async () => !!(await supabase.auth.getSession()).data.session,
    logout: async (_redirect?: string) => { await supabase.auth.signOut(); },
    redirectToLogin: (_from?: string) => { void supabase.auth.signOut(); },
    updateMe: async (values: Record<string, unknown>) => entities.User.update((await me()).id, values),
  },
  functions: { invoke },
  integrations: {
    Core: {
      UploadFile: async (arg: UploadArg) => {
        const path = await upload(BUCKET_PUBLIC, arg);
        return { file_url: supabase.storage.from(BUCKET_PUBLIC).getPublicUrl(path).data.publicUrl };
      },
      UploadPublicFile: async (arg: UploadArg) => {
        const path = await upload(BUCKET_PUBLIC, arg);
        return { file_url: supabase.storage.from(BUCKET_PUBLIC).getPublicUrl(path).data.publicUrl };
      },
      UploadPrivateFile: async (arg: UploadArg) => ({ file_uri: await upload(BUCKET_PRIVATE, arg) }),
      CreateFileSignedUrl: async ({ file_uri, expires_in = 3600 }: { file_uri: string; expires_in?: number }) => {
        const { data, error } = await supabase.storage.from(BUCKET_PRIVATE).createSignedUrl(file_uri, expires_in);
        if (error) throw error;
        return { signed_url: data.signedUrl };
      },
      /** InvokeLLM → Edge Function "invokeLLM" (Claude), stessi parametri dell'SDK. */
      InvokeLLM: async (params: Record<string, unknown>) => (await invoke('invokeLLM', params)).data,
    },
  },
};
