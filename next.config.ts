import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "orqxapxwrjvwgtqvpxcg.supabase.co",
      },
    ],
  },
};

export default nextConfig;
