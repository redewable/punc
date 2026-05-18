import type { Metadata, Viewport } from "next";
import { Inter, VT323 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-body",
  display: "swap",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "$PUNC — The Purple Channel · Broadcasting from the couch",
  description:
    "$PUNC (Purple Unc) — a Solana memecoin broadcast live from your degenerate uncle's basement. Channel up. Cope down.",
  metadataBase: new URL("https://punc.live"),
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "$PUNC — The Purple Channel",
    description: "Tune in. Cope out. Live on Solana.",
    type: "website",
    images: ["/api/og"]
  },
  twitter: {
    card: "summary_large_image",
    title: "$PUNC — The Purple Channel",
    description: "Tune in. Cope out. Live on Solana.",
    images: ["/api/og"]
  }
};

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${vt323.variable}`}>
      <body className="crt-scanlines crt-curvature">{children}</body>
    </html>
  );
}
