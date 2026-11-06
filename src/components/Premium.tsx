import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { SUBSCRIPTION } from '@/config';
import { GAMES } from '@/data/games';
import { useApp } from '@/store/AppStore';
import { colors, radius, useLayout } from '@/theme';
import { Mascot } from './Mascot';
import { ParentalGate } from './ParentalGate';
import { KidButton, Txt } from './ui';

export const formatPrice = (n: number) => `${n.toLocaleString('ru-RU').replace(/,/g, ' ')} ${SUBSCRIPTION.currency}`;

export function usePremiumLimit(freeCount: number) {
  const { isPremium } = useApp();
  const isLocked = useCallback((i: number) => !isPremium && i >= freeCount, [isPremium, freeCount]);
  return { isLocked, isPremium };
}

/** Premium kontentga urinilganda bolaga ko'rsatiladigan oyna. */
export function PremiumGuard({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [gate, setGate] = useState(false);
  const { scale } = useLayout();
  return (
    <>
      <Modal visible={visible && !gate} transparent animationType="fade" onRequestClose={onClose} supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <View style={{ marginTop: -70 * scale }}>
              <Mascot size={120 * scale} mood="wink" />
            </View>
            <Txt size={26} weight="black" center color={colors.purpleDark}>
              Bu sehrli qism! ✨
            </Txt>
            <Txt size={17} center color={colors.inkSoft} style={{ marginVertical: 10 }}>
              Ochish uchun dadang yoki ayangni chaqir
            </Txt>
            <View style={{ gap: 10, alignSelf: 'stretch' }}>
              <KidButton label="Ota-onaga" icon="lock" tint="purple" onPress={() => setGate(true)} />
              <KidButton label="Keyinroq" tint="orange" small onPress={onClose} />
            </View>
          </View>
        </View>
      </Modal>
      <ParentalGate
        visible={visible && gate}
        onCancel={() => setGate(false)}
        onPass={() => {
          setGate(false);
          onClose();
          router.push('/parents/subscription');
        }}
      />
    </>
  );
}

/** Premium o'yin ichida: obuna bo'lmasa oynani ko'rsatib, orqaga qaytaradi. */
export function GameAccess({ id }: { id: string }) {
  const { isPremium, ready } = useApp();
  const game = GAMES.find((g) => g.id === id);
  const locked = ready && !!game && !game.free && !isPremium;
  return <PremiumGuard visible={locked} onClose={() => (router.canGoBack() ? router.back() : router.replace('/games'))} />;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(43,45,66,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: radius.xl, padding: 24, alignItems: 'center' },
});
