# Next.js PWA Starter

モダンなウェブアプリケーション開発のためのミニマルなスターターキット。PWA対応、型安全、高パフォーマンスな開発環境を提供します。

## 特徴

- 📱 **PWA対応** - オフライン対応とモバイルファーストな設計
- ⚡ **Next.js 15 + React 19** - App RouterとReact Server Components
- 🎨 **Shadcn/UI + Tailwind CSS** - モダンなUIコンポーネント
- 🔒 **Supabase** - 認証とデータベース
- 🚀 **Turbopack** - 高速な開発環境
- 📝 **Biome** - リントとフォーマット
- 🧪 **Playwright** - E2Eテスト
- 🔄 **Bun** - 高速なパッケージマネージャーとランタイム
- 🌐 **Hono.js** - 軽量なAPIフレームワーク

## アーキテクチャ

### フロントエンド
- React Server Components (RSC)を活用
- Suspenseによるストリーミング
- 各セクションの並列データロード
- shadcn/uiコンポーネント

### バックエンド
- Hono.jsによる高速なAPIルーティング
- Supabaseによるデータ永続化
- インメモリキャッシュによるパフォーマンス最適化

## 必要要件

- [Bun](https://bun.sh) >= 1.0.0
- [Node.js](https://nodejs.org) >= 18.17.0
- [Docker](https://www.docker.com) (Supabase用)

## セットアップ

1. プロジェクトの作成

```bash
git clone https://github.com/ebiyy/next-pwa-starter.git my-app
cd my-app
```

2. Supabaseプロジェクトの作成
   - [Supabase Dashboard](https://supabase.com/dashboard)にアクセス
   - "New Project"をクリック
   - プロジェクト名を設定
   - リージョン: Tokyo (asia-northeast1)
   - データベースパスワードを設定

3. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local`の各値を設定:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. 依存関係のインストール

```bash
bun install
```

5. Supabaseの起動

```bash
bun run db:start
```

6. 開発サーバーの起動

```bash
bun run dev
```

## 利用可能なスクリプト

```bash
# 開発
bun run dev         # 開発サーバーの起動
bun run build       # プロダクションビルド
bun run start       # プロダクションサーバーの起動

# コード品質
bun run lint        # Biomeによるリント
bun run format      # Biomeによるフォーマット

# テスト
bun run test        # Playwrightテストの実行
bun run test:ui     # PlaywrightのUIモードでテスト実行

# Supabase
bun run db:start    # ローカル環境の起動
bun run db:stop     # ローカル環境の停止
bun run db:reset    # データベースのリセット
bun run db:types    # 型定義の生成
bun run db:studio   # Studio UIを開く

# その他
bun run icons       # PWAアイコンの生成
```

## PWAの実装

このテンプレートはNext.js App RouterのネイティブPWAサポートを使用しています：

### 機能
- オフライン対応
- インストール可能
- アプリケーションアイコン
- カスタムスプラッシュスクリーン
- プッシュ通知対応（オプション）

### 実装ファイル
- `app/manifest.ts`: Web Manifestの設定
- `public/sw.js`: Service Workerの実装（キャッシュ戦略、オフライン対応）

## E2Eテスト

PlaywrightによるE2Eテストを実装しており、以下の項目を自動的にテストします：

### テスト項目
- PWAの基本機能（マニフェスト、Service Worker）
- レスポンシブデザイン
- ダークモード切り替え
- コンポーネントの動作

### テストの注意点
- アニメーションの完了を待つ際は、具体的なUI要素の表示を確認
- モバイルデバイスではホバーイベントが機能しないため、代替の操作方法を実装

## プロジェクト構成

```
.
├── public/          # 静的ファイル
├── src/
│   ├── app/        # Next.js App Router
│   ├── components/ # UIコンポーネント
│   ├── lib/        # ユーティリティ関数
│   └── types/      # 型定義
├── supabase/       # Supabase設定
└── tests/          # E2Eテスト
```

## 主要な依存関係

- Next.js 15.1.4
- React 19.0.0
- Shadcn/UI
- Tailwind CSS 3.4.1
- Supabase JS 2.47.12
- Hono 4.6.16
- Biome 1.9.4
- Playwright 1.49.1

## セキュリティに関する注意

- 環境変数（`.env.local`）は決してGitにコミットしないでください
- プロジェクトの公開リポジトリでは、`.env.example`のみをコミットしてください
- Supabaseのプロジェクト設定やAPIキーは、信頼できる開発者とのみ共有してください

## ライセンス

MIT © [ebiyy](https://github.com/ebiyy)
