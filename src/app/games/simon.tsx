import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { GameAccess } from '@/components/Premium';
import { RewardModal } from '@/components/Reward';
import { Header, KidButton, Screen, StarBadge, Txt } from '@/components/ui';
import { useT } from '@/i18n';
import { useApp } from '@/store/AppStore';
import { colors, radius, useLayout } from '@/theme';
import { oops, praise, say, tap } from '@/utils/feedback';

const PADS = [
  { color: colors.red, dark: colors.redDark, emoji: '🍓' },
  { color: colors.blue, dark: colors.blueDark, emoji: '🐳' },
  { color: colors.green, dark: colors.greenDark, emoji: '🐸' },
  { color: colors.yellow, dark: colors.yellowDark, emoji: '⭐' },
];
const WIN_LEN = 6;

type Phase = 'idle' | 'show' | 'input';

export default function SimonScreen() {
  const { t } = useT();
  const { recordGame, data } = useApp();
  const { contentWidth, height, scale } = useLayout();
  const [seq, setSeq] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [lit, setLit] = useState<number | null>(null);
  const [pos, setPos] = useState(0);
  const [won, setWon] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pulse = useRef(PADS.map(() => new Animated.Value(1))).current;
  const speed = data.child.age <= 4 ? 750 : 600;

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const flash = (i: number) => {
    setLit(i);
    tap();
    Animated.sequence([
      Animated.timing(pulse[i], { toValue: 1.08, duration: 120, useNativeDriver: true }),
      Animated.timing(pulse[i], { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start();
    timers.current.push(setTimeout(() => setLit(null), speed * 0.6));
  };

  const play = useCallback(
    (s: number[]) => {
      clear();
      setPhase('show');
      say(t('simonWatch'));
      s.forEach((p, k) => timers.current.push(setTimeout(() => flash(p), 1100 + k * speed)));
      timers.current.push(
        setTimeout(() => {
          setPhase('input');
          setPos(0);
          say(t('simonGo'));
        }, 1100 + s.length * speed + 200),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [speed, t],
  );

  const start = () => {
    const s = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
    setSeq(s);
    setMistakes(0);
    setWon(false);
    play(s);
  };

  const press = (i: number) => {
    if (phase !== 'input') return;
    flash(i);
    if (seq[pos] !== i) {
      oops();
      setMistakes((m) => m + 1);
      say(t('simonFail'));
      timers.current.push(setTimeout(() => play(seq), 900));
      setPhase('show');
      return;
    }
    if (pos + 1 < seq.length) {
      setPos(pos + 1);
      return;
    }
    // ketma-ketlik to'g'ri takrorlandi
    if (seq.length >= WIN_LEN) {
      setPhase('idle');
      recordGame('simon', mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);
      praise();
      timers.current.push(setTimeout(() => setWon(true), 600));
      return;
    }
    praise();
    const next = [...seq, Math.floor(Math.random() * 4)];
    setSeq(next);
    setPhase('show');
    timers.current.push(setTimeout(() => play(next), 900));
  };

  const pad = Math.floor(Math.min((contentWidth - 16) / 2, (height - 330 * scale) / 2, 230));

  return (
    <Screen scroll={false}>
      <GameAccess id="simon" />
      <Header title={t('g_simon')} right={<StarBadge />} />
      <Txt size={20} weight="black" center color={colors.purpleDark} style={{ marginBottom: 6 }}>
        {phase === 'idle' ? t('g_simon_s') : t('simonLevel', { n: Math.max(1, seq.length - 1) })}
      </Txt>
      <Txt size={16} center color={colors.inkSoft}>
        {phase === 'show' ? t('simonWatch') : phase === 'input' ? t('simonGo') : ' '}
      </Txt>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: pad * 2 + 16, flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {PADS.map((p, i) => (
            <Pressable key={i} onPress={() => press(i)} disabled={phase !== 'input'} accessibilityLabel={p.emoji}>
              <Animated.View
                style={{
                  width: pad,
                  height: pad,
                  borderRadius: radius.xl,
                  backgroundColor: lit === i ? '#FFFFFF' : p.color,
                  borderWidth: 6,
                  borderColor: lit === i ? p.color : p.dark,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: phase === 'show' && lit !== i ? 0.75 : 1,
                  transform: [{ scale: pulse[i] }],
                }}
              >
                <Animated.Text allowFontScaling={false} style={{ fontSize: pad * 0.42 }}>
                  {p.emoji}
                </Animated.Text>
              </Animated.View>
            </Pressable>
          ))}
        </View>
      </View>
      {phase === 'idle' && <KidButton label={t('start')} icon="play" tint="green" onPress={start} style={{ marginBottom: 12 }} />}
      <RewardModal visible={won} stars={mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1} onAgain={start} onClose={() => setWon(false)} />
    </Screen>
  );
}
