import { describe, expect, test } from "bun:test";
import { apiClient } from "@/lib/api-client";
import { cache } from "@/lib/cache";

describe("キャッシュ戦略のパフォーマンス検証", () => {
  test("キャッシュの有無によるレスポンスタイムの比較", async () => {
    // キャッシュクリア
    await cache.clear();

    // キャッシュなしの場合の測定
    const startWithoutCache = performance.now();
    const resultWithoutCache = await apiClient.getTechStacks();
    const timeWithoutCache = performance.now() - startWithoutCache;

    // キャッシュクリア
    await cache.clear();

    // 1回目のリクエスト（キャッシュ作成）
    await apiClient.getTechStacks();

    // キャッシュありの場合の測定
    const startWithCache = performance.now();
    const resultWithCache = await apiClient.getTechStacks();
    const timeWithCache = performance.now() - startWithCache;

    console.log(`キャッシュなし: ${timeWithoutCache}ms`);
    console.log(`キャッシュあり: ${timeWithCache}ms`);

    expect(timeWithCache).toBeLessThan(timeWithoutCache);
    expect(resultWithCache).toEqual(resultWithoutCache);
  });

  test("並列リクエスト時のキャッシュ効果", async () => {
    // キャッシュクリア
    await cache.clear();

    // 並列リクエストの実行（キャッシュなし）
    const startParallelWithoutCache = performance.now();
    await Promise.all([
      apiClient.getTechStacks(),
      apiClient.getFeatures(),
      apiClient.getChangelogs(),
    ]);
    const timeParallelWithoutCache =
      performance.now() - startParallelWithoutCache;

    // キャッシュクリア
    await cache.clear();

    // キャッシュの作成
    await Promise.all([
      apiClient.getTechStacks(),
      apiClient.getFeatures(),
      apiClient.getChangelogs(),
    ]);

    // 並列リクエストの実行（キャッシュあり）
    const startParallelWithCache = performance.now();
    await Promise.all([
      apiClient.getTechStacks(),
      apiClient.getFeatures(),
      apiClient.getChangelogs(),
    ]);
    const timeParallelWithCache = performance.now() - startParallelWithCache;

    console.log(`並列実行（キャッシュなし）: ${timeParallelWithoutCache}ms`);
    console.log(`並列実行（キャッシュあり）: ${timeParallelWithCache}ms`);

    expect(timeParallelWithCache).toBeLessThan(timeParallelWithoutCache);
  });
});
