"use client";

import { config, isMintLive } from "@/lib/config";
import { useState } from "react";

export function ContractCopy({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const live = isMintLive();
  const mint = config.token.mint;
  const display = live
    ? compact
      ? `${mint.slice(0, 6)}…${mint.slice(-6)}`
      : mint
    : "CONTRACT // PENDING LAUNCH";

  const copy = async () => {
    if (!live) return;
    try {
      await navigator.clipboard.writeText(mint);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <button
      onClick={copy}
      disabled={!live}
      className="group inline-flex items-center gap-2 rounded border border-unc-700/60 bg-black/40 px-3 py-2 font-mono text-xs text-unc-100 hover:border-unc-400 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <span className="text-unc-300 tracking-[0.25em]">CA</span>
      <span className="truncate max-w-[260px]">{display}</span>
      {live && (
        <span className="text-unc-300 group-hover:text-unc-100 transition">
          {copied ? "✓" : "⧉"}
        </span>
      )}
    </button>
  );
}
