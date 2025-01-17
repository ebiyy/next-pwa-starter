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

### 開発環境
- Next.js開発サーバー（next dev）: 3100
- Next.js本番サーバー（next start）: 3200
- Supabase Local Development: 54321
- Supabase Studio: 54323

### テスト環境
- Playwright Test Server: 3101
- API Test Server: 3101
- E2E Test Server: 3102
- Integration Test Server: 3103
- Lighthouse Test Server: 3200（本番サーバーと共有）

### 注意事項
- 開発サーバーは3100を使用
- 本番サーバーとLighthouseテストは3200を共有
- テストサーバーは3101から順番に使用
- Supabaseは標準ポート（54321）を使用

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

#### ユニットテスト (Bun Test)
- 個々のコンポーネントやユーティリティ関数のテスト
- 高速な実行とホットリロード
- カバレッジレポートの自動生成
- キャッシュ戦略による実行速度の最適化

#### 統合テスト (Bun Test)
- APIエンドポイントのテスト
- データベース操作のテスト
- コンポーネント間の連携テスト
- テスト環境の統一化による安定性向上

#### APIテスト (Bun Test + Hono)
- エンドポイントの動作検証
- キャッシュ機能のテスト
- レスポンスの型安全性
- モックデータを使用した高速なテスト実行

#### E2Eテスト (Playwright)
- ユーザーフローの検証
- PWAの基本機能（マニフェスト、Service Worker）
- レスポンシブデザイン
- ダークモード切り替え
- コンポーネントの動作
- ビジュアルリグレッションテスト（VRT）

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

#### キャッシュの活用
```typescript
// テストデータのキャッシュ
const data = await withCache("api-data", { id: 1 }, async () => {
  return await fetchTestData();
});
```

#### 開発サーバー待機
```typescript
// サーバー起動待ち
await waitForServer({
  message: "開発サーバーの起動を待機中...",
  timeout: 30000,
});
```

### テストの設定
- `tests/config/bun-test.ts`: Bunテストの基本設定
  - キャッシュ戦略の実装
  - テスト環境の統一化
  - スナップショット管理
  - 並列実行の設定
- `tests/config/playwright.ts`: Playwrightの設定
- `tests/config/bunpack.config.ts`: テストランナーの設定
- `tests/config/test/.env.test`: テスト環境変数

### テストの最適化
- 並列実行によるテスト実行時間の短縮
- シャーディングによる効率的なテスト分散
- キャッシュ戦略による重複実行の防止
- 開発サーバー起動待ちの最適化

### スナップショットの管理
- `bun run test:update-snapshots`: すべてのスナップショットを一括更新
  - ユニットテスト、統合テスト、E2Eテストのスナップショットを自動更新
  - 差分許容値の自動調整
  - 環境依存の差異を考慮

### CI/CD
GitHub Actionsによる自動テスト：
- プッシュ時の自動テスト実行
- PRのテスト状態チェック
- テストカバレッジレポートの自動生成
- テスト結果のアーティファクト保存
- 並列実行による高速なテスト実行

### テストの注意点
- test-idとロールベースのセレクターを適切に使い分け
- アニメーションの完了を待つ際は、具体的なUI要素の表示を確認
- モバイルデバイスではホバーイベントが機能しないため、代替の操作方法を実装
- テストデータは`tests/fixtures`ディレクトリに配置
- 環境変数は`.env.test`で管理
- VRTテストを更新する際は、UIの変更が意図的なものか確認
- APIテストではモックデータを活用し、テスト実行を高速化

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

開発上の問題は、GitHub Issueとして管理します：

- `.github/ISSUE_TEMPLATE/task.yml`: 問題管理用のテンプレート
  - 実装フェーズごとのテストケース
  - コミットメッセージの規約
  - ロールバック戦略
  - メンテナンス方針

### 2. Clineタスク

Cline（AI）向けのタスクは2種類の形式で管理します：

#### 一時タスク（*.temp.task）
- 現在進行中のタスク
- プロジェクトルートに配置
- 完了後は履歴として保管

#### 定例タスク（*.batch.task）
- `tasks/review-clinerules.batch.task`: プロジェクトルールの定期レビュー
  - スプリントごとの短期評価
  - 四半期ごとの長期評価
  - 実践から得られた知見の反映

### タスク管理の特徴

1. テストファーストアプローチ
- 各実装フェーズでのテストケース定義
- テストコードによる検証
- 自動化されたテスト実行

2. 変更管理
- gitによるバージョン管理
- コミットメッセージの規約
- ロールバック手順の明確化

3. 保守性
- 構造化されたドキュメント
- テストによる仕様の保証
- レビュープロセスの定期実行

## プロジェクトガバナンス

このプロジェクトは、`.clinerules` を通じて開発プラクティスとアーキテクチャの方針を管理しています。

### .clinerules

`.clinerules` は以下の要素を定義します：

- **使用技術**: プロジェクトで採用する技術スタック
- **設計原則**: Minimum Configurationを基本とした設計方針
- **開発ルール**: ドキュメント、コーディング、テストに関する規約
- **アーキテクチャ**: コンポーネント設計、API実装、型安全性の方針
- **開発フロー**: コンポーネント開発、テスト戦略、PWA実装の手順
- **品質基準**: パフォーマンス指標とセキュリティ要件

### レビュープロセス

`.clinerules` は定期的なレビューを通じて進化します：

#### スプリントレビュー（短期）
- 開発中に発見された課題の収集
- 即座に対応可能な改善の実施
- チームフィードバックの反映

#### 四半期レビュー（長期）
- 技術スタックの評価
- アーキテクチャの見直し
- 開発プロセスの最適化

レビュープロセスは `tasks/review-clinerules.task` で定義され、以下の観点で評価されます：

- 技術選択の意図と必要性
- アーキテクチャの発展と実効性
- 開発フローの効率性
- ルールの実践的な価値

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
