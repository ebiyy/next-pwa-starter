import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.js": ["static"],
        "*.ts": ["static"],
        "*.tsx": ["static"],
        "*.css": ["static"],
      },
    },
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  // Build optimization
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  images: {
    unoptimized: false,
  },
};

export default config;
