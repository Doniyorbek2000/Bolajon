import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { QuizGame } from '@/components/QuizGame';
import { LEVELS_PER_WORLD, TASK_LEVELS } from '@/config';
import { isWorldId, taskKey, taskRound } from '@/data/taskGen';
import { useT } from '@/i18n';
import { useApp } from '@/store/AppStore';

export default function TaskPlay() {
  const { world, level } = useLocalSearchParams<{ world: string; level: string }>();
  const { t, lang, script } = useT();
  const { completeTask, access } = useApp();
  const k = Number(level);
  const valid = isWorldId(world) && Number.isInteger(k) && k >= 0 && k < LEVELS_PER_WORLD && k < TASK_LEVELS[access];

  const makeRound = useCallback((i: number) => taskRound(world as never, k, i, { t, lang, script }), [world, k, t, lang, script]);
  if (!valid) return <Redirect href="/tasks" />;

  return (
    <QuizGame
      key={`${world}-${k}`}
      id="task"
      premium={false}
      rounds={3}
      title={t('taskN', { n: k + 1 })}
      makeRound={makeRound}
      onFinish={(stars) => completeTask(taskKey(world, k), stars)}
      onNext={k + 1 < Math.min(LEVELS_PER_WORLD, TASK_LEVELS[access]) ? () => router.replace({ pathname: '/tasks/play', params: { world, level: String(k + 1) } }) : undefined}
    />
  );
}
