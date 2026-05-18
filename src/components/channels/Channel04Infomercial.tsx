"use client";

import { BuyButton } from "../shared/BuyButton";

const STEPS = [
  {
    n: "01",
    title: "Get a wallet",
    body:
      "Download Phantom or Solflare. Thirty seconds. No email, no KYC, no calls to your mother. DO NOT screenshot the seed phrase. Write it down. With a pen. Like an animal.",
    callout: "FREE WITH YOUR ORDER",
  },
  {
    n: "02",
    title: "Load up SOL",
    body:
      "Buy SOL on Coinbase, Kraken, or whichever exchange your barber recommended. Send it to your new wallet. Tell your accountant it's a Roth IRA. (It is not a Roth IRA.)",
    callout: "ONLY ON CHANNEL 04",
  },
  {
    n: "03",
    title: "Swap for $PUNC",
    body:
      "Open Jupiter or Raydium. Paste the contract. Set slippage to 3–5%. Hit swap. The Unc smiles, somewhere. You feel a chill.",
    callout: "BUT WAIT, THERE'S MORE",
  },
  {
    n: "04",
    title: "Watch The Purple Channel",
    body:
      "Tune in. Cope out. Send the chart to the group chat. They will mute you. That's fine. You're early. You're early. You're early.",
    callout: "OPERATORS STANDING BY",
  },
];

export function Channel04Infomercial() {
  return (
    <section className="tune-in mx-auto max-w-7xl px-6 pt-24 pb-40">
      <div className="mb-8">
        <div className="font-display text-unc-200 text-xs tracking-[0.4em] mb-1">
          PAID PROGRAMMING · NOT PAID FOR · NO PROGRAMMING
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-unc-50 crt-text">
          BUT WAIT… THERE&apos;S MORE.
        </h2>
        <p className="mt-2 max-w-2xl text-unc-100/80">
          For one screen, and one screen only — the Unc is giving away the
          method, the system, the actual real way to acquire $PUNC. CALL IF YOU
          WANT. THE NUMBER IS THIS WEBSITE.
        </p>
      </div>

      <ol className="grid gap-4 md:grid-cols-2">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="group relative overflow-hidden rounded-lg border border-unc-700/60 bg-gradient-to-br from-unc-900/40 to-black p-5"
          >
            {/* Sticker */}
            <div className="absolute -right-4 -top-4 rotate-12 rounded-full border-2 border-yellow-300 bg-yellow-400 px-3 py-1.5 font-display text-[10px] tracking-[0.25em] text-black shadow-lg">
              {s.callout}
            </div>
            <div className="flex items-start gap-4">
              <div className="font-display text-unc-300 text-5xl leading-none crt-text">
                {s.n}
              </div>
              <div className="flex-1">
                <div className="font-display text-unc-50 text-2xl">{s.title}</div>
                <p className="mt-2 text-unc-100/85 leading-relaxed">{s.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-unc-300/40 bg-unc-700/20 p-5">
        <div className="font-display text-unc-100">
          <div className="text-unc-200 text-xs tracking-[0.4em]">CALL NOW</div>
          <div className="text-unc-50 text-2xl md:text-3xl crt-text">
            ACT FAST · WHILE SUPPLY OF DIGITS LASTS
          </div>
        </div>
        <BuyButton />
      </div>

      <p className="mt-4 text-center font-mono text-[10px] text-unc-300/70">
        * Disclaimers scrolling at 4× speed at the bottom of the screen which
        you cannot read because it is the bit. $PUNC is a memecoin. Not
        financial advice. Not advice. Not yours. Probably not financial.
      </p>
    </section>
  );
}
