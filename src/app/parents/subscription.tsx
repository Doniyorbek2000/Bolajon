import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { formatPrice } from '@/components/Premium';
import { Card, Header, KidButton, Screen, Txt } from '@/components/ui';
import { SUBSCRIPTION } from '@/config';
import { METHODS, PaymentMethod, purchaseMonthly, restorePurchases } from '@/services/payments';
import { useApp } from '@/store/AppStore';
import { colors, radius } from '@/theme';
import { success } from '@/utils/feedback';

const FEATURES = [
  "100% filtrlangan va xavfsiz kontent",
  'Qo\'rqinchli va axloqsiz videolardan himoya',
  'Pedagog va psixologlar tekshirgan multfilmlar',
  "Barcha 10 ta o'yin va har bir daraja",
  "Alifboning barcha harflari va raqamlar",
  'Reklamasiz, cheksiz tomosha',
  'Ekran vaqtini nazorat qilish',
];

export default function SubscriptionScreen() {
  const { data, isPremium, startTrial, activateMonthly, cancelSubscription } = useApp();
  const [method, setMethod] = useState<PaymentMethod>(METHODS[0].id);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const until = new Date(data.subscription.activeUntil);

  const buy = async () => {
    setBusy(true);
    setMsg(null);
    const res = await purchaseMonthly(method);
    setBusy(false);
    if (res.ok) {
      activateMonthly();
      success();
      setMsg('Obuna faollashtirildi! Rahmat 💛');
    } else setMsg(res.error);
  };

  return (
    <Screen>
      <Header title="Obuna" />
      <LinearGradient colors={[colors.green, colors.greenDark]} style={{ borderRadius: radius.xl, padding: 24, alignItems: 'center', gap: 4 }}>
        <Icon name="crown" size={44} color={colors.yellow} />
        <Txt size={28} weight="black" color="#fff" center>
          Bolajon Premium
        </Txt>
        <Txt size={40} weight="black" color="#fff" center>
          {formatPrice(SUBSCRIPTION.monthlyPrice)}
        </Txt>
        <Txt size={16} color="#E3FFF0">
          1 oy uchun
        </Txt>
      </LinearGradient>

      {isPremium && (
        <Card style={{ marginTop: 16, borderColor: colors.green, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Icon name="check" size={32} color={colors.green} />
          <View style={{ flex: 1 }}>
            <Txt size={17} weight="black">
              {data.subscription.plan === 'trial' ? 'Sinov davri faol' : 'Obuna faol'}
            </Txt>
            <Txt size={14} color={colors.inkSoft}>
              {until.toLocaleDateString('uz-UZ')} gacha
            </Txt>
          </View>
        </Card>
      )}

      <Card style={{ marginTop: 16, gap: 12 }}>
        <Txt size={20} weight="black">
          Tarif o'z ichiga oladi:
        </Txt>
        {FEATURES.map((f) => (
          <View key={f} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check" size={18} color="#fff" />
            </View>
            <Txt size={16} style={{ flex: 1 }} weight="regular">
              {f}
            </Txt>
          </View>
        ))}
      </Card>

      <Card style={{ marginTop: 16, gap: 10 }}>
        <Txt size={18} weight="black">
          To'lov usuli
        </Txt>
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          {METHODS.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => setMethod(m.id)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: radius.md, borderWidth: 3, borderColor: method === m.id ? colors.green : colors.line, backgroundColor: method === m.id ? '#D7F6E5' : '#fff' }}
            >
              {m.emoji ? <Text style={{ fontSize: 20 }}>{m.emoji}</Text> : null}
              <Txt size={16} weight="black">
                {m.title}
              </Txt>
            </Pressable>
          ))}
        </View>
        <Txt size={13} color={colors.inkSoft} weight="regular">
          Obuna har oy avtomatik yangilanadi. Istalgan vaqtda do'kon sozlamalarida bekor qilishingiz mumkin. Faollashtirilgan obuna uchun to'lov qaytarilmaydi.
        </Txt>
      </Card>

      <View style={{ gap: 12, marginTop: 18 }}>
        {busy ? (
          <ActivityIndicator size="large" color={colors.green} />
        ) : (
          <KidButton label={isPremium ? 'Yana 1 oyga uzaytirish' : 'Obuna bo\'lish'} icon="crown" tint="green" onPress={buy} />
        )}
        {!data.subscription.trialUsed && !isPremium && (
          <KidButton label={`${SUBSCRIPTION.trialDays} kun bepul sinab ko'rish`} tint="orange" small onPress={startTrial} />
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
            setMsg(ok ? 'Xaridlar tiklandi' : 'Faol xarid topilmadi');
          }}
          style={{ alignSelf: 'center', padding: 8 }}
        >
          <Txt size={15} color={colors.blueDark}>
            Xaridlarni tiklash
          </Txt>
        </Pressable>
        {isPremium && (
          <Pressable onPress={cancelSubscription} style={{ alignSelf: 'center', padding: 8 }}>
            <Txt size={14} color={colors.inkSoft}>
              Obunani bekor qilish
            </Txt>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}
