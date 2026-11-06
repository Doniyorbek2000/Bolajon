import { Redirect, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { QuizGame } from '@/components/QuizGame';
import { findMiniGame } from '@/data/miniGames';
import { uzText, useT } from '@/i18n';
import { useApp } from '@/store/AppStore';

export default function MiniGameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const game = findMiniGame(id);
  const { t, lang, script } = useT();
  const { data } = useApp();
  const age = data.child.age;
  const makeRound = useCallback(() => game!.make({ t, lang, script, age }), [game, t, lang, script, age]);
  if (!game) return <Redirect href="/games" />;
  const title = lang === 'uz' ? uzText(game.title.uz, script) : game.title[lang];
  return <QuizGame key={game.id} id={game.id} premium={!game.free} title={title} makeRound={makeRound} />;
}
