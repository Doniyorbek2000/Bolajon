import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Header, Screen, StarBadge, Tile, Txt } from '@/components/ui';
import { GAME_CATS, GAMES, gameTitle } from '@/data/games';
import { useT } from '@/i18n';
import { useApp } from '@/store/AppStore';
import { colors, useLayout } from '@/theme';

export default function GamesScreen() {
  const { isPremium, data } = useApp();
  const { t, lang, script } = useT();
  const { contentWidth, columns, isTablet } = useLayout();
  const gap = 14;
  const cols = isTablet ? columns + 1 : 3;
  const w = Math.floor((contentWidth - gap * (cols - 1)) / cols);

  return (
    <Screen>
      <Header title={t('games')} right={<StarBadge />} />
      <Txt size={16} color={colors.inkSoft} center style={{ marginBottom: 6 }}>
        {t('gamesHint')} · {t('gamesCount', { n: GAMES.length })}
      </Txt>
      {GAME_CATS.map((c) => {
        // bolaning yoshiga mos o'yinlar oldinda
        const list = GAMES.filter((g) => g.cat === c.id).sort((a, b) => Number(a.minAge > data.child.age) - Number(b.minAge > data.child.age));
        return (
          <View key={c.id} style={{ marginTop: 18 }}>
            <Txt size={20} weight="black" style={{ marginBottom: 10 }}>
              {t(c.title)} · {list.length}
            </Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
              {list.map((g) => (
                <Tile
                  key={g.id}
                  emoji={g.emoji}
                  title={gameTitle(g, t, lang, script)}
                  tint={g.tint}
                  width={w}
                  height={w * 1.08}
                  locked={!g.free && !isPremium}
                  onPress={() => router.push(g.href)}
                />
              ))}
            </View>
          </View>
        );
      })}
    </Screen>
  );
}
