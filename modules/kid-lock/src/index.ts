import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

type Native = { start(): Promise<boolean>; stop(): Promise<boolean>; isLocked(): boolean };

const native = Platform.OS === 'android' ? requireOptionalNativeModule<Native>('KidLock') : null;

/** Ilovani ekranga mahkamlash mumkinmi (faqat Android) */
export const kidLockSupported = !!native;

export async function startKidLock() {
  return native ? native.start().catch(() => false) : false;
}

export async function stopKidLock() {
  return native ? native.stop().catch(() => false) : false;
}

export function isKidLocked() {
  try {
    return native ? native.isLocked() : false;
  } catch {
    return false;
  }
}
