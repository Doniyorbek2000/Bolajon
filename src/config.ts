/**
 * Ilova sozlamalari. Narx va kontent manzili shu yerda o'zgartiriladi.
 */
export const APP_NAME = 'Bolajon';

export const SUBSCRIPTION = {
  /** Oylik obuna narxi (so'm) */
  monthlyPrice: 10_000,
  currency: "so'm",
  /** Bepul sinov muddati (kun) */
  trialDays: 3,
  /** Do'kon mahsulot identifikatori (App Store / Google Play) */
  productId: 'uz.bolajon.premium.monthly',
};

/**
 * Masofaviy video katalog (JSON). Bo'sh bo'lsa, ilova ichidagi katalog ishlatiladi.
 * Format: content/catalog.example.json
 */
export const REMOTE_CATALOG_URL = process.env.EXPO_PUBLIC_CATALOG_URL ?? '';
