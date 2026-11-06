import React, { useCallback } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { QuizGame, QuizRound } from '@/components/QuizGame';
import { Mascot } from '@/components/Mascot';
import { pick, shuffle } from '@/utils/feedback';

const SHAPES = [
  { id: 'circle', name: 'doira' },
  { id: 'square', name: 'kvadrat' },
  { id: 'triangle', name: 'uchburchak' },
  { id: 'star', name: 'yulduz' },
  { id: 'heart', name: 'yurak' },
] as const;
const COLORS = [
  { hex: '#FF5A5F', name: 'qizil' },
  { hex: '#3DA9FC', name: "ko'k" },
  { hex: '#34C77B', name: 'yashil' },
  { hex: '#FFC93C', name: 'sariq' },
  { hex: '#8B6CFF', name: 'binafsha' },
] as const;

type ShapeId = (typeof SHAPES)[number]['id'];

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

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function ShapesScreen() {
  const makeRound = useCallback((): QuizRound => {
    const target = { s: pick(SHAPES), c: pick(COLORS) };
    const opts = [target];
    while (opts.length < 4) {
      const cand = { s: pick(SHAPES), c: pick(COLORS) };
      // har bir variant takrorlanmas bo'lsin — savol bir ma'noli qoladi
      if (!opts.some((o) => o.s.id === cand.s.id && o.c.hex === cand.c.hex)) opts.push(cand);
    }
    const q = `${cap(target.c.name)} ${target.s.name}ni top`;
    return {
      question: q,
      answer: `${target.s.id}-${target.c.hex}`,
      prompt: () => <Mascot size={120} mood="happy" />,
      options: shuffle(opts).map((o) => ({ key: `${o.s.id}-${o.c.hex}`, render: (size) => <Shape id={o.s.id} color={o.c.hex} size={size} /> })),
    };
  }, []);
  return <QuizGame id="shapes" title="Shakl va rang" makeRound={makeRound} />;
}
