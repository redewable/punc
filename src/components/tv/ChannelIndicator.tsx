"use client";

import type { Channel } from "@/lib/channels";

export function ChannelIndicator({ channel }: { channel: Channel }) {
  return (
    <div className="pointer-events-none fixed left-4 top-4 z-40 flex items-center gap-3 font-display">
      <div className="rounded-sm border border-unc-300/50 bg-black/70 px-2 py-1">
        <div className="text-unc-100 text-xs tracking-[0.3em]">CH</div>
        <div className="text-unc-50 text-3xl leading-none crt-text">
          {channel.number}
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-sm border border-red-500/40 bg-black/70 px-2 py-1">
        <span className="on-air-dot block h-2 w-2 rounded-full bg-red-500" />
        <span className="text-red-300 text-xs tracking-[0.25em]">ON AIR</span>
      </div>
    </div>
  );
}
