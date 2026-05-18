"use client";

import { useEffect, useState } from "react";
import { config } from "@/lib/config";

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
  // Sub-fraction: count leading zeros after decimal, render compact.
  const s = n.toFixed(12);
  const m = s.match(/^0\.(0*)(\d+)/);
  if (m) {
    const zeros = m[1].length;
    const digits = m[2].slice(0, 3);
    return `$0.0${zeros > 0 ? `(${zeros})` : ""}${digits}`;
  }
  return `$${n.toExponential(2)}`;
};

const fmtChange = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

export function PriceTicker() {
  const [data, setData] = useState<PriceData | null>(null);

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

  if (!data?.available || data.priceUsd == null) return null;

  const change = data.changeH1 ?? data.changeH24 ?? 0;
  const colorClass =
    change > 0
      ? "text-emerald-300"
      : change < 0
      ? "text-red-300"
      : "text-unc-200";

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-40 font-display">
      <div className="rounded-sm border border-unc-300/50 bg-black/70 px-3 py-1.5 backdrop-blur">
        <div className="flex items-center gap-2 text-sm tracking-[0.2em]">
          <span className="text-unc-100">${config.token.symbol}</span>
          <span className="text-unc-400">·</span>
          <span className="text-unc-50 crt-text">{fmtPrice(data.priceUsd)}</span>
          <span className="text-unc-400">·</span>
          <span className={colorClass}>{fmtChange(change)}</span>
          <span className="text-unc-300 text-[10px]">
            ({data.changeH1 != null ? "1h" : "24h"})
          </span>
        </div>
      </div>
    </div>
  );
}
