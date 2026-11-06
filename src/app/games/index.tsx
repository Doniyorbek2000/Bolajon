import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Header, Screen, StarBadge, Tile, Txt } from '@/components/ui';
import { GAMES } from '@/data/games';
import { useApp } from '@/store/AppStore';
import { colors, useLayout } from '@/theme';
import { useT } from '@/i18n';

export default function GamesScreen() {
  const { isPremium, data } = useApp();
  const { t } = useT();
  const { contentWidth, columns } = useLayout();
  const gap = 16;
  const w = Math.floor((contentWidth - gap * (columns - 1)) / columns);
  const sorted = [...GAMES].sort((a, b) => Number(a.minAge > data.child.age) - Number(b.minAge > data.child.age));

  return (
    <Screen>
      <Header title={t('games')} right={<StarBadge />} />
      <Txt size={16} color={colors.inkSoft} center style={{ marginBottom: 14 }}>
        {t('gamesHint')}
      </Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
        {sorted.map((g) => (
          <Tile
            key={g.id}
            emoji={g.emoji}
            title={t(g.title)}
            subtitle={t(g.subtitle)}
            tint={g.tint}
            width={w}
            locked={!g.free && !isPremium}
            onPress={() => router.push(g.href)}
          />
        ))}
      </View>
    </Screen>
  );
}
