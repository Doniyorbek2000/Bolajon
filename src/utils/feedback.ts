import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

let soundOn = true;
let voiceLang: string | undefined;
let voiceResolved = false;

export function setSoundEnabled(on: boolean) {
  soundOn = on;
  if (!on) Speech.stop().catch(() => {});
}

/**
 * O'zbek ovozi bo'lmasa, turk ovozini tanlaymiz — lotin yozuvidagi o'zbek so'zlarini
 * eng to'g'ri talaffuz qiladi. U ham bo'lmasa, tizim ovozi.
 */
async function resolveVoice() {
  if (voiceResolved) return;
  voiceResolved = true;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const pick = (prefix: string) => voices.find((v) => v.language?.toLowerCase().startsWith(prefix));
    voiceLang = (pick('uz') ?? pick('tr'))?.language;
  } catch {
    voiceLang = undefined;
  }
}

export async function say(text: string) {
  if (!soundOn) return;
  await resolveVoice();
  Speech.stop().catch(() => {});
  Speech.speak(text, { language: voiceLang, rate: Platform.OS === 'ios' ? 0.45 : 0.85, pitch: 1.15 });
}

const haptic = (fn: () => Promise<void>) => {
  if (Platform.OS === 'web') return;
  fn().catch(() => {});
};

export const tap = () => haptic(() => Haptics.selectionAsync());
export const success = () => haptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const oops = () => haptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));

const PRAISE = ['Barakalla!', 'Zo\'r!', 'Ofarin!', 'Juda yaxshi!', 'Qoyil!', 'Sen eng zo\'rsan!'];
const TRY = ['Yana urinib ko\'r', 'Deyarli to\'g\'ri!', 'Qaytadan ko\'raylik'];

export const praise = () => {
  const t = PRAISE[Math.floor(Math.random() * PRAISE.length)];
  success();
  say(t);
  return t;
};
export const tryAgain = () => {
  const t = TRY[Math.floor(Math.random() * TRY.length)];
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

export const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];
