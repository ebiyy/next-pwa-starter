-- テーブルのクリーンアップ
DROP TABLE IF EXISTS tech_stacks CASCADE;
DROP TABLE IF EXISTS features CASCADE;
DROP TABLE IF EXISTS changelogs CASCADE;

-- tech_stacksテーブルの作成
CREATE TABLE tech_stacks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('frontend', 'backend', 'testing', 'tooling')),
  description TEXT NOT NULL,
  doc_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- featuresテーブルの作成
CREATE TABLE features (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(50) NOT NULL,
  doc_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- changelogsテーブルの作成
CREATE TABLE changelogs (
  id SERIAL PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  release_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_major BOOLEAN NOT NULL DEFAULT FALSE
);

-- tech_stacksの初期データ
INSERT INTO tech_stacks (id, name, category, description, doc_url, created_at) VALUES
(1, 'Next.js', 'frontend', 'The React Framework for Production', 'https://nextjs.org/docs', '2025-01-01T00:00:00Z'),
(2, 'shadcn/ui', 'frontend', 'Beautifully designed components built with Radix UI and Tailwind CSS', 'https://ui.shadcn.com', '2025-01-01T00:00:00Z'),
(3, 'Supabase', 'backend', 'Open source Firebase alternative', 'https://supabase.com/docs', '2025-01-01T00:00:00Z'),
(4, 'Hono', 'backend', 'Ultrafast web framework for the Edges', 'https://hono.dev', '2025-01-01T00:00:00Z'),
(5, 'Bun', 'tooling', 'All-in-one JavaScript runtime & toolkit', 'https://bun.sh/docs', '2025-01-01T00:00:00Z'),
(6, 'Biome', 'tooling', 'Toolchain for web projects', 'https://biomejs.dev/', '2025-01-01T00:00:00Z'),
(7, 'Playwright', 'testing', 'Reliable end-to-end testing for modern web apps', 'https://playwright.dev', '2025-01-01T00:00:00Z');

-- featuresの初期データ
INSERT INTO features (id, title, description, icon_name, doc_url, created_at) VALUES
(1, 'PWA Support', 'オフライン対応とインストール可能なウェブアプリケーション', 'smartphone', 'https://nextjs.org/docs/app/building-your-application/optimizing/static-assets#static-assets', '2025-01-01T00:00:00Z'),
(2, 'Server Components', '高速なページロードとSEO対応のサーバーサイドレンダリング', 'server', 'https://nextjs.org/docs/app/building-your-application/rendering/server-components', '2025-01-01T00:00:00Z'),
(3, 'Type Safety', 'TypeScriptとBiomeによる堅牢な型システム', 'shield-check', 'https://www.typescriptlang.org/docs/', '2025-01-01T00:00:00Z'),
(4, 'API Integration', 'HonoとSupabaseを使用した高速なAPIインテグレーション', 'database', 'https://hono.dev/getting-started/basic', '2025-01-01T00:00:00Z'),
(5, 'Modern UI', 'shadcn/uiによるモダンでアクセシブルなUIコンポーネント', 'palette', 'https://ui.shadcn.com/docs', '2025-01-01T00:00:00Z');

-- changelogsの初期データ
INSERT INTO changelogs (id, version, description, release_date, is_major) VALUES
(1, '1.0.0', '初期リリース - PWA対応のNext.jsテンプレート', '2025-01-01T00:00:00Z', true),
(2, '1.1.0', 'shadcn/uiの導入とUIコンポーネントの実装', '2025-01-05T00:00:00Z', false),
(3, '1.2.0', 'HonoとSupabaseを使用したAPIルーティングの実装', '2025-01-10T00:00:00Z', false),
(4, '1.3.0', 'Biomeの導入とコード品質の改善', '2025-01-15T00:00:00Z', false),
(5, '2.0.0', 'React Server Componentsの完全対応とパフォーマンス最適化', '2025-01-17T00:00:00Z', true);

-- シーケンスの更新
SELECT setval('tech_stacks_id_seq', (SELECT MAX(id) FROM tech_stacks));
SELECT setval('features_id_seq', (SELECT MAX(id) FROM features));
SELECT setval('changelogs_id_seq', (SELECT MAX(id) FROM changelogs));