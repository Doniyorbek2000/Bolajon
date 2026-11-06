import type { Lang, UzScript } from '@/i18n/langs';
import { uzText } from '@/i18n/translate';
import { STROKES, Stroke } from './glyphs';
import { TOPICS } from './vocab';

export type AlphabetId = 'uz' | 'uzold' | 'en' | 'ru' | 'tr' | 'de' | 'ar';

export type Letter = {
  id: string;
  upper: string;
  lower: string;
  /** Ovozli o'qish uchun harf nomi */
  name: string;
  word: string;
  emoji: string;
  /** So'z bu harf bilan boshlanmaydi (masalan, ß, Ъ, Ğ) */
  inside?: boolean;
  strokes?: Stroke[];
};

export type Alphabet = { id: AlphabetId; lang: Lang; rtl?: boolean; letters: Letter[] };

type Row = [upper: string, lower: string, name: string, word: string, emoji: string, inside?: boolean];

const make = (id: AlphabetId, lang: Lang, rows: Row[], rtl = false): Alphabet => ({
  id,
  lang,
  rtl,
  letters: rows.map(([upper, lower, name, word, emoji, inside]) => ({
    id: upper,
    upper,
    lower,
    name,
    word,
    emoji,
    inside,
    strokes: STROKES[upper],
  })),
});

/** O'zbekcha umumiy qism (amaldagi yozuvda; yangi alifboda avtomatik o'giriladi) */
const UZ_COMMON: Row[] = [
  ['A', 'a', 'a', 'Ari', '🐝'],
  ['B', 'b', 'be', 'Baliq', '🐟'],
  ['D', 'd', 'de', 'Daraxt', '🌳'],
  ['E', 'e', 'e', 'Echki', '🐐'],
  ['F', 'f', 'ef', 'Fil', '🐘'],
  ['G', 'g', 'ge', 'Gul', '🌸'],
  ['H', 'h', 'ha', 'Handalak', '🍈'],
  ['I', 'i', 'i', 'It', '🐕'],
  ['J', 'j', 'je', "Jo'ja", '🐥'],
  ['K', 'k', 'ke', 'Kitob', '📚'],
  ['L', 'l', 'el', 'Limon', '🍋'],
  ['M', 'm', 'em', 'Mushuk', '🐱'],
  ['N', 'n', 'en', 'Non', '🍞'],
  ['O', 'o', 'o', 'Olma', '🍎'],
  ['P', 'p', 'pe', 'Poyezd', '🚂'],
  ['Q', 'q', 'qe', 'Quyosh', '☀️'],
  ['R', 'r', 'er', 'Raketa', '🚀'],
  ['S', 's', 'es', 'Sabzi', '🥕'],
  ['T', 't', 'te', 'Tuxum', '🥚'],
  ['U', 'u', 'u', 'Uy', '🏠'],
  ['V', 'v', 've', 'Velosiped', '🚲'],
  ['X', 'x', 'xe', "Xo'roz", '🐓'],
  ['Y', 'y', 'ye', 'Yulduz', '⭐'],
  ['Z', 'z', 'ze', 'Zebra', '🦓'],
];

export const ALPHABETS: Record<AlphabetId, Alphabet> = {
  // Yangi o'zbek alifbosi: 28 harf + tutuq belgisi (ʼ)
  uz: make('uz', 'uz', [
    ...UZ_COMMON,
    ['Ö', 'ö', 'ö', "O'rdak", '🦆'],
    ['Ğ', 'ğ', 'ğe', "G'isht", '🧱'],
    ['Ş', 'ş', 'şe', 'Sher', '🦁'],
    ['Ç', 'ç', 'çe', 'Chumoli', '🐜'],
  ]),
  // Amaldagi o'zbek lotin alifbosi
  uzold: make('uzold', 'uz', [
    ...UZ_COMMON,
    ["O'", "o'", "o'", "O'rdak", '🦆'],
    ["G'", "g'", "g'e", "G'isht", '🧱'],
    ['Sh', 'sh', 'she', 'Sher', '🦁'],
    ['Ch', 'ch', 'che', 'Chumoli', '🐜'],
    ['Ng', 'ng', 'nge', 'Tong', '🌅', true],
  ]),
  en: make('en', 'en', [
    ['A', 'a', 'A', 'Apple', '🍎'],
    ['B', 'b', 'B', 'Ball', '⚽'],
    ['C', 'c', 'C', 'Cat', '🐱'],
    ['D', 'd', 'D', 'Dog', '🐶'],
    ['E', 'e', 'E', 'Egg', '🥚'],
    ['F', 'f', 'F', 'Fish', '🐟'],
    ['G', 'g', 'G', 'Grapes', '🍇'],
    ['H', 'h', 'H', 'Hat', '🎩'],
    ['I', 'i', 'I', 'Ice cream', '🍦'],
    ['J', 'j', 'J', 'Juice', '🧃'],
    ['K', 'k', 'K', 'Kite', '🪁'],
    ['L', 'l', 'L', 'Lion', '🦁'],
    ['M', 'm', 'M', 'Moon', '🌙'],
    ['N', 'n', 'N', 'Nose', '👃'],
    ['O', 'o', 'O', 'Orange', '🍊'],
    ['P', 'p', 'P', 'Pig', '🐷'],
    ['Q', 'q', 'Q', 'Queen', '👸'],
    ['R', 'r', 'R', 'Rabbit', '🐰'],
    ['S', 's', 'S', 'Sun', '☀️'],
    ['T', 't', 'T', 'Tree', '🌳'],
    ['U', 'u', 'U', 'Umbrella', '☂️'],
    ['V', 'v', 'V', 'Van', '🚐'],
    ['W', 'w', 'W', 'Whale', '🐳'],
    ['X', 'x', 'X', 'Fox', '🦊', true],
    ['Y', 'y', 'Y', 'Yo-yo', '🪀'],
    ['Z', 'z', 'Z', 'Zebra', '🦓'],
  ]),
  ru: make('ru', 'ru', [
    ['А', 'а', 'а', 'Арбуз', '🍉'],
    ['Б', 'б', 'бэ', 'Банан', '🍌'],
    ['В', 'в', 'вэ', 'Волк', '🐺'],
    ['Г', 'г', 'гэ', 'Гриб', '🍄'],
    ['Д', 'д', 'дэ', 'Дом', '🏠'],
    ['Е', 'е', 'е', 'Ель', '🌲'],
    ['Ё', 'ё', 'ё', 'Ёжик', '🦔'],
    ['Ж', 'ж', 'жэ', 'Жираф', '🦒'],
    ['З', 'з', 'зэ', 'Заяц', '🐰'],
    ['И', 'и', 'и', 'Индюк', '🦃'],
    ['Й', 'й', 'и краткое', 'Йогурт', '🥛'],
    ['К', 'к', 'ка', 'Кот', '🐱'],
    ['Л', 'л', 'эль', 'Лев', '🦁'],
    ['М', 'м', 'эм', 'Мяч', '⚽'],
    ['Н', 'н', 'эн', 'Нос', '👃'],
    ['О', 'о', 'о', 'Облако', '☁️'],
    ['П', 'п', 'пэ', 'Птица', '🐦'],
    ['Р', 'р', 'эр', 'Рыба', '🐟'],
    ['С', 'с', 'эс', 'Солнце', '☀️'],
    ['Т', 'т', 'тэ', 'Тигр', '🐯'],
    ['У', 'у', 'у', 'Утка', '🦆'],
    ['Ф', 'ф', 'эф', 'Флаг', '🚩'],
    ['Х', 'х', 'ха', 'Хлеб', '🍞'],
    ['Ц', 'ц', 'цэ', 'Цветок', '🌸'],
    ['Ч', 'ч', 'чэ', 'Часы', '⌚'],
    ['Ш', 'ш', 'ша', 'Шар', '🎈'],
    ['Щ', 'щ', 'ща', 'Щенок', '🐶'],
    ['Ъ', 'ъ', 'твёрдый знак', 'Объятие', '🤗', true],
    ['Ы', 'ы', 'ы', 'Сыр', '🧀', true],
    ['Ь', 'ь', 'мягкий знак', 'Конь', '🐴', true],
    ['Э', 'э', 'э', 'Эскимо', '🍦'],
    ['Ю', 'ю', 'ю', 'Юбка', '👗'],
    ['Я', 'я', 'я', 'Яблоко', '🍎'],
  ]),
  tr: make('tr', 'tr', [
    ['A', 'a', 'a', 'Arı', '🐝'],
    ['B', 'b', 'be', 'Balık', '🐟'],
    ['C', 'c', 'ce', 'Civciv', '🐥'],
    ['Ç', 'ç', 'çe', 'Çilek', '🍓'],
    ['D', 'd', 'de', 'Deniz', '🌊'],
    ['E', 'e', 'e', 'Elma', '🍎'],
    ['F', 'f', 'fe', 'Fil', '🐘'],
    ['G', 'g', 'ge', 'Gemi', '🚢'],
    ['Ğ', 'ğ', 'yumuşak ge', 'Dağ', '⛰️', true],
    ['H', 'h', 'he', 'Havuç', '🥕'],
    ['I', 'ı', 'ı', 'Işık', '💡'],
    ['İ', 'i', 'i', 'İnek', '🐄'],
    ['J', 'j', 'je', 'Jöle', '🍮'],
    ['K', 'k', 'ke', 'Kedi', '🐱'],
    ['L', 'l', 'le', 'Limon', '🍋'],
    ['M', 'm', 'me', 'Muz', '🍌'],
    ['N', 'n', 'ne', 'Nota', '🎵'],
    ['O', 'o', 'o', 'Okul', '🏫'],
    ['Ö', 'ö', 'ö', 'Ördek', '🦆'],
    ['P', 'p', 'pe', 'Peynir', '🧀'],
    ['R', 'r', 're', 'Roket', '🚀'],
    ['S', 's', 'se', 'Saat', '⏰'],
    ['Ş', 'ş', 'şe', 'Şemsiye', '☂️'],
    ['T', 't', 'te', 'Top', '⚽'],
    ['U', 'u', 'u', 'Uçak', '✈️'],
    ['Ü', 'ü', 'ü', 'Üzüm', '🍇'],
    ['V', 'v', 've', 'Vazo', '🏺'],
    ['Y', 'y', 'ye', 'Yıldız', '⭐'],
    ['Z', 'z', 'ze', 'Zürafa', '🦒'],
  ]),
  de: make('de', 'de', [
    ['A', 'a', 'a', 'Apfel', '🍎'],
    ['Ä', 'ä', 'ä', 'Ähre', '🌾'],
    ['B', 'b', 'be', 'Ball', '⚽'],
    ['C', 'c', 'ce', 'Computer', '💻'],
    ['D', 'd', 'de', 'Delfin', '🐬'],
    ['E', 'e', 'e', 'Elefant', '🐘'],
    ['F', 'f', 'ef', 'Fisch', '🐟'],
    ['G', 'g', 'ge', 'Giraffe', '🦒'],
    ['H', 'h', 'ha', 'Hund', '🐶'],
    ['I', 'i', 'i', 'Igel', '🦔'],
    ['J', 'j', 'jott', 'Jacke', '🧥'],
    ['K', 'k', 'ka', 'Katze', '🐱'],
    ['L', 'l', 'el', 'Löwe', '🦁'],
    ['M', 'm', 'em', 'Maus', '🐭'],
    ['N', 'n', 'en', 'Nase', '👃'],
    ['O', 'o', 'o', 'Orange', '🍊'],
    ['Ö', 'ö', 'ö', 'Öl', '🛢️'],
    ['P', 'p', 'pe', 'Pinguin', '🐧'],
    ['Q', 'q', 'ku', 'Quadrat', '🟥'],
    ['R', 'r', 'er', 'Rakete', '🚀'],
    ['S', 's', 'es', 'Sonne', '☀️'],
    ['T', 't', 'te', 'Tiger', '🐯'],
    ['U', 'u', 'u', 'Uhr', '⏰'],
    ['Ü', 'ü', 'ü', 'Überraschung', '🎁'],
    ['V', 'v', 'vau', 'Vogel', '🐦'],
    ['W', 'w', 'we', 'Wal', '🐳'],
    ['X', 'x', 'ix', 'Xylofon', '🎶'],
    ['Y', 'y', 'ypsilon', 'Yacht', '⛵'],
    ['Z', 'z', 'zett', 'Zebra', '🦓'],
    ['ß', 'ß', 'eszett', 'Fuß', '🦶', true],
  ]),
  ar: make(
    'ar',
    'ar',
    [
      ['ا', 'ا', 'ألف', 'أرنب', '🐰'],
      ['ب', 'ب', 'باء', 'بطة', '🦆'],
      ['ت', 'ت', 'تاء', 'تفاحة', '🍎'],
      ['ث', 'ث', 'ثاء', 'ثعلب', '🦊'],
      ['ج', 'ج', 'جيم', 'جمل', '🐪'],
      ['ح', 'ح', 'حاء', 'حصان', '🐴'],
      ['خ', 'خ', 'خاء', 'خروف', '🐑'],
      ['د', 'د', 'دال', 'دب', '🐻'],
      ['ذ', 'ذ', 'ذال', 'ذرة', '🌽'],
      ['ر', 'ر', 'راء', 'رسالة', '✉️'],
      ['ز', 'ز', 'زاي', 'زرافة', '🦒'],
      ['س', 'س', 'سين', 'سمكة', '🐟'],
      ['ش', 'ش', 'شين', 'شمس', '☀️'],
      ['ص', 'ص', 'صاد', 'صقر', '🦅'],
      ['ض', 'ض', 'ضاد', 'ضفدع', '🐸'],
      ['ط', 'ط', 'طاء', 'طائرة', '✈️'],
      ['ظ', 'ظ', 'ظاء', 'ظبي', '🦌'],
      ['ع', 'ع', 'عين', 'عنب', '🍇'],
      ['غ', 'غ', 'غين', 'غيمة', '☁️'],
      ['ف', 'ف', 'فاء', 'فيل', '🐘'],
      ['ق', 'ق', 'قاف', 'قطة', '🐱'],
      ['ك', 'ك', 'كاف', 'كتاب', '📚'],
      ['ل', 'ل', 'لام', 'ليمون', '🍋'],
      ['م', 'م', 'ميم', 'موز', '🍌'],
      ['ن', 'ن', 'نون', 'نحلة', '🐝'],
      ['ه', 'ه', 'هاء', 'هدية', '🎁'],
      ['و', 'و', 'واو', 'وردة', '🌹'],
      ['ي', 'ي', 'ياء', 'يد', '✋'],
    ],
    true,
  ),
};

/** O'rganiladigan tillar va ularning alifbolari */
export const LEARN_LANGS: { lang: Lang; alphabets: AlphabetId[] }[] = [
  { lang: 'uz', alphabets: ['uz', 'uzold'] },
  { lang: 'en', alphabets: ['en'] },
  { lang: 'ru', alphabets: ['ru'] },
  { lang: 'tr', alphabets: ['tr'] },
  { lang: 'de', alphabets: ['de'] },
  { lang: 'ar', alphabets: ['ar'] },
];

const ZERO: Record<Lang, string> = { uz: 'nol', ru: 'ноль', en: 'zero', tr: 'sıfır', de: 'null', ar: 'صفر' };

/** 0–10 sonlarining nomi */
export function numberWord(n: number, lang: Lang) {
  if (n === 0) return ZERO[lang];
  return TOPICS.find((t) => t.id === 'numbers')!.words[n - 1]?.[lang] ?? String(n);
}

/** Ekranda ko'rsatish uchun son nomi (o'zbekchada tanlangan yozuvda) */
export function numberLabel(n: number, lang: Lang, script: UzScript) {
  const w = numberWord(n, lang);
  return lang === 'uz' ? uzText(w, script) : w;
}

/** Alifboning ko'rinishdagi harfi (o'zbek yangi alifbosida so'zlar ham yangicha yoziladi) */
export const isAlphabetId = (x: string): x is AlphabetId => x in ALPHABETS;
