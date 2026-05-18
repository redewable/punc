"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  CHANNELS,
  DEFAULT_CHANNEL,
  getChannel,
  nextChannel,
  prevChannel,
  type ChannelId,
} from "@/lib/channels";

import { ChannelIndicator } from "./tv/ChannelIndicator";
import { CommercialBreak } from "./tv/CommercialBreak";
import { LowerThird } from "./tv/LowerThird";
import { PriceTicker } from "./tv/PriceTicker";
import { RemoteControl } from "./tv/RemoteControl";
import { StaticTransition } from "./tv/StaticTransition";
import { StationID } from "./tv/StationID";

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

  const channel = getChannel(active);

  return (
    <main className="relative min-h-screen">
      <StationID />

      {/* Scan band drifting down the page */}
      <div className="scan-band" />

      <ChannelIndicator channel={channel} />
      <PriceTicker />

      <div key={active} className="relative">
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
      <StaticTransition signal={String(signal)} />
      <CommercialBreak signal={signal} />
    </main>
  );
}
