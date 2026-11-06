import type { Href } from 'expo-router';
import type { TintName } from '@/theme';
import type { DictKey } from '@/i18n';

export type GameInfo = {
  id: string;
  title: DictKey;
  subtitle: DictKey;
  emoji: string;
  tint: TintName;
  href: Href;
  free: boolean;
  minAge: number;
};

export const GAMES: GameInfo[] = [
  { id: 'letters', title: 'g_letters', subtitle: 'g_letters_s', emoji: '✍️', tint: 'pink', href: '/games/trace?kind=letters', free: true, minAge: 3 },
  { id: 'numbers', title: 'g_numbers', subtitle: 'g_numbers_s', emoji: '🔢', tint: 'blue', href: '/games/trace?kind=numbers', free: true, minAge: 3 },
  { id: 'coloring', title: 'g_coloring', subtitle: 'g_coloring_s', emoji: '🎨', tint: 'orange', href: '/games/coloring', free: true, minAge: 2 },
  { id: 'memory', title: 'g_memory', subtitle: 'g_memory_s', emoji: '🧠', tint: 'purple', href: '/games/memory', free: true, minAge: 3 },
  { id: 'counting', title: 'g_counting', subtitle: 'g_counting_s', emoji: '🍎', tint: 'green', href: '/games/counting', free: false, minAge: 3 },
  { id: 'shapes', title: 'g_shapes', subtitle: 'g_shapes_s', emoji: '🔷', tint: 'teal', href: '/games/shapes', free: false, minAge: 2 },
  { id: 'odd', title: 'g_odd', subtitle: 'g_odd_s', emoji: '🤔', tint: 'yellow', href: '/games/odd', free: false, minAge: 4 },
  { id: 'pattern', title: 'g_pattern', subtitle: 'g_pattern_s', emoji: '🧩', tint: 'red', href: '/games/pattern', free: false, minAge: 4 },
  { id: 'draw', title: 'g_draw', subtitle: 'g_draw_s', emoji: '🖍️', tint: 'blue', href: '/games/draw', free: false, minAge: 2 },
  { id: 'animals', title: 'g_animals', subtitle: 'g_animals_s', emoji: '🦁', tint: 'green', href: '/games/animals', free: false, minAge: 2 },
];
