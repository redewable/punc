// Single source of truth for env-driven values.
// Anything starting with NEXT_PUBLIC_ is safe to expose to the client.

export const config = {
  token: {
    symbol: process.env.NEXT_PUBLIC_TOKEN_SYMBOL ?? "PUNC",
    name: process.env.NEXT_PUBLIC_TOKEN_NAME ?? "Purple Unc",
    // CA is hardcoded as the default so the site goes live without needing
    // an env var on every environment. NEXT_PUBLIC_MINT_ADDRESS still wins
    // when set (useful for previews against a test mint).
    mint:
      process.env.NEXT_PUBLIC_MINT_ADDRESS ??
      "5AxHzjN16umYxDfMn7zWG6Agdg8mSQUQ3d4qV8bvpump",
  },
  socials: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL ?? "",
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "",
    discord: process.env.NEXT_PUBLIC_DISCORD_URL ?? "",
  },
  rpc: {
    solana: process.env.NEXT_PUBLIC_SOLANA_RPC ?? "https://api.mainnet-beta.solana.com",
  },
  features: {
    // Hides the /cousin-rank wallet + mint flow until the operator funds the
    // mint authority. Flip NEXT_PUBLIC_CUZ_RANK_ENABLED=true in Vercel after
    // setting COUSIN_RANK_MINT_AUTHORITY_SECRET to turn the page live.
    cuzRank: process.env.NEXT_PUBLIC_CUZ_RANK_ENABLED === "true",
  },
} as const;

export const isMintLive = () =>
  !!config.token.mint &&
  config.token.mint !== "PASTE_PUMPFUN_MINT_HERE" &&
  config.token.mint.length >= 32;

export const jupiterSwapUrl = () =>
  `https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=${config.token.mint}`;

export const dexScreenerUrl = () =>
  `https://dexscreener.com/solana/${config.token.mint}`;

export type ChartInterval = "1" | "5" | "60";

export const dexScreenerEmbedUrl = (interval?: ChartInterval) => {
  const base = `https://dexscreener.com/solana/${config.token.mint}?embed=1&theme=dark&trades=0&info=0`;
  return interval ? `${base}&interval=${interval}` : base;
};

export const pumpFunUrl = () =>
  `https://pump.fun/coin/${config.token.mint}`;
