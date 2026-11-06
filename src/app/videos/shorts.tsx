import { useEvent } from 'expo';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StatusBar, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { Mascot } from '@/components/Mascot';
import { PremiumGuard } from '@/components/Premium';
import { RoundButton, Txt } from '@/components/ui';
import { useCatalog, VideoItem } from '@/data/videos';
import { useT } from '@/i18n';
import { useApp } from '@/store/AppStore';
import { colors } from '@/theme';
import { videoTitle } from './index';

/** Bitta (ko'rinib turgan) video uchun pleyer — xotira va internetni tejaydi */
function ActivePlayer({ item }: { item: VideoItem }) {
  const player = useVideoPlayer(item.uri, (p) => {
    p.loop = true;
    p.play();
  });
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  return (
    <Pressable style={{ flex: 1 }} onPress={() => (player.playing ? player.pause() : player.play())}>
      <VideoView player={player} style={{ flex: 1 }} contentFit="cover" nativeControls={false} allowsPictureInPicture={false} />
      {status === 'loading' && (
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.yellow} />
        </View>
      )}
      {!isPlaying && status === 'readyToPlay' && (
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="play" size={44} color={colors.ink} />
          </View>
        </View>
      )}
    </Pressable>
  );
}

export default function ShortsScreen() {
  const { items } = useCatalog();
  const { data, isPremium, update } = useApp();
  const { t, lang, script } = useT();
  const { height, width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);

  const list = useMemo(() => {
    const allowed = items.filter((v) => data.parental.categories[v.category] !== false && (v.free || isPremium));
    const shorts = allowed.filter((v) => v.category === 'shorts' || v.duration <= 3);
    return shorts.length ? shorts : allowed;
  }, [items, data.parental.categories, isPremium]);
  const hasLocked = items.some((v) => !v.free) && !isPremium;

  const onViewable = useRef(({ viewableItems }: { viewableItems: { index?: number | null }[] }) => {
    const first = viewableItems[0];
    if (first?.index != null) setIndex(first.index);
  }).current;

  useEffect(() => {
    if (list[index]) update((d) => ({ ...d, progress: { ...d.progress, videosWatched: d.progress.videosWatched + 1 } }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <View style={{ flex: 1, backgroundColor: '#111' }}>
      <StatusBar hidden />
      {list.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
          <Mascot size={140} mood="sleepy" />
          <Txt size={20} color="#fff" center>
            {t('comingSoon')}
          </Txt>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(v) => v.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewable}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          getItemLayout={(_, i) => ({ length: height, offset: height * i, index: i })}
          renderItem={({ item, index: i }) => (
            <View style={{ width, height }}>
              {i === index ? (
                <ActivePlayer item={item} />
              ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text allowFontScaling={false} style={{ fontSize: 90 }}>
                    {item.emoji}
                  </Text>
                </View>
              )}
              <View pointerEvents="none" style={{ position: 'absolute', left: 16, right: 16, bottom: 40, gap: 4 }}>
                <Txt size={22} weight="black" color="#fff" style={{ textShadowColor: '#000', textShadowRadius: 6 }}>
                  {item.emoji} {videoTitle(item, lang, script)}
                </Txt>
                <Txt size={14} color="#D7FFE6" style={{ textShadowColor: '#000', textShadowRadius: 6 }}>
                  {t('verified')}
                  {list.length > 1 ? ` · ${t('swipeUp')} ↑` : ''}
                </Txt>
              </View>
            </View>
          )}
        />
      )}
      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0 }} edges={['top']}>
        <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <RoundButton icon="back" label={t('back')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
          <Txt size={18} weight="black" color="#fff">
            ⚡ {t('shorts')}
          </Txt>
          {hasLocked ? <RoundButton icon="crown" tint="yellow" label={t('premiumTitle')} onPress={() => setLocked(true)} /> : <View style={{ width: 56 }} />}
        </View>
      </SafeAreaView>
      <PremiumGuard visible={locked} onClose={() => setLocked(false)} />
    </View>
  );
}
