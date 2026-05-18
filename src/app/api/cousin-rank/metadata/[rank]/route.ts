/**
 * Metaplex-compliant metadata JSON for a cousin-rank NFT. Pointed at by the
 * on-chain metadata account's `uri` field. Override the hosting URL via
 * COUSIN_RANK_METADATA_BASE if you want metadata + image on Arweave instead.
 */
import { NextResponse } from "next/server";
import { roleForRank } from "@/lib/cousin-rank";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { rank: string } }
) {
  const rank = Math.max(1, parseInt(params.rank, 10) || 1);
  const role = roleForRank(rank);
  const origin = new URL(req.url).origin;

  return NextResponse.json(
    {
      name: `Cuz Rank #${rank.toString().padStart(2, "0")} — ${role}`,
      symbol: "PUNCRANK",
      description:
        "On-chain seat at the $PUNC family table. Earned by holding $PUNC. Burned by leaving.",
      image: `${origin}/api/cousin-rank/image/${rank}`,
      external_url: `${origin}/cousin-rank`,
      attributes: [
        { trait_type: "Rank", value: rank },
        { trait_type: "Role", value: role },
        { trait_type: "Family", value: "Purple Unc" },
      ],
      properties: {
        category: "image",
        files: [
          {
            uri: `${origin}/api/cousin-rank/image/${rank}`,
            type: "image/png",
          },
        ],
      },
    },
    {
      headers: { "Cache-Control": "public, s-maxage=86400" },
    }
  );
}
