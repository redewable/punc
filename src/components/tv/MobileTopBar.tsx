"use client";

import { config, isMintLive, jupiterSwapUrl, pumpFunUrl, dexScreenerUrl } from "@/lib/config";
import { useEffect, useState } from "react";

interface PriceData {
  available: boolean;
  priceUsd?: number | null;
  changeH1?: number | null;
  changeH24?: number | null;
}

const fmtPrice = (n: number): string => {
  if (n >= 1) return `$${n.toFixed(3)}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  if (n >= 0.0001) return `$${n.toFixed(6)}`;
  const s = n.toFixed(12);
  const m = s.match(/^0\.(0*)(\d+)/);
  if (m) {
    const zeros = m[1].length;
    const digits = m[2].slice(0, 3);
    return `$0.0${zeros > 0 ? `(${zeros})` : ""}${digits}`;
  }
  return `$${n.toExponential(2)}`;
};

/**
 * Mobile-only sticky top bar — fold of conversion-critical chrome:
 * brand · price · BUY · socials. Hidden on md+ where the floating
 * indicator/ticker/remote do this job spatially.
 */
export function MobileTopBar() {
  const [data, setData] = useState<PriceData | null>(null);
  const live = isMintLive();
  const buyHref = live ? jupiterSwapUrl() : config.token.mint ? pumpFunUrl() : "#";
  const dexHref = live ? dexScreenerUrl() : null;

  useEffect(() => {
    let cancelled = false;
    const pull = async () => {
      try {
        const r = await fetch("/api/price", { cache: "no-store" });
        const j = (await r.json()) as PriceData;
        if (!cancelled) setData(j);
      } catch {
        if (!cancelled) setData({ available: false });
      }
    };
    pull();
    const id = setInterval(pull, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const change = data?.changeH1 ?? data?.changeH24 ?? 0;
  const changeColor =
    change > 0 ? "text-emerald-300" : change < 0 ? "text-red-300" : "text-unc-200";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 font-display safe-top md:hidden"
      role="banner"
    >
      <div className="border-b border-unc-300/30 bg-ink-900/95 backdrop-blur shadow-[0_8px_24px_rgba(124,58,237,0.25)]">
        <div className="flex items-center gap-2 px-3 py-2">
          {/* Brand */}
          <a
            href="#ch13"
            className="flex shrink-0 items-center gap-1.5"
            aria-label="$PUNC TV — channel 13"
          >
            <span className="on-air-dot block h-2 w-2 rounded-full bg-red-500" />
            <span className="text-unc-50 text-base crt-text tracking-[0.15em]">$PUNC</span>
          </a>

          {/* Price (only if we have it) */}
          {data?.available && data.priceUsd != null && (
            <div className="ml-1 flex min-w-0 items-baseline gap-1 truncate text-[11px]">
              <span className="text-unc-50 crt-text truncate">
                {fmtPrice(data.priceUsd)}
              </span>
              <span className={`${changeColor} shrink-0`}>
                {change >= 0 ? "▲" : "▼"}
                {Math.abs(change).toFixed(1)}%
              </span>
            </div>
          )}

          {/* Spacer */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            {/* Socials — only render the ones configured */}
            {config.socials.twitter && (
              <a
                href={config.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-unc-700/60 bg-black/40 px-2 py-1 text-unc-200 text-[11px] hover:border-unc-400"
                aria-label="X / Twitter"
              >
                𝕏
              </a>
            )}
            {config.socials.telegram && (
              <a
                href={config.socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-unc-700/60 bg-black/40 px-2 py-1 text-unc-200 text-[11px] hover:border-unc-400"
                aria-label="Telegram"
              >
                TG
              </a>
            )}
            {dexHref && (
              <a
                href={dexHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-unc-700/60 bg-black/40 px-2 py-1 text-unc-200 text-[11px] hover:border-unc-400"
                aria-label="DexScreener"
              >
                DEX
              </a>
            )}

            {/* BUY — the conversion target */}
            <a
              href={live ? buyHref : "#"}
              target={live ? "_blank" : undefined}
              rel={live ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (!live) e.preventDefault();
              }}
              className="btn-glow rounded border border-unc-300 bg-unc-500 px-3 py-1.5 text-white text-[11px] font-bold tracking-[0.2em]"
              aria-disabled={!live}
            >
              ▶ {live ? "BUY" : "SOON"}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
