import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Mascot } from '@/components/Mascot';
import { Card, KidButton, Screen, Txt } from '@/components/ui';
import { APP_NAME } from '@/config';
import { useApp } from '@/store/AppStore';
import { colors, fonts, radius, tints, useLayout } from '@/theme';
import { say, tap } from '@/utils/feedback';
import { uzText, useT } from '@/i18n';
import { LANGS } from '@/i18n/langs';

const AVATARS = ['🦁', '🐼', '🐰', '🦊', '🐻', '🐱', '🐶', '🦄', '🐸', '🐵', '🐯', '🐨'];
const AGES = [2, 3, 4, 5, 6, 7];

export default function Onboarding() {
  const { update, data } = useApp();
  const { t } = useT();
  const { scale } = useLayout();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState(4);
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const finish = () => {
    update((d) => ({ ...d, onboarded: true, child: { name: name.trim(), age, avatar } }));
    say(t('letsPlay', { name: name.trim() || t('defaultName') }));
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
                <Text style={{ fontSize: 18 }}>{l.flag}</Text>
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
              <Text style={{ fontSize: 26 }}>{e}</Text>
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
        <Text style={{ fontSize: 80 * scale }}>{avatar}</Text>
        <Txt size={26} weight="black" center>
          {t('meetTitle')}
        </Txt>
        <Txt size={15} center color={colors.inkSoft}>
          {t('localOnly')}
        </Txt>
      </View>
      <Card style={{ gap: 12, maxWidth: 560, width: '100%', alignSelf: 'center' }}>
        <Txt size={17}>{t('name')}</Txt>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('namePh')}
          placeholderTextColor="#B8B2A6"
          maxLength={20}
          style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.ink, backgroundColor: colors.bgSoft, borderRadius: radius.md, borderWidth: 3, borderColor: colors.line, paddingHorizontal: 16, paddingVertical: 12 }}
        />
        <Txt size={17}>{t('age')}</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {AGES.map((a) => (
            <Pressable
              key={a}
              onPress={() => {
                tap();
                setAge(a);
              }}
              style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: age === a ? colors.orange : '#fff', borderWidth: 3, borderColor: age === a ? colors.orange : colors.line }}
            >
              <Txt size={20} weight="black" color={age === a ? '#fff' : colors.ink}>
                {a === 7 ? '7+' : a}
              </Txt>
            </Pressable>
          ))}
        </View>
        <Txt size={17}>{t('hero')}</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {AVATARS.map((a) => (
            <Pressable
              key={a}
              onPress={() => {
                tap();
                setAvatar(a);
              }}
              style={{ width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: avatar === a ? tints.yellow.soft : '#fff', borderWidth: 3, borderColor: avatar === a ? colors.yellow : colors.line }}
            >
              <Text style={{ fontSize: 30 }}>{a}</Text>
            </Pressable>
          ))}
        </View>
      </Card>
      <KidButton label={t('ready')} icon="check" tint="green" onPress={finish} style={{ maxWidth: 560, width: '100%', alignSelf: 'center' }} />
    </Screen>
  );
}
