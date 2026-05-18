/**
 * Cron-only snapshot writer. Schedule via vercel.json:
 *
 *   { "crons": [{ "path": "/api/holders/snapshot", "schedule": "*\/5 * * * *" }] }
 *
 * Auth model:
 *  - Vercel cron sends `Authorization: Bearer ${CRON_SECRET}` automatically
 *    when CRON_SECRET is set as an env var.
 *  - Manual hits work with the same Bearer token.
 */
import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { fetchHolders } from "@/lib/solana";
import { isKvAvailable, saveSnapshot } from "@/lib/snapshots";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, reason: "CRON_SECRET not configured" },
      { status: 503 }
    );
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  if (!isKvAvailable()) {
    return NextResponse.json(
      { ok: false, reason: "KV not configured" },
      { status: 503 }
    );
  }
  if (
    !config.token.mint ||
    config.token.mint === "PASTE_PUMPFUN_MINT_HERE"
  ) {
    return NextResponse.json(
      { ok: false, reason: "mint not configured" },
      { status: 503 }
    );
  }

  try {
    const data = await fetchHolders(config.token.mint, 50);
    await saveSnapshot(data.topHolders);
    return NextResponse.json({
      ok: true,
      ts: Date.now(),
      holdersWritten: data.topHolders.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ ok: false, reason: message }, { status: 500 });
  }
}
