import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { PremiumCard } from '@/components/Premium';
import { Header, Screen, StarBadge, Squishy, Txt } from '@/components/ui';
import { LEVELS_PER_WORLD, TASK_LEVELS } from '@/config';
import { taskKey, TOTAL_TASKS, World, WORLDS } from '@/data/taskGen';
import { uzText, useT } from '@/i18n';
import { LANGS } from '@/i18n/langs';
import { useApp } from '@/store/AppStore';
import { colors, radius, tints, useLayout } from '@/theme';

export function worldTitle(w: World, t: ReturnType<typeof useT>['t'], script: 'new' | 'old') {
  if (!w.lang) return t(w.title);
  const l = LANGS.find((x) => x.code === w.lang)!;
  return t('w_lang', { lang: l.code === 'uz' ? uzText(l.native, script) : l.native });
}

export default function TasksScreen() {
  const { t, script } = useT();
  const { data, access } = useApp();
  const { contentWidth, isTablet } = useLayout();
  const cols = isTablet ? 3 : 2;
  const w = Math.floor((contentWidth - 14 * (cols - 1)) / cols);
  const done = Object.keys(data.progress.tasks).length;

  return (
    <Screen>
      <Header title={t('tasks')} right={<StarBadge />} />
      <View style={{ backgroundColor: '#fff', borderRadius: radius.lg, padding: 14, borderWidth: 3, borderColor: '#FFE2A8', gap: 8, marginBottom: 14 }}>
        <Txt size={18} weight="black" center>
          🗺️ {t('tasksDone', { a: done, b: TOTAL_TASKS })}
        </Txt>
        <View style={{ height: 14, borderRadius: 7, backgroundColor: '#F1E8D8', overflow: 'hidden' }}>
          <View style={{ width: `${Math.max(2, (done / TOTAL_TASKS) * 100)}%`, height: '100%', backgroundColor: colors.green }} />
        </View>
      </View>
      {access === 'free' && <PremiumCard style={{ marginBottom: 14 }} />}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
        {WORLDS.map((wd, i) => {
          const tint = tints[wd.tint];
          const n = Array.from({ length: LEVELS_PER_WORLD }, (_, k) => data.progress.tasks[taskKey(wd.id, k)]).filter(Boolean).length;
          return (
            <Squishy
              key={wd.id}
              onPress={() => router.push({ pathname: '/tasks/[world]', params: { world: wd.id } })}
              shadowColor={tint.dark}
              depth={8}
              accessibilityLabel={worldTitle(wd, t, script)}
              style={{ width: w, height: w * 1.02, borderRadius: radius.lg, backgroundColor: tint.base, padding: 12, alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Txt size={12} weight="black" color={tint.on} style={{ opacity: 0.85 }}>
                {t('worldN', { n: i + 1 })}
              </Txt>
              <Text allowFontScaling={false} style={{ fontSize: w * 0.3 }}>
                {wd.emoji}
              </Text>
              <Txt size={16} weight="black" color={tint.on} center numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.7}>
                {worldTitle(wd, t, script)}
              </Txt>
              <View style={{ alignSelf: 'stretch', gap: 3 }}>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.35)', overflow: 'hidden' }}>
                  <View style={{ width: `${(n / LEVELS_PER_WORLD) * 100}%`, height: '100%', backgroundColor: '#fff' }} />
                </View>
                <Txt size={12} color={tint.on} center>
                  {n}/{LEVELS_PER_WORLD} · 🔓 {Math.min(TASK_LEVELS[access], LEVELS_PER_WORLD)}
                </Txt>
              </View>
            </Squishy>
          );
        })}
      </View>
    </Screen>
  );
}
