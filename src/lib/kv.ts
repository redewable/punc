/**
 * Thin Vercel KV (Upstash REST) client. Avoids the @vercel/kv dependency.
 * All operations no-op gracefully when KV env vars are absent — call sites
 * can check `isKvAvailable()` if they want to short-circuit early.
 */

const URL = process.env.KV_REST_API_URL;
const TOKEN = process.env.KV_REST_API_TOKEN;

export const isKvAvailable = () => !!(URL && TOKEN);

interface KvResp<T> {
  result?: T;
  error?: string;
}

async function call<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!isKvAvailable()) return null;
  const r = await fetch(`${URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${TOKEN}`,
    },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`KV ${path} → ${r.status}`);
  const json = (await r.json()) as KvResp<T>;
  if (json.error) throw new Error(`KV ${path} → ${json.error}`);
  return (json.result ?? null) as T | null;
}

export const kvGet = <T>(key: string) =>
  call<T>(`/get/${encodeURIComponent(key)}`);

export const kvSet = (key: string, value: string) =>
  call<string>(`/set/${encodeURIComponent(key)}`, {
    method: "POST",
    body: value,
  });

/** ZADD score/member. */
export const kvZAdd = (key: string, score: number, member: string) =>
  call<number>(
    `/zadd/${encodeURIComponent(key)}/${score}/${encodeURIComponent(member)}`,
    { method: "POST" }
  );

/** ZRANGEBYSCORE returning members in [min, max], ascending. */
export const kvZRangeByScore = (key: string, min: number, max: number) =>
  call<string[]>(
    `/zrangebyscore/${encodeURIComponent(key)}/${min}/${max}`
  );

/** ZREMRANGEBYSCORE in [min, max]. */
export const kvZRemRangeByScore = (key: string, min: number, max: number) =>
  call<number>(
    `/zremrangebyscore/${encodeURIComponent(key)}/${min}/${max}`,
    { method: "POST" }
  );
