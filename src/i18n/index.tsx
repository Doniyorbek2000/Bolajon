import { useCallback, useMemo } from 'react';
import { useApp } from '@/store/AppStore';
import { ar } from './locales/ar';
import { de } from './locales/de';
import { en } from './locales/en';
import { ru } from './locales/ru';
import { tr } from './locales/tr';
import { Dict, DictKey, uz } from './locales/uz';
import { prettyOldUzbek, stripLiterals, toNewUzbek } from './uzScript';

import { LANGS, type Lang, type UzScript } from './langs';

export { LANGS, detectLang, type Lang, type UzScript } from './langs';

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

export function useT() {
  const { data } = useApp();
  const lang = data.uiLang;
  const script = data.uzScript;
  const t = useCallback((key: DictKey, vars?: Record<string, string | number>) => translate(lang, script, key, vars), [lang, script]);
  /** Bir nechta variantli kalitlar ("a|b|c") */
  const list = useCallback((key: DictKey) => t(key).split('|'), [t]);
  return useMemo(() => ({ t, list, lang, script, rtl: isRtl(lang) }), [t, list, lang, script]);
}

export type { DictKey };
