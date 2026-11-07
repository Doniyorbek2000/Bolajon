/**
 * Qo'shimcha o'yinlar (36 ta) — umumiy "savol-javob" dvigateli (QuizGame) asosida.
 * Har bir o'yin o'z mexanikasi va mazmuniga ega; nomlari 6 tilda.
 */
import React from 'react';
import { Text, View } from 'react-native';
import { Mascot } from '@/components/Mascot';
import type { QuizRound } from '@/components/QuizGame';
import { Txt } from '@/components/ui';
import { uzText } from '@/i18n/translate';
import type { DictKey } from '@/i18n/locales/uz';
import type { Lang, UzScript } from '@/i18n/langs';
import { colors, TintName } from '@/theme';
import { pick, shuffle } from '@/utils/feedback';
import { ALPHABETS, AlphabetId, numberLabel, numberWord } from './alphabets';
import { ANIMALS, CATEGORIES } from './items';
import { TOPICS } from './vocab';

export type L6 = Record<Lang, string>;
const L = (uz: string, ru: string, en: string, tr: string, de: string, ar: string): L6 => ({ uz, ru, en, tr, de, ar });

export type GameCat = 'math' | 'letters' | 'logic' | 'world' | 'art';
export type MiniCtx = { t: (k: DictKey, v?: Record<string, string | number>) => string; lang: Lang; script: UzScript; age: number };
export type MiniGame = { id: string; cat: GameCat; emoji: string; tint: TintName; free: boolean; minAge: number; title: L6; make: (ctx: MiniCtx) => QuizRound };

const E = (e: string, size: number, key?: React.Key, style?: object) => (
  <Text allowFontScaling={false} key={key} style={[{ fontSize: size }, style]}>
    {e}
  </Text>
);
const emojiOpts = (items: { key: string; e: string }[]) => items.map((o) => ({ key: o.key, render: (s: number) => E(o.e, s * 0.8) }));
const bigNumber = (n: number | string, color: string = colors.greenDark) => (s: number) => (
  <Txt size={s / 1.5} weight="black" color={color}>
    {n}
  </Txt>
);
const rand = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const uniqueNums = (answer: number, count: number, min: number, max: number) => {
  const set = new Set([answer]);
  while (set.size < count) set.add(rand(min, max));
  return shuffle([...set]);
};
const maxN = (ctx: MiniCtx) => (ctx.age <= 3 ? 5 : ctx.age <= 5 ? 10 : 20);
const word = (w: (typeof TOPICS)[number]['words'][number], ctx: MiniCtx) => (ctx.lang === 'uz' ? uzText(w.uz, ctx.script) : w[ctx.lang]);
const uiAlphabet = (ctx: MiniCtx, latinOnly = false): AlphabetId =>
  ctx.lang === 'uz' ? (ctx.script === 'new' ? 'uz' : 'uzold') : latinOnly && ctx.lang === 'ar' ? 'en' : (ctx.lang as AlphabetId);

/* ---------- mavzu bo'yicha "top" o'yinlari ---------- */

function topicGame(topicId: string): MiniGame['make'] {
  return (ctx) => {
    const topic = TOPICS.find((t) => t.id === topicId)!;
    const target = pick(topic.words);
    const others = shuffle(topic.words.filter((w) => w.id !== target.id)).slice(0, ctx.age <= 3 ? 2 : 3);
    const x = word(target, ctx);
    return {
      question: ctx.t('whichQ', { x }),
      answer: target.id,
      prompt: () => <Mascot size={100} mood="happy" />,
      options: emojiOpts(shuffle([target, ...others]).map((w) => ({ key: w.id, e: w.e }))),
    };
  };
}

/* ---------- juftlik ("mos keladi") o'yinlari ---------- */

function matchGame(pairs: [string, string][], q: DictKey = 'matchQ'): MiniGame['make'] {
  return (ctx) => {
    const [a, b] = pick(pairs);
    // chalg'ituvchi javoblar boshqa juftliklardan (bir xil kalitli juftliklar chiqarib tashlanadi)
    const others = [...new Set(shuffle(pairs.filter((p) => p[0] !== a)).map((p) => p[1]))].slice(0, 3);
    return {
      question: ctx.t(q),
      answer: b,
      prompt: (w) => E(a, Math.min(120, w * 0.3)),
      options: emojiOpts(shuffle([b, ...others]).map((e) => ({ key: e, e }))),
    };
  };
}

/* ---------- ikki variantli qarama-qarshiliklar ---------- */

function oppositeGame(pairs: [string, string][], qA: DictKey, qB: DictKey): MiniGame['make'] {
  return (ctx) => {
    const [a, b] = pick(pairs);
    const askA = Math.random() < 0.5;
    return {
      question: ctx.t(askA ? qA : qB),
      answer: askA ? a : b,
      prompt: () => <Mascot size={100} mood="wow" />,
      options: emojiOpts(shuffle([a, b]).map((e) => ({ key: e, e }))),
    };
  };
}

const SHAPES = [
  { g: '▲', c: colors.yellow },
  { g: '●', c: colors.red },
  { g: '■', c: colors.blue },
  { g: '★', c: colors.purple },
  { g: '♥', c: colors.pink },
];

const DIRS: Record<Lang, string[]> = {
  uz: ['Chapga qaragan', "O'ngga qaragan", 'Tepaga qaragan', 'Pastga qaragan'],
  ru: ['влево', 'вправо', 'вверх', 'вниз'],
  en: ['left', 'right', 'up', 'down'],
  tr: ['Sola', 'Sağa', 'Yukarı', 'Aşağı'],
  de: ['links', 'rechts', 'oben', 'unten'],
  ar: ['اليسار', 'اليمين', 'الأعلى', 'الأسفل'],
};
const FEELINGS: { e: string; n: L6 }[] = [
  { e: '😀', n: L('Quvnoq', 'весёлое', 'happy', 'Mutlu', 'fröhliche', 'السعيد') },
  { e: '😢', n: L('Xafa', 'грустное', 'sad', 'Üzgün', 'traurige', 'الحزين') },
  { e: '😠', n: L('Jahldor', 'сердитое', 'angry', 'Kızgın', 'wütende', 'الغاضب') },
  { e: '😴', n: L('Uyquchi', 'сонное', 'sleepy', 'Uykulu', 'müde', 'النعسان') },
  { e: '😲', n: L('Hayron', 'удивлённое', 'surprised', 'Şaşkın', 'überraschte', 'المندهش') },
];

/* ---------- o'yinlar ---------- */

export const MINI_GAMES: MiniGame[] = [
  // ===== Matematika =====
  {
    id: 'findnum', cat: 'math', emoji: '🔟', tint: 'blue', free: true, minAge: 3,
    title: L('Raqamni top', 'Найди цифру', 'Find the number', 'Rakamı bul', 'Finde die Zahl', 'ابحث عن الرقم'),
    make: (ctx) => {
      const n = rand(0, Math.min(10, maxN(ctx)));
      return {
        question: ctx.t('numQ', { n }),
        speak: ctx.t('numQ', { n: numberWord(n, ctx.lang) }),
        answer: String(n),
        prompt: () => <Mascot size={100} mood="happy" />,
        options: uniqueNums(n, 4, 0, Math.min(10, maxN(ctx))).map((v) => ({ key: String(v), render: bigNumber(v, colors.blueDark) })),
      };
    },
  },
  {
    id: 'bigger', cat: 'math', emoji: '🔼', tint: 'green', free: false, minAge: 4,
    title: L('Qaysi son katta?', 'Какое число больше?', 'Bigger number', 'Büyük sayı', 'Größere Zahl', 'العدد الأكبر'),
    make: (ctx) => {
      const [a, b] = uniqueNums(rand(0, maxN(ctx)), 2, 0, maxN(ctx));
      return { question: ctx.t('biggerQ'), answer: String(Math.max(a, b)), prompt: () => <Mascot size={100} mood="wow" />, options: [a, b].map((v) => ({ key: String(v), render: bigNumber(v) })) };
    },
  },
  {
    id: 'smaller', cat: 'math', emoji: '🔽', tint: 'teal', free: false, minAge: 4,
    title: L('Qaysi son kichik?', 'Какое число меньше?', 'Smaller number', 'Küçük sayı', 'Kleinere Zahl', 'العدد الأصغر'),
    make: (ctx) => {
      const [a, b] = uniqueNums(rand(0, maxN(ctx)), 2, 0, maxN(ctx));
      return { question: ctx.t('smallerQ'), answer: String(Math.min(a, b)), prompt: () => <Mascot size={100} mood="happy" />, options: [a, b].map((v) => ({ key: String(v), render: bigNumber(v, colors.tealDark) })) };
    },
  },
  {
    id: 'after', cat: 'math', emoji: '➡️', tint: 'orange', free: false, minAge: 4,
    title: L('Keyingi son', 'Следующее число', 'Next number', 'Sonraki sayı', 'Nächste Zahl', 'العدد التالي'),
    make: (ctx) => {
      const n = rand(0, maxN(ctx) - 1);
      return {
        question: ctx.t('afterQ', { n }),
        speak: ctx.t('afterQ', { n: numberWord(n, ctx.lang) }),
        answer: String(n + 1),
        prompt: () => <Txt size={70} weight="black" color={colors.orange}>{`${n} → ?`}</Txt>,
        options: uniqueNums(n + 1, 3, Math.max(0, n - 2), n + 3).map((v) => ({ key: String(v), render: bigNumber(v, colors.orangeDark) })),
      };
    },
  },
  {
    id: 'before', cat: 'math', emoji: '⬅️', tint: 'purple', free: false, minAge: 4,
    title: L('Oldingi son', 'Предыдущее число', 'Number before', 'Önceki sayı', 'Zahl davor', 'العدد السابق'),
    make: (ctx) => {
      const n = rand(1, maxN(ctx));
      return {
        question: ctx.t('beforeQ', { n }),
        speak: ctx.t('beforeQ', { n: numberWord(n, ctx.lang) }),
        answer: String(n - 1),
        prompt: () => <Txt size={70} weight="black" color={colors.purple}>{`? ← ${n}`}</Txt>,
        options: uniqueNums(n - 1, 3, Math.max(0, n - 4), n + 1).map((v) => ({ key: String(v), render: bigNumber(v, colors.purpleDark) })),
      };
    },
  },
  {
    id: 'subtract', cat: 'math', emoji: '➖', tint: 'red', free: false, minAge: 5,
    title: L('Ayiramiz', 'Вычитаем', 'Take away', 'Çıkarma', 'Minusrechnen', 'نطرح'),
    make: (ctx) => {
      const a = rand(2, Math.min(10, maxN(ctx)));
      const b = rand(1, a - 1);
      const e = pick(CATEGORIES[0].items);
      return {
        question: ctx.t('subQ'),
        speak: ctx.t('subSpeak', { a: numberWord(a, ctx.lang), b: numberWord(b, ctx.lang) }),
        answer: String(a - b),
        prompt: (w) => (
          <View style={{ alignItems: 'center', gap: 8 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4, maxWidth: w * 0.9 }}>
              {Array.from({ length: a }, (_, i) => E(e, Math.min(46, w / 8), i, i >= a - b ? { opacity: 0.2 } : undefined))}
            </View>
            <Txt size={30} weight="black" color={colors.redDark}>{`${a} − ${b} = ?`}</Txt>
          </View>
        ),
        options: uniqueNums(a - b, 3, 0, 10).map((v) => ({ key: String(v), render: bigNumber(v) })),
      };
    },
  },
  {
    id: 'countmix', cat: 'math', emoji: '🧺', tint: 'yellow', free: false, minAge: 4,
    title: L('Aralash sanoq', 'Посчитай нужные', 'Count the right ones', 'Doğru olanları say', 'Zähl die richtigen', 'عدّ الصحيح'),
    make: (ctx) => {
      const [a, b, c] = shuffle(CATEGORIES[0].items).slice(0, 3);
      const n = rand(1, ctx.age <= 4 ? 5 : 8);
      const items = shuffle([...Array(n).fill(a), ...Array(rand(1, 4)).fill(b), ...Array(rand(1, 3)).fill(c)]);
      return {
        question: ctx.t('countMixQ', { e: a }),
        speak: ctx.t('howManySpeak'),
        answer: String(n),
        prompt: (w) => <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, maxWidth: w }}>{items.map((e, i) => E(e, Math.min(44, w / 8), i))}</View>,
        options: uniqueNums(n, 3, 1, 10).map((v) => ({ key: String(v), render: bigNumber(v) })),
      };
    },
  },
  {
    id: 'countshape', cat: 'math', emoji: '🔺', tint: 'pink', free: false, minAge: 4,
    title: L('Shakllarni sana', 'Посчитай фигуры', 'Count the shapes', 'Şekilleri say', 'Formen zählen', 'عدّ الأشكال'),
    make: (ctx) => {
      const [target, ...rest] = shuffle(SHAPES);
      const n = rand(1, 7);
      const items = shuffle([...Array(n).fill(target), ...Array(rand(2, 5)).fill(0).map(() => pick(rest))]);
      return {
        question: ctx.t('countMixQ', { e: target.g }),
        speak: ctx.t('howManySpeak'),
        answer: String(n),
        prompt: (w) => (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, maxWidth: w }}>
            {items.map((s, i) => (
              <Text allowFontScaling={false} key={i} style={{ fontSize: Math.min(46, w / 8), color: s.c }}>
                {s.g}
              </Text>
            ))}
          </View>
        ),
        options: uniqueNums(n, 3, 1, 10).map((v) => ({ key: String(v), render: bigNumber(v) })),
      };
    },
  },
  {
    id: 'numcount', cat: 'math', emoji: '🎯', tint: 'blue', free: false, minAge: 3,
    title: L('Raqam va miqdor', 'Число и количество', 'Number and amount', 'Sayı ve miktar', 'Zahl und Menge', 'العدد والكمية'),
    make: (ctx) => {
      const n = rand(1, ctx.age <= 3 ? 4 : 7);
      const e = pick(CATEGORIES[1].items);
      return {
        question: ctx.t('numToCountQ', { n }),
        speak: ctx.t('numToCountQ', { n: numberWord(n, ctx.lang) }),
        answer: String(n),
        prompt: () => <Txt size={90} weight="black" color={colors.blueDark}>{String(n)}</Txt>,
        options: uniqueNums(n, 3, 1, 8).map((v) => ({
          key: String(v),
          render: (s: number) => <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: s * 1.35, gap: 2 }}>{Array.from({ length: v }, (_, i) => E(e, v <= 4 ? s / 2.6 : s / 3.3, i))}</View>,
        })),
      };
    },
  },

  // ===== Harflar =====
  {
    id: 'findletter', cat: 'letters', emoji: '🅰️', tint: 'pink', free: true, minAge: 3,
    title: L('Harfni top', 'Найди букву', 'Find the letter', 'Harfi bul', 'Finde den Buchstaben', 'ابحث عن الحرف'),
    make: (ctx) => {
      const a = ALPHABETS[uiAlphabet(ctx)];
      const target = pick(a.letters);
      const others = shuffle(a.letters.filter((l) => l.id !== target.id)).slice(0, 3);
      return {
        question: ctx.t('letterQ', { x: target.upper }),
        speak: ctx.t('letterQ', { x: target.name }),
        answer: target.id,
        prompt: () => <Mascot size={100} mood="happy" />,
        options: shuffle([target, ...others]).map((l) => ({ key: l.id, render: bigNumber(l.upper, colors.pinkDark) })),
      };
    },
  },
  {
    id: 'lowercase', cat: 'letters', emoji: '🔡', tint: 'purple', free: false, minAge: 4,
    title: L('Katta va kichik harf', 'Большая и маленькая', 'Big and small letters', 'Büyük ve küçük harf', 'Groß und klein', 'الحروف الكبيرة والصغيرة'),
    make: (ctx) => {
      const a = ALPHABETS[uiAlphabet(ctx, true)];
      const pool = a.letters.filter((l) => l.lower !== l.upper);
      const target = pick(pool);
      const others = shuffle(pool.filter((l) => l.id !== target.id)).slice(0, 3);
      return {
        question: ctx.t('lowerQ', { x: target.upper }),
        speak: ctx.t('lowerQ', { x: target.name }),
        answer: target.id,
        prompt: () => <Txt size={96} weight="black" color={colors.purple}>{target.upper}</Txt>,
        options: shuffle([target, ...others]).map((l) => ({ key: l.id, render: bigNumber(l.lower, colors.purpleDark) })),
      };
    },
  },
  {
    id: 'letterpic', cat: 'letters', emoji: '🖼️', tint: 'orange', free: false, minAge: 4,
    title: L('Harf va rasm', 'Буква и картинка', 'Letter and picture', 'Harf ve resim', 'Buchstabe und Bild', 'الحرف والصورة'),
    make: (ctx) => {
      const a = ALPHABETS[uiAlphabet(ctx)];
      const pool = a.letters.filter((l) => !l.inside);
      const target = pick(pool);
      const others = shuffle(pool.filter((l) => l.id !== target.id && l.emoji !== target.emoji)).slice(0, 2);
      return {
        question: ctx.t('letterPicQ', { x: target.upper }),
        speak: ctx.t('letterPicQ', { x: target.name }),
        answer: target.id,
        prompt: () => <Txt size={96} weight="black" color={colors.orange}>{target.upper}</Txt>,
        options: emojiOpts(shuffle([target, ...others]).map((l) => ({ key: l.id, e: l.emoji }))),
      };
    },
  },
  {
    id: 'firstletter', cat: 'letters', emoji: '🔤', tint: 'blue', free: false, minAge: 4,
    title: L('Birinchi harf', 'Первая буква', 'First letter', 'İlk harf', 'Erster Buchstabe', 'الحرف الأول'),
    make: (ctx) => {
      const a = ALPHABETS[uiAlphabet(ctx)];
      const pool = a.letters.filter((l) => !l.inside);
      const target = pick(pool);
      const others = shuffle(pool.filter((l) => l.id !== target.id)).slice(0, 2);
      const w = a.lang === 'uz' ? uzText(target.word, ctx.script) : target.word;
      return {
        question: ctx.t('firstLetterQ'),
        speak: w,
        speakLang: a.lang,
        answer: target.id,
        prompt: (sz) => E(target.emoji, Math.min(120, sz * 0.3)),
        options: shuffle([target, ...others]).map((l) => ({ key: l.id, render: bigNumber(l.upper, colors.blueDark) })),
      };
    },
  },

  // ===== Mantiq =====
  {
    id: 'arrows', cat: 'logic', emoji: '🧭', tint: 'teal', free: true, minAge: 4,
    title: L("Yo'nalishlar", 'Направления', 'Directions', 'Yönler', 'Richtungen', 'الاتجاهات'),
    make: (ctx) => {
      const ar = ['⬅️', '➡️', '⬆️', '⬇️'];
      const i = rand(0, 3);
      const dir = ctx.lang === 'uz' ? uzText(DIRS.uz[i], ctx.script) : DIRS[ctx.lang][i];
      return { question: ctx.t('arrowQ', { dir }), answer: ar[i], prompt: () => <Mascot size={100} mood="happy" />, options: emojiOpts(shuffle(ar).map((e) => ({ key: e, e }))) };
    },
  },
  {
    id: 'different', cat: 'logic', emoji: '🔍', tint: 'purple', free: false, minAge: 3,
    title: L('Boshqachasini top', 'Найди отличие', 'Spot the difference', 'Farklıyı bul', 'Finde den Unterschied', 'اكتشف المختلف'),
    make: (ctx) => {
      const e = pick(['🦆', '🐌', '🚗', '🐟', '🦒', '🐘', '🚲', '🦕', '🐢', '🦜']);
      const n = ctx.age <= 4 ? 4 : 6;
      const odd = rand(0, n - 1);
      return {
        question: ctx.t('differentQ'),
        answer: String(odd),
        prompt: () => <Mascot size={90} mood="wink" />,
        options: Array.from({ length: n }, (_, i) => ({ key: String(i), render: (s: number) => E(e, s * 0.75, undefined, i === odd ? { transform: [{ scaleX: -1 }] } : undefined) })),
      };
    },
  },
  {
    id: 'long', cat: 'logic', emoji: '📏', tint: 'orange', free: false, minAge: 3,
    title: L('Uzun va qisqa', 'Длинный и короткий', 'Long and short', 'Uzun ve kısa', 'Lang und kurz', 'طويل وقصير'),
    make: (ctx) => {
      const lens = shuffle([0.3, 0.5, 0.7, 0.95]);
      const long = Math.random() < 0.5;
      const target = long ? 0.95 : 0.3;
      const color = pick([colors.orange, colors.blue, colors.green, colors.pink]);
      return {
        question: ctx.t(long ? 'longQ' : 'shortQ'),
        answer: String(target),
        prompt: () => <Mascot size={90} mood="happy" />,
        options: lens.map((k) => ({ key: String(k), render: (s: number) => <View style={{ width: s * 1.2 * k, height: s * 0.22, borderRadius: s * 0.11, backgroundColor: color }} /> })),
      };
    },
  },
  {
    id: 'tower', cat: 'logic', emoji: '🏗️', tint: 'blue', free: false, minAge: 3,
    title: L('Baland minora', 'Высокая башня', 'Tall tower', 'Yüksek kule', 'Hoher Turm', 'البرج العالي'),
    make: (ctx) => {
      const hs = uniqueNums(rand(1, 6), 3, 1, 6);
      const max = Math.max(...hs);
      return {
        question: ctx.t('tallQ'),
        answer: String(max),
        prompt: () => <Mascot size={90} mood="wow" />,
        options: hs.map((h) => ({
          key: String(h),
          render: (s: number) => (
            <View style={{ gap: 2, alignItems: 'center', justifyContent: 'flex-end', height: s * 1.05 }}>
              {Array.from({ length: h }, (_, i) => (
                <View key={i} style={{ width: s * 0.7, height: s * 0.15, borderRadius: 5, backgroundColor: [colors.red, colors.yellow, colors.blue, colors.green, colors.purple, colors.orange][i] }} />
              ))}
            </View>
          ),
        })),
      };
    },
  },
  {
    id: 'heavy', cat: 'logic', emoji: '🏋️', tint: 'red', free: false, minAge: 3,
    title: L("Og'ir va yengil", 'Тяжёлый и лёгкий', 'Heavy and light', 'Ağır ve hafif', 'Schwer und leicht', 'ثقيل وخفيف'),
    make: oppositeGame([['🐘', '🪶'], ['🚚', '🎈'], ['🪨', '🍃'], ['🏠', '📄'], ['🐋', '🐟'], ['🎹', '✏️']], 'heavyQ', 'lightQ'),
  },
  {
    id: 'hotcold', cat: 'logic', emoji: '🌡️', tint: 'orange', free: false, minAge: 3,
    title: L('Issiq va sovuq', 'Горячий и холодный', 'Hot and cold', 'Sıcak ve soğuk', 'Heiß und kalt', 'ساخن وبارد'),
    make: oppositeGame([['🔥', '🧊'], ['☕', '🍦'], ['☀️', '❄️'], ['🍲', '🥶'], ['🌋', '⛄']], 'hotQ', 'coldQ'),
  },
  {
    id: 'fastslow', cat: 'logic', emoji: '🏎️', tint: 'green', free: false, minAge: 3,
    title: L('Tez va sekin', 'Быстрый и медленный', 'Fast and slow', 'Hızlı ve yavaş', 'Schnell und langsam', 'سريع وبطيء'),
    make: oppositeGame([['🚀', '🐢'], ['🐆', '🐌'], ['✈️', '🚲'], ['🏎️', '🚜'], ['🐎', '🐛']], 'fastQ', 'slowQ'),
  },
  {
    id: 'mixcolor', cat: 'logic', emoji: '🧪', tint: 'purple', free: false, minAge: 5,
    title: L('Ranglarni aralashtir', 'Смешай цвета', 'Mix the colors', 'Renkleri karıştır', 'Farben mischen', 'امزج الألوان'),
    make: (ctx) => {
      const mixes: [string, string, string][] = [['🔴', '🟡', '🟠'], ['🔵', '🟡', '🟢'], ['🔴', '🔵', '🟣'], ['🔴', '⚪', '🩷']];
      const [a, b, c] = pick(mixes.slice(0, 3));
      const opts = shuffle(['🟠', '🟢', '🟣', '🟤'].filter((x) => x !== c)).slice(0, 2);
      return {
        question: ctx.t('mixQ'),
        answer: c,
        prompt: () => <Txt size={64}>{`${a} + ${b} = ?`}</Txt>,
        options: emojiOpts(shuffle([c, ...opts]).map((e) => ({ key: e, e }))),
      };
    },
  },

  // ===== Atrofimizdagi dunyo =====
  { id: 'fruits', cat: 'world', emoji: '🍉', tint: 'red', free: true, minAge: 2, title: L('Mevalar', 'Фрукты', 'Fruits', 'Meyveler', 'Obst', 'الفواكه'), make: topicGame('fruits') },
  { id: 'findanimal', cat: 'world', emoji: '🐼', tint: 'green', free: false, minAge: 2, title: L('Hayvonni top', 'Найди животное', 'Find the animal', 'Hayvanı bul', 'Finde das Tier', 'ابحث عن الحيوان'), make: topicGame('animals') },
  { id: 'vehicles', cat: 'world', emoji: '🚌', tint: 'blue', free: false, minAge: 2, title: L('Transport', 'Транспорт', 'Vehicles', 'Taşıtlar', 'Fahrzeuge', 'وسائل النقل'), make: topicGame('transport') },
  { id: 'body', cat: 'world', emoji: '👃', tint: 'pink', free: false, minAge: 3, title: L("Tana a'zolari", 'Части тела', 'My body', 'Vücudum', 'Mein Körper', 'جسمي'), make: topicGame('body') },
  { id: 'family', cat: 'world', emoji: '👪', tint: 'yellow', free: false, minAge: 3, title: L('Oila', 'Семья', 'Family', 'Aile', 'Familie', 'العائلة'), make: topicGame('family') },
  { id: 'colors', cat: 'world', emoji: '🌈', tint: 'purple', free: true, minAge: 2, title: L('Ranglar', 'Цвета', 'Colors', 'Renkler', 'Farben', 'الألوان'), make: topicGame('colors') },
  {
    id: 'sounds', cat: 'world', emoji: '🔊', tint: 'orange', free: false, minAge: 2,
    title: L('Kim shunday deydi?', 'Кто так говорит?', 'Who says this?', 'Kim böyle der?', 'Wer macht so?', 'من يقول هكذا؟'),
    make: (ctx) => {
      const target = pick(ANIMALS);
      const others = shuffle(ANIMALS.filter((a) => a !== target)).slice(0, 3);
      const sound = ctx.lang === 'uz' ? uzText(target.sound.uz, ctx.script) : target.sound[ctx.lang];
      return {
        question: ctx.t('soundQ'),
        speak: `${ctx.t('soundQ')} ${sound}`,
        answer: target.emoji,
        prompt: () => <Txt size={34} weight="black" color={colors.orangeDark} center>{`«${sound}»`}</Txt>,
        options: emojiOpts(shuffle([target, ...others]).map((a) => ({ key: a.emoji, e: a.emoji }))),
      };
    },
  },
  {
    id: 'homes', cat: 'world', emoji: '🏡', tint: 'teal', free: false, minAge: 3,
    title: L('Kim qayerda yashaydi?', 'Кто где живёт?', 'Who lives where?', 'Kim nerede yaşar?', 'Wer wohnt wo?', 'من يعيش أين؟'),
    make: matchGame([['🐟', '🌊'], ['🐦', '🌳'], ['🐪', '🏜️'], ['🐧', '🧊'], ['🐒', '🌴'], ['🐄', '🏡'], ['🐻', '🏔️'], ['🐝', '🌸']], 'homeQ'),
  },
  {
    id: 'seasons', cat: 'world', emoji: '🍂', tint: 'yellow', free: false, minAge: 4,
    title: L('Fasllar', 'Времена года', 'Seasons', 'Mevsimler', 'Jahreszeiten', 'الفصول'),
    make: matchGame([['❄️', '⛄'], ['❄️', '🧤'], ['☀️', '🏖️'], ['☀️', '🍉'], ['🍂', '🍄'], ['🍂', '☂️'], ['🌸', '🌷'], ['🌸', '🐣']]),
  },
  {
    id: 'jobs', cat: 'world', emoji: '👩‍🚒', tint: 'red', free: false, minAge: 4,
    title: L('Kasblar', 'Профессии', 'Jobs', 'Meslekler', 'Berufe', 'المهن'),
    make: matchGame([['🧑‍🚒', '🚒'], ['🧑‍🍳', '🍳'], ['🧑‍⚕️', '💉'], ['👮', '🚓'], ['🧑‍🏫', '📚'], ['🧑‍🌾', '🚜'], ['🧑‍🚀', '🚀'], ['🧑‍🎨', '🎨']]),
  },
  {
    id: 'pairs', cat: 'world', emoji: '🧦', tint: 'blue', free: false, minAge: 3,
    title: L('Juftini top', 'Найди пару', 'What goes together?', 'Eşini bul', 'Was gehört zusammen?', 'ما الذي يتماشى معًا؟'),
    make: matchGame([['🥛', '🍪'], ['🪥', '🦷'], ['⚽', '🥅'], ['🎣', '🐟'], ['✉️', '📮'], ['🔑', '🚪'], ['🎂', '🕯️'], ['🍝', '🍴'], ['☔', '☂️'], ['✏️', '📝']]),
  },
  {
    id: 'feelings', cat: 'world', emoji: '😊', tint: 'pink', free: false, minAge: 3,
    title: L("His-tuyg'ular", 'Эмоции', 'Feelings', 'Duygular', 'Gefühle', 'المشاعر'),
    make: (ctx) => {
      const target = pick(FEELINGS);
      const others = shuffle(FEELINGS.filter((f) => f !== target)).slice(0, 3);
      const f = ctx.lang === 'uz' ? uzText(target.n.uz, ctx.script) : target.n[ctx.lang];
      return { question: ctx.t('feelQ', { f }), answer: target.e, prompt: () => <Mascot size={100} mood="happy" />, options: emojiOpts(shuffle([target, ...others]).map((x) => ({ key: x.e, e: x.e }))) };
    },
  },
];

export const findMiniGame = (id: string | undefined) => MINI_GAMES.find((g) => g.id === id);
