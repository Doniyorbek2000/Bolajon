/**
 * Ilova o'zbek tilida aytadigan barcha doimiy iboralar — ovoz fayllarini yaratish uchun.
 * `say(...)` ga beriladigan matnlar bilan bir xil bo'lishi kerak (kalit: src/audio/key.ts).
 * Bola ismi qatnashgan iboralar kiritilmaydi — ular qurilma ovozi bilan aytiladi.
 */
import { ALPHABETS, numberWord } from '@/data/alphabets';
import { NUMBERS } from '@/data/glyphs';
import { ANIMALS, CATEGORIES, FOOD_PAIRS } from '@/data/items';
import { TOPICS } from '@/data/vocab';
import { translate, uzText } from '@/i18n/translate';
import type { DictKey } from '@/i18n/locales/uz';
import { COLOR_IDS, SHAPE_IDS, shapeQuestion } from '@/i18n/shapes';
import { clipKey } from './key';

export { clipKey, toOldUzbek } from './key';

const T = (k: DictKey, v?: Record<string, string | number>) => translate('uz', 'old', k, v);

export function uzPhrases(): string[] {
  const out: string[] = [];
  const add = (s: string) => s && out.push(s);

  T('praise').split('|').forEach(add);
  T('tryAgain').split('|').forEach(add);
  (['mathQ', 'compareMore', 'compareLess', 'bigQ', 'smallQ', 'simonWatch', 'simonGo', 'simonFail', 'found', 'restSpeak', 'howManySpeak', 'nextSpeak', 'readQ', 'listenQ', 'firstLetterQ', 'oddQ', 'nextQ', 'howMany', 'greet1', 'greet2', 'greet3'] as DictKey[]).forEach((k) => add(T(k)));
  CATEGORIES.forEach((c) => add(T('oddSpeak', { cat: T(c.name) })));

  for (const id of ['uz', 'uzold'] as const) {
    const a = ALPHABETS[id];
    const script = id === 'uz' ? 'new' : 'old';
    for (const l of a.letters) {
      const w = uzText(l.word, script);
      add(`${l.name}. ${w}`);
      add(w);
    }
  }
  NUMBERS.forEach((g) => add(`${g.label}. ${numberWord(Number(g.id), 'uz')}`));
  ANIMALS.forEach((x) => add(`${x.name.uz}. ${x.sound.uz}`));
  SHAPE_IDS.forEach((s) => COLOR_IDS.forEach((c) => add(shapeQuestion('uz', s, c))));
  TOPICS.forEach((t) => t.words.forEach((w) => add(w.uz)));
  FOOD_PAIRS.forEach((p) => {
    const q = T('foodQ', { animal: p.name.uz });
    add(q.charAt(0).toUpperCase() + q.slice(1));
  });
  for (let a = 1; a < 10; a++) for (let b = 1; a + b <= 10; b++) add(T('mathSpeak', { a: numberWord(a, 'uz'), b: numberWord(b, 'uz') }));

  // takrorlarni olib tashlash (kalit bo'yicha)
  const seen = new Set<string>();
  return out.filter((s) => {
    const k = clipKey(s);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
