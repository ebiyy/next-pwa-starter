-- Features table to showcase project capabilities
create table features (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  icon_name text not null, -- lucide-reactのアイコン名
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Changelog table to track project updates
create table changelogs (
  id uuid default gen_random_uuid() primary key,
  version text not null,
  description text not null,
  release_date timestamp with time zone default timezone('utc'::text, now()) not null,
  is_major boolean default false
);

-- Tech stack table
create table tech_stacks (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null, -- 'frontend', 'backend', 'testing', etc.
  description text not null,
  doc_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table features enable row level security;
alter table changelogs enable row level security;
alter table tech_stacks enable row level security;

-- Create policies
create policy "Allow public access to features"
  on features for all
  using (true)
  with check (true);

create policy "Allow public access to changelogs"
  on changelogs for all
  using (true)
  with check (true);

create policy "Allow public access to tech_stacks"
  on tech_stacks for all
  using (true)
  with check (true);

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