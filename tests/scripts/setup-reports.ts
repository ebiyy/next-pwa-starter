import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const REPORTS_DIR = join(process.cwd(), "test-results");

async function setupReportsDirectory() {
  try {
    await mkdir(REPORTS_DIR, { recursive: true });
    await mkdir(join(REPORTS_DIR, "junit"), { recursive: true });
    await mkdir(join(REPORTS_DIR, "coverage"), { recursive: true });
    console.log("✅ テストレポートディレクトリを作成しました");
  } catch (error) {
    console.error("❌ テストレポートディレクトリの作成に失敗しました:", error);
    process.exit(1);
  }
}

setupReportsDirectory().catch(console.error);
