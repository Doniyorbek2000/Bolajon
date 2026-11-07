import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { Access, PlanId, SUBSCRIPTION } from '@/config';
import { detectLang, type Lang, type UzScript } from '@/i18n/langs';

const STORAGE_KEY = 'bolajon:state:v1';
const DAY_MS = 24 * 60 * 60 * 1000;

export type Child = {
  name: string;
  age: number;
  avatar: string;
  /** viloyat id (src/data/regions.ts) */
  region?: string;
  district?: string;
  /** qurilmadagi rasm (faqat lokal) */
  photo?: string;
};

export type VideoCategoryId = 'cartoons' | 'songs' | 'learning' | 'tales' | 'shorts';

export type AppData = {
  onboarded: boolean;
  /** reyting uchun anonim qurilma identifikatori */
  playerId: string;
  uiLang: Lang;
  uzScript: UzScript;
  child: Child;
  stars: number;
  stickers: string[];
  progress: {
    letters: string[];
    numbers: string[];
    gamesPlayed: Record<string, number>;
    videosWatched: number;
    /** til → o'rganilgan so'zlar */
    words: Record<string, string[]>;
    /** alifbo → ko'rilgan/yozilgan harflar */
    alpha: Record<string, string[]>;
    /** vazifa (olam:daraja) → yulduzlar */
    tasks: Record<string, number>;
  };
  subscription: {
    /** Obuna tugash vaqti (ms). 0 — obuna yo'q */
    activeUntil: number;
    trialUsed: boolean;
    plan: 'none' | 'trial' | PlanId;
  };
  parental: {
    /** Kunlik limit (daqiqa). 0 — cheklovsiz */
    dailyLimitMin: number;
    categories: Record<VideoCategoryId, boolean>;
    sound: boolean;
    /** Bola rejimi: ilovani ekranga mahkamlash (Android) */
    kidLock: boolean;
    /** O'yin paytida ekran o'chmasin */
    keepAwake: boolean;
    /** Reytingda ishtirok etish (ota-ona roziligi) */
    leaderboard: boolean;
  };
  usage: { day: string; seconds: number };
};

const newId = () =>
  'p' + Date.now().toString(36) + Array.from({ length: 12 }, () => Math.floor(Math.random() * 36).toString(36)).join('');

const today = () => new Date().toISOString().slice(0, 10);

export const defaultData: AppData = {
  onboarded: false,
  playerId: '',
  uiLang: detectLang(),
  uzScript: 'new',
  child: { name: '', age: 4, avatar: '🦁' },
  stars: 0,
  stickers: [],
  progress: { letters: [], numbers: [], gamesPlayed: {}, videosWatched: 0, words: {}, alpha: {}, tasks: {} },
  subscription: { activeUntil: 0, trialUsed: false, plan: 'none' },
  parental: {
    dailyLimitMin: 45,
    categories: { cartoons: true, songs: true, learning: true, tales: true, shorts: true },
    sound: true,
    kidLock: false,
    keepAwake: true,
    leaderboard: true,
  },
  usage: { day: today(), seconds: 0 },
};

type Store = {
  data: AppData;
  ready: boolean;
  /** Standard yoki Pro faol */
  isPremium: boolean;
  isPro: boolean;
  access: Access;
  timeUp: boolean;
  update: (fn: (d: AppData) => AppData) => void;
  addStars: (n: number) => void;
  recordGame: (gameId: string, stars: number) => void;
  markLearned: (kind: 'letters' | 'numbers', id: string) => void;
  markWord: (bucket: 'words' | 'alpha', key: string, id: string) => void;
  completeTask: (key: string, stars: number) => void;
  startTrial: () => void;
  activatePlan: (plan: PlanId) => void;
  cancelSubscription: () => void;
  resetAll: () => Promise<void>;
  /** Bola profilidan chiqish: obuna, ota-ona sozlamalari va til saqlanadi */
  signOut: () => void;
};

const Ctx = createContext<Store | null>(null);

function merge(saved: Partial<AppData>): AppData {
  return {
    ...defaultData,
    ...saved,
    child: { ...defaultData.child, ...saved.child },
    progress: {
      ...defaultData.progress,
      ...saved.progress,
      words: { ...saved.progress?.words },
      alpha: { ...saved.progress?.alpha },
      tasks: { ...saved.progress?.tasks },
    },
    subscription: (() => {
      const sub = { ...defaultData.subscription, ...saved.subscription };
      // 1.1 versiyadagi 'monthly' / 'yearly' → Standard
      if ((sub.plan as string) === 'monthly' || (sub.plan as string) === 'yearly') sub.plan = `standard_${sub.plan as string}` as PlanId;
      return sub;
    })(),
    parental: {
      ...defaultData.parental,
      ...saved.parental,
      categories: { ...defaultData.parental.categories, ...saved.parental?.categories },
    },
    usage: saved.usage?.day === today() ? saved.usage : { day: today(), seconds: 0 },
  };
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const active = useRef(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        const d = raw ? merge(JSON.parse(raw)) : { ...defaultData };
        if (!d.playerId) d.playerId = newId();
        setData(d);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [data, ready]);

  // Ekran vaqtini hisoblash (faqat ilova ochiq bo'lganda)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => (active.current = s === 'active'));
    const id = setInterval(() => {
      setNow(Date.now());
      if (!active.current) return;
      setData((d) => {
        const day = today();
        const seconds = d.usage.day === day ? d.usage.seconds + 15 : 15;
        return { ...d, usage: { day, seconds } };
      });
    }, 15_000);
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, []);

  const update = useCallback((fn: (d: AppData) => AppData) => setData(fn), []);

  const store = useMemo<Store>(() => {
    const active = data.subscription.activeUntil > now;
    const access: Access = !active ? 'free' : data.subscription.plan.startsWith('pro') ? 'pro' : 'standard';
    const isPremium = access !== 'free';
    const isPro = access === 'pro';
    const limit = data.parental.dailyLimitMin;
    const timeUp = limit > 0 && data.usage.day === today() && data.usage.seconds >= limit * 60;
    return {
      data,
      ready,
      isPremium,
      isPro,
      access,
      timeUp,
      update,
      addStars: (n) => setData((d) => ({ ...d, stars: d.stars + n })),
      recordGame: (gameId, stars) =>
        setData((d) => ({
          ...d,
          stars: d.stars + stars,
          progress: {
            ...d.progress,
            gamesPlayed: { ...d.progress.gamesPlayed, [gameId]: (d.progress.gamesPlayed[gameId] ?? 0) + 1 },
          },
        })),
      markLearned: (kind, id) =>
        setData((d) =>
          d.progress[kind].includes(id)
            ? d
            : { ...d, progress: { ...d.progress, [kind]: [...d.progress[kind], id] } },
        ),
      markWord: (bucket, key, id) =>
        setData((d) => {
          const cur = d.progress[bucket][key] ?? [];
          if (cur.includes(id)) return d;
          return { ...d, progress: { ...d.progress, [bucket]: { ...d.progress[bucket], [key]: [...cur, id] } } };
        }),
      completeTask: (key, stars) =>
        setData((d) => {
          const prev = d.progress.tasks[key] ?? 0;
          // yulduz faqat yangi natija uchun beriladi
          const gain = Math.max(0, stars - prev);
          return { ...d, stars: d.stars + gain, progress: { ...d.progress, tasks: { ...d.progress.tasks, [key]: Math.max(prev, stars) } } };
        }),
      startTrial: () =>
        setData((d) =>
          d.subscription.trialUsed
            ? d
            : {
                ...d,
                subscription: {
                  activeUntil: Date.now() + SUBSCRIPTION.trialDays * DAY_MS,
                  trialUsed: true,
                  plan: 'trial',
                },
              },
        ),
      activatePlan: (plan) =>
        setData((d) => ({
          ...d,
          subscription: {
            ...d.subscription,
            activeUntil: Math.max(Date.now(), d.subscription.activeUntil) + SUBSCRIPTION.plans[plan].days * DAY_MS,
            plan,
          },
        })),
      cancelSubscription: () =>
        setData((d) => ({ ...d, subscription: { ...d.subscription, activeUntil: 0, plan: 'none' } })),
      signOut: () =>
        setData((d) => ({
          ...defaultData,
          playerId: newId(),
          uiLang: d.uiLang,
          uzScript: d.uzScript,
          subscription: d.subscription,
          parental: d.parental,
          usage: d.usage,
        })),
      resetAll: async () => {
        await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
        setData({ ...defaultData, playerId: newId(), usage: { day: today(), seconds: 0 } });
      },
    };
  }, [data, ready, now, update]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useApp() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useApp must be used inside AppStoreProvider');
  return s;
}
