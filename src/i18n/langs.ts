export type Lang = 'uz' | 'ru' | 'en' | 'tr' | 'de' | 'ar';
export type UzScript = 'new' | 'old';

export const LANGS: { code: Lang; native: string; flag: string; tts: string; rtl?: boolean }[] = [
  { code: 'uz', native: "O'zbekcha", flag: '🇺🇿', tts: 'uz-UZ' },
  { code: 'ru', native: 'Русский', flag: '🇷🇺', tts: 'ru-RU' },
  { code: 'en', native: 'English', flag: '🇬🇧', tts: 'en-US' },
  { code: 'tr', native: 'Türkçe', flag: '🇹🇷', tts: 'tr-TR' },
  { code: 'de', native: 'Deutsch', flag: '🇩🇪', tts: 'de-DE' },
  { code: 'ar', native: 'العربية', flag: '🇸🇦', tts: 'ar-SA', rtl: true },
];

export function detectLang(): Lang {
  try {
    const loc = Intl.DateTimeFormat().resolvedOptions().locale.slice(0, 2).toLowerCase();
    if (LANGS.some((l) => l.code === loc)) return loc as Lang;
  } catch {}
  return 'uz';
}
