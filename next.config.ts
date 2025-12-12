import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    // false = bloque le build en cas d'erreurs ESLint
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
