import type { DictKey } from '@/i18n';

/**
 * Bo'yash uchun rasmlar. Har bir rasm 300×300 maydonda chizilgan, bo'yaladigan qismlardan iborat.
 */
export type Region = { d: string; fixed?: string };
export type Picture = { id: string; title: DictKey; emoji: string; regions: Region[]; lines?: string[] };

const ell = (cx: number, cy: number, rx: number, ry = rx) =>
  `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`;
const rect = (x: number, y: number, w: number, h: number, r = 0) =>
  r
    ? `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`
    : `M${x} ${y} H${x + w} V${y + h} H${x} Z`;
const poly = (...p: number[]) => {
  let d = `M${p[0]} ${p[1]}`;
  for (let i = 2; i < p.length; i += 2) d += ` L${p[i]} ${p[i + 1]}`;
  return d + ' Z';
};
const petal = (cx: number, cy: number, r: number, a: number, len: number, w: number) => {
  const rad = (a * Math.PI) / 180;
  const x = cx + Math.cos(rad) * r;
  const y = cy + Math.sin(rad) * r;
  // aylantirilgan ellips (yaproqcha) — taxminiy
  const dx = Math.cos(rad) * len;
  const dy = Math.sin(rad) * len;
  const nx = -Math.sin(rad) * w;
  const ny = Math.cos(rad) * w;
  return `M${x - dx} ${y - dy} Q${x + nx * 1.4} ${y + ny * 1.4} ${x + dx} ${y + dy} Q${x - nx * 1.4} ${y - ny * 1.4} ${x - dx} ${y - dy} Z`;
};

export const PICTURES: Picture[] = [
  {
    id: 'fish',
    title: 'pic_fish',
    emoji: '🐟',
    regions: [
      { d: rect(0, 0, 300, 300) },
      { d: poly(70, 150, 22, 104, 30, 150, 22, 196) },
      { d: ell(150, 150, 92, 62) },
      { d: 'M120 92 Q150 50 190 92 Z' },
      { d: 'M130 208 Q150 240 178 206 Z' },
      { d: 'M170 112 Q196 150 170 188 Q184 150 170 112 Z' },
      { d: ell(204, 136, 14) },
      { d: ell(207, 136, 6), fixed: '#2B2D42' },
      { d: ell(246, 70, 12) },
      { d: ell(266, 38, 8) },
      { d: 'M0 262 Q40 240 80 262 T160 262 T240 262 T300 262 V300 H0 Z' },
    ],
    lines: ['M214 172 Q226 172 232 164'],
  },
  {
    id: 'house',
    title: 'pic_house',
    emoji: '🏠',
    regions: [
      { d: rect(0, 0, 300, 230) },
      { d: ell(250, 50, 30) },
      { d: rect(190, 70, 24, 50) },
      { d: poly(40, 140, 150, 50, 260, 140) },
      { d: rect(60, 140, 180, 110) },
      { d: rect(130, 180, 44, 70, 8) },
      { d: rect(80, 160, 36, 36, 4) },
      { d: rect(190, 160, 36, 36, 4) },
      { d: rect(0, 250, 300, 50) },
      { d: ell(60, 60, 34, 16) },
    ],
    lines: ['M98 160 V196 M80 178 H116', 'M208 160 V196 M190 178 H226'],
  },
  {
    id: 'flower',
    title: 'pic_flower',
    emoji: '🌸',
    regions: [
      { d: rect(0, 0, 300, 300) },
      { d: poly(105, 228, 195, 228, 182, 292, 118, 292) },
      { d: rect(144, 130, 12, 100, 6) },
      { d: petal(118, 196, 0, -30, 26, 12) },
      { d: petal(184, 180, 0, 210, 26, 12) },
      ...[0, 60, 120, 180, 240, 300].map((a) => ({ d: petal(150, 100, 44, a, 30, 20) })),
      { d: ell(150, 100, 26) },
    ],
  },
  {
    id: 'butterfly',
    title: 'pic_butterfly',
    emoji: '🦋',
    regions: [
      { d: rect(0, 0, 300, 300) },
      { d: 'M146 140 Q90 30 40 70 Q10 120 70 160 Q110 170 146 150 Z' },
      { d: 'M154 140 Q210 30 260 70 Q290 120 230 160 Q190 170 154 150 Z' },
      { d: 'M146 160 Q80 170 70 220 Q90 262 140 220 Z' },
      { d: 'M154 160 Q220 170 230 220 Q210 262 160 220 Z' },
      { d: ell(84, 100, 18) },
      { d: ell(216, 100, 18) },
      { d: ell(150, 165, 10, 60) },
      { d: ell(150, 100, 13) },
    ],
    lines: ['M144 90 Q130 60 118 54', 'M156 90 Q170 60 182 54'],
  },
  {
    id: 'car',
    title: 'pic_car',
    emoji: '🚗',
    regions: [
      { d: rect(0, 0, 300, 230) },
      { d: rect(0, 230, 300, 70) },
      { d: 'M30 200 V160 Q30 140 52 138 L90 134 L118 90 Q124 82 136 82 H200 Q212 82 220 92 L246 134 Q272 138 272 160 V200 Z' },
      { d: poly(128, 96, 162, 96, 162, 132, 104, 132) },
      { d: poly(172, 96, 206, 96, 228, 132, 172, 132) },
      { d: ell(256, 160, 10, 8) },
      { d: ell(86, 206, 28) },
      { d: ell(86, 206, 12) },
      { d: ell(216, 206, 28) },
      { d: ell(216, 206, 12) },
    ],
    lines: ['M40 260 H90 M130 260 H180 M220 260 H270'],
  },
  {
    id: 'rocket',
    title: 'pic_rocket',
    emoji: '🚀',
    regions: [
      { d: rect(0, 0, 300, 300) },
      { d: 'M130 222 Q150 300 170 222 Z' },
      { d: poly(112, 170, 76, 226, 112, 216) },
      { d: poly(188, 170, 224, 226, 188, 216) },
      { d: 'M112 220 V110 Q112 50 150 20 Q188 50 188 110 V220 Z' },
      { d: 'M122 70 Q150 30 178 70 Z' },
      { d: ell(150, 120, 22) },
      { d: ell(150, 120, 13) },
      { d: ell(50, 60, 6) },
      { d: ell(250, 110, 8) },
      { d: ell(60, 200, 5) },
    ],
  },
  {
    id: 'cat',
    title: 'pic_cat',
    emoji: '🐱',
    regions: [
      { d: rect(0, 0, 300, 300) },
      { d: 'M210 250 Q280 240 262 170 Q256 150 244 160 Q258 220 200 230 Z' },
      { d: ell(150, 220, 70, 56) },
      { d: poly(86, 92, 94, 30, 136, 70) },
      { d: poly(214, 92, 206, 30, 164, 70) },
      { d: ell(150, 120, 74, 62) },
      { d: ell(122, 112, 12, 15) },
      { d: ell(178, 112, 12, 15) },
      { d: poly(140, 138, 160, 138, 150, 150) },
      { d: ell(118, 266, 22, 12) },
      { d: ell(182, 266, 22, 12) },
    ],
    lines: ['M150 150 Q140 164 128 158 M150 150 Q160 164 172 158', 'M70 132 H112 M72 146 L112 140 M230 132 H188 M228 146 L188 140'],
  },
  {
    id: 'sun',
    title: 'pic_sun',
    emoji: '☀️',
    regions: [
      { d: rect(0, 0, 300, 300) },
      ...Array.from({ length: 8 }, (_, i) => ({ d: petal(150, 150, 98, i * 45, 22, 12) })),
      { d: ell(150, 150, 66) },
      { d: ell(126, 140, 9), fixed: '#2B2D42' },
      { d: ell(174, 140, 9), fixed: '#2B2D42' },
      { d: 'M118 168 Q150 200 182 168 Z' },
    ],
  },
];

export const PALETTE = [
  '#FF5A5F', '#FF8A3D', '#FFC93C', '#FFE873', '#34C77B', '#9BE36A', '#22C3B5', '#3DA9FC',
  '#1B4FD6', '#8B6CFF', '#FF5DA2', '#FFB3C7', '#8D5A3B', '#C9A27E', '#2B2D42', '#FFFFFF',
];
