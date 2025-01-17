import type { Changelog, Feature, TechStack } from "@/types/schema";

export const mockFeatures: Feature[] = [
  {
    id: 1,
    title: "Next.js 15",
    description:
      "App RouterとServer Componentsによる最新のReactアプリケーション開発",
    icon_name: "code",
    doc_url: "https://nextjs.org",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Supabase",
    description: "オープンソースのFirebase代替。認証やデータベースを簡単に実装",
    icon_name: "database",
    doc_url: "https://supabase.com",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "PWA対応",
    description: "Progressive Web Appとしてインストール可能",
    icon_name: "smartphone",
    doc_url: "https://web.dev/progressive-web-apps/",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "shadcn/ui",
    description: "美しく、アクセシブルなUIコンポーネントライブラリ",
    icon_name: "palette",
    doc_url: "https://ui.shadcn.com",
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Turbopack",
    description: "Rustで書かれた超高速なビルドツール",
    icon_name: "code",
    doc_url: "https://turbo.build",
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Biome",
    description: "高速で一貫性のあるコード品質管理ツール",
    icon_name: "code",
    doc_url: "https://biomejs.dev",
    created_at: new Date().toISOString(),
  },
];

export const mockTechStacks: TechStack[] = [
  {
    id: 1,
    name: "Next.js",
    description: "The React Framework for the Web",
    doc_url: "https://nextjs.org",
    category: "frontend" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Supabase",
    description: "Open source Firebase alternative",
    doc_url: "https://supabase.com",
    category: "backend" as const,
    created_at: new Date().toISOString(),
  },
];

export const mockChangelogs: Changelog[] = [
  {
    id: 1,
    version: "2.0.0",
    description:
      "Next.js 15とTurbopackの統合 - パフォーマンスと開発体験を大幅に向上",
    release_date: "2025-01-13T22:21:29+0900",
    is_major: true,
  },
  {
    id: 2,
    version: "1.2.0",
    description:
      "shadcn/uiコンポーネントの追加 - モダンでアクセシブルなUIコンポーネント",
    release_date: "2025-01-13T22:21:16+0900",
    is_major: false,
  },
  {
    id: 3,
    version: "1.1.0",
    description:
      "PWA対応の追加 - オフライン対応とインストール可能なアプリケーション",
    release_date: "2025-01-13T20:53:09+0900",
    is_major: false,
  },
  {
    id: 4,
    version: "1.0.0",
    description:
      "初期リリース - Next.js 15とSupabaseを統合したモダンなWeb開発のためのスターターテンプレート",
    release_date: "2025-01-13T20:52:13+0900",
    is_major: true,
  },
];
