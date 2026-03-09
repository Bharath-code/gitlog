import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. These are mostly stylistic issues.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
