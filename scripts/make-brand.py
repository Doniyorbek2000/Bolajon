"""Brend fayllarini yaratadi: python3 scripts/make-brand.py
Manba: assets/brand/logo-owl.png (fonsiz logo) va assets/mascot.png (faqat boyo'g'li)."""
from PIL import Image, ImageDraw, ImageFont

LOGO = Image.open('assets/brand/logo-owl.png').convert('RGBA')
OWL = Image.open('assets/mascot.png').convert('RGBA')
FONT = 'node_modules/@expo-google-fonts/nunito/900Black/Nunito_900Black.ttf'


def radial(size, inner=(255, 251, 236), outer=(255, 214, 140)):
    img = Image.new('RGBA', (size, size))
    px = img.load()
    c = size / 2
    for y in range(size):
        for x in range(size):
            d = min(1.0, (((x - c) ** 2 + (y - c * 0.8) ** 2) ** 0.5) / (size * 0.75))
            px[x, y] = tuple(int(inner[i] + (outer[i] - inner[i]) * d) for i in range(3)) + (255,)
    return img


def place(bg, art, scale, dy=0):
    s = int(bg.size[0] * scale)
    a = art.resize((s, s), Image.LANCZOS)
    bg.alpha_composite(a, ((bg.size[0] - s) // 2, (bg.size[1] - s) // 2 + dy))
    return bg


bg = radial(1024)
place(bg, LOGO, 0.96, 8).convert('RGB').save('assets/icon.png')
radial(1024).convert('RGB').save('assets/android-icon-background.png')
place(Image.new('RGBA', (1024, 1024), (0, 0, 0, 0)), OWL, 0.7).save('assets/android-icon-foreground.png')
mono = place(Image.new('RGBA', (1024, 1024), (0, 0, 0, 0)), OWL, 0.7)
mono.putalpha(mono.getchannel('A'))
white = Image.new('RGBA', mono.size, (255, 255, 255, 255))
white.putalpha(mono.getchannel('A'))
white.save('assets/android-icon-monochrome.png')
place(Image.new('RGBA', (1024, 1024), (0, 0, 0, 0)), LOGO, 1.0).save('assets/splash-icon.png')
fav = radial(192)
place(fav, OWL, 0.98).resize((48, 48), Image.LANCZOS).save('assets/favicon.png')

# logotip + yozuv
W, H = 1600, 460
wm = Image.new('RGBA', (W, H), (0, 0, 0, 0))
wm.alpha_composite(OWL.resize((440, 440), Image.LANCZOS), (10, 10))
d = ImageDraw.Draw(wm)
f = ImageFont.truetype(FONT, 230)
x = 470
for ch, col in zip('Bolajon', ['#FF5DA2', '#FF8A3D', '#FFC93C', '#34C77B', '#3DA9FC', '#8B6CFF', '#FF5A5F']):
    d.text((x, 95), ch, font=f, fill=col, stroke_width=14, stroke_fill='white')
    x += d.textlength(ch, font=f) - 4
wm.save('assets/brand/logo-wordmark.png')
print('ok')
