import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { Mascot } from '@/components/Mascot';
import { Header, Screen, StarBadge, Squishy, Txt } from '@/components/ui';
import { uzText, useT } from '@/i18n';
import { LANGS } from '@/i18n/langs';
import { useApp } from '@/store/AppStore';
import { colors, radius, tints, TintName, useLayout } from '@/theme';

const TINT: Record<string, TintName> = { uz: 'green', ru: 'blue', en: 'red', tr: 'orange', de: 'yellow', ar: 'teal' };

export default function LearnScreen() {
  const { t } = useT();
  const { data } = useApp();
  const { contentWidth, isTablet, scale } = useLayout();
  const cols = isTablet ? 3 : 2;
  const w = Math.floor((contentWidth - 16 * (cols - 1)) / cols);

  return (
    <Screen>
      <Header title={t('languages')} right={<StarBadge />} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <Mascot size={90 * scale} mood="wow" />
        <View style={{ flex: 1 }}>
          <Txt size={24} weight="black" color={colors.blueDark}>
            {t('learnTitle')}
          </Txt>
          <Txt size={15} color={colors.inkSoft}>
            {t('learnHint')}
          </Txt>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        {LANGS.map((l) => {
          const tint = tints[TINT[l.code]];
          const words = data.progress.words[l.code]?.length ?? 0;
          return (
            <Squishy
              key={l.code}
              onPress={() => router.push({ pathname: '/learn/[lang]', params: { lang: l.code } })}
              shadowColor={tint.dark}
              depth={8}
              accessibilityLabel={l.native}
              style={{ width: w, height: w * 0.9, borderRadius: radius.lg, backgroundColor: tint.base, padding: 14, alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <Text allowFontScaling={false} style={{ fontSize: w * 0.3 }}>{l.flag}</Text>
              <Txt size={22} weight="black" color={tint.on} center>
                {l.code === 'uz' ? uzText(l.native, data.uzScript) : l.native}
              </Txt>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2 }}>
                <Txt size={13} color={tint.on} center>
                  {l.code === 'uz' ? t('newAlphabet') : `⭐ ${t('wordsN', { n: words })}`}
                </Txt>
              </View>
            </Squishy>
          );
        })}
      </View>
    </Screen>
  );
}
