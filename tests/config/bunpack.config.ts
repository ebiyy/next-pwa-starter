import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

interface BunpackConfig {
  // テストファイルのパターン
  testMatch: string[];
  // テストタイプごとの設定
  testTypes: {
    unit: {
      pattern: string[];
      setupFiles: string[];
    };
    integration: {
      pattern: string[];
      setupFiles: string[];
    };
    e2e: {
      pattern: string[];
      setupFiles: string[];
    };
  };
  // 環境変数の設定
  env: {
    // テスト環境変数ファイルのパス
    files: string[];
    // 追加の環境変数
    variables: Record<string, string>;
  };
  // テストのタイムアウト設定
  timeout: number;
  // テストの並列実行設定
  workers: number | "auto";
}

const config: BunpackConfig = {
  testMatch: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
  testTypes: {
    unit: {
      pattern: ["tests/unit/**/*.{test,spec}.{js,jsx,ts,tsx}"],
      setupFiles: ["tests/config/bun-test.ts"],
    },
    integration: {
      pattern: ["tests/integration/**/*.{test,spec}.{js,jsx,ts,tsx}"],
      setupFiles: ["tests/config/bun-test.ts"],
    },
    e2e: {
      pattern: ["tests/e2e/**/*.{test,spec}.{js,jsx,ts,tsx}"],
      setupFiles: ["tests/config/playwright.ts"],
    },
  },
  env: {
    files: ["tests/config/test/.env.test"],
    variables: {
      NODE_ENV: "test",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
  timeout: 10000,
  workers: "auto",
};

// 環境変数ファイルの読み込み
function loadEnvFiles() {
  for (const file of config.env.files) {
    const filePath = resolve(process.cwd(), file);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, "utf-8");
      const env = Object.fromEntries(
        content
          .split("\n")
          .filter((line) => line && !line.startsWith("#"))
          .map((line) => line.split("=").map((part) => part.trim()))
      );
      Object.assign(process.env, env);
    }
  }
}

// 設定の適用
export function applyConfig() {
  loadEnvFiles();
  Object.assign(process.env, config.env.variables);
}

export default config;
