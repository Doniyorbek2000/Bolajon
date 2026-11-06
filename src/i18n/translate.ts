import { ar } from './locales/ar';
import { de } from './locales/de';
import { en } from './locales/en';
import { ru } from './locales/ru';
import { tr } from './locales/tr';
import { Dict, DictKey, uz } from './locales/uz';
import type { Lang, UzScript } from './langs';
import { prettyOldUzbek, stripLiterals, toNewUzbek } from './uzScript';

const DICTS: Record<Lang, Dict> = { uz, ru, en, tr, de, ar };

export const isRtl = (l: Lang) => l === 'ar';

/** O'zbekcha matnni tanlangan yozuvga moslash. */
export function uzText(s: string, script: UzScript) {
  return script === 'new' ? toNewUzbek(s) : prettyOldUzbek(s);
}

export function translate(lang: Lang, script: UzScript, key: DictKey, vars?: Record<string, string | number>) {
  let s = DICTS[lang]?.[key] ?? uz[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return lang === 'uz' ? uzText(s, script) : stripLiterals(s);
}
