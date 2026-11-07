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

/**
 * Yangi alifbodan amaldagi rasmiy yozuvga (ovoz generatori uchun).
 * Muhim: Oʻ/Gʻ uchun faqat U+02BB (ʻ) belgisi. Azure ‘ yoki ' belgisini tashlab yuboradi va
 * "oʻ" ni "o", "gʻ" ni "g" deb o'qiydi (spektr tahlili bilan tekshirilgan).
 */
export function toOldUzbek(s: string) {
  return s
    .replace(/Ö/g, 'Oʻ')
    .replace(/ö/g, 'oʻ')
    .replace(/Ğ/g, 'Gʻ')
    .replace(/ğ/g, 'gʻ')
    .replace(/Ş/g, 'Sh')
    .replace(/ş/g, 'sh')
    .replace(/Ç/g, 'Ch')
    .replace(/ç/g, 'ch')
    .replace(/([OoGg])['‘’`ʼ]/g, '$1ʻ')
    .replace(/(\p{L})['’‘](\p{L})/gu, '$1ʼ$2');
}
