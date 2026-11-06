import React, { useState } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import { GameAccess } from '@/components/Premium';
import { Header, Screen, StarBadge, Squishy, Txt, KidButton } from '@/components/ui';
import { ANIMALS } from '@/data/items';
import { useApp } from '@/store/AppStore';
import { colors, radius, tints, TintName, useLayout } from '@/theme';
import { say, success } from '@/utils/feedback';
import { useT } from '@/i18n';

const T: TintName[] = ['orange', 'blue', 'green', 'pink', 'purple', 'teal', 'yellow', 'red'];

export default function AnimalsScreen() {
  const { contentWidth, columns, scale } = useLayout();
  const { addStars } = useApp();
  const { t, lang } = useT();
  const [open, setOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const bounce = React.useRef(new Animated.Value(1)).current;
  const cols = columns + 1;
  const w = Math.floor((contentWidth - 14 * (cols - 1)) / cols);

  const show = (i: number) => {
    setOpen(i);
    const a = ANIMALS[i];
    say(`${a.name[lang]}. ${a.sound[lang]}`);
    if (!seen.has(i)) {
      const next = new Set(seen).add(i);
      setSeen(next);
      if (next.size === ANIMALS.length) {
        addStars(3);
        success();
      }
    }
    bounce.setValue(0.6);
    Animated.spring(bounce, { toValue: 1, useNativeDriver: true, bounciness: 18 }).start();
  };

  const a = open !== null ? ANIMALS[open] : null;
  return (
    <Screen>
      <GameAccess id="animals" />
      <Header title={t('g_animals')} right={<StarBadge />} />
      <Txt size={16} color={colors.inkSoft} center style={{ marginBottom: 12 }}>
        {t('animalsHint', { a: seen.size, b: ANIMALS.length })}
      </Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
        {ANIMALS.map((an, i) => {
          const t = tints[T[i % T.length]];
          return (
            <Squishy
              key={an.emoji}
              onPress={() => show(i)}
              shadowColor={t.dark}
              style={{ width: w, height: w, borderRadius: radius.lg, backgroundColor: t.soft, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: seen.has(i) ? t.base : 'transparent' }}
            >
              <Text style={{ fontSize: w * 0.5 }}>{an.emoji}</Text>
              <Txt size={15} weight="black" color={t.dark}>
                {an.name[lang]}
              </Txt>
            </Squishy>
          );
        })}
      </View>
      <Modal visible={!!a} transparent animationType="fade" onRequestClose={() => setOpen(null)} supportedOrientations={['portrait', 'landscape']}>
        <Pressable onPress={() => setOpen(null)} style={{ flex: 1, backgroundColor: 'rgba(43,45,66,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          {a && (
            <View style={{ backgroundColor: '#fff', borderRadius: radius.xl, padding: 28, alignItems: 'center', width: '100%', maxWidth: 420 }}>
              <Animated.Text style={{ fontSize: 150 * scale, transform: [{ scale: bounce }] }}>{a.emoji}</Animated.Text>
              <Txt size={36} weight="black" color={colors.orangeDark}>
                {a.name[lang]}
              </Txt>
              <Txt size={24} weight="bold" color={colors.inkSoft} style={{ marginVertical: 8 }}>
                «{a.sound[lang]}»
              </Txt>
              <KidButton label={t('hearAgain')} icon="sound" tint="blue" small onPress={() => open !== null && show(open)} />
            </View>
          )}
        </Pressable>
      </Modal>
    </Screen>
  );
}
