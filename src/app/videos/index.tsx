import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Mascot } from '@/components/Mascot';
import { PremiumGuard } from '@/components/Premium';
import { Header, Screen, StarBadge, Squishy, Txt } from '@/components/ui';
import { useCatalog, VIDEO_CATEGORIES, VideoItem } from '@/data/videos';
import { useApp, VideoCategoryId } from '@/store/AppStore';
import { colors, radius, tints, useLayout } from '@/theme';

function VideoCard({ v, width, locked, onPress }: { v: VideoItem; width: number; locked: boolean; onPress: () => void }) {
  const t = tints[v.tint] ?? tints.orange;
  const h = width * 0.62;
  return (
    <Squishy onPress={onPress} shadowColor="#E9D9BC" depth={6} style={{ width, borderRadius: radius.lg, backgroundColor: '#fff', overflow: 'hidden' }}>
      <LinearGradient colors={[t.base, t.dark]} style={{ height: h, alignItems: 'center', justifyContent: 'center' }}>
        {v.poster ? (
          <Image source={{ uri: v.poster }} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <Text style={{ fontSize: h * 0.45 }}>{v.emoji}</Text>
        )}
        <View style={{ position: 'absolute', width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={locked ? 'lock' : 'play'} size={28} color={t.dark} />
        </View>
        <View style={{ position: 'absolute', right: 10, bottom: 10, backgroundColor: 'rgba(43,45,66,0.8)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Txt size={13} color="#fff">
            {v.duration} daq
          </Txt>
        </View>
        {locked && (
          <View style={{ position: 'absolute', left: 10, top: 10, backgroundColor: colors.ink, borderRadius: 12, padding: 5 }}>
            <Icon name="crown" size={16} color={colors.yellow} />
          </View>
        )}
      </LinearGradient>
      <View style={{ padding: 12, gap: 2 }}>
        <Txt size={17} weight="black" numberOfLines={2}>
          {v.title}
        </Txt>
        <Txt size={13} color={colors.green}>
          ✓ Tekshirilgan
        </Txt>
      </View>
    </Squishy>
  );
}

export default function VideosScreen() {
  const { data, isPremium } = useApp();
  const { items } = useCatalog();
  const { contentWidth, columns } = useLayout();
  const [cat, setCat] = useState<VideoCategoryId | 'all'>('all');
  const [locked, setLocked] = useState(false);

  const allowed = VIDEO_CATEGORIES.filter((c) => data.parental.categories[c.id]);
  const list = useMemo(
    () =>
      items.filter(
        (v) =>
          data.parental.categories[v.category] !== false &&
          (cat === 'all' || v.category === cat) &&
          (!v.ages || (data.child.age >= v.ages[0] - 1 && data.child.age <= v.ages[1] + 1)),
      ),
    [items, cat, data.parental.categories, data.child.age],
  );

  const cols = Math.max(1, columns - 1 + (contentWidth > 500 ? 1 : 0));
  const w = Math.floor((contentWidth - 16 * (cols - 1)) / cols);

  return (
    <Screen>
      <Header title="Multfilmlar" right={<StarBadge />} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 6 }} style={{ flexGrow: 0, marginBottom: 12 }}>
        {[{ id: 'all' as const, title: 'Hammasi', emoji: '🌈', tint: 'yellow' as const }, ...allowed].map((c) => {
          const active = cat === c.id;
          const t = tints[c.tint];
          return (
            <Pressable
              key={c.id}
              onPress={() => setCat(c.id)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, backgroundColor: active ? t.base : '#fff', borderWidth: 3, borderColor: active ? t.base : colors.line }}
            >
              <Text style={{ fontSize: 20 }}>{c.emoji}</Text>
              <Txt size={16} weight="black" color={active ? '#fff' : colors.ink}>
                {c.title}
              </Txt>
            </Pressable>
          );
        })}
      </ScrollView>

      {list.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 40, gap: 10 }}>
          <Mascot size={140} mood="sleepy" />
          <Txt size={22} weight="black" center>
            Tez orada yangi videolar!
          </Txt>
          <Txt size={16} color={colors.inkSoft} center>
            Bu bo'limga multfilmlar qo'shilmoqda
          </Txt>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {list.map((v) => {
            const isLocked = !v.free && !isPremium;
            return (
              <VideoCard
                key={v.id}
                v={v}
                width={w}
                locked={isLocked}
                onPress={() => (isLocked ? setLocked(true) : router.push({ pathname: '/videos/[id]', params: { id: v.id } }))}
              />
            );
          })}
        </View>
      )}
      <PremiumGuard visible={locked} onClose={() => setLocked(false)} />
    </Screen>
  );
}
