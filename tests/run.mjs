// Testlarni ishga tushiruvchi: TS kontent testini esbuild bilan Node uchun yig'adi va bajaradi.
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const stub = resolve('tests/rn-stub.cjs');
const out = join(mkdtempSync(join(tmpdir(), 'bolajon-test-')), 'content.cjs');
const mods = ['react-native', 'react-native-svg', 'expo-router', '@react-native-async-storage/async-storage', 'expo-haptics', 'expo-speech', 'expo-audio', 'react-native-safe-area-context', 'expo-linear-gradient', 'expo-file-system', 'expo-image-picker', 'expo-keep-awake', 'kid-lock'];
await build({
  entryPoints: ['tests/content.test.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: out,
  logLevel: 'error',
  jsx: 'automatic',
  loader: { '.png': 'empty', '.mp3': 'empty' },
  alias: { '@': resolve('src'), ...Object.fromEntries(mods.map((m) => [m, stub])) },
});
execFileSync(process.execPath, [out], { stdio: 'inherit' });
execFileSync(process.execPath, ['tests/server.test.mjs'], { stdio: 'inherit' });
