import { router } from 'expo-router';
import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, fs, radius, tints, TintName, useLayout } from '@/theme';
import { useApp } from '@/store/AppStore';
import { tap } from '@/utils/feedback';
import { useT } from '@/i18n';
import { Icon, IconName } from './Icon';

/* ---------- Matn ---------- */

type TxtProps = TextProps & { size?: number; weight?: 'regular' | 'bold' | 'black'; color?: string; center?: boolean };

export function Txt({ size = 18, weight = 'bold', color = colors.ink, center, style, ...rest }: TxtProps) {
  const { scale } = useLayout();
  const { rtl } = useT();
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: fonts[weight],
          fontSize: fs(size, scale),
          color,
          textAlign: center ? 'center' : rtl ? 'right' : undefined,
          writingDirection: rtl ? 'rtl' : undefined,
        },
        style as StyleProp<TextStyle>,
      ]}
    />
  );
}

/* ---------- Bosilganda "cho'kadigan" tugma ---------- */

export function Squishy({
  onPress,
  children,
  style,
  disabled,
  depth = 6,
  shadowColor,
  accessibilityLabel,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  depth?: number;
  shadowColor?: string;
  accessibilityLabel?: string;
}) {
  const press = useRef(new Animated.Value(0)).current;
  const to = (v: number) => Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 8 }).start();
  const flat = StyleSheet.flatten(style) ?? {};
  const r = (flat.borderRadius as number) ?? radius.md;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPressIn={() => to(1)}
      onPressOut={() => to(0)}
      onPress={() => {
        tap();
        onPress?.();
      }}
      style={{ paddingBottom: depth, opacity: disabled ? 0.5 : 1, alignSelf: flat.alignSelf, flex: flat.flex, width: flat.width, margin: flat.margin }}
    >
      <View style={[StyleSheet.absoluteFill, { top: depth, borderRadius: r, backgroundColor: shadowColor ?? 'rgba(0,0,0,0.15)' }]} />
      <Animated.View
        style={[
          flat,
          { flex: undefined, width: '100%', margin: 0, alignSelf: undefined },
          {
            transform: [
              { translateY: press.interpolate({ inputRange: [0, 1], outputRange: [0, depth - 1] }) },
              { scale: press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.98] }) },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

export function KidButton({
  label,
  onPress,
  tint = 'orange',
  icon,
  small,
  style,
  disabled,
}: {
  label: string;
  onPress?: () => void;
  tint?: TintName;
  icon?: IconName;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  const t = tints[tint];
  const { scale } = useLayout();
  return (
    <Squishy
      onPress={onPress}
      disabled={disabled}
      shadowColor={t.dark}
      accessibilityLabel={label}
      style={[
        {
          backgroundColor: t.base,
          borderRadius: radius.lg,
          paddingVertical: (small ? 12 : 18) * scale,
          paddingHorizontal: (small ? 18 : 28) * scale,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        },
        style,
      ]}
    >
      {icon && <Icon name={icon} color={t.on} size={(small ? 22 : 28) * scale} />}
      <Txt size={small ? 18 : 22} weight="black" color={t.on}>
        {label}
      </Txt>
    </Squishy>
  );
}

export function RoundButton({
  icon,
  onPress,
  tint,
  label,
  size = 56,
}: {
  icon: IconName;
  onPress?: () => void;
  tint?: TintName;
  label: string;
  size?: number;
}) {
  const { scale } = useLayout();
  const s = size * scale;
  const t = tint ? tints[tint] : null;
  return (
    <Squishy
      onPress={onPress}
      depth={5}
      accessibilityLabel={label}
      shadowColor={t ? t.dark : '#E9D9BC'}
      style={{
        width: s,
        height: s,
        borderRadius: s / 2,
        backgroundColor: t ? t.base : '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={icon} size={s * 0.5} color={t ? t.on : colors.ink} />
    </Squishy>
  );
}

/* ---------- Yulduzlar hisoblagichi ---------- */

export function StarBadge() {
  const { data } = useApp();
  const { scale } = useLayout();
  return (
    <View style={[styles.badge, { paddingHorizontal: 14 * scale, height: 48 * scale, borderRadius: 24 * scale }]}>
      <Icon name="star" color={colors.yellow} size={26 * scale} />
      <Txt size={20} weight="black">
        {data.stars}
      </Txt>
    </View>
  );
}

/* ---------- Ekran ---------- */

export function Screen({
  children,
  scroll = true,
  bg = colors.bg,
  contentStyle,
  decor = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  bg?: string;
  contentStyle?: StyleProp<ViewStyle>;
  decor?: boolean;
}) {
  const { gutter, isTablet } = useLayout();
  const inner = (
    <View style={[{ width: '100%', maxWidth: isTablet ? 1100 : 640, alignSelf: 'center', paddingHorizontal: gutter, flexGrow: 1 }, contentStyle]}>
      {children}
    </View>
  );
  return (
    <View style={[{ flex: 1, backgroundColor: bg }, Platform.OS === 'web' && ({ userSelect: 'none' } as ViewStyle)]}>
      {decor && <Decor />}
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {scroll ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            {inner}
          </ScrollView>
        ) : (
          <View style={{ flex: 1, paddingBottom: 16 }}>{inner}</View>
        )}
      </SafeAreaView>
    </View>
  );
}

function Decor() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.blob, { backgroundColor: '#FFE7C2', width: 260, height: 260, top: -90, right: -80 }]} />
      <View style={[styles.blob, { backgroundColor: '#E3F4FF', width: 200, height: 200, bottom: 60, left: -90 }]} />
      <View style={[styles.blob, { backgroundColor: '#FFE3EF', width: 120, height: 120, bottom: -30, right: 30 }]} />
    </View>
  );
}

export function Header({
  title,
  right,
  onBack,
  color,
}: {
  title?: string;
  right?: React.ReactNode;
  onBack?: () => void;
  color?: string;
}) {
  const { t } = useT();
  return (
    <View style={styles.header}>
      <RoundButton
        icon="back"
        label={t('back')}
        onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
      />
      <View style={{ flex: 1, paddingHorizontal: 12 }}>
        {title ? (
          <Txt size={26} weight="black" color={color} numberOfLines={1} center>
            {title}
          </Txt>
        ) : null}
      </View>
      <View style={{ minWidth: 56, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

/* ---------- Katta karta (plitka) ---------- */

export function Tile({
  emoji,
  title,
  subtitle,
  tint,
  onPress,
  locked,
  width,
  height,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  tint: TintName;
  onPress: () => void;
  locked?: boolean;
  width: number;
  height?: number;
}) {
  const t = tints[tint];
  const { scale } = useLayout();
  const h = height ?? width * 1.05;
  return (
    <Squishy
      onPress={onPress}
      shadowColor={t.dark}
      depth={8}
      accessibilityLabel={title}
      style={{ width, height: h, borderRadius: radius.lg, backgroundColor: t.base, overflow: 'hidden', padding: 14 * scale }}
    >
      <View style={[styles.tileGlow, { width: h * 0.9, height: h * 0.9, borderRadius: h, top: -h * 0.35, right: -h * 0.3 }]} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: Math.min(width, h) * 0.38 }}>{emoji}</Text>
      </View>
      <Txt size={19} weight="black" color={t.on} center numberOfLines={2}>
        {title}
      </Txt>
      {subtitle ? (
        <Txt size={13} weight="bold" color={t.on} center numberOfLines={1} style={{ opacity: 0.92 }}>
          {subtitle}
        </Txt>
      ) : null}
      {locked && (
        <View style={[styles.lock, { width: 38 * scale, height: 38 * scale, borderRadius: 19 * scale }]}>
          <Icon name="crown" size={22 * scale} color={colors.yellow} />
        </View>
      )}
    </Squishy>
  );
}

export function Grid({ children, gap = 16 }: { children: React.ReactNode; gap?: number }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>{children}</View>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#FFE2A8',
  },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.8 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  tileGlow: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.18)' },
  lock: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 3,
    borderColor: colors.line,
  },
});
