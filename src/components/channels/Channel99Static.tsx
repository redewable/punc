"use client";

import { useEffect, useState } from "react";
import { ContractCopy } from "../shared/ContractCopy";

const WHISPERS = [
  "OFF AIR · OR IS IT",
  "THIS IS THE COUCH AT 4 AM",
  "DO NOT BE A $PUNC",
  "THE ANTENNA SAYS HELLO",
  "PRESS 1 3 TO COME HOME",
  "UNCLE IS STILL UP",
  "SIGNAL WEAK · VIBES STRONG",
];

export function Channel99Static() {
  // Cycle through cryptic whispers so the static channel feels lived-in.
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % WHISPERS.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="tune-in mx-auto max-w-3xl px-4 pt-20 pb-32 sm:px-6 sm:pt-28 md:pb-40 text-center">
      <div className="relative mx-auto h-72 w-full overflow-hidden rounded-2xl border border-unc-700/60 bg-black">
        <div className="tv-static absolute inset-0 opacity-70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-display flicker">
            <div className="text-unc-100 text-xs tracking-[0.5em]">
              DO NOT ADJUST YOUR SET
            </div>
            <div className="text-unc-50 text-5xl md:text-7xl crt-text mt-2">
              CH 99
            </div>
            <div
              key={i}
              className="text-unc-200 text-sm tracking-[0.4em] mt-2"
            >
              {WHISPERS[i]}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-unc-100/80">
        You found the static channel. There is no show here. There is only the
        Unc, in the dark, holding the antenna. He nods. You nod back.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <ContractCopy />
        <a
          href="#ch13"
          className="rounded border border-unc-300/40 bg-black/40 px-3 py-2 font-display text-xs tracking-[0.3em] text-unc-200 hover:border-unc-300 hover:text-unc-50"
        >
          ← BACK TO CHANNEL 13
        </a>
      </div>
    </section>
  );
}
