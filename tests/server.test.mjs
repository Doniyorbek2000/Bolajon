// Reyting serveri testi: vaqtinchalik portda ishga tushiradi va API ni tekshiradi.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const port = 18000 + Math.floor(Math.random() * 1000);
const dir = mkdtempSync(join(tmpdir(), 'bolajon-lb-'));
const srv = spawn(process.execPath, ['server/index.mjs'], { env: { ...process.env, PORT: String(port), DATA_FILE: join(dir, 's.json') }, stdio: 'pipe' });
const base = `http://127.0.0.1:${port}`;
let failed = 0;
const ok = (cond, msg) => {
  console.log(cond ? `✓ ${msg}` : `✗ ${msg}`);
  if (!cond) failed++;
};
const post = (b) => fetch(`${base}/v1/score`, { method: 'POST', body: JSON.stringify(b) });
try {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(`${base}/health`)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  const p = (id, stars, district = 'Urgut') => ({ id, name: 'Aziza Karimova', avatar: '🦁', age: 5, region: 'samarqand', district, stars, tasks: 3, level: 1 });
  ok((await post(p('ptestaaaaaaaaa1', 50))).status === 200, "to'g'ri natija qabul qilinadi");
  ok((await post(p('ptestaaaaaaaaa2', 90, 'Samarqand shahri'))).status === 200, 'ikkinchi o\'yinchi');
  ok((await post({ ...p('ptestaaaaaaaaa3', 1), district: 'Chilonzor' })).status === 400, 'boshqa viloyat tumani rad etiladi');
  ok((await post({ ...p('bad', 1) })).status === 400, "noto'g'ri ID rad etiladi");
  ok((await post({ ...p('ptestaaaaaaaaa4', 1), avatar: '<script>' })).status === 400, "noto'g'ri avatar rad etiladi");
  const country = await (await fetch(`${base}/v1/leaderboard?scope=country&id=ptestaaaaaaaaa1`)).json();
  ok(country.total === 2 && country.top[0].stars === 90 && country.me.rank === 2, "O'zbekiston bo'yicha o'rin");
  ok(country.top.every((e) => e.name === 'Aziza'), 'faqat ismning birinchi so\'zi saqlanadi');
  const dist = await (await fetch(`${base}/v1/leaderboard?scope=district&region=samarqand&district=Urgut&id=ptestaaaaaaaaa1`)).json();
  ok(dist.total === 1 && dist.me.rank === 1, "tuman bo'yicha o'rin");
  ok((await fetch(`${base}/v1/score/ptestaaaaaaaaa1`, { method: 'DELETE' })).status === 200, "o'chirish");
  const after = await (await fetch(`${base}/v1/leaderboard?scope=country`)).json();
  ok(after.total === 1, "o'chirilgandan keyin reytingda yo'q");
} finally {
  srv.kill();
}
if (failed) process.exit(1);
console.log('\nReyting serveri testlari o\'tdi');
