import { NextResponse } from "next/server";
import { config } from "@/lib/config";

// Server-side proxy to DexScreener's public API. Lets the client read price /
// market cap without exposing rate-limits or cross-origin issues.
export const revalidate = 30;

interface DexPair {
  priceUsd?: string;
  priceChange?: { h1?: number; h24?: number };
  fdv?: number;
  marketCap?: number;
  volume?: { h24?: number };
  liquidity?: { usd?: number };
}

export async function GET() {
  if (
    !config.token.mint ||
    config.token.mint === "PASTE_PUMPFUN_MINT_HERE"
  ) {
    return NextResponse.json({ available: false });
  }

  try {
    const r = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${config.token.mint}`,
      { next: { revalidate: 30 } }
    );
    if (!r.ok) throw new Error(`DexScreener ${r.status}`);
    const json = (await r.json()) as { pairs?: DexPair[] };
    const pair = json.pairs?.[0];
    if (!pair) return NextResponse.json({ available: false });

    return NextResponse.json({
      available: true,
      priceUsd: pair.priceUsd ? Number(pair.priceUsd) : null,
      changeH1: pair.priceChange?.h1 ?? null,
      changeH24: pair.priceChange?.h24 ?? null,
      fdv: pair.fdv ?? null,
      marketCap: pair.marketCap ?? null,
      volume24: pair.volume?.h24 ?? null,
      liquidityUsd: pair.liquidity?.usd ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ available: false, error: message }, { status: 200 });
  }
}
