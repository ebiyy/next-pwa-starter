import type { NextConfig } from "next";

const testConfig: NextConfig = {
  // テスト環境用の設定
  env: {
    NODE_ENV: "test",
  },
  // テスト時は画像最適化を無効化
  images: {
    unoptimized: true,
  },
  // テスト時はwebpackの設定を最適化
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // テスト時は不要な最適化を無効化
      Object.assign(config.optimization, {
        minimize: false,
        splitChunks: false,
      });
    }
    return config;
  },
  // PWAの設定を無効化
  pwa: {
    disable: true,
    register: false,
    scope: "/",
    sw: "/sw.js",
  },
};

export default testConfig;
