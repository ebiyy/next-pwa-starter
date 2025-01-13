-- Insert sample data
insert into features (title, description, icon_name) values
  ('PWA Support', 'オフライン対応とインストール可能なウェブアプリケーション', 'smartphone'),
  ('API Routes', 'Hono.jsを使用した高速なAPIルーティング', 'code'),
  ('Database', 'Supabaseによる堅牢なバックエンド', 'database'),
  ('UI Components', 'shadcn/uiによる美しいUIコンポーネント', 'palette');

insert into changelogs (version, description, is_major) values
  ('1.0.0', 'Initial release with PWA support', true),
  ('1.1.0', 'Added Hono.js integration', false),
  ('1.2.0', 'Integrated Supabase backend', false);

insert into tech_stacks (name, category, description, doc_url) values
  ('Next.js 15', 'frontend', 'Reactフレームワーク', 'https://nextjs.org/docs'),
  ('Hono.js', 'backend', '軽量なWebフレームワーク', 'https://hono.dev'),
  ('Supabase', 'backend', 'オープンソースのバックエンドプラットフォーム', 'https://supabase.com/docs'),
  ('shadcn/ui', 'frontend', '再利用可能なUIコンポーネント', 'https://ui.shadcn.com'),
  ('Biome', 'tooling', '高速な開発ツール', 'https://biomejs.dev/');