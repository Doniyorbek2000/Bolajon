import { stripLiterals, toNewUzbek } from '@/i18n/uzScript';

/**
 * Ovoz fayli kaliti: matn yangi alifboga o'giriladi va tinish belgilarisiz kichik harflarda yoziladi.
 * Shu sababli amaldagi va yangi yozuvdagi bir xil ibora bitta faylni ishlatadi.
 */
export function clipKey(text: string) {
  return toNewUzbek(stripLiterals(text))
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Yangi alifbodan amaldagi rasmiy yozuvga (ovoz generatori uchun). */
export function toOldUzbek(s: string) {
  return s
    .replace(/Ö/g, 'O‘')
    .replace(/ö/g, 'o‘')
    .replace(/Ğ/g, 'G‘')
    .replace(/ğ/g, 'g‘')
    .replace(/Ş/g, 'Sh')
    .replace(/ş/g, 'sh')
    .replace(/Ç/g, 'Ch')
    .replace(/ç/g, 'ch')
    .replace(/([OoGg])'/g, '$1‘')
    .replace(/(\p{L})'(\p{L})/gu, '$1ʼ$2');
}
