# Next.js PWA Starter

最小限の設定でPWA対応したNext.jsスターターテンプレート

## 技術スタック

- Next.js 15.1.4 (App Router)
- TypeScript
- Tailwind CSS
- PWA対応 (App Router Native PWA Support)
- Biome (Linter & Formatter)
- Bun (Package Manager)
- Geist Font
- shadcn/ui (UIコンポーネント)
- Playwright (E2Eテスト)

## 機能

- ⚡️ App Router
- 📱 PWA対応
- 🎨 Tailwind CSS
- 🌙 ダークモード
- 🔍 型安全
- ✨ Biomeによるコード品質管理
- 🚀 Bunによる高速な開発体験
- 🎯 shadcn/uiによる美しいUIコンポーネント
- 🧪 PlaywrightによるE2Eテスト

## 始め方

```bash
# リポジトリのクローン
git clone [your-repo-url]
cd next-pwa-starter

# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev
```

## 利用可能なコマンド

```bash
# 開発サーバーの起動
bun run dev

# プロダクションビルド
bun run build

# プロダクションサーバーの起動
bun run start

# コードの検証
bun run lint

# コードのフォーマット
bun run format

# PWAアイコンの生成
bun run icons

# E2Eテストの実行
bun run test

# E2Eテストをブラウザで実行
bun run test:ui
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

## ライセンス

MIT
