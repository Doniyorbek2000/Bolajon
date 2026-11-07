// O'zbekcha iboralar ro'yxatini Node uchun yig'ib qaytaradi (esbuild + RN stublari).
import { build } from 'esbuild';
import { mkdtempSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

export async function loadPhrases(root) {
  const stub = resolve(root, 'tests/rn-stub.cjs');
  const out = join(mkdtempSync(join(tmpdir(), 'bolajon-phr-')), 'phrases.cjs');
  const mods = ['react-native', 'react-native-svg', 'expo-router', '@react-native-async-storage/async-storage', 'expo-haptics', 'expo-speech', 'expo-audio', 'react-native-safe-area-context', 'expo-linear-gradient', 'expo-file-system', 'expo-image-picker', 'expo-keep-awake', 'kid-lock'];
  await build({
    entryPoints: [resolve(root, 'src/audio/phrases.ts')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: out,
    logLevel: 'error',
    jsx: 'automatic',
    loader: { '.png': 'empty', '.mp3': 'empty' },
    alias: { '@': resolve(root, 'src'), ...Object.fromEntries(mods.map((m) => [m, stub])) },
  });
  return createRequire(import.meta.url)(out);
}
