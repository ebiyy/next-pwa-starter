import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function killPort(port: number) {
  try {
    execSync(
      `lsof -i :${port} | grep LISTEN | awk '{print $2}' | xargs kill -9`
    );
    console.log(`🔄 ポート${port}を解放しました`);
  } catch {
    // ポートが使用されていない場合は無視
  }
}

const baseEnv = {
  ...process.env,
  NODE_ENV: "production" as const,
  SUPABASE_URL: "http://127.0.0.1:54321",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
} as const;

const PERFORMANCE_DIR = join(process.cwd(), "test-results", "performance");

async function ensureDirectoryExists(dir: string): Promise<void> {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function runPerformanceTests() {
  try {
    // ポート3000を解放
    await killPort(3000);

    // パフォーマンステスト結果ディレクトリの作成
    await ensureDirectoryExists(PERFORMANCE_DIR);

    console.log("🔍 パフォーマンステストを開始します...\n");

    // キャッシュ戦略のテストを実行
    console.log("🧪 1. キャッシュ戦略のテストを実行中...");
    const cacheTestResult = execSync(
      "bun test tests/performance/cache-strategy.test.ts",
      {
        encoding: "utf-8",
        env: baseEnv,
      }
    );

    // キャッシュテスト結果の保存
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const cacheResultPath = join(
      PERFORMANCE_DIR,
      `cache-strategy-${timestamp}.txt`
    );
    await writeFile(cacheResultPath, cacheTestResult);
    console.log(`💾 キャッシュテスト結果を保存しました: ${cacheResultPath}\n`);

    // サーバーの準備ができるまで少し待機
    console.log("⏳ サーバーの準備を待機中...");
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Lighthouseテストを実行
    console.log("🧪 2. Lighthouseテストを実行中...");
    execSync("bun run test:lighthouse", {
      encoding: "utf-8",
      env: baseEnv,
      stdio: "inherit"
    });

    console.log("\n✅ すべてのパフォーマンステストが完了しました");
    console.log("\n📊 テスト結果の概要:");
    console.log("1. キャッシュ戦略テスト - 完了");
    console.log("2. Lighthouseテスト - 完了");
    console.log("\n📁 詳細な結果は以下のディレクトリで確認できます:");
    console.log(`- キャッシュテスト: ${PERFORMANCE_DIR}`);
    console.log(
      `- Lighthouseレポート: ${join(process.cwd(), "tests", "reports", "lighthouse")}`
    );
  } catch (error) {
    console.error("❌ パフォーマンステストの実行に失敗しました:", error);
    process.exit(1);
  }
}

runPerformanceTests().catch(console.error);
