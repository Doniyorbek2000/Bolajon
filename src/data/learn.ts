import { uzText } from '@/i18n';
import { LANGS, type Lang, type UzScript } from '@/i18n/langs';
import { ALPHABETS, AlphabetId } from './alphabets';
import type { Word } from './vocab';

export const isLang = (x: string | undefined): x is Lang => !!x && LANGS.some((l) => l.code === x);

/** So'zni o'rganilayotgan tilda ko'rsatish (o'zbekchada tanlangan yozuv bilan) */
export const wordIn = (w: Word, lang: Lang, script: UzScript) => (lang === 'uz' ? uzText(w.uz, script) : w[lang]);

/** Tilning asosiy alifbosi */
export function alphabetFor(lang: Lang, script: UzScript, override?: string): AlphabetId {
  if (lang === 'uz') return override === 'uzold' || (!override && script === 'old') ? 'uzold' : 'uz';
  return lang as AlphabetId;
}

export const scriptOf = (id: AlphabetId): UzScript => (id === 'uzold' ? 'old' : 'new');

export const langMeta = (l: Lang) => LANGS.find((x) => x.code === l)!;

export const alphabetOf = (id: AlphabetId) => ALPHABETS[id];
