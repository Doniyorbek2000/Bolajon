import React, { useCallback } from 'react';
import { Text } from 'react-native';
import { Mascot } from '@/components/Mascot';
import { QuizGame, QuizRound } from '@/components/QuizGame';
import { CATEGORIES } from '@/data/items';
import { useT } from '@/i18n';
import { pick, shuffle } from '@/utils/feedback';

const SIZES = [0.32, 0.5, 0.7, 0.95];

export default function BigScreen() {
  const { t } = useT();
  const makeRound = useCallback((): QuizRound => {
    const big = Math.random() < 0.5;
    const emoji = pick(pick(CATEGORIES).items);
    return {
      question: big ? t('bigQ') : t('smallQ'),
      answer: big ? '3' : '0',
      prompt: () => <Mascot size={110} mood="happy" />,
      options: shuffle(SIZES.map((k, i) => ({ key: String(i), k }))).map((o) => ({
        key: o.key,
        render: (s) => (
          <Text allowFontScaling={false} style={{ fontSize: s * o.k * 1.1 }}>
            {emoji}
          </Text>
        ),
      })),
    };
  }, [t]);
  return <QuizGame id="big" title={t('g_big')} makeRound={makeRound} />;
}
