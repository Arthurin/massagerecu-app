import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [90],
  },
  eslint: {
    // false = bloque le build en cas d'erreurs ESLint
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
