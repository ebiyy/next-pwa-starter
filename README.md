# Next.js PWA Starter

モダンなウェブアプリケーション開発のためのミニマルなスターターキット。PWA対応、型安全、高パフォーマンスな開発環境を提供します。

## 特徴

- 📱 **PWA対応** - オフライン対応とモバイルファーストな設計
- ⚡ **Next.js 15 + React 19** - App RouterとReact Server Components
- 🎨 **Shadcn/UI + Tailwind CSS** - モダンなUIコンポーネント
- 🔒 **Supabase** - 認証とデータベース
- 🚀 **Turbopack** - 高速な開発環境
- 📝 **Biome** - リントとフォーマット
- 🧪 **Bun Test + Playwright** - ユニット、統合、E2Eテスト
- 🔄 **Bun** - 高速なパッケージマネージャーとランタイム
- 🌐 **Hono.js** - 軽量なAPIフレームワーク

## プロジェクトの方針

### 品質管理

- **CI/CD**
  - GitHub Actionsによる自動化
  - PRごとのビルド・テスト検証
  - Lighthouseによるパフォーマンス検証（スコア90以上）
  - Vercelへの自動デプロイ

- **依存関係管理**
  - Renovateによる自動更新
  - セキュリティアップデートの自動化
  - 依存パッケージの定期レビュー

- **コードレビュー**
  - PRテンプレートによる変更内容の明確化
  - 自動レビュー割り当て
  - パフォーマンスとアクセシビリティの検証

### コミュニティ貢献

- **Issue管理**
  - 構造化されたバグ報告テンプレート
  - 機能リクエストのガイドライン
  - 日本語による明確なコミュニケーション

- **ドキュメント**
  - 実装仕様の明確化
  - コントリビューションガイド
  - セキュリティポリシー

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

## ポート設定

- Next.js開発サーバー: 3100
- Next.js本番サーバー: 3200
- Supabase Local Development: 54321
- Supabase Studio: 54323
- テストサーバー: 3101-3103（用途別に順次使用）

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
```bash
# 開発環境
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=local-anon-key

# ステージング環境
# NEXT_PUBLIC_SUPABASE_URL=https://subkcevxjivxiiksnytj.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=staging-anon-key

# 本番環境
# NEXT_PUBLIC_SUPABASE_URL=https://xiwnydehiplcjgrcjjko.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=production-anon-key
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
bun run test        # すべてのテストを実行
bun run test:watch  # ウォッチモードでテストを実行
bun run test:ui     # UIモードでテストを実行
bun run test:unit   # ユニットテストの実行
bun run test:integration # 統合テストの実行
bun run test:coverage    # カバレッジレポートの生成

# E2Eテスト
bun run test:e2e    # E2Eテストの実行
bun run test:e2e:ui # UIモードでE2Eテストを実行

# テスト環境
bun run test:setup   # テスト環境のセットアップ
bun run test:cleanup # テスト環境のクリーンアップ

# Supabase
bun run db:start    # ローカル環境の起動
bun run db:stop     # ローカル環境の停止
bun run db:reset    # データベースのリセット
bun run db:types    # 型定義の生成
bun run db:studio   # Studio UIを開く
bun run db:seed:dev # 開発環境のシードデータ投入
bun run db:status   # Supabaseの状態確認
bun run db:logs     # Supabaseのログ確認

# 環境設定
bun run env:dev     # 開発環境の設定
bun run env:staging # ステージング環境の設定
bun run env:prod    # 本番環境の設定

# デプロイ
bun run deploy:staging # ステージング環境へのデプロイ
bun run deploy:prod    # 本番環境へのデプロイ

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

## テスト

このプロジェクトは包括的なテスト戦略を採用しています：

### テストの種類

- **ユニットテスト**: コンポーネントやユーティリティ関数の個別テスト
- **統合テスト**: APIエンドポイントやコンポーネント間の連携テスト
- **APIテスト**: エンドポイントの動作とキャッシュ機能の検証
- **E2Eテスト**: ユーザーフロー、PWA機能、レスポンシブデザインの検証

### テストユーティリティ

#### セレクターの管理
```typescript
// テストID
<button {...testId("submit-button")}>送信</button>
const submitButton = page.locator(getByTestId("submit-button"));

// ロールベース
<button role="submit">送信</button>
const submitButton = page.locator(byRole("submit"));
```

#### スナップショットの設定
```typescript
// 差分許容値の調整
const snapshot = createSnapshot(element, {
  threshold: 0.2,           // 許容する差分の割合
  allowSizeDifference: true // サイズの差異を許容
});
```

### テストの設定
- `tests/config/bun-test.ts`: Bunテストの基本設定
- `tests/config/playwright.ts`: Playwrightの設定
- `tests/config/bunpack.config.ts`: テストランナーの設定

### CI/CD
- GitHub Actionsによる自動テスト実行
- PRのテスト状態チェック
- テストカバレッジレポートの自動生成
- 並列実行による高速化

## プロジェクト構成

```
.
├── .github/         # GitHub関連の設定
│   └── ISSUE_TEMPLATE/ # Issueテンプレート
├── issues/         # ローカルIssue管理
├── public/         # 静的ファイル
├── src/
│   ├── app/        # Next.js App Router
│   ├── components/ # UIコンポーネント
│   ├── lib/        # ユーティリティ関数
│   └── types/      # 型定義
├── supabase/       # Supabase設定
├── tasks/          # タスク定義
│   └── *.batch.task  # 定例タスク（review-clinerules等）
├── tests/          # テストファイル
│   ├── api/        # APIテスト
│   ├── e2e/        # E2Eテスト
│   ├── integration/# 統合テスト
│   ├── unit/       # ユニットテスト
│   └── config/     # テスト設定
└── .clinerules     # プロジェクトのルールと方針
```

## タスク管理

このプロジェクトでは、以下の2つの形式でタスクを管理します：

### 1. GitHub Issue
プロジェクトの課題管理には以下のテンプレートを使用します：

#### タスク管理（task.yml）
- 実装フェーズの詳細な計画
- テストケースの定義
- コミットメッセージの規約
- ロールバック戦略
- メンテナンス方針

#### コンポーネント開発（component.yml）
- shadcn/uiに準拠したUI設計
- アクセシビリティ要件
- テスト計画
- 実装仕様

#### 機能要望（feature_request.yml）
- 課題と解決策の提案
- 技術的な実装案
- パフォーマンス要件
- セキュリティ考慮事項

#### パフォーマンス改善（performance.yml）
- Lighthouseスコア目標（90以上）
- Web Vitals指標
- 最適化計画
- 検証方法

#### セキュリティ対策（security.yml）
- セキュリティリスクの評価
- 対策の実装計画
- テストと検証手順
- コンプライアンス要件

#### バグ報告（bug_report.yml）
- 再現手順
- 環境情報
- パフォーマンスデータ
- 修正計画

### 2. Clineタスク
- **一時タスク**: 現在進行中のタスク（*.temp.task）
- **定例タスク**: プロジェクトルールの定期レビュー（*.batch.task）

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
