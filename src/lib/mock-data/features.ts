import type { Feature } from "@/types/schema";

export const featuresData: Feature[] = [
  {
    id: 1,
    title: "PWA Support",
    description: "オフライン対応とインストール可能なウェブアプリケーション",
    icon_name: "smartphone",
    doc_url:
      "https://nextjs.org/docs/app/building-your-application/optimizing/static-assets#static-assets",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    title: "Server Components",
    description: "高速なページロードとSEO対応のサーバーサイドレンダリング",
    icon_name: "server",
    doc_url:
      "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 3,
    title: "Type Safety",
    description: "TypeScriptとBiomeによる堅牢な型システム",
    icon_name: "shield-check",
    doc_url: "https://www.typescriptlang.org/docs/",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 4,
    title: "API Integration",
    description: "HonoとSupabaseを使用した高速なAPIインテグレーション",
    icon_name: "database",
    doc_url: "https://hono.dev/getting-started/basic",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 5,
    title: "Modern UI",
    description: "shadcn/uiによるモダンでアクセシブルなUIコンポーネント",
    icon_name: "palette",
    doc_url: "https://ui.shadcn.com/docs",
    created_at: "2025-01-01T00:00:00Z",
  },
];
