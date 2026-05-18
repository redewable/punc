"use client";

import { CHANNELS, getChannel, type ChannelId } from "@/lib/channels";
import { ChevronUp, ChevronDown, Tv2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  active: ChannelId;
  onChange: (id: ChannelId) => void;
}

export function RemoteControl({ active, onChange }: Props) {
  return (
    <>
      <MobileDock active={active} onChange={onChange} />
      <DesktopRemote active={active} onChange={onChange} />
    </>
  );
}

/* ─────────────────────────────  MOBILE  ───────────────────────────── */

function MobileDock({ active, onChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const channel = getChannel(active);

  // Keep the active chip in view as you channel-surf with keyboard / swipe.
  useEffect(() => {
    const el = scrollRef.current?.querySelector<HTMLElement>(
      `[data-chip="${active}"]`,
    );
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 font-display safe-bottom md:hidden"
      role="navigation"
      aria-label="Channel dock"
    >
      <div className="border-t-2 border-unc-300/50 bg-ink-900/95 backdrop-blur shadow-[0_-12px_32px_rgba(124,58,237,0.4)]">
        {/* Slim now-playing strip — replaces LowerThird on mobile */}
        <div className="flex items-center gap-2 border-b border-unc-700/40 px-3 py-1.5">
          <div className="flex shrink-0 items-center gap-1.5 rounded border border-red-500/50 bg-black/60 px-1.5 py-0.5">
            <span className="on-air-dot block h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="text-red-300 text-[9px] tracking-[0.25em]">ON AIR</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-unc-50 text-sm tracking-wider crt-text truncate">
              {channel.callSign}
            </div>
          </div>
          <div className="shrink-0 text-unc-300 text-[9px] tracking-[0.3em]">
            CH {channel.number}
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 pt-2">
          <Tv2 className="h-3.5 w-3.5 text-unc-300" />
          <span className="text-unc-200 text-[10px] tracking-[0.35em]">
            PUNC-TRON · TAP A CHANNEL · SWIPE THE SHOW
          </span>
        </div>
        <div
          ref={scrollRef}
          className="dock-scroll mt-1.5 flex gap-2 overflow-x-auto px-3 pb-3"
        >
          {CHANNELS.map((c) => {
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                data-chip={c.id}
                onClick={() => onChange(c.id)}
                className={[
                  "shrink-0 rounded-lg border px-3 py-2 text-center min-w-[58px] transition",
                  isActive
                    ? "border-unc-300 bg-unc-500/40 text-unc-50 btn-glow"
                    : "border-unc-700/60 bg-black/40 text-unc-200 active:bg-unc-700/40",
                ].join(" ")}
                aria-label={`Channel ${c.number} — ${c.callSign}`}
                aria-current={isActive ? "true" : undefined}
              >
                <div className="text-xl leading-none crt-text">{c.number}</div>
                <div className="text-[8px] tracking-[0.2em] text-unc-300 mt-1 truncate max-w-[64px]">
                  {c.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────  DESKTOP  ───────────────────────────── */

function DesktopRemote({ active, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(true);

  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(false), 12000);
    return () => clearTimeout(t);
  }, [hint]);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-display hidden md:block">
      {/* "USE THE REMOTE" callout */}
      {!open && hint && (
        <div className="pointer-events-none absolute bottom-1/2 right-full mr-3 flex translate-y-1/2 items-center gap-2 whitespace-nowrap">
          <div className="rounded-md border border-unc-300/60 bg-ink-800/95 px-3 py-2 text-right shadow-[0_0_24px_rgba(124,58,237,0.5)] backdrop-blur">
            <div className="text-unc-300 text-[10px] tracking-[0.4em]">USE THE</div>
            <div className="text-unc-50 text-lg crt-text tracking-[0.2em]">REMOTE →</div>
            <div className="text-unc-200/80 text-[10px] tracking-[0.25em] mt-0.5">
              CHANGE THE CHANNEL
            </div>
          </div>
        </div>
      )}

      {/* Collapsed pill */}
      {!open && (
        <button
          onClick={() => {
            setOpen(true);
            setHint(false);
          }}
          className="group relative flex items-center gap-3 rounded-full border-2 border-unc-300/70 bg-ink-800/95 px-6 py-4 text-unc-50 backdrop-blur shadow-[0_0_40px_rgba(124,58,237,0.6)] animate-pulse-glow"
          aria-label="Open remote"
        >
          <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-unc-300/30 animate-ping" />
          <Tv2 className="h-6 w-6 text-unc-200 group-hover:text-unc-50" />
          <span className="text-base font-bold tracking-[0.35em] crt-text">REMOTE</span>
          <span className="ml-1 flex h-2.5 w-2.5">
            <span className="on-air-dot inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
        </button>
      )}

      {open && (
        <div className="w-80 rounded-2xl border-2 border-unc-300/60 bg-ink-900/95 p-5 shadow-[0_0_48px_rgba(124,58,237,0.55)] backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tv2 className="h-4 w-4 text-unc-300" />
              <span className="text-unc-100 text-sm tracking-[0.3em]">PUNC-TRON 1000</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-unc-300 text-sm hover:text-unc-100"
              aria-label="Close remote"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-unc-700/40 bg-black/40 px-3 py-2">
            <span className="text-unc-100 text-sm tracking-[0.25em]">CHANNEL</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const idx = CHANNELS.findIndex((c) => c.id === active);
                  onChange(CHANNELS[(idx - 1 + CHANNELS.length) % CHANNELS.length].id);
                }}
                className="rounded-md border border-unc-400/40 bg-unc-700/30 px-2.5 py-1.5 text-unc-100 hover:bg-unc-600/50"
                aria-label="Channel down"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  const idx = CHANNELS.findIndex((c) => c.id === active);
                  onChange(CHANNELS[(idx + 1) % CHANNELS.length].id);
                }}
                className="rounded-md border border-unc-400/40 bg-unc-700/30 px-2.5 py-1.5 text-unc-100 hover:bg-unc-600/50"
                aria-label="Channel up"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {CHANNELS.map((c) => (
              <button
                key={c.id}
                onClick={() => onChange(c.id)}
                className={[
                  "rounded-md border px-2 py-3 text-center transition",
                  active === c.id
                    ? "border-unc-300 bg-unc-500/40 text-unc-50 btn-glow"
                    : "border-unc-700/60 bg-black/40 text-unc-200 hover:border-unc-400 hover:bg-unc-700/30",
                ].join(" ")}
                title={c.callSign}
              >
                <div className="text-xl crt-text">{c.number}</div>
              </button>
            ))}
          </div>

          <div className="mt-4 border-t border-unc-700/50 pt-2 text-center text-[10px] uppercase tracking-[0.25em] text-unc-300">
            ← / → also works · or tap a number
          </div>
        </div>
      )}
    </div>
  );
}
