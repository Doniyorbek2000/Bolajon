import React, { useCallback } from 'react';
import { Text } from 'react-native';
import { QuizGame, QuizRound } from '@/components/QuizGame';
import { Mascot } from '@/components/Mascot';
import { CATEGORIES } from '@/data/items';
import { pick, shuffle } from '@/utils/feedback';
import { useT } from '@/i18n';

export default function OddScreen() {
  const { t } = useT();
  const makeRound = useCallback((): QuizRound => {
    const [main, other] = shuffle(CATEGORIES);
    const same = shuffle(main.items).slice(0, 3);
    const odd = pick(other.items);
    return {
      question: t('oddQ'),
      speak: t('oddSpeak', { cat: t(main.name) }),
      answer: odd,
      prompt: () => <Mascot size={120} mood="wink" />,
      options: shuffle([...same, odd]).map((e) => ({ key: e, render: (s) => <Text allowFontScaling={false} style={{ fontSize: s * 0.85 }}>{e}</Text> })),
    };
  }, [t]);
  return <QuizGame id="odd" title={t('g_odd')} makeRound={makeRound} />;
}
