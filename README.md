<p align="center"><img src="assets/brand/logo-wordmark.png" width="420" alt="Bolajon"></p>

# Bolajon — bolalar uchun o'yin va multfilmlar ilovasi

2–7 yoshli bolalar uchun o'zbek tilidagi ta'limiy ilova: harf va raqam yozish, bo'yash,
aqlni charxlaydigan o'yinlar va faqat tekshirilgan (filtrlangan) multfilmlar.
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
| 📺 Multfilmlar | Faqat oq ro'yxatdagi videolar, toifalar, yoshga mos filtr | Belgilangan videolar |

**Ota-onalar bo'limi** (ota-ona darvozasi — ko'paytirish misoli bilan himoyalangan):
natijalar statistikasi, kunlik ekran vaqti limiti ("Dam olish vaqti" ekrani), video toifalarini
yoqish/o'chirish, ovozni boshqarish, profil, obuna.

**Obuna:** Bolajon Premium — **10 000 so'm / oy**, 3 kunlik bepul sinov
(narx `src/config.ts` da o'zgartiriladi).

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

## Ishlab chiqarishdan oldin bajarilishi kerak

1. **To'lovlar.** `src/services/payments.ts` hozircha DEMO (pul yechilmaydi). Apple va Google
   qoidalariga ko'ra raqamli obuna faqat ularning to'lov tizimi orqali sotiladi: RevenueCat
   (`react-native-purchases`) yoki `expo-iap` ulang va `uz.bolajon.premium.monthly` mahsulotini
   10 000 so'm narxda yarating. Web uchun Click/Payme to'lovini server tomonda tasdiqlang.
2. **Video kontent.** Ilovada faqat namuna video bor. Huquq egalaridan litsenziya olingan
   multfilmlarni CDN'ga joylang (HLS tavsiya etiladi) va katalog JSON manzilini
   `EXPO_PUBLIC_CATALOG_URL` muhit o'zgaruvchisiga yozing.
3. **Maxfiylik siyosati** sahifasini tayyorlab, do'kon sahifasiga qo'shing (COPPA/GDPR-K).

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
assets/brand/     logotip (SVG/PNG); `npm run brand` qayta yaratadi
```
