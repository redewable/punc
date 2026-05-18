"use client";

import { useState } from "react";
import {
  config,
  dexScreenerEmbedUrl,
  dexScreenerUrl,
  isMintLive,
  type ChartInterval,
} from "@/lib/config";
import { BuyButton } from "../shared/BuyButton";

const INTERVALS: { id: ChartInterval; label: string }[] = [
  { id: "1", label: "1m" },
  { id: "5", label: "5m" },
  { id: "60", label: "1h" },
];

export function Channel02News() {
  const live = isMintLive();
  const [interval, setInterval] = useState<ChartInterval>("60");

  return (
    <section className="tune-in mx-auto max-w-7xl px-6 pt-24 pb-40">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="font-display text-unc-200 text-xs tracking-[0.4em] mb-1">
            BREAKING · LIVE · NOBODY ASKED
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-unc-50 crt-text">
            THE NEWS AT 11
          </h2>
          <p className="mt-2 max-w-2xl text-unc-100/80">
            We&apos;re live from the studio. Conditions: purple. Forecast: send.
            Anchor desk: a folding card table. Sponsored by absolutely no one.
          </p>
        </div>
        <BuyButton />
      </div>

      {/* The "screen within the screen" */}
      <div className="rounded-2xl border border-unc-700/60 bg-black/60 p-2 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-unc-700/50 px-3 py-2 font-display">
          <span className="text-unc-200 text-xs tracking-[0.3em]">
            CH 02 · LIVE FEED · DexScreener
          </span>
          <div className="flex items-center gap-3">
            {live && (
              <div className="flex items-center gap-1 rounded border border-unc-700/60 bg-black/60 p-0.5">
                {INTERVALS.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => setInterval(i.id)}
                    className={[
                      "rounded px-2 py-1 text-xs tracking-[0.2em] transition",
                      interval === i.id
                        ? "bg-unc-500/60 text-unc-50"
                        : "text-unc-200 hover:bg-unc-700/40",
                    ].join(" ")}
                    aria-pressed={interval === i.id}
                  >
                    {i.label}
                  </button>
                ))}
              </div>
            )}
            {live && (
              <a
                href={dexScreenerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-unc-100 text-xs tracking-[0.2em] hover:text-unc-50"
              >
                POP OUT ↗
              </a>
            )}
          </div>
        </div>
        <div className="relative h-[560px] w-full overflow-hidden rounded-lg bg-ink-900">
          {live ? (
            <iframe
              key={interval}
              src={dexScreenerEmbedUrl(interval)}
              className="h-full w-full"
              style={{ border: 0 }}
              title="$PUNC live chart"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="tv-static absolute inset-0 opacity-30" />
              <div className="relative z-10">
                <div className="font-display text-unc-200 text-sm tracking-[0.4em]">
                  STAND BY · PLEASE STAND BY
                </div>
                <div className="font-display text-unc-50 text-3xl md:text-5xl mt-2 crt-text">
                  CHART NOT YET AIRING
                </div>
                <div className="mt-3 max-w-md text-unc-100/80 text-sm">
                  Paste the mint address into{" "}
                  <code className="rounded bg-black/60 px-1 py-0.5 text-unc-200">
                    NEXT_PUBLIC_MINT_ADDRESS
                  </code>{" "}
                  after pump.fun launch to bring this channel online.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Anchor lines */}
      <div className="mt-8 grid gap-4 md:grid-cols-3 font-display text-unc-100">
        {[
          {
            t: "OPENING REMARKS",
            b: `Good evening, this is your uncle, and the price of $${config.token.symbol} is whatever you say it is.`,
          },
          {
            t: "WEATHER REPORT",
            b: "Tonight: deep purple with intermittent send. Tomorrow: same but louder. Cope index: rising.",
          },
          {
            t: "SPORTS",
            b: "In tonight's action: the bag. Currently leading: the bag. Outlook: ask the bag.",
          },
        ].map((c) => (
          <div
            key={c.t}
            className="rounded border border-unc-700/50 bg-black/40 p-4"
          >
            <div className="text-unc-300 text-[10px] tracking-[0.4em]">{c.t}</div>
            <div className="mt-1 text-unc-100/90 text-sm leading-relaxed">{c.b}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
