"use client";

import { CHANNELS, type ChannelId } from "@/lib/channels";
import { ChevronUp, ChevronDown, Power } from "lucide-react";
import { useState } from "react";

interface Props {
  active: ChannelId;
  onChange: (id: ChannelId) => void;
}

export function RemoteControl({ active, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-display">
      {/* Collapsed pill */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-unc-300/50 bg-ink-800/90 px-4 py-2 text-unc-100 backdrop-blur btn-glow"
          aria-label="Open remote"
        >
          <Power className="h-4 w-4" />
          <span className="text-sm tracking-[0.3em]">REMOTE</span>
        </button>
      )}

      {open && (
        <div className="w-64 rounded-xl border border-unc-300/40 bg-ink-900/95 p-4 shadow-2xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-unc-200 text-xs tracking-[0.3em]">PUNC-TRON 1000</span>
            <button
              onClick={() => setOpen(false)}
              className="text-unc-300 text-xs hover:text-unc-100"
              aria-label="Close remote"
            >
              ✕
            </button>
          </div>

          {/* Channel up/down */}
          <div className="mb-4 flex items-center justify-between gap-2">
            <span className="text-unc-100 text-sm tracking-[0.2em]">CHANNEL</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const idx = CHANNELS.findIndex((c) => c.id === active);
                  onChange(CHANNELS[(idx - 1 + CHANNELS.length) % CHANNELS.length].id);
                }}
                className="rounded border border-unc-400/40 bg-unc-700/30 px-2 py-1 text-unc-100 hover:bg-unc-600/40"
                aria-label="Channel down"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  const idx = CHANNELS.findIndex((c) => c.id === active);
                  onChange(CHANNELS[(idx + 1) % CHANNELS.length].id);
                }}
                className="rounded border border-unc-400/40 bg-unc-700/30 px-2 py-1 text-unc-100 hover:bg-unc-600/40"
                aria-label="Channel up"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Channel grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {CHANNELS.map((c) => (
              <button
                key={c.id}
                onClick={() => onChange(c.id)}
                className={[
                  "rounded border px-2 py-2 text-center transition",
                  active === c.id
                    ? "border-unc-300 bg-unc-500/40 text-unc-50 btn-glow"
                    : "border-unc-700/60 bg-black/40 text-unc-200 hover:border-unc-400 hover:bg-unc-700/30",
                ].join(" ")}
                title={c.callSign}
              >
                <div className="text-lg crt-text">{c.number}</div>
              </button>
            ))}
          </div>

          <div className="mt-3 border-t border-unc-700/50 pt-2 text-center text-[10px] uppercase tracking-[0.25em] text-unc-300">
            ← / → also works
          </div>
        </div>
      )}
    </div>
  );
}
