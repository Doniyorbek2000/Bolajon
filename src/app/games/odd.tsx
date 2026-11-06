import React, { useCallback } from 'react';
import { Text } from 'react-native';
import { QuizGame, QuizRound } from '@/components/QuizGame';
import { Mascot } from '@/components/Mascot';
import { CATEGORIES } from '@/data/items';
import { pick, shuffle } from '@/utils/feedback';

export default function OddScreen() {
  const makeRound = useCallback((): QuizRound => {
    const [main, other] = shuffle(CATEGORIES);
    const same = shuffle(main.items).slice(0, 3);
    const odd = pick(other.items);
    return {
      question: 'Ortiqchasi qaysi?',
      speak: `Ortiqchasi qaysi? Bular ${main.name}. Bittasi boshqacha!`,
      answer: odd,
      prompt: () => <Mascot size={120} mood="wink" />,
      options: shuffle([...same, odd]).map((e) => ({ key: e, render: (s) => <Text style={{ fontSize: s * 0.85 }}>{e}</Text> })),
    };
  }, []);
  return <QuizGame id="odd" title="Ortiqchasi qaysi?" makeRound={makeRound} />;
}
