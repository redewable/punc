# $PUNC Launch Playbook — pump.fun → Raydium

A practical, no-fluff checklist for getting $PUNC live and wired into this site.

---

## Phase 0 — Pre-flight (30 min)

- [ ] **Phantom wallet, dedicated for the launch.** Do not reuse a personal wallet.
- [ ] Fund it with ~0.5 SOL (creation fee on pump.fun is ~0.02 SOL; buffer for slippage + first buy).
- [ ] Have ready:
  - **Token name:** `Purple Unc`
  - **Ticker:** `PUNC`
  - **Image:** square PNG/JPG, 512×512 minimum. The included `logo.jpg` works as a starter — for best results regenerate a 1:1 transparent-bg version (see `branding/prompts.md`).
  - **Description:** "The Purple Channel. Broadcasting from the couch. Solana memecoin starring your degenerate uncle."
  - **Socials:** X handle reserved + Telegram channel created.

---

## Phase 1 — Launch on pump.fun

1. Go to **https://pump.fun** → connect Phantom.
2. Click **Create coin**.
3. Fill in:
   - Name: `Purple Unc`
   - Ticker: `PUNC`
   - Description: (above)
   - Image: upload
   - Twitter / Telegram / Website (set website to your deployed Vercel URL once live)
4. **Optional but recommended:** dev buy a small bag (0.1–0.3 SOL) at creation. This gives you a starter position and signals confidence to early viewers. Do not whale your own coin — keep dev allocation under 5% to avoid "rug optics."
5. **Sign the transaction.** Pump.fun mints the token and seeds the bonding curve liquidity pool automatically.
6. **Copy the mint address.** It looks like `9FssA1B7EhdWCt7rT4RtovYbWdKg3gog1wpXWuqHpump`.

---

## Phase 2 — Wire the site

In `.env.local`:

```env
NEXT_PUBLIC_MINT_ADDRESS=<paste_the_mint>
NEXT_PUBLIC_TWITTER_URL=https://x.com/YourHandle
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/YourChannel
HELIUS_API_KEY=<your_helius_key>     # optional but strongly recommended
```

Run:

```bash
npm install
npm run dev
```

Verify:
- Channel 02 (The News) shows the live DexScreener chart.
- Channel 06 (Family Hour) loads holders. (May take ~60s for first cache fill.)
- Buy button routes to Jupiter with the right mint.

Deploy to Vercel (recommended). Add the same env vars in the Vercel dashboard.

---

## Phase 3 — Bonding curve → Raydium migration

When your coin hits **~$69k market cap** on pump.fun (the threshold), it automatically migrates to Raydium and burns LP. Up to that point:

- **Do not announce widely** until you have some volume. ~10–20 holders + ~5–10 SOL volume makes the page look alive.
- Keep refreshing X / Telegram with chart screenshots, memes, and channel-themed posts ("Tonight on Channel 02…").
- When it migrates, the DexScreener chart on Channel 02 will continue to work — same mint address.

---

## Phase 4 — Post-migration hardening

After Raydium migration:

- [ ] **Verify LP is burned.** Check on Solscan: the LP token's largest holder should be the burn address `1nc1nerator11111111111111111111111111111111`. (Pump.fun handles this; you're verifying.)
- [ ] **Confirm mint authority is null.** Solscan → your mint → check that "Mint Authority" reads as `null`. Pump.fun also handles this. Verify anyway.
- [ ] **Confirm freeze authority is null.** Same Solscan view, "Freeze Authority" should be `null`.
- [ ] List on DexTools and Birdeye (they auto-pick up Raydium pairs within minutes, usually).
- [ ] Submit to CoinGecko + CoinMarketCap once you have ≥$500k in 24h volume and ≥500 holders (their minimums shift, check current bars).
- [ ] Add the mint address to your X bio. Add it to the pinned tweet.

---

## Phase 5 — The Purple Channel content cadence

The site's TV-channel theme is content gold. Don't waste it:

| Cadence | Channel | Post pattern |
|---|---|---|
| Daily | Ch 02 — News | "Tonight at 11" chart recap, screenshot the chart in the site's CRT frame |
| 2-3×/week | Ch 04 — Infomercial | "BUT WAIT THERE'S MORE" — feature a meme, a holder, a tokenomics fact |
| Weekly | Ch 06 — Family Hour | Roll-call thread shouting out top movers |
| Weekly | Ch 08 — The Vault | "From the vault" → drop a fan-submitted meme |
| Bi-weekly | Ch 11 — Coming Up Next | Tease the next thing (merch, X Space, drop) |
| Monthly | Ch 13 — Word from the Unc | Letter-from-the-uncle thread, lore drop |

---

## Common pitfalls

- **Don't dev-buy >5%.** Snipers look for this and dump on the bonding curve. <5% is fine.
- **Don't hide the contract address.** Display it. Pin it. Spam it. Memecoin buyers verify CAs constantly.
- **Don't promise utility.** Promise vibes. Deliver vibes.
- **Don't farm your own holders.** Solana sniper bots and Photon will notice clustered wallets buying within seconds. Looks bad.
- **Don't skip the Helius RPC.** The public Solana RPC will rate-limit `getProgramAccounts` (which the holder dashboard uses) within hours of any traffic. Free Helius tier handles it.

---

## Emergency contacts

- pump.fun support: https://pump.fun (DM @pumpdotfun on X)
- Phantom support: https://help.phantom.app
- Helius: https://helius.dev (Discord is responsive)
- Solscan: https://solscan.io
