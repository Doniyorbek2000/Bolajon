/**
 * Bolajon reyting serveri — tashqi kutubxonalarsiz (Node.js 18+).
 *
 *   PORT=8787 DATA_FILE=./data/scores.json node server/index.mjs
 *
 * Saqlanadigan ma'lumot (bolalar xavfsizligi uchun minimal): anonim qurilma ID, ism (faqat birinchi so'z),
 * avatar belgisi, yosh, viloyat, tuman, yulduzlar, vazifalar, daraja. Rasm va boshqa shaxsiy ma'lumot olinmaydi.
 *
 * API:
 *   POST   /v1/score                 { id, name, avatar, age, region, district, stars, tasks, level }
 *   GET    /v1/leaderboard?scope=country|region|district&region=&district=&id=&limit=50
 *   DELETE /v1/score/:id             (ota-ona reytingdan chiqqanda)
 */
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const DATA_FILE = process.env.DATA_FILE || join(here, 'data', 'scores.json');
const REGIONS = JSON.parse(readFileSync(join(here, 'regions.json'), 'utf8'));
const AVATARS = new Set(['🦁', '🐼', '🐰', '🦊', '🐻', '🐱', '🐶', '🦄', '🐸', '🐵', '🐯', '🐨', '🐧', '🦉', '🐢', '🦖']);

/** @type {Map<string, any>} */
const players = new Map();
if (existsSync(DATA_FILE)) for (const p of JSON.parse(readFileSync(DATA_FILE, 'utf8'))) players.set(p.id, p);

let saveTimer = null;
function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    mkdirSync(dirname(DATA_FILE), { recursive: true });
    const tmp = DATA_FILE + '.tmp';
    writeFileSync(tmp, JSON.stringify([...players.values()]));
    renameSync(tmp, DATA_FILE);
  }, 2000);
}

/* ---------- himoya: so'rovlar chegarasi ---------- */
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const h = hits.get(ip) ?? { n: 0, t: now };
  if (now - h.t > 60_000) Object.assign(h, { n: 0, t: now });
  h.n++;
  hits.set(ip, h);
  return h.n > 60;
}

const int = (v, max) => (Number.isInteger(v) && v >= 0 && v <= max ? v : null);
/** Faqat harflar, birinchi so'z, 20 belgigacha */
const cleanName = (s) => (typeof s === 'string' ? s.normalize('NFC').replace(/[^\p{L}\p{M}'ʻʼ‘’-]+/gu, ' ').trim().split(' ')[0].slice(0, 20) : '');

function validate(b) {
  if (!b || typeof b !== 'object') return 'body';
  if (typeof b.id !== 'string' || !/^p[a-z0-9]{10,40}$/.test(b.id)) return 'id';
  const name = cleanName(b.name);
  if (!name) return 'name';
  if (!AVATARS.has(b.avatar)) return 'avatar';
  if (!REGIONS[b.region]) return 'region';
  if (!REGIONS[b.region].includes(b.district)) return 'district';
  const age = int(b.age, 12), stars = int(b.stars, 1_000_000), tasks = int(b.tasks, 100_000), level = int(b.level, 100_000);
  if (age === null || stars === null || tasks === null || level === null) return 'numbers';
  return { id: b.id, name, avatar: b.avatar, age, region: b.region, district: b.district, stars, tasks, level, updatedAt: Date.now() };
}

const cmp = (a, b) => b.stars - a.stars || b.tasks - a.tasks || a.updatedAt - b.updatedAt;
const pub = (p, rank) => ({ rank, name: p.name, avatar: p.avatar, age: p.age, region: p.region, district: p.district, stars: p.stars, tasks: p.tasks, level: p.level });

function board(q) {
  const scope = q.get('scope') || 'country';
  let list = [...players.values()];
  if (scope === 'region' || scope === 'district') list = list.filter((p) => p.region === q.get('region'));
  if (scope === 'district') list = list.filter((p) => p.district === q.get('district'));
  list.sort(cmp);
  const limit = Math.min(100, Math.max(1, Number(q.get('limit')) || 50));
  const id = q.get('id');
  const myIndex = id ? list.findIndex((p) => p.id === id) : -1;
  return { scope, total: list.length, top: list.slice(0, limit).map((p, i) => ({ ...pub(p, i + 1), me: p.id === id })), me: myIndex >= 0 ? pub(list[myIndex], myIndex + 1) : null };
}

function send(res, code, obj) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
  });
  res.end(obj === undefined ? '' : JSON.stringify(obj));
}

const server = createServer((req, res) => {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim();
  if (req.method === 'OPTIONS') return send(res, 204);
  if (limited(ip)) return send(res, 429, { error: 'too_many_requests' });
  const url = new URL(req.url, 'http://x');

  if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { ok: true, players: players.size });
  if (req.method === 'GET' && url.pathname === '/v1/leaderboard') return send(res, 200, board(url.searchParams));

  const del = url.pathname.match(/^\/v1\/score\/(p[a-z0-9]{10,40})$/);
  if (req.method === 'DELETE' && del) {
    players.delete(del[1]);
    scheduleSave();
    return send(res, 200, { ok: true });
  }

  if (req.method === 'POST' && url.pathname === '/v1/score') {
    let body = '';
    req.on('data', (c) => {
      body += c;
      if (body.length > 2048) req.destroy();
    });
    req.on('end', () => {
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch {
        return send(res, 400, { error: 'json' });
      }
      const v = validate(parsed);
      if (typeof v === 'string') return send(res, 400, { error: v });
      players.set(v.id, v);
      scheduleSave();
      send(res, 200, { ok: true });
    });
    return;
  }
  send(res, 404, { error: 'not_found' });
});

server.listen(PORT, () => console.log(`Bolajon reyting serveri: http://localhost:${PORT}  (o'yinchilar: ${players.size})`));
