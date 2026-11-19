import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

export const name = 'dsh-node-studio';
export const inject = ['webServer'];

const PLUGIN_DIR = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(PLUGIN_DIR, 'state.json');
const PRESETS_FILE = path.join(PLUGIN_DIR, 'presets.json');

function isLoopback(req) {
  const addr = (req && req.socket && req.socket.remoteAddress) || '';
  return addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1';
}

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function loadYamlParser() {
  const profileDir = path.join(os.homedir(), '.dsh', 'profiles', 'desktop');
  try {
    const req = createRequire(path.join(profileDir, 'package.json'));
    return req('yaml');
  } catch {
    return null;
  }
}
function loadExtraSecrets() {
  const secrets = {};
  const dshDir = path.join(os.homedir(), '.dsh');
  const candidates = [
    path.join(dshDir, '.env'),
    path.join(dshDir, 'profiles', 'desktop', '.env'),
    path.join(PLUGIN_DIR, 'keys.json')
  ];
  for (const file of candidates) {
    try {
      if (!fs.existsSync(file)) continue;
      const content = fs.readFileSync(file, 'utf8');
      if (file.endsWith('.json')) {
        Object.assign(secrets, JSON.parse(content));
      } else {
        for (const line of content.split(/\r?\n/)) {
          const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.+?)\s*$/);
          if (m) secrets[m.at(1)] = m.at(2).replace(/^['"]|['"]$/g, '');
        }
      }
    } catch {}
  }
  return secrets;
}

function readProfileProviders() {
  const profileDir = path.join(os.homedir(), '.dsh', 'profiles', 'desktop');
  const patchPath = path.join(profileDir, 'cordis.patch.yml');
  const providersMap = new Map();
  const models = [];
  const extraSecrets = loadExtraSecrets();

  try {
    const yaml = loadYamlParser();
    if (!yaml || !fs.existsSync(patchPath)) return { providersMap, models };
    const entries = yaml.parse(fs.readFileSync(patchPath, 'utf8')) || [];
    for (const entry of entries) {
      if (entry && entry.id === 'llm-pi-ai' && entry.config && entry.config.providers) {
        for (const [provKey, prov] of Object.entries(entry.config.providers)) {
          const baseURL = prov.baseURL || (provKey === 'openrouter' ? 'https://openrouter.ai' : '');
          const envName = prov.apiKeyEnv || '';
          const apiKey = prov.apiKey || extraSecrets[provKey] || (envName && (process.env[envName] || extraSecrets[envName])) || '';
          const label = prov.displayName || provKey;
          providersMap.set(provKey, { provider: provKey, label, baseURL, apiKey });
          const list = Array.isArray(prov.models) ? prov.models : [];
          for (const m of list) {
            models.push({ provider: provKey, providerLabel: label, id: m.id, name: m.name || m.id });
          }
        }
      }
      if (entry && entry.id === 'llm-deepseek' && entry.config && Array.isArray(entry.config.models)) {
        const apiKey = entry.config.apiKey || extraSecrets.deepseek || process.env.DEEPSEEK_API_KEY || extraSecrets.DEEPSEEK_API_KEY || '';
        providersMap.set('deepseek', { provider: 'deepseek', label: 'DeepSeek', baseURL: 'https://deepseek.com', apiKey });
        for (const m of entry.config.models) {
          models.push({ provider: 'deepseek', providerLabel: 'DeepSeek', id: m.id, name: m.name || m.id });
        }
      }
    }
  } catch {}
  return { providersMap, models };
}
async function callGateway(ctx, namespace, method, request) {
  const gateway = typeof ctx.get === 'function' ? ctx.get('typertGateway', false) : null;
  if (!gateway || typeof gateway.invoke !== 'function') return null;
  const controller = new AbortController();
  const noReq = (namespace === 'agentPresets' && method === 'list') || (namespace === 'session' && method === 'modelCatalog');
  return await gateway.invoke({
    namespace,
    method,
    args: noReq ? {} : { request: request || {} },
    signal: controller.signal,
    peer: {
      id: 'dsh-node-studio:' + crypto.randomUUID(),
      principal: { kind: 'owner' },
      signal: controller.signal,
      interactions: 'none',
      dispose: () => Promise.resolve()
    }
  });
}

function getRegisteredWorkspaces(ctx) {
  try {
    const reg = typeof ctx.get === 'function' ? ctx.get('workspaceRegistry', false) : null;
    if (reg && typeof reg.list === 'function') {
      return reg.list().map((w) => ({
        id: String(w.id),
        name: w.title || path.basename(w.path || String(w.id)),
        path: w.path || ''
      }));
    }
  } catch {}
  return [];
}

async function getAllModels(ctx) {
  const { providersMap, models } = readProfileProviders();
  const seen = new Set(models.map((m) => `${m.provider}/${m.id}`));
  try {
    const catalog = await callGateway(ctx, 'session', 'modelCatalog', {});
    const groups = (catalog && Array.isArray(catalog.groups)) ? catalog.groups : [];
    for (const group of groups) {
      const prov = group.id || group.provider;
      if (!prov) continue;
      const existing = providersMap.get(prov);
      const provLabel = (existing && existing.label) || group.name || prov;
      const gModels = Array.isArray(group.models) ? group.models : [];
      for (const m of gModels) {
        if (!m || !m.id) continue;
        const key = `${prov}/${m.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        models.push({ provider: prov, providerLabel: provLabel, id: m.id, name: m.name || m.id });
      }
    }
  } catch {}
  return { providersMap, models };
}
async function getWorkspaces(ctx) {
  const found = [];
  const seen = new Set();
  const addDir = (p) => {
    if (!p || typeof p !== 'string') return;
    const norm = path.normalize(p.trim());
    if (norm && !seen.has(norm) && fs.existsSync(norm)) {
      seen.add(norm);
      found.push({ name: path.basename(norm), path: norm });
    }
  };

  for (const w of getRegisteredWorkspaces(ctx)) addDir(w.path);

  const dshDir = path.join(os.homedir(), '.dsh');
  try {
    if (fs.existsSync(dshDir)) {
      for (const file of fs.readdirSync(dshDir)) {
        if (!file.endsWith('.json')) continue;
        const raw = fs.readFileSync(path.join(dshDir, file), 'utf8');
        const matches = raw.match(/[A-Za-z]:\\\\[^"'\r\n]+/g) || [];
        for (const m of matches) {
          const clean = m.replace(/\\\\/g, '\\');
          if (!clean.includes('\\.dsh') && !clean.includes('node_modules')) addDir(clean);
        }
      }
    }
  } catch {}

  return found;
}

const ALLOWED_EXTS = new Set(['.md', '.txt', '.json', '.yaml', '.yml', '.csv']);

function listProjectFiles(baseDir) {
  const results = [];
  if (!baseDir || !fs.existsSync(baseDir)) return results;
  const root = path.resolve(baseDir);

  function walk(dir, depth) {
    if (depth > 3 || results.length >= 200) return;
    let items = [];
    try { items = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const item of items) {
      if (item.name.startsWith('.') || item.name === 'node_modules') continue;
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(full, depth + 1);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (ALLOWED_EXTS.has(ext)) {
          results.push(path.relative(root, full).replace(/\\/g, '/'));
        }
      }
    }
  }

  walk(root, 0);
  return results.sort();
}
export function apply(ctx) {
  const routes = [
    {
      kind: 'exact',
      path: '/dsh-node-studio/api/models',
      auth: 'anonymous',
      handler: async (req, res) => {
        if (!isLoopback(req)) return sendJson(res, 403, { error: 'forbidden' });
        const { models } = await getAllModels(ctx);
        const workspaces = await getWorkspaces(ctx);
        sendJson(res, 200, { models, workspaces });
      }
    },
    {
      kind: 'exact',
      path: '/dsh-node-studio/api/files',
      auth: 'anonymous',
      handler: (req, res) => {
        if (!isLoopback(req)) return sendJson(res, 403, { error: 'forbidden' });
        try {
          const u = new URL(req.url || '', 'http://127.0.0.1');
          const dir = (u.searchParams.get('dir') || '').trim();
          const files = listProjectFiles(dir);
          sendJson(res, 200, { files });
        } catch (err) {
          sendJson(res, 500, { error: String(err) });
        }
      }
    },
    {
      kind: 'exact',
      path: '/dsh-node-studio/api/read-file',
      auth: 'anonymous',
      handler: async (req, res) => {
        if (!isLoopback(req)) return sendJson(res, 403, { error: 'forbidden' });
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'method not allowed' });
        try {
          const body = await readBody(req);
          const dir = (body.projectDir || '').trim();
          const rel = (body.filePath || '').trim();
          if (!dir || !rel) return sendJson(res, 400, { error: 'Не указан путь к папке или файлу' });
          const root = path.resolve(dir);
          const target = path.resolve(root, rel);
          if (!target.startsWith(root)) return sendJson(res, 403, { error: 'Доступ запрещён' });
          if (!fs.existsSync(target)) return sendJson(res, 404, { error: 'Файл не найден: ' + rel });
          const content = fs.readFileSync(target, 'utf8');
          sendJson(res, 200, { content });
        } catch (err) {
          sendJson(res, 500, { error: err instanceof Error ? err.message : String(err) });
        }
      }
    },
    {
      kind: 'exact',
      path: '/dsh-node-studio/api/state',
      auth: 'anonymous',
      handler: async (req, res) => {
        if (!isLoopback(req)) return sendJson(res, 403, { error: 'forbidden' });
        if (req.method === 'GET') {
          try {
            if (fs.existsSync(STATE_FILE)) {
              return sendJson(res, 200, JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')));
            }
          } catch {}
          return sendJson(res, 200, { empty: true });
        }
        if (req.method === 'POST') {
          try {
            const body = await readBody(req);
            fs.writeFileSync(STATE_FILE, JSON.stringify(body, null, 2), 'utf8');
            return sendJson(res, 200, { ok: true });
          } catch (e) {
            return sendJson(res, 500, { error: String(e) });
          }
        }
        sendJson(res, 405, { error: 'method not allowed' });
      }
    },
    {
      kind: 'exact',
      path: '/dsh-node-studio/api/save-md',
      auth: 'anonymous',
      handler: async (req, res) => {
        if (!isLoopback(req)) return sendJson(res, 403, { error: 'forbidden' });
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'method not allowed' });
        try {
          const body = await readBody(req);
          const dir = (body.projectDir || '').trim();
          if (!dir) return sendJson(res, 400, { error: 'Не указана папка проекта' });
          let fileName = (body.fileName || '').trim();
          if (!fileName) {
            const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
            fileName = `node-studio-${stamp}.md`;
          }
          if (!fileName.toLowerCase().endsWith('.md')) fileName += '.md';
          fs.mkdirSync(dir, { recursive: true });
          const fullPath = path.join(dir, fileName);
          fs.writeFileSync(fullPath, String(body.content || ''), 'utf8');
          sendJson(res, 200, { ok: true, path: fullPath });
        } catch (err) {
          sendJson(res, 500, { error: err instanceof Error ? err.message : String(err) });
        }
      }
    },
    {
      kind: 'exact',
      path: '/dsh-node-studio/api/create-session',
      auth: 'anonymous',
      handler: async (req, res) => {
        if (!isLoopback(req)) return sendJson(res, 403, { error: 'forbidden' });
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'method not allowed' });
        try {
          const body = await readBody(req);
          const dir = (body.projectDir || '').trim().toLowerCase();
          const title = (body.title || 'Node Studio Результат').trim();
          const text = String(body.content || '');

          const wsList = getRegisteredWorkspaces(ctx);
          const matchedWs = wsList.find((w) => w.path && path.normalize(w.path).toLowerCase() === path.normalize(dir).toLowerCase());

          const createReq = matchedWs ? { workspaceId: matchedWs.id } : {};
          const created = await callGateway(ctx, 'session', 'create', createReq);
          const sessionId = created && created.sessionId;
          if (!sessionId) throw new Error('Хост не вернул sessionId');

          await callGateway(ctx, 'session', 'rename', { sessionId, title });
          if (text.trim()) {
            await callGateway(ctx, 'session', 'prompt', {
              sessionId,
              requestId: 'dsh-node-studio-' + crypto.randomUUID(),
              mode: 'queue',
              content: [{ type: 'text', text }]
            });
          }
          sendJson(res, 200, { ok: true, sessionId });
        } catch (err) {
          sendJson(res, 500, { error: err instanceof Error ? err.message : String(err) });
        }
      }
    },
    {
      kind: 'exact',
      path: '/dsh-node-studio/api/run',
      auth: 'anonymous',
      handler: async (req, res) => {
        if (!isLoopback(req)) return sendJson(res, 403, { error: 'forbidden' });
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'method not allowed' });
        try {
          const body = await readBody(req);
          const { provider, model, systemPrompt, userPrompt, temperature } = body;
          const temp = temperature !== undefined ? temperature : 0.7;
          const { providersMap } = readProfileProviders();
          const provConfig = providersMap.get(provider);
          if (!provConfig || !provConfig.baseURL) {
            return sendJson(res, 400, { error: `Не найден baseURL для поставщика "${provider}"` });
          }
          if (!provConfig.apiKey && !provConfig.baseURL.includes('localhost') && !provConfig.baseURL.includes('127.0.0.1')) {
            return sendJson(res, 401, { error: `Не найден API-ключ для "${provider}" в keys.json` });
          }
          const url = provConfig.baseURL.replace(/\/+$/, '') + '/chat/completions';
          const headers = { 'Content-Type': 'application/json' };
          if (provConfig.apiKey) headers['Authorization'] = `Bearer ${provConfig.apiKey}`;
          const messages = [];
          if (systemPrompt && systemPrompt.trim()) messages.push({ role: 'system', content: systemPrompt.trim() });
          messages.push({ role: 'user', content: String(userPrompt || '') });

          const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({ model, messages, temperature: Number(temp) })
          });
          const data = await response.json();
          if (!response.ok) {
            const msg = (data && data.error && data.error.message) || JSON.stringify(data);
            return sendJson(res, response.status, { error: msg });
          }
          const firstChoice = (data && Array.isArray(data.choices)) ? data.choices.at(0) : null;
          const output = (firstChoice && firstChoice.message && firstChoice.message.content) || '';
          sendJson(res, 200, { output });
        } catch (err) {
          sendJson(res, 500, { error: err instanceof Error ? err.message : String(err) });
        }
      }
    }
  ];

  ctx.effect(() => {
    const disposers = routes.map((r) => ctx.webServer.register(r));
    return () => disposers.forEach((d) => d());
  }, 'dsh-node-studio: routes');
}
