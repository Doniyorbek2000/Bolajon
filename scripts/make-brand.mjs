// Brend fayllarini yaratadi: node scripts/make-brand.mjs  (Playwright kerak)
import { writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const mascot = (fill = true) => `
  <circle cx="34" cy="112" r="18" fill="${fill ? '#F7B98B' : '#fff'}"/>
  <circle cx="166" cy="112" r="18" fill="${fill ? '#F7B98B' : '#fff'}"/>
  <circle cx="100" cy="110" r="68" fill="${fill ? '#FFD0A6' : '#fff'}"/>
  ${fill ? `
  <circle cx="36" cy="112" r="9" fill="#EE9C6C"/><circle cx="164" cy="112" r="9" fill="#EE9C6C"/>
  <path d="M40 96 C44 58 72 40 100 40 C130 40 158 58 160 96 C146 80 128 74 112 76 C100 70 84 72 72 80 C60 82 48 88 40 96 Z" fill="#5B3A29"/>
  <path d="M52 70 L60 30 C80 20 120 20 140 30 L148 70 C120 60 80 60 52 70 Z" fill="#1F2A44"/>
  <path d="M52 70 C80 60 120 60 148 70 L150 78 C120 68 80 68 50 78 Z" fill="#FFC93C"/>
  <g fill="#fff"><path d="M74 52 C70 42 78 34 84 40 C86 46 80 50 74 52 Z"/><path d="M100 48 C96 38 104 30 110 36 C112 42 106 46 100 48 Z"/><path d="M126 52 C122 42 130 34 136 40 C138 46 132 50 126 52 Z"/></g>
  <ellipse cx="76" cy="110" rx="11" ry="13" fill="#2B2D42"/><ellipse cx="124" cy="110" rx="11" ry="13" fill="#2B2D42"/>
  <circle cx="80" cy="105" r="4" fill="#fff"/><circle cx="128" cy="105" r="4" fill="#fff"/>
  <ellipse cx="58" cy="134" rx="13" ry="8" fill="#FF8FA3" opacity="0.7"/><ellipse cx="142" cy="134" rx="13" ry="8" fill="#FF8FA3" opacity="0.7"/>
  <path d="M74 136 Q100 172 126 136 Z" fill="#B23A48"/><path d="M86 152 Q100 162 114 152 Q100 146 86 152 Z" fill="#FF7A8A"/>
  ` : `<path d="M52 70 L60 30 C80 20 120 20 140 30 L148 70 C120 60 80 60 52 70 Z" fill="#fff"/>
  <ellipse cx="76" cy="110" rx="11" ry="13" fill="#000"/><ellipse cx="124" cy="110" rx="11" ry="13" fill="#000"/>
  <path d="M74 136 Q100 172 126 136 Z" fill="#000"/>`}
`;

const bgDefs = `<defs>
  <radialGradient id="bg" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="#FFD86B"/><stop offset="0.6" stop-color="#FFB547"/><stop offset="1" stop-color="#FF8A3D"/></radialGradient>
</defs>`;
const sparkles = `<g fill="#fff" opacity="0.9">
  <path d="M150 150 l10 26 26 10 -26 10 -10 26 -10 -26 -26 -10 26 -10z"/>
  <path d="M860 200 l8 20 20 8 -20 8 -8 20 -8 -20 -20 -8 20 -8z"/>
  <circle cx="880" cy="820" r="14"/><circle cx="130" cy="840" r="10"/>
</g>`;

const svgs = {
  'brand/logo-mark.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${bgDefs}<rect width="1024" height="1024" rx="230" fill="url(#bg)"/>${sparkles}<g transform="translate(112 112) scale(4)">${mascot()}</g></svg>`,
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${bgDefs}<rect width="1024" height="1024" fill="url(#bg)"/>${sparkles}<g transform="translate(112 100) scale(4)">${mascot()}</g></svg>`,
  'android-icon-foreground': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="translate(232 222) scale(2.8)">${mascot()}</g></svg>`,
  'android-icon-background': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${bgDefs}<rect width="1024" height="1024" fill="url(#bg)"/>${sparkles}</svg>`,
  'android-icon-monochrome': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="translate(232 222) scale(2.8)">${mascot(false)}</g></svg>`,
  'splash-icon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="translate(112 60) scale(4)">${mascot()}</g></svg>`,
  favicon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${bgDefs}<rect width="1024" height="1024" rx="230" fill="url(#bg)"/><g transform="translate(62 52) scale(4.5)">${mascot()}</g></svg>`,
};

const letters = 'Bolajon'.split('');
const lc = ['#FF5DA2', '#FF8A3D', '#FFC93C', '#34C77B', '#3DA9FC', '#8B6CFF', '#FF5A5F'];
svgs['brand/logo-wordmark.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 400">
  <g transform="translate(20 20) scale(1.8)">${mascot()}</g>
  <text x="400" y="270" font-family="Nunito, 'Arial Rounded MT Bold', Arial, sans-serif" font-weight="900" font-size="210" stroke="#fff" stroke-width="18" paint-order="stroke" letter-spacing="-4">${letters
    .map((l, i) => `<tspan fill="${lc[i]}">${l}</tspan>`)
    .join('')}</text>
</svg>`;

mkdirSync('assets/brand', { recursive: true });
for (const [k, v] of Object.entries(svgs)) if (k.startsWith('brand/')) writeFileSync(`assets/${k}`, v);

const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
const font = (await import('node:fs')).readFileSync('node_modules/@expo-google-fonts/nunito/900Black/Nunito_900Black.ttf').toString('base64');
const render = async (svg, out, w, h = w) => {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><head><style>@font-face{font-family:Nunito;font-weight:900;src:url(data:font/ttf;base64,${font})}</style></head><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${w}" height="${h}" `)}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('svg').screenshot({ path: out, omitBackground: true });
};
await render(svgs.icon, 'assets/icon.png', 1024);
await render(svgs['android-icon-foreground'], 'assets/android-icon-foreground.png', 1024);
await render(svgs['android-icon-background'], 'assets/android-icon-background.png', 1024);
await render(svgs['android-icon-monochrome'], 'assets/android-icon-monochrome.png', 1024);
await render(svgs['splash-icon'], 'assets/splash-icon.png', 1024);
await render(svgs.favicon, 'assets/favicon.png', 48);
await render(svgs['brand/logo-mark.svg'], 'assets/brand/logo-mark.png', 1024);
await render(svgs['brand/logo-wordmark.svg'], 'assets/brand/logo-wordmark.png', 1400, 400);
await browser.close();
console.log('ok');
