/**
 * Vazifalar generatori: 12 olam × 90 daraja = 1080 vazifa.
 * Har bir vazifa 3 ta savoldan iborat va urug'li (seeded) tasodif bilan yaratiladi —
 * bir xil vazifa har safar bir xil savollar bilan ochiladi, daraja oshgani sari qiyinlashadi.
 */
import React from 'react';
import { Text, View } from 'react-native';
import { Mascot } from '@/components/Mascot';
import type { QuizRound } from '@/components/QuizGame';
import { Txt } from '@/components/ui';
import { LEVELS_PER_WORLD } from '@/config';
import { uzText } from '@/i18n/translate';
import type { DictKey } from '@/i18n/locales/uz';
import type { Lang, UzScript } from '@/i18n/langs';
import { COLOR_IDS, SHAPE_IDS, shapeQuestion } from '@/i18n/shapes';
import { colors, radius, TintName } from '@/theme';
import { ALPHABETS, numberLabel, numberWord } from './alphabets';
import { CATEGORIES, FOOD_PAIRS } from './items';
import { TOPICS } from './vocab';

export type WorldId = 'count' | 'add' | 'sub' | 'shape' | 'logic' | 'nature' | `lang_${Lang}`;

export type World = { id: WorldId; title: DictKey; emoji: string; tint: TintName; lang?: Lang };

export const WORLDS: World[] = [
  { id: 'count', title: 'w_count', emoji: '🏝️', tint: 'green' },
  { id: 'add', title: 'w_add', emoji: '⛰️', tint: 'orange' },
  { id: 'sub', title: 'w_sub', emoji: '🌊', tint: 'blue' },
  { id: 'shape', title: 'w_shape', emoji: '🌷', tint: 'pink' },
  { id: 'logic', title: 'w_logic', emoji: '🌲', tint: 'teal' },
  { id: 'nature', title: 'w_nature', emoji: '🦒', tint: 'yellow' },
  { id: 'lang_uz', title: 'w_lang', emoji: '🇺🇿', tint: 'green', lang: 'uz' },
  { id: 'lang_en', title: 'w_lang', emoji: '🇬🇧', tint: 'red', lang: 'en' },
  { id: 'lang_ru', title: 'w_lang', emoji: '🇷🇺', tint: 'blue', lang: 'ru' },
  { id: 'lang_tr', title: 'w_lang', emoji: '🇹🇷', tint: 'orange', lang: 'tr' },
  { id: 'lang_de', title: 'w_lang', emoji: '🇩🇪', tint: 'yellow', lang: 'de' },
  { id: 'lang_ar', title: 'w_lang', emoji: '🇸🇦', tint: 'teal', lang: 'ar' },
];

export const TOTAL_TASKS = WORLDS.length * LEVELS_PER_WORLD;
export const taskKey = (w: WorldId, level: number) => `${w}:${level}`;
export const isWorldId = (x: string | undefined): x is WorldId => !!x && WORLDS.some((w) => w.id === x);

/* ---------- urug'li tasodif ---------- */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

type Rng = () => number;
const int = (r: Rng, min: number, max: number) => min + Math.floor(r() * (max - min + 1));
const pickR = <T,>(r: Rng, a: readonly T[]) => a[Math.floor(r() * a.length)];
const shuffleR = <T,>(r: Rng, a: readonly T[]) => {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
};

export type TaskCtx = { t: (k: DictKey, v?: Record<string, string | number>) => string; lang: Lang; script: UzScript };

const emojiText = (e: string, size: number, key?: React.Key, style?: object) => (
  <Text allowFontScaling={false} key={key} style={[{ fontSize: size }, style]}>
    {e}
  </Text>
);

function numberOptions(r: Rng, answer: number, count: number, ctx: TaskCtx, max = 10) {
  const set = new Set([answer]);
  while (set.size < count) set.add(Math.max(0, Math.min(max, answer + int(r, -3, 3))));
  return shuffleR(r, [...set]).map((v) => ({
    key: String(v),
    render: (s: number) => (
      <View style={{ alignItems: 'center' }}>
        <Txt size={s / 1.6} weight="black" color={colors.greenDark}>
          {v}
        </Txt>
        <Txt size={14} color={colors.inkSoft}>
          {numberLabel(v, ctx.lang, ctx.script)}
        </Txt>
      </View>
    ),
  }));
}

const group = (n: number, e: string, size: number, faded = 0) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, maxWidth: size * 5.6 }}>
    {Array.from({ length: n }, (_, i) => (
      <View key={i}>
        {emojiText(e, size, undefined, i >= n - faded ? { opacity: 0.25 } : undefined)}
        {i >= n - faded && (
          <Text allowFontScaling={false} style={{ position: 'absolute', fontSize: size * 0.8, left: size * 0.1, color: colors.red }}>
            ✕
          </Text>
        )}
      </View>
    ))}
  </View>
);

/* ---------- olamlar ---------- */

function countRound(r: Rng, d: number, ctx: TaskCtx): QuizRound {
  const max = 3 + Math.round(d * 7);
  const n = int(r, 1, max);
  const e = pickR(r, pickR(r, CATEGORIES).items);
  return {
    question: ctx.t('howMany'),
    speak: ctx.t('howManySpeak'),
    answer: String(n),
    prompt: (w) => group(n, e, Math.min(58, w / 7)),
    options: numberOptions(r, n, d < 0.4 ? 3 : 4, ctx),
  };
}

function addRound(r: Rng, d: number, ctx: TaskCtx): QuizRound {
  const max = 3 + Math.round(d * 7);
  const a = int(r, 1, max - 1);
  const b = int(r, 1, Math.max(1, max - a));
  const e = pickR(r, CATEGORIES[0].items);
  return {
    question: ctx.t('mathQ'),
    speak: ctx.t('mathSpeak', { a: numberWord(a, ctx.lang), b: numberWord(b, ctx.lang) }),
    answer: String(a + b),
    prompt: (w) => {
      const s = Math.min(40, w / 10);
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {group(a, e, s)}
          <Txt size={40} weight="black" color={colors.orange}>
            +
          </Txt>
          {group(b, e, s)}
        </View>
      );
    },
    options: numberOptions(r, a + b, d < 0.4 ? 3 : 4, ctx),
  };
}

function subRound(r: Rng, d: number, ctx: TaskCtx): QuizRound {
  const max = 3 + Math.round(d * 7);
  const a = int(r, 2, max);
  const b = int(r, 1, a - 1);
  const e = pickR(r, CATEGORIES[1].items);
  return {
    question: ctx.t('subQ'),
    speak: ctx.t('subSpeak', { a: numberWord(a, ctx.lang), b: numberWord(b, ctx.lang) }),
    answer: String(a - b),
    prompt: (w) => (
      <View style={{ alignItems: 'center', gap: 8 }}>
        {group(a, e, Math.min(50, w / 8), b)}
        <Txt size={30} weight="black" color={colors.blueDark}>
          {a} − {b} = ?
        </Txt>
      </View>
    ),
    options: numberOptions(r, a - b, d < 0.4 ? 3 : 4, ctx),
  };
}

const SHAPE_HEX: Record<string, string> = { red: '#FF5A5F', blue: '#3DA9FC', green: '#34C77B', yellow: '#FFC93C', purple: '#8B6CFF' };
function ShapeSvg({ id, color, size }: { id: string; color: string; size: number }) {
  // yengil: emoji o'rniga oddiy View shakllar
  const s = size * 0.8;
  if (id === 'circle') return <View style={{ width: s, height: s, borderRadius: s / 2, backgroundColor: color }} />;
  if (id === 'square') return <View style={{ width: s, height: s, borderRadius: s * 0.12, backgroundColor: color }} />;
  const glyph = { triangle: '▲', star: '★', heart: '♥' }[id] ?? '●';
  return (
    <Text allowFontScaling={false} style={{ fontSize: s * 1.15, lineHeight: s * 1.25, color }}>
      {glyph}
    </Text>
  );
}

function shapeRound(r: Rng, d: number, ctx: TaskCtx): QuizRound {
  const target = { s: pickR(r, SHAPE_IDS), c: pickR(r, COLOR_IDS) };
  const opts = [target];
  const n = d < 0.3 ? 3 : 4;
  while (opts.length < n) {
    // qiyinroq darajalarda — bir xil shakl yoki bir xil rang bilan chalg'itish
    const cand = d > 0.5 && r() < 0.6 ? (r() < 0.5 ? { s: target.s, c: pickR(r, COLOR_IDS) } : { s: pickR(r, SHAPE_IDS), c: target.c }) : { s: pickR(r, SHAPE_IDS), c: pickR(r, COLOR_IDS) };
    if (!opts.some((o) => o.s === cand.s && o.c === cand.c)) opts.push(cand);
  }
  return {
    question: shapeQuestion(ctx.lang, target.s, target.c),
    answer: `${target.s}-${target.c}`,
    prompt: () => <Mascot size={100} mood="happy" />,
    options: shuffleR(r, opts).map((o) => ({ key: `${o.s}-${o.c}`, render: (size) => <ShapeSvg id={o.s} color={SHAPE_HEX[o.c]} size={size} /> })),
  };
}

function logicRound(r: Rng, d: number, ctx: TaskCtx, i: number): QuizRound {
  if ((i + Math.floor(d * 10)) % 2 === 0) {
    const [main, other] = shuffleR(r, CATEGORIES);
    const same = shuffleR(r, main.items).slice(0, 3);
    const odd = pickR(r, other.items);
    return {
      question: ctx.t('oddQ'),
      speak: ctx.t('oddSpeak', { cat: ctx.t(main.name) }),
      answer: odd,
      prompt: () => <Mascot size={100} mood="wink" />,
      options: shuffleR(r, [...same, odd]).map((e) => ({ key: e, render: (s) => emojiText(e, s * 0.85) })),
    };
  }
  const patterns = [[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2], [0, 0, 1, 1], [0, 1, 2, 1]];
  const pat = patterns[Math.min(patterns.length - 1, Math.floor(d * patterns.length))];
  const pool = shuffleR(r, pickR(r, CATEGORIES).items);
  const len = pat.length * 2 + 1;
  const seq = Array.from({ length: len }, (_, k) => pool[pat[k % pat.length]]);
  const answer = seq[len - 1];
  const opts = shuffleR(r, [...new Set([answer, pool[0], pool[1], pool[2], pool[3]])]).slice(0, 3);
  if (!opts.includes(answer)) opts[0] = answer;
  return {
    question: ctx.t('nextQ'),
    speak: ctx.t('nextSpeak'),
    answer,
    prompt: (w) => {
      const size = Math.min(50, (w - 20) / (len + 1) - 6);
      return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          {seq.slice(0, -1).map((e, k) => emojiText(e, size, k))}
          <View style={{ width: size * 1.3, height: size * 1.3, borderRadius: 14, borderWidth: 3, borderStyle: 'dashed', borderColor: colors.orange, alignItems: 'center', justifyContent: 'center' }}>
            <Txt size={size * 0.6} weight="black" color={colors.orange}>
              ?
            </Txt>
          </View>
        </View>
      );
    },
    options: shuffleR(r, opts).map((e) => ({ key: e, render: (s) => emojiText(e, s * 0.85) })),
  };
}

function natureRound(r: Rng, d: number, ctx: TaskCtx, i: number): QuizRound {
  const kind = (i + int(r, 0, 2)) % 3;
  if (kind === 0) {
    const target = pickR(r, FOOD_PAIRS);
    const others = shuffleR(r, FOOD_PAIRS.filter((p) => p !== target)).slice(0, d < 0.3 ? 2 : 3);
    const name = ctx.lang === 'uz' ? uzText(target.name.uz, ctx.script) : target.name[ctx.lang];
    const q = ctx.t('foodQ', { animal: name });
    return {
      question: ctx.lang === 'uz' || ctx.lang === 'tr' ? q.charAt(0).toUpperCase() + q.slice(1) : q,
      answer: target.food,
      prompt: (w) => emojiText(target.animal, Math.min(120, w * 0.3)),
      options: shuffleR(r, [target, ...others]).map((p) => ({ key: p.food, render: (s) => emojiText(p.food, s * 0.8) })),
    };
  }
  if (kind === 1) {
    const big = r() < 0.5;
    const e = pickR(r, pickR(r, CATEGORIES).items);
    const sizes = d < 0.5 ? [0.3, 0.55, 0.95] : [0.45, 0.6, 0.75, 0.95];
    return {
      question: big ? ctx.t('bigQ') : ctx.t('smallQ'),
      answer: big ? String(sizes.length - 1) : '0',
      prompt: () => <Mascot size={100} mood="happy" />,
      options: shuffleR(r, sizes.map((k, idx) => ({ key: String(idx), k }))).map((o) => ({ key: o.key, render: (s) => emojiText(e, s * o.k * 1.1) })),
    };
  }
  const more = r() < 0.5;
  const a = int(r, 1, 8);
  let b = int(r, 1, 8);
  while (Math.abs(a - b) < (d < 0.5 ? 2 : 1)) b = int(r, 1, 8);
  const e = pickR(r, pickR(r, CATEGORIES).items);
  const g = (n: number, s: number) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 2, width: s * 1.05 }}>
      {Array.from({ length: n }, (_, k) => emojiText(e, s / 3.6, k))}
    </View>
  );
  return {
    question: more ? ctx.t('compareMore') : ctx.t('compareLess'),
    answer: (more ? a > b : a < b) ? 'L' : 'R',
    prompt: () => <Mascot size={100} mood={more ? 'wow' : 'happy'} />,
    options: [
      { key: 'L', render: (s) => g(a, s * 1.3) },
      { key: 'R', render: (s) => g(b, s * 1.3) },
    ],
  };
}

function langRound(r: Rng, d: number, ctx: TaskCtx, i: number, lang: Lang, level: number): QuizRound {
  // so'zlar mavzuma-mavzu ochiladi: avval hayvonlar, so'ng mevalar...
  const topicCount = Math.min(TOPICS.length, 1 + Math.floor((level / LEVELS_PER_WORLD) * TOPICS.length));
  const pool = TOPICS.slice(0, topicCount).flatMap((t) => t.words);
  const wordText = (w: (typeof pool)[number]) => (lang === 'uz' ? uzText(w.uz, ctx.script) : w[lang]);
  const kind = (level + i) % 3;

  if (kind === 2) {
    const alpha = ALPHABETS[lang === 'uz' ? (ctx.script === 'new' ? 'uz' : 'uzold') : lang];
    const letters = alpha.letters.filter((l) => !l.inside);
    const upto = Math.max(4, Math.ceil(letters.length * Math.min(1, 0.25 + d)));
    const target = pickR(r, letters.slice(0, upto));
    const others = shuffleR(r, letters.filter((l) => l.id !== target.id)).slice(0, d < 0.4 ? 2 : 3);
    const word = alpha.lang === 'uz' ? uzText(target.word, ctx.script) : target.word;
    const masked = alpha.rtl ? '' : `?${word.slice(target.upper.length)}`;
    return {
      question: ctx.t('firstLetterQ'),
      speak: word,
      speakLang: lang,
      answer: target.id,
      prompt: (w) => (
        <View style={{ backgroundColor: '#fff', borderRadius: radius.xl, padding: 16, alignItems: 'center' }}>
          {emojiText(target.emoji, Math.min(110, w * 0.28))}
          {masked ? (
            <Txt size={32} weight="black" color={colors.purpleDark} center>
              {masked}
            </Txt>
          ) : null}
        </View>
      ),
      options: shuffleR(r, [target, ...others]).map((l) => ({
        key: l.id,
        render: (s) => (
          <Text allowFontScaling={false} style={{ fontSize: s * 0.7, color: colors.purpleDark, fontWeight: '900' }}>
            {l.upper}
          </Text>
        ),
      })),
    };
  }

  const target = pickR(r, pool);
  const others = shuffleR(r, pool.filter((w) => w.id !== target.id)).slice(0, d < 0.3 ? 2 : 3);
  const text = wordText(target);
  const options = shuffleR(r, [target, ...others]).map((w) => ({ key: w.id, render: (s: number) => emojiText(w.e, s * 0.8) }));
  if (kind === 0)
    return {
      question: ctx.t('listenQ'),
      speak: text,
      speakLang: lang,
      answer: target.id,
      prompt: () => (
        <View style={{ width: 130, height: 130, borderRadius: 65, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' }}>
          {emojiText('👂', 64)}
        </View>
      ),
      options,
    };
  return {
    question: ctx.t('readQ'),
    answer: target.id,
    prompt: () => (
      <View style={{ backgroundColor: '#fff', borderRadius: radius.xl, paddingVertical: 18, paddingHorizontal: 24, borderWidth: 4, borderColor: '#E8E1FF' }}>
        <Text allowFontScaling={false} style={{ fontSize: 40, fontWeight: '900', color: colors.purpleDark, textAlign: 'center', writingDirection: lang === 'ar' ? 'rtl' : 'ltr' }}>
          {text}
        </Text>
      </View>
    ),
    options,
  };
}

/** Vazifaning i-savoli */
export function taskRound(world: WorldId, level: number, i: number, ctx: TaskCtx): QuizRound {
  const r = mulberry32(hash(`${world}:${level}:${i}`));
  const d = level / (LEVELS_PER_WORLD - 1);
  switch (world) {
    case 'count':
      return countRound(r, d, ctx);
    case 'add':
      return addRound(r, d, ctx);
    case 'sub':
      return subRound(r, d, ctx);
    case 'shape':
      return shapeRound(r, d, ctx);
    case 'logic':
      return logicRound(r, d, ctx, i);
    case 'nature':
      return natureRound(r, d, ctx, i);
    default:
      return langRound(r, d, ctx, i, world.slice(5) as Lang, level);
  }
}
