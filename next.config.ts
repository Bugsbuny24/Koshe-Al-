import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.supabase.in",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          // CORS: sadece kendi domain'inden istek kabul et
          // Deploy'da NEXT_PUBLIC_SITE_URL env'e eklenecek
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_SITE_URL ?? "https://koshe-al.onrender.com",
          },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type,Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
