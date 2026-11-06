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

/* ---------- yordamchi o'zgartirishlar ---------- */
const map = (st: Stroke[], f: (q: Pt) => Pt) => st.map((s) => s.map(f));
/** Harfni pastroq siqish — tepasida nuqta/belgi uchun joy qoladi */
const lower = (st: Stroke[]) => map(st, (q) => ({ x: q.x, y: 24 + (q.y - 10) * 0.82 }));
/** Harfni yuqoriroq siqish — pastida dumcha uchun joy qoladi */
const raise = (st: Stroke[]) => map(st, (q) => ({ x: q.x, y: 6 + (q.y - 10) * 0.84 }));
const dot = (x: number, y: number): Stroke => L(x, y, x, y + 4);
const DOTS2: Stroke[] = [dot(38, 6), dot(62, 6)];
const BREVE: Stroke = p().arc(50, 6, 13, 8, 170, 10).pts;
const CEDILLA: Stroke = p().move(50, 80).line(52, 88).arc(46, 92, 7, 5, -20, 140).pts;

/* ---------- lotin harflari ---------- */
const B_ST: Stroke[] = [
  L(30, 10, 30, 90),
  p().move(30, 10).line(52, 10).arc(52, 30, 20, 20, -90, 90).line(30, 50).pts,
  p().move(30, 50).line(55, 50).arc(55, 70, 20, 20, -90, 90).line(30, 90).pts,
];
const P_ST: Stroke[] = [L(30, 10, 30, 90), p().move(30, 10).line(52, 10).arc(52, 30, 20, 20, -90, 90).line(30, 50).pts];
const A_ST: Stroke[] = [L(50, 10, 20, 90), L(50, 10, 80, 90), L(32, 62, 68, 62)];
const E_ST: Stroke[] = [p().move(72, 10).line(30, 10).line(30, 90).line(72, 90).pts, L(30, 50, 64, 50)];
const K_ST: Stroke[] = [L(30, 10, 30, 90), L(72, 10, 30, 56), L(44, 44, 74, 90)];
const M_ST: Stroke[] = [p().move(20, 90).line(22, 10).line(50, 62).line(78, 10).line(80, 90).pts];
const T_ST: Stroke[] = [L(20, 10, 80, 10), L(50, 10, 50, 90)];
const X_ST: Stroke[] = [L(25, 10, 75, 90), L(75, 10, 25, 90)];
const U_ST: Stroke[] = [p().move(28, 10).line(28, 62).arc(50, 62, 22, 28, 180, 0).line(72, 10).pts];
const I_ST: Stroke[] = [L(50, 10, 50, 90), L(34, 10, 66, 10), L(34, 90, 66, 90)];
const THREE: Stroke[] = [p().arc(50, 30, 22, 20, -160, 90).pts, p().move(48, 50).arc(50, 70, 24, 20, -90, 160).pts];

export const STROKES: Record<string, Stroke[]> = {
  A: A_ST,
  B: B_ST,
  C: C_STROKES,
  D: [L(28, 10, 28, 90), p().move(28, 10).line(44, 10).arc(44, 50, 30, 40, -90, 90).line(28, 90).pts],
  E: E_ST,
  F: [p().move(72, 10).line(32, 10).line(32, 90).pts, L(32, 50, 64, 50)],
  G: G(),
  H: H_STROKES,
  I: I_ST,
  J: [p().move(66, 10).line(66, 66).arc(46, 66, 20, 24, 0, 170).pts],
  K: K_ST,
  L: [p().move(32, 10).line(32, 90).line(72, 90).pts],
  M: M_ST,
  N: N_STROKES,
  O: O(),
  P: P_ST,
  Q: [...O(), L(58, 70, 82, 96)],
  R: [...P_ST, L(48, 50, 74, 90)],
  S: S_STROKES,
  T: T_ST,
  U: U_ST,
  V: [p().move(22, 10).line(50, 90).line(78, 10).pts],
  W: [p().move(12, 10).line(30, 90).line(50, 34).line(70, 90).line(88, 10).pts],
  X: X_ST,
  Y: [L(24, 10, 50, 50), p().move(76, 10).line(50, 50).line(50, 90).pts],
  Z: [p().move(24, 10).line(76, 10).line(24, 90).line(76, 90).pts],
  // o'zbek (amaldagi)
  "O'": [...O(42, 28), APOS],
  "G'": [...G(46).map((s) => s.map((q) => ({ x: q.x * 0.92, y: q.y }))), APOS],
  Sh: pair(S_STROKES, H_STROKES),
  Ch: pair(C_STROKES, H_STROKES),
  Ng: pair(N_STROKES, G()),
  // diakritik harflar (o'zbek yangi alifbosi, turk, nemis)
  Ö: [...lower(O()), ...DOTS2],
  Ü: [...lower(U_ST), ...DOTS2],
  Ä: [...lower(A_ST), ...DOTS2],
  Ğ: [...lower(G()), BREVE],
  Ş: [...raise(S_STROKES), CEDILLA],
  Ç: [...raise(C_STROKES), CEDILLA],
  İ: [...lower(I_ST), dot(50, 4)],
  ß: [p().move(30, 90).line(30, 28).arc(48, 28, 18, 18, 180, 360).line(50, 48).arc(52, 68, 20, 20, -90, 90).line(40, 90).pts],
  // kirill
  А: A_ST,
  Б: [p().move(70, 10).line(30, 10).line(30, 90).line(52, 90).arc(52, 70, 20, 20, 90, -90).line(30, 50).pts],
  В: B_ST,
  Г: [p().move(72, 10).line(30, 10).line(30, 90).pts],
  Д: [p().move(38, 10).line(72, 10).line(72, 76).pts, L(38, 10, 28, 76), p().move(18, 92).line(18, 76).line(82, 76).line(82, 92).pts],
  Е: E_ST,
  Ё: [...lower(E_ST), ...DOTS2],
  Ж: [L(50, 10, 50, 90), p().move(18, 10).line(48, 50).line(18, 90).pts, p().move(82, 10).line(52, 50).line(82, 90).pts],
  З: THREE,
  И: [p().move(28, 10).line(28, 90).line(72, 10).line(72, 90).pts],
  Й: [...lower([p().move(28, 10).line(28, 90).line(72, 10).line(72, 90).pts]), BREVE],
  К: K_ST,
  Л: [p().move(20, 90).line(40, 10).line(76, 10).line(76, 90).pts],
  М: M_ST,
  Н: H_STROKES,
  О: O(),
  П: [p().move(28, 90).line(28, 10).line(72, 10).line(72, 90).pts],
  Р: P_ST,
  С: C_STROKES,
  Т: T_ST,
  У: [L(24, 10, 50, 58), p().move(76, 10).line(40, 90).pts],
  Ф: [p().arc(50, 46, 32, 22, -90, -450).pts, L(50, 8, 50, 92)],
  Х: X_ST,
  Ц: [p().move(28, 10).line(28, 80).line(80, 80).line(80, 94).pts, L(72, 10, 72, 80)],
  Ч: [p().move(28, 10).line(28, 40).arc(48, 40, 20, 14, 180, 90).line(72, 54).pts, L(72, 10, 72, 90)],
  Ш: [p().move(22, 10).line(22, 90).line(78, 90).line(78, 10).pts, L(50, 10, 50, 90)],
  Щ: [p().move(22, 10).line(22, 82).line(82, 82).line(82, 96).pts, L(50, 10, 50, 82), L(76, 10, 76, 82)],
  Ъ: [p().move(16, 10).line(34, 10).line(34, 90).line(56, 90).arc(56, 70, 20, 20, 90, -90).line(34, 50).pts],
  Ы: [p().move(24, 10).line(24, 90).line(42, 90).arc(42, 70, 18, 20, 90, -90).line(24, 50).pts, L(80, 10, 80, 90)],
  Ь: [p().move(32, 10).line(32, 90).line(54, 90).arc(54, 70, 20, 20, 90, -90).line(32, 50).pts],
  Э: [p().arc(46, 50, 30, 40, -135, 135).pts, L(34, 50, 76, 50)],
  Ю: [L(18, 10, 18, 90), L(18, 50, 36, 50), p().arc(62, 50, 22, 40, -90, -450).pts],
  Я: [p().move(70, 90).line(70, 10).line(48, 10).arc(48, 30, 20, 20, -90, -270).line(70, 50).pts, L(52, 50, 26, 90)],
};

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
