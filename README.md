# next-pwa-starter

最小限の設定でPWA対応したNext.jsスターターテンプレート

## Status

[![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen?logo=pwa)](https://github.com/ebiyy/next-pwa-starter/actions/workflows/lighthouse.yml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://react.dev/)
[![Bun](https://img.shields.io/badge/Bun-1.1.43-black?logo=bun)](https://bun.sh/)
[![Supabase](https://img.shields.io/badge/Supabase-2.47.12-3ECF8E?logo=supabase)](https://supabase.com/)

## Lighthouse Score

![Performance](https://img.shields.io/badge/performance-100-brightgreen)
![Accessibility](https://img.shields.io/badge/accessibility-100-brightgreen)
![Best Practices](https://img.shields.io/badge/Best%20Practices-100-brightgreen)
![SEO](https://img.shields.io/badge/SEO-100-brightgreen)

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

## Features

- ⚡️ Next.js 14 with App Router
- 🔥 Type checking [TypeScript](https://www.typescriptlang.org)
- 💎 Integrate with [Tailwind CSS](https://tailwindcss.com)
- ✨ [shadcn/ui](https://ui.shadcn.com/) - Beautiful and customizable components
- 📱 PWA Support with [next-pwa](https://github.com/shadowwalker/next-pwa)
- 🎨 Theme switching with [next-themes](https://github.com/pacocoursey/next-themes)
- 📊 VSCode configuration: Debug, Settings, Tasks and extension for PostCSS, ESLint, Prettier, TypeScript
- 🗂 Path Mapping with `@` prefix
- 💯 Maximize lighthouse score

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

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## コンポーネントの追加

このプロジェクトはshadcn/uiを使用しています。新しいコンポーネントを追加するには以下のコマンドを使用します：

```bash
# コンポーネントの追加
bunx shadcn add [component-name]

# 例: buttonコンポーネントの追加
bunx shadcn add button
```

利用可能なコンポーネントは[shadcn/uiのドキュメント](https://ui.shadcn.com/docs/components)で確認できます。

## PWAについて

このテンプレートはNext.js App RouterのネイティブPWAサポートを使用しています：

- オフライン対応
- インストール可能
- アプリケーションアイコン
- カスタムスプラッシュスクリーン
- プッシュ通知対応（オプション）

### PWAの実装について

このテンプレートは以下のファイルでPWAを実装しています：

- `app/manifest.ts`: Web Manifestの設定
- `public/sw.js`: Service Workerの実装（キャッシュ戦略、オフライン対応）

### E2Eテスト

PlaywrightによるE2Eテストを実装しており、以下の項目を自動的にテストします：

#### PWAの基本機能
- Webページの表示
- PWAマニフェストの読み込み
- Service Workerの登録と有効化
- モバイル表示の確認

#### UI/UXの検証
- ダークモード切り替え
- レスポンシブデザイン
- タブの切り替え機能

テストを実行するには：

```bash
# テストの実行
bun run test

# UIモードでテストを実行
bun run test:ui
```

#### テストの注意点

- **アニメーションとインタラクティブな要素**
  - 複雑なアニメーションやインタラクティブな要素（HoverCardなど）のテストは不安定になりやすいため、実装の詳細ではなくユーザーの視点でのテストを推奨
  - モバイルデバイスではホバーイベントが機能しないため、代替の操作方法を検討する必要がある

- **テストの安定性**
  - アニメーションの完了を待つ際は、具体的なUI要素の表示を確認
  - デバイス固有の機能テストは、適切なプロジェクト設定で分離

### 開発モードでの注意点

開発モード（`bun run dev`）では、Service Workerは自動的に更新されます。本番環境では、Service Workerのキャッシュ戦略に従って動作します。

## セキュリティに関する注意

- 環境変数（`.env.local`）は決してGitにコミットしないでください
- プロジェクトの公開リポジトリでは、`.env.example`のみをコミットし、実際の値は含めないようにしてください
- Supabaseのプロジェクト設定やAPIキーは、信頼できる開発者とのみ共有してください

## License

MIT
