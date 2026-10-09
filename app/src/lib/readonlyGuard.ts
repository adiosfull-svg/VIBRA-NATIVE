// Modalità prova sui dati VERI di Base44: finché è attiva l'app legge ma non scrive nulla.
// Avvolge il client dello SDK e lascia passare solo le operazioni di lettura elencate qui;
// tutto il resto (create/update/delete delle entità, updateMe, funzioni server, integrazioni:
// upload, AI...) viene rifiutato con ReadOnlyError, senza partire verso il server.
// Nessuna dipendenza da React Native: testabile con node --test.

const ENTITY_READS = new Set(['list', 'filter', 'get', 'subscribe', 'schema']);
const AUTH_ALLOWED = new Set([
  'me', 'isAuthenticated', 'hasToken', 'setToken', 'logout', 'redirectToLogin', 'loginWithProvider',
]);
/** Funzioni server che si limitano a leggere: si possono chiamare anche in modalità prova. */
const READ_ONLY_FUNCTIONS = new Set<string>([]);

export class ReadOnlyError extends Error {
  readonly readOnly = true;
  constructor(what: string) {
    super(`Modalità prova: "${what}" è disattivato (l'app non modifica i dati di Base44).`);
    this.name = 'ReadOnlyError';
  }
}

type AnyObj = Record<string | symbol, any>;

function blocked(what: string, onBlocked: (what: string) => void) {
  return (..._args: unknown[]) => {
    onBlocked(what);
    return Promise.reject(new ReadOnlyError(what));
  };
}

/** Oggetto i cui metodi passano solo se `allow(nome)`; gli altri sono bloccati. */
function guardMethods(target: AnyObj, path: string, allow: (name: string) => boolean, onBlocked: (w: string) => void): AnyObj {
  return new Proxy(target, {
    get(obj, key) {
      const value = Reflect.get(obj, key);
      if (typeof key !== 'string' || typeof value !== 'function') return value;
      return allow(key) ? value.bind(obj) : blocked(`${path}.${key}`, onBlocked);
    },
  });
}

/** Blocca qualsiasi funzione a qualsiasi profondità (moduli che scrivono o consumano crediti). */
function guardAll(target: AnyObj, path: string, onBlocked: (w: string) => void): AnyObj {
  return new Proxy(target, {
    get(obj, key) {
      const value = Reflect.get(obj, key);
      if (typeof key !== 'string') return value;
      if (typeof value === 'function') return blocked(`${path}.${key}`, onBlocked);
      if (value && typeof value === 'object') return guardAll(value, `${path}.${key}`, onBlocked);
      return value;
    },
  });
}

export function readOnlyClient<T extends AnyObj>(client: T, onBlocked: (what: string) => void = () => {}): T {
  const entityCache = new Map<string, AnyObj>();
  const entities = new Proxy(client.entities as AnyObj, {
    get(obj, key) {
      const value = Reflect.get(obj, key);
      if (typeof key !== 'string' || !value || typeof value !== 'object') return value;
      if (!entityCache.has(key)) entityCache.set(key, guardMethods(value, key, (m) => ENTITY_READS.has(m), onBlocked));
      return entityCache.get(key);
    },
  });
  const auth = guardMethods(client.auth, 'auth', (m) => AUTH_ALLOWED.has(m), onBlocked);
  const functions = {
    invoke: (name: string, payload?: unknown) =>
      READ_ONLY_FUNCTIONS.has(name)
        ? client.functions.invoke(name, payload)
        : blocked(`funzione ${name}`, onBlocked)(),
  };
  return new Proxy(client, {
    get(obj, key) {
      if (key === 'entities') return entities;
      if (key === 'auth') return auth;
      if (key === 'functions') return functions;
      const value = Reflect.get(obj, key);
      if (typeof key !== 'string') return value;
      if (typeof value === 'function') return blocked(key, onBlocked);
      if (value && typeof value === 'object') return guardAll(value, key, onBlocked);
      return value;
    },
  });
}
