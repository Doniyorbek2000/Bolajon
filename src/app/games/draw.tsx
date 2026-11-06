import React, { useRef, useState } from 'react';
import { GestureResponderEvent, Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { GameAccess } from '@/components/Premium';
import { Header, RoundButton, Screen, Txt } from '@/components/ui';
import { PALETTE } from '@/data/coloring';
import { colors, radius, useLayout } from '@/theme';
import { praise, tap } from '@/utils/feedback';
import { useApp } from '@/store/AppStore';

type Line = { color: string; width: number; pts: string[] };
const SIZES = [6, 12, 22];

export default function DrawScreen() {
  const { width, height, gutter, isLandscape, scale } = useLayout();
  const { recordGame } = useApp();
  const [lines, setLines] = useState<Line[]>([]);
  const [color, setColor] = useState(PALETTE[7]);
  const [size, setSize] = useState(SIZES[1]);
  const praised = useRef(false);

  const pt = (e: GestureResponderEvent) => `${e.nativeEvent.locationX.toFixed(1)} ${e.nativeEvent.locationY.toFixed(1)}`;
  const responder = {
    onStartShouldSetResponder: () => true,
    onMoveShouldSetResponder: () => true,
    onResponderTerminationRequest: () => false,
    onResponderGrant: (e: GestureResponderEvent) => {
      const p = pt(e);
      setLines((l) => [...l, { color, width: size, pts: [p, p] }]);
    },
    onResponderMove: (e: GestureResponderEvent) => {
      const p = pt(e);
      setLines((l) => {
        const c = l.slice();
        const last = c[c.length - 1];
        if (last) c[c.length - 1] = { ...last, pts: [...last.pts, p] };
        return c;
      });
    },
    onResponderRelease: () => {
      if (!praised.current && lines.length > 12) {
        praised.current = true;
        recordGame('draw', 2);
        praise();
      }
    },
  };

  const cw = isLandscape ? width - gutter * 2 - 150 * scale : width - gutter * 2;
  const ch = isLandscape ? height - 120 * scale : height - 300 * scale;

  return (
    <Screen scroll={false}>
      <GameAccess id="draw" />
      <Header
        title="Rasm chizamiz"
        right={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <RoundButton icon="back" tint="yellow" label="Bekor qilish" size={48} onPress={() => setLines((l) => l.slice(0, -1))} />
            <RoundButton icon="eraser" tint="pink" label="Tozalash" size={48} onPress={() => setLines([])} />
          </View>
        }
      />
      <View style={{ flex: 1, flexDirection: isLandscape ? 'row' : 'column', gap: 14, alignItems: 'center' }}>
        <View
          style={{ width: cw, height: ch, backgroundColor: '#fff', borderRadius: radius.xl, borderWidth: 4, borderColor: '#FFE2A8', overflow: 'hidden' }}
          {...responder}
        >
          <Svg width="100%" height="100%" pointerEvents="none">
            {lines.map((l, i) => (
              <Path key={i} d={`M${l.pts.join(' L')}`} stroke={l.color} strokeWidth={l.width} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            ))}
          </Svg>
        </View>
        <View style={{ gap: 10, alignItems: 'center', maxWidth: isLandscape ? 140 * scale : undefined }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            {SIZES.map((s) => (
              <Pressable
                key={s}
                onPress={() => {
                  tap();
                  setSize(s);
                }}
                style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: size === s ? '#FFE7D6' : '#fff', borderWidth: 3, borderColor: size === s ? colors.orange : colors.line, alignItems: 'center', justifyContent: 'center' }}
              >
                <View style={{ width: s, height: s, borderRadius: s, backgroundColor: color }} />
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {PALETTE.map((c) => (
              <Pressable
                key={c}
                onPress={() => {
                  tap();
                  setColor(c);
                }}
                style={{ width: 34 * scale, height: 34 * scale, borderRadius: 20, backgroundColor: c, borderWidth: color === c ? 4 : 2, borderColor: color === c ? colors.ink : '#EADFCB' }}
              />
            ))}
          </View>
          {lines.length === 0 && (
            <Txt size={15} color={colors.inkSoft} center>
              Barmog'ing bilan chiz!
            </Txt>
          )}
        </View>
      </View>
    </Screen>
  );
}
