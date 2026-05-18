/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.dexscreener.com" },
      { protocol: "https", hostname: "**.birdeye.so" },
      { protocol: "https", hostname: "arweave.net" },
      { protocol: "https", hostname: "**.arweave.net" },
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "**.ipfs.io" },
      { protocol: "https", hostname: "pump.fun" },
      { protocol: "https", hostname: "**.pump.fun" }
    ]
  }
};

export default nextConfig;
