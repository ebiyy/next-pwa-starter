#!/usr/bin/env bun

import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const SNAPSHOT_DIRS = {
  unit: "tests/unit/__snapshots__",
  integration: "tests/integration/__snapshots__",
  e2e: "tests/e2e/__snapshots__",
};

// スナップショットディレクトリの作成
const createSnapshotDirs = () => {
  for (const dir of Object.values(SNAPSHOT_DIRS)) {
    const fullPath = resolve(process.cwd(), dir);
    if (!existsSync(fullPath)) {
      console.log(`Creating directory: ${dir}`);
      mkdirSync(fullPath, { recursive: true });
    }
  }
};

// ユニットテストとインテグレーションテストのスナップショット更新
const updateBunSnapshots = async () => {
  console.log("🔄 Updating Bun test snapshots...");
  return new Promise<void>((resolve) => {
    const bunTest = spawn(
      "bun",
      ["test", "tests/unit", "tests/integration", "--update-snapshots"],
      {
        stdio: "inherit",
        env: { ...process.env, UPDATE_SNAPSHOTS: "true" },
      }
    );

    bunTest.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        // エラーがあってもプロセスを継続
        console.warn(`⚠️ Warning: Bun test exited with code ${code}`);
        resolve();
      }
    });
  });
};

// E2Eテストのスナップショット更新
const updateE2ESnapshots = async () => {
  console.log("🔄 Updating E2E test snapshots...");
  return new Promise<void>((resolve) => {
    const playwrightTest = spawn("bun", ["run", "test:e2e:update"], {
      stdio: "inherit",
      env: { ...process.env, UPDATE_SNAPSHOTS: "true" },
    });

    playwrightTest.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        // エラーがあってもプロセスを継続
        console.warn(`⚠️ Warning: Playwright test exited with code ${code}`);
        resolve();
      }
    });
  });
};

// メイン処理
const main = async () => {
  try {
    createSnapshotDirs();

    // 並列実行を避けるため、順次実行
    await updateBunSnapshots();
    await updateE2ESnapshots();

    console.log("✅ Snapshot update process completed!");
  } catch (error) {
    console.error("❌ Error during snapshot update:", error);
    process.exit(1);
  }
};

main();
