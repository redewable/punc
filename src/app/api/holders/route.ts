import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { fetchHolders } from "@/lib/solana";
import {
  computeDeltas,
  isKvAvailable,
  load24hAgoSnapshot,
  type RankDelta,
} from "@/lib/snapshots";

// 60s cache so we don't hammer the RPC.
export const revalidate = 60;

export async function GET() {
  if (
    !config.token.mint ||
    config.token.mint === "PASTE_PUMPFUN_MINT_HERE"
  ) {
    return NextResponse.json({
      total: 0,
      topHolders: [],
      totalSupply: null,
      fallback: "mint not configured — set NEXT_PUBLIC_MINT_ADDRESS",
    });
  }

  try {
    const data = await fetchHolders(config.token.mint, 25);

    let deltas: Record<string, RankDelta> | undefined;
    if (isKvAvailable()) {
      const prior = await load24hAgoSnapshot();
      if (prior) {
        const current = {
          ts: Date.now(),
          ranks: data.topHolders.map((h) => h.owner),
        };
        deltas = computeDeltas(current, prior);
      }
    }

    return NextResponse.json(
      { ...data, deltas },
      {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
      }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "unknown RPC error";
    return NextResponse.json(
      {
        total: 0,
        topHolders: [],
        totalSupply: null,
        fallback: `RPC error: ${message}. Set HELIUS_API_KEY for production use.`,
      },
      { status: 200 }
    );
  }
}
