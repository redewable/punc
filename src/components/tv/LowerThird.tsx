"use client";

import type { Channel } from "@/lib/channels";

export function LowerThird({ channel }: { channel: Channel }) {
  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 hidden md:block">
      <div className="bg-gradient-to-t from-black/95 via-black/70 to-transparent pb-3 pt-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end gap-4">
            <div className="hidden md:block w-1.5 self-stretch bg-unc-400" />
            <div>
              <div className="font-display text-unc-200 text-xs tracking-[0.35em]">
                $PUNC · CH {channel.number} · {channel.category}
              </div>
              <div className="font-display text-unc-50 text-2xl md:text-3xl tracking-wider crt-text">
                {channel.callSign}
              </div>
            </div>
          </div>
        </div>

        {/* Ticker rail */}
        <div className="mt-3 overflow-hidden border-y border-unc-700/50 bg-black/80 py-1.5">
          <div className="marquee-track font-display text-unc-100 text-sm">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="flex items-center">
                {Array.from({ length: 4 }).map((__, j) => (
                  <span key={j} className="flex items-center">
                    <span className="px-6">
                      {channel.bumper}{" "}
                      <span className="text-unc-400 mx-3">·</span>
                    </span>
                    <span className="px-6 text-unc-300">
                      DON&apos;T BE A $PUNC{" "}
                      <span className="text-unc-400 mx-3">·</span>
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
