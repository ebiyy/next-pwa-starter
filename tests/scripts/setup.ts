#!/usr/bin/env bun
import { spawn } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// 必要なディレクトリの作成
const directories = [
  "tests/reports/playwright",
  "tests/reports/junit",
  ".bun-cache/test",
];

for (const dir of directories) {
  const path = resolve(process.cwd(), dir);
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

// テスト環境の準備
async function setup() {
  console.log("🚀 テスト環境のセットアップを開始します...");

  try {
    // Playwrightのブラウザをインストール
    console.log("📦 Playwrightのブラウザをインストールしています...");
    await new Promise<void>((resolve, reject) => {
      const install = spawn(
        "bunx",
        ["playwright", "install", "--with-deps", "chromium"],
        {
          stdio: "inherit",
        }
      );

      install.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      install.on("error", reject);
    });

    // テスト用の環境変数ファイルをコピー
    if (!existsSync(".env.test")) {
      console.log("📝 テスト用の環境変数ファイルを作成しています...");
      copyFileSync(
        resolve(process.cwd(), "tests/config/test/.env.test"),
        resolve(process.cwd(), ".env.test")
      );
    }

    // Next.jsの設定ファイルをコピー
    const nextConfigPath = resolve(
      process.cwd(),
      "tests/config/test/next.config.ts"
    );
    if (existsSync(nextConfigPath)) {
      console.log("⚙️ テスト用のNext.js設定ファイルを準備しています...");
      copyFileSync(
        nextConfigPath,
        resolve(process.cwd(), ".next-test.config.ts")
      );
    }

    console.log("✅ セットアップが完了しました！");
  } catch (error) {
    console.error("❌ セットアップ中にエラーが発生しました:", error);
    process.exit(1);
  }
}

// スクリプトの実行
setup();
