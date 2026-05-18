"use client";

import { config, isMintLive, jupiterSwapUrl, pumpFunUrl } from "@/lib/config";

interface Props {
  variant?: "primary" | "ghost";
  className?: string;
  label?: string;
}

export function BuyButton({ variant = "primary", className = "", label }: Props) {
  const live = isMintLive();
  const href = live ? jupiterSwapUrl() : (config.token.mint ? pumpFunUrl() : "#");
  const text = label ?? (live ? `BUY $${config.token.symbol}` : "LAUNCHING ON PUMP.FUN");

  const base =
    "inline-flex items-center gap-2 font-display text-lg tracking-[0.2em] px-6 py-3 rounded border transition";
  const primary =
    "btn-glow border-unc-300 bg-unc-500 text-white hover:bg-unc-400";
  const ghost =
    "border-unc-400/60 bg-transparent text-unc-100 hover:bg-unc-700/30";

  return (
    <a
      href={live ? href : "#"}
      target={live ? "_blank" : undefined}
      rel={live ? "noopener noreferrer" : undefined}
      onClick={(e) => {
        if (!live) e.preventDefault();
      }}
      className={[base, variant === "primary" ? primary : ghost, className].join(" ")}
      aria-disabled={!live}
    >
      <span>▶</span>
      <span>{text}</span>
    </a>
  );
}
