import { Platform } from 'react-native';
import { PlanId, SUBSCRIPTION } from '@/config';

export type PaymentMethod = 'appstore' | 'googleplay' | 'click' | 'payme';

export type PurchaseResult = { ok: true; transactionId: string } | { ok: false; error: string };

export const METHODS: { id: PaymentMethod; title: string; emoji: string }[] =
  Platform.OS === 'ios'
    ? [{ id: 'appstore', title: 'App Store', emoji: '' }]
    : Platform.OS === 'android'
      ? [{ id: 'googleplay', title: 'Google Play', emoji: '▶️' }]
      : [
          { id: 'click', title: 'Click', emoji: '💳' },
          { id: 'payme', title: 'Payme', emoji: '💠' },
        ];

/**
 * To'lov xizmati.
 *
 * App Store va Google Play qoidalariga ko'ra ilova ichidagi raqamli obuna faqat
 * do'konning o'z to'lov tizimi orqali sotiladi (iOS — StoreKit, Android — Play Billing).
 * Ishlab chiqarish uchun `react-native-purchases` (RevenueCat) yoki `expo-iap` ulang va
 * `SUBSCRIPTION.plans` dagi mahsulotlarni do'konlarda yarating: oylik 15 000, yillik 99 000 so'm.
 * Web-versiyada Click / Payme orqali to'lovni serveringiz tasdiqlashi kerak.
 *
 * Hozirgi realizatsiya — DEMO: haqiqiy pul yechilmaydi.
 */
export async function purchasePlan(plan: PlanId, method: PaymentMethod): Promise<PurchaseResult> {
  await new Promise((r) => setTimeout(r, 1200));
  return { ok: true, transactionId: `demo-${method}-${SUBSCRIPTION.plans[plan].productId}-${Date.now()}` };
}

export async function restorePurchases(): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 800));
  return false;
}
