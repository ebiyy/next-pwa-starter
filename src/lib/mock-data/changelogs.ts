import type { Changelog } from "@/types/schema";

export const changelogsData: Changelog[] = [
  {
    id: 1,
    version: "1.0.0",
    description: "初期リリース - PWA対応のNext.jsテンプレート",
    release_date: "2025-01-01T00:00:00Z",
    is_major: true,
  },
  {
    id: 2,
    version: "1.1.0",
    description: "shadcn/uiの導入とUIコンポーネントの実装",
    release_date: "2025-01-05T00:00:00Z",
    is_major: false,
  },
  {
    id: 3,
    version: "1.2.0",
    description: "HonoとSupabaseを使用したAPIルーティングの実装",
    release_date: "2025-01-10T00:00:00Z",
    is_major: false,
  },
  {
    id: 4,
    version: "1.3.0",
    description: "Biomeの導入とコード品質の改善",
    release_date: "2025-01-15T00:00:00Z",
    is_major: false,
  },
  {
    id: 5,
    version: "2.0.0",
    description: "React Server Componentsの完全対応とパフォーマンス最適化",
    release_date: "2025-01-17T00:00:00Z",
    is_major: true,
  },
];
