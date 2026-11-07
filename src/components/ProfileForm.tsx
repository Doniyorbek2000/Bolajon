import React, { useState } from 'react';
import { FlatList, Image, Modal, Pressable, Switch, Text, TextInput, View } from 'react-native';
import { findRegion, REGIONS } from '@/data/regions';
import { uzText, useT } from '@/i18n';
import { pickChildPhoto } from '@/services/photo';
import type { Child } from '@/store/AppStore';
import { colors, fonts, radius, tints } from '@/theme';
import { tap } from '@/utils/feedback';
import { Icon } from './Icon';
import { KidButton, MAX_FONT_SCALE, Txt } from './ui';

export const AVATARS = ['🦁', '🐼', '🐰', '🦊', '🐻', '🐱', '🐶', '🦄', '🐸', '🐵', '🐯', '🐨', '🐧', '🦉', '🐢', '🦖'];
const AGES = [2, 3, 4, 5, 6, 7];

/** Joy nomi (o'zbekchada tanlangan yozuvda) */
export const placeName = (s: string | undefined, script: 'new' | 'old') => (s ? uzText(s, script) : '');

function Picker({ visible, title, items, onPick, onClose }: { visible: boolean; title: string; items: { id: string; label: string; emoji?: string }[]; onPick: (id: string) => void; onClose: () => void }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose} supportedOrientations={['portrait', 'landscape']}>
      <View style={{ flex: 1, backgroundColor: 'rgba(43,45,66,0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#fff', borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, maxHeight: '80%', paddingTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10 }}>
            <Txt size={20} weight="black" style={{ flex: 1 }}>
              {title}
            </Txt>
            <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button">
              <Icon name="close" size={26} color={colors.inkSoft} />
            </Pressable>
          </View>
          <FlatList
            data={items}
            keyExtractor={(x) => x.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 8 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  tap();
                  onPick(item.id);
                }}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.md, backgroundColor: pressed ? tints.blue.soft : colors.bgSoft, minHeight: 52 })}
              >
                {item.emoji ? (
                  <Text allowFontScaling={false} style={{ fontSize: 24 }}>
                    {item.emoji}
                  </Text>
                ) : null}
                <Txt size={17} style={{ flex: 1 }}>
                  {item.label}
                </Txt>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

function Field({ label, value, placeholder, onPress }: { label: string; value: string; placeholder: string; onPress: () => void }) {
  return (
    <View style={{ gap: 6 }}>
      <Txt size={16}>{label}</Txt>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgSoft, borderRadius: radius.md, borderWidth: 3, borderColor: value ? colors.blue : colors.line, paddingHorizontal: 16, paddingVertical: 14 }}
      >
        <Txt size={17} color={value ? colors.ink : '#B8B2A6'} style={{ flex: 1 }}>
          {value || placeholder}
        </Txt>
        <Text allowFontScaling={false} style={{ fontSize: 18, color: colors.inkSoft }}>
          ▾
        </Text>
      </Pressable>
    </View>
  );
}

/** Bola profili formasi: ism, yosh, viloyat, tuman, rasm yoki avatar, reyting roziligi. */
export function ProfileForm({
  child,
  onChange,
  leaderboard,
  onLeaderboard,
}: {
  child: Child;
  onChange: (c: Child) => void;
  leaderboard: boolean;
  onLeaderboard: (v: boolean) => void;
}) {
  const { t, script } = useT();
  const [picker, setPicker] = useState<'region' | 'district' | null>(null);
  const region = findRegion(child.region);
  const set = (patch: Partial<Child>) => onChange({ ...child, ...patch });

  return (
    <View style={{ gap: 14 }}>
      <View style={{ gap: 6 }}>
        <Txt size={16}>{t('name')}</Txt>
        <TextInput
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          value={child.name}
          onChangeText={(name) => set({ name })}
          placeholder={t('namePh')}
          placeholderTextColor="#B8B2A6"
          maxLength={20}
          autoCapitalize="words"
          style={{ fontFamily: fonts.bold, fontSize: 19, color: colors.ink, backgroundColor: colors.bgSoft, borderRadius: radius.md, borderWidth: 3, borderColor: child.name ? colors.blue : colors.line, paddingHorizontal: 16, paddingVertical: 12 }}
        />
      </View>

      <View style={{ gap: 6 }}>
        <Txt size={16}>{t('age')}</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {AGES.map((a) => (
            <Pressable
              key={a}
              onPress={() => {
                tap();
                set({ age: a });
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: child.age === a }}
              style={{ width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: child.age === a ? colors.orange : '#fff', borderWidth: 3, borderColor: child.age === a ? colors.orange : colors.line }}
            >
              <Txt size={19} weight="black" color={child.age === a ? '#fff' : colors.ink}>
                {a === 7 ? '7+' : a}
              </Txt>
            </Pressable>
          ))}
        </View>
      </View>

      <Field label={t('region')} value={region ? placeName(region.name, script) : ''} placeholder={t('chooseRegion')} onPress={() => setPicker('region')} />
      <Field
        label={t('district')}
        value={placeName(child.district, script)}
        placeholder={t('chooseDistrict')}
        onPress={() => (region ? setPicker('district') : setPicker('region'))}
      />

      <View style={{ gap: 8 }}>
        <Txt size={16}>{t('photo')}</Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: tints.yellow.soft, borderWidth: 3, borderColor: colors.yellow, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {child.photo ? (
              <Image source={{ uri: child.photo }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <Text allowFontScaling={false} style={{ fontSize: 44 }}>
                {child.avatar}
              </Text>
            )}
          </View>
          <View style={{ flex: 1, gap: 6 }}>
            <KidButton
              small
              tint="blue"
              label={t('pickPhoto')}
              onPress={async () => {
                const uri = await pickChildPhoto();
                if (uri) set({ photo: uri });
              }}
            />
            {child.photo ? (
              <Pressable onPress={() => set({ photo: undefined })} style={{ alignSelf: 'center', padding: 4 }}>
                <Txt size={14} color={colors.redDark}>
                  {t('removePhoto')}
                </Txt>
              </Pressable>
            ) : null}
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {AVATARS.map((a) => {
            const active = !child.photo && child.avatar === a;
            return (
              <Pressable
                key={a}
                onPress={() => {
                  tap();
                  set({ avatar: a, photo: undefined });
                }}
                accessibilityLabel={a}
                style={{ width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? tints.yellow.soft : '#fff', borderWidth: 3, borderColor: active ? colors.yellow : colors.line }}
              >
                <Text allowFontScaling={false} style={{ fontSize: 28 }}>
                  {a}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: tints.green.soft, borderRadius: radius.md, padding: 12 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt size={16}>🏆 {t('lbConsent')}</Txt>
          <Txt size={12} color={colors.inkSoft} weight="regular">
            {t('lbConsentHint')}
          </Txt>
        </View>
        <Switch value={leaderboard} onValueChange={onLeaderboard} trackColor={{ true: colors.green, false: '#DDD' }} />
      </View>

      <Picker
        visible={picker === 'region'}
        title={t('chooseRegion')}
        items={REGIONS.map((r) => ({ id: r.id, label: placeName(r.name, script), emoji: r.emoji }))}
        onClose={() => setPicker(null)}
        onPick={(id) => {
          set({ region: id, district: id === child.region ? child.district : undefined });
          setPicker('district');
        }}
      />
      <Picker
        visible={picker === 'district'}
        title={t('chooseDistrict')}
        items={(region?.districts ?? []).map((d) => ({ id: d, label: placeName(d, script) }))}
        onClose={() => setPicker(null)}
        onPick={(d) => {
          set({ district: d });
          setPicker(null);
        }}
      />
    </View>
  );
}
