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
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "tests/reports/playwright" }],
    ["junit", { outputFile: "tests/reports/junit/results.xml" }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // アニメーションの無効化（スナップショットテスト用）
    actionTimeout: 3000,
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
