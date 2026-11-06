import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { Icon } from '@/components/Icon';
import { PremiumGuard, usePremiumLimit } from '@/components/Premium';
import { RewardModal } from '@/components/Reward';
import { Header, RoundButton, Screen, StarBadge, Txt } from '@/components/ui';
import { PALETTE, PICTURES } from '@/data/coloring';
import { useApp } from '@/store/AppStore';
import { colors, radius, useLayout } from '@/theme';
import { praise, tap } from '@/utils/feedback';
import { useT } from '@/i18n';

const FREE = 3;
/** Sessiya davomida bo'yalgan rasmlar saqlanib turadi */
const memory: Record<string, Record<number, string>> = {};

export default function ColoringScreen() {
  const { width, height, isLandscape, scale, gutter } = useLayout();
  const { recordGame } = useApp();
  const { t } = useT();
  const { isLocked } = usePremiumLimit(FREE);
  const [picIdx, setPicIdx] = useState(0);
  const [color, setColor] = useState(PALETTE[0]);
  const [fills, setFills] = useState<Record<number, string>>(memory[PICTURES[0].id] ?? {});
  const [reward, setReward] = useState(false);
  const [locked, setLocked] = useState(false);
  const [rewarded, setRewarded] = useState<Record<string, boolean>>({});

  const pic = PICTURES[picIdx];
  const canvas = Math.round(
    isLandscape ? Math.min(height - 210 * scale, (width - gutter * 2) * 0.6) : Math.min(width - gutter * 2, height * 0.52, 640),
  );

  const open = (i: number) => {
    if (isLocked(i)) return setLocked(true);
    setPicIdx(i);
    setFills(memory[PICTURES[i].id] ?? {});
  };

  const fill = (i: number) => {
    tap();
    const next = { ...fills, [i]: color };
    setFills(next);
    memory[pic.id] = next;
    const needed = pic.regions.map((r, idx) => (idx === 0 || r.fixed ? -1 : idx)).filter((x) => x >= 0);
    if (!rewarded[pic.id] && needed.every((idx) => next[idx] && next[idx] !== '#FFFFFF')) {
      setRewarded((r) => ({ ...r, [pic.id]: true }));
      recordGame('coloring', 3);
      praise();
      setTimeout(() => setReward(true), 500);
    }
  };

  const clear = () => {
    setFills({});
    memory[pic.id] = {};
  };

  const sw = 40 * scale;
  const palette = (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        maxWidth: isLandscape ? sw * 3 + 30 : canvas,
      }}
    >
      {PALETTE.map((c) => (
        <Pressable
          key={c}
          accessibilityLabel={`Rang ${c}`}
          onPress={() => {
            tap();
            setColor(c);
          }}
          style={{
            width: sw,
            height: sw,
            borderRadius: sw / 2,
            backgroundColor: c,
            borderWidth: color === c ? 5 : 3,
            borderColor: color === c ? colors.ink : '#EADFCB',
            transform: [{ scale: color === c ? 1.15 : 1 }],
          }}
        />
      ))}
    </View>
  );

  return (
    <Screen scroll={false}>
      <Header
        title={t('coloring')}
        right={
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <RoundButton icon="eraser" tint="pink" label={t('clear')} onPress={clear} size={48} />
            <StarBadge />
          </View>
        }
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 4 }} style={{ flexGrow: 0 }}>
        {PICTURES.map((p, i) => (
          <Pressable
            key={p.id}
            onPress={() => open(i)}
            style={{
              width: 64 * scale,
              height: 64 * scale,
              borderRadius: 20,
              backgroundColor: i === picIdx ? '#FFE7D6' : '#fff',
              borderWidth: 3,
              borderColor: i === picIdx ? colors.orange : colors.line,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 32 * scale }}>{p.emoji}</Text>
            {isLocked(i) && (
              <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: colors.ink, borderRadius: 10, padding: 3 }}>
                <Icon name="crown" size={12} color={colors.yellow} />
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ flex: 1, flexDirection: isLandscape ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <View style={{ width: canvas, height: canvas, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 4, borderColor: '#FFE2A8' }}>
          <Svg width="100%" height="100%" viewBox="0 0 300 300">
            {pic.regions.map((r, i) => (
              <Path
                key={i}
                d={r.d}
                fill={r.fixed ?? fills[i] ?? '#FFFFFF'}
                stroke={i === 0 ? 'none' : colors.ink}
                strokeWidth={3.5}
                strokeLinejoin="round"
                onPress={r.fixed ? undefined : () => fill(i)}
              />
            ))}
            <G pointerEvents="none">
              {pic.lines?.map((d, i) => (
                <Path key={i} d={d} stroke={colors.ink} strokeWidth={3.5} strokeLinecap="round" fill="none" />
              ))}
            </G>
          </Svg>
        </View>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Txt size={22} weight="black">
            {pic.emoji} {t(pic.title)}
          </Txt>
          {palette}
        </View>
      </View>

      <RewardModal
        visible={reward}
        message={t('coloredMsg')}
        onClose={() => {
          setReward(false);
          const next = picIdx + 1;
          if (next < PICTURES.length) open(next);
        }}
      />
      <PremiumGuard visible={locked} onClose={() => setLocked(false)} />
    </Screen>
  );
}
