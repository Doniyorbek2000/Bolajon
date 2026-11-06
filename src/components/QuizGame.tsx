import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { colors, radius, useLayout } from '@/theme';
import { praise, say, tryAgain } from '@/utils/feedback';
import { useApp } from '@/store/AppStore';
import { GameAccess } from './Premium';
import { RewardModal } from './Reward';
import { Header, Screen, StarBadge, Squishy, Txt } from './ui';
import { useT } from '@/i18n';
import type { Lang } from '@/i18n/langs';

export type QuizOption = { key: string; render: (size: number) => React.ReactNode; bg?: string };
export type QuizRound = { question: string; speak?: string; speakLang?: Lang; questionLang?: Lang; prompt: (w: number) => React.ReactNode; options: QuizOption[]; answer: string };

/**
 * Umumiy "savol — javob" o'yini: 5 raund, to'g'ri javoblarga yulduz.
 */
export function QuizGame({
  id,
  title,
  makeRound,
  rounds = 5,
  premium,
}: {
  premium?: boolean;
  id: string;
  title: string;
  makeRound: (i: number) => QuizRound;
  rounds?: number;
}) {
  const { recordGame } = useApp();
  const { t } = useT();
  const { width, height, gutter, scale, isLandscape } = useLayout();
  const [i, setI] = useState(0);
  const [round, setRound] = useState<QuizRound>(() => makeRound(0));
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [right, setRight] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const tm = setTimeout(() => say(round.speak ?? round.question, round.speakLang), 300);
    return () => clearTimeout(tm);
  }, [round]);

  const restart = useCallback(() => {
    setI(0);
    setMistakes(0);
    setWon(false);
    setRight(null);
    setRound(makeRound(0));
  }, [makeRound]);

  const choose = (key: string) => {
    if (right) return;
    if (key === round.answer) {
      setRight(key);
      praise();
      setTimeout(() => {
        setRight(null);
        setWrong(null);
        if (i + 1 >= rounds) {
          recordGame(id, stars);
          setWon(true);
        } else {
          setI(i + 1);
          setRound(makeRound(i + 1));
        }
      }, 1100);
    } else {
      setWrong(key);
      setMistakes((m) => m + 1);
      tryAgain();
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start(() => setWrong(null));
    }
  };

  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
  const n = round.options.length;
  const area = Math.min(width, 1000) - gutter * 2;
  const cols = isLandscape ? n : n <= 3 ? n : 2;
  const opt = Math.floor(Math.min((area - 14 * (cols - 1)) / cols, isLandscape ? height * 0.32 : height * 0.2, 200));

  return (
    <Screen scroll={false}>
      <GameAccess id={id} premium={premium} />
      <Header title={title} right={<StarBadge />} />
      {/* progress */}
      <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: 8 }}>
        {Array.from({ length: rounds }, (_, k) => (
          <View
            key={k}
            style={{ width: 34 * scale, height: 12, borderRadius: 6, backgroundColor: k < i ? colors.green : k === i ? colors.yellow : '#EDE3D1' }}
          />
        ))}
      </View>
      <Squishy
        onPress={() => say(round.speak ?? round.question, round.speakLang)}
        depth={4}
        shadowColor="#F0D9A8"
        style={{ backgroundColor: '#fff', borderRadius: radius.lg, paddingVertical: 12, paddingHorizontal: 16, alignSelf: 'center', marginVertical: 6 }}
      >
        <Txt size={22} weight="black" center>
          🔊 {round.question}
        </Txt>
      </Squishy>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>{round.prompt(area)}</View>
      <Animated.View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 14,
          justifyContent: 'center',
          paddingBottom: 12,
          transform: [{ translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-8, 8] }) }],
        }}
      >
        {round.options.map((o) => {
          const isRight = right === o.key;
          const isWrong = wrong === o.key;
          return (
            <Squishy
              key={o.key}
              onPress={() => choose(o.key)}
              depth={7}
              shadowColor={isRight ? colors.greenDark : isWrong ? colors.redDark : '#E9D9BC'}
              style={{
                width: opt,
                height: opt * 0.82,
                borderRadius: radius.lg,
                backgroundColor: isRight ? '#D7F6E5' : isWrong ? '#FFE0E1' : o.bg ?? '#fff',
                borderWidth: 4,
                borderColor: isRight ? colors.green : isWrong ? colors.red : '#F3E6CF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {o.render(opt * 0.6)}
            </Squishy>
          );
        })}
      </Animated.View>
      <RewardModal visible={won} stars={stars} message={t('roundsMsg', { n: rounds })} onAgain={restart} onClose={() => (router.canGoBack() ? router.back() : restart())} />
    </Screen>
  );
}
