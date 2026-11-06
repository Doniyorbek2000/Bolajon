import React, { useCallback } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { QuizGame, QuizRound } from '@/components/QuizGame';
import { Mascot } from '@/components/Mascot';
import { pick, shuffle } from '@/utils/feedback';
import { useT } from '@/i18n';
import { COLOR_IDS, ColorId, SHAPE_IDS, ShapeId, shapeQuestion } from '@/i18n/shapes';

const COLORS: Record<ColorId, string> = { red: '#FF5A5F', blue: '#3DA9FC', green: '#34C77B', yellow: '#FFC93C', purple: '#8B6CFF' };


export function Shape({ id, color, size }: { id: ShapeId; color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {id === 'circle' && <Circle cx="50" cy="50" r="42" fill={color} />}
      {id === 'square' && <Rect x="10" y="10" width="80" height="80" rx="10" fill={color} />}
      {id === 'triangle' && <Path d="M50 8 L94 88 H6 Z" fill={color} strokeLinejoin="round" stroke={color} strokeWidth="6" />}
      {id === 'star' && <Path d="M50 4 L62 36 L96 37 L69 58 L79 92 L50 72 L21 92 L31 58 L4 37 L38 36 Z" fill={color} />}
      {id === 'heart' && <Path d="M50 88 C10 60 4 38 16 22 C28 8 46 14 50 28 C54 14 72 8 84 22 C96 38 90 60 50 88 Z" fill={color} />}
    </Svg>
  );
}

export default function ShapesScreen() {
  const { t, lang } = useT();
  const makeRound = useCallback((): QuizRound => {
    const target = { s: pick(SHAPE_IDS), c: pick(COLOR_IDS) };
    const opts = [target];
    while (opts.length < 4) {
      const cand = { s: pick(SHAPE_IDS), c: pick(COLOR_IDS) };
      // har bir variant takrorlanmas bo'lsin — savol bir ma'noli qoladi
      if (!opts.some((o) => o.s === cand.s && o.c === cand.c)) opts.push(cand);
    }
    return {
      question: shapeQuestion(lang, target.s, target.c),
      answer: `${target.s}-${target.c}`,
      prompt: () => <Mascot size={120} mood="happy" />,
      options: shuffle(opts).map((o) => ({ key: `${o.s}-${o.c}`, render: (size) => <Shape id={o.s} color={COLORS[o.c]} size={size} /> })),
    };
  }, [lang]);
  return <QuizGame id="shapes" title={t('g_shapes')} makeRound={makeRound} />;
}
