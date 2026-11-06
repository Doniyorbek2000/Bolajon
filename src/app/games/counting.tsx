import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { QuizGame, QuizRound } from '@/components/QuizGame';
import { Txt } from '@/components/ui';
import { numberWord } from '@/data/alphabets';
import { useT } from '@/i18n';
import { CATEGORIES } from '@/data/items';
import { useApp } from '@/store/AppStore';
import { colors } from '@/theme';
import { pick, shuffle } from '@/utils/feedback';

export default function CountingScreen() {
  const { data } = useApp();
  const { t, lang } = useT();
  const max = data.child.age <= 3 ? 5 : data.child.age <= 4 ? 7 : 10;

  const makeRound = useCallback((): QuizRound => {
    const n = 1 + Math.floor(Math.random() * max);
    const emoji = pick(pick(CATEGORIES.slice(0, 2)).items);
    const opts = new Set([n]);
    while (opts.size < 3) opts.add(Math.max(1, Math.min(max + 1, n + Math.floor(Math.random() * 5) - 2)));
    return {
      question: t('howMany'),
      speak: t('howManySpeak'),
      answer: String(n),
      prompt: (w) => {
        const size = Math.min(72, w / 6);
        return (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: size * 5 + 60 }}>
            {Array.from({ length: n }, (_, i) => (
              <Text key={i} style={{ fontSize: size }}>
                {emoji}
              </Text>
            ))}
          </View>
        );
      },
      options: shuffle([...opts]).map((v) => ({
        key: String(v),
        render: (s) => (
          <View style={{ alignItems: 'center' }}>
            <Txt size={s / 1.6} weight="black" color={colors.greenDark}>
              {v}
            </Txt>
            <Txt size={14} color={colors.inkSoft}>
              {numberWord(v, lang)}
            </Txt>
          </View>
        ),
      })),
    };
  }, [max, t, lang]);

  return <QuizGame id="counting" title={t('g_counting')} makeRound={makeRound} />;
}
