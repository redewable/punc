"use client";

import Image from "next/image";
import { BuyButton } from "../shared/BuyButton";
import { ContractCopy } from "../shared/ContractCopy";

export function Channel13Word() {
  return (
    <section className="tune-in mx-auto max-w-7xl px-6 pt-28 pb-40">
      <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
        {/* Left — monologue */}
        <div>
          <div className="font-display text-unc-200 text-xs tracking-[0.4em] mb-3">
            A WORD FROM YOUR UNCLE · TAPED EARLIER · UNREHEARSED
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-unc-50 crt-text">
            Listen.
            <br />
            Sit down.
            <br />
            <span className="text-unc-300">Uncle's talking.</span>
          </h1>

          <p className="mt-6 max-w-xl text-unc-100/90 leading-relaxed">
            They told me I shouldn't be on TV. They said{" "}
            <em className="text-unc-200">"Unc, you have no roadmap."</em> No
            roadmap? <strong className="text-unc-50">I am the map.</strong>{" "}
            I&apos;m broadcasting from the basement on a stolen Comcast feed.
            I&apos;m running it back. I&apos;m running you over.
          </p>

          <p className="mt-3 max-w-xl text-unc-100/80 leading-relaxed">
            $PUNC is a Solana memecoin built around the most underrated
            archetype in finance: <span className="text-unc-200">your uncle.</span>{" "}
            No VCs. No utility. No therapist. Just channel 13 and a folding
            chair.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BuyButton />
            <ContractCopy />
          </div>

          <div className="mt-8 grid max-w-md grid-cols-3 gap-2 text-center font-display">
            {[
              { k: "1B", v: "supply" },
              { k: "0 / 0", v: "tax" },
              { k: "100%", v: "lp burnt" },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded border border-unc-700/50 bg-black/40 px-3 py-3"
              >
                <div className="text-unc-50 text-xl crt-text">{s.k}</div>
                <div className="text-unc-300 text-[10px] tracking-[0.3em] mt-1">
                  {s.v.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — the Unc on a CRT */}
        <div className="relative aspect-[4/5] w-full max-w-md justify-self-center">
          {/* CRT bezel */}
          <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-zinc-700 via-zinc-900 to-black p-3 shadow-2xl">
            <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-ink-900">
              {/* The Unc */}
              <Image
                src="/logo.jpg"
                alt="Purple Unc, broadcasting"
                fill
                priority
                sizes="(min-width: 768px) 448px, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0)_45%,rgba(0,0,0,0.55)_100%)]" />
              {/* Scanline overlay on the CRT itself */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(0,0,0,0.5) 0 1px, transparent 1px 3px)",
                }}
              />
              {/* Lower banner inside the CRT */}
              <div className="absolute bottom-3 left-3 right-3 rounded bg-black/70 px-3 py-1.5 backdrop-blur">
                <div className="font-display text-unc-100 text-xs tracking-[0.25em]">
                  LIVE · PURPLE UNC · BASEMENT STUDIO
                </div>
              </div>
            </div>
          </div>
          {/* Antenna */}
          <div className="absolute -top-10 left-1/2 h-12 w-px -translate-x-1/2 rotate-[-12deg] bg-zinc-500" />
          <div className="absolute -top-10 left-1/2 h-12 w-px translate-x-1/2 rotate-[12deg] bg-zinc-500" />
        </div>
      </div>
    </section>
  );
}
