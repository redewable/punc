import type { Metadata } from "next";
import { CousinRankClient } from "./CousinRankClient";

export const metadata: Metadata = {
  title: "$PUNC — Claim Your Cousin Rank",
  description:
    "Top $PUNC holders can mint a one-of-one cousin-rank NFT — your seat at the family table, on-chain.",
  openGraph: {
    title: "$PUNC — Claim Your Cousin Rank",
    description: "Top holders only. Mint your rank on-chain.",
    images: ["/api/og?channel=ch06"],
  },
};

export default function CousinRankPage() {
  return <CousinRankClient />;
}
