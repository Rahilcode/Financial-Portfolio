import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore TypeScript build errors (dangerous)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint warnings/errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // You can add other Next.js config options here as needed
};

export default nextConfig;
