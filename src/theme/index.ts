import { useWindowDimensions } from 'react-native';

export const colors = {
  bg: '#FFF6E5',
  bgSoft: '#FFFBF3',
  card: '#FFFFFF',
  ink: '#2B2D42',
  inkSoft: '#6B6F8A',
  line: '#F0E3CC',

  orange: '#FF8A3D',
  orangeDark: '#E86A1C',
  yellow: '#FFC93C',
  yellowDark: '#E8A800',
  green: '#34C77B',
  greenDark: '#1E9E5C',
  blue: '#3DA9FC',
  blueDark: '#1B83D6',
  purple: '#8B6CFF',
  purpleDark: '#6847E8',
  pink: '#FF5DA2',
  pinkDark: '#E23A82',
  red: '#FF5A5F',
  redDark: '#D93A40',
  teal: '#22C3B5',
  tealDark: '#0E9A8E',
};

export type Tint = { base: string; dark: string; soft: string };

export const tints = {
  orange: { base: colors.orange, dark: colors.orangeDark, soft: '#FFE7D6' },
  yellow: { base: colors.yellow, dark: colors.yellowDark, soft: '#FFF3CC' },
  green: { base: colors.green, dark: colors.greenDark, soft: '#D7F6E5' },
  blue: { base: colors.blue, dark: colors.blueDark, soft: '#D8EEFF' },
  purple: { base: colors.purple, dark: colors.purpleDark, soft: '#E8E1FF' },
  pink: { base: colors.pink, dark: colors.pinkDark, soft: '#FFE0EE' },
  red: { base: colors.red, dark: colors.redDark, soft: '#FFE0E1' },
  teal: { base: colors.teal, dark: colors.tealDark, soft: '#D3F5F2' },
} satisfies Record<string, Tint>;

export type TintName = keyof typeof tints;

export const fonts = {
  regular: 'Nunito_600SemiBold',
  bold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
};

export const radius = { sm: 14, md: 22, lg: 30, xl: 40 };

/**
 * Ekran o'lchamiga moslashuv: telefon, katta telefon, planshet (iPad).
 */
export function useLayout() {
  const { width, height } = useWindowDimensions();
  const short = Math.min(width, height);
  const isTablet = short >= 600;
  const isLandscape = width > height;
  const scale = isTablet ? Math.min(1.45, short / 600 + 0.25) : Math.max(0.85, Math.min(1.1, width / 390));
  const gutter = isTablet ? 32 : 16;
  const maxContent = isTablet ? 1100 : 600;
  const contentWidth = Math.min(width, maxContent) - gutter * 2;
  const columns = isTablet ? (isLandscape ? 4 : 3) : width >= 700 ? 3 : 2;
  return { width, height, isTablet, isLandscape, scale, gutter, contentWidth, columns };
}

export const fs = (size: number, scale: number) => Math.round(size * scale);
