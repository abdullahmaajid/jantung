import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimasi performa
  compress: true,

  // Turbopack config untuk Next.js 16 (pengganti webpack)
  turbopack: {},

  // Allow import dari package tertentu (Three.js ecosystem)
  transpilePackages: ["three"],

  // Header keamanan
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
