import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { formatPrice } from '@/components/Premium';
import { Card, Header, KidButton, Screen, Txt } from '@/components/ui';
import { SUBSCRIPTION } from '@/config';
import { GAMES } from '@/data/games';
import { LETTERS, NUMBERS } from '@/data/glyphs';
import { VIDEO_CATEGORIES } from '@/data/videos';
import { useApp } from '@/store/AppStore';
import { colors, fonts, radius, useLayout } from '@/theme';

const LIMITS = [15, 30, 45, 60, 90, 0];

function Stat({ emoji, value, label, w }: { emoji: string; value: string; label: string; w: number }) {
  return (
    <View style={{ width: w, backgroundColor: colors.bgSoft, borderRadius: radius.md, padding: 14, alignItems: 'center', gap: 2 }}>
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
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
  const [name, setName] = useState(data.child.name);
  const [confirmReset, setConfirmReset] = useState(false);
  const p = data.parental;
  const played = Object.values(data.progress.gamesPlayed).reduce((a, b) => a + b, 0);
  const minutes = Math.round(data.usage.seconds / 60);
  const statCols = isTablet ? 4 : 2;
  const statW = Math.floor((contentWidth - 50 - 10 * (statCols - 1)) / statCols);

  const setParental = (patch: Partial<typeof p>) => update((d) => ({ ...d, parental: { ...d.parental, ...patch } }));

  return (
    <Screen>
      <Header title="Ota-onalar" />

      {/* obuna */}
      <Pressable onPress={() => router.push('/parents/subscription')}>
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: isPremium ? '#D7F6E5' : colors.ink, borderColor: isPremium ? colors.green : colors.ink }}>
          <Icon name="crown" size={40} color={colors.yellow} />
          <View style={{ flex: 1 }}>
            <Txt size={18} weight="black" color={isPremium ? colors.ink : '#fff'}>
              {isPremium ? 'Premium faol' : 'Premiumga o\'tish'}
            </Txt>
            <Txt size={14} color={isPremium ? colors.inkSoft : '#C8CAE0'}>
              {isPremium
                ? `${new Date(data.subscription.activeUntil).toLocaleDateString('uz-UZ')} gacha`
                : `Oyiga atigi ${formatPrice(SUBSCRIPTION.monthlyPrice)}`}
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
          {data.child.avatar} {data.child.name || 'Farzandingiz'} natijalari
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <Stat w={statW} emoji="⭐" value={String(data.stars)} label="Yulduzlar" />
          <Stat w={statW} emoji="🔤" value={`${data.progress.letters.length}/${LETTERS.length}`} label="Harflar" />
          <Stat w={statW} emoji="🔢" value={`${data.progress.numbers.length}/${NUMBERS.length}`} label="Raqamlar" />
          <Stat w={statW} emoji="🎮" value={String(played)} label="O'yinlar" />
          <Stat w={statW} emoji="📺" value={String(data.progress.videosWatched)} label="Videolar" />
          <Stat w={statW} emoji="⏱️" value={`${minutes} daq`} label="Bugun" />
        </View>
        {played > 0 && (
          <View style={{ gap: 6 }}>
            {GAMES.filter((g) => data.progress.gamesPlayed[g.id]).map((g) => (
              <View key={g.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Txt size={15} weight="regular">
                  {g.emoji} {g.title}
                </Txt>
                <Txt size={15}>{data.progress.gamesPlayed[g.id]} marta</Txt>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* ekran vaqti */}
      <Card style={{ marginTop: 16, gap: 12 }}>
        <Txt size={20} weight="black">
          ⏰ Kunlik ekran vaqti
        </Txt>
        <Txt size={14} color={colors.inkSoft} weight="regular">
          Vaqt tugaganda ilova "Dam olish vaqti" ekranini ko'rsatadi. JSST 2–5 yoshli bolalar uchun kuniga 1 soatdan oshmaslikni tavsiya qiladi.
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {LIMITS.map((l) => (
            <Pressable
              key={l}
              onPress={() => setParental({ dailyLimitMin: l })}
              style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 3, borderColor: p.dailyLimitMin === l ? colors.purple : colors.line, backgroundColor: p.dailyLimitMin === l ? '#E8E1FF' : '#fff' }}
            >
              <Txt size={16}>{l === 0 ? 'Cheklovsiz' : `${l} daq`}</Txt>
            </Pressable>
          ))}
        </View>
      </Card>

      {/* video toifalari */}
      <Card style={{ marginTop: 16, gap: 8 }}>
        <Txt size={20} weight="black">
          🛡️ Ruxsat etilgan videolar
        </Txt>
        {VIDEO_CATEGORIES.map((c) => (
          <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 }}>
            <Txt size={16} weight="regular">
              {c.emoji} {c.title}
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
            🔊 Ovoz va maqtovlar
          </Txt>
          <Switch value={p.sound} onValueChange={(v) => setParental({ sound: v })} trackColor={{ true: colors.green, false: '#DDD' }} />
        </View>
      </Card>

      {/* profil */}
      <Card style={{ marginTop: 16, gap: 10 }}>
        <Txt size={20} weight="black">
          👶 Profil
        </Txt>
        <TextInput
          value={name}
          onChangeText={setName}
          onEndEditing={() => update((d) => ({ ...d, child: { ...d.child, name: name.trim() } }))}
          onBlur={() => update((d) => ({ ...d, child: { ...d.child, name: name.trim() } }))}
          placeholder="Ismi"
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
          🔒 Maxfiylik
        </Txt>
        <Txt size={14} color={colors.inkSoft} weight="regular">
          Bolajon reklama ko'rsatmaydi, bolaning shaxsiy ma'lumotlarini yig'maydi va uchinchi tomonlarga uzatmaydi. Barcha natijalar faqat shu qurilmada saqlanadi. Videolar faqat tekshirilgan ro'yxatdan olinadi — tashqi havolalar, izohlar va tavsiyalar yo'q.
        </Txt>
      </Card>

      <View style={{ marginTop: 20 }}>
        {confirmReset ? (
          <View style={{ gap: 10 }}>
            <Txt size={16} center>
              Barcha natijalar o'chiriladi. Ishonchingiz komilmi?
            </Txt>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <KidButton label="Ha, o'chirish" tint="red" small style={{ flex: 1 }} onPress={async () => { await resetAll(); router.replace('/onboarding'); }} />
              <KidButton label="Yo'q" tint="green" small style={{ flex: 1 }} onPress={() => setConfirmReset(false)} />
            </View>
          </View>
        ) : (
          <Pressable onPress={() => setConfirmReset(true)} style={{ alignSelf: 'center', padding: 10 }}>
            <Txt size={15} color={colors.red}>
              Natijalarni tozalash
            </Txt>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}
