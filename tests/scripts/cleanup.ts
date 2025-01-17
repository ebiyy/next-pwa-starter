#!/usr/bin/env bun
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

// クリーンアップ対象のディレクトリとファイル
const targets = [
  "tests/reports/playwright",
  "tests/reports/junit",
  ".env.test",
  ".next-test.config.ts",
  "test-results",
  "playwright-report",
];

async function cleanup() {
  console.log("🧹 テスト環境のクリーンアップを開始します...");

  try {
    for (const target of targets) {
      const path = resolve(process.cwd(), target);
      if (existsSync(path)) {
        console.log(`🗑️  ${target} を削除しています...`);
        rmSync(path, { recursive: true, force: true });
      }
    }

    console.log("✨ クリーンアップが完了しました！");
  } catch (error) {
    console.error("❌ クリーンアップ中にエラーが発生しました:", error);
    process.exit(1);
  }
}

// スクリプトの実行
cleanup();
