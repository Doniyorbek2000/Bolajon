import type { Href } from 'expo-router';
import type { TintName } from '@/theme';
import type { DictKey } from '@/i18n';
import type { Lang, UzScript } from '@/i18n/langs';
import { uzText } from '@/i18n/translate';
import { GameCat, L6, MINI_GAMES } from './miniGames';

export type GameInfo = {
  id: string;
  title: DictKey | L6;
  subtitle?: DictKey;
  cat: GameCat;
  emoji: string;
  tint: TintName;
  href: Href;
  free: boolean;
  minAge: number;
};

export const GAMES: GameInfo[] = [
  { id: 'letters', cat: 'letters', title: 'g_letters', subtitle: 'g_letters_s', emoji: '✍️', tint: 'pink', href: '/games/trace?kind=letters', free: true, minAge: 3 },
  { id: 'numbers', cat: 'math', title: 'g_numbers', subtitle: 'g_numbers_s', emoji: '🔢', tint: 'blue', href: '/games/trace?kind=numbers', free: true, minAge: 3 },
  { id: 'coloring', cat: 'art', title: 'g_coloring', subtitle: 'g_coloring_s', emoji: '🎨', tint: 'orange', href: '/games/coloring', free: true, minAge: 2 },
  { id: 'memory', cat: 'art', title: 'g_memory', subtitle: 'g_memory_s', emoji: '🧠', tint: 'purple', href: '/games/memory', free: true, minAge: 3 },
  { id: 'math', cat: 'math', title: 'g_math', subtitle: 'g_math_s', emoji: '➕', tint: 'orange', href: '/games/math', free: true, minAge: 4 },
  { id: 'simon', cat: 'art', title: 'g_simon', subtitle: 'g_simon_s', emoji: '🚦', tint: 'red', href: '/games/simon', free: false, minAge: 3 },
  { id: 'counting', cat: 'math', title: 'g_counting', subtitle: 'g_counting_s', emoji: '🍎', tint: 'green', href: '/games/counting', free: false, minAge: 3 },
  { id: 'shapes', cat: 'logic', title: 'g_shapes', subtitle: 'g_shapes_s', emoji: '🔷', tint: 'teal', href: '/games/shapes', free: false, minAge: 2 },
  { id: 'odd', cat: 'logic', title: 'g_odd', subtitle: 'g_odd_s', emoji: '🤔', tint: 'yellow', href: '/games/odd', free: false, minAge: 4 },
  { id: 'pattern', cat: 'logic', title: 'g_pattern', subtitle: 'g_pattern_s', emoji: '🧩', tint: 'red', href: '/games/pattern', free: false, minAge: 4 },
  { id: 'compare', cat: 'math', title: 'g_compare', subtitle: 'g_compare_s', emoji: '⚖️', tint: 'blue', href: '/games/compare', free: false, minAge: 3 },
  { id: 'big', cat: 'logic', title: 'g_big', subtitle: 'g_big_s', emoji: '🐘', tint: 'purple', href: '/games/big', free: false, minAge: 2 },
  { id: 'food', cat: 'world', title: 'g_food', subtitle: 'g_food_s', emoji: '🥕', tint: 'teal', href: '/games/food', free: false, minAge: 2 },
  { id: 'draw', cat: 'art', title: 'g_draw', subtitle: 'g_draw_s', emoji: '🖍️', tint: 'blue', href: '/games/draw', free: false, minAge: 2 },
  { id: 'animals', cat: 'world', title: 'g_animals', subtitle: 'g_animals_s', emoji: '🦁', tint: 'green', href: '/games/animals', free: false, minAge: 2 },
  // xotira o'yinining boshqa to'plamlari
  { id: 'memfruit', title: { uz: 'Xotira: mevalar', ru: 'Память: фрукты', en: 'Memory: fruits', tr: 'Hafıza: meyveler', de: 'Memory: Obst', ar: 'الذاكرة: فواكه' }, cat: 'art', emoji: '🍓', tint: 'red', href: '/games/memory?deck=fruits', free: false, minAge: 3 },
  { id: 'memcar', title: { uz: 'Xotira: transport', ru: 'Память: транспорт', en: 'Memory: vehicles', tr: 'Hafıza: taşıtlar', de: 'Memory: Fahrzeuge', ar: 'الذاكرة: مركبات' }, cat: 'art', emoji: '🚒', tint: 'blue', href: '/games/memory?deck=transport', free: false, minAge: 3 },
  { id: 'memabc', title: { uz: 'Xotira: harflar', ru: 'Память: буквы', en: 'Memory: letters', tr: 'Hafıza: harfler', de: 'Memory: Buchstaben', ar: 'الذاكرة: حروف' }, cat: 'art', emoji: '🔠', tint: 'purple', href: '/games/memory?deck=letters', free: false, minAge: 4 },
  ...MINI_GAMES.map((g) => ({ id: g.id, title: g.title, cat: g.cat, emoji: g.emoji, tint: g.tint, href: `/games/q/${g.id}` as Href, free: g.free, minAge: g.minAge })),
];

export const GAME_CATS: { id: GameCat; title: DictKey }[] = [
  { id: 'math', title: 'cat_math' },
  { id: 'letters', title: 'cat_letters' },
  { id: 'logic', title: 'cat_logic' },
  { id: 'world', title: 'cat_world' },
  { id: 'art', title: 'cat_art' },
];

/** O'yin nomi tanlangan tilda */
export function gameTitle(g: GameInfo, t: (k: DictKey) => string, lang: Lang, script: UzScript) {
  if (typeof g.title === 'string') return t(g.title);
  return lang === 'uz' ? uzText(g.title.uz, script) : g.title[lang];
}
