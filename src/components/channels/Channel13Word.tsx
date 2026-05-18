"use client";

import Image from "next/image";
import { BuyButton } from "../shared/BuyButton";
import { ContractCopy } from "../shared/ContractCopy";

export function Channel13Word() {
  return (
    <section className="tune-in mx-auto max-w-7xl px-4 pt-16 pb-32 sm:px-6 sm:pt-20 md:pt-28 md:pb-40">
      <div className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr] md:gap-10">
        {/* Right column appears first on mobile — CRT face = instant hook */}
        <div className="relative order-first mx-auto aspect-[4/5] w-full max-w-[280px] sm:max-w-sm md:order-last md:max-w-md md:justify-self-center">
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-zinc-700 via-zinc-900 to-black p-2.5 shadow-2xl md:rounded-[36px] md:p-3">
            <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-ink-900 md:rounded-[24px]">
              <Image
                src="/logo.png"
                alt="Purple Unc, broadcasting"
                fill
                priority
                sizes="(min-width: 768px) 448px, 90vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0)_45%,rgba(0,0,0,0.55)_100%)]" />
              <div
                className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(0,0,0,0.5) 0 1px, transparent 1px 3px)",
                }}
              />
              <div className="absolute bottom-2 left-2 right-2 rounded bg-black/70 px-2 py-1 backdrop-blur md:bottom-3 md:left-3 md:right-3 md:px-3 md:py-1.5">
                <div className="font-display text-unc-100 text-[10px] tracking-[0.25em] md:text-xs">
                  LIVE · PURPLE UNC · BASEMENT STUDIO
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-8 left-1/2 h-10 w-px -translate-x-1/2 rotate-[-12deg] bg-zinc-500 md:-top-10 md:h-12" />
          <div className="absolute -top-8 left-1/2 h-10 w-px translate-x-1/2 rotate-[12deg] bg-zinc-500 md:-top-10 md:h-12" />
        </div>

        {/* Monologue */}
        <div>
          <div className="font-display text-unc-200 text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.4em] mb-2 sm:mb-3">
            A WORD FROM YOUR UNCLE · TAPED EARLIER · UNREHEARSED
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.95] text-unc-50 crt-text">
            Listen.
            <br />
            Sit down.
            <br />
            <span className="text-unc-300">Uncle&apos;s talking.</span>
          </h1>

          <p className="mt-5 sm:mt-6 max-w-xl text-unc-100/90 leading-relaxed text-sm sm:text-base">
            They told me I shouldn&apos;t be on TV. They said{" "}
            <em className="text-unc-200">&quot;Unc, you have no roadmap.&quot;</em> No
            roadmap? <strong className="text-unc-50">I am the map.</strong>{" "}
            I&apos;m broadcasting from the basement on a stolen Comcast feed.
            I&apos;m running it back. I&apos;m running you over.
          </p>

          <p className="mt-3 max-w-xl text-unc-100/80 leading-relaxed text-sm sm:text-base">
            $PUNC is a Solana memecoin built around the most underrated
            archetype in finance: <span className="text-unc-200">your uncle.</span>{" "}
            No VCs. No utility. No therapist. Just channel 13 and a folding
            chair.
          </p>

          {/* The hook */}
          <div className="mt-5 sm:mt-6 flex w-full items-start gap-3 rounded border-l-4 border-unc-400 bg-unc-950/60 px-3 py-3 sm:inline-flex sm:w-auto sm:px-4">
            <div>
              <div className="font-display text-unc-300 text-[10px] tracking-[0.4em]">
                THE ONLY RULE
              </div>
              <div className="font-display text-unc-50 text-xl sm:text-2xl md:text-3xl mt-1 crt-text">
                DON&apos;T BE A <span className="text-unc-300">$PUNC</span>.
              </div>
              <div className="text-unc-200/80 text-xs sm:text-sm mt-1 max-w-md">
                Don&apos;t fold. Don&apos;t ghost the group chat. Don&apos;t sell
                the bottom. Be on the couch, or be a $punc. Your call.
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
            <BuyButton />
            <ContractCopy />
          </div>

          <div className="mt-6 sm:mt-8 grid max-w-md grid-cols-3 gap-2 text-center font-display">
            {[
              { k: "1B", v: "supply" },
              { k: "0 / 0", v: "tax" },
              { k: "100%", v: "lp burnt" },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded border border-unc-700/50 bg-black/40 px-2 py-2 sm:px-3 sm:py-3"
              >
                <div className="text-unc-50 text-lg sm:text-xl crt-text">{s.k}</div>
                <div className="text-unc-300 text-[9px] sm:text-[10px] tracking-[0.3em] mt-1">
                  {s.v.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
