import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { translate } from '@/i18n/translate';
import { LANGS, type Lang, type UzScript } from '@/i18n/langs';
import { uzbekForSpeech } from '@/i18n/uzScript';
import { playUzClip, stopClip } from '@/audio/player';

let soundOn = true;
let uiLang: Lang = 'uz';
let uzScript: UzScript = 'new';

export function setSoundEnabled(on: boolean) {
  soundOn = on;
  if (!on) {
    Speech.stop().catch(() => {});
    stopClip();
  }
}

export function setSpeechLocale(lang: Lang, script: UzScript) {
  uiLang = lang;
  uzScript = script;
}

type Voice = { language?: string; identifier?: string; name?: string; quality?: string };
let voicesPromise: Promise<Voice[]> | null = null;
const voices = () => (voicesPromise ??= Speech.getAvailableVoicesAsync().catch(() => [] as Voice[]));

type Resolved = { language?: string; voice?: string; turkish: boolean };
const cache: Partial<Record<Lang, Resolved>> = {};

const norm = (l?: string) => (l ?? '').toLowerCase().replace('_', '-');

/**
 * Qurilmadagi ovozni tanlash. Internetga bog'liq ("network") ovozlar 3–5 soniya kechikadi,
 * shuning uchun qurilmaning o'zidagi (lokal) ovozlar ustun qo'yiladi.
 */
function bestVoice(list: Voice[], prefix: string) {
  const score = (v: Voice) => {
    const id = `${v.identifier ?? ''} ${v.name ?? ''}`.toLowerCase();
    let s = 0;
    if (id.includes('network')) s -= 10;
    if (id.includes('local')) s += 3;
    if (v.quality === 'Enhanced') s += 2;
    return s;
  };
  return list.filter((v) => norm(v.language).startsWith(prefix)).sort((a, b) => score(b) - score(a))[0];
}

async function voiceFor(lang: Lang): Promise<Resolved> {
  if (cache[lang]) return cache[lang]!;
  const list = await voices();
  const tts = LANGS.find((l) => l.code === lang)!.tts;
  let v = bestVoice(list, lang);
  let turkish = false;
  // O'zbek ovozi bo'lmasa — turk ovozi: lotin yozuvidagi o'zbek so'zlariga eng yaqin talaffuz
  if (!v && lang === 'uz') {
    v = bestVoice(list, 'tr');
    turkish = true;
  }
  const res: Resolved = { language: v?.language ?? (lang === 'uz' ? 'tr-TR' : tts), voice: v?.identifier, turkish: turkish || (!v && lang === 'uz') };
  cache[lang] = res;
  return res;
}

/** Ilova ochilganda TTS dvigatelini oldindan ishga tushirish — birinchi gap kechikmasligi uchun. */
export async function warmUpSpeech(lang: Lang) {
  try {
    await voiceFor(lang);
    if (Platform.OS === 'android') Speech.speak(' ', { volume: 0, language: cache[lang]?.language });
  } catch {}
}

/** Matnni o'qish. `lang` berilmasa — ilova tili. */
export async function say(text: string, lang: Lang = uiLang) {
  if (!soundOn || !text) return;
  stopClip();
  // 1) oldindan yozilgan tabiiy o'zbekcha ovoz (bo'lsa)
  if (lang === 'uz' && playUzClip(text)) {
    Speech.stop().catch(() => {});
    return;
  }
  // 2) qurilmaning TTS ovozi
  const v = await voiceFor(lang);
  const spoken = lang === 'uz' ? uzbekForSpeech(text, v.turkish) : text.replace(/[⟦⟧]/g, '');
  Speech.stop().catch(() => {});
  Speech.speak(spoken, {
    language: v.language,
    voice: v.voice,
    rate: Platform.OS === 'ios' ? 0.48 : 0.92,
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
