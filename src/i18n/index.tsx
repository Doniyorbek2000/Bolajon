import { useCallback, useMemo } from 'react';
import { useApp } from '@/store/AppStore';
import { isRtl, translate, uzText } from './translate';
import type { DictKey } from './locales/uz';

export { LANGS, detectLang, type Lang, type UzScript } from './langs';
export { isRtl, translate, uzText } from './translate';

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
