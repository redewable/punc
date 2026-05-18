/**
 * Server-side cousin-rank NFT mint.
 *
 * Flow:
 *  1. Client posts { wallet } (the recipient holder pubkey).
 *  2. Server re-verifies the wallet is in the eligible top-N holders via the
 *     same fetchHolders() that powers the dashboard. Client claims are not
 *     trusted.
 *  3. Server checks the per-wallet claim flag in KV (`cousinrank:claimed:{w}`)
 *     so each holder can only mint once.
 *  4. Server creates an NFT via Metaplex (Umi) — mint authority = update
 *     authority = the server's COUSIN_RANK_MINT_AUTHORITY keypair. The
 *     recipient becomes the token owner. Server pays SOL rent.
 *  5. KV is updated with `claimed → { mint, ts }` and returned.
 *
 * Operator cost: ~0.005 SOL per mint (mint account + metadata account + ATA
 * rent). Keep the authority wallet funded.
 */
import { NextResponse } from "next/server";
import bs58 from "bs58";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey as umiPublicKey,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import { config } from "@/lib/config";
import { fetchHolders } from "@/lib/solana";
import {
  COUSIN_RANK_ELIGIBLE_TOP_N,
  roleForRank,
} from "@/lib/cousin-rank";
import { kvGet, kvSet, isKvAvailable } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface MintReq {
  wallet?: string;
}
interface ClaimRecord {
  mint: string;
  ts: number;
  rank: number;
  role: string;
}

const SOLANA_PUBKEY_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function rpcUrl(): string {
  const heliusKey = process.env.HELIUS_API_KEY;
  return heliusKey
    ? `https://mainnet.helius-rpc.com/?api-key=${heliusKey}`
    : config.rpc.solana;
}

export async function POST(req: Request) {
  const authoritySecret = process.env.COUSIN_RANK_MINT_AUTHORITY_SECRET;
  if (!authoritySecret) {
    return NextResponse.json(
      {
        ok: false,
        reason:
          "COUSIN_RANK_MINT_AUTHORITY_SECRET not set. Generate a keypair, fund it with SOL, and set the env var to its base58 secret key.",
      },
      { status: 503 }
    );
  }
  if (
    !config.token.mint ||
    config.token.mint === "PASTE_PUMPFUN_MINT_HERE"
  ) {
    return NextResponse.json(
      { ok: false, reason: "Token mint not configured." },
      { status: 503 }
    );
  }

  let body: MintReq;
  try {
    body = (await req.json()) as MintReq;
  } catch {
    return NextResponse.json({ ok: false, reason: "Invalid JSON" }, { status: 400 });
  }
  const wallet = (body.wallet ?? "").trim();
  if (!SOLANA_PUBKEY_RE.test(wallet)) {
    return NextResponse.json(
      { ok: false, reason: "Invalid recipient wallet." },
      { status: 400 }
    );
  }

  // Re-verify eligibility from on-chain truth.
  let holders;
  try {
    holders = await fetchHolders(config.token.mint, COUSIN_RANK_ELIGIBLE_TOP_N);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown RPC error";
    return NextResponse.json(
      { ok: false, reason: `RPC error: ${message}` },
      { status: 502 }
    );
  }
  const idx = holders.topHolders.findIndex((h) => h.owner === wallet);
  if (idx === -1) {
    return NextResponse.json(
      {
        ok: false,
        reason: `Wallet not in the top ${COUSIN_RANK_ELIGIBLE_TOP_N} $PUNC holders.`,
      },
      { status: 403 }
    );
  }
  const rank = idx + 1;
  const role = roleForRank(rank);

  // Per-wallet single-claim guard. If KV isn't available, we skip this check
  // — the operator can disable mints by leaving COUSIN_RANK_MINT_AUTHORITY
  // unset if abuse becomes a thing.
  const claimKey = `cousinrank:claimed:${wallet}`;
  if (isKvAvailable()) {
    const existing = await kvGet<string>(claimKey);
    if (existing) {
      try {
        const rec = JSON.parse(existing) as ClaimRecord;
        return NextResponse.json(
          { ok: false, reason: "Already claimed.", claim: rec },
          { status: 409 }
        );
      } catch {
        // fall through and re-mint if the record is corrupt
      }
    }
  }

  // Build umi with the server's authority as the identity.
  let secretBytes: Uint8Array;
  try {
    secretBytes = bs58.decode(authoritySecret);
  } catch {
    return NextResponse.json(
      { ok: false, reason: "COUSIN_RANK_MINT_AUTHORITY_SECRET is not valid base58." },
      { status: 500 }
    );
  }

  const umi = createUmi(rpcUrl()).use(mplTokenMetadata());
  const authority = umi.eddsa.createKeypairFromSecretKey(secretBytes);
  umi.use(keypairIdentity(authority));

  const metadataBase =
    process.env.COUSIN_RANK_METADATA_BASE ?? new URL(req.url).origin;
  const uri = `${metadataBase.replace(/\/$/, "")}/api/cousin-rank/metadata/${rank}`;

  const mint = generateSigner(umi);
  try {
    await createNft(umi, {
      mint,
      name: `Cuz Rank #${rank.toString().padStart(2, "0")}`,
      symbol: "PUNCRANK",
      uri,
      sellerFeeBasisPoints: percentAmount(0),
      tokenOwner: umiPublicKey(wallet),
      isMutable: true,
    }).sendAndConfirm(umi);
  } catch (err) {
    const message = err instanceof Error ? err.message : "mint failed";
    return NextResponse.json(
      { ok: false, reason: `Mint failed: ${message}` },
      { status: 500 }
    );
  }

  const mintAddress = mint.publicKey.toString();
  const claim: ClaimRecord = { mint: mintAddress, ts: Date.now(), rank, role };
  if (isKvAvailable()) {
    try {
      await kvSet(claimKey, JSON.stringify(claim));
    } catch {
      // Non-fatal — mint already happened on-chain.
    }
  }

  return NextResponse.json({ ok: true, claim });
}
