import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { formatPrice } from '@/components/Premium';
import { Card, Header, KidButton, Screen, Txt } from '@/components/ui';
import { Period, planId, SUBSCRIPTION, Tier, yearlySaving } from '@/config';
import type { DictKey } from '@/i18n';
import { useT } from '@/i18n';
import { METHODS, PaymentMethod, purchasePlan, restorePurchases } from '@/services/payments';
import { useApp } from '@/store/AppStore';
import { colors, radius } from '@/theme';
import { success } from '@/utils/feedback';

const FEATURES: Record<Tier, DictKey[]> = {
  standard: ['featS1', 'featS2', 'featS3', 'featS4', 'featS5'],
  pro: ['featP1', 'featP2', 'featP3', 'featP4', 'featP5'],
};

const TIER_COLORS: Record<Tier, [string, string]> = {
  standard: [colors.green, colors.greenDark],
  pro: ['#8B6CFF', '#5B3FD6'],
};

export default function SubscriptionScreen() {
  const { data, isPremium, access, startTrial, activatePlan, cancelSubscription } = useApp();
  const [tier, setTier] = useState<Tier>(access === 'pro' ? 'pro' : 'standard');
  const [period, setPeriod] = useState<Period>('yearly');
  const [method, setMethod] = useState<PaymentMethod>(METHODS[0].id);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const { t, lang } = useT();
  const locale = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB', tr: 'tr-TR', de: 'de-DE', ar: 'ar' }[lang];
  const until = new Date(data.subscription.activeUntil);
  const tierName = (x: Tier) => (x === 'pro' ? t('tierPro') : t('tierStandard'));
  const plan = planId(tier, period);

  const buy = async () => {
    setBusy(true);
    setMsg(null);
    const res = await purchasePlan(plan, method);
    setBusy(false);
    if (res.ok) {
      activatePlan(plan);
      success();
      setMsg(t('activated'));
    } else setMsg(res.error);
  };

  return (
    <Screen>
      <Header title={t('subTitle')} />

      {/* daraja tanlash */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {(['standard', 'pro'] as const).map((x) => {
          const active = tier === x;
          const [c1, c2] = TIER_COLORS[x];
          return (
            <Pressable key={x} onPress={() => setTier(x)} accessibilityRole="radio" accessibilityState={{ selected: active }} style={{ flex: 1 }}>
              <LinearGradient
                colors={active ? [c1, c2] : ['#FFFFFF', '#FFFFFF']}
                style={{ borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', gap: 2, borderWidth: 4, borderColor: active ? c2 : colors.line }}
              >
                <Text allowFontScaling={false} style={{ fontSize: 30 }}>
                  {x === 'pro' ? '👑' : '⭐'}
                </Text>
                <Txt size={20} weight="black" color={active ? '#fff' : colors.ink}>
                  {tierName(x)}
                </Txt>
                <Txt size={13} color={active ? '#F3F0FF' : colors.inkSoft} center>
                  {x === 'pro' ? t('tasksSub') : t('featS1')}
                </Txt>
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>

      {/* muddat: oylik / yillik */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 18 }}>
        {(['monthly', 'yearly'] as const).map((per) => {
          const p = SUBSCRIPTION.plans[planId(tier, per)];
          const active = period === per;
          const accent = TIER_COLORS[tier][1];
          return (
            <Pressable
              key={per}
              onPress={() => setPeriod(per)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              style={{
                flex: 1,
                borderRadius: radius.lg,
                borderWidth: 4,
                borderColor: active ? accent : colors.line,
                backgroundColor: active ? (tier === 'pro' ? '#F1EDFF' : '#E9FBF1') : '#fff',
                paddingVertical: 18,
                paddingHorizontal: 10,
                alignItems: 'center',
                gap: 4,
              }}
            >
              {per === 'yearly' && (
                <View style={{ position: 'absolute', top: -14, backgroundColor: colors.orange, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 }}>
                  <Txt size={12} weight="black" color="#fff">
                    {t('bestValue')}
                  </Txt>
                </View>
              )}
              <Txt size={18} weight="black" center>
                {per === 'monthly' ? t('planMonthly') : t('planYearly')}
              </Txt>
              <Txt size={24} weight="black" color={accent} center numberOfLines={1} adjustsFontSizeToFit>
                {formatPrice(p.price, t('currency'))}
              </Txt>
              <Txt size={13} color={colors.inkSoft} center>
                {per === 'monthly' ? t('perMonth') : t('perYear')}
              </Txt>
              {per === 'yearly' && (
                <>
                  <Txt size={13} color={colors.inkSoft} center>
                    {t('perMonthEq', { p: formatPrice(Math.round(p.price / 12 / 50) * 50, t('currency')) })}
                  </Txt>
                  <View style={{ backgroundColor: colors.green, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 2 }}>
                    <Txt size={12} weight="black" color="#fff">
                      {t('saveN', { n: yearlySaving(tier) })}
                    </Txt>
                  </View>
                </>
              )}
            </Pressable>
          );
        })}
      </View>

      {isPremium && (
        <Card style={{ marginTop: 16, borderColor: colors.green, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Icon name="check" size={32} color={colors.green} />
          <View style={{ flex: 1 }}>
            <Txt size={17} weight="black">
              {data.subscription.plan === 'trial' ? t('trialActive') : t('tierActive', { tier: tierName(access === 'pro' ? 'pro' : 'standard') })}
            </Txt>
            <Txt size={14} color={colors.inkSoft}>
              {t('until', { d: until.toLocaleDateString(locale) })}
            </Txt>
          </View>
        </Card>
      )}

      <Card style={{ marginTop: 16, gap: 12 }}>
        <Txt size={20} weight="black">
          {tier === 'pro' ? '👑' : '⭐'} {tierName(tier)} — {t('includes')}
        </Txt>
        {FEATURES[tier].map((f) => (
          <View key={f} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: TIER_COLORS[tier][0], alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check" size={18} color="#fff" />
            </View>
            <Txt size={16} style={{ flex: 1 }} weight="regular">
              {t(f)}
            </Txt>
          </View>
        ))}
        <Txt size={13} color={colors.greenDark} weight="regular" style={{ marginTop: 4 }}>
          🛡️ {t('parentalFree')}
        </Txt>
      </Card>

      <Card style={{ marginTop: 16, gap: 10 }}>
        <Txt size={18} weight="black">
          {t('payMethod')}
        </Txt>
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          {METHODS.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => setMethod(m.id)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: radius.md, borderWidth: 3, borderColor: method === m.id ? colors.green : colors.line, backgroundColor: method === m.id ? '#D7F6E5' : '#fff' }}
            >
              {m.emoji ? <Text allowFontScaling={false} style={{ fontSize: 20 }}>{m.emoji}</Text> : null}
              <Txt size={16} weight="black">
                {m.title}
              </Txt>
            </Pressable>
          ))}
        </View>
        <Txt size={13} color={colors.inkSoft} weight="regular">
          {t('autoRenew')}
        </Txt>
      </Card>

      <View style={{ gap: 12, marginTop: 18 }}>
        {busy ? (
          <ActivityIndicator size="large" color={colors.green} />
        ) : (
          <KidButton label={`${t('subscribe')} — ${tierName(tier)}`} icon="crown" tint={tier === 'pro' ? 'purple' : 'green'} onPress={buy} />
        )}
        {!data.subscription.trialUsed && !isPremium && (
          <KidButton label={t('tryFree', { n: SUBSCRIPTION.trialDays })} tint="orange" small onPress={startTrial} />
        )}
        {msg && (
          <Txt size={16} center color={colors.greenDark}>
            {msg}
          </Txt>
        )}
        <Pressable
          onPress={async () => {
            setBusy(true);
            const ok = await restorePurchases();
            setBusy(false);
            setMsg(ok ? t('restored') : t('noPurchase'));
          }}
          style={{ alignSelf: 'center', padding: 8 }}
        >
          <Txt size={15} color={colors.blueDark}>
            {t('restore')}
          </Txt>
        </Pressable>
        {isPremium && (
          <Pressable onPress={cancelSubscription} style={{ alignSelf: 'center', padding: 8 }}>
            <Txt size={14} color={colors.inkSoft}>
              {t('cancelSub')}
            </Txt>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}
