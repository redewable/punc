# Claude Code handoff prompt

Copy everything between the `---` markers and paste it as the first message
to Claude Code, running in this `$PUNC` folder.

---

I'm continuing work on a Solana memecoin project called **$PUNC (Purple Unc)**.
The scaffolding has been done already — this is a Next.js 14 + TypeScript +
Tailwind project themed as a bootleg late-night public-access TV channel
called "The Purple Channel."

## What's already built

Read these files first to get oriented:

1. `README.md` — full architecture overview
2. `src/lib/channels.ts` — the channel registry (7 channels — CH 02 News,
   04 Infomercial, 06 Family Hour, 08 Vault, 11 Coming Up Next, 13 Word from
   the Unc, 99 Static)
3. `src/components/ChannelController.tsx` — the state machine that switches
   channels via remote, arrow keys, number keys, or `#chXX` hash
4. `src/app/globals.css` — CRT scanlines, static transitions, marquee,
   flicker, scan-band drift, chromatic aberration
5. `src/components/channels/*` — one file per channel
6. `src/app/api/holders/route.ts` + `src/lib/solana.ts` — on-chain holder
   dashboard via `getProgramAccounts`
7. `LAUNCH.md` — pump.fun launch playbook

## What I need you to do

Pick the next-highest-leverage item from this list (ask me first if unsure):

### Tier 1 — pre-launch must-haves
- [ ] **Run `npm install` and `npm run build` and fix any errors.**
- [ ] Verify the dev server loads at http://localhost:3000 and channel switching
      works (arrows + remote + number keys + `#ch04` hash).
- [ ] If `logo.jpg` is wider/taller than 1:1, generate a `logo-crt.jpg` cropped
      to 4:5 specifically for the Ch 13 CRT.
- [ ] Wire `next/font` instead of the Google Fonts `<link>` in `layout.tsx` for
      better LCP.

### Tier 2 — content polish
- [ ] Add a real **"price ticker"** in the top-right that polls `/api/price` every
      30s. Format: `$PUNC · $0.00012 · +14.2% (1h)` with red/green color.
- [ ] Add **Channel 02 sub-tabs** for: 1m / 5m / 1h chart (just change the
      DexScreener embed `interval` query param).
- [ ] On Channel 06, add a **"your rank"** input — paste a wallet address, see
      your position in the family tree. (Hit `/api/holders` and find their
      index. Cache client-side.)
- [ ] Build a **commercial-break overlay** — every N channel changes, randomly
      show a 1.5s "WE'LL BE RIGHT BACK" card that fades out.
- [ ] Add ambient **audio**: very low-volume TV-tuning hum, with a mute toggle
      on the remote. Use Tone.js or a static MP3.

### Tier 3 — value-add features
- [ ] **Cousin-rank NFT mint route** at `/cousin-rank`. After connecting wallet
      and verifying holdings, mint an SPL NFT with the holder's role (Patriarch,
      Auntie, etc.). Use Metaplex's `@metaplex-foundation/umi` and `mpl-token-metadata`.
- [ ] **X Space recap channel** — Ch 03? Pull recent X Spaces from your Twitter
      account and embed transcripts.
- [ ] **Leaderboard ETL** — Cron a server action every 5 min that snapshots the
      top 50 holders and stores them in Vercel KV. Show 24h movement.

### Tier 4 — meta
- [ ] Set up Vercel deployment with proper env vars.
- [ ] Add an OG image generator at `/api/og` that renders a dynamic share image
      with current price + channel name. Use `next/og`.
- [ ] Lighthouse audit — aim for >90 perf on mobile.

## Conventions used

- All client components have `"use client";` at the top.
- All env access via `src/lib/config.ts` — don't read `process.env.*` directly
  in components.
- Tailwind colors: use `unc-50` through `unc-950` and `ink-700/800/900`. Don't
  introduce new color names.
- Display font (TV-feel): `font-display` class (VT323 fallback). Body: default.
- "CRT text" effect: add `crt-text` class for chromatic aberration glow.

## Don't

- Don't refactor the channel registry — adding channels is a one-line append.
- Don't add a wallet adapter library unless we're shipping the cousin-rank NFT
  mint. The current site is fine without one.
- Don't change the launch-pending state behavior of `BuyButton` /
  `ContractCopy` — they correctly disable themselves until the mint env var
  is set.

---

End of prompt.
