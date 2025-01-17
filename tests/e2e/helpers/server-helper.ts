import { setTimeout } from "node:timers/promises";
import { fetch } from "undici";

interface WaitForServerOptions {
  url?: string;
  timeout?: number;
  interval?: number;
  message?: string;
}

/**
 * 開発サーバーの起動を待機する
 * @param options 待機オプション
 */
export async function waitForServer({
  url = "http://localhost:3100",
  timeout = 30000,
  interval = 1000,
  message = "Waiting for development server to start...",
}: WaitForServerOptions = {}) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch {
      process.stdout.write(`\r${message}`);
      await setTimeout(interval);
    }
  }

  throw new Error(`Server did not respond within ${timeout}ms`);
}

/**
 * シャーディングのための設定を生成する
 * @param totalShards シャードの総数
 * @param currentShard 現在のシャード番号
 */
export function getShardConfig(totalShards: number, currentShard: number) {
  return {
    totalShards,
    currentShard,
    getTestsForShard: (tests: string[]) => {
      return tests.filter((_, index) => index % totalShards === currentShard);
    },
  };
}
