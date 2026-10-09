// Sostituto dello SDK Base44 per l'app di riferimento: stessa interfaccia, dati dallo stack
// Supabase locale tramite lo STESSO adapter usato dall'app nativa (app/src/lib/entityAdapter.ts).
import { createClient } from '@supabase/supabase-js';
import { createEntities } from '@native/entityAdapter.ts';

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
  auth: { storageKey: 'webref-auth', detectSessionInUrl: false },
});

const entities = createEntities(supabase);
// Realtime non c'è nello stack locale: subscribe diventa un no-op.
for (const e of Object.values(entities)) e.subscribe = () => () => {};

async function me() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw Object.assign(new Error('Authentication required'), { status: 401 });
  const { data, error } = await supabase.from('profiles')
    .select('id, email, full_name, role, promoter_id').eq('id', session.user.id).single();
  if (error) throw error;
  return data;
}

const notAvailable = (what) => async () => {
  console.warn(`[web-ref] ${what} non disponibile in locale`);
  return { data: null };
};

export const base44 = {
  entities,
  auth: {
    me,
    isAuthenticated: async () => !!(await supabase.auth.getSession()).data.session,
    logout: async () => { await supabase.auth.signOut(); window.location.reload(); },
    redirectToLogin: () => window.location.reload(),
    updateMe: async (values) => {
      const u = await me();
      return entities.User.update(u.id, values);
    },
  },
  functions: { invoke: notAvailable('functions.invoke') },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => ({ file_url: URL.createObjectURL(file) }),
      UploadPublicFile: async ({ file }) => ({ file_url: URL.createObjectURL(file) }),
      UploadPrivateFile: async ({ file }) => ({ file_uri: URL.createObjectURL(file) }),
      CreateFileSignedUrl: async ({ file_uri }) => ({ signed_url: file_uri }),
      InvokeLLM: async () => { throw new Error('[web-ref] InvokeLLM non disponibile in locale'); },
    },
  },
  agents: {
    listConversations: async () => [],
    getConversation: async () => null,
    createConversation: async () => ({ id: 'local', messages: [] }),
    addMessage: notAvailable('agents.addMessage'),
    subscribeToConversation: () => () => {},
  },
};
