import type { Lang } from './langs';

export const SHAPE_IDS = ['circle', 'square', 'triangle', 'star', 'heart'] as const;
export const COLOR_IDS = ['red', 'blue', 'green', 'yellow', 'purple'] as const;
export type ShapeId = (typeof SHAPE_IDS)[number];
export type ColorId = (typeof COLOR_IDS)[number];

const ci = (c: ColorId) => COLOR_IDS.indexOf(c);
const si = (s: ShapeId) => SHAPE_IDS.indexOf(s);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Qizil doirani top" — har bir tilning grammatikasiga mos savol. */
export function shapeQuestion(lang: Lang, shape: ShapeId, color: ColorId): string {
  const c = ci(color);
  const s = si(shape);
  switch (lang) {
    case 'uz': {
      const col = ['qizil', "ko'k", 'yashil', 'sariq', 'binafsha'][c];
      const sh = ['doira', 'kvadrat', 'uchburchak', 'yulduz', 'yurak'][s];
      return `${cap(col)} ${sh}ni top`;
    }
    case 'en':
      return `Find the ${['red', 'blue', 'green', 'yellow', 'purple'][c]} ${['circle', 'square', 'triangle', 'star', 'heart'][s]}`;
    case 'ru': {
      const gender = ['m', 'm', 'm', 'f', 'n'][s];
      const adj = {
        m: ['красный', 'синий', 'зелёный', 'жёлтый', 'фиолетовый'],
        f: ['красную', 'синюю', 'зелёную', 'жёлтую', 'фиолетовую'],
        n: ['красное', 'синее', 'зелёное', 'жёлтое', 'фиолетовое'],
      }[gender]![c];
      const noun = ['круг', 'квадрат', 'треугольник', 'звезду', 'сердце'][s];
      return `Найди ${adj} ${noun}`;
    }
    case 'de': {
      const masc = s === 0 || s === 3;
      const base = ['rot', 'blau', 'grün', 'gelb', 'lila'][c];
      const adj = base === 'lila' ? 'lila' : masc ? `${base}en` : `${base}e`;
      const noun = ['Kreis', 'Quadrat', 'Dreieck', 'Stern', 'Herz'][s];
      return `Finde ${masc ? 'den' : 'das'} ${adj} ${noun}`;
    }
    case 'tr': {
      const col = ['kırmızı', 'mavi', 'yeşil', 'sarı', 'mor'][c];
      const sh = ['daireyi', 'kareyi', 'üçgeni', 'yıldızı', 'kalbi'][s];
      return `${cap(col)} ${sh} bul`;
    }
    case 'ar': {
      const fem = s === 0 || s === 3;
      const noun = ['الدائرة', 'المربع', 'المثلث', 'النجمة', 'القلب'][s];
      const adj = (fem
        ? ['الحمراء', 'الزرقاء', 'الخضراء', 'الصفراء', 'البنفسجية']
        : ['الأحمر', 'الأزرق', 'الأخضر', 'الأصفر', 'البنفسجي'])[c];
      return `ابحث عن ${noun} ${adj}`;
    }
  }
}
