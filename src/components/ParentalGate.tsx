import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, useLayout } from '@/theme';
import { oops, tap } from '@/utils/feedback';
import { Icon } from './Icon';
import { Txt } from './ui';
import { useT } from '@/i18n';
import { numberWord } from '@/data/alphabets';


function makeTask() {
  const a = 3 + Math.floor(Math.random() * 7);
  const b = 3 + Math.floor(Math.random() * 7);
  return { a, b, answer: String(a * b) };
}

/**
 * Ota-ona darvozasi: bola tasodifan sozlamalar yoki to'lovga kirib qolmasligi uchun.
 * (App Store "Kids" toifasi talabi.)
 */
export function ParentalGate({ visible, onPass, onCancel }: { visible: boolean; onPass: () => void; onCancel: () => void }) {
  const [task, setTask] = useState(makeTask);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const { scale } = useLayout();
  const { t, lang } = useT();

  useEffect(() => {
    if (visible) {
      setTask(makeTask());
      setInput('');
      setError(false);
    }
  }, [visible]);

  const press = useCallback(
    (k: string) => {
      tap();
      setError(false);
      if (k === '⌫') return setInput((s) => s.slice(0, -1));
      const next = (input + k).slice(0, 3);
      setInput(next);
      if (next.length >= task.answer.length) {
        if (next === task.answer) {
          setInput('');
          onPass();
        } else {
          oops();
          setError(true);
          setTimeout(() => {
            setTask(makeTask());
            setInput('');
          }, 600);
        }
      }
    },
    [input, task, onPass],
  );

  const key = 64 * scale;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} supportedOrientations={['portrait', 'landscape']}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Pressable onPress={onCancel} style={styles.close} accessibilityLabel={t('close')} hitSlop={12}>
            <Icon name="close" size={26} color={colors.inkSoft} />
          </Pressable>
          <Icon name="lock" size={40} color={colors.purple} />
          <Txt size={22} weight="black" center style={{ marginTop: 8 }}>
            {t('forParents')}
          </Txt>
          <Txt size={15} color={colors.inkSoft} center style={{ marginTop: 4 }}>
            {t('enterAnswer')}
          </Txt>
          <Txt size={20} weight="black" center style={{ marginTop: 14 }} color={colors.purpleDark}>
            {numberWord(task.a, lang)} × {numberWord(task.b, lang)} = ?
          </Txt>
          <View style={[styles.display, error && { borderColor: colors.red }]}>
            <Txt size={30} weight="black" color={error ? colors.red : colors.ink}>
              {input || ' '}
            </Txt>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: key * 3 + 24, gap: 12, justifyContent: 'center' }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) =>
              k === '' ? (
                <View key={i} style={{ width: key, height: key }} />
              ) : (
                <Pressable
                  key={i}
                  onPress={() => press(k)}
                  style={({ pressed }) => [
                    styles.key,
                    { width: key, height: key, borderRadius: key / 2, backgroundColor: pressed ? '#E8E1FF' : '#F5F2FF' },
                  ]}
                >
                  <Txt size={24} weight="black" color={colors.purpleDark}>
                    {k}
                  </Txt>
                </Pressable>
              ),
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(43,45,66,0.6)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: radius.xl, padding: 24, alignItems: 'center', width: '100%', maxWidth: 380 },
  close: { position: 'absolute', top: 16, right: 16, zIndex: 2 },
  display: {
    marginVertical: 14,
    minWidth: 140,
    height: 64,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E8E1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  key: { alignItems: 'center', justifyContent: 'center' },
});
