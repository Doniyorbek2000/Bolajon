import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import { useReducedMotion } from '@/utils/motion';

type Mood = 'happy' | 'wow' | 'wink' | 'sleepy';

const OWL = require('../../assets/mascot.png');
const LOGO = require('../../assets/brand/logo-owl.png');
const BADGE: Partial<Record<Mood, string>> = { wow: '✨', wink: '🔒', sleepy: '💤' };

/**
 * Bolajon maskoti — bilimdon boyo'g'licha. Yengil "nafas olish" animatsiyasi bilan.
 */
export function Mascot({ size = 120, mood = 'happy', full = false }: { size?: number; mood?: Mood; full?: boolean }) {
  const v = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, reduced]);
  const badge = BADGE[mood];
  return (
    <View style={{ width: size, height: size }}>
      <Animated.View
        style={{
          width: size,
          height: size,
          opacity: mood === 'sleepy' ? 0.85 : 1,
          transform: [
            { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -size * 0.03] }) },
            { rotate: v.interpolate({ inputRange: [0, 1], outputRange: mood === 'wow' ? ['-3deg', '3deg'] : ['0deg', '0deg'] }) },
          ],
        }}
      >
        <Image source={full ? LOGO : OWL} style={{ width: size, height: size }} resizeMode="contain" accessibilityIgnoresInvertColors />
      </Animated.View>
      {badge ? <Text allowFontScaling={false} style={{ position: 'absolute', right: 0, top: 0, fontSize: size * 0.22 }}>{badge}</Text> : null}
    </View>
  );
}
