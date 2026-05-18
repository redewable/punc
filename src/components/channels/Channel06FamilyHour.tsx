"use client";

import { config, isMintLive } from "@/lib/config";
import { useEffect, useState } from "react";
import { ChannelHero } from "../tv/ChannelHero";

interface HolderRow {
  owner: string;
  uiAmount: number;
}

type RankDelta =
  | { kind: "new" }
  | { kind: "same" }
  | { kind: "up" | "down"; by: number };

interface ApiResp {
  total: number;
  topHolders: HolderRow[];
  totalSupply: number | null;
  deltas?: Record<string, RankDelta>;
  fallback?: string;
}

const fmt = (n: number) =>
  n >= 1_000_000_000
    ? (n / 1_000_000_000).toFixed(2) + "B"
    : n >= 1_000_000
    ? (n / 1_000_000).toFixed(2) + "M"
    : n >= 1_000
    ? (n / 1_000).toFixed(1) + "K"
    : n.toFixed(0);

const shorten = (s: string) => `${s.slice(0, 4)}…${s.slice(-4)}`;

const ROLES = [
  "THE PATRIARCH",
  "AUNTIE",
  "CUZ-IN-LAW",
  "FIRST CUZ",
  "SECOND CUZ",
  "DISTANT CUZ",
  "PLUS-ONE",
  "RANDOM GUY EATING ALL THE CHIPS",
  "PHOTOGRAPHER",
  "THE QUIET ONE",
];
const roleFor = (idx: number) =>
  idx < ROLES.length ? ROLES[idx] : `CUZ #${idx + 1}`;

export function Channel06FamilyHour() {
  const [data, setData] = useState<ApiResp | null>(null);
  const [loading, setLoading] = useState(true);
  const live = isMintLive();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/holders")
      .then((r) => r.json())
      .then((d: ApiResp) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setData({ total: 0, topHolders: [], totalSupply: null });
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="tune-in mx-auto max-w-7xl px-4 pt-20 pb-32 sm:px-6 sm:pt-24 md:pb-40">
      <ChannelHero
        src="/memes/ch06.png"
        alt="The family on a beige couch — Unc front and center"
        caption="FAMILY HOUR · BEIGE COUCH · NOBODY GETS A HUG"
      />
      <div className="mb-6">
        <div className="font-display text-unc-200 text-xs tracking-[0.4em] mb-1">
          REALITY · UNSCRIPTED · UNCOMFORTABLE
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-unc-50 crt-text">
          FAMILY HOUR
        </h2>
        <p className="mt-2 max-w-2xl text-unc-100/80">
          Roll call. Pull up a folding chair. See who else is on the couch.
          Everyone gets a title. Nobody gets a hug.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="THE CUZ" value={live && data ? data.total.toLocaleString() : "—"} sub="holders accounted for" />
        <Stat
          label="ON THE PLATE"
          value={
            live && data?.totalSupply
              ? fmt(data.totalSupply)
              : "1B"
          }
          sub={`${config.token.symbol} in circulation`}
        />
        <Stat
          label="TONIGHT'S GUEST"
          value={live && data?.topHolders[0] ? shorten(data.topHolders[0].owner) : "—"}
          sub="largest bag at the table"
        />
      </div>

      <YourRank
        live={live}
        topHolders={data?.topHolders ?? []}
        totalSupply={data?.totalSupply ?? null}
      />

      <div className="mt-8 rounded-2xl border border-unc-700/60 bg-black/50">
        <div className="flex items-center justify-between border-b border-unc-700/50 px-5 py-3 font-display">
          <span className="text-unc-200 text-xs tracking-[0.3em]">
            THE FAMILY TREE · TOP {Math.min(data?.topHolders.length ?? 10, 25)}
          </span>
          <span className="text-unc-300 text-[10px] tracking-[0.3em]">
            REFRESHED ON CHANNEL CHANGE
          </span>
        </div>

        <div className="divide-y divide-unc-700/40">
          {!live && (
            <EmptyRow text="STAND BY — couch is empty until the mint goes live." />
          )}
          {live && loading && <EmptyRow text="Tuning in to the family tree…" />}
          {live && !loading && (!data || data.topHolders.length === 0) && (
            <EmptyRow text="Couldn't reach the wallet network. Refresh, or check the RPC env var." />
          )}
          {live &&
            data?.topHolders.slice(0, 25).map((h, idx) => {
              const pct = data.totalSupply
                ? (h.uiAmount / data.totalSupply) * 100
                : 0;
              const delta = data.deltas?.[h.owner];
              return (
                <div
                  key={h.owner}
                  className="grid grid-cols-[60px_1fr_72px_140px_120px] items-center gap-4 px-5 py-3 font-display text-unc-100"
                >
                  <div className="text-unc-300 text-lg crt-text">
                    #{(idx + 1).toString().padStart(2, "0")}
                  </div>
                  <div>
                    <div className="text-unc-50 text-sm">{shorten(h.owner)}</div>
                    <div className="text-unc-300 text-[10px] tracking-[0.3em]">
                      {roleFor(idx)}
                    </div>
                  </div>
                  <DeltaBadge delta={delta} />
                  <div className="text-unc-100 text-sm">{fmt(h.uiAmount)} {config.token.symbol}</div>
                  <div className="text-unc-200 text-xs">{pct.toFixed(2)}%</div>
                </div>
              );
            })}
        </div>
      </div>

      {data?.fallback && (
        <p className="mt-3 font-mono text-[10px] text-unc-300/70">
          note: {data.fallback}
        </p>
      )}
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg border border-unc-700/60 bg-black/40 p-5 font-display">
      <div className="text-unc-300 text-[10px] tracking-[0.4em]">{label}</div>
      <div className="mt-1 text-unc-50 text-3xl crt-text">{value}</div>
      <div className="mt-1 text-unc-200 text-xs">{sub}</div>
    </div>
  );
}

function DeltaBadge({ delta }: { delta?: RankDelta }) {
  if (!delta) return <div className="text-unc-300/40 text-[10px]">—</div>;
  if (delta.kind === "new") {
    return (
      <div className="inline-flex items-center justify-center rounded border border-emerald-400/50 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] tracking-[0.2em] text-emerald-300">
        NEW
      </div>
    );
  }
  if (delta.kind === "same") {
    return <div className="text-unc-300/60 text-[10px]">—</div>;
  }
  const isUp = delta.kind === "up";
  return (
    <div
      className={[
        "inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] tracking-[0.15em]",
        isUp
          ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-300"
          : "border-red-400/50 bg-red-500/15 text-red-300",
      ].join(" ")}
      title={`${isUp ? "Up" : "Down"} ${delta.by} since yesterday`}
    >
      <span>{isUp ? "▲" : "▼"}</span>
      <span>{delta.by}</span>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="p-6 text-center font-display text-unc-200 text-sm tracking-[0.2em]">
      {text}
    </div>
  );
}

interface YourRankProps {
  live: boolean;
  topHolders: HolderRow[];
  totalSupply: number | null;
}

interface RankLookup {
  kind: "hit" | "miss" | "invalid";
  rank?: number;
  role?: string;
  pct?: number;
  amount?: number;
}

function YourRank({ live, topHolders, totalSupply }: YourRankProps) {
  const [wallet, setWallet] = useState("");
  const [result, setResult] = useState<RankLookup | null>(null);

  const lookup = () => {
    const w = wallet.trim();
    // Solana addresses are base58 32–44 chars. Cheap shape check, no decoding.
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(w)) {
      setResult({ kind: "invalid" });
      return;
    }
    const idx = topHolders.findIndex((h) => h.owner === w);
    if (idx === -1) {
      setResult({ kind: "miss" });
      return;
    }
    const row = topHolders[idx];
    const pct = totalSupply ? (row.uiAmount / totalSupply) * 100 : 0;
    setResult({
      kind: "hit",
      rank: idx + 1,
      role: roleFor(idx),
      pct,
      amount: row.uiAmount,
    });
  };

  if (!live) return null;

  return (
    <div className="mt-8 rounded-2xl border border-unc-700/60 bg-black/40 p-5 font-display">
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <div className="text-unc-300 text-[10px] tracking-[0.4em]">
            FIND YOUR SEAT
          </div>
          <div className="text-unc-50 text-lg crt-text">
            Where are you in the family tree?
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") lookup();
          }}
          placeholder="paste your wallet address"
          spellCheck={false}
          autoComplete="off"
          className="flex-1 rounded border border-unc-700/60 bg-black/60 px-3 py-2 font-mono text-sm text-unc-100 placeholder:text-unc-300/60 focus:border-unc-400 focus:outline-none"
        />
        <button
          onClick={lookup}
          className="rounded border border-unc-300 bg-unc-500 px-5 py-2 text-sm tracking-[0.2em] text-white btn-glow"
        >
          LOOK ME UP
        </button>
      </div>

      {result && (
        <div className="mt-3 rounded border border-unc-700/50 bg-black/50 px-4 py-3 text-sm">
          {result.kind === "invalid" && (
            <span className="text-red-300 tracking-[0.2em]">
              THAT DOESN&apos;T LOOK LIKE A SOLANA ADDRESS. TRY AGAIN.
            </span>
          )}
          {result.kind === "miss" && (
            <span className="text-unc-200 tracking-[0.2em]">
              NOT AT THE TABLE — outside the top 25, but still family.
            </span>
          )}
          {result.kind === "hit" && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <span className="text-unc-300 text-[10px] tracking-[0.4em]">
                YOUR RANK
              </span>
              <span className="text-unc-50 text-2xl crt-text">
                #{result.rank!.toString().padStart(2, "0")}
              </span>
              <span className="text-unc-200 tracking-[0.3em] text-xs">
                {result.role}
              </span>
              <span className="text-unc-100 text-xs">
                {fmt(result.amount!)} {config.token.symbol} ·{" "}
                {result.pct!.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
