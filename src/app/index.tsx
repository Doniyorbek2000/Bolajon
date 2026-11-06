import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Mascot } from '@/components/Mascot';
import { ParentalGate } from '@/components/ParentalGate';
import { RoundButton, Screen, StarBadge, Tile, Txt } from '@/components/ui';
import { GAMES } from '@/data/games';
import { useApp } from '@/store/AppStore';
import { colors, radius, tints, useLayout } from '@/theme';
import { say } from '@/utils/feedback';

const GREETINGS = ['Bugun nima o\'ynaymiz?', 'Keling, yangi narsa o\'rganamiz!', 'Sen bugun juda zo\'rsan!'];

export default function Home() {
  const { data, isPremium } = useApp();
  const { contentWidth, isTablet, scale, columns } = useLayout();
  const [gate, setGate] = useState(false);
  const [greet] = useState(() => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);

  if (!data.onboarded) return <Redirect href="/onboarding" />;

  const cols = isTablet ? 4 : 2;
  const gap = 16;
  const tileW = Math.floor((contentWidth - gap * (cols - 1)) / cols);
  const name = data.child.name || 'Bolajon';

  const main = [
    { emoji: '🎮', title: "O'yinlar", subtitle: `${GAMES.length} ta o'yin`, tint: 'purple' as const, go: () => router.push('/games') },
    { emoji: '📺', title: 'Multfilmlar', subtitle: 'Xavfsiz videolar', tint: 'orange' as const, go: () => router.push('/videos') },
    { emoji: '🔤', title: 'Alifbo', subtitle: 'Harflarni yoz', tint: 'pink' as const, go: () => router.push('/games/trace?kind=letters') },
    { emoji: '🎨', title: "Bo'yash", subtitle: 'Rang tanla', tint: 'green' as const, go: () => router.push('/games/coloring') },
  ];

  return (
    <Screen>
      {/* yuqori panel */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 }}>
        <View style={{ width: 56 * scale, height: 56 * scale, borderRadius: 28 * scale, backgroundColor: tints.yellow.soft, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.yellow }}>
          <Text style={{ fontSize: 30 * scale }}>{data.child.avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Txt size={14} color={colors.inkSoft}>
            Salom,
          </Txt>
          <Txt size={24} weight="black" numberOfLines={1}>
            {name}! 👋
          </Txt>
        </View>
        <StarBadge />
        <RoundButton icon="gear" label="Ota-onalar bo'limi" onPress={() => setGate(true)} size={52} />
      </View>

      {/* maskot */}
      <Pressable
        onPress={() => say(`Salom ${name}! ${greet}`)}
        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.xl, padding: 14, marginVertical: 8, borderWidth: 3, borderColor: '#FFE2A8', gap: 12 }}
      >
        <Mascot size={(isTablet ? 130 : 96) * scale} mood="happy" />
        <View style={{ flex: 1 }}>
          <Txt size={22} weight="black" color={colors.orangeDark}>
            {greet}
          </Txt>
          <Txt size={15} color={colors.inkSoft} style={{ marginTop: 4 }}>
            Meni bos — men gapiraman! 🔊
          </Txt>
        </View>
      </Pressable>

      {/* asosiy bo'limlar */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap, marginTop: 10 }}>
        {main.map((m) => (
          <Tile key={m.title} emoji={m.emoji} title={m.title} subtitle={m.subtitle} tint={m.tint} width={tileW} height={tileW * 0.95} onPress={m.go} />
        ))}
      </View>

      {/* tezkor o'yinlar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 10 }}>
        <Txt size={22} weight="black">
          Sevimli o'yinlar
        </Txt>
        <Pressable onPress={() => router.push('/games')} hitSlop={10}>
          <Txt size={16} color={colors.purple}>
            Hammasi →
          </Txt>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 6 }}>
        {GAMES.slice(3).map((g) => (
          <Tile
            key={g.id}
            emoji={g.emoji}
            title={g.title}
            tint={g.tint}
            width={Math.max(130, contentWidth / (columns + 1.4))}
            height={Math.max(130, contentWidth / (columns + 1.4))}
            locked={!g.free && !isPremium}
            onPress={() => router.push(g.href)}
          />
        ))}
      </ScrollView>

      {!isPremium && (
        <Pressable
          onPress={() => setGate(true)}
          style={{ marginTop: 22, borderRadius: radius.lg, backgroundColor: colors.ink, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}
        >
          <Icon name="crown" size={36} color={colors.yellow} />
          <View style={{ flex: 1 }}>
            <Txt size={18} weight="black" color="#fff">
              Bolajon Premium
            </Txt>
            <Txt size={14} color="#C8CAE0">
              Barcha o'yinlar va multfilmlar — ota-onalar uchun
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
