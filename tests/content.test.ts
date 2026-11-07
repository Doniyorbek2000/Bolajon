/**
 * Kontent testlari: vazifalar, o'yinlar, o'zbek yozuvi, hududlar.
 * Ishga tushirish: npm test
 */
import { readFileSync } from 'node:fs';
import { LEVELS_PER_WORLD } from '@/config';
import { GAMES } from '@/data/games';
import { MINI_GAMES } from '@/data/miniGames';
import { REGIONS } from '@/data/regions';
import { taskRound, TOTAL_TASKS, WORLDS } from '@/data/taskGen';
import { translate } from '@/i18n/translate';
import { toNewUzbek } from '@/i18n/uzScript';
import type { Lang } from '@/i18n/langs';

let failed = 0;
const fail = (msg: string) => {
  failed++;
  if (failed <= 20) console.error('  ✗', msg);
};
const check = (name: string, fn: () => void) => {
  const before = failed;
  fn();
  console.log(failed === before ? `✓ ${name}` : `✗ ${name}`);
};

const LANGS: Lang[] = ['uz', 'ru', 'en', 'tr', 'de', 'ar'];
const ctx = (lang: Lang) => ({ t: (k: any, v?: any) => translate(lang, 'new', k, v), lang, script: 'new' as const });
const validRound = (where: string, r: { question: string; answer: string; options: { key: string }[] }) => {
  const keys = r.options.map((o) => o.key);
  if (!r.question || r.question.includes('{')) fail(`${where}: savol matni noto'g'ri: ${r.question}`);
  if (keys.length < 2) fail(`${where}: variantlar kam`);
  if (new Set(keys).size !== keys.length) fail(`${where}: variantlar takrorlangan ${keys}`);
  if (!keys.includes(r.answer)) fail(`${where}: to'g'ri javob variantlarda yo'q (${r.answer} / ${keys})`);
};

check(`vazifalar: ${TOTAL_TASKS} ta × 3 savol × ${LANGS.length} til`, () => {
  if (TOTAL_TASKS < 1000) fail(`vazifalar soni ${TOTAL_TASKS}`);
  for (const lang of LANGS)
    for (const w of WORLDS)
      for (let k = 0; k < LEVELS_PER_WORLD; k++) for (let i = 0; i < 3; i++) validRound(`${lang}/${w.id}/${k}/${i}`, taskRound(w.id, k, i, ctx(lang)));
});

check('vazifalar har safar bir xil (deterministik)', () => {
  for (const w of WORLDS) {
    const a = taskRound(w.id, 33, 1, ctx('uz'));
    const b = taskRound(w.id, 33, 1, ctx('uz'));
    if (a.answer !== b.answer || a.question !== b.question) fail(`${w.id}: deterministik emas`);
  }
});

check(`o'yinlar: jami ${GAMES.length} ta, ${MINI_GAMES.length} ta savol-javob o'yini`, () => {
  if (GAMES.length < 50) fail(`o'yinlar soni ${GAMES.length}`);
  if (new Set(GAMES.map((g) => g.id)).size !== GAMES.length) fail("o'yin id lari takrorlangan");
  for (const lang of LANGS)
    for (const g of MINI_GAMES)
      for (const age of [3, 5, 7]) for (let i = 0; i < 40; i++) validRound(`${lang}/${g.id}/${age}`, g.make({ ...ctx(lang), age }));
});

check("o'zbek yangi alifbosiga o'girish", () => {
  const cases: [string, string][] = [
    ["O'zbekiston", 'Özbekiston'],
    ["G'isht", 'Ğisht'.replace('sh', 'ş')],
    ['Choy', 'Çoy'],
    ['Shahar', 'Şahar'],
    ["ma'no", 'maʼno'],
    ['⟦Sh⟧ va sh', 'Sh va ş'],
    ['tong', 'tong'],
  ];
  for (const [inp, out] of cases) if (toNewUzbek(inp) !== out) fail(`${inp} → ${toNewUzbek(inp)} (kutilgan: ${out})`);
});

check('hududlar: ilova va server ro\'yxati bir xil', () => {
  const server = JSON.parse(readFileSync('server/regions.json', 'utf8')) as Record<string, string[]>;
  if (REGIONS.length !== 14) fail(`hududlar soni ${REGIONS.length}`);
  for (const r of REGIONS) {
    if (JSON.stringify(server[r.id]) !== JSON.stringify(r.districts)) fail(`server/regions.json da ${r.id} farq qiladi`);
    if (new Set(r.districts).size !== r.districts.length) fail(`${r.id}: takroriy tuman`);
  }
});

if (failed) {
  console.error(`\n${failed} ta xato`);
  process.exit(1);
}
console.log('\nBarcha kontent testlari o\'tdi');
