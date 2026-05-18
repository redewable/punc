import { Connection, PublicKey } from "@solana/web3.js";
import { config } from "./config";

// Helius first, public RPC second. Helius required for production use of
// getProgramAccounts at any volume — the public endpoint rate-limits hard.
export const getConnection = () => {
  const heliusKey = process.env.HELIUS_API_KEY;
  const url = heliusKey
    ? `https://mainnet.helius-rpc.com/?api-key=${heliusKey}`
    : config.rpc.solana;
  return new Connection(url, "confirmed");
};

// SPL Token Program ID
const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export interface HolderRow {
  owner: string;
  amount: number;
  uiAmount: number;
}

export interface HoldersResult {
  total: number;
  topHolders: HolderRow[];
  totalSupply: number | null;
}

/**
 * Fetch holders of a given SPL mint. Returns the top N owners by balance
 * plus the total holder count. Expensive — should be called from a server
 * route and cached.
 */
export async function fetchHolders(
  mintAddress: string,
  topN = 25
): Promise<HoldersResult> {
  if (!mintAddress || mintAddress === "PASTE_PUMPFUN_MINT_HERE") {
    return { total: 0, topHolders: [], totalSupply: null };
  }

  const connection = getConnection();
  const mintPubkey = new PublicKey(mintAddress);

  // getProgramAccounts with dataSize=165 (token account size) + mint filter.
  // This returns every token account holding the mint.
  const accounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      { dataSize: 165 },
      { memcmp: { offset: 0, bytes: mintPubkey.toBase58() } },
    ],
  });

  // Aggregate by owner (an owner can have multiple token accounts for one mint).
  const ownerMap = new Map<string, bigint>();
  for (const acc of accounts) {
    const data = acc.account.data;
    // Token account layout: mint(32) + owner(32) + amount(u64 LE @ 64)
    const owner = new PublicKey(data.subarray(32, 64)).toBase58();
    const amountLE = data.subarray(64, 72);
    const amount = Buffer.from(amountLE).readBigUInt64LE(0);
    if (amount === 0n) continue;
    ownerMap.set(owner, (ownerMap.get(owner) ?? 0n) + amount);
  }

  // Pull mint info for decimals + total supply.
  const supplyInfo = await connection.getTokenSupply(mintPubkey);
  const decimals = supplyInfo.value.decimals;
  const totalSupply = Number(supplyInfo.value.uiAmount ?? 0);

  const rows: HolderRow[] = [...ownerMap.entries()]
    .map(([owner, amt]) => ({
      owner,
      amount: Number(amt),
      uiAmount: Number(amt) / Math.pow(10, decimals),
    }))
    .sort((a, b) => b.uiAmount - a.uiAmount);

  return {
    total: rows.length,
    topHolders: rows.slice(0, topN),
    totalSupply,
  };
}
