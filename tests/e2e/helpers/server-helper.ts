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
  url = "http://localhost:3000",
  timeout = 60000,
  interval = 1000,
  message = "Waiting for development server to start...",
}: WaitForServerOptions = {}) {
  const startTime = Date.now();
  let lastError: Error | null = null;

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        // サーバー起動成功
        process.stdout.write(`\n✓ Development server is ready at ${url}\n`);
        return true;
      }
      // レスポンスはあるがエラー
      lastError = new Error(`Server responded with status ${response.status}`);
    } catch (error) {
      // 接続エラー（サーバーがまだ起動していない）
      lastError = error as Error;
    }

    // 経過時間を表示
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    process.stdout.write(`\r${message} (${elapsed}s)`);
    await setTimeout(interval);
  }

  // タイムアウト時に最後のエラーを含めて詳細を表示
  throw new Error(
    `Server did not respond within ${timeout}ms.\nLast error: ${lastError?.message}`
  );
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
