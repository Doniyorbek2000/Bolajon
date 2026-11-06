import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { Mascot } from '@/components/Mascot';
import { QuizGame, QuizRound } from '@/components/QuizGame';
import { CATEGORIES } from '@/data/items';
import { useT } from '@/i18n';
import { pick } from '@/utils/feedback';

export default function CompareScreen() {
  const { t } = useT();
  const makeRound = useCallback((): QuizRound => {
    const more = Math.random() < 0.6;
    let a = 1 + Math.floor(Math.random() * 7);
    let b = 1 + Math.floor(Math.random() * 7);
    while (a === b) b = 1 + Math.floor(Math.random() * 7);
    const emoji = pick(pick(CATEGORIES).items);
    const answer = (more ? a > b : a < b) ? 'L' : 'R';
    const group = (n: number, s: number) => (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 2, width: s * 1.05 }}>
        {Array.from({ length: n }, (_, i) => (
          <Text allowFontScaling={false} key={i} style={{ fontSize: s / 3.6 }}>
            {emoji}
          </Text>
        ))}
      </View>
    );
    return {
      question: more ? t('compareMore') : t('compareLess'),
      answer,
      prompt: () => <Mascot size={110} mood={more ? 'wow' : 'happy'} />,
      options: [
        { key: 'L', render: (s) => group(a, s * 1.3) },
        { key: 'R', render: (s) => group(b, s * 1.3) },
      ],
    };
  }, [t]);
  return <QuizGame id="compare" title={t('g_compare')} makeRound={makeRound} />;
}
