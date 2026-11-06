/**
 * Ilova sozlamalari. Narx va kontent manzili shu yerda o'zgartiriladi.
 */
export const APP_NAME = 'Bolajon';

export type Tier = 'standard' | 'pro';
export type Period = 'monthly' | 'yearly';
export type PlanId = `${Tier}_${Period}`;
/** Foydalanuvchining joriy darajasi */
export type Access = 'free' | Tier;

type Plan = { tier: Tier; period: Period; price: number; days: number; productId: string };

export const SUBSCRIPTION = {
  currency: "so'm",
  /** Bepul sinov muddati (kun) — Standard darajasida */
  trialDays: 3,
  plans: {
    standard_monthly: { tier: 'standard', period: 'monthly', price: 15_000, days: 30, productId: 'uz.bolajon.standard.monthly' },
    standard_yearly: { tier: 'standard', period: 'yearly', price: 99_000, days: 365, productId: 'uz.bolajon.standard.yearly' },
    pro_monthly: { tier: 'pro', period: 'monthly', price: 24_000, days: 30, productId: 'uz.bolajon.pro.monthly' },
    pro_yearly: { tier: 'pro', period: 'yearly', price: 149_000, days: 365, productId: 'uz.bolajon.pro.yearly' },
  } satisfies Record<PlanId, Plan>,
};

export const planId = (tier: Tier, period: Period) => `${tier}_${period}` as PlanId;

/** Yillik tarifdagi tejash foizi (12 oylik narxga nisbatan) */
export const yearlySaving = (tier: Tier) =>
  Math.round((1 - SUBSCRIPTION.plans[planId(tier, 'yearly')].price / (SUBSCRIPTION.plans[planId(tier, 'monthly')].price * 12)) * 100);

/** Vazifalar: 12 olam × 90 daraja = 1080. Har bir olamda ochiq darajalar soni: */
export const LEVELS_PER_WORLD = 90;
export const TASK_LEVELS: Record<Access, number> = { free: 4, standard: 42, pro: LEVELS_PER_WORLD };

/**
 * Masofaviy video katalog (JSON). Bo'sh bo'lsa, ilova ichidagi katalog ishlatiladi.
 * Format: content/catalog.example.json
 */
export const REMOTE_CATALOG_URL = process.env.EXPO_PUBLIC_CATALOG_URL ?? '';
