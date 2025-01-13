# Next.js PWA Starter

## タスク管理

プロジェクトのタスクは`.task`ファイルで管理されています。以下の主要なカテゴリがあります：

### 優先度

1. セットアップ (Priority: 1)
   - Supabaseの初期セットアップ
2. 開発 (Priority: 2)
   - ローカル環境管理
   - 型定義管理
3. データベース (Priority: 3)
   - マイグレーション
   - シードデータ
4. デプロイ (Priority: 4)
   - ステージング
   - 本番環境
5. メンテナンス (Priority: 5)
   - ログ管理
   - バックアップ
   - CI/CD

### 使用例

```bash
# ローカル環境のセットアップ
bun run supabase:setup

# 開発環境の起動
bun run supabase:start

# マイグレーションの作成
bun run supabase:migration:new add_users_table

# 型定義の生成
bun run supabase:types
```

詳細なタスクの定義と手順については`.task`ファイルを参照してください。

[Previous README content...]
