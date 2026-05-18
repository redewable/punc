# $PUNC — The Purple Channel

A full-stack Solana memecoin site for **$PUNC (Purple Unc)**, themed as a
bootleg late-night public-access TV channel.

> Stack: Next.js 14 (App Router) · TypeScript · Tailwind · Solana web3.js
> · DexScreener · Jupiter · pump.fun

## What's in the box

- **TV-channel UI.** Seven "channels" you switch with a remote, arrow keys,
  or number keys. CRT scanlines, static transitions, station ID, lower-third
  bumper ticker.
- **Channel 02 — The News.** Live DexScreener chart embed, anchor desk copy,
  pop-out link.
- **Channel 04 — Infomercial.** Four-step "how to buy" with "BUT WAIT" stickers.
- **Channel 06 — Family Hour.** Live holder dashboard — top-25 holders pulled
  on-chain via Solana RPC, "cousin" roles, percent-of-supply breakdown.
- **Channel 08 — The Vault.** Meme gallery, JSON-manifest fed, masonry layout.
- **Channel 11 — Coming Up Next.** Promo block for upcoming drops (merch,
  X spaces, cousin-rank NFTs, VHS giveaway).
- **Channel 13 — Word from the Unc.** Hero / mascot / tokenomics monologue.
- **Channel 99 — Static.** Easter egg.
- **Channel 03 — Late Night with the Unc.** X Spaces recap channel, fed
  from `public/spaces/manifest.json` (Twitter's free API doesn't expose
  Spaces, so it's manifest-driven).
- **Price ticker.** Top-right HUD polling `/api/price` every 30s. Hides
  itself pre-launch.
- **Commercial breaks.** Every ~4th channel change, a 1.5s "WE'LL BE
  RIGHT BACK" bumper.
- **Cousin-rank NFT mint.** `/cousin-rank` page — top-25 holders can
  claim a one-of-one NFT stamped with their rank/role. Wallet adapter +
  Metaplex Umi. Server pays SOL rent; gated by an env-loaded mint
  authority keypair.
- **Leaderboard ETL.** `/api/holders/snapshot` cron writes top-50
  snapshots to Vercel KV every 5 min; `/api/holders` emits 24h rank
  deltas; Channel 06 renders ▲/▼/NEW badges per row.
- **API routes.** `/api/holders` (cached, Helius-aware), `/api/price`
  (DexScreener proxy), `/api/og` (dynamic 1200×630 OG image),
  `/api/holders/snapshot` (cron), `/api/cousin-rank/{mint,metadata,image}`.
- **Launch-ready.** `LAUNCH.md` walks you through pump.fun launch, env
  wiring, Raydium migration, post-migration hardening. `.env.example`
  lists every env var with notes.

## Quick start

```bash
# 1. Install
npm install

# 2. Copy env and fill it in
cp .env.example .env.local
# (edit .env.local — set NEXT_PUBLIC_MINT_ADDRESS after pump.fun launch)

# 3. Dev
npm run dev
# open http://localhost:3000
```

## Project layout

```
src/
├── app/
│   ├── api/
│   │   ├── holders/route.ts     ← on-chain holder dashboard
│   │   └── price/route.ts       ← DexScreener proxy
│   ├── globals.css              ← CRT effects, scanlines, marquee, static
│   ├── layout.tsx               ← Fonts (VT323 + Inter), metadata
│   └── page.tsx                 ← Renders ChannelController
├── components/
│   ├── ChannelController.tsx    ← state machine, keyboard nav, hash routing
│   ├── channels/                ← one component per channel
│   ├── tv/                      ← TV chrome: indicator, remote, lower-third, static
│   └── shared/                  ← BuyButton, ContractCopy
└── lib/
    ├── channels.ts              ← channel registry (id, number, callsign, bumper)
    ├── config.ts                ← env-driven token + socials + URLs
    └── solana.ts                ← getProgramAccounts holder aggregation

public/
├── logo.jpg                     ← The Unc (already in folder)
├── memes/                       ← drop meme files here; list in manifest.json
└── ...

branding/prompts.md              ← image-gen prompts for Midjourney / DALL-E
LAUNCH.md                        ← pump.fun launch playbook
CLAUDE_CODE_PROMPT.md            ← prompt to continue work in Claude Code
```

## Customizing

| Want to… | Edit |
|---|---|
| Add a channel | `src/lib/channels.ts` + new component in `src/components/channels/` + wire in `ChannelController.tsx` |
| Change tokenomics numbers | `src/components/channels/Channel13Word.tsx` |
| Change anchor news copy | `src/components/channels/Channel02News.tsx` |
| Change how-to-buy steps | `src/components/channels/Channel04Infomercial.tsx` |
| Add memes | Drop files in `public/memes/` + add entries to `public/memes/manifest.json` |
| Change colors | `tailwind.config.ts` → `theme.extend.colors.unc.*` |
| Change CRT intensity | `src/app/globals.css` → adjust `.crt-scanlines` opacity & `.scan-band` |

## Deploy

Vercel is the path of least resistance:

```bash
npx vercel --prod
```

Mirror every var from `.env.example` into the Vercel dashboard. The minimum
to ship: `NEXT_PUBLIC_MINT_ADDRESS`, `HELIUS_API_KEY`, socials. Add KV
storage (Storage → Create KV) if you want the 24h rank-movement badges to
appear — it auto-injects `KV_REST_API_URL` / `KV_REST_API_TOKEN`. Set
`CRON_SECRET` to enable the snapshot cron (configured in `vercel.json`,
runs every 5 min — Hobby plan caps crons at daily, upgrade to Pro for the
5-min cadence). For NFT mints, set `COUSIN_RANK_MINT_AUTHORITY_SECRET` to
a base58-encoded keypair secret with ~0.05 SOL funded.

Production builds run `npm run build` which calls `next build` — type
errors will fail the build, which is what you want.

## License

This project is yours. The Unc is yours. The chart is unfortunately also yours.
