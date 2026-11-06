/**
 * Harf va raqamlarning yozilish yo'nalishi (chiziqlar ketma-ketligi).
 * Koordinatalar 100×100 maydonda, y pastga qarab o'sadi.
 */
export type Pt = { x: number; y: number };
export type Stroke = Pt[];

const STEP = 3;

class P {
  pts: Pt[] = [];
  move(x: number, y: number) {
    this.pts.push({ x, y });
    return this;
  }
  line(x: number, y: number) {
    const last = this.pts[this.pts.length - 1];
    if (!last) return this.move(x, y);
    const d = Math.hypot(x - last.x, y - last.y);
    const n = Math.max(1, Math.round(d / STEP));
    for (let i = 1; i <= n; i++) this.pts.push({ x: last.x + ((x - last.x) * i) / n, y: last.y + ((y - last.y) * i) / n });
    return this;
  }
  /** Ellips yoyi. Burchaklar gradusda: 0 — o'ng, 90 — past, -90 — tepa. */
  arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number) {
    const len = (Math.abs(a1 - a0) * Math.PI * (rx + ry)) / 360;
    const n = Math.max(2, Math.round(len / STEP));
    for (let i = 0; i <= n; i++) {
      const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
      const p = { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
      if (i === 0 && this.pts.length) this.line(p.x, p.y);
      else this.pts.push(p);
    }
    return this;
  }
}

const L = (x1: number, y1: number, x2: number, y2: number) => new P().move(x1, y1).line(x2, y2).pts;
const p = () => new P();

const O = (cx = 50, rx = 30) => [p().arc(cx, 50, rx, 40, -90, -450).pts];
const G = (cx = 52) => [p().arc(cx, 50, 32, 40, -45, -360).pts, L(cx + 6, 52, cx + 32, 52)];
const APOS: Stroke = L(84, 8, 79, 24);

/** Ikki harfni bitta maydonga joylash (Sh, Ch, Ng uchun). */
function pair(a: Stroke[], b: Stroke[]): Stroke[] {
  const fit = (s: Stroke[], off: number) => s.map((st) => st.map((q) => ({ x: off + q.x * 0.5, y: 20 + q.y * 0.75 })));
  return [...fit(a, 0), ...fit(b, 50)];
}

const S_STROKES: Stroke[] = [p().arc(50, 30, 24, 20, -20, -270).arc(50, 70, 26, 20, -90, 160).pts];
const H_STROKES: Stroke[] = [L(28, 10, 28, 90), L(72, 10, 72, 90), L(28, 50, 72, 50)];
const C_STROKES: Stroke[] = [p().arc(54, 50, 30, 40, -45, -315).pts];
const N_STROKES: Stroke[] = [p().move(28, 90).line(28, 10).line(72, 90).line(72, 10).pts];

export type Glyph = { id: string; label: string; word: string; emoji: string; strokes: Stroke[] };

export const LETTERS: Glyph[] = [
  { id: 'A', label: 'A', word: 'Ari', emoji: '🐝', strokes: [L(50, 10, 20, 90), L(50, 10, 80, 90), L(32, 62, 68, 62)] },
  {
    id: 'B',
    label: 'B',
    word: 'Baliq',
    emoji: '🐟',
    strokes: [
      L(30, 10, 30, 90),
      p().move(30, 10).line(52, 10).arc(52, 30, 20, 20, -90, 90).line(30, 50).pts,
      p().move(30, 50).line(55, 50).arc(55, 70, 20, 20, -90, 90).line(30, 90).pts,
    ],
  },
  {
    id: 'D',
    label: 'D',
    word: 'Daraxt',
    emoji: '🌳',
    strokes: [L(28, 10, 28, 90), p().move(28, 10).line(44, 10).arc(44, 50, 30, 40, -90, 90).line(28, 90).pts],
  },
  { id: 'E', label: 'E', word: 'Echki', emoji: '🐐', strokes: [p().move(72, 10).line(30, 10).line(30, 90).line(72, 90).pts, L(30, 50, 64, 50)] },
  { id: 'F', label: 'F', word: 'Fil', emoji: '🐘', strokes: [p().move(72, 10).line(32, 10).line(32, 90).pts, L(32, 50, 64, 50)] },
  { id: 'G', label: 'G', word: 'Gul', emoji: '🌸', strokes: G() },
  { id: 'H', label: 'H', word: 'Handalak', emoji: '🍈', strokes: H_STROKES },
  { id: 'I', label: 'I', word: 'It', emoji: '🐕', strokes: [L(50, 10, 50, 90), L(34, 10, 66, 10), L(34, 90, 66, 90)] },
  { id: 'J', label: 'J', word: "Jo'ja", emoji: '🐥', strokes: [p().move(66, 10).line(66, 66).arc(46, 66, 20, 24, 0, 170).pts] },
  { id: 'K', label: 'K', word: 'Kitob', emoji: '📚', strokes: [L(30, 10, 30, 90), L(72, 10, 30, 56), L(44, 44, 74, 90)] },
  { id: 'L', label: 'L', word: 'Limon', emoji: '🍋', strokes: [p().move(32, 10).line(32, 90).line(72, 90).pts] },
  { id: 'M', label: 'M', word: 'Mushuk', emoji: '🐱', strokes: [p().move(20, 90).line(22, 10).line(50, 62).line(78, 10).line(80, 90).pts] },
  { id: 'N', label: 'N', word: 'Non', emoji: '🍞', strokes: N_STROKES },
  { id: 'O', label: 'O', word: 'Olma', emoji: '🍎', strokes: O() },
  { id: 'P', label: 'P', word: 'Poyezd', emoji: '🚂', strokes: [L(30, 10, 30, 90), p().move(30, 10).line(52, 10).arc(52, 30, 20, 20, -90, 90).line(30, 50).pts] },
  { id: 'Q', label: 'Q', word: 'Quyosh', emoji: '☀️', strokes: [...O(), L(58, 70, 82, 96)] },
  {
    id: 'R',
    label: 'R',
    word: 'Raketa',
    emoji: '🚀',
    strokes: [L(30, 10, 30, 90), p().move(30, 10).line(52, 10).arc(52, 30, 20, 20, -90, 90).line(30, 50).pts, L(48, 50, 74, 90)],
  },
  { id: 'S', label: 'S', word: 'Sabzi', emoji: '🥕', strokes: S_STROKES },
  { id: 'T', label: 'T', word: 'Tuxum', emoji: '🥚', strokes: [L(20, 10, 80, 10), L(50, 10, 50, 90)] },
  { id: 'U', label: 'U', word: 'Uy', emoji: '🏠', strokes: [p().move(28, 10).line(28, 62).arc(50, 62, 22, 28, 180, 0).line(72, 10).pts] },
  { id: 'V', label: 'V', word: 'Velosiped', emoji: '🚲', strokes: [p().move(22, 10).line(50, 90).line(78, 10).pts] },
  { id: 'X', label: 'X', word: "Xo'roz", emoji: '🐓', strokes: [L(25, 10, 75, 90), L(75, 10, 25, 90)] },
  { id: 'Y', label: 'Y', word: 'Yulduz', emoji: '⭐', strokes: [L(24, 10, 50, 50), p().move(76, 10).line(50, 50).line(50, 90).pts] },
  { id: 'Z', label: 'Z', word: 'Zebra', emoji: '🦓', strokes: [p().move(24, 10).line(76, 10).line(24, 90).line(76, 90).pts] },
  { id: "O'", label: "O'", word: "O'rdak", emoji: '🦆', strokes: [...O(42, 28), APOS] },
  { id: "G'", label: "G'", word: "G'isht", emoji: '🧱', strokes: [...G(46).map((s) => s.map((q) => ({ x: q.x * 0.92, y: q.y }))), APOS] },
  { id: 'Sh', label: 'Sh', word: 'Sher', emoji: '🦁', strokes: pair(S_STROKES, H_STROKES) },
  { id: 'Ch', label: 'Ch', word: 'Chumoli', emoji: '🐜', strokes: pair(C_STROKES, H_STROKES) },
  { id: 'Ng', label: 'Ng', word: 'Tong', emoji: '🌅', strokes: pair(N_STROKES, G()) },
];

export const NUMBER_WORDS = ['nol', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz', "to'qqiz", "o'n"];

const N_EMOJI = ['🫧', '🍎', '🐥', '🎈', '🌼', '⭐', '🐞', '🍓', '🐟', '🦋'];

export const NUMBERS: Glyph[] = [
  { strokes: [p().arc(50, 50, 26, 40, -90, -450).pts] },
  { strokes: [p().move(34, 26).line(54, 10).line(54, 90).pts, L(36, 90, 72, 90)] },
  { strokes: [p().arc(50, 32, 22, 22, -170, 20).line(26, 90).line(76, 90).pts] },
  { strokes: [p().arc(50, 30, 22, 20, -160, 90).pts, p().move(48, 50).arc(50, 70, 24, 20, -90, 160).pts] },
  { strokes: [p().move(60, 10).line(22, 66).line(80, 66).pts, L(60, 36, 60, 90)] },
  { strokes: [p().move(72, 10).line(34, 10).line(30, 46).arc(50, 66, 24, 24, -125, 150).pts] },
  { strokes: [p().move(68, 14).arc(50, 66, 24, 24, -100, -170).arc(50, 66, 24, 24, -170, -530).pts] },
  { strokes: [p().move(24, 10).line(76, 10).line(40, 90).pts] },
  { strokes: [p().arc(50, 30, 20, 20, 90, -270).arc(50, 70, 24, 20, -90, 270).pts] },
  { strokes: [p().arc(50, 32, 22, 22, 0, -360).line(64, 90).pts] },
].map((g, i) => ({ id: String(i), label: String(i), word: NUMBER_WORDS[i], emoji: N_EMOJI[i], strokes: g.strokes }));

export function strokeToPath(s: Stroke, size: number) {
  const k = size / 100;
  return s.map((q, i) => `${i ? 'L' : 'M'}${(q.x * k).toFixed(1)} ${(q.y * k).toFixed(1)}`).join(' ');
}
