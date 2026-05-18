"use client";

import { config } from "@/lib/config";
import { Twitter } from "lucide-react";

const PROMOS = [
  {
    code: "S01E02",
    title: "$PUNC MERCH",
    blurb:
      "Plain-purple tee. Says nothing on the front. Says EVERYTHING on the back. Coming whenever the Unc finds his card.",
    eta: "Q? · this year, maybe",
  },
  {
    code: "S01E03",
    title: "CUZ RANK SYSTEM",
    blurb:
      "On-chain title for every wallet that holds. From Plus-One to Patriarch. NFT-optional. Hat-optional. Roast-mandatory.",
    eta: "after launch · before kingdom come",
  },
  {
    code: "S01E04",
    title: "MORE FROM THE GROUP CHAT",
    blurb:
      "Channel 03 keeps getting longer. New cuz, new typos, new screenshots Unc forwarded from someone he met at the gas station. Pull-to-refresh forever.",
    eta: "whenever the Unc is up late",
  },
  {
    code: "S01E05",
    title: "PURPLE TAPE GIVEAWAY",
    blurb:
      "Top holders get a literal VHS tape in the mail. With nothing on it. Just the vibe. Just the dust.",
    eta: "post-Raydium migration",
  },
];

export function Channel11Upcoming() {
  return (
    <section className="tune-in mx-auto max-w-7xl px-4 pt-20 pb-32 sm:px-6 sm:pt-24 md:pb-40">
      <div className="mb-6">
        <div className="font-display text-unc-200 text-xs tracking-[0.4em] mb-1">
          PROMO BLOCK · TUNE IN OR DON&apos;T
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-unc-50 crt-text">
          COMING UP NEXT
        </h2>
        <p className="mt-2 max-w-2xl text-unc-100/80">
          Programming we&apos;re thinking about. No guarantees. We&apos;re a
          memecoin, not a network. Subject to vibes, mood, and the price of
          SOL.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PROMOS.map((p) => (
          <div
            key={p.code}
            className="relative overflow-hidden rounded-lg border border-unc-700/60 bg-black/40 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-display text-unc-300 text-xs tracking-[0.4em]">
                  EPISODE {p.code}
                </div>
                <div className="mt-1 font-display text-unc-50 text-2xl crt-text">
                  {p.title}
                </div>
              </div>
              <div className="rounded bg-unc-700/40 px-2 py-1 font-display text-[10px] tracking-[0.25em] text-unc-100">
                ETA: {p.eta}
              </div>
            </div>
            <p className="mt-3 text-unc-100/85 text-sm leading-relaxed">
              {p.blurb}
            </p>
          </div>
        ))}
      </div>

      {config.socials.twitter && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-unc-300/40 bg-unc-700/20 p-5 font-display">
          <div>
            <div className="text-unc-200 text-xs tracking-[0.4em]">DON&apos;T MISS THE PREMIERE</div>
            <div className="text-unc-50 text-2xl md:text-3xl crt-text">
              Follow the Unc on X
            </div>
          </div>
          <a
            href={config.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded border border-unc-300 bg-unc-500 px-5 py-2 text-white btn-glow"
          >
            <Twitter className="h-4 w-4" />
            <span className="tracking-[0.2em]">FOLLOW</span>
          </a>
        </div>
      )}
    </section>
  );
}
