import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, radius, useLayout } from '@/theme';
import { Mascot } from './Mascot';
import { Icon } from './Icon';
import { KidButton, Txt } from './ui';
import { useT } from '@/i18n';

const CONFETTI = ['⭐', '🎈', '🎉', '✨', '🌟', '🍭', '💖', '🎊'];

function Confetti() {
  const { width, height } = useWindowDimensions();
  const items = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      x: Math.random() * width,
      delay: Math.random() * 600,
      emoji: CONFETTI[i % CONFETTI.length],
      size: 20 + Math.random() * 18,
      v: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    items.forEach((it) =>
      Animated.timing(it.v, {
        toValue: 1,
        duration: 2200 + Math.random() * 1200,
        delay: it.delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(),
    );
  }, [items]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {items.map((it, i) => (
        <Animated.Text
          key={i}
          style={{
            position: 'absolute',
            left: it.x,
            top: -40,
            fontSize: it.size,
            opacity: it.v.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
            transform: [
              { translateY: it.v.interpolate({ inputRange: [0, 1], outputRange: [0, height * 0.9] }) },
              { rotate: it.v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${i % 2 ? 360 : -360}deg`] }) },
            ],
          }}
        >
          {it.emoji}
        </Animated.Text>
      ))}
    </View>
  );
}

export function RewardModal({
  visible,
  stars = 3,
  title,
  message,
  onAgain,
  onClose,
}: {
  visible: boolean;
  stars?: number;
  title?: string;
  message?: string;
  onAgain?: () => void;
  onClose: () => void;
}) {
  const pop = useRef(new Animated.Value(0)).current;
  const { scale } = useLayout();
  const { t } = useT();
  useEffect(() => {
    if (visible) {
      pop.setValue(0);
      Animated.spring(pop, { toValue: 1, useNativeDriver: true, bounciness: 14, speed: 8 }).start();
    }
  }, [visible, pop]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} supportedOrientations={['portrait', 'landscape']}>
      <View style={styles.backdrop}>
        {visible && <Confetti />}
        <Animated.View style={[styles.card, { transform: [{ scale: pop }] }]}>
          <View style={{ marginTop: -80 * scale }}>
            <Mascot size={140 * scale} mood="wow" />
          </View>
          <Txt size={34} weight="black" color={colors.orangeDark} center>
            {title ?? t('bravo')}
          </Txt>
          <View style={{ flexDirection: 'row', gap: 6, marginVertical: 10 }}>
            {[0, 1, 2].map((i) => (
              <Icon key={i} name="star" size={52 * scale} color={i < stars ? colors.yellow : '#EDE3D1'} />
            ))}
          </View>
          {message ? (
            <Txt size={18} color={colors.inkSoft} center style={{ marginBottom: 14 }}>
              {message}
            </Txt>
          ) : null}
          <View style={{ flexDirection: 'row', gap: 12, alignSelf: 'stretch' }}>
            {onAgain && <KidButton label={t('again')} icon="refresh" tint="green" onPress={onAgain} style={{ flex: 1 }} small />}
            <KidButton label={t('done')} icon="check" tint="orange" onPress={onClose} style={{ flex: 1 }} small />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function BigEmoji({ children, size }: { children: string; size: number }) {
  return <Text style={{ fontSize: size, textAlign: 'center' }}>{children}</Text>;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(43,45,66,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: 24,
    paddingTop: 12,
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FFE2A8',
  },
});
