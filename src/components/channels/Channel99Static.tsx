"use client";

import { ContractCopy } from "../shared/ContractCopy";

export function Channel99Static() {
  return (
    <section className="tune-in mx-auto max-w-3xl px-6 pt-28 pb-40 text-center">
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
            <div className="text-unc-200 text-sm tracking-[0.4em] mt-2">
              OFF AIR · OR IS IT
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-unc-100/80">
        You found the static channel. There is no show here. There is only the
        Unc, in the dark, holding the antenna. He nods. You nod back.
      </p>

      <div className="mt-6 inline-flex">
        <ContractCopy />
      </div>
    </section>
  );
}
