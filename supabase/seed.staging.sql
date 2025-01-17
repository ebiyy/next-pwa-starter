-- 開発環境と同じスキーマを使用
\i seed.development.sql

-- ステージング環境用の追加データ
INSERT INTO tech_stacks (name, category, description, doc_url, created_at) VALUES
('Turbopack', 'tooling', 'Rust-powered successor to Webpack', 'https://turbo.build/pack', '2025-01-18T00:00:00Z'),
('Tailwind CSS', 'frontend', 'A utility-first CSS framework', 'https://tailwindcss.com/docs', '2025-01-18T00:00:00Z'),
('Zod', 'tooling', 'TypeScript-first schema validation', 'https://zod.dev', '2025-01-18T00:00:00Z');

INSERT INTO features (title, description, icon_name, doc_url, created_at) VALUES
('Performance Optimization', 'Turbopackによる高速なビルドと最適化', 'zap', 'https://turbo.build/pack/docs/optimizing', '2025-01-18T00:00:00Z'),
('API Validation', 'Zodによる堅牢なAPIバリデーション', 'check-circle', 'https://zod.dev/?id=introduction', '2025-01-18T00:00:00Z'),
('Responsive Design', 'Tailwind CSSによるモダンなレスポンシブデザイン', 'layout', 'https://tailwindcss.com/docs/responsive-design', '2025-01-18T00:00:00Z');

INSERT INTO changelogs (version, description, release_date, is_major) VALUES
('2.1.0', 'Turbopackの導入とビルドパフォーマンスの改善', '2025-01-20T00:00:00Z', false),
('2.2.0', 'Zodを使用したAPIバリデーションの強化', '2025-01-22T00:00:00Z', false),
('2.3.0', 'Tailwind CSSによるUIの改善とレスポンシブ対応', '2025-01-25T00:00:00Z', false);

-- シーケンスの更新
SELECT setval('tech_stacks_id_seq', (SELECT MAX(id) FROM tech_stacks));
SELECT setval('features_id_seq', (SELECT MAX(id) FROM features));
SELECT setval('changelogs_id_seq', (SELECT MAX(id) FROM changelogs));