import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { PremiumGuard } from '@/components/Premium';
import { Header, Screen, StarBadge, Txt } from '@/components/ui';
import { Access, LEVELS_PER_WORLD, TASK_LEVELS } from '@/config';
import { isWorldId, taskKey, WORLDS } from '@/data/taskGen';
import { useT } from '@/i18n';
import { useApp } from '@/store/AppStore';
import { colors, tints, useLayout } from '@/theme';
import { say } from '@/utils/feedback';
import { worldTitle } from './index';

/** Daraja qaysi tarifda ochilishi */
const tierFor = (level: number): Access => (level < TASK_LEVELS.free ? 'free' : level < TASK_LEVELS.standard ? 'standard' : 'pro');

export default function WorldScreen() {
  const { world } = useLocalSearchParams<{ world: string }>();
  const { t, script } = useT();
  const { data, access } = useApp();
  const { contentWidth } = useLayout();
  const [locked, setLocked] = useState(false);
  if (!isWorldId(world)) return <Redirect href="/tasks" />;
  const wd = WORLDS.find((w) => w.id === world)!;
  const tint = tints[wd.tint];
  const cols = 5;
  const cell = Math.floor((contentWidth - 10 * (cols - 1)) / cols);
  const limit = TASK_LEVELS[access];
  const stars = (k: number) => data.progress.tasks[taskKey(world, k)] ?? 0;
  // keyingi bajarilmagan daraja
  let next = 0;
  while (next < LEVELS_PER_WORLD && stars(next) > 0) next++;

  const open = (k: number) => {
    if (k >= limit) return setLocked(true);
    if (k > next) return say(t('taskLockedPrev'));
    router.push({ pathname: '/tasks/play', params: { world, level: String(k) } });
  };

  return (
    <Screen>
      <Header title={`${wd.emoji} ${worldTitle(wd, t, script)}`} right={<StarBadge />} />
      <View style={{ gap: 10, marginTop: 6 }}>
        {Array.from({ length: Math.ceil(LEVELS_PER_WORLD / cols) }, (_, row) => {
          // ilonsimon yo'l: juft qatorlar chapdan o'ngga, toq qatorlar o'ngdan chapga
          const ks = Array.from({ length: cols }, (_, c) => row * cols + c).filter((k) => k < LEVELS_PER_WORLD);
          if (row % 2 === 1) ks.reverse();
          return (
            <View key={row} style={{ flexDirection: 'row', gap: 10, justifyContent: row % 2 === 1 ? 'flex-end' : 'flex-start' }}>
              {ks.map((k) => {
          const s = stars(k);
          const tierLocked = k >= limit;
          const prevLocked = !tierLocked && k > next;
          const current = k === next && !tierLocked;
          const need = tierFor(k);
          return (
            <Pressable
              key={k}
              onPress={() => open(k)}
              accessibilityLabel={t('taskN', { n: k + 1 })}
              style={{
                width: cell,
                height: cell,
                borderRadius: cell / 2,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: s > 0 ? tint.base : current ? '#fff' : tierLocked ? '#EFE8DA' : tint.soft,
                borderWidth: current ? 5 : 3,
                borderColor: s > 0 ? tint.dark : current ? colors.orange : colors.line,
              }}
            >
              {tierLocked ? (
                <Icon name={need === 'pro' ? 'crown' : 'lock'} size={cell * 0.38} color={need === 'pro' ? colors.purple : '#B9AE9A'} />
              ) : (
                <>
                  <Txt size={cell > 60 ? 20 : 16} weight="black" color={s > 0 ? tint.on : prevLocked ? '#B9AE9A' : colors.ink}>
                    {k + 1}
                  </Txt>
                  {s > 0 && (
                    <Text allowFontScaling={false} style={{ fontSize: cell * 0.18, marginTop: -2 }}>
                      {'⭐'.repeat(s)}
                    </Text>
                  )}
                </>
              )}
            </Pressable>
          );
              })}
            </View>
          );
        })}
      </View>
      {limit < LEVELS_PER_WORLD && (
        <Pressable onPress={() => setLocked(true)} style={{ marginTop: 18, backgroundColor: colors.ink, borderRadius: 20, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Icon name="crown" size={28} color={colors.yellow} />
          <Txt size={14} color="#fff" style={{ flex: 1 }}>
            {t('taskLockedTier', { tier: access === 'free' ? t('tierStandard') : t('tierPro') })}
          </Txt>
        </Pressable>
      )}
      <PremiumGuard visible={locked} onClose={() => setLocked(false)} />
    </Screen>
  );
}
