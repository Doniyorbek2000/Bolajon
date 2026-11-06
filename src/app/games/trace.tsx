import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';
import { Header, RoundButton, Screen, StarBadge, Txt } from '@/components/ui';
import { RewardModal } from '@/components/Reward';
import { Icon } from '@/components/Icon';
import { LETTERS, NUMBERS, Pt, Stroke } from '@/data/glyphs';
import { useApp } from '@/store/AppStore';
import { colors, radius, tints, useLayout } from '@/theme';
import { praise, say, tap } from '@/utils/feedback';
import { PremiumGuard, usePremiumLimit } from '@/components/Premium';

const INK = ['#FF5DA2', '#3DA9FC', '#34C77B', '#FF8A3D', '#8B6CFF'];
const TOL = 13;
const FREE_COUNT = 6;

const toD = (s: Stroke) => s.map((q, i) => `${i ? 'L' : 'M'}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(' ');

export default function TraceScreen() {
  const { kind } = useLocalSearchParams<{ kind?: string }>();
  const isNumbers = kind === 'numbers';
  const glyphs = isNumbers ? NUMBERS : LETTERS;
  const { data, markLearned, recordGame } = useApp();
  const learned = data.progress[isNumbers ? 'numbers' : 'letters'];
  const { isLocked } = usePremiumLimit(FREE_COUNT);
  const { width, height, isLandscape, isTablet, scale, gutter } = useLayout();

  const [index, setIndex] = useState(0);
  const [strokeIdx, setStrokeIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ink, setInk] = useState<Pt[][]>([]);
  const [done, setDone] = useState(false);
  const [locked, setLocked] = useState(false);
  const size = useRef(1);

  const glyph = glyphs[index];
  const strokes = glyph.strokes;
  const color = INK[index % INK.length];

  const canvas = Math.round(
    isLandscape ? Math.min(height - 190 * scale, (width - gutter * 2) * 0.55) : Math.min(width - gutter * 2, height * 0.5, 620),
  );

  const reset = useCallback((i: number) => {
    setIndex(i);
    setStrokeIdx(0);
    setProgress(0);
    setInk([]);
    setDone(false);
  }, []);

  const choose = (i: number) => {
    if (isLocked(i)) return setLocked(true);
    reset(i);
    say(`${glyphs[i].label}. ${glyphs[i].word}`);
  };

  const advance = useCallback(
    (pt: Pt) => {
      if (done) return;
      const s = strokes[strokeIdx];
      if (!s) return;
      let p = progress;
      for (let j = p; j < Math.min(s.length, p + 6); j++) {
        if (Math.hypot(s[j].x - pt.x, s[j].y - pt.y) < TOL) p = j + 1;
      }
      if (p === progress) return;
      if (p >= s.length - 1) {
        tap();
        if (strokeIdx + 1 >= strokes.length) {
          setProgress(s.length);
          setDone(true);
          markLearned(isNumbers ? 'numbers' : 'letters', glyph.id);
          recordGame(isNumbers ? 'numbers' : 'letters', 3);
          praise();
          setTimeout(() => say(`${glyph.label}. ${glyph.word}`), 1200);
        } else {
          setStrokeIdx(strokeIdx + 1);
          setProgress(0);
        }
      } else setProgress(p);
    },
    [done, strokes, strokeIdx, progress, glyph, isNumbers, markLearned, recordGame],
  );

  const toPt = (e: GestureResponderEvent): Pt => ({
    x: (e.nativeEvent.locationX / size.current) * 100,
    y: (e.nativeEvent.locationY / size.current) * 100,
  });

  const responder = {
    onStartShouldSetResponder: () => true,
    onMoveShouldSetResponder: () => true,
    onResponderTerminationRequest: () => false,
    onResponderGrant: (e: GestureResponderEvent) => {
      const pt = toPt(e);
      setInk((k) => [...k, [pt]]);
      advance(pt);
    },
    onResponderMove: (e: GestureResponderEvent) => {
      const pt = toPt(e);
      setInk((k) => {
        const copy = k.slice();
        const last = copy[copy.length - 1] ?? [];
        copy[copy.length - 1] = [...last, pt];
        return copy;
      });
      advance(pt);
    },
  };

  const cur = strokes[strokeIdx];
  const startPt = !done && cur ? cur[Math.min(progress, cur.length - 1)] : null;
  const aheadPt = !done && cur ? cur[Math.min(progress + 4, cur.length - 1)] : null;

  const strip = useMemo(
    () => (
      <ScrollView
        horizontal={!isLandscape}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingVertical: 6, paddingHorizontal: 2 }}
        style={isLandscape ? { maxHeight: canvas, flexGrow: 0, flexShrink: 0, width: 56 * scale + 16 } : { flexGrow: 0 }}
      >
        {glyphs.map((g, i) => {
          const active = i === index;
          const isDone = learned.includes(g.id);
          const lockedItem = isLocked(i);
          const s = 56 * scale;
          return (
            <Pressable
              key={g.id}
              onPress={() => choose(i)}
              accessibilityLabel={g.label}
              style={{
                width: s,
                height: s,
                borderRadius: 18,
                backgroundColor: active ? color : '#fff',
                borderWidth: 3,
                borderColor: active ? color : isDone ? colors.green : colors.line,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Txt size={22} weight="black" color={active ? '#fff' : lockedItem ? '#C9BFAE' : colors.ink}>
                {g.label}
              </Txt>
              {isDone && !active && (
                <View style={{ position: 'absolute', right: -4, top: -4, backgroundColor: colors.green, borderRadius: 10, padding: 2 }}>
                  <Icon name="check" size={14} color="#fff" />
                </View>
              )}
              {lockedItem && (
                <View style={{ position: 'absolute', right: -4, top: -4, backgroundColor: colors.ink, borderRadius: 10, padding: 3 }}>
                  <Icon name="crown" size={12} color={colors.yellow} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [glyphs, index, learned, isLandscape, canvas, scale, color, isLocked],
  );

  return (
    <Screen scroll={false}>
      <Header title={isNumbers ? 'Raqamlar' : 'Harflar'} right={<StarBadge />} />
      {!isLandscape && strip}
      <View style={{ flex: 1, flexDirection: isLandscape ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        {isLandscape && strip}
        <View
          onLayout={(e) => (size.current = e.nativeEvent.layout.width)}
          style={{
            width: canvas,
            height: canvas,
            backgroundColor: '#fff',
            borderRadius: radius.xl,
            borderWidth: 4,
            borderColor: tints.yellow.soft,
            overflow: 'hidden',
          }}
          {...responder}
        >
          <Svg width="100%" height="100%" viewBox="0 0 100 100" pointerEvents="none">
            {/* yozuv chiziqlari */}
            <Line x1="4" y1="10" x2="96" y2="10" stroke="#EAF2FF" strokeWidth="0.8" />
            <Line x1="4" y1="50" x2="96" y2="50" stroke="#EAF2FF" strokeWidth="0.8" strokeDasharray="2 2" />
            <Line x1="4" y1="90" x2="96" y2="90" stroke="#EAF2FF" strokeWidth="0.8" />
            {/* harf soyasi */}
            {strokes.map((s, i) => (
              <Path key={`g${i}`} d={toD(s)} stroke="#EFE7F6" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            ))}
            {strokes.map((s, i) => (
              <Path key={`d${i}`} d={toD(s)} stroke="#C9B8E8" strokeWidth="1.4" strokeDasharray="0.5 3" strokeLinecap="round" fill="none" />
            ))}
            {/* to'ldirilgan qism */}
            {strokes.map((s, i) => {
              const upto = i < strokeIdx || done ? s.length : i === strokeIdx ? progress : 0;
              if (upto < 2) return null;
              return (
                <Path key={`p${i}`} d={toD(s.slice(0, upto))} stroke={color} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              );
            })}
            {/* bolaning chizgani */}
            {ink.map((s, i) =>
              s.length > 1 ? (
                <Path key={`i${i}`} d={toD(s)} stroke={color} strokeOpacity={0.35} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              ) : null,
            )}
            {/* boshlanish nuqtasi va yo'nalish */}
            {startPt && (
              <G>
                {aheadPt && <Line x1={startPt.x} y1={startPt.y} x2={aheadPt.x} y2={aheadPt.y} stroke={colors.green} strokeWidth="2" strokeLinecap="round" />}
                <Circle cx={startPt.x} cy={startPt.y} r="6.5" fill={colors.green} />
                <Circle cx={startPt.x} cy={startPt.y} r="2.6" fill="#fff" />
              </G>
            )}
          </Svg>
        </View>

        <View style={{ alignItems: 'center', gap: 10, minWidth: isLandscape ? 200 : undefined }}>
          <Pressable onPress={() => say(`${glyph.label}. ${glyph.word}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: (isTablet ? 64 : 46) * scale }}>{glyph.emoji}</Text>
            <View>
              <Txt size={30} weight="black" color={color}>
                {glyph.label} — {glyph.word}
              </Txt>
              <Txt size={15} color={colors.inkSoft}>
                Yashil nuqtadan boshlang
              </Txt>
            </View>
          </Pressable>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <RoundButton icon="sound" tint="blue" label="Eshitish" onPress={() => say(`${glyph.label}. ${glyph.word}`)} />
            <RoundButton icon="refresh" tint="yellow" label="Qaytadan" onPress={() => reset(index)} />
          </View>
        </View>
      </View>

      <RewardModal
        visible={done}
        stars={3}
        title="Barakalla!"
        message={`Sen «${glyph.label}» ni yozding!`}
        onAgain={() => reset(index)}
        onClose={() => {
          const next = (index + 1) % glyphs.length;
          if (isLocked(next)) {
            setDone(false);
            setLocked(true);
          } else reset(next);
        }}
      />
      <PremiumGuard visible={locked} onClose={() => setLocked(false)} />
    </Screen>
  );
}
