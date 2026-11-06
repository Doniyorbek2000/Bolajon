import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { RewardModal } from '@/components/Reward';
import { Header, KidButton, RoundButton, Screen, StarBadge, Squishy, Txt } from '@/components/ui';
import { ALPHABETS, isAlphabetId, Letter } from '@/data/alphabets';
import { alphabetFor, isLang, scriptOf } from '@/data/learn';
import { uzText, useT } from '@/i18n';
import { useApp } from '@/store/AppStore';
import { colors, fonts, radius, tints, TintName, useLayout } from '@/theme';
import { say, success } from '@/utils/feedback';

const T: TintName[] = ['pink', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'red'];
const STEP_MS = 2300;

export default function AlphabetScreen() {
  const params = useLocalSearchParams<{ lang: string; alphabet?: string }>();
  const { data, markWord, addStars } = useApp();
  const { t } = useT();
  const { contentWidth, columns, scale, isTablet } = useLayout();
  const lang = isLang(params.lang) ? params.lang : 'uz';
  const id = params.alphabet && isAlphabetId(params.alphabet) ? params.alphabet : alphabetFor(lang, data.uzScript);
  const alpha = ALPHABETS[id];
  const script = scriptOf(id);
  const word = (l: Letter) => (alpha.lang === 'uz' ? uzText(l.word, script) : l.word);
  const seenKey = `seen:${id}`;
  const seen = data.progress.alpha[seenKey] ?? [];

  const [open, setOpen] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(-1);
  const [reward, setReward] = useState(false);
  const train = useRef<{ scrollTo: (o: { x: number; animated?: boolean }) => void } | null>(null);
  const bounce = useRef(new Animated.Value(1)).current;
  const rewarded = useRef(false);

  const wagon = 76 * scale;

  const speak = (l: Letter) => say(`${l.name}. ${word(l)}`, alpha.lang);

  const visit = (i: number) => {
    const l = alpha.letters[i];
    markWord('alpha', seenKey, l.id);
    const total = new Set([...seen, l.id]).size;
    if (!rewarded.current && total === alpha.letters.length) {
      rewarded.current = true;
      addStars(5);
      success();
      setTimeout(() => setReward(true), 600);
    }
  };

  const show = (i: number) => {
    setOpen(i);
    speak(alpha.letters[i]);
    visit(i);
    bounce.setValue(0.5);
    Animated.spring(bounce, { toValue: 1, useNativeDriver: true, bounciness: 16 }).start();
  };

  // Alifbo poyezdi: harflarni ketma-ket o'qiydi
  useEffect(() => {
    if (!playing) return;
    const next = cur + 1;
    if (next >= alpha.letters.length) {
      setPlaying(false);
      setCur(-1);
      return;
    }
    const tm = setTimeout(
      () => {
        setCur(next);
        speak(alpha.letters[next]);
        visit(next);
        train.current?.scrollTo({ x: Math.max(0, (next + 1) * (wagon + 10) - contentWidth / 2), animated: true });
      },
      cur < 0 ? 100 : STEP_MS,
    );
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, cur]);

  if (!isLang(params.lang)) return <Redirect href="/learn" />;

  const cols = columns + (isTablet ? 2 : 1);
  const w = Math.floor((contentWidth - 12 * (cols - 1)) / cols);
  const letter = open !== null ? alpha.letters[open] : null;
  const fontFor = alpha.rtl ? undefined : fonts.black;

  return (
    <Screen>
      <Header title={t('alphabet')} right={<StarBadge />} />

      {/* Alifbo poyezdi */}
      <View style={{ backgroundColor: '#fff', borderRadius: radius.lg, paddingVertical: 12, borderWidth: 3, borderColor: tints.blue.soft, marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingHorizontal: 14, marginBottom: 8 }}>
          <Txt size={18} weight="black">
            🚂 {t('train')}
          </Txt>
          <KidButton
            small
            tint={playing ? 'red' : 'green'}
            icon={playing ? 'close' : 'play'}
            label={playing ? t('stop') : t('playAll')}
            onPress={() => {
              if (playing) {
                setPlaying(false);
                setCur(-1);
              } else {
                setCur(-1);
                setPlaying(true);
              }
            }}
          />
        </View>
        <ScrollView ref={train as never} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 10, alignItems: 'flex-end' }}>
          <Text allowFontScaling={false} style={{ fontSize: wagon * 0.9, }}>🚂</Text>
          {alpha.letters.map((l, i) => {
            const tint = tints[T[i % T.length]];
            const active = cur === i;
            return (
              <Pressable key={l.id} onPress={() => show(i)} style={{ alignItems: 'center' }}>
                <View
                  style={{
                    width: wagon,
                    height: wagon,
                    borderRadius: 16,
                    backgroundColor: active ? tint.dark : tint.base,
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ translateY: active ? -10 : 0 }, { scale: active ? 1.12 : 1 }],
                  }}
                >
                  <Text allowFontScaling={false} style={{ fontSize: wagon * 0.5, color: tint.on, fontFamily: fontFor }}>{l.upper}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: wagon * 0.3, marginTop: -6 }}>
                  <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: colors.ink, borderWidth: 3, borderColor: '#999' }} />
                  <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: colors.ink, borderWidth: 3, borderColor: '#999' }} />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
        {cur >= 0 && (
          <Txt size={20} weight="black" center style={{ marginTop: 8 }} color={colors.orangeDark}>
            {alpha.letters[cur].emoji} {alpha.letters[cur].upper} — {word(alpha.letters[cur])}
          </Txt>
        )}
      </View>

      <Txt size={15} color={colors.inkSoft} center style={{ marginBottom: 10 }}>
        {seen.length}/{alpha.letters.length} ⭐
      </Txt>

      {/* harflar */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, direction: alpha.rtl ? 'rtl' : 'ltr' }}>
        {alpha.letters.map((l, i) => {
          const tint = tints[T[i % T.length]];
          const isSeen = seen.includes(l.id);
          return (
            <Squishy
              key={l.id}
              onPress={() => show(i)}
              shadowColor={tint.dark}
              depth={6}
              accessibilityLabel={l.name}
              style={{ width: w, height: w * 1.12, borderRadius: radius.md, backgroundColor: isSeen ? tint.base : tint.soft, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text allowFontScaling={false} style={{ fontSize: w * 0.36, color: isSeen ? tint.on : tint.dark, fontFamily: fontFor }}>
                {l.upper}
                {l.lower !== l.upper ? <Text allowFontScaling={false} style={{ fontSize: w * 0.24 }}> {l.lower}</Text> : null}
              </Text>
              <Text allowFontScaling={false} style={{ fontSize: w * 0.24 }}>{l.emoji}</Text>
            </Squishy>
          );
        })}
      </View>

      <Modal visible={!!letter} transparent animationType="fade" onRequestClose={() => setOpen(null)} supportedOrientations={['portrait', 'landscape']}>
        <Pressable onPress={() => setOpen(null)} style={{ flex: 1, backgroundColor: 'rgba(43,45,66,0.55)', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          {letter && open !== null && (
            <Pressable onPress={() => {}} style={{ backgroundColor: '#fff', borderRadius: radius.xl, padding: 24, alignItems: 'center', width: '100%', maxWidth: 440, gap: 6 }}>
              <Animated.View style={{ transform: [{ scale: bounce }], alignItems: 'center' }}>
                <Text allowFontScaling={false} style={{ fontSize: 120 * scale, color: tints[T[open % T.length]].base, fontFamily: fontFor, lineHeight: 140 * scale }}>
                  {letter.upper}
                  {letter.lower !== letter.upper ? <Text allowFontScaling={false} style={{ fontSize: 80 * scale }}> {letter.lower}</Text> : null}
                </Text>
                <Text allowFontScaling={false} style={{ fontSize: 90 * scale }}>{letter.emoji}</Text>
              </Animated.View>
              <Txt size={32} weight="black" color={colors.ink} center>
                {word(letter)}
              </Txt>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 10, alignItems: 'center' }}>
                <RoundButton icon="back" label={t('prev')} onPress={() => show((open - 1 + alpha.letters.length) % alpha.letters.length)} />
                <RoundButton icon="sound" tint="blue" label={t('listen')} size={68} onPress={() => speak(letter)} />
                <RoundButton icon="next" label={t('next')} onPress={() => show((open + 1) % alpha.letters.length)} />
              </View>
              {letter.strokes && (
                <KidButton
                  small
                  tint="pink"
                  label={t('act_trace')}
                  onPress={() => {
                    setOpen(null);
                    router.push({ pathname: '/games/trace', params: { alphabet: id } });
                  }}
                  style={{ marginTop: 10 }}
                />
              )}
              <Pressable onPress={() => setOpen(null)} style={{ position: 'absolute', top: 14, right: 14 }} hitSlop={10} accessibilityLabel={t('close')}>
                <Icon name="close" size={26} color={colors.inkSoft} />
              </Pressable>
            </Pressable>
          )}
        </Pressable>
      </Modal>
      <RewardModal visible={reward} stars={3} onClose={() => setReward(false)} />
    </Screen>
  );
}
