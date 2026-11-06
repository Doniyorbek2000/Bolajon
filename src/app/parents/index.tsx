import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, Switch, Text, TextInput, View } from 'react-native';
import { kidLockSupported, startKidLock, stopKidLock } from 'kid-lock';
import { Icon } from '@/components/Icon';
import { formatPrice } from '@/components/Premium';
import { Card, Header, KidButton, Screen, Txt } from '@/components/ui';
import { SUBSCRIPTION } from '@/config';
import { GAMES } from '@/data/games';
import { NUMBERS } from '@/data/glyphs';
import { ALPHABETS } from '@/data/alphabets';
import { uzText, useT } from '@/i18n';
import { LANGS } from '@/i18n/langs';
import { VIDEO_CATEGORIES } from '@/data/videos';
import { useApp } from '@/store/AppStore';
import { colors, fonts, radius, useLayout } from '@/theme';

const LIMITS = [15, 30, 45, 60, 90, 0];

function Stat({ emoji, value, label, w }: { emoji: string; value: string; label: string; w: number }) {
  return (
    <View style={{ width: w, backgroundColor: colors.bgSoft, borderRadius: radius.md, padding: 14, alignItems: 'center', gap: 2 }}>
      <Text allowFontScaling={false} style={{ fontSize: 28 }}>{emoji}</Text>
      <Txt size={22} weight="black">
        {value}
      </Txt>
      <Txt size={13} color={colors.inkSoft} center>
        {label}
      </Txt>
    </View>
  );
}

export default function ParentsScreen() {
  const { data, update, isPremium, resetAll } = useApp();
  const { contentWidth, isTablet } = useLayout();
  const { t, lang } = useT();
  const locale = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB', tr: 'tr-TR', de: 'de-DE', ar: 'ar' }[lang];
  const wordsLearned = Object.values(data.progress.words).reduce((a, b) => a + b.length, 0);
  const uzAlpha = ALPHABETS[data.uzScript === 'new' ? 'uz' : 'uzold'];
  const [name, setName] = useState(data.child.name);
  const [confirmReset, setConfirmReset] = useState(false);
  const [lockMsg, setLockMsg] = useState<string | null>(null);
  const p = data.parental;
  const played = Object.values(data.progress.gamesPlayed).reduce((a, b) => a + b, 0);
  const minutes = Math.round(data.usage.seconds / 60);
  const statCols = isTablet ? 4 : 2;
  const statW = Math.floor((contentWidth - 50 - 10 * (statCols - 1)) / statCols);

  const setParental = (patch: Partial<typeof p>) => update((d) => ({ ...d, parental: { ...d.parental, ...patch } }));

  return (
    <Screen>
      <Header title={t('parentsTitle')} />

      {/* obuna */}
      <Pressable onPress={() => router.push('/parents/subscription')}>
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: isPremium ? '#D7F6E5' : colors.ink, borderColor: isPremium ? colors.green : colors.ink }}>
          <Icon name="crown" size={40} color={colors.yellow} />
          <View style={{ flex: 1 }}>
            <Txt size={18} weight="black" color={isPremium ? colors.ink : '#fff'}>
              {isPremium ? t('premiumActive') : t('goPremium')}
            </Txt>
            <Txt size={14} color={isPremium ? colors.inkSoft : '#C8CAE0'}>
              {isPremium
                ? t('until', { d: new Date(data.subscription.activeUntil).toLocaleDateString(locale) })
                : t('perMonthOnly', { p: formatPrice(SUBSCRIPTION.plans.monthly.price, t('currency')) })}
            </Txt>
          </View>
          <Txt size={26} color={isPremium ? colors.ink : '#fff'}>
            ›
          </Txt>
        </Card>
      </Pressable>

      {/* natijalar */}
      <Card style={{ marginTop: 16, gap: 12 }}>
        <Txt size={20} weight="black">
          {data.child.avatar} {t('results', { name: data.child.name || t('yourChild') })}
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <Stat w={statW} emoji="⭐" value={String(data.stars)} label={t('st_stars')} />
          <Stat w={statW} emoji="🔤" value={`${(data.progress.alpha[uzAlpha.id] ?? []).length}/${uzAlpha.letters.length}`} label={t('st_letters')} />
          <Stat w={statW} emoji="🌍" value={String(wordsLearned)} label={t('st_words')} />
          <Stat w={statW} emoji="🔢" value={`${data.progress.numbers.length}/${NUMBERS.length}`} label={t('st_numbers')} />
          <Stat w={statW} emoji="🎮" value={String(played)} label={t('st_games')} />
          <Stat w={statW} emoji="📺" value={String(data.progress.videosWatched)} label={t('st_videos')} />
          <Stat w={statW} emoji="⏱️" value={`${minutes} ${t('min')}`} label={t('st_today')} />
        </View>
        {played > 0 && (
          <View style={{ gap: 6 }}>
            {GAMES.filter((g) => data.progress.gamesPlayed[g.id]).map((g) => (
              <View key={g.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Txt size={15} weight="regular">
                  {g.emoji} {t(g.title)}
                </Txt>
                <Txt size={15}>{t('timesN', { n: data.progress.gamesPlayed[g.id] })}</Txt>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* til */}
      <Card style={{ marginTop: 16, gap: 12 }}>
        <Txt size={20} weight="black">
          {t('languageSection')}
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {LANGS.map((l) => (
            <Pressable
              key={l.code}
              onPress={() => update((d) => ({ ...d, uiLang: l.code }))}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 3, borderColor: data.uiLang === l.code ? colors.blue : colors.line, backgroundColor: data.uiLang === l.code ? '#D8EEFF' : '#fff' }}
            >
              <Text allowFontScaling={false} style={{ fontSize: 18 }}>{l.flag}</Text>
              <Txt size={15}>{l.code === 'uz' ? uzText(l.native, data.uzScript) : l.native}</Txt>
            </Pressable>
          ))}
        </View>
        <Txt size={17} weight="black" style={{ marginTop: 6 }}>
          {t('uzScript')}
        </Txt>
        <View style={{ gap: 8 }}>
          {(['new', 'old'] as const).map((sc) => (
            <Pressable
              key={sc}
              onPress={() => update((d) => ({ ...d, uzScript: sc }))}
              style={{ paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, borderWidth: 3, borderColor: data.uzScript === sc ? colors.green : colors.line, backgroundColor: data.uzScript === sc ? '#D7F6E5' : '#fff' }}
            >
              <Txt size={15}>{sc === 'new' ? `✨ ${t('scriptNew')}` : t('scriptOld')}</Txt>
            </Pressable>
          ))}
        </View>
        <Txt size={13} color={colors.inkSoft} weight="regular">
          {t('newLettersNote')}
        </Txt>
      </Card>

      {/* bola rejimi */}
      <Card style={{ marginTop: 16, gap: 10, borderColor: p.kidLock ? colors.green : colors.line }}>
        <Txt size={20} weight="black">
          {t('kidMode')}
        </Txt>
        {kidLockSupported ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <Txt size={16} style={{ flex: 1 }}>
                📌 {t('kidLockTitle')}
              </Txt>
              <Switch
                value={p.kidLock}
                trackColor={{ true: colors.green, false: '#DDD' }}
                onValueChange={async (v) => {
                  setLockMsg(null);
                  if (v) {
                    const ok = await startKidLock();
                    setParental({ kidLock: ok });
                    setLockMsg(ok ? t('kidLockOn') : t('kidLockFail'));
                  } else {
                    await stopKidLock();
                    setParental({ kidLock: false });
                  }
                }}
              />
            </View>
            <Txt size={13} color={colors.inkSoft} weight="regular">
              {t('kidLockHint')}
            </Txt>
            {lockMsg && (
              <Txt size={14} color={p.kidLock ? colors.greenDark : colors.redDark}>
                {lockMsg}
              </Txt>
            )}
          </>
        ) : (
          <Txt size={14} color={colors.inkSoft} weight="regular">
            {Platform.OS === 'ios' ? t('kidLockIos') : t('kidLockHint')}
          </Txt>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTopWidth: 2, borderColor: colors.line, paddingTop: 12 }}>
          <View style={{ flex: 1 }}>
            <Txt size={16}>☀️ {t('keepAwake')}</Txt>
            <Txt size={13} color={colors.inkSoft} weight="regular">
              {t('keepAwakeHint')}
            </Txt>
          </View>
          <Switch value={p.keepAwake} onValueChange={(v) => setParental({ keepAwake: v })} trackColor={{ true: colors.green, false: '#DDD' }} />
        </View>
      </Card>

      {/* ekran vaqti */}
      <Card style={{ marginTop: 16, gap: 12 }}>
        <Txt size={20} weight="black">
          {t('screenTime')}
        </Txt>
        <Txt size={14} color={colors.inkSoft} weight="regular">
          {t('screenTimeHint')}
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {LIMITS.map((l) => (
            <Pressable
              key={l}
              onPress={() => setParental({ dailyLimitMin: l })}
              style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 3, borderColor: p.dailyLimitMin === l ? colors.purple : colors.line, backgroundColor: p.dailyLimitMin === l ? '#E8E1FF' : '#fff' }}
            >
              <Txt size={16}>{l === 0 ? t('unlimited') : `${l} ${t('min')}`}</Txt>
            </Pressable>
          ))}
        </View>
      </Card>

      {/* video toifalari */}
      <Card style={{ marginTop: 16, gap: 8 }}>
        <Txt size={20} weight="black">
          {t('allowedVideos')}
        </Txt>
        {VIDEO_CATEGORIES.map((c) => (
          <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 }}>
            <Txt size={16} weight="regular">
              {c.emoji} {t(c.title)}
            </Txt>
            <Switch
              value={p.categories[c.id]}
              onValueChange={(v) => setParental({ categories: { ...p.categories, [c.id]: v } })}
              trackColor={{ true: colors.green, false: '#DDD' }}
            />
          </View>
        ))}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4, borderTopWidth: 2, borderColor: colors.line, marginTop: 6, paddingTop: 12 }}>
          <Txt size={16} weight="regular">
            {t('soundPraise')}
          </Txt>
          <Switch value={p.sound} onValueChange={(v) => setParental({ sound: v })} trackColor={{ true: colors.green, false: '#DDD' }} />
        </View>
      </Card>

      {/* profil */}
      <Card style={{ marginTop: 16, gap: 10 }}>
        <Txt size={20} weight="black">
          {t('profile')}
        </Txt>
        <TextInput maxFontSizeMultiplier={1.15}
          value={name}
          onChangeText={setName}
          onEndEditing={() => update((d) => ({ ...d, child: { ...d.child, name: name.trim() } }))}
          onBlur={() => update((d) => ({ ...d, child: { ...d.child, name: name.trim() } }))}
          placeholder={t('name')}
          maxLength={20}
          style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.ink, backgroundColor: colors.bgSoft, borderRadius: radius.md, borderWidth: 3, borderColor: colors.line, paddingHorizontal: 14, paddingVertical: 10 }}
        />
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {[2, 3, 4, 5, 6, 7].map((a) => (
            <Pressable
              key={a}
              onPress={() => update((d) => ({ ...d, child: { ...d.child, age: a } }))}
              style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: data.child.age === a ? colors.orange : colors.line, backgroundColor: data.child.age === a ? '#FFE7D6' : '#fff' }}
            >
              <Txt size={17}>{a === 7 ? '7+' : a}</Txt>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card style={{ marginTop: 16, gap: 8 }}>
        <Txt size={20} weight="black">
          {t('privacy')}
        </Txt>
        <Txt size={14} color={colors.inkSoft} weight="regular">
          {t('privacyText')}
        </Txt>
      </Card>

      <View style={{ marginTop: 20 }}>
        {confirmReset ? (
          <View style={{ gap: 10 }}>
            <Txt size={16} center>
              {t('resetConfirm')}
            </Txt>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <KidButton label={t('yesDelete')} tint="red" small style={{ flex: 1 }} onPress={async () => { await resetAll(); router.replace('/onboarding'); }} />
              <KidButton label={t('no')} tint="green" small style={{ flex: 1 }} onPress={() => setConfirmReset(false)} />
            </View>
          </View>
        ) : (
          <Pressable onPress={() => setConfirmReset(true)} style={{ alignSelf: 'center', padding: 10 }}>
            <Txt size={15} color={colors.red}>
              {t('resetData')}
            </Txt>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}
