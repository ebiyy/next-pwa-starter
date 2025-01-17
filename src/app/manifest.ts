import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next.js PWA Starter",
    short_name: "PWA Starter",
    description: "最小限の設定でPWA対応したNext.jsスターターテンプレート",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    categories: ["development", "productivity", "utilities"],
    display_override: ["window-controls-overlay", "minimal-ui"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    orientation: "any",
    prefer_related_applications: false,
    scope: "/",
    shortcuts: [
      {
        name: "ホーム",
        url: "/",
        description: "ホームページを開く",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "オフライン",
        url: "/offline",
        description: "オフラインページを開く",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
    ],
    related_applications: [],
    protocol_handlers: [
      {
        protocol: "web+pwa",
        url: "/%s",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop.png",
        sizes: "1920x1080",
        type: "image/png",
        platform: "windows",
        label: "デスクトップ画面",
      },
      {
        src: "/screenshots/mobile.png",
        sizes: "390x844",
        type: "image/png",
        platform: "ios",
        label: "モバイル画面",
      },
    ],
    id: "next-pwa-starter",
    dir: "auto",
  };
}
