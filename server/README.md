# Bolajon reyting serveri

Tashqi kutubxonalarsiz Node.js (18+) server. Bolalar reytingini (O'zbekiston, viloyat, tuman) yuritadi.

```bash
node server/index.mjs          # PORT=8787, ma'lumotlar: server/data/scores.json
```

Ilovani ulash: build vaqtida `EXPO_PUBLIC_LEADERBOARD_URL=https://sizning-serveringiz.uz` bering.

Joylashtirish: istalgan Node hosting (Render, Railway, Fly.io, VPS). `DATA_FILE` doimiy diskda bo'lishi kerak.
Ko'p foydalanuvchida JSON fayl o'rniga PostgreSQL ga o'tkazish tavsiya etiladi — API o'zgarmaydi.

Maxfiylik: faqat anonim ID, ism (birinchi so'z), avatar belgisi, yosh, hudud va natijalar saqlanadi.
Ota-ona reytingdan chiqsa, ilova `DELETE /v1/score/:id` yuboradi va yozuv o'chiriladi.
