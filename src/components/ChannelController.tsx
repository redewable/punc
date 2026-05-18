"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  CHANNELS,
  DEFAULT_CHANNEL,
  getChannel,
  nextChannel,
  prevChannel,
  type ChannelId,
} from "@/lib/channels";

import { ChannelFlash } from "./tv/ChannelFlash";
import { ChannelIndicator } from "./tv/ChannelIndicator";
import { CommercialBreak } from "./tv/CommercialBreak";
import { LowerThird } from "./tv/LowerThird";
import { MobileTopBar } from "./tv/MobileTopBar";
import { MuteToggle } from "./tv/MuteToggle";
import { PriceTicker } from "./tv/PriceTicker";
import { RemoteControl } from "./tv/RemoteControl";
import { StaticTransition } from "./tv/StaticTransition";
import { StationID } from "./tv/StationID";
import { playClick, playStatic } from "@/lib/sfx";

// Default channel ships in the initial bundle. The rest lazy-load on first
// tune-in — every channel is keyboard-reachable so users only pay for what
// they actually watch.
import { Channel13Word } from "./channels/Channel13Word";

const TuningIn = () => (
  <div className="mx-auto max-w-7xl px-6 pt-28 pb-40 text-center">
    <div className="font-display text-unc-200 text-sm tracking-[0.4em]">
      TUNING IN…
    </div>
  </div>
);
const lazyChannel = (loader: () => Promise<{ default: React.ComponentType }>) =>
  dynamic(loader, { loading: TuningIn, ssr: false });

const Channel02News = lazyChannel(() =>
  import("./channels/Channel02News").then((m) => ({ default: m.Channel02News }))
);
const Channel03Spaces = lazyChannel(() =>
  import("./channels/Channel03Spaces").then((m) => ({ default: m.Channel03Spaces }))
);
const Channel04Infomercial = lazyChannel(() =>
  import("./channels/Channel04Infomercial").then((m) => ({
    default: m.Channel04Infomercial,
  }))
);
const Channel06FamilyHour = lazyChannel(() =>
  import("./channels/Channel06FamilyHour").then((m) => ({
    default: m.Channel06FamilyHour,
  }))
);
const Channel08Vault = lazyChannel(() =>
  import("./channels/Channel08Vault").then((m) => ({ default: m.Channel08Vault }))
);
const Channel11Upcoming = lazyChannel(() =>
  import("./channels/Channel11Upcoming").then((m) => ({
    default: m.Channel11Upcoming,
  }))
);
const Channel99Static = lazyChannel(() =>
  import("./channels/Channel99Static").then((m) => ({ default: m.Channel99Static }))
);

// Swipe threshold (px) for the channel-up / channel-down gesture.
// Tuned so a casual horizontal flick fires, a vertical scroll doesn't.
const SWIPE_MIN_X = 50;
const SWIPE_MAX_Y = 60;

export function ChannelController() {
  const [active, setActive] = useState<ChannelId>(DEFAULT_CHANNEL);
  const [signal, setSignal] = useState(0);

  // Hash-based deep linking — visit /#ch02 to open a channel directly.
  useEffect(() => {
    const fromHash = (): ChannelId | null => {
      const h = window.location.hash.replace("#", "");
      const match = CHANNELS.find((c) => c.id === h);
      return match ? match.id : null;
    };
    const initial = fromHash();
    if (initial) setActive(initial);

    const onHash = () => {
      const next = fromHash();
      if (next) {
        setSignal((s) => s + 1);
        setActive(next);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const change = useCallback((id: ChannelId) => {
    setSignal((s) => s + 1);
    setActive(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
      playClick();
      playStatic();
    }
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        change(nextChannel(active));
      } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        change(prevChannel(active));
      } else if (/^[0-9]$/.test(e.key)) {
        const matches = CHANNELS.filter((c) => c.number.endsWith(e.key));
        if (matches.length === 1) change(matches[0].id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, change]);

  // Swipe (mobile) — left = next channel, right = prev. Stored in a ref so
  // the listener doesn't re-attach on every render.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_X) return;
    if (Math.abs(dy) > SWIPE_MAX_Y) return; // vertical scroll, not a swipe
    change(dx < 0 ? nextChannel(active) : prevChannel(active));
  };

  const channel = getChannel(active);

  return (
    <main className="relative min-h-screen">
      <StationID />

      {/* Scan band drifting down the page */}
      <div className="scan-band" />

      <MobileTopBar />
      <ChannelIndicator channel={channel} />
      <PriceTicker />

      <div
        key={active}
        className="relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {active === "ch13" && <Channel13Word />}
        {active === "ch02" && <Channel02News />}
        {active === "ch03" && <Channel03Spaces />}
        {active === "ch04" && <Channel04Infomercial />}
        {active === "ch06" && <Channel06FamilyHour />}
        {active === "ch08" && <Channel08Vault />}
        {active === "ch11" && <Channel11Upcoming />}
        {active === "ch99" && <Channel99Static />}
      </div>

      <LowerThird channel={channel} />
      <RemoteControl active={active} onChange={change} />
      <MuteToggle />
      <ChannelFlash channel={channel} signal={signal} />
      <StaticTransition signal={String(signal)} />
      <CommercialBreak signal={signal} />
    </main>
  );
}
