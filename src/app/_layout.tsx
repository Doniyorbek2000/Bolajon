import { Nunito_600SemiBold, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import React, { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { isKidLocked, startKidLock } from 'kid-lock';
import { levelOf } from '@/data/stickers';
import { removeScore, submitScore } from '@/services/leaderboard';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Mascot } from '@/components/Mascot';
import { ParentalGate } from '@/components/ParentalGate';
import { KidButton, Txt } from '@/components/ui';
import { AppStoreProvider, useApp } from '@/store/AppStore';
import { colors } from '@/theme';
import { say, setSoundEnabled, setSpeechLocale, warmUpSpeech } from '@/utils/feedback';
import { useT } from '@/i18n';

SplashScreen.preventAutoHideAsync().catch(() => {});

function TimeUp() {
  const { update, data } = useApp();
  const [gate, setGate] = useState(false);
  const { t } = useT();
  useEffect(() => {
    say(t('restSpeak'));
  }, [t]);
  return (
    <View style={{ position: 'absolute', inset: 0, backgroundColor: '#2E2A5A', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
      <Txt size={60}>🌙 ⭐ ✨</Txt>
      <Mascot size={180} mood="sleepy" />
      <Txt size={32} weight="black" color="#fff" center>
        {t('restTitle')}
      </Txt>
      <Txt size={18} color="#D9D4FF" center style={{ maxWidth: 420 }}>
        {t('restText')}
      </Txt>
      <KidButton label={t('plus15')} icon="lock" tint="purple" small onPress={() => setGate(true)} />
      <ParentalGate
        visible={gate}
        onCancel={() => setGate(false)}
        onPass={() => {
          setGate(false);
          const limit = data.parental.dailyLimitMin * 60;
          update((d) => ({ ...d, usage: { ...d.usage, seconds: Math.max(0, limit - 15 * 60) } }));
        }}
      />
    </View>
  );
}

function Root() {
  const { ready, data, timeUp } = useApp();
  const path = usePathname();
  const [fontsLoaded] = useFonts({ Nunito_600SemiBold, Nunito_800ExtraBold, Nunito_900Black });

  useEffect(() => setSoundEnabled(data.parental.sound), [data.parental.sound]);
  useEffect(() => setSpeechLocale(data.uiLang, data.uzScript), [data.uiLang, data.uzScript]);
  useEffect(() => {
    if (ready) warmUpSpeech(data.uiLang);
  }, [ready, data.uiLang]);

  // Ekran o'chib qolmasin (ota-ona sozlamasi)
  useEffect(() => {
    if (!ready) return;
    if (data.parental.keepAwake) activateKeepAwakeAsync('bolajon').catch(() => {});
    else deactivateKeepAwake('bolajon').catch(() => {});
  }, [ready, data.parental.keepAwake]);

  // Bola rejimi: ilova ochilganda qulfni tiklash
  useEffect(() => {
    if (ready && data.onboarded && data.parental.kidLock && !isKidLocked()) startKidLock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Reyting: natijalarni serverga yuborish (ota-ona roziligi bilan, 3 soniya kechiktirib)
  const tasksDone = Object.keys(data.progress.tasks).length;
  const lbReady = ready && data.onboarded && data.parental.leaderboard && !!data.child.region && !!data.child.district && !!data.playerId;
  useEffect(() => {
    if (!lbReady) return;
    const tm = setTimeout(() => {
      submitScore({
        id: data.playerId,
        name: data.child.name,
        avatar: data.child.avatar,
        age: data.child.age,
        region: data.child.region!,
        district: data.child.district!,
        stars: data.stars,
        tasks: tasksDone,
        level: levelOf(data.stars),
      }).catch(() => {});
    }, 3000);
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lbReady, data.stars, tasksDone, data.child.name, data.child.avatar, data.child.age, data.child.region, data.child.district]);
  // ota-ona reytingdan chiqsa — serverdagi yozuv o'chiriladi
  useEffect(() => {
    if (ready && data.onboarded && !data.parental.leaderboard && data.playerId) removeScore(data.playerId).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, data.parental.leaderboard]);

  // Bola rejimida bosh sahifadagi "Orqaga" ilovadan chiqarmaydi
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => data.parental.kidLock && path === '/');
    return () => sub.remove();
  }, [data.parental.kidLock, path]);
  useEffect(() => {
    if (ready && fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [ready, fontsLoaded]);

  if (!ready || !fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  const inParents = path.startsWith('/parents');
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }}>
        <Stack.Screen name="videos/[id]" options={{ animation: 'fade', orientation: 'all' }} />
        <Stack.Screen name="videos/shorts" options={{ animation: 'fade', orientation: 'portrait' }} />
      </Stack>
      {timeUp && data.onboarded && !inParents && <TimeUp />}
    </View>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <Root />
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}
