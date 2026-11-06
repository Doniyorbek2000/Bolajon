import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { RewardModal } from '@/components/Reward';
import { Header, Screen, StarBadge, Txt } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { colors, fonts, radius, useLayout } from '@/theme';
import { praise, say, shuffle, tap } from '@/utils/feedback';
import { useT } from '@/i18n';

const POOL = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐸', '🐵', '🦁', '🐯', '🐮', '🐷', '🐥', '🦄', '🐙', '🐢'];
const LEVELS = [
  { pairs: 3, label: 'lvl_easy' },
  { pairs: 4, label: 'lvl_mid' },
  { pairs: 6, label: 'lvl_hard' },
  { pairs: 8, label: 'lvl_master' },
] as const;

type Card = { id: number; emoji: string; open: boolean; matched: boolean };

const deal = (pairs: number): Card[] =>
  shuffle(shuffle(POOL).slice(0, pairs).flatMap((e) => [e, e])).map((emoji, id) => ({ id, emoji, open: false, matched: false }));

function FlipCard({ card, size, onPress, label }: { card: Card; size: number; onPress: () => void; label: string }) {
  const v = useRef(new Animated.Value(card.open || card.matched ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(v, { toValue: card.open || card.matched ? 1 : 0, useNativeDriver: true, friction: 7 }).start();
  }, [card.open, card.matched, v]);
  const front = v.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const back = v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const face = { position: 'absolute' as const, width: size, height: size, borderRadius: radius.md, backfaceVisibility: 'hidden' as const, alignItems: 'center' as const, justifyContent: 'center' as const };
  return (
    <Pressable onPress={onPress} style={{ width: size, height: size }} accessibilityLabel={label}>
      <Animated.View style={[face, { backgroundColor: colors.purple, borderBottomWidth: 6, borderColor: colors.purpleDark, transform: [{ perspective: 800 }, { rotateY: back }] }]}>
        <Animated.Text allowFontScaling={false} style={{ fontSize: size / 2.6, fontFamily: fonts.black, color: 'rgba(255,255,255,0.85)' }}>?</Animated.Text>
      </Animated.View>
      <Animated.View
        style={[
          face,
          {
            backgroundColor: card.matched ? '#D7F6E5' : '#fff',
            borderWidth: 4,
            borderColor: card.matched ? colors.green : '#E8E1FF',
            transform: [{ perspective: 800 }, { rotateY: front }],
          },
        ]}
      >
        <Animated.Text allowFontScaling={false} style={{ fontSize: size * 0.55 }}>{card.emoji}</Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

export default function MemoryScreen() {
  const { data, recordGame } = useApp();
  const { t } = useT();
  const initial = data.child.age <= 3 ? 0 : data.child.age === 4 ? 1 : 2;
  const [level, setLevel] = useState(initial);
  const [cards, setCards] = useState<Card[]>(() => deal(LEVELS[initial].pairs));
  const [busy, setBusy] = useState(false);
  const [moves, setMoves] = useState(0);
  const [round, setRound] = useState(0);
  const [won, setWon] = useState(false);
  const { width, height, gutter, scale } = useLayout();

  const start = useCallback((l: number) => {
    setLevel(l);
    setCards(deal(LEVELS[l].pairs));
    setMoves(0);
    setRound((r) => r + 1);
    setWon(false);
  }, []);

  const n = cards.length;
  const cols = n <= 6 ? 3 : n <= 8 ? 4 : 4;
  const rows = Math.ceil(n / cols);
  const gap = 12;
  const availW = Math.min(width, 900) - gutter * 2;
  const availH = height - 230 * scale;
  const size = Math.floor(Math.min((availW - gap * (cols - 1)) / cols, (availH - gap * (rows - 1)) / rows, 170));

  const flip = (c: Card) => {
    if (busy || c.open || c.matched) return;
    tap();
    const next = cards.map((x) => (x.id === c.id ? { ...x, open: true } : x));
    const opened = next.filter((x) => x.open && !x.matched);
    setCards(next);
    if (opened.length === 2) {
      setMoves((m) => m + 1);
      setBusy(true);
      const [a, b] = opened;
      setTimeout(
        () => {
          setCards((cs) => {
            const res = cs.map((x) =>
              x.id === a.id || x.id === b.id ? { ...x, open: false, matched: a.emoji === b.emoji } : x,
            );
            if (a.emoji === b.emoji && res.every((x) => x.matched)) {
              setTimeout(() => {
                praise();
                recordGame('memory', 3);
                setWon(true);
              }, 400);
            } else if (a.emoji === b.emoji) say(t('found'));
            return res;
          });
          setBusy(false);
        },
        a.emoji === b.emoji ? 350 : 900,
      );
    }
  };

  const pairs = LEVELS[level].pairs;
  const stars = moves <= pairs + 1 ? 3 : moves <= pairs * 2 ? 2 : 1;

  return (
    <Screen scroll={false}>
      <Header title={t('g_memory')} right={<StarBadge />} />
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        {LEVELS.map((l, i) => (
          <Pressable
            key={l.label}
            onPress={() => start(i)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: i === level ? colors.purple : '#fff',
              borderWidth: 3,
              borderColor: i === level ? colors.purple : colors.line,
            }}
          >
            <Txt size={16} weight="black" color={i === level ? '#fff' : colors.ink}>
              {t(l.label)}
            </Txt>
          </Pressable>
        ))}
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap, width: cols * size + (cols - 1) * gap, justifyContent: 'center' }}>
          {cards.map((c) => (
            <FlipCard key={`${round}-${c.id}`} card={c} size={size} label={t('a11yCard')} onPress={() => flip(c)} />
          ))}
        </View>
      </View>
      <RewardModal
        visible={won}
        stars={stars}
        message={t('movesMsg', { n: moves })}
        onAgain={() => start(level)}
        onClose={() => start(Math.min(level + 1, LEVELS.length - 1))}
      />
    </Screen>
  );
}
