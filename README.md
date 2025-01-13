# Next PWA Starter with Supabase and Hono.js

## アーキテクチャ

### フロントエンド
- Next.js 15 (App Router)
- React Server Components (RSC)
- Suspense によるストリーミング
- shadcn/ui コンポーネント

### バックエンド
- Hono.js による API ルーティング
- Supabase によるデータ永続化
- インメモリキャッシュ

## セットアップ手順

1. Supabaseプロジェクトの作成
   - [Supabase Dashboard](https://supabase.com/dashboard)にアクセス
   - "New Project"をクリック
   - プロジェクト名: "next-pwa-starter"
   - リージョン: Tokyo (asia-northeast1)
   - データベースパスワード: 安全なパスワードを設定

2. テーブルの作成
   - Supabaseダッシュボードの"SQL Editor"を開く
   - `setup.sql`の内容をコピー&ペースト
   - "Run"をクリック

3. 環境変数の設定
   - `.env.example`をコピーして`.env.local`を作成
   ```bash
   cp .env.example .env.local
   ```
   - `.env.local`の各値を設定:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

4. 依存関係のインストール
   ```bash
   bun install
   ```

5. 開発サーバーの起動
   ```bash
   bun dev
   ```

## 実装の特徴

### サーバーサイドレンダリング
- React Server Components (RSC)を活用
- Suspenseによるストリーミング
- 各セクションの並列データロード

### APIルーティング
- Hono.jsによる高速なAPIルーティング
- インメモリキャッシュによるパフォーマンス最適化
- Supabaseとの通信を集約

### データモデル
- features: プロジェクトの機能紹介
- changelogs: 更新履歴
- tech_stacks: 使用技術スタック

## セキュリティに関する注意

- 環境変数（`.env.local`）は決してGitにコミットしないでください
- プロジェクトの公開リポジトリでは、`.env.example`のみをコミットし、実際の値は含めないようにしてください
- Supabaseのプロジェクト設定やAPIキーは、信頼できる開発者とのみ共有してください
