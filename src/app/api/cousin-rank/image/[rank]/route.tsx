/**
 * Dynamic NFT image, 1024x1024. CRT card with the rank + role.
 * Served PNG via next/og for use as the on-chain image asset.
 */
import { ImageResponse } from "next/og";
import { roleForRank } from "@/lib/cousin-rank";

export const runtime = "edge";

const SIZE = 1024;

export async function GET(
  _req: Request,
  { params }: { params: { rank: string } }
) {
  const rank = Math.max(1, parseInt(params.rank, 10) || 1);
  const role = roleForRank(rank);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 40% 30%, #4C1D95 0%, #1A0742 60%, #0B0414 100%)",
          color: "#F5F0FF",
          fontFamily: "monospace",
          position: "relative",
          padding: "80px",
        }}
      >
        {/* scanlines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 4px, rgba(0,0,0,0.3) 5px, rgba(0,0,0,0) 6px)",
            display: "flex",
          }}
        />
        {/* vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7) 100%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "44px",
              letterSpacing: "0.4em",
              color: "#D4B6FF",
              marginBottom: "20px",
            }}
          >
            CUZ RANK
          </div>
          <div
            style={{
              fontSize: "320px",
              lineHeight: 1,
              color: "#F5F0FF",
              textShadow:
                "2px 0 0 rgba(255,0,80,0.6), -2px 0 0 rgba(0,200,255,0.5), 0 0 30px rgba(124,58,237,0.55)",
            }}
          >
            #{rank.toString().padStart(2, "0")}
          </div>
          <div
            style={{
              marginTop: "40px",
              fontSize: "54px",
              letterSpacing: "0.2em",
              color: "#F5F0FF",
              textAlign: "center",
              maxWidth: "900px",
              display: "flex",
            }}
          >
            {role}
          </div>
          <div
            style={{
              marginTop: "60px",
              fontSize: "26px",
              letterSpacing: "0.4em",
              color: "#B98BFF",
            }}
          >
            $PUNC · THE PURPLE CHANNEL
          </div>
        </div>
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
