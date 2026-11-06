import { useEvent } from 'expo';
import { router, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mascot } from '@/components/Mascot';
import { RoundButton, Txt } from '@/components/ui';
import { useCatalog } from '@/data/videos';
import { useApp } from '@/store/AppStore';
import { colors } from '@/theme';
import { useT } from '@/i18n';

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items } = useCatalog();
  const { isPremium, update } = useApp();
  const video = items.find((v) => v.id === id);
  const allowed = !!video && (video.free || isPremium);
  const counted = useRef(false);
  const { t } = useT();

  const player = useVideoPlayer(allowed ? video!.uri : null, (p) => {
    p.loop = false;
    p.play();
  });
  const { status } = useEvent(player, 'statusChange', { status: player.status });

  useEffect(() => {
    if (status === 'readyToPlay' && !counted.current) {
      counted.current = true;
      update((d) => ({ ...d, progress: { ...d.progress, videosWatched: d.progress.videosWatched + 1 } }));
    }
  }, [status, update]);

  useEffect(() => {
    const sub = player.addListener('playToEnd', () => router.back());
    return () => sub.remove();
  }, [player]);

  return (
    <View style={{ flex: 1, backgroundColor: '#111' }}>
      <StatusBar hidden />
      {allowed ? (
        <VideoView
          player={player}
          style={{ flex: 1 }}
          contentFit="contain"
          nativeControls
          allowsPictureInPicture={false}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Mascot size={140} mood="sleepy" />
          <Txt size={20} color="#fff" center>
            {t('notFound')}
          </Txt>
        </View>
      )}
      {allowed && status === 'loading' && (
        <View pointerEvents="none" style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.yellow} />
        </View>
      )}
      {status === 'error' && (
        <View pointerEvents="none" style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Mascot size={120} mood="sleepy" />
          <Txt size={18} color="#fff" center>
            {t('netError')}
          </Txt>
        </View>
      )}
      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0 }} edges={['top', 'left']}>
        <View style={{ padding: 12 }}>
          <RoundButton icon="back" label={t('back')} onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </View>
  );
}
