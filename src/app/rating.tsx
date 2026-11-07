import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { Mascot } from '@/components/Mascot';
import { placeName } from '@/components/ProfileForm';
import { Card, Header, KidButton, Screen, StarBadge, Txt } from '@/components/ui';
import { findRegion } from '@/data/regions';
import { levelOf } from '@/data/stickers';
import { useT } from '@/i18n';
import { Board, fetchBoard, leaderboardEnabled, Scope } from '@/services/leaderboard';
import { useApp } from '@/store/AppStore';
import { colors, radius, tints } from '@/theme';

const MEDAL = ['🥇', '🥈', '🥉'];

export default function RatingScreen() {
  const { t, script } = useT();
  const { data } = useApp();
  const [scope, setScope] = useState<Scope>('country');
  const [board, setBoard] = useState<Board | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const region = findRegion(data.child.region);
  const enabled = leaderboardEnabled && data.parental.leaderboard;
  const tasksDone = Object.keys(data.progress.tasks).length;

  const load = useCallback(async () => {
    if (!enabled) return;
    setState('loading');
    try {
      setBoard(await fetchBoard(scope, data.child.region, data.child.district, data.playerId));
      setState('idle');
    } catch {
      setState('error');
    }
  }, [enabled, scope, data.child.region, data.child.district, data.playerId]);

  useEffect(() => {
    load();
  }, [load]);

  const tabs: { id: Scope; label: string }[] = [
    { id: 'country', label: `🇺🇿 ${t('tabCountry')}` },
    { id: 'region', label: `📍 ${t('tabRegion')}` },
    { id: 'district', label: `🏘️ ${t('tabDistrict')}` },
  ];
  const scopeName =
    scope === 'country' ? t('tabCountry') : scope === 'region' ? placeName(region?.name, script) : placeName(data.child.district, script);

  const avatarView = (size: number) => (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.yellow }}>
      {data.child.photo ? (
        <Image source={{ uri: data.child.photo }} style={{ width: '100%', height: '100%' }} />
      ) : (
        <Text allowFontScaling={false} style={{ fontSize: size * 0.6 }}>
          {data.child.avatar}
        </Text>
      )}
    </View>
  );

  return (
    <Screen>
      <Header title={`🏆 ${t('rating')}`} right={<StarBadge />} />

      {/* mening o'rnim */}
      <View style={{ backgroundColor: colors.purple, borderRadius: radius.xl, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        {avatarView(64)}
        <View style={{ flex: 1, gap: 2 }}>
          <Txt size={13} color="#EDE7FF">
            {t('myRank')} · {scopeName}
          </Txt>
          <Txt size={30} weight="black" color="#fff">
            {enabled && board?.me ? t('rankN', { n: board.me.rank }) : '—'}
          </Txt>
          <Txt size={13} color="#EDE7FF">
            ⭐ {data.stars} · 🗺️ {tasksDone} · 🏅 {t('levelN', { n: levelOf(data.stars) })}
          </Txt>
        </View>
        {enabled && board ? (
          <View style={{ alignItems: 'center', maxWidth: 80 }}>
            <Txt size={14} weight="black" color={colors.yellow} center>
              👥 {t('playersN', { n: board.total })}
            </Txt>
          </View>
        ) : null}
      </View>

      {/* bo'limlar */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
        {tabs.map((tb) => (
          <Pressable
            key={tb.id}
            onPress={() => setScope(tb.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: scope === tb.id }}
            style={{ flex: 1, paddingVertical: 12, borderRadius: 18, alignItems: 'center', backgroundColor: scope === tb.id ? colors.blue : '#fff', borderWidth: 3, borderColor: scope === tb.id ? colors.blue : colors.line }}
          >
            <Txt size={14} weight="black" color={scope === tb.id ? '#fff' : colors.ink} numberOfLines={1} adjustsFontSizeToFit>
              {tb.label}
            </Txt>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: 14, gap: 10 }}>
        {!data.parental.leaderboard ? (
          <Card style={{ alignItems: 'center', gap: 10 }}>
            <Mascot size={100} mood="sleepy" />
            <Txt size={16} center color={colors.inkSoft}>
              {t('ratingOff')}
            </Txt>
          </Card>
        ) : !leaderboardEnabled ? (
          <Card style={{ alignItems: 'center', gap: 10 }}>
            <Mascot size={110} mood="wow" />
            <Txt size={18} weight="black" center>
              {t('ratingSoon')}
            </Txt>
            <Txt size={16} center>
              ⭐ {data.stars} · 🗺️ {tasksDone} · 🏅 {t('levelN', { n: levelOf(data.stars) })}
            </Txt>
          </Card>
        ) : state === 'loading' && !board ? (
          <ActivityIndicator size="large" color={colors.purple} style={{ marginTop: 30 }} />
        ) : state === 'error' ? (
          <Card style={{ alignItems: 'center', gap: 12 }}>
            <Mascot size={90} mood="sleepy" />
            <Txt size={16} center color={colors.inkSoft}>
              {t('ratingOffline')}
            </Txt>
            <KidButton small tint="blue" icon="refresh" label={t('retry2')} onPress={load} />
          </Card>
        ) : (
          board?.top.map((e) => {
            const top3 = e.rank <= 3;
            return (
              <View
                key={`${e.rank}-${e.name}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: radius.lg,
                  backgroundColor: e.me ? tints.purple.soft : top3 ? tints.yellow.soft : '#fff',
                  borderWidth: 3,
                  borderColor: e.me ? colors.purple : top3 ? colors.yellow : colors.line,
                }}
              >
                <View style={{ width: 40, alignItems: 'center' }}>
                  {top3 ? (
                    <Text allowFontScaling={false} style={{ fontSize: 30 }}>
                      {MEDAL[e.rank - 1]}
                    </Text>
                  ) : (
                    <Txt size={18} weight="black" color={colors.inkSoft}>
                      {e.rank}
                    </Txt>
                  )}
                </View>
                <Text allowFontScaling={false} style={{ fontSize: 34 }}>
                  {e.avatar}
                </Text>
                <View style={{ flex: 1 }}>
                  <Txt size={17} weight="black" numberOfLines={1}>
                    {e.me ? `${e.name} (${t('you')})` : e.name}
                  </Txt>
                  <Txt size={12} color={colors.inkSoft} numberOfLines={1}>
                    {t('ageN', { n: e.age })} · {scope === 'district' ? placeName(e.district, script) : placeName(findRegion(e.region)?.name, script)}
                  </Txt>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Txt size={18} weight="black" color={colors.orangeDark}>
                    ⭐ {e.stars}
                  </Txt>
                  <Txt size={12} color={colors.inkSoft}>
                    🗺️ {e.tasks} · 🏅 {e.level}
                  </Txt>
                </View>
              </View>
            );
          })
        )}
        <Txt size={12} color={colors.inkSoft} center style={{ marginTop: 6 }}>
          {t('ratingNote')}
        </Txt>
      </View>
    </Screen>
  );
}
