/**
 * O'zbekcha ovoz fayllarini yaratadi (Azure AI Speech, uz-UZ neyron ovozlari).
 *
 *   AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=northeurope node scripts/generate-uz-voice.mjs
 *   ixtiyoriy: UZ_VOICE=uz-UZ-MadinaNeural (yoki uz-UZ-SardorNeural)
 *
 * Natija: src/audio/uz/*.mp3 va src/audio/uz/manifest.ts. Mavjud fayllar qayta yaratilmaydi.
 * Kalit faqat shu skriptda ishlatiladi — ilovaga yozilmaydi.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { loadPhrases } from './list-uz-phrases.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = path.join(root, 'src/audio/uz');
mkdirSync(outDir, { recursive: true });
const { uzPhrases, clipKey, toOldUzbek } = await loadPhrases(root);

const phrases = uzPhrases();
const key = process.env.AZURE_SPEECH_KEY;
const region = process.env.AZURE_SPEECH_REGION;
const voice = process.env.UZ_VOICE || 'uz-UZ-MadinaNeural';
if (!key || !region) {
  console.log(`${phrases.length} ta ibora topildi. Ovoz yaratish uchun AZURE_SPEECH_KEY va AZURE_SPEECH_REGION kerak.`);
  if (process.argv.includes('--list')) phrases.forEach((p) => console.log(p));
  process.exit(0);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const entries = [];
let made = 0;
for (const p of phrases) {
  const k = clipKey(p);
  const spoken = toOldUzbek(p);
  const file = createHash('sha1').update(`${voice}|${spoken}`).digest('hex').slice(0, 12) + '.mp3';
  const dest = path.join(outDir, file);
  if (!existsSync(dest)) {
    // bolalar uchun biroz sekinroq va iliqroq
    const ssml = `<speak version="1.0" xml:lang="uz-UZ"><voice name="${voice}"><prosody rate="-8%" pitch="+6%">${esc(spoken)}</prosody></voice></speak>`;
    const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'bolajon-voice-generator',
      },
      body: ssml,
    });
    if (!res.ok) throw new Error(`TTS xato ${res.status}: ${p}`);
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    made++;
  }
  entries.push([k, file]);
}

// eski (ishlatilmaydigan) fayllarni o'chirish
const used = new Set(entries.map((e) => e[1]));
for (const f of readdirSync(outDir)) if (f.endsWith('.mp3') && !used.has(f)) unlinkSync(path.join(outDir, f));

const body = entries.map(([k, f]) => `  ${JSON.stringify(k)}: require('./${f}'),`).join('\n');
writeFileSync(
  path.join(outDir, 'manifest.ts'),
  `/* Avtomatik yaratilgan: node scripts/generate-uz-voice.mjs (${voice}) */\nexport const UZ_CLIPS: Record<string, number> = {\n${body}\n};\n`,
);
console.log(`Tayyor: ${entries.length} ta ibora, ${made} ta yangi fayl.`);
