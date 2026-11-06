import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { QuizGame, QuizRound } from '@/components/QuizGame';
import { Txt } from '@/components/ui';
import { numberLabel, numberWord } from '@/data/alphabets';
import { CATEGORIES } from '@/data/items';
import { useT } from '@/i18n';
import { useApp } from '@/store/AppStore';
import { colors } from '@/theme';
import { pick, shuffle } from '@/utils/feedback';

export default function MathScreen() {
  const { data } = useApp();
  const { t, lang, script } = useT();
  const max = data.child.age <= 4 ? 5 : 10;

  const makeRound = useCallback((): QuizRound => {
    const a = 1 + Math.floor(Math.random() * (max - 1));
    const b = 1 + Math.floor(Math.random() * (max - a));
    const sum = a + b;
    const emoji = pick(CATEGORIES[0].items);
    const opts = new Set([sum]);
    while (opts.size < 3) opts.add(Math.max(1, Math.min(10, sum + Math.floor(Math.random() * 5) - 2)));
    const group = (n: number, size: number) => (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', maxWidth: size * 3.4, gap: 4 }}>
        {Array.from({ length: n }, (_, i) => (
          <Text allowFontScaling={false} key={i} style={{ fontSize: size }}>
            {emoji}
          </Text>
        ))}
      </View>
    );
    return {
      question: t('mathQ'),
      speak: t('mathSpeak', { a: numberWord(a, lang), b: numberWord(b, lang) }),
      answer: String(sum),
      prompt: (w) => {
        const size = Math.min(44, w / 9);
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {group(a, size)}
            <Txt size={40} weight="black" color={colors.orange}>
              +
            </Txt>
            {group(b, size)}
            <Txt size={40} weight="black" color={colors.orange}>
              = ?
            </Txt>
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
              {numberLabel(v, lang, script)}
            </Txt>
          </View>
        ),
      })),
    };
  }, [max, t, lang]);

  return <QuizGame id="math" title={t('g_math')} makeRound={makeRound} />;
}
