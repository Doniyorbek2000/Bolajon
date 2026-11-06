import { useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { QuizGame, QuizRound } from '@/components/QuizGame';
import { Squishy, Txt } from '@/components/ui';
import { ALPHABETS, isAlphabetId } from '@/data/alphabets';
import { alphabetFor, isLang, scriptOf, wordIn } from '@/data/learn';
import { ALL_WORDS } from '@/data/vocab';
import { uzText, useT } from '@/i18n';
import { useApp } from '@/store/AppStore';
import { colors, fonts, radius } from '@/theme';
import { pick, say, shuffle } from '@/utils/feedback';

type Mode = 'listen' | 'read' | 'first';

export default function LearnQuiz() {
  const params = useLocalSearchParams<{ lang: string; mode?: string; alphabet?: string }>();
  const lang = isLang(params.lang) ? params.lang : 'en';
  const mode: Mode = params.mode === 'read' || params.mode === 'first' ? params.mode : 'listen';
  const { t } = useT();
  const { data } = useApp();
  const alphaId = params.alphabet && isAlphabetId(params.alphabet) ? params.alphabet : alphabetFor(lang, data.uzScript);
  const script = lang === 'uz' ? scriptOf(alphaId) : data.uzScript;

  const makeRound = useCallback((): QuizRound => {
    if (mode === 'first') {
      const alpha = ALPHABETS[alphaId];
      const pool = alpha.letters.filter((l) => !l.inside);
      const target = pick(pool);
      const others = shuffle(pool.filter((l) => l.id !== target.id)).slice(0, 2);
      const word = alpha.lang === 'uz' ? uzText(target.word, scriptOf(alphaId)) : target.word;
      // birinchi harf o'rniga "?" — arab yozuvida harflar bog'lanib yozilgani uchun so'z ko'rsatilmaydi
      const masked = alpha.rtl ? '' : `?${word.slice(target.upper.length)}`;
      return {
        question: t('firstLetterQ'),
        speak: word,
        speakLang: lang,
        answer: target.id,
        prompt: (w) => (
          <Squishy onPress={() => say(word, lang)} depth={6} shadowColor="#E9D9BC" style={{ backgroundColor: '#fff', borderRadius: radius.xl, padding: 18, alignItems: 'center' }}>
            <Text style={{ fontSize: Math.min(120, w * 0.3) }}>{target.emoji}</Text>
            {masked ? (
              <Txt size={34} weight="black" color={colors.purpleDark} center>
                {masked}
              </Txt>
            ) : null}
          </Squishy>
        ),
        options: shuffle([target, ...others]).map((l) => ({
          key: l.id,
          render: (s) => <Text style={{ fontSize: s * 0.75, color: colors.purpleDark, fontFamily: alpha.rtl ? undefined : fonts.black }}>{l.upper}</Text>,
        })),
      };
    }

    const target = pick(ALL_WORDS);
    const sameTopic = ALL_WORDS.filter((w) => w.topic === target.topic && w.id !== target.id);
    const others = shuffle(sameTopic.length >= 3 ? sameTopic : ALL_WORDS.filter((w) => w.id !== target.id)).slice(0, 3);
    const text = wordIn(target, lang, script);
    const options = shuffle([target, ...others]).map((w) => ({ key: w.id, render: (s: number) => <Text style={{ fontSize: s * 0.8 }}>{w.e}</Text> }));

    if (mode === 'listen')
      return {
        question: t('listenQ'),
        speak: text,
        speakLang: lang,
        answer: target.id,
        prompt: () => (
          <Squishy onPress={() => say(text, lang)} depth={8} shadowColor={colors.blueDark} style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 70 }}>👂</Text>
          </Squishy>
        ),
        options,
      };

    return {
      question: t('readQ'),
      answer: target.id,
      prompt: () => (
        <View style={{ backgroundColor: '#fff', borderRadius: radius.xl, paddingVertical: 20, paddingHorizontal: 28, borderWidth: 4, borderColor: '#E8E1FF' }}>
          <Text style={{ fontSize: 44, fontWeight: '900', color: colors.purpleDark, textAlign: 'center', writingDirection: lang === 'ar' ? 'rtl' : 'ltr' }}>{text}</Text>
        </View>
      ),
      options,
    };
  }, [mode, alphaId, lang, script, t]);

  const title = mode === 'first' ? t('act_first') : mode === 'listen' ? t('act_listen') : t('act_read');
  return <QuizGame id={`learn-${mode}-${lang}`} title={title} makeRound={makeRound} premium />;
}
