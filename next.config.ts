import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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