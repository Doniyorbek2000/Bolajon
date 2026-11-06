import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { translate } from '@/i18n';
import { LANGS, type Lang, type UzScript } from '@/i18n/langs';
import { uzbekForSpeech } from '@/i18n/uzScript';

let soundOn = true;
let uiLang: Lang = 'uz';
let uzScript: UzScript = 'new';

export function setSoundEnabled(on: boolean) {
  soundOn = on;
  if (!on) Speech.stop().catch(() => {});
}

export function setSpeechLocale(lang: Lang, script: UzScript) {
  uiLang = lang;
  uzScript = script;
}

type Voice = { language?: string; identifier?: string };
let voicesPromise: Promise<Voice[]> | null = null;
const voices = () => (voicesPromise ??= Speech.getAvailableVoicesAsync().catch(() => [] as Voice[]));

const cache: Partial<Record<Lang, { language?: string; voice?: string; turkish: boolean }>> = {};

/**
 * Har bir til uchun eng mos ovoz. O'zbek ovozi bo'lmasa, turk ovozi tanlanadi —
 * yangi alifbodagi (Ö, Ğ, Ş, Ç) o'zbek so'zlarini eng to'g'ri talaffuz qiladi.
 */
async function voiceFor(lang: Lang) {
  if (cache[lang]) return cache[lang]!;
  const list = await voices();
  const find = (prefix: string) => list.find((v) => v.language?.toLowerCase().replace('_', '-').startsWith(prefix));
  const tts = LANGS.find((l) => l.code === lang)!.tts;
  let v = find(lang);
  let turkish = false;
  if (!v && lang === 'uz') {
    v = find('tr');
    turkish = true;
  }
  const res = { language: v?.language ?? (lang === 'uz' ? 'tr-TR' : tts), voice: v?.identifier, turkish: turkish || (!v && lang === 'uz') };
  cache[lang] = res;
  return res;
}

/** Matnni o'qish. `lang` berilmasa — ilova tili. */
export async function say(text: string, lang: Lang = uiLang) {
  if (!soundOn || !text) return;
  const v = await voiceFor(lang);
  const spoken = lang === 'uz' ? uzbekForSpeech(text, v.turkish) : text.replace(/[⟦⟧]/g, '');
  Speech.stop().catch(() => {});
  Speech.speak(spoken, {
    language: v.language,
    voice: v.voice,
    rate: Platform.OS === 'ios' ? 0.45 : 0.85,
    pitch: 1.1,
  });
}

const haptic = (fn: () => Promise<void>) => {
  if (Platform.OS === 'web') return;
  fn().catch(() => {});
};

export const tap = () => haptic(() => Haptics.selectionAsync());
export const success = () => haptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const oops = () => haptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));

const variants = (key: 'praise' | 'tryAgain') => translate(uiLang, uzScript, key).split('|');

export const praise = () => {
  const t = pick(variants('praise'));
  success();
  say(t);
  return t;
};
export const tryAgain = () => {
  const t = pick(variants('tryAgain'));
  oops();
  say(t);
  return t;
};

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
