import { ImageResponse } from "next/og";
import { config } from "@/lib/config";
import { CHANNELS, type ChannelId } from "@/lib/channels";

export const runtime = "edge";

interface PriceShape {
  available?: boolean;
  priceUsd?: number | null;
  changeH1?: number | null;
  changeH24?: number | null;
}

const fmtPrice = (n: number): string => {
  if (n >= 1) return `$${n.toFixed(3)}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  if (n >= 0.0001) return `$${n.toFixed(6)}`;
  const s = n.toFixed(12);
  const m = s.match(/^0\.(0*)(\d+)/);
  if (m) {
    const digits = m[2].slice(0, 3);
    return `$0.0(${m[1].length})${digits}`;
  }
  return `$${n.toExponential(2)}`;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const channelParam = url.searchParams.get("channel") ?? "ch13";
  const channel =
    CHANNELS.find((c) => c.id === (channelParam as ChannelId)) ?? CHANNELS[0];

  // Fetch price server-side. Best-effort — render anyway if it fails.
  let price: PriceShape = { available: false };
  try {
    const r = await fetch(`${url.origin}/api/price`, {
      next: { revalidate: 60 },
    });
    if (r.ok) price = (await r.json()) as PriceShape;
  } catch {}

  const priceText =
    price.available && price.priceUsd != null
      ? fmtPrice(price.priceUsd)
      : "STAND BY";
  const change = price.changeH1 ?? price.changeH24 ?? null;
  const changeText = change != null ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : "";
  const changeColor =
    change == null ? "#D4B6FF" : change >= 0 ? "#6EE7B7" : "#FCA5A5";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(ellipse at 30% 30%, #2E1065 0%, #0B0414 70%)",
          color: "#F5F0FF",
          fontFamily: "monospace",
          position: "relative",
          padding: "60px",
        }}
      >
        {/* scanlines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 3px, rgba(0,0,0,0.25) 4px, rgba(0,0,0,0) 5px)",
            display: "flex",
          }}
        />

        {/* top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "28px",
              letterSpacing: "0.4em",
              color: "#D4B6FF",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "999px",
                background: "#EF4444",
                boxShadow: "0 0 18px #EF4444",
              }}
            />
            ON AIR · CH {channel.number}
          </div>
          <div
            style={{
              fontSize: "28px",
              letterSpacing: "0.3em",
              color: "#B98BFF",
              display: "flex",
            }}
          >
            $PUNC TV
          </div>
        </div>

        {/* middle */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "32px",
              letterSpacing: "0.4em",
              color: "#D4B6FF",
              marginBottom: "16px",
              display: "flex",
            }}
          >
            {channel.category}
          </div>
          <div
            style={{
              fontSize: "120px",
              lineHeight: 1,
              color: "#F5F0FF",
              textShadow:
                "1px 0 0 rgba(255,0,80,0.6), -1px 0 0 rgba(0,200,255,0.5), 0 0 24px rgba(124,58,237,0.45)",
              display: "flex",
            }}
          >
            {channel.callSign}
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "30px",
              color: "#EADBFF",
              maxWidth: "900px",
              display: "flex",
            }}
          >
            {channel.tagline}
          </div>
        </div>

        {/* bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "2px solid rgba(124,58,237,0.4)",
            paddingTop: "28px",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "22px",
                letterSpacing: "0.4em",
                color: "#B98BFF",
              }}
            >
              ${config.token.symbol}
            </div>
            <div
              style={{
                fontSize: "72px",
                color: "#F5F0FF",
                display: "flex",
                alignItems: "baseline",
                gap: "20px",
              }}
            >
              {priceText}
              {changeText && (
                <span style={{ fontSize: "32px", color: changeColor }}>
                  {changeText}
                </span>
              )}
            </div>
          </div>
          <div
            style={{
              fontSize: "22px",
              letterSpacing: "0.3em",
              color: "#D4B6FF",
              textAlign: "right",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <span>TUNE IN</span>
            <span style={{ color: "#F5F0FF", fontSize: "28px" }}>
              punc.live
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
