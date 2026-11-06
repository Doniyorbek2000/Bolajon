# Bolajon

Bolalar (2–7 yosh) uchun ta'limiy ilova: Expo SDK 58 + React Native + TypeScript (Android, iOS, iPad, web).
Expo bilan ishlash qoidalari: `AGENTS.md`.

## Muhim qoidalar
- **UI/UX ishlari** (yangi ekran, komponent, rang, shrift, animatsiya, ko'rib chiqish) uchun
  `.claude/skills/ui-ux-pro-max` skillidan foydalaning:
  `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<so'rov>" --stack react-native`
- Barcha matnlar `src/i18n/locales/*.ts` orqali — 6 til (uz, ru, en, tr, de, ar). Yangi kalit
  `uz.ts` ga qo'shiladi, qolgan tillarda TypeScript uni talab qiladi.
- O'zbekcha matnlar amaldagi yozuvda yoziladi; yangi alifbo (Ö, Ğ, Ş, Ç) `src/i18n/uzScript.ts` orqali
  avtomatik hosil bo'ladi. O'zgartirilmasligi kerak bo'lgan qism `⟦...⟧` ichiga olinadi.
- Ranglar `src/theme` dagi `tints` orqali; rangli yuza ustidagi matn uchun `tint.on` (kontrast ≥ 3:1).
- Bosish maydoni ≥ 44pt; "Harakatni kamaytirish" uchun `useReducedMotion()`.

## Tekshirish
- `npx tsc --noEmit`
- `npm run build:web` (tarmoqsiz muhitda: `EXPO_OFFLINE=1`)
