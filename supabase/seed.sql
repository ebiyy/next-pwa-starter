-- Features
INSERT INTO features (id, title, description, icon_name, doc_url, created_at) VALUES
  (gen_random_uuid(), 'PWA Support', 'オフライン対応とインストール可能なウェブアプリケーション', 'smartphone', 'https://nextjs.org/docs/app/building-your-application/optimizing/static-assets#static-assets', '2025-01-01T00:00:00Z'),
  (gen_random_uuid(), 'Server Components', '高速なページロードとSEO対応のサーバーサイドレンダリング', 'server', 'https://nextjs.org/docs/app/building-your-application/rendering/server-components', '2025-01-01T00:00:00Z'),
  (gen_random_uuid(), 'Type Safety', 'TypeScriptとBiomeによる堅牢な型システム', 'shield-check', 'https://www.typescriptlang.org/docs/', '2025-01-01T00:00:00Z'),
  (gen_random_uuid(), 'API Integration', 'HonoとSupabaseを使用した高速なAPIインテグレーション', 'database', 'https://hono.dev/getting-started/basic', '2025-01-01T00:00:00Z'),
  (gen_random_uuid(), 'Modern UI', 'shadcn/uiによるモダンでアクセシブルなUIコンポーネント', 'palette', 'https://ui.shadcn.com/docs', '2025-01-01T00:00:00Z');

-- Changelogs
INSERT INTO changelogs (id, version, description, release_date, is_major) VALUES
  (gen_random_uuid(), '1.0.0', '初期リリース - PWA対応のNext.jsテンプレート', '2025-01-01T00:00:00Z', true),
  (gen_random_uuid(), '1.1.0', 'shadcn/uiの導入とUIコンポーネントの実装', '2025-01-05T00:00:00Z', false),
  (gen_random_uuid(), '1.2.0', 'HonoとSupabaseを使用したAPIルーティングの実装', '2025-01-10T00:00:00Z', false),
  (gen_random_uuid(), '1.3.0', 'Biomeの導入とコード品質の改善', '2025-01-15T00:00:00Z', false),
  (gen_random_uuid(), '2.0.0', 'React Server Componentsの完全対応とパフォーマンス最適化', '2025-01-17T00:00:00Z', true);

-- Tech stacks
INSERT INTO tech_stacks (id, name, category, description, doc_url, created_at) VALUES
  (gen_random_uuid(), 'Next.js', 'frontend', 'The React Framework for Production', 'https://nextjs.org/docs', '2025-01-01T00:00:00Z'),
  (gen_random_uuid(), 'shadcn/ui', 'frontend', 'Beautifully designed components built with Radix UI and Tailwind CSS', 'https://ui.shadcn.com', '2025-01-01T00:00:00Z'),
  (gen_random_uuid(), 'Supabase', 'backend', 'Open source Firebase alternative', 'https://supabase.com/docs', '2025-01-01T00:00:00Z'),
  (gen_random_uuid(), 'Hono', 'backend', 'Ultrafast web framework for the Edges', 'https://hono.dev', '2025-01-01T00:00:00Z'),
  (gen_random_uuid(), 'Bun', 'tooling', 'All-in-one JavaScript runtime & toolkit', 'https://bun.sh/docs', '2025-01-01T00:00:00Z'),
  (gen_random_uuid(), 'Biome', 'tooling', 'Toolchain for web projects', 'https://biomejs.dev/', '2025-01-01T00:00:00Z'),
  (gen_random_uuid(), 'Playwright', 'testing', 'Reliable end-to-end testing for modern web apps', 'https://playwright.dev', '2025-01-01T00:00:00Z');