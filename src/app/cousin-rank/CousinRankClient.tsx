"use client";

import { useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

import { config } from "@/lib/config";
import { COUSIN_ROLES, roleForRank, COUSIN_RANK_ELIGIBLE_TOP_N } from "@/lib/cousin-rank";

import "@solana/wallet-adapter-react-ui/styles.css";

interface HolderRow {
  owner: string;
  uiAmount: number;
}
interface HoldersResp {
  total: number;
  topHolders: HolderRow[];
  totalSupply: number | null;
  fallback?: string;
}
interface MintResp {
  ok: boolean;
  reason?: string;
  claim?: { mint: string; rank: number; role: string; ts: number };
}

export function CousinRankClient() {
  // Pre-launch: show a coming-soon card and skip mounting the wallet
  // adapter at all. Flip NEXT_PUBLIC_CUZ_RANK_ENABLED=true to go live.
  if (!config.features.cuzRank) return <CousinRankComingSoon />;

  const endpoint = config.rpc.solana;
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <CousinRankInner />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function CousinRankComingSoon() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-24 pb-28">
      <div className="mb-6">
        <div className="font-display text-unc-200 text-xs tracking-[0.4em] mb-1">
          AN OFFICIAL OFFER FROM THE FAMILY
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-unc-50 crt-text">
          CLAIM YOUR CUZ RANK
        </h1>
        <p className="mt-3 text-unc-100/85">
          One-of-one on-chain NFTs for the top {COUSIN_RANK_ELIGIBLE_TOP_N} $PUNC
          holders. Stamped with your rank, your role, and the Unc&apos;s blessing
          (such as it is). Free to claim, no fee, one per wallet.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-unc-300/50 bg-unc-950/40 p-8 text-center shadow-[0_0_40px_rgba(124,58,237,0.35)]">
        <div className="font-display text-unc-300 text-xs tracking-[0.4em] mb-2">
          STAY TUNED · CLAIMS NOT YET LIVE
        </div>
        <div className="font-display text-unc-50 text-3xl md:text-4xl crt-text">
          MINTING COMING SOON
        </div>
        <p className="mx-auto mt-4 max-w-md text-unc-100/85">
          We&apos;re lining up the mint authority. Hold $PUNC, climb the
          leaderboard, and you&apos;ll be ready when the Unc says &quot;come and
          get it.&quot;
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-display">
          <a
            href="/#ch06"
            className="rounded border border-unc-300 bg-unc-500 px-5 py-2 text-sm tracking-[0.25em] text-white btn-glow"
          >
            ▶ CHECK YOUR PLACE AT THE TABLE
          </a>
          <a
            href="/#ch13"
            className="rounded border border-unc-300/40 bg-black/40 px-5 py-2 text-sm tracking-[0.25em] text-unc-200 hover:border-unc-300 hover:text-unc-50"
          >
            ← BACK TO CHANNEL 13
          </a>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-unc-700/50 bg-black/30 p-5 font-display">
        <div className="text-unc-300 text-[10px] tracking-[0.4em] mb-3">
          THE ROLE LADDER · PREVIEW
        </div>
        <ol className="grid grid-cols-2 gap-x-6 gap-y-1 text-unc-100 text-sm md:grid-cols-3">
          {COUSIN_ROLES.map((r, i) => (
            <li key={r} className="flex items-baseline gap-2">
              <span className="text-unc-300 w-8 tabular-nums">
                #{(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{r}</span>
            </li>
          ))}
          <li className="flex items-baseline gap-2 text-unc-300/80">
            <span className="w-8">…</span>
            <span>then CUZ #N down the line</span>
          </li>
        </ol>
      </div>

      <p className="mt-6 text-center font-mono text-[10px] text-unc-300/70">
        One per wallet, top {COUSIN_RANK_ELIGIBLE_TOP_N} only. Not financial
        advice. Probably not financial. Possibly not advice. Definitely not
        yours.
      </p>
    </section>
  );
}

function CousinRankInner() {
  const { publicKey } = useWallet();
  const wallet = publicKey?.toBase58() ?? null;

  const [holders, setHolders] = useState<HoldersResp | null>(null);
  const [holdersErr, setHoldersErr] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [mintResult, setMintResult] = useState<MintResp | null>(null);

  const lookup = async () => {
    setHoldersErr(null);
    setMintResult(null);
    try {
      const r = await fetch("/api/holders", { cache: "no-store" });
      const j = (await r.json()) as HoldersResp;
      setHolders(j);
    } catch (err) {
      setHoldersErr(err instanceof Error ? err.message : "fetch failed");
    }
  };

  const mint = async () => {
    if (!wallet) return;
    setMinting(true);
    setMintResult(null);
    try {
      const r = await fetch("/api/cousin-rank/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });
      const j = (await r.json()) as MintResp;
      setMintResult(j);
    } catch (err) {
      setMintResult({
        ok: false,
        reason: err instanceof Error ? err.message : "mint request failed",
      });
    } finally {
      setMinting(false);
    }
  };

  const rank = wallet && holders
    ? holders.topHolders.findIndex((h) => h.owner === wallet) + 1
    : 0;
  const role = rank > 0 ? roleForRank(rank) : null;
  const eligible = rank > 0 && rank <= COUSIN_RANK_ELIGIBLE_TOP_N;

  return (
    <section className="mx-auto max-w-3xl px-6 pt-24 pb-28">
      <div className="mb-6">
        <div className="font-display text-unc-200 text-xs tracking-[0.4em] mb-1">
          AN OFFICIAL OFFER FROM THE FAMILY
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-unc-50 crt-text">
          CLAIM YOUR CUZ RANK
        </h1>
        <p className="mt-3 text-unc-100/85">
          Connect the wallet that holds your $PUNC. If you&apos;re in the top{" "}
          {COUSIN_RANK_ELIGIBLE_TOP_N}, the Unc lets you mint a one-of-one NFT
          stamped with your rank and role. No fee, no edition, no take-backs.
        </p>
      </div>

      <div className="rounded-2xl border border-unc-700/60 bg-black/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="font-display">
            <div className="text-unc-300 text-[10px] tracking-[0.4em]">
              STEP 01 · CONNECT
            </div>
            <div className="text-unc-50 text-lg mt-1">Connect your wallet</div>
          </div>
          <WalletMultiButton />
        </div>

        <div className="mt-6 border-t border-unc-700/40 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="font-display">
              <div className="text-unc-300 text-[10px] tracking-[0.4em]">
                STEP 02 · LOOK UP YOUR RANK
              </div>
              <div className="text-unc-50 text-lg mt-1">
                Check your place at the table
              </div>
            </div>
            <button
              onClick={lookup}
              disabled={!wallet}
              className="rounded border border-unc-300 bg-unc-500 px-5 py-2 font-display text-sm tracking-[0.2em] text-white btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              LOOK ME UP
            </button>
          </div>

          {holdersErr && (
            <div className="mt-3 rounded border border-red-400/40 bg-red-500/10 p-3 font-mono text-xs text-red-200">
              {holdersErr}
            </div>
          )}
          {holders && wallet && (
            <div className="mt-3 rounded border border-unc-700/50 bg-black/50 p-4 font-display">
              {!holders.topHolders.length ? (
                <div className="text-unc-200 text-sm tracking-[0.2em]">
                  {holders.fallback ?? "Couldn't reach the family tree."}
                </div>
              ) : eligible ? (
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  <span className="text-unc-300 text-[10px] tracking-[0.4em]">
                    YOUR RANK
                  </span>
                  <span className="text-unc-50 text-3xl crt-text">
                    #{rank.toString().padStart(2, "0")}
                  </span>
                  <span className="text-unc-200 tracking-[0.3em] text-sm">
                    {role}
                  </span>
                </div>
              ) : (
                <div className="text-unc-200 text-sm tracking-[0.2em]">
                  NOT AT THE TABLE — outside the top {COUSIN_RANK_ELIGIBLE_TOP_N}.
                  Stack more $PUNC, come back.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-unc-700/40 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="font-display">
              <div className="text-unc-300 text-[10px] tracking-[0.4em]">
                STEP 03 · MINT
              </div>
              <div className="text-unc-50 text-lg mt-1">
                Engrave it on-chain
              </div>
            </div>
            <button
              onClick={mint}
              disabled={!eligible || minting}
              className="rounded border border-unc-300 bg-unc-500 px-5 py-2 font-display text-sm tracking-[0.2em] text-white btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {minting ? "MINTING…" : "MINT MY RANK"}
            </button>
          </div>

          {mintResult && (
            <div
              className={[
                "mt-3 rounded border p-4 font-display",
                mintResult.ok
                  ? "border-emerald-400/40 bg-emerald-500/10"
                  : "border-red-400/40 bg-red-500/10",
              ].join(" ")}
            >
              {mintResult.ok && mintResult.claim ? (
                <div className="space-y-2">
                  <div className="text-emerald-300 text-sm tracking-[0.3em]">
                    MINTED · #{mintResult.claim.rank.toString().padStart(2, "0")}{" "}
                    · {mintResult.claim.role}
                  </div>
                  <a
                    href={`https://solscan.io/token/${mintResult.claim.mint}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-unc-100 hover:text-unc-50 font-mono text-xs underline"
                  >
                    {mintResult.claim.mint} ↗
                  </a>
                </div>
              ) : (
                <div className="text-red-200 text-sm">
                  {mintResult.reason ?? "Mint failed."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-unc-700/50 bg-black/30 p-5 font-display">
        <div className="text-unc-300 text-[10px] tracking-[0.4em] mb-3">
          THE ROLE LADDER
        </div>
        <ol className="grid grid-cols-2 gap-x-6 gap-y-1 text-unc-100 text-sm md:grid-cols-3">
          {COUSIN_ROLES.map((r, i) => (
            <li key={r} className="flex items-baseline gap-2">
              <span className="text-unc-300 w-8 tabular-nums">
                #{(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{r}</span>
            </li>
          ))}
          <li className="flex items-baseline gap-2 text-unc-300/80">
            <span className="w-8">…</span>
            <span>then CUZ #N down the line</span>
          </li>
        </ol>
      </div>

      <p className="mt-6 text-center font-mono text-[10px] text-unc-300/70">
        NFTs are issued by the $PUNC mint authority. One per wallet, top{" "}
        {COUSIN_RANK_ELIGIBLE_TOP_N} only. Not financial advice. Probably not
        financial. Possibly not advice. Definitely not yours.
      </p>
    </section>
  );
}
