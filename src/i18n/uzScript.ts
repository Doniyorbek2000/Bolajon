/**
 * O'zbek lotin yozuvi: amaldagi alifbodan yangi alifboga (2026-yil O‘RQ–1184-son qonun) o'girish.
 *   O‘ → Ö, G‘ → Ğ, Sh → Ş, Ch → Ç. Tutuq belgisi (ʼ) saqlanadi, «Ng» — oddiy n + g.
 */
const APOS = "['‘’ʻ`]";

/** ⟦...⟧ ichidagi matn o'zgartirilmaydi. */
function outsideLiterals(s: string, fn: (x: string) => string) {
  return s
    .split(/(⟦[^⟧]*⟧)/)
    .map((part) => (part.startsWith('⟦') ? part.slice(1, -1) : fn(part)))
    .join('');
}

export function toNewUzbek(s: string): string {
  return outsideLiterals(s, convertNew);
}

function convertNew(s: string): string {
  return s
    .replace(new RegExp(`O${APOS}`, 'g'), 'Ö')
    .replace(new RegExp(`o${APOS}`, 'g'), 'ö')
    .replace(new RegExp(`G${APOS}`, 'g'), 'Ğ')
    .replace(new RegExp(`g${APOS}`, 'g'), 'ğ')
    .replace(/SH/g, 'Ş')
    .replace(/Sh/g, 'Ş')
    .replace(/sh/g, 'ş')
    .replace(/CH/g, 'Ç')
    .replace(/Ch/g, 'Ç')
    .replace(/ch/g, 'ç')
    .replace(/(\p{L})'(\p{L})/gu, '$1ʼ$2');
}

/** Amaldagi yozuvda o'zbekcha apostroflarni chiroyli belgilar bilan almashtirish. */
export function prettyOldUzbek(s: string): string {
  return outsideLiterals(s, (x) => x.replace(/([OoGg])'/g, '$1‘').replace(/(\p{L})'(\p{L})/gu, '$1ʼ$2'));
}

/**
 * Ovozli o'qish uchun: o'zbek ovozi yo'q qurilmalarda turk ovozi ishlatiladi,
 * shuning uchun matnni turkcha talaffuzga yaqinlashtiramiz.
 */
export const stripLiterals = (s: string) => s.replace(/[⟦⟧]/g, '');

export function uzbekForSpeech(s: string, turkishVoice: boolean): string {
  const t = toNewUzbek(s);
  if (!turkishVoice) return t;
  // Turk ovozi o'zbekcha to'g'ri o'qishi uchun tovushlarni turkcha yozuvga yaqinlashtiramiz:
  //   o'zbek j [dʒ] → turk c;  o' [o] → o (turk ö — boshqa tovush);  g' [ʁ] → g (turk ğ deyarli o'qilmaydi);
  //   x [χ] → h;  q [q] → k;  tutuq belgisi — qisqa pauza.
  const map: Record<string, string> = { j: 'c', J: 'C', ö: 'o', Ö: 'O', ğ: 'g', Ğ: 'G', x: 'h', X: 'H', q: 'k', Q: 'K' };
  return t.replace(/[jJöÖğĞxXqQ]/g, (c) => map[c]).replace(/ʼ/g, ' ');
}
