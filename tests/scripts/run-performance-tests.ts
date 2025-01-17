import { execSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const PERFORMANCE_DIR = join(process.cwd(), "test-results", "performance");

async function runPerformanceTests() {
  try {
    // パフォーマンステスト結果ディレクトリの作成
    await mkdir(PERFORMANCE_DIR, { recursive: true });

    // Lighthouse CIの実行
    console.log("🚀 Lighthouse CIを実行中...");
    const result = execSync("bunx lhci autorun", { encoding: "utf-8" });

    // 結果の保存
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await writeFile(
      join(PERFORMANCE_DIR, `lighthouse-report-${timestamp}.txt`),
      result
    );

    console.log("✅ パフォーマンステストが完了しました");
    console.log("📊 結果:", result);
  } catch (error) {
    console.error("❌ パフォーマンステストの実行に失敗しました:", error);
    process.exit(1);
  }
}

runPerformanceTests().catch(console.error);
