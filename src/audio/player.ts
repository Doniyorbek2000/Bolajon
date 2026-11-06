import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { clipKey } from './key';
import { UZ_CLIPS } from './uz/manifest';

let player: AudioPlayer | null = null;
let modeSet = false;

export function hasUzClip(text: string) {
  return clipKey(text) in UZ_CLIPS;
}

/** Oldindan yozilgan o'zbekcha ovozni ijro etish. Topilmasa false qaytaradi. */
export function playUzClip(text: string): boolean {
  const src = UZ_CLIPS[clipKey(text)];
  if (src === undefined) return false;
  try {
    if (!modeSet) {
      modeSet = true;
      setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    }
    if (!player) player = createAudioPlayer(src);
    else player.replace(src);
    player.seekTo(0).catch(() => {});
    player.play();
    return true;
  } catch {
    return false;
  }
}

export function stopClip() {
  try {
    player?.pause();
  } catch {}
}
