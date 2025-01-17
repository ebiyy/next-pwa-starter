-- Features table to showcase project capabilities
create table features (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  icon_name text not null, -- lucide-reactのアイコン名
  doc_url text not null,
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
  category text not null check (category in ('frontend', 'backend', 'testing', 'tooling')),
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