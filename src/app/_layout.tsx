import { Nunito_600SemiBold, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Mascot } from '@/components/Mascot';
import { ParentalGate } from '@/components/ParentalGate';
import { KidButton, Txt } from '@/components/ui';
import { AppStoreProvider, useApp } from '@/store/AppStore';
import { colors } from '@/theme';
import { say, setSoundEnabled } from '@/utils/feedback';

SplashScreen.preventAutoHideAsync().catch(() => {});

function TimeUp() {
  const { update, data } = useApp();
  const [gate, setGate] = useState(false);
  useEffect(() => {
    say("Dam olish vaqti keldi! Ko'zlaring ham dam olsin.");
  }, []);
  return (
    <View style={{ position: 'absolute', inset: 0, backgroundColor: '#2E2A5A', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
      <Txt size={60}>🌙 ⭐ ✨</Txt>
      <Mascot size={180} mood="sleepy" />
      <Txt size={32} weight="black" color="#fff" center>
        Dam olish vaqti!
      </Txt>
      <Txt size={18} color="#D9D4FF" center style={{ maxWidth: 420 }}>
        Bugun juda ko'p o'ynading. Endi ko'zlaringga dam ber, ertaga yana o'ynaymiz!
      </Txt>
      <KidButton label="Ota-ona: +15 daqiqa" icon="lock" tint="purple" small onPress={() => setGate(true)} />
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
