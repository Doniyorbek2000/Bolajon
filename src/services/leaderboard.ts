import { LEADERBOARD_URL } from '@/config';

export type Scope = 'country' | 'region' | 'district';
export type Entry = { rank: number; name: string; avatar: string; age: number; region: string; district: string; stars: number; tasks: number; level: number; me?: boolean };
export type Board = { scope: Scope; total: number; top: Entry[]; me: Entry | null };
export type ScorePayload = { id: string; name: string; avatar: string; age: number; region: string; district: string; stars: number; tasks: number; level: number };

export const leaderboardEnabled = !!LEADERBOARD_URL;

async function req(path: string, init?: RequestInit) {
  const ctrl = new AbortController();
  const tm = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(`${LEADERBOARD_URL}${path}`, { ...init, signal: ctrl.signal, headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  } finally {
    clearTimeout(tm);
  }
}

export async function submitScore(p: ScorePayload) {
  if (!leaderboardEnabled) return;
  await req('/v1/score', { method: 'POST', body: JSON.stringify(p) });
}

export async function removeScore(id: string) {
  if (!leaderboardEnabled || !id) return;
  await req(`/v1/score/${id}`, { method: 'DELETE' });
}

export async function fetchBoard(scope: Scope, region: string | undefined, district: string | undefined, id: string): Promise<Board> {
  const q = new URLSearchParams({ scope, id, limit: '50' });
  if (region) q.set('region', region);
  if (district) q.set('district', district);
  return req(`/v1/leaderboard?${q}`);
}
