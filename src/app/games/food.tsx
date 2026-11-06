import React, { useCallback } from 'react';
import { Text } from 'react-native';
import { QuizGame, QuizRound } from '@/components/QuizGame';
import { useT } from '@/i18n';
import { FOOD_PAIRS as PAIRS } from '@/data/items';
import { pick, shuffle } from '@/utils/feedback';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function FoodScreen() {
  const { t, lang } = useT();
  const makeRound = useCallback((): QuizRound => {
    const target = pick(PAIRS);
    const others = shuffle(PAIRS.filter((p) => p !== target)).slice(0, 3);
    const q = t('foodQ', { animal: target.name[lang] });
    return {
      question: lang === 'uz' || lang === 'tr' ? cap(q) : q,
      answer: target.food,
      prompt: (w) => (
        <Text allowFontScaling={false} style={{ fontSize: Math.min(130, w * 0.32) }}>
          {target.animal}
        </Text>
      ),
      options: shuffle([target, ...others]).map((p) => ({
        key: p.food,
        render: (s) => (
          <Text allowFontScaling={false} style={{ fontSize: s * 0.8 }}>
            {p.food}
          </Text>
        ),
      })),
    };
  }, [t, lang]);
  return <QuizGame id="food" title={t('g_food')} makeRound={makeRound} />;
}
