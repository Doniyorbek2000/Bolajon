import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { formatPrice } from '@/components/Premium';
import { Card, Header, KidButton, Screen, Txt } from '@/components/ui';
import { PlanId, SUBSCRIPTION, YEARLY_SAVING } from '@/config';
import { METHODS, PaymentMethod, purchasePlan, restorePurchases } from '@/services/payments';
import { useApp } from '@/store/AppStore';
import { colors, radius } from '@/theme';
import { success } from '@/utils/feedback';
import { useT } from '@/i18n';

const FEATURES = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'] as const;

export default function SubscriptionScreen() {
  const { data, isPremium, startTrial, activatePlan, cancelSubscription } = useApp();
  const [plan, setPlan] = useState<PlanId>('yearly');
  const [method, setMethod] = useState<PaymentMethod>(METHODS[0].id);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const { t, lang } = useT();
  const locale = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB', tr: 'tr-TR', de: 'de-DE', ar: 'ar' }[lang];
  const until = new Date(data.subscription.activeUntil);

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
      <LinearGradient colors={[colors.green, colors.greenDark]} style={{ borderRadius: radius.xl, padding: 20, alignItems: 'center', gap: 4 }}>
        <Icon name="crown" size={44} color={colors.yellow} />
        <Txt size={28} weight="black" color="#fff" center>
          Bolajon Premium
        </Txt>
        <Txt size={15} color="#E3FFF0" center>
          {t('choosePlan')}
        </Txt>
      </LinearGradient>

      {/* tariflar */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
        {(['monthly', 'yearly'] as const).map((id) => {
          const p = SUBSCRIPTION.plans[id];
          const active = plan === id;
          return (
            <Pressable
              key={id}
              onPress={() => setPlan(id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              style={{
                flex: 1,
                borderRadius: radius.lg,
                borderWidth: 4,
                borderColor: active ? colors.green : colors.line,
                backgroundColor: active ? '#E9FBF1' : '#fff',
                paddingVertical: 18,
                paddingHorizontal: 10,
                alignItems: 'center',
                gap: 4,
              }}
            >
              {id === 'yearly' && (
                <View style={{ position: 'absolute', top: -14, backgroundColor: colors.orange, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 }}>
                  <Txt size={12} weight="black" color="#fff">
                    {t('bestValue')}
                  </Txt>
                </View>
              )}
              <Txt size={18} weight="black" center>
                {id === 'monthly' ? t('planMonthly') : t('planYearly')}
              </Txt>
              <Txt size={24} weight="black" color={colors.greenDark} center numberOfLines={1} adjustsFontSizeToFit>
                {formatPrice(p.price, t('currency'))}
              </Txt>
              <Txt size={13} color={colors.inkSoft} center>
                {id === 'monthly' ? t('perMonth') : t('perYear')}
              </Txt>
              {id === 'yearly' && (
                <>
                  <Txt size={13} color={colors.inkSoft} center>
                    {t('perMonthEq', { p: formatPrice(Math.round(p.price / 12 / 50) * 50, t('currency')) })}
                  </Txt>
                  <View style={{ backgroundColor: colors.green, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 2 }}>
                    <Txt size={12} weight="black" color="#fff">
                      {t('saveN', { n: YEARLY_SAVING })}
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
              {data.subscription.plan === 'trial' ? t('trialActive') : t('subActive')}
            </Txt>
            <Txt size={14} color={colors.inkSoft}>
              {t('until', { d: until.toLocaleDateString(locale) })}
            </Txt>
          </View>
        </Card>
      )}

      <Card style={{ marginTop: 16, gap: 12 }}>
        <Txt size={20} weight="black">
          {t('includes')}
        </Txt>
        {FEATURES.map((f) => (
          <View key={f} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check" size={18} color="#fff" />
            </View>
            <Txt size={16} style={{ flex: 1 }} weight="regular">
              {t(f)}
            </Txt>
          </View>
        ))}
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
          <KidButton label={isPremium ? t('extend') : t('subscribe')} icon="crown" tint="green" onPress={buy} />
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
