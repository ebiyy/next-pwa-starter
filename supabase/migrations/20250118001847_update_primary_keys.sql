-- Revert previous migration
DROP TABLE IF EXISTS features CASCADE;
DROP TABLE IF EXISTS changelogs CASCADE;
DROP TABLE IF EXISTS tech_stacks CASCADE;

-- Features table with SERIAL primary key
CREATE TABLE features (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  doc_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Changelog table with SERIAL primary key
CREATE TABLE changelogs (
  id SERIAL PRIMARY KEY,
  version TEXT NOT NULL,
  description TEXT NOT NULL,
  release_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_major BOOLEAN DEFAULT FALSE NOT NULL
);

-- Tech stack table with SERIAL primary key
CREATE TABLE tech_stacks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'testing', 'tooling')),
  description TEXT NOT NULL,
  doc_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_stacks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public access to features"
  ON features FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to changelogs"
  ON changelogs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to tech_stacks"
  ON tech_stacks FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX features_created_at_idx ON features (created_at DESC);
CREATE INDEX changelogs_release_date_idx ON changelogs (release_date DESC);
CREATE INDEX tech_stacks_created_at_idx ON tech_stacks (created_at DESC);
CREATE INDEX tech_stacks_category_idx ON tech_stacks (category);

-- Comments for better documentation
COMMENT ON TABLE features IS 'プロジェクトの機能を管理するテーブル';
COMMENT ON TABLE changelogs IS '変更履歴を管理するテーブル';
COMMENT ON TABLE tech_stacks IS '使用している技術スタックを管理するテーブル';

-- Column comments
COMMENT ON COLUMN features.icon_name IS 'lucide-reactのアイコン名';
COMMENT ON COLUMN changelogs.is_major IS 'メジャーバージョンアップかどうかを示すフラグ';
COMMENT ON COLUMN tech_stacks.category IS '技術スタックのカテゴリ（frontend, backend, testing, tooling）';