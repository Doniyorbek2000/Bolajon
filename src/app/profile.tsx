import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { placeName } from '@/components/ProfileForm';
import { findRegion } from '@/data/regions';
import { Icon } from '@/components/Icon';
import { Card, Header, Screen, Txt } from '@/components/ui';
import { ALPHABETS } from '@/data/alphabets';
import { GAMES } from '@/data/games';
import { levelOf, PRO_STICKERS, STARS_PER_LEVEL, STARS_PER_STICKER, STICKERS, stickersOpen } from '@/data/stickers';
import { PremiumGuard } from '@/components/Premium';
import { TOPICS } from '@/data/vocab';
import { uzText, useT } from '@/i18n';
import { LANGS } from '@/i18n/langs';
import { useApp } from '@/store/AppStore';
import { colors, radius, tints, useLayout } from '@/theme';
import { say } from '@/utils/feedback';

const TOTAL_WORDS = TOPICS.reduce((a, t) => a + t.words.length, 0);

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <View style={{ height: 12, borderRadius: 6, backgroundColor: '#F1E8D8', overflow: 'hidden' }}>
      <View style={{ width: `${Math.round(Math.min(1, value) * 100)}%`, height: '100%', backgroundColor: color, borderRadius: 6 }} />
    </View>
  );
}

export default function ProfileScreen() {
  const { data, isPro } = useApp();
  const { t } = useT();
  const [locked, setLocked] = useState(false);
  const { contentWidth, scale, isTablet } = useLayout();
  const stars = data.stars;
  const level = levelOf(stars);
  const inLevel = stars % STARS_PER_LEVEL;
  const open = stickersOpen(stars);
  const cols = isTablet ? 8 : 6;
  const cell = Math.floor((contentWidth - 40 - 8 * (cols - 1)) / cols);
  const uzAlpha = ALPHABETS[data.uzScript === 'new' ? 'uz' : 'uzold'];
  const played = Object.values(data.progress.gamesPlayed).reduce((a, b) => a + b, 0);

  const rows: { emoji: string; label: string; value: number; total: number; color: string }[] = [
    { emoji: '🔤', label: t('st_letters'), value: (data.progress.alpha[uzAlpha.id] ?? []).length, total: uzAlpha.letters.length, color: colors.pink },
    { emoji: '🔢', label: t('st_numbers'), value: data.progress.numbers.length, total: 10, color: colors.blue },
    { emoji: '🎮', label: t('st_games'), value: GAMES.filter((g) => data.progress.gamesPlayed[g.id]).length, total: GAMES.length, color: colors.purple },
  ];

  return (
    <Screen>
      <Header title={t('profileTitle')} />
      {/* bosh karta */}
      <View style={{ backgroundColor: colors.purple, borderRadius: radius.xl, padding: 20, alignItems: 'center', gap: 6 }}>
        <View style={{ width: 110 * scale, height: 110 * scale, borderRadius: 55 * scale, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: colors.yellow, overflow: 'hidden' }}>
          {data.child.photo ? (
            <Image source={{ uri: data.child.photo }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <Text allowFontScaling={false} style={{ fontSize: 64 * scale }}>
              {data.child.avatar}
            </Text>
          )}
        </View>
        <Txt size={26} weight="black" color="#fff" center numberOfLines={1} adjustsFontSizeToFit>
          {data.child.name || t('defaultName')}
        </Txt>
        {data.child.region ? (
          <Txt size={14} color="#EDE7FF" center>
            📍 {[placeName(findRegion(data.child.region)?.name, data.uzScript), placeName(data.child.district, data.uzScript)].filter(Boolean).join(', ')}
          </Txt>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.yellow, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Txt size={15} weight="black" color={colors.ink}>
              🏅 {t('levelN', { n: level })}
            </Txt>
          </View>
          {isPro && (
            <View style={{ backgroundColor: colors.ink, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Txt size={15} weight="black" color={colors.yellow}>
                👑 Pro
              </Txt>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="star" size={22} color={colors.yellow} />
            <Txt size={18} weight="black" color="#fff">
              {stars}
            </Txt>
          </View>
        </View>
        <View style={{ alignSelf: 'stretch', marginTop: 8, gap: 4 }}>
          <Bar value={inLevel / STARS_PER_LEVEL} color={colors.yellow} />
          <Txt size={13} color="#EDE7FF" center>
            {t('nextLevel', { n: STARS_PER_LEVEL - inLevel })}
          </Txt>
        </View>
      </View>

      {/* stikerlar */}
      <Card style={{ marginTop: 16, gap: 10 }}>
        <Txt size={20} weight="black">
          ✨ {t('stickers')}
        </Txt>
        <Txt size={14} color={colors.inkSoft}>
          {t('stickersHint', { a: open, b: STICKERS.length })}
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {STICKERS.map((s, i) => {
            const got = i < open;
            return (
              <Pressable
                key={s}
                accessibilityLabel={got ? s : t('lockedSticker', { n: (i + 1) * STARS_PER_STICKER })}
                onPress={() => (got ? say(t('bravo')) : say(t('lockedSticker', { n: (i + 1) * STARS_PER_STICKER })))}
                style={{
                  width: cell,
                  height: cell,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: got ? tints.yellow.soft : '#F3EEE4',
                  borderWidth: 2,
                  borderColor: got ? colors.yellow : colors.line,
                }}
              >
                <Text allowFontScaling={false} style={{ fontSize: cell * 0.55, opacity: got ? 1 : 0.18 }}>
                  {s}
                </Text>
                {!got && (
                  <View style={{ position: 'absolute' }}>
                    <Icon name="lock" size={cell * 0.32} color="#B9AE9A" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* Pro stikerlar */}
      <Card style={{ marginTop: 16, gap: 10, borderColor: '#D9CCFF', backgroundColor: isPro ? '#FBF9FF' : '#fff' }}>
        <Txt size={20} weight="black" color={colors.purpleDark}>
          👑 {t('proStickers')}
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {PRO_STICKERS.map((s, i) => {
            const got = isPro && i < open;
            return (
              <Pressable
                key={s}
                onPress={() => (isPro ? say(got ? t('bravo') : t('lockedSticker', { n: (i + 1) * STARS_PER_STICKER })) : setLocked(true))}
                style={{
                  width: cell,
                  height: cell,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: got ? '#FFF4CC' : '#F1EDFA',
                  borderWidth: 2,
                  borderColor: got ? '#E8B400' : '#DED6F2',
                }}
              >
                <Text allowFontScaling={false} style={{ fontSize: cell * 0.55, opacity: got ? 1 : 0.18 }}>
                  {s}
                </Text>
                {!got && (
                  <View style={{ position: 'absolute' }}>
                    <Icon name={isPro ? 'lock' : 'crown'} size={cell * 0.32} color={isPro ? '#B9AE9A' : colors.purple} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* yutuqlar */}
      <Card style={{ marginTop: 16, gap: 14 }}>
        <Txt size={20} weight="black">
          🏆 {t('myProgress')}
        </Txt>
        {rows.map((r) => (
          <View key={r.label} style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Txt size={16}>
                {r.emoji} {r.label}
              </Txt>
              <Txt size={16} weight="black">
                {r.value}/{r.total}
              </Txt>
            </View>
            <Bar value={r.value / r.total} color={r.color} />
          </View>
        ))}
        <Txt size={16} weight="black" style={{ marginTop: 4 }}>
          🌍 {t('st_words')}
        </Txt>
        {LANGS.map((l) => {
          const n = data.progress.words[l.code]?.length ?? 0;
          return (
            <Pressable key={l.code} onPress={() => router.push({ pathname: '/learn/[lang]', params: { lang: l.code } })} style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Txt size={15}>
                  {l.flag} {l.code === 'uz' ? uzText(l.native, data.uzScript) : l.native}
                </Txt>
                <Txt size={15}>
                  {n}/{TOTAL_WORDS}
                </Txt>
              </View>
              <Bar value={n / TOTAL_WORDS} color={colors.teal} />
            </Pressable>
          );
        })}
        <Txt size={14} color={colors.inkSoft} center style={{ marginTop: 6 }}>
          🎮 {t('timesN', { n: played })} · 📺 {data.progress.videosWatched}
        </Txt>
      </Card>
      <PremiumGuard visible={locked} onClose={() => setLocked(false)} />
    </Screen>
  );
}
