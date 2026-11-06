/**
 * Ilova sozlamalari. Narx va kontent manzili shu yerda o'zgartiriladi.
 */
export const APP_NAME = 'Bolajon';

export type PlanId = 'monthly' | 'yearly';

export const SUBSCRIPTION = {
  currency: "so'm",
  /** Bepul sinov muddati (kun) */
  trialDays: 3,
  plans: {
    /** Oylik obuna: 15 000 so'm */
    monthly: { price: 15_000, days: 30, productId: 'uz.bolajon.premium.monthly' },
    /** Yillik obuna: 99 000 so'm (oyiga ~8 250 so'm) */
    yearly: { price: 99_000, days: 365, productId: 'uz.bolajon.premium.yearly' },
  } satisfies Record<PlanId, { price: number; days: number; productId: string }>,
};

/** Yillik tarifdagi tejash foizi (12 oylik narxga nisbatan) */
export const YEARLY_SAVING = Math.round((1 - SUBSCRIPTION.plans.yearly.price / (SUBSCRIPTION.plans.monthly.price * 12)) * 100);

/**
 * Masofaviy video katalog (JSON). Bo'sh bo'lsa, ilova ichidagi katalog ishlatiladi.
 * Format: content/catalog.example.json
 */
export const REMOTE_CATALOG_URL = process.env.EXPO_PUBLIC_CATALOG_URL ?? '';
