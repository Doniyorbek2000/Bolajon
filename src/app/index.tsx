import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Mascot } from '@/components/Mascot';
import { ParentalGate } from '@/components/ParentalGate';
import { RoundButton, Screen, StarBadge, Squishy, Tile, Txt } from '@/components/ui';
import { GAMES, gameTitle } from '@/data/games';
import { TOTAL_TASKS } from '@/data/taskGen';
import { useT } from '@/i18n';
import { LANGS } from '@/i18n/langs';
import { useApp } from '@/store/AppStore';
import { colors, radius, tints, TintName, useLayout } from '@/theme';
import { say } from '@/utils/feedback';

const GREETS = ['greet1', 'greet2', 'greet3'] as const;

export default function Home() {
  const { data, isPremium } = useApp();
  const { t, lang, script } = useT();
  const { contentWidth, isTablet, scale, columns } = useLayout();
  const [gate, setGate] = useState(false);
  const [greetKey] = useState(() => GREETS[Math.floor(Math.random() * GREETS.length)]);

  if (!data.onboarded) return <Redirect href="/onboarding" />;

  const cols = isTablet ? 3 : 2;
  const gap = 16;
  const tileW = Math.floor((contentWidth - gap * (cols - 1)) / cols);
  const name = data.child.name || t('defaultName');
  const greet = t(greetKey);
  const alphabetTitle = data.uzScript === 'new' ? t('newAlphabetShort') : t('alphabet');

  const main: { emoji: string; title: string; subtitle: string; tint: TintName; go: () => void }[] = [
    { emoji: '🎮', title: t('games'), subtitle: t('gamesCount', { n: GAMES.length }), tint: 'purple', go: () => router.push('/games') },
    { emoji: '🌍', title: t('languages'), subtitle: t('languagesSub'), tint: 'blue', go: () => router.push('/learn') },
    { emoji: '📺', title: t('cartoons'), subtitle: t('safeVideos'), tint: 'orange', go: () => router.push('/videos') },
    { emoji: '🔤', title: alphabetTitle, subtitle: 'Ö Ğ Ş Ç', tint: 'pink', go: () => router.push('/learn/uz/alphabet') },
    { emoji: '✍️', title: t('g_letters'), subtitle: t('writeLetters'), tint: 'teal', go: () => router.push('/games/trace?kind=letters') },
    { emoji: '🎨', title: t('coloring'), subtitle: t('pickColor'), tint: 'green', go: () => router.push('/games/coloring') },
    { emoji: '⚡', title: t('shorts'), subtitle: t('safeVideos'), tint: 'red', go: () => router.push('/videos/shorts') },
    { emoji: '🏅', title: t('profileTitle'), subtitle: t('stickers'), tint: 'yellow', go: () => router.push('/profile') },
    { emoji: '🏆', title: t('rating'), subtitle: t('ratingSub'), tint: 'purple', go: () => router.push('/rating') },
  ];

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 }}>
        <Pressable
          onPress={() => router.push('/profile')}
          accessibilityLabel={t('profileTitle')}
          style={{
            width: 56 * scale,
            height: 56 * scale,
            borderRadius: 28 * scale,
            backgroundColor: tints.yellow.soft,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: colors.yellow,
            overflow: 'hidden',
          }}
        >
          {data.child.photo ? (
            <Image source={{ uri: data.child.photo }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <Text allowFontScaling={false} style={{ fontSize: 30 * scale }}>{data.child.avatar}</Text>
          )}
        </Pressable>
        <Pressable style={{ flex: 1 }} onPress={() => router.push('/profile')}>
          <Txt size={14} color={colors.inkSoft}>
            {t('hello')}
          </Txt>
          <Txt size={24} weight="black" numberOfLines={1}>
            {name}! 👋
          </Txt>
        </Pressable>
        <StarBadge />
        <RoundButton icon="gear" label={t('parentsArea')} onPress={() => setGate(true)} size={52} />
      </View>

      <Pressable
        onPress={() => say(`${t('sayHello', { name })} ${greet}`)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: radius.xl,
          padding: 14,
          marginVertical: 8,
          borderWidth: 3,
          borderColor: '#FFE2A8',
          gap: 12,
        }}
      >
        <Mascot size={(isTablet ? 130 : 100) * scale} mood="happy" />
        <View style={{ flex: 1 }}>
          <Txt size={22} weight="black" color={colors.orangeDark}>
            {greet}
          </Txt>
          <Txt size={15} color={colors.inkSoft} style={{ marginTop: 4 }}>
            {t('tapMe')}
          </Txt>
        </View>
      </Pressable>

      {/* vazifalar xaritasi */}
      <Squishy
        onPress={() => router.push('/tasks')}
        shadowColor={colors.orangeDark}
        depth={8}
        accessibilityLabel={t('tasks')}
        style={{ backgroundColor: colors.orange, borderRadius: radius.xl, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 8 }}
      >
        <Text allowFontScaling={false} style={{ fontSize: 52 * scale }}>
          🗺️
        </Text>
        <View style={{ flex: 1, gap: 4 }}>
          <Txt size={22} weight="black" color="#fff">
            {t('tasks')}
          </Txt>
          <Txt size={14} color="#FFF1E6">
            {t('tasksDone', { a: Object.keys(data.progress.tasks).length, b: TOTAL_TASKS })}
          </Txt>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.35)', overflow: 'hidden' }}>
            <View style={{ width: `${Math.max(3, (Object.keys(data.progress.tasks).length / TOTAL_TASKS) * 100)}%`, height: '100%', backgroundColor: '#fff' }} />
          </View>
        </View>
        <Icon name="play" size={30} color="#fff" />
      </Squishy>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap, marginTop: 10 }}>
        {main.map((m) => (
          <Tile key={m.title} emoji={m.emoji} title={m.title} subtitle={m.subtitle} tint={m.tint} width={tileW} height={tileW * (isTablet ? 0.8 : 0.95)} onPress={m.go} />
        ))}
      </View>

      {/* tillar */}
      <Pressable onPress={() => router.push('/learn')} style={{ marginTop: 22 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: radius.lg, padding: 14, borderWidth: 3, borderColor: tints.blue.soft, gap: 8 }}>
          <Txt size={18} weight="black">
            🌍 {t('learnTitle')}
          </Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {LANGS.map((l) => (
              <View key={l.code} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: tints.blue.soft, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text allowFontScaling={false} style={{ fontSize: 16 }}>{l.flag}</Text>
                <Txt size={13}>{l.native}</Txt>
              </View>
            ))}
          </View>
        </View>
      </Pressable>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 10 }}>
        <Txt size={22} weight="black">
          {t('favGames')}
        </Txt>
        <Pressable onPress={() => router.push('/games')} hitSlop={10}>
          <Txt size={16} color={colors.purple}>
            {t('seeAll')}
          </Txt>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 6 }}>
        {GAMES.filter((g) => ['math', 'simon', 'findnum', 'arrows', 'colors', 'sounds', 'different', 'food', 'feelings', 'pattern'].includes(g.id)).map((g) => {
          const w = Math.max(130, contentWidth / (columns + 1.4));
          return (
            <Tile key={g.id} emoji={g.emoji} title={gameTitle(g, t, lang, script)} tint={g.tint} width={w} height={w} locked={!g.free && !isPremium} onPress={() => router.push(g.href)} />
          );
        })}
      </ScrollView>

      {!isPremium && (
        <Pressable
          onPress={() => setGate(true)}
          style={{ marginTop: 22, borderRadius: radius.lg, backgroundColor: colors.ink, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}
        >
          <Icon name="crown" size={36} color={colors.yellow} />
          <View style={{ flex: 1 }}>
            <Txt size={18} weight="black" color="#fff">
              {t('premiumTitle')}
            </Txt>
            <Txt size={14} color="#C8CAE0">
              {t('premiumBanner')}
            </Txt>
          </View>
          <Icon name="lock" size={24} color="#fff" />
        </Pressable>
      )}

      <ParentalGate
        visible={gate}
        onCancel={() => setGate(false)}
        onPass={() => {
          setGate(false);
          router.push('/parents');
        }}
      />
    </Screen>
  );
}
