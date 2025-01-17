import { defineConfig, devices } from "@playwright/test";

// テストポートの設定
const PORT = process.env.TEST_PORT
  ? Number.parseInt(process.env.TEST_PORT, 10)
  : 3000;
const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || `http://localhost:${PORT}`;

// CIでの並列実行時のポート計算
const getTestPort = () => {
  if (process.env.CI && process.env.SHARD_ID) {
    // シャード番号に基づいてポートをオフセット
    const shardId = Number.parseInt(process.env.SHARD_ID, 10);
    return PORT + shardId;
  }
  return PORT;
};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "tests/reports/playwright" }],
    ["junit", { outputFile: "tests/reports/junit/results.xml" }],
    ["list"], // コンソールに詳細なログを出力
  ],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // タイムアウトの設定
    actionTimeout: 30000,
    navigationTimeout: 30000,
    // Service Worker用の設定
    serviceWorkers: "allow",
    // テスト実行時の安定性向上
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
  // スナップショットテストの設定
  snapshotPathTemplate:
    "{testDir}/__snapshots__/{projectName}/{testFilePath}/{arg}{ext}",
  expect: {
    toHaveScreenshot: {
      // スナップショットの最大差異許容値
      maxDiffPixelRatio: 0.05,
      // アニメーションを無効化
      animations: "disabled",
    },
  },
  // Webサーバーの設定
  webServer: {
    command: `PORT=${getTestPort()} bun run dev`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI && process.env.REUSE_SERVER === "true",
    stdout: "pipe",
    stderr: "pipe",
    timeout: 60000, // 1分
  },
});
