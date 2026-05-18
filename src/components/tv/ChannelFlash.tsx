"use client";

import type { Channel } from "@/lib/channels";
import { useEffect, useRef, useState } from "react";

interface Props {
  channel: Channel;
  /** Increments on every channel change. */
  signal: number;
}

/**
 * Giant "CH 07" overlay that briefly flashes when the user switches.
 * Mimics the on-screen HUD a real TV throws up. Non-blocking
 * (`pointer-events-none`) so swipe gestures continue to work.
 */
export function ChannelFlash({ channel, signal }: Props) {
  const [visible, setVisible] = useState(false);
  const last = useRef(signal);

  useEffect(() => {
    if (signal === last.current) return;
    last.current = signal;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1100);
    return () => clearTimeout(t);
  }, [signal]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center">
      <div className="ch-flash text-center font-display">
        <div className="text-unc-300 text-xs sm:text-sm tracking-[0.5em] mb-2">
          TUNING
        </div>
        <div className="text-unc-50 text-[180px] sm:text-[260px] leading-none crt-text font-bold">
          {channel.number}
        </div>
        <div className="text-unc-200 text-base sm:text-xl tracking-[0.3em] mt-2 crt-text">
          {channel.callSign}
        </div>
      </div>
    </div>
  );
}
