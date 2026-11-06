<p align="center"><img src="assets/brand/logo-wordmark.png" width="460" alt="Bolajon"></p>

# Bolajon — bolalar uchun o'yin va multfilmlar ilovasi

2–7 yoshli bolalar uchun ta'limiy ilova: harf va raqam yozish, bo'yash, aqlni charxlaydigan
o'yinlar, **6 ta tilni o'rganish** va faqat tekshirilgan (filtrlangan) multfilmlar.

Ilova interfeysi to'liq **6 tilda** ishlaydi: o'zbek, rus, ingliz, turk, nemis, arab (arabcha matn o'ngdan chapga).
O'zbek tili uchun **yangi lotin alifbosi** (2026-yil O‘RQ–1184-son qonun: O‘→Ö, G‘→Ğ, Sh→Ş, Ch→Ç,
28 harf + tutuq belgisi) asosiy yozuv sifatida tanlangan; ota-onalar amaldagi alifboga qaytarishi mumkin.
Bitta kod bazasidan **Android**, **iOS (iPhone)**, **iPad / planshetlar** va **web** uchun ishlaydi
(Expo SDK 58 + React Native + TypeScript).

## Imkoniyatlar

| Bo'lim | Tavsif | Bepul |
|---|---|---|
| ✍️ Harflarni yozamiz | O'zbek lotin alifbosining 29 harfi (O', G', Sh, Ch, Ng bilan), yo'nalish nuqtalari, ovozli talaffuz | 6 ta harf |
| 🔢 Raqamlarni yozamiz | 0–9 | 6 ta raqam |
| 🎨 Bo'yash | 8 ta rasm, 16 rang, bosib bo'yash | 3 ta rasm |
| 🧠 Xotira | Juftini top, 4 daraja (yoshga moslashadi) | ✓ |
| 🍎 Sanaymiz | 1–10 gacha sanash | Premium |
| 🔷 Shakl va rang | Rang va shaklni tanish | Premium |
| 🤔 Ortiqchasi qaysi? | Mantiqiy guruhlash | Premium |
| 🧩 Keyingisi nima? | Ketma-ketlikni davom ettirish | Premium |
| 🖍️ Rasm chizamiz | Erkin chizish, bekor qilish | Premium |
| 🦁 Hayvonlar | Hayvon nomi va ovozi | Premium |
| 🌍 Tillar (uz, ru, en, tr, de, ar) | Alifbo poyezdi, harf kartalari, 8 mavzuda ~70 rasmli so'z, harf yozish (lotin, kirill; arab — erkin yozish) | Alifbo, yozish, 2 mavzu |
| 🅰️👂📖 Til mashqlari | Birinchi harf, Tingla va top, O'qi va top | Premium |
| 📺 Multfilmlar | Faqat oq ro'yxatdagi videolar, toifalar, yoshga mos filtr | Belgilangan videolar |

**Ovoz:** har bir til o'z ovozida o'qiladi (qurilmadagi TTS). O'zbek ovozi bo'lmasa turk ovozi
ishlatiladi — yangi alifbodagi so'zlarni eng to'g'ri talaffuz qiladi.

**Ota-onalar bo'limi** (ota-ona darvozasi — ko'paytirish misoli bilan himoyalangan):
natijalar statistikasi, kunlik ekran vaqti limiti ("Dam olish vaqti" ekrani), video toifalarini
yoqish/o'chirish, ovozni boshqarish, profil, obuna.

**Vazifalar:** 12 olam × 90 daraja = **1080 vazifa** (sanoq, qo'shish, ayirish, shakllar, mantiq, tabiat va 6 til).
Har bir vazifa 3 savoldan iborat, urug'li generator bilan yaratiladi va daraja oshgani sari qiyinlashadi (`src/data/taskGen.tsx`).

**Tariflar** (`src/config.ts`):

| | Bepul | Standard | Pro |
|---|---|---|---|
| Narx | — | 15 000 so'm/oy · 99 000 so'm/yil | 24 000 so'm/oy · 149 000 so'm/yil |
| Vazifalar | 48 | 504 | 1080 |
| O'yinlar, tillar, videolar | qisman | to'liq | to'liq |
| Qo'shimcha | — | — | 24 oltin Pro stiker, Pro nishoni |

Ota-ona nazorati (ekran vaqti, bola rejimi) barcha tariflarda bepul.

### Xavfsizlik
- Reklama yo'q, tashqi havolalar, izohlar va avtomatik tavsiyalar yo'q.
- Videolar faqat qo'lda tekshirilgan katalogdan (`content/catalog.example.json` formatida).
- Bolaning ma'lumotlari faqat qurilmada saqlanadi.
- To'lov va sozlamalar ota-ona darvozasi ortida (App Store "Kids" va Google Play "Families" talablari).

## Ishga tushirish

```bash
npm install
npx expo start          # QR kodni telefonda skanerlang (development build yoki Expo Go)
npm run typecheck
npm run build:web       # web versiyasi
```

Do'konlar uchun yig'ish (EAS):

```bash
npx eas-cli@latest build --platform android --profile production
npx eas-cli@latest build --platform ios --profile production
```

## O'zbekcha ovoz

Telefonlarda odatda o'zbek TTS ovozi bo'lmaydi, shuning uchun ilova o'zbekcha iboralarni oldindan
yozilgan ovoz fayllaridan ijro etadi (`src/audio/uz`). Fayllarni yaratish (Azure AI Speech, uz-UZ neyron ovozi):

```bash
AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=westeurope node scripts/generate-uz-voice.mjs
```

Fayl bo'lmagan iboralar (masalan, bola ismi) qurilmaning TTS ovozi bilan aytiladi.

## Ishlab chiqarishdan oldin bajarilishi kerak

1. **To'lovlar.** `src/services/payments.ts` hozircha DEMO (pul yechilmaydi). Apple va Google
   qoidalariga ko'ra raqamli obuna faqat ularning to'lov tizimi orqali sotiladi: RevenueCat
   (`react-native-purchases`) yoki `expo-iap` ulang va `uz.bolajon.premium.monthly` va
   `uz.bolajon.premium.yearly` mahsulotlarini 15 000 va 99 000 so'm narxda yarating. Web uchun Click/Payme to'lovini server tomonda tasdiqlang.
2. **Video kontent.** Ilovada faqat namuna video bor. Huquq egalaridan litsenziya olingan
   multfilmlarni CDN'ga joylang (HLS tavsiya etiladi) va katalog JSON manzilini
   `EXPO_PUBLIC_CATALOG_URL` muhit o'zgaruvchisiga yozing.
3. **Yangi alifbo tartibi.** Ö, Ğ, Ş, Ç harflari hozircha Z dan keyin (amaldagi O‘, G‘, Sh, Ch o'rnida)
   joylashtirilgan — qonunning rasmiy matnidagi tartib bilan solishtirib chiqing (`src/data/alphabets.ts`).
4. **Tarjimalarni ona tili egalari ko'rib chiqsin** (`src/i18n/locales/*`, `src/data/vocab.ts`).
5. **Maxfiylik siyosati** sahifasini tayyorlab, do'kon sahifasiga qo'shing (COPPA/GDPR-K).

## Tuzilma

```
src/app/          ekranlar (Expo Router)
  games/          o'yinlar
  videos/         video ro'yxati va pleyer
  parents/        ota-onalar bo'limi va obuna
src/components/   UI komponentlar, maskot, ota-ona darvozasi, mukofot oynasi
src/data/         harflar yo'nalishi, bo'yash rasmlari, o'yinlar, video katalog
src/store/        holat (AsyncStorage)
src/services/     to'lov xizmati
src/i18n/         6 til lug'atlari, o'zbek yozuvi konvertori, shakl/rang grammatikasi
src/app/learn/    tillar bo'limi
assets/brand/     logotip (boyo'g'li); `npm run brand` ikonkalarni qayta yaratadi
```
