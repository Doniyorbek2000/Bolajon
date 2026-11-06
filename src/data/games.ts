import type { Href } from 'expo-router';
import type { TintName } from '@/theme';

export type GameInfo = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  tint: TintName;
  href: Href;
  free: boolean;
  minAge: number;
};

export const GAMES: GameInfo[] = [
  { id: 'letters', title: 'Harflarni yozamiz', subtitle: 'Alifbo', emoji: '✍️', tint: 'pink', href: '/games/trace?kind=letters', free: true, minAge: 3 },
  { id: 'numbers', title: 'Raqamlarni yozamiz', subtitle: '0 – 9', emoji: '🔢', tint: 'blue', href: '/games/trace?kind=numbers', free: true, minAge: 3 },
  { id: 'coloring', title: "Bo'yash", subtitle: 'Rasmlar', emoji: '🎨', tint: 'orange', href: '/games/coloring', free: true, minAge: 2 },
  { id: 'memory', title: 'Xotira', subtitle: 'Juftini top', emoji: '🧠', tint: 'purple', href: '/games/memory', free: true, minAge: 3 },
  { id: 'counting', title: 'Sanaymiz', subtitle: '1 dan 10 gacha', emoji: '🍎', tint: 'green', href: '/games/counting', free: false, minAge: 3 },
  { id: 'shapes', title: 'Shakl va rang', subtitle: 'Topib ol', emoji: '🔷', tint: 'teal', href: '/games/shapes', free: false, minAge: 2 },
  { id: 'odd', title: 'Ortiqchasi qaysi?', subtitle: 'Mantiq', emoji: '🤔', tint: 'yellow', href: '/games/odd', free: false, minAge: 4 },
  { id: 'pattern', title: 'Keyingisi nima?', subtitle: 'Ketma-ketlik', emoji: '🧩', tint: 'red', href: '/games/pattern', free: false, minAge: 4 },
  { id: 'draw', title: 'Rasm chizamiz', subtitle: 'Erkin ijod', emoji: '🖍️', tint: 'blue', href: '/games/draw', free: false, minAge: 2 },
  { id: 'animals', title: 'Hayvonlar', subtitle: 'Nomini o\'rgan', emoji: '🦁', tint: 'green', href: '/games/animals', free: false, minAge: 2 },
];
