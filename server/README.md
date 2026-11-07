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

## Joylashtirish

**Render.com (eng oson):** repoda `render.yaml` bor. Render → **New → Blueprint** → shu repo → **Apply**.
Doimiy disk (1 GB) bilan "Starter" tarif kerak (bepul tarifda disk yo'q, ma'lumot qayta ishga tushganda o'chadi).
Tayyor bo'lgach, manzil `https://bolajon-leaderboard.onrender.com` ko'rinishida bo'ladi.

**Docker (istalgan VPS):**

```bash
docker build -t bolajon-lb server
docker run -d -p 8787:8787 -v bolajon-data:/data --restart unless-stopped bolajon-lb
```

Keyin ilovani shu manzil bilan yig'ing: `EXPO_PUBLIC_LEADERBOARD_URL=https://... ` (oxirida `/` yo'q).
Tekshirish: `https://.../health` → `{"ok":true,"players":N}`.
