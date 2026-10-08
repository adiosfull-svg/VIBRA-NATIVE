// Gateway di sviluppo che imita gli endpoint di Supabase usati dall'app:
//   /auth/v1/*  -> auth minimale (password unica di sviluppo, JWT HS256)
//   /rest/v1/*  -> proxy verso PostgREST
// Solo per sviluppo locale: in produzione si usa un vero progetto Supabase.
import http from 'node:http';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const PORT = Number(process.env.GATEWAY_PORT || 54321);
const PGRST = process.env.PGRST_URL || 'http://127.0.0.1:54330';
const SECRET = process.env.JWT_SECRET;
const DEV_PASSWORD = process.env.DEV_PASSWORD || 'vibra';
const PSQL = JSON.parse(process.env.PSQL_ARGS);

const b64url = (buf) => Buffer.from(buf).toString('base64url');

function sign(payload) {
  const head = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', SECRET).update(`${head}.${body}`).digest('base64url');
  return `${head}.${body}.${sig}`;
}

function verify(token) {
  const [head, body, sig] = String(token).split('.');
  if (!sig) return null;
  const expected = crypto.createHmac('sha256', SECRET).update(`${head}.${body}`).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const claims = JSON.parse(Buffer.from(body, 'base64url').toString());
  return claims.exp * 1000 > Date.now() ? claims : null;
}

function findUser(where, value) {
  // Il valore passa come variabile psql quotata (:'v'), interpolata solo leggendo da stdin.
  const sql = `select row_to_json(u) from auth.users u where ${where} = :'v';`;
  const out = execFileSync('psql', [...PSQL, '-tA', '-v', `v=${value}`], { input: sql, encoding: 'utf8' }).trim();
  return out ? JSON.parse(out) : null;
}

function userJson(u) {
  return {
    id: u.id, aud: 'authenticated', role: 'authenticated', email: u.email,
    app_metadata: { provider: 'email' }, user_metadata: u.raw_user_meta_data || {},
    created_at: new Date().toISOString(),
  };
}

function session(u) {
  const now = Math.floor(Date.now() / 1000);
  const access = sign({ sub: u.id, email: u.email, role: 'authenticated', aud: 'authenticated', iat: now, exp: now + 3600 });
  const refresh = sign({ sub: u.id, typ: 'refresh', iat: now, exp: now + 30 * 86400 });
  return { access_token: access, token_type: 'bearer', expires_in: 3600, expires_at: now + 3600, refresh_token: refresh, user: userJson(u) };
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Profile, Preference-Applied');
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}

async function handleAuth(req, res, url) {
  const path = url.pathname.replace('/auth/v1', '');
  if (path === '/token' && req.method === 'POST') {
    const body = JSON.parse((await readBody(req)).toString() || '{}');
    const grant = url.searchParams.get('grant_type');
    if (grant === 'password') {
      const u = body.email && findUser('lower(email)', String(body.email).toLowerCase());
      if (!u || body.password !== DEV_PASSWORD) {
        return send(res, 400, { error: 'invalid_grant', error_description: 'Invalid login credentials', msg: 'Invalid login credentials', code: 'invalid_credentials' });
      }
      return send(res, 200, session(u));
    }
    if (grant === 'refresh_token') {
      const claims = verify(body.refresh_token);
      const u = claims && claims.typ === 'refresh' && findUser('id::text', claims.sub);
      if (!u) return send(res, 400, { error: 'invalid_grant', msg: 'Invalid Refresh Token', code: 'refresh_token_not_found' });
      return send(res, 200, session(u));
    }
  }
  if (path === '/user' && req.method === 'GET') {
    const claims = verify((req.headers.authorization || '').replace(/^Bearer /i, ''));
    const u = claims && findUser('id::text', claims.sub);
    return u ? send(res, 200, userJson(u)) : send(res, 401, { msg: 'invalid JWT', code: 'bad_jwt' });
  }
  if (path === '/logout') return send(res, 204);
  return send(res, 404, { msg: `endpoint auth non implementato in locale: ${req.method} ${path}` });
}

async function proxyRest(req, res, url) {
  const target = PGRST + url.pathname.replace('/rest/v1', '') + url.search;
  const headers = { ...req.headers };
  delete headers.host;
  delete headers.apikey;
  // Senza utente PostgREST usa il ruolo anon; la anon key di sviluppo non è un JWT valido.
  if (!verify((headers.authorization || '').replace(/^Bearer /i, ''))) delete headers.authorization;
  const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await readBody(req);
  const r = await fetch(target, { method: req.method, headers, body });
  const out = Buffer.from(await r.arrayBuffer());
  const pass = {};
  for (const h of ['content-type', 'content-range', 'preference-applied']) {
    if (r.headers.get(h)) pass[h] = r.headers.get(h);
  }
  res.writeHead(r.status, pass);
  res.end(out);
}

http.createServer(async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return send(res, 204);
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith('/auth/v1')) return await handleAuth(req, res, url);
    if (url.pathname.startsWith('/rest/v1')) return await proxyRest(req, res, url);
    if (url.pathname.startsWith('/realtime/v1')) return send(res, 404, { msg: 'realtime non disponibile in locale' });
    send(res, 404, { msg: 'not found' });
  } catch (e) {
    console.error(e);
    send(res, 500, { msg: String(e) });
  }
}).listen(PORT, () => console.log(`gateway su http://127.0.0.1:${PORT}`));
