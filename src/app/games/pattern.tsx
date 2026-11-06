import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { QuizGame, QuizRound } from '@/components/QuizGame';
import { CATEGORIES } from '@/data/items';
import { colors } from '@/theme';
import { pick, shuffle } from '@/utils/feedback';
import { useT } from '@/i18n';

const PATTERNS = [
  [0, 1],
  [0, 0, 1],
  [0, 1, 1],
  [0, 1, 2],
];

export default function PatternScreen() {
  const { t } = useT();
  const makeRound = useCallback((i: number): QuizRound => {
    const pat = PATTERNS[Math.min(PATTERNS.length - 1, Math.floor(i / 2) + Math.floor(Math.random() * 2))];
    const pool = shuffle(pick(CATEGORIES).items);
    const kinds = pool.slice(0, 3);
    const len = pat.length * 2 + 1;
    const seq = Array.from({ length: len }, (_, k) => kinds[pat[k % pat.length]]);
    const answer = seq[len - 1];
    const shown = seq.slice(0, len - 1);
    const opts = shuffle([...new Set([answer, ...kinds, pool[3]])]).slice(0, 3);
    if (!opts.includes(answer)) opts[0] = answer;
    return {
      question: t('nextQ'),
      speak: t('nextSpeak'),
      answer,
      prompt: (w) => {
        const size = Math.min(60, (w - 20) / (len + 0.5) - 10);
        return (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            {shown.map((e, k) => (
              <Text key={k} style={{ fontSize: size }}>
                {e}
              </Text>
            ))}
            <View
              style={{
                width: size * 1.4,
                height: size * 1.4,
                borderRadius: 18,
                borderWidth: 4,
                borderStyle: 'dashed',
                borderColor: colors.orange,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: size * 0.8, color: colors.orange, fontWeight: '900' }}>?</Text>
            </View>
          </View>
        );
      },
      options: shuffle(opts).map((e) => ({ key: e, render: (s) => <Text style={{ fontSize: s * 0.85 }}>{e}</Text> })),
    };
  }, [t]);
  return <QuizGame id="pattern" title={t('g_pattern')} makeRound={makeRound} />;
}
