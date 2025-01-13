import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.js": ["static"],
      },
    },
  },
};

export default config;
