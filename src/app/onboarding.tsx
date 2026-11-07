import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Mascot } from '@/components/Mascot';
import { Card, KidButton, Screen, Txt } from '@/components/ui';
import { APP_NAME } from '@/config';
import { Child, useApp } from '@/store/AppStore';
import { AVATARS, ProfileForm } from '@/components/ProfileForm';
import { colors, fonts, radius, tints, useLayout } from '@/theme';
import { say, tap } from '@/utils/feedback';
import { uzText, useT } from '@/i18n';
import { LANGS } from '@/i18n/langs';


export default function Onboarding() {
  const { update, data } = useApp();
  const { t } = useT();
  const { scale } = useLayout();
  const [step, setStep] = useState(0);
  const [child, setChild] = useState<Child>({ name: '', age: 4, avatar: AVATARS[0] });
  const [lb, setLb] = useState(true);
  const [err, setErr] = useState(false);

  const finish = () => {
    const name = child.name.trim();
    if (!name || !child.region || !child.district) return setErr(true);
    update((d) => ({ ...d, onboarded: true, child: { ...child, name }, parental: { ...d.parental, leaderboard: lb } }));
    // o'zbekcha: ism qurilma ovozida g'alati chiqmasligi uchun faqat yozib olingan ibora
    say(data.uiLang === 'uz' ? t('letsPlaySpeak') : t('letsPlay', { name }));
    router.replace('/');
  };

  if (step === 0) {
    return (
      <Screen contentStyle={{ justifyContent: 'center', alignItems: 'center', gap: 18 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {LANGS.map((l) => {
            const active = data.uiLang === l.code;
            return (
              <Pressable
                key={l.code}
                accessibilityLabel={l.native}
                onPress={() => {
                  tap();
                  update((d) => ({ ...d, uiLang: l.code }));
                }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 3, borderColor: active ? colors.blue : colors.line, backgroundColor: active ? '#D8EEFF' : '#fff' }}
              >
                <Text allowFontScaling={false} style={{ fontSize: 18 }}>{l.flag}</Text>
                <Txt size={14} weight="black">
                  {l.code === 'uz' ? uzText(l.native, data.uzScript) : l.native}
                </Txt>
              </Pressable>
            );
          })}
        </View>
        <Mascot size={230 * scale} mood="happy" full />
        <Txt size={44} weight="black" color={colors.orangeDark} center>
          {APP_NAME}
        </Txt>
        <Txt size={20} center color={colors.ink} style={{ maxWidth: 460 }}>
          {t('tagline')}
        </Txt>
        <View style={{ gap: 10, marginTop: 8, alignSelf: 'stretch', maxWidth: 460, width: '100%', marginHorizontal: 'auto' }}>
          {[
            ['🛡️', t('feat1')],
            ['🧠', t('feat2')],
            ['⏰', t('feat3')],
          ].map(([e, t]) => (
            <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', padding: 14, borderRadius: radius.md }}>
              <Text allowFontScaling={false} style={{ fontSize: 26 }}>{e}</Text>
              <Txt size={16} style={{ flex: 1 }}>
                {t}
              </Txt>
            </View>
          ))}
        </View>
        <KidButton label={t('start')} icon="play" tint="green" onPress={() => setStep(1)} style={{ alignSelf: 'stretch', maxWidth: 460, width: '100%' }} />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={{ justifyContent: 'center', gap: 16, paddingTop: 20 }}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: 96 * scale, height: 96 * scale, borderRadius: 48 * scale, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
          {child.photo ? (
            <Image source={{ uri: child.photo }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <Text allowFontScaling={false} style={{ fontSize: 76 * scale }}>
              {child.avatar}
            </Text>
          )}
        </View>
        <Txt size={26} weight="black" center>
          {t('meetTitle')}
        </Txt>
        <Txt size={15} center color={colors.inkSoft}>
          {t('localOnly')}
        </Txt>
      </View>
      <Card style={{ maxWidth: 560, width: '100%', alignSelf: 'center' }}>
        <ProfileForm
          child={child}
          onChange={(c) => {
            setErr(false);
            setChild(c);
          }}
          leaderboard={lb}
          onLeaderboard={setLb}
        />
      </Card>
      {err && (
        <Txt size={16} center color={colors.redDark}>
          ⚠️ {t('fillRequired')}
        </Txt>
      )}
      <KidButton label={t('ready')} icon="check" tint="green" onPress={finish} style={{ maxWidth: 560, width: '100%', alignSelf: 'center' }} />
    </Screen>
  );
}
