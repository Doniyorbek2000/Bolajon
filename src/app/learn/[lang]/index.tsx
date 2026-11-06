import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Header, Screen, StarBadge, Tile, Txt } from '@/components/ui';
import { alphabetFor, isLang, langMeta } from '@/data/learn';
import { uzText, useT } from '@/i18n';
import { useApp } from '@/store/AppStore';
import { colors, radius, tints, TintName, useLayout } from '@/theme';
import { say } from '@/utils/feedback';

const CHANGES = [
  { from: "O‘", to: 'Ö', word: "O'rdak", emoji: '🦆' },
  { from: "G‘", to: 'Ğ', word: "G'isht", emoji: '🧱' },
  { from: 'Sh', to: 'Ş', word: 'Sher', emoji: '🦁' },
  { from: 'Ch', to: 'Ç', word: 'Chumoli', emoji: '🐜' },
];

export default function LangHub() {
  const { lang } = useLocalSearchParams<{ lang: string }>();
  const { t } = useT();
  const { data, isPremium } = useApp();
  const { contentWidth, isTablet, scale } = useLayout();
  const [alpha, setAlpha] = useState(() => alphabetFor(isLang(lang) ? lang : 'uz', data.uzScript));
  if (!isLang(lang)) return <Redirect href="/learn" />;

  const meta = langMeta(lang);
  const cols = isTablet ? 3 : 2;
  const w = Math.floor((contentWidth - 16 * (cols - 1)) / cols);
  const p = { lang, alphabet: alpha };

  const acts: { emoji: string; title: string; sub: string; tint: TintName; locked: boolean; go: () => void }[] = [
    { emoji: '🚂', title: t('act_alphabet'), sub: t('act_alphabet_s'), tint: 'pink', locked: false, go: () => router.push({ pathname: '/learn/[lang]/alphabet', params: p }) },
    { emoji: '✍️', title: t('act_trace'), sub: t('act_trace_s'), tint: 'blue', locked: false, go: () => router.push({ pathname: '/games/trace', params: { alphabet: alpha } }) },
    { emoji: '🃏', title: t('act_words'), sub: t('act_words_s'), tint: 'orange', locked: false, go: () => router.push({ pathname: '/learn/[lang]/words', params: p }) },
    { emoji: '🅰️', title: t('act_first'), sub: t('act_first_s'), tint: 'purple', locked: !isPremium, go: () => router.push({ pathname: '/learn/[lang]/quiz', params: { ...p, mode: 'first' } }) },
    { emoji: '👂', title: t('act_listen'), sub: t('act_listen_s'), tint: 'green', locked: !isPremium, go: () => router.push({ pathname: '/learn/[lang]/quiz', params: { ...p, mode: 'listen' } }) },
    { emoji: '📖', title: t('act_read'), sub: t('act_read_s'), tint: 'teal', locked: !isPremium, go: () => router.push({ pathname: '/learn/[lang]/quiz', params: { ...p, mode: 'read' } }) },
  ];

  return (
    <Screen>
      <Header title={`${meta.flag} ${lang === 'uz' ? uzText(meta.native, data.uzScript) : meta.native}`} right={<StarBadge />} />

      {lang === 'uz' && (
        <View style={{ gap: 12, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {(['uz', 'uzold'] as const).map((id) => (
              <Pressable
                key={id}
                onPress={() => setAlpha(id)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 18, borderWidth: 3, borderColor: alpha === id ? colors.green : colors.line, backgroundColor: alpha === id ? '#D7F6E5' : '#fff', alignItems: 'center' }}
              >
                <Txt size={16} weight="black" center>
                  {id === 'uz' ? t('newAlphabet') : t('oldAlphabet')}
                </Txt>
              </Pressable>
            ))}
          </View>
          {alpha === 'uz' && (
            <View style={{ backgroundColor: '#fff', borderRadius: radius.lg, padding: 16, borderWidth: 3, borderColor: '#FFE2A8', gap: 10 }}>
              <Txt size={20} weight="black" color={colors.orangeDark}>
                ✨ {t('newLettersTitle')}
              </Txt>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {CHANGES.map((c) => (
                  <Pressable
                    key={c.to}
                    onPress={() => say(uzText(c.word, 'new'), 'uz')}
                    style={{ flex: 1, alignItems: 'center', backgroundColor: tints.yellow.soft, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 4 }}
                  >
                    <Text style={{ fontSize: 30 * scale }}>{c.emoji}</Text>
                    <Txt size={16} color={colors.inkSoft} center>
                      {c.from}
                    </Txt>
                    <Txt size={14} color={colors.inkSoft} center>
                      ↓
                    </Txt>
                    <Txt size={34} weight="black" color={colors.pinkDark} center>
                      {c.to}
                    </Txt>
                    <Txt size={13} center numberOfLines={1}>
                      {uzText(c.word, 'new')}
                    </Txt>
                  </Pressable>
                ))}
              </View>
              <Txt size={14} color={colors.inkSoft} center weight="regular">
                {t('newLettersText')}
              </Txt>
              <Txt size={12} color={colors.inkSoft} center weight="regular">
                {t('newLettersNote')}
              </Txt>
            </View>
          )}
        </View>
      )}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        {acts.map((a) => (
          <Tile key={a.title} emoji={a.emoji} title={a.title} subtitle={a.sub} tint={a.tint} width={w} height={w * 0.92} locked={a.locked} onPress={a.go} />
        ))}
      </View>
    </Screen>
  );
}
