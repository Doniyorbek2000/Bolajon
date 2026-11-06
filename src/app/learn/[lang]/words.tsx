import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { PremiumGuard } from '@/components/Premium';
import { RewardModal } from '@/components/Reward';
import { Header, RoundButton, Screen, StarBadge, Squishy, Tile, Txt } from '@/components/ui';
import { isLang, wordIn } from '@/data/learn';
import { FREE_TOPICS, TOPICS } from '@/data/vocab';
import { useT } from '@/i18n';
import { useApp } from '@/store/AppStore';
import { colors, radius, tints, useLayout } from '@/theme';
import { say } from '@/utils/feedback';

export default function WordsScreen() {
  const params = useLocalSearchParams<{ lang: string; topic?: string; alphabet?: string }>();
  const lang = isLang(params.lang) ? params.lang : 'en';
  const { t, lang: uiLang } = useT();
  const { data, isPremium, markWord, recordGame } = useApp();
  const { contentWidth, isTablet, height } = useLayout();
  const script = params.alphabet === 'uzold' ? 'old' : lang === 'uz' ? 'new' : data.uzScript;
  const learned = data.progress.words[lang] ?? [];
  const [locked, setLocked] = useState(false);

  const topicIdx = TOPICS.findIndex((x) => x.id === params.topic);
  const topic = topicIdx >= 0 ? TOPICS[topicIdx] : null;

  const [i, setI] = useState(0);
  const [reward, setReward] = useState(false);
  const flip = useRef(new Animated.Value(1)).current;
  const word = topic?.words[i];

  useEffect(() => {
    if (!word) return;
    flip.setValue(0.6);
    Animated.spring(flip, { toValue: 1, useNativeDriver: true, bounciness: 14 }).start();
    const tm = setTimeout(() => say(wordIn(word, lang, script), lang), 250);
    markWord('words', lang, word.id);
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word?.id, lang]);

  // mavzular ro'yxati
  if (!topic) {
    const cols = isTablet ? 4 : 2;
    const w = Math.floor((contentWidth - 16 * (cols - 1)) / cols);
    return (
      <Screen>
        <Header title={t('act_words')} right={<StarBadge />} />
        <Txt size={16} color={colors.inkSoft} center style={{ marginBottom: 12 }}>
          {t('chooseTopic')}
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {TOPICS.map((tp, k) => {
            const lockedTopic = !isPremium && k >= FREE_TOPICS;
            const done = tp.words.filter((x) => learned.includes(x.id)).length;
            return (
              <Tile
                key={tp.id}
                emoji={tp.emoji}
                title={t(tp.title)}
                subtitle={`${done}/${tp.words.length}`}
                tint={tp.tint}
                width={w}
                height={w * 0.95}
                locked={lockedTopic}
                onPress={() =>
                  lockedTopic ? setLocked(true) : router.push({ pathname: '/learn/[lang]/words', params: { ...params, lang, topic: tp.id } })
                }
              />
            );
          })}
        </View>
        <PremiumGuard visible={locked} onClose={() => setLocked(false)} />
      </Screen>
    );
  }

  const tint = tints[topic.tint];
  const card = Math.min(contentWidth, height * 0.5, 520);
  const target = wordIn(word!, lang, script);
  const translation = uiLang === lang ? null : wordIn(word!, uiLang, data.uzScript);
  const last = i === topic.words.length - 1;

  return (
    <Screen scroll={false}>
      <Header title={t(topic.title)} right={<StarBadge />} />
      <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
        {topic.words.map((x, k) => (
          <View key={x.id} style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: k === i ? tint.base : learned.includes(x.id) ? tint.soft : '#EDE3D1' }} />
        ))}
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <Squishy
          onPress={() => say(target, lang)}
          shadowColor={tint.dark}
          depth={10}
          accessibilityLabel={target}
          style={{ width: card, height: card * 1.05, borderRadius: radius.xl, backgroundColor: '#fff', borderWidth: 6, borderColor: tint.base, alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <Animated.View style={{ transform: [{ scale: flip }], alignItems: 'center' }}>
            <Text allowFontScaling={false} style={{ fontSize: card * 0.42 }}>{word!.e}</Text>
            <Text allowFontScaling={false}
              style={{ fontSize: Math.min(card * 0.13, 56), color: tint.dark, fontWeight: '900', textAlign: 'center', writingDirection: lang === 'ar' ? 'rtl' : 'ltr' }}
              adjustsFontSizeToFit
              numberOfLines={2}
            >
              {target}
            </Text>
            {translation && (
              <Txt size={18} color={colors.inkSoft} center style={{ marginTop: 6 }}>
                {translation}
              </Txt>
            )}
          </Animated.View>
        </Squishy>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <RoundButton icon="back" label={t('prev')} size={64} onPress={() => setI((i - 1 + topic.words.length) % topic.words.length)} />
          <RoundButton icon="sound" tint="blue" label={t('listen')} size={76} onPress={() => say(target, lang)} />
          <RoundButton
            icon="next"
            tint="green"
            label={t('next')}
            size={64}
            onPress={() => {
              if (last) {
                recordGame(`words-${lang}`, 3);
                setReward(true);
              } else setI(i + 1);
            }}
          />
        </View>
        <Txt size={14} color={colors.inkSoft}>
          {i + 1} / {topic.words.length} · {t('wordsN', { n: learned.length })}
        </Txt>
      </View>
      <RewardModal
        visible={reward}
        onAgain={() => {
          setReward(false);
          setI(0);
        }}
        onClose={() => {
          setReward(false);
          const next = TOPICS[topicIdx + 1];
          if (next && (isPremium || topicIdx + 1 < FREE_TOPICS)) router.setParams({ topic: next.id });
          else router.back();
          setI(0);
        }}
      />
    </Screen>
  );
}
