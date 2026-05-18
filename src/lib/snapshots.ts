/**
 * Holder snapshots — top-N rank-tracking persisted to Vercel KV.
 *
 * Data model: sorted set `holders:snaps`, score = timestamp (ms), member = JSON
 * of { ts, ranks: [owner, ...] } (ordered, so rank = index + 1).
 *
 * Cron writes a fresh snapshot every N minutes and prunes anything older than
 * the 24h window. /api/holders reads the latest snapshot + a ~24h-old snapshot
 * and emits per-holder deltas.
 */

import {
  isKvAvailable,
  kvZAdd,
  kvZRangeByScore,
  kvZRemRangeByScore,
} from "./kv";
import type { HolderRow } from "./solana";

export { isKvAvailable };

const ZSET = "holders:snaps";
const WINDOW_MS = 24 * 60 * 60 * 1000;
const PRUNE_MARGIN_MS = 60 * 60 * 1000; // keep an extra 1h of headroom

export interface SnapshotPayload {
  ts: number;
  ranks: string[]; // owners, ordered by descending uiAmount (rank = idx + 1)
}

export type RankDelta =
  | { kind: "new" }
  | { kind: "same" }
  | { kind: "up" | "down"; by: number };

const parse = (raw: string): SnapshotPayload | null => {
  try {
    const p = JSON.parse(raw) as SnapshotPayload;
    if (typeof p?.ts === "number" && Array.isArray(p.ranks)) return p;
  } catch {}
  return null;
};

export async function saveSnapshot(holders: HolderRow[]): Promise<void> {
  if (!isKvAvailable()) return;
  const ts = Date.now();
  const payload: SnapshotPayload = {
    ts,
    ranks: holders.map((h) => h.owner),
  };
  await kvZAdd(ZSET, ts, JSON.stringify(payload));
  // Prune anything older than the 24h window + headroom.
  await kvZRemRangeByScore(ZSET, 0, ts - WINDOW_MS - PRUNE_MARGIN_MS);
}

export async function loadLatestSnapshot(): Promise<SnapshotPayload | null> {
  if (!isKvAvailable()) return null;
  const now = Date.now();
  const recent = await kvZRangeByScore(ZSET, now - 10 * 60 * 1000, now + 1000);
  if (!recent || recent.length === 0) return null;
  return parse(recent[recent.length - 1]) ?? null;
}

/** Returns the snapshot whose ts is closest to (now - 24h), within ±1h. */
export async function load24hAgoSnapshot(): Promise<SnapshotPayload | null> {
  if (!isKvAvailable()) return null;
  const now = Date.now();
  const center = now - WINDOW_MS;
  const window = 60 * 60 * 1000; // ±1h tolerance
  const rows = await kvZRangeByScore(ZSET, center - window, center + window);
  if (!rows || rows.length === 0) return null;
  let best: SnapshotPayload | null = null;
  let bestDelta = Infinity;
  for (const r of rows) {
    const p = parse(r);
    if (!p) continue;
    const d = Math.abs(p.ts - center);
    if (d < bestDelta) {
      bestDelta = d;
      best = p;
    }
  }
  return best;
}

/** Map of owner → delta vs the prior snapshot. */
export function computeDeltas(
  current: SnapshotPayload,
  prior: SnapshotPayload | null
): Record<string, RankDelta> {
  const out: Record<string, RankDelta> = {};
  const priorIdx = new Map<string, number>();
  if (prior) prior.ranks.forEach((o, i) => priorIdx.set(o, i));
  current.ranks.forEach((owner, i) => {
    const was = priorIdx.get(owner);
    if (was === undefined) {
      out[owner] = { kind: "new" };
    } else if (was === i) {
      out[owner] = { kind: "same" };
    } else if (was > i) {
      out[owner] = { kind: "up", by: was - i };
    } else {
      out[owner] = { kind: "down", by: i - was };
    }
  });
  return out;
}
