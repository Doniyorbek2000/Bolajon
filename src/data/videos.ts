import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { REMOTE_CATALOG_URL } from '@/config';
import type { VideoCategoryId } from '@/store/AppStore';
import type { TintName } from '@/theme';
import type { DictKey } from '@/i18n';
import type { Lang } from '@/i18n/langs';

/**
 * Video katalog — faqat qo'lda tekshirilgan (oq ro'yxat) videolar.
 * Ilova hech qachon tashqi tavsiyalar, izohlar yoki reklamalarni ko'rsatmaydi.
 */
export type VideoItem = {
  id: string;
  title: string;
  /** Sarlavhaning boshqa tillardagi tarjimalari */
  titles?: Partial<Record<Lang, string>>;
  /** Video tili (filtr uchun) */
  lang?: Lang;
  category: VideoCategoryId;
  /** daqiqa */
  duration: number;
  emoji: string;
  tint: TintName;
  uri: string;
  poster?: string;
  free?: boolean;
  /** Tavsiya etilgan yosh oralig'i */
  ages?: [number, number];
  /** Kontent huquqi egasi / litsenziya */
  credit?: string;
};

export const VIDEO_CATEGORIES: { id: VideoCategoryId; title: DictKey; emoji: string; tint: TintName }[] = [
  { id: 'cartoons', title: 'vc_cartoons', emoji: '📺', tint: 'orange' },
  { id: 'learning', title: 'vc_learning', emoji: '🎓', tint: 'blue' },
  { id: 'songs', title: 'vc_songs', emoji: '🎵', tint: 'pink' },
  { id: 'tales', title: 'vc_tales', emoji: '📖', tint: 'purple' },
  { id: 'shorts', title: 'vc_shorts', emoji: '⚡', tint: 'green' },
];

/**
 * Namuna katalog. Ishga tushirishdan oldin huquq egalaridan litsenziya olingan
 * videolar bilan almashtiring (content/catalog.example.json ga qarang).
 */
export const LOCAL_CATALOG: VideoItem[] = [
  {
    id: 'bbb',
    title: 'Katta quyoncha (namuna)',
    titles: { ru: 'Большой кролик (пример)', en: 'Big Buck Bunny (sample)', tr: 'Büyük Tavşan (örnek)', de: 'Big Buck Bunny (Beispiel)', ar: 'الأرنب الكبير (عيّنة)' },
    category: 'cartoons',
    duration: 10,
    emoji: '🐰',
    tint: 'green',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    free: true,
    ages: [3, 8],
    credit: '© Blender Foundation, CC BY 3.0',
  },
];

const CACHE_KEY = 'bolajon:catalog:v1';

function valid(x: unknown): x is VideoItem {
  const v = x as VideoItem;
  return !!v && typeof v.id === 'string' && typeof v.title === 'string' && typeof v.uri === 'string' && /^https:\/\//.test(v.uri);
}

export function useCatalog() {
  const [items, setItems] = useState<VideoItem[]>(LOCAL_CATALOG);
  const [loading, setLoading] = useState(!!REMOTE_CATALOG_URL);

  useEffect(() => {
    if (!REMOTE_CATALOG_URL) return;
    let alive = true;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached && alive) setItems(JSON.parse(cached));
      } catch {}
      try {
        const res = await fetch(REMOTE_CATALOG_URL);
        const json = await res.json();
        const list: VideoItem[] = (Array.isArray(json) ? json : json.items ?? []).filter(valid);
        if (alive && list.length) {
          setItems(list);
          AsyncStorage.setItem(CACHE_KEY, JSON.stringify(list)).catch(() => {});
        }
      } catch {}
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { items, loading };
}
